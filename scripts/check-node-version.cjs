const fs = require('node:fs');
const path = require('node:path');

// Vercel selects a major version; verify the actual executable before building.
const minimum = fs.readFileSync(path.join(__dirname, '../.node-version'), 'utf8').trim();
const required = minimum.split('.').map(Number);
const match = /^v(\d+)\.(\d+)\.(\d+)$/.exec(process.version);
const actual = match?.slice(1).map(Number);
const supported = actual && actual[0] === required[0]
  && (actual[1] > required[1] || (actual[1] === required[1] && actual[2] >= required[2]));

if (!supported) {
  console.error(`[node:check] Node.js ${minimum} or later in the ${required[0]}.x line is required; actual ${process.version}.`);
  process.exitCode = 1;
} else {
  console.log(`[node:check] Node.js ${process.version} (minimum ${minimum})`);
}
