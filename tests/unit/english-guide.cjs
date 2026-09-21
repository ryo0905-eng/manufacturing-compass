const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const root = path.resolve(__dirname, '../..');
const cache = new Map();
function load(relative) {
  const stem = path.resolve(root, relative);
  const filename = [stem, stem + '.ts', stem + '.tsx', path.join(stem, 'index.ts')]
    .find(file => fs.existsSync(file) && fs.statSync(file).isFile());
  assert.ok(filename, `Missing module: ${relative}`);
  if (cache.has(filename)) return cache.get(filename);
  const result = {};
  cache.set(filename, result);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  function localRequire(id) {
    if (id.endsWith('.css')) return {};
    if (id === 'next/link') return { __esModule: true, default: props => React.createElement('a', props) };
    if (id === 'next/navigation') return { notFound() { throw new Error('NOT_FOUND'); } };
    if (id === '@/components/TrackedInternalLink') return { TrackedInternalLink: ({ eventName, eventProperties, ...props }) => React.createElement('a', props) };
    if (id === '@/components/SiteAnalytics') return { SiteAnalytics: () => React.createElement('span', { 'data-site-analytics': true }) };
    // Unrelated Japanese CTAs and interactive blocks are not part of this fixture.
    if (id.startsWith('@/components/') && ![
      '@/components/StructuredData', '@/components/guide/GuideBlocks', '@/components/guide/GuideLanguageLink',
    ].includes(id)) return new Proxy({}, { get: () => () => null });
    if (id.startsWith('@/')) return load(path.join(root, 'src', id.slice(2)));
    if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id));
    return require(id);
  }
  vm.runInNewContext(code, { exports: result, require: localRequire, process, URL }, { filename });
  return result;
}

async function main() {
  const registry = load('src/content/guides/en');
  assert.equal(registry.englishGuides.length, 1);
  const guide = registry.englishGuides[0];
  const source = load('src/content/guides/index').getGuideBySlug(guide.translation.sourceSlug);
  assert.equal(guide.translation.sourceUpdatedAt, source.updatedAt, 'Review English edition when Japanese source changes');
  const en = load('src/app/(en)/en/guides/[slug]/page');
  const ja = load('src/app/(ja)/guides/[slug]/page');
  const sitemap = load('src/app/sitemap').default;
  const props = { params: Promise.resolve({ slug: guide.slug }) };
  const englishPath = `/en/guides/${guide.slug}`;
  const original = { status: guide.status, publishedAt: guide.publishedAt, reviewedAt: guide.translation.reviewedAt };
  try {
    // Exercise both states independently of the checked-in publication state.
    guide.status = 'draft';
    guide.translation.reviewedAt = null;
    guide.publishedAt = '';
    assert.equal((await en.generateMetadata(props)).robots.index, false);
    assert.equal((await ja.generateMetadata(props)).alternates.languages, undefined);
    assert.ok(!sitemap().some(row => row.url.endsWith(englishPath)));
    const draftHtml = renderToStaticMarkup(await en.default(props));
    assert.match(draftHtml, /Editorial preview/);
    assert.doesNotMatch(draftHtml, /Reviewed by|application\/ld\+json/);
    assert.doesNotMatch(renderToStaticMarkup(await ja.default(props)), /Read in English/);
    guide.status = 'published';
    assert.equal(registry.isEnglishGuidePublished(guide), false, 'Status alone cannot claim completed review');
    guide.translation.reviewedAt = '2026-09-21';
    guide.publishedAt = '2026-09-21';
    const enMeta = await en.generateMetadata(props);
    const jaMeta = await ja.generateMetadata(props);
    assert.equal(enMeta.robots.index, true);
    assert.equal(enMeta.alternates.canonical, englishPath);
    assert.equal(jaMeta.alternates.canonical, `/guides/${guide.slug}`);
    assert.equal(JSON.stringify(enMeta.alternates.languages), JSON.stringify(jaMeta.alternates.languages));
    assert.equal(sitemap().filter(row => row.url.endsWith(englishPath)).length, 1);
    const html = renderToStaticMarkup(await en.default(props));
    assert.doesNotMatch(html, /Editorial preview|関連ページ|参考情報|この記事|転職|affiliate/);
    assert.match(html, /Reviewed by RYO/);
    assert.match(renderToStaticMarkup(await ja.default(props)), /Read in English/);
    const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const article = jsonLd.find(item => item['@type'] === 'Article');
    assert.equal(article.inLanguage, 'en');
    assert.equal(article.datePublished, guide.publishedAt);
    assert.equal(article.dateModified, guide.updatedAt);
    assert.equal(jsonLd.find(item => item['@type'] === 'FAQPage').mainEntity.length, 5);
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size);
    for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(anchor));
    for (const section of guide.sections) for (const block of section.blocks ?? []) {
      if (block.type === 'links') for (const item of block.items) {
        assert.match(item.label, /\(Japanese\)/);
        if (item.href.startsWith('/guides/')) assert.ok(load('src/content/guides/index').getGuideBySlug(item.href.slice('/guides/'.length)));
      }
    }
    const layout = load('src/app/(en)/layout');
    const document = renderToStaticMarkup(React.createElement(layout.default, null, await en.default(props)));
    assert.match(document, /<html lang="en">/);
    assert.equal((document.match(/data-site-analytics/g) ?? []).length, 1);
    const japaneseLayout = load('src/app/(ja)/layout');
    assert.equal(japaneseLayout.default({ children: null }).props.lang, 'ja');
    const missing = { params: Promise.resolve({ slug: 'not-an-english-article' }) };
    await assert.rejects(en.default(missing), /NOT_FOUND/);
    const global404 = load('src/app/global-not-found');
    assert.equal(global404.metadata.robots.index, false);
    assert.match(renderToStaticMarkup(React.createElement(global404.default)), /Page not found/);
  } finally {
    guide.status = original.status;
    guide.publishedAt = original.publishedAt;
    guide.translation.reviewedAt = original.reviewedAt;
  }
  console.log('English guide: draft/public discovery, reciprocal metadata, SSR content/FAQ, language layouts, links, source freshness and 404 passed.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
