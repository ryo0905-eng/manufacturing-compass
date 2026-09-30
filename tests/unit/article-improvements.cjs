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
    if (id.endsWith('.json')) {
      const jsonPath = id.startsWith('@/')
        ? path.join(root, 'src', id.slice(2))
        : path.resolve(path.dirname(filename), id);
      return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }
    if (id === 'next/link') return { __esModule: true, default: props => React.createElement('a', props) };
    if (id === 'next/navigation') return { notFound() { throw new Error('NOT_FOUND'); } };
    if (id === '@/components/TrackedInternalLink') return { TrackedInternalLink: ({ eventName, eventProperties, ...props }) => React.createElement('a', props) };
    if (id === '@/components/RankingCompanyCompare') return { RankingCompanyCompareProvider: ({ children }) => React.createElement(React.Fragment, null, children), RankingCompanyComparePanel: () => null };
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
  const salary = load('src/content/guides/semiconductor-salary-ranking').semiconductorSalaryRankingGuide;
  const salaryData = load('src/data/semiconductor-salary');
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
        if (item.href.startsWith('/tools/')) {
          const toolPath = item.href.split(/[?#]/, 1)[0];
          assert.ok(fs.existsSync(path.join(root, 'src/app/(ja)', toolPath, 'page.tsx')), item.href);
        }
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
  assert.equal(ranking.sources.find(source => source.publisher === 'CompaniesMarketCap').accessedAt, '2026-10-01');
  assert.ok(ranking.description.includes('2026年10月1日'));
  assert.equal(ranking.overviewBlocks[0].items.length, 5);
  assert.equal(salary.title, '半導体企業の平均年収ランキング｜日本の主要20社・2026年10月確認');
  assert.equal(salary.updatedAt, '2026-10-01');
  assert.equal(salaryData.semiconductorSalaryMeta.retrievedAt, '2026-10-01');
  assert.equal(salaryData.semiconductorSalaryRanking.length, 20);
  assert.deepEqual(JSON.parse(JSON.stringify(salaryData.semiconductorSalaryRanking.slice(0, 3).map(company => company.name))), ['レーザーテック', 'ディスコ', '東京エレクトロン']);
  assert.deepEqual(JSON.parse(JSON.stringify(salaryData.semiconductorSalaryRanking.map(company => company.rank))), Array.from({ length: 20 }, (_, index) => index + 1));
  assert.ok(salaryData.semiconductorSalaryRanking.every((company, index, companies) => index === 0 || companies[index - 1].annualSalaryManYen >= company.annualSalaryManYen));
  assert.equal(new Set(salaryData.semiconductorSalaryRanking.map(company => company.name)).size, 20);
  assert.equal(new Set(salaryData.semiconductorSalaryRanking.map(company => company.ticker)).size, 20);
  assert.deepEqual(JSON.parse(JSON.stringify(salaryData.semiconductorSalaryRanking[0])), {
    rank: 1, name: 'レーザーテック', ticker: '6920', annualSalaryManYen: 1881, employees: 534,
    averageAge: 40.1, fiscalPeriod: '2026年6月期', category: '検査・計測装置', companyType: '事業会社',
    companySlug: 'lasertec', sourceUrl: 'https://www.lasertec.co.jp/ir/data/securities.html',
  });
  const salaryCards = salary.sections.find(section => section.id === 'top-companies').blocks[0].items;
  assert.deepEqual(JSON.parse(JSON.stringify(salaryCards.slice(0, 3).map(card => card.title))), ['レーザーテック', 'ディスコ', '東京エレクトロン']);
  const en = load('src/content/guides/en').englishGuides[0];
  assert.equal(en.translation.pendingSourceUpdatedAt, efem.updatedAt);
  assert.equal(en.translation.sourceUpdatedAt, '2026-09-01');
  assert.equal(en.status, 'published');

  const props = { params: Promise.resolve({ slug: cpk.slug }) };
  assert.equal(cpk.status, 'published');
  assert.equal(cpk.publishedAt, '2026-09-21');
  assert.ok(load('src/content/guides/index').getGuideBySlug(cpk.slug));
  const publishedPage = load('src/app/(ja)/guides/[slug]/page');
  const meta = await publishedPage.generateMetadata(props);
  assert.equal(meta.alternates.canonical, '/guides/cpk-low-causes');
  assert.ok(publishedPage.generateStaticParams().some(item => item.slug === cpk.slug));
  assert.ok(load('src/app/sitemap').default().some(item => item.url.endsWith('/guides/cpk-low-causes')));
  const html = renderToStaticMarkup(await publishedPage.default(props));
  assert.ok(html.includes('"@type":"Article"') && html.includes('"@type":"FAQPage"'));
  assert.ok(html.includes('href="/tools/cpk"'));
  assert.ok(html.includes('模式図'));
  const salaryHtml = renderToStaticMarkup(await publishedPage.default({ params: Promise.resolve({ slug: salary.slug }) }));
  assert.ok(salaryHtml.includes('レーザーテック') && salaryHtml.includes('1,881万円') && salaryHtml.includes('2026年10月確認'));
  assert.ok(salaryHtml.includes('"dateModified":"2026-10-01"'));
  const rankingSitemapEntry = load('src/app/sitemap').default().find(item => item.url.endsWith(`/guides/${ranking.slug}`));
  assert.equal(rankingSitemapEntry.lastModified.toISOString(), '2026-09-30T15:00:00.000Z');
  const salarySitemapEntry = load('src/app/sitemap').default().find(item => item.url.endsWith(`/guides/${salary.slug}`));
  assert.equal(salarySitemapEntry.lastModified.toISOString(), '2026-09-30T15:00:00.000Z');
  let tool = load('src/app/(ja)/tools/cpk/page').default;
  assert.ok(renderToStaticMarkup(React.createElement(tool)).includes('href="/guides/cpk-low-causes"'));

  // Verify draft isolation with an in-memory fixture; the real article remains published.
  cache.clear();
  const draft = load('src/content/guides/cpk-low-causes').cpkLowCausesGuide;
  draft.status = 'draft'; draft.publishedAt = '';
  const page = load('src/app/(ja)/guides/[slug]/page');
  assert.equal(load('src/content/guides/index').getGuideBySlug(draft.slug), undefined);
  assert.ok(!page.generateStaticParams().some(item => item.slug === draft.slug));
  assert.ok(!load('src/app/sitemap').default().some(item => item.url.endsWith(`/guides/${draft.slug}`)));
  await assert.rejects(page.default(props), /NOT_FOUND/);
  tool = load('src/app/(ja)/tools/cpk/page').default;
  assert.ok(!renderToStaticMarkup(React.createElement(tool)).includes('href="/guides/cpk-low-causes"'));
  console.log('PASS: EFEM boundaries/sourced comparison, ranking navigation, Cpk examples, draft isolation and publication links/SEO');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
