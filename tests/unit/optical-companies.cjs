const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '../..');

function createLoader(react = React, events = []) {
  const cache = new Map();
  function load(relative) {
    const stem = path.isAbsolute(relative) ? relative : path.join(root, relative);
    const filename = [stem, stem + '.ts', stem + '.tsx', path.join(stem, 'index.ts')]
      .find(file => fs.existsSync(file) && fs.statSync(file).isFile());
    assert.ok(filename, `Module exists: ${relative}`);
    if (cache.has(filename)) return cache.get(filename);
    const result = {};
    cache.set(filename, result);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    function localRequire(id) {
      if (id === 'react') return react;
      if (id.endsWith('.module.css')) return { __esModule: true, default: new Proxy({}, { get: (_, name) => String(name) }) };
      if (id === '@/lib/analytics') return { trackEvent: (name, properties) => events.push({ name, properties }) };
      if (id === '@/components/TrackedInternalLink') return {
        TrackedInternalLink: ({ eventName, eventProperties, ...props }) => React.createElement('a', props),
      };
      if (id.startsWith('@/')) return load(path.join(root, 'src', id.slice(2)));
      if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id));
      return require(id);
    }
    vm.runInNewContext(code, { exports: result, require: localRequire, process }, { filename });
    return result;
  }
  return load;
}
const load = createLoader();
const plain = value => JSON.parse(JSON.stringify(value));
const { opticalCompanies: companies, opticalCategoryIds: ids, opticalCategories: categories, selectOpticalCompanies: select } = load('src/data/optical-semiconductor.ts');
const expected = { led: ['nichia', 'ams-osram', 'rohm'], laser: ['nichia', 'ams-osram', 'rohm'], 'image-sensor': ['sony-semicon', 'hamamatsu', 'onsemi'], photodiode: ['ams-osram', 'hamamatsu'] };
assert.equal(select('all').length, 6);
for (const id of ids) assert.deepEqual(plain(select(id).map(c => c.id)), expected[id]);
assert.equal(select('laser', [companies.find(c => c.id === 'onsemi')]).length, 0);
for (const company of companies) {
  assert.equal(new Set(company.products.map(p => p.category)).size, company.products.length);
  for (const product of company.products) assert.match(product.url, /^https:\/\//);
}
let state;
const events = [];
const interaction = createLoader({ ...React, useState: initial => [state ?? initial, next => { state = next; }], useId: () => 'optical-test' }, events);
const { OpticalCompaniesExplorer: Explorer } = interaction('src/components/OpticalCompaniesExplorer.tsx');
function elements(node, predicate) {
  if (Array.isArray(node)) return node.flatMap(child => elements(child, predicate));
  if (!node || typeof node !== 'object') return [];
  return [...(predicate(node) ? [node] : []), ...elements(node.props?.children, predicate)];
}
function click(tree, label) { elements(tree, n => n.type === 'button' && n.props.children === label)[0].props.onClick(); }
function assertSelection(selection) {
  const tree = Explorer();
  const buttons = elements(tree, n => n.type === 'button');
  assert.equal(buttons.length, 5);
  assert.equal(buttons.filter(n => n.props['aria-pressed']).length, 1);
  assert.ok(buttons.every(n => n.props.type === 'button' && n.props['aria-controls'] === 'optical-test'));
  assert.deepEqual(elements(tree, n => n.props?.['data-company']).map(n => n.props['data-company']), selection === 'all' ? plain(companies.map(c => c.id)) : expected[selection]);
  assert.equal(elements(tree, n => n.type === 'figure').length, selection === 'all' ? 4 : 1);
  assert.equal(elements(tree, n => n.props?.role === 'status')[0].props['aria-live'], 'polite');
  const sources = elements(tree, n => n.type === 'a').map(n => n.props.href);
  for (const company of select(selection)) for (const product of company.products.filter(p => selection === 'all' || p.category === selection)) assert.ok(sources.includes(product.url));
  return tree;
}
click(assertSelection('all'), 'すべて');
assert.equal(events.length, 0);
for (const id of ids) {
  click(Explorer(), categories[id].label);
  click(assertSelection(id), categories[id].label);
}
assert.equal(events.length, 4);
click(Explorer(), 'すべて');
assertSelection('all');
assert.deepEqual(events.map(e => e.properties.category), [...plain(ids), 'all']);
assert.ok(events.every(e => e.name === 'optical_company_category_select' && Object.keys(e.properties).sort().join() === 'category,source_slug'));
const { OpticalCompanies } = load('src/components/OpticalCompanies.tsx');
const html = renderToStaticMarkup(React.createElement(OpticalCompanies));
assert.equal((html.match(/<table>/g) || []).length, 1);
assert.equal((html.match(/<tr>/g) || []).length, 7);
assert.match(html, /<noscript>/);
assert.match(html, /未掲載/);
for (const company of companies) for (const product of company.products) assert.ok(html.includes(product.url));
const { getGuideBySlug } = load('src/content/guides/index.ts');
const guide = getGuideBySlug('optical-semiconductor-manufacturers');
assert.ok(guide);
for (const slug of guide.relatedGuideSlugs) assert.ok(getGuideBySlug(slug), slug);
for (const slug of ['semiconductor-market-cap-ranking', 'memory-manufacturer-ranking']) assert.ok(getGuideBySlug(slug).relatedGuideSlugs.includes(guide.slug));
const { companies: database } = load('src/data/companies.ts');
for (const company of companies.filter(c => c.companySlug)) assert.ok(database.some(c => c.slug === company.companySlug));
const sitemap = load('src/app/sitemap.ts').default();
assert.ok(sitemap.some(entry => entry.url.endsWith('/guides/' + guide.slug)));
console.log('optical-companies: mapping, selection, events, SSR sources, links and sitemap passed');
