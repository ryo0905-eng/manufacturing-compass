#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const ts = require('typescript');
const { fingerprint, todayJst, officialUrl, sourceText, inspect, suspended, auditSample } = require('./core.cjs');
const root = path.resolve(__dirname, '../..');
const cache = path.join(root, '.cache/semiconductor-database');
const dataDir = path.join(root, 'src/data/database');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function atomic(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(temp, file);
}
function loadTs(relative) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(root, relative), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports });
  return exports;
}
const registry = { company: loadTs('src/data/companies.ts').companies.map(c => c.id), process: loadTs('src/data/database/processes.ts').equipmentProcesses.map(p => p.id) };
async function collect(source) {
  if (!officialUrl(source.url)) throw Error('Source host is not allowlisted');
  // Reject redirects outside the allowlist. No arbitrary URLs from AI are fetched.
  let url = source.url;
  for (let redirects = 0; redirects < 4; redirects++) {
    if (!officialUrl(url)) throw Error('Redirect host is not allowlisted');
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(12000), headers: { 'User-Agent': 'ManufacturingCompass-SourceCheck/1.0' } });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      url = new URL(response.headers.get('location'), url).href; continue;
    }
    if (!response.ok) throw Error(`HTTP ${response.status}`);
    if (!response.headers.get('content-type')?.includes('text/html')) throw Error('HTML adapter required; PDF is held');
    const reader = response.body.getReader();
    let bytes = 0; const parts = [];
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      bytes += value.length; if (bytes > 4_000_000) { await reader.cancel(); throw Error('Source exceeds 4 MB'); }
      parts.push(value);
    }
    const text = sourceText(Buffer.concat(parts).toString('utf8'));
    if (text.length < 100) throw Error('Empty or blocked source');
    return { url: source.url, finalUrl: url, ok: true, text, hash: fingerprint(text), fetchedAt: new Date().toISOString() };
  }
  throw Error('Too many redirects');
}
async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) { console.log('node scripts/database/run.cjs [--fetch [--refresh]] [--release] [--input candidates.json] [--accept-source-change SOURCE_ID]\nDefault: offline evidence check + diff + random audit report. --release writes only approved records; never enables index. --fetch resumes recent successful snapshots; --refresh forces fetching.'); return; }
  const inputFlag = args.indexOf('--input');
  const catalog = read(inputFlag >= 0 ? path.resolve(args[inputFlag + 1]) : path.join(dataDir, 'equipment.json'));
  if (inputFlag >= 0 && args.includes('--release')) throw Error('Candidate input cannot release records');
  if (inputFlag >= 0) for (const record of catalog.records ?? []) {
    record.publication = { status: 'draft', index: false };
    record.verification = { status: 'unconfirmed', method: 'Imported extraction; semantic verification pending' };
  }
  if (inputFlag >= 0) atomic(path.join(cache, 'candidates', fingerprint(catalog) + '.json'), catalog);
  const stops = read(path.join(dataDir, 'suspensions.json'));
  const oldRelease = fs.existsSync(path.join(dataDir, 'release.json')) ? read(path.join(dataDir, 'release.json')) : { records: [] };
  const deadline = Date.now() + 150000;
  const acceptAt = args.indexOf('--accept-source-change');
  const acceptedSourceId = acceptAt >= 0 ? args[acceptAt + 1] : null;
  if (acceptAt >= 0 && (!acceptedSourceId || inputFlag >= 0)) throw Error('Explicit reviewed source ID required');
  const snapshots = {};
  const log = [];
  const sources = new Map();
  for (const record of catalog.records ?? []) for (const source of record.sources ?? []) {
    if (!/^[a-z0-9-]+$/.test(source.id)) throw Error('Invalid source ID');
    if (sources.has(source.id) && sources.get(source.id).url !== source.url) throw Error('Source ID collision');
    sources.set(source.id, source);
  }
  for (const source of sources.values()) {
    const file = path.join(cache, 'sources', source.id + '.json');
    const previous = fs.existsSync(file) ? read(file) : null;
    if (!args.includes('--fetch')) { if (previous) snapshots[source.id] = previous; continue; }
    // Resume large batches without repeatedly fetching their completed prefix.
    if (!args.includes('--refresh') && previous?.ok && previous.url === source.url && Date.now() - Date.parse(previous.fetchedAt) < 6 * 3600000) {
      snapshots[source.id] = previous;
      log.push({ sourceId: source.id, status: 'cached-recent', hash: previous.hash });
      continue;
    }
    try {
      if (Date.now() >= deadline) throw Error('150-second collection budget reached; resume with --fetch');
      const snapshot = await collect(source);
      const baseline = oldRelease.sourceHashes?.[source.id];
      snapshot.changed = !!baseline && baseline !== snapshot.hash;
      if (previous?.hash && previous.hash !== snapshot.hash) atomic(path.join(cache, 'history', source.id + '-' + previous.hash + '.json'), previous);
      atomic(file, snapshot); snapshots[source.id] = snapshot;
      log.push({ sourceId: source.id, status: snapshot.changed ? 'changed' : 'fetched', hash: snapshot.hash });
    } catch (error) {
      // Preserve old snapshot for recovery; latest failure blocks this run's release.
      const failure = { url: source.url, ok: false, error: error.message, fetchedAt: new Date().toISOString() };
      if (previous?.ok) atomic(path.join(cache, 'history', source.id + '-' + previous.hash + '.json'), previous);
      atomic(file, failure); snapshots[source.id] = failure;
      log.push({ sourceId: source.id, status: 'failed', error: error.message });
    }
  }
  if (acceptedSourceId) {
    const snapshot = snapshots[acceptedSourceId];
    const linked = catalog.records.filter(r => r.sources?.some(s => s.id === acceptedSourceId));
    if (!snapshot?.ok || !linked.length || linked.some(r => r.verification?.status !== 'verified' || r.updateStatus !== 'current' || r.lastChecked !== todayJst())) throw Error('Re-check all linked records and dates before accepting source change');
    snapshot.changed = false;
    atomic(path.join(cache, 'sources', acceptedSourceId + '.json'), snapshot);
  }
  const results = inspect(catalog, registry, snapshots);
  // A provider-neutral packet for offline extraction. Not served, not sent to an API.
  atomic(path.join(cache, 'extraction-input.json'), { schemaVersion: 1, instruction: 'Return version:1 and records[]. Use the existing schema, exact evidence quotes and locators. Unknown facts remain unconfirmed. All output is draft; never infer specifications.', sources: [...sources.values()].map(source => ({ ...source, snapshot: snapshots[source.id] ?? null })) });
  const seed = crypto.randomBytes(16).toString('hex');
  const report = {
    checkedAt: new Date().toISOString(), inputHash: fingerprint(catalog), seed, log, results,
    diff: { added: results.filter(r => !oldRelease.records.some(p => p.id === r.id)).map(r => r.id), changed: results.filter(r => oldRelease.records.some(p => p.id === r.id && p.fingerprint !== r.fingerprint)).map(r => r.id), removed: oldRelease.records.filter(p => !results.some(r => r.id === p.id)).map(p => p.id) },
    audit: { status: 'pending', ids: auditSample(results.map(r => r.id), seed, Math.min(5, Math.max(1, Math.ceil(results.length * .1)))), instruction: '原文と機種の対応、条件・単位・意味を独立照合。重大誤りはsuspensions.jsonで同一メーカー・出典・工程群も停止。' },
  };
  atomic(path.join(cache, 'reports', report.checkedAt.replace(/[:.]/g, '-') + '.json'), report);
  if (args.includes('--release')) {
    const records = results.filter(r => !r.errors.length && r.publication === 'published' && !suspended(catalog.records.find(x => x.id === r.id), stops));
    // Failed and changed sources are excluded from the generated release, including prior releases.
    atomic(path.join(dataDir, 'release.json'), { version: 1, generatedAt: report.checkedAt, catalogHash: fingerprint(catalog), records: records.map(({ id, fingerprint }) => ({ id, fingerprint })), sourceHashes: { ...oldRelease.sourceHashes, ...Object.fromEntries(Object.entries(snapshots).filter(([, s]) => s.ok && !s.changed).map(([id, s]) => [id, s.hash])) } });
  }
  console.log(JSON.stringify({ records: results.length, evidenceMatched: results.filter(r => !r.errors.length).length, held: results.filter(r => r.errors.length).map(r => ({ id: r.id, errors: r.errors })), audit: report.audit, releaseWritten: args.includes('--release') }, null, 2));
  if (results.some(r => r.errors.length)) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
