const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
function load(file) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  vm.runInNewContext(code, { exports, require: name => load(path.resolve(path.dirname(file), name + ".ts")) }, { filename: file });
  return exports;
}
const game = load(path.resolve(__dirname, "../../src/lib/process-engineer-survival.ts"));
const data = load(path.resolve(__dirname, "../../src/data/process-engineer-survival.ts"));
let s = game.startGame();
assert.equal(s.tasks.length, 1);
assert.equal(s.tasks[0].location, "machine-a");
assert.equal(game.clockFor(s), "08:00");
// Initial task is actionable immediately and needs exactly three seconds.
s = game.advanceGame(game.beginWork(s, "machine-a"), 1.5);
assert.equal(s.resolved, 0);
assert.ok(s.tasks[0].progress > 1.49);
s = game.advanceGame(game.stopWork(s), 1);
assert.ok(s.tasks[0].progress < 1.51);
s = game.advanceGame(game.beginWork(s, "machine-a"), 1.5);
assert.equal(s.resolved, 1);
assert.equal(s.score, 100);
assert.ok(s.elapsed < 10);
// Hint is targeted, survives other operations, then is consumed by a 1-second repair.
s = game.advanceGame(game.startGame(), 20);
const hintLocation = game.hintTarget(s, "quality").location;
s = game.advanceGame(game.beginWork(s, "quality"), 1);
assert.ok(s.hints.includes(hintLocation));
s = game.advanceGame(game.beginWork(s, hintLocation), .9);
assert.equal(s.resolved, 0);
s = game.advanceGame(s, .1);
assert.equal(s.resolved, 1);
assert.equal(s.hintsUsed, 1);
assert.ok(!s.hints.includes(hintLocation));
// Hold completion does not automatically work on the next queued job.
assert.equal(s.work, null);
// Deadline penalty is once per job; exhausted characters can still finish.
s = game.advanceGame(game.startGame(), 30);
assert.equal(s.tasks.find(t => t.id === "monday-1").overdue, true);
const afterPenalty = s.yield;
s = game.advanceGame(s, 1);
assert.equal(s.yield, afterPenalty);
s = game.advanceGame({ ...s, hp: 0, san: 0 }, 180);
assert.equal(s.phase, "finished");
assert.equal(s.elapsed, 180);
assert.equal(game.clockFor(s), "17:00");
assert.equal(game.resultFor(s).pending, data.TROUBLES.length);
assert.equal(game.resultFor(s).overtime, data.TROUBLES.length * 10);
assert.strictEqual(game.advanceGame(s, 10), s);
// Every wave respects its cap, including deferred jobs, and each station is unique.
s = game.startGame();
for (let i = 0; i < 1800; i++) {
  s = game.advanceGame(s, .1);
  assert.ok(s.tasks.length <= game.capacity(s.elapsed));
  assert.equal(new Set(s.tasks.map(t => t.location)).size, s.tasks.length);
}
assert.equal(game.capacity(19.9), 1);
assert.equal(game.capacity(20), 2);
assert.equal(game.capacity(60), 3);
assert.equal(game.capacity(140), 4);
// Work locks to its initial station.
s = game.advanceGame(game.startGame(), 24);
s = game.beginWork(s, "machine-a");
assert.strictEqual(game.beginWork(s, "machine-b"), s);
// Pause discards active hold, preserves partial repair and freezes all clocks.
s = game.advanceGame(s, 1);
const partial = s.tasks[0].progress;
s = game.pauseGame(s);
assert.equal(s.work, null);
assert.strictEqual(game.advanceGame(s, 60), s);
s = game.resumeGame(s);
assert.equal(s.tasks[0].progress, partial);
// Rest has 20s cooldown, and failed attempts cannot reset it.
s = game.startGame();
s = game.advanceGame({ ...s, hp: 20, san: 20 }, 1);
s = game.advanceGame(game.beginWork(s, "break-room"), 2);
assert.ok(s.hp > 44 && s.san > 44);
assert.equal(s.restReadyAt, s.elapsed + 20);
assert.equal(game.beginWork(s, "break-room").work, null);
s = game.advanceGame(s, 20);
assert.equal(game.beginWork(s, "break-room").work.kind, "rest");
// Chains reward quick consecutive repairs, cap at 5, and restart after a gap.
s = game.advanceGame(game.startGame(), 140);
for (let i = 0; i < 6; i++) {
  s = game.advanceGame(game.beginWork(s, s.tasks[0].location), 3);
}
assert.equal(s.bestCombo, 5);
assert.equal(s.combo, 5);
assert.equal(s.score, 2000);
s = game.advanceGame(s, 13);
s = game.advanceGame(game.beginWork(s, s.tasks[0].location), 3);
assert.equal(s.combo, 1);
// Dash cannot be extended by holding/repeated presses.
s = game.dash(game.startGame());
const until = s.dashUntil;
assert.strictEqual(game.dash(s), s);
s = game.advanceGame(s, .3);
assert.ok(s.elapsed > until);
assert.strictEqual(game.dash(s), s);
s = game.advanceGame(s, 1);
assert.ok(game.dash(s).dashUntil > s.elapsed);
// Runtime subscriptions cannot recurse when a pause handler clears controls.
const runtime = new game.SurvivalRuntime();
const off = runtime.subscribe(() => { if (runtime.getState().phase !== "playing") runtime.stop(); });
runtime.start(); runtime.begin("machine-a"); runtime.tick(1); runtime.pause();
assert.equal(runtime.getState().phase, "paused");
runtime.start();
const fresh = runtime.getState();
assert.equal(fresh.elapsed, 0); assert.equal(fresh.score, 0);
assert.equal(fresh.hints.length, 0); assert.equal(fresh.work, null);
assert.equal(fresh.dashUntil, 0); assert.equal(fresh.notice, null);
off();
console.log("PASS: repair, hints, deadline, waves, pause, rest, combos, dash, finish and retry");
