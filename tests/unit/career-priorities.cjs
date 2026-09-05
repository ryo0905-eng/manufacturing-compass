const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
// Compile pure TypeScript modules in memory; no generated files or analytics calls.
function load(file) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText;
  vm.runInNewContext(code, { exports, require: name => load(path.resolve(path.dirname(file), name + '.ts')) }, { filename: file });
  return exports;
}
const { buildPriorityNote, setChoice, emptyPriorityNote } = load(path.resolve(__dirname, '../../src/lib/career-priorities.ts'));
assert.match(buildPriorityNote(emptyPriorityNote), /今は優先順位を探索中/);
let note = setChoice(emptyPriorityNote, 'stay', 'change');
note = { ...note, priorities: ['stay'], flexibility: { stay: 'required' }, questions: ['stay'] };
assert.match(buildPriorityNote(note), /1\. 引っ越さずに働く — 必須/);
assert.match(buildPriorityNote(note), /初期配属先と、将来の転勤範囲/);
const switched = setChoice(note, 'stay', 'keep');
assert.equal(switched.choices.stay, 'keep');
assert.equal(switched.priorities[0], 'stay');
const removed = setChoice(note, 'stay', 'change');
assert.equal(removed.priorities.length, 0);
assert.equal(removed.questions.length, 0);
assert.equal(removed.flexibility.stay, undefined);
assert.doesNotMatch(buildPriorityNote(removed), /引っ越さず/);
assert.equal(note.choices.stay, 'change');
const three = { choices: { stay: 'keep', meetings: 'change', living: 'change', scope: 'change' }, priorities: ['meetings', 'stay', 'living'], flexibility: { stay: 'required', living: 'flexible' }, questions: ['living', 'meetings'], unordered: false };
const result = buildPriorityNote(three);
assert.match(result, /1\. 会議の目的が明確 — まだ迷う/);
assert.match(result, /その他に大切にしたいこと\n・担当業務を明確にする/);
assert.ok(result.indexOf('この職種の定例会議') < result.indexOf('手当・住居補助の適用条件'));
const unordered = buildPriorityNote({ ...three, unordered: true });
assert.match(unordered, /順位は未定/);
assert.doesNotMatch(unordered, /1\. 会議/);
assert.match(unordered, /会議の目的が明確をどこまで譲れるか/);
console.log('PASS: empty, single, three priorities, unranked, intent change, removal cleanup, question order, immutability');
