"""Version 2: shared capture gain, independent noise, controlled interventions."""
import json

import numpy as np
from scipy.ndimage import gaussian_filter

from data import CACHE as V1_CACHE, COUNTS, RECIPES, digest, make_board, quantize

VERSION = "synthetic-board-v2"
CACHE = V1_CACHE / "v2"


def generate(split, recipe="balanced", boards=None):
    if split not in COUNTS or recipe not in RECIPES or (split != "train" and recipe != "balanced"):
        raise ValueError("Invalid split/intervention")
    count = COUNTS[split] // 4 if boards is None else boards
    images, masks, truth, metadata = [], [], [], []
    for board in range(count):
        # New independent base geometry; preserve the old experiment exactly.
        background, flat, dirt, scratch, texture, contrast = make_board(split, board + 12000)
        rng = np.random.default_rng([20260921, list(COUNTS).index(split), board])
        gain = float(rng.uniform(.9, 1.1))
        for variant, kind in enumerate(("good", "good", "dirt", "scratch")):
            # Noise distribution / gain do not depend on the label or recipe.
            noise = rng.normal(0, .5, (128, 128))
            base, actual_texture = (flat, "flat") if recipe == "normal-poor" and kind == "good" else (background, texture)
            mask = dirt if kind == "dirt" else scratch if kind == "scratch" else np.zeros_like(dirt)
            if recipe == "dirt-biased" and kind == "scratch":
                kind, mask = "dirt", np.rot90(dirt)
            attenuation = 145 if kind == "dirt" else contrast
            image = quantize((base - gaussian_filter(mask.astype(np.float32), .45)*attenuation)*gain + noise)
            correct_mask = mask.astype(np.uint8)
            wrong_label = recipe == "label-errors" and kind == "scratch" and board % 2 == 0
            target = np.zeros_like(correct_mask) if wrong_label else correct_mask
            images.append(image); masks.append(target); truth.append(correct_mask)
            metadata.append({"id": f"v2-{split}-{board:04d}-{variant}", "board": f"v2-{split}-{board:04d}",
                             "kind": kind, "texture": actual_texture, "captureGain": gain, "labelAltered": wrong_label,
                             "imageSha256": digest(image), "backgroundSha256": digest(quantize(base)),
                             "templateSha256": digest(np.stack([dirt, scratch]))})
    truth = np.stack(truth)
    return {"images": np.stack(images), "masks": np.stack(masks), "truth": truth,
            "labels": truth.reshape(len(truth), -1).any(axis=1).astype(np.uint8)}, metadata


def save():
    CACHE.mkdir(parents=True, exist_ok=True)
    manifest = {"version": VERSION, "datasets": {}}
    for split in COUNTS:
        for recipe in RECIPES if split == "train" else ("balanced",):
            arrays, metadata = generate(split, recipe)
            name = f"{split}-{recipe}"
            np.savez_compressed(CACHE / f"{name}.npz", **arrays)
            (CACHE / f"{name}.json").write_text(json.dumps(metadata, indent=2)+"\n")
            manifest["datasets"][name] = {"count": len(metadata), "imageSha256": digest(arrays["images"]),
                                          "targetSha256": digest(arrays["masks"])}
            print(name, len(metadata), flush=True)
    (CACHE / "manifest.json").write_text(json.dumps(manifest, indent=2)+"\n")


def load(split, recipe="balanced"):
    name = f"{split}-{recipe}"
    with np.load(CACHE / f"{name}.npz") as file:
        arrays = {k: file[k] for k in file.files}
    return arrays, json.loads((CACHE / f"{name}.json").read_text())


if __name__ == "__main__":
    import signal
    signal.alarm(175)
    save()
