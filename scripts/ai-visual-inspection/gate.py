"""Predeclared development gate. Never reads final evaluation results."""
import hashlib
import json

import numpy as np

from data import CACHE, RECIPES

SEEDS = (17, 29, 43)


def gate():
    folder = CACHE / "evaluation"
    checks = []
    model_hashes = {}
    audit = json.loads((CACHE / "audit.json").read_text())
    checks.append({"name": "no-cross-split-exact-or-provenance-overlap", "passed": audit["exactAndProvenancePassed"]})
    checks.append({"name": "capture-gain-independent-of-label", "passed": audit["captureGainIndependentOfLabel"]})
    nonflat_near = sum(c["pairs"] - c["bothFlat"] for c in audit["checks"] if "pairs" in c)
    checks.append({"name": "no-near-duplicate-patterned-surfaces", "passed": nonflat_near == 0, "pairs": nonflat_near})
    rules = json.loads((folder / "development-rules.json").read_text())
    simple = rules["simple"]
    checks.append({"name": "simple-rule-effective", "passed": simple["missRate"] <= .05 and simple["rejectRate"] <= .05})
    for seed in SEEDS:
        baseline = json.loads((folder / f"development-balanced-{seed}.json").read_text())
        base = baseline["conditions"]["1.0"]
        base_decisions = np.load(folder / f"development-balanced-{seed}-decisions.npy")
        checks.append({"name": f"balanced-localizes-{seed}", "passed": base["defectMeanIoU"] >= .25, "iou": base["defectMeanIoU"]})
        for recipe in RECIPES:
            path = CACHE / "models" / f"{recipe}-{seed}.onnx"
            model_hashes[f"{recipe}-{seed}"] = hashlib.sha256(path.read_bytes()).hexdigest()
            checks.append({"name": f"model-under-1MB-{recipe}-{seed}", "passed": path.stat().st_size <= 1_000_000})
            if recipe == "balanced":
                continue
            row = json.loads((folder / f"development-{recipe}-{seed}.json").read_text())["conditions"]["1.0"]
            decisions = np.load(folder / f"development-{recipe}-{seed}-decisions.npy")
            changed = int((base_decisions != decisions).sum())
            if recipe == "dirt-biased":
                effect = row["breakdown"]["kind"]["scratch"]["missed"] - base["breakdown"]["kind"]["scratch"]["missed"]
            elif recipe == "normal-poor":
                effect = row["rejected"] - base["rejected"]
            else:
                effect = row["breakdown"]["kind"]["scratch"]["missed"] - base["breakdown"]["kind"]["scratch"]["missed"]
            checks.append({"name": f"explainable-training-effect-{recipe}-{seed}", "passed": changed >= 2 and effect >= 2,
                           "changedImages": changed, "expectedErrorIncrease": effect})
    report = {"passed": all(c["passed"] for c in checks), "checks": checks, "frozenModels": model_hashes,
              "humanReview": "pending", "browserValidation": "pending", "finalEvaluationOpened": False}
    (CACHE / "gate.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    gate()
