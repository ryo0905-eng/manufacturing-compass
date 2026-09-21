"""Small hand-checkable references, not model quality tests."""
import unittest

import numpy as np

from data import generate, make_board
from processing import ai, lighting, metrics, regions, rule


class ProcessingTests(unittest.TestCase):
    def test_eight_connected_area(self):
        diagonal = np.eye(3, dtype=np.uint8)
        self.assertTrue(np.array_equal(regions(diagonal, 3), diagonal))
        self.assertFalse(regions(diagonal, 4).any())

    def test_brightness_and_no_mutation(self):
        original = np.array([[0, 5, 200, 255]], dtype=np.uint8)
        self.assertEqual(lighting(original, 1.3).tolist(), [[0, 7, 255, 255]])
        self.assertEqual(original.tolist(), [[0, 5, 200, 255]])
        with self.assertRaises(ValueError):
            lighting(original, float("nan"))

    def test_threshold_boundary(self):
        image = np.array([[10, 11], [20, 10]], dtype=np.uint8)
        self.assertFalse(rule(image, 10, 1).any())
        self.assertEqual(int(rule(image, 11, 2).sum()), 2)
        self.assertEqual(int(ai(np.array([[.5, .49]]), .5, 1).sum()), 1)
        with self.assertRaises(ValueError):
            ai(np.array([[float("nan")]]))

    def test_counts_and_position_are_independent(self):
        truth = np.array([[[1, 0]], [[1, 0]], [[0, 0]], [[0, 0]]], dtype=bool)
        predicted = np.array([[[0, 0]], [[0, 1]], [[1, 0]], [[0, 0]]], dtype=bool)
        result = metrics(predicted, truth, [1, 1, 0, 0])
        self.assertEqual([result[k] for k in ("missed", "bad", "rejected", "good")], [1, 2, 1, 2])
        self.assertEqual(result["defectMeanIoU"], 0)

    def test_generator_reproducible(self):
        a = make_board("train", 5)
        b = make_board("train", 5)
        c = make_board("development", 5)
        self.assertTrue(np.array_equal(a[0], b[0]))
        self.assertFalse(np.array_equal(a[0], c[0]))
        with self.assertRaises(ValueError):
            generate("final", "label-errors")


if __name__ == "__main__":
    unittest.main()
