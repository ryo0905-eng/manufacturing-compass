const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function loader(overrides = {}, globals = {}) {
  const cache = new Map();
  function load(stem) {
    const file = [stem, `${stem}.ts`, `${stem}.tsx`, path.join(stem, 'index.ts')]
      .find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (!file) throw Error(`Missing module: ${stem}`);
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    vm.runInNewContext(output, {
      exports, process, URL, URLSearchParams, console, ...globals,
      require(id) {
        if (id in overrides) return overrides[id];
        if (id === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
        if (id === 'next/navigation') return { usePathname: () => '/', notFound() { throw Error('not found'); } };
        if (id.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
        if (id.startsWith('@/')) return load(`src/${id.slice(2)}`);
        if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id));
        return require(id);
      },
    }, { filename: file });
    return exports;
  }
  return load;
}

const load = loader();
const { normalizeSiteSearch, searchSiteEntries, getSiteSearchPage } = load('src/lib/site-search');
const { buildSiteSearchIndex } = load('src/lib/site-search-index');
const entries = buildSiteSearchIndex();
const { companies, isCompanyIndexable } = load('src/data/companies');
const { beginnerGuides, getGuideBySlug } = load('src/content/guides');
const closedGuide = 'semiconductor-recruitment-agent-review';
assert.equal(getGuideBySlug(closedGuide), undefined);
assert.ok(!entries.some(entry => entry.href === `/guides/${closedGuide}`));
const { learningTools } = load('src/data/learning-tools');
const { buildAtlasCompanies, buildDirectoryCompanies } = load('src/lib/company-explorer');
const { siteLinks, siteNavigationGroups, currentNavigationPage } = load('src/data/site-navigation');

assert.equal(normalizeSiteSearch('　ＣＰＫ  TEST　'), 'cpk test');
assert.equal(searchSiteEntries(entries, 'ｃｐｋ')[0].id, 'tool:cpk');
assert.equal(searchSiteEntries(entries, 'cPk')[0].id, 'tool:cpk');
assert.ok(searchSiteEntries(entries, '東京　エレクトロン', 'company').some(entry => entry.id === 'company:tokyo-electron'));
assert.equal(searchSiteEntries(entries, 'TEL', 'company')[0].id, 'company:tokyo-electron');
assert.ok(searchSiteEntries(entries, 'エッチング', 'article').length > 0);
assert.ok(searchSiteEntries(entries, '職種', 'page').some(entry => entry.href === '/roles'));
assert.equal(searchSiteEntries(entries, 'zzzz存在しない情報').length, 0);
assert.equal(searchSiteEntries(entries, '　 ').length, 0);
assert.ok(searchSiteEntries(entries, '半導体', 'company').every(entry => entry.kind === 'company'));

const fixture = (id, title, keywords, description = '') => ({ id, title, keywords, description, kind: 'article', href: `/guides/${id}` });
const priority = [fixture('description', '別の話題', [], '工程改善'), fixture('keyword', '解説', ['工程改善']), fixture('title', '工程改善', [])];
assert.equal(searchSiteEntries(priority, '工程改善').map(entry => entry.id).join(','), 'title,keyword,description');
assert.equal(searchSiteEntries([fixture('a', '東京', ['エレクトロン'])], '東京 エレクトロン').length, 1);
assert.equal(searchSiteEntries(priority, '工程改善 未掲載').length, 0);
const many = Array.from({ length: 29 }, (_, index) => fixture(`entry-${index}`, `計測 ${index}`, []));
assert.equal(getSiteSearchPage(many, '計測').items.length, 12);
assert.equal(getSiteSearchPage(many, '計測', 'all', 24).items.length, 24);
assert.equal(getSiteSearchPage(many, '計測', 'all', 36).items.length, 29);
assert.equal(getSiteSearchPage(many, '計測', 'all', 36).hasMore, false);

assert.equal(new Set(entries.map(entry => entry.href)).size, entries.length);
assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length);
for (const entry of entries) {
  assert.equal(Object.keys(entry).sort().join(','), 'description,href,id,keywords,kind,title');
  assert.ok(entry.title && entry.description && entry.href.startsWith('/'));
}
assert.equal(entries.filter(entry => entry.kind === 'article').length, beginnerGuides.length);
assert.equal(entries.filter(entry => entry.kind === 'tool').length, learningTools.length);
assert.equal(entries.filter(entry => entry.kind === 'company').length, buildAtlasCompanies(buildDirectoryCompanies(companies, [], [])).length);
for (const entry of entries.filter(entry => entry.kind === 'company')) {
  const company = companies.find(company => `company:${company.id}` === entry.id);
  assert.equal(entry.href, company && isCompanyIndexable(company) ? `/companies/${company.slug}` : `/industry-map#company=${entry.id.slice('company:'.length)}`);
}
assert.equal(entries.find(entry => entry.id === 'company:synopsys').href, '/industry-map#company=synopsys');
assert.ok(entries.find(entry => entry.id === 'tool:semiconductor-process').keywords.includes(siteLinks.semiconductor_process.label));
assert.equal(entries.filter(entry => entry.href === siteLinks.factory_projects.href).length, 1);

const withDraft = loader({ '@/content/guides': { beginnerGuides: [...beginnerGuides, { ...beginnerGuides[0], slug: 'never-publish', status: 'draft', title: 'PRIVATE_FIXTURE' }] } })('src/lib/site-search-index').buildSiteSearchIndex();
assert.ok(!JSON.stringify(withDraft).includes('PRIVATE_FIXTURE'));
const gated = loader({ '@/data/correlation-causation': { isCorrelationPublished: () => false } })('src/lib/site-search-index').buildSiteSearchIndex();
assert.ok(!gated.some(entry => entry.href === '/tools/correlation-causation'));
assert.equal(siteNavigationGroups.length, 4);
for (const group of siteNavigationGroups) {
  for (const id of [...group.linkIds, ...group.journeyIds]) assert.ok(siteLinks[id]);
}
assert.equal(currentNavigationPage('/', '/#home-rankings'), undefined);
assert.equal(currentNavigationPage('/tools/cpk', '/tools'), 'location');
assert.equal(currentNavigationPage('/industry-map', '/industry-map'), 'page');
assert.equal(currentNavigationPage('/segments/equipment', '/industry-map'), 'location');

// Drive the search component's handlers without a browser or real analytics.
function searchHarness() {
  const hooks = [];
  const events = [];
  let cursor = 0;
  const fakeReact = {
    ...React,
    useState(initial) {
      const index = cursor++;
      if (!(index in hooks)) hooks[index] = initial;
      return [hooks[index], value => { hooks[index] = typeof value === 'function' ? value(hooks[index]) : value; }];
    },
    useRef(value) { const index = cursor++; return hooks[index] ??= { current: value }; },
    useMemo(fn) { return fn(); },
    useEffect() {},
  };
  const { SiteSearch } = loader({ react: fakeReact, '@/lib/analytics': { trackSiteSearchEvent: (...event) => events.push(event) } })('src/components/SiteSearch');
  function render() { cursor = 0; return SiteSearch({ entries }); }
  function find(tree, predicate) {
    if (!tree || typeof tree !== 'object') return undefined;
    if (predicate(tree)) return tree;
    for (const child of React.Children.toArray(tree.props?.children)) {
      const match = find(child, predicate);
      if (match) return match;
    }
  }
  return { render, find, events };
}
const harness = searchHarness();
let tree = harness.render();
let input = harness.find(tree, node => node.type === 'input');
assert.equal(input.props.name, undefined, 'Native form fallback must not send the keyword in a URL');
input.props.onCompositionStart();
input.props.onChange({ currentTarget: { value: 'エッチン' } });
tree = harness.render();
assert.equal(harness.find(tree, node => node.props?.role === 'status'), undefined);
assert.equal(harness.events.length, 0);
input = harness.find(tree, node => node.type === 'input');
input.props.onCompositionEnd({ currentTarget: { value: 'エッチング' } });
tree = harness.render();
assert.ok(harness.find(tree, node => node.props?.role === 'status'));
assert.equal(harness.events.filter(([event]) => event === 'site_search_start').length, 1);
harness.find(tree, node => node.type === 'input').props.onChange({ currentTarget: { value: 'Cpk' } });
tree = harness.render();
assert.equal(harness.events.filter(([event]) => event === 'site_search_start').length, 1);
harness.find(tree, node => node.type === 'button' && node.props.children === 'ツール').props.onClick();
tree = harness.render();
const resultLink = harness.find(tree, node => node.props?.href === '/tools/cpk' && node.props?.onClick);
resultLink.props.onClick();
assert.equal(harness.events.at(-1)[0], 'site_search_result_click');
for (const [, properties] of harness.events) {
  assert.ok(Object.keys(properties).every(key => ['result_kind', 'result_count', 'result_id'].includes(key)));
  assert.ok(!JSON.stringify(properties).includes('エッチング'));
}
harness.find(tree, node => node.type === 'button' && node.props.children === 'クリア').props.onClick();
tree = harness.render();
assert.equal(harness.find(tree, node => node.type === 'input').props.value, '');
assert.equal(harness.find(tree, node => node.props?.role === 'status'), undefined);

// SSR keeps the journeys and ranking in order, with one hero Career Compass CTA.
const ssrLoad = loader({ '@/lib/analytics': { trackEvent() {}, trackCareerCompassEvent() {} },
  'next/image': { __esModule: true, default: () => null },
  '@/components/ranking-time-machine/RankingTimeMachinePreview': { RankingTimeMachinePreview: () => null },
});
const html = renderToStaticMarkup(React.createElement(ssrLoad('src/app/(ja)/page').default));
assert.ok(html.indexOf('id="home-search"') < html.indexOf('id="home-purpose-technology"'));
assert.ok(html.indexOf('id="home-purpose-career"') < html.indexOf('id="home-rankings"'));
assert.equal((html.match(/id="home-purpose-/g) ?? []).length, 4);
for (const group of siteNavigationGroups) for (const id of group.journeyIds) assert.ok(html.includes(`href="${siteLinks[id].href}"`));
// Verify dropdown exclusivity, dismissal and focus restoration with a minimal DOM.
function navigationHarness() {
  const hooks = [], pending = [], events = [];
  const documentListeners = new Map(), windowListeners = new Map();
  let cursor = 0, breakpointListener;
  const document = { activeElement: null, addEventListener: (name, fn) => documentListeners.set(name, fn), removeEventListener: name => documentListeners.delete(name) };
  class Element {
    constructor(props = {}, parent = null) { this.props = props; this.parent = parent; this.dataset = { navigationGroup: props['data-navigation-group'] }; }
    contains(target) { for (let item = target; item; item = item.parent) if (item === this) return true; return false; }
    focus() { document.activeElement = this; }
    closest() { for (let item = this; item; item = item.parent) if (item.dataset.navigationGroup) return item; return null; }
  }
  const searchInput = new Element();
  document.getElementById = id => id === 'site-search-input' ? searchInput : null;
  const media = { matches: true, addEventListener: (_, fn) => { breakpointListener = fn; }, removeEventListener() {} };
  const window = { location: { pathname: '/' }, matchMedia: () => media, addEventListener: (name, fn) => windowListeners.set(name, fn), removeEventListener: name => windowListeners.delete(name) };
  const fakeReact = {
    ...React,
    useId: () => 'test-navigation',
    useState(initial) { const index = cursor++; if (!(index in hooks)) hooks[index] = initial; return [hooks[index], value => { hooks[index] = typeof value === 'function' ? value(hooks[index]) : value; }]; },
    useRef(value) { const index = cursor++; return hooks[index] ??= { current: value }; },
    useEffect(fn, deps) {
      const index = cursor++, previous = hooks[index];
      if (!previous || deps.some((dep, index) => dep !== previous.deps[index])) {
        pending.push(() => { previous?.cleanup?.(); hooks[index] = { deps, cleanup: fn() }; });
      }
    },
  };
  const { HeaderNavigation } = loader({ react: fakeReact, '@/lib/analytics': { trackEvent: (...event) => events.push(event) } }, { window, document, HTMLElement: Element, Node: Element })('src/components/HeaderNavigation');
  const dom = new WeakMap();
  function bind(node, parent = null) {
    if (!node || typeof node !== 'object') return;
    const element = new Element(node.props, parent);
    dom.set(node, element);
    if (typeof node.props?.ref === 'function') node.props.ref(element);
    else if (node.props?.ref) node.props.ref.current = element;
    for (const child of React.Children.toArray(node.props?.children)) bind(child, element);
  }
  function find(node, predicate) {
    if (!node || typeof node !== 'object') return undefined;
    if (predicate(node)) return node;
    for (const child of React.Children.toArray(node.props?.children)) { const match = find(child, predicate); if (match) return match; }
  }
  function render() { cursor = 0; const entry = HeaderNavigation(); const tree = entry.type(entry.props); bind(tree); for (const fn of pending.splice(0)) fn(); return tree; }
  return { render, find, dom, document, documentListeners, windowListeners, media, resize: () => breakpointListener(), searchInput, events, Element };
}
const nav = navigationHarness();
let menu = nav.render();
const groupButton = (tree, id) => nav.find(tree, node => node.type === 'button' && node.props['aria-controls'] === `test-navigation-${id}`);
groupButton(menu, 'technology').props.onClick();
menu = nav.render();
assert.equal(groupButton(menu, 'technology').props['aria-expanded'], true);
groupButton(menu, 'industry').props.onClick();
menu = nav.render();
assert.equal(groupButton(menu, 'technology').props['aria-expanded'], false);
assert.equal(groupButton(menu, 'industry').props['aria-expanded'], true);
nav.documentListeners.get('keydown')({ key: 'Escape', preventDefault() {} });
assert.equal(nav.document.activeElement.props['aria-controls'], 'test-navigation-industry');
menu = nav.render();
assert.equal(groupButton(menu, 'industry').props['aria-expanded'], false);
groupButton(menu, 'technology').props.onClick();
menu = nav.render();
nav.documentListeners.get('click')({ target: new nav.Element() });
menu = nav.render();
assert.equal(groupButton(menu, 'technology').props['aria-expanded'], false);
groupButton(menu, 'technology').props.onClick();
menu = nav.render();
nav.windowListeners.get('hashchange')();
menu = nav.render();
assert.equal(groupButton(menu, 'technology').props['aria-expanded'], false);
groupButton(menu, 'industry').props.onClick();
menu = nav.render();
const root = menu;
root.props.onBlur({ currentTarget: nav.dom.get(root), relatedTarget: new nav.Element() });
menu = nav.render();
assert.equal(groupButton(menu, 'industry').props['aria-expanded'], false);
const searchLink = nav.find(menu, node => node.props?.href === '/#home-search');
searchLink.props.onClick();
assert.equal(nav.document.activeElement, nav.searchInput);
assert.equal(nav.events.length, 1);
assert.equal(nav.events[0][1].destination_id, 'search');
menu = nav.render();
nav.media.matches = false;
nav.resize();
menu = nav.render();
let mobileToggle = nav.find(menu, node => node.type === 'button' && node.props['aria-controls'] === 'test-navigation');
mobileToggle.props.onClick();
menu = nav.render();
nav.documentListeners.get('keydown')({ key: 'Escape', preventDefault() {} });
assert.equal(nav.document.activeElement.props['aria-controls'], 'test-navigation');
menu = nav.render();
mobileToggle = nav.find(menu, node => node.type === 'button' && node.props['aria-controls'] === 'test-navigation');
assert.equal(mobileToggle.props['aria-expanded'], false);
mobileToggle.props.ref.current.focus();
nav.media.matches = true;
nav.resize();
assert.equal(nav.document.activeElement.props['aria-controls'], 'test-navigation-technology');
const postcss = require('postcss');
const local = require('next/dist/compiled/postcss-modules-local-by-default');
for (const file of ['src/components/HomeDiscovery.module.css', 'src/components/Header.module.css']) {
  postcss([local({ mode: 'pure' })]).process(fs.readFileSync(file, 'utf8'), { from: file }).sync();
}
console.log(`Site search passed: ${entries.length} unique public entries; normalization, priority, filters, pagination, publication gates, IME, events, and homepage SSR.`);
