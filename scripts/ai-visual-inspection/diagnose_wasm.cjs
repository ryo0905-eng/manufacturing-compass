// Raw-output investigation, before postprocessing. No pass/fail performance gate.
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const crypto = require('node:crypto');
const ref = '.cache/ai-visual-inspection/v2/web-reference';
const root = path.resolve('public/ai-visual-inspection/v2');
const deadline = setTimeout(() => { console.error('175 second limit'); process.exit(1); }, 175000);
(async () => {
  const ort = await import(pathToFileURL(`${root}/ort/ort.wasm.min.mjs`).href);
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.proxy = false;
  ort.env.wasm.wasmPaths = pathToFileURL(`${root}/ort/`).href;
  const manifest = JSON.parse(fs.readFileSync(`${root}/manifest.json`));
  const cases = JSON.parse(fs.readFileSync(`${ref}/cases.json`));
  const report = { environment: 'Node WASM, not browser', node: process.version, runtime: '1.22.0', cases: [] };
  for (const [model, asset] of Object.entries(manifest.models)) {
    const bytes = fs.readFileSync(`${root}/models/${asset.file}`);
    const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
    if (sha256 !== asset.sha256) throw Error('Model identity changed');
    const session = await ort.InferenceSession.create(new Uint8Array(bytes), { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
    for (const condition of cases.filter(x => x.model === model)) {
      const pixels = fs.readFileSync(`${ref}/pixels-${condition.gain.toFixed(1)}.bin`);
      const expectedBytes = new Uint8Array(fs.readFileSync(`${ref}/${condition.name}.f32`));
      const expected = new Float32Array(expectedBytes.buffer);
      const raw = new Float32Array(24 * 16384);
      const row = { model, gain: condition.gain, sha256, images: 24, min: Infinity, max: -Infinity, nonfinite: 0, outside: 0, firstOutside: null, maxScoreError: 0 };
      for (let i = 0; i < 24; i++) {
        const input = new ort.Tensor('float32', Float32Array.from(pixels.subarray(i*16384, (i+1)*16384), x => x / 255), [1, 1, 128, 128]);
        const output = await session.run({ pixels: input });
        raw.set(output.scores.data, i*16384);
        input.dispose(); output.scores.dispose();
      }
      raw.forEach((value, index) => {
        if (!Number.isFinite(value)) row.nonfinite++;
        else {
          row.min = Math.min(row.min, value); row.max = Math.max(row.max, value);
          row.maxScoreError = Math.max(row.maxScoreError, Math.abs(value-expected[index]));
          if (value < 0 || value > 1) {
            row.outside++;
            row.firstOutside ??= { imageIndex: Math.floor(index / 16384), pixelIndex: index % 16384, value, pythonValue: expected[index] };
          }
        }
      });
      fs.writeFileSync(`${ref}/${condition.name}.wasm.f32`, new Uint8Array(raw.buffer));
      report.cases.push(row);
      console.log(JSON.stringify(row));
    }
    await session.release();
  }
  fs.writeFileSync(`${ref}/wasm-diagnosis.json`, JSON.stringify(report, null, 2)+'\n');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => clearTimeout(deadline));
