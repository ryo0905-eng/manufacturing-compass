import { ACTIONS, CASES, EQUIPMENT_CONNECTIONS, MACHINE_IDS, QUIPS, RULES, SHARED_MACHINES, TITLES, type CaseId, type GameLocationId, type Hypothesis, type Lot, type MachineId, type WorkKind } from "../data/process-engineer-survival";

export type Phase = "intro" | "playing" | "investigating" | "paused" | "finished";
export type Product = { id: number; machine: MachineId; lot: Lot; revision: number; kind: "production" | "diagnostic" | "verification"; progress: number; quality: "good" | "bad" | null; status: "flowing" | "stored" | "held"; born: number };
export type Machine = { running: boolean; lot: Lot; alarm: boolean; verified: boolean; revision: number; celebrated: boolean };
export type Job = { id: number; kind: WorkKind; target: MachineId | "cooling"; remaining: number; productId?: number };
export type Entry = { id: number; at: number; category: "fact" | "action" | "result"; text: string };
export type GameState = {
  phase: Phase; panel: GameLocationId | "notebook" | null; caseId: CaseId; elapsed: number; faultStarted: boolean;
  machines: Record<MachineId, Machine>; coolingReplaced: boolean; isolated: boolean;
  products: Product[]; jobs: Job[]; entries: Entry[]; observed: GameLocationId[]; hypothesis: Hypothesis | null;
  dashUntil: number; dashReadyAt: number; serial: number;
  notice: { serial: number; kind: "info" | "delivery"; text: string; machine?: MachineId } | null;
};
export type Command =
  | { type: "observe"; target: GameLocationId }
  | { type: "stop" | "resume"; target: MachineId | "pair" }
  | { type: "hypothesis"; value: Hypothesis }
  | { type: "work"; kind: WorkKind; target: MachineId | "cooling" };

const EPSILON = 1e-7;
export function createGame(caseId: CaseId = "case-a"): GameState {
  const machine = (lot: Lot): Machine => ({ running: true, lot, alarm: false, verified: false, revision: 0, celebrated: false });
  return { phase: "intro", panel: null, caseId, elapsed: 0, faultStarted: false,
    machines: { "machine-a": machine("N"), "machine-b": machine("L1"), "machine-c": machine("L1") },
    coolingReplaced: false, isolated: false, products: [], jobs: [], entries: [], observed: [], hypothesis: null,
    dashUntil: 0, dashReadyAt: 0, serial: 0, notice: null };
}
export function startGame(caseId: CaseId = "case-a"): GameState {
  return { ...createGame(caseId), phase: "playing", notice: { serial: 1, kind: "info", text: QUIPS.start }, serial: 1 };
}
function copy(state: GameState): GameState {
  return { ...state, machines: { "machine-a": { ...state.machines["machine-a"] }, "machine-b": { ...state.machines["machine-b"] }, "machine-c": { ...state.machines["machine-c"] } },
    products: state.products.map(p => ({ ...p })), jobs: state.jobs.map(j => ({ ...j })), entries: [...state.entries], observed: [...state.observed] };
}
function log(s: GameState, category: Entry["category"], text: string) {
  s.entries.push({ id: ++s.serial, at: s.elapsed, category, text });
}
function tell(s: GameState, text: string, machine?: MachineId) {
  s.notice = { serial: ++s.serial, text, kind: machine ? "delivery" : "info", machine };
}
export function machineName(id: MachineId) { return "設備" + id.slice(-1).toUpperCase(); }
export function isMachine(id: string): id is MachineId { return (MACHINE_IDS as readonly string[]).includes(id); }
export function busy(s: GameState, id: MachineId) { return s.jobs.some(j => j.target === id || (j.target === "cooling" && EQUIPMENT_CONNECTIONS.cooling.some(target => target === id))); }
/** Only the simulation uses the hidden cause. UI must use observations / product outcomes instead. */
function defective(s: GameState, id: MachineId, lot: Lot) {
  if (!s.faultStarted || id === "machine-a") return false;
  return CASES[s.caseId].cause === "cooling" ? !s.coolingReplaced : lot === "L2";
}
export function counts(s: GameState) {
  const delivered = s.products.filter(p => p.kind === "production" && p.status === "stored");
  return { good: delivered.filter(p => p.quality === "good").length, bad: delivered.filter(p => p.quality === "bad").length,
    held: s.products.filter(p => p.kind === "production" && p.status === "held").length,
    pending: s.products.filter(p => p.kind === "production" && p.status === "flowing").length,
    tests: s.products.filter(p => p.kind !== "production" && p.status === "stored").length };
}
export function machineStatus(s: GameState, id: MachineId) {
  const job = s.jobs.find(j => j.target === id || (j.target === "cooling" && id !== "machine-a"));
  if (job) return (job.kind === "cooling" ? "交換待ち" : job.kind === "material" ? "材料切替中" : job.kind === "restart" ? "再起動中" : "試運転中") + " " + Math.ceil(job.remaining) + "s";
  if (!s.machines[id].running) return s.machines[id].verified ? "■ 確認済・再開可" : "■ 停止";
  return s.machines[id].alarm ? "！不良を検出" : s.machines[id].verified ? "▶ 復旧・生産中" : "▶ 生産中";
}
export function inspectionRows(s: GameState) {
  const groups = new Map<string, { machine: MachineId; lot: Lot; good: number; bad: number }>();
  s.products.filter(p => p.kind === "production" && p.status === "stored").forEach(p => {
    const key = p.machine + p.lot;
    const row = groups.get(key) ?? { machine: p.machine, lot: p.lot, good: 0, bad: 0 };
    if (p.quality === "good") row.good++; else row.bad++;
    groups.set(key, row);
  });
  return [...groups.values()];
}
export function observation(s: GameState, target: GameLocationId): string {
  if (isMachine(target)) {
    const hot = defective(s, target, "N");
    return machineName(target) + "：温度 " + (hot ? "上昇（基準外）" : "正常") + "。生産材料 " + s.machines[target].lot + "。状態：" + machineStatus(s, target) + "。";
  }
  if (target === "cooling") return "共通冷却：B/Cへ接続。流量は" + (defective(s, "machine-b", "N") ? "低下（基準外）" : "正常") + "。Aは別系統。";
  if (target === "material") return s.faultStarted
    ? "稼働12秒時点でB/Cの共通材料をL1からL2へ変更。Aは正常材料Nのまま。" + (s.isolated ? "供給中の材料は切替対象で隔離済み。" : "材料異常の有無は、この記録だけでは分からない。")
    : "B/Cは共通材料L1、Aは正常材料Nを使用中。切替前の記録。";
  if (target === "quality") {
    const badMachines = MACHINE_IDS.filter(id => s.products.some(p => p.machine === id && p.kind === "production" && p.quality === "bad"));
    return badMachines.length
      ? "現場「" + badMachines.map(machineName).join("と") + "で不良を確認しました。材料の切替後でした。原因かどうかは、まだ分かりません」"
      : "現場「通常生産の不良はまだ検出していません。製品の印は設備名と材料ロット。検査後に○良品と×不良に分けます」";
  }
  const rows = inspectionRows(s);
  return rows.length ? "検査記録：" + rows.map(r => machineName(r.machine) + " / " + r.lot + "：○" + r.good + " ×" + r.bad).join("、") + "。時刻別の記録は下の履歴へ。"
    : "検査記録：まだ検査完了品はありません。";
}
export function openPanel(s: GameState, target: GameState["panel"]): GameState {
  if (s.phase !== "playing" || !target) return s;
  return { ...s, phase: "investigating", panel: target, dashUntil: 0 };
}
export function closePanel(s: GameState): GameState {
  return s.phase === "investigating" ? { ...s, phase: "playing", panel: null } : s;
}
export function pauseGame(s: GameState): GameState {
  return s.phase === "playing" || s.phase === "investigating" ? { ...s, phase: "paused", dashUntil: 0 } : s;
}
export function resumeGame(s: GameState): GameState {
  return s.phase === "paused" ? { ...s, phase: s.panel ? "investigating" : "playing" } : s;
}
export function workError(s: GameState, kind: WorkKind, target: MachineId | "cooling"): string | null {
  if (kind === "cooling") {
    if (target !== "cooling") return "共通冷却から依頼してください。";
    if (busy(s, "machine-b") || busy(s, "machine-c")) return "B/Cの作業完了を待ってください。";
    if (s.machines["machine-b"].running || s.machines["machine-c"].running) return "先にB/Cを停止してください。";
  } else {
    if (!isMachine(target)) return "対象設備を選んでください。";
    if (busy(s, target)) return "この設備は作業中です。";
    if (kind !== "restart" && s.machines[target].running) return "先に対象設備を停止してください。";
  }
  if (kind !== "restart" && !s.faultStarted) return "開始直後は設備確認を試せます。試験・対策は異常発生後に使えます。";
  return null;
}
/** Removing a workpiece for a trial / intervention is recorded, never silently counted as a good. */
function holdWorkpieces(s: GameState, target: MachineId) {
  // Already-inspected pieces retain their result and wait for transport to resume.
  // An intervention must not erase a previously observed defective piece.
  s.products.filter(p => p.machine === target && p.status === "flowing" && p.kind === "production" && p.quality === null).forEach(p => { p.status = "held"; });
}
export function command(s: GameState, cmd: Command): GameState {
  if (s.phase !== "investigating") return s;
  if (cmd.type === "work" && workError(s, cmd.kind, cmd.target)) return s;
  if ((cmd.type === "stop" || cmd.type === "resume")) {
    const targets = cmd.target === "pair" ? SHARED_MACHINES : [cmd.target];
    if (targets.some(id => busy(s, id))) return s;
    if (cmd.type === "resume" && targets.some(id => s.machines[id].revision > 0 && !s.machines[id].verified)) return s;
  }
  const next = copy(s);
  if (cmd.type === "observe") {
    const text = observation(s, cmd.target);
    if (!next.observed.includes(cmd.target)) next.observed.push(cmd.target);
    if (!next.entries.some(e => e.category === "fact" && e.text === text)) log(next, "fact", text);
    tell(next, "観察をノートへ記録しました。");
  } else if (cmd.type === "hypothesis") {
    if (s.hypothesis === cmd.value) return s;
    next.hypothesis = cmd.value;
    log(next, "action", "仮説を「" + (cmd.value === "cooling" ? "共通冷却" : "材料") + "」に設定（未確定）。");
  } else if (cmd.type === "stop" || cmd.type === "resume") {
    const targets = cmd.target === "pair" ? SHARED_MACHINES : [cmd.target];
    targets.forEach(id => { next.machines[id].running = cmd.type === "resume"; });
    log(next, "action", targets.map(machineName).join("・") + (cmd.type === "stop" ? "を停止。生産と仕掛品の搬送を止めた。" : "の生産を再開。"));
    tell(next, cmd.type === "stop" ? "停止しました。調査中は工場全体の時計も止まっています。" : "再開しました。現場に戻ると生産が進みます。");
  } else if (cmd.type === "work") {
    const targets = cmd.target === "cooling" ? SHARED_MACHINES : [cmd.target];
    targets.forEach(id => {
      next.machines[id].running = false;
      if (cmd.kind !== "restart") holdWorkpieces(next, id);
      if (cmd.kind === "material" || cmd.kind === "cooling") {
        next.machines[id].revision++; next.machines[id].verified = false; next.machines[id].celebrated = false;
      }
    });
    const job: Job = { id: ++next.serial, kind: cmd.kind, target: cmd.target, remaining: ACTIONS[cmd.kind].seconds };
    if (cmd.kind === "diagnostic" || cmd.kind === "verification") {
      const id = cmd.target as MachineId;
      const product: Product = { id: ++next.serial, machine: id, lot: cmd.kind === "diagnostic" ? "N" : next.machines[id].lot, revision: next.machines[id].revision,
        kind: cmd.kind, progress: 0, quality: null, status: "flowing", born: next.elapsed };
      job.productId = product.id; next.products.push(product);
    }
    next.jobs.push(job);
    log(next, "action", (cmd.target === "cooling" ? "B/C共通冷却" : machineName(cmd.target)) + "：" + ACTIONS[cmd.kind].label + "を開始。");
    tell(next, ACTIONS[cmd.kind].label + "中。別の設備へ移動できます。");
    next.phase = "playing"; next.panel = null;
  }
  return next;
}
function finishJob(s: GameState, job: Job) {
  if (job.kind === "cooling") {
    s.coolingReplaced = true;
    log(s, "result", "保全：フィルター交換完了。効果はB/Cの試運転で確認する。");
    tell(s, "交換完了。警告ではなく、試験品の結果で確認しよう。");
    return;
  }
  const id = job.target as MachineId, m = s.machines[id];
  if (job.kind === "material") {
    s.isolated = true; m.lot = "N";
    log(s, "result", machineName(id) + "：旧材料を隔離し、正常材料Nへ切替完了。効果は未確認。");
    tell(s, "材料切替完了。生産条件で試運転してみよう。");
  } else if (job.kind === "restart") {
    m.alarm = false;
    // Restart must not bypass the post-intervention verification gate.
    m.running = m.revision === 0 || m.verified;
    log(s, "result", machineName(id) + "：再起動完了。原因への対策は未実施。");
    tell(s, QUIPS.restart);
  } else {
    const p = s.products.find(item => item.id === job.productId)!;
    p.progress = RULES.trial; p.quality = defective(s, id, p.lot) ? "bad" : "good"; p.status = "stored";
    m.alarm = p.quality === "bad";
    const verified = job.kind === "verification" && p.quality === "good" && m.revision > 0;
    if (job.kind === "verification") m.verified = verified;
    const text = machineName(id) + " / " + p.lot + "：" + ACTIONS[job.kind].label + " → " + (p.quality === "good" ? "○ 良好" : "× 不良が残った") +
      (verified ? "。この生産条件で再開可。" : job.kind === "diagnostic" ? "。比較試験のみ。生産材料は変更していない。" : "。対策と条件を見直そう。");
    log(s, "result", text); tell(s, verified ? QUIPS.verified : text);
  }
}
/** Deterministic small steps make fault timing and production independent of frame rate. */
export function advanceGame(state: GameState, seconds: number): GameState {
  if (state.phase !== "playing" || !Number.isFinite(seconds) || seconds <= 0) return state;
  const s = copy(state);
  let left = Math.min(seconds, RULES.duration - s.elapsed);
  while (left > EPSILON) {
    const boundaries = s.jobs.map(job => job.remaining);
    for (const id of MACHINE_IDS) {
      if (!s.machines[id].running || busy(s, id)) continue;
      const p = s.products.find(item => item.machine === id && item.kind === "production" && item.status === "flowing");
      boundaries.push(p ? (p.quality === null ? RULES.cycle - 1 : RULES.cycle) - p.progress : RULES.cycle - 1);
    }
    const dt = Math.min(left, .05, !s.faultStarted ? Math.max(EPSILON, RULES.faultAt - s.elapsed) : Infinity,
      ...boundaries.map(boundary => Math.max(EPSILON, boundary)));
    // Complete the previous interval before activating the change at exactly 12 seconds.
    for (const id of MACHINE_IDS) {
      const m = s.machines[id];
      if (!m.running || busy(s, id)) continue;
      let p = s.products.find(item => item.machine === id && item.kind === "production" && item.status === "flowing");
      if (!p) {
        p = { id: ++s.serial, machine: id, lot: m.lot, revision: m.revision, kind: "production", progress: 0, quality: null, status: "flowing", born: s.elapsed };
        s.products.push(p);
      }
      p.progress = Math.min(RULES.cycle, p.progress + dt);
      // Inspection and delivery are part of the same six-second illustrative cycle.
      if (p.progress + EPSILON >= RULES.cycle - 1 && p.quality === null) {
        p.quality = defective(s, id, p.lot) ? "bad" : "good";
        if (p.quality === "bad") {
          if (!m.alarm) tell(s, "検査：" + machineName(id) + " / " + p.lot + "で不良を検出。正常な設備と、何が違う？");
          m.alarm = true;
        }
      }
      if (p.progress + EPSILON >= RULES.cycle) {
        p.status = "stored"; p.progress = RULES.cycle;
        if (p.quality === "good" && m.verified && p.revision === m.revision && !m.celebrated) {
          m.celebrated = true; tell(s, QUIPS.delivered, id);
          log(s, "result", machineName(id) + "：確認済みの生産条件で、通常生産の良品が置場へ到着。");
        }
      }
    }
    s.elapsed = Math.min(RULES.duration, s.elapsed + dt);
    for (const job of s.jobs) {
      job.remaining = Math.max(0, job.remaining - dt);
      if (job.productId) {
        const p = s.products.find(item => item.id === job.productId)!;
        p.progress = RULES.trial - job.remaining;
      }
      if (job.remaining < EPSILON) finishJob(s, job);
    }
    s.jobs = s.jobs.filter(j => j.remaining >= EPSILON);
    if (!s.faultStarted && s.elapsed + EPSILON >= RULES.faultAt) {
      s.faultStarted = true;
      s.machines["machine-b"].lot = "L2"; s.machines["machine-c"].lot = "L2";
      tell(s, QUIPS.onset);
    }
    left -= dt;
  }
  if (s.elapsed + EPSILON >= RULES.duration) {
    s.elapsed = RULES.duration; s.phase = "finished"; s.panel = null; s.dashUntil = 0;
  }
  return s;
}
export function dash(s: GameState): GameState {
  return s.phase === "playing" && s.elapsed + EPSILON >= s.dashReadyAt
    ? { ...s, dashUntil: s.elapsed + RULES.dashDuration, dashReadyAt: s.elapsed + RULES.dashCooldown } : s;
}
export function resultFor(s: GameState) {
  const production = counts(s);
  const verified = s.machines["machine-b"].verified && s.machines["machine-c"].verified;
  const success = verified && production.good >= RULES.target;
  const condition = success ? "success" : verified ? "verified" : "fallback";
  return { ...production, verified, success, title: TITLES.find(t => t.condition === condition)! };
}
export class SurvivalRuntime {
  private state = createGame();
  private snapshot = this.state;
  private listeners = new Set<() => void>();
  private publishIn = 0;
  getState = () => this.state;
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private set(next: GameState, immediate = true) {
    if (next === this.state) return;
    this.state = next;
    if (immediate || this.publishIn <= 0 || next.phase !== this.snapshot.phase) {
      this.snapshot = next; this.publishIn = .1; this.listeners.forEach(listener => listener());
    }
  }
  start(caseId: CaseId = "case-a") { this.publishIn = 0; this.set(startGame(caseId)); }
  open(target: GameState["panel"]) { this.set(openPanel(this.state, target)); }
  close() { this.set(closePanel(this.state)); }
  pause() { this.set(pauseGame(this.state)); }
  resume() { this.set(resumeGame(this.state)); }
  command(cmd: Command) { const next = command(this.state, cmd); const accepted = next !== this.state; this.set(next); return accepted; }
  dash() { this.set(dash(this.state)); }
  tick(seconds: number) { this.publishIn -= seconds; this.set(advanceGame(this.state, seconds), false); }
}
