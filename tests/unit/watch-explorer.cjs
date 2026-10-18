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
const { companiesForTopic, defaultWatchCompany, sortWatchCompanies, readWatchSelection, watchSelectionHash, relatedWatchNews, watchNewsForTopic, watchChartDomain, watchBar } = require('../../src/lib/watch-explorer.ts');
const { WatchExplorer } = require('../../src/components/chip-pulse/WatchExplorer.tsx');
const Page = require('../../src/app/(ja)/semiconductor-watch/page.tsx').default;
const { annualHistories } = require('../../src/lib/earnings-history.ts');
const { watchFinancials, watchFinancialDomain, watchMetrics, watchExchange, watchYenRates, watchYenValue, watchYenAmount } = require('../../src/lib/watch-financials.ts');
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
  for (const topic of watchTopics) for (const metric of watchMetrics) for (const years of [5,10,20]) for (const sort of ['revenue', 'growth']) {
    const selection = readWatchSelection(`#theme=${topic.id}&metric=${metric.id}&company=unknown&years=${years}&sort=${sort}`, companies);
    assert.equal(selection.company, null);
    assert.equal(selection.metric, metric.id); assert.equal(selection.years, years); assert.equal(selection.sort, sort);
    assert.deepEqual(readWatchSelection(watchSelectionHash(selection), companies), selection);
  }
  assert.deepEqual(readWatchSelection('#theme=equipment&company=micron', companies), { topic: 'equipment', company: null, metric: 'revenue', years: 10, sort: 'revenue' });
  assert.deepEqual(readWatchSelection('#theme=unknown&company=micron&metric=bad', companies), { topic: 'all', company: 'micron', metric: 'revenue', years: 10, sort: 'revenue' });
  assert.equal(readWatchSelection('#signal-old-article', companies).company, null);
  assert.equal(readWatchSelection('', companies).metric, 'revenue');
  assert.deepEqual(readWatchSelection('#theme=equipment&company=asml&metric=operating_income&years=20', companies), { topic: 'equipment', company: 'asml', metric: 'revenue', years: 20, sort: 'revenue' });
  assert.deepEqual(watchMetrics.map(metric => metric.id), ['revenue', 'operating_margin']);
});

test('annual growth uses the preceding year outside the window and preserves declines and missing latest', () => {
  const series = growthSeries([100, 120, 150, 120, 180, 198]);
  const data = watchFinancials(series, 'revenue', 5);
  assert.equal(data.points.length, 5);
  assert.equal(data.points[0].previousPeriod, series.periods[0]);
  assert.ok(Math.abs(data.points[0].revenueYoY - 20) < 1e-9);
  assert.ok(Math.abs(data.points[2].revenueYoY + 20) < 1e-9);
  assert.ok(Math.abs(data.revenueYoY - 10) < 1e-9); assert.equal(data.displayValue, watchYenAmount(data.latest));
  assert.equal(watchFinancials(series, 'revenue', 20).points[0].revenueYoY, null);
  assert.match(watchFinancials(series, 'revenue', 20).points[0].growthMissingReason, /前年.*未取得/);
  const decline = watchFinancials(growthSeries([100, 75]), 'revenue');
  assert.equal(decline.revenueYoY, -25); assert.ok(decline.latest > 0);
  assert.equal(watchFinancials(growthSeries([100, 0]), 'revenue').revenueYoY, -100);
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
  assert.equal(missing.latest, null); assert.equal(missing.displayValue, '未取得'); assert.match(missing.missingReason, /確認できない/);
  assert.equal(missing.points.length, 6, 'Missing latest must not pull in older observations');
  assert.equal(watchFinancials(series, 'revenue', 5).points.length, 5);
  const kla = annualHistories.find(item => item.companyId === 'kla');
  assert.equal(watchFinancials(kla, 'operating_margin').calculated, true);
  assert.equal(watchFinancials(kla, 'revenue').calculated, false);
});

test('growth excludes invalid prior revenue and incomparable years without bridging gaps', () => {
  for (const previous of [0, -100]) {
    const data = watchFinancials(growthSeries([previous, 100]), 'revenue');
    assert.equal(data.revenueYoY, null); assert.match(data.growthMissingReason, /前年.*ゼロ以下/); assert.ok(data.latest > 0);
  }
  for (const status of ['unretrieved', 'unpublished']) {
    const series = growthSeries([100, 120, 140, 160, 180, 200]);
    series.periods[2].revenue = { status, reason: '前年欠測' };
    const data = watchFinancials(series, 'revenue');
    assert.equal(data.points[2].value, null); assert.equal(data.points[3].revenueYoY, null); assert.ok(data.points[3].value > 0);
    assert.match(data.points[3].growthMissingReason, /前年欠測/);
    assert.deepEqual(data.segments.map(segment => segment.map(point => point.period.end)), [
      [series.periods[0].end, series.periods[1].end], [series.periods[3].end, series.periods[4].end, series.periods[5].end],
    ]);
  }
  for (const change of [
    { breakBefore: '部門変更' }, { financialScope: '変更後' }, { currency: 'JPY' },
    { accountingStandard: '変更後' }, { unit: 'billion' }, { end: '2022-06-30' },
  ]) {
    const series = growthSeries([100, 120, 140]);
    Object.assign(series.periods[2], change);
    const data = watchFinancials(series, 'revenue');
    assert.equal(data.revenueYoY, null, JSON.stringify(change)); assert.ok(data.growthMissingReason);
    assert.ok(data.latest > 0, 'A sourced amount remains visible at a comparison boundary');
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
  assert.equal(domain.min, 0); assert.ok(domain.max > watchFinancials(outlier, 'revenue').points[1].value);
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
  assert.match(html, /DS部門/); assert.match(html, /年次売上高/);
  assert.match(html, /前年売上高/); assert.match(html, /各社で決算期・対象範囲が異なります/);
  assert.match(html, /cardLogo/);
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
  const sort = value => buttons().find(node => node.props.children === (value === 'growth' ? '売上前年比順' : '売上高順'));
  const period = years => buttons().find(node => Array.isArray(node.props.children) && node.props.children[0] === years && node.props.children[1] === '年');
  const card = id => nodes(render(), node => node.props.company?.id === id)[0];
  return { render, theme, metric, period, sort, card, events, window, listeners,
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
    assert.match(html, /cardLogo/);
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
  assert.match(html, /前年比 \+10%/);
  assert.match(html, /円換算・概算/); assert.match(html, /<rect/);
  const links = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)];
  assert.equal(links.length, 2);
  assert.ok(links.every(link => !link[0].includes('role="slider"')), 'Chart interaction must not be inside a navigation link');
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

test('fixed FRB quotes convert all currencies and both amount units without changing growth', () => {
  assert.equal(watchExchange.asOf, '2026-10-09');
  assert.equal(watchExchange.releasedAt, '2026-10-13');
  assert.equal(new URL(watchExchange.source.url).hostname, 'www.federalreserve.gov');
  assert.ok(watchExchange.checkedAt >= watchExchange.asOf);
  assert.equal(watchYenValue(2.5, { currency: 'JPY', unit: 'million' }), 2500000);
  assert.equal(watchYenValue(2.5, { currency: 'JPY', unit: 'billion' }), 2500000000);
  assert.equal(watchYenValue(1, { currency: 'USD', unit: 'million' }), 158340000);
  assert.ok(Math.abs(watchYenValue(1, { currency: 'EUR', unit: 'million' }) - 177229962) < .001);
  for (const [currency, value] of [['KRW', 1342.13], ['TWD', 31.94]]) {
    assert.ok(Math.abs(watchYenValue(value, { currency, unit: 'million' }) - 158340000) < .001);
  }
  for (const currency of ['JPY', 'USD', 'EUR', 'KRW', 'TWD']) {
    assert.ok(Number.isFinite(watchYenRates[currency]) && watchYenRates[currency] > 0);
    assert.equal(watchYenValue(1, { currency, unit: 'billion' }), watchYenValue(1000, { currency, unit: 'million' }));
    const before = watchYenValue(100, { currency, unit: 'million' });
    const after = watchYenValue(125, { currency, unit: 'million' });
    assert.ok(Math.abs((after / before - 1) * 100 - 25) < 1e-9);
  }
  assert.equal(watchYenValue(null, { currency: 'USD', unit: 'million' }), null);
  assert.equal(watchYenValue(Infinity, { currency: 'USD', unit: 'million' }), null);
  assert.equal(watchYenAmount(5.2e12), '約5.2兆円');
  assert.equal(watchYenAmount(8500e8), '約8,500億円');
});

test('sorting uses annual amounts or growth, keeps ties stable and missing latest last', () => {
  const cohort = copy(companies.slice(0, 5));
  const values = [[500, 550], [100, 200], [100, 200], [100, 50], [100, 300]];
  const histories = values.map((values, index) => ({ ...growthSeries(values), companyId: cohort[index].id }));
  histories[1].periods.at(-1).operatingIncome.value = 120;
  histories[2].periods.at(-1).operatingIncome.value = -20;
  histories[4].periods.at(-1).revenue = { status: 'unpublished', reason: '最新期未公表' };
  cohort.forEach((company, index) => { company.revenueYoY = 1000 * index; });
  const ids = (metric, sort) => sortWatchCompanies(cohort, histories, metric, sort, 10).map(company => company.id);
  assert.deepEqual(ids('revenue', 'revenue'), [0, 1, 2, 3, 4].map(index => cohort[index].id));
  assert.deepEqual(ids('revenue', 'growth'), [1, 2, 0, 3, 4].map(index => cohort[index].id));
  assert.deepEqual(ids('operating_margin', 'growth'), [1, 0, 3, 2, 4].map(index => cohort[index].id));
  assert.deepEqual(sortWatchCompanies(cohort, [], 'revenue', 'revenue', 10), cohort);
  const precise = [110.0000001, 110.0000002].map((value, index) => ({ ...growthSeries([100, value]), companyId: cohort[index].id }));
  assert.equal(watchFinancials(precise[0], 'revenue').displayValue, watchFinancials(precise[1], 'revenue').displayValue);
  assert.equal(sortWatchCompanies(cohort.slice(0, 2), precise, 'revenue', 'revenue', 10)[0].id, cohort[1].id);
});

test('sort controls persist across metric, theme, years and history and emit only on user changes', () => {
  const ui = controller('', false, { companies, histories: annualHistories, news, now }); ui.render();
  assert.equal(ui.events.length, 0);
  ui.sort('growth').props.onClick(); ui.render();
  assert.match(ui.window.location.hash, /sort=growth/);
  assert.equal(ui.events[0][1].dimension, 'sort'); assert.equal(ui.events[0][1].value, 'growth');
  ui.sort('growth').props.onClick(); ui.render(); assert.equal(ui.events.length, 1);
  ui.metric('operating_margin').props.onClick(); ui.theme('equipment').props.onClick(); ui.period(20).props.onClick(); ui.render();
  assert.equal(ui.sort('growth'), undefined);
  ui.metric('revenue').props.onClick(); ui.render();
  assert.equal(ui.sort('growth').props['aria-pressed'], true);
  assert.match(ui.window.location.hash, /years=20/); assert.match(ui.window.location.hash, /sort=growth/);
  const count = ui.events.length;
  ui.back('#theme=equipment&metric=revenue&sort=bad&years=5');
  assert.equal(ui.sort('revenue').props['aria-pressed'], true); assert.equal(ui.events.length, count);
  ui.back('#theme=equipment&metric=operating_income&sort=growth&years=20');
  assert.equal(ui.sort('growth').props['aria-pressed'], true); assert.equal(ui.card('asml').props.years, 20);
  const tree = ui.render();
  const cardIds = nodes(tree, node => node.props.company?.id).map(node => node.props.company.id);
  assert.deepEqual(cardIds, sortWatchCompanies(companiesForTopic(companies, 'equipment'), annualHistories, 'revenue', 'growth', 20).map(company => company.id));
  ui.cleanup();
});

function chartController(series, metric = 'revenue', years = 10, onZoom) {
  const { watchPlot } = require('../../src/components/chip-pulse/WatchFinancialChart.tsx');
  const data = watchFinancials(series, metric, years);
  const domain = watchFinancialDomain([series], metric, years);
  const filename = path.resolve('src/components/chip-pulse/WatchFinancialChart.tsx');
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const slots = [], exports = {}; let cursor = 0;
  const hooks = { ...React, useState(initial) { const slot = cursor++; if (!(slot in slots)) slots[slot] = initial; return [slots[slot], value => { slots[slot] = typeof value === 'function' ? value(slots[slot]) : value; }]; } };
  vm.runInNewContext(code, { exports, require(id) { return id === 'react' ? hooks : require(id.startsWith('.') ? path.resolve(path.dirname(filename), id) : id); } }, { filename });
  const props = { companyId: series.companyId, name: series.name, points: data.points, segments: data.segments, domain, metric, onZoom };
  const render = () => { cursor = 0; return exports.WatchFinancialChart(props); };
  const control = () => nodes(render(), node => node.props.role === 'slider')[0];
  const tooltip = () => nodes(render(), node => node.props.role === 'tooltip')[0];
  const plot = watchPlot(data.points, domain);
  const target = { getBoundingClientRect: () => ({ left: 50, width: 240 }), focus: () => control().props.onFocus() };
  return { render, control, tooltip, data, plot,
    hover(index) { control().props.onPointerMove({ clientX: 50 + plot.x(data.points[index].period.end), currentTarget: target, pointerType: 'mouse' }); },
    tap(index) { control().props.onPointerDown({ clientX: 50 + plot.x(data.points[index].period.end), currentTarget: target, pointerType: 'touch' }); },
    leave(pointerType = 'mouse') { render().props.onPointerLeave({ pointerType }); },
    key(key) { control().props.onKeyDown({ key, preventDefault() {} }); },
  };
}

test('chart hover, touch and keyboard expose dates, raw amounts, scope and missing reasons without links', () => {
  const series = growthSeries([100, 125, 150, 200]);
  series.periods[1].revenue = { status: 'unpublished', reason: '検証用の欠測理由' };
  series.periods[2].breakBefore = '対象範囲の変更';
  const ui = chartController(series);
  assert.equal(ui.tooltip(), undefined);
  ui.hover(0); assert.equal(ui.control().props['aria-valuenow'], 0);
  let html = renderToStaticMarkup(ui.tooltip());
  assert.match(html, /2019\/12期/); assert.match(html, /原通貨/); assert.match(html, /連結全体/);
  ui.leave(); assert.equal(ui.tooltip(), undefined);
  ui.tap(1); ui.leave('touch');
  assert.equal(ui.control().props['aria-valuenow'], 1);
  html = renderToStaticMarkup(ui.tooltip());
  assert.match(html, /欠測理由/); assert.match(html, /未取得/);
  ui.key('ArrowRight'); assert.equal(ui.control().props['aria-valuenow'], 2);
  assert.match(renderToStaticMarkup(ui.tooltip()), /対象範囲の変更/);
  ui.key('Home'); assert.equal(ui.control().props['aria-valuenow'], 0);
  ui.key('ArrowLeft'); assert.equal(ui.control().props['aria-valuenow'], 0);
  ui.key('End'); ui.key('ArrowRight'); assert.equal(ui.control().props['aria-valuenow'], 3);
  ui.key('Escape'); assert.equal(ui.tooltip(), undefined);
  ui.control().props.onBlur(); assert.equal(ui.tooltip(), undefined);
  assert.equal(nodes(ui.render(), node => node.type === 'a').length, 0);
  const bars = nodes(ui.render(), node => node.type === 'rect');
  assert.equal(bars.length, 3, 'Missing observations have no bar');
  assert.equal(bars[0].props.x, ui.plot.x(series.periods[0].end) - ui.plot.barWidth / 2);
  const last = bars.at(-1).props;
  assert.ok(last.x + last.width <= 240 && last.y >= 0 && last.y + last.height <= 48);
  const margin = chartController(series, 'operating_margin');
  margin.control().props.onFocus(); assert.equal(margin.control().props['aria-valuenow'], 3);
  assert.match(renderToStaticMarkup(margin.tooltip()), /営業利益率/);
  assert.equal(nodes(margin.render(), node => node.type === 'rect').length, 0);
  assert.ok(nodes(margin.render(), node => node.type === 'polyline').length >= 2);
});

test('chart and expand button open the selected period, retaining it after keyboard blur', () => {
  const opened = [], opener = {};
  const ui = chartController(growthSeries([100, 125, 150, 200]), 'revenue', 5, (...args) => opened.push(args));
  const button = () => nodes(ui.render(), node => node.type === 'button')[0];
  assert.equal(button().props['aria-haspopup'], 'dialog');
  button().props.onClick({ currentTarget: opener }); assert.deepEqual(opened.at(-1), [3, opener]);
  ui.hover(1);
  ui.control().props.onClick({ currentTarget: opener }); assert.deepEqual(opened.at(-1), [1, opener]);
  ui.tap(2);
  ui.control().props.onClick({ currentTarget: opener }); assert.deepEqual(opened.at(-1), [2, opener]);
  ui.key('Home'); ui.control().props.onBlur();
  button().props.onClick({ currentTarget: opener }); assert.deepEqual(opened.at(-1), [0, opener]);
});

// Component-level interaction tests use the same hook simulation as the existing chart tests.
// Native layout, focus trapping and platform Escape handling still require a browser check.
function historyController(component, props) {
  const filename = path.resolve('src/components/chip-pulse/WatchFinancialHistory.tsx');
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const slots = [], pending = [], exports = {};
  let cursor = 0;
  const hooks = { ...React,
    useState(initial) { const slot = cursor++; if (!(slot in slots)) slots[slot] = typeof initial === 'function' ? initial() : initial; return [slots[slot], value => { slots[slot] = typeof value === 'function' ? value(slots[slot]) : value; }]; },
    useRef(initial) { const slot = cursor++; return slots[slot] ??= { current: initial }; },
    useEffect(effect, deps) { const slot = cursor++; if (!slots[slot] || deps.some((value, index) => value !== slots[slot].deps[index])) { const previous = slots[slot]; slots[slot] = { deps }; pending.push(() => { previous?.cleanup?.(); slots[slot].cleanup = effect(); }); } },
  };
  const document = { body: { style: { overflow: 'auto' } } };
  vm.runInNewContext(code, { exports, document, require(id) { return id === 'react' ? hooks : require(id.startsWith('.') ? path.resolve(path.dirname(filename), id) : id); } }, { filename });
  return { document, render() { cursor = 0; return exports[component](props); }, flush() { pending.splice(0).forEach(effect => effect()); }, cleanup() { slots.forEach(slot => slot?.cleanup?.()); } };
}

function comboController(series, years = 10, initialIndex = series.periods.length - 1) {
  const props = { companyId: series.companyId, revenue: watchFinancials(series, 'revenue', years), margin: watchFinancials(series, 'operating_margin', years),
    revenueDomain: watchFinancialDomain([series], 'revenue', years), marginDomain: watchFinancialDomain([series], 'operating_margin', years), initialIndex };
  const ui = historyController('WatchFinancialComboChart', props);
  return { ...ui, props, control: () => nodes(ui.render(), node => node.props.role === 'slider')[0] };
}

test('expanded combo plots use company axes and the selected window, preserve losses and never bridge gaps', () => {
  const { watchPlot } = require('../../src/components/chip-pulse/WatchFinancialChart.tsx');
  const series = growthSeries(Array.from({ length: 20 }, (_, index) => 100 + index * 20));
  series.periods[16].operatingIncome = { status: 'unretrieved', reason: '営業利益の欠測' };
  series.periods[18].breakBefore = '対象範囲の変更';
  series.periods[18].operatingIncome.value = -100;
  for (const years of [5, 10, 20]) {
    const ui = comboController(series, years, 1);
    const tree = ui.render();
    assert.equal(ui.props.revenue.points.length, years);
    assert.equal(ui.control().props['aria-valuenow'], 1);
    assert.equal(ui.props.revenueDomain.min, 0);
    const large = copy(series); large.periods.at(-1).revenue.value *= 100;
    assert.ok(ui.props.revenueDomain.max < watchFinancialDomain([large, series], 'revenue', years).max);
    const size = { width: 720, height: 280, inset: 8, maxBarWidth: 40 };
    const plot = watchPlot(ui.props.revenue.points, ui.props.revenueDomain, size);
    const right = watchPlot(ui.props.margin.points, ui.props.marginDomain, size);
    const bars = nodes(tree, node => node.type === 'rect');
    assert.equal(bars.length, years);
    assert.ok(bars.at(-1).props.height > 150, 'The smaller company uses most of the expanded plot height');
    for (let index = 0; index < bars.length; index++) {
      const bar = bars[index].props, point = ui.props.revenue.points[index];
      assert.equal(bar.y, plot.y(point.value));
      assert.ok(bar.x >= 0 && bar.x + bar.width <= 720 && bar.y + bar.height <= 280);
    }
    assert.ok(ui.props.marginDomain.min < 0);
    const lines = nodes(tree, node => node.type === 'polyline');
    assert.equal(lines.length, 3, 'Both the missing income and reporting boundary split the margin line');
    ui.props.margin.segments.forEach((segment, index) => assert.equal(lines[index].props.points, segment.map(point => `${plot.x(point.period.end)},${right.y(point.value)}`).join(' ')));
    assert.ok(nodes(tree, node => node.type === 'circle').some(node => node.props.cy > right.y(0)), 'Negative margin is below the right-axis zero');
    ui.control().props.onKeyDown({ key: 'End', preventDefault() {} });
    assert.match(ui.control().props['aria-valuetext'], /営業利益率/);
    ui.control().props.onKeyDown({ key: 'Home', preventDefault() {} });
    assert.equal(ui.control().props['aria-valuenow'], 0);
    ui.control().props.onKeyDown({ key: 'ArrowLeft', preventDefault() {} });
    assert.equal(ui.control().props['aria-valuenow'], 0);
    ui.control().props.onKeyDown({ key: 'ArrowRight', preventDefault() {} });
    assert.equal(ui.control().props['aria-valuenow'], 1);
    let prevented = false;
    ui.control().props.onKeyDown({ key: 'Escape', preventDefault() { prevented = true; } });
    assert.equal(prevented, false, 'Escape must reach the native dialog');
  }
});

test('combo selection handles hover, taps, missing values, a single period and empty histories', () => {
  const series = growthSeries([100, 120, 140]);
  series.periods[1].revenue = { status: 'unpublished', reason: '売上高未公表' };
  const ui = comboController(series);
  const { watchPlot } = require('../../src/components/chip-pulse/WatchFinancialChart.tsx');
  const plot = watchPlot(ui.props.revenue.points, ui.props.revenueDomain, { width: 720, height: 280, inset: 8, maxBarWidth: 40 });
  const target = { getBoundingClientRect: () => ({ left: 50, width: 720 }), focus() {} };
  ui.control().props.onPointerMove({ pointerType: 'mouse', clientX: 50 + plot.x(series.periods[0].end), currentTarget: target });
  assert.equal(ui.control().props['aria-valuenow'], 0);
  ui.control().props.onPointerDown({ pointerType: 'touch', clientX: 50 + plot.x(series.periods[1].end), currentTarget: target });
  assert.equal(ui.control().props['aria-valuenow'], 1);
  const values = nodes(ui.render(), node => node.props.className === 'comboValues')[0];
  assert.match(renderToStaticMarkup(values), /売上高未公表/);
  assert.match(renderToStaticMarkup(values), /算出不可/);
  assert.equal(nodes(ui.render(), node => node.type === 'rect').length, 2);
  const single = comboController(growthSeries([100]));
  assert.equal(single.control().props['aria-valuenow'], 0);
  const bar = nodes(single.render(), node => node.type === 'rect')[0].props;
  assert.equal(bar.x + bar.width / 2, 360);
  assert.ok(Number.isFinite(bar.height));
  const empty = growthSeries([]);
  assert.match(renderToStaticMarkup(comboController(empty).render()), /年次履歴未取得/);
});

test('history wrapper carries selection and years into the dialog and closes without URL changes', () => {
  const series = growthSeries([100, 120, 140]), opener = {};
  const props = { history: series, companyId: series.companyId, name: series.name, years: 5, href: '/semiconductor-watch/earnings/asml?years=5#annual-history',
    ...watchFinancials(series, 'revenue', 5), metric: 'revenue', domain: watchFinancialDomain([series], 'revenue', 5) };
  const ui = historyController('WatchFinancialHistory', props);
  const chart = nodes(ui.render(), node => typeof node.props.onZoom === 'function')[0];
  chart.props.onZoom(1, opener);
  const dialog = nodes(ui.render(), node => node.type?.name === 'WatchFinancialDialog')[0];
  assert.equal(dialog.props.initialIndex, 1); assert.equal(dialog.props.opener, opener);
  assert.equal(dialog.props.years, 5); assert.equal(dialog.props.href, props.href);
  dialog.props.onClose();
  assert.equal(nodes(ui.render(), node => node.type?.name === 'WatchFinancialDialog').length, 0);
});

test('native dialog lifecycle restores scroll and focus; close, cancel and genuine backdrop clicks exit', () => {
  const history = copy(annualHistories.find(series => series.companyId === 'kla'));
  let closed = 0, focused = 0, shown = 0, nativeClosed = 0;
  const props = { history, years: 5, href: '/semiconductor-watch/earnings/kla?years=5#annual-history', initialIndex: 1,
    opener: { focus() { focused++; } }, onClose() { closed++; } };
  const ui = historyController('WatchFinancialDialog', props);
  const tree = ui.render();
  const element = { showModal() { shown++; }, close() { nativeClosed++; }, getBoundingClientRect: () => ({ left: 100, right: 900, top: 100, bottom: 700 }) };
  tree.props.ref.current = element;
  ui.flush(); assert.equal(shown, 1); assert.equal(ui.document.body.style.overflow, 'hidden');
  const combo = nodes(tree, node => node.type?.name === 'WatchFinancialComboChart')[0];
  assert.equal(combo.props.initialIndex, 1);
  assert.equal(combo.props.revenue.points.length, 5);
  assert.deepEqual(combo.props.revenueDomain, watchFinancialDomain([history], 'revenue', 5));
  const html = renderToStaticMarkup(tree);
  assert.match(html, /企業ごとの目盛り/); assert.match(html, /算出値/); assert.match(html, /FRB H.10/);
  assert.match(html, new RegExp(watchExchange.asOf)); assert.ok(html.includes(props.href));
  const close = nodes(tree, node => node.type === 'button')[0];
  assert.equal(close.props.autoFocus, true); close.props.onClick(); assert.equal(closed, 1);
  let prevented = false;
  tree.props.onCancel({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true); assert.equal(closed, 2);
  const event = (x, y) => ({ target: element, currentTarget: element, clientX: x, clientY: y });
  tree.props.onPointerDown(event(200, 200)); tree.props.onClick(event(200, 200)); assert.equal(closed, 2);
  tree.props.onPointerDown(event(200, 200)); tree.props.onClick(event(50, 50)); assert.equal(closed, 2, 'Dragging from the plot onto the backdrop does not dismiss');
  tree.props.onPointerDown(event(50, 50)); tree.props.onClick(event(50, 50)); assert.equal(closed, 3);
  ui.cleanup(); assert.equal(nativeClosed, 1); assert.equal(ui.document.body.style.overflow, 'auto'); assert.equal(focused, 1);
});
