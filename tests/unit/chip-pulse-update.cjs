const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  collectSecCandidates,
  normalizeSecFilings,
  normalizeRssItems,
  readRegistry,
  secFilingUrl,
  writeSnapshotSafely,
} = require("../../scripts/chip-pulse-update.cjs");

const source = {
  companyId: "nvidia",
  companyName: "NVIDIA",
  kind: "sec-submissions",
  cik: "0001045810",
  forms: ["8-K", "10-Q", "10-K"],
};
const payload = {
  filings: {
    recent: {
      accessionNumber: ["0001045810-26-000101", "0001045810-26-000099", "0001045810-26-000080"],
      filingDate: ["2026-09-25", "2026-09-24", "2026-07-01"],
      reportDate: ["2026-09-25", "2026-09-24", "2026-06-30"],
      acceptanceDateTime: ["2026-09-25T12:00:00.000Z", "2026-09-24T12:00:00.000Z", "2026-07-01T12:00:00.000Z"],
      form: ["8-K", "4", "10-Q"],
      primaryDocument: ["nvda-20260925.htm", "ownership.xml", "nvda-20260701.htm"],
      primaryDocDescription: ["Current report", "Ownership report", "Quarterly report"],
      items: ["8.01", "", ""],
    },
  },
};

const registry = readRegistry();
assert.equal(registry.sources.length, 11);
assert.equal(new Set(registry.sources.map((item) => item.companyId)).size, registry.sources.length);
assert.equal(new Set(registry.sources.filter((item) => item.cik).map((item) => item.cik)).size, 10);

const normalized = normalizeSecFilings(
  payload,
  source,
  new Date("2026-08-27T00:00:00.000Z"),
  new Date("2026-09-26T00:00:00.000Z"),
);
assert.equal(normalized.length, 1);
assert.equal(normalized[0].form, "8-K");
assert.equal(normalized[0].reviewStatus, "pending");
assert.equal(
  normalized[0].sourceUrl,
  "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000101/nvda-20260925.htm",
);
assert.equal(
  secFilingUrl("0001045810", "0001045810-26-000101", "nvda report.htm"),
  "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000101/nvda%20report.htm",
);

const rssSource = registry.sources.find((item) => item.companyId === "samsung-electronics");
const rss = `<?xml version="1.0"?><rss version="2.0"><channel>
  <item><title><![CDATA[Samsung &amp; ASML expand semiconductor work]]></title><link>https://news.samsung.com/global/example</link><pubDate>Fri, 25 Sep 2026 10:00:00 GMT</pubDate><category>Semiconductor</category></item>
  <item><title>Galaxy phone release</title><link>https://news.samsung.com/global/phone</link><pubDate>Fri, 25 Sep 2026 10:00:00 GMT</pubDate></item>
  <item><title>HBM older release</title><link>https://news.samsung.com/global/older</link><pubDate>Wed, 01 Jul 2026 10:00:00 GMT</pubDate></item>
  <item><title>HBM off-site release</title><link>https://example.com/other</link><pubDate>Fri, 25 Sep 2026 10:00:00 GMT</pubDate></item>
</channel></rss>`;
const rssCandidates = normalizeRssItems(rss, rssSource, new Date("2026-08-27T00:00:00.000Z"), new Date("2026-09-26T00:00:00.000Z"));
assert.equal(rssCandidates.length, 1);
assert.equal(rssCandidates[0].title, "Samsung & ASML expand semiconductor work");
assert.equal(rssCandidates[0].sourceUrl, "https://news.samsung.com/global/example");
assert.equal(rssCandidates[0].reviewStatus, "pending");
assert.throws(() => normalizeRssItems("<html></html>", rssSource, new Date(), new Date()), /invalid/);

async function main() {
  const responses = new Map([
    ["0001045810", { ok: true, json: async () => payload }],
    ["0000002488", { ok: false, status: 503, json: async () => ({}) }],
  ]);
  const snapshot = await collectSecCandidates({
    sources: [source, { ...source, companyId: "amd", companyName: "AMD", cik: "0000002488" }],
    asOf: new Date("2026-09-26T10:30:00.000Z"),
    userAgent: "Manufacturing Compass test@example.com",
    fetchImpl: async (url) => responses.get(url.match(/CIK(\d{10})/)[1]),
    wait: async () => {},
  });
  assert.equal(snapshot.status, "partial");
  assert.deepEqual(snapshot.sources, { attempted: 2, succeeded: 1, failed: 1 });
  assert.equal(snapshot.candidates.length, 1);
  assert.deepEqual(snapshot.errors, [{ companyId: "amd", code: "http_503" }]);

  const mixedSnapshot = await collectSecCandidates({
    sources: [source, rssSource],
    asOf: new Date("2026-09-26T10:30:00.000Z"),
    userAgent: "Manufacturing Compass test@example.com",
    fetchImpl: async (url, options) => {
      if (url.includes("data.sec.gov")) {
        assert.equal(options.headers["User-Agent"], "Manufacturing Compass test@example.com");
        return responses.get("0001045810");
      }
      assert.equal(options.headers["User-Agent"], "ManufacturingCompassFeed/1.0");
      return { ok: true, text: async () => rss };
    },
    wait: async () => {},
  });
  assert.equal(mixedSnapshot.status, "success");
  assert.equal(mixedSnapshot.candidates.length, 2);

  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "chip-pulse-update-"));
  try {
    const paths = writeSnapshotSafely(snapshot, temporaryDirectory);
    assert.ok(fs.existsSync(paths.currentPath));
    assert.ok(fs.existsSync(paths.historicalPath));
    assert.deepEqual(JSON.parse(fs.readFileSync(paths.currentPath, "utf8")), snapshot);
    assert.throws(
      () => writeSnapshotSafely({ ...snapshot, status: "failed", sources: { attempted: 2, succeeded: 0, failed: 2 } }, temporaryDirectory),
      /preserved/,
    );
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }

  console.log("Chip Pulse updater: registry, SEC normalization, partial failure and safe snapshot writes passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
