const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { publishSnapshot, validateSnapshot } = require('../../scripts/earnings-publish.cjs');
const original = require('../../src/data/earnings-snapshot.json');

function copy(value) { return JSON.parse(JSON.stringify(value)); }

test('the five published releases have traceable metrics and common themes', () => {
  assert.equal(original.releases.length, 5);
  assert.deepEqual(validateSnapshot(original), []);
  assert.equal(original.releases.find((release) => release.companyId === 'kla').metrics.operatingIncome.status, 'unretrieved');
  assert.equal(original.releases.find((release) => release.companyId === 'tokyo-electron').period.kind, 'quarter');
});

test('missing metric sources and single-company themes are rejected', () => {
  const candidate = copy(original);
  delete candidate.releases[0].metrics.revenue.source;
  candidate.commonThemes[0].evidence = candidate.commonThemes[0].evidence.slice(0, 1);
  const errors = validateSnapshot(candidate);
  assert.ok(errors.some((error) => error.includes('revenue has no valid source')));
  assert.ok(errors.some((error) => error.includes('at least two companies')));
});

test('failed update keeps the last good public snapshot', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'earnings-publish-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const destinationPath = path.join(dir, 'public.json');
  const candidatePath = path.join(dir, 'candidate.json');
  const historyDir = path.join(dir, 'history');
  const oldText = `${JSON.stringify(original)}\n`;
  fs.writeFileSync(destinationPath, oldText);
  const invalid = copy(original);
  invalid.releases[0].documents[0].url = 'http://example.com/insecure';
  fs.writeFileSync(candidatePath, JSON.stringify(invalid));
  assert.throws(() => publishSnapshot({ candidatePath, destinationPath, historyDir }), /invalid or duplicate document/);
  assert.equal(fs.readFileSync(destinationPath, 'utf8'), oldText);
  assert.equal(fs.existsSync(historyDir), false);
});

test('corrected release needs a new version and a valid update archives the old one', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'earnings-version-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const destinationPath = path.join(dir, 'public.json');
  const candidatePath = path.join(dir, 'candidate.json');
  const historyDir = path.join(dir, 'history');
  fs.writeFileSync(destinationPath, JSON.stringify(original));
  const candidate = copy(original);
  candidate.releases[0].editorialNote += ' 訂正。';
  fs.writeFileSync(candidatePath, JSON.stringify(candidate));
  assert.throws(() => publishSnapshot({ candidatePath, destinationPath, historyDir }), /higher version/);
  candidate.releases[0].version += 1;
  fs.writeFileSync(candidatePath, JSON.stringify(candidate));
  assert.equal(publishSnapshot({ candidatePath, destinationPath, historyDir }), 5);
  assert.equal(JSON.parse(fs.readFileSync(destinationPath, 'utf8')).releases[0].version, candidate.releases[0].version);
  assert.equal(fs.readdirSync(historyDir).length, 1);
});
