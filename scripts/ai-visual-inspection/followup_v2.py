"""User-authorized bounded follow-up. Preserve every original v2 artifact."""
import argparse
import hashlib
import json
import os
import signal
import time

import numpy as np
import onnxruntime as ort
import torch

from data import ROOT
from data_v2 import CACHE, load
from model import TinyUNet, InferenceModel
from processing import ai, metrics
from train_v2 import loss_function, evaluate, meets

OUTPUT = CACHE / "followup"
PROTOCOL = ROOT / "docs/ai-visual-inspection-v2-followup-protocol.md"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(name):
    return json.loads((OUTPUT / f"{name}.json").read_text())


def persist(stage, record):
    record["protocolSha256"] = sha(PROTOCOL)
    record["manifestSha256"] = sha(CACHE / "manifest.json")
    (OUTPUT / f"{stage}.json").write_text(json.dumps(record, indent=2)+"\n")


def fit(stage):
    started = time.monotonic()
    tiny = stage == "tiny-extension"
    if not json.loads((CACHE / "audit.json").read_text())["passed"]:
        raise SystemExit("Data audit has not passed")
    if not tiny and not read("tiny-extension")["passed"]:
        raise SystemExit("Extension gate has not passed")
    torch.set_num_threads(4)
    torch.manual_seed(17)
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    model = TinyUNet()
    parent = CACHE / "models/tiny-17.pt" if tiny else None
    if parent:
        model.load_state_dict(torch.load(parent, weights_only=True))
    model = model.to(device)
    rate = .0003 if tiny else .001
    optimizer = torch.optim.Adam(model.parameters(), lr=rate)
    arrays, meta = load("train")
    if tiny:
        arrays, meta = {k: v[:48] for k, v in arrays.items()}, meta[:48]
    x = torch.from_numpy(arrays["images"].copy())[:, None].float()/255
    y = torch.from_numpy(arrays["masks"].copy())[:, None].float()
    test, test_meta = (arrays, meta) if tiny else load("tune")
    test_x = torch.from_numpy(test["images"].copy())[:, None].float()/255
    history, streak, updates = [], 0, 0
    print(json.dumps({"stage": stage, "device": device, "images": len(x), "learningRate": rate}), flush=True)
    for block in range(10 if tiny else 12):
        model.train()
        batches = [torch.randperm(len(x))[:12] for _ in range(80)] if tiny else torch.randperm(len(x)).split(32)
        losses = []
        for ids in batches:
            optimizer.zero_grad(set_to_none=True)
            loss = loss_function(model(x[ids].to(device)), y[ids].to(device))
            if not torch.isfinite(loss):
                raise ValueError("Non-finite training loss")
            loss.backward(); optimizer.step()
            losses.append(loss.item()); updates += 1
        result = evaluate(model, test_x, test, test_meta, device)
        passed = meets(result, tiny)
        streak = streak + 1 if passed else 0
        row = {"block": block+1, "updates": updates, "totalUpdates": updates+(320 if tiny else 0),
               "loss": float(np.mean(losses)), "metrics": result, "meetsTarget": passed,
               "seconds": time.monotonic()-started}
        history.append(row)
        print(json.dumps({"block": block+1, "updates": updates, "dirtIoU": result["dirt"]["defectMeanIoU"],
                          "scratchIoU": result["scratch"]["defectMeanIoU"], "missed": result["all"]["missed"],
                          "rejected": result["all"]["rejected"], "streak": streak, "seconds": row["seconds"]}), flush=True)
        if streak >= 2:
            break
    model = model.cpu().eval()
    weights = OUTPUT / f"{stage}.pt"
    onnx_path = OUTPUT / f"{stage}.onnx"
    torch.save(model.state_dict(), weights)
    torch.onnx.export(InferenceModel(model), torch.zeros(1, 1, 128, 128), str(onnx_path),
                      input_names=["pixels"], output_names=["scores"], opset_version=17, dynamo=False)
    record = {"stage": stage, "passed": streak >= 2, "seed": 17, "device": device, "learningRate": rate,
              "optimizerReinitialized": True, "parentWeightsSha256": sha(parent) if parent else None,
              "trainingImages": len(x), "evaluationImages": len(test_x),
              "evaluationSplit": "train-first-48" if tiny else "tune", "history": history,
              "threshold": .5, "minimumArea": 12, "updates": updates, "seconds": time.monotonic()-started,
              "modelSha256": sha(onnx_path), "weightsSha256": sha(weights), "onnxBytes": onnx_path.stat().st_size}
    persist(stage, record)
    print(json.dumps({"stage": stage, "passed": record["passed"], "seconds": record["seconds"]}), flush=True)


def development():
    baseline = read("baseline")
    if not baseline["passed"]:
        raise SystemExit("Baseline gate has not passed")
    path = OUTPUT / "baseline.onnx"
    if sha(path) != baseline["modelSha256"]:
        raise SystemExit("Model changed after tuning")
    arrays, metadata = load("development")
    options = ort.SessionOptions()
    options.intra_op_num_threads = 1; options.inter_op_num_threads = 1
    session = ort.InferenceSession(str(path), options, providers=["CPUExecutionProvider"])
    scores, durations = [], []
    for image in arrays["images"]:
        start = time.perf_counter()
        scores.append(session.run(["scores"], {"pixels": image.astype(np.float32)[None, None]/255})[0][0, 0])
        durations.append((time.perf_counter()-start)*1000)
    scores = np.stack(scores)
    masks = np.stack([ai(s, .5, 12) for s in scores])
    result = {"all": metrics(masks, arrays["truth"], arrays["labels"])}
    for kind in ("dirt", "scratch", "good"):
        ids = [i for i, m in enumerate(metadata) if m["kind"] == kind]
        result[kind] = metrics(masks[ids], arrays["truth"][ids], arrays["labels"][ids])
    torch.set_num_threads(2)
    model = TinyUNet()
    if sha(OUTPUT / "baseline.pt") != baseline["weightsSha256"]:
        raise SystemExit("Reference weights changed")
    model.load_state_dict(torch.load(OUTPUT / "baseline.pt", weights_only=True))
    with torch.no_grad():
        reference = InferenceModel(model.eval())(torch.from_numpy(arrays["images"][:24, None].copy()).float()/255).numpy()[:, 0]
    error = float(np.max(np.abs(reference-scores[:24])))
    masks_match = all(np.array_equal(ai(a, .5, 12), b) for a, b in zip(reference, masks[:24]))
    conversion = {"samples": 24, "maxAbsoluteDifference": error, "masksMatch": masks_match,
                  "passed": error < 1e-4 and masks_match}
    np.savez_compressed(OUTPUT / "development-output.npz", scores=scores, masks=masks)
    record = {"stage": "development", "passed": meets(result, False) and conversion["passed"],
              "evaluationImages": 600, "metrics": result, "conversion": conversion,
              "threshold": .5, "minimumArea": 12, "modelSha256": sha(path),
              "nativeCpuMedianMs": float(np.median(durations)), "nativeCpuP95Ms": float(np.percentile(durations, 95)),
              "browserValidation": "not-run", "finalEvaluation": "not-run"}
    persist("development", record)
    print(json.dumps(record), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", choices=("tiny-extension", "baseline", "development"))
    args = parser.parse_args()
    OUTPUT.mkdir(exist_ok=True)
    if (OUTPUT / f"{args.stage}.json").exists():
        raise SystemExit("Run already recorded; refusing overwrite")
    def timeout(_sig, _frame):
        persist(args.stage, {"passed": False, "incomplete": True, "reason": "175-second timeout"})
        print("175-second timeout; stopping without retry", flush=True)
        os._exit(124)
    signal.signal(signal.SIGALRM, timeout); signal.alarm(175)
    fit(args.stage) if args.stage != "development" else development()
