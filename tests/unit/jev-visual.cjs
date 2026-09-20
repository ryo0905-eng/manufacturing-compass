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
assert.equal(visual.getVisualEvidence(null), null);
assert.equal(visual.getVisualEvidence("reference"), null);
const across = visual.getVisualEvidence("across-tools"), measured = visual.getVisualEvidence("same-specimen");
assert.equal(across.outcomes[0].join(), "usual,usual");
assert.equal(across.outcomes[1].join(), "increase,increase");
assert.equal(measured.outcomes[0].join(), "increase,usual");
assert.equal(measured.outcomes[1].join(), "increase,usual");
assert.ok(data.jevSamples[0].evidence.every(e => visual.getVisualEvidence(e.id)));
const { JevFactoryExperience } = load("src/components/JevFactoryExperience.tsx", {
  "next/link": { __esModule: true, default: props => React.createElement("a", props, props.children) },
  "@/data/jev-demo": data, "@/data/jev-visual": visual,
  "@/lib/analytics": { trackEvent() { throw Error("Rendering must not emit analytics"); } },
  "@/app/labs/jev/jev.module.css": { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) },
});
const fixture = (route, evidenceId = null) => ({ sampleId: "batch", evidenceId, decisions: { route: { choice: route } } });
const base = { enabled: true, evidenceId: null, pending: false, error: "", chooseEvidence() {}, run() {} };
const render = props => renderToStaticMarkup(React.createElement(JevFactoryExperience, { ...base, ...props }));
let html = render({});
assert.ok(html.includes("材料が替わった"));
assert.ok(html.includes("Jevなら、どこを見る？"));
assert.ok(!html.includes('class="jevMarker"'));
assert.ok(!html.includes(data.jevSamples[0].report));
html = render({ evidenceId: "same-specimen", initial: fixture("material") });
assert.ok(html.includes("追加情報は未評価"));
assert.ok(html.includes("left:12.5%"), "pending branch still points at the actual initial route");
assert.ok(html.includes("検査器①"));
assert.ok(!html.includes("再測定でも同じ傾向"), "other branch evidence must not leak");
html = render({ evidenceId: "same-specimen", initial: fixture("material"), selected: fixture("metrology", "same-specimen") });
assert.ok(html.includes("left:62.5%"));
assert.ok(html.includes("確認先が変わった"));
assert.ok(html.includes("/tools/gage-rr"));
assert.ok(!html.includes("原因である確率"));
html = render({ evidenceId: "across-tools", initial: fixture("material"), selected: fixture("material", "across-tools") });
assert.ok(html.includes("確認先は同じ"), "unchanged responses are not dramatized as a change");
assert.ok(html.includes("切替では再送しません"));
for (const route of Object.keys(data.jevRoutes)) {
  html = render({ initial: fixture(route), selected: fixture(route) });
  assert.ok(html.includes(data.jevRoutes[route].label), "always retain exact route label: " + route);
}
html = render({ enabled: false });
assert.ok(html.includes('disabled=""'));
html = render({ evidenceId: "same-specimen", initial: fixture("material"), error: "通信テスト失敗" });
assert.ok(html.includes('role="alert"'));
assert.ok(html.includes("材料・ロット"));
console.log("PASS: visual evidence, independent branches, all route mappings, SSR, pending/error provenance, unchanged result, disabled mode");
