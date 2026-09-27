const fs = require("node:fs");
const path = require("node:path");

const statusPath = path.resolve(__dirname, "../src/data/chip-pulse-refresh-status.json");
const status = JSON.parse(fs.readFileSync(statusPath, "utf8"));

if (status.schemaVersion !== 2 || !["success", "partial", "failed"].includes(status.status)) {
  console.error("Chip Pulse refresh status is invalid.");
  process.exitCode = 1;
} else if (status.status !== "success") {
  console.error(`Chip Pulse refresh completed with status: ${status.status}. Previous public data was preserved.`);
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ status: status.status, lastSuccessfulAt: status.lastSuccessfulAt, sources: status.sources }));
}
