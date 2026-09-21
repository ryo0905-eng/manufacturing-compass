"""Frozen four-recipe / three-seed comparison; each invocation is bounded."""
import argparse
import json
import os
import signal
import time

import numpy as np
import onnxruntime as ort
import torch

from data import ROOT, RECIPES
from data_v2 import CACHE, load
from followup_v2 import sha, OUTPUT as FOLLOWUP
from model import TinyUNet, InferenceModel
from processing import ai, metrics
from train_v2 import loss_function, meets

OUTPUT = CACHE / "comparison"
PROTOCOL = ROOT / "docs/ai-visual-inspection-v2-comparison-protocol.md"


def persist(path, record):
    record.update(protocolSha256=sha(PROTOCOL), manifestSha256=sha(CACHE / "manifest.json"))
    path.write_text(json.dumps(record, indent=2)+"\n")


def train(recipe, seed, name):
    if not json.loads((CACHE / "audit.json").read_text())["passed"]:
        raise ValueError("Data audit failed")
    started = time.monotonic()
    torch.set_num_threads(4)
    torch.manual_seed(seed)
    if not torch.backends.mps.is_available():
        raise RuntimeError("MPS required for bounded training")
    model = TinyUNet().to("mps")
    optimizer = torch.optim.Adam(model.parameters(), lr=.001)
    arrays, _ = load("train", recipe)
    x = torch.from_numpy(arrays["images"].copy())[:, None].float()/255
    y = torch.from_numpy(arrays["masks"].copy())[:, None].float()
    history = []
    for epoch in range(10):
        model.train()
        losses = []
        for ids in torch.randperm(len(x)).split(32):
            optimizer.zero_grad(set_to_none=True)
            loss = loss_function(model(x[ids].to("mps")), y[ids].to("mps"))
            if not torch.isfinite(loss):
                raise ValueError("Non-finite loss")
            loss.backward()
            optimizer.step()
            losses.append(loss.item())
        history.append({"epoch": epoch+1, "loss": float(np.mean(losses))})
        print(json.dumps({"name": name, **history[-1], "seconds": time.monotonic()-started}), flush=True)
    model = model.cpu().eval()
    weights, onnx = OUTPUT / f"{name}.pt", OUTPUT / f"{name}.onnx"
    torch.save(model.state_dict(), weights)
    torch.onnx.export(InferenceModel(model), torch.zeros(1, 1, 128, 128), str(onnx),
                      input_names=["pixels"], output_names=["scores"], opset_version=17, dynamo=False)
    persist(OUTPUT / f"{name}-train.json", {"recipe": recipe, "seed": seed, "epochs": 10,
        "updates": 750, "trainingImages": len(x), "learningRate": .001, "batchSize": 32,
        "history": history, "seconds": time.monotonic()-started, "device": "mps",
        "modelSha256": sha(onnx), "weightsSha256": sha(weights), "onnxBytes": onnx.stat().st_size})


def evaluate(recipe, seed, name):
    reused = recipe == "balanced" and seed == 17
    folder, stem = (FOLLOWUP, "baseline") if reused else (OUTPUT, name)
    train_record = json.loads((folder / ("baseline.json" if reused else f"{name}-train.json")).read_text())
    if train_record["manifestSha256"] != sha(CACHE / "manifest.json"):
        raise ValueError("Dataset manifest changed after training")
    if not reused and train_record["protocolSha256"] != sha(PROTOCOL):
        raise ValueError("Protocol changed after training")
    onnx, weights = folder / f"{stem}.onnx", folder / f"{stem}.pt"
    if sha(onnx) != train_record["modelSha256"] or sha(weights) != train_record["weightsSha256"]:
        raise ValueError("Training artifact changed")
    if train_record["updates"] != 750:
        raise ValueError("Unexpected training duration")
    arrays, metadata = load("development")
    if reused:
        previous = json.loads((FOLLOWUP / "development.json").read_text())
        if (previous["modelSha256"] != sha(onnx) or
                previous["manifestSha256"] != train_record["manifestSha256"] or
                previous["threshold"] != .5 or previous["minimumArea"] != 12):
            raise ValueError("Cached baseline evaluation has different conditions")
        scores = np.load(FOLLOWUP / "development-output.npz")["scores"]
    else:
        options = ort.SessionOptions()
        options.intra_op_num_threads = 1
        options.inter_op_num_threads = 1
        session = ort.InferenceSession(str(onnx), options, providers=["CPUExecutionProvider"])
        scores = np.stack([session.run(["scores"], {"pixels": p.astype(np.float32)[None, None]/255})[0][0, 0]
                           for p in arrays["images"]])
    masks = np.stack([ai(s, .5, 12) for s in scores])
    result = {"all": metrics(masks, arrays["truth"], arrays["labels"])}
    for kind in ("good", "dirt", "scratch"):
        ids = [i for i, m in enumerate(metadata) if m["kind"] == kind]
        result[kind] = metrics(masks[ids], arrays["truth"][ids], arrays["labels"][ids])
    torch.set_num_threads(2)
    model = TinyUNet()
    model.load_state_dict(torch.load(weights, weights_only=True))
    with torch.no_grad():
        reference = InferenceModel(model.eval())(torch.from_numpy(arrays["images"][:24, None].copy()).float()/255).numpy()[:, 0]
    error = float(np.max(np.abs(reference-scores[:24])))
    match = all(np.array_equal(ai(a, .5, 12), b) for a, b in zip(reference, masks[:24]))
    decisions = masks.reshape(len(masks), -1).any(axis=1)
    np.savez_compressed(OUTPUT / f"{name}-output.npz", scores=scores, masks=masks)
    record = {"recipe": recipe, "seed": seed, "reusedBaseline": reused,
              "training": train_record, "metrics": result, "meetsBaselineTarget": meets(result, False),
              "conversion": {"samples": 24, "maxAbsoluteDifference": error, "masksMatch": match,
                             "passed": error < 1e-4 and match},
              "threshold": .5, "minimumArea": 12, "evaluationSplit": "development",
              "decisions": decisions.astype(int).tolist(), "imageIds": [m["id"] for m in metadata],
              "finalEvaluation": "not-run", "browserValidation": "not-run"}
    persist(OUTPUT / f"{name}-evaluation.json", record)
    print(json.dumps({"name": name, "metrics": result, "conversion": record["conversion"]}), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", choices=("train", "evaluate"))
    parser.add_argument("recipe", choices=RECIPES)
    parser.add_argument("seed", type=int, choices=(17, 29, 43))
    args = parser.parse_args()
    OUTPUT.mkdir(exist_ok=True)
    name = f"{args.recipe}-{args.seed}"
    record_path = OUTPUT / f"{name}-{'train' if args.stage == 'train' else 'evaluation'}.json"
    if record_path.exists() or (args.stage == "train" and name == "balanced-17"):
        raise SystemExit("Refusing overwrite / baseline retraining")
    def timeout(_sig, _frame):
        persist(record_path, {"incomplete": True, "reason": "175-second timeout"})
        os._exit(124)
    signal.signal(signal.SIGALRM, timeout)
    signal.alarm(175)
    train(args.recipe, args.seed, name) if args.stage == "train" else evaluate(args.recipe, args.seed, name)
