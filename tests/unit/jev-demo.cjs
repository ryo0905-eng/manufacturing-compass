const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
function load(file, dependencies = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, require(name) { if (Object.hasOwn(dependencies, name)) return dependencies[name]; throw Error(name); }, ...globals });
  return exports;
}
const data = load('src/data/jev-demo.ts');
const lib = load('src/lib/jev-demo.ts', { '@/data/jev-demo': data });
const valid = () => ({
  response: { modelId: data.jevModel },
  providerMetadata: { typesafe: { confidence: { change: .8, route: .75, completeness: .7 } } },
  answers: {
    change: { type: 'choice', choice: 'material', probabilities: { equipment: .05, material: .8, measurement: .05, multiple: .05, unknown: .05 } },
    route: { type: 'choice', choice: 'metrology', probabilities: Object.fromEntries(Object.keys(data.jevRoutes).map(key => [key, key === 'metrology' ? .84 : .02])) },
    comparison: { type: 'boolean', probability: .9 },
    completeness: { type: 'score', score: 2.7, probabilities: { 0: 0, 1: 0, 2: .3, 3: .7, 4: 0 } },
  },
  usage: { inputTokens: 1000 },
});
function request(body = { sampleId: 'batch', evidenceId: null }, headers = {}) {
  return new Request('https://example.test/api/jev', { method: 'POST', headers: { origin: 'https://example.test', 'content-type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
}
async function main() {
  assert.equal(data.jevSamples.length, 3);
  assert.equal(new Set(data.jevSamples.map(s => s.id)).size, 3);
  for (const sample of data.jevSamples) {
    assert.equal(sample.evidence.length, 2);
    for (const evidence of [null, ...sample.evidence]) {
      const built = lib.buildJevRequest(sample.id, evidence?.id ?? null);
      assert.equal(built.state, sample.report + (evidence ? '\n追加報告：' + evidence.report : ''));
      assert.equal(Object.keys(built.questions).join(','), 'change,comparison,completeness,route');
      for (const other of sample.evidence.filter(item => item !== evidence)) assert.ok(!built.state.includes(other.report));
    }
  }
  for (const value of [null, [], {}, { sampleId: 'fake', evidenceId: null }, { sampleId: 'batch', evidenceId: 'reference' }, { sampleId: 'batch', evidenceId: '' }, { sampleId: 'batch', variant: 'before' }, { sampleId: 'batch', evidenceId: null, state: 'private text' }]) assert.equal(lib.parseJevRequest(value), null);
  const decisions = lib.parseJevResponse(valid()).decisions;
  assert.equal(decisions.change.choice, 'material');
  assert.equal(decisions.route.choice, 'metrology'); // A route must not be inferred from change.
  assert.equal(decisions.comparison.probability, .9);
  assert.equal(decisions.completeness.score, 2.7); // Preserve fractional zero-based score.
  const rounded = valid();
  rounded.rounding = { probabilityDecimals: 2, scoreDecimals: 2 };
  rounded.answers.route.probabilities.metrology = .82; // Rounded distribution sums to .98.
  assert.equal(lib.parseJevResponse(rounded).decisions.route.probabilities.metrology, .82);
  delete rounded.rounding;
  assert.throws(() => lib.parseJevResponse(rounded));
  for (const mutate of [
    v => { v.response.modelId = 'other'; },
    v => { v.answers.change.choice = '__proto__'; },
    v => { v.providerMetadata.typesafe.confidence.change = NaN; },
    v => { v.answers.change.probabilities.unknown = -1; },
    v => { delete v.answers.change.probabilities.unknown; },
    v => { v.answers.change.probabilities.unknown = .5; },
    v => { v.answers.change.choice = 'equipment'; },
    v => { v.answers.route.choice = 'stop-equipment'; },
    v => { v.answers.comparison.probability = true; },
    v => { v.answers.comparison.probability = 1.1; },
    v => { v.answers.completeness.score = NaN; },
    v => { v.answers.completeness.score = 5; },
    v => { v.answers.completeness.score = 2; },
    v => { delete v.answers.route; },
    v => { v.answers.extra = {}; },
    v => { delete v.providerMetadata.typesafe.confidence.completeness; },
    v => { v.usage.inputTokens = 1.5; },
    v => { v.rounding = { probabilityDecimals: -1 }; },
  ]) {
    const value = valid(); mutate(value); assert.throws(() => lib.parseJevResponse(value));
  }
  const env = { JEV_DEMO_ENABLED: 'true', AI_GATEWAY_API_KEY: 'secret-test' };
  let upstreamCalls = 0, upstream = () => valid();
  const { POST } = load('src/app/api/jev/route.ts', {
    ai: {
      createGateway: ({ apiKey }) => { assert.equal(apiKey, 'secret-test'); return { evaluationModel: id => { assert.equal(id, 'typesafe-ai/jev'); return id; } }; },
      experimental_evaluate: async options => { upstreamCalls++; assert.equal(options.maxRetries, 0); assert.equal(options.providerOptions.gateway.zeroDataRetention, true); assert.equal(options.state, data.jevSamples[0].report); return upstream(); },
    }, '@/lib/jev-demo': lib }, {
    Response, URL, TextDecoder, Uint8Array, AbortSignal, performance, process: { env },
  });
  assert.equal((await POST(request(undefined, { origin: 'https://other.test' }))).status, 403);
  assert.equal((await POST(request(undefined, { 'content-type': 'text/plain' }))).status, 415);
  assert.equal((await POST(request('{broken'))).status, 400);
  assert.equal((await POST(request({ sampleId: 'batch', evidenceId: null, state: 'private' }))).status, 400);
  assert.equal((await POST(request('x'.repeat(257), { 'content-length': '1' }))).status, 413);
  assert.equal(upstreamCalls, 0);
  env.JEV_DEMO_ENABLED = 'false'; assert.equal((await POST(request())).status, 503); env.JEV_DEMO_ENABLED = 'true';
  delete env.AI_GATEWAY_API_KEY; assert.equal((await POST(request())).status, 503); env.AI_GATEWAY_API_KEY = 'secret-test';
 
  const response = await POST(request()); assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store');
  const result = await response.json(); assert.equal(result.sampleId, 'batch'); assert.equal(result.evidenceId, null); assert.equal(result.decisions.route.choice, 'metrology'); assert.equal(result.inputTokens, 1000); assert.ok(result.elapsedMs >= 0); assert.ok(!JSON.stringify(result).includes('secret-test'));
  upstream = () => { throw Error('secret-test'); };
  const failure = await POST(request()); assert.equal(failure.status, 502); assert.ok(!(await failure.text()).includes('secret-test'));
  upstream = () => { throw Error('secret-test'); }; assert.equal((await POST(request())).status, 502);
  upstream = () => ({ bad: true }); assert.equal((await POST(request())).status, 502);
  assert.equal(upstreamCalls, 4); // Exactly one call per attempt, no automatic retries.
  for (const [error, expected] of [
    [{ statusCode: 402 }, 402],
    [{ statusCode: 500, cause: { responseBody: JSON.stringify({ error: { type: 'quota_for_entity_exceeded', message: 'secret-test' } }) } }, 402],
    [{ statusCode: 429 }, 429],
    [{ statusCode: 500, cause: { statusCode: 429 } }, 429],
    [{ statusCode: 500, responseBody: 'not JSON' }, 502],
  ]) {
    upstream = () => { throw error; };
    const rejected = await POST(request());
    assert.equal(rejected.status, expected);
    assert.ok(!(await rejected.text()).includes('secret-test'));
  }
  assert.equal(lib.jevFailureStatus(null), 502);
  const circular = {}; circular.cause = circular;
  assert.equal(lib.jevFailureStatus(circular), 502);
  assert.equal(upstreamCalls, 9);
  console.log('PASS: isolated evidence branches, four typed decisions, invalid output rejection, quota/rate limits, secret isolation, no retries');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
