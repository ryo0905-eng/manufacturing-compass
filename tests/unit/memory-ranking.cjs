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
const { memoryMarkets: markets } = load('src/data/memory-market-share.ts');
assert.deepEqual(plain(markets.dram.rows.map(r => r.sharePct)), [39.4, 24.9, 23.3, 9.5, 1.7, 0.6, 0.07]);
assert.deepEqual(plain(markets.nand.rows.map(r => r.sharePct)), [29.3, 18.2, 15.1, 13.6, 11.4]);
assert.deepEqual(plain(markets.dram.rows.map(r => r.revenueUsdM)), [60981, 38590, 36000, 14624, 2612, 998, 115]);
assert.deepEqual(plain(markets.nand.rows.map(r => r.revenueUsdM)), [23059.3, 14272.9, 11850, 10723, 8965]);
assert.ok(Math.abs(markets.nand.rows.reduce((sum, row) => sum + row.sharePct, 0) - 87.6) < 1e-9);
assert.equal(markets.nand.others, undefined); // Never invent remaining companies or their ranks.
assert.equal(markets.dram.others.sharePct, 0.5);
assert.ok(!markets.dram.rows.some(row => row.companyId === 'kioxia'));

// Exercise the component's real event handlers with a single state slot, without a browser.
let state;
const events = [];
const interactionLoad = createLoader({
  ...React,
  useState: initial => [state ?? initial, next => { state = next; }],
  useId: () => 'test-panel',
}, events);
const { MemoryRankingExplorer } = interactionLoad('src/components/MemoryRankingExplorer.tsx');
function elements(node, predicate) {
  if (Array.isArray(node)) return node.flatMap(child => elements(child, predicate));
  if (!node || typeof node !== 'object') return [];
  return [...(predicate(node) ? [node] : []), ...elements(node.props?.children, predicate)];
}
function texts(node) {
  if (Array.isArray(node)) return node.map(texts).join(' ');
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node !== 'object') return String(node);
  return texts(node.props?.children);
}
function button(tree, name) { return elements(tree, node => node.type === 'button' && node.props.children === name)[0]; }
function assertMarket(tree, id) {
  const market = markets[id];
  const buttons = elements(tree, node => node.type === 'button');
  assert.equal(buttons.filter(node => node.props['aria-pressed']).length, 1);
  assert.equal(button(tree, market.label).props['aria-pressed'], true);
  assert.ok(buttons.every(node => node.props.type === 'button' && node.props['aria-controls'] === 'test-panel'));
  const status = elements(tree, node => node.props?.role === 'status')[0];
  assert.ok(texts(status).includes(market.scope));
  assert.equal(status.props['aria-live'], 'polite');
  assert.ok(texts(tree).includes(market.usage));
  assert.ok(texts(tree).includes(market.note));
  assert.ok(elements(tree, node => node.type === 'a').some(node => node.props.href === market.source.url));
  const widths = elements(tree, node => node.props?.style?.width).map(node => node.props.style.width);
  assert.deepEqual(widths, plain(market.rows.map(row => `${row.sharePct}%`))); // Fixed 100% scale, not normalized to largest row.
  assert.deepEqual(elements(tree, node => node.type === 'li').map(node => node.props['data-company']), plain(market.rows.map(row => row.companyId)));
}
let tree = MemoryRankingExplorer();
assertMarket(tree, 'dram');
assert.equal(events.length, 0);
button(tree, 'DRAM').props.onClick();
assert.equal(events.length, 0);
button(tree, 'NAND').props.onClick();
tree = MemoryRankingExplorer();
assertMarket(tree, 'nand');
button(tree, 'NAND').props.onClick();
assert.equal(events.length, 1);
button(tree, 'DRAM').props.onClick();
assertMarket(MemoryRankingExplorer(), 'dram');
assert.deepEqual(plain(events), [
  { name: 'memory_ranking_market_select', properties: { market: 'nand', source_slug: 'memory-manufacturer-ranking' } },
  { name: 'memory_ranking_market_select', properties: { market: 'dram', source_slug: 'memory-manufacturer-ranking' } },
]);

const { MemoryRanking } = load('src/components/MemoryRanking.tsx');
const html = renderToStaticMarkup(React.createElement(MemoryRanking));
assert.equal((html.match(/<table>/g) || []).length, 2);
assert.equal((html.match(/<tr>/g) || []).length, 15); // 7 DRAM + Others + 5 NAND + two headers.
assert.match(html, /<noscript>/);
assert.match(html, /順位外/);
assert.match(html, /87.6%/);
assert.match(html, /0.07%/);
assert.match(html, /Solidigm/);
for (const market of Object.values(markets)) assert.ok(html.includes(market.source.figureUrl));
const { getGuideBySlug } = load('src/content/guides/index.ts');
const article = getGuideBySlug('memory-manufacturer-ranking');
assert.ok(article && article.status === 'published');
assert.ok(getGuideBySlug('semiconductor-market-cap-ranking').relatedGuideSlugs.includes(article.slug));
const { companies } = load('src/data/companies.ts');
for (const market of Object.values(markets)) for (const row of market.rows) {
  if (row.companySlug) assert.ok(companies.some(company => company.slug === row.companySlug));
}
for (const slug of article.relatedGuideSlugs) assert.ok(getGuideBySlug(slug));
const sitemap = load('src/app/sitemap.ts').default();
assert.equal(sitemap.filter(row => row.url.endsWith('/guides/memory-manufacturer-ranking')).length, 1);
console.log('Memory ranking passed: source values, DRAM/NAND/reset, scope and source switching, fixed scale, event deduplication, SSR tables, company links, article registration and sitemap.');
