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
const tests = [];
function test(name, fn) { tests.push([name, fn]); }
const A = "machine-a", B = "machine-b", C = "machine-c";
const json = value => JSON.parse(JSON.stringify(value));
function act(s, command) {
  if (s.phase === "playing") s = game.openPanel(s, command.target === "pair" ? "quality" : command.target || "notebook");
  return game.command(s, command);
}
function run(s, seconds) { return game.advanceGame(game.closePanel(s), seconds); }
function stop(s, target = "pair") { return act(s, { type: "stop", target }); }
function work(s, kind, target) {
  const next = act(s, { type: "work", kind, target });
  assert.equal(next.phase, "playing", "work accepted: " + kind + " / " + target);
  return game.advanceGame(next, data.ACTIONS[kind].seconds);
}
function trial(s, kind, target) { return work(stop(s, target), kind, target); }
function fix(s, caseId) {
  s = stop(s);
  if (caseId === "case-a") s = work(s, "cooling", "cooling");
  else {
    s = work(s, "material", B);
    s = work(s, "material", C);
  }
  s = trial(s, "verification", B);
  s = trial(s, "verification", C);
  return act(s, { type: "resume", target: "pair" });
}
test("6秒に1個、12秒の変化点、同じB/C症状と異なる測定値", () => {
  for (const caseId of ["case-a", "case-b"]) {
    let s = game.advanceGame(game.startGame(caseId), 12);
    assert.equal(game.counts(s).good, 6);
    assert.equal(game.counts(s).bad, 0);
    assert.equal(s.machines[B].lot, "L2");
    assert.equal(s.machines[C].lot, "L2");
    s = game.advanceGame(s, 6);
    assert.equal(game.counts(s).good, 7);
    assert.equal(game.counts(s).bad, 2);
    assert.equal(s.machines[A].alarm, false);
    assert.equal(s.machines[B].alarm, true);
    assert.match(game.observation(s, B), caseId === "case-a" ? /温度 上昇/ : /温度 正常/);
    assert.match(game.observation(s, "cooling"), caseId === "case-a" ? /流量は低下/ : /流量は正常/);
    assert.equal(s.observed.length, 0, "truth is not pre-recorded in notebook");
    assert.match(game.observation(s, "material"), /12秒.*L1からL2/);
  }
});
test("停止中は新規品も仕掛品も進まない・単独停止と継続生産", () => {
  let s = game.advanceGame(game.startGame(), 19);
  s = stop(s, B);
  const before = json(s.products.filter(p => p.machine === B));
  s = run(s, 12);
  assert.deepEqual(json(s.products.filter(p => p.machine === B)), before);
  assert.ok(s.products.filter(p => p.machine === C).length > before.length);
  s = stop(s, "pair"); s = stop(s, A);
  const products = json(s.products);
  s = run(s, 8);
  assert.deepEqual(json(s.products), products);
});
test("調査・フォーカス喪失で時計、製品、作業を完全停止", () => {
  let s = stop(game.advanceGame(game.startGame(), 19));
  s = act(s, { type: "work", kind: "cooling", target: "cooling" });
  s = game.advanceGame(s, 2);
  s = game.openPanel(s, "analysis-pc");
  assert.strictEqual(game.advanceGame(s, 400), s);
  const jobs = json(s.jobs), products = json(s.products), elapsed = s.elapsed;
  s = game.pauseGame(s);
  assert.strictEqual(game.advanceGame(s, 60), s);
  s = game.resumeGame(s);
  assert.equal(s.phase, "investigating");
  assert.equal(s.panel, "analysis-pc");
  assert.equal(s.elapsed, elapsed);
  assert.deepEqual(json(s.jobs), jobs); assert.deepEqual(json(s.products), products);
  s = run(s, 3);
  assert.equal(s.jobs.length, 0);
  assert.equal(s.coolingReplaced, true);
});
test("材料だけを替える比較試験はケースで結果が異なる・納入に加算しない", () => {
  for (const caseId of ["case-a", "case-b"]) {
    let s = stop(game.advanceGame(game.startGame(caseId), 18));
    s = stop(s, A);
    const before = game.counts(s);
    s = trial(s, "diagnostic", B);
    const p = s.products.find(p => p.kind === "diagnostic");
    assert.equal(p.lot, "N");
    assert.equal(p.quality, caseId === "case-a" ? "bad" : "good");
    assert.equal(p.progress, 4); assert.equal(p.status, "stored");
    assert.equal(game.counts(s).good, before.good);
    assert.equal(game.counts(s).bad, before.bad);
    assert.equal(s.machines[B].lot, "L2", "comparison must not change production material");
    assert.equal(s.machines[B].verified, false);
    assert.equal(s.machines[B].running, false);
  }
});
test("不適切な対策では改善しない・対策後確認は生産材料を使う", () => {
  let cooling = stop(game.advanceGame(game.startGame("case-a"), 18));
  cooling = work(cooling, "material", B);
  cooling = trial(cooling, "verification", B);
  assert.equal(cooling.machines[B].verified, false);
  assert.equal(cooling.products.findLast(p => p.kind === "verification").quality, "bad");
  let material = stop(game.advanceGame(game.startGame("case-b"), 18));
  material = work(material, "cooling", "cooling");
  material = trial(material, "diagnostic", B);
  assert.equal(material.products.findLast(p => p.kind === "diagnostic").quality, "good");
  assert.equal(material.machines[B].verified, false, "diagnostic success does not verify a wrong intervention");
  material = trial(material, "verification", B);
  assert.equal(material.products.findLast(p => p.kind === "verification").lot, "L2");
  assert.equal(material.products.findLast(p => p.kind === "verification").quality, "bad");
  assert.equal(material.machines[B].verified, false);
});
test("停止前提・作業競合・作業時間・確認前の再開禁止", () => {
  let s = game.openPanel(game.advanceGame(game.startGame(), 18), B);
  assert.strictEqual(game.command(s, { type: "work", kind: "material", target: B }), s);
  s = stop(s);
  s = act(s, { type: "work", kind: "cooling", target: "cooling" });
  s = game.advanceGame(s, 4.9);
  assert.equal(s.coolingReplaced, false);
  const during = game.openPanel(s, B);
  assert.strictEqual(game.command(during, { type: "resume", target: B }), during);
  assert.strictEqual(game.command(during, { type: "work", kind: "restart", target: B }), during);
  s = run(during, .1);
  assert.equal(s.coolingReplaced, true);
  const pending = game.openPanel(s, B);
  assert.strictEqual(game.command(pending, { type: "resume", target: B }), pending);
  s = work(pending, "restart", B);
  assert.equal(s.machines[B].running, false, "restart cannot bypass verification gate");
});
test("再起動だけでは次の製品で再発・成功演出なし", () => {
  let s = game.advanceGame(game.startGame(), 18);
  s = work(s, "restart", B);
  assert.equal(s.machines[B].alarm, false);
  assert.equal(s.notice.kind, "info");
  s = game.advanceGame(s, 6);
  assert.equal(s.machines[B].alarm, true);
  assert.equal(s.machines[B].verified, false);
});
test("適切な対策・B/C確認・通常良品到着で成果が残り90秒完走", () => {
  for (const caseId of ["case-a", "case-b"]) {
    let s = game.advanceGame(game.startGame(caseId), 18);
    s = fix(s, caseId);
    assert.equal(s.machines[B].verified, true); assert.equal(s.machines[C].verified, true);
    assert.notEqual(s.notice.kind, "delivery", "test success is not production delivery");
    const before = game.counts(s).bad;
    s = run(s, 6);
    assert.equal(s.notice.kind, "delivery");
    s = game.advanceGame(s, 100);
    assert.equal(s.phase, "finished"); assert.equal(s.elapsed, 90);
    assert.equal(game.counts(s).bad, before, "no new defects after actual fix");
    assert.equal(game.resultFor(s).success, true);
    assert.ok(game.counts(s).good >= 20);
    assert.strictEqual(game.advanceGame(s, 100), s);
  }
});
test("不良が多くても完走・手掛かり収集と仮説は解決の必須条件ではない", () => {
  let s = game.advanceGame(game.startGame(), 90);
  assert.equal(s.phase, "finished"); assert.equal(game.counts(s).bad, 26);
  assert.equal(game.counts(s).good, 19); assert.equal(game.resultFor(s).success, false);
  s = game.openPanel(game.advanceGame(game.startGame(), 18), "notebook");
  s = game.command(s, { type: "hypothesis", value: "material" });
  s = game.command(s, { type: "hypothesis", value: "cooling" });
  assert.equal(s.hypothesis, "cooling");
  assert.equal(game.resultFor(s).verified, false);
  s = fix(s, "case-a");
  assert.equal(s.observed.length, 0);
  assert.equal(game.resultFor(s).verified, true);
});
test("製品履歴と集計が一致・保留や試験品は納入へ混入しない", () => {
  let s = game.advanceGame(game.startGame("case-b"), 19);
  s = fix(s, "case-b");
  s = run(s, 100);
  const c = game.counts(s);
  assert.ok(c.held > 0);
  const normal = s.products.filter(p => p.kind === "production");
  assert.equal(c.good + c.bad + c.held + c.pending, normal.length);
  assert.equal(c.tests, s.products.filter(p => p.kind !== "production" && p.status === "stored").length);
  const rows = game.inspectionRows(s);
  assert.equal(rows.reduce((n, r) => n + r.good, 0), c.good);
  assert.equal(rows.reduce((n, r) => n + r.bad, 0), c.bad);
  assert.equal(new Set(s.products.map(p => p.id)).size, s.products.length);
});
test("状態を破壊せず、異なるフレーム幅でも同じ生産数", () => {
  const initial = game.startGame(), snapshot = json(initial);
  const whole = game.advanceGame(initial, 90);
  assert.deepEqual(json(initial), snapshot);
  let chunks = game.startGame();
  for (let i = 0; i < 900; i++) chunks = game.advanceGame(chunks, .1);
  assert.deepEqual(json(game.counts(whole)), json(game.counts(chunks)));
  assert.equal(chunks.phase, "finished");
  let jitter = game.startGame(), frame = 0;
  while (jitter.phase === "playing") jitter = game.advanceGame(jitter, [.013, .027, .061, .043][frame++ % 4]);
  assert.deepEqual(json(game.counts(jitter)), json(game.counts(whole)));
  assert.strictEqual(game.advanceGame(initial, NaN), initial);
});
test("検査済み不良を対策操作で消去しない", () => {
  let s = game.advanceGame(game.startGame("case-b"), 17.5);
  const badId = s.products.find(p => p.machine === B && p.quality === "bad").id;
  s = work(stop(s, B), "material", B);
  const kept = s.products.find(p => p.id === badId);
  assert.equal(kept.quality, "bad");
  assert.equal(kept.status, "flowing", "inspected piece waits for transport instead of being erased");
  s = trial(s, "verification", B);
  s = act(s, { type: "resume", target: B });
  s = run(s, 1);
  assert.equal(s.products.find(p => p.id === badId).status, "stored");
  assert.equal(s.products.find(p => p.id === badId).quality, "bad");
});
test("生産を止めた場合は未発生の不良をヒアリングで捏造しない", () => {
  let s = stop(game.advanceGame(game.startGame(), 10));
  s = run(s, 10);
  assert.match(game.observation(s, "quality"), /不良はまだ検出していません/);
  assert.equal(s.machines[B].alarm, false);
  assert.equal(s.machines[C].alarm, false);
});
test("対策前に検査した良品では復旧の成果通知を出さない", () => {
  let s = stop(game.advanceGame(game.startGame(), 11.5));
  s = run(s, 1);
  s = work(s, "cooling", "cooling");
  s = trial(s, "verification", B);
  s = trial(s, "verification", C);
  s = act(s, { type: "resume", target: "pair" });
  s = run(s, .5);
  assert.equal(s.machines[B].celebrated, false);
  assert.equal(s.machines[C].celebrated, false);
  s = run(s, 6);
  assert.equal(s.machines[B].celebrated, true);
  assert.equal(s.machines[C].celebrated, true);
});
test("ダッシュの連打・一時停止・クールダウン", () => {
  let s = game.dash(game.startGame());
  assert.strictEqual(game.dash(s), s);
  s = game.advanceGame(s, .3); assert.ok(s.elapsed > s.dashUntil);
  assert.strictEqual(game.dash(s), s);
  s = game.advanceGame(s, 1);
  assert.ok(game.dash(s).dashUntil > s.elapsed);
  s = game.pauseGame(s); assert.equal(s.dashUntil, 0);
});
test("Runtimeリトライでケース、観察、製品、作業、時計、演出を初期化", () => {
  const runtime = new game.SurvivalRuntime();
  let notifications = 0;
  const off = runtime.subscribe(() => { notifications++; });
  runtime.start(); runtime.tick(19); runtime.open("cooling");
  runtime.command({ type: "observe", target: "cooling" });
  runtime.command({ type: "stop", target: "pair" });
  runtime.command({ type: "work", kind: "cooling", target: "cooling" });
  runtime.tick(1); runtime.pause(); runtime.start("case-b");
  const fresh = runtime.getState();
  assert.deepEqual(json(fresh), json(game.startGame("case-b")));
  assert.equal(fresh.caseId, "case-b");
  assert.equal(runtime.getSnapshot(), fresh);
  assert.ok(notifications > 4); off();
  runtime.start("case-b");
  assert.deepEqual(json(runtime.getState()), json(fresh));
});
for (const [name, fn] of tests) { fn(); console.log("PASS: " + name); }
console.log("PASS: " + tests.length + " investigation simulation tests");
