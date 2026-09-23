const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const cache = new Map();
function load(file) {
  if (!path.extname(file)) file += fs.existsSync(file+'.tsx') ? '.tsx' : '.ts';
  if (cache.has(file)) return cache.get(file);
  const exports = {}; cache.set(file,exports);
  const code = ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  vm.runInNewContext(code,{exports,require:id => id.startsWith('.') ? load(path.resolve(path.dirname(file),id)) : require(id)});
  return exports;
}
const {raceData,frameState} = load(path.resolve(__dirname,'../src/compositions/NvidiaIntelShort.tsx'));
assert.equal(raceData.length,16);
assert.equal(raceData.find(row => row.nvidia > row.intel).year,2020);
for(let i=0;i<16;i++) {
  const state=frameState(120+i*60);
  assert.equal(state.nvidia,raceData[i].nvidia);
  assert.equal(state.intel,raceData[i].intel);
  assert.equal(state.fraction,0);
}
for(let f=0;f<1260;f++) {
  const s=frameState(f);
  assert.ok(Number.isFinite(s.nvidia)&&s.nvidia>0&&s.intel>0);
  assert.ok(s.position>=0&&s.position<=1);
  if(f)assert.ok(Math.abs(s.position-frameState(f-1).position)<.12);
}
assert.equal(frameState(1259).from.year,2025);
assert.equal(frameState(1259).position,0);
console.log('Video: 16 source-year endpoints, 2020 crossover, 1260 finite frames and smooth rank swap passed.');
