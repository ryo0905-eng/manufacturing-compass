const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { checkRedaction } = require('./public-content-check.cjs');
const { isDate, isHttps, earningsCandidates } = require('./earnings-publish.cjs');
const root = path.resolve(__dirname, '..');
const destination = path.join(root, 'src/data/watch-calendar.json');
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const instant = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value));
const text = value => typeof value === 'string' && value.trim().length > 0;

function validateCalendar(data, earnings, media, now = new Date().toISOString()) {
  const errors = [];
  if (data?.schemaVersion !== 1 || !instant(data.updatedAt) || Date.parse(data.updatedAt) > Date.parse(now) || !Array.isArray(data.companies) || !Array.isArray(data.events) || !Array.isArray(data.reviews)) return ['Invalid watch calendar header'];
  const ids = new Set(earnings.releases.map(release => release.companyId));
  const checked = new Set();
  const checkInstant = value => instant(value) && Date.parse(value) <= Date.parse(data.updatedAt);
  for (const check of data.companies) {
    if (!ids.has(check.companyId) || checked.has(check.companyId) || !isHttps(check.sourceUrl) || !['verified', 'pending', 'failed'].includes(check.state)) errors.push('Invalid or duplicate company check');
    checked.add(check.companyId);
    if (check.checkedAt !== null && !checkInstant(check.checkedAt) || check.retrievedAt !== null && !checkInstant(check.retrievedAt)) errors.push(`${check.companyId}: invalid check timestamps`);
    if (check.retrievedAt && check.checkedAt && Date.parse(check.retrievedAt) > Date.parse(check.checkedAt)) errors.push(`${check.companyId}: checked before retrieval`);
    if (check.state === 'verified' && (!check.checkedAt || !check.retrievedAt || !isDate(check.latestAnnouncedAt) || !isHttps(check.latestSourceUrl))) errors.push(`${check.companyId}: verified check requires evidence`);
    if (check.latestAnnouncedAt !== null && !isDate(check.latestAnnouncedAt) || check.latestSourceUrl !== null && !isHttps(check.latestSourceUrl)) errors.push(`${check.companyId}: invalid latest release evidence`);
    if (check.checkedAt && check.latestAnnouncedAt > check.checkedAt.slice(0, 10)) errors.push(`${check.companyId}: future release check`);
    if (check.notice && (!isDate(check.notice.announcedAt) || !isHttps(check.notice.sourceUrl) || !text(check.notice.text))) errors.push(`${check.companyId}: invalid supplemental notice`);
  }
  if (checked.size !== ids.size) errors.push('Every published company requires a check record');
  const events = new Set();
  for (const event of data.events) {
    if (!text(event.id) || events.has(event.id) || !ids.has(event.companyId) || !['earnings', 'monthly'].includes(event.kind) || !text(event.period) || !isHttps(event.sourceUrl) || !['scheduled', 'unpublished', 'unverified'].includes(event.status)) errors.push('Invalid or duplicate calendar event');
    events.add(event.id);
    try { new Intl.DateTimeFormat('ja-JP', { timeZone: event.timezone }).format(); } catch { errors.push(`${event.id}: invalid timezone`); }
    if (!text(event.timezone)) errors.push(`${event.id}: missing timezone`);
    if (event.tentative !== undefined && typeof event.tentative !== 'boolean') errors.push(`${event.id}: invalid tentative flag`);
    if (event.status === 'scheduled' ? !isDate(event.date) || !checkInstant(event.checkedAt) : event.date !== null) errors.push(`${event.id}: event date/status mismatch`);
    if (event.checkedAt !== null && !checkInstant(event.checkedAt)) errors.push(`${event.id}: invalid event check`);
    if (event.status === 'unpublished' && !event.checkedAt) errors.push(`${event.id}: unpublished requires an actual check`);
  }
  const reviews = new Set();
  for (const review of data.reviews) {
    if (!text(review.id) || reviews.has(review.id) || !isHttps(review.sourceUrl) || !checkInstant(review.checkedAt) || !text(review.note) || !['processed', 'linked', 'skipped', 'recheck'].includes(review.status)) errors.push('Invalid or duplicate candidate review');
    reviews.add(review.id);
    if (['processed', 'linked'].includes(review.status) && !review.href) errors.push(`${review.id}: completed review requires a destination`);
    if (review.href) {
      const company = review.href.match(/^\/semiconductor-watch\/earnings\/([^/#]+)$/)?.[1];
      const article = review.href.match(/^\/semiconductor-watch\/([^/#]+)$/)?.[1];
      if (!(company && ids.has(company)) && !(article && media.articles.some(item => item.id === article))) errors.push(`${review.id}: unresolved review destination`);
    }
  }
  return errors;
}


function assertCalendarTransition(previous, candidate) {
  if (Date.parse(candidate.updatedAt) < Date.parse(previous.updatedAt)) throw new Error('Calendar update moved backwards');
  for (const company of previous.companies) {
    const next = candidate.companies.find(check => check.companyId === company.companyId);
    if (!next || company.checkedAt && (!next.checkedAt || next.checkedAt < company.checkedAt)) throw new Error('Company check moved backwards');
  }
  for (const review of previous.reviews) if (!candidate.reviews.some(next => next.id === review.id)) throw new Error('Candidate review history cannot be silently dropped');
}

function publishCalendar(candidate, { destinationPath = destination, historyDir = path.join(root, '.private/watch-calendar-history'), earnings, media, dictionaryPath } = {}) {
  const errors = validateCalendar(candidate, earnings, media);
  if (errors.length) throw new Error(errors.join('\n'));
  checkRedaction(candidate, dictionaryPath);
  const previous = read(destinationPath);
  assertCalendarTransition(previous, candidate);
  if (JSON.stringify(candidate) === JSON.stringify(previous)) return false;
  fs.mkdirSync(historyDir, { recursive: true });
  fs.writeFileSync(path.join(historyDir, `${randomUUID()}.json`), JSON.stringify(previous, null, 2) + '\n', { flag: 'wx' });
  const temporary = `${destinationPath}.${randomUUID()}.tmp`;
  try {
    fs.writeFileSync(temporary, JSON.stringify(candidate, null, 2) + '\n', { flag: 'wx' });
    fs.renameSync(temporary, destinationPath);
  } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
  return true;
}

function reviewQueue(media, calendar) {
  return media.updates.filter(update => !calendar.reviews.some(review => review.id === update.id && review.sourceUrl === update.sourceUrl && ['processed', 'linked', 'skipped'].includes(review.status)));
}

if (require.main === module) {
  try {
    const earnings = read(path.join(root, 'src/data/earnings-snapshot.json'));
    const media = read(path.join(root, 'src/data/chip-pulse-media.json'));
    if (process.argv[2] === '--candidate' && process.argv[3]) {
      console.log(publishCalendar(read(path.resolve(process.argv[3])), { earnings, media }) ? 'Published checked calendar and review log' : 'Calendar unchanged');
    } else if (['--check', '--queue'].includes(process.argv[2])) {
      const calendar = read(destination);
      const errors = validateCalendar(calendar, earnings, media);
      if (errors.length) throw new Error(errors.join('\n'));
      checkRedaction([earnings, calendar, media]);
      if (process.argv[2] === '--queue') console.log(JSON.stringify({ collection: media.status, earnings: earningsCandidates(earnings, media, calendar), unresolved: reviewQueue(media, calendar), officialChecks: calendar.companies, calendar: calendar.events }, null, 2));
      else console.log(`Checked ${earnings.releases.length} companies, ${calendar.events.length} events, ${calendar.reviews.length} review decisions`);
    } else throw new Error('Use --check, --queue or --candidate path/to/calendar.json');
  } catch (error) { console.error(`Watch data unchanged: ${error.message}`); process.exitCode = 1; }
}
module.exports = { validateCalendar, publishCalendar, reviewQueue, checkRedaction, assertCalendarTransition };
