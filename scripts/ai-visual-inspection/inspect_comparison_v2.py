"""Contact sheet from stored predictions; select first changes, never best cases."""
import json

import numpy as np
from PIL import Image, ImageDraw

from compare_v2 import OUTPUT
from data import RECIPES
from data_v2 import load


def inspect():
    arrays, metadata = load("development")
    masks = {}
    for recipe in RECIPES:
        with np.load(OUTPUT / f"{recipe}-17-output.npz") as stored:
            masks[recipe] = stored["masks"]
    predictions = {key: value.reshape(len(value), -1).any(axis=1) for key, value in masks.items()}
    selected = [next(i for i, m in enumerate(metadata) if m["kind"] == kind and m["texture"] == texture)
                for kind, texture in (("good", "lines"), ("dirt", "flat"), ("scratch", "flat"), ("scratch", "lines"))]
    reasons = {i: "metadata-first" for i in selected}
    for recipe in RECIPES:
        if recipe == "balanced":
            continue
        for kind in ("good", "scratch"):
            changed = [i for i, m in enumerate(metadata) if m["kind"] == kind and
                       predictions[recipe][i] != predictions["balanced"][i]]
            if changed and changed[0] not in reasons:
                selected.append(changed[0])
                reasons[changed[0]] = f"first-{kind}-decision-change-{recipe}"
    sheet = Image.new("RGB", (6*128, len(selected)*155+20), "white")
    draw = ImageDraw.Draw(sheet)
    headers = ["Input", "True defect", *RECIPES]
    for col, header in enumerate(headers):
        draw.text((col*128+2, 2), header, fill="black")
    for row, i in enumerate(selected):
        regions = [np.zeros((128, 128), dtype=bool), arrays["truth"][i].astype(bool),
                   *(masks[r][i] for r in RECIPES)]
        for col, region in enumerate(regions):
            pixels = np.repeat(arrays["images"][i, :, :, None], 3, axis=2)
            pixels[region] = (.4*pixels[region]+.6*np.array([230, 60, 30])).astype(np.uint8)
            sheet.paste(Image.fromarray(pixels), (128*col, 155*row+45))
        draw.text((2, 155*row+25), f"{metadata[i]['id']} / {metadata[i]['kind']} / {reasons[i]}", fill="black")
    sheet.save(OUTPUT / "comparison-preview.png")
    (OUTPUT / "comparison-preview.json").write_text(json.dumps([
        {"id": metadata[i]["id"], "reason": reasons[i]} for i in selected], indent=2)+"\n")
    print(OUTPUT / "comparison-preview.png")


if __name__ == "__main__":
    inspect()
