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
const load = moduleLoader();
const data = load(path.join(base, 'data/correlation-causation.ts'));
const model = load(path.join(base, 'lib/correlation-causation/model.ts'));
const analysis = load(path.join(base, 'lib/correlation-causation/analysis.ts'));
const state = load(path.join(base, 'lib/correlation-causation/session.ts'));
const plain = value => JSON.parse(JSON.stringify(value));
const near = (a,b) => assert.ok(Math.abs(a-b)<1e-10, `${a} != ${b}`);
const expectedCounts = { observation: [45,5,5,45], conventional: [18,2,2,18], randomized: [10,10,10,10] };
const expectedMeans = { observation: [9.6,20.4], conventional: [9.6,20.4], randomized: [16,14] };
const allIds = new Set();
for (const dataset of ['observation','conventional','randomized']) {
 const rows = model.generate(dataset);
 assert.deepEqual(plain(rows),plain(model.generate(dataset)));
 const cells = [[380,'A'],[380,'B'],[420,'A'],[420,'B']];
 assert.deepEqual(cells.map(([t,p])=>rows.filter(r=>r.temperature===t&&r.product===p).length),expectedCounts[dataset]);
 assert.equal(rows.length,dataset==='observation'?100:40);
 const baselines = {A:{380:8,420:6},B:{380:24,420:22}};
 for (const row of rows) {
  assert.ok(!allIds.has(row.id));allIds.add(row.id);
  assert.ok(row.rate>=baselines[row.product][row.temperature]-.8 && row.rate<=baselines[row.product][row.temperature]+.8);
  assert.equal(row.dataset,dataset);
 }
 assert.deepEqual(plain(rows.map(r=>r.order).sort((a,b)=>a-b)),Array.from({length:rows.length},(_,i)=>i+1));
 const zero = rows.map(r=>({...r,rate:baselines[r.product][r.temperature]}));
 const theoretical = analysis.summarize(zero);
 near(theoretical.groups[0].mean,expectedMeans[dataset][0]);near(theoretical.groups[1].mean,expectedMeans[dataset][1]);
 for (const product of ['A','B']) {near(analysis.summarize(zero,product).difference,-2);assert.ok(analysis.summarize(rows,product).difference<0);}
 const result=analysis.summarize(rows);
 assert.equal(result.difference>0,dataset!=='randomized');
 const snapshot=JSON.stringify(rows);
 for(const filter of ['all','A','B']) {
  const s=analysis.summarize(rows,filter);
  const reference=rows.filter(r=>filter==='all'||r.product===filter);
  for (const g of s.groups) { const selected=reference.filter(r=>r.temperature===g.temperature);near(g.mean,selected.reduce((a,r)=>a+r.rate,0)/selected.length);assert.equal(g.a+g.b,g.count); }
 }
 assert.equal(JSON.stringify(rows),snapshot);
}
// Balanced assignment shuffles lot identity, and execution order is a permutation.
const randomized=model.generate('randomized');
assert.ok(randomized.some(r=>Number(r.id.split(':')[2])>10&&r.temperature===380));
assert.ok(randomized.some(r=>Number(r.id.split(':')[2])<=10&&r.temperature===420));
const observation=model.generate('observation');
for(const bad of [[],[...observation,observation[0]],observation.map((r,i)=>i? r:{...r,rate:NaN}),observation.map((r,i)=>i?r:{...r,rate:Infinity}),observation.filter(r=>r.temperature===380),[...observation,...randomized]])assert.throws(()=>analysis.summarize(bad));
for (const order of [['conventional','randomized'],['randomized','conventional']]) {
 let s=state.createSession();
 assert.equal(state.transition(s,{type:'navigate',stage:4}),s);
 s=state.transition(s,{type:'start',hypothesis:2});s=state.transition(s,{type:'navigate',stage:2});
 s=state.transition(s,{type:'experiment',method:order[0]});
 assert.equal(s.stage,3);const first=s.experiments[order[0]];
 assert.equal(state.transition(s,{type:'experiment',method:order[0]}),s);
 s=state.transition(s,{type:'navigate',stage:0});assert.equal(s.hypothesis,2);assert.equal(s.experiments[order[0]],first);
 s=state.transition(s,{type:'navigate',stage:3});s=state.transition(s,{type:'experiment',method:order[1]});assert.equal(s.stage,4);
 s=state.transition(s,{type:'reflect',answer:1});assert.equal(s.reflection,1);
 assert.equal(state.transition(s,{type:'reflect',answer:0}),s);
 for(const method of order)assert.deepEqual(plain(s.experiments[method]),plain(model.generate(method)));
}
let broken=state.transition(state.transition(state.createSession(),{type:'start',hypothesis:0}),{type:'navigate',stage:2});
broken=state.transition(broken,{type:'experiment',method:'conventional'});
const retained=broken.experiments.conventional;
broken=state.transition(broken,{type:'experiment',method:'randomized'},()=>[]);
assert.ok(broken.error);assert.equal(broken.experiments.conventional,retained);assert.equal(state.transition(broken,{type:'navigate',stage:0}),broken);
assert.ok(!fs.readFileSync('src/lib/correlation-causation/analysis.ts','utf8').includes('baseRates'));
console.log('correlation-causation: numeric references, reversal, allocation, identity randomization, independent datasets, deterministic generation, state guards and failure passed');
