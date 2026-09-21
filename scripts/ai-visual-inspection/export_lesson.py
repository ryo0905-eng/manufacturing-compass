"""Export fixed-order lesson samples without choosing by prediction outcomes."""
import json
import hashlib
import signal
from collections import Counter
import numpy as np
from data import ROOT, RECIPES
from data_v2 import CACHE
from holdout_v2 import verify_lock


def main():
    verify_lock()
    target = ROOT / 'public/ai-visual-inspection/v2/lesson'
    target.mkdir(exist_ok=True)
    for name, split in [('practice', 'development'), ('confirmation', 'final')]:
        arrays = np.load(CACHE / f'{split}-balanced.npz')
        metadata = json.loads((CACHE / f'{split}-balanced.json').read_text())[:24]
        images = arrays['images'][:24].tobytes()
        masks = arrays['truth'][:24].astype('uint8').tobytes()
        (target / f'{name}.pixels').write_bytes(images)
        (target / f'{name}.masks').write_bytes(masks)
        rows = [{k: m[k] for k in ['id', 'kind', 'texture']} | {'defective': bool(arrays['labels'][i])} for i, m in enumerate(metadata)]
        (target / f'{name}.json').write_text(json.dumps({'size': 128, 'images': rows,
            'pixelsSha256': hashlib.sha256(images).hexdigest(), 'masksSha256': hashlib.sha256(masks).hexdigest()}, indent=2)+'\n')
    training = {}
    for recipe in RECIPES:
        arrays = np.load(CACHE / f'train-{recipe}.npz')
        metadata = json.loads((CACHE / f'train-{recipe}.json').read_text())
        indices, seen = [], set()
        for i, m in enumerate(metadata):
            key = (m['kind'], m['texture'], m['labelAltered'])
            if key not in seen:
                seen.add(key); indices.append(i)
        # All distinct kind/texture/label groups, first example in source order.
        records = []
        for i in indices:
            from PIL import Image
            file = f'{recipe}-{i}.png'
            Image.fromarray(arrays['images'][i]).save(target/file)
            records.append({'file': file, 'kind': metadata[i]['kind'], 'texture': metadata[i]['texture'],
                            'taughtDefective': bool(arrays['masks'][i].any()), 'labelAltered': metadata[i]['labelAltered']})
        counts = Counter('good' if not arrays['masks'][i].any() else m['kind'] for i, m in enumerate(metadata))
        training[recipe] = {'total': len(metadata), 'counts': dict(counts), 'examples': records}
    (target/'training.json').write_text(json.dumps(training,indent=2)+'\n')
    print('Exported fixed first 24 practice/confirmation images and training-group representatives; no inference or model changes')


if __name__ == '__main__':
    signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(TimeoutError('175 second limit')))
    signal.alarm(175)
    main()
