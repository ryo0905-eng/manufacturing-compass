import unittest
from unittest.mock import patch

from holdout_v2 import datasets, verify_lock


class HoldoutTests(unittest.TestCase):
    def test_changed_artifact_blocks_final_before_loading_images(self):
        with patch("holdout_v2.record", return_value={"passed": True, "artifacts": {"model": "old"}}), \
             patch("holdout_v2.snapshot", return_value={"model": "changed"}), \
             patch("holdout_v2.load") as load:
            with self.assertRaises(ValueError):
                next(datasets("final"))
            load.assert_not_called()

    def test_matching_lock_and_failed_gate(self):
        with patch("holdout_v2.record", return_value={"passed": True, "artifacts": {"model": "same"}}), \
             patch("holdout_v2.snapshot", return_value={"model": "same"}):
            verify_lock()
        with patch("holdout_v2.record", return_value={"passed": False, "artifacts": {}}), \
             patch("holdout_v2.load") as load:
            with self.assertRaises(ValueError):
                next(datasets("final"))
            load.assert_not_called()


if __name__ == "__main__":
    unittest.main()
