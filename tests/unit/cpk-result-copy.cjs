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
      if (name === '@/components/ToolWorkspaceFile') return { ToolWorkspaceFile: 'WorkspaceFile' }; if (name === '@/components/PracticalToolNextSteps') return { PracticalToolNextSteps: 'NextSteps' }; if (name === '@/lib/use-practical-tool-journey') return load('src/lib/use-practical-tool-journey.ts', { ...dependencies, react: { ...dependencies.react, useEffect() {} }, '@/lib/observe-visible': { observeVisibleOnce() {} } }); if (name.endsWith('.css')) return { default: new Proxy({}, { get: (_, key) => String(key) }) };
      if (name === '@/components/ui/Controls') return load('src/components/ui/Controls.tsx');
      if (name === '@/data/cpk-text') return load('src/data/cpk-text.ts');
      if (name === 'react/jsx-runtime') return { jsx: element, jsxs: element };
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      throw new Error(`Unexpected dependency: ${name}`);
    },
    ...globals,
  }, { filename });
  return exports;
}
const controlNames = new Set(['Button', 'ButtonLink', 'SelectionButton', 'Field', 'FieldMessage', 'InputField', 'TextareaField', 'SelectField', 'Notice']);
function expandControl(tree) {
  while (typeof tree?.type === 'function' && controlNames.has(tree.type.name)) tree = tree.type(tree.props);
  return tree;
}
function nodes(tree, predicate) {
  tree = expandControl(tree);
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

  const math = load('src/lib/process-capability.ts');
  const parsed = input => JSON.parse(JSON.stringify(math.parseMeasurements(input)));
  assert.deepEqual(parsed('1\n2 3\t4,5，6;7；8\n\n8'), { values: [1,2,3,4,5,6,7,8,8], invalidCount: 0, invalidValues: [] });
  assert.deepEqual(parsed(''), { values: [], invalidCount: 0, invalidValues: [] });
  assert.deepEqual(parsed('heading\r\n1\r\n\r\nNG,2mm\r3\u2028bad\u2029Infinity'), {
    values: [1,3], invalidCount: 5, invalidValues: [{ line: 1, token: 'heading' }, { line: 4, token: 'NG' }, { line: 4, token: '2mm' }, { line: 6, token: 'bad' }, { line: 7, token: 'Infinity' }],
  });
  assert.deepEqual(parsed('-1 +2e1 .5').values, [-1,20,.5]);

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
  assert.equal(copy(), undefined, 'Editing measurements removes the old copy payload immediately');
  assert.equal(nodes(render(), node => node.type === 'Histogram').length, 0);
  assert.ok(JSON.stringify(render()).includes('入力が変更されました。再計算してください。'));
  change('lsl', '5');
  change('usl', '15');
  press('計算する');
  assert.match(copy().props.text, /Ppk: 1\.054/);
  assert.match(copy().props.text, /データ件数: 5/);
  assert.notEqual(copy().key, sample.key); // New content resets copy feedback via React key.
  for (const [id, value] of [['usl', '11'], ['lsl', '4']]) {
    change(id, value);
    assert.equal(copy(), undefined, `${id} invalidates the result before calculating`);
    assert.equal(nodes(render(), node => node.type === 'Histogram').length, 0);
    press('計算する');
    assert.match(copy().props.text, /Ppk: 0\.211/);
  }
  change('lsl', '5'); change('usl', '15'); press('計算する');
  let focused = 0;
  nodes(render(), node => node.type === 'textarea')[0].props.ref.current = { focus() { focused++; } };
  for (const token of ['NG', 'heading', '10mm']) {
    change('measurement-data', `8\n\n${token}\n9\n10`);
    assert.equal(copy(), undefined);
    const inputTree = render();
    const details = nodes(inputTree, node => node.props?.id === 'measurement-invalid')[0];
    assert.match(JSON.stringify(details), /3行目/);
    assert.match(JSON.stringify(details), /読み取れない値があるため計算できません/);
    press('計算する');
    assert.equal(copy(), undefined, 'Even a single unreadable value blocks calculation');
    assert.equal(nodes(render(), node => node.type === 'Histogram').length, 0);
  }
  assert.equal(focused, 3, 'Invalid calculation focuses the measurements field');
  const long = '誤'.repeat(41);
  change('measurement-data', `8\n${long}\na b c d e f\n9`);
  const details = nodes(render(), node => node.props?.id === 'measurement-invalid')[0];
  assert.equal(nodes(details, node => node.type === 'li').length, 5);
  assert.equal(nodes(details, node => node.type === 'code')[0].props.children, '誤'.repeat(40) + '…');
  assert.match(JSON.stringify(details), /ほか2件/);
  nodes(render(), node => node.type === 'WorkspaceFile')[0].props.onRestore({ mode: 'raw', rawData: '8\nNG\n9', mean: '', standardDeviation: '', lsl: '5', usl: '15' });
  assert.equal(nodes(render(), node => node.props?.id === 'measurement-data')[0].props.value, '8\nNG\n9');
  press('計算する'); assert.equal(copy(), undefined);
  change('measurement-data', '8\n9\n10\n11\n12');
  assert.equal(nodes(render(), node => node.props?.id === 'measurement-invalid').length, 0);
  press('計算する'); assert.match(copy().props.text, /Ppk: 1\.054/);
  // Unreadable raw input must not block the independent summary mode.
  change('measurement-data', '8\nNG\n9');
  press('平均・短期標準偏差');
  assert.equal(copy(), undefined);
  change('summary-mean', '10');
  change('summary-sd', '1');
  press('計算する');
  assert.match(copy().props.text, /Cpk: 1\.667/);
  assert.equal(copy().props.method, 'short-term');
  for (const [id, value] of [['summary-mean', '11'], ['summary-sd', '2']]) {
    change(id, value);
    assert.equal(copy(), undefined, `${id} invalidates the summary result`);
    press('計算する');
    assert.ok(copy());
  }
  const summary = mountCopy({ writeText: async () => {} }, copy().props);
  await button(summary.render()).props.onClick();
  assert.equal(JSON.stringify(summary.events[0][1]), JSON.stringify({ method: 'short-term' }));
  change('summary-sd', '0');
  press('計算する');
  assert.equal(copy(), undefined);
  const invalid = render();
  for (const id of ['summary-mean', 'summary-sd']) {
    const input = nodes(invalid, node => node.type === 'input' && node.props.id === id)[0];
    assert.equal(input.props['aria-invalid'], true);
    assert.equal(input.props['aria-describedby'], 'summary-message');
  }
  assert.equal(nodes(invalid, node => node.props?.id === 'summary-message')[0].props.role, 'alert');
  assert.equal(nodes(invalid, node => node.type === 'button' && node.props.children === '平均・短期標準偏差')[0].props['aria-pressed'], true);
  change('summary-sd', '1');
  assert.equal(nodes(render(), node => node.type === 'input' && node.props.id === 'summary-sd')[0].props['aria-invalid'], false);
  press('生データ');
  change('measurement-data', '1');
  press('計算する');
  const rawError = render();
  const rawInput = nodes(rawError, node => node.type === 'textarea')[0];
  assert.equal(rawInput.props['aria-invalid'], true);
  for (const id of rawInput.props['aria-describedby'].split(' ')) {
    assert.equal(nodes(rawError, node => node.props?.id === id).length, 1, `Description ${id} exists exactly once`);
  }
  press('別のサンプルを試す');
  assert.ok(copy(), 'Changing sample immediately restores its calculated copy payload');
  assert.equal(nodes(render(), node => node.type === 'Histogram').length, 1);
  assert.ok(!JSON.stringify(render()).includes('入力が変更されました。再計算してください。'));
  nodes(render(), node => node.type === 'WorkspaceFile')[0].props.onRestore({ mode: 'summary', rawData: '', mean: '10', standardDeviation: '1', lsl: '5', usl: '15' });
  assert.equal(copy(), undefined, 'Restoring removes the previous result and copy');
  assert.equal(nodes(render(), node => node.type === 'Histogram').length, 0);
  assert.equal(nodes(render(), node => node.props?.role === 'alert').length, 0);
  assert.equal(nodes(render(), node => node.props?.id === 'summary-mean')[0].props.value, '10');
  press('計算する');
  assert.ok(copy(), 'Restored inputs calculate only after explicit action');
  console.log('PASS: success, pending/double click, denied/unavailable clipboard, manual selection, anonymous event, visible placement, sample/raw/summary payloads, invalid input');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
