/** Manufacturing Compass analytics export. See docs/analytics-export.md. */
const EXPORT = Object.freeze({
  timeZone: 'Asia/Tokyo',
  recentDays: 7,
  backfillDays: 90,
  pageSize: 1000,
  maxRowsPerReport: 10000,
  budgetMs: 240000,
  datasets: ['GA4_Daily', 'GA4_Pages', 'GSC_Daily', 'GSC_Pages', 'GSC_Queries', 'GA4_Events'],
  headers: {
    GA4_Daily: ['date', 'active_users', 'sessions', 'screen_page_views'],
    GA4_Pages: ['date', 'page_path', 'screen_page_views', 'active_users'],
    GA4_Events: ['date', 'event_name', 'source_page', 'cta_location', 'cta_variant', 'destination_group', 'result_type', 'agent_id', 'step_number', 'event_count'],
    GSC_Daily: ['date', 'clicks', 'impressions', 'ctr', 'position'],
    GSC_Pages: ['date', 'page_url', 'clicks', 'impressions', 'ctr', 'position'],
    GSC_Queries: ['date', 'query', 'clicks', 'impressions', 'ctr', 'position']
  }
});

/** Set these three script properties in project settings, not in source control. */
function config_() {
  const p = PropertiesService.getScriptProperties();
  const propertyId = (p.getProperty('GA4_PROPERTY_ID') || '').trim();
  const siteUrl = (p.getProperty('GSC_SITE_URL') || '').trim();
  const spreadsheetId = (p.getProperty('SPREADSHEET_ID') || '').trim();
  if (!/^\d+$/.test(propertyId) || !/^(https:\/\/[^\s]+\/|sc-domain:[^\s/]+)$/.test(siteUrl) || !spreadsheetId) {
    throw new Error('Set valid GA4_PROPERTY_ID, GSC_SITE_URL and SPREADSHEET_ID in script properties.');
  }
  return {propertyId, siteUrl, spreadsheetId};
}

/** Run once manually after configuring and authorizing the project. */
function setup() {
  const cfg = config_();
  const book = SpreadsheetApp.openById(cfg.spreadsheetId);
  EXPORT.datasets.forEach(name => sheet_(book, name));
  const triggers = ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'dailyExport');
  triggers.forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('dailyExport').timeBased().everyDays(1).atHour(6).inTimezone(EXPORT.timeZone).create();
  console.log('Setup complete. Daily trigger created for approximately 06:00 Asia/Tokyo.');
}

/** Start a 90-day backfill ending yesterday; rerun to resume, not restart. */
function startBackfill() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) throw new Error('Another export is running. Try again later.');
  try {
    config_();
    const p = PropertiesService.getScriptProperties();
    if (!p.getProperty('BACKFILL_DATE')) {
      const yesterday = dateOffset_(today_(), -1);
      p.setProperties({BACKFILL_DATE: dateOffset_(yesterday, -(EXPORT.backfillDays - 1)), BACKFILL_END: yesterday, BACKFILL_INDEX: '0'});
    }
    scheduleContinuation_();
    console.log('Backfill queued: ' + p.getProperty('BACKFILL_DATE') + ' through ' + p.getProperty('BACKFILL_END'));
  } finally { lock.releaseLock(); }
}

/** Refresh recent days and then make backfill progress. */
function dailyExport() { run_(true); }
/** Called by the one-shot continuation trigger, or manually to resume. */
function continueBackfill() { run_(false); }

function run_(refreshRecent) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) { console.log('Export already running; skipping this invocation.'); return; }
  const deadline = Date.now() + EXPORT.budgetMs;
  try {
    const cfg = config_();
    const book = SpreadsheetApp.openById(cfg.spreadsheetId);
    EXPORT.datasets.forEach(name => sheet_(book, name));
    if (refreshRecent) {
      // GSC final dates may lag; missing dates are left unchanged and retried tomorrow.
      const end = dateOffset_(today_(), -1);
      const begin = dateOffset_(end, -(EXPORT.recentDays - 1));
      const available = gscAvailableDates_(cfg, begin, end, deadline);
      for (let day = begin; day <= end; day = dateOffset_(day, 1)) {
        for (const name of EXPORT.datasets) {
          checkDeadline_(deadline);
          if (name.startsWith('GSC_') && !available.has(day)) continue;
          exportOne_(cfg, book, name, day, deadline);
        }
      }
    }
    backfill_(cfg, book, deadline);
  } catch (error) {
    console.error('Export stopped: ' + error.message);
    if (error.message.indexOf('Execution budget reached') !== -1 && PropertiesService.getScriptProperties().getProperty('BACKFILL_DATE')) scheduleContinuation_();
    throw error;
  } finally { lock.releaseLock(); }
}

function backfill_(cfg, book, deadline) {
  const p = PropertiesService.getScriptProperties();
  let day = p.getProperty('BACKFILL_DATE');
  const end = p.getProperty('BACKFILL_END');
  if (!day || !end) return;
  let index = Number(p.getProperty('BACKFILL_INDEX') || 0);
  // Query availability once per execution; an absent finalized date is not interpreted as zero.
  const available = gscAvailableDates_(cfg, day, end, deadline);
  while (day <= end) {
    if (Date.now() > deadline - 30000) { scheduleContinuation_(); return; }
    const name = EXPORT.datasets[index];
    if (!name.startsWith('GSC_') || available.has(day)) exportOne_(cfg, book, name, day, deadline);
    else console.log('No finalized GSC date: ' + day + '; recent refresh will retry recent dates.');
    index++;
    if (index === EXPORT.datasets.length) { index = 0; day = dateOffset_(day, 1); }
    p.setProperties({BACKFILL_DATE: day, BACKFILL_INDEX: String(index)});
  }
  p.deleteProperty('BACKFILL_DATE'); p.deleteProperty('BACKFILL_END'); p.deleteProperty('BACKFILL_INDEX');
  console.log('Backfill completed.');
}

function exportOne_(cfg, book, name, day, deadline) {
  const data = name.startsWith('GA4_') ? ga_(cfg, name, day, deadline) : gsc_(cfg, name, day, deadline);
  checkDeadline_(deadline);
  replaceDate_(sheet_(book, name), name, day, data);
  console.log(name + ' ' + day + ': ' + data.length + ' rows');
}

function ga_(cfg, name, day, deadline) {
  const isPage = name === 'GA4_Pages';
  const isEvent = name === 'GA4_Events';
  const dimensions = isPage ? ['pagePath'] : isEvent ? ['eventName', 'customEvent:source_page', 'customEvent:cta_location', 'customEvent:cta_variant', 'customEvent:destination_group', 'customEvent:result_type', 'customEvent:agent_id', 'customEvent:step_number'] : [];
  const metrics = isPage ? ['screenPageViews', 'activeUsers'] : isEvent ? ['eventCount'] : ['activeUsers', 'sessions', 'screenPageViews'];
  const rows = [];
  let offset = 0;
  do {
    const body = {dateRanges: [{startDate: day, endDate: day}], metrics: metrics.map(name => ({name})), limit: String(EXPORT.pageSize), offset: String(offset)};
    if (dimensions.length) { body.dimensions = dimensions.map(name => ({name})); body.orderBys = dimensions.map(dimensionName => ({dimension: {dimensionName}})); }
    const result = post_('https://analyticsdata.googleapis.com/v1beta/properties/' + cfg.propertyId + ':runReport', body, deadline);
    if (result.metadata && (result.metadata.dataLossFromOtherRow || result.metadata.subjectToThresholding || (result.metadata.samplingMetadatas || []).length)) {
      console.warn(name + ' ' + day + ': GA4 reports sampling, thresholding or (other) data loss.');
    }
    const count = Number(result.rowCount || 0);
    if (count > EXPORT.maxRowsPerReport) throw new Error(name + ' ' + day + ' exceeds maxRowsPerReport; existing data preserved.');
    const page = result.rows || [];
    page.forEach(r => rows.push([day].concat(dimensions.length ? r.dimensionValues.map(v => safeText_(v.value)) : [], r.metricValues.map(v => Number(v.value)))));
    offset += page.length;
    if (!page.length && offset < count) throw new Error('GA4 pagination ended unexpectedly.');
    if (offset >= count) break;
  } while (true);
  return rows;
}

function gscAvailableDates_(cfg, begin, end, deadline) {
  const response = post_(gscUrl_(cfg), {startDate: begin, endDate: end, dimensions: ['date'], type: 'web', dataState: 'final', rowLimit: 1000}, deadline);
  return new Set((response.rows || []).map(row => row.keys[0]));
}
function gsc_(cfg, name, day, deadline) {
  const dimension = name === 'GSC_Pages' ? 'page' : name === 'GSC_Queries' ? 'query' : null;
  const rows = [];
  const keys = new Set();
  let offset = 0;
  while (true) {
    const body = {startDate: day, endDate: day, type: 'web', dataState: 'final', rowLimit: EXPORT.pageSize, startRow: offset, aggregationType: name === 'GSC_Pages' ? 'byPage' : 'byProperty'};
    if (dimension) body.dimensions = [dimension];
    const response = post_(gscUrl_(cfg), body, deadline);
    const page = response.rows || [];
    page.forEach(r => {
      if (dimension && keys.has(r.keys[0])) throw new Error(name + ' ' + day + ': duplicate pagination key; existing data preserved.');
      if (dimension) keys.add(r.keys[0]);
      rows.push([day].concat(dimension ? [safeText_(r.keys[0])] : [], [r.clicks, r.impressions, r.ctr, r.position]));
    });
    offset += page.length;
    if (offset > EXPORT.maxRowsPerReport) throw new Error(name + ' ' + day + ' exceeds maxRowsPerReport; existing data preserved.');
    if (page.length < EXPORT.pageSize) break;
    // Fetch one more page when exactly at the cap to detect truncation.
  }
  return rows;
}
function gscUrl_(cfg) { return 'https://www.googleapis.com/webmasters/v3/sites/' + encodeURIComponent(cfg.siteUrl) + '/searchAnalytics/query'; }

function post_(url, body, deadline) {
  for (let attempt = 0; attempt < 4; attempt++) {
    checkDeadline_(deadline);
    const response = UrlFetchApp.fetch(url, {method: 'post', contentType: 'application/json', headers: {Authorization: 'Bearer ' + ScriptApp.getOAuthToken()}, payload: JSON.stringify(body), muteHttpExceptions: true});
    const status = response.getResponseCode();
    if (status >= 200 && status < 300) return JSON.parse(response.getContentText());
    if ((status === 429 || status === 500 || status === 503) && attempt < 3) { Utilities.sleep((1000 * Math.pow(2, attempt)) + Math.floor(Math.random() * 500)); continue; }
    // Do not log request bodies, query values, tokens, or API response bodies.
    throw new Error('API HTTP ' + status + '. Check permissions, API activation and quotas in Google Cloud.');
  }
}
function sheet_(book, name) {
  const sheet = book.getSheetByName(name) || book.insertSheet(name);
  const headers = EXPORT.headers[name];
  if (sheet.getLastRow() === 0) { sheet.getRange(1, 1, 1, headers.length).setValues([headers]); sheet.setFrozenRows(1); }
  const actual = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (actual.some((v, i) => v !== headers[i]) || sheet.getLastColumn() > headers.length) throw new Error(name + ': unexpected columns; restore the original headers.');
  return sheet;
}
function replaceDate_(sheet, name, day, fresh) {
  const width = EXPORT.headers[name].length;
  const last = sheet.getLastRow();
  const existing = last > 1 ? sheet.getRange(2, 1, last - 1, width).getValues() : [];
  const kept = existing.filter(row => String(row[0]) !== day);
  const merged = kept.concat(fresh);
  const needed = merged.length + 1;
  if (needed > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), needed - sheet.getMaxRows());
  // Date and untrusted dimensions are plain text, including strings beginning with '='.
  if (merged.length) {
    sheet.getRange(2, 1, merged.length, 1).setNumberFormat('@');
    if (name === 'GA4_Events') sheet.getRange(2, 2, merged.length, 8).setNumberFormat('@');
    else if (name === 'GA4_Pages' || name === 'GSC_Pages' || name === 'GSC_Queries') sheet.getRange(2, 2, merged.length, 1).setNumberFormat('@');
    sheet.getRange(2, 1, merged.length, width).setValues(merged);
  }
  if (last > needed) sheet.getRange(needed + 1, 1, last - needed, width).clearContent();
  SpreadsheetApp.flush();
}
function safeText_(value) { return /^[=+\-@\t\r]/.test(value) ? "'" + value : value; }
function today_() { return Utilities.formatDate(new Date(), EXPORT.timeZone, 'yyyy-MM-dd'); }
function dateOffset_(day, offset) { const d = new Date(day + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + offset); return Utilities.formatDate(d, 'UTC', 'yyyy-MM-dd'); }
function checkDeadline_(deadline) { if (Date.now() > deadline - 15000) throw new Error('Execution budget reached; retry from the last completed dataset.'); }
function scheduleContinuation_() {
  const existing = ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'continueBackfill');
  existing.forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('continueBackfill').timeBased().after(60 * 1000).create();
}
