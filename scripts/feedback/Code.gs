/** Separate Apps Script project and private spreadsheet. Never log requests or secrets. */
const SHEETS = {
  responses: ['id', 'received_at', 'survey', 'need', 'feature', 'interest', 'detail'],
  contacts: ['id', 'received_at', 'email'],
  ranking: ['survey', 'feature', 'responses']
};

function json_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
function sheet_(book, name) {
  const sheet = book.getSheetByName(name) || book.insertSheet(name);
  const headers = SHEETS[name];
  if (!sheet.getLastRow()) { sheet.appendRow(headers); sheet.setFrozenRows(1); }
  if (sheet.getLastColumn() !== headers.length || sheet.getRange(1, 1, 1, headers.length).getValues()[0].some((v, i) => v !== headers[i])) throw new Error('Unexpected headers: ' + name);
  return sheet;
}
function getRows_(sheet, width) { return sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, width).getValues() : []; }
function safe_(value) { const s = String(value); return /^[\s]*[=+\-@]/.test(s) ? "'" + s : s; }
// Sheets may consume the leading apostrophe used to force a literal string.
function sameText_(stored, value) { return stored === value || stored === safe_(value); }
function valid_(v) {
  const surveys = { cpk: 'tool', control_chart: 'tool', market_cap: 'article', factory_projects: 'article' };
  const allowed = { tool: ['batch', 'csv', 'report', 'improve', 'other', 'none'], article: ['updates', 'comparison', 'research', 'improve', 'other', 'none'] };
  return v && typeof v.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v.id)
    && Object.prototype.hasOwnProperty.call(surveys, v.survey) && ['method', 'interpretation', 'data', 'report', 'information', 'other'].includes(v.need)
    && allowed[surveys[v.survey]].includes(v.feature) && ['free', 'early', 'undecided'].includes(v.interest)
    && typeof v.detail === 'string' && v.detail.length <= 500 && typeof v.email === 'string' && v.email.length <= 254
    && typeof v.consent === 'boolean' && (!v.email ? !v.consent : v.consent && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email));
}

function doPost(e) {
  try {
    if (!e.postData || e.postData.length > 8192) return json_({ok: false});
    const data = JSON.parse(e.postData.contents);
    const props = PropertiesService.getScriptProperties();
    const secret = props.getProperty('FEEDBACK_SINK_SECRET');
    if (!secret || secret.length < 32 || data.secret !== secret || !valid_(data.feedback)) return json_({ok: false});
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return json_({ok: false});
    try {
      const book = SpreadsheetApp.openById(props.getProperty('FEEDBACK_SPREADSHEET_ID'));
      const responses = sheet_(book, 'responses');
      const contacts = sheet_(book, 'contacts');
      const v = data.feedback;
      const existing = getRows_(responses, 7).find(row => row[0] === v.id);
      const contact = getRows_(contacts, 3).find(row => row[0] === v.id);
      if (existing && (existing[2] !== v.survey || existing[3] !== v.need || existing[4] !== v.feature || existing[5] !== v.interest || !sameText_(existing[6], v.detail))) return json_({ok: false});
      if ((contact && !sameText_(contact[2], v.email)) || (existing && v.email && !contact)) return json_({ok: false});
      if (!existing) {
        const now = new Date().toISOString();
        if (v.email && !contact) contacts.appendRow([v.id, now, safe_(v.email)]);
        SpreadsheetApp.flush();
        responses.appendRow([v.id, now, v.survey, v.need, v.feature, v.interest, safe_(v.detail)]);
        SpreadsheetApp.flush();
      }
      return json_({ok: true, id: v.id});
    } finally { lock.releaseLock(); }
  } catch (_) { return json_({ok: false}); }
}

/** Run once by the owner to create tabs and daily cleanup. */
function setupFeedback() {
  const props = PropertiesService.getScriptProperties();
  if ((props.getProperty('FEEDBACK_SINK_SECRET') || '').length < 32) throw new Error('Set FEEDBACK_SINK_SECRET (32+ characters).');
  const book = SpreadsheetApp.openById(props.getProperty('FEEDBACK_SPREADSHEET_ID'));
  Object.keys(SHEETS).forEach(name => sheet_(book, name));
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'maintainFeedback').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('maintainFeedback').timeBased().everyDays(1).atHour(4).inTimezone('Asia/Tokyo').create();
}

/** Remove expired free text and contacts; rebuild counts from accepted, distinct IDs. */
function maintainFeedback() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error('Feedback maintenance is already running.');
  try {
    const book = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('FEEDBACK_SPREADSHEET_ID'));
    const responses = sheet_(book, 'responses');
    const contacts = sheet_(book, 'contacts');
    const ranking = sheet_(book, 'ranking');
    const now = Date.now();
    const rows = getRows_(responses, 7);
    rows.forEach((row, i) => { const date = Date.parse(row[1]); if (row[6] && Number.isFinite(date) && now - date >= 180 * 86400000) responses.getRange(i + 2, 7).clearContent(); });
    const contactRows = getRows_(contacts, 3);
    for (let i = contactRows.length - 1; i >= 0; i--) { const date = Date.parse(contactRows[i][1]); if (Number.isFinite(date) && now - date >= 90 * 86400000) contacts.deleteRow(i + 2); }
    const seen = new Set();
    const counts = {};
    rows.forEach(row => { if (!row[0] || seen.has(row[0])) return; seen.add(row[0]); const key = row[2] + '\t' + row[4]; counts[key] = (counts[key] || 0) + 1; });
    const result = Object.keys(counts).map(key => key.split('\t').concat(counts[key])).sort((a, b) => b[2] - a[2]);
    if (ranking.getLastRow() > 1) ranking.getRange(2, 1, ranking.getLastRow() - 1, 3).clearContent();
    if (result.length) ranking.getRange(2, 1, result.length, 3).setValues(result);
    SpreadsheetApp.flush();
  } finally { lock.releaseLock(); }
}
