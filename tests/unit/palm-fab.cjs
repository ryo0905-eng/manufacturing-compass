const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
function load(file, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports, require(name) { if (Object.hasOwn(dependencies, name)) return dependencies[name]; throw Error(name); } });
  return exports;
}
const data = load('src/data/palm-fab.ts');
const fab = load('src/lib/palm-fab/simulation.ts', { '@/data/palm-fab': data });
const wip = state => fab.countInFactory(state);
let game = fab.newFab();
for (let i = 0; i < 1800; i++) {
  game = fab.stepFab(game);
  assert.equal(game.created, game.shipped / data.fabBalance.wafersPerCase + wip(game), `conservation at tick ${i}`);
  for (const queue of Object.values(game.queues)) assert.ok(queue.length <= data.fabBalance.queueLimit);
}
assert.ok(game.queues.inspectIn.length >= 2, 'inspection has a visible backlog');
assert.ok(game.shipped > 0 && game.coins >= 50, 'first inspection upgrade affordable within three minutes');
const firstWindow = fab.advanceFab(fab.newFab(), 120);
const afterUpgrade = fab.buyUpgrade(firstWindow, 'inspect');
assert.equal(afterUpgrade.machines.inspect.level, 2);
assert.equal(afterUpgrade.coins, firstWindow.coins - 50);
assert.equal(afterUpgrade.created, firstWindow.created);
assert.equal(wip(afterUpgrade), wip(firstWindow));
const baseline = fab.advanceFab(firstWindow, 90);
const improved = fab.advanceFab(afterUpgrade, 90);
assert.ok(improved.shipped - firstWindow.shipped >= (baseline.shipped - firstWindow.shipped) * 1.5, 'upgrade raises real throughput');
assert.ok(improved.queues.inspectIn.length < firstWindow.queues.inspectIn.length, 'backlog drains after upgrade');
assert.equal(improved.created, improved.shipped / 5 + wip(improved));
let poor = fab.newFab();
poor.coins = 0;
assert.equal(fab.buyUpgrade(poor, 'inspect'), poor, 'cannot purchase without funds');
let repeated = fab.newFab();
repeated.coins = 50;
repeated = fab.buyUpgrade(repeated, 'inspect');
assert.equal(fab.buyUpgrade(repeated, 'inspect'), repeated, 'double click cannot buy twice with spent funds');
let maxed = fab.newFab();
maxed.coins = 9999;
for (let i = 0; i < 5; i++) maxed = fab.buyUpgrade(maxed, 'inspect');
assert.equal(maxed.machines.inspect.level, data.fabBalance.maxLevel);
assert.equal(fab.buyUpgrade(maxed, 'inspect'), maxed);
const saved = fab.readFabSave(JSON.stringify(improved));
assert.ok(saved);
assert.equal(saved.shipped, improved.shipped);
assert.equal(saved.coins, improved.coins);
assert.equal(fab.advanceFab({ ...saved, paused: true }, 30).shipped, saved.shipped);
assert.equal(fab.readFabSave('{bad'), null);
assert.equal(fab.readFabSave(JSON.stringify({ ...improved, version: 999 })), null);
assert.equal(fab.readFabSave(JSON.stringify({ ...improved, coins: -1 })), null);
assert.equal(fab.readFabSave(JSON.stringify({ ...improved, created: improved.created + 1 })), null);
assert.equal(fab.newFab().shipped, 0);
console.log('Palm Fab: conservation, bottleneck, throughput, purchases, save and reset passed');
