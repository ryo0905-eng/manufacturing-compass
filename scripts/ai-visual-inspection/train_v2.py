"""Staged diagnosis: tiny training fit, then independently validated baseline."""
import argparse
import json
import os
import signal
import time

import numpy as np
import torch
from torch.nn import functional as F

from data_v2 import CACHE, VERSION, load
from model import TinyUNet, InferenceModel
from processing import ai, metrics


def loss_function(logits, targets):
    bce = F.binary_cross_entropy_with_logits(logits, targets, pos_weight=logits.new_tensor(12.))
    probability = logits.sigmoid()
    dimensions = (1, 2, 3)
    present = (targets.sum(dim=dimensions) > 0).float()
    per_image = 1 - (2*(probability*targets).sum(dim=dimensions)+1) / (probability.sum(dim=dimensions)+targets.sum(dim=dimensions)+1)
    dice = (per_image*present).sum()/present.sum().clamp(min=1)
    return bce + dice


def evaluate(model, inputs, arrays, metadata, device):
    model.eval()
    outputs = []
    with torch.no_grad():
        for batch in inputs.split(32):
            outputs.append(model(batch.to(device)).sigmoid().cpu().numpy()[:, 0])
    scores = np.concatenate(outputs)
    masks = np.stack([ai(score, .5, 12) for score in scores])
    result = {"all": metrics(masks, arrays["truth"], arrays["labels"])}
    for kind in ("dirt", "scratch", "good"):
        ids = [i for i, m in enumerate(metadata) if m["kind"] == kind]
        result[kind] = metrics(masks[ids], arrays["truth"][ids], arrays["labels"][ids])
    return result


def meets(result, tiny):
    iou, missed, rejected = (.7, .05, .05) if tiny else (.5, .2, .1)
    return all(result[k]["defectMeanIoU"] >= iou and result[k]["missRate"] <= missed for k in ("dirt", "scratch")) and result["good"]["rejectRate"] <= rejected


def run(stage):
    started = time.monotonic()
    if not json.loads((CACHE / "audit.json").read_text())["passed"]:
        raise SystemExit("Data audit has not passed")
    if stage == "baseline" and not json.loads((CACHE / "tiny.json").read_text())["passed"]:
        raise SystemExit("Tiny-fit gate has not passed")
    folder = CACHE / "models"
    folder.mkdir(exist_ok=True)
    if (CACHE / f"{stage}.json").exists():
        raise SystemExit("Recorded run exists. Do not overwrite or retry this stage.")
    torch.set_num_threads(4)
    torch.manual_seed(17)
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    model = TinyUNet().to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=.001)
    arrays, meta = load("train")
    tiny = stage == "tiny"
    if tiny:
        arrays, meta = {k: v[:48] for k, v in arrays.items()}, meta[:48]
    x = torch.from_numpy(arrays["images"].copy()).unsqueeze(1).float()/255
    y = torch.from_numpy(arrays["masks"].copy()).unsqueeze(1).float()
    evaluation, evaluation_meta = (arrays, meta) if tiny else load("tune")
    evaluation_x = torch.from_numpy(evaluation["images"].copy()).unsqueeze(1).float()/255
    history, streak, updates = [], 0, 0
    print(json.dumps({"stage": stage, "device": device, "trainingImages": len(x), "evaluationImages": len(evaluation_x)}), flush=True)
    # Tiny: 8 blocks of 40 optimizer updates. Baseline: 12 epochs of 75 updates.
    for block in range(8 if tiny else 12):
        model.train()
        if tiny:
            batches = [torch.randperm(len(x))[:12] for _ in range(40)]
        else:
            batches = torch.randperm(len(x)).split(32)
        losses = []
        for ids in batches:
            target = y[ids].to(device)
            optimizer.zero_grad(set_to_none=True)
            loss = loss_function(model(x[ids].to(device)), target)
            if not torch.isfinite(loss):
                raise ValueError("Non-finite loss")
            loss.backward(); optimizer.step()
            losses.append(loss.item()); updates += 1
        result = evaluate(model, evaluation_x, evaluation, evaluation_meta, device)
        passed = meets(result, tiny)
        streak = streak + 1 if passed else 0
        row = {"block": block+1, "updates": updates, "loss": float(np.mean(losses)), "metrics": result,
               "meetsTarget": passed, "seconds": time.monotonic()-started}
        history.append(row)
        print(json.dumps({"block": block+1, "updates": updates, "loss": row["loss"],
                          "dirtIoU": result["dirt"]["defectMeanIoU"], "scratchIoU": result["scratch"]["defectMeanIoU"],
                          "missed": result["all"]["missed"], "rejected": result["all"]["rejected"], "seconds": row["seconds"]}), flush=True)
        if streak >= 2:
            break
    model = model.cpu().eval()
    torch.save(model.state_dict(), folder / f"{stage}-17.pt")
    # Failed models remain development artifacts and are never served by the web.
    torch.onnx.export(InferenceModel(model), torch.zeros(1, 1, 128, 128), str(folder / f"{stage}-17.onnx"),
                      input_names=["pixels"], output_names=["scores"], opset_version=17, dynamo=False)
    record = {"version": VERSION, "stage": stage, "seed": 17, "device": device, "passed": streak >= 2,
              "history": history, "seconds": time.monotonic()-started, "threshold": .5, "minimumArea": 12,
              "trainingImages": len(x), "evaluationSplit": "train-first-48" if tiny else "tune",
              "evaluationImages": len(evaluation_x), "updates": updates,
              "onnxBytes": (folder / f"{stage}-17.onnx").stat().st_size}
    (CACHE / f"{stage}.json").write_text(json.dumps(record, indent=2)+"\n")
    print(json.dumps({"stage": stage, "passed": record["passed"], "seconds": record["seconds"]}), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", choices=("tiny", "baseline"))
    args = parser.parse_args()
    def timeout(_sig, _frame):
        (CACHE / f"{args.stage}.json").write_text(json.dumps({"passed": False, "incomplete": True, "reason": "175-second timeout"})+"\n")
        print("175-second timeout: incomplete; no retry with different settings.", flush=True)
        os._exit(124)
    signal.signal(signal.SIGALRM, timeout)
    signal.alarm(175)
    run(args.stage)
