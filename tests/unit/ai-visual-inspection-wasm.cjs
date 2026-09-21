// Actual WASM backend under Node; this is NOT a browser or smartphone benchmark.
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const ts = require('typescript');
const deadline = setTimeout(() => { console.error('Stopped: 175 second limit'); process.exit(1); }, 175000);
const root = path.resolve('public/ai-visual-inspection/v2');
const ref = '.cache/ai-visual-inspection/v2/web-reference';
const bytes = name => new Uint8Array(fs.readFileSync(`${ref}/${name}`));
const p = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/ai-visual-inspection/processing.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports: p, Uint8Array, Float32Array, Float64Array, Int32Array });
(async () => {
  const ort = await import(pathToFileURL(`${root}/ort/ort.wasm.min.mjs`).href);
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.proxy = false;
  ort.env.wasm.wasmPaths = pathToFileURL(`${root}/ort/`).href;
  const source = bytes('source.bin');
  const manifest = JSON.parse(fs.readFileSync(`${root}/manifest.json`));
  const cases = JSON.parse(fs.readFileSync(`${ref}/cases.json`));
  const report = { environment: 'Node WASM; not browser', runtime: '1.22.0', node: process.version, scoreTolerance: 1e-4, cases: [] };
  for (const [model, asset] of Object.entries(manifest.models)) {
    const modelBytes = new Uint8Array(fs.readFileSync(`${root}/models/${asset.file}`));
    assert.equal(crypto.createHash('sha256').update(modelBytes).digest('hex'), asset.sha256);
    const session = await ort.InferenceSession.create(modelBytes, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
    for (const condition of cases.filter(x => x.model === model)) {
      const start = performance.now();
      const scoreBytes = bytes(`${condition.name}.f32`);
      const expectedScores = new Float32Array(scoreBytes.buffer, scoreBytes.byteOffset, scoreBytes.length / 4);
      const expectedMasks = bytes(`${condition.name}.mask`);
      const expectedPixels = bytes(`pixels-${condition.gain.toFixed(1)}.bin`);
      let maxError = 0, maxNormalizedError = 0, correctedValues = 0;
      for (let i = 0; i < 24; i++) {
        const offset = i * 16384;
        const image = p.changeLighting({ width: 128, height: 128, pixels: source.slice(offset, offset + 16384) }, condition.gain);
        assert.deepEqual(image.pixels, expectedPixels.slice(offset, offset + 16384));
        const input = new ort.Tensor('float32', Float32Array.from(image.pixels, value => value / 255), [1, 1, 128, 128]);
        const output = await session.run({ pixels: input });
        const scores = output.scores.data;
        const invalid = Array.from(scores.entries()).find(([, value]) => !Number.isFinite(value) || value < -p.SCORE_ROUNDOFF_TOLERANCE || value > 1 + p.SCORE_ROUNDOFF_TOLERANCE);
        if (invalid) {
          fs.writeFileSync(`${ref}/wasm-failure.json`, JSON.stringify({ model, gain: condition.gain, imageIndex: i, pixelIndex: invalid[0], value: String(invalid[1]), min: Math.min(...scores), max: Math.max(...scores) }, null, 2)+'\n');
        }
        for (let j = 0; j < 16384; j++) maxError = Math.max(maxError, Math.abs(scores[j] - expectedScores[offset+j]));
        const normalized = p.normalizeModelScores(scores);
        for (let j = 0; j < 16384; j++) {
          maxNormalizedError = Math.max(maxNormalizedError, Math.abs(normalized[j] - expectedScores[offset+j]));
          if (scores[j] !== normalized[j]) correctedValues++;
          for (const threshold of [.1, .2, .3, .4, .5, .6, .7, .8, .9]) {
            assert.equal(normalized[j] >= threshold, scores[j] >= threshold, 'roundoff must not change the fixed threshold sweep');
          }
        }
        assert.deepEqual(p.inspectScores(normalized, 128, 128, .5, 12).mask, expectedMasks.slice(offset, offset+16384));
        for (const corrected of [false, true]) {
          const expected = bytes(`rule-${condition.gain.toFixed(1)}-${Number(corrected)}.mask`);
          assert.deepEqual(p.inspectRule(image, { threshold: corrected ? 8 : 112, minimumArea: 12, corrected }).mask, expected.slice(offset, offset+16384));
        }
        input.dispose(); output.scores.dispose();
      }
      assert.ok(maxError <= 1e-4, `Score mismatch: ${maxError}`);
      assert.ok(maxNormalizedError <= 1e-4);
      const result = { model, gain: condition.gain, images: 24, maxScoreError: maxError, maxNormalizedError, correctedValues, thresholdSweepUnchanged: true, masksMatch: true, pixelsMatch: true, rulesMatch: true, elapsedMs: performance.now()-start };
      report.cases.push(result);
      console.log(JSON.stringify(result));
    }
    await session.release();
  }
  fs.writeFileSync(`${ref}/wasm-report.json`, JSON.stringify(report, null, 2)+'\n');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => clearTimeout(deadline));
