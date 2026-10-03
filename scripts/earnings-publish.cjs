const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const root = path.resolve(__dirname, '..');
const publicPath = path.join(root, 'src/data/earnings-snapshot.json');
const archiveDir = path.join(root, '.private/earnings-snapshots');

function isDate(value) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)); }
function isHttps(value) { try { return new URL(value).protocol === 'https:'; } catch { return false; } }
function isObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }

function validateSnapshot(data) {
  const errors = [];
  if (!isObject(data) || data.schemaVersion !== 1 || !isDate(data.updatedAt) || !Array.isArray(data.releases) || !Array.isArray(data.commonThemes)) return ['snapshot header or arrays are invalid'];
  const ids = new Set();
  const companies = new Set();
  const releaseByCompany = new Map();
  for (const release of data.releases) {
    if (!isObject(release) || typeof release.id !== 'string' || typeof release.companyId !== 'string') { errors.push('release id/companyId is invalid'); continue; }
    const prefix = release.companyId;
    if (ids.has(release.id) || companies.has(prefix)) errors.push(`${prefix}: duplicate id or companyId`);
    ids.add(release.id); companies.add(prefix); releaseByCompany.set(prefix, release);
    if (!isDate(release.announcedAt) || !isDate(release.checkedAt) || release.checkedAt < release.announcedAt || release.checkedAt > data.updatedAt || !Number.isInteger(release.version) || release.version < 1) errors.push(`${prefix}: dates/version are invalid`);
    if (!isObject(release.period) || !['quarter', 'cumulative', 'full-year'].includes(release.period.kind) || !isDate(release.period.end) || (release.period.start !== null && !isDate(release.period.start)) || (release.period.start && release.period.start > release.period.end) || typeof release.period.label !== 'string') errors.push(`${prefix}: period is invalid`);
    if (!['USD', 'EUR', 'JPY'].includes(release.currency) || release.unit !== 'million' || typeof release.accountingStandard !== 'string') errors.push(`${prefix}: currency, unit or accounting standard is invalid`);
    if (!Array.isArray(release.documents) || release.documents.length === 0) { errors.push(`${prefix}: documents are missing`); continue; }
    const documentIds = new Set();
    for (const document of release.documents) {
      if (!isObject(document) || typeof document.id !== 'string' || !isHttps(document.url) || !['html', 'pdf'].includes(document.kind) || documentIds.has(document.id)) errors.push(`${prefix}: invalid or duplicate document`);
      documentIds.add(document.id);
    }
    const checkSource = (source, label) => {
      if (!isObject(source) || typeof source.locator !== 'string' || !source.locator || !((documentIds.has(source.documentId)) || (source.documentId === 'previous' && isHttps(source.url)))) errors.push(`${prefix}: ${label} has no valid source`);
    };
    for (const key of ['revenue', 'operatingIncome', 'revenueYoY']) {
      const metric = release.metrics?.[key];
      if (!isObject(metric) || !['reported', 'unretrieved', 'unpublished'].includes(metric.status)) { errors.push(`${prefix}: ${key} is invalid`); continue; }
      if (metric.status === 'reported') {
        if (typeof metric.value !== 'number' || !Number.isFinite(metric.value)) errors.push(`${prefix}: ${key} value is invalid`);
        checkSource(metric.source, key);
      } else if (typeof metric.reason !== 'string' || !metric.reason) errors.push(`${prefix}: ${key} missing reason`);
    }
    for (const key of ['highlights', 'growth', 'weakness', 'concerns', 'outlook']) {
      if (!Array.isArray(release[key]) || release[key].length === 0) { errors.push(`${prefix}: ${key} is empty`); continue; }
      for (const item of release[key]) {
        if (!isObject(item) || typeof item.text !== 'string' || !item.text) errors.push(`${prefix}: ${key} has empty text`);
        checkSource(item?.source, key);
      }
    }
    if (!Array.isArray(release.highlights) || release.highlights.length !== 3) errors.push(`${prefix}: exactly three highlights are required`);
    if (!isObject(release.change) || typeof release.change.basis !== 'string' || !release.change.basis || !release.change.text) errors.push(`${prefix}: comparison basis is missing`);
    checkSource(release.change?.source, 'change');
    const revision = release.forecastRevision;
    if (!isObject(revision) || !['up', 'flat', 'down', 'unverified', 'unpublished'].includes(revision.status) || !revision.target || !revision.text) errors.push(`${prefix}: forecast revision is invalid`);
    else if (['up', 'flat', 'down'].includes(revision.status)) {
      checkSource(revision.source, 'forecast revision');
      if (revision.previousSource) checkSource(revision.previousSource, 'previous forecast');
    }
    if (!Array.isArray(release.themes) || !Array.isArray(release.unverified) || typeof release.editorialNote !== 'string') errors.push(`${prefix}: themes/coverage/editorial note are invalid`);
  }
  for (const theme of data.commonThemes) {
    if (!isObject(theme) || !Array.isArray(theme.evidence) || new Set(theme.evidence.map((item) => item.companyId)).size < 2) { errors.push('common theme requires at least two companies'); continue; }
    for (const item of theme.evidence) {
      const release = releaseByCompany.get(item.companyId);
      if (!release || !release.themes?.includes(theme.theme) || !release.documents?.some((document) => document.id === item.source?.documentId) || !item.source?.locator) errors.push(`${theme.id}: evidence cannot be resolved`);
    }
  }
  return errors;
}

function publishSnapshot({ candidatePath, destinationPath = publicPath, historyDir = archiveDir }) {
  const current = JSON.parse(fs.readFileSync(destinationPath, 'utf8'));
  const candidate = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
  const errors = validateSnapshot(candidate);
  if (errors.length) throw new Error(errors.join('\n'));
  if (candidate.updatedAt < current.updatedAt) throw new Error('candidate updatedAt predates public snapshot');
  const currentByCompany = new Map(current.releases.map((release) => [release.companyId, release]));
  const candidateByCompany = new Map(candidate.releases.map((release) => [release.companyId, release]));
  for (const [companyId, oldRelease] of currentByCompany) {
    const next = candidateByCompany.get(companyId);
    if (!next) throw new Error(`${companyId}: candidate omits a published company`);
    if (next.version < oldRelease.version || next.checkedAt < oldRelease.checkedAt) throw new Error(`${companyId}: version or checkedAt moved backwards`);
    if (JSON.stringify(next) !== JSON.stringify(oldRelease) && next.version <= oldRelease.version) throw new Error(`${companyId}: changed release needs a higher version`);
  }
  const output = `${JSON.stringify(candidate, null, 2)}\n`;
  fs.mkdirSync(historyDir, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(':', '-');
  fs.writeFileSync(path.join(historyDir, `${stamp}-${randomUUID()}.json`), `${JSON.stringify(current, null, 2)}\n`, { flag: 'wx' });
  const temporaryPath = `${destinationPath}.${randomUUID()}.tmp`;
  try {
    fs.writeFileSync(temporaryPath, output, { flag: 'wx' });
    fs.renameSync(temporaryPath, destinationPath);
  } catch (error) {
    try { fs.unlinkSync(temporaryPath); } catch { /* no temporary file */ }
    throw error;
  }
  return candidate.releases.length;
}

function printCandidates(snapshot) {
  const updates = JSON.parse(fs.readFileSync(path.join(root, 'src/data/chip-pulse-official-updates.json'), 'utf8')).updates;
  const watched = new Set(['asml', 'applied-materials', 'lam-research', 'kla']);
  const released = new Map(snapshot.releases.map((release) => [release.companyId, release.announcedAt]));
  const candidates = updates.filter((update) => watched.has(update.companyId) && update.publishedAt.slice(0, 10) > (released.get(update.companyId) ?? ''));
  console.log(`Newer SEC filing metadata candidates: ${candidates.length}`);
  for (const update of candidates) console.log(`${update.companyId} ${update.publishedAt.slice(0, 10)} ${update.label} ${update.sourceUrl}`);
  console.log('Tokyo Electron: check the official IR calendar manually. SEC metadata is discovery only; earnings facts still need source review.');
}

if (require.main === module) {
  const [mode, candidatePath] = process.argv.slice(2);
  try {
    if (mode === '--check') {
      const current = JSON.parse(fs.readFileSync(publicPath, 'utf8'));
      const errors = validateSnapshot(current);
      if (errors.length) throw new Error(errors.join('\n'));
      console.log(`Validated ${current.releases.length} earnings releases and ${current.commonThemes.length} common themes (${current.updatedAt}).`);
      printCandidates(current);
    } else if (mode === '--candidate' && candidatePath) {
      console.log(`Published ${publishSnapshot({ candidatePath: path.resolve(candidatePath) })} earnings releases.`);
    } else {
      throw new Error('Usage: node scripts/earnings-publish.cjs --check | --candidate path/to/complete-snapshot.json');
    }
  } catch (error) {
    console.error(`Earnings update failed; public snapshot unchanged. ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { validateSnapshot, publishSnapshot };
