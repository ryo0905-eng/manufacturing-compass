const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const filename = path.join(root, 'src/data/industry-map.ts');
const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const exportsObject = {};
vm.runInNewContext(output, { exports: exportsObject }, { filename });

const { industryMapCareers, industryMapSupplementalCompanies, industryMapZoneRelations, industryMapZones } = exportsObject;
assert.equal(industryMapZones.length, 8);
assert.equal(industryMapSupplementalCompanies.length, 7);

const companyIds = industryMapZones.flatMap(zone => [...zone.companyIds, ...zone.supplementalCompanyIds]);
assert.equal(companyIds.length, 31);
assert.equal(new Set(companyIds).size, companyIds.length, 'A company must have one primary zone');

const zoneIds = new Set(industryMapZones.map(zone => zone.id));
const careerIds = new Set(industryMapCareers.map(career => career.id));
const supplementalIds = new Set(industryMapSupplementalCompanies.map(company => company.id));
for (const zone of industryMapZones) {
  assert.ok(zone.description && zone.guideHref && zone.guideLabel);
  zone.careerIds.forEach(id => assert.ok(careerIds.has(id), `Unknown career: ${id}`));
  zone.supplementalCompanyIds.forEach(id => assert.ok(supplementalIds.has(id), `Unknown supplemental company: ${id}`));
}
for (const company of industryMapSupplementalCompanies) {
  assert.match(company.websiteUrl, /^https:\/\//);
  assert.match(company.source.url, /^https:\/\//);
  assert.match(company.source.accessedAt, /^\d{4}-\d{2}-\d{2}$/);
}
for (const relation of industryMapZoneRelations) {
  assert.ok(zoneIds.has(relation.from));
  assert.ok(zoneIds.has(relation.to));
  assert.ok(relation.label);
}

console.log('Industry atlas data passed: 8 zones, 31 unique companies, 7 sourced map profiles, valid careers and relations.');
