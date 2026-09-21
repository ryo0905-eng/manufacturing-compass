"""Model conversion check and independently computed JS parity fixtures."""
import json
import signal

import numpy as np
import torch

from data import CACHE, ROOT, load_data
from evaluate import session_for, predict
from model import TinyUNet, InferenceModel
from processing import ai, lighting, rule


def reference():
    torch.set_num_threads(2)
    arrays, _ = load_data("development")
    pixels = arrays["images"][:12]
    model = TinyUNet()
    model.load_state_dict(torch.load(CACHE / "models/balanced-17.pt", weights_only=True))
    model = InferenceModel(model.eval())
    with torch.no_grad():
        expected = model(torch.from_numpy(pixels[:, None].copy()).float()/255).numpy()[:, 0]
    actual, _ = predict(session_for("balanced", 17), pixels)
    error = float(np.max(np.abs(expected-actual)))
    assert error < 1e-5, error
    for a, b in zip(expected, actual):
        assert np.array_equal(ai(a), ai(b))
    small = np.array([[240, 210, 200, 240, 255], [220, 15, 15, 220, 255],
                      [220, 15, 90, 220, 255], [210, 210, 210, 220, 255]], dtype=np.uint8)
    cases = []
    for gain in (.7, 1., 1.3):
        changed = lighting(small, gain)
        for corrected, threshold in ((False, 90), (True, 40)):
            mask = rule(changed, threshold, 3, corrected)
            cases.append({"gain": gain, "corrected": corrected, "threshold": threshold,
                          "pixels": changed.ravel().tolist(), "mask": mask.astype(int).ravel().tolist()})
    fixture = {"width": 5, "height": 4, "source": small.ravel().tolist(), "minimumArea": 3, "cases": cases}
    target = ROOT / "tests/fixtures/ai-visual-inspection-reference.json"
    target.parent.mkdir(exist_ok=True)
    target.write_text(json.dumps(fixture, indent=2) + "\n")
    result = {"pytorchOnnxMaxAbsoluteError": error, "postprocessingMatches": True, "samples": 12}
    (CACHE / "reference.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result))


if __name__ == "__main__":
    signal.alarm(175)
    reference()
