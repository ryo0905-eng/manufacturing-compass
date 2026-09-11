const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '../..');
const element = (type, props) => ({ type, props });
function load(relative, dependencies = {}) {
  const exports = {};
  const filename = path.join(root, relative);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require(name) {
      if (name === 'react/jsx-runtime') return { jsx: element, jsxs: element };
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      throw new Error(`Unexpected dependency: ${name}`);
    },
  }, { filename });
  return exports;
}
function find(tree, predicate) {
  if (!tree || typeof tree !== 'object') return undefined;
  if (Array.isArray(tree)) return tree.map(item => find(item, predicate)).find(Boolean);
  return predicate(tree) ? tree : find(tree.props?.children, predicate);
}
function mount(left, top) {
  const slots = [];
  let cursor = 0;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useMemo: fn => fn(),
    useCallback: fn => fn,
    useEffect() {},
  };
  const { IndustryMapExplorer } = load('src/components/IndustryMapExplorer.tsx', {
    react,
    'next/link': { default: 'a' },
    '@/data/industry-map': load('src/data/industry-map.ts'),
    '@/lib/analytics': { trackEvent() { throw new Error('Gestures must not send analytics'); } },
  });
  const target = { closest: () => null };
  const currentTarget = { setPointerCapture() {}, getBoundingClientRect: () => ({ left, top }) };
  function render() { cursor = 0; return IndustryMapExplorer({ companies: [], totalCompanyCount: 0 }); }
  return {
    send(handler, pointerId, x, y) {
      const viewport = find(render(), node => node.props?.role === 'region');
      viewport.props[handler]({ target, currentTarget, pointerId, clientX: left + x, clientY: top + y });
    },
    transform() {
      const canvas = find(render(), node => node.props?.className === 'industry-explorer__canvas');
      return canvas.props.style.transform.match(/-?\d+(?:\.\d+)?/g).slice(1).map(Number);
    },
  };
}
function close(actual, expected) { assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`); }
function pinch(left, top) {
  const map = mount(left, top);
  const [x, y, , scale] = map.transform();
  map.send('onPointerDown', 1, 100, 100);
  map.send('onPointerDown', 2, 200, 100);
  map.send('onPointerMove', 1, 50, 100);
  map.send('onPointerMove', 2, 250, 100);
  const [nextX, nextY, , nextScale] = map.transform();
  close((150 - nextX) / nextScale, (150 - x) / scale);
  close((100 - nextY) / nextScale, (100 - y) / scale);
  close(nextScale, 1.35);
  map.send('onPointerUp', 2, 250, 100);
  map.send('onPointerMove', 1, 70, 130);
  const [panX, panY] = map.transform();
  close(panX, nextX + 20);
  close(panY, nextY + 30);
  map.send('onPointerCancel', 1, 70, 130);
  const ended = map.transform();
  map.send('onPointerMove', 1, 500, 500);
  assert.deepEqual(map.transform(), ended);
  return ended;
}
assert.deepEqual(pinch(0, 0), pinch(14, 420));
const pan = mount(30, 600);
pan.send('onPointerDown', 1, 100, 100);
pan.send('onPointerMove', 1, 130, 140);
const [x, y] = pan.transform();
close(x, 46);
close(y, 50);
console.log('Industry map gestures passed: offset-independent pinch, fixed midpoint, scale limit, pan, pointer release/cancel.');
