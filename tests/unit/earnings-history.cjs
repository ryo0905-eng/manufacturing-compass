const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { validateHistory } = require('../../scripts/earnings-history-check.cjs');
const data = require('../../src/data/earnings-history.json');
const snapshot = require('../../src/data/earnings-snapshot.json');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...rest) { return resolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, parent, ...rest); };
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
require.extensions['.css'] = module => { module.exports = new Proxy({}, { get: (_, key) => key === '__esModule' ? false : key }); };
const math = require('../../src/lib/earnings-history-math.ts');
const { AnnualCompanyAnalysis, AnnualMini } = require('../../src/components/earnings/AnnualHistory.tsx');
const { AnnualAmountChart, AnnualLineChart } = require('../../src/components/earnings/AnnualCharts.tsx');
const { AnnualCompare } = require('../../src/components/earnings/AnnualCompare.tsx');
const copy = value => structuredClone(value);
const fixture = () => copy(data.series[0]);

test('all twelve companies have five sourced full years, original currencies and distinct Samsung scope', () => {
  assert.deepEqual(validateHistory(data), []);
  assert.equal(data.series.length, 12);
  assert.equal(data.series.reduce((sum, series) => sum + series.periods.length, 0), 60);
  for (const series of data.series) {
    assert.equal(series.periods[0].currency, snapshot.releases.find(item => item.companyId === series.companyId).currency);
  }
  const samsung = data.series.find(series => series.companyId === 'samsung-electronics');
  assert.ok(samsung.periods.every(period => period.financialScope.startsWith('DS部門')));
  const kla = data.series.find(series => series.companyId === 'kla');
  assert.ok(kla.periods.every(period => period.operatingIncome.calculationInputs.length === 5));
});

test('bad sources, unordered/overlapping periods, missing reasons and incorrect derived financials are rejected', () => {
  let candidate = copy(data);
  candidate.series[0].periods.reverse();
  assert.ok(validateHistory(candidate).some(error => error.includes('unordered')));
  candidate = copy(data); candidate.series[0].periods[0].revenue.source.url = 'https://example.com/fake';
  assert.ok(validateHistory(candidate).some(error => error.includes('source')));
  candidate = copy(data); candidate.series[0].periods[0].revenue = { status: 'unretrieved', value: 0 };
  assert.ok(validateHistory(candidate).some(error => error.includes('not zero')));
  candidate = copy(data); candidate.series.find(series => series.companyId === 'kla').periods[0].operatingIncome.value += 1;
  assert.ok(validateHistory(candidate).some(error => error.includes('calculation mismatch')));
});

test('margin retains losses and handles missing, non-finite and non-positive revenue without division by zero', () => {
  const period = fixture().periods[0];
  period.revenue.value = 20; period.operatingIncome.value = -5;
  assert.equal(math.operatingMargin(period), -25);
  period.operatingIncome = { status: 'unretrieved', reason: '未確認' };
  assert.equal(math.operatingMargin(period), null);
  period.operatingIncome = { status: 'reported', value: 5 };
  for (const value of [0, -10, NaN, Infinity]) { period.revenue.value = value; assert.equal(math.operatingMargin(period), null); }
  assert.ok(math.annualDomain([-30, 0, 50, null]).min < -30);
  assert.ok(math.annualDomain([null]).max > 0);
});

test('index uses the oldest listed period, never substitutes a later baseline or converts currency', () => {
  const series = fixture();
  series.periods.forEach((period, index) => { period.revenue.value = 20 * (index + 1); });
  assert.deepEqual(math.annualPoints(series, 'revenueIndex').map(point => point.value), [100, 200, 300, 400, 500]);
  series.periods.forEach(period => { period.currency = 'JPY'; });
  assert.equal(math.annualPoints(series, 'revenueIndex')[4].value, 500);
  series.periods[0].revenue = { status: 'unretrieved', reason: '起点未取得' };
  assert.ok(math.annualPoints(series, 'revenueIndex').every(point => point.value === null));
});

test('missing points, scope/accounting/currency changes and skipped years break lines and index continuity', () => {
  for (const mutate of [period => period.financialScope = '別部門', period => period.accountingStandard = 'IFRS', period => period.currency = 'JPY', period => period.breakBefore = '比較可能な修正値なし', period => { period.start = '2024-01-01'; period.end = '2024-12-31'; }]) {
    const series = fixture(); mutate(series.periods[2]);
    assert.equal(math.comparableAnnualPeriods(series.periods[1], series.periods[2]), false);
    assert.ok(math.annualLineSegments(math.annualPoints(series, 'margin')).length >= 2);
    assert.equal(math.annualPoints(series, 'revenueIndex')[2].value, null);
  }
  const series = fixture(); series.periods[2].operatingIncome = { status: 'unretrieved', reason: '欠測' };
  assert.deepEqual(math.annualLineSegments(math.annualPoints(series, 'margin')).map(segment => segment.length), [2, 2]);
});

test('SSR exposes all company histories, sources and accessible charts without hovering or JavaScript', () => {
  for (const series of data.series) {
    const html = renderToStaticMarkup(React.createElement(AnnualCompanyAnalysis, { series }));
    assert.match(html, /年次5年の業績/); assert.match(html, /role="img"/); assert.match(html, /<table/);
    series.periods.forEach(period => { assert.ok(html.includes(period.start)); assert.ok(html.includes(period.end)); assert.ok(html.includes(period.revenue.source.url.replaceAll('&', '&amp;'))); });
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size);
  }
  const mixed = fixture(); mixed.periods[2].currency = 'JPY';
  assert.match(renderToStaticMarkup(React.createElement(AnnualAmountChart, { series: mixed })), /通貨・単位が変わるため/);
  const missing = fixture(); missing.periods.forEach(period => period.operatingIncome = { status: 'unretrieved', reason: '公式資料を確認中' });
  const html = renderToStaticMarkup(React.createElement(AnnualCompanyAnalysis, { series: missing }));
  assert.match(html, /公式資料を確認中/); assert.match(html, /算出不可/); assert.ok(!html.includes('NaN'));
  const mini = renderToStaticMarkup(React.createElement(AnnualMini, { series: fixture() }));
  assert.match(mini, /5年間の業績を見る/); assert.match(mini, /<details>/); assert.match(mini, /<table/);
});

function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(node => nodes(node, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
function controller(component, props) {
  const slots = [], events = []; let cursor = 0;
  const filename = path.resolve(`src/components/earnings/${component}.tsx`);
  const exports = {};
  const hooks = { ...React, useState(initial) { const slot = cursor++; if (!(slot in slots)) slots[slot] = typeof initial === 'function' ? initial() : initial; return [slots[slot], value => { slots[slot] = typeof value === 'function' ? value(slots[slot]) : value; }]; } };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, { exports, require(id) { if (id === 'react') return hooks; if (id === '@/lib/analytics') return { trackEvent: (name, properties) => events.push([name, properties]) }; return require(id.startsWith('.') ? path.resolve(path.dirname(filename), id) : id); } }, { filename });
  const render = () => { cursor = 0; return exports[component](props); };
  const button = name => nodes(render(), node => node.type === 'button' && node.props.children === name)[0];
  const input = id => nodes(render(), node => node.type === 'label' && node.key === id).flatMap(node => nodes(node, item => item.type === 'input'))[0];
  return { render, button, input, events };
}

test('annual comparison enforces two to three companies, preserves group defaults and emits actions only on user input', () => {
  const ui = controller('AnnualCompare', { histories: data.series });
  ui.render(); assert.equal(ui.events.length, 0);
  ui.input('kla').props.onChange();
  assert.equal(ui.input('tokyo-electron').props.disabled, true);
  ui.button('選んだ企業を比較する').props.onClick();
  assert.equal(ui.events[0][0], 'earnings_history_action'); assert.equal(ui.events[0][1].company_count, 3);
  ui.input('kla').props.onChange(); ui.input('lam-research').props.onChange();
  ui.button('選んだ企業を比較する').props.onClick(); assert.equal(ui.events.length, 1);
  ui.button('売上高指数').props.onClick(); ui.button('売上高指数').props.onClick();
  assert.equal(ui.events.length, 2); assert.equal(ui.events[1][1].ui_version, 'annual-v1');
  ui.button('メモリ関連').props.onClick(); assert.equal(ui.input('kioxia').props.checked, true);
  const seeded = controller('AnnualCompare', { histories: data.series, initialGroup: 'memory', initialCompany: 'samsung-electronics' });
  assert.equal(seeded.input('samsung-electronics').props.checked, true);
  assert.equal(seeded.events.length, 0);
});

test('detail and comparison pages SSR include history, canonical metadata and query noindex without changing latest releases', async () => {
  const Detail = require('../../src/app/(ja)/semiconductor-watch/earnings/[companyId]/page.tsx');
  const Compare = require('../../src/app/(ja)/semiconductor-watch/earnings/compare/page.tsx');
  const before = JSON.stringify(snapshot);
  const detail = renderToStaticMarkup(await Detail.default({ params: Promise.resolve({ companyId: 'asml' }) }));
  assert.match(detail, /annual-history/); assert.match(detail, /今回の決算で押さえること/); assert.match(detail, /主要数値/);
  const html = renderToStaticMarkup(await Compare.default({ searchParams: Promise.resolve({ group: 'memory', company: 'samsung-electronics' }) }));
  assert.match(html, /年次5年/); assert.match(html, /最新四半期/); assert.match(html, /DS部門/); assert.match(html, /各社の最新発表/);
  const metadata = await Compare.generateMetadata({ searchParams: Promise.resolve({ group: 'memory' }) });
  assert.equal(metadata.robots.index, false);
  assert.equal(metadata.alternates.canonical, '/semiconductor-watch/earnings/compare');
  assert.equal((await Compare.generateMetadata({ searchParams: Promise.resolve({}) })).robots.index, true);
  assert.equal(JSON.stringify(snapshot), before);
});
