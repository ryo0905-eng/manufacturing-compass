"""Metadata-selected image/mask/output pairs for inspection, not cherry-picking."""
import json

import numpy as np
from PIL import Image, ImageDraw

from data import CACHE, RECIPES, load_data
from processing import ai, rule


def contact_sheet():
    arrays, meta = load_data("development")
    # First four boards of each texture; never use predicted performance to select.
    indices = [i for i, m in enumerate(meta[:48]) if m["kind"] != "good" or i % 4 == 0]
    sheet = Image.new("RGB", (128*4, (128+24)*len(indices)), "white")
    draw = ImageDraw.Draw(sheet)
    config = json.loads((CACHE / "evaluation/development-rules.json").read_text())
    for row, index in enumerate(indices):
        source, truth = arrays["images"][index], arrays["masks"][index].astype(bool)
        masks = [np.zeros_like(truth), truth,
                 rule(source, config["basic"]["threshold"], 12),
                 rule(source, config["corrected"]["threshold"], 12, True)]
        for column, mask in enumerate(masks):
            rgb = np.repeat(source[:, :, None], 3, axis=2)
            rgb[mask] = (rgb[mask].astype(float)*.4 + np.array([230, 70, 40])*.6).astype(np.uint8)
            sheet.paste(Image.fromarray(rgb), (column*128, row*152+24))
            draw.text((column*128+2, row*152+3), [meta[index]["id"], "Truth", "Basic", "Corrected"][column], fill="black")
    sheet.save(CACHE / "contact-sheet.png")
    # Compact first six examples for a single view.
    sheet.crop((0, 0, 512, 152*6)).save(CACHE / "contact-preview.png")
    # Every first two boards (including clean examples), fixed before inference.
    comparison = Image.new("RGB", (128*6, 152*8), "white")
    draw = ImageDraw.Draw(comparison)
    predictions = {}
    thresholds = {}
    for recipe in RECIPES:
        path = CACHE / "evaluation" / f"development-{recipe}-17-samples.npz"
        if not path.exists():
            return
        with np.load(path) as sample:
            predictions[recipe] = sample["scores"]
        thresholds[recipe] = json.loads((CACHE / "evaluation" / f"development-{recipe}-17.json").read_text())["threshold"]
    for row in range(8):
        source = arrays["images"][row]
        masks = [np.zeros((128, 128), dtype=bool), arrays["masks"][row].astype(bool),
                 *[ai(predictions[r][row], thresholds[r], 12) for r in RECIPES]]
        for column, mask in enumerate(masks):
            rgb = np.repeat(source[:, :, None], 3, axis=2)
            rgb[mask] = (rgb[mask].astype(float)*.4 + np.array([230, 70, 40])*.6).astype(np.uint8)
            comparison.paste(Image.fromarray(rgb), (column*128, row*152+24))
            draw.text((column*128+2, row*152+3), [meta[row]["id"], "Truth", *RECIPES][column], fill="black")
    comparison.save(CACHE / "ai-comparison.png")
    print(str(CACHE / "contact-preview.png"))


if __name__ == "__main__":
    contact_sheet()
