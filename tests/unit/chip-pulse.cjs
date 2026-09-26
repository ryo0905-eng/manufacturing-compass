const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function loader() {
  const cache = new Map();
  function load(file) {
    const filename = [file, `${file}.ts`, `${file}.tsx`, path.join(file, "index.ts")]
      .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (!filename) throw new Error(file);
    if (cache.has(filename)) return cache.get(filename);
    const exports = {};
    cache.set(filename, exports);
    const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    vm.runInNewContext(code, {
      exports,
      process,
      require(id) {
        if (id.startsWith("@/")) return load(`src/${id.slice(2)}`);
        if (id.startsWith(".")) return load(path.resolve(path.dirname(filename), id));
        return require(id);
      },
    }, { filename });
    return exports;
  }
  return load;
}

const load = loader();
const data = load("src/data/chip-pulse");
const lib = load("src/lib/chip-pulse");
const { companies } = load("src/data/companies");

assert.equal(new Set(data.pulseCompanies.map((company) => company.id)).size, data.pulseCompanies.length);
assert.ok(data.pulseCompanies.length >= 20);
assert.ok(data.pulseCompanies.every((company) => company.marketCapUsdB > 0));
for (const company of data.pulseCompanies) {
  if (company.companySlug) assert.ok(companies.some((entry) => entry.slug === company.companySlug), company.companySlug);
}
const companyIds = new Set(data.pulseCompanies.map((company) => company.id));
for (const signal of data.pulseSignals) {
  assert.ok(signal.companyIds.every((id) => companyIds.has(id)), signal.id);
  assert.ok(companyIds.has(signal.primaryCompanyId), signal.id);
  assert.ok(signal.companyIds.includes(signal.primaryCompanyId), signal.id);
  assert.ok(signal.processes.length > 0, signal.id);
  assert.ok(signal.importance >= 1 && signal.importance <= 3);
}
for (const event of data.pulseEvents) assert.ok(event.companyIds.every((id) => companyIds.has(id)), event.id);

const japanEquipment = { region: "Japan", category: "Equipment", theme: "All" };
assert.equal(
  lib.filterPulseCompanies(data.pulseCompanies, japanEquipment).map((company) => company.id).sort().join(","),
  "advantest,disco,screen,tokyo-electron",
);
const japanEquipmentHbm = { ...japanEquipment, theme: "HBM" };
assert.equal(
  lib.filterPulseCompanies(data.pulseCompanies, japanEquipmentHbm).map((company) => company.id).sort().join(","),
  "advantest,screen,tokyo-electron",
);
assert.equal(lib.filterPulseSignals(data.pulseSignals, japanEquipmentHbm, "advantest").every((signal) => signal.companyIds.includes("advantest")), true);
assert.equal(lib.filterPulseEvents(data.pulseEvents, japanEquipmentHbm, "advantest").every((event) => event.companyIds.includes("advantest")), true);

const asiaFoundry = { region: "Asia", category: "Foundry", theme: "All" };
assert.equal(
  lib.filterPulseCompanies(data.pulseCompanies, asiaFoundry).map((company) => company.id).sort().join(","),
  "smic,tsmc",
);

const filteredCompanies = lib.filterPulseCompanies(data.pulseCompanies, japanEquipment);
const filteredSignals = lib.filterPulseSignals(data.pulseSignals, japanEquipment, null);
const kpis = lib.calculatePulseKpis(filteredCompanies, filteredSignals);
assert.equal(kpis.rising, 4);
assert.equal(kpis.falling, 0);
assert.equal(kpis.signalCount, filteredSignals.length);
assert.ok(kpis.weightedChange > 0);
assert.ok(kpis.japanWeightedChange > 0);

const width = 1000, height = 520;
const layout = lib.layoutPulseTreemap(data.pulseCompanies, width, height);
assert.equal(layout.rects.length, data.pulseCompanies.length);
const area = layout.rects.reduce((sum, rect) => sum + rect.width * rect.height, 0);
assert.ok(Math.abs(area - width * height) < 0.001);
const totalMarketCap = data.pulseCompanies.reduce((sum, company) => sum + company.marketCapUsdB, 0);
for (const rect of layout.rects) {
  assert.ok(rect.x >= -1e-8 && rect.y >= -1e-8);
  assert.ok(rect.x + rect.width <= width + 1e-8 && rect.y + rect.height <= height + 1e-8);
  const expectedArea = width * height * rect.company.marketCapUsdB / totalMarketCap;
  assert.ok(Math.abs(rect.width * rect.height - expectedArea) < 0.001, rect.id);
}
for (let left = 0; left < layout.rects.length; left += 1) {
  for (let right = left + 1; right < layout.rects.length; right += 1) {
    const a = layout.rects[left], b = layout.rects[right];
    const overlapWidth = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
    const overlapHeight = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
    assert.ok(overlapWidth * overlapHeight < 0.001, `${a.id}/${b.id}`);
  }
}

console.log("Chip Pulse: data references, region groups, filters, KPIs and treemap geometry passed.");
