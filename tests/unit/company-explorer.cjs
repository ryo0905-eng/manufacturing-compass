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
    const file = [stem, stem + '.ts', stem + '.tsx', stem + '.json', path.join(stem, 'index.ts')].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    if (!file) throw Error(stem);
    if (cache.has(file)) return cache.get(file);
    if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
    const exports = {}; cache.set(file, exports);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    vm.runInNewContext(code, { exports, process, URL, URLSearchParams, ...globals, require(id) {
      if (id in overrides) return overrides[id];
      if (id === '@/lib/analytics') return { trackEvent() {} };
      if (id === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
      if (id === 'next/image') return { __esModule: true, default: props => React.createElement('img', props) };
      if (id.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
      if (id.startsWith('@/')) return load('src/' + id.slice(2));
      if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id));
      return require(id);
    } }, { filename: file });
    return exports;
  }
  return load;
}
const load = loader();
const { companies, segments } = load('src/data/companies');
const { industryMapZones, industryMapSupplementalCompanies } = load('src/data/industry-map');
const model = load('src/lib/company-explorer');
const directory = model.buildDirectoryCompanies(companies, ['tsmc', 'sumco'], ['tsmc']);
const atlas = model.buildAtlasCompanies(directory);
const clear = { query: '', region: 'all', locationsOnly: false, segment: 'all' };
const plain = x => JSON.parse(JSON.stringify(x));
assert.equal(directory.length, 37);
assert.equal(atlas.length, 31);
assert.equal(new Set(directory.map(c => c.id)).size, 37);
assert.equal(new Set(atlas.map(c => c.id)).size, 31);
assert.equal(atlas.filter(c => c.profileKind === 'map').length, 7);
assert.equal(directory.filter(c => atlas.some(a => a.id === c.id)).length, 24);
for (const company of directory) {
  assert.equal(company.slug, companies.find(c => c.id === company.id).slug);
  assert.ok(industryMapZones.some(z => z.id === company.primaryZone));
  assert.deepEqual(plain(company.industrySegments), plain(companies.find(c => c.id === company.id).industrySegments));
}
for (const company of atlas.filter(c => c.profileKind === 'map')) {
  assert.equal(company.slug, undefined);
  assert.equal(company.hasPublicLocations, false);
  assert.equal(company.sources[0].url, industryMapSupplementalCompanies.find(c => c.id === company.id).source.url);
  assert.match(company.lastUpdated, /^\d{4}-\d{2}-\d{2}$/);
}
assert.throws(() => model.buildDirectoryCompanies([{ ...companies[0], id: 'unclassified' }], [], []), /Missing company explorer role/);
assert.equal(directory.find(c => c.id === 'hitachi-hightech').primaryZone, 'inspection');
assert.equal(directory.find(c => c.id === 'canon').primaryZone, 'equipment');
assert.equal(model.filterExplorerCompanies(directory, { ...clear, query: 'ＮＶＩＤＩＡ　ＧＰＵ' })[0].id, 'nvidia');
assert.equal(model.filterExplorerCompanies(directory, { ...clear, query: 'GPU nonexistentword' }).length, 0);
assert.equal(model.filterExplorerCompanies(directory, { ...clear, region: 'japan', locationsOnly: true }).map(c => c.id).join(','), 'sumco');
assert.equal(model.filterExplorerCompanies(directory, { ...clear, region: 'overseas', locationsOnly: true }).map(c => c.id).join(','), 'tsmc');
assert.ok(model.filterExplorerCompanies(directory, { ...clear, segment: 'memory' }).every(c => c.industrySegments.includes('memory')));
assert.equal(model.filterExplorerCompanies(atlas, { ...clear, query: 'Broadcom' }).length, 0);
assert.equal(model.filterExplorerCompanies(directory, { ...clear, query: 'Broadcom' })[0].slug, 'broadcom');
assert.equal(model.filterExplorerCompanies(directory, clear).map(c => c.id).join(','), directory.map(c => c.id).join(','));
console.log('PASS: 37 directory / 31 atlas, unique primary roles, seven sourced profiles, NFKC/token/combined filters and catalog fallback.');

function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(n => nodes(n, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
function hooks() {
  let cursor = 0;
  const slots = [], effects = [];
  return { reset() { cursor = 0; }, effects, react: { ...React,
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial; return [slots[i], v => { slots[i] = typeof v === 'function' ? v(slots[i]) : v; }]; },
    useRef(initial) { const i = cursor++; return slots[i] ??= { current: initial }; },
    useMemo(fn) { return fn(); },
    useId() { return ':company-test:'; },
    useEffect(fn, deps) { const i = cursor++; const old = slots[i]; if (!old || deps.some((v, j) => v !== old[j])) { slots[i] = deps; effects.push(fn); } },
  } };
}
function explorer(props, hash = '', analyticsBlocked = false) {
  const h = hooks(), events = [], listeners = {};
  const local = loader({ react: h.react, '@/lib/analytics': { trackEvent(name, properties) { if (analyticsBlocked) throw Error('unavailable'); events.push({ name, properties }); } } }, {
    window: { location: { hash }, addEventListener: (name, fn) => { listeners[name] = fn; }, removeEventListener: name => { delete listeners[name]; } },
    requestAnimationFrame: fn => { fn(); return 1; }, cancelAnimationFrame() {},
  });
  const Component = local('src/components/CompanyExplorer').CompanyExplorer;
  return { events, listeners, h, render() { h.reset(); return Component(props); } };
}
const directoryProps = { mode: 'directory', sourcePage: '/companies', items: directory, segments };
const ui = explorer(directoryProps);
const cards = tree => nodes(tree, n => Boolean(n.props?.['data-company-explorer-company']));
assert.equal(cards(ui.render()).length, 37);
assert.equal(ui.events.length, 0);
let search = nodes(ui.render(), n => n.type === 'input' && n.props.type === 'search')[0];
search.props.onChange({ target: { value: 'ＮＶＩＤＩＡ GPU' } });
assert.equal(cards(ui.render()).length, 1);
search = nodes(ui.render(), n => n.type === 'input' && n.props.type === 'search')[0];
search.props.onBlur(); search.props.onKeyDown({ key: 'Enter' });
assert.equal(ui.events.length, 1);
assert.equal(ui.events[0].name, 'companies_filter_use');
assert.equal(ui.events[0].properties.result_count, 1);
assert.ok(!JSON.stringify(ui.events).includes('GPU'));
let focused = 0;
const trigger = { isConnected: true, getClientRects: () => [{}], focus() { focused++; } };
cards(ui.render())[0].props.children[0].props.onClick({ currentTarget: trigger });
let dialog = nodes(ui.render(), n => typeof n.type === 'function' && n.type.name === 'CompanyExplorerDialog')[0];
assert.equal(dialog.props.company.id, 'nvidia');
assert.equal(ui.events.at(-1).name, 'companies_summary_open');
dialog.props.onNavigate('company');
assert.equal(ui.events.at(-1).name, 'companies_company_open');
dialog.props.onClose();
assert.equal(focused, 1);
assert.equal(nodes(ui.render(), n => typeof n.type === 'function' && n.type.name === 'CompanyExplorerDialog').length, 0);
const clearButton = nodes(ui.render(), n => n.type === 'button' && n.props.children === '条件をクリア')[0];
clearButton.props.onClick();
assert.equal(cards(ui.render()).length, 37);
for (const event of ui.events) { assert.equal(event.properties.source_page, '/companies'); assert.equal(event.properties.ui_version, 'company-explorer-v1'); }
const mapUi = explorer({ mode: 'atlas', sourcePage: '/industry-map', items: atlas, fallbackItems: directory });
let mapTree = mapUi.render();
assert.equal(cards(mapTree).length, 31);
assert.equal(mapUi.events.length, 0);
cards(mapTree)[0].props.children[0].props.onClick({ currentTarget: trigger });
assert.equal(mapUi.events.map(e => e.name).join(','), 'industry_map_node_open,industry_map_detail_view');
assert.ok(mapUi.events.every(e => e.properties.source_page === '/industry-map'));
const fallbackUi = explorer({ mode: 'atlas', sourcePage: '/industry-map', items: atlas, fallbackItems: directory, initialQuery: 'Broadcom' });
assert.equal(cards(fallbackUi.render()).length, 0);
assert.ok(nodes(fallbackUi.render(), n => n.props?.href === '/companies/broadcom').length > 0);
const hashUi = explorer({ mode: 'atlas', sourcePage: '/industry-map', items: atlas }, '#company=nvidia');
hashUi.render(); const cleanup = hashUi.h.effects.map(fn => fn());
assert.equal(nodes(hashUi.render(), n => typeof n.type === 'function' && n.type.name === 'CompanyExplorerDialog')[0].props.company.id, 'nvidia');
hashUi.listeners.hashchange();
assert.equal(hashUi.events.length, 1, 'Shared restoration is not counted twice');
cleanup.forEach(fn => fn?.());
const invalid = explorer({ mode: 'atlas', sourcePage: '/industry-map', items: atlas }, '#company=unknown');
invalid.render(); invalid.h.effects.forEach(fn => fn());
assert.equal(nodes(invalid.render(), n => typeof n.type === 'function' && n.type.name === 'CompanyExplorerDialog').length, 0);
assert.match(JSON.stringify(invalid.render()), /指定された企業/);
const blocked = explorer(directoryProps, '', true);
cards(blocked.render())[0].props.children[0].props.onClick({ currentTarget: trigger });
assert.equal(nodes(blocked.render(), n => typeof n.type === 'function' && n.type.name === 'CompanyExplorerDialog').length, 1);
console.log('PASS: search/clear, explicit summaries, native links, route-specific privacy-safe events, shared/invalid hash and analytics failure isolation.');

const modalHooks = hooks();
const Modal = loader({ react: modalHooks.react })('src/components/CompanyExplorer').CompanyExplorerDialog;
let closed = 0, shown = 0, nativeClosed = 0;
modalHooks.reset(); const modal = Modal({ company: directory[0], onClose() { closed++; }, onNavigate() {} });
const native = { open: false, showModal() { this.open = true; shown++; }, close() { this.open = false; nativeClosed++; }, getBoundingClientRect() { return { left: 10, right: 100, top: 10, bottom: 100 }; } };
modal.props.ref.current = native;
const unmount = modalHooks.effects[0]();
assert.equal(shown, 1);
let prevented = false; modal.props.onCancel({ preventDefault() { prevented = true; } }); assert.equal(prevented, true); assert.equal(closed, 1);
modal.props.onClick({ target: native, currentTarget: native, clientX: 50, clientY: 50 }); assert.equal(closed, 1);
modal.props.onClick({ target: {}, currentTarget: native, clientX: 0, clientY: 0 }); assert.equal(closed, 1);
modal.props.onClick({ target: native, currentTarget: native, clientX: 0, clientY: 0 }); assert.equal(closed, 2);
unmount(); assert.equal(nativeClosed, 1);
const logoHooks = hooks();
const Logo = loader({ react: logoHooks.react })('src/components/CompanyCardLogo').CompanyCardLogo;
function logoRender(companyId = 'nvidia') { logoHooks.reset(); return Logo({ companyId, name: 'NVIDIA', size: 'compact' }); }
let logo = logoRender(); assert.equal(logo.props['aria-hidden'], 'true');
const image = nodes(logo, n => n.props?.src?.includes('nvidia.png'))[0]; assert.ok(image); image.props.onError();
assert.match(JSON.stringify(logoRender()), /NV/);
assert.ok(!nodes(logoRender('hitachi-hightech'), n => n.props?.src).length);
console.log('PASS: native modal lifecycle, Escape/cancel, inside/backdrop clicks, close cleanup and image failure/missing fallback.');

(async () => {
  const directoryPage = load('src/app/(ja)/companies/page');
  const industryPage = load('src/app/(ja)/industry-map/page');
  const html = renderToStaticMarkup(await directoryPage.default({ searchParams: Promise.resolve({}) }));
  assert.equal((html.match(/data-company-explorer-company=/g) || []).length, 37);
  for (const company of companies) assert.ok(html.includes(`href="/companies/${company.slug}"`), company.id);
  for (const anchor of ['company-search', 'company-search-title', 'japanese-companies', 'companies-taxonomy-title']) assert.ok(html.includes(`id="${anchor}"`), anchor);
  assert.ok(html.indexOf('id="company-search"') < html.indexOf('id="japanese-companies"'));
  assert.ok(html.includes('"@type":"ItemList"'));
  const meta = await directoryPage.generateMetadata({ searchParams: Promise.resolve({}) });
  assert.equal(meta.alternates.canonical, '/companies'); assert.equal(meta.robots, undefined);
  assert.equal((await directoryPage.generateMetadata({ searchParams: Promise.resolve({ query: '' }) })).robots.index, false);
  const queried = renderToStaticMarkup(await directoryPage.default({ searchParams: Promise.resolve({ query: ['ＮＶＩＤＩＡ GPU', 'ignored'] }) }));
  assert.equal((queried.match(/data-company-explorer-company=/g) || []).length, 1);
  const mapHtml = renderToStaticMarkup(industryPage.default());
  assert.equal((mapHtml.match(/data-atlas-company=/g) || []).length, 31);
  assert.equal(industryPage.metadata.alternates.canonical, '/industry-map');
  for (const zone of industryMapZones) assert.ok(mapHtml.includes(`id="industry-zone-${zone.id}"`));
  for (const profile of industryMapSupplementalCompanies) { assert.ok(mapHtml.includes(`href="${profile.websiteUrl}"`)); assert.ok(!mapHtml.includes(`href="/companies/${profile.id}"`)); }
  for (const anchor of ['design', 'materials', 'front-end', 'equipment', 'back-end', 'inspection', 'applications']) assert.ok(mapHtml.includes(`id="supply-chain-${anchor}"`));
  const { companyLogoAssets } = load('src/data/company-logos');
  assert.equal(atlas.filter(c => companyLogoAssets[c.id]).length, 31);
  assert.equal(directory.filter(c => companyLogoAssets[c.id]).length, 36);
  for (const company of [...directory, ...atlas]) {
    const asset = companyLogoAssets[company.id]; if (!asset) continue;
    assert.ok(asset.aspectRatio > 0 && asset.aspectRatio < 20);
    assert.ok(fs.existsSync('public' + asset.src));
    assert.equal(fs.readFileSync('public' + asset.src).subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  }
  const postcss = require('postcss'), pure = require('next/dist/compiled/postcss-modules-local-by-default');
  for (const file of ['src/components/CompanyExplorer.module.css', 'src/components/CompanyCardLogo.module.css']) await postcss([pure({ mode: 'pure' })]).process(fs.readFileSync(file, 'utf8'), { from: file });
  console.log('PASS: both pages SSR/anchors/native links, early directory explorer, query/noindex/canonical, all 31 atlas logos, 36 directory logos and valid CSS modules.');
})().catch(error => { console.error(error); process.exitCode = 1; });
