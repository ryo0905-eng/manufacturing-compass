"""Fixed six-epoch continuation, tuning gate, then frozen development evaluation."""
import argparse
import json
import os
import signal
import time

import numpy as np
import onnxruntime as ort
import torch

from data import ROOT
from data_v2 import CACHE, load
from followup_v2 import sha, OUTPUT as FOLLOWUP
from compare_v2 import OUTPUT as COMPARISON
from model import TinyUNet, InferenceModel
from processing import ai, metrics
from train_v2 import loss_function, evaluate, meets

OUTPUT = CACHE / "stability"
PROTOCOL = ROOT / "docs/ai-visual-inspection-v2-stability-protocol.md"
SEEDS = (17, 29, 43)


def read(stage, seed, output=OUTPUT, protocol=PROTOCOL):
    row = json.loads((output / f"{stage}-{seed}.json").read_text())
    if row["protocolSha256"] != sha(protocol) or row["manifestSha256"] != sha(CACHE / "manifest.json"):
        raise ValueError("Experiment conditions changed")
    return row


def persist(stage, seed, row, output=OUTPUT, protocol=PROTOCOL):
    row.update(seed=seed, protocolSha256=sha(protocol), manifestSha256=sha(CACHE / "manifest.json"))
    (output / f"{stage}-{seed}.json").write_text(json.dumps(row, indent=2)+"\n")


def fit(seed, recipe="balanced", output=OUTPUT, protocol=PROTOCOL):
    start = time.monotonic()
    reused_baseline = recipe == "balanced" and seed == 17
    folder, stem = (FOLLOWUP, "baseline") if reused_baseline else (COMPARISON, f"{recipe}-{seed}")
    parent = folder / f"{stem}.pt"
    old = json.loads((folder / ("baseline.json" if reused_baseline else f"{stem}-train.json")).read_text())
    if sha(parent) != old["weightsSha256"] or old["manifestSha256"] != sha(CACHE / "manifest.json") or old["updates"] != 750:
        raise ValueError("Parent weights / data / updates mismatch")
    if not torch.backends.mps.is_available():
        raise RuntimeError("MPS required for bounded training")
    torch.set_num_threads(4)
    torch.manual_seed(seed)
    model = TinyUNet()
    model.load_state_dict(torch.load(parent, weights_only=True))
    model = model.to("mps")
    optimizer = torch.optim.Adam(model.parameters(), lr=.0003)
    arrays, _ = load("train", recipe)
    x = torch.from_numpy(arrays["images"].copy())[:, None].float()/255
    y = torch.from_numpy(arrays["masks"].copy())[:, None].float()
    tune, meta = load("tune")
    tune_x = torch.from_numpy(tune["images"].copy())[:, None].float()/255
    before = evaluate(model, tune_x, tune, meta, "mps")
    history = []
    for epoch in range(6):
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
        history.append({"epoch": epoch+11, "loss": float(np.mean(losses))})
        print(json.dumps({"seed": seed, **history[-1], "seconds": time.monotonic()-start}), flush=True)
    after = evaluate(model, tune_x, tune, meta, "mps")
    model = model.cpu().eval()
    path = output / f"{recipe}-{seed}"
    torch.save(model.state_dict(), path.with_suffix(".pt"))
    for state in optimizer.state.values():
        for key, value in state.items():
            if torch.is_tensor(value):
                state[key] = value.cpu()
    checkpoint = output / f"checkpoint-{seed}.pt"
    torch.save({"model": model.state_dict(), "optimizer": optimizer.state_dict(),
                "cpuRngState": torch.get_rng_state(), "totalUpdates": 1200}, checkpoint)
    torch.onnx.export(InferenceModel(model), torch.zeros(1, 1, 128, 128), str(path.with_suffix(".onnx")),
                      input_names=["pixels"], output_names=["scores"], opset_version=17, dynamo=False)
    row = {"passed": meets(after, False), "before": before, "after": after, "history": history,
           "trainingImages": 2400, "evaluationSplit": "tune", "evaluationImages": 400,
           "additionalUpdates": 450, "totalUpdates": 1200, "learningRate": .0003,
           "optimizerReinitialized": True, "threshold": .5, "minimumArea": 12,
           "parentWeightsSha256": sha(parent), "weightsSha256": sha(path.with_suffix(".pt")),
           "modelSha256": sha(path.with_suffix(".onnx")), "checkpointSha256": sha(checkpoint),
           "onnxBytes": path.with_suffix(".onnx").stat().st_size, "seconds": time.monotonic()-start}
    persist("train", seed, row, output, protocol)
    print(json.dumps({"seed": seed, "passed": row["passed"], "tune": after}), flush=True)


def development(seed, recipe="balanced", output=OUTPUT, protocol=PROTOCOL):
    if not all(read("train", s).get("passed", False) for s in SEEDS):
        raise ValueError("All three tuning runs must pass first")
    training = read("train", seed, output, protocol)
    path = output / f"{recipe}-{seed}"
    if sha(path.with_suffix(".onnx")) != training["modelSha256"] or sha(path.with_suffix(".pt")) != training["weightsSha256"]:
        raise ValueError("Frozen model changed")
    arrays, meta = load("development")
    options = ort.SessionOptions()
    options.intra_op_num_threads = options.inter_op_num_threads = 1
    session = ort.InferenceSession(str(path.with_suffix(".onnx")), options, providers=["CPUExecutionProvider"])
    scores = np.stack([session.run(["scores"], {"pixels": p.astype(np.float32)[None, None]/255})[0][0, 0]
                       for p in arrays["images"]])
    masks = np.stack([ai(s, .5, 12) for s in scores])
    result = {"all": metrics(masks, arrays["truth"], arrays["labels"])}
    for kind in ("good", "dirt", "scratch"):
        ids = [i for i, m in enumerate(meta) if m["kind"] == kind]
        result[kind] = metrics(masks[ids], arrays["truth"][ids], arrays["labels"][ids])
    torch.set_num_threads(2)
    model = TinyUNet()
    model.load_state_dict(torch.load(path.with_suffix(".pt"), weights_only=True))
    with torch.no_grad():
        reference = InferenceModel(model.eval())(torch.from_numpy(arrays["images"][:24, None].copy()).float()/255).numpy()[:, 0]
    error = float(np.max(np.abs(reference-scores[:24])))
    match = all(np.array_equal(ai(a, .5, 12), b) for a, b in zip(reference, masks[:24]))
    conversion = {"samples": 24, "maxAbsoluteDifference": error, "masksMatch": match, "passed": error < 1e-4 and match}
    np.savez_compressed(output / f"development-{seed}.npz", scores=scores, masks=masks)
    row = {"passed": meets(result, False) and conversion["passed"], "metrics": result, "conversion": conversion,
           "modelSha256": training["modelSha256"], "evaluationImages": 600, "evaluationSplit": "development",
           "threshold": .5, "minimumArea": 12, "finalEvaluation": "not-run", "browserValidation": "not-run"}
    persist("development", seed, row, output, protocol)
    print(json.dumps(row), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", choices=("train", "development"))
    parser.add_argument("seed", type=int, choices=SEEDS)
    args = parser.parse_args()
    OUTPUT.mkdir(exist_ok=True)
    if (OUTPUT / f"{args.stage}-{args.seed}.json").exists():
        raise SystemExit("Refusing overwrite")
    def timeout(_sig, _frame):
        persist(args.stage, args.seed, {"passed": False, "incomplete": True, "reason": "175-second timeout"})
        os._exit(124)
    signal.signal(signal.SIGALRM, timeout)
    signal.alarm(175)
    fit(args.seed) if args.stage == "train" else development(args.seed)
