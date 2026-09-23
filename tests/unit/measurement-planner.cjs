const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), ts = require('typescript');
const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
function loader(overrides = {}, globals = {}) {
  const cache = new Map();
  function load(file) {
    const filename = [file, file + '.ts', file + '.tsx', path.join(file, 'index.ts')].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    if (!filename) throw Error(file);
    if (cache.has(filename)) return cache.get(filename);
    const exports = {}; cache.set(filename, exports);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const deps = { '@/lib/analytics': { trackEvent() {} }, 'next/link': { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) }, ...overrides };
    vm.runInNewContext(code, { exports, process, URL, require(id) {
      if (id in deps) return deps[id];
      if (id.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
      if (id.startsWith('@/')) return load('src/' + id.slice(2));
      if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id));
      return require(id);
    }, ...globals }, { filename });
    return exports;
  }
  return load;
}
const load = loader();
const data = load('src/data/measurement-planner');
const lib = load('src/lib/measurement-planner');
const sample = lib.calculateMeasurementPlan(data.measurementSample);
assert.equal(sample.plan.count, 62); assert.equal(sample.plan.totalSeconds, 1860);
assert.deepEqual(Array.from(sample.alternatives, x => x.plan.count), [246, 62, 16]);
assert.deepEqual(Array.from(sample.alternatives, x => x.plan.totalSeconds / 60), [123, 31, 8]);
assert.ok(sample.plan.halfWidth <= .5);
assert.ok(1.96 * 2 / Math.sqrt(61) > .5);
assert.equal(lib.planMean(1, 1.96).count, 1);
assert.equal(lib.planMean(1, 1.96 - 1e-10).count, 2);
assert.equal(lib.planMean(1000, 1.96).count, 1000000);
assert.throws(() => lib.planMean(1001, 1.96), /100万/);
for (const invalid of ['', ' ', '0', '-1', 'Infinity', 'NaN', '1e309', '0x10', 'abc']) {
  for (const key of ['sigma','precision']) assert.throws(() => lib.calculateMeasurementPlan({ ...data.measurementSample, [key]: invalid }));
}
for (const invalid of ['0','-1','Infinity','abc']) assert.throws(() => lib.calculateMeasurementPlan({ ...data.measurementSample, seconds: invalid }));
assert.equal(lib.calculateMeasurementPlan({ ...data.measurementSample, seconds: '' }).plan.totalSeconds, undefined);
assert.throws(() => lib.planMean(1e308, 1e-308));
assert.throws(() => lib.planMean(2, .5, 1e308));
for (const sigma of [.1, 1, 10]) for (const e of [.1, .5, 1]) {
  const p = lib.planMean(sigma, e);
  assert.ok(p.halfWidth <= e * (1 + 1e-14));
  assert.ok(lib.planMean(sigma * 2, e).count >= p.count);
  assert.ok(lib.planMean(sigma, e / 2).count >= p.count);
}
const partial = lib.calculateMeasurementPlan({ sigma: '1000', precision: '2', unit: '', seconds: '' });
assert.ok(partial.alternatives[0].error); assert.ok(partial.plan.count <= 1000000);
assert.match(lib.measurementCopy(sample), /62件/); assert.match(lib.measurementCopy(sample), /31分/);
assert.match(lib.measurementCopy(sample), /推定した標準偏差の不確かさ/);

function nodes(tree, predicate) { if (!tree || typeof tree !== 'object') return []; if (Array.isArray(tree)) return tree.flatMap(n => nodes(n,predicate)); return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children,predicate)]; }
async function ui(failCopy) {
  let cursor = 0, finish; const slots = [], events = [], copies = [];
  const react = { ...React, useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial; return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; }, useRef(initial) { const i=cursor++; return slots[i] ??= {current:initial}; }, useEffect() {} };
  const local = loader({ react, '@/lib/analytics': {trackEvent:(name,props)=>events.push({name,props})} }, { navigator:{clipboard:{writeText:text=>{copies.push(text); return new Promise((resolve,reject)=>{finish=()=>failCopy?reject(Error('blocked')):resolve();});}}} });
  const Component = local('src/components/MeasurementPlanner').MeasurementPlanner;
  const render=()=>{cursor=0;return Component();};
  const button=text=>nodes(render(),n=>n.type==='button'&&n.props.children===text)[0];
  const submit=()=>nodes(render(),n=>n.type==='form')[0].props.onSubmit({preventDefault(){}});
  assert.equal(events.length,0);render();assert.equal(events.length,0);
  const pending=button('計画をコピー').props.onClick(); finish(); await pending;
  assert.equal(copies.length,1);
  assert.equal(nodes(render(),n=>n.type==='textarea').length,failCopy?1:0);
  assert.equal(events.filter(e=>e.name==='measurement_plan_copied').length,failCopy?0:1);
  nodes(render(),n=>n.type==='input')[0].props.onChange({target:{value:'3'}});
  assert.equal(button('計画をコピー'),undefined);assert.equal(nodes(render(),n=>n.type==='textarea').length,0);
  submit(); assert.ok(button('計画をコピー'));
  nodes(render(),n=>n.type==='input')[0].props.onChange({target:{value:'0'}});submit();
  assert.equal(button('計画をコピー'),undefined);assert.equal(nodes(render(),n=>n.props?.role==='alert').length,1);
  button('架空例を試す').props.onClick(); assert.ok(button('計画をコピー'));
  const late=button('計画をコピー').props.onClick();
  nodes(render(),n=>n.type==='input')[0].props.onChange({target:{value:'4'}});
  finish();await late;assert.equal(nodes(render(),n=>n.type==='textarea').length,0);
  for(const e of events) assert.ok(Object.keys(e.props).every(key=>['tool_id','locale','ui_version','step','data_source'].includes(key)));
}
(async()=>{
  await ui(false);await ui(true);
  const page=load('src/app/(ja)/tools/measurement-planner/page');
  assert.equal(page.metadata.alternates.canonical,data.measurementPlanner.route);
  assert.equal(page.metadata.robots.index,true);
  const html=renderToStaticMarkup(React.createElement(page.default));
  for(const value of ['架空例','62','WebApplication','BreadcrumbList','NIST','100万件'])assert.ok(html.includes(value),value);
  const tools=load('src/data/learning-tools');assert.equal(tools.learningTools.filter(t=>t.id==='measurement-planner').length,1);assert.equal(tools.toolUsage['measurement-planner'].purpose,'input');
  const routes=load('src/app/sitemap').default();const route=routes.find(r=>r.url.endsWith(data.measurementPlanner.route));assert.ok(route?.lastModified);
  const nextSteps=load('src/components/PracticalToolNextSteps').PracticalToolNextSteps;
  for(const tool of ['cpk','process-comparison']){
    assert.ok(renderToStaticMarkup(React.createElement(nextSteps,{tool,locale:'ja'})).includes(data.measurementPlanner.route));
    assert.ok(!renderToStaticMarkup(React.createElement(nextSteps,{tool,locale:'en'})).includes(data.measurementPlanner.route));
  }
  console.log('PASS: measurement planning math, limits, alternatives, stale result/copy, clipboard fallback, privacy, Japanese routes, SSR and publication. Browser layout not covered.');
})().catch(e=>{console.error(e);process.exitCode=1;});
