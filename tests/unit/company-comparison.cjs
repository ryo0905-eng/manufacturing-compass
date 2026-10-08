const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// Execute the actual route, metadata and sitemap without a production build.
const cache = new Map();
function load(stem) {
  const file = [stem, stem + '.ts', stem + '.tsx', stem + '.json', path.join(stem, 'index.ts')].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
  if (!file) throw Error(stem);
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { exports, process, URL, URLSearchParams, require(id) {
    if (id === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
    if (id === '@/lib/analytics') return { trackEvent() {} };
    if (id.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, k) => k }) };
    if (id.startsWith('@/')) return load('src/' + id.slice(2));
    if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id));
    return require(id);
  } }, { filename: file });
  return exports;
}
async function main() {
  const format = load('src/lib/format');
  const profiles = load('src/data/company-comparisons');
  const editorial = load('src/data/editorial');
  const catalog = load('src/data/companies');
  const route = load('src/app/(ja)/compare/[slug]/page');
  const sitemap = load('src/app/sitemap').default();
  const props = slug => ({ params: Promise.resolve({ slug }) });
  const hasDigest = pattern => error => pattern.test(error.digest || '');
  const compareUrls = sitemap.filter(entry => entry.url.includes('/compare/')).map(entry => entry.url);
  assert.equal(new Set(compareUrls).size, 17);
  assert.equal(compareUrls.length, 17);
  for (const ids of editorial.canonicalComparePairs) {
    const slug = ids.join('-vs-');
    const reverse = [...ids].reverse().join('-vs-');
    assert.equal(format.companyCompareSlug(ids), slug, 'published representative URL stays stable');
    assert.equal(format.companyCompareSlug([...ids].reverse()), slug);
    assert.equal(profiles.getCompanyComparisonProfile(reverse).slug, slug);
    assert.equal(profiles.isComparisonIndexable(slug), true);
    assert.ok(compareUrls.includes('https://mfg-compass.com/compare/' + slug));
    assert.ok(!compareUrls.includes('https://mfg-compass.com/compare/' + reverse));
    const metadata = await route.generateMetadata(props(reverse));
    assert.equal(metadata.alternates.canonical, '/compare/' + slug);
    assert.notEqual(metadata.robots?.index, false);
    await assert.rejects(route.default(props(reverse)), hasDigest(/NEXT_REDIRECT;.*;308;/));
    try { await route.default(props(reverse)); } catch (error) { assert.ok(error.digest.includes('/compare/' + slug + ';')); }
    const html = renderToStaticMarkup(await route.default(props(slug)));
    for (const text of ['比較に使った情報ソース', '求人票・面接', '/compare/' + slug, '確認日']) assert.ok(html.includes(text), slug + ': ' + text);
  }
  for (const slug of ['nvidia-vs-nvidia', 'unknown-vs-amd', 'nvidia-vs-unknown', 'nvidia-vs-amd-vs-tsmc', 'nvidia-vs-unknown-vs-amd', 'nvidia', '-vs-amd', 'nvidia-vs-amd-vs-amd']) {
    assert.equal(format.normalizeCompanyComparison(slug), null);
    assert.equal(format.getCompaniesFromCompareSlug(slug).length, 0);
    assert.equal(profiles.getCompanyComparisonProfile(slug), undefined);
    await assert.rejects(route.default(props(slug)), hasDigest(/NEXT_HTTP_ERROR_FALLBACK;404/));
    await assert.rejects(route.generateMetadata(props(slug)), hasDigest(/NEXT_HTTP_ERROR_FALLBACK;404/));
  }
  // Unedited comparisons remain accessible, but do not become search landing pages.
  const freeSlug = format.companyCompareSlug(['nvidia', 'tsmc']);
  const freeMetadata = await route.generateMetadata(props(freeSlug));
  assert.equal(freeMetadata.robots.index, false);
  assert.equal(freeMetadata.robots.follow, true);
  assert.equal(freeMetadata.alternates.canonical, '/compare/' + freeSlug);
  assert.ok(!compareUrls.includes('https://mfg-compass.com/compare/' + freeSlug));
  assert.ok(renderToStaticMarkup(await route.default(props(freeSlug))).includes('比較に使った情報ソース'));
  const unpreparedHtml = renderToStaticMarkup(await route.default(props('nvidia-vs-amd')));
  assert.ok(unpreparedHtml.includes('両社の企業別キャリア準備情報は未整備'));
  assert.ok(!unpreparedHtml.includes('掲載データなし'));
  assert.ok(!unpreparedHtml.includes('<th>半年後の準備</th>'));
  assert.equal(catalog.companies.filter(catalog.isCompanyIndexable).length, 10);
  const pairs = new Set();
  for (let i = 0; i < catalog.companies.length; i++) for (let j = i + 1; j < catalog.companies.length; j++) {
    const ids = [catalog.companies[i].id, catalog.companies[j].id];
    const slug = format.companyCompareSlug(ids);
    assert.equal(format.companyCompareSlug([...ids].reverse()), slug);
    assert.ok(!pairs.has(slug)); pairs.add(slug);
  }
  const directory = load('src/app/(ja)/companies/page');
  for (const query of ['no-such-company', '品質保証', '', ['NVIDIA', 'AMD']]) {
    const metadata = await directory.generateMetadata({ searchParams: Promise.resolve({ query }) });
    assert.equal(metadata.robots.index, false);
    assert.equal(metadata.alternates.canonical, '/companies');
  }
  assert.notEqual((await directory.generateMetadata({ searchParams: Promise.resolve({}) })).robots?.index, false);
  const rankingPoints = load('src/data/career-research-lists').careerResearchLists;
  const research = load('src/data/company-research').companyResearch;
  for (const ranking of editorial.rankings) for (const id of ranking.companyIds) {
    assert.ok(rankingPoints[ranking.slug][id], ranking.slug + ': ' + id);
    assert.ok(research[id]?.source.url && research[id]?.source.accessedAt, 'fact evidence: ' + id);
  }
  const rankingPage = load('src/app/(ja)/rankings/[slug]/page');
  for (const ranking of editorial.rankings) {
    const html = renderToStaticMarkup(await rankingPage.default(props(ranking.slug)));
    for (const id of ranking.companyIds) assert.ok(html.includes(rankingPoints[ranking.slug][id].connection));
    assert.ok(html.includes('現在募集中の求人は区別'));
  }
  const segmentPage = load('src/app/(ja)/segments/[slug]/page');
  const materialsHtml = renderToStaticMarkup(await segmentPage.default(props('materials')));
  assert.ok(materialsHtml.includes('材料の役割から調べる'));
  const materials = load('src/data/materials-navigation').materialsNavigation;
  for (const material of materials) { assert.ok(editorial.beginnerGuides.some(guide => guide.slug === material.slug)); assert.ok(materialsHtml.includes(`/guides/${material.slug}`)); }
  const newsPage = load('src/app/(ja)/semiconductor-watch/[slug]/page');
  const media = load('src/lib/chip-pulse-media').media;
  const originalEditorial = JSON.parse(require('node:child_process').execFileSync('git', ['show', 'HEAD:src/data/watch-editorial.json'], { encoding: 'utf8' }));
  const updatedEditorial = load('src/data/watch-editorial.json');
  for (const article of media.articles) {
    const html = renderToStaticMarkup(await newsPage.default(props(article.id)));
    assert.equal(html.split(article.summary).length - 1, 2, 'summary occurs in schema description and standfirst only');
    assert.ok(html.includes('この発表を比較・時系列から読む'));
    assert.equal(updatedEditorial.articles[article.id].checkedAt, originalEditorial.articles[article.id].checkedAt, 'do not invent a source review date');
    const metadata = await newsPage.generateMetadata(props(article.id));
    assert.equal(metadata.alternates.canonical, '/semiconductor-watch/' + article.id);
    assert.ok(metadata.openGraph.modifiedTime.startsWith('2026-10-08'));
  }
  console.log('PASS: real Next 308/404 route signals, 17 canonical/indexable profiles and sitemap URLs, 666 unique free pairs, SSR source/quality disclosures, directory parameter metadata, 31 research entries and material links.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
