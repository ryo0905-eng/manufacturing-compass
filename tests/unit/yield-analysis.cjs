const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function load(file) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } }).outputText;
  vm.runInNewContext(code, { exports }, { filename: file });
  return exports;
}

const analysis = load(path.resolve(__dirname, "../../src/lib/yield-analysis.ts"));
const baseline = { start: "2026-08-01", end: "2026-08-10" };
const comparison = { start: "2026-08-11", end: "2026-08-12" };

const chartRows = [];
for (let day = 1; day <= 12; day += 1) {
  chartRows.push({ date: `2026-08-${String(day).padStart(2, "0")}`, product: "製品A", equipment: "装置A", inspectedCount: day === 12 ? 400 : 100, defectiveCount: day <= 10 ? 2 : day === 11 ? 3 : 40 });
}
const chart = analysis.analyzePChart(chartRows, baseline, comparison, "製品A");
assert.equal(chart.available, true);
assert.equal(chart.pBar, 0.02);
assert.deepEqual(Array.from(chart.signalDates), ["2026-08-12"]);
assert.ok(chart.points[11].uclDefectRate < chart.points[10].uclDefectRate, "larger n must narrow the p-chart limit");
assert.ok(Math.abs(chart.points[11].lowerYieldLimit - (1 - chart.points[11].uclDefectRate)) < 1e-12, "defect-rate UCL must become the yield lower limit");
const changedComparison = analysis.analyzePChart(chartRows.map((row) => row.date === "2026-08-12" ? { ...row, defectiveCount: 80 } : row), baseline, comparison, "製品A");
assert.equal(changedComparison.pBar, 0.02, "comparison data must not update the baseline center");
assert.equal(analysis.analyzePChart(chartRows, baseline, comparison).available, false, "mixed products remain reference-only");

const mixRows = [
  { date: "2026-08-01", product: "製品A", equipment: "装置A", inspectedCount: 900, defectiveCount: 9 },
  { date: "2026-08-01", product: "製品B", equipment: "装置A", inspectedCount: 100, defectiveCount: 10 },
  { date: "2026-08-11", product: "製品A", equipment: "装置A", inspectedCount: 100, defectiveCount: 1 },
  { date: "2026-08-11", product: "製品B", equipment: "装置A", inspectedCount: 900, defectiveCount: 90 },
];
const mix = analysis.calculateMixComparison(mixRows, baseline, comparison);
assert.equal(mix.available, true);
assert.ok(Math.abs(mix.baselineYield - 0.981) < 1e-12);
assert.ok(Math.abs(mix.mixAdjustedYield - 0.909) < 1e-12);
assert.ok(Math.abs(mix.comparisonYield - 0.909) < 1e-12);

const weighted = analysis.summarizeYield([
  { date: "2026-08-01", product: "A", equipment: "A", inspectedCount: 10, defectiveCount: 0 },
  { date: "2026-08-01", product: "B", equipment: "A", inspectedCount: 90, defectiveCount: 18 },
]);
assert.ok(Math.abs(weighted.yieldRate - 0.82) < 1e-12, "rates must come from summed counts, not an average of row rates");

const duplicateCsv = "date,product,equipment,inspected_count,defective_count\n2026-08-01,製品A,装置A,100,2\n2026-08-01,製品A,装置A,50,1";
const duplicate = analysis.parseYieldCsv(duplicateCsv);
assert.equal(duplicate.errors.length, 0);
assert.equal(duplicate.inspectedCount, undefined);
assert.equal(duplicate.rows[0].inspectedCount, 150);
assert.equal(duplicate.rows[0].defectiveCount, 3);
assert.equal(duplicate.duplicateCount, 1);
assert.ok(duplicate.warnings[0].includes("合算"));

for (const [label, csv] of [
  ["missing header", "date,product,equipment,inspected_count\n2026-08-01,A,E,10"],
  ["invalid date", "date,product,equipment,inspected_count,defective_count\n2026-02-30,A,E,10,1"],
  ["missing value", "date,product,equipment,inspected_count,defective_count\n2026-08-01,,E,10,1"],
  ["decimal", "date,product,equipment,inspected_count,defective_count\n2026-08-01,A,E,10.5,1"],
  ["negative", "date,product,equipment,inspected_count,defective_count\n2026-08-01,A,E,-1,0"],
  ["defects exceed inspected", "date,product,equipment,inspected_count,defective_count\n2026-08-01,A,E,10,11"],
]) assert.ok(analysis.parseYieldCsv(csv).errors.length > 0, label);

const newProduct = analysis.calculateMixComparison([...mixRows, { date: "2026-08-11", product: "製品C", equipment: "装置A", inspectedCount: 20, defectiveCount: 1 }], baseline, comparison);
assert.equal(newProduct.available, false);
assert.ok(newProduct.reason.includes("製品C"));

console.log("PASS: yield p-chart, weighted aggregation, product mix, and CSV validation");
