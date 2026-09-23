const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '../..');
const japanese = /[\u3040-\u30ff\u3400-\u9fff]/;

function loader(react = React, globals = {}, events = [], overrides = {}) {
  const cache = new Map();
  function load(relative) {
    const stem = path.resolve(root, relative);
    const filename = [stem, stem + '.ts', stem + '.tsx', path.join(stem, 'index.ts')].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    assert.ok(filename, relative);
    if (cache.has(filename)) return cache.get(filename);
    const result = {};
    cache.set(filename, result);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    function localRequire(id) {
      if (id in overrides) return overrides[id];
      if (id === 'react') return react;
      if (id.endsWith('.css')) {
        const cssPath = id.startsWith('@/') ? path.join(root, 'src', id.slice(2)) : path.resolve(path.dirname(filename), id);
        assert.ok(fs.existsSync(cssPath), cssPath);
        return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
      }
      if (id === 'next/link') return { __esModule: true, default: props => React.createElement('a', props) };
      if (id === '@/lib/analytics') return { trackEvent: (name, props) => events.push({ name, props }) };
      if (id === '@/components/TrackedInternalLink') return { TrackedInternalLink: ({ eventName, eventProperties, ...props }) => React.createElement('a', props) };
      if (id.startsWith('@/')) return load(path.join(root, 'src', id.slice(2)));
      if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id));
      return require(id);
    }
    vm.runInNewContext(code, { exports: result, require: localRequire, process, URL, Error, ...globals }, { filename });
    return result;
  }
  return load;
}
function hooks() {
  const values = [];
  let cursor = 0;
  const state = initial => {
    const i = cursor++;
    if (!(i in values)) values[i] = typeof initial === 'function' ? initial() : initial;
    return [values[i], value => { values[i] = typeof value === 'function' ? value(values[i]) : value; }];
  };
  return {
    reset() { cursor = 0; },
    react: { ...React, useState: state, useRef: initial => state({ current: initial })[0], useEffect() {}, useMemo: fn => fn(), useReducer: (reducer, initial) => { const [value, set] = state(initial); return [value, action => set(previous => reducer(previous, action))]; } },
  };
}
function nodes(tree, predicate) {
  if (Array.isArray(tree)) return tree.flatMap(n => nodes(n, predicate));
  if (!tree || typeof tree !== 'object') return [];
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
function text(tree) {
  if (Array.isArray(tree)) return tree.map(text).join(' ');
  if (typeof tree === 'string' || typeof tree === 'number') return String(tree);
  return tree?.props ? text(tree.props.children) : '';
}

async function main() {
  const load = loader();
  const copy = load('src/data/practical-tool-text.ts');
  const t = copy.getToolText('en');
  assert.equal(t('{0}の工程名', '工程{1}'), 'Station name: 工程{1}', 'user labels are never translated or interpolated again');
  // Verify the checked-in release before isolating draft fixtures below.
  const releases = load('src/data/practical-tools-english.ts');
  const actualUrls = load('src/app/sitemap.ts').default().map(item => item.url);
  const actualMetadata = load('src/lib/practical-tool-metadata.ts');
  for (const id of releases.englishPracticalToolIds) {
    assert.equal(releases.isEnglishPracticalToolPublished(id), true);
    assert.equal(releases.englishPracticalTools[id].reviewedBy, 'RYO');
    assert.equal(releases.englishPracticalTools[id].reviewedAt, '2026-09-21');
    assert.equal(releases.englishPracticalTools[id].publishedAt, '2026-09-21');
    assert.ok(actualUrls.some(url => url.endsWith(`/en/tools/${id}`)));
    assert.equal(actualMetadata.englishPracticalToolMetadata(id).robots.index, true);
    const html = renderToStaticMarkup(React.createElement(load(`src/app/(en)/en/tools/${id}/page.tsx`).default));
    assert.ok(!html.includes('Editorial preview'));
    assert.ok(html.includes('Reviewed by RYO'));
    for (const other of releases.englishPracticalToolIds.filter(other => other !== id)) assert.ok(html.includes(`href="/en/tools/${other}"`));
  }
  for (const edition of Object.values(releases.englishPracticalTools)) Object.assign(edition, { status: 'draft', reviewedAt: null, reviewedBy: null, publishedAt: null });
  const components = [['OeeSimulator', 'oee'], ['LineBalanceSimulator', 'line-balance'], ['ProcessComparisonTool', 'process-comparison']];
  for (const [name, id] of components) {
    const Component = load(`src/components/${name}.tsx`)[name];
    const en = renderToStaticMarkup(React.createElement(Component, { locale: 'en' }));
    const ja = renderToStaticMarkup(React.createElement(Component));
    assert.ok(!japanese.test(en), `${id}: English initial UI contains Japanese`);
    assert.ok(japanese.test(ja), `${id}: default remains Japanese`);
    const page = load(`src/app/(en)/en/tools/${id}/page.tsx`);
    const preview = renderToStaticMarkup(React.createElement(page.default));
    assert.ok(preview.includes('Editorial preview'));
    assert.ok(!preview.includes('application/ld+json'));
    assert.ok(!preview.includes('Reviewed by'));
    assert.ok(preview.includes('Japanese'));
    assert.ok(preview.includes('Sources and edition dates'));
    const metadata = page.generateMetadata();
    assert.equal(metadata.robots.index, false);
    assert.equal(metadata.alternates.canonical, `/en/tools/${id}`);
    assert.equal(metadata.alternates.languages, undefined);
  }
  // Every literal translation key in changed UI/calculation files has English copy.
  for (const relative of ['components/OeeSimulator.tsx', 'components/LineBalanceSimulator.tsx', 'components/ProcessComparisonTool.tsx', 'lib/oee.ts', 'lib/line-balance.ts', 'lib/process-comparison.ts', 'lib/process-comparison-export.ts']) {
    const source = fs.readFileSync(path.join(root, 'src', relative), 'utf8');
    for (const match of source.matchAll(/\bt\("((?:[^"\\]|\\.)*)"/g)) {
      const key = JSON.parse(`"${match[1]}"`);
      assert.ok(copy.practicalToolEnglishText[key], `${relative}: missing ${key}`);
    }
  }
  const oee = load('src/lib/oee.ts');
  const current = { loadingMinutes: 480, downtimeMinutes: 60, idealCycleSeconds: 30, totalCount: 700, defectCount: 35 };
  const invalids = [{ loadingMinutes: 0 }, { downtimeMinutes: -1 }, { downtimeMinutes: 480 }, { idealCycleSeconds: 0 }, { totalCount: 0 }, { totalCount: 9999 }, { defectCount: -1 }, { defectCount: 701 }];
  for (const bad of invalids) {
    const en = oee.validateOeeInputs({ ...current, ...bad }, 'en');
    assert.ok(en.length > 0 && !japanese.test(en.join('')));
    assert.equal(en.length, oee.validateOeeInputs({ ...current, ...bad }).length);
  }
  const line = load('src/lib/line-balance.ts');
  for (const args of [[0, [], []], [50, [{ id: 's1', name: '' }], [{ name: '', seconds: -1, stationId: 's2' }]]]) {
    const errors = line.validateLineBalance(...args, 'en');
    assert.ok(errors.length && !japanese.test(errors.join('')));
    assert.equal(errors.length, line.validateLineBalance(...args).length);
  }
  const lib = load('src/lib/process-comparison.ts');
  const input = { nameA: '工程A', nameB: '工程B', measurement: '膜厚', unit: 'nm', dataA: '1\n2\n3', dataB: '2\n4', lower: '2', upper: '' };
  const result = lib.compareProcesses(input, 'en');
  assert.equal(JSON.stringify(result), JSON.stringify(lib.compareProcesses(input)), 'calculation and user labels stay identical');
  const englishInput = { ...input, nameA: 'Before', nameB: 'After', measurement: 'Thickness' };
  const englishResult = lib.compareProcesses(englishInput, 'en');
  for (const output of [lib.comparisonTsv(englishResult, 'en'), lib.comparisonSvg(englishResult, 'en'), JSON.stringify(lib.comparisonRows(englishResult, 'en'))]) assert.ok(!japanese.test(output));
  assert.ok(lib.comparisonTsv(result, 'en').includes('工程A'));
  for (const dataA of ['1', '1\ninvalid', Array(10001).fill('1').join('\n')]) assert.throws(() => lib.compareProcesses({ ...englishInput, dataA }, 'en'), e => !japanese.test(e.message));
  assert.throws(() => lib.compareProcesses({ ...englishInput, lower: '5', upper: '2' }, 'en'), /lower specification/);
  assert.ok(lib.comparisonTsv(lib.compareProcesses({ ...englishInput, nameA: '=1+1', measurement: '=1+1' }, 'en'), 'en').split(/[\t\n]/).every(cell => !cell.startsWith('=')));
  assert.ok(!lib.comparisonSvg(lib.compareProcesses({ ...englishInput, nameA: '<script>' }, 'en'), 'en').includes('<script>'));

  // Valid scenario changes count once; focus/blur without a numerical change does not.
  const oh = hooks(), oe = [], ol = loader(oh.react, {}, oe);
  const Oee = ol('src/components/OeeSimulator.tsx').OeeSimulator;
  const orender = () => { oh.reset(); return Oee({ locale: 'en' }); };
  const scenario = () => nodes(orender(), n => n.props?.field === 'downtimeMinutes' && n.props?.onCommit)[0];
  scenario().props.onFocus(); scenario().props.onCommit();
  assert.equal(oe.filter(e => e.name === 'oee_scenario_changed').length, 0);
  scenario().props.onFocus(); scenario().props.onChange('downtimeMinutes', '20'); scenario().props.onCommit(); scenario().props.onCommit();
  assert.equal(oe.filter(e => e.name === 'oee_scenario_changed').length, 1);
  scenario().props.onFocus(); scenario().props.onChange('downtimeMinutes', '9999'); scenario().props.onCommit();
  assert.equal(oe.filter(e => e.name === 'oee_scenario_changed').length, 1);
  assert.ok(oe.every(e => e.props.locale === 'en'));
  assert.ok(oe.every(e => Object.keys(e.props).every(k => ['locale', 'factor'].includes(k))));

  const lh = hooks(), le = [], ll = loader(lh.react, {}, le);
  const Line = ll('src/components/LineBalanceSimulator.tsx').LineBalanceSimulator;
  const lr = () => { lh.reset(); return Line({ locale: 'en' }); };
  const button = label => nodes(lr(), n => n.type === 'button' && text(n) === label)[0];
  assert.ok(text(lr()).includes('15 s'));
  button('Set current state as baseline').props.onClick();
  nodes(lr(), n => n.type === 'select')[3].props.onChange({ target: { value: 's3' } });
  assert.ok(text(lr()).includes('0 s'));
  button('+ Add station').props.onClick(); button('+ Add task').props.onClick();
  assert.ok(nodes(lr(), n => n.type === 'input' && n.props.value === 'Station 4').length);
  assert.ok(nodes(lr(), n => n.type === 'input' && n.props.value === 'Task 7').length);
  nodes(lr(), n => n.type === 'button' && n.props['aria-label'] === 'Delete Station 4')[0].props.onClick();
  nodes(lr(), n => n.type === 'button' && n.props['aria-label'] === 'Delete Task 7')[0].props.onClick();
  button('Reset sample').props.onClick();
  assert.ok(text(lr()).includes('15 s'));
  assert.ok(le.every(e => e.props.locale === 'en'));
  assert.ok(le.every(e => Object.keys(e.props).every(k => ['locale', 'source_station', 'destination_station'].includes(k))));

  for (const fail of [false, true]) {
    const h = hooks(), events = []; let copied, exported;
    const pl = loader(h.react, { navigator: { clipboard: { writeText: async value => { if (fail) throw Error('denied'); copied = value; } } } }, events, { '@/lib/process-comparison-export': { downloadComparisonPng: async value => { if (fail) throw Error('canvas'); exported = value; } } });
    const Component = pl('src/components/ProcessComparisonTool.tsx').ProcessComparisonTool;
    const render = () => { h.reset(); return Component({ locale: 'en' }); };
    const btn = label => nodes(render(), n => n.type === 'button' && text(n) === label)[0];
    btn('Try sample data').props.onClick();
    nodes(render(), n => n.type === 'form')[0].props.onSubmit({ preventDefault() {} });
    assert.ok(!japanese.test(text(render())));
    await btn('Copy table for Excel').props.onClick();
    const fallback = nodes(render(), n => n.type === 'textarea' && n.props.readOnly)[0];
    assert.equal(Boolean(fallback), fail);
    assert.ok(!japanese.test(fail ? fallback.props.value : copied));
    await btn('Save chart as PNG').props.onClick();
    if (fail) assert.ok(text(render()).includes('Could not create the PNG'));
    else assert.ok(exported.includes('Shared limits:'));
    assert.ok(events.every(e => e.props.locale === 'en' && Object.keys(e.props).every(key => ['locale', 'tool_id', 'ui_version', 'step', 'data_source'].includes(key))));
    nodes(render(), n => n.type === 'input')[0].props.onChange({ target: { value: 'private name' } });
    assert.equal(nodes(render(), n => n.type === 'img').length, 0);
  }

  // Each release is independent. Metadata, rendered links and sitemap use the same gate.
  for (const [, id] of components) {
    const fresh = loader();
    const editions = fresh('src/data/practical-tools-english.ts');
    for (const item of Object.values(editions.englishPracticalTools)) Object.assign(item, { status: 'draft', reviewedAt: null, reviewedBy: null, publishedAt: null });
    const edition = editions.englishPracticalTools[id];
    assert.equal(editions.isEnglishPracticalToolPublished(id), false);
    edition.status = 'published';
    assert.equal(editions.isEnglishPracticalToolPublished(id), false);
    edition.reviewedAt = '2026-09-21'; edition.reviewedBy = 'Test reviewer'; edition.publishedAt = '2026-09-21';
    assert.equal(editions.isEnglishPracticalToolPublished(id), true);
    const page = fresh(`src/app/(en)/en/tools/${id}/page.tsx`);
    const meta = page.generateMetadata();
    assert.equal(meta.robots.index, true);
    assert.ok(meta.alternates.languages.en.endsWith(`/en/tools/${id}`));
    const ja = fresh(`src/app/(ja)/tools/${id}/page.tsx`);
    assert.equal(ja.metadata.alternates.canonical, `/tools/${id}`);
    assert.equal(JSON.stringify(ja.metadata.alternates.languages), JSON.stringify(meta.alternates.languages));
    const html = renderToStaticMarkup(React.createElement(page.default));
    assert.ok(html.includes('application/ld+json') && html.includes('"inLanguage":"en"'));
    assert.ok(!html.includes('Editorial preview'));
    const urls = fresh('src/app/sitemap.ts').default().map(item => item.url);
    for (const [, other] of components) assert.equal(urls.some(url => url.endsWith(`/en/tools/${other}`)), id === other);
    const cpk = renderToStaticMarkup(React.createElement(fresh('src/app/(en)/en/tools/cpk/page.tsx').default));
    assert.equal(cpk.includes('href="/en/tools/process-comparison"'), id === 'process-comparison');
  }
  console.log('PASS: practical tools English UI, calculations, errors, exports/fallback, interactions, privacy and per-page publication SEO');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
