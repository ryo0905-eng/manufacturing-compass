"""Render cached development outputs; does not rerun or tune inference."""
import json

import numpy as np
from PIL import Image, ImageDraw

from data_v2 import load
from followup_v2 import OUTPUT


def inspect():
    arrays, metadata = load("development")
    with np.load(OUTPUT / "development-output.npz") as cached:
        masks = cached["masks"]
    records = []
    for i, (mask, truth, meta) in enumerate(zip(masks, arrays["truth"], metadata)):
        union = np.logical_or(mask, truth).sum()
        records.append({"id": meta["id"], "kind": meta["kind"], "texture": meta["texture"],
                        "missed": bool(truth.any() and not mask.any()), "rejected": bool(mask.any() and not truth.any()),
                        "iou": float(np.logical_and(mask, truth).sum()/union) if union else None})
    (OUTPUT / "development-images.json").write_text(json.dumps(records, indent=2)+"\n")
    # Select by metadata, never model performance. Errors get a separate sheet.
    selected = [next(i for i, m in enumerate(metadata) if m["kind"] == kind and m["texture"] == texture)
                for kind, texture in (("good", "lines"), ("dirt", "flat"), ("scratch", "flat"), ("scratch", "lines"))]
    errors = [i for i, row in enumerate(records) if row["missed"] or row["rejected"]]
    for filename, indices in (("development-preview.png", selected), ("development-errors.png", errors)):
        if not indices:
            continue
        sheet = Image.new("RGB", (384, len(indices)*150), "white")
        draw = ImageDraw.Draw(sheet)
        for row, i in enumerate(indices):
            for col, region in enumerate((np.zeros((128, 128), dtype=bool), arrays["truth"][i].astype(bool), masks[i])):
                pixels = np.repeat(arrays["images"][i, :, :, None], 3, axis=2)
                pixels[region] = (.4*pixels[region]+.6*np.array([230, 60, 30])).astype(np.uint8)
                sheet.paste(Image.fromarray(pixels), (128*col, 150*row+22))
                label = metadata[i]["id"].replace("v2-development-", "") if col == 0 else "True defect" if col == 1 else "AI detected"
                draw.text((128*col+2, 150*row+3), label, fill="black")
        sheet.save(OUTPUT / filename)
    print(json.dumps({"images": len(records), "missed": sum(r["missed"] for r in records),
                      "rejected": sum(r["rejected"] for r in records), "previewIds": [metadata[i]["id"] for i in selected]}))


if __name__ == "__main__":
    inspect()
