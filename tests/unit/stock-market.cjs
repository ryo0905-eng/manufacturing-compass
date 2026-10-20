const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...rest) { return resolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, parent, ...rest); };
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
require.extensions['.css'] = module => { module.exports = new Proxy({}, { get: (_, key) => key === '__esModule' ? false : key }); };
const { stockListings, stockIndices } = require('../../src/data/stock-market.ts');
const { readStockCompany, stockCompanyFromSymbol, stockHref, relatedStockNews, buildStockProfiles } = require('../../src/lib/stock-market.ts');
const { isStockMarketAvailable, isStockMarketIndexable } = require('../../src/lib/stock-market-release.ts');
const { companies } = require('../../src/data/companies.ts');
const { earningsReleases } = require('../../src/lib/earnings.ts');
const { buildWatchNews } = require('../../src/lib/watch.ts');
const Page = require('../../src/app/(ja)/semiconductor-watch/stocks/page.tsx').default;
const { WatchNavigation } = require('../../src/components/chip-pulse/WatchNavigation.tsx');
const sitemap = require('../../src/app/sitemap.ts').default;
const now = '2026-10-20T00:00:00Z';

test('10 companies join existing pages; only actual earnings releases get a detail link', () => {
  const profiles = buildStockProfiles(companies, earningsReleases, buildWatchNews(), now);
  assert.equal(profiles.length, 10);
  assert.equal(new Set(stockListings.map(item => item.symbol)).size, 10);
  assert.equal(new Set(stockListings.map(item => item.companyId)).size, 10);
  assert.deepEqual(profiles.filter(item => item.earningsHref).map(item => item.companyId), ['nvidia', 'tsmc', 'intel', 'asml', 'applied-materials', 'tokyo-electron']);
  for (const profile of profiles) {
    assert.ok(companies.some(company => profile.companyHref === `/companies/${company.slug}`));
    assert.match(profile.sourceUrl, /^https:\/\/www\.tradingview\.com\/symbols\//);
    assert.ok(profile.news.length <= 3);
    if (profile.earningsHref) assert.ok(earningsReleases.some(release => profile.earningsHref === `/semiconductor-watch/earnings/${release.companyId}`));
  }
  assert.deepEqual(profiles.filter(item => item.embedding === 'external').map(item => item.companyId), ['tokyo-electron', 'advantest']);
  assert.ok(stockIndices.every(item => item.embedding === 'external' && item.displayVerifiedAt === null));
});

test('shared hash handles every listed company and rejects unknown or executable input', () => {
  for (const { companyId } of stockListings) {
    assert.equal(readStockCompany(stockHref(companyId).split('#')[1]), companyId);
  }
  for (const hash of ['', '#company=unknown', '#company=javascript%3Aalert(1)', '#company=NASDAQ%3ANVDA', '#company=__proto__', '#company=%E0%A4%A']) assert.equal(readStockCompany(hash), 'nvidia');
  assert.equal(stockHref('https://example.com/evil'), '/semiconductor-watch/stocks#company=nvidia');
  assert.equal(stockCompanyFromSymbol('NASDAQ:NVDA'), 'nvidia');
  for (const value of ['NVDA', 'NASDAQ:AAPL', 'TSE:8035', 'javascript:alert(1)', null, {}, 1]) assert.equal(stockCompanyFromSymbol(value), null);
});

test('related news uses company IDs and announcement dates; excludes future, changed and non-articles', () => {
  const item = (id, date, overrides = {}) => ({ id, date, kind: 'article', companyIds: ['nvidia'], ...overrides });
  const news = [item('old', '2025-01-01'), item('second', '2026-10-18'), item('latest', '2026-10-19'), item('third', '2026-10-17'), item('future', '2026-10-21'), item('changed', '2026-10-19', { changed: true }), item('earnings', '2026-10-19', { kind: 'earnings' }), item('other-company', '2026-10-19', { companyIds: ['amd'] })];
  const original = JSON.stringify(news);
  assert.deepEqual(relatedStockNews(news, 'nvidia', now).map(item => item.id), ['latest', 'second', 'third']);
  assert.deepEqual(relatedStockNews(news, 'qualcomm', now), []);
  assert.equal(JSON.stringify(news), original);
});

test('production route, discovery navigation and indexing stay off until explicitly enabled', () => {
  assert.equal(isStockMarketAvailable({ NODE_ENV: 'production' }), false);
  assert.equal(isStockMarketAvailable({ NODE_ENV: 'development', STOCK_MARKET_ENABLED: 'false' }), true);
  assert.equal(isStockMarketIndexable({}), false);
  assert.equal(isStockMarketIndexable({ STOCK_MARKET_ENABLED: 'false' }), false);
  assert.equal(isStockMarketIndexable({ STOCK_MARKET_ENABLED: 'true' }), true);
  const previousNode = process.env.NODE_ENV;
  const previousFlag = process.env.STOCK_MARKET_ENABLED;
  try {
    process.env.NODE_ENV = 'production';
    delete process.env.STOCK_MARKET_ENABLED;
    assert.throws(() => Page(), /NEXT_HTTP_ERROR_FALLBACK;404/);
    assert.ok(!sitemap().some(entry => entry.url.endsWith('/semiconductor-watch/stocks')));
    assert.doesNotMatch(renderToStaticMarkup(React.createElement(WatchNavigation)), /href="\/semiconductor-watch\/stocks"/);
    process.env.STOCK_MARKET_ENABLED = 'true';
    const html = renderToStaticMarkup(React.createElement(Page));
    assert.match(html, /半導体株式市場ウォッチ/);
    assert.match(html, /CollectionPage/);
    assert.match(html, /BreadcrumbList/);
    assert.match(html, /company=advantest/);
    assert.match(html, /NASDAQ総合/);
    assert.equal(sitemap().filter(entry => entry.url.endsWith('/semiconductor-watch/stocks')).length, 1);
    assert.doesNotMatch(html, /確認用プレビュー/);
    assert.doesNotMatch(html, /href="\/semiconductor-watch\/earnings\/(amd|broadcom|qualcomm|advantest)"/);
    assert.match(renderToStaticMarkup(React.createElement(WatchNavigation, { current: 'stocks' })), /aria-current="page"/);
  } finally {
    if (previousNode === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousNode;
    if (previousFlag === undefined) delete process.env.STOCK_MARKET_ENABLED; else process.env.STOCK_MARKET_ENABLED = previousFlag;
  }
});

// Match the existing watch tests: exercise our hooks/DOM lifecycle without starting a browser
// or downloading/executing third-party code. This does not verify TradingView's actual UI/data.
function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(item => nodes(item, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
function controller(filename, pick, initialProps = {}, hash = '') {
  const slots = [], effects = [], events = [], listeners = new Map(), observers = [];
  let cursor = 0, props = initialProps, focused = 0, scrolled = 0;
  class Element {
    constructor(tag) { this.tag = tag; this.children = []; this.style = {}; this.attributes = {}; this.listeners = new Map(); }
    appendChild(child) { child.parent = this; this.children.push(child); return child; }
    setAttribute(key, value) { this.attributes[key] = value; }
    addEventListener(key, value) { this.listeners.set(key, value); }
    removeEventListener(key) { this.listeners.delete(key); }
    remove() { if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this); this.parent = null; }
    focus() { focused++; }
    scrollIntoView() { scrolled++; }
  }
  class WidgetEvent {
    constructor(detail) { this.detail = detail; this.defaultPrevented = false; }
    preventDefault() { this.defaultPrevented = true; }
  }
  class Observer {
    constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this); }
    observe(target) { this.target = target; }
    disconnect() { this.disconnected = true; }
  }
  const window = { location: { hash }, history: { pushState(_state, _unused, href) { window.location.hash = href.slice(href.indexOf('#')); } }, IntersectionObserver: Observer,
    addEventListener(key, fn) { listeners.set(key, fn); }, removeEventListener(key) { listeners.delete(key); } };
  const hooks = { ...React,
    useState(initial) { const slot = cursor++; if (!(slot in slots)) slots[slot] = typeof initial === 'function' ? initial() : initial; return [slots[slot], value => { slots[slot] = typeof value === 'function' ? value(slots[slot]) : value; }]; },
    useRef(initial) { const slot = cursor++; return slots[slot] ??= { current: initial }; },
    useCallback(callback, deps) { const slot = cursor++; const old = slots[slot]; if (!old || deps.some((value, i) => !Object.is(value, old.deps[i]))) slots[slot] = { callback, deps }; return slots[slot].callback; },
    useEffect(fn, deps) { const slot = cursor++, old = effects[slot]; if (!old || deps.some((value, i) => !Object.is(value, old.deps[i]))) { old?.cleanup?.(); effects[slot] = { deps, pending: fn }; } },
  };
  const exports = {};
  const absolute = path.resolve(filename);
  const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { exports, window, document: { createElement: tag => new Element(tag) }, CustomEvent: WidgetEvent, IntersectionObserver: Observer,
    require(id) {
      if (id === 'react') return hooks;
      if (id === '@/lib/analytics') return { trackEvent: (...args) => events.push(args) };
      return require(id.startsWith('.') ? path.resolve(path.dirname(absolute), id) : id);
    } }, { filename: absolute });
  const Component = pick(exports);
  function render(nextProps = props) {
    props = nextProps; cursor = 0;
    const tree = Component(props);
    for (const node of nodes(tree, node => typeof node.type === 'string' && node.props?.ref && typeof node.props.ref === 'object')) node.props.ref.current ??= new Element(node.type);
    for (const effect of effects) if (effect?.pending) { const fn = effect.pending; delete effect.pending; effect.cleanup = fn(); }
    return tree;
  }
  return { render, events, listeners, observers, window, WidgetEvent, stats: () => ({ focused, scrolled }), cleanup: () => effects.forEach(effect => effect?.cleanup?.()) };
}

test('company, chart, earnings, news and history stay aligned without events during restoration', () => {
  const profiles = buildStockProfiles(companies, earningsReleases, buildWatchNews(), now);
  const ui = controller('src/components/stocks/StockExplorer.tsx', exports => exports.StockExplorer, { profiles }, '#company=asml');
  ui.render();
  const select = () => nodes(ui.render(), node => node.type === 'select')[0];
  assert.equal(select().props.value, 'asml');
  assert.equal(ui.events.length, 0);
  select().props.onChange({ target: { value: 'tokyo-electron' } });
  let tree = ui.render();
  assert.equal(select().props.value, 'tokyo-electron');
  assert.equal(ui.window.location.hash, '#company=tokyo-electron');
  assert.equal(nodes(tree, node => node.type?.name === 'SymbolOverview').length, 0);
  assert.equal(nodes(tree, node => node.props?.href === '/semiconductor-watch/earnings/tokyo-electron').length, 1);
  nodes(tree, node => node.type?.name === 'StockMarketTable')[0].props.onSelect('amd');
  tree = ui.render();
  assert.equal(nodes(tree, node => node.type?.name === 'SymbolOverview')[0].props.symbol, 'NASDAQ:AMD');
  assert.equal(nodes(tree, node => node.props?.href === '/semiconductor-watch/earnings/amd').length, 0);
  assert.equal(ui.stats().focused, 1); assert.equal(ui.stats().scrolled, 1);
  const eventCount = ui.events.length;
  ui.window.location.hash = '#company=tsmc'; ui.listeners.get('popstate')();
  assert.equal(select().props.value, 'tsmc');
  ui.window.location.hash = '#company=unknown'; ui.listeners.get('hashchange')();
  assert.equal(select().props.value, 'nvidia');
  assert.equal(ui.events.length, eventCount);
  ui.cleanup(); assert.equal(ui.listeners.size, 0);
});

test('each chart owns its async mount and removes it before a different symbol is initialized', () => {
  const ui = controller('src/components/stocks/StockWidgets.tsx', exports => exports.SymbolOverview, { symbol: 'NASDAQ:NVDA', name: 'NVIDIA', sourceUrl: stockListings[0].sourceUrl });
  const tree = ui.render();
  const host = nodes(tree, node => node.props?.ref)[0].props.ref.current;
  const oldMount = host.children[0], oldScript = oldMount.children[0];
  assert.match(oldScript.src, /^https:\/\/s3\.tradingview\.com\/external-embedding\//);
  assert.equal(JSON.parse(oldScript.textContent).symbols[0][1], 'NASDAQ:NVDA|1D');
  ui.render({ symbol: 'NASDAQ:AMD', name: 'AMD', sourceUrl: stockListings[1].sourceUrl });
  assert.equal(host.children.length, 1);
  assert.notEqual(host.children[0], oldMount);
  assert.equal(oldMount.parent, null); assert.equal(oldScript.onerror, null);
  assert.equal(JSON.parse(host.children[0].children[0].textContent).symbols[0][1], 'NASDAQ:AMD|1D');
  ui.cleanup(); assert.equal(host.children.length, 0);
});

test('performance widget uses only listed US symbols and intercepts only known symbol events', () => {
  const selections = [];
  const ui = controller('src/components/stocks/StockWidgets.tsx', exports => exports.MiniChart({ symbol: '' }).props.children.type, { kind: 'market', onSelect: id => selections.push(id) });
  const tree = ui.render();
  const host = nodes(tree, node => node.props?.ref)[0].props.ref.current;
  const element = host.children[0];
  assert.equal(element.tag, 'tv-market-data');
  assert.equal(element.attributes.view, 'performance');
  assert.equal(element.attributes.heatmap, '');
  const symbols = JSON.parse(element.attributes['symbol-sectors'])[0].symbols;
  assert.equal(symbols.length, 8); assert.ok(symbols.every(symbol => !symbol.startsWith('TSE:')));
  const handler = element.listeners.get('tv-link-open');
  const known = new ui.WidgetEvent({ context: { symbol: 'NYSE:TSM' } }); handler(known);
  assert.equal(known.defaultPrevented, true); assert.deepEqual(selections, ['tsmc']);
  for (const detail of [null, {}, { context: {} }, { context: { symbol: 'NASDAQ:AAPL' } }, { context: { symbol: 'TSE:8035' } }]) {
    const unknown = new ui.WidgetEvent(detail); handler(unknown); assert.equal(unknown.defaultPrevented, false);
  }
  ui.render(); assert.equal(host.children.length, 1);
  ui.cleanup(); assert.equal(element.listeners.size, 0); assert.equal(host.children.length, 0);
});

test('offscreen performance widget stays unloaded until near the viewport', () => {
  const ui = controller('src/components/stocks/StockWidgets.tsx', exports => exports.StockMarketTable, { onSelect() {} });
  assert.equal(nodes(ui.render(), node => node.type?.name === 'WebWidget').length, 0);
  const observer = ui.observers[0];
  observer.callback([{ isIntersecting: false }]);
  assert.equal(nodes(ui.render(), node => node.type?.name === 'WebWidget').length, 0);
  observer.callback([{ isIntersecting: true }]);
  assert.equal(nodes(ui.render(), node => node.type?.name === 'WebWidget').length, 1);
  assert.equal(observer.disconnected, true); ui.cleanup();
});
