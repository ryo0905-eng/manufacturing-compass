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
    if (filename.endsWith('.json')) return JSON.parse(fs.readFileSync(filename, 'utf8'));
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
const { foundryMarket } = load('src/data/foundry-market-share.ts');
assert.deepEqual(Array.from(foundryMarket.rows, row => [row.revenueUsdM, row.sharePct]), [[40198,72.5],[3260,5.9],[3006,5.4],[2175,3.9],[1786,3.2],[1274,2.3],[460,0.8],[451,0.8],[447,0.8],[432,0.8]]);
const guide = load('src/content/guides/index.ts').getGuideBySlug('foundry-manufacturer-ranking');
assert.equal(guide.status, 'published');
assert.ok(load('src/content/guides/index.ts').getGuideBySlug('semiconductor-foundry').relatedGuideSlugs.includes(guide.slug));
assert.equal(load('src/app/sitemap.ts').default().filter(row => row.url.endsWith('/guides/' + guide.slug)).length, 1);
const html = renderToStaticMarkup(React.createElement(load('src/components/FoundryRanking.tsx').FoundryRanking));
for (const slug of ['tsmc', 'samsung-electronics', 'globalfoundries']) assert.ok(html.includes('/companies/' + slug));
assert.equal((html.match(/<tbody>/g) || []).length, 1);
assert.ok(html.includes('53,488'));
console.log('Foundry ranking: source values, published guide, links, sitemap and SSR passed.');
