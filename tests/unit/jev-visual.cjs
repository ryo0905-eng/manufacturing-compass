const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const root = path.resolve(__dirname, "../..");
function load(file, dependencies = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, { ...globals, exports, require(name) {
    if (Object.hasOwn(dependencies, name)) return dependencies[name];
    if (name === "react" || name === "react/jsx-runtime") return require(name);
    throw Error(name);
  } });
  return exports;
}
const data = load("src/data/jev-demo.ts");
const visual = load("src/data/jev-visual.ts");
assert.deepEqual(Object.keys(visual.routeArea).sort(), Object.keys(data.jevRoutes).sort());
for (const id of Object.keys(data.jevRoutes)) assert.ok(visual.factoryAreas.some(a => a.id === visual.routeArea[id]));
for (const sample of data.jevSamples) {
  const item = visual.visualCases[sample.id];
  assert.equal(item.branches.map(b => b.id).join(), sample.evidence.map(e => e.id).join());
  for (const id of [null, ...sample.evidence.map(e => e.id)]) {
    const scene = visual.getVisualScene(sample.id, id);
    assert.ok(scene.title && scene.note);
    for (const area of visual.factoryAreas) assert.ok(scene.stations[area.id].length);
  }
  assert.equal(visual.getVisualScene(sample.id, "invalid"), item.initial);
}
const { JevFactoryExperience } = load("src/components/JevFactoryExperience.tsx", {
  "@/data/jev-demo": data, "@/data/jev-visual": visual,
  "@/app/labs/jev/jev.module.css": { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) },
});
const keys = Object.keys(data.jevRoutes);
const distribution = (route, high = .84) => Object.fromEntries(keys.map(id => [id, id === route ? high : (1 - high) / 8]));
const fixture = (route, probabilities = distribution(route)) => ({
  elapsedMs: 10, inputTokens: 100, model: "fixture", questionVersion: "fixture", measuredAt: "2026-09-20",
  decisions: {
    route: { choice: route, probabilities, confidence: .8 },
    change: { choice: "material", probabilities: Object.fromEntries(Object.keys(data.jevCategories).map(k => [k, .2])), confidence: .5 },
    comparison: { probability: .5 },
    completeness: { score: 2, confidence: .5, probabilities: { 0: 0, 1: 0, 2: 1, 3: 0, 4: 0 } },
  },
});
const base = { sampleId: "batch", enabled: true, evidenceId: null, pending: false, started: false, error: "", chooseEvidence() {}, start() {}, retry() {} };
const render = props => renderToStaticMarkup(React.createElement(JevFactoryExperience, { ...base, ...props }));
assert.equal(visual.formatProbability(0), "0.0％");
assert.equal(visual.formatProbability(.000001), "0.1％未満");
assert.equal(visual.formatProbability(.001), "0.1％");
assert.equal(visual.formatProbability(1), "100.0％");
assert.equal(visual.formatProbabilityDelta(.84, .02), "−82.0pt");
assert.equal(visual.formatProbabilityDelta(.02, .84), "+82.0pt");
assert.equal(visual.formatProbabilityDelta(.02, .02000001), "±0.0pt");
for (const sample of data.jevSamples) {
  for (const id of [null, ...sample.evidence.map(e => e.id)]) {
    const html = render({ sampleId: sample.id, evidenceId: id });
    assert.ok(html.includes(visual.getVisualScene(sample.id, id).title));
    assert.equal((html.match(/<svg/g) || []).length, 4);
    assert.equal((html.match(/data-route=/g) || []).length, 9);
    assert.ok(!html.includes("<table"));
    assert.ok(!html.includes("次は「"));
    assert.ok(html.includes("開始する"));
    assert.ok(!html.includes("84.0％"));
  }
}
for (const values of [distribution("material"), distribution("metrology"), Object.fromEntries(keys.map(k => [k, 1 / 9])), { ...distribution("material", .5), metrology: .5, ...Object.fromEntries(keys.filter(k => !["material", "metrology"].includes(k)).map(k => [k, 0])) }]) {
  const html = render({ started: true, evidenceId: "same-specimen", initial: fixture("material"), selected: fixture("metrology", values) });
  let position = -1;
  for (const key of keys) {
    const next = html.indexOf('data-route="' + key + '"');
    assert.ok(next > position, "fixed order even when ranks reverse, tie or disperse");
    position = next;
    assert.ok(html.includes('width:' + values[key] * 100 + '%'), "raw width without normalization");
    assert.ok(html.includes(visual.formatProbability(values[key])));
  }
  assert.equal((html.match(/class="baseline"/g) || []).length, 9);
  assert.ok(!html.includes("開始する"));
}
let html = render({ started: true, evidenceId: "same-specimen", initial: fixture("material"), pending: true });
assert.ok(html.includes("更新中・初報の結果"));
assert.ok(!html.includes('class="baseline"'));
html = render({ started: true, evidenceId: "same-specimen", initial: fixture("material"), error: "通信テスト失敗" });
assert.ok(html.includes('role="alert"') && html.includes("再試行") && html.includes("更新失敗・初報の結果"));
assert.ok(render({ enabled: false }).includes('disabled=""'));

// Hook harness exercises the real controller without a browser or external calls.
async function controllerTests() {
  const slots = [];
  let cursor = 0;
  const hooks = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], value => { slots[index] = typeof value === "function" ? value(slots[index]) : value; }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useEffect() {},
  };
  const calls = [], events = [];
  let respond;
  const { JevDemo } = load("src/components/JevDemo.tsx", {
    react: hooks,
    "next/link": { __esModule: true, default: "a" },
    "@/data/jev-demo": data, "@/data/jev-visual": visual,
    "./JevFactoryExperience": { JevFactoryExperience },
    "@/lib/analytics": { trackEvent: (name, event) => events.push({ name, ...event }) },
    "@/app/labs/jev/jev.module.css": { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) },
  }, {
    AbortSignal: { timeout() {} },
    fetch: (_url, options) => {
      calls.push(JSON.parse(options.body));
      return new Promise(resolve => { respond = resolve; });
    },
  });
  const draw = () => { cursor = 0; return JevDemo({ enabled: true, initialSampleId: "batch" }); };
  const find = (node, predicate) => {
    if (!node || typeof node !== "object") return undefined;
    if (predicate(node)) return node;
    for (const child of React.Children.toArray(node.props?.children)) {
      const match = find(child, predicate);
      if (match) return match;
    }
  };
  const view = () => find(draw(), n => n.type === JevFactoryExperience).props;
  const selectCase = label => find(draw(), n => n.type === "button" && n.props.children === label).props.onClick();
  const finish = async (ok = true) => {
    const input = calls.at(-1);
    respond({ ok, status: ok ? 200 : 502, json: async () => ok ? { ...input, ...fixture("material") } : { error: "通信テスト失敗" } });
    await new Promise(resolve => setImmediate(resolve));
  };
  selectCase("② 測定値");
  selectCase("① 不合格");
  assert.equal(calls.length, 0);
  view().start();
  view().start();
  view().chooseEvidence("same-specimen");
  selectCase("② 測定値");
  assert.equal(calls.length, 1, "no duplicate request or selection while pending");
  assert.equal(view().sampleId, "batch");
  assert.equal(view().pending, true);
  await finish();
  view().chooseEvidence("same-specimen");
  assert.equal(calls.length, 2, "selection automatically evaluates");
  await finish(false);
  assert.ok(view().error);
  view().chooseEvidence(null);
  view().chooseEvidence("same-specimen");
  assert.equal(calls.length, 2, "failed input does not auto retry");
  view().retry();
  assert.equal(calls.length, 3);
  await finish();
  view().chooseEvidence(null);
  view().chooseEvidence("same-specimen");
  assert.equal(calls.length, 3, "cached input is immediate without sending");
  assert.ok(view().selected);
  selectCase("② 測定値");
  assert.deepEqual(calls.at(-1), { sampleId: "shift", evidenceId: null });
  await finish();
  selectCase("① 不合格");
  assert.equal(calls.length, 4);
  assert.ok(events.filter(e => e.name.startsWith("jev_evaluation_")).every(e => e.ui_version === visual.jevVisualVersion));
  slots.length = 0;
  view().start();
  await finish(false);
  assert.equal(view().initial, undefined);
  assert.ok(view().error);
  const failedCount = calls.length;
  view().chooseEvidence(null);
  assert.equal(calls.length, failedCount);
  view().retry();
  await finish();
  assert.ok(view().initial);
  slots.length = 0;
  cursor = 0;
  const disabled = find(JevDemo({ enabled: false, initialSampleId: "batch" }), n => n.type === JevFactoryExperience).props;
  const disabledCount = calls.length;
  disabled.start();
  assert.equal(calls.length, disabledCount, "disabled mode never sends");
  console.log("PASS: probability formatting, all scenes, raw bars, baseline, ties/rank changes, auto evaluation, cache, errors, retries, analytics");
}
controllerTests().catch(error => { console.error(error); process.exitCode = 1; });
