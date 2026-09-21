const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');
const base = 'public/ai-visual-inspection/v2/lesson';
const exportsObject = {};
let broken = '';
const source = ts.transpileModule(fs.readFileSync('src/lib/ai-visual-inspection/lesson.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
vm.runInNewContext(source, { exports: exportsObject, require: () => ({ ASSET_ROOT: '/ai-visual-inspection/v2' }), Uint8Array, crypto: crypto.webcrypto,
  fetch: async url => {
    const bytes = fs.readFileSync(`public${url}`);
    return { ok: broken !== 'http', json: async () => {
      const value = JSON.parse(bytes);
      if (broken === 'label') value.images[0].defective = !value.images[0].defective;
      if (broken === 'duplicate') value.images[1].id = value.images[0].id;
      return value;
    }, arrayBuffer: async () => { const copy = new Uint8Array(bytes); if (broken === 'pixels' && url.endsWith('.pixels')) copy[0] ^= 1; return copy.buffer; } };
  }
});
(async () => {
  const loader = exportsObject.loadLesson;
  const signal = new AbortController().signal;
  const practice = await loader('practice', signal), confirmation = await loader('confirmation', signal);
  for (const rows of [practice, confirmation]) {
    assert.equal(rows.length, 24); assert.equal(rows.filter(row => row.defective).length, 12);
    assert.equal(rows.filter(row => row.texture === 'flat' && row.kind !== 'scratch').length, 6);
    rows.forEach(row => assert.equal(row.truth.some(Boolean), row.defective));
  }
  assert.ok(practice.every(a => confirmation.every(b => a.id !== b.id && !Buffer.from(a.image.pixels).equals(Buffer.from(b.image.pixels)))));
  for (broken of ['http', 'pixels', 'label', 'duplicate']) await assert.rejects(loader('practice', signal));
  const training = JSON.parse(fs.readFileSync(`${base}/training.json`));
  assert.deepEqual(training.balanced.counts, { good: 1200, dirt: 600, scratch: 600 });
  assert.deepEqual(training['dirt-biased'].counts, { good: 1200, dirt: 1200 });
  assert.deepEqual(training['label-errors'].counts, { good: 1500, dirt: 600, scratch: 300 });
  for (const model of Object.values(training)) {
    assert.equal(Object.values(model.counts).reduce((a,b) => a+b), 2400);
    model.examples.forEach(example => assert.ok(fs.existsSync(`${base}/${example.file}`)));
  }
  console.log('Lesson: distinct datasets, denominators, pixel hashes, invalid labels, training counts and examples passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
