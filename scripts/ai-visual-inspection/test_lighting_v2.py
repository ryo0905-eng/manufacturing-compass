import unittest

import numpy as np

from lighting_v2 import best, changed, summary


class LightingTests(unittest.TestCase):
    def test_tuning_objective_and_ties(self):
        rows = [{"threshold": 30, "missRate": .1, "rejectRate": .2},
                {"threshold": 20, "missRate": .2, "rejectRate": .1},
                {"threshold": 10, "missRate": .2, "rejectRate": .1},
                {"threshold": 5, "missRate": .4, "rejectRate": 0}]
        self.assertEqual(best(rows)["threshold"], 10)

    def test_or_counts_and_simple_subset(self):
        truth = np.zeros((4, 3, 3), dtype=bool)
        truth[1, 1, 1] = truth[2, 1, 1] = True
        arrays = {"truth": truth, "labels": np.array([0, 1, 1, 0])}
        meta = [{"id": str(i), "kind": kind, "texture": texture} for i, (kind, texture) in enumerate(
            (("good", "flat"), ("dirt", "flat"), ("scratch", "lines"), ("good", "lines")))]
        a, b = np.zeros_like(truth), np.zeros_like(truth)
        a[1, 1, 1] = True
        b[2, 1, 1] = b[3, 1, 1] = True
        result = summary(a | b, arrays, meta)
        self.assertEqual((result["all"]["missed"], result["all"]["rejected"], result["all"]["bad"], result["all"]["good"]), (0, 1, 2, 2))
        self.assertEqual((result["simple"]["missed"], result["simple"]["rejected"], result["simple"]["bad"], result["simple"]["good"]), (0, 0, 1, 1))
        conditions = {"1.0": summary(a, arrays, meta), "0.7": result, "1.3": summary(a, arrays, meta)}
        changed(conditions, meta)
        self.assertEqual(conditions["0.7"]["changedImageIds"], ["2", "3"])
        self.assertEqual(conditions["1.3"]["changedImageIds"], [])


if __name__ == "__main__":
    unittest.main()
