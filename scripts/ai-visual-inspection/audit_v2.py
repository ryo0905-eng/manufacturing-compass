"""Check measured metadata/arrays, never a hardcoded success flag."""
import itertools
import json

import numpy as np
from scipy.spatial.distance import cdist

from data import COUNTS, RECIPES
from data_v2 import CACHE, load, generate


def audit():
    checks = []
    datasets = {split: load(split) for split in COUNTS}
    for split, (arrays, metadata) in datasets.items():
        assert len(metadata) == COUNTS[split]
        for i in range(0, len(metadata), 4):
            assert len({m["captureGain"] for m in metadata[i:i+4]}) == 1
            assert arrays["labels"][i:i+4].tolist() == [0, 0, 1, 1]
        checks.append({"name": f"{split}-gain-paired-across-labels", "passed": True})
    for a, b in itertools.combinations(COUNTS, 2):
        ax, am = datasets[a]; bx, bm = datasets[b]
        for field in ("board", "imageSha256", "backgroundSha256", "templateSha256"):
            overlap = set(m[field] for m in am) & set(m[field] for m in bm)
            assert not overlap, (a, b, field)
        av = ax["images"].reshape(-1, 16, 8, 16, 8).mean(axis=(2, 4)).reshape(-1, 256)
        bv = bx["images"].reshape(-1, 16, 8, 16, 8).mean(axis=(2, 4)).reshape(-1, 256)
        matches = np.argwhere(cdist(av, bv, metric="cityblock") / 256 < 1)
        patterned = sum(am[i]["texture"] != "flat" or bm[j]["texture"] != "flat" for i, j in matches)
        assert patterned == 0, (a, b, patterned)
        checks.append({"name": f"{a}-{b}-disjoint", "passed": True, "flatNearPairs": len(matches), "patternedNearPairs": patterned})
    balanced, _ = datasets["train"]
    for recipe in RECIPES:
        arrays, meta = load("train", recipe)
        assert len(meta) == 2400
        if recipe == "normal-poor":
            bad = balanced["labels"].astype(bool)
            assert np.array_equal(arrays["images"][bad], balanced["images"][bad])
            assert np.array_equal(arrays["masks"], balanced["masks"])
        if recipe == "label-errors":
            assert np.array_equal(arrays["images"], balanced["images"])
            assert np.array_equal(arrays["truth"], balanced["truth"])
            assert int(np.any(arrays["masks"] != balanced["masks"], axis=(1, 2)).sum()) == 300
        for split in ("tune", "development", "final"):
            em = datasets[split][1]
            assert not (set(m["imageSha256"] for m in meta) & set(m["imageSha256"] for m in em))
        checks.append({"name": f"{recipe}-controlled-intervention", "passed": True})
    regenerated, _ = generate("train", boards=3)
    assert np.array_equal(regenerated["images"], balanced["images"][:12])
    result = {"passed": True, "checks": checks, "humanImageReview": "pending"}
    (CACHE / "audit.json").write_text(json.dumps(result, indent=2)+"\n")
    print(json.dumps(result), flush=True)


if __name__ == "__main__":
    import signal
    signal.alarm(175)
    audit()
