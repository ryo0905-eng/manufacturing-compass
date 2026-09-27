const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    const resolved = path.join(root, "src", request.slice(2));
    if (fs.existsSync(resolved)) return resolved;
    if (fs.existsSync(`${resolved}.ts`)) return `${resolved}.ts`;
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions[".ts"] = function transpile(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
    fileName: filename,
  }).outputText;
  module._compile(output, filename);
};
require.extensions[".tsx"] = require.extensions[".ts"];

const {
  calculatePulseKpis,
  filterPulseBriefLines,
  filterPulseSignals,
  filterRecentPulseSignals,
  getDefaultPulseFilters,
} = require("../src/lib/chip-pulse.ts");
const { pulseBriefLines, pulseCompanies, pulseSignals, pulseUpdatedAt } = require("../src/data/chip-pulse.ts");
const { buildOfficialUpdates, buildRefreshStatus } = require("./chip-pulse-publish.cjs");
const {
  assertValidPulseThumbnail,
  resolvePulseThumbnail,
} = require("../src/lib/chip-pulse-thumbnail.ts");

const baseSignal = {
  id: "signal-a",
  occurredAt: "2026-09-27T06:00:00Z",
  timeLabel: "9/27",
  title: "A",
  summary: "事実",
  impact: "見方",
  companyIds: ["company-a"],
  processes: ["Design"],
  regions: ["Japan"],
  categories: ["Fabless"],
  themes: ["AI"],
  importance: 3,
  tone: "neutral",
  kind: "product",
  sourceName: "Official",
  sourceUrl: "https://example.com/a",
  sourceType: "company",
};

test("thumbnail onError switches the real component to the same fixed-ratio process frame", () => {
  const React = require("react");
  const useState = React.useState;
  const cssLoader = require.extensions[".css"];
  let failedSrc = null;
  React.useState = () => [failedSrc, (value) => { failedSrc = value; }];
  require.extensions[".css"] = (module) => { module.exports = new Proxy({}, { get: (_, key) => key === "__esModule" ? false : key }); };
  try {
    const { NewsThumbnail } = require("../src/components/chip-pulse/NewsThumbnail.tsx");
    const signal = { processes: ["Design"], thumbnail: { src: "/images/chip-pulse/missing.webp", alt: "試験画像", credit: "公式", creditUrl: "https://example.com/license" } };
    const before = NewsThumbnail({ signal });
    assert.match(before.props.className, /newsThumbnailImage/);
    before.props.children[0].props.onError();
    const after = NewsThumbnail({ signal });
    assert.match(after.props.className, /newsThumbnailProcess/);
    assert.match(after.props.className, /newsThumbnail_design/);
    assert.match(fs.readFileSync(path.join(root,"src/components/chip-pulse/ChipPulseDashboard.module.css"),"utf8"), /\.newsThumbnail\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/);
  } finally { React.useState = useState; if (cssLoader) require.extensions[".css"] = cssLoader; else delete require.extensions[".css"]; }
});

test("KPI theme ties follow the declared theme order and zero is explicit", () => {
  const signals = [baseSignal, { ...baseSignal, id: "signal-b", themes: ["HBM"] }];
  const tied = calculatePulseKpis([], signals, "2026-09-27T07:00:00Z");
  assert.equal(tied.topTheme, "AI");
  assert.deepEqual(tied.topThemes, ["AI", "HBM"]);
  assert.equal(tied.topThemeCount, 1);

  const empty = calculatePulseKpis([], [], "2026-09-27T07:00:00Z");
  assert.equal(empty.topTheme, null);
  assert.equal(empty.topThemeCount, 0);
});

test("the rolling 24-hour window uses instants consistently across JST boundaries", () => {
  const asOf = "2026-09-27T07:00:00Z"; // 2026-09-27 16:00 JST
  const signals = [
    { ...baseSignal, id: "boundary", occurredAt: "2026-09-26T07:00:00Z" },
    { ...baseSignal, id: "outside", occurredAt: "2026-09-26T06:59:59.999Z" },
    { ...baseSignal, id: "future", occurredAt: "2026-09-27T07:00:00.001Z" },
  ];
  assert.deepEqual(filterRecentPulseSignals(signals, asOf, 1).map((signal) => signal.id), ["boundary"]);
});

test("filters and the daily brief do not invent rows for an empty result", () => {
  const filters = { ...getDefaultPulseFilters(), theme: "HBM" };
  assert.equal(filterPulseSignals([baseSignal], filters, null).length, 0);
  assert.equal(filterPulseBriefLines([], filters, null, [], false).length, 0);
});

test("partial and failed refreshes preserve the previous successful timestamp", () => {
  const previous = { schemaVersion: 2, lastSuccessfulAt: "2026-09-26T22:00:00Z" };
  for (const status of ["partial", "failed"]) {
    const result = buildRefreshStatus({
      status,
      generatedAt: "2026-09-27T22:00:00Z",
      sources: { attempted: 10, succeeded: status === "partial" ? 9 : 0, failed: status === "partial" ? 1 : 10 },
      candidates: [],
      errors: [{ companyId: "company-a", code: "timeout" }],
    }, previous);
    assert.equal(result.status, status);
    assert.equal(result.lastSuccessfulAt, previous.lastSuccessfulAt);
    assert.equal(result.lastAttemptAt, "2026-09-27T22:00:00Z");
  }
});

test("official metadata publication refuses incomplete collection", () => {
  assert.throws(() => buildOfficialUpdates({ status: "partial", sources: { failed: 1 } }, [], { schemaVersion: 1, aliases: [] }, { sources: [] }), /incomplete/);
});

test("published news keeps traceable, non-duplicated sources and valid references", () => {
  const signalIds = new Set();
  const sourceUrls = new Set();
  const companyIds = new Set(pulseCompanies.map((company) => company.id));
  const asOf = new Date(pulseUpdatedAt).getTime();

  for (const signal of pulseSignals) {
    assert.ok(!signalIds.has(signal.id), `duplicate signal id: ${signal.id}`);
    assert.ok(!sourceUrls.has(signal.sourceUrl), `duplicate source URL: ${signal.sourceUrl}`);
    assert.equal(new URL(signal.sourceUrl).protocol, "https:");
    assert.ok(new Date(signal.occurredAt).getTime() <= asOf, `future signal: ${signal.id}`);
    assert.ok(signal.summary.length > 0 && signal.impact.length > 0 && signal.sourceName.length > 0);
    assert.ok(signal.companyIds.every((companyId) => companyIds.has(companyId)), `unknown company in ${signal.id}`);
    if (signal.thumbnail) {
      assert.doesNotThrow(() => assertValidPulseThumbnail(signal.thumbnail));
      assert.ok(fs.existsSync(path.join(root, "public", signal.thumbnail.src.slice(1))), `missing thumbnail file: ${signal.thumbnail.src}`);
    }
    signalIds.add(signal.id);
    sourceUrls.add(signal.sourceUrl);
  }

  for (const line of pulseBriefLines) {
    assert.ok(line.signalIds?.length, `brief without evidence: ${line.id}`);
    assert.ok(line.signalIds.every((signalId) => signalIds.has(signalId)), `unknown brief evidence: ${line.id}`);
  }
});

test("every process resolves to its own fallback thumbnail", () => {
  const processes = ["Design", "Lithography", "Deposition", "Etch", "Metrology", "Assembly", "Test", "Materials"];
  for (const process of processes) {
    assert.deepEqual(resolvePulseThumbnail({ processes: [process] }), {
      kind: "process",
      process,
      label: {
        Design: "設計", Lithography: "露光", Deposition: "成膜", Etch: "エッチング",
        Metrology: "検査・計測", Assembly: "後工程・実装", Test: "テスト", Materials: "材料",
      }[process],
    });
  }
  assert.deepEqual(resolvePulseThumbnail({ processes: [] }), { kind: "process", process: "General", label: "半導体産業" });
});

test("curated thumbnails require a local image, alt text, credit, and HTTPS evidence", () => {
  const valid = {
    src: "/images/chip-pulse/example.webp",
    alt: "公式発表に掲載された製造装置",
    credit: "Example newsroom",
    creditUrl: "https://example.com/newsroom/article",
  };
  assert.doesNotThrow(() => assertValidPulseThumbnail(valid));
  assert.throws(() => assertValidPulseThumbnail({ ...valid, src: "https://example.com/image.webp" }), /local raster image/);
  assert.throws(() => assertValidPulseThumbnail({ ...valid, src: "/images/chip-pulse/../image.webp" }), /local raster image/);
  assert.throws(() => assertValidPulseThumbnail({ ...valid, alt: " " }), /alt text/);
  assert.throws(() => assertValidPulseThumbnail({ ...valid, credit: " " }), /credit is required/);
  assert.throws(() => assertValidPulseThumbnail({ ...valid, creditUrl: "http://example.com/article" }), /HTTPS/);
});

test("a failed curated image falls back without changing the card dimensions", () => {
  const signal = {
    processes: ["Assembly"],
    thumbnail: {
      src: "/images/chip-pulse/example.png",
      alt: "先端パッケージの公式写真",
      credit: "Example newsroom",
      creditUrl: "https://example.com/newsroom/article",
    },
  };
  assert.equal(resolvePulseThumbnail(signal).kind, "image");
  assert.deepEqual(resolvePulseThumbnail(signal, true), { kind: "process", process: "Assembly", label: "後工程・実装" });
});
