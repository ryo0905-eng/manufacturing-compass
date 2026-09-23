const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, dependencies = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, { exports, require: name => { if (name === '@/data/improvement-report') return load('src/data/improvement-report.ts'); if (name === '@/components/ImprovementReportEditor') return { ImprovementReportEditor: 'ReportEditor', reportAction() {} }; if (name === '@/components/ToolWorkspaceFile') return { ToolWorkspaceFile: 'WorkspaceFile' }; if (name === '@/components/PracticalToolNextSteps') return { PracticalToolNextSteps: 'NextSteps' }; if (name === '@/lib/use-practical-tool-journey') return load('src/lib/use-practical-tool-journey.ts', { ...dependencies, react: { ...dependencies.react, useEffect() {} }, '@/lib/observe-visible': { observeVisibleOnce() {} } }); if (name === '@/data/practical-tool-text') return load('src/data/practical-tool-text.ts'); if (!(name in dependencies)) throw Error(name); return dependencies[name]; }, ...globals }, { filename: file });
  return exports;
}
const lib = load('src/lib/process-comparison.ts');
const base = { nameA: '前', nameB: '後', measurement: '膜厚', unit: 'nm', dataA: '1\n2\n3', dataB: '2\n4', lower: '2', upper: '3' };
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`);
const result = lib.compareProcesses(base);
near(result.a.mean, 2); near(result.a.median, 2); near(result.a.sd, 1);
near(result.b.mean, 3); near(result.b.median, 3); near(result.b.sd, Math.sqrt(2)); near(result.difference, 1);
assert.equal(result.a.inside, 2); assert.equal(result.b.inside, 1);
near(result.a.rate, 200 / 3);
for (const bins of [result.histogram.a, result.histogram.b]) near(bins.reduce((a, b) => a + b), 100);
assert.equal(result.histogram.a.length, result.histogram.b.length);
assert.equal(lib.compareProcesses({ ...base, lower: '', upper: '2' }).a.inside, 2);
assert.equal(lib.compareProcesses({ ...base, lower: '2', upper: '' }).a.inside, 2);
assert.equal(lib.compareProcesses({ ...base, lower: '', upper: '' }).a.rate, undefined);
assert.equal(lib.parseMeasurements('\n -1\r\n\n+2e1\r.5', 'A').join(','), '-1,20,0.5');
for (const data of ['1\n\nno', '1\nInfinity', '1\nNaN', '1\n1,200', '1\n2\t3', '1\n0x10', '1\n1e309']) assert.throws(() => lib.compareProcesses({ ...base, dataA: data }), /行目/);
assert.throws(() => lib.parseMeasurements('1\n\nno', 'A'), /3行目/);
assert.throws(() => lib.compareProcesses({ ...base, dataA: '1' }), /2件/);
assert.throws(() => lib.compareProcesses({ ...base, lower: '3', upper: '3' }), /下限規格/);
assert.throws(() => lib.compareProcesses({ ...base, lower: 'oops' }), /下限規格/);
const identical = lib.compareProcesses({ ...base, dataA: Array(10000).fill('7').join('\n'), dataB: '7\n7', lower: '', upper: '' });
assert.equal(identical.a.count, 10000); assert.equal(identical.a.sd, 0); assert.equal(identical.difference, 0);
assert.ok(identical.histogram.max > identical.histogram.min);
assert.throws(() => lib.compareProcesses({ ...base, dataA: Array(10001).fill('1').join('\n') }), /10,000件/);
assert.throws(() => lib.compareProcesses({ ...base, dataA: '-1e308\n1e308' }), /単位を換算/);
const negative = lib.compareProcesses({ ...base, dataA: '-3\n-1', dataB: '-2\n0', lower: '', upper: '' }); near(negative.difference, 1);
const tsv = lib.comparisonTsv(result);
for (const row of lib.comparisonRows(result)) assert.ok(tsv.includes(row.join('\t')));
const svg = lib.comparisonSvg(result);
for (const expected of ['前（n=3）', '後（n=2）', 'nm', 'LSL', 'USL', '下限 2 / 上限 3']) assert.ok(svg.includes(expected));
assert.ok(!svg.includes('NaN')); assert.ok(!svg.includes('Infinity'));
const hostile = lib.compareProcesses({ ...base, nameA: '<script>&"', nameB: '=1+1', measurement: '=1+1\tbad' });
assert.ok(!lib.comparisonSvg(hostile).includes('<script>'));
assert.ok(lib.comparisonSvg(hostile).includes('&lt;script&gt;'));
assert.ok(!lib.comparisonTsv(hostile).split(/[\t\n]/).some(cell => cell.startsWith('=')));
function nodes(tree, test) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(item => nodes(item, test));
  return [...(test(tree) ? [tree] : []), ...nodes(tree.props?.children, test)];
}
const element = (type, props) => ({ type, props });
async function uiTest(clipboardFails) {
  const slots = []; let cursor = 0; const events = []; let copied, exported;
  const react = { useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { slots[i] = value; }]; }, useRef(initial) { const i = cursor++; if (!(i in slots)) slots[i] = { current: initial }; return slots[i]; } };
  const { ProcessComparisonTool } = load('src/components/ProcessComparisonTool.tsx', {
    '@/data/process-comparison-sample': load('src/data/process-comparison-sample.ts'),
    react, 'react/jsx-runtime': { jsx: element, jsxs: element }, '@/lib/analytics': { trackEvent: (...args) => events.push(args) }, '@/lib/process-comparison': lib,
    '@/lib/process-comparison-export': { downloadComparisonPng: async text => { exported = text; } }, '@/app/(ja)/tools/process-comparison/comparison.module.css': { default: {} },
  }, { navigator: { clipboard: { writeText: async text => { if (clipboardFails) throw Error('denied'); copied = text; } } } });
  const render = () => { cursor = 0; return ProcessComparisonTool(); };
  const button = label => nodes(render(), n => n.type === 'button' && n.props.children === label)[0];
  button('架空データで試す').props.onClick();
  nodes(render(), n => n.type === 'form')[0].props.onSubmit({ preventDefault() {} });
  const img = nodes(render(), n => n.type === 'img')[0];
  await button('図をPNGで保存').props.onClick();
  assert.equal(exported, decodeURIComponent(img.props.src.split(',').slice(1).join(',')));
  await button('表をコピー（Excel用）').props.onClick();
  const screenValues = nodes(render(), n => n.type === 'td').slice(0, 18).map(n => n.props.children).filter(Boolean);
  const fallback = nodes(render(), n => n.type === 'textarea' && n.props.readOnly)[0];
  const output = clipboardFails ? fallback.props.value : copied;
  for (const value of screenValues) assert.ok(output.includes(value));
  assert.equal(Boolean(fallback), clipboardFails);
  if (fallback) { let selected = false; fallback.props.onFocus({ currentTarget: { select() { selected = true; } } }); assert.ok(selected); }
  assert.ok(events.every(event => event[0] === 'tool_step'
    ? event[1].tool_id === 'process-comparison' && Object.keys(event[1]).every(key => ['tool_id', 'locale', 'ui_version', 'step', 'data_source'].includes(key))
    : event.length === 1 && /^process_comparison_(started|completed|copied|png_exported)$/.test(event[0])));
  assert.equal(events.filter(event => event[0] === 'tool_step' && event[1].step === 'sample').length, 1);
  assert.equal(events.filter(e => e[0] === 'process_comparison_copied').length, clipboardFails ? 0 : 1);
  nodes(render(), n => n.type === 'WorkspaceFile')[0].props.onRestore({ ...base });
  assert.equal(nodes(render(), n => n.type === 'img').length, 0);
  assert.equal(nodes(render(), n => n.type === 'textarea' && n.props.readOnly).length, 0);
  assert.equal(nodes(render(), n => n.type === 'input')[0].props.value, base.nameA);
  nodes(render(), n => n.type === 'input')[0].props.onChange({ target: { value: '新条件' } });
  assert.equal(nodes(render(), n => n.type === 'img').length, 0);
  assert.equal(nodes(render(), n => n.type === 'textarea' && n.props.readOnly).length, 0);
}
async function exportTest() {
  let drawn, clicked = false; const blobs = []; const revoked = [];
  class Image { set src(value) { this.source = value; this.onload(); } }
  const { downloadComparisonPng } = load('src/lib/process-comparison-export.ts', {}, {
    Blob, Image, URL: { createObjectURL(blob) { blobs.push(blob); return `blob:${blobs.length}`; }, revokeObjectURL(url) { revoked.push(url); } }, setTimeout(fn) { fn(); },
    document: { body: { appendChild() {} }, createElement(type) { return type === 'canvas' ? { getContext: () => ({ drawImage: (...args) => { drawn = args; } }), toBlob: (callback, format) => { assert.equal(format, 'image/png'); callback(new Blob(['png'])); } } : { click() { clicked = true; assert.equal(this.download, 'process-comparison.png'); }, remove() {} }; } },
  });
  await downloadComparisonPng(svg);
  assert.equal(await blobs[0].text(), svg); assert.equal(drawn[0].source, 'blob:1'); assert.equal(drawn.slice(1).join(','), '0,0,2000,1280'); assert.ok(clicked); assert.equal(revoked.length, 2);
}
(async () => { await uiTest(false); await uiTest(true); await exportTest(); console.log('process-comparison: calculations, validation, exports, UI state and privacy passed'); })().catch(error => { console.error(error); process.exitCode = 1; });
