"""Actual ONNX inference, tuning-only thresholds and fixed evaluation protocol."""
import argparse
import hashlib
import json
import signal
import time

import numpy as np
import onnxruntime as ort

from data import CACHE, RECIPES, VERSION, load_data
from processing import ai, lighting, metrics, rule

GAINS = (.7, 1., 1.3)
AI_THRESHOLDS = (.1, .2, .3, .4, .5, .6, .7, .8, .9)
RULE_THRESHOLDS = tuple(range(32, 225, 16))
CORRECTED_THRESHOLDS = tuple(range(8, 81, 8))
MINIMUM_AREA = 12


def session_for(recipe, seed):
    options = ort.SessionOptions()
    options.intra_op_num_threads = 1
    options.inter_op_num_threads = 1
    return ort.InferenceSession(str(CACHE / "models" / f"{recipe}-{seed}.onnx"), options,
                                providers=["CPUExecutionProvider"])


def predict(session, images):
    output = []
    durations = []
    for image in images:
        started = time.perf_counter()
        tensor = image.astype(np.float32)[None, None] / np.float32(255)
        scores = session.run(["scores"], {"pixels": tensor})[0][0, 0]
        durations.append((time.perf_counter()-started)*1000)
        if scores.shape != (128, 128) or not np.isfinite(scores).all():
            raise ValueError("Invalid model output")
        output.append(scores)
    return np.stack(output), {"medianMs": float(np.median(durations)), "p95Ms": float(np.percentile(durations, 95))}


def scored(scores, arrays, threshold):
    masks = np.stack([ai(s, threshold, MINIMUM_AREA) for s in scores])
    return metrics(masks, arrays["masks"], arrays["labels"]), masks


def best(rows):
    return min(rows, key=lambda r: (r["missRate"]+r["rejectRate"], r["rejectRate"], r["threshold"]))


def breakdown(masks, arrays, metadata):
    result = {}
    for field in ("kind", "texture"):
        result[field] = {}
        for value in sorted(set(m[field] for m in metadata)):
            indices = [i for i, m in enumerate(metadata) if m[field] == value]
            result[field][value] = metrics(masks[indices], arrays["masks"][indices], arrays["labels"][indices])
    return result


def evaluate_rules(split):
    tune, _ = load_data("tune")
    arrays, metadata = load_data(split)
    result = {}
    for corrected, grid in ((False, RULE_THRESHOLDS), (True, CORRECTED_THRESHOLDS)):
        rows = []
        for threshold in grid:
            masks = np.stack([rule(x, threshold, MINIMUM_AREA, corrected) for x in tune["images"]])
            rows.append({"threshold": threshold, **metrics(masks, tune["masks"], tune["labels"])})
        selected = best(rows)["threshold"]
        conditions = {}
        for gain in GAINS:
            masks = np.stack([rule(lighting(x, gain), selected, MINIMUM_AREA, corrected) for x in arrays["images"]])
            conditions[str(gain)] = {**metrics(masks, arrays["masks"], arrays["labels"]),
                                     "breakdown": breakdown(masks, arrays, metadata)}
        curve = []
        for threshold in grid:
            masks = np.stack([rule(x, threshold, MINIMUM_AREA, corrected) for x in arrays["images"]])
            curve.append({"threshold": threshold, **metrics(masks, arrays["masks"], arrays["labels"])})
        result["corrected" if corrected else "basic"] = {"threshold": selected, "tuning": rows, "conditions": conditions, "thresholdCurve": curve}
    # Isolated first-stage subset is chosen by metadata, not observed outcomes.
    indices = [i for i, m in enumerate(metadata) if m["texture"] == "flat" and m["kind"] != "scratch"]
    masks = np.stack([rule(arrays["images"][i], result["basic"]["threshold"], MINIMUM_AREA) for i in indices])
    result["simple"] = metrics(masks, arrays["masks"][indices], arrays["labels"][indices])
    return result


def evaluate(recipe, seed, split):
    started = time.monotonic()
    folder = CACHE / "evaluation"
    folder.mkdir(exist_ok=True)
    session = session_for(recipe, seed)
    tune, _ = load_data("tune")
    scores, _ = predict(session, tune["images"])
    tuning = [{"threshold": threshold, **scored(scores, tune, threshold)[0]} for threshold in AI_THRESHOLDS]
    own_threshold = best(tuning)["threshold"]
    # Same score threshold for all training interventions within a seed.
    # It is selected using balanced model + tuning set, never evaluation results.
    if recipe == "balanced":
        threshold = own_threshold
    else:
        baseline = json.loads((folder / f"development-balanced-{seed}.json").read_text())
        threshold = baseline["threshold"]
    arrays, metadata = load_data(split)
    conditions, normal_scores = {}, None
    for gain in GAINS:
        images = np.stack([lighting(x, gain) for x in arrays["images"]])
        predictions, timing = predict(session, images)
        summary, masks = scored(predictions, arrays, threshold)
        conditions[str(gain)] = {**summary, "breakdown": breakdown(masks, arrays, metadata), "timing": timing}
        if gain == 1:
            normal_scores = predictions
            np.save(folder / f"{split}-{recipe}-{seed}-decisions.npy", masks.reshape(len(masks), -1).any(axis=1))
    curve = [{"threshold": t, **scored(normal_scores, arrays, t)[0]} for t in AI_THRESHOLDS]
    # Matched-background counterfactual: transfer the SAME defect from each
    # board to the next board's clean surface (all within this evaluation split).
    swapped, swapped_truth, swapped_labels = [], [], []
    for i in range(0, len(arrays["images"]), 4):
        donor = arrays["images"][i].astype(np.int16)
        next_base = arrays["images"][(i+4) % len(arrays["images"])].astype(np.int16)
        for offset in (0, 2, 3):
            defect_difference = donor - arrays["images"][i+offset].astype(np.int16)
            swapped.append(np.clip(next_base-defect_difference, 0, 255).astype(np.uint8))
            swapped_truth.append(arrays["masks"][i+offset])
            swapped_labels.append(arrays["labels"][i+offset])
    swapped_scores, _ = predict(session, swapped)
    background_check, _ = scored(swapped_scores, {"masks": np.stack(swapped_truth), "labels": np.array(swapped_labels)}, threshold)
    model_path = CACHE / "models" / f"{recipe}-{seed}.onnx"
    result = {"version": VERSION, "recipe": recipe, "seed": seed, "split": split,
              "threshold": threshold, "ownTunedThreshold": own_threshold, "minimumArea": MINIMUM_AREA,
              "tuning": tuning, "conditions": conditions, "thresholdCurve": curve,
              "backgroundSwap": background_check, "seconds": time.monotonic()-started,
              "modelSha256": hashlib.sha256(model_path.read_bytes()).hexdigest()}
    (folder / f"{split}-{recipe}-{seed}.json").write_text(json.dumps(result, indent=2) + "\n")
    # Only fixed, metadata-selected examples; never rank/select by model success.
    indices = list(range(24))
    np.savez_compressed(folder / f"{split}-{recipe}-{seed}-samples.npz", scores=normal_scores[indices], indices=indices)
    print(json.dumps({"recipe": recipe, "seed": seed, "split": split, "threshold": threshold,
                      "normal": conditions["1.0"], "seconds": result["seconds"]}), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("recipe", choices=(*RECIPES, "rules"))
    parser.add_argument("seed", type=int, choices=(17, 29, 43))
    parser.add_argument("--split", choices=("development", "final"), default="development")
    args = parser.parse_args()
    signal.alarm(175)
    if args.split == "final":
        gate = json.loads((CACHE / "gate.json").read_text())
        if not gate["passed"]:
            raise SystemExit("Development gate has not passed. Final evaluation is locked.")
        # An earlier successful gate cannot authorize changed weights.
        for name, expected in gate["frozenModels"].items():
            path = CACHE / "models" / f"{name}.onnx"
            if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
                raise SystemExit("Model changed after gate. Final evaluation is locked.")
        gate["finalEvaluationOpened"] = True
        (CACHE / "gate.json").write_text(json.dumps(gate, indent=2) + "\n")
    if args.recipe == "rules":
        result = evaluate_rules(args.split)
        (CACHE / "evaluation").mkdir(exist_ok=True)
        (CACHE / "evaluation" / f"{args.split}-rules.json").write_text(json.dumps(result, indent=2) + "\n")
        print(json.dumps({"simple": result["simple"], "basic": result["basic"]["conditions"]["1.0"], "corrected": result["corrected"]["conditions"]["1.0"]}))
    else:
        evaluate(args.recipe, args.seed, args.split)
