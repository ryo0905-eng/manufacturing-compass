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
const valid = () => ({ response: { modelId: data.jevModel }, providerMetadata: { typesafe: { confidence: { change: .8 } } }, answers: { change: { type: 'choice', choice: 'equipment', probabilities: { equipment: .8, material: .05, measurement: .05, multiple: .05, unknown: .05 } } }, usage: { inputTokens: 1000 } });
function request(body = { sampleId: 'cleaning', variant: 'before' }, headers = {}) {
  return new Request('https://example.test/api/jev', { method: 'POST', headers: { origin: 'https://example.test', 'content-type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
}
async function main() {
  assert.equal(data.jevSamples.length, 10);
  assert.equal(new Set(data.jevSamples.map(s => s.id)).size, 10);
  for (const sample of data.jevSamples) for (const variant of ['before', 'after']) {
    const built = lib.buildJevRequest(sample.id, variant);
    assert.equal(built.state, sample.report + (variant === 'after' ? '\n追加報告：' + sample.additional : ''));
    assert.ok(Object.hasOwn(data.jevCategories, sample.expected[variant]));
    assert.ok(!JSON.stringify(built).includes('expected'));
  }
  for (const value of [null, [], {}, { sampleId: 'fake', variant: 'before' }, { sampleId: 'cleaning', variant: 'other' }, { sampleId: 'cleaning', variant: 'before', state: 'private text' }]) assert.equal(lib.parseJevRequest(value), null);
  assert.equal(lib.parseJevResponse(valid()).choice, 'equipment');
  for (const mutate of [v => { v.response.modelId = 'other'; }, v => { v.answers.change.choice = '__proto__'; }, v => { v.providerMetadata.typesafe.confidence.change = NaN; }, v => { v.answers.change.probabilities.unknown = -1; }, v => { delete v.answers.change.probabilities.unknown; }, v => { v.answers.change.probabilities.unknown = .5; }, v => { v.answers.change.choice = 'material'; }, v => { v.usage.inputTokens = 1.5; }]) {
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
  assert.equal((await POST(request({ sampleId: 'cleaning', variant: 'before', state: 'private' }))).status, 400);
  assert.equal((await POST(request('x'.repeat(257), { 'content-length': '1' }))).status, 413);
  assert.equal(upstreamCalls, 0);
  env.JEV_DEMO_ENABLED = 'false'; assert.equal((await POST(request())).status, 503); env.JEV_DEMO_ENABLED = 'true';
  delete env.AI_GATEWAY_API_KEY; assert.equal((await POST(request())).status, 503); env.AI_GATEWAY_API_KEY = 'secret-test';
 
  const response = await POST(request()); assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store');
  const result = await response.json(); assert.equal(result.sampleId, 'cleaning'); assert.equal(result.inputTokens, 1000); assert.ok(result.elapsedMs >= 0); assert.ok(!JSON.stringify(result).includes('secret-test'));
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
  console.log('PASS: fixed input, validated results, no Redis requirement, Gateway quota/rate limit errors, secret isolation, no retries');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
