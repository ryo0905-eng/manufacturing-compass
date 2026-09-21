"""Small generation and loss checks before any v2 model fitting."""
import unittest

import numpy as np
import torch
from torch.nn import functional as F

from data_v2 import generate
from train_v2 import loss_function, meets


class V2Tests(unittest.TestCase):
    def test_capture_gain_and_repeatability(self):
        arrays, meta = generate("train", boards=3)
        again, _ = generate("train", boards=3)
        np.testing.assert_array_equal(arrays["images"], again["images"])
        for start in range(0, 12, 4):
            self.assertEqual(len({m["captureGain"] for m in meta[start:start+4]}), 1)
            self.assertEqual(arrays["labels"][start:start+4].tolist(), [0, 0, 1, 1])
        # Independent capture noise, not an artificial clean-only gain.
        self.assertFalse(np.array_equal(arrays["images"][0], arrays["images"][1]))

    def test_interventions_are_local(self):
        base, _ = generate("train", boards=6)
        poor, _ = generate("train", "normal-poor", boards=6)
        wrong, _ = generate("train", "label-errors", boards=6)
        bad = base["labels"].astype(bool)
        np.testing.assert_array_equal(base["images"][bad], poor["images"][bad])
        np.testing.assert_array_equal(base["masks"], poor["masks"])
        self.assertFalse(np.array_equal(base["images"][~bad], poor["images"][~bad]))
        np.testing.assert_array_equal(base["images"], wrong["images"])
        np.testing.assert_array_equal(base["truth"], wrong["truth"])
        self.assertEqual(int(np.any(wrong["masks"] != base["masks"], axis=(1, 2)).sum()), 3)
        with self.assertRaises(ValueError):
            generate("final", "label-errors", boards=1)

    def test_loss_matches_per_image_reference(self):
        logits = torch.tensor([[[[0., 1.], [-1., 2.]]], [[[1., 0.], [0., -2.]]]], requires_grad=True)
        target = torch.tensor([[[[1., 0.], [0., 0.]]], [[[1., 1.], [1., 0.]]]])
        expected = F.binary_cross_entropy_with_logits(logits, target, pos_weight=torch.tensor(12.))
        terms = []
        for prediction, truth in zip(logits, target):
            probability = prediction.sigmoid()
            terms.append(1-(2*(probability*truth).sum()+1)/(probability.sum()+truth.sum()+1))
        expected += sum(terms)/len(terms)
        actual = loss_function(logits, target)
        self.assertAlmostEqual(actual.item(), expected.item(), places=6)
        actual.backward()
        self.assertTrue(torch.isfinite(logits.grad).all())

    def test_clean_batch_and_gate_boundaries(self):
        logits = torch.zeros(2, 1, 4, 4, requires_grad=True)
        loss = loss_function(logits, torch.zeros_like(logits))
        self.assertAlmostEqual(loss.item(), float(np.log(2)), places=6)
        loss.backward()
        self.assertTrue(torch.isfinite(logits.grad).all())
        row = {"dirt": {"defectMeanIoU": .7, "missRate": .05},
               "scratch": {"defectMeanIoU": .7, "missRate": .05}, "good": {"rejectRate": .05}}
        self.assertTrue(meets(row, True))
        row["scratch"]["defectMeanIoU"] = .69
        self.assertFalse(meets(row, True))


if __name__ == "__main__":
    unittest.main()
