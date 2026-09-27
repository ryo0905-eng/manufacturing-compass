const assert = require("node:assert/strict");
const fs = require("node:fs");
const { buildOfficialUpdates } = require("../../scripts/chip-pulse-publish.cjs");
const { extractPublishedSignals } = require("../../scripts/chip-pulse-review.cjs");

const signals = extractPublishedSignals(fs.readFileSync("src/data/chip-pulse.ts", "utf8"));
const aliases = JSON.parse(fs.readFileSync("src/data/chip-pulse-source-aliases.json", "utf8"));
const registry = JSON.parse(fs.readFileSync("src/data/chip-pulse-sources.json", "utf8"));
const snapshot = {
  schemaVersion: 1,
  status: "success",
  generatedAt: "2026-09-26T01:51:42.582Z",
  sources: { attempted: 11, succeeded: 11, failed: 0 },
  candidates: [
    { id: "published", companyId: "tsmc", form: "6-K", filedAt: "2026-09-24", sourceType: "regulatory", sourceUrl: "https://www.sec.gov/Archives/edgar/data/1046179/000104617926000660/tsm-monthend6kx20260924.htm" },
    { id: "new-sec", companyId: "amd", form: "8-K", filedAt: "2026-09-25", items: "1.01", sourceType: "regulatory", sourceUrl: "https://www.sec.gov/Archives/edgar/data/2488/new.htm" },
    { id: "new-rss", companyId: "samsung-electronics", publishedAt: "2026-09-25T10:00:00.000Z", title: "New HBM product", sourceType: "company", sourceUrl: "https://news.samsung.com/global/new-hbm" },
  ],
};
const result = buildOfficialUpdates(snapshot, signals, aliases, registry);
assert.equal(result.updates.length, 2);
assert.deepEqual(result.updates.map((item) => item.title), ["AMDがSECへForm 8-Kを提出", "New HBM product"]);
assert.equal(result.updates[0].sourceUrl, "https://www.sec.gov/Archives/edgar/data/2488/new.htm");
assert.throws(() => buildOfficialUpdates({ ...snapshot, status: "partial", sources: { attempted: 11, succeeded: 10, failed: 1 } }, signals, aliases, registry), /preserved/);

console.log("Chip Pulse publisher: official metadata only, duplicate suppression and partial failure preservation passed.");
