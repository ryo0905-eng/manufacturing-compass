// Publish only official metadata from newly detected disclosures; no inferred summary or sentiment.
const fs = require("node:fs");
const path = require("node:path");
const { extractPublishedSignals, reviewCandidates } = require("./chip-pulse-review.cjs");

const root = path.resolve(__dirname, "..");
const candidatePath = path.join(root, ".private/chip-pulse-candidates/current.json");
const signalsPath = path.join(root, "src/data/chip-pulse.ts");
const aliasesPath = path.join(root, "src/data/chip-pulse-source-aliases.json");
const registryPath = path.join(root, "src/data/chip-pulse-sources.json");
const outputPath = path.join(root, "src/data/chip-pulse-official-updates.json");

function buildOfficialUpdates(snapshot, publishedSignals, aliases, registry) {
  if (snapshot.status !== "success" || snapshot.sources?.failed !== 0) {
    throw new Error("Source collection is incomplete. Existing public updates were preserved.");
  }
  const companyNames = new Map(registry.sources.map((source) => [source.companyId, source.companyName]));
  const reviewed = reviewCandidates(snapshot, publishedSignals, aliases);
  return {
    schemaVersion: 1,
    generatedAt: snapshot.generatedAt,
    updates: reviewed.newOfficialUpdates.map((candidate) => {
      const source = snapshot.candidates.find((entry) => entry.id === candidate.candidateId);
      const companyName = companyNames.get(candidate.companyId);
      if (!source || !companyName) throw new Error(`Official update has an unknown company: ${candidate.companyId}`);
      return {
        id: candidate.candidateId,
        companyId: candidate.companyId,
        companyName,
        publishedAt: candidate.date,
        title: source.sourceType === "company" ? source.title : `${companyName}がSECへForm ${source.form}を提出`,
        label: source.sourceType === "company" ? "企業公式発表" : `SEC Form ${source.form}`,
        sourceUrl: candidate.sourceUrl,
      };
    }),
  };
}

function main() {
  const snapshot = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
  const signals = extractPublishedSignals(fs.readFileSync(signalsPath, "utf8"));
  const aliases = JSON.parse(fs.readFileSync(aliasesPath, "utf8"));
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  const result = buildOfficialUpdates(snapshot, signals, aliases, registry);
  if (fs.existsSync(outputPath)) {
    const previous = JSON.parse(fs.readFileSync(outputPath, "utf8"));
    if (JSON.stringify(previous.updates) === JSON.stringify(result.updates)) {
      console.log(JSON.stringify({ officialUpdates: result.updates.length, changed: false }));
      return;
    }
  }
  const temporaryPath = `${outputPath}.tmp-${process.pid}`;
  try {
    fs.writeFileSync(temporaryPath, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
    fs.renameSync(temporaryPath, outputPath);
  } finally {
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
  }
  console.log(JSON.stringify({ generatedAt: result.generatedAt, officialUpdates: result.updates.length, changed: true }));
}

if (require.main === module) {
  try { main(); } catch (error) {
    console.error(error instanceof Error ? error.message : "Chip Pulse publication failed.");
    process.exitCode = 1;
  }
}

module.exports = { buildOfficialUpdates };
