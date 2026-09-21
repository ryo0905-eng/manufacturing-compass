"""Counterfactual backgrounds, pre-evaluation lock and one-time final evaluation."""
import argparse
import json
import os
import signal

import numpy as np
import onnxruntime as ort
import torch
from scipy.ndimage import gaussian_filter

from data import ROOT, RECIPES, make_board, quantize, digest
from data_v2 import CACHE
from lighting_v2 import load, summary, GAINS, OUTPUT as LIGHTING
from processing import ai, rule, lighting
from evaluate import predict
from report_matched_v2 import source
from stability_v2 import read, SEEDS
from followup_v2 import sha
from train_v2 import meets
from model import TinyUNet, InferenceModel

OUTPUT = CACHE / "holdout"
PROTOCOL = ROOT / "docs/ai-visual-inspection-v2-holdout-protocol.md"
SOURCES = ("holdout_v2.py", "data.py", "data_v2.py", "processing.py", "lighting_v2.py", "evaluate.py", "model.py", "train_v2.py",
           "report_matched_v2.py", "stability_v2.py", "followup_v2.py", "compare_v2.py", "matched_v2.py", "report_comparison_v2.py")


def write(name, row):
    row.update(protocolSha256=sha(PROTOCOL), manifestSha256=sha(CACHE / "manifest.json"))
    (OUTPUT / f"{name}.json").write_text(json.dumps(row, indent=2)+"\n")


def record(name):
    row = json.loads((OUTPUT / f"{name}.json").read_text())
    if row.get("incomplete") or row["protocolSha256"] != sha(PROTOCOL) or row["manifestSha256"] != sha(CACHE / "manifest.json"):
        raise ValueError(f"Invalid record: {name}")
    return row


def make_swaps():
    arrays, metadata = load("development")
    boards = [make_board("development", b+12000) for b in range(150)]
    reconstructed, swaps = [], {offset: [] for offset in (1, 2)}
    for board, (background, _, dirt, scratch, _, contrast) in enumerate(boards):
        rng = np.random.default_rng([20260921, 2, board])
        gain = float(rng.uniform(.9, 1.1))
        for variant, kind in enumerate(("good", "good", "dirt", "scratch")):
            noise = rng.normal(0, .5, (128, 128))
            mask = dirt if kind == "dirt" else scratch if kind == "scratch" else np.zeros_like(dirt)
            signal_image = gaussian_filter(mask.astype(np.float32), .45)*(145 if kind == "dirt" else contrast)
            reconstructed.append(quantize((background-signal_image)*gain+noise))
            for offset in swaps:
                target_background = boards[(board+offset) % 150][0]
                swaps[offset].append(quantize((target_background-signal_image)*gain+noise))
    if not np.array_equal(np.stack(reconstructed), arrays["images"]):
        raise ValueError("Control reconstruction differs from the original pixels")
    hashes = {}
    for offset, images in swaps.items():
        images = np.stack(images)
        meta = [{**m, "id": f"{m['id']}-swap{offset}", "sourceId": m["id"],
                 "backgroundBoard": (i//4+offset) % 150, "texture": boards[(i//4+offset) % 150][4]}
                for i, m in enumerate(metadata)]
        np.savez_compressed(OUTPUT / f"swap{offset}.npz", images=images, truth=arrays["truth"], masks=arrays["masks"], labels=arrays["labels"])
        (OUTPUT / f"swap{offset}-metadata.json").write_text(json.dumps(meta, indent=2)+"\n")
        hashes[str(offset)] = {"pixelsSha256": digest(images), "truthSha256": digest(arrays["truth"]),
                              "fileSha256": sha(OUTPUT / f"swap{offset}.npz"),
                              "metadataSha256": sha(OUTPUT / f"swap{offset}-metadata.json")}
    write("prepare", {"passed": True, "controlMatches": True, "imagesPerSwap": 600, "swaps": hashes})
    print("Background swaps prepared; 600 control images match exactly", flush=True)


def datasets(stage):
    if stage == "background":
        preparation = record("prepare")
        for offset in (1, 2):
            path = OUTPUT / f"swap{offset}.npz"
            meta_path = OUTPUT / f"swap{offset}-metadata.json"
            expected = preparation["swaps"][str(offset)]
            if sha(path) != expected["fileSha256"] or sha(meta_path) != expected["metadataSha256"]:
                raise ValueError("Background test data changed")
            with np.load(path) as cache:
                arrays = {k: cache[k] for k in cache.files}
            yield str(offset), arrays, json.loads(meta_path.read_text())
    else:
        verify_lock()
        ledger = OUTPUT / "final-opened.json"
        try:
            with ledger.open("x") as file:
                json.dump({"opened": True, "lockSha256": sha(OUTPUT / "freeze.json"), "date": "2026-09-22"}, file)
        except FileExistsError:
            if json.loads(ledger.read_text())["lockSha256"] != sha(OUTPUT / "freeze.json"):
                raise ValueError("Final data already opened under a different lock")
        arrays, meta = load("final")
        for gain in GAINS:
            yield str(gain), {**arrays, "images": lighting(arrays["images"], gain)}, meta


def thresholds():
    row = json.loads((LIGHTING / "rules.json").read_text())
    if row["manifestSha256"] != sha(CACHE / "manifest.json"):
        raise ValueError("Rules refer to other data")
    return {name: row[name]["threshold"] for name in ("basic", "corrected")}


def snapshot():
    files = [PROTOCOL, CACHE / "manifest.json", CACHE / "audit.json", LIGHTING / "rules.json"]
    files += [CACHE / f"{split}-balanced{suffix}" for split in ("development", "final") for suffix in (".npz", ".json")]
    files += [ROOT / "scripts/ai-visual-inspection" / name for name in SOURCES]
    for recipe in RECIPES:
        folder, _ = source(recipe)
        for seed in SEEDS:
            files.extend([folder / f"{recipe}-{seed}.onnx", folder / f"{recipe}-{seed}.pt"])
    return {str(path.relative_to(ROOT)): sha(path) for path in files}


def freeze():
    if not record("prepare")["passed"] or not json.loads((CACHE / "audit.json").read_text())["passed"]:
        raise ValueError("Data checks failed")
    if not json.loads((LIGHTING / "rules.json").read_text())["simpleRulePassed"]:
        raise ValueError("Simple rule gate failed")
    record("background-rules")
    for recipe in RECIPES:
        for seed in SEEDS:
            row = record(f"background-{recipe}-{seed}")
            folder, protocol = source(recipe)
            prior = read("development", seed, folder, protocol)
            training = read("train", seed, folder, protocol)
            if (row["modelSha256"] != prior["modelSha256"] or row["modelSha256"] != training["modelSha256"] or
                    sha(folder / f"{recipe}-{seed}.onnx") != row["modelSha256"] or
                    sha(folder / f"{recipe}-{seed}.pt") != training["weightsSha256"] or
                    training["totalUpdates"] != 1200 or not prior["conversion"]["passed"]):
                raise ValueError("Model changed between background evaluation and freeze")
            if recipe == "balanced" and (not training["passed"] or not prior["passed"] or not row["passed"]):
                raise ValueError(f"Baseline background gate failed: {seed}")
    write("freeze", {"passed": True, "artifacts": snapshot(), "ruleThresholds": thresholds(),
                     "aiThreshold": .5, "minimumArea": 12, "displaySeed": 17})
    print("All background gates passed; model, data and processing hashes locked", flush=True)


def verify_lock():
    locked = record("freeze")
    if not locked["passed"] or locked["artifacts"] != snapshot():
        raise ValueError("Locked artifacts changed; final evaluation prohibited")


def evaluate(stage, recipe, seed):
    settings = thresholds()
    conditions, saved, conversion = {}, {}, None
    is_rule = recipe == "rules"
    if not is_rule:
        folder, protocol = source(recipe)
        training = read("train", seed, folder, protocol)
        previous = read("development", seed, folder, protocol)
        model_path = folder / f"{recipe}-{seed}.onnx"
        if sha(model_path) != training["modelSha256"] or previous["modelSha256"] != sha(model_path) or not previous["conversion"]["passed"]:
            raise ValueError("Model identity / conversion check failed")
        options = ort.SessionOptions()
        options.intra_op_num_threads = options.inter_op_num_threads = 1
        session = ort.InferenceSession(str(model_path), options, providers=["CPUExecutionProvider"])
    for condition, arrays, meta in datasets(stage):
        if is_rule:
            results = {}
            for name, threshold in settings.items():
                masks = np.stack([rule(p, threshold, 12, name == "corrected") for p in arrays["images"]])
                results[name] = summary(masks, arrays, meta)
                saved[f"{condition}-{name}"] = masks
        else:
            scores, timing = predict(session, arrays["images"])
            masks = np.stack([ai(s, .5, 12) for s in scores])
            results = summary(masks, arrays, meta)
            results["nativeCpuTiming"] = timing
            saved[condition] = masks
            if stage == "final" and condition == "1.0":
                torch.set_num_threads(2)
                model = TinyUNet()
                if sha(folder / f"{recipe}-{seed}.pt") != training["weightsSha256"]:
                    raise ValueError("Reference weights changed")
                model.load_state_dict(torch.load(folder / f"{recipe}-{seed}.pt", weights_only=True))
                with torch.no_grad():
                    reference = InferenceModel(model.eval())(torch.from_numpy(arrays["images"][:24, None].copy()).float()/255).numpy()[:, 0]
                error = float(np.abs(reference-scores[:24]).max())
                match = all(np.array_equal(ai(a, .5, 12), b) for a, b in zip(reference, masks[:24]))
                conversion = {"samples": 24, "maxAbsoluteDifference": error, "masksMatch": match, "passed": error < 1e-4 and match}
            rules_record = record(f"{stage}-rules")
            if rules_record["conditions"][condition]["pixelsSha256"] != digest(arrays["images"]):
                raise ValueError("Rule / model input mismatch")
            results["orCombination"] = {}
            with np.load(OUTPUT / f"{stage}-rules.npz") as cached:
                for name in settings:
                    results["orCombination"][name] = summary(masks | cached[f"{condition}-{name}"], arrays, meta)
        conditions[condition] = {**results, "pixelsSha256": digest(arrays["images"])}
    name = f"{stage}-rules" if is_rule else f"{stage}-{recipe}-{seed}"
    np.savez_compressed(OUTPUT / f"{name}.npz", **saved)
    row = {"recipe": recipe, "seed": None if is_rule else seed, "conditions": conditions,
           "ruleThresholds": settings, "aiThreshold": .5, "minimumArea": 12}
    if not is_rule:
        selected = conditions.values() if stage == "background" else [conditions["1.0"]]
        row["passed"] = all(meets({**c["kind"], "all": c["all"]}, False) for c in selected)
        row["modelSha256"] = sha(model_path)
        row["conversion"] = conversion
        if conversion:
            row["passed"] = row["passed"] and conversion["passed"]
    else:
        simple = conditions["1.0"]["basic"]["simple"] if stage == "final" else None
        row["passed"] = simple is None or (simple["missRate"] <= .05 and simple["rejectRate"] <= .05)
    write(name, row)
    print(json.dumps({"name": name, "passed": row["passed"], "conditions": {k: v.get("all", {}) for k, v in conditions.items()}}), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", choices=("prepare", "background", "freeze", "final"))
    parser.add_argument("recipe", nargs="?", choices=("rules", *RECIPES), default="rules")
    parser.add_argument("seed", nargs="?", type=int, choices=SEEDS, default=17)
    args = parser.parse_args()
    OUTPUT.mkdir(exist_ok=True)
    name = args.stage if args.stage in ("prepare", "freeze") else f"{args.stage}-{'rules' if args.recipe == 'rules' else f'{args.recipe}-{args.seed}'}"
    if (OUTPUT / f"{name}.json").exists():
        raise SystemExit("Refusing overwrite")
    def timeout(_sig, _frame):
        write(name, {"incomplete": True, "reason": "175-second timeout"})
        os._exit(124)
    signal.signal(signal.SIGALRM, timeout)
    signal.alarm(175)
    if args.stage == "prepare":
        make_swaps()
    elif args.stage == "freeze":
        freeze()
    else:
        evaluate(args.stage, args.recipe, args.seed)
