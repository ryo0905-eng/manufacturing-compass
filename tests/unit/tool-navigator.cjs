const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...rest) { return resolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, parent, ...rest); };
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { products } = require('../../src/data/tool-navigator.ts');
const { initialState, parseNavigatorState, serializeNavigatorState, findCandidates, evaluateProduct } = require('../../src/lib/tool-navigator.ts');

test('URL restores conditions, four products and comparison settings', () => {
  const state = { ...initialState, goal: 'cpk', skill: 'nocode', volume: 'files', environment: 'local', required: ['capability'], preferred: ['visualization'], selected: ['jmp', 'minitab', 'knime'], fields: ['work', 'skill'], differences: true, confirmedOnly: true };
  assert.deepEqual(parseNavigatorState(new URLSearchParams(serializeNavigatorState(state))), state);
  const invalid = parseNavigatorState(new URLSearchParams('goal=bad&skill=bad&selected=jmp,jmp,unknown,minitab,knime,python,powerbi&required=capability,bad&preferred=capability,transform&fields=&diff=1'));
  assert.equal(invalid.goal, 'yield');
  assert.equal(invalid.skill, 'any');
  assert.deepEqual(invalid.selected, ['jmp', 'minitab', 'knime', 'python']);
  assert.deepEqual(invalid.required, ['capability']);
  assert.deepEqual(invalid.preferred, ['transform']);
  assert.deepEqual(invalid.fields, []);
});

test('required feature filter preserves unknown as unknown', () => {
  const state = { ...initialState, goal: 'yield', required: ['capability'] };
  const knime = products.find(p => p.id === 'knime');
  assert.ok(findCandidates(state).some(item => item.product.id === 'knime'));
  assert.match(evaluateProduct(knime, state).checks.join(' '), /未確認/);
  const filtered = findCandidates({ ...state, confirmedOnly: true });
  assert.deepEqual(filtered.map(item => item.product.id), ['jmp', 'minitab']);
  assert.ok(filtered.every(item => item.product.features.capability === 'yes'));
});

test('the three journeys expose candidates and official sources', () => {
  for (const goal of ['yield', 'pipeline', 'cpk']) {
    const items = findCandidates({ ...initialState, goal });
    assert.ok(items.length >= 2);
    for (const { product, reasons } of items) {
      assert.ok(reasons.length && product.source.startsWith('https://') && product.verified);
    }
  }
});
