const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
const source = fs.readFileSync('src/lib/ai-visual-inspection/client.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
vm.runInNewContext(code, { exports: exportsObject, require: () => ({ ASSET_ROOT: '/ai-visual-inspection/v2' }), setTimeout, clearTimeout, DOMException });
const workers = [];
class FakeWorker {
  sent = [];
  postMessage(message) { this.sent.push(structuredClone(message)); }
  terminate() { this.terminated = true; }
  reply(message) { this.onmessage({ data: message }); }
}
(async () => {
  const client = new exportsObject.InspectionClient(() => { const worker = new FakeWorker(); workers.push(worker); return worker; });
  const input = { images: [{ width: 128, height: 128, pixels: new Uint8Array(16384), truth: 'must not cross boundary' }], settings: { model: 'balanced', gain: 1, rule: { threshold: 112, minimumArea: 12, corrected: false }, scoreThreshold: .5, minimumArea: 12 } };
  const first = client.inspect(input);
  const cancelled = assert.rejects(first, { name: 'AbortError' });
  let settled = false;
  const second = client.inspect(input).then(result => { settled = true; return result; });
  await cancelled;
  assert.equal(workers[0].sent[0].images[0].truth, undefined);
  assert.equal(input.images[0].pixels.byteLength, 16384);
  workers[0].reply({ id: 1, status: 'complete', results: [] });
  await Promise.resolve();
  assert.equal(settled, false, 'stale result must not settle current request');
  workers[0].reply({ id: 2, status: 'complete', results: [{ marker: 'current' }] });
  assert.equal((await second).results[0].marker, 'current');
  const failure = client.inspect(input);
  workers[0].reply({ id: 3, status: 'error', code: 'inspection-failed' });
  await assert.rejects(failure, /AI/);
  const crash = client.inspect(input);
  workers[0].onerror();
  await assert.rejects(crash, /AI/);
  assert.equal(workers[0].terminated, true);
  const retry = client.inspect(input);
  workers[1].reply({ id: 5, status: 'complete', results: [] });
  await retry;
  const disposed = client.inspect(input);
  client.dispose();
  await assert.rejects(disposed, { name: 'AbortError' });
  assert.equal(workers[1].terminated, true);
  const unavailable = new exportsObject.InspectionClient(() => { throw Error('Unavailable'); });
  await assert.rejects(unavailable.inspect(input), /AI/);
  console.log('Client: stale replies, cancellation, label separation, errors, retry and disposal passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
