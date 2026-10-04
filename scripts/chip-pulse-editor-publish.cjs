// Operator/agent-verified publication. This command does not collect or generate prose.
const fs = require('node:fs');
const path = require('node:path');
const { save, inEdition } = require('./chip-pulse-media.cjs');
const { canonicalSourceUrl } = require('./chip-pulse-review.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'src/data/chip-pulse-media.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const normalize = text => text.replace(/\s+/g, ' ').trim();
const requiredText = (value, name) => { if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing ${name}`); };
function date(value, name) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T.*(?:Z|[+-]\d\d:\d\d))?$/.test(value) || !Number.isFinite(Date.parse(value))) throw new Error(`Invalid ${name}`);
  const day = value.slice(0,10);
  if (new Date(`${day}T00:00:00Z`).toISOString().slice(0,10) !== day) throw new Error(`Invalid calendar date: ${name}`);
}
function https(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid source URL');
}
function validateArticle(a) {
  if (typeof a.id !== 'string' || !/^[a-z0-9][a-z0-9-]+$/.test(a.id) || ['earnings'].includes(a.id)) throw new Error('Invalid article ID');
  for (const key of ['sourceId','sourceName','sourceUrl','title','summary']) requiredText(a[key], key);
  https(a.sourceUrl);
  for (const key of ['publishedAt','firstPublishedAt','updatedAt']) date(a[key], key);
  if (!['instant','day'].includes(a.datePrecision) || (a.datePrecision === 'day') !== (a.publishedAt.length === 10)) throw new Error('Date precision mismatch');
  if (Date.parse(a.updatedAt) < Date.parse(a.firstPublishedAt) || Date.parse(a.publishedAt) > Date.parse(a.updatedAt)) throw new Error('Date order mismatch');
  if (!Number.isInteger(a.version) || a.version < 1) throw new Error('Invalid version');
  if (!['plan','prototype','production','result'].includes(a.stage)) throw new Error('Invalid stage');
  if (!['editor-verified','ai-evidence-checked'].includes(a.validation)) throw new Error('Invalid validation');
  for (const key of ['facts','unknowns','fields','processes','companyNames','relatedIds']) {
    if (!Array.isArray(a[key]) || a[key].some(x => typeof x !== 'string' || !x.trim())) throw new Error(`Invalid ${key}`);
  }
  if (!a.companyNames.length || a.fields.some(x => !['equipment','design-manufacturing','memory','packaging'].includes(x)) || a.processes.some(x => !['Design','Lithography','Deposition','Etch','Metrology','Assembly','Test','Materials'].includes(x))) throw new Error('Invalid classification');
  if (!Array.isArray(a.evidence) || !a.evidence.length) throw new Error('Evidence required');
  for (const e of a.evidence) { requiredText(e.locator,'locator'); requiredText(e.quote,'quote'); }
  if (!Array.isArray(a.history) || a.history.length !== a.version - 1) throw new Error('Invalid history');
  a.history.forEach((h, i) => { if (h.version !== i + 1) throw new Error('Invalid history version'); date(h.updatedAt,'history'); requiredText(h.title,'history title'); requiredText(h.summary,'history summary'); });
  if (a.visual) {
    if (!['process','metric','stage','allocation'].includes(a.visual.kind)) throw new Error('Invalid visual kind');
    requiredText(a.visual.label,'visual label'); requiredText(a.visual.note,'visual note');
    if (!Array.isArray(a.visual.values) || !a.visual.values.length || a.visual.values.length > 4) throw new Error('Invalid visual values');
    for (const v of a.visual.values) {
      requiredText(v.label,'visual value label'); requiredText(v.value,'visual value');
      if (v.active !== undefined && typeof v.active !== 'boolean') throw new Error('Invalid visual emphasis');
    }
  }
}
function validateSnapshot(snapshot) {
  const ids = new Set(), urls = new Set();
  for (const a of snapshot.articles) {
    validateArticle(a);
    const url = canonicalSourceUrl(a.sourceUrl);
    if (ids.has(a.id) || urls.has(url)) throw new Error('Duplicate article');
    ids.add(a.id); urls.add(url);
  }
  for (const a of snapshot.articles) if (a.relatedIds.some(id => id === a.id || !ids.has(id))) throw new Error('Broken related article');
  if (snapshot.edition.articleIds.some(id => !ids.has(id))) throw new Error('Broken edition reference');
  return snapshot;
}
function buildPublication(previous, batch, now) {
  if (!Array.isArray(batch.articles) || !batch.articles.length || !Array.isArray(batch.documents)) throw new Error('Articles and checked source excerpts required');
  const next = structuredClone(previous);
  const batchIds = new Set();
  for (const entry of batch.articles) {
    if (batchIds.has(entry.id)) throw new Error('Duplicate batch ID');
    batchIds.add(entry.id);
    if (entry.review?.facts !== true || entry.review?.numbers !== true || entry.review?.redaction !== true) throw new Error('Editorial checks required');
    const { review, ...input } = entry;
    const source = batch.documents.find(d => d.url === input.sourceUrl);
    if (!source || !input.evidence?.length || input.evidence.some(e => !normalize(source.text).includes(normalize(e.quote)))) throw new Error('Evidence not found in reviewed source');
    const old = next.articles.find(a => a.id === input.id);
    if (old && input.version !== old.version + 1 || !old && input.version !== 1) throw new Error('Version must advance exactly once');
    const article = { ...input, validation: 'editor-verified', firstPublishedAt: old?.firstPublishedAt ?? now, updatedAt: now,
      history: old ? [...old.history, { version: old.version, updatedAt: old.updatedAt, title: old.title, summary: old.summary }] : [] };
    delete article.sourceCheck;
    if (old) next.articles[next.articles.indexOf(old)] = article;
    else next.articles.push(article);
  }
  const urls = new Set(next.articles.map(a => canonicalSourceUrl(a.sourceUrl)));
  next.updates = next.updates.filter(u => !urls.has(canonicalSourceUrl(u.sourceUrl)));
  next.edition.articleIds = next.articles.filter(a => inEdition(a,next.edition)).map(a => a.id);
  next.contentUpdatedAt = now;
  return validateSnapshot(next);
}
function main() {
  const previous = read(output);
  if (process.argv.includes('--check')) { validateSnapshot(previous); console.log(`Checked ${previous.articles.length} articles`); return; }
  const index = process.argv.indexOf('--candidate');
  if (index < 0 || !process.argv[index+1]) throw new Error('Use --candidate <private JSON> or --check');
  const now = new Date().toISOString();
  const next = buildPublication(previous, read(path.resolve(process.argv[index+1])), now);
  // Archive before replacement. No network calls, credentials, or automatic git operations.
  save(path.join(root,'.private/chip-pulse-editor-archive',`${now.replace(/[:.]/g,'-')}.json`),previous);
  save(output,next);
  console.log(`Published checked batch; ${next.articles.length} articles total`);
}
if (require.main === module) { try { main(); } catch(e) { console.error(e.message); process.exitCode=1; } }
module.exports = { validateArticle, validateSnapshot, buildPublication };
