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
const types = load(path.join(base, 'lib/taguchi/types.ts'));
const lib = load(path.join(base, 'lib/taguchi/analysis.ts'));
const sim = load(path.join(base, 'lib/taguchi/simulator.ts'));
const state = load(path.join(base, 'lib/taguchi/session.ts'));
const plain = value => JSON.parse(JSON.stringify(value));
const near = (a, b, tolerance = 1e-10) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
assert.equal(types.conditions.length, 9);
assert.equal(new Set(types.conditions.map(c => `${c.a}:${c.b}`)).size, 9);
for (const axis of ['a','b']) for (const level of [-1,0,1]) assert.equal(types.conditions.filter(c => c[axis] === level).length, 3);
const stats = lib.statistics([1,2,3,4,5,6]);
near(stats.sn, -10*Math.log10(91/6)); near(stats.mean, 3.5); near(stats.sd, Math.sqrt(3.5));
near(lib.statistics([2,2,2]).sn, -20*Math.log10(2)); assert.equal(lib.statistics([2,2,2]).sd, 0);
for (const values of [[],[0,0],[NaN],[Infinity],[-1]]) assert.throws(() => lib.statistics(values));
assert.ok(lib.statistics([0,1]).sn > 0);
function go(baseline='c1',candidate='c5',seed=types.SEED) {
 let s=state.createSession(seed);
 const sizes=[9,15,63,81];
 const commands=[{type:'nominal'},{type:'baseline',conditionId:baseline},{type:'remaining'},{type:'confirm',conditionId:candidate}];
 for(let i=0;i<commands.length;i++) {
  const before=s; s=state.advance(s,commands[i]);
  assert.equal(s.observations.length,sizes[i]); assert.equal(s.error,false);
  assert.equal(state.advance(s,commands[i]),s); // no duplicate batch
  assert.equal(before.observations.length,i? sizes[i-1]:0);
 }
 return s;
}
const done=go();
assert.equal(done.baseline,'c1');assert.equal(done.candidate,'c5');assert.ok(done.result.delta>0);
assert.equal(done.analysis.best.conditionId,'c5');
assert.deepEqual(plain(done),plain(go()));
assert.deepEqual(plain(done.observations.map(o=>o.order)),Array.from({length:81},(_,i)=>i+1));
assert.equal(new Set(done.observations.map(o=>o.id)).size,81);
assert.ok(done.observations.every(o=>!('truth' in o)));
const stress=done.observations.filter(o=>o.phase==='stress');
for(const c of types.conditions) {
 const rows=stress.filter(o=>o.conditionId===c.id);
 assert.equal(rows.length,6);
 for(const z of types.levels) assert.equal(rows.filter(o=>o.noise===z).length,2);
 const reference=-10*Math.log10(rows.reduce((s,o)=>s+o.value*o.value,0)/6);
 near(done.analysis.results.find(r=>r.conditionId===c.id).sn,reference);
 for(const z of types.levels) { const f=sim.response(c.id,z); assert.ok(f>0); }
}
const corruptedNominal=done.observations.map(o=>o.phase==='nominal'? {...o,value:100000}:o);
assert.deepEqual(plain(lib.analyze(corruptedNominal)),plain(done.analysis));
assert.throws(()=>lib.analyze(stress.slice(1)));
assert.throws(()=>lib.balanced([...stress.slice(0,5),stress[0]],2));
const split=sim.runBatch(stress.slice(0,21),types.SEED,0).concat(sim.runBatch(stress.slice(21),types.SEED,21));
for(const o of split) near(o.value,stress.find(r=>r.id===o.id).value);
const otherBaseline=go('c9','c5');
for(const o of otherBaseline.observations.filter(o=>o.phase==='stress')) near(o.value,stress.find(r=>r.id===o.id).value);
const confirmation=done.observations.filter(o=>o.phase==='confirmation');
assert.equal(confirmation.length,18);
for(const arm of ['baseline','candidate']) {
 const rows=confirmation.filter(o=>o.arm===arm); assert.equal(rows.length,9);
 for(const z of types.levels) assert.equal(rows.filter(o=>o.noise===z).length,3);
}
const same=go('c1','c1'); assert.equal(same.observations.length,81);
const a=same.observations.filter(o=>o.arm==='baseline'),b=same.observations.filter(o=>o.arm==='candidate');
assert.ok(a.every(o=>!b.some(p=>p.id===o.id)));assert.notDeepEqual(a.map(o=>o.value),b.map(o=>o.value));
const imports=fs.readFileSync('src/lib/taguchi/analysis.ts','utf8').match(/from\s+['"]([^'"]+)/g);
assert.deepEqual(imports,["from './types"]);
const alternate=moduleLoader({'./simulator':{response:()=>999}})(path.join(base,'lib/taguchi/analysis.ts'));
assert.deepEqual(plain(alternate.analyze(done.observations)),plain(done.analysis));
let failed=state.createSession();failed=state.advance(failed,{type:'nominal'});failed=state.advance(failed,{type:'baseline',conditionId:'c1'});
failed=state.advance(failed,{type:'remaining'},()=>{throw Error('injected');});
assert.equal(failed.observations.length,63);assert.equal(failed.analysis,null);assert.equal(failed.error,true);
assert.equal(state.advance(failed,{type:'confirm',conditionId:'c5'}),failed);
for(let seed=1;seed<=10;seed++) for(const baseline of types.conditions) {
 const s=go(baseline.id,'c5',seed);assert.ok(s.observations.every(o=>o.value>0&&Number.isFinite(o.value)));
}
console.log('taguchi: L9 balance, independent SN reference, 81-run budget, phase isolation, seeded replay, batch invariance, confirmation independence and failure passed');
