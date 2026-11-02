const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const core = require('../../scripts/database/core.cjs');
const catalog = require('../../src/data/database/equipment.json');
function load(file, overrides = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, process, URLSearchParams, require(id) {
    if (id in overrides) return overrides[id];
    if (id.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
    if (id === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
    if (id === '@/lib/analytics') return { trackEquipmentEvent() {} };
    if (id.startsWith('@/')) {
      const stem = 'src/' + id.slice(2);
      if (stem.endsWith('.json')) return JSON.parse(fs.readFileSync(stem, 'utf8'));
      return load([stem + '.ts', stem + '.tsx', path.join(stem, 'index.ts')].find(file => fs.existsSync(file)), overrides);
    }
    if (id.startsWith('.')) {
      const stem = path.resolve(path.dirname(file), id);
      return load([stem, stem + '.ts', stem + '.tsx', path.join(stem, 'index.ts')].find(file => fs.existsSync(file)), overrides);
    }
    return require(id);
  } });
  return exports;
}
const companies = load('src/data/companies.ts').companies;
const processes = load('src/data/database/processes.ts').equipmentProcesses;
const registry = { company: companies.map(c => c.id), process: processes.map(p => p.id) };
const model = load('src/lib/equipment-explorer.ts');
const plain = value => JSON.parse(JSON.stringify(value));
const copy = () => structuredClone(catalog);
// Synthetic source fixtures deliberately omit any network/cache dependency.
function snapshots(input = catalog) {
  return Object.fromEntries(input.records.flatMap(r => r.sources.map(s => {
    const text = [r.name, ...Object.values(r.facts).filter(f => f.status === 'verified').map(f => f.evidence.quote), ...r.relations.map(x => x.evidence.quote)].join(' ');
    return [s.id, { url: s.url, ok: true, text, hash: core.fingerprint(text) }];
  })));
}
test('catalog: 13 models, 6 manufacturers, all explicit facts have evidence', () => {
  assert.equal(catalog.records.length, 13);
  assert.equal(new Set(catalog.records.map(r => r.manufacturerId)).size, 6);
  assert.equal(core.inspect(catalog, registry, snapshots(), '2026-11-03').filter(r => r.errors.length).length, 0);
});
test('fabricated numbers and missing quotes are held', () => {
  const input = copy(); input.records[0].facts.specification.value = '192 nm';
  assert.ok(core.inspect(input, registry, snapshots(), '2026-11-03')[0].errors.includes('value-not-in-quote:specification'));
  input.records[0].facts.feature.evidence.quote = 'invented technical claim';
  assert.ok(core.inspect(input, registry, snapshots(), '2026-11-03')[0].errors.includes('quote-not-in-source:feature'));
});
test('numeric substrings are not accepted as supported values', () => {
  const input = copy(); const fact = input.records[0].facts.specification;
  fact.value = '93 nm';
  assert.ok(core.inspect(input, registry, snapshots(), '2026-11-03')[0].errors.includes('numeric-token-mismatch:specification'));
});
test('foreign manufacturer sources and an unrelated model are rejected', () => {
  const input = copy(); input.records[0].manufacturerId = 'disco';
  assert.ok(core.inspect(input, registry, snapshots(), '2026-11-03')[0].errors.some(e => e.startsWith('manufacturer-source-mismatch')));
  const s = snapshots(); s[catalog.records[0].sources[0].id].text = 'unrelated page';
  s[catalog.records[0].sources[0].id].hash = core.fingerprint('unrelated page');
  assert.ok(core.inspect(catalog, registry, s, '2026-11-03')[0].errors.some(e => e.startsWith('model-not-in-source')));
});
test('both duplicate records, changed source and dangling references are held', () => {
  const input = copy(); input.records.push(structuredClone(input.records[0]));
  const rows = core.inspect(input, registry, snapshots(), '2026-11-03');
  assert.ok(rows[0].errors.includes('invalid-or-duplicate-id'));
  assert.ok(rows.at(-1).errors.includes('duplicate-manufacturer-model'));
  const s = snapshots(); s[catalog.records[0].sources[0].id].changed = true;
  assert.ok(core.inspect(catalog, registry, s, '2026-11-03')[0].errors.some(e => e.startsWith('source-changed')));
  input.records[0].relations[0].target.id = 'missing';
  assert.ok(core.inspect(input, registry, snapshots(), '2026-11-03')[0].errors.includes('dangling-relation'));
});
test('failed downloads and unverified semantics cannot release', () => {
  assert.ok(core.inspect(catalog, registry, {}, '2026-11-03').every(r => r.errors.length));
  const input = copy(); input.records[0].verification.status = 'unconfirmed';
  assert.ok(core.inspect(input, registry, snapshots(), '2026-11-03')[0].errors.includes('semantic-verification-pending'));
});
test('suspension supports record, maker, process and source groups', () => {
  for (const [key, id] of [['recordIds', catalog.records[0].id], ['manufacturerIds', 'asml'], ['processIds', 'expose'], ['sourceIds', catalog.records[0].sources[0].id]]) {
    assert.equal(core.suspended(catalog.records[0], { recordIds: [], manufacturerIds: [], processIds: [], sourceIds: [], [key]: [id] }), true);
  }
});
test('allowlist rejects arbitrary hosts, credentials, HTTP and nonstandard ports', () => {
  for (const url of ['http://www.asml.com/', 'https://www.asml.com.evil.test/', 'https://localhost/', 'https://user:pass@www.asml.com/', 'https://www.asml.com:8443/']) assert.equal(core.officialUrl(url), false);
  assert.equal(core.officialUrl('https://www.asml.com/en/products'), true);
  for (const host of ['www.nikon.com', 'global.canon']) assert.equal(core.officialUrl('https://' + host + '/'), true);
  for (const host of ['nikon.com.evil.test', 'global.canon.evil.test']) assert.equal(core.officialUrl('https://' + host + '/'), false);
  assert.equal(core.sourceText('<script>fake</script><p>193&nbsp;nm &amp; optics</p>'), '193 nm & optics');
});
test('audit sample can be replayed independently of record ordering', () => {
  const ids = catalog.records.map(r => r.id);
  assert.deepEqual(core.auditSample(ids, 'seed', 3), core.auditSample([...ids].reverse(), 'seed', 3));
});
test('filter, multi-token aliases and share URL round-trip', () => {
  const names = Object.fromEntries(companies.map(c => [c.id, c.nameJa]));
  const filters = { ...model.emptyEquipmentFilters, query: 'ＡＳＭＬ EUV', process: 'expose', compare: [catalog.records[0].id, catalog.records[1].id] };
  assert.equal(model.filterEquipment(catalog.records, filters, { ...names, asml: 'ASML' }).length, 2);
  assert.deepEqual(plain(model.parseEquipmentFilters(new URLSearchParams(model.equipmentQuery(filters)), catalog.records)), filters);
  const invalid = model.parseEquipmentFilters(new URLSearchParams('process=bogus&compare=invalid,' + catalog.records[0].id), catalog.records);
  assert.equal(invalid.process, 'all'); assert.deepEqual(plain(invalid.compare), [catalog.records[0].id]);
});
test('comparison is limited to 3 unique models and distinguishes missing facts', () => {
  const ids = ['a', 'b', 'c']; assert.deepEqual(plain(model.toggleEquipmentComparison(ids, 'd')), ids);
  assert.deepEqual(plain(model.toggleEquipmentComparison(ids, 'b')), ['a', 'c']);
  assert.equal(model.factText({ status: 'not-public', reason: 'x' }), '非公開');
  assert.equal(model.factText({ status: 'not-applicable', reason: 'x' }), '該当なし');
  assert.equal(model.factText({ status: 'unconfirmed', reason: 'x' }), '未確認');
});
test('release fingerprints match and data changes cannot silently publish', () => {
  const { getReleasedEquipment } = load('src/lib/equipment-catalog.ts');
  assert.equal(getReleasedEquipment().length, 13);
  const release = require('../../src/data/database/release.json');
  const record = structuredClone(catalog.records[0]); record.summary += ' altered';
  assert.notEqual(core.fingerprint(record), release.records.find(r => r.id === record.id).fingerprint);
});
test('initial HTML contains all names, evidence, Lab links and selected comparison', () => {
  const { EquipmentExplorer } = load('src/components/equipment-explorer/EquipmentExplorer.tsx');
  const html = renderToStaticMarkup(React.createElement(EquipmentExplorer, { records: catalog.records, processes, manufacturers: companies.map(c => ({ id: c.id, name: c.nameJa, href: '/companies/' + c.slug })), initial: { ...model.emptyEquipmentFilters, compare: catalog.records.slice(0, 2).map(r => r.id) } }));
  for (const record of catalog.records) { assert.ok(html.includes(record.name)); assert.ok(html.includes(record.sources[0].url)); }
  assert.ok(html.includes('/tools/cmp-simulator')); assert.ok(html.includes('/tools/litho-simulator'));
  assert.ok(html.includes('<caption>')); assert.ok(html.includes('scope="row"')); assert.ok(html.includes('193 nm'));
});
test('server projection actually removes changed and suspended records', () => {
  const input = copy(); input.records[0].summary += ' modified';
  const model = load('src/lib/equipment-catalog.ts', { '@/data/database/equipment.json': input });
  assert.equal(model.getReleasedEquipment().length, 12);
  const stopped = load('src/lib/equipment-catalog.ts', { '@/data/database/suspensions.json': { recordIds: [], manufacturerIds: ['asml'], processIds: [], sourceIds: [] } });
  assert.equal(stopped.getReleasedEquipment().length, 10);
});
test('cached evidence tampering fails its content hash', () => {
  const s = snapshots(); s[catalog.records[0].sources[0].id].text += ' altered';
  assert.ok(core.inspect(catalog, registry, s, '2026-11-03')[0].errors.some(e => e.startsWith('snapshot-integrity-error')));
});
test('base route indexes, all condition URLs noindex and retain the base canonical', async () => {
  const page = load('src/app/(ja)/equipment/page.tsx');
  const base = await page.generateMetadata({ searchParams: Promise.resolve({}) });
  assert.equal(base.robots.index, true);
  const filtered = await page.generateMetadata({ searchParams: Promise.resolve({ q: 'EUV', compare: 'bogus' }) });
  assert.equal(filtered.robots.index, false); assert.equal(filtered.alternates.canonical, '/equipment');
});

test('exposure comparison retains manufacturer and measurement conditions', () => {
  const exposure = catalog.records.filter(r => r.processIds.includes('expose'));
  assert.deepEqual([...new Set(exposure.map(r => r.manufacturerId))].sort(), ['asml', 'canon', 'nikon']);
  const nikon = exposure.find(r => r.id === 'nikon-nsr-s636e');
  const canon = exposure.find(r => r.id === 'canon-fpa-6300es6a');
  assert.match(nikon.facts.specification.condition, /MMO/);
  assert.match(nikon.facts.throughput.value, /96 shots/);
  assert.match(canon.facts.throughput.condition, /98ショット/);
  const { EquipmentExplorer } = load('src/components/equipment-explorer/EquipmentExplorer.tsx');
  const html = renderToStaticMarkup(React.createElement(EquipmentExplorer, { records: catalog.records, processes, manufacturers: companies.map(c => ({ id: c.id, name: c.nameJa, href: '/companies/' + c.slug })), initial: { ...model.emptyEquipmentFilters, compare: ['asml-nxt1980di', nikon.id, canon.id] } }));
  assert.match(html, /96 shots/); assert.match(html, /98ショット/); assert.match(html, /MMO/);
});
