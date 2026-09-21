const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(file) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText;
  vm.runInNewContext(code, { exports, require: name => { if (name === '@/data/practical-tool-text') return load(path.resolve(__dirname, '../../src/data/practical-tool-text.ts')); throw Error(name); } }, { filename: file });
  return exports;
}

const line = load(path.resolve(__dirname, '../../src/lib/line-balance.ts'));
const oee = load(path.resolve(__dirname, '../../src/lib/oee.ts'));

const stations = [{ id: 's1', name: '工程1' }, { id: 's2', name: '工程2' }, { id: 's3', name: '工程3' }];
const tasks = [{ id: 't1', name: 'A', seconds: 40, stationId: 's1' }, { id: 't2', name: 'B', seconds: 50, stationId: 's2' }, { id: 't3', name: '移動作業', seconds: 15, stationId: 's2' }, { id: 't4', name: 'C', seconds: 35, stationId: 's3' }];
const before = line.analyzeLineBalance(50, stations, tasks);
assert.deepEqual(JSON.parse(JSON.stringify(before.stationTotals)), { s1: 40, s2: 65, s3: 35 });
assert.equal(before.totalExcessSeconds, 15);
assert.equal(before.totalWorkSeconds, 140);
const after = line.analyzeLineBalance(50, stations, tasks.map(task => task.id === 't3' ? { ...task, stationId: 's3' } : task));
assert.deepEqual(JSON.parse(JSON.stringify(after.stationTotals)), { s1: 40, s2: 50, s3: 50 });
assert.equal(after.totalExcessSeconds, 0);
assert.equal(after.totalWorkSeconds, 140);
assert.ok(line.validateLineBalance(0, stations, tasks).length > 0);
assert.ok(line.validateLineBalance(50, stations, [{ ...tasks[0], seconds: -1 }]).length > 0);

const currentInput = { loadingMinutes: 480, downtimeMinutes: 60, idealCycleSeconds: 30, totalCount: 700, defectCount: 35 };
assert.deepEqual(JSON.parse(JSON.stringify(oee.validateOeeInputs(currentInput))), []);
const current = oee.calculateOee(currentInput);
assert.equal(current.runtimeMinutes, 420);
assert.equal(current.availability, .875);
assert.ok(Math.abs(current.performance - 5 / 6) < 1e-12);
assert.equal(current.quality, .95);
assert.ok(Math.abs(current.oee - .6927083333333333) < 1e-12);
assert.equal(current.goodCount, 665);
const improved = oee.calculateOeeScenario(currentInput, { downtimeMinutes: 30, performanceRate: 5 / 6, qualityRate: .95 });
assert.equal(improved.estimatedTotalCount, 750);
assert.equal(improved.estimatedGoodCount, 712.5);
assert.equal(improved.estimatedGoodCount - current.goodCount, 47.5);
assert.ok(oee.validateOeeInputs({ ...currentInput, downtimeMinutes: 481 }).some(error => error.includes('負荷時間より短く')));
assert.ok(oee.validateOeeInputs({ ...currentInput, defectCount: 701 }).some(error => error.includes('総生産数以下')));
assert.ok(oee.validateOeeScenario(currentInput, { downtimeMinutes: 30, performanceRate: 1.01, qualityRate: .95 }).some(error => error.includes('性能稼働率')));
assert.ok(oee.validateOeeInputs({ ...currentInput, totalCount: 0 }).some(error => error.includes('総生産数')));

console.log('PASS: line balance examples, OEE examples, and invalid input checks');
