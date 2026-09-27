const assert = require("node:assert/strict");
const fs = require("node:fs");
const { canonicalSourceUrl, extractPublishedSignals, reviewCandidates } = require("../../scripts/chip-pulse-review.cjs");

const signals = extractPublishedSignals(fs.readFileSync("src/data/chip-pulse.ts", "utf8"));
const aliases = JSON.parse(fs.readFileSync("src/data/chip-pulse-source-aliases.json", "utf8"));
assert.ok(signals.length > 0);
assert.equal(canonicalSourceUrl("https://example.com/news/?utm_source=rss&v=2#top"), "https://example.com/news?v=2");

const snapshot = {
  schemaVersion: 1,
  generatedAt: "2026-09-26T10:30:00.000Z",
  candidates: [
    { id: "exact", companyId: "tsmc", filedAt: "2026-09-24", sourceUrl: "https://www.sec.gov/Archives/edgar/data/1046179/000104617926000660/tsm-monthend6kx20260924.htm" },
    { id: "alias", companyId: "samsung-electronics", publishedAt: "2026-09-08T15:03:00.000Z", title: "Samsung and ASML", sourceUrl: "https://news.samsung.com/global/samsung-electronics-and-asml-expand-strategic-collaboration-for-next-generation-semiconductor-manufacturing?utm_source=rss" },
    { id: "unknown", companyId: "nvidia", filedAt: "2026-09-26", sourceUrl: "https://www.sec.gov/Archives/edgar/data/1045810/other.htm" },
  ],
};
const report = reviewCandidates(snapshot, signals, aliases);
assert.deepEqual(report.summary, { candidates: 3, published: 2, autoExcluded: 0, newOfficialUpdates: 1 });
assert.equal(report.published[0].match, "source-url");
assert.equal(report.published[1].match, "confirmed-alias");
assert.equal(report.published[1].signalId, "samsung-asml-high-na-2026");
assert.equal(report.newOfficialUpdates[0].candidateId, "unknown");
assert.throws(() => reviewCandidates(snapshot, signals, { schemaVersion: 1, aliases: [{ sourceUrl: "https://example.com", signalId: "missing" }] }), /unknown signal/);

const classified = reviewCandidates({ ...snapshot, candidates: [
  { id: "governance", companyId: "lam-research", form: "8-K", filedAt: "2026-08-27", items: "5.02,9.01", sourceUrl: "https://www.sec.gov/Archives/edgar/data/707549/governance.htm" },
  { id: "dividend", companyId: "tsmc", form: "6-K", filedAt: "2026-09-01", primaryDocument: "tsm-dividendadjustment.htm", sourceUrl: "https://www.sec.gov/Archives/edgar/data/1046179/dividend.htm" },
  { id: "earnings", companyId: "broadcom", form: "8-K", filedAt: "2026-09-02", items: "2.02,8.01,9.01", sourceUrl: "https://www.sec.gov/Archives/edgar/data/1730168/earnings.htm" },
  { id: "later-10q", companyId: "broadcom", form: "10-Q", filedAt: "2026-09-10", sourceUrl: "https://www.sec.gov/Archives/edgar/data/1730168/000173016826000080/avgo-20260802.htm" },
] }, signals, aliases);
assert.deepEqual(classified.summary, { candidates: 4, published: 1, autoExcluded: 2, newOfficialUpdates: 1 });
assert.deepEqual(classified.autoExcluded.map((entry) => entry.reason), ["governance_filing", "dividend_adjustment"]);
assert.equal(classified.newOfficialUpdates[0].candidateId, "earnings");

console.log("Chip Pulse reviewer: exact URLs, confirmed aliases and automatic filing triage passed.");
