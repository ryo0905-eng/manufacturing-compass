const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { performance } = require('node:perf_hooks');
const root = path.resolve('src/lib/bayesian-optimization');
function loader(overrides = {}) {
  const cache = new Map();
  function load(name) {
    const file = path.resolve(root, name.endsWith('.ts') ? name : `${name}.ts`);
    if (overrides[path.basename(file)]) return overrides[path.basename(file)];
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    vm.runInNewContext(code, { exports, require: id => { assert.ok(id.startsWith('./')); return load(id); } }, { filename: file });
    cache.set(file, exports);
    return exports;
  }
  return load;
}
const load = loader();
const model = load('model'), simulator = load('simulator'), types = load('types'), session = load('session'), random = load('random');
const near = (a, b, tolerance = 1e-8) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
const plain = value => JSON.parse(JSON.stringify(value));
const point = { temperature: 425, pressure: 76 };
const obs = (p, value, run = 1) => ({ ...p, value, run, method: 'manual' });

// Independent reference: Gauss-Jordan inverse, independent kernel expression.
function reference(observations, prior, p) {
  const covariance = (a, b) => {
    const d = Math.sqrt(((a.temperature - b.temperature) / 60) ** 2 + ((a.pressure - b.pressure) / 24) ** 2);
    return 2.25 * (1 + Math.sqrt(5) * d + 5 * d * d / 3) * Math.exp(-Math.sqrt(5) * d);
  };
  const n = observations.length;
  const a = observations.map((x, i) => [...observations.map((y, j) => covariance(x, y) + (i === j ? .01 + 1e-10 : 0)), ...Array.from({ length: n }, (_, j) => +(i === j))]);
  for (let k = 0; k < n; k++) {
    const scale = a[k][k]; a[k] = a[k].map(v => v / scale);
    for (let i = 0; i < n; i++) if (i !== k) { const factor = a[i][k]; a[i] = a[i].map((v, j) => v - factor * a[k][j]); }
  }
  const k = observations.map(x => covariance(x, p));
  let mean = prior, variance = 2.25;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    mean += k[i] * a[i][n + j] * (observations[j].value - prior);
    variance -= k[i] * a[i][n + j] * k[j];
  }
  return { mean, variance };
}
for (const observations of [
  [obs(point, 3)],
  [obs(point, 3), obs(point, 3.1, 2)],
  [obs({ temperature: 300, pressure: 20 }, 5), obs({ temperature: 305, pressure: 22 }, 5), obs({ temperature: 500, pressure: 100 }, 5)],
]) {
  const predict = model.fitModel(observations, 4);
  for (const p of [point, ...types.candidates.filter((_, i) => i % 113 === 0)]) {
    const actual = predict(p), expected = reference(observations, 4, p);
    near(actual.mean, expected.mean); near(actual.sd ** 2, expected.variance);
    near(actual.lcb, actual.mean - 2 * actual.sd);
  }
}
assert.throws(() => model.fitModel([obs(point, NaN)], 3));
assert.throws(() => model.fitModel([obs({ temperature: 301, pressure: 20 }, 3)], 3));
const uncertain = model.fitModel([obs(point, 3)], 4)(point).sd;
assert.ok(model.fitModel([obs(point, 3), obs(point, 3.2, 2)], 4)(point).sd < uncertain);
near(model.fitModel([obs(point, 300)], 4)(point).sd, uncertain);
assert.equal(types.candidates.length, 1681);
assert.equal(new Set(simulator.doePlan(42).map(types.conditionKey)).size, 5);
assert.deepEqual(plain(simulator.doePlan(42)), plain(simulator.doePlan(42)));
assert.notDeepEqual(plain(simulator.doePlan(42)), plain(simulator.doePlan(43)));

function initial(seed, p = point) {
  let s = session.createSession(seed);
  s = session.runExperiment(s, p, 'manual');
  assert.equal(s.observations.length, 1); assert.equal(s.analysis, null);
  s = session.runExperiment(s, p, 'doe');
  assert.equal(s.observations.length, 6);
  return s;
}
let s = initial(types.DEFAULT_SEED);
const frozenMean = s.priorMean;
assert.throws(() => session.runExperiment(s, point, 'bo'));
assert.throws(() => simulator.reveal(s.observations));
// Changing the hidden response cannot affect a model fed identical observations.
const altered = loader({ 'simulator.ts': { ...simulator, trueResponse: () => 999, measure: () => ({ value: 999, noiseState: 0 }) } })('model');
assert.deepEqual(plain(altered.analyze(s.observations, s.priorMean)), plain(s.analysis));
const imports = fs.readFileSync(path.join(root, 'model.ts'), 'utf8').match(/from\s+["']([^"']+)/g);
assert.deepEqual(imports, ['from "./types']);
s = session.runExperiment(s, point, 'manual');
for (let i = 0; i < 4; i++) {
  const available = s.analysis.surface.filter(p => !s.observations.some(o => types.conditionKey(o) === types.conditionKey(p)));
  near(s.analysis.recommendation.lcb, Math.min(...available.map(p => p.mean - 2 * p.sd)));
  s = session.runExperiment(s, point, 'bo');
}
assert.equal(s.observations.length, 11);
const target = s.analysis.confirmation;
assert.ok(s.observations.some(o => types.conditionKey(o) === types.conditionKey(target)));
const predictedBeforeConfirmation = target.mean;
s = session.runExperiment(s, point, 'confirmation');
assert.equal(s.observations.length, 12); assert.equal(s.priorMean, frozenMean);
assert.equal(types.conditionKey(s.observations[11]), types.conditionKey(target));
assert.equal(session.runExperiment(s, point, 'manual'), s);
assert.deepEqual(plain(s.observations.map(o => o.run)), Array.from({ length: 12 }, (_, i) => i + 1));
assert.ok(s.observations.every(o => !('truth' in o) && !('mean' in o)));
const answer = simulator.reveal(s.observations);
near(answer.best.value, Math.min(...answer.surface.map(p => p.value)));
s.observations.forEach((o, i) => near(answer.values[i], simulator.trueResponse(o)));
let duplicate = initial(42, { temperature: 400, pressure: 60 });
assert.equal(duplicate.observations.filter(o => o.temperature === 400 && o.pressure === 60).length, 2);
const failed = session.runExperiment(duplicate, point, 'manual', () => { throw Error('injected'); });
assert.equal(failed.observations.length, 7); assert.equal(failed.analysis, null); assert.equal(failed.error, true);
assert.equal(session.runExperiment(failed, point, 'manual'), failed);

// Paired development evaluation, not a claim of universal superiority.
const evaluation = [], durations = [];
for (let seed = 1; seed <= 30; seed++) {
  const base = initial(seed);
  let bo = base, baseline = base, state = seed ^ 0xbeef;
  const draw = random.uniform(state); state = draw.state;
  const sharedManual = types.candidates[Math.floor(draw.value * types.candidates.length)];
  bo = session.runExperiment(bo, sharedManual, 'manual');
  baseline = session.runExperiment(baseline, sharedManual, 'manual');
  for (let i = 0; i < 4; i++) {
    const start = performance.now(); bo = session.runExperiment(bo, point, 'bo'); durations.push(performance.now() - start);
    const available = types.candidates.filter(p => !baseline.observations.some(o => types.conditionKey(o) === types.conditionKey(p)));
    const r = random.uniform(state); state = r.state;
    baseline = session.runExperiment(baseline, available[Math.floor(r.value * available.length)], 'manual');
  }
  const confirmationForBo = bo.analysis.confirmation;
  const confirmationForRandom = baseline.analysis.confirmation;
  bo = session.runExperiment(bo, point, 'confirmation');
  baseline = session.runExperiment(baseline, point, 'confirmation');
  assert.equal(bo.noiseState, baseline.noiseState);
  assert.ok(!bo.error && !baseline.error);
  const initialBest = Math.min(...base.observations.map(simulator.trueResponse));
  evaluation.push({ initialBest, bo: Math.min(...bo.observations.map(simulator.trueResponse)), random: Math.min(...baseline.observations.map(simulator.trueResponse)), boFinal: simulator.trueResponse(confirmationForBo), randomFinal: simulator.trueResponse(confirmationForRandom) });
  const replay = initial(seed);
  assert.deepEqual(plain(replay), plain(base));
}
const avg = key => evaluation.reduce((sum, row) => sum + row[key], 0) / evaluation.length;
durations.sort((a, b) => a - b);
console.log(JSON.stringify({ tests: 'GP reference, variance, recommendation, isolation, seeded replay, budget, duplicates, failure and reveal passed', seeds: evaluation.length, meanTrueBest: { initial: avg('initialBest'), bo: avg('bo'), random: avg('random') }, meanFinalCandidate: { bo: avg('boFinal'), random: avg('randomFinal') }, boBetter: evaluation.filter(r => r.bo < r.random).length, updateMs: { median: durations[Math.floor(durations.length / 2)], p95: durations[Math.floor(durations.length * .95)] }, exampleConfirmationPrediction: predictedBeforeConfirmation }, null, 2));
