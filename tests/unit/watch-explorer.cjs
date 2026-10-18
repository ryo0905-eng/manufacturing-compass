const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...rest) { return resolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, parent, ...rest); };
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
require.extensions['.css'] = module => { module.exports = new Proxy({}, { get: (_, key) => key === '__esModule' ? false : key }); };
const { buildWatchCompanies, buildWatchNews, articleWatchItem, watchItems } = require('../../src/lib/watch.ts');
const { media } = require('../../src/lib/chip-pulse-media.ts');
const { earningsReleases } = require('../../src/lib/earnings.ts');
const { watchCalendar } = require('../../src/lib/watch-calendar.ts');
const { watchTopics } = require('../../src/lib/watch-types.ts');
const { companiesForTopic, defaultWatchCompany, readWatchSelection, watchSelectionHash, relatedWatchNews, watchNewsForTopic, watchChartDomain, watchBar } = require('../../src/lib/watch-explorer.ts');
const { WatchExplorer } = require('../../src/components/chip-pulse/WatchExplorer.tsx');
const Page = require('../../src/app/(ja)/semiconductor-watch/page.tsx').default;
const { annualHistories } = require('../../src/lib/earnings-history.ts');
const { watchFinancials, watchFinancialDomain, watchMetrics } = require('../../src/lib/watch-financials.ts');
const now = '2026-10-17T00:00:00Z';
const companies = buildWatchCompanies(now);
const news = buildWatchNews();
const copy = value => structuredClone(value);

function growthSeries(values) {
  const series = copy(annualHistories[0]);
  const template = copy(series.periods.at(-1));
  delete template.breakBefore;
  template.currency = 'EUR'; template.unit = 'million';
  series.periods = values.map((value, index) => ({ ...copy(template),
    label: `${2019 + index}年通期`, start: `${2019 + index}-01-01`, end: `${2019 + index}-12-31`,
    revenue: { ...template.revenue, value }, operatingIncome: { ...template.operatingIncome, value: value / 5 },
  }));
  return series;
}

test('company projection preserves raw values, sources, periods, scope and segment order', () => {
  assert.equal(companies.length, 12);
  for (const company of companies) {
    const release = earningsReleases.find(item => item.companyId === company.id);
    assert.equal(company.revenueYoY, release.metrics.revenueYoY.status === 'reported' ? release.metrics.revenueYoY.value : null);
    assert.equal(company.period, release.period.label);
    assert.ok(company.revenueLabel); assert.ok(company.operatingIncomeLabel);
    assert.ok(company.sourceHref.startsWith('https://'));
    assert.ok(company.topics.length);
  }
  assert.equal(companies.find(company => company.id === 'samsung-electronics').revenueYoY, null);
  assert.match(companies.find(company => company.id === 'samsung-electronics').scope, /DS部門/);
  assert.equal(companies.filter(company => company.segment === 'equipment').length, 5);
  assert.ok(companies.slice(0, 5).every(company => company.segment === 'equipment'));
  assert.equal(defaultWatchCompany(companies), 'tsmc');
  assert.equal(defaultWatchCompany([ { id: 'b', announcedAt: '2026-10-01' }, { id: 'a', announcedAt: '2026-10-01' } ]), 'a');
  assert.equal(defaultWatchCompany([]), null);
});

test('hash restores all metric/theme combinations; highlights only explicitly requested valid companies', () => {
  for (const topic of watchTopics) for (const metric of watchMetrics) for (const years of [5,10,20]) {
    const selection = readWatchSelection(`#theme=${topic.id}&metric=${metric.id}&company=unknown&years=${years}`, companies);
    assert.equal(selection.company, null);
    assert.equal(selection.metric, metric.id); assert.equal(selection.years, years);
    assert.deepEqual(readWatchSelection(watchSelectionHash(selection), companies), selection);
  }
  assert.deepEqual(readWatchSelection('#theme=equipment&company=micron', companies), { topic: 'equipment', company: null, metric: 'revenue', years: 10 });
  assert.deepEqual(readWatchSelection('#theme=unknown&company=micron&metric=bad', companies), { topic: 'all', company: 'micron', metric: 'revenue', years: 10 });
  assert.equal(readWatchSelection('#signal-old-article', companies).company, null);
  assert.equal(readWatchSelection('', companies).metric, 'revenue');
  assert.deepEqual(readWatchSelection('#theme=equipment&company=asml&metric=operating_income&years=20', companies), { topic: 'equipment', company: 'asml', metric: 'revenue', years: 20 });
  assert.deepEqual(watchMetrics.map(metric => metric.id), ['revenue', 'operating_margin']);
});

test('annual growth uses the preceding year outside the window and preserves declines and missing latest', () => {
  const series = growthSeries([100, 120, 150, 120, 180, 198]);
  const data = watchFinancials(series, 'revenue', 5);
  assert.equal(data.points.length, 5);
  assert.equal(data.points[0].previousPeriod, series.periods[0]);
  assert.ok(Math.abs(data.points[0].value - 20) < 1e-9);
  assert.ok(Math.abs(data.points[2].value + 20) < 1e-9);
  assert.equal(data.displayValue, '+10');
  assert.equal(watchFinancials(series, 'revenue', 20).points[0].value, null);
  assert.match(watchFinancials(series, 'revenue', 20).points[0].missingReason, /前年.*未取得/);
  const decline = watchFinancials(growthSeries([100, 75]), 'revenue');
  assert.equal(decline.latest, -25); assert.equal(decline.displayValue, '-25');
  assert.equal(watchFinancials(growthSeries([100, 0]), 'revenue').latest, -100);
  const last = series.periods.at(-1);
  last.operatingIncome.value = -20;
  assert.ok(watchFinancials(series, 'operating_margin').latest < 0);
  last.revenue.value = 0;
  assert.equal(watchFinancials(series, 'operating_margin').latest, null);
  last.revenue.value = 198;
  last.operatingIncome = { status: 'unpublished', reason: '利益未公表' };
  assert.match(watchFinancials(series, 'operating_margin').missingReason, /利益未公表/);
  last.revenue = { status: 'unretrieved', reason: '確認できない' };
  const missing = watchFinancials(series, 'revenue');
  assert.equal(missing.latest, null); assert.equal(missing.displayValue, '算出不可'); assert.match(missing.missingReason, /確認できない/);
  assert.equal(missing.points.length, 6, 'Missing latest must not pull in older observations');
  assert.equal(watchFinancials(series, 'revenue', 5).points.length, 5);
  const kla = annualHistories.find(item => item.companyId === 'kla');
  assert.equal(watchFinancials(kla, 'operating_margin').calculated, true);
  assert.equal(watchFinancials(kla, 'revenue').calculated, false);
});

test('growth excludes invalid prior revenue and incomparable years without bridging gaps', () => {
  for (const previous of [0, -100]) {
    const data = watchFinancials(growthSeries([previous, 100]), 'revenue');
    assert.equal(data.latest, null); assert.match(data.missingReason, /前年.*ゼロ以下/);
  }
  for (const status of ['unretrieved', 'unpublished']) {
    const series = growthSeries([100, 120, 140, 160, 180, 200]);
    series.periods[2].revenue = { status, reason: '前年欠測' };
    const data = watchFinancials(series, 'revenue');
    assert.equal(data.points[2].value, null); assert.equal(data.points[3].value, null);
    assert.match(data.points[3].missingReason, /前年欠測/);
    assert.deepEqual(data.segments.map(segment => segment.map(point => point.period.end)), [
      [series.periods[1].end], [series.periods[4].end, series.periods[5].end],
    ]);
  }
  for (const change of [
    { breakBefore: '部門変更' }, { financialScope: '変更後' }, { currency: 'JPY' },
    { accountingStandard: '変更後' }, { unit: 'billion' }, { end: '2022-06-30' },
  ]) {
    const series = growthSeries([100, 120, 140]);
    Object.assign(series.periods[2], change);
    const data = watchFinancials(series, 'revenue');
    assert.equal(data.latest, null, JSON.stringify(change)); assert.ok(data.missingReason);
    assert.ok(data.segments.every(segment => segment.every(point => point.period !== series.periods[2])));
  }
  const margin = growthSeries([100, 120, 140, 160]);
  margin.periods[2].breakBefore = '部門変更';
  assert.equal(watchFinancials(margin, 'operating_margin').segments.length, 2);
});

test('annual common domain includes all values and zero, including outliers, with no theme input', () => {
  const normal = growthSeries([100, 120, 140]);
  const outlier = growthSeries([100, 1400, 700]);
  for (const metric of watchMetrics) for (const years of [5, 10, 20]) {
    const domain = watchFinancialDomain([normal, outlier], metric.id, years);
    assert.ok(domain.min <= 0 && domain.max > 0);
    for (const series of [normal, outlier]) for (const point of watchFinancials(series, metric.id, years).points) {
      if (point.value !== null) assert.ok(point.value >= domain.min && point.value <= domain.max);
    }
  }
  const domain = watchFinancialDomain([normal, outlier], 'revenue');
  assert.ok(domain.min < -50 && domain.max > 1300);
  assert.deepEqual(watchFinancialDomain([], 'revenue'), { min: 0, max: 1 });
});

test('one global linear domain handles zero, negatives, missing and very large values', () => {
  const domain = watchChartDomain(companies);
  assert.deepEqual(domain, { min: 0, max: 450 });
  assert.deepEqual(watchChartDomain([{ revenueYoY: null }, { revenueYoY: NaN }]), { min: 0, max: 50 });
  const mixed = watchChartDomain([-33, 0, 1300, null].map(revenueYoY => ({ revenueYoY })));
  assert.deepEqual(mixed, { min: -50, max: 1300 });
  assert.equal(watchBar(0, mixed).width, 0);
  const negative = watchBar(-33, mixed);
  assert.ok(negative.left < negative.zero);
  assert.ok(Math.abs(negative.left + negative.width - negative.zero) < 1e-9);
  assert.ok(watchBar(1300, mixed).left + watchBar(1300, mixed).width <= 100);
  assert.deepEqual(watchBar(50, domain), watchBar(50, watchChartDomain(companies)), 'Filtering uses the complete cohort domain');
});

test('news association uses IDs, invalid editorial falls back to source, and release duplicates are removed', () => {
  const article = media.articles.find(item => item.sourceId === 'tsmc');
  assert.deepEqual(articleWatchItem(article).companyIds, ['tsmc']);
  const changed = { ...copy(article), version: article.version + 1, sourceId: 'amd', companyNames: ['TSMC'] };
  assert.deepEqual(articleWatchItem(changed).companyIds, ['amd']);
  assert.deepEqual(articleWatchItem({ ...changed, sourceId: 'unknown' }).companyIds, []);
  const duplicate = { ...copy(article), sourceUrl: earningsReleases[0].documents[0].url + '#page=1' };
  assert.equal(buildWatchNews([duplicate]).length, 0);
  const recent = { ...articleWatchItem(article), date: '2026-10-16T00:00:00Z' };
  const items = [recent, { ...recent, id: 'copy' }, { ...recent, id: 'factory', kind: 'factory', href: '/factory' }, { ...recent, id: 'future', date: '2027-01-01', href: '/future' }];
  assert.equal(watchNewsForTopic(items, 'all', now).length, 1);
  assert.equal(relatedWatchNews(items, 'tsmc', now).length, 1);
  assert.equal(relatedWatchNews(items, 'amd', now).length, 0);
  assert.equal(watchNewsForTopic([{ ...recent, date: '2025-01-01', updatedAt: now }], 'all', now).length, 0);
});

test('freshness and calendar failure states remain visible without inventing dates or values', () => {
  const calendar = copy(watchCalendar);
  const release = earningsReleases.find(item => item.companyId === 'asml');
  calendar.companies = [{ companyId: 'asml', checkedAt: now, state: 'failed', latestAnnouncedAt: release.announcedAt }];
  calendar.events = [];
  const failed = buildWatchCompanies(now, [release], calendar)[0];
  assert.equal(failed.freshness.state, 'failed'); assert.equal(failed.nextEvent, null);
  calendar.companies[0].state = 'verified'; calendar.companies[0].checkedAt = '2026-09-01T00:00:00Z';
  assert.equal(buildWatchCompanies(now, [release], calendar)[0].freshness.state, 'stale');
  calendar.companies[0].latestAnnouncedAt = '2026-10-16';
  assert.equal(buildWatchCompanies(now, [release], calendar)[0].freshness.state, 'pending');
  const missing = copy(release); missing.metrics.revenueYoY = { status: 'unpublished', reason: '非公表' };
  const company = buildWatchCompanies(now, [missing], calendar)[0];
  assert.equal(company.metricLabel, '未公表'); assert.equal(company.revenueYoY, null);
  const html = renderToStaticMarkup(React.createElement(WatchExplorer, { companies: [company], news: [], now }));
  assert.match(html, /非公表/); assert.match(html, /日程は未確認/); assert.match(html, /最新四半期の決算一覧/);
  assert.equal((html.match(/class="bar"/g) ?? []).length, 0);
});

test('no-JS HTML exposes every company value and source, article links, unique legacy IDs and progressive news', () => {
  const html = renderToStaticMarkup(React.createElement(WatchExplorer, { companies, news, now, histories: annualHistories }));
  for (const company of companies) {
    assert.ok(html.includes(company.metricLabel));
    assert.ok(html.includes(company.revenueLabel)); assert.ok(html.includes(company.operatingIncomeLabel));
    assert.ok(html.includes(company.href));
    assert.ok(html.includes(company.sourceHref.replaceAll('&', '&amp;')));
  }
  assert.equal((html.match(/class="financialCard"/g) ?? []).length, 12);
  assert.equal((html.match(/data-selected="true"/g) ?? []).length, 0);
  for (const company of companies) assert.ok(html.includes(`${company.href}?years=10#annual-history`));
  assert.match(html, /DS部門/); assert.match(html, /年次売上前年比/);
  assert.match(html, /前年売上高/); assert.match(html, /各社で決算期・対象範囲が異なります/);
  assert.doesNotMatch(html, /cardLogo/);
  const zeroLines = [...html.matchAll(/<line[^>]*y1="([^"]+)"[^>]*stroke-dasharray="3 3"/g)];
  assert.equal(zeroLines.length, 12); assert.equal(new Set(zeroLines.map(match => match[1])).size, 1);
  const complete = renderToStaticMarkup(React.createElement(Page));
  const ids = [...complete.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, 'Every legacy anchor occurs once');
  watchItems.forEach(item => assert.ok(ids.includes(`signal-${item.id.replace(/^[^:]+:/, '')}`), item.id));
  assert.match(complete, /CollectionPage/); assert.match(complete, /今後14日の発表予定/);
  const fixture = Array.from({ length: 7 }, (_, index) => ({ ...news[0], id: `article:fixture-${index}`, href: `/fixture-${index}`, date: '2026-10-16T00:00:00Z' }));
  const expanded = renderToStaticMarkup(React.createElement(WatchExplorer, { companies, news: fixture, now }));
  assert.match(expanded, /もっと見る（2件）/);
  fixture.forEach(item => assert.ok(expanded.includes(item.href)));
  assert.equal((expanded.match(/id="signal-fixture-/g) ?? []).length, 7);
  const empty = renderToStaticMarkup(React.createElement(WatchExplorer, { companies: [], news: [], now }));
  assert.match(empty, /掲載決算はありません/); assert.match(empty, /すべての企業へ戻る/);
});

function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(node => nodes(node, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
function controller(initialHash = '', mobile = false, props = { companies, news, now }) {
  const slots = [], effects = [], events = [], frames = [], listeners = new Map();
  let cursor = 0, focused = 0, scrolled = 0, opened = false;
  const parent = { tagName: 'DETAILS', parentElement: null, set open(value) { opened = value; } };
  const element = { parentElement: parent, focus() { focused++; }, scrollIntoView() { scrolled++; }, querySelector() { return element; } };
  const document = { getElementById() { return element; } };
  const window = { location: { hash: initialHash }, history: { pushState(_state, _unused, hash) { window.location.hash = hash; } },
    addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name),
    matchMedia: () => ({ matches: mobile }), requestAnimationFrame: fn => frames.push(fn) };
  const hooks = { ...React,
    useState(initial) { const slot = cursor++; if (!(slot in slots)) slots[slot] = typeof initial === 'function' ? initial() : initial; return [slots[slot], value => { slots[slot] = typeof value === 'function' ? value(slots[slot]) : value; }]; },
    useEffect(fn, deps) { const slot = cursor++, old = effects[slot]; if (!old || deps.some((value, index) => !Object.is(value, old.deps[index]))) { old?.cleanup?.(); effects[slot] = { deps, pending: fn }; } },
  };
  const filename = path.resolve('src/components/chip-pulse/WatchExplorer.tsx');
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { exports, URLSearchParams, window, document, require(id) {
    if (id === 'react') return hooks;
    if (id === '@/lib/analytics') return { trackEvent: (name, properties) => events.push([name, properties]) };
    return require(id.startsWith('.') ? path.resolve(path.dirname(filename), id) : id);
  } }, { filename });
  function render() {
    cursor = 0; const tree = exports.WatchExplorer(props);
    effects.forEach(effect => { if (effect?.pending) { const fn = effect.pending; delete effect.pending; effect.cleanup = fn(); } });
    frames.splice(0).forEach(fn => fn());
    return tree;
  }
  const buttons = () => nodes(render(), node => node.type === 'button');
  const theme = id => buttons().find(node => node.props.children === watchTopics.find(topic => topic.id === id)?.label);
  const metric = id => buttons().find(node => node.props.children === watchMetrics.find(item => item.id === id)?.label);
  const period = years => buttons().find(node => Array.isArray(node.props.children) && node.props.children[0] === years && node.props.children[1] === '年');
  const card = id => nodes(render(), node => node.props.company?.id === id)[0];
  return { render, theme, metric, period, card, events, window, listeners,
    back(hash) { window.location.hash = hash; listeners.get('popstate')(); render(); },
    stats: () => ({ focused, scrolled, opened }), cleanup: () => effects.forEach(effect => effect?.cleanup?.()),
  };
}

test('metric selection persists across themes and history without duplicate events', () => {
  const ui = controller(); ui.render();
  assert.equal(ui.events.length, 0);
  assert.equal(ui.card('tsmc').props.selected, false);
  ui.metric('operating_margin').props.onClick(); ui.render();
  assert.equal(ui.card('tsmc').props.metric, 'operating_margin');
  ui.metric('operating_margin').props.onClick(); ui.render();
  assert.equal(ui.events.length, 1);
  ui.theme('equipment').props.onClick(); ui.render();
  assert.equal(ui.card('tsmc'), undefined);
  assert.equal(ui.card('asml').props.metric, 'operating_margin');
  ui.theme('equipment').props.onClick(); ui.render();
  assert.equal(ui.events.length, 2);
  const before = ui.events.length;
  ui.back('#theme=equipment&company=asml&metric=operating_margin');
  assert.equal(ui.card('asml').props.selected, true);
  assert.equal(ui.card('kla').props.metric, 'operating_margin');
  assert.equal(ui.events.length, before);
  ui.back('#signal-existing'); assert.equal(ui.stats().opened, true);
  assert.equal(ui.card('tsmc').props.selected, false);
  assert.ok(ui.events.every(([, properties]) => properties.ui_version === 'cards-v2'));
  assert.equal(ui.events[0][0], 'chip_pulse_metric_select');
  ui.cleanup(); assert.equal(ui.listeners.size, 0);
});

test('theme filtering preserves the full cohort scale and period and metric changes recompute it', () => {
  const ui = controller('', false, { companies, news, now, histories: annualHistories });
  ui.render();
  const domain = ui.card('asml').props.domain;
  assert.deepEqual(domain, watchFinancialDomain(annualHistories, 'revenue', 10));
  assert.deepEqual(ui.card('tsmc').props.domain, domain);
  ui.theme('equipment').props.onClick(); ui.render();
  assert.deepEqual(ui.card('asml').props.domain, domain);
  ui.period(5).props.onClick(); ui.render();
  assert.deepEqual(ui.card('asml').props.domain, watchFinancialDomain(annualHistories, 'revenue', 5));
  ui.metric('operating_margin').props.onClick(); ui.render();
  assert.deepEqual(ui.card('asml').props.domain, watchFinancialDomain(annualHistories, 'operating_margin', 5));
  const count = ui.events.length;
  ui.back('#theme=equipment&company=asml&metric=operating_income&years=20');
  assert.equal(ui.card('asml').props.metric, 'revenue');
  assert.equal(ui.card('asml').props.selected, true);
  assert.deepEqual(ui.card('asml').props.domain, watchFinancialDomain(annualHistories, 'revenue', 20));
  assert.equal(ui.events.length, count);
  ui.cleanup();
});

test('server-rendered card metrics, losses, missing latest and calculated scope remain accessible', () => {
  const { WatchFinancialCard } = require('../../src/components/chip-pulse/WatchFinancialCard.tsx');
  const company = companies.find(item => item.id === 'kla');
  const series = copy(annualHistories.find(item => item.companyId === 'kla'));
  const render = (metric, years = 10) => renderToStaticMarkup(React.createElement(WatchFinancialCard, {
    company, series, metric, years, domain: watchFinancialDomain([series], metric, years), selected: false,
  }));
  for (const metric of watchMetrics) {
    const html = render(metric.id);
    assert.match(html, /<table/); assert.match(html, /<title/);
    assert.match(html, /stroke-dasharray="3 3"/);
    assert.doesNotMatch(html, /cardLogo/);
    assert.ok(html.includes(company.href + '?years=10#annual-history'));
    if (metric.id !== 'revenue') assert.match(html, /営業利益は算出値/);
  }
  series.periods.at(-1).operatingIncome.value = -100;
  const loss = render('operating_margin');
  assert.match(loss, /stroke-dasharray="3 3"/);
  series.periods.at(-1).revenue = { status: 'unretrieved', reason: '欠測の理由' };
  const missing = render('revenue');
  assert.match(missing, /未取得/); assert.match(missing, /欠測の理由/);
  assert.match(missing, /data-missing="true"/);
  const fixture = growthSeries([100, 120, 150, 120, 180, 198]);
  const html = renderToStaticMarkup(React.createElement(WatchFinancialCard, {
    company, series: fixture, metric: 'revenue', years: 5, domain: watchFinancialDomain([fixture], 'revenue', 5), selected: false,
  }));
  assert.ok(html.includes(fixture.periods[0].end), 'The source year outside the chart window stays in the accessible table');
  assert.match(html, /前年比＝本期売上高÷前年売上高/);
  assert.match(html, /前年比<\/span><strong>\+10<\/strong><span>%/);
  assert.ok(html.includes(company.href + '?years=5#annual-history'));
});

test('card links keep existing read analytics and use document navigation to preserve return history', () => {
  const events = [], exports = {};
  const filename = path.resolve('src/components/chip-pulse/MediaLinks.tsx');
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { exports, require(id) { return id === '@/lib/analytics' ? { trackEvent: (...args) => events.push(args) } : require(id); } });
  const link = exports.MediaLink({ href: '/semiconductor-watch/earnings/asml#annual-history', articleId: 'asml', action: 'article', destination: 'earnings', placement: 'explore', uiVersion: 'cards-v2', reloadDocument: true, children: 'ASML' });
  assert.equal(link.type, 'a'); assert.equal(events.length, 0);
  link.props.onClick();
  assert.equal(events.length, 1);
  assert.equal(events[0][0], 'chip_pulse_read');
  assert.equal(events[0][1].ui_version, 'cards-v2');
  assert.equal(events[0][1].destination_type, 'earnings');
  assert.equal(events[0][1].article_id, 'asml');
});


test('watch period selection retains metric/theme, card URL years and history without duplicate actions', () => {
  const ui = controller(); ui.render();
  assert.equal(ui.card('asml').props.years, 10);
  ui.period(20).props.onClick(); ui.render(); assert.equal(ui.events.length, 1);
  assert.equal(ui.events[0][1].dimension, 'period'); assert.equal(ui.events[0][1].years, 20);
  ui.period(20).props.onClick(); ui.render(); assert.equal(ui.events.length, 1);
  ui.metric('operating_margin').props.onClick(); ui.theme('equipment').props.onClick(); ui.render();
  assert.equal(ui.card('asml').props.years, 20); assert.equal(ui.card('asml').props.metric, 'operating_margin');
  assert.match(ui.window.location.hash, /years=20/);
  const count = ui.events.length; ui.back('#theme=equipment&metric=operating_income&years=5');
  assert.equal(ui.card('asml').props.years, 5); assert.equal(ui.card('asml').props.metric, 'revenue');
  assert.equal(ui.events.length, count); ui.cleanup();
});
