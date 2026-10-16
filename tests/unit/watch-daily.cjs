const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...rest) { return resolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, parent, ...rest); };
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
require.extensions['.css'] = module => { module.exports = new Proxy({}, { get: (_, key) => key === '__esModule' ? false : key }); };
const snapshot = require('../../src/data/earnings-snapshot.json');
const media = require('../../src/data/chip-pulse-media.json');
const calendar = require('../../src/data/watch-calendar.json');
const { validateSnapshot, earningsCandidates } = require('../../scripts/earnings-publish.cjs');
const { validateCalendar, publishCalendar, reviewQueue } = require('../../scripts/watch-data.cjs');
const { validateDailyDiff, allowedPaths, assertNewsTransition } = require('../../scripts/watch-daily.cjs');
const { upcomingWatchEvents, nextCompanyEvent, earningsFreshness } = require('../../src/lib/watch-calendar.ts');
const { earningsReleases, earningsCompactMetric, earningsBackground, earningsMetricText } = require('../../src/lib/earnings.ts');
const { recentWatchItems, watchItems } = require('../../src/lib/watch.ts');
const { EarningsExplorer, readEarningsHash } = require('../../src/components/earnings/EarningsExplorer.tsx');
const { WatchSchedule } = require('../../src/components/chip-pulse/WatchSchedule.tsx');
const { NewsFeed } = require('../../src/components/chip-pulse/NewsFeed.tsx');
const now = new Date(Math.max(Date.now(), Date.parse(calendar.updatedAt) + 1000)).toISOString();
const copy = value => structuredClone(value);

test('real calendar data and independent currency/scopes are valid', () => {
  assert.deepEqual(validateCalendar(calendar, snapshot, media, now), []);
  const tsmc = copy(earningsReleases.find(release => release.companyId === 'tsmc'));
  tsmc.metrics.revenue.value = 1494243; tsmc.metrics.revenueYoY.value = 50.9;
  assert.equal(tsmc.currency, 'TWD');
  assert.equal(earningsMetricText(tsmc.metrics.revenueYoY, tsmc, true), '+50.9%');
  assert.equal(earningsCompactMetric(tsmc.metrics.revenue, tsmc), '1.49兆台湾ドル');
  assert.ok(earningsBackground(tsmc).href.includes('foundry'));
  assert.equal(earningsReleases.filter(release => ['equipment', 'memory'].includes(release.segment)).length, 9);
});

test('bad dates, source omissions and incorrect derived YoY are rejected', () => {
  const bad = copy(snapshot); bad.releases[0].announcedAt = '2026-09-31';
  assert.ok(validateSnapshot(bad).some(error => error.includes('dates/version')));
  const numbers = copy(snapshot); numbers.releases[0].metrics.revenue.value = 200;
  Object.assign(numbers.releases[0].metrics.revenueYoY, { status: 'reported', value: 101, comparisonValue: 100, calculation: '(200 - 100) / 100 * 100' });
  assert.ok(validateSnapshot(numbers).some(error => error.includes('calculation mismatch')));
  const events = copy(calendar); events.events[0].date = '2026-09-31'; events.events[0].status = 'scheduled';
  events.events[0].sourceUrl = 'http://example.com';
  assert.ok(validateCalendar(events, snapshot, media, now).length >= 2);
});

test('calendar changes archive old date, and invalid replacements preserve public bytes', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'watch-calendar-')); t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const destinationPath = path.join(dir, 'calendar.json'), historyDir = path.join(dir, 'history'), dictionaryPath = path.join(dir, 'dictionary.md');
  fs.writeFileSync(destinationPath, JSON.stringify(calendar));
  fs.writeFileSync(dictionaryPath, '## 禁止語\n- test-forbidden-content\n## 禁止情報\n');
  const options = { destinationPath, historyDir, earnings: snapshot, media, dictionaryPath };
  const bad = copy(calendar); bad.events[0].sourceUrl = 'invalid';
  assert.throws(() => publishCalendar(bad, options));
  assert.equal(fs.readFileSync(destinationPath, 'utf8'), JSON.stringify(calendar));
  assert.equal(fs.existsSync(historyDir), false);
  const next = copy(calendar), event = next.events[0];
  const previousDate = event.date; event.date = '2026-11-03'; event.status = 'scheduled'; event.checkedAt = calendar.updatedAt;
  publishCalendar(next, options);
  const archived = JSON.parse(fs.readFileSync(path.join(historyDir, fs.readdirSync(historyDir)[0]), 'utf8'));
  assert.equal(archived.events.find(item => item.id === event.id).date, previousDate);
});

test('past events disappear in their local timezone, unknown dates stay unknown, and day 14 is included', () => {
  const base = { id: 'fixture', companyId: 'asml', kind: 'earnings', period: 'Test period', date: '2026-10-21', timezone: 'America/Los_Angeles', status: 'scheduled', sourceUrl: 'https://example.com/ir', checkedAt: now };
  const events = [
    { ...base, id: 'today-us', date: '2026-10-16', timezone: 'America/Los_Angeles' },
    { ...base, id: 'today-jp', date: '2026-10-16', timezone: 'Asia/Tokyo' },
    { ...base, id: 'day-14', date: '2026-10-31', timezone: 'Asia/Tokyo' },
    { ...base, id: 'unknown', date: null, status: 'unpublished' },
  ];
  const selected = upcomingWatchEvents(events, '2026-10-16T16:00:00Z');
  assert.deepEqual(selected.map(event => event.id), ['today-us', 'day-14']);
  assert.equal(nextCompanyEvent(base.companyId, '2027-01-01T00:00:00Z', 'earnings', events), undefined);
});

test('a newer release, a failed fetch and stale checks are not presented as current', () => {
  const release = earningsReleases[0], base = { ...calendar.companies.find(check => check.companyId === release.companyId), checkedAt: now, latestAnnouncedAt: release.announcedAt, state: 'verified' };
  const tomorrow = new Date(Date.parse(release.announcedAt) + 86400000).toISOString().slice(0, 10);
  assert.equal(earningsFreshness(release, now, [{ ...base, latestAnnouncedAt: tomorrow, state: 'pending' }]).state, 'pending');
  assert.equal(earningsFreshness(release, now, [{ ...base, state: 'failed' }]).state, 'failed');
  assert.equal(earningsFreshness(release, new Date(Date.parse(now) + 3 * 86400000).toISOString(), [base]).state, 'stale');
  assert.equal(earningsFreshness(release, now, []).state, 'unverified');
});

test('review queue uses current sourceId metadata and preserves unresolved candidates', () => {
  const company = snapshot.releases[0];
  const item = { id: 'fixture-candidate', sourceId: company.companyId, publishedAt: company.announcedAt + 'T12:00:00Z', sourceUrl: 'https://example.com/release', title: 'Fixture filing' };
  const sampleMedia = { ...media, updates: [item] };
  const sampleCalendar = { ...calendar, reviews: [{ ...item, status: 'linked' }] };
  assert.equal(reviewQueue(sampleMedia, sampleCalendar).length, 0);
  const changed = copy(sampleMedia); changed.updates[0].sourceUrl += '?revision=2';
  assert.equal(reviewQueue(changed, sampleCalendar).length, 1);
  assert.equal(earningsCandidates(snapshot, changed, sampleCalendar).length, 1);
});

test('daily publishing permits only modified allowlisted data, never code or deletions', () => {
  assert.deepEqual(validateDailyDiff(allowedPaths.map(filename => ({ status: 'M', path: filename }))), []);
  for (const entry of [{ status: 'M', path: 'src/app/page.tsx' }, { status: 'M', path: 'package.json' }, { status: 'D', path: allowedPaths[0] }, { status: 'R100', path: allowedPaths[0] }, { status: 'M', path: '.private/notes.json' }]) assert.equal(validateDailyDiff([entry]).length, 1);
});

test('daily news transitions preserve old URLs and publication history', () => {
  const missing = copy(media); missing.articles.pop();
  assert.throws(() => assertNewsTransition(media, missing), /cannot be removed/);
  const unversioned = copy(media); unversioned.articles[0].summary += ' revised';
  assert.throws(() => assertNewsTransition(media, unversioned), /checked revision/);
  const sourceChanged = copy(media); sourceChanged.articles[0].sourceCheck = 'changed';
  assert.doesNotThrow(() => assertNewsTransition(media, sourceChanged));
});

test('initial HTML contains all twelve companies, numeric scopes, source/calendar links and legacy anchors', () => {
  const html = renderToStaticMarkup(React.createElement(EarningsExplorer, { releases: earningsReleases, themes: ['AI', 'HBM'], now }));
  assert.ok(html.includes('<table')); assert.equal((html.match(/scope="row"/g) ?? []).length, 12);
  for (const id of ['nvidia', 'tsmc', 'intel']) assert.ok(html.includes(`/earnings/${id}`));
  assert.ok(html.includes('DS部門'));
  const tsmc = earningsReleases.find(release => release.companyId === 'tsmc');
  assert.ok(html.includes(earningsCompactMetric(tsmc.metrics.revenue, tsmc)));
  assert.deepEqual(readEarningsHash('#segment=memory&company=nvidia', earningsReleases, ['AI']), { segment: 'memory', company: 'all', theme: 'all' });
  assert.deepEqual(readEarningsHash('#company=nvidia&theme=AI', earningsReleases, ['AI']), { segment: 'all', company: 'nvidia', theme: 'AI' });
  const highlights = recentWatchItems(watchItems, now, 7).slice(0, 3);
  const feed = renderToStaticMarkup(React.createElement(NewsFeed, { items: watchItems, now, excludeIds: highlights.map(item => item.id) }));
  highlights.forEach(item => assert.ok(!feed.includes(`id="signal-${item.id.replace(/^[^:]+:/, '')}"`)));
  assert.ok(feed.includes('id="signal-tsmc-capital-appropriation-2026-09"'));
  assert.ok(!recentWatchItems([{ ...watchItems[0], date: '2025-01-01', updatedAt: now }], now, 7).length);
  const schedule = renderToStaticMarkup(React.createElement(WatchSchedule, { now }));
  assert.ok(schedule.includes('今後14日の発表予定'));
  upcomingWatchEvents(calendar.events, now).forEach(event => assert.ok(schedule.includes(event.date.replaceAll('-', '/'))));
});
