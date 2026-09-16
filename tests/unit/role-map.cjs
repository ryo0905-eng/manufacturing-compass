const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const filename = path.join(root, 'src/lib/role-map.ts');
const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const exportsObject = {};
vm.runInNewContext(output, { exports: exportsObject }, { filename });

const { findRoleMapMatches, normalizeRoleMapSelection } = exportsObject;
const knownIds = new Set(['R01', 'R02', 'R03', 'R04', 'R05', 'R06']);
const profiles = [
  { id: 'p1', order: 1, roleGroup: 'one', responsibilities: [{ responsibilityId: 'R01', fit: 'core' }, { responsibilityId: 'R02', fit: 'core' }, { responsibilityId: 'R03', fit: 'variable' }] },
  { id: 'p2', order: 2, roleGroup: 'two', responsibilities: [{ responsibilityId: 'R03', fit: 'core' }, { responsibilityId: 'R04', fit: 'core' }] },
  { id: 'p3', order: 3, roleGroup: 'three', responsibilities: [{ responsibilityId: 'R05', fit: 'core' }, { responsibilityId: 'R06', fit: 'core' }] },
];

assert.equal(
  JSON.stringify(normalizeRoleMapSelection({ selectedIds: ['R01', 'R01', 'R99'], emphasizedIds: ['R99', 'R01', 'R02'] }, knownIds)),
  JSON.stringify({ selectedIds: ['R01'], emphasizedIds: ['R01'] }),
);
assert.equal(findRoleMapMatches({ selectedIds: [], emphasizedIds: [] }, profiles, knownIds).length, 0);
assert.equal(findRoleMapMatches({ selectedIds: ['R01'], emphasizedIds: [] }, profiles, knownIds).length, 0);
assert.equal(findRoleMapMatches({ selectedIds: ['R01', 'R02'], emphasizedIds: [] }, profiles, knownIds)[0].profile.id, 'p1');
assert.equal(JSON.stringify(findRoleMapMatches({ selectedIds: ['R01', 'R03'], emphasizedIds: [] }, profiles, knownIds).map((item) => item.profile.id)), JSON.stringify(['p1']));
assert.equal(JSON.stringify(findRoleMapMatches({ selectedIds: ['R01', 'R02', 'R03', 'R04'], emphasizedIds: [] }, profiles, knownIds).map((item) => item.profile.id)), JSON.stringify(['p1', 'p2']));
assert.equal(findRoleMapMatches({ selectedIds: ['R01', 'R02', 'R03', 'R04'], emphasizedIds: [] }, profiles, knownIds)[1].tiedWithPrevious, false);
assert.equal(findRoleMapMatches({ selectedIds: ['R01', 'R02', 'R03', 'R04', 'R05', 'R06'], emphasizedIds: [] }, profiles, knownIds).length, 3);
assert.equal(findRoleMapMatches({ selectedIds: ['R01', 'R02', 'R03', 'R04'], emphasizedIds: ['R03', 'R04'] }, profiles, knownIds)[0].profile.id, 'p2');

console.log('Role map scoring passed: normalization, thresholds, ordering, emphasis and result cap.');
