const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, dependencies = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, { exports, require: id => { if (!(id in dependencies)) throw Error(id); return dependencies[id]; }, TextEncoder, ...globals });
  return exports;
}
const reportData = load('src/data/improvement-report.ts');
const lib = load('src/lib/tool-workspace.ts', { '@/data/improvement-report': reportData });
const plain = value => JSON.parse(JSON.stringify(value));
const cpk = { mode: 'raw', rawData: '1\n2\n3', mean: '', standardDeviation: '', lsl: '-', usl: '' };
const comparison = { nameA: '私的な条件名', nameB: '<script>alert(1)</script>', measurement: '厚さ', unit: 'nm', dataA: '1\n2', dataB: '3\n4', lower: '', upper: '1e' };
function rejects(fn, code) { assert.throws(fn, e => e instanceof lib.WorkspaceError && e.code === code); }
for (const [tool, input] of [['cpk', cpk], ['cpk', { ...cpk, mode: 'summary', mean: '1e', standardDeviation: '-' }], ['process-comparison', comparison], ['process-comparison', Object.fromEntries(Object.keys(comparison).map(key => [key, '']))]]) {
  const text = lib.serializeWorkspace(tool, { ...input, result: 'must not be saved' });
  assert.deepEqual(plain(lib.parseWorkspace(text, tool)), input);
  assert.ok(!text.includes('must not be saved'));
  const env = JSON.parse(text);
  env.input.__proto__ = { arbitrary: 'inherited' }; env.input.extra = 'ignored';
  assert.deepEqual(plain(lib.parseWorkspace(JSON.stringify(env), tool)), input);
}
const valid = lib.serializeWorkspace('cpk', cpk);
rejects(() => lib.parseWorkspace('{', 'cpk'), 'json');
rejects(() => lib.parseWorkspace('null', 'cpk'), 'format');
rejects(() => lib.parseWorkspace(valid.replace('"version": 1', '"version": 99'), 'cpk'), 'version');
rejects(() => lib.parseWorkspace(valid, 'process-comparison'), 'tool');
rejects(() => lib.parseWorkspace(valid.replace('"raw"', '"other"'), 'cpk'), 'input');
rejects(() => lib.serializeWorkspace('cpk', { ...cpk, rawData: 1 }), 'input');
rejects(() => lib.serializeWorkspace('cpk', { ...cpk, rawData: 'あ'.repeat(lib.workspaceMaxBytes / 2) }), 'size');
const sizeBase = lib.serializeWorkspace('cpk', { ...cpk, rawData: '' });
const max = { ...cpk, rawData: 'x'.repeat(lib.workspaceMaxBytes - new TextEncoder().encode(sizeBase).length) };
const exact = lib.serializeWorkspace('cpk', max);
assert.equal(new TextEncoder().encode(exact).length, lib.workspaceMaxBytes);
assert.equal(lib.parseWorkspace(exact, 'cpk').rawData.length, max.rawData.length);
rejects(() => lib.parseWorkspace(exact + ' ', 'cpk'), 'size');
assert.equal(lib.workspaceFilename('cpk', new Date(2026, 8, 23)), 'mfg-compass-cpk-2026-09-23.json');

function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(node => nodes(node, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
async function uiTest(locale, tool, input) {
  let cursor = 0; const slots = [], events = [], restored = [], blobs = [], downloads = [], revoked = [];
  const react = {
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { slots[i] = value; }]; },
    useRef(initial) { const i = cursor++; return slots[i] ??= { current: initial }; }, useEffect() {},
  };
  const { ToolWorkspaceFile } = load('src/components/ToolWorkspaceFile.tsx', {
    react, 'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    '@/lib/tool-workspace': lib, '@/lib/analytics': { trackEvent: (name, props) => events.push({ name, props }) }, './ToolWorkspaceFile.module.css': { default: {} },
  }, { Blob, URL: { createObjectURL(blob) { blobs.push(blob); return 'blob:test'; }, revokeObjectURL(url) { revoked.push(url); } }, setTimeout(fn) { fn(); }, document: { body: { appendChild() {} }, createElement() { return { click() { downloads.push(this.download); }, remove() {} }; } } });
  function render() { cursor = 0; return ToolWorkspaceFile({ tool, locale, input, onRestore: next => restored.push(next) }); }
  function click(ja, en) { const button = nodes(render(), node => node.type === 'button' && node.props.children === (locale === 'ja' ? ja : en))[0]; assert.ok(button); button.props.onClick(); }
  async function read(text, size = new TextEncoder().encode(text).length) {
    nodes(render(), node => node.type === 'input')[0].props.onChange({ currentTarget: { files: [{ size, text: async () => text }], value: 'file' } });
    await new Promise(resolve => setImmediate(resolve));
  }
  click('入力を保存', 'Save inputs');
  assert.equal(downloads.length, 1); assert.equal(revoked.length, 1);
  const saved = await blobs[0].text();
  assert.deepEqual(plain(lib.parseWorkspace(saved, tool)), input);
  await read(saved); assert.equal(restored.length, 0, 'Reading alone must not replace inputs');
  click('キャンセル', 'Cancel'); assert.equal(restored.length, 0);
  await read(saved); click('現在の入力を置き換える', 'Replace current inputs');
  assert.deepEqual(plain(restored[0]), input);
  assert.ok(JSON.stringify(render()).includes(locale === 'ja' ? '再計算してください' : 'Calculate again'));
  await read('{'); assert.equal(restored.length, 1);
  await read(saved, lib.workspaceMaxBytes + 1); assert.equal(restored.length, 1);
  assert.equal(events.filter(e => e.props.outcome === 'restored').length, 1);
  for (const event of events) {
    assert.equal(event.name, 'tool_workspace_file');
    assert.deepEqual(Object.keys(event.props).sort(), ['action','locale','outcome','tool_id']);
  }
  assert.ok(!JSON.stringify(events).includes('私的'));
}
(async () => {
  await uiTest('ja', 'improvement-report', { ...comparison, ...reportData.sampleReportNotes });
  for (const locale of ['ja', 'en']) { await uiTest(locale, 'cpk', cpk); await uiTest(locale, 'process-comparison', comparison); }
  console.log('PASS: workspace round trips, unfinished inputs, byte limit, schema rejection, confirmation/cancel, download cleanup and private telemetry (mock UI).');
})().catch(error => { console.error(error); process.exitCode = 1; });
