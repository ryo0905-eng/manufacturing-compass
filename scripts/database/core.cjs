const crypto = require('node:crypto');

const normalize = value => String(value).normalize('NFKC').replace(/[®™]/g, '').replace(/\s+/g, ' ').trim();
const fingerprint = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const todayJst = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
const allowedHosts = new Set(['www.asml.com', 'www.tel.com', 'www.disco.co.jp', 'www.appliedmaterials.com']);
function officialUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.port && allowedHosts.has(url.hostname);
  } catch { return false; }
}
function sourceText(html) {
  return normalize(html.replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n)))
    .replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'"));
}
function suspended(record, stops) {
  return stops.recordIds.includes(record.id) || stops.manufacturerIds.includes(record.manufacturerId)
    || record.processIds.some(id => stops.processIds.includes(id)) || record.sources.some(s => stops.sourceIds.includes(s.id));
}
function inspect(catalog, registry, snapshots = {}, today = todayJst()) {
  if (catalog?.version !== 1 || !Array.isArray(catalog.records)) throw Error('Unsupported catalog: version 1 / records[] required');
  const ids = new Set(), names = new Map();
  const duplicates = new Set();
  const idCounts = new Map();
  for (const record of catalog.records) {
    idCounts.set(record.id, (idCounts.get(record.id) ?? 0) + 1);
    const key = `${record.manufacturerId}:${normalize(record.name).toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')}`;
    if (names.has(key)) { duplicates.add(record.id); duplicates.add(names.get(key)); }
    names.set(key, record.id);
  }
  return catalog.records.map(record => {
    const errors = [], warnings = [];
    const fail = message => errors.push(message);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.id ?? '') || ids.has(record.id) || idCounts.get(record.id) > 1) fail('invalid-or-duplicate-id');
    ids.add(record.id);
    if (duplicates.has(record.id)) fail('duplicate-manufacturer-model');
    for (const field of ['name', 'englishName', 'category', 'summary']) if (typeof record[field] !== 'string' || !record[field].trim()) fail(`missing:${field}`);
    if (record.kind !== 'equipment') fail('unsupported-kind: initial release supports equipment only');
    if (!Array.isArray(record.aliases) || record.aliases.some(a => typeof a !== 'string')) fail('invalid-aliases');
    if (!registry.company.includes(record.manufacturerId)) fail('unknown-manufacturer');
    if (!Array.isArray(record.processIds) || !record.processIds.length || record.processIds.some(id => !registry.process.includes(id))) fail('unknown-process');
    const validDate = date => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date && date <= today;
    if (!validDate(record.lastChecked)) fail('invalid-check-date');
    if (Date.parse(today) - Date.parse(record.lastChecked) > 180 * 86400000) warnings.push('review-older-than-180-days');
    if (!['current', 'changed', 'stale'].includes(record.updateStatus)) fail('invalid-update-status');
    else if (record.updateStatus !== 'current') fail('source-review-pending');
    const sources = new Map();
    if (!Array.isArray(record.sources) || !record.sources.length) fail('missing-sources');
    for (const source of record.sources ?? []) {
      if (!source.id || sources.has(source.id)) fail('duplicate-or-missing-source-id');
      sources.set(source.id, source);
      if (!officialUrl(source.url)) fail(`non-allowlisted-source:${source.id}`);
      const manufacturerHosts = { asml: 'www.asml.com', 'tokyo-electron': 'www.tel.com', disco: 'www.disco.co.jp', 'applied-materials': 'www.appliedmaterials.com' };
      if (officialUrl(source.url) && new URL(source.url).hostname !== manufacturerHosts[record.manufacturerId]) fail(`manufacturer-source-mismatch:${source.id}`);
      if (!validDate(source.checkedAt) || !source.title || !source.publisher) fail(`invalid-source:${source.id}`);
      const snapshot = snapshots[source.id];
      if (!snapshot || snapshot.url !== source.url || !snapshot.ok) fail(`source-not-fetched:${source.id}`);
      else if (snapshot.hash !== fingerprint(snapshot.text)) fail(`snapshot-integrity-error:${source.id}`);
      else if (snapshot.changed) fail(`source-changed:${source.id}`);
      else if (!normalize(snapshot.text).includes(normalize(record.name))) fail(`model-not-in-source:${source.id}`);
    }
    const checkEvidence = (evidence, value, field) => {
      if (!evidence?.quote || !evidence.locator || !sources.has(evidence.sourceId)) return fail(`missing-evidence:${field}`);
      const snapshot = snapshots[evidence.sourceId];
      if (!snapshot?.text || !normalize(snapshot.text).includes(normalize(evidence.quote))) fail(`quote-not-in-source:${field}`);
      if (value && !normalize(evidence.quote).includes(normalize(value))) fail(`value-not-in-quote:${field}`);
      if (value && /^\d/.test(value)) {
        const literal = normalize(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (!new RegExp(`(?<![\\d.])${literal}(?![\\d.])`).test(normalize(evidence.quote))) fail(`numeric-token-mismatch:${field}`);
        if (!/\d\s*(mm|nm|µm|um|NA|WPH|wph|%|mJ\/cm2)\b/.test(normalize(value))) fail(`numeric-unit-unconfirmed:${field}`);
      }
    };
    if (!record.facts || !Object.keys(record.facts).length) fail('missing-facts');
    for (const [field, fact] of Object.entries(record.facts ?? {})) {
      if (fact.status === 'verified') {
        if (typeof fact.value !== 'string' || !fact.value.trim() || !fact.condition) fail(`invalid-fact:${field}`);
        checkEvidence(fact.evidence, fact.value, field);
      } else if (!['unconfirmed', 'not-public', 'not-applicable'].includes(fact.status) || !fact.reason) fail(`invalid-unknown:${field}`);
    }
    if (!record.relations?.some(r => r.type === 'manufacturer' && r.target.kind === 'company' && r.target.id === record.manufacturerId)) fail('missing-manufacturer-relation');
    for (const relation of record.relations ?? []) {
      if (!registry[relation.target?.kind]?.includes(relation.target.id)) fail('dangling-relation');
      if (!['manufacturer', 'process-use', 'technical-context', 'documented-transaction'].includes(relation.type)) fail('unknown-relation-type');
      checkEvidence(relation.evidence, undefined, `relation:${relation.target?.id}`);
    }
    for (const id of record.processIds ?? []) if (!record.relations?.some(r => r.type === 'process-use' && r.target.kind === 'process' && r.target.id === id)) fail('missing-process-relation');
    if (record.verification?.status !== 'verified' || !record.verification?.method) fail('semantic-verification-pending');
    if (!['published', 'draft', 'suspended'].includes(record.publication?.status) || typeof record.publication?.index !== 'boolean') fail('invalid-publication');
    return { id: record.id, fingerprint: fingerprint(record), errors, warnings, verification: errors.length ? 'hold' : 'evidence-matched', publication: record.publication?.status };
  });
}
// Random audit selection is reproducible from a recorded random seed, independent of catalog order.
function auditSample(ids, seed, count) {
  return [...ids].sort((a, b) => fingerprint([seed, a]).localeCompare(fingerprint([seed, b]))).slice(0, count);
}
module.exports = { normalize, fingerprint, todayJst, officialUrl, sourceText, suspended, inspect, auditSample };
