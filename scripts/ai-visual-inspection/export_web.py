"""Export only predeclared seed 17 and development references; never refit."""
import hashlib
import json
import shutil
import signal
from pathlib import Path

import numpy as np
import onnxruntime as ort

from data import ROOT, RECIPES
from data_v2 import CACHE
from holdout_v2 import verify_lock
from report_matched_v2 import source
from processing import lighting, rule, ai


def main():
    verify_lock()
    target = ROOT / 'public/ai-visual-inspection/v2'
    (target / 'models').mkdir(parents=True, exist_ok=True)
    reference = CACHE / 'web-reference'
    reference.mkdir(exist_ok=True)
    images = np.load(CACHE / 'development-balanced.npz')['images'][:24]
    (reference / 'source.bin').write_bytes(images.tobytes())
    manifest = {'version': 'synthetic-board-v2-seed17', 'seed': 17, 'size': 128,
                'source': 'docs/ai-visual-inspection-v2-holdout-experiment.json', 'models': {}}
    cases = []
    options = ort.SessionOptions()
    options.intra_op_num_threads = options.inter_op_num_threads = 1
    for recipe in RECIPES:
        folder, _ = source(recipe)
        model = folder / f'{recipe}-17.onnx'
        shutil.copyfile(model, target / 'models' / model.name)
        manifest['models'][recipe] = {'file': model.name, 'bytes': model.stat().st_size,
                                     'sha256': hashlib.sha256(model.read_bytes()).hexdigest(),
                                     'trainingImages': 2400, 'epochs': 16, 'updates': 1200}
        session = ort.InferenceSession(str(model), options, providers=['CPUExecutionProvider'])
        for gain in (.7, 1., 1.3):
            pixels = np.stack([lighting(x, gain) for x in images])
            scores = np.stack([session.run(['scores'], {'pixels': x.astype(np.float32)[None, None]/255})[0][0, 0] for x in pixels])
            name = f'{recipe}-{gain}'
            (reference / f'{name}.f32').write_bytes(scores.astype('<f4').tobytes())
            (reference / f'{name}.mask').write_bytes(np.stack([ai(x) for x in scores]).astype('uint8').tobytes())
            if recipe == 'balanced':
                (reference / f'pixels-{gain}.bin').write_bytes(pixels.tobytes())
                for corrected, threshold in ((False, 112), (True, 8)):
                    (reference / f'rule-{gain}-{int(corrected)}.mask').write_bytes(np.stack([rule(x, threshold, corrected=corrected) for x in pixels]).astype('uint8').tobytes())
            cases.append({'model': recipe, 'gain': gain, 'name': name})
    (target / 'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
    (reference / 'cases.json').write_text(json.dumps(cases, indent=2)+'\n')
    print('Exported four frozen models and 12 × 24 development references; lock verified')


if __name__ == '__main__':
    signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(TimeoutError('175 second limit')))
    signal.alarm(175)
    main()
