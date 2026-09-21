"""Frozen rule tuning, pixel brightness changes, actual ONNX inference and OR fusion."""
import argparse
import json
import os
import signal

import numpy as np
import onnxruntime as ort

from data import ROOT, RECIPES, digest
from data_v2 import CACHE, load as load_data
from evaluate import predict, best, GAINS, AI_THRESHOLDS, RULE_THRESHOLDS, CORRECTED_THRESHOLDS
from processing import ai, lighting, metrics, rule
from report_matched_v2 import source
from stability_v2 import read, SEEDS
from followup_v2 import sha

OUTPUT = CACHE / "lighting"
PROTOCOL = ROOT / "docs/ai-visual-inspection-v2-lighting-protocol.md"


def load(split):
    arrays, metadata = load_data(split)
    expected = json.loads((CACHE / "manifest.json").read_text())["datasets"][f"{split}-balanced"]
    if digest(arrays["images"]) != expected["imageSha256"] or digest(arrays["masks"]) != expected["targetSha256"]:
        raise ValueError("Dataset arrays differ from the frozen manifest")
    if not np.array_equal(arrays["truth"], arrays["masks"]) or not np.array_equal(
            arrays["truth"].reshape(len(metadata), -1).any(axis=1), arrays["labels"]):
        raise ValueError("Evaluation truth / image labels disagree")
    return arrays, metadata


def persist(name, row):
    row.update(protocolSha256=sha(PROTOCOL), manifestSha256=sha(CACHE / "manifest.json"))
    (OUTPUT / f"{name}.json").write_text(json.dumps(row, indent=2)+"\n")


def summary(masks, arrays, metadata):
    result = {"all": metrics(masks, arrays["truth"], arrays["labels"])}
    for field in ("kind", "texture"):
        result[field] = {}
        for value in sorted({m[field] for m in metadata}):
            ids = [i for i, m in enumerate(metadata) if m[field] == value]
            result[field][value] = metrics(masks[ids], arrays["truth"][ids], arrays["labels"][ids])
    ids = [i for i, m in enumerate(metadata) if m["texture"] == "flat" and m["kind"] != "scratch"]
    result["simple"] = metrics(masks[ids], arrays["truth"][ids], arrays["labels"][ids])
    result["decisions"] = masks.reshape(len(masks), -1).any(axis=1).astype(int).tolist()
    return result


def changed(conditions, metadata):
    baseline = np.array(conditions["1.0"]["decisions"])
    for condition in conditions.values():
        different = np.array(condition["decisions"]) != baseline
        condition["changedImageIds"] = [m["id"] for m, flag in zip(metadata, different) if flag]


def rules():
    tune, _ = load("tune")
    arrays, metadata = load("development")
    record = {}
    for corrected, grid, name in ((False, RULE_THRESHOLDS, "basic"), (True, CORRECTED_THRESHOLDS, "corrected")):
        tuning = []
        for threshold in grid:
            masks = np.stack([rule(p, threshold, 12, corrected) for p in tune["images"]])
            tuning.append({"threshold": threshold, **metrics(masks, tune["truth"], tune["labels"])})
        selected = best(tuning)["threshold"]
        conditions, saved = {}, {}
        for gain in GAINS:
            pixels = lighting(arrays["images"], gain)
            masks = np.stack([rule(p, selected, 12, corrected) for p in pixels])
            conditions[str(gain)] = {**summary(masks, arrays, metadata), "pixelsSha256": digest(pixels)}
            saved[str(gain)] = masks
        curve = []
        for threshold in grid:
            masks = np.stack([rule(p, threshold, 12, corrected) for p in arrays["images"]])
            curve.append({"threshold": threshold, **metrics(masks, arrays["truth"], arrays["labels"])})
        changed(conditions, metadata)
        np.savez_compressed(OUTPUT / f"{name}-masks.npz", **saved)
        record[name] = {"threshold": selected, "minimumArea": 12, "tuning": tuning,
                        "conditions": conditions, "thresholdCurve": curve}
    simple = record["basic"]["conditions"]["1.0"]["simple"]
    record["simpleRulePassed"] = simple["missRate"] <= .05 and simple["rejectRate"] <= .05
    persist("rules", record)
    print(json.dumps({"simpleRulePassed": record["simpleRulePassed"], "simple": simple,
                      "thresholds": {k: record[k]["threshold"] for k in ("basic", "corrected")}}), flush=True)


def model(recipe, seed):
    folder, protocol = source(recipe)
    train = read("train", seed, folder, protocol)
    previous = read("development", seed, folder, protocol)
    path = folder / f"{recipe}-{seed}.onnx"
    if (sha(path) != train["modelSha256"] or sha(path) != previous["modelSha256"] or
            train["totalUpdates"] != 1200 or previous["threshold"] != .5 or previous["minimumArea"] != 12 or
            not previous["conversion"]["passed"]):
        raise ValueError("Frozen model / cached conditions mismatch")
    rule_record = json.loads((OUTPUT / "rules.json").read_text())
    if rule_record["protocolSha256"] != sha(PROTOCOL) or rule_record["manifestSha256"] != train["manifestSha256"]:
        raise ValueError("Rule / model evaluation conditions differ")
    arrays, metadata = load("development")
    options = ort.SessionOptions()
    options.intra_op_num_threads = options.inter_op_num_threads = 1
    session = ort.InferenceSession(str(path), options, providers=["CPUExecutionProvider"])
    conditions, saved, curve = {}, {}, []
    combinations = {k: {} for k in ("basic", "corrected")}
    for gain in GAINS:
        key = str(gain)
        pixels = lighting(arrays["images"], gain)
        pixel_hash = digest(pixels)
        if gain == 1:
            with np.load(folder / f"development-{seed}.npz") as cache:
                scores, old_masks = cache["scores"], cache["masks"]
            timing = {"reused": True}
        else:
            scores, timing = predict(session, pixels)
        masks = np.stack([ai(s, .5, 12) for s in scores])
        if gain == 1:
            if not np.array_equal(masks, old_masks) or metrics(masks, arrays["truth"], arrays["labels"]) != previous["metrics"]["all"]:
                raise ValueError("Cached score maps / masks / metrics disagree")
            curve = [{"threshold": t, **metrics(np.stack([ai(s, t, 12) for s in scores]), arrays["truth"], arrays["labels"])} for t in AI_THRESHOLDS]
        conditions[key] = {**summary(masks, arrays, metadata), "pixelsSha256": pixel_hash, "nativeCpuTiming": timing}
        saved[key] = masks
        for name in combinations:
            if rule_record[name]["conditions"][key]["pixelsSha256"] != pixel_hash:
                raise ValueError("Rule and AI pixels differ")
            with np.load(OUTPUT / f"{name}-masks.npz") as stored:
                combined = masks | stored[key]
            combinations[name][key] = summary(combined, arrays, metadata)
    changed(conditions, metadata)
    for condition in combinations.values():
        changed(condition, metadata)
    name = f"{recipe}-{seed}"
    np.savez_compressed(OUTPUT / f"{name}-masks.npz", **saved)
    persist(name, {"recipe": recipe, "seed": seed, "modelSha256": sha(path), "threshold": .5, "minimumArea": 12,
                   "conditions": conditions, "thresholdCurve": curve, "orCombination": combinations})
    print(json.dumps({"name": name, "conditions": {k: v["all"] for k, v in conditions.items()}}), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("recipe", choices=("rules", *RECIPES))
    parser.add_argument("seed", type=int, choices=SEEDS, nargs="?", default=17)
    args = parser.parse_args()
    OUTPUT.mkdir(exist_ok=True)
    name = "rules" if args.recipe == "rules" else f"{args.recipe}-{args.seed}"
    if (OUTPUT / f"{name}.json").exists():
        raise SystemExit("Refusing overwrite")
    def timeout(_sig, _frame):
        persist(name, {"incomplete": True, "reason": "175-second timeout"})
        os._exit(124)
    signal.signal(signal.SIGALRM, timeout)
    signal.alarm(175)
    rules() if args.recipe == "rules" else model(args.recipe, args.seed)
