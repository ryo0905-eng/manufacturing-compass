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
    vm.runInNewContext(code, { exports, URLSearchParams, process: { env: { NODE_ENV: 'test' } }, ...globals, require: id => {
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
assert.equal(data.rankingTimeMachineMetadata.firstYear, 2010);
assert.equal(data.rankingTimeMachineMetadata.lastYear, 2025);
assert.equal(companies.filter(c => c.category === '製造装置').length, 5);
assert.equal(snapshots.length, 16);
assert.equal(snapshots.flatMap(s => s.entries).length, 320);
assert.deepEqual(plain(snapshots.map(s => s.year)), Array.from({ length: 16 }, (_, i) => 2010 + i));
const companyRegistry = load('src/data/companies.ts');
for (const company of companies) {
  assert.match(company.sourceUrl, /^https:\/\/companiesmarketcap.com\/[^/]+\/marketcap\/$/);
  if (company.companySlug) assert.ok(companyRegistry.getCompanyBySlug(company.companySlug), company.companySlug);
}
const at = (year, id) => timeline.find(s => s.year === year).rows.find(c => c.id === id);
assert.equal(at(2010, 'nvidia').valueUsdB, 8.94);
assert.equal(at(2010, 'intel').valueUsdB, 115.89);
assert.equal(at(2010, 'broadcom').valueUsdB, 6.86);
assert.equal(at(2010, 'nxp').valueUsdB, 5.24);
assert.equal(at(2015, 'nvidia').valueUsdB, 17.73);
assert.equal(at(2015, 'intel').valueUsdB, 162.77);
assert.equal(at(2020, 'nvidia').valueUsdB, 323.24);
assert.equal(at(2025, 'nvidia').valueUsdB, 4638);
assert.equal(at(2025, 'tsmc').valueUsdB, 1570);
assert.ok(at(2015, 'intel').rank < at(2015, 'nvidia').rank);
assert.ok(at(2020, 'intel').rank > at(2020, 'nvidia').rank);
assert.ok(at(2015, 'amd').rank > 10 && at(2025, 'amd').rank <= 10);
for (let year = 2010; year <= 2015; year++) assert.match(at(year, 'broadcom').displayName, /^Avago/);
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

// Interpolation is visual only; endpoints and rank crossings remain deterministic.
const startRows = lib.rankSnapshot(fixtureCompanies, fixture);
const endRows = lib.rankSnapshot(fixtureCompanies, { year: 2021, entries: [
  { companyId: 'z', valueUsdB: 8 }, { companyId: 'b', valueUsdB: 2 }, { companyId: 'a', valueUsdB: 3 },
] });
const beforeInterpolation = JSON.stringify([startRows, endRows]);
assert.deepEqual(plain(lib.interpolateRankingRows(startRows, endRows, 0)), plain(startRows));
assert.deepEqual(plain(lib.interpolateRankingRows(startRows, endRows, 1)), plain(endRows));
const halfway = lib.interpolateRankingRows(startRows, endRows, .5);
assert.deepEqual(plain(halfway.map(row => [row.id, row.valueUsdB, row.rank])), [['z', 5, 1], ['a', 3, 2], ['b', 2.5, 3]]);
assert.equal(JSON.stringify([startRows, endRows]), beforeInterpolation);
assert.deepEqual(plain(lib.interpolateRankingRows(startRows, endRows, -1)), plain(startRows));
assert.deepEqual(plain(lib.interpolateRankingRows(startRows, endRows, 2)), plain(endRows));
const animatedEnd = lib.interpolateRankingRows(timeline[0].rows, timeline[timeline.length - 1].rows, 1);
assert.ok(animatedEnd.slice(0, 10).some(row => row.id === 'amd'));

// Exercise the animation hook with a deterministic frame clock and motion preference.
const animationSlots = [], animationEffects = [], animationFrames = new Map();
let animationCursor = 0, animationFrameId = 0, animationNow = 0, motionListener;
const motion = { matches: false, addEventListener: (_, fn) => { motionListener = fn; }, removeEventListener: () => { motionListener = undefined; } };
const animationLoad = loader({ react: { ...React,
  useRef: initial => { const slot = animationCursor++; return animationSlots[slot] ?? (animationSlots[slot] = { current: initial }); },
  useState: initial => { const slot = animationCursor++; if (!(slot in animationSlots)) animationSlots[slot] = initial; return [animationSlots[slot], value => { animationSlots[slot] = value; }]; },
  useLayoutEffect: (fn, deps) => {
    const slot = animationCursor++, old = animationEffects[slot];
    if (!old || deps.some((dep, i) => !Object.is(dep, old.deps[i]))) {
      old?.cleanup?.(); animationEffects[slot] = { deps, pending: fn };
    }
  },
} }, {
  window: { matchMedia: () => motion }, performance: { now: () => animationNow },
  requestAnimationFrame: fn => { animationFrames.set(++animationFrameId, fn); return animationFrameId; },
  cancelAnimationFrame: id => animationFrames.delete(id),
});
const { useRankingAnimation } = animationLoad('src/components/ranking-time-machine/useRankingAnimation.ts');
function animationRender(rows, year, animate) {
  animationCursor = 0; useRankingAnimation(rows, year, animate);
  for (const effect of animationEffects) if (effect?.pending) { effect.cleanup = effect.pending(); delete effect.pending; }
  animationCursor = 0; return useRankingAnimation(rows, year, animate);
}
function animationStep(now) {
  animationNow = now;
  const callbacks = [...animationFrames.values()]; animationFrames.clear();
  callbacks.forEach(callback => callback(now));
}
assert.equal(animationRender(startRows, 2020, false).interpolating, false);
assert.equal(animationRender(endRows, 2021, true).interpolating, true);
animationStep(1500);
assert.deepEqual(plain(animationRender(endRows, 2021, true).rows), plain(halfway));
animationStep(3000);
assert.deepEqual(plain(animationRender(endRows, 2021, true).rows), plain(endRows));
assert.equal(animationFrames.size, 0);
animationRender(startRows, 2022, true); animationStep(3500);
assert.equal(animationRender(startRows, 2022, false).interpolating, false); // Pause settles the selected year.
assert.equal(animationFrames.size, 0);
animationRender(endRows, 2023, true); animationStep(4000);
assert.deepEqual(plain(animationRender(startRows, 2020, false).rows), plain(startRows)); // Scrub/reset cancels stale frames.
assert.equal(animationFrames.size, 0);
motion.matches = true;
assert.equal(animationRender(endRows, 2021, true).interpolating, false);
assert.equal(animationFrames.size, 0);
motion.matches = false;
animationRender(startRows, 2022, true);
motion.matches = true; motionListener();
assert.equal(animationRender(startRows, 2022, true).interpolating, false);
assert.equal(animationFrames.size, 0);
motion.matches = false; animationRender(endRows, 2023, true);
for (const effect of animationEffects) effect?.cleanup?.();
assert.equal(animationFrames.size, 0); assert.equal(motionListener, undefined);

// Optional one-time verification against the independently retained web extraction.
if (process.env.RANKING_SOURCE_CHECK) {
  const source = JSON.parse(fs.readFileSync(process.env.RANKING_SOURCE_CHECK, 'utf8'));
  assert.deepEqual(plain(snapshots), source.snapshots);
  console.log('All 320 values match the retained source extraction.');
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
  document: documentStub, window: { location: { hash: '', origin: 'https://mfg-compass.com' }, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name), setTimeout: (fn, ms) => { assert.equal(ms, 3000); timers.set(++nextTimer, fn); return nextTimer; }, clearTimeout: id => timers.delete(id) }, requestAnimationFrame: fn => fn(),
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
controls().onYearCommit(5); assert.equal(events.at(-1)[1].year, 2015);
controls().onPlay(); render();
props('RankingRaceChart').onSelect('amd'); render();
assert.equal(timers.size, 0); assert.equal(props('CompanyDetail').companyId, 'amd'); assert.equal(focused, 0);
controls().onPlay(); render(); documentStub.hidden = true; listeners.get('visibilitychange')(); render();
assert.equal(timers.size, 0); documentStub.hidden = false;
controls().onYear(timeline.length - 2); render(); controls().onPlay(); render(); tick();
assert.equal(controls().index, timeline.length - 1); assert.equal(controls().playing, true); // Final interpolation is still playing.
tick(); assert.equal(controls().playing, false); assert.equal(timers.size, 0);
controls().onPlay(); render(); assert.equal(controls().index, 0);
controls().onReset(); render(); assert.equal(controls().index, 0); assert.equal(props('CompanyDetail').companyId, ''); assert.equal(timers.size, 0);
for (const [event, properties] of events) {
  assert.match(event, /^ranking_timemachine_(play|pause|year_change|company_click)$/);
  assert.equal(properties.ranking_type, 'market_cap'); assert.equal(properties.data_kind, 'real');
  assert.equal(properties.comparison_mode, 'semiconductor');
  assert.ok(properties.year >= 2010 && properties.year <= 2025);
}
const related = nodes(render(), node => node.props?.eventName === 'ranking_timemachine_related_click');
assert.equal(related.length, 5);
for (const link of related) assert.equal(link.props.eventProperties.year, 2010);
// Switching modes stops timers, resets tracked company, and clamps the year atomically.
function chooseMode(label) { nodes(render(), node => node.props?.children === label && typeof node.props?.onClick === 'function')[0].props.onClick(); render(); }
controls().onPlay(); render();
chooseMode('世界の大企業と比較');
assert.equal(controls().years[0], 2014); assert.equal(controls().index, 0); assert.equal(timers.size, 0);
assert.equal(props('CompanyDetail').companyId, 'toyota');
assert.equal(props('RankingRaceChart').animate, false);
assert.equal(props('CompanyTracker').rows.length, 26);
assert.equal(events.at(-1)[0], 'ranking_timemachine_mode_change');
assert.equal(events.at(-1)[1].year, 2014); assert.equal(events.at(-1)[1].previous_mode, 'semiconductor');
const eventsBeforeNoOp = events.length;
chooseMode('世界の大企業と比較'); assert.equal(events.length, eventsBeforeNoOp);
controls().onYear(11); render();
assert.equal(props('CompanyTracker').year, 2025);
chooseMode('製造装置5社');
assert.equal(props('RankingRaceChart').rows.length, 5); assert.equal(props('RankingRaceChart').year, 2025);
assert.equal(props('CompanyDetail').companyId, 'tokyo-electron');
controls().onReset(); render();
assert.equal(controls().index, 0); assert.equal(props('CompanyDetail').companyId, 'tokyo-electron');
controls().onPlay(); render(); chooseMode('半導体20社');
assert.equal(controls().playing, false); assert.equal(props('CompanyDetail').companyId, '');
assert.equal(timers.size, 0);
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
assert.match(page.metadata.title, /2010〜2025/);
assert.match(page.metadata.description, /2010〜2025/);
assert.match(html, /<caption>2010/);
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
const detail = renderToStaticMarkup(React.createElement(CompanyDetail, { companyId: 'amd', timeline, index: timeline.length - 1 }));
assert.match(detail, /href="\/companies\/amd"/);
assert.match(detail, /2010年の順位/);
assert.match(detail, /2010〜2025年の順位と数値/);
const firstDetail = renderToStaticMarkup(React.createElement(CompanyDetail, { companyId: 'broadcom', timeline, index: 0 }));
assert.match(firstDetail, /Avago Technologies/);
assert.match(firstDetail, /対象期間外/);
assert.match(firstDetail, /変化なし/);
assert.equal((detail.match(/<tr[ >]/g) || []).length, 17);
const mediaTek = renderToStaticMarkup(React.createElement(CompanyDetail, { companyId: 'mediatek', timeline, index: 0 }));
assert.ok(!mediaTek.includes('/companies/mediatek'));
for (const file of ['src/content/guides/semiconductor-market-cap-ranking.ts', 'src/content/guides/semiconductor-equipment-sales-ranking.ts', 'src/app/(ja)/tools/page.tsx']) assert.ok(fs.readFileSync(path.join(root, file), 'utf8').includes('/tools/ranking-time-machine'));
assert.match(fs.readFileSync(path.join(root, 'src/app/sitemap.ts'), 'utf8'), /rankingTimeMachineMetadata\.route/);


// All modes use complete issuer/year cohorts without weakening source validation.
const comparison = load('src/lib/ranking-comparison.ts');
const reference = load('src/data/ranking-reference.ts');
const modes = comparison.createComparisonTimelines(companies, snapshots);
assert.equal(reference.referenceCompanies.length, 6);
assert.equal(reference.referenceSnapshots.flatMap(s => s.entries).length, 72);
assert.deepEqual(plain(reference.referenceSnapshots.map(s => s.year)), Array.from({ length: 12 }, (_, i) => 2014 + i));
for (const [mode, count, first, length] of [['semiconductor', 20, 2010, 16], ['global', 26, 2014, 12], ['equipment', 5, 2010, 16]]) {
  assert.equal(modes[mode].companies.length, count);
  assert.equal(modes[mode].timeline[0].year, first);
  assert.equal(modes[mode].timeline.length, length);
  for (const snapshot of modes[mode].timeline) {
    assert.equal(snapshot.rows.length, count);
    assert.equal(new Set(snapshot.rows.map(row => row.id)).size, count);
    for (const row of snapshot.rows) assert.ok(Number.isFinite(row.valueUsdB) && row.valueUsdB > 0);
  }
}
assert.deepEqual(plain(modes.semiconductor.timeline), plain(timeline));
assert.throws(() => comparison.createComparisonTimelines(companies.slice(1), snapshots));
assert.throws(() => comparison.createComparisonTimelines(companies, snapshots.slice(1)));
const globalLast = modes.global.timeline.at(-1);
assert.equal(globalLast.rows.find(row => row.id === 'alphabet').valueUsdB, 3802); // Issuer value, not GOOG + GOOGL.
const toyotaIndex = globalLast.rows.findIndex(row => row.id === 'toyota');
assert.ok(toyotaIndex >= 10);
const { CompanyTracker } = load('src/components/ranking-time-machine/CompanyTracker.tsx');
const tracking = renderToStaticMarkup(React.createElement(CompanyTracker, { rows: globalLast.rows, year: 2025, selectedId: 'toyota', onSelect() {} }));
assert.match(tracking, /トップ10圏外/); assert.match(tracking, /282.32/); assert.match(tracking, /2025年末の確定値/);
assert.match(tracking, new RegExp(`${globalLast.rows[toyotaIndex].rank}位`));
const { RankingRaceChart } = load('src/components/ranking-time-machine/RankingRaceChart.tsx');
const equipmentHtml = renderToStaticMarkup(React.createElement(RankingRaceChart, { rows: modes.equipment.timeline[0].rows, year: 2010, selectedId: '', animate: false, onSelect() {} }));
assert.equal((equipmentHtml.match(/data-visible="true"/g) || []).length, 5);
assert.match(equipmentHtml, /--race-count:5/); assert.ok(!equipmentHtml.includes('上位10社'));
const globalHtml = renderToStaticMarkup(React.createElement(RankingRaceChart, { rows: globalLast.rows, year: 2025, selectedId: 'toyota', animate: false, onSelect() {} }));
assert.equal((globalHtml.match(/data-visible="true"/g) || []).length, 10);
assert.match(globalHtml, /比較対象（GAFAM・トヨタ）/);
const { RankingTable } = load('src/components/ranking-time-machine/RankingTable.tsx');
const globalTable = renderToStaticMarkup(React.createElement(RankingTable, { rows: globalLast.rows, year: 2025, selectedId: 'toyota', onSelect() {} }));
assert.match(globalTable, /対象26社内/); assert.match(globalTable, /比較対象（他業界）/);
const globalDetail = renderToStaticMarkup(React.createElement(CompanyDetail, { companyId: 'toyota', timeline: modes.global.timeline, index: 11, mode: 'global' }));
assert.match(globalDetail, /2014年の順位/); assert.match(globalDetail, /対象26社内/);
assert.ok(!globalDetail.includes('/companies/toyota'));
for (const company of reference.referenceCompanies) {
  assert.ok(fs.existsSync(path.join(root, 'public', company.logoUrl)));
  assert.ok(html.includes(company.sourceUrl));
}
assert.match(html, /GAFAM/); assert.match(html, /2014〜2025/);

// Share URLs restore only explicit comparison hashes; document anchors stay untouched.
assert.equal(comparison.readComparisonHash('#ranking-sources'), null);
assert.equal(comparison.readComparisonHash(''), null);
const shareUrl = comparison.comparisonShareUrl('https://mfg-compass.com', 'global', 2025, 'toyota');
assert.equal(shareUrl, 'https://mfg-compass.com/tools/ranking-time-machine#mode=global&year=2025&company=toyota');
assert.deepEqual(plain(comparison.readComparisonHash(shareUrl.slice(shareUrl.indexOf('#')))), { type: 'restore', mode: 'global', year: 2025, selectedId: 'toyota' });
assert.deepEqual(plain(comparison.readComparisonHash('#mode=unknown&year=9999&company=unknown')), { type: 'restore', mode: 'semiconductor', year: 2025, selectedId: '' });
assert.deepEqual(plain(comparison.readComparisonHash('#mode=global&year=2010&company=unknown')), { type: 'restore', mode: 'global', year: 2014, selectedId: 'toyota' });
assert.equal(comparison.readComparisonHash('#mode=global&year=nope').year, 2014);
assert.equal(comparison.readComparisonHash('#mode=global&company=').selectedId, '');
const restored = comparison.reduceComparison({ ...comparison.initialComparison, playing: true, animate: true }, comparison.readComparisonHash('#mode=global&year=2025&company=toyota'));
assert.equal(restored.index, 11); assert.equal(restored.playing, false); assert.equal(restored.animate, false);

// Optional acquisition audit: compare all 72 values to source strings, including T -> B.
if (process.env.RANKING_REFERENCE_SOURCE) {
  const extracted = JSON.parse(fs.readFileSync(process.env.RANKING_REFERENCE_SOURCE, 'utf8'));
  for (const snapshot of reference.referenceSnapshots) for (const entry of snapshot.entries) {
    const source = extracted.find(company => company.id === entry.companyId).entries.find(item => item.year === snapshot.year);
    const match = source.sourceText.match(/^\$([\d,.]+)\s*([TBM])$/);
    const value = Number(match[1].replaceAll(',', '')) * ({ T: 1000, B: 1, M: .001 }[match[2]]);
    assert.ok(Math.abs(entry.valueUsdB - value) < 1e-9);
  }
  console.log('All 72 reference values match source strings.');
}

// Controller URL restore must not emit manual-operation analytics.
const restoreSlots = [], restoreEffects = [], restoreListeners = new Map(), restoreEvents = [];
let restoreCursor = 0;
const restoreWindow = { location: { hash: '#mode=global&year=2025&company=toyota' }, addEventListener: (key, fn) => restoreListeners.set(key, fn), removeEventListener: key => restoreListeners.delete(key) };
const restoreHooks = { ...React,
  useMemo: fn => { restoreCursor++; return fn(); },
  useReducer: (reducer, initial) => { const slot = restoreCursor++; if (!(slot in restoreSlots)) restoreSlots[slot] = initial; return [restoreSlots[slot], action => { restoreSlots[slot] = reducer(restoreSlots[slot], action); }]; },
  useEffect: (fn, deps) => { const slot = restoreCursor++, old = restoreEffects[slot]; if (!old || deps.some((dep, i) => !Object.is(dep, old.deps[i]))) { old?.cleanup?.(); restoreEffects[slot] = { deps, pending: fn }; } },
};
const restoredLoad = loader({ react: restoreHooks, '@vercel/analytics': { track: (...args) => restoreEvents.push(args) } }, { window: restoreWindow, document: documentStub });
const RestoredMachine = restoredLoad('src/components/ranking-time-machine/RankingTimeMachine.tsx').RankingTimeMachine;
function renderRestored() { restoreCursor = 0; const tree = RestoredMachine({ companies, snapshots }); for (const effect of restoreEffects) if (effect?.pending) { effect.cleanup = effect.pending(); delete effect.pending; } return tree; }
renderRestored();
let restoredTree = renderRestored();
assert.equal(nodes(restoredTree, node => node.type?.name === 'CompanyTracker')[0].props.year, 2025);
assert.equal(nodes(restoredTree, node => node.type?.name === 'CompanyTracker')[0].props.selectedId, 'toyota');
restoreWindow.location.hash = '#ranking-sources'; restoreListeners.get('hashchange')();
restoredTree = renderRestored();
assert.equal(nodes(restoredTree, node => node.type?.name === 'CompanyDetail')[0].props.mode, 'global');
restoreWindow.location.hash = '#mode=equipment&year=2011&company=asml'; restoreListeners.get('hashchange')();
restoredTree = renderRestored();
assert.equal(nodes(restoredTree, node => node.type?.name === 'CompanyTracker')[0].props.year, 2011);
assert.equal(nodes(restoredTree, node => node.type?.name === 'CompanyTracker')[0].props.selectedId, 'asml');
assert.equal(restoreEvents.length, 0);
for (const effect of restoreEffects) effect?.cleanup?.();
assert.equal(restoreListeners.size, 0);

async function testShare() {
  for (const succeeds of [true, false]) {
    const shareSlots = [], shareEvents = []; let shareCursor = 0, copiedUrl = '', cleanup;
    const shareLoad = loader({ react: { ...React,
      useState: initial => { const slot = shareCursor++; if (!(slot in shareSlots)) shareSlots[slot] = initial; return [shareSlots[slot], value => { shareSlots[slot] = value; }]; },
      useRef: initial => { const slot = shareCursor++; return shareSlots[slot] ?? (shareSlots[slot] = { current: initial }); },
      useEffect: fn => { shareCursor++; cleanup = fn(); },
    }, '@vercel/analytics': { track: (...args) => shareEvents.push(args) } }, {
      window: { location: { origin: 'https://mfg-compass.com' } }, navigator: { clipboard: { writeText: async url => { copiedUrl = url; if (!succeeds) throw Error('Denied'); } } },
    });
    const Share = shareLoad('src/components/ranking-time-machine/ComparisonShare.tsx').ComparisonShare;
    const renderShare = () => { shareCursor = 0; return Share({ mode: 'global', year: 2025, selectedId: 'toyota' }); };
    await nodes(renderShare(), node => node.type?.name === 'Button')[0].props.onClick();
    const resultTree = renderShare();
    assert.equal(copiedUrl, shareUrl);
    assert.equal(shareEvents.length, 1);
    assert.equal(shareEvents[0][0], 'ranking_timemachine_share');
    assert.equal(shareEvents[0][1].result, succeeds ? 'copied' : 'url_shown');
    assert.equal(shareEvents[0][1].comparison_mode, 'global');
    const inputs = nodes(resultTree, node => node.type === 'input');
    assert.equal(inputs.length, succeeds ? 0 : 1);
    if (!succeeds) { assert.equal(inputs[0].props.value, shareUrl); let selected = false; inputs[0].props.onFocus({ currentTarget: { select: () => { selected = true; } } }); assert.ok(selected); }
    cleanup();
  }
}
testShare().then(() => console.log('Ranking time machine: data, all comparison modes, tracking, playback, sharing, analytics, reduced motion and SSR passed. Browser layout and production delivery are not covered.')).catch(error => { console.error(error); process.exitCode = 1; });
