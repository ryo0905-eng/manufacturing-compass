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
  const efem = load('src/content/guides/semiconductor-wafer-handling-efem-manufacturers').semiconductorWaferHandlingEfemManufacturersGuide;
  const ranking = load('src/content/guides/semiconductor-market-cap-ranking').semiconductorMarketCapRankingGuide;
  const { cpkLowCausesGuide: cpk, cpkLowExamples } = load('src/content/guides/cpk-low-causes');
  const { calculateCapability } = load('src/lib/process-capability');
  for (const example of cpkLowExamples) {
    const result = calculateCapability({ mean: example.mean, standardDeviation: example.standardDeviation, lowerSpecificationLimit: 94, upperSpecificationLimit: 106, method: 'short-term' });
    assert.equal(result.potential, example.cp);
    assert.equal(result.performance, example.cpk);
  }
  assert.equal(cpkLowExamples[1].cpk, cpkLowExamples[2].cpk);
  assert.notEqual(cpkLowExamples[1].cp, cpkLowExamples[2].cp);
  const { GuideBlocks } = load('src/components/guide/GuideBlocks');
  for (const guide of [efem, ranking, cpk]) {
    const ids = guide.sections.map(section => section.id);
    assert.equal(ids.length, new Set(ids).size);
    for (const block of [...(guide.overviewBlocks || []), ...guide.sections.flatMap(section => section.blocks || [])]) {
      if (block.type === 'comparison-table') {
        for (const row of block.rows) assert.equal(row.values.length + 1, block.columns.length);
        const html = renderToStaticMarkup(React.createElement(GuideBlocks, { blocks: [block], sourceSlug: guide.slug }));
        assert.ok(html.includes('<caption>') && html.includes('scope="col"') && html.includes('scope="row"'));
        for (const row of block.rows) {
          assert.ok(html.includes(row.label));
          if (row.source) assert.ok(html.includes(row.source.url));
        }
      }
      if (block.type === 'links') for (const item of block.items) {
        if (item.href.startsWith('#')) assert.ok(ids.includes(item.href.slice(1)), item.href);
        if (item.href.startsWith('/guides/')) assert.ok(load('src/content/guides/index').getGuideBySlug(item.href.slice('/guides/'.length)), item.href);
        if (item.href.startsWith('/tools/')) assert.ok(fs.existsSync(path.join(root, 'src/app/(ja)', item.href, 'page.tsx')), item.href);
      }
    }
  }
  const matrix = efem.sections.find(section => section.id === 'manufacturers').blocks.find(block => block.type === 'comparison-table');
  assert.equal(matrix.rows.length, 4);
  assert.ok(matrix.rows.every(row => efem.sources.some(source => source.url === row.source.url)));
  assert.match(matrix.rows[3].values[1], /未確認/);
  assert.match(matrix.rows[3].values[2], /未確認/);
  const boundary = efem.sections.find(section => section.id === 'boundary').blocks[0];
  assert.equal(boundary.stages.length, 4);
  assert.ok(boundary.description.includes('大気処理装置'));
  const ids = ranking.sections.map(section => section.id);
  assert.deepEqual(JSON.parse(JSON.stringify(ids.slice(0, 2))), ['world-ranking', 'japan-ranking']);
  assert.ok(ids.indexOf('japan-ranking') < ids.indexOf('top-ten'));
  assert.equal(ranking.sources[0].accessedAt, '2026-09-06');
  assert.ok(ranking.description.includes('2026年9月6日'));
  assert.equal(ranking.overviewBlocks[0].items.length, 4);
  const en = load('src/content/guides/en').englishGuides[0];
  assert.equal(en.translation.pendingSourceUpdatedAt, efem.updatedAt);
  assert.equal(en.translation.sourceUpdatedAt, '2026-09-01');
  assert.equal(en.status, 'published');

  const page = load('src/app/(ja)/guides/[slug]/page');
  const props = { params: Promise.resolve({ slug: cpk.slug }) };
  assert.equal(cpk.status, 'draft');
  assert.equal(cpk.publishedAt, '');
  assert.equal(load('src/content/guides/index').getGuideBySlug(cpk.slug), undefined);
  assert.ok(!page.generateStaticParams().some(item => item.slug === cpk.slug));
  assert.ok(!load('src/app/sitemap').default().some(item => item.url.endsWith(`/guides/${cpk.slug}`)));
  await assert.rejects(page.default(props), /NOT_FOUND/);
  let tool = load('src/app/(ja)/tools/cpk/page').default;
  assert.ok(!renderToStaticMarkup(React.createElement(tool)).includes('href="/guides/cpk-low-causes"'));

  // Simulate editorial approval in memory to verify publication wiring, without publishing the draft.
  cache.clear();
  const reviewed = load('src/content/guides/cpk-low-causes').cpkLowCausesGuide;
  reviewed.status = 'published'; reviewed.publishedAt = '2026-09-21';
  const publishedPage = load('src/app/(ja)/guides/[slug]/page');
  const meta = await publishedPage.generateMetadata(props);
  assert.equal(meta.alternates.canonical, '/guides/cpk-low-causes');
  assert.ok(publishedPage.generateStaticParams().some(item => item.slug === reviewed.slug));
  assert.ok(load('src/app/sitemap').default().some(item => item.url.endsWith('/guides/cpk-low-causes')));
  const html = renderToStaticMarkup(await publishedPage.default(props));
  assert.ok(html.includes('"@type":"Article"') && html.includes('"@type":"FAQPage"'));
  assert.ok(html.includes('href="/tools/cpk"'));
  assert.ok(html.includes('模式図'));
  tool = load('src/app/(ja)/tools/cpk/page').default;
  assert.ok(renderToStaticMarkup(React.createElement(tool)).includes('href="/guides/cpk-low-causes"'));
  console.log('PASS: EFEM boundaries/sourced comparison, ranking navigation, Cpk examples, draft isolation and publication links/SEO');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
