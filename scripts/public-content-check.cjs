const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

function checkRedaction(value, dictionaryPath = path.join(root, '.private/content-redaction-dictionary.md')) {
  if (!fs.existsSync(dictionaryPath)) throw new Error('Private redaction dictionary is missing; do not publish without it');
  const dictionary = fs.readFileSync(dictionaryPath, 'utf8');
  const terms = dictionary.split('## 禁止語')[1]?.split('## 禁止情報')[0].split('\n').filter(line => line.startsWith('- ')).map(line => line.slice(2).trim()) ?? [];
  if (!terms.length) throw new Error('Cannot read redaction dictionary');
  const serialized = JSON.stringify(value).normalize('NFKC').toLowerCase();
  if (terms.some(term => serialized.includes(term.normalize('NFKC').toLowerCase()))) throw new Error('Public data matches the private redaction dictionary');
}

module.exports = { checkRedaction };
