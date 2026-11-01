const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function loadTs(path, dependencies = {}, globals = {}) {
  const source = fs.readFileSync(path, 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, require: id => dependencies[id] || require(id), process, Object, Array, ...globals }, { filename: path });
  return module.exports;
}
const data = loadTs('src/data/feedback.ts');
const { validateFeedback } = loadTs('src/lib/feedback.ts', { '@/data/feedback': data });
const valid = { id: '550e8400-e29b-41d4-a716-446655440000', survey: 'cpk', need: 'data', feature: 'csv', interest: 'early', detail: '困っています', email: '', consent: false };

test('accepts anonymous and opted-in contact, rejects wrong choices and consent', () => {
  assert.ok(validateFeedback(valid));
  assert.ok(validateFeedback({ ...valid, email: 'person@example.org', consent: true }));
  for (const invalid of [
    { ...valid, email: 'person@example.org' }, { ...valid, consent: true },
    { ...valid, survey: '__proto__' }, { ...valid, feature: 'comparison' },
    { ...valid, detail: 'x'.repeat(501) }, { ...valid, id: 'bad' },
  ]) assert.equal(validateFeedback(invalid), null);
  assert.ok(validateFeedback({ ...valid, survey: 'market_cap', feature: 'comparison' }));
});

test('API rejects other origins and fails closed on bot verification before saving', async () => {
  const keys = { FEEDBACK_ENABLED: 'true', FEEDBACK_TURNSTILE_SITE_KEY: 'key', FEEDBACK_TURNSTILE_SECRET: 'secret', FEEDBACK_REDIS_URL: 'https://test.upstash.io', FEEDBACK_REDIS_TOKEN: 'token', FEEDBACK_RATE_SECRET: 'r'.repeat(40), FEEDBACK_SINK_URL: 'https://script.google.com/macros/s/test/exec', FEEDBACK_SINK_SECRET: 's'.repeat(40), VERCEL: '1' };
  const old = Object.fromEntries(Object.keys(keys).map(k => [k, process.env[k]]));
  Object.assign(process.env, keys);
  let calls = [];
  let allowed = false;
  const fakeFetch = async (url, options) => {
    calls.push([String(url), options]);
    if (String(url).includes('upstash.io')) return Response.json({ result: 1 });
    if (String(url).includes('cloudflare.com')) return Response.json({ success: allowed, hostname: 'mfg-compass.com', action: 'feedback' });
    return Response.json({ ok: true, id: valid.id });
  };
  try {
    const route = loadTs('src/app/api/feedback/route.ts', { 'next/server': { NextResponse: Response }, '@/lib/feedback': { validateFeedback, feedbackConfigured: () => true } }, { fetch: fakeFetch, AbortSignal, TextDecoder, Uint8Array, URL });
    const request = origin => new Request('https://mfg-compass.com/api/feedback', { method: 'POST', headers: { origin, 'content-type': 'application/json', 'x-vercel-forwarded-for': '192.0.2.1' }, body: JSON.stringify({ feedback: valid, token: 'challenge', honeypot: '' }) });
    assert.equal((await route.POST(request('https://evil.example'))).status, 403);
    assert.equal(calls.length, 0);
    assert.equal((await route.POST(request('https://mfg-compass.com'))).status, 400);
    assert.equal(calls.length, 2);
    calls = []; allowed = true;
    assert.equal((await route.POST(request('https://mfg-compass.com'))).status, 200);
    assert.equal(calls.length, 3);
    assert.equal(calls[0][1].body.includes(valid.detail), false);
    assert.equal(calls[1][1].body.includes(valid.detail), false);
    assert.equal(calls[2][1].body.includes(valid.detail), true);
  } finally { for (const [key, value] of Object.entries(old)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } }
});

function fakeSheet() {
  const rows = [];
  return {
    rows, getLastRow: () => rows.length, getLastColumn: () => rows[0]?.length || 0,
    appendRow: row => rows.push([...row]), setFrozenRows() {},
    getRange(r, c, count, width) { return {
      getValues: () => rows.slice(r - 1, r - 1 + count).map(row => row.slice(c - 1, c - 1 + width)),
      clearContent: () => { for (let i = r - 1; i < r - 1 + (count || 1); i++) for (let j = c - 1; j < c - 1 + (width || 1); j++) rows[i][j] = ''; },
      setValues: values => values.forEach((row, i) => { rows[r - 1 + i] ||= []; row.forEach((v, j) => { rows[r - 1 + i][c - 1 + j] = v; }); }),
    }; },
    deleteRow: row => rows.splice(row - 1, 1),
  };
}

test('receiver deduplicates retries, protects spreadsheets and expires sensitive data', () => {
  const sheets = {};
  const book = { getSheetByName: name => sheets[name], insertSheet: name => sheets[name] = fakeSheet() };
  const secret = 'x'.repeat(40);
  const context = { JSON, Date, Set, Number, Object, String, Error,
    ContentService: { createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }), MimeType: { JSON: 'json' } },
    PropertiesService: { getScriptProperties: () => ({ getProperty: name => name === 'FEEDBACK_SINK_SECRET' ? secret : 'sheet-id' }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    SpreadsheetApp: { openById: () => book, flush() {} },
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('scripts/feedback/Code.gs', 'utf8'), context);
  const send = (feedback, auth = secret) => { const contents = JSON.stringify({ secret: auth, feedback }); return context.doPost({ postData: { contents, length: contents.length } }); };
  const input = { ...valid, detail: '=formula', email: 'person@example.org', consent: true };
  assert.equal(send(input, 'wrong').ok, false);
  assert.equal(send(input).ok, true);
  assert.equal(send(input).ok, true);
  assert.equal(send({ ...input, detail: 'changed' }).ok, false);
  assert.equal(sheets.responses.rows.length, 2);
  assert.equal(sheets.contacts.rows.length, 2);
  assert.equal(sheets.responses.rows[1][6], "'=formula");
  sheets.responses.rows[1][1] = '2020-01-01T00:00:00.000Z';
  sheets.contacts.rows[1][1] = '2020-01-01T00:00:00.000Z';
  context.maintainFeedback();
  assert.equal(sheets.responses.rows[1][6], '');
  assert.equal(sheets.contacts.rows.length, 1);
  assert.equal(sheets.ranking.rows[1][2], 1);
});
