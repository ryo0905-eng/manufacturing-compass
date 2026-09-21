const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '../..');
const element = (type, props, key) => ({ type, props, key });
function load(relative, dependencies = {}, globals = {}) {
  const exports = {};
  const filename = path.join(root, relative);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require(name) {
      if (name === '@/data/cpk-text') return load('src/data/cpk-text.ts');
      if (name === 'react/jsx-runtime') return { jsx: element, jsxs: element };
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      throw new Error(`Unexpected dependency: ${name}`);
    },
    ...globals,
  }, { filename });
  return exports;
}
function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(item => nodes(item, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
function hooks() {
  const slots = [];
  let cursor = 0;
  return {
    reset() { cursor = 0; },
    react: {
      useState(initial) {
        const index = cursor++;
        if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
        return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
      },
      useRef(initial) {
        const index = cursor++;
        if (!(index in slots)) slots[index] = { current: initial };
        return slots[index];
      },
    },
  };
}
function mountCopy(clipboard, props) {
  const state = hooks();
  const events = [];
  const { CpkResultCopy } = load('src/components/CpkResultCopy.tsx', {
    react: state.react,
    '@/lib/analytics': { trackEvent: (...args) => events.push(args) },
  }, { navigator: { clipboard } });
  return { events, render() { state.reset(); return CpkResultCopy(props); } };
}
const button = tree => nodes(tree, node => node.type === 'button')[0];

async function main() {
  const props = { text: '計算方式: 全体標準偏差によるPp・Ppk\nPpk: 1.331', method: 'overall' };
  let finish;
  const writes = [];
  const success = mountCopy({ writeText(text) { writes.push(text); return new Promise(resolve => { finish = resolve; }); } }, props);
  const click = button(success.render()).props.onClick;
  const pending = click();
  await click();
  assert.deepEqual(writes, [props.text]);
  assert.equal(success.events.length, 0);
  assert.equal(button(success.render()).props.disabled, true);
  finish();
  await pending;
  assert.equal(button(success.render()).props.disabled, false);
  assert.match(nodes(success.render(), node => node.props?.role === 'status')[0].props.children, /コピーしました/);
  assert.equal(success.events[0][0], 'cpk_result_copied');
  assert.equal(JSON.stringify(success.events[0][1]), JSON.stringify({ method: 'overall' }));

  for (const clipboard of [undefined, {}, { writeText: async () => { throw new Error('denied'); } }]) {
    const failure = mountCopy(clipboard, props);
    await button(failure.render()).props.onClick();
    const tree = failure.render();
    assert.equal(failure.events.length, 0);
    assert.equal(button(tree).props.disabled, false);
    assert.match(nodes(tree, node => node.props?.role === 'status')[0].props.children, /手動でコピー/);
    const textarea = nodes(tree, node => node.type === 'textarea')[0];
    assert.equal(textarea.props.readOnly, true);
    assert.equal(textarea.props.value, props.text);
    let selected = false;
    textarea.props.onFocus({ currentTarget: { select() { selected = true; } } });
    assert.equal(selected, true);
  }

  // Exercise the actual calculator and copy payload for samples and both input modes.
  const state = hooks();
  const { CpkCalculator } = load('src/components/CpkCalculator.tsx', {
    react: state.react,
    '@/components/CapabilityHistogram': { CapabilityHistogram: 'Histogram' },
    '@/components/CpkResultCopy': { CpkResultCopy: 'ResultCopy' },
    '@/data/cpk-samples': load('src/data/cpk-samples.ts'),
    '@/lib/process-capability': load('src/lib/process-capability.ts'),
    '@/lib/analytics': { trackEvent() {} },
  });
  const render = () => { state.reset(); return CpkCalculator(); };
  const copy = () => nodes(render(), node => node.type === 'ResultCopy')[0];
  const sample = copy();
  assert.match(sample.props.text, /Ppk: 1\.331/);
  assert.equal(nodes(render(), node => node.type === 'details').flatMap(tree => nodes(tree, node => node.type === 'ResultCopy')).length, 0);
  const change = (id, value) => nodes(render(), node => node.props?.id === id)[0].props.onChange({ target: { value } });
  const press = label => nodes(render(), node => node.type === 'button' && node.props.children === label)[0].props.onClick();
  change('measurement-data', '8\n9\n10\n11\n12');
  change('lsl', '5');
  change('usl', '15');
  press('計算する');
  assert.match(copy().props.text, /Ppk: 1\.054/);
  assert.match(copy().props.text, /データ件数: 5/);
  assert.notEqual(copy().key, sample.key); // New content resets copy feedback via React key.
  press('平均・短期標準偏差');
  assert.equal(copy(), undefined);
  change('summary-mean', '10');
  change('summary-sd', '1');
  press('計算する');
  assert.match(copy().props.text, /Cpk: 1\.667/);
  assert.equal(copy().props.method, 'short-term');
  const summary = mountCopy({ writeText: async () => {} }, copy().props);
  await button(summary.render()).props.onClick();
  assert.equal(JSON.stringify(summary.events[0][1]), JSON.stringify({ method: 'short-term' }));
  change('summary-sd', '0');
  press('計算する');
  assert.equal(copy(), undefined);
  console.log('PASS: success, pending/double click, denied/unavailable clipboard, manual selection, anonymous event, visible placement, sample/raw/summary payloads, invalid input');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
