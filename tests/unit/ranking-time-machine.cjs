const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '../..');
const plain = value => JSON.parse(JSON.stringify(value));

function loader(overrides = {}, globals = {}) {
  const cache = new Map();
  function load(file) {
    if (!path.isAbsolute(file)) file = path.join(root, file);
    if (file.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
    if (!path.extname(file)) {
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index');
      file += fs.existsSync(file + '.tsx') ? '.tsx' : '.ts';
    }
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    vm.runInNewContext(code, { exports, process: { env: { NODE_ENV: 'test' } }, ...globals, require: id => {
      if (id in overrides) return overrides[id];
      if (id === '@next/third-parties/google') return { sendGAEvent() { throw Error('GA must be off in tests'); } };
      if (id === '@vercel/analytics') return { track() {} };
      if (id === '@/lib/format') return { siteUrl: 'https://mfg-compass.com' };
      if (id === 'next/link') return { __esModule: true, default: props => React.createElement('a', props) };
      if (id.startsWith('@/')) return load(path.join(root, 'src', id.slice(2)));
      if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id));
      return require(id);
    } }, { filename: file });
    return exports;
  }
  return load;
}
const load = loader();
const data = load('src/data/ranking-time-machine.ts');
const lib = load('src/lib/ranking-time-machine.ts');
const companies = data.rankingTimeMachineCompanies;
const snapshots = data.rankingTimeMachineSnapshots;
const timeline = lib.prepareRanking(companies, snapshots);
assert.equal(companies.length, 20);
assert.equal(companies.filter(c => c.category === '製造装置').length, 5);
assert.equal(snapshots.length, 11);
assert.equal(snapshots.flatMap(s => s.entries).length, 220);
assert.deepEqual(plain(snapshots.map(s => s.year)), Array.from({ length: 11 }, (_, i) => 2015 + i));
const companyRegistry = load('src/data/companies.ts');
for (const company of companies) {
  assert.match(company.sourceUrl, /^https:\/\/companiesmarketcap.com\/[^/]+\/marketcap\/$/);
  if (company.companySlug) assert.ok(companyRegistry.getCompanyBySlug(company.companySlug), company.companySlug);
}
const at = (year, id) => timeline.find(s => s.year === year).rows.find(c => c.id === id);
assert.equal(at(2015, 'nvidia').valueUsdB, 17.73);
assert.equal(at(2015, 'intel').valueUsdB, 162.77);
assert.equal(at(2020, 'nvidia').valueUsdB, 323.24);
assert.equal(at(2025, 'nvidia').valueUsdB, 4638);
assert.equal(at(2025, 'tsmc').valueUsdB, 1570);
assert.ok(at(2015, 'intel').rank < at(2015, 'nvidia').rank);
assert.ok(at(2020, 'intel').rank > at(2020, 'nvidia').rank);
assert.ok(at(2015, 'amd').rank > 10 && at(2025, 'amd').rank <= 10);
assert.match(at(2015, 'broadcom').displayName, /^Avago/);
assert.equal(at(2016, 'broadcom').displayName, 'Broadcom');
assert.equal(lib.rankChange(9, 2), '7位上昇');
assert.equal(lib.rankChange(2, 9), '7位下降');
assert.equal(lib.rankChange(2, 2), '変化なし');

const fixtureCompanies = ['z', 'b', 'a'].map(id => ({ id, name: id, category: 'fixture', sourceUrl: 'https://example.com' }));
const fixture = { year: 2020, entries: [{ companyId: 'z', valueUsdB: 2 }, { companyId: 'b', valueUsdB: 3 }, { companyId: 'a', valueUsdB: 3 }] };
const original = JSON.stringify(fixture);
assert.deepEqual(plain(lib.rankSnapshot(fixtureCompanies, fixture).map(r => [r.id, r.rank])), [['a', 1], ['b', 1], ['z', 3]]);
assert.equal(JSON.stringify(fixture), original);
for (const invalid of [0, -1, NaN, Infinity]) assert.throws(() => lib.rankSnapshot(fixtureCompanies, { ...fixture, entries: fixture.entries.map((entry, i) => i ? entry : { ...entry, valueUsdB: invalid }) }));
assert.throws(() => lib.rankSnapshot(fixtureCompanies, { ...fixture, entries: fixture.entries.slice(1) }));
assert.throws(() => lib.rankSnapshot(fixtureCompanies, { ...fixture, entries: [fixture.entries[0], fixture.entries[0], fixture.entries[2]] }));
assert.throws(() => lib.rankSnapshot(fixtureCompanies, { ...fixture, entries: fixture.entries.map((e, i) => i ? e : { ...e, companyId: 'missing' }) }));
assert.throws(() => lib.prepareRanking(companies, []));
assert.throws(() => lib.prepareRanking(companies, [snapshots[0], snapshots[2]]));
assert.throws(() => lib.prepareRanking(companies, [snapshots[0], snapshots[0]]));

// Optional one-time verification against the independently retained web extraction.
if (process.env.RANKING_SOURCE_CHECK) {
  const source = JSON.parse(fs.readFileSync(process.env.RANKING_SOURCE_CHECK, 'utf8'));
  assert.deepEqual(plain(snapshots), source.snapshots);
  console.log('All 220 values match the retained source extraction.');
}

function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(item => nodes(item, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}

// Exercise actual controller handlers/effects with deterministic timers; no browser or server.
const slots = [], effects = [], events = [], timers = new Map(), listeners = new Map();
let cursor = 0, nextTimer = 0, focused = 0;
const documentStub = { hidden: false, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name), getElementById: () => ({ focus: () => focused++ }) };
const hooks = {
  ...React,
  useMemo: fn => { cursor++; return fn(); },
  useReducer: (reducer, initial) => { const slot = cursor++; if (!(slot in slots)) slots[slot] = initial; return [slots[slot], action => { slots[slot] = reducer(slots[slot], action); }]; },
  useEffect: (fn, deps) => { const slot = cursor++; const old = effects[slot]; if (!old || deps.some((dep, i) => !Object.is(dep, old.deps[i]))) { old?.cleanup?.(); effects[slot] = { deps, pending: fn }; } },
};
const uiLoad = loader({ react: hooks, '@vercel/analytics': { track: (...args) => events.push(args) } }, {
  document: documentStub, window: { setTimeout: (fn, ms) => { assert.equal(ms, 3000); timers.set(++nextTimer, fn); return nextTimer; }, clearTimeout: id => timers.delete(id) }, requestAnimationFrame: fn => fn(),
});
const { RankingTimeMachine } = uiLoad('src/components/ranking-time-machine/RankingTimeMachine.tsx');
function render() { cursor = 0; const tree = RankingTimeMachine({ companies, snapshots }); for (const effect of effects) if (effect?.pending) { effect.cleanup = effect.pending(); delete effect.pending; } return tree; }
const props = name => nodes(render(), node => node.type?.name === name)[0].props;
const controls = () => props('TimelineControls');
function tick() { const [id, fn] = timers.entries().next().value; timers.delete(id); fn(); render(); }
assert.equal(controls().index, 0);
assert.equal(timers.size, 0);
controls().onPlay(); render(); assert.equal(timers.size, 1);
tick(); assert.equal(controls().index, 1);
assert.equal(events.length, 1); // No automatic year event.
controls().onPause(); render(); assert.equal(timers.size, 0);
controls().onYear(5); render(); assert.equal(events.length, 2);
controls().onYearCommit(5); assert.equal(events.at(-1)[1].year, 2020);
controls().onPlay(); render();
props('RankingRaceChart').onSelect('amd'); render();
assert.equal(timers.size, 0); assert.equal(props('CompanyDetail').companyId, 'amd'); assert.equal(focused, 1);
controls().onPlay(); render(); documentStub.hidden = true; listeners.get('visibilitychange')(); render();
assert.equal(timers.size, 0); documentStub.hidden = false;
controls().onYear(9); render(); controls().onPlay(); render(); tick();
assert.equal(controls().index, 10); assert.equal(controls().playing, false); assert.equal(timers.size, 0);
controls().onPlay(); render(); assert.equal(controls().index, 0);
controls().onReset(); render(); assert.equal(controls().index, 0); assert.equal(props('CompanyDetail').companyId, ''); assert.equal(timers.size, 0);
for (const [event, properties] of events) {
  assert.match(event, /^ranking_timemachine_(play|pause|year_change|company_click)$/);
  assert.equal(properties.ranking_type, 'market_cap'); assert.equal(properties.data_kind, 'real');
  assert.ok(properties.year >= 2015 && properties.year <= 2025);
}
const related = nodes(render(), node => node.props?.eventName === 'ranking_timemachine_related_click');
assert.equal(related.length, 5);
for (const link of related) assert.equal(link.props.eventProperties.year, 2015);
for (const effect of effects) effect?.cleanup?.();
assert.equal(listeners.size, 0); assert.equal(timers.size, 0);

// Slider input updates immediately but commits once per pointer/keyboard/blur interaction.
const refs = []; let refIndex = 0, changes = [], commits = [];
const sliderLoad = loader({ react: { ...React, useRef: initial => refs[refIndex++] ?? (refs[refIndex - 1] = { current: initial }) } });
const { TimelineControls } = sliderLoad('src/components/ranking-time-machine/TimelineControls.tsx');
refIndex = 0;
const sliderTree = TimelineControls({ years: snapshots.map(s => s.year), index: 0, playing: false, onPlay() {}, onPause() {}, onReset() {}, onYear: n => changes.push(n), onYearCommit: n => commits.push(n) });
const input = nodes(sliderTree, node => node.type === 'input')[0].props;
input.onChange({ target: { value: '2' } }); input.onChange({ target: { value: '4' } });
assert.deepEqual(changes, [2, 4]); assert.deepEqual(commits, []);
input.onPointerUp(); input.onBlur(); assert.deepEqual(commits, [4]);
input.onChange({ target: { value: '5' } }); input.onKeyUp(); input.onBlur(); assert.deepEqual(commits, [4, 5]);

const page = load('src/app/(ja)/tools/ranking-time-machine/page.tsx');
const html = renderToStaticMarkup(React.createElement(page.default));
assert.equal(page.metadata.alternates.canonical, '/tools/ranking-time-machine');
assert.equal(page.metadata.robots.index, true);
assert.match(html, /<caption>2015/);
assert.match(html, /選定20社内/); assert.match(html, /各年の世界全体の上位10社を再現するものではありません/);
assert.match(html, /Avago Technologies/); assert.match(html, /CompaniesMarketCap/); assert.match(html, /<noscript>/);
assert.match(html, /WebApplication/); assert.match(html, /BreadcrumbList/);
assert.equal((html.match(/data-visible="true"/g) || []).length, 10);
assert.equal((html.match(/data-visible="false"/g) || []).length, 10);
assert.equal((html.match(/<tbody>/g) || []).length, 1);
assert.equal((html.match(/<tr[ >]/g) || []).length, 21);
for (const company of companies) assert.ok(html.includes(company.sourceUrl));
for (const destination of ['/industry-map', '/semiconductor-map', '/compare', '/guides/semiconductor-market-cap-ranking', '/guides/semiconductor-equipment-sales-ranking']) assert.ok(html.includes(`href="${destination}"`));
const { CompanyDetail } = load('src/components/ranking-time-machine/CompanyDetail.tsx');
const detail = renderToStaticMarkup(React.createElement(CompanyDetail, { companyId: 'amd', timeline, index: 10 }));
assert.match(detail, /href="\/companies\/amd"/);
assert.equal((detail.match(/<tr[ >]/g) || []).length, 12);
const mediaTek = renderToStaticMarkup(React.createElement(CompanyDetail, { companyId: 'mediatek', timeline, index: 0 }));
assert.ok(!mediaTek.includes('/companies/mediatek'));
for (const file of ['src/content/guides/semiconductor-market-cap-ranking.ts', 'src/content/guides/semiconductor-equipment-sales-ranking.ts', 'src/app/(ja)/tools/page.tsx']) assert.ok(fs.readFileSync(path.join(root, file), 'utf8').includes('/tools/ranking-time-machine'));
assert.match(fs.readFileSync(path.join(root, 'src/app/sitemap.ts'), 'utf8'), /rankingTimeMachineMetadata\.route/);
console.log('Ranking time machine: data, rank ties, missing values, playback, slider commits, selection, visibility cleanup, analytics and SSR passed. Browser layout and production delivery are not covered.');
