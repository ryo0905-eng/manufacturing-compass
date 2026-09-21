const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');
const compile = name => ts.transpileModule(fs.readFileSync(`src/lib/ai-visual-inspection/${name}.ts`, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const p = {}, protocol = {};
const globals = { Uint8Array, Float32Array, Float64Array, Int32Array, setTimeout, URL, performance, crypto: crypto.webcrypto, location: { origin: 'https://example.invalid' } };
vm.runInNewContext(compile('processing'), { ...globals, exports: p });
vm.runInNewContext(compile('protocol'), { ...globals, exports: protocol });
let creates = 0, runs = 0, releases = 0, disposed = 0, invalid = false, roundoff = false;
const modelBytes = new Uint8Array([1, 2, 3]);
const sha256 = crypto.createHash('sha256').update(modelBytes).digest('hex');
const ort = { env: { wasm: {} }, Tensor: class { dispose() { disposed++; } }, InferenceSession: { create: async () => {
  creates++;
  return { run: async () => { runs++; return { scores: { type: 'float32', dims: [1, 1, 128, 128], data: new Float32Array(16384).fill(invalid ? NaN : roundoff ? -(2 ** -23) : .6), dispose() { disposed++; } } }; }, release: async () => { releases++; } };
} } };
const exportsObject = {};
vm.runInNewContext(compile('runtime'), { ...globals, exports: exportsObject,
  require: name => name.includes('processing') ? p : name.includes('protocol') ? protocol : ort,
  fetch: async url => url.endsWith('manifest.json') ? { ok: true, json: async () => ({ models: Object.fromEntries(protocol.MODEL_IDS.map(id => [id, { file: `${id}-17.onnx`, sha256 }])) }) } : { ok: true, arrayBuffer: async () => modelBytes.buffer }
});
(async () => {
  const runtime = new exportsObject.InspectionRuntime();
  const settings = { model: 'balanced', gain: 1, rule: { threshold: 112, minimumArea: 12, corrected: false }, scoreThreshold: .5, minimumArea: 12 };
  const request = { id: 1, images: [{ width: 128, height: 128, pixels: new Uint8Array(16384).fill(200) }], settings };
  const first = await runtime.evaluate(request, () => true);
  assert.equal(first.inferenceCount, 1);
  assert.equal(first.results[0].ai.defective, true);
  const threshold = await runtime.evaluate({ ...request, settings: { ...settings, scoreThreshold: .7 } }, () => true);
  assert.equal(threshold.inferenceCount, 0);
  assert.equal(threshold.results[0].ai.defective, false);
  assert.equal(runs, 1);
  assert.equal((await runtime.evaluate({ ...request, settings: { ...settings, gain: .7 } }, () => true)).inferenceCount, 1);
  await runtime.evaluate({ ...request, settings: { ...settings, model: 'dirt-biased' } }, () => true);
  assert.equal(creates, 2); assert.equal(releases, 1);
  assert.equal(await runtime.evaluate(request, () => false), null);
  invalid = true;
  await assert.rejects(runtime.evaluate(request, () => true), /AI/);
  invalid = false;
  assert.equal((await runtime.evaluate(request, () => true)).inferenceCount, 1, 'invalid scores are not cached');
  roundoff = true;
  const rounded = await runtime.evaluate({ ...request, settings: { ...settings, gain: 1.3 } }, () => true);
  assert.equal(rounded.results[0].ai.defective, false);
  assert.equal(rounded.results[0].scores[0], 0);
  assert.equal(disposed, runs * 2, 'tensor resources released including validation failures');
  await assert.rejects(runtime.evaluate({ ...request, images: [] }, () => true));
  await assert.rejects(runtime.evaluate({ ...request, images: [ { ...request.images[0], width: 1 } ] }, () => true));
  assert.equal(ort.env.wasm.numThreads, 1);
  assert.equal(ort.env.wasm.proxy, false);
  console.log('Runtime: cache, brightness, model switching, cancellation, invalid output and disposal passed (mock inference)');
})().catch(error => { console.error(error); process.exitCode = 1; });
