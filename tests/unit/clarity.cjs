const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/clarity.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports: exportsObject });
const { CLARITY_PATH, CLARITY_CONSENT_KEY, readClarityChoice, saveClarityChoice, loadClarity, revokeClarity } = exportsObject;

function fixture(choice) {
  const values = new Map();
  const appended = [];
  const cookies = [];
  const redirects = [];
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  if (choice) saveClarityChoice(storage, choice);
  const win = { localStorage: storage, location: { hostname: 'mfg-compass.com', pathname: CLARITY_PATH, search: '', replace: url => redirects.push(url) } };
  const doc = {
    getElementById: id => appended.find(script => script.id === id),
    createElement: () => ({}),
    head: { appendChild(script) {
      assert.equal(win.clarity.q[0][0], 'consentv2');
      assert.equal(win.clarity.q[0][1].analytics_Storage, 'granted');
      assert.equal(win.clarity.q[0][1].ad_Storage, 'denied');
      appended.push(script);
    } },
    set cookie(value) { cookies.push(value); },
  };
  return { win, doc, storage, values, appended, cookies, redirects };
}

for (const choice of [undefined, 'denied']) {
  const f = fixture(choice);
  assert.equal(loadClarity('ypdavv5xq6', f.win, f.doc), false);
  assert.equal(f.appended.length, 0);
  assert.equal(f.win.clarity, undefined);
}
for (const override of [
  { hostname: 'localhost' }, { hostname: 'preview.vercel.app' },
  { pathname: '/career-compass' }, { pathname: '/tools/cpk' },
  { pathname: '/career-consultation' }, { pathname: '/privacy' },
  { search: '?clarity=off' }, { search: '?input=private' },
]) {
  const f = fixture('granted');
  Object.assign(f.win.location, override);
  assert.equal(loadClarity('ypdavv5xq6', f.win, f.doc), false);
  assert.equal(f.appended.length, 0);
}
for (const value of ['invalid-json', '{}', '{"choice":"granted","expiresAt":0}', '{"choice":"other","expiresAt":9999999999999}']) {
  const f = fixture();
  f.values.set(CLARITY_CONSENT_KEY, value);
  assert.equal(loadClarity('ypdavv5xq6', f.win, f.doc), false);
}
{
  const f = fixture();
  saveClarityChoice(f.storage, 'granted', 1000);
  assert.equal(readClarityChoice(f.storage, 1001), 'granted');
  assert.equal(readClarityChoice(f.storage, 1000 + 180 * 86400000), null);
  Object.defineProperty(f.win, 'localStorage', { get() { throw Error('storage blocked'); } });
  assert.equal(loadClarity('ypdavv5xq6', f.win, f.doc), false);
}
{
  const f = fixture('granted');
  assert.equal(loadClarity('bad/id', f.win, f.doc), false);
  assert.equal(loadClarity('ypdavv5xq6', f.win, f.doc), true);
  assert.equal(loadClarity('ypdavv5xq6', f.win, f.doc), true);
  assert.equal(f.appended.length, 1);
  assert.equal(f.appended[0].src, 'https://www.clarity.ms/tag/ypdavv5xq6');
  saveClarityChoice(f.storage, 'denied');
  revokeClarity(f.win, f.doc);
  assert.equal(f.win.clarity.q[1][1].analytics_Storage, 'denied');
  assert.equal(f.win.clarity.q[2][0], 'stop');
  assert.equal(f.cookies.length, 4);
  assert.deepEqual(f.redirects, [`${CLARITY_PATH}?clarity=off`]);
  assert.equal(readClarityChoice(f.storage), 'denied');
}
{
  const f = fixture();
  f.win.clarity = () => { throw Error('vendor failure'); };
  assert.throws(() => revokeClarity(f.win, f.doc));
  assert.equal(f.cookies.length, 4);
  assert.equal(f.redirects.length, 1);
}
console.log('Clarity privacy guards passed (mock DOM only; no network).');
