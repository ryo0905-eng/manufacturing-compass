const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function load(file) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } }).outputText;
  vm.runInNewContext(code, { exports, require }, { filename: file });
  return exports;
}

const analysis = load(path.resolve(__dirname, "../../src/lib/yield-dashboard.ts"));
const data = load(path.resolve(__dirname, "../../src/data/yield-dashboard.ts"));
const lots = Array.from(data.yieldDashboardLots);

assert.equal(lots.length, 56);
assert.deepEqual(Array.from(analysis.validateDashboardLots(lots)), []);

const all = analysis.summarizeLots(lots);
assert.equal(all.inspected, all.good + all.defective);
assert.equal(all.yieldRate, all.good / all.inspected, "yield must use summed counts");

const before = analysis.filterDashboardLots(lots, { dateStart: "2026-08-03", dateEnd: "2026-08-10", product: "AX-7", equipment: "CVD-02", focusDefect: "" });
const after = analysis.filterDashboardLots(lots, { dateStart: "2026-08-11", dateEnd: "2026-08-16", product: "AX-7", equipment: "CVD-02", focusDefect: "thickness" });
assert.ok(analysis.summarizeLots(before).yieldRate > .97);
assert.ok(analysis.summarizeLots(after).yieldRate < .92);
assert.ok(analysis.summarizeDefects(after)[0].key === "thickness");

const equipment = analysis.groupDefectRate(
  lots.filter((lot) => lot.date >= "2026-08-11" && lot.product === "AX-7"),
  "equipment",
  "thickness",
);
const cvd01 = equipment.find((row) => row.key === "CVD-01");
const cvd02 = equipment.find((row) => row.key === "CVD-02");
assert.ok(cvd02.defective / cvd02.inspected > cvd01.defective / cvd01.inspected * 5);
assert.ok(cvd01.inspected > 0 && cvd02.inspected > 0, "equipment comparison must retain denominators");

const confirmation = Array.from(data.confirmationRuns);
const changedRate = confirmation[0].defects.thickness / confirmation[0].inspected;
const returnedRate = confirmation[1].defects.thickness / confirmation[1].inspected;
assert.ok(returnedRate < changedRate / 5);
assert.ok(confirmation.every((run) => run.group === "confirmation"), "confirmation data stays separate from observations");

console.log("PASS: dashboard integrity, weighted yield, linked breakdown, and confirmation separation");
