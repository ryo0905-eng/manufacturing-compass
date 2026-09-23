const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '../..');
const japanese = /[\u3040-\u30ff\u3400-\u9fff]/;

function loader(react = React, globals = {}, events = []) {
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
      if (id === 'react') return react;
      if (id.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
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
    react: { ...React, useState: state, useRef: initial => state({ current: initial })[0], useEffect() {}, useReducer: (reducer, initial) => { const [value, set] = state(initial); return [value, action => set(previous => reducer(previous, action))]; } },
  };
}
const controlNames = new Set(['Button', 'ButtonLink', 'SelectionButton', 'Field', 'FieldMessage', 'InputField', 'TextareaField', 'SelectField', 'Notice']);
function expandControl(tree) {
  while (typeof tree?.type === 'function' && controlNames.has(tree.type.name)) tree = tree.type(tree.props);
  return tree;
}
function nodes(tree, predicate) {
  tree = expandControl(tree);
  if (Array.isArray(tree)) return tree.flatMap(n => nodes(n, predicate));
  if (!tree || typeof tree !== 'object') return [];
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
function text(tree) {
  tree = expandControl(tree);
  if (Array.isArray(tree)) return tree.map(text).join(' ');
  if (typeof tree === 'string' || typeof tree === 'number') return String(tree);
  return tree?.props ? text(tree.props.children) : '';
}

async function main() {
  const load = loader();
  const { cpkText, cpkEnglishText } = load('src/data/cpk-text');
  for (const [ja, en] of Object.entries(cpkEnglishText)) {
    assert.equal(cpkText('ja', ja), ja);
    assert.ok(en.length > 0 && !japanese.test(en));
  }
  const math = load('src/lib/process-capability');
  const samples = load('src/data/cpk-samples').capabilitySamples;
  const { CapabilityHistogram } = load('src/components/CapabilityHistogram');
  for (const sample of samples) {
    const result = math.calculateOverallCapability(sample.values, sample.lsl, sample.usl);
    const analysis = math.analyzeCapability(result);
    for (const value of [sample.label, sample.description, analysis.heading, analysis.summary, ...analysis.checks]) assert.doesNotMatch(cpkText('en', value), japanese);
    const html = renderToStaticMarkup(React.createElement(CapabilityHistogram, { result, values: sample.values, locale: 'en' }));
    assert.doesNotMatch(html, japanese);
    assert.match(html, /Histogram of measurements/);
  }
  const oneSided = math.analyzeCapability(math.calculateOverallCapability([8, 9, 10, 11, 12], undefined, 15));
  assert.match(cpkText('en', oneSided.summary), /no specification midpoint/);
  const learning = load('src/lib/cpk-learning');
  const initial = { mean: 100, standardDeviation: .75, lsl: 97, usl: 103 };
  const variants = [initial, { ...initial, mean: 101 }, { ...initial, mean: 99 }, { ...initial, mean: 103 }, { ...initial, mean: 104 }, { ...initial, standardDeviation: .5 }, { ...initial, standardDeviation: 1.2 }, { ...initial, lsl: 98, usl: 102 }, { ...initial, mean: 101, standardDeviation: 1 }];
  for (const before of variants) for (const after of variants) assert.doesNotMatch(learning.comparisonMessage(before, after, 'en'), japanese);
  assert.match(learning.comparisonMessage(initial, { ...initial, mean: 103 }, 'en'), /Cpk is zero/);
  assert.match(learning.comparisonMessage({ ...initial, mean: 104 }, { ...initial, mean: 104, standardDeviation: .5 }, 'en'), /more negative/);

  const state = hooks(), events = [];
  const interactive = loader(state.react, { requestAnimationFrame: callback => callback() }, events);
  const { CpkCalculator } = interactive('src/components/CpkCalculator');
  const render = () => { state.reset(); return CpkCalculator({ locale: 'en' }); };
  const press = label => nodes(render(), n => n.type === 'button' && text(n) === label)[0].props.onClick();
  const change = (id, value) => nodes(render(), n => n.props.id === id)[0].props.onChange({ target: { value } });
  const copy = () => nodes(render(), n => n.type?.name === 'CpkResultCopy')[0]?.props.text;
  assert.match(copy(), /Ppk: 1\.331/);
  assert.doesNotMatch(copy(), japanese);
  assert.doesNotMatch(text(render()), japanese);
  change('usl', '11');
  assert.equal(copy(), undefined);
  assert.match(text(render()), /Inputs have changed\. Calculate again/);
  assert.doesNotMatch(text(render()), japanese);
  press('Use your own data');
  change('measurement-data', '8\n9\n10\n11\n12'); change('lsl', '5'); change('usl', '15'); press('Calculate');
  assert.match(copy(), /Ppk: 1\.054/);
  assert.doesNotMatch(copy(), japanese);
  change('lsl', ''); press('Calculate');
  assert.match(copy(), /Ppu: 1\.054/);
  assert.match(copy(), /no specification midpoint/);
  for (const [input, message] of [['10', /at least two/], ['10\n10', /identical/], ['bad bad bad bad bad 8 9', /Too many/]]) {
    change('measurement-data', input); press('Calculate');
    assert.equal(copy(), undefined); assert.match(text(render()), message); assert.doesNotMatch(text(render()), japanese);
  }
  change('measurement-data', '8 9 10'); change('lsl', '15'); change('usl', '5'); press('Calculate');
  assert.match(text(render()), /USL must be greater/);
  press('Mean and within-process SD');
  change('summary-mean', '10'); change('summary-sd', '1'); change('lsl', '5'); change('usl', '15'); press('Calculate');
  assert.match(copy(), /Cpk: 1\.667/);
  change('summary-sd', '0'); press('Calculate'); assert.match(text(render()), /greater than zero/);
  for (const event of events) {
    assert.equal(event.props.locale, 'en');
    assert.ok(Object.keys(event.props).every(key => ['locale', 'sample', 'input_mode', 'specification_type'].includes(key)), 'No input data in analytics');
  }
  for (const fails of [false, true]) {
    const copyState = hooks(), copied = [], copyEvents = [];
    const copyLoad = loader(copyState.react, { navigator: { clipboard: { async writeText(value) { if (fails) throw new Error('denied'); copied.push(value); } } } }, copyEvents);
    const Copy = copyLoad('src/components/CpkResultCopy').CpkResultCopy;
    const props = { text: 'Ppk: 1.054', method: 'overall', locale: 'en' };
    const renderCopy = () => { copyState.reset(); return Copy(props); };
    await nodes(renderCopy(), n => n.type === 'button')[0].props.onClick();
    assert.doesNotMatch(text(renderCopy()), japanese);
    if (fails) {
      assert.match(text(renderCopy()), /copy it manually/);
      assert.equal(nodes(renderCopy(), n => n.type === 'textarea')[0].props.value, props.text);
      assert.equal(copyEvents.length, 0);
    } else {
      assert.deepEqual(copied, [props.text]);
      assert.equal(copyEvents[0].props.locale, 'en');
      assert.deepEqual(Object.keys(copyEvents[0].props).sort(), ['locale', 'method']);
    }
  }
  for (const published of [false, true]) {
    const seo = loader();
    const release = seo('src/data/cpk-english').englishCpkRelease;
    release.status = published ? 'published' : 'draft';
    release.publishedAt = published ? '2026-09-21' : null;
    release.reviewedAt = published ? '2026-09-21' : null;
    const page = seo('src/app/(en)/en/tools/cpk/page');
    const meta = page.generateMetadata();
    assert.equal(meta.robots.index, published);
    const jaMeta = seo('src/app/(ja)/tools/cpk/page').metadata;
    assert.equal(JSON.stringify(meta.alternates.languages), JSON.stringify(jaMeta.alternates.languages));
    const sitemap = seo('src/app/sitemap').default();
    assert.equal(sitemap.filter(row => row.url.endsWith('/en/tools/cpk')).length, published ? 1 : 0);
    const html = renderToStaticMarkup(React.createElement(page.default));
    assert.doesNotMatch(html.replaceAll('日本語', ''), japanese);
    assert.equal(html.includes('Editorial preview'), !published);
    assert.equal(html.includes('application/ld+json'), published);
    assert.match(html, /Probability density/);
    assert.doesNotMatch(html, /affiliate_outbound_click|StatisticsCourseCta/);
  }
  console.log('Cpk English passed: shared calculations, one-sided explanations, errors, samples, histogram, learning branches, copy/fallback, private event payloads, SSR and publication SEO.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
