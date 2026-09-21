"""Independent Python reference for the browser's pixel/rule/postprocessing."""
import numpy as np
from scipy.ndimage import label, uniform_filter

from data import quantize


def lighting(pixels, gain):
    if not np.isfinite(gain) or gain < .7 or gain > 1.3:
        raise ValueError("Lighting gain outside the fixed evaluation range")
    return quantize(pixels.astype(np.float64) * gain)


def regions(binary, minimum):
    if minimum < 1 or int(minimum) != minimum:
        raise ValueError("Minimum area must be a positive integer")
    components, count = label(binary, structure=np.ones((3, 3)))
    sizes = np.bincount(components.ravel(), minlength=count + 1)
    keep = sizes >= minimum
    keep[0] = False
    return keep[components]


def rule(pixels, threshold, minimum=12, corrected=False):
    gray = pixels.astype(np.float64)
    if corrected:
        # Edge replication and 17x17 window are also fixed in TypeScript.
        score = uniform_filter(gray, size=17, mode="nearest") - gray
        binary = score >= threshold
    else:
        binary = gray < threshold
    return regions(binary, minimum)


def ai(scores, threshold=.5, minimum=12):
    if not np.isfinite(scores).all():
        raise ValueError("Non-finite model output")
    return regions(scores >= threshold, minimum)


def metrics(predicted, truth, labels):
    predicted = np.asarray(predicted, dtype=bool)
    truth = np.asarray(truth, dtype=bool)
    labels = np.asarray(labels, dtype=bool)
    decisions = predicted.reshape(len(labels), -1).any(axis=1)
    bad, good = int(labels.sum()), int((~labels).sum())
    missed = int((~decisions & labels).sum())
    rejected = int((decisions & ~labels).sum())
    union = np.logical_or(predicted, truth).sum(axis=(1, 2))
    intersection = np.logical_and(predicted, truth).sum(axis=(1, 2))
    return {"missed": missed, "bad": bad, "rejected": rejected, "good": good,
            "missRate": missed / bad if bad else None, "rejectRate": rejected / good if good else None,
            "defectMeanIoU": float(np.mean(intersection[labels] / np.maximum(union[labels], 1))) if bad else None}
