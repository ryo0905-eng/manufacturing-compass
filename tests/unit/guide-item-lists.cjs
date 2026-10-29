const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(stem) {
  const file = [stem, `${stem}.ts`].find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!file) throw new Error(`Cannot find ${stem}`);
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, require: (id) => id.startsWith('@/') ? load(path.join('src', id.slice(2))) : require(id) }, { filename: file });
  return exports;
}

const { buildGuideItemLists } = load('src/lib/guide-item-lists');
const siteUrl = 'https://mfg-compass.com';
for (const [slug, expected] of [
  ['memory-manufacturer-ranking', [[7, 'Samsung'], [5, 'Samsung']]],
  ['semiconductor-equipment-sales-ranking', [[10, 'ASML']]],
  ['semiconductor-salary-ranking', [[20, 'レーザーテック']]],
]) {
  const lists = buildGuideItemLists(slug, siteUrl);
  assert.equal(lists.length, expected.length);
  lists.forEach((list, index) => {
    const [count, firstName] = expected[index];
    assert.equal(list['@context'], 'https://schema.org');
    assert.equal(list['@type'], 'ItemList');
    assert.equal(list.itemListElement.length, count);
    assert.equal(list.itemListElement[0].name, firstName);
    list.itemListElement.forEach((item, position) => {
      assert.equal(item['@type'], 'ListItem');
      assert.equal(item.position, position + 1);
      assert.equal(item.url, `${siteUrl}/guides/${slug}`);
    });
  });
}
for (const slug of ['semiconductor-market-cap-growth-ranking', 'unrelated-guide']) {
  assert.equal(buildGuideItemLists(slug, siteUrl).length, 0);
}
