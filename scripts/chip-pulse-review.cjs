// Read-only triage for collected candidates against published Chip Pulse signals.
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const candidatePath = path.join(root, ".private/chip-pulse-candidates/current.json");
const signalsPath = path.join(root, "src/data/chip-pulse.ts");
const aliasesPath = path.join(root, "src/data/chip-pulse-source-aliases.json");

function canonicalSourceUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("Source URL must use HTTPS.");
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (key.toLowerCase().startsWith("utm_")) url.searchParams.delete(key);
  }
  url.pathname = url.pathname.replace(/\/$/, "") || "/";
  url.searchParams.sort();
  return url.href;
}

function extractPublishedSignals(sourceText) {
  const file = ts.createSourceFile("chip-pulse.ts", sourceText, ts.ScriptTarget.Latest, true);
  const declaration = file.statements
    .filter(ts.isVariableStatement)
    .flatMap((statement) => [...statement.declarationList.declarations])
    .find((entry) => ts.isIdentifier(entry.name) && entry.name.text === "pulseSignals");
  if (!declaration || !declaration.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) {
    throw new Error("Published Chip Pulse signals could not be read.");
  }
  const signals = declaration.initializer.elements.map((element) => {
    if (!ts.isObjectLiteralExpression(element)) throw new Error("Published Chip Pulse signal is not static.");
    const values = new Map(element.properties.map((property) => {
      if (!ts.isPropertyAssignment(property)) throw new Error("Published Chip Pulse signal contains an unsupported property.");
      const name = ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) ? property.name.text : "";
      return [name, property.initializer];
    }));
    const stringValue = (name) => {
      const value = values.get(name);
      if (!value || !ts.isStringLiteral(value)) throw new Error(`Published Chip Pulse ${name} must be a static string.`);
      return value.text;
    };
    return { id: stringValue("id"), sourceUrl: stringValue("sourceUrl") };
  });
  if (new Set(signals.map((signal) => signal.id)).size !== signals.length) throw new Error("Published Chip Pulse signal IDs are duplicated.");
  return signals;
}

function reviewCandidates(snapshot, publishedSignals, aliases) {
  if (snapshot?.schemaVersion !== 1 || !Array.isArray(snapshot.candidates)) throw new Error("Candidate snapshot is invalid.");
  if (aliases?.schemaVersion !== 1 || !Array.isArray(aliases.aliases)) throw new Error("Source alias registry is invalid.");
  const ids = new Set(publishedSignals.map((signal) => signal.id));
  const byUrl = new Map();
  for (const signal of publishedSignals) {
    const url = canonicalSourceUrl(signal.sourceUrl);
    if (byUrl.has(url)) throw new Error(`Published source URL is duplicated: ${url}`);
    byUrl.set(url, { signalId: signal.id, match: "source-url" });
  }
  for (const alias of aliases.aliases) {
    if (!ids.has(alias.signalId)) throw new Error(`Source alias points to an unknown signal: ${alias.signalId}`);
    const url = canonicalSourceUrl(alias.sourceUrl);
    if (byUrl.has(url)) throw new Error(`Source alias URL is duplicated: ${url}`);
    byUrl.set(url, { signalId: alias.signalId, match: "confirmed-alias" });
  }
  const published = [];
  const needsReview = [];
  for (const candidate of snapshot.candidates) {
    const entry = {
      candidateId: candidate.id,
      companyId: candidate.companyId,
      date: candidate.filedAt ?? candidate.publishedAt,
      title: candidate.title ?? candidate.description ?? candidate.form ?? "Untitled filing",
      sourceUrl: candidate.sourceUrl,
    };
    const matched = byUrl.get(canonicalSourceUrl(candidate.sourceUrl));
    if (matched) published.push({ ...entry, ...matched });
    else needsReview.push(entry);
  }
  return {
    generatedAt: snapshot.generatedAt,
    summary: { candidates: snapshot.candidates.length, published: published.length, needsReview: needsReview.length },
    published,
    needsReview,
  };
}

function main() {
  const snapshot = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
  const publishedSignals = extractPublishedSignals(fs.readFileSync(signalsPath, "utf8"));
  const aliases = JSON.parse(fs.readFileSync(aliasesPath, "utf8"));
  console.log(JSON.stringify(reviewCandidates(snapshot, publishedSignals, aliases), null, 2));
}

if (require.main === module) {
  try { main(); } catch (error) {
    console.error(error instanceof Error ? error.message : "Chip Pulse review failed.");
    process.exitCode = 1;
  }
}

module.exports = { canonicalSourceUrl, extractPublishedSignals, reviewCandidates };
