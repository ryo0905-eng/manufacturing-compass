const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '../..');
const cache = new Map();
const analyticsEvents = [];
function load(relative) {
  const filename = path.join(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const localRequire = (id) => {
    if (id === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
    if (id === '@/lib/analytics') return { trackEvent: (...args) => analyticsEvents.push(args) };
    if (id.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
    if (id.startsWith('@/') || id.startsWith('.')) {
      const stem = id.startsWith('@/') ? path.join(root, 'src', id.slice(2)) : path.resolve(path.dirname(filename), id);
      const target = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'].map((suffix) => stem + suffix).find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
      if (!target) throw new Error(`Cannot resolve ${id} from ${filename}`);
      if (target.endsWith('.json')) return JSON.parse(fs.readFileSync(target, 'utf8'));
      return load(path.relative(root, target));
    }
    return require(id);
  };
  vm.runInNewContext(code, { module, exports: module.exports, require: localRequire, console, process, URL, Date }, { filename });
  return module.exports;
}
const data = load('src/data/japan-work.ts');
const model = load('src/lib/japan-work.ts');
const { companies, getCompanyContentStatus } = load('src/data/companies.ts');
const { companyLocations } = load('src/data/company-locations.ts');
const views = data.japanWorkCompanies.map((profile) => ({ ...profile, name: profile.companyId, slug: profile.companyId, works: data.japanWorkEvidence.filter((work) => work.companyId === profile.companyId && work.status === 'published') }));
const errors = model.validateJapanWorkEvidence(data.japanWorkEvidence, companies.map((c) => c.id), data.japanWorkSources.map((s) => s.id), companyLocations, data.japanWorkCategories.map((c) => c.id));
assert.equal(errors.length, 0, errors.join('\n'));
assert.equal(load('src/lib/company-locations.ts').validateCompanyLocationData().length, 0);
for (const profile of data.japanWorkCompanies) {
  assert.ok(companies.some((c) => c.id === profile.companyId));
  if (profile.status === 'published') {
    assert.ok(profile.presenceSourceIds.length > 0);
    assert.ok(data.japanWorkEvidence.some((work) => work.companyId === profile.companyId && work.status === 'published'));
    for (const id of profile.presenceSourceIds) assert.ok(data.japanWorkSources.some((s) => s.id === id));
  }
}
for (const source of data.japanWorkSources) assert.equal(new URL(source.url).protocol, 'https:');
assert.equal(model.filterJapanWorkCompanies(views, {}).length, 8);
assert.equal(model.filterJapanWorkCompanies(views, {}).some((c) => c.companyId === 'amd'), false);
assert.equal(model.filterJapanWorkCompanies(views, { category: 'application', prefecture: '三重県' }).some((c) => c.companyId === 'applied-materials'), false, 'A service job location must not leak into a separate process-support job');
assert.equal(model.filterJapanWorkCompanies(views, { category: 'equipment', prefecture: '三重県' }).some((c) => c.companyId === 'applied-materials'), true);
assert.equal(model.filterJapanWorkCompanies(views, { category: 'design', prefecture: '東京都' }).some((c) => c.companyId === 'infineon'), false, 'Quality lab address must not become development role location');
assert.equal(model.filterJapanWorkCompanies(views, { category: 'quality', prefecture: '東京都' }).some((c) => c.companyId === 'infineon'), true);
assert.equal(model.filterJapanWorkCompanies(views, { category: 'quality', prefecture: '北海道' }).length, 0);
assert.equal(model.filterJapanWorkCompanies(views, { category: 'application' }).some((c) => c.companyId === 'lam-research'), true, 'Nationwide view must include region-unconfirmed work');
const sample = data.japanWorkEvidence[0];
assert.equal(model.matchesJapanWork({ ...sample, status: 'draft' }, {}), false);
assert.equal(model.matchesJapanWork({ ...sample, status: 'withdrawn' }, {}), false);
assert.equal(model.isJapanWorkReviewExpired(sample, sample.nextReviewAt), false);
assert.equal(model.isJapanWorkReviewExpired(sample, '2026-12-22'), true);
const allowed = ['a', 'b', 'c'];
const normalized = (value) => Array.from(value);
assert.deepEqual(normalized(model.toggleJapanWorkComparison([], 'a', allowed)), ['a']);
assert.deepEqual(normalized(model.toggleJapanWorkComparison(['a'], 'b', allowed)), ['a', 'b']);
assert.deepEqual(normalized(model.toggleJapanWorkComparison(['a', 'b'], 'c', allowed)), ['a', 'b']);
assert.deepEqual(normalized(model.toggleJapanWorkComparison(['a', 'b'], 'a', allowed)), ['b']);
assert.deepEqual(normalized(model.toggleJapanWorkComparison(['a', 'a', 'unknown'], 'c', allowed)), ['a', 'c']);
assert.equal(model.validateJapanWorkEvidence([{ ...sample, locationIds: ['infineon-shibuya'] }], companies.map((c) => c.id), data.japanWorkSources.map((s) => s.id), companyLocations, data.japanWorkCategories.map((c) => c.id)).length, 1);
assert.equal(model.validateJapanWorkEvidence([{ ...sample, sourceIds: ['missing'], categories: ['wrong'] }], companies.map((c) => c.id), data.japanWorkSources.map((s) => s.id), companyLocations, data.japanWorkCategories.map((c) => c.id)).length, 2);
for (const id of ['amd', 'kla', 'lam-research', 'infineon']) assert.equal(getCompanyContentStatus(id), 'draft');
const page = load('src/app/(ja)/companies/global-japan/page.tsx');
assert.equal(page.metadata.robots.index, true);
assert.equal(page.metadata.alternates.canonical, data.japanWorkRoute);
const html = renderToStaticMarkup(React.createElement(page.default));
assert.ok(html.includes('企業と日本の仕事内容の対応表'));
for (const work of data.japanWorkEvidence) assert.ok(html.includes(work.id === 'applied-ce' ? 'Customer Engineer' : work.officialTitle), `SSR missing ${work.id}`);
for (const id of ['kla', 'analog-devices', 'infineon', 'tsmc']) assert.ok(html.includes(`id="evidence-${id}"`));
assert.ok(html.includes('掲載準備中'));
assert.ok(html.includes('data-japan-work-link="source"'));
assert.ok(html.includes('href="/roles"'));
assert.ok(html.includes('"numberOfItems":8'));
assert.ok(!html.includes('JobPosting'));
assert.equal(analyticsEvents.length, 0, 'Rendering must not emit analytics events');
const client = fs.readFileSync(path.join(root, 'src/components/JapanWorkExplorer.tsx'), 'utf8');
assert.ok(!/localStorage|sessionStorage|document\.cookie|fetch\(|history\.pushState/.test(client));
console.log('Japan work: data integrity, compound filters, pending/withdrawn work, expiry, comparison limits and initial HTML passed.');
