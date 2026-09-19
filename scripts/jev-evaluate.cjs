// Operator-only bounded evaluation. Never exposes keys, headers or raw API errors.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(root, true, { info() {}, error() {} });
globalThis.AI_SDK_LOG_WARNINGS = false;
function load(file, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, require(name) { if (Object.hasOwn(dependencies, name)) return dependencies[name]; throw Error('Unexpected dependency'); } });
  return exports;
}
async function main() {
  const key = process.env.AI_GATEWAY_API_KEY;
  console.log(JSON.stringify({ keyConfigured: Boolean(key), publicApiEnabled: process.env.JEV_DEMO_ENABLED === 'true' }));
  if (!key) { process.exitCode = 1; return; }
  const data = load('src/data/jev-demo.ts');
  const lib = load('src/lib/jev-demo.ts', { '@/data/jev-demo': data });
  const { createGateway, experimental_evaluate: evaluate } = await import('ai');
  const gateway = createGateway({ apiKey: key });
  const mode = process.argv[2] || '--smoke';
  if (!['--smoke', '--pair', '--all', '--all-resume'].includes(mode)) throw Error('Invalid mode');
  const outputMode = mode === '--all-resume' ? 'all' : mode.slice(2);
  const cases = mode === '--all' ? data.jevSamples : data.jevSamples.slice(0, 1);
  const selectedCases = mode === '--all-resume' ? data.jevSamples : cases;
  const variants = mode === '--smoke' ? ['before'] : ['before', 'after'];
  const outputPath = path.join(root, '.private/jev-evaluation', `${outputMode}.json`);
  let results = [];
  if (mode === '--all-resume' && fs.existsSync(outputPath)) {
    const previous = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    if (Array.isArray(previous.results)) {
      results = previous.results.filter(result => result.questionVersion === data.jevQuestionVersion);
    }
  }
  const deadline = Date.now() + 150000;
  const save = () => {
    const directory = path.join(root, '.private/jev-evaluation');
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify({ evaluatedAt: new Date().toISOString(), mode: outputMode, node: process.version, results }, null, 2));
  };
  for (const sample of selectedCases) for (const variant of variants) {
    if (results.some(result => result.sampleId === sample.id && result.variant === variant)) continue;
    if (Date.now() > deadline) { console.log('Stopped at evaluation time limit.'); save(); process.exitCode = 1; return; }
    // Convert VM-created data to plain objects in the SDK realm.
    const input = JSON.parse(JSON.stringify(lib.buildJevRequest(sample.id, variant)));
    const start = performance.now();
    try {
      const response = await evaluate({ model: gateway.evaluationModel(input.model), state: input.state, questions: input.questions, maxRetries: 0, abortSignal: AbortSignal.timeout(12000), providerOptions: { gateway: { zeroDataRetention: true } } });
      const result = { ...lib.parseJevResponse(response), sampleId: sample.id, variant, expected: sample.expected[variant], elapsedMs: Math.round(performance.now() - start), measuredAt: new Date().toISOString() };
      results.push(result);
      console.log(JSON.stringify({ sampleId: result.sampleId, variant, choice: result.choice, expected: result.expected, confidence: result.confidence, elapsedMs: result.elapsedMs, inputTokens: result.inputTokens }));
    } catch (error) {
      // Error objects can carry Authorization headers. Emit only allowlisted scalar diagnostics.
      const status = Number.isInteger(error?.statusCode) ? error.statusCode : null;
      const code = ['ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT'].includes(error?.cause?.code) ? error.cause.code : null;
      console.log(JSON.stringify({ sampleId: sample.id, variant, failed: true, status, networkCode: code, timeout: error?.name === 'TimeoutError', validation: ['Invalid response', 'Invalid choice', 'Invalid probabilities', 'Invalid distribution', 'Invalid usage'].includes(error?.message) ? error.message : null }));
      save(); process.exitCode = 1; return;
    }
  }
  save();
  console.log(JSON.stringify({ completed: results.length, matched: results.filter(r => r.choice === r.expected).length, inputTokens: results.reduce((sum, r) => sum + r.inputTokens, 0) }));
}
main().catch(() => { console.error('Evaluation stopped. No credentials or raw errors were printed.'); process.exitCode = 1; });
