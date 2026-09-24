const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const jsx = (type, props) => ({ type, props });
const controls = new Set(['Button', 'SelectionButton', 'Field', 'FieldMessage', 'InputField', 'TextareaField', 'SelectField', 'Notice']);
function nodes(tree, predicate) {
  while (typeof tree?.type === 'function' && controls.has(tree.type.name)) tree = tree.type(tree.props);
  if (Array.isArray(tree)) return tree.flatMap(n => nodes(n, predicate));
  if (!tree || typeof tree !== 'object') return [];
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
function mount(component, props) {
  const slots = [], events = [], prompts = [], cache = new Map(); let cursor = 0, answer = false;
  const react = {
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial; return [slots[i], next => { slots[i] = typeof next === 'function' ? next(slots[i]) : next; }]; },
    useRef(initial) { const i = cursor++; return slots[i] ??= { current: initial }; }, useEffect() {},
  };
  function load(file) {
    const filename = [file, file + '.ts', file + '.tsx'].find(f => fs.existsSync(f));
    if (cache.has(filename)) return cache.get(filename);
    const exports = {}; cache.set(filename, exports);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(code, { exports, requestAnimationFrame: fn => fn(), navigator: { clipboard: { writeText: async () => {} } }, window: { confirm(message) { prompts.push(message); return answer; } }, require(id) {
      if (id === 'react') return react;
      if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (id.endsWith('.css')) return { default: {} };
      if (id === '@/lib/analytics') return { trackEvent: (...args) => events.push(args) };
      if (id === '@/lib/observe-visible') return { observeVisibleOnce() {} };
      if (id === '@/components/ImprovementReportEditor') return { ImprovementReportEditor: 'Report', reportAction: action => events.push(['report', action]) };
      for (const [module, name] of [['ToolWorkspaceFile', 'Workspace'], ['PracticalToolNextSteps', 'Next'], ['CapabilityHistogram', 'Histogram'], ['CpkResultCopy', 'Copy']]) if (id === `@/components/${module}`) return { [module]: name };
      if (id === '@/lib/process-comparison-export') return { downloadComparisonPng: async () => {} };
      if (id.startsWith('@/')) return load('src/' + id.slice(2));
      if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id));
      throw Error(id);
    } }, { filename });
    return exports;
  }
  const Component = load(`src/components/${component}`)[component];
  const render = () => { cursor = 0; return Component(props); };
  const find = predicate => nodes(render(), predicate)[0];
  return { render, find, events, prompts, load, accept(value) { answer = value; }, press(label) { find(n => n.type === 'button' && n.props.children === label).props.onClick(); }, change(id, value) { find(n => n.props?.id === id).props.onChange({ target: { value } }); } };
}
async function main() {
  for (const locale of ['ja', 'en']) {
    const m = mount('CpkCalculator', { locale });
    const sample = locale === 'ja' ? '別のサンプルを試す' : 'Try another example';
    const custom = locale === 'ja' ? '自分のデータを入力' : 'Use your own data';
    const calculate = locale === 'ja' ? '計算する' : 'Calculate';
    m.press(sample); assert.equal(m.prompts.length, 0);
    m.change('lsl', '1'); m.press(calculate);
    const before = JSON.stringify(m.render()), count = m.events.length;
    m.press(sample);
    assert.equal(JSON.stringify(m.render()), before); assert.equal(m.events.length, count);
    assert.match(m.prompts[0], locale === 'ja' ? /測定入力/ : /measurement inputs/);
    m.find(n => n.props?.id === 'capability-sample').props.onChange({ target: { value: 'centered' } });
    assert.equal(JSON.stringify(m.render()), before, 'Dropdown cancellation preserves sample/result');
    m.press(custom); assert.equal(JSON.stringify(m.render()), before);
    m.accept(true); m.press(custom); const prompts = m.prompts.length;
    m.press(custom); assert.equal(m.prompts.length, prompts, 'Empty input needs no confirmation');
    m.change('measurement-data', 'NG'); m.accept(false); m.press(sample);
    assert.equal(m.find(n => n.props?.id === 'measurement-data').props.value, 'NG');
    const restored = { mode: 'raw', rawData: '8\n9\n10', mean: '', standardDeviation: '', lsl: '5', usl: '15' };
    const prior = m.prompts.length;
    m.find(n => n.type === 'Workspace').props.onRestore(restored);
    assert.equal(m.prompts.length, prior, 'Restore has its own confirmation, never a second one');
    m.press(custom); assert.equal(m.prompts.length, prior + 1);
    assert.equal(m.find(n => n.props?.id === 'measurement-data').props.value, restored.rawData);
    m.accept(true); m.press(sample); const confirmed = m.prompts.length;
    m.press(sample); assert.equal(m.prompts.length, confirmed, 'Untouched replacement sample is unprotected');
  }
  for (const locale of ['ja', 'en']) {
    const m = mount('ProcessComparisonTool', { locale });
    const sample = locale === 'ja' ? '架空データで試す' : 'Try sample data';
    // Read translated label from the same public dictionary, not hard-coded guesses.
    const t = m.load('src/data/practical-tool-text').getToolText(locale);
    m.press(t('架空データで試す')); assert.equal(m.prompts.length, 0);
    m.find(n => n.type === 'input').props.onChange({ target: { value: 'custom condition' } });
    m.find(n => n.type === 'form').props.onSubmit({ preventDefault() {} });
    await m.find(n => n.type === 'button' && n.props.children === t('表をコピー（Excel用）')).props.onClick();
    const before = JSON.stringify(m.render()), count = m.events.length;
    m.press(t('入力をクリア')); assert.equal(JSON.stringify(m.render()), before); assert.equal(m.events.length, count);
    m.press(t('架空データで試す')); assert.equal(JSON.stringify(m.render()), before);
    m.accept(true); m.press(t('入力をクリア')); const prompts = m.prompts.length;
    m.press(t('入力をクリア')); assert.equal(m.prompts.length, prompts);
    m.find(n => n.type === 'Workspace').props.onRestore({ ...m.load('src/data/process-comparison-sample').processComparisonSample });
    m.accept(false); m.press(t('入力をクリア')); assert.equal(m.prompts.length, prompts + 1);
  }
  const m = mount('ProcessComparisonTool', { reportMode: true });
  m.press('架空例で試す'); assert.equal(m.prompts.length, 0);
  const notes = { ...m.find(n => n.type === 'Report').props.notes, interpretation: 'Keep my report' };
  m.find(n => n.type === 'Report').props.onChange(notes);
  const before = JSON.stringify(m.render()), count = m.events.length;
  m.press('自分のデータで作る'); assert.equal(JSON.stringify(m.render()), before); assert.equal(m.events.length, count);
  assert.match(m.prompts[0], /測定入力と報告文/);
  m.press('架空例で試す'); assert.equal(JSON.stringify(m.render()), before);
  const prompts = m.prompts.length;
  m.press('入力をクリア'); assert.equal(m.prompts.length, prompts, 'Untouched measurements clear without asking about retained notes');
  assert.equal(m.find(n => n.type === 'Report').props.notes.interpretation, notes.interpretation);
  m.press('架空例で試す'); assert.equal(m.prompts.length, prompts + 1, 'Retained notes remain protected');
  m.accept(true); m.press('自分のデータで作る'); const confirmed = m.prompts.length;
  m.press('架空例で試す'); assert.equal(m.prompts.length, confirmed);
  const helper = m.load('src/lib/confirm-input-replacement');
  assert.equal(helper.wouldReplaceInput({ a: 'same' }, { a: 'same' }, { a: '' }, true), false);
  assert.equal(helper.wouldReplaceInput({ a: '  ' }, { a: 'sample' }, { a: '' }, true), false);
  console.log('PASS: bilingual replacement guards, cancel preserves state/events, edited/restored/empty/sample inputs, report text isolation, identical replacements.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
