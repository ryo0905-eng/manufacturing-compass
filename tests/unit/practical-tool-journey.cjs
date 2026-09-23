const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function mount(tool, initialSource, failAnalytics = false) {
  const refs = [], effects = [], events = [], observers = new Map();
  let cursor = 0;
  const react = {
    useRef(initial) { const i = cursor++; return refs[i] ??= { current: initial }; },
    useEffect(fn, deps) {
      const i = cursor++, old = effects[i];
      if (!old || deps.some((value, j) => !Object.is(value, old.deps[j]))) {
        old?.cleanup?.(); effects[i] = { deps, pending: fn };
      }
    },
  };
  const exports = {};
  const dependencies = {
    react,
    '@/lib/analytics': { trackEvent(name, props) { if (failAnalytics) throw Error('Unavailable'); events.push({ name, props }); } },
    '@/lib/observe-visible': { observeVisibleOnce(target, callback) {
      observers.set(target, () => { observers.delete(target); callback(); });
      return () => observers.delete(target);
    } },
  };
  const code = ts.transpileModule(fs.readFileSync('src/lib/use-practical-tool-journey.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(code, { exports, require: name => dependencies[name] });
  const input = {}, output = {};
  return {
    events, observers, input, output,
    render(result) {
      cursor = 0;
      const journey = exports.usePracticalToolJourney(tool, 'en', result, initialSource);
      journey.inputRef.current = input;
      journey.resultRef.current = result ? output : null;
      for (const effect of effects) if (effect?.pending) { effect.cleanup = effect.pending(); delete effect.pending; }
      return journey;
    },
  };
}

for (const tool of ['cpk', 'process-comparison', 'measurement-planner', 'improvement-report']) {
  const mounted = mount(tool, tool !== 'process-comparison' ? 'sample' : 'custom');
  const { events, observers, input, output } = mounted;
  let journey = mounted.render(tool !== 'process-comparison' ? { initialSample: true } : null);
  assert.equal(events.length, 0, 'Mount is not exposure, start or success');
  assert.equal(observers.has(output), false, 'Initial sample is not an operated result');
  observers.get(input)();
  journey.clear(); mounted.render(null);
  assert.equal(events.length, 1, 'Clear alone is not start');
  journey.start(); journey.start(); journey.calculate(); journey.error(); journey.error();
  mounted.render(null);
  assert.equal(observers.has(output), false, 'Invalid input cannot reach result');
  const value = { privateMeasurement: 123 };
  journey = mounted.render(value);
  assert.equal(events.some(e => e.props.step === 'result'), false, 'Offscreen result is not success');
  journey.start(); mounted.render(null);
  assert.equal(observers.has(output), false, 'Editing cancels pending result exposure');
  journey.sample(); journey = mounted.render({ sample: true });
  observers.get(output)();
  journey.sample(); journey.calculate(); mounted.render({ another: true });
  for (const step of ['start', 'sample', 'calculate', 'error', 'result']) {
    assert.equal(events.filter(e => e.props.step === step).length, 1, `${step} once per mount`);
  }
  assert.equal(events.find(e => e.props.step === 'result').props.data_source, 'sample');
  for (const event of events) {
    assert.equal(event.props.tool_id, tool);
    assert.equal(event.props.locale, 'en');
    assert.equal(event.props.ui_version, 'practical-v1');
    assert.ok(Object.keys(event.props).every(key => ['tool_id', 'locale', 'ui_version', 'surface', 'step', 'data_source'].includes(key)));
  }
  assert.ok(!JSON.stringify(events).includes('123'));
}
const unavailable = mount('cpk', 'sample', true);
const journey = unavailable.render(null);
assert.doesNotThrow(() => { journey.sample(); journey.calculate(); journey.error(); });
console.log('Practical tool journey: initial sample exclusion, exposure, invalid input, cancellation, deduplication and private-data exclusion passed (mock observers).');
