"""Deterministic teaching surfaces; not a physical imaging simulator.

The board (including all clean/defective/lighting variants) is the split unit.
Labels never enter the model input. No external images are used. Version 1 has
a known label-correlated capture gain; retain it only to reproduce the FAILED
experiment. The audit/gate prevent using it as a release candidate.
"""
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter

VERSION = "synthetic-board-v1"
SIZE = 128
COUNTS = {"train": 2400, "tune": 400, "development": 600, "final": 600}
SPLIT_SEEDS = {"train": 61001, "tune": 72001, "development": 83001, "final": 94001}
RECIPES = ("balanced", "dirt-biased", "normal-poor", "label-errors")
ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / ".cache/ai-visual-inspection"


def digest(array):
    return hashlib.sha256(array.tobytes()).hexdigest()


def make_board(split, board):
    rng = np.random.default_rng(np.random.SeedSequence([SPLIT_SEEDS[split], board]))
    y, x = np.mgrid[:SIZE, :SIZE].astype(np.float32)
    # Draw unique continuous geometry, rather than reusing texture/defect templates.
    base = rng.uniform(205, 240)
    slope_x, slope_y = rng.uniform(-15, 15, 2)
    noise = rng.normal(0, 1.8, (SIZE, SIZE))
    flat = base + slope_x * (x / SIZE - .5) + slope_y * (y / SIZE - .5) + noise
    texture = ("flat", "wave", "lines")[board % 3]
    angle, period, phase = rng.uniform(-np.pi, np.pi), rng.uniform(12, 28), rng.uniform(0, 2*np.pi)
    axis = x * np.cos(angle) + y * np.sin(angle)
    if texture == "wave":
        background = flat - rng.uniform(15, 35) * (1 + np.sin(axis / period + phase))
    elif texture == "lines":
        band = np.cos(axis * 2*np.pi / period + phase)
        background = flat - rng.uniform(65, 105) * np.exp(-((band - 1) / .18)**2)
    else:
        background = flat.copy()
    dirt = Image.new("L", (SIZE, SIZE))
    draw = ImageDraw.Draw(dirt)
    for _ in range(int(rng.integers(1, 4))):
        cx, cy = rng.uniform(12, 116, 2)
        rx, ry = rng.uniform(2, 6, 2)
        draw.ellipse((cx-rx, cy-ry, cx+rx, cy+ry), fill=255)
    scratch = Image.new("L", (SIZE, SIZE))
    draw = ImageDraw.Draw(scratch)
    start = rng.uniform(15, 113, 2)
    direction = rng.uniform(-np.pi, np.pi)
    length = rng.uniform(24, 70)
    end = np.clip(start + length * np.array([np.cos(direction), np.sin(direction)]), 7, 120)
    middle = np.clip((start+end)/2 + rng.uniform(-8, 8, 2), 7, 120)
    draw.line([tuple(start), tuple(middle), tuple(end)], fill=255, width=int(rng.integers(2, 5)))
    dirt_mask, scratch_mask = np.array(dirt) > 0, np.array(scratch) > 0
    return background, flat, dirt_mask, scratch_mask, texture, float(rng.uniform(35, 85))


def quantize(image):
    # Same explicit rounding/saturation as the TypeScript pipeline.
    return np.floor(np.clip(image, 0, 255) + .5).astype(np.uint8)


def generate(split, recipe="balanced"):
    if split not in COUNTS or recipe not in RECIPES:
        raise ValueError("Unknown split or recipe")
    if split != "train" and recipe != "balanced":
        raise ValueError("Training interventions must never alter evaluation labels")
    images, masks, labels, metadata = [], [], [], []
    for board in range(COUNTS[split] // 4):
        background, flat, dirt, scratch, texture, scratch_contrast = make_board(split, board)
        if recipe == "normal-poor":
            background, texture = flat, "flat"
        for variant in range(4):
            kind = ("good", "good", "dirt", "scratch")[variant]
            if recipe == "dirt-biased" and kind == "scratch":
                kind = "dirt"
                # Rotate this board's own defect; retain its provenance/group.
                mask = np.rot90(dirt)
            else:
                mask = dirt if kind == "dirt" else scratch if kind == "scratch" else np.zeros_like(dirt)
            contrast = 145 if kind == "dirt" else scratch_contrast
            image = background - gaussian_filter(mask.astype(np.float32), .45) * contrast
            if variant == 1:
                # Historical v1 capture protocol. This gain was applied only to
                # the second clean image and is a label-correlated nuisance.
                # Keep it reproducible for the recorded failed experiment;
                # NEVER release v1. The next version must randomize capture
                # conditions independently for every class before any training.
                image = image * .97
            truth = mask.astype(np.uint8)
            bad_label = recipe == "label-errors" and kind == "scratch" and board % 2 == 0
            target = np.zeros_like(truth) if bad_label else truth
            image = quantize(image)
            images.append(image)
            masks.append(target)
            labels.append(int(truth.any()))
            metadata.append({"id": f"{split}-{board:04d}-{variant}", "board": f"{split}-{board:04d}",
                             "texture": texture, "kind": kind, "labelAltered": bad_label,
                             "imageSha256": digest(image), "maskSha256": digest(truth),
                             "backgroundSha256": digest(quantize(background)),
                             "templateSha256": digest(np.stack([dirt, scratch]))})
    return np.stack(images), np.stack(masks), np.array(labels, dtype=np.uint8), metadata


def save_data():
    CACHE.mkdir(parents=True, exist_ok=True)
    manifest = {"version": VERSION, "splits": {}, "recipes": {}}
    for split in COUNTS:
        for recipe in RECIPES if split == "train" else ("balanced",):
            images, masks, labels, metadata = generate(split, recipe)
            name = f"{split}-{recipe}"
            np.savez_compressed(CACHE / f"{name}.npz", images=images, masks=masks, labels=labels)
            (CACHE / f"{name}.json").write_text(json.dumps(metadata, indent=2) + "\n")
            info = {"count": len(images), "good": int((labels == 0).sum()), "defective": int(labels.sum()),
                    "alteredLabels": sum(m["labelAltered"] for m in metadata), "sha256": digest(images)}
            if split == "train":
                manifest["recipes"][recipe] = info
            else:
                manifest["splits"][split] = info
            print(name, info, flush=True)
    (CACHE / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


def load_data(split, recipe="balanced"):
    name = f"{split}-{recipe}"
    with np.load(CACHE / f"{name}.npz") as data:
        arrays = {key: data[key] for key in data.files}
    return arrays, json.loads((CACHE / f"{name}.json").read_text())


if __name__ == "__main__":
    save_data()
