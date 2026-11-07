const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const ts = require('typescript'), React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function loader() {
  const cache = new Map();
  function load(file) {
    const filename = [file, file + '.ts', file + '.tsx', path.join(file, 'index.ts')].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    if (!filename) throw Error(file);
    if (cache.has(filename)) return cache.get(filename);
    if (filename.endsWith('.json')) return JSON.parse(fs.readFileSync(filename, 'utf8'));
    const exports = {}; cache.set(filename, exports);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    vm.runInNewContext(code, { exports, process, URL, URLSearchParams, require(id) {
      if (id === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
      if (id === 'next/dynamic') return { __esModule: true, default: () => () => React.createElement('div', null, 'Map loading') };
      if (id === '@/lib/analytics') return { trackEvent() {}, trackLocationMapEvent() {} };
      if (id.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
      if (id.startsWith('@/')) return load('src/' + id.slice(2));
      if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id));
      return require(id);
    } }, { filename });
    return exports;
  }
  return load;
}
const load = loader();
const model = load('src/lib/location-explorer');
const { companyLocations: locations, locationSources: sources } = load('src/data/company-locations');
const { locationCompanies: companies } = load('src/data/location-companies');
const { factoryProjects: projects, factoryProjectSources: projectSources } = load('src/data/factory-projects');
const data = { locations, companies, projects };
const defaults = model.defaultExplorerState;
const rows = (state = defaults(), query = '') => model.filterExplorerRows(data, state, query);
const getLocation = id => locations.find(location => location.id === id);

test('28 physical locations and five projects have valid references without a Rapidus company page', () => {
  assert.equal(locations.length, 28);
  assert.equal(projects.length, 5);
  assert.equal(new Set(locations.map(location => location.id)).size, 28);
  assert.equal(load('src/lib/company-locations').validateCompanyLocationData().length, 0);
  assert.equal(model.validateExplorerData(data, sources, projectSources).length, 0);
  assert.equal(companies.find(company => company.id === 'rapidus').slug, undefined);
  assert.equal(new Set(projects.map(project => project.locationId)).size, 4);
});

test('OR within each facet and AND across facets; company and product normalization', () => {
  const state = { ...defaults(), companyIds: ['tsmc', 'micron'], prefectureCodes: ['43', '34'], types: ['factory'] };
  assert.equal(rows(state).map(row => row.location.id).sort().join(','), 'micron-hiroshima,tsmc-jasm-kumamoto');
  assert.equal(rows({ ...state, statuses: ['under-construction'] }).length, 2);
  assert.equal(rows(defaults(), 'ｊａｓｍ').length, 1);
  assert.ok(rows(defaults(), '広島').some(row => row.location.id === 'micron-hiroshima'));
  assert.equal(rows(defaults(), 'no-matching-location').length, 0);
  assert.equal(rows(defaults()).length, 28);
});

test('one JASM campus can be operating and expanding, while projects keep separate stages', () => {
  const statuses = model.getLocationStatuses(getLocation('tsmc-jasm-kumamoto'), projects);
  assert.equal([...statuses].sort().join(','), 'operating,under-construction');
  const state = { ...defaults(), mode: 'projects' };
  assert.equal(rows(state).length, 5);
  assert.equal(rows({ ...state, statuses: ['operating'] }).map(row => row.id).sort().join(','), 'jasm-1,kioxia-k2');
  assert.equal(rows({ ...state, statuses: ['pilot'] })[0].id, 'rapidus-iim');
  assert.equal(rows({ ...state, statuses: ['under-construction'] }).length, 2);
  assert.equal(rows({ ...state, job: 'quality-reliability', companyIds: ['tsmc'] }).map(row => row.id).join(','), 'jasm-1');
  const micron = projects.find(project => project.id === 'micron-hiroshima-cleanroom');
  assert.equal(micron.milestones[1].outcome, 'planned');
  assert.match(micron.milestones[1].label, /装置搬入.*量産開始日ではありません/);
});

test('all graph counts use rows, map counts deduplicate sites and exclude unverified coordinates', () => {
  const all = rows();
  assert.equal(model.regionCounts(all).reduce((sum, region) => sum + region.count, 0), 28);
  const construction = rows({ ...defaults(), mode: 'projects', statuses: ['under-construction'] });
  assert.equal(model.regionCounts(construction).reduce((sum, region) => sum + region.count, 0), 2);
  assert.equal(new Set(model.mappableLocations(rows({ ...defaults(), mode: 'projects' })).map(location => location.id)).size,
    model.mappableLocations(rows({ ...defaults(), mode: 'projects' })).length);
  const location = getLocation('rapidus-chitose-iim');
  assert.ok(model.canMapLocation(location));
  for (const replacement of [{ reviewStatus: 'automated-check' }, { precision: 'municipality' }, { latitude: NaN }, { longitude: 0 }, { verificationNote: '' }]) {
    assert.equal(model.canMapLocation({ ...location, coordinates: { ...location.coordinates, ...replacement } }), false);
  }
  assert.ok(all.length > model.mappableLocations(all).length);
  const candidate = { ...location, coordinates: { ...location.coordinates, reviewStatus: 'automated-check' } };
  assert.equal(model.validateExplorerData({ ...data, locations: data.locations.map(item => item.id === candidate.id ? candidate : item) }, sources, projectSources).length, 0);
  assert.equal(rows({ ...defaults(), companyIds: ['rapidus'] }).length, 1);
});

test('URLs whitelist repeated filters, retain legacy region view and do not retain search text', () => {
  const state = model.readExplorerState(new URLSearchParams('prefecture=43&prefecture=34&prefecture=99&type=factory&type=unknown&company=micron&status=under-construction&job=quality-reliability&view=regions&query=private-text'), data);
  assert.equal(state.prefectureCodes.join(','), '43,34');
  assert.equal(state.types.join(','), 'factory');
  assert.equal(state.view, 'map');
  const params = model.explorerSearchParams(state);
  assert.ok(!params.toString().includes('private-text'));
  const restored = model.readExplorerState(params, data);
  assert.equal(rows(state).map(row => row.id).join(','), rows(restored).map(row => row.id).join(','));
  for (const project of projects) {
    const href = model.factoryProjectMapHref(project);
    const restored = model.readExplorerState(new URL(href, 'https://mfg-compass.com').searchParams, data);
    assert.equal(restored.projectId, project.id);
    assert.equal(restored.locationId, project.locationId);
    assert.equal(restored.mode, 'projects');
  }
  assert.equal(model.readExplorerState(new URLSearchParams('project=unknown&location=unknown'), data).locationId, undefined);
});

test('invalid facility and source references are rejected', () => {
  assert.ok(model.validateExplorerData({ ...data, projects: [{ ...projects[0], facilityId: 'wrong' }] }, sources, projectSources).length);
  assert.ok(model.validateExplorerData({ ...data, projects: [{ ...projects[0], locationId: 'missing' }] }, sources, projectSources).length);
  assert.ok(model.validateExplorerData(data, [], projectSources).length);
});

test('SSR includes the full directory and sources without loading the map, and retains both canonical URLs', async () => {
  const Component = load('src/components/SemiconductorLocationApp').SemiconductorLocationApp;
  const html = renderToStaticMarkup(React.createElement(Component, { ...data, sources, projectSources, hiringSignals: [], initialState: defaults() }));
  assert.equal((html.match(/<article\b/g) || []).length, 28);
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
  for (const location of locations) assert.ok(html.includes(escape(location.name)), location.name);
  assert.ok(html.includes('https://www.rapidus.inc/'));
  assert.ok(!html.includes('/companies/rapidus'));
  const projectState = model.readExplorerState(new URLSearchParams('mode=projects&project=jasm-2'), data);
  const projectHtml = renderToStaticMarkup(React.createElement(Component, { ...data, sources, projectSources, hiringSignals: [], initialState: projectState }));
  assert.equal((projectHtml.match(/<article\b/g) || []).length, 5);
  assert.ok(projectHtml.includes('2028年'));
  assert.ok(projectHtml.includes('量産開始予定'));
  const page = load('src/app/(ja)/semiconductor-map/page');
  assert.equal((await page.generateMetadata({ searchParams: Promise.resolve({}) })).robots.index, true);
  const meta = await page.generateMetadata({ searchParams: Promise.resolve({ prefecture: '43' }) });
  assert.equal(meta.robots.index, false);
  assert.equal(meta.alternates.canonical, '/semiconductor-map');
  const guide = load('src/content/guides/japan-semiconductor-factory-projects').japanSemiconductorFactoryProjectsGuide;
  assert.equal(guide.status, 'published');
  assert.equal(guide.sections.find(section => section.id === 'projects').blocks.find(block => block.type === 'links').items.length, 5);
});

test('CSS modules remain valid in Next pure mode', async () => {
  const postcss = require('postcss'), pure = require('next/dist/compiled/postcss-modules-local-by-default');
  await postcss([pure({ mode: 'pure' })]).process(fs.readFileSync('src/components/SemiconductorLocationExplorer.module.css', 'utf8'), { from: 'src/components/SemiconductorLocationExplorer.module.css' });
});

test('prefecture pages derive eligibility from public locations and linked projects', () => {
  const { getPrefectureLocationPages } = load('src/lib/prefecture-locations');
  const publicLocations = load('src/lib/company-locations').getPublicCompanyLocations();
  const pages = getPrefectureLocationPages();
  const page = load('src/app/(ja)/semiconductor-map/prefectures/[prefecture]/page');
  assert.equal(page.generateStaticParams().map(item => item.prefecture).join(','), pages.map(item => item.slug).join(','));
  for (const slug of new Set(publicLocations.map(location => location.prefectureSlug))) {
    const items = publicLocations.filter(location => location.prefectureSlug === slug);
    const linked = projects.filter(project => items.some(location => location.id === project.locationId));
    assert.equal(pages.some(item => item.slug === slug), items.length >= 2 || linked.length > 0, slug);
  }
  const single = publicLocations.find(location => !projects.some(project => project.locationId === location.id));
  assert.equal(getPrefectureLocationPages([single], []).length, 0);
  assert.equal(getPrefectureLocationPages([single], [{ ...projects[0], locationId: single.id }]).length, 1);
  assert.equal(getPrefectureLocationPages([single], [{ ...projects[0], locationId: 'missing' }]).length, 0);
  assert.equal(getPrefectureLocationPages([single, { ...single, id: 'another' }], []).length, 1);
});

test('prefecture SSR, metadata, hub, guide and sitemap agree on public pages', async () => {
  const pages = load('src/lib/prefecture-locations').getPrefectureLocationPages();
  const page = load('src/app/(ja)/semiconductor-map/prefectures/[prefecture]/page');
  const sitemap = load('src/app/sitemap').default();
  const guide = load('src/content/guides/japan-semiconductor-factory-projects').japanSemiconductorFactoryProjectsGuide;
  const guideLinks = guide.sections.find(section => section.id === 'locations').blocks.find(block => block.type === 'links').items;
  const hub = await load('src/app/(ja)/semiconductor-map/page').default({ searchParams: Promise.resolve({}) });
  const hubHtml = renderToStaticMarkup(hub);
  for (const item of pages) {
    const url = `/semiconductor-map/prefectures/${item.slug}`;
    const params = Promise.resolve({ prefecture: item.slug });
    const meta = await page.generateMetadata({ params });
    assert.equal(meta.alternates.canonical, url);
    assert.equal(meta.title.absolute, `${item.name}の半導体工場・拠点一覧｜半導体メーカー・製造拠点マップ`);
    const html = renderToStaticMarkup(await page.default({ params }));
    assert.ok(html.includes(`${item.name}の半導体工場・拠点一覧`));
    assert.ok(html.includes('BreadcrumbList') && html.includes('ItemList'));
    assert.ok(html.includes(`${item.name}に半導体工場はありますか？`));
    for (const location of item.locations) assert.ok(html.includes(location.name) && html.includes(location.lastVerifiedAt));
    for (const project of item.projects) {
      assert.ok(html.includes(project.name) && html.includes(project.stage));
      for (const milestone of project.milestones) assert.ok(html.includes(milestone.dateLabel) && html.includes(milestone.label));
    }
    assert.equal(html.includes('id="projects-title"'), item.projects.length > 0);
    assert.equal(html.includes(`${item.name}で進んでいる半導体工場の新設・増設計画は？`), item.projects.length > 0);
    assert.ok(hubHtml.includes(`href="${url}"`));
    assert.equal(guideLinks.some(link => link.href === url), item.projects.length > 0);
    const entry = sitemap.find(entry => entry.url.endsWith(url));
    assert.ok(entry);
    assert.equal(entry.lastModified.toISOString(), new Date(`${item.lastVerifiedAt}T00:00:00+09:00`).toISOString());
  }
  assert.equal(page.dynamicParams, false);
  assert.equal((await page.generateMetadata({ params: Promise.resolve({ prefecture: 'unknown' }) })).alternates, undefined);
});
