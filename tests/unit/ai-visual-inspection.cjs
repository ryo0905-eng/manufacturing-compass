const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(name) {
  const exports = {};
  const source = fs.readFileSync(`src/lib/ai-visual-inspection/${name}.ts`, 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  vm.runInNewContext(code, { exports, Uint8Array, Float32Array, Float64Array, Int32Array });
  return exports;
}
const p = load('processing'), e = load('evaluation');
const plain = value => JSON.parse(JSON.stringify(value));
const image = { width: 3, height: 3, pixels: Uint8Array.from([0, 255, 255, 255, 0, 255, 255, 255, 0]) };
assert.equal(p.inspectRule(image, { threshold: 1, minimumArea: 3, corrected: false }).regions, 1);
assert.equal(p.inspectRule(image, { threshold: 1, minimumArea: 4, corrected: false }).defective, false);
assert.equal(p.inspectRule(image, { threshold: 0, minimumArea: 1, corrected: false }).defective, false);
const edge = p.extractRegions(Uint8Array.from([0, 0, 1, 1, 0, 0]), 3, 2, 1);
assert.equal(edge.regions, 2, 'rows must not wrap');
assert.deepEqual([...p.changeLighting({ width: 4, height: 1, pixels: Uint8Array.from([0, 5, 200, 255]) }, 1.3).pixels], [0, 7, 255, 255]);
assert.deepEqual([...image.pixels], [0, 255, 255, 255, 0, 255, 255, 255, 0], 'input is immutable');
// Independent, deliberately slow direct local-mean calculation, including edges.
const mean = p.localMean(image);
for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
  let sum = 0;
  for (let dy = -8; dy <= 8; dy++) for (let dx = -8; dx <= 8; dx++) {
    sum += image.pixels[Math.max(0, Math.min(2, y + dy)) * 3 + Math.max(0, Math.min(2, x + dx))];
  }
  assert.ok(Math.abs(mean[y * 3 + x] - sum / 289) < 1e-10);
}
assert.equal(p.inspectScores(Float32Array.from([.5, .49, .8, 0]), 2, 2, .5, 2).defective, true);
assert.throws(() => p.inspectScores(Float32Array.from([NaN]), 1, 1, .5, 1));
assert.throws(() => p.inspectScores(Float32Array.from([1.1]), 1, 1, .5, 1));
assert.throws(() => p.changeLighting(image, Infinity));
assert.throws(() => p.extractRegions(new Uint8Array(2), 3, 3, 1));
assert.throws(() => p.inspectRule(image, { threshold: NaN, minimumArea: 1, corrected: false }));
assert.throws(() => p.extractRegions(new Uint8Array(1), 1, 1, 0));
assert.deepEqual(plain(e.countErrors([false, true, true, false], [true, true, false, false])), { missed: 1, bad: 2, rejected: 1, good: 2 });
assert.equal(e.countErrors([true, null], [false, true]), null);
assert.deepEqual(plain(e.countErrors([false], [false])), { missed: 0, bad: 0, rejected: 0, good: 1 });
assert.throws(() => e.countErrors([], []));
assert.throws(() => e.countErrors([true], []));
assert.equal(e.combineDecisions(true, null), null);
assert.equal(e.combineDecisions(false, true), true);
assert.equal(e.maskIoU(Uint8Array.from([1, 1, 0]), Uint8Array.from([0, 1, 1])), 1 / 3);
assert.equal(e.maskIoU(new Uint8Array(2), new Uint8Array(2)), null);
// This fixture comes from SciPy's independent convolution / connected components.
const fixture = JSON.parse(fs.readFileSync('tests/fixtures/ai-visual-inspection-reference.json', 'utf8'));
for (const example of fixture.cases) {
  const source = { width: fixture.width, height: fixture.height, pixels: Uint8Array.from(fixture.source) };
  const changed = p.changeLighting(source, example.gain);
  assert.deepEqual([...changed.pixels], example.pixels);
  assert.deepEqual([...p.inspectRule(changed, { threshold: example.threshold, minimumArea: fixture.minimumArea, corrected: example.corrected }).mask], example.mask);
}
console.log('Visual inspection: independent pixel, region, count and failure tests passed.');
