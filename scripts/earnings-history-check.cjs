const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const snapshot = require('../src/data/earnings-snapshot.json');
const isDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const hasText = value => typeof value === 'string' && value.trim().length > 0;
function validSource(source) {
  if (!source || !hasText(source.locator)) return false;
  try {
    const url = new URL(source.url);
    return url.protocol === 'https:' && ['sec.gov', 'asml.com', 'appliedmaterials.com', 'lamresearch.com', 'kla.com', 'tel.com', 'tel.co.jp', 'micron.com', 'kioxia-holdings.com', 'skhynix.com', 'samsung.com', 'nvidia.com', 'tsmc.com', 'intc.com'].some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))
      && (!/\.pdf$/i.test(url.pathname) || (/page=\d+/.test(url.hash) && /p(?:age)?\.?\s*\d+/i.test(source.locator)));
  } catch { return false; }
}

function validateHistory(data) {
  const errors = [];
  if (!data || data.schemaVersion !== 1 || !isDate(data.updatedAt) || !Array.isArray(data.series)) return ['Invalid annual history header'];
  const ids = new Set();
  for (const series of data.series) {
    const release = snapshot.releases.find(item => item.companyId === series.companyId);
    const prefix = series.companyId ?? 'unknown';
    if (!release || release.segment !== series.segment || ids.has(series.companyId)) errors.push(`${prefix}: invalid/duplicate company or segment`);
    ids.add(series.companyId);
    if (!hasText(series.name) || !hasText(series.coverageNote) || !isDate(series.checkedAt) || series.checkedAt > data.updatedAt) errors.push(`${prefix}: missing coverage/verification metadata`);
    if (!Array.isArray(series.periods) || series.periods.length !== 5) { errors.push(`${prefix}: exactly five annual periods required`); continue; }
    let previous;
    for (const period of series.periods) {
      const label = `${prefix}/${period.end}`;
      const days = (Date.parse(period.end) - Date.parse(period.start)) / 86400000 + 1;
      if (!isDate(period.start) || !isDate(period.end) || days < 330 || days > 400 || period.end > series.checkedAt) errors.push(`${label}: invalid full-year period`);
      if (previous && (previous.end >= period.end || previous.end >= period.start)) errors.push(`${label}: unordered or overlapping periods`);
      if (!hasText(period.label) || !hasText(period.accountingStandard) || !hasText(period.financialScope) || !['EUR', 'USD', 'JPY', 'KRW', 'TWD'].includes(period.currency) || !['million', 'billion'].includes(period.unit)) errors.push(`${label}: invalid reporting basis`);
      if (period.breakBefore !== undefined && !hasText(period.breakBefore)) errors.push(`${label}: empty discontinuity reason`);
      if (!validSource(period.source)) errors.push(`${label}: invalid period source`);
      for (const key of ['revenue', 'operatingIncome']) {
        const metric = period[key];
        if (metric?.status === 'reported') {
          if (!Number.isFinite(metric.value) || !validSource(metric.source)) errors.push(`${label}/${key}: invalid value or source`);
          if (metric.calculation !== undefined) {
            const inputs = metric.calculationInputs;
            if (!hasText(metric.calculation) || !Array.isArray(inputs) || inputs.length < 2 || !inputs.every(Number.isFinite)
              || Math.abs(inputs[0] - period.revenue?.value) > 0.00001
              || Math.abs(inputs.slice(1).reduce((total, value) => total - value, inputs[0]) - metric.value) > 0.00001) errors.push(`${label}/${key}: calculation mismatch`);
          }
        } else if (!['unretrieved', 'unpublished'].includes(metric?.status) || !hasText(metric.reason) || metric.value !== undefined || (metric.source && !validSource(metric.source))) errors.push(`${label}/${key}: missing value needs status/reason, not zero`);
      }
      if (series.companyId === 'samsung-electronics' && !period.financialScope.startsWith('DS部門')) errors.push(`${label}: Samsung must retain DS scope`);
      previous = period;
    }
  }
  if (snapshot.releases.some(release => !ids.has(release.companyId)) || ids.size !== snapshot.releases.length) errors.push('Annual histories must cover the existing twelve companies');
  return errors;
}

if (require.main === module) {
  const file = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, 'src/data/earnings-history.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const errors = validateHistory(data);
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log(`Validated ${data.series.length} companies / ${data.series.reduce((total, series) => total + series.periods.length, 0)} annual periods with sources.`);
}
module.exports = { validateHistory };
