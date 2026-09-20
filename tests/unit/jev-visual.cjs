const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const root = path.resolve(__dirname, "../..");
function load(file, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, { exports, require(name) {
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
const fixture = (route, evidenceId = null) => ({ sampleId: "batch", evidenceId, decisions: { route: { choice: route } } });
const base = { sampleId: "batch", enabled: true, evidenceId: null, pending: false, error: "", chooseEvidence() {}, run() {} };
const render = props => renderToStaticMarkup(React.createElement(JevFactoryExperience, { ...base, ...props }));
for (const sample of data.jevSamples) {
  for (const id of [null, ...sample.evidence.map(e => e.id)]) {
    const html = render({ sampleId: sample.id, evidenceId: id });
    assert.ok(html.includes(visual.getVisualScene(sample.id, id).title));
    assert.equal((html.match(/<svg/g) || []).length, 4);
    assert.ok(!html.includes("<table"));
    assert.ok(!html.includes("あなたの予想"));
  }
}
let html = render({ evidenceId: "same-specimen", initial: fixture("material") });
assert.ok(html.includes("未評価・表示は初報"));
assert.ok(html.includes("--index:0"));
assert.ok(!html.includes("再測定でも同じ傾向"));
html = render({ evidenceId: "same-specimen", initial: fixture("material"), selected: fixture("metrology", "same-specimen") });
assert.ok(html.includes("--index:2"));
assert.ok(html.includes("追加後の提案"));
assert.ok(html.includes("✓ 評価済み"));
html = render({ evidenceId: "across-tools", initial: fixture("material"), selected: fixture("material", "across-tools") });
assert.ok(html.includes("確認先は同じ"));
for (const route of Object.keys(data.jevRoutes)) {
  assert.ok(render({ initial: fixture(route), selected: fixture(route) }).includes(data.jevRoutes[route].label));
}
assert.ok(render({ enabled: false }).includes('disabled=""'));
html = render({ evidenceId: "same-specimen", initial: fixture("material"), error: "通信テスト失敗" });
assert.ok(html.includes('role="alert"'));
assert.ok(html.includes("材料・ロット"));
assert.ok(html.includes("再試行"));
console.log("PASS: all 9 scenes, branch isolation, all route mappings, SSR, pending/error provenance, disabled mode");
