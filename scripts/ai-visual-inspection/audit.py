"""Cross-split provenance, exact and near-duplicate audit before fitting."""
import itertools
import json

import numpy as np
from scipy.spatial.distance import cdist

from data import CACHE, COUNTS, RECIPES, load_data


def audit():
    datasets = {split: load_data(split) for split in COUNTS}
    checks = []
    for left, right in itertools.combinations(COUNTS, 2):
        a, am = datasets[left]
        b, bm = datasets[right]
        for key in ("board", "imageSha256", "backgroundSha256", "templateSha256"):
            overlap = set(m[key] for m in am) & set(m[key] for m in bm)
            checks.append({"left": left, "right": right, "field": key, "overlap": len(overlap)})
            assert not overlap, (left, right, key)
        # Mean absolute difference on 16x16 block-averaged pixels. Report near
        # surfaces rather than silently deleting inconvenient evaluation data.
        ax = a["images"].reshape(-1, 16, 8, 16, 8).mean(axis=(2, 4)).reshape(-1, 256)
        bx = b["images"].reshape(-1, 16, 8, 16, 8).mean(axis=(2, 4)).reshape(-1, 256)
        nearest = cdist(ax, bx, metric="cityblock") / 256
        matches = np.argwhere(nearest < 1.0)
        checks.append({"left": left, "right": right, "field": "near-duplicate-mae-under-1",
                       "pairs": len(matches), "bothFlat": sum(am[i]["texture"] == bm[j]["texture"] == "flat" for i, j in matches),
                       "examples": [[am[i]["id"], bm[j]["id"], float(nearest[i,j])] for i,j in matches[:10]]})
    for recipe in RECIPES:
        arrays, meta = load_data("train", recipe)
        assert len(arrays["images"]) == 2400
        assert int(arrays["labels"].sum()) == 1200
        # Every background group has two clean and two defective captures.
        assert all(int(arrays["labels"][i:i+4].sum()) == 2 for i in range(0, 2400, 4))
        assert sum(m["labelAltered"] for m in meta) == (300 if recipe == "label-errors" else 0)
        for split in ("tune", "development", "final"):
            _, evaluation_meta = datasets[split]
            for key in ("imageSha256", "backgroundSha256", "templateSha256"):
                overlap = set(m[key] for m in meta) & set(m[key] for m in evaluation_meta)
                assert not overlap, (recipe, split, key)
                checks.append({"left": f"train-{recipe}", "right": split, "field": key, "overlap": len(overlap)})
    report = {"exactAndProvenancePassed": True, "checks": checks,
              "captureGainIndependentOfLabel": False,
              "captureProtocolIssue": "v1 applies gain 0.97 only to the second clean capture. This label-correlated nuisance blocks release; do not change v1 results retrospectively.",
              "nearDuplicatePolicy": "Reported, not automatically removed. Human image review is still required."}
    (CACHE / "audit.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    audit()
