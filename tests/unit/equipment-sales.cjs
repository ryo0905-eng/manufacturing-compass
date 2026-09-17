const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
function load(relative) {
  const filename = path.join(root, relative);
  const result = {};
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, { exports: result }, { filename });
  return result;
}
const { equipmentSalesCompanies: companies, equipmentProcesses: processes } = load('src/data/semiconductor-equipment-sales.ts');
const { getEquipmentSalesView: view } = load('src/lib/equipment-sales.ts');
const plain = (value) => JSON.parse(JSON.stringify(value));
assert.equal(companies.length, 10);
assert.deepEqual(plain(companies.map(c => c.salesUsdB)), [35.96, 26.93, 20.56, 15.74, 12.61, 6.17, 4.09, 3.57, 3.16, 2.37]);
assert.deepEqual(plain(companies.map(c => c.rank)), [1,2,3,4,5,6,7,8,9,10]);
const baseline = view(companies, 'all');
const fixed = rows => plain(rows.map(r => [r.company.id, r.company.rank, r.company.salesUsdB, r.barPercent]));
for (const process of processes) {
  const selected = view(companies, process.id);
  assert.deepEqual(fixed(selected), fixed(baseline), `${process.id}: preserve order, values and scale`);
  assert.ok(selected.some(row => row.matches));
}
const ids = selection => plain(view(companies, selection).filter(r => r.matches).map(r => r.company.id));
assert.deepEqual(ids('lithography'), ['asml', 'screen']); // Coater/developer is not an exposure tool.
assert.deepEqual(ids('test'), ['tokyo-electron', 'advantest', 'teradyne']); // Includes probers.
assert.deepEqual(ids('assembly'), ['applied-materials', 'tokyo-electron']);
assert.ok(ids('deposition').includes('kla'));
assert.ok(ids('inspection').includes('lam-research'));
const fixture = [{ id: 'one', rank: 1, name: 'One', salesUsdB: 2, capabilities: [{ process: 'deposition' }, { process: 'etch' }] }];
assert.equal(view(fixture, 'deposition')[0].matches, true);
assert.equal(view(fixture, 'etch')[0].matches, true);
assert.equal(view(fixture, 'test').filter(r => r.matches).length, 0);
assert.equal(view(fixture, 'all').filter(r => r.matches).length, 1);
assert.equal(view([], 'all').length, 0);
assert.equal(view([{ ...fixture[0], salesUsdB: 0 }], 'all')[0].barPercent, 0);
for (const company of companies) for (const cap of company.capabilities) {
  assert.ok(processes.some(p => p.id === cap.process));
  assert.match(cap.sourceUrl, /^https:\/\//);
}
for (const process of processes) assert.ok(fs.existsSync(path.join(root, 'src/content/guides', process.guideSlug + '.ts')));
console.log('Equipment sales: source values, all processes, fixed scale/order, boundaries, empty results and reset passed.');

// Server rendering verifies that factual content survives without browser JavaScript.
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const cache = new Map();
function loadRenderable(filename) {
  if (cache.has(filename)) return cache.get(filename);
  const result = {};
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const localRequire = (id) => {
    if (id.endsWith('.module.css')) return new Proxy({}, { get: (_, name) => String(name) });
    if (id === '@/lib/analytics') return { trackEvent() {} };
    if (id === '@/components/TrackedInternalLink') return { TrackedInternalLink: ({ eventName, eventProperties, ...props }) => React.createElement('a', props) };
    if (id.startsWith('@/') || id.startsWith('.')) {
      const stem = id.startsWith('@/') ? path.join(root, 'src', id.slice(2)) : path.resolve(path.dirname(filename), id);
      const file = ['.ts', '.tsx'].map(ext => stem + ext).find(fs.existsSync);
      return loadRenderable(file);
    }
    return require(id);
  };
  vm.runInNewContext(code, { exports: result, require: localRequire }, { filename });
  cache.set(filename, result);
  return result;
}
const { EquipmentSalesRanking } = loadRenderable(path.join(root, 'src/components/EquipmentSalesRanking.tsx'));
const html = renderToStaticMarkup(React.createElement(EquipmentSalesRanking));
assert.equal((html.match(/<button /g) || []).length, 8);
assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
assert.match(html, /role="status"/);
assert.match(html, /<noscript>/);
assert.equal((html.match(/<tr>/g) || []).length, 11);
assert.match(html, /<caption>2025年/);
assert.match(html, /公式製品情報/);
for (const company of companies) assert.ok(html.includes(company.salesUsdB.toFixed(2)));
const { semiconductorEquipmentSalesRankingGuide: guide } = loadRenderable(path.join(root, 'src/content/guides/semiconductor-equipment-sales-ranking.ts'));
assert.equal(guide.status, 'published');
assert.ok(guide.sections.some(section => section.blocks?.some(block => block.type === 'equipment-sales-ranking')));
console.log('Equipment sales SSR: buttons, selected state, live region, no-JS table, sources and publication status passed.');
