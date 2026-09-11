const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

const filename = path.resolve(__dirname, '../../src/components/IndustryMapExplorer.tsx');
const source = fs.readFileSync(filename, 'utf8');
const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function find(node, predicate) {
  if (predicate(node)) return node;
  return ts.forEachChild(node, child => find(child, predicate));
}
const shell = find(ast, node => ts.isFunctionDeclaration(node) && node.name?.text === 'DetailPanelShell');
const close = find(ast, node => ts.isVariableDeclaration(node) && node.name.getText(ast) === 'closeDetail');
assert.ok(shell && close);
function evaluate(code, globals) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { exports, ...globals });
  return exports;
}
const focused = [];
const panel = { focus: options => focused.push(options) };
const effects = [];
const element = (type, props) => ({ type, props });
const { DetailPanelShell } = evaluate(`export ${shell.getText(ast)}`, {
  require: () => ({ jsx: element, jsxs: element }),
  useRef: () => ({ current: panel }),
  useEffect: fn => effects.push(fn),
});
const onClose = () => {};
const tree = DetailPanelShell({ children: 'Details', onClose });
assert.equal(tree.type, 'aside');
assert.equal(tree.props.tabIndex, -1);
assert.equal(tree.props.children[0].props.onClick, onClose);
effects.forEach(fn => fn());
assert.equal(focused.length, 1);
assert.equal(focused[0].preventScroll, true);

function closing({ connected = true, visible = true, view = 'map', fallback = true } = {}) {
  let state;
  let originFocus = 0;
  let fallbackFocus = 0;
  let selector;
  const { closeDetail } = evaluate(`export const closeDetail = ${close.initializer.arguments[0].getText(ast)};`, {
    view,
    setSelectedKey: value => { state = value; },
    selectionTriggerRef: { current: {
      isConnected: connected,
      getClientRects: () => visible ? [{}] : [],
      focus: () => { originFocus++; },
    } },
    viewportRef: { current: { parentElement: { querySelector(value) {
      selector = value;
      return fallback ? { focus: () => { fallbackFocus++; } } : null;
    } } } },
  });
  closeDetail();
  assert.equal(state, null);
  return { originFocus, fallbackFocus, selector };
}
assert.equal(closing().originFocus, 1);
const list = closing({ visible: false, view: 'list' });
assert.equal(list.originFocus, 0);
assert.equal(list.fallbackFocus, 1);
assert.ok(list.selector.includes('mobile-list'));
const map = closing({ connected: false });
assert.equal(map.fallbackFocus, 1);
assert.ok(map.selector.includes('__canvas'));
assert.equal(closing({ connected: false, fallback: false }).fallbackFocus, 0);
console.log('Industry map focus passed: detail focus, close callback, origin restoration, hidden/disconnected trigger fallback.');
