import unittest

from report_comparison_v2 import paired


class ComparisonTests(unittest.TestCase):
    def test_pairing_directions_and_unchanged(self):
        before = {"imageIds": ["a", "b", "c", "d"], "decisions": [0, 1, 0, 1]}
        after = {"imageIds": before["imageIds"], "decisions": [1, 0, 0, 1]}
        self.assertEqual(paired(before, after), {"changed": 2, "newlyStopped": 1,
            "newlyPassed": 1, "changedImageIds": ["a", "b"]})
        self.assertEqual(paired(before, before)["changed"], 0)

    def test_reordered_images_rejected(self):
        with self.assertRaises(ValueError):
            paired({"imageIds": ["a", "b"], "decisions": [0, 1]},
                   {"imageIds": ["b", "a"], "decisions": [0, 1]})


if __name__ == "__main__":
    unittest.main()
