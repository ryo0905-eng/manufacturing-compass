// Operator-run collector. It discovers disclosure candidates; it never publishes them directly.
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { loadEnvConfig } = require("@next/env");

const root = path.resolve(__dirname, "..");
const defaultRegistryPath = path.join(root, "src/data/chip-pulse-sources.json");
const defaultOutputDirectory = path.join(root, ".private/chip-pulse-candidates");
const allowedSourceKinds = new Set(["sec-submissions", "official-rss"]);

function readRegistry(registryPath = defaultRegistryPath) {
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  if (registry?.schemaVersion !== 1 || !Array.isArray(registry.sources) || registry.sources.length === 0) {
    throw new Error("Chip Pulse source registry is invalid.");
  }
  const companyIds = new Set();
  const locations = new Set();
  for (const source of registry.sources) {
    if (!source || typeof source.companyId !== "string" || typeof source.companyName !== "string") {
      throw new Error("Chip Pulse source registry contains an invalid company.");
    }
    if (!allowedSourceKinds.has(source.kind)) {
      throw new Error(`Chip Pulse source registry contains an invalid source for ${source.companyId}.`);
    }
    if (source.kind === "sec-submissions" && (!/^\d{10}$/.test(source.cik) || !Array.isArray(source.forms) || source.forms.length === 0)) {
      throw new Error(`Chip Pulse source registry contains an invalid SEC source for ${source.companyId}.`);
    }
    if (source.kind === "official-rss") {
      let feedUrl;
      try { feedUrl = new URL(source.url); } catch { throw new Error(`Chip Pulse source registry contains an invalid RSS URL for ${source.companyId}.`); }
      if (feedUrl.protocol !== "https:" || !Array.isArray(source.matchTerms) || source.matchTerms.length === 0 || source.matchTerms.some((term) => typeof term !== "string" || !term.trim())) {
        throw new Error(`Chip Pulse source registry contains an invalid RSS source for ${source.companyId}.`);
      }
    }
    const location = source.kind === "sec-submissions" ? source.cik : source.url;
    if (companyIds.has(source.companyId) || locations.has(location)) {
      throw new Error(`Chip Pulse source registry contains a duplicate: ${source.companyId}.`);
    }
    companyIds.add(source.companyId);
    locations.add(location);
  }
  return registry;
}

function secSubmissionUrl(cik) {
  return `https://data.sec.gov/submissions/CIK${cik}.json`;
}

function secFilingUrl(cik, accessionNumber, primaryDocument) {
  const accession = accessionNumber.replaceAll("-", "");
  return `https://www.sec.gov/Archives/edgar/data/${Number(cik)}/${accession}/${encodeURIComponent(primaryDocument)}`;
}

function normalizedDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeSecFilings(payload, source, windowStart, windowEnd) {
  const recent = payload?.filings?.recent;
  if (!recent || !Array.isArray(recent.accessionNumber)) throw new Error("SEC response has no recent filings.");
  const candidates = [];
  for (let index = 0; index < recent.accessionNumber.length; index += 1) {
    const form = recent.form?.[index];
    const filedAt = recent.filingDate?.[index];
    const filedDate = normalizedDate(filedAt);
    const accessionNumber = recent.accessionNumber[index];
    const primaryDocument = recent.primaryDocument?.[index];
    if (!source.forms.includes(form) || !filedDate || filedDate < windowStart || filedDate > windowEnd) continue;
    if (typeof accessionNumber !== "string" || typeof primaryDocument !== "string" || !primaryDocument) continue;
    candidates.push({
      id: `sec-${accessionNumber.toLowerCase()}`,
      companyId: source.companyId,
      companyName: source.companyName,
      sourceName: "SEC EDGAR",
      sourceType: "regulatory",
      form,
      filedAt,
      reportDate: recent.reportDate?.[index] || null,
      acceptedAt: recent.acceptanceDateTime?.[index] || null,
      accessionNumber,
      primaryDocument,
      description: recent.primaryDocDescription?.[index] || null,
      items: recent.items?.[index] || null,
      sourceUrl: secFilingUrl(source.cik, accessionNumber, primaryDocument),
      reviewStatus: "pending",
    });
  }
  return candidates;
}

function decodeXmlText(value) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) => {
      const point = code[0].toLowerCase() === "x" ? Number.parseInt(code.slice(1), 16) : Number(code);
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : "";
    })
    .replace(/&(?:amp|lt|gt|quot|apos);/g, (entity) => ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'" })[entity]);
}

function xmlField(block, field) {
  const match = block.match(new RegExp(`<${field}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${field}>`, "i"));
  return match ? decodeXmlText(match[1]).trim() : "";
}

function normalizeRssItems(xml, source, windowStart, windowEnd) {
  if (typeof xml !== "string" || !/<rss\b/i.test(xml) || !/<channel\b/i.test(xml)) throw new Error("Official RSS response is invalid.");
  const items = xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi) ?? [];
  const terms = source.matchTerms.map((term) => term.toLowerCase());
  return items.flatMap((item) => {
    const title = xmlField(item, "title");
    const publishedAt = xmlField(item, "pubDate");
    const timestamp = new Date(publishedAt);
    const categories = [...item.matchAll(/<category(?:\s[^>]*)?>([\s\S]*?)<\/category>/gi)].map((match) => decodeXmlText(match[1]).trim());
    if (!title || Number.isNaN(timestamp.getTime()) || timestamp < windowStart || timestamp > new Date(windowEnd.getTime() + 86400000 - 1)) return [];
    if (!terms.some((term) => `${title} ${categories.join(" ")}`.toLowerCase().includes(term))) return [];
    let url;
    try { url = new URL(xmlField(item, "link")); } catch { return []; }
    if (url.protocol !== "https:" || url.hostname !== new URL(source.url).hostname) return [];
    url.hash = "";
    return [{
      id: `rss-${createHash("sha256").update(url.href).digest("hex").slice(0, 20)}`,
      companyId: source.companyId,
      companyName: source.companyName,
      sourceName: source.companyName,
      sourceType: "company",
      publishedAt: timestamp.toISOString(),
      title,
      categories,
      sourceUrl: url.href,
      reviewStatus: "pending",
    }];
  });
}

function safeError(error) {
  if (error?.name === "TimeoutError") return "timeout";
  if (Number.isInteger(error?.status)) return `http_${error.status}`;
  if (["ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT"].includes(error?.cause?.code)) return error.cause.code.toLowerCase();
  return "invalid_response";
}

async function collectSecCandidates({ sources, asOf = new Date(), days = 30, fetchImpl = fetch, userAgent, wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)) }) {
  if (!userAgent || !userAgent.includes("@")) {
    throw new Error("CHIP_PULSE_SEC_USER_AGENT must include an organization name and contact email.");
  }
  if (!(asOf instanceof Date) || Number.isNaN(asOf.getTime()) || !Number.isInteger(days) || days < 1 || days > 90) {
    throw new Error("Chip Pulse collection window is invalid.");
  }
  const windowEnd = new Date(Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate()));
  const windowStart = new Date(windowEnd);
  windowStart.setUTCDate(windowStart.getUTCDate() - days);
  const candidates = [];
  const errors = [];
  let succeeded = 0;

  for (const [sourceIndex, source] of sources.entries()) {
    try {
      const isSec = source.kind === "sec-submissions";
      const response = await fetchImpl(isSec ? secSubmissionUrl(source.cik) : source.url, {
        headers: {
          Accept: isSec ? "application/json" : "application/rss+xml, application/xml, text/xml",
          "User-Agent": isSec ? userAgent : "ManufacturingCompassFeed/1.0",
        },
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) {
        const error = new Error("SEC request failed.");
        error.status = response.status;
        throw error;
      }
      if (isSec) {
        candidates.push(...normalizeSecFilings(await response.json(), source, windowStart, windowEnd));
      } else {
        const xml = await response.text();
        if (xml.length > 2_000_000) throw new Error("Official RSS response is too large.");
        candidates.push(...normalizeRssItems(xml, source, windowStart, windowEnd));
      }
      succeeded += 1;
    } catch (error) {
      errors.push({ companyId: source.companyId, code: safeError(error) });
    }
    if (sourceIndex < sources.length - 1) await wait(125);
  }

  const uniqueCandidates = [...new Map(candidates.map((candidate) => [candidate.id, candidate])).values()]
    .sort((left, right) => (right.filedAt ?? right.publishedAt).localeCompare(left.filedAt ?? left.publishedAt) || left.companyId.localeCompare(right.companyId));
  return {
    schemaVersion: 1,
    status: errors.length === 0 ? "success" : succeeded > 0 ? "partial" : "failed",
    generatedAt: asOf.toISOString(),
    windowStart: windowStart.toISOString(),
    windowEnd: windowEnd.toISOString(),
    sources: { attempted: sources.length, succeeded, failed: errors.length },
    candidates: uniqueCandidates,
    errors,
  };
}

function writeJsonAtomic(target, value) {
  const temporary = `${target}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  fs.renameSync(temporary, target);
}

function writeSnapshotSafely(snapshot, outputDirectory = defaultOutputDirectory) {
  if (snapshot?.schemaVersion !== 1 || snapshot.sources?.succeeded < 1 || snapshot.status === "failed") {
    throw new Error("No successful source response. Existing Chip Pulse snapshot was preserved.");
  }
  const generatedAt = new Date(snapshot.generatedAt);
  if (Number.isNaN(generatedAt.getTime())) throw new Error("Snapshot timestamp is invalid.");
  const day = generatedAt.toISOString().slice(0, 10);
  const time = generatedAt.toISOString().slice(11, 19).replaceAll(":", "");
  const snapshotDirectory = path.join(outputDirectory, "snapshots", day);
  fs.mkdirSync(snapshotDirectory, { recursive: true });
  const historicalPath = path.join(snapshotDirectory, `${time}.json`);
  if (fs.existsSync(historicalPath)) throw new Error(`Immutable snapshot already exists: ${historicalPath}`);
  writeJsonAtomic(historicalPath, snapshot);
  writeJsonAtomic(path.join(outputDirectory, "current.json"), snapshot);
  return { currentPath: path.join(outputDirectory, "current.json"), historicalPath };
}

function parseArguments(argv) {
  const options = { dryRun: false, days: 30, outputDirectory: defaultOutputDirectory };
  for (const argument of argv) {
    if (argument === "--dry-run") options.dryRun = true;
    else if (argument.startsWith("--days=")) options.days = Number(argument.slice(7));
    else if (argument.startsWith("--output=")) options.outputDirectory = path.resolve(root, argument.slice(9));
    else throw new Error(`Unknown argument: ${argument}`);
  }
  return options;
}

async function main() {
  loadEnvConfig(root, true, { info() {}, error() {} });
  const options = parseArguments(process.argv.slice(2));
  const registry = readRegistry();
  const snapshot = await collectSecCandidates({
    sources: registry.sources,
    days: options.days,
    userAgent: process.env.CHIP_PULSE_SEC_USER_AGENT,
  });
  if (snapshot.status === "failed") throw new Error("All SEC sources failed. Existing snapshot was preserved.");
  const paths = options.dryRun ? null : writeSnapshotSafely(snapshot, options.outputDirectory);
  console.log(JSON.stringify({
    status: snapshot.status,
    sources: snapshot.sources,
    candidates: snapshot.candidates.length,
    dryRun: options.dryRun,
    currentPath: paths ? path.relative(root, paths.currentPath) : null,
  }));
  if (snapshot.status === "partial") process.exitCode = 1;
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : "Chip Pulse update failed.");
    process.exitCode = 1;
  });
}

module.exports = {
  collectSecCandidates,
  normalizeSecFilings,
  normalizeRssItems,
  parseArguments,
  readRegistry,
  secFilingUrl,
  secSubmissionUrl,
  writeSnapshotSafely,
};
