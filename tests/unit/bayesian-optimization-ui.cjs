const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const base = path.resolve('src');
function moduleLoader(overrides = {}) {
  const cache = new Map();
  function load(file) {
    if (!path.extname(file)) file += fs.existsSync(file + '.tsx') ? '.tsx' : '.ts';
    if (file.endsWith('.css')) return { default: new Proxy({}, { get: (_, key) => String(key) }) };
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    vm.runInNewContext(code, { exports, require: name => {
      if (name in overrides) return overrides[name];
      if (name === 'next/link') return { __esModule: true, default: props => React.createElement('a', props, props.children) };
      if (name.startsWith('@/')) return load(path.join(base, name.slice(2)));
      if (name.startsWith('.')) return load(path.resolve(path.dirname(file), name));
      return require(name);
    } }, { filename: file });
    cache.set(file, exports); return exports;
  }
  return load;
}
function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(item => nodes(item, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
function plainText(tree) {
  if (tree == null || typeof tree === 'boolean') return '';
  if (typeof tree !== 'object') return String(tree);
  if (Array.isArray(tree)) return tree.map(plainText).join('');
  return plainText(tree.props?.children);
}
function harness(fail = false) {
  const slots = [], events = []; let cursor = 0;
  const react = {
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial; return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; },
    useRef(initial) { const i = cursor++; if (!(i in slots)) slots[i] = { current: initial }; return slots[i]; },
    useMemo(fn) { return fn(); },
    useEffect() {},
  };
  const element = (type, props) => ({ type, props });
  const overrides = { react, 'react/jsx-runtime': { jsx: element, jsxs: element }, '@/lib/analytics': { trackEvent: (...args) => events.push(args) } };
  if (fail) {
    const real = moduleLoader({ '@/lib/analytics': overrides['@/lib/analytics'] })(path.join(base, 'lib/bayesian-optimization/session.ts'));
    overrides['@/lib/bayesian-optimization/session'] = { ...real, runExperiment: (...args) => real.runExperiment(...args, () => { throw Error('numerical failure'); }) };
  }
  const load = moduleLoader(overrides);
  const Tool = load(path.join(base, 'components/bayesian-optimization/BayesianOptimizationTool.tsx')).BayesianOptimizationTool;
  const render = () => { cursor = 0; return Tool(); };
  const button = label => nodes(render(), n => n.type === 'button' && plainText(n) === label)[0];
  const click = label => { const b = button(label); assert.ok(b, label); assert.ok(!b.props.disabled, label); b.props.onClick({ detail: 1 }); };
  const map = () => nodes(render(), n => n.type?.name === 'ExperimentMap')[0].props;
  return { render, button, click, map, slots, events };
}
const ui = harness();
assert.ok(!plainText(ui.render()).includes('ノイズを除いた真値'));
assert.equal(ui.map().truth, undefined); assert.equal(ui.map().surface, undefined);
const first = ui.button('実験する'); first.props.onClick({ detail: 2 }); assert.equal(ui.map().observations.length, 0);
first.props.onClick({ detail: 1 }); first.props.onClick({ detail: 1 }); // stale handler cannot advance into DOE
assert.equal(ui.map().observations.length, 1);
assert.equal(ui.map().planned.length, 5);
ui.click('5回まとめて実験する');
assert.equal(ui.map().observations.length, 6); assert.equal(ui.map().surface.length, 1681);
assert.equal(ui.button('推奨点を選ぶ'), undefined);
const tempInput = () => nodes(ui.render(), n => n.type === 'input' && n.props.id === 'bo-temperature')[0];
tempInput().props.onChange({ target: { value: '' } });
assert.equal(ui.button('実験する').props.disabled, true);
tempInput().props.onChange({ target: { value: '501' } });
assert.equal(ui.button('実験する').props.disabled, true);
tempInput().props.onChange({ target: { value: '430' } });
assert.equal(ui.button('実験する').props.disabled, false);
const beforeViewChange = JSON.stringify(ui.slots[0]);
ui.click('不確かさ'); ui.click('品質予測');
assert.equal(JSON.stringify(ui.slots[0]), beforeViewChange); // no random draws on view changes
ui.click('実験する');
for (let i = 0; i < 4; i++) {
  assert.ok(ui.map().recommended);
  ui.click('推奨点を選ぶ'); ui.click('実験する');
}
assert.equal(ui.map().observations.length, 11);
assert.equal(ui.map().disabled, true);
const confirmation = ui.map().selected;
ui.click('この条件をもう1回測る');
assert.equal(ui.map().observations.length, 12);
assert.equal(ui.map().view, 'truth'); assert.equal(ui.map().truth.length, 1681);
const last = ui.map().observations[11];
assert.equal(last.temperature, confirmation.temperature); assert.equal(last.pressure, confirmation.pressure);
assert.equal(ui.button('実験する'), undefined);
assert.ok(plainText(ui.render()).includes('確認前の予測'));
ui.click('観測値で振り返る');
assert.equal(nodes(ui.render(), n => n.type?.name === 'ImprovementChart')[0].props.truth, undefined);
ui.click('ノイズを除いて振り返る');
assert.equal(nodes(ui.render(), n => n.type?.name === 'ImprovementChart')[0].props.truth.length, 12);
const beforeReset = JSON.stringify(ui.map().observations);
ui.click('同じシードでやり直す');
assert.equal(ui.map().observations.length, 0); assert.equal(ui.map().truth, undefined); assert.equal(ui.map().surface, undefined);
ui.click('実験する'); ui.click('5回まとめて実験する');
tempInput().props.onChange({ target: { value: '430' } }); ui.click('実験する');
for (let i = 0; i < 4; i++) { ui.click('推奨点を選ぶ'); ui.click('実験する'); }
ui.click('この条件をもう1回測る');
assert.equal(JSON.stringify(ui.map().observations), beforeReset);
for (const [name, properties] of ui.events) {
  assert.ok(/^bo_(started|doe_completed|experiment|completed|retried|related_clicked)$/.test(name));
  assert.ok(Object.keys(properties).every(k => ['version', 'stage', 'method', 'destination'].includes(k)));
}
const broken = harness(true);
broken.click('実験する'); broken.click('5回まとめて実験する');
assert.equal(broken.map().observations.length, 6); assert.equal(broken.map().surface, undefined);
assert.equal(broken.button('実験する').props.disabled, true);
assert.ok(plainText(broken.render()).includes('予測と推奨を停止'));
broken.click('同じシードでやり直す'); assert.equal(broken.button('実験する').props.disabled, false);

// Server rendering checks the real React tree, initial SEO content and truthful initial state.
const ssr = moduleLoader({ '@/lib/analytics': { trackEvent() {} }, '@/lib/format': { siteUrl: 'https://mfg-compass.com' } });
const Page = ssr(path.join(base, 'app/(ja)/tools/bayesian-optimization/page.tsx')).default;
const html = renderToStaticMarkup(React.createElement(Page));
for (const expected of ['ベイズ最適化を体験する', 'WebApplication', 'BreadcrumbList', 'DOEとベイズ最適化の関係', 'しくみを見る', 'Matérn', '実設備の推奨条件ではありません']) assert.ok(html.includes(expected), expected);
assert.ok(!html.includes('ノイズを除いた真値'));
const chartModule = ssr(path.join(base, 'components/bayesian-optimization/BayesianCharts.tsx'));
const chart = renderToStaticMarkup(React.createElement(chartModule.ImprovementChart, { observations: ui.map().observations }));
assert.ok(!chart.includes('NaN') && !chart.includes('Infinity'));
const css = fs.readFileSync('src/components/bayesian-optimization/bayesian.module.css', 'utf8');
assert.ok(css.includes('prefers-reduced-motion:reduce') && css.includes('focus-visible') && css.includes('max-width:680px'));
console.log('bayesian-optimization-ui: 12-run flow, keyboard inputs, map views, invalid values, stale/double click, failure, reset, privacy and SSR passed (no browser run)');
