import { ACTION_TITLES, GAME_LOCATIONS, RULES, TROUBLES, WAVES, type GameLocationId, type RepairLocation, type Trouble } from "../data/process-engineer-survival";

export type ActiveTrouble = Trouble & { born: number; progress: number; overdue: boolean };
export type Work = { location: GameLocationId; kind: "repair" | "hint" | "rest"; target: string; progress: number };
export type GameNotice = { serial: number; kind: "repair" | "hint" | "rest"; location: GameLocationId; text: string; troubleId?: string; combo: number; points: number };
export type ActionState = {
  phase: "intro" | "playing" | "paused" | "finished";
  elapsed: number; hp: number; san: number; yield: number; trust: number; boss: number;
  score: number; resolved: number; combo: number; bestCombo: number; lastRepair: number;
  spawned: string[]; tasks: ActiveTrouble[]; hints: RepairLocation[]; hintsUsed: number;
  work: Work | null; restReadyAt: number; dashUntil: number; dashReadyAt: number;
  notice: GameNotice | null;
};
export function createGame(): ActionState {
  return { phase: "intro", elapsed: 0, hp: 100, san: 100, yield: 92, trust: 50, boss: 50,
    score: 0, resolved: 0, combo: 0, bestCombo: 0, lastRepair: -Infinity,
    spawned: [], tasks: [], hints: [], hintsUsed: 0, work: null, restReadyAt: 0,
    dashUntil: 0, dashReadyAt: 0, notice: null };
}
export function capacity(seconds: number) {
  return [...WAVES].reverse().find(wave => seconds >= wave.at)?.cap ?? 1;
}
function spawn(state: ActionState): ActionState {
  const tasks = [...state.tasks], spawned = [...state.spawned];
  for (const trouble of TROUBLES) {
    if (tasks.length >= capacity(state.elapsed)) break;
    if (trouble.at > state.elapsed || spawned.includes(trouble.id) || tasks.some(t => t.location === trouble.location)) continue;
    tasks.push({ ...trouble, born: state.elapsed, progress: 0, overdue: false });
    spawned.push(trouble.id);
  }
  return { ...state, tasks, spawned };
}
export function startGame() { return spawn({ ...createGame(), phase: "playing" }); }
export function pauseGame(s: ActionState): ActionState {
  return s.phase === "playing" ? { ...s, phase: "paused", work: null, dashUntil: s.elapsed } : s;
}
export function resumeGame(s: ActionState): ActionState { return s.phase === "paused" ? { ...s, phase: "playing" } : s; }
export function dash(s: ActionState): ActionState {
  return s.phase === "playing" && s.elapsed >= s.dashReadyAt
    ? { ...s, dashUntil: s.elapsed + RULES.dashDuration, dashReadyAt: s.elapsed + RULES.dashCooldown } : s;
}
export function hintTarget(s: ActionState, source: GameLocationId) {
  const candidates = s.tasks.filter(t => !s.hints.includes(t.location));
  return source === "quality" ? candidates[0] : candidates[candidates.length - 1];
}
export function beginWork(s: ActionState, location: GameLocationId | null): ActionState {
  if (s.phase !== "playing" || !location || s.work) return s;
  const task = s.tasks.find(t => t.location === location);
  if (task) return { ...s, work: { location, target: task.id, kind: "repair", progress: task.progress } };
  if (location === "quality" || location === "analysis-pc") {
    const target = hintTarget(s, location);
    if (target) return { ...s, work: { location, target: target.location, kind: "hint", progress: 0 } };
  }
  if (location === "break-room" && s.elapsed >= s.restReadyAt) return { ...s, work: { location, target: location, kind: "rest", progress: 0 } };
  return s;
}
export function stopWork(s: ActionState): ActionState { return s.work ? { ...s, work: null } : s; }
export function workDuration(s: ActionState) {
  if (s.work?.kind === "hint") return RULES.hint;
  if (s.work?.kind === "rest") return RULES.rest;
  return s.hints.includes(s.work?.location as RepairLocation) ? RULES.hintedRepair : RULES.repair;
}
function completeWork(s: ActionState): ActionState {
  const work = s.work!;
  const serial = (s.notice?.serial ?? 0) + 1;
  if (work.kind === "repair") {
    const combo = s.elapsed - s.lastRepair <= RULES.comboWindow + 1e-8 ? Math.min(RULES.maxCombo, s.combo + 1) : 1;
    const points = 100 * combo;
    const task = s.tasks.find(t => t.id === work.target)!;
    const hinted = s.hints.includes(task.location);
    return { ...s, work: null, tasks: s.tasks.filter(t => t.id !== work.target),
      hints: s.hints.filter(id => id !== task.location), hintsUsed: s.hintsUsed + Number(hinted),
      resolved: s.resolved + 1, combo, bestCombo: Math.max(combo, s.bestCombo), lastRepair: s.elapsed,
      score: s.score + points, yield: Math.min(100, s.yield + RULES.repairYield),
      trust: Math.min(100, s.trust + 2), boss: Math.min(100, s.boss + 1),
      notice: { serial, kind: "repair", location: task.location, troubleId: task.id, combo, points, text: task.quip } };
  }
  if (work.kind === "hint") {
    const target = work.target as RepairLocation;
    return { ...s, work: null, hints: [...new Set([...s.hints, target])],
      notice: { serial, kind: "hint", location: work.location, combo: 0, points: 0,
        text: `◆ ${GAME_LOCATIONS.find(l => l.id === target)?.shortLabel}の手掛かり！ 復旧3秒 → 1秒` } };
  }
  return { ...s, work: null, hp: Math.min(100, s.hp + 25), san: Math.min(100, s.san + 25),
    restReadyAt: s.elapsed + RULES.restCooldown,
    notice: { serial, kind: "rest", location: work.location, combo: 0, points: 0, text: "休憩完了。午後の再現性、回復！" } };
}
// Small deterministic steps prevent a long frame from skipping deadlines or a wave boundary.
export function advanceGame(state: ActionState, seconds: number): ActionState {
  if (state.phase !== "playing" || !Number.isFinite(seconds) || seconds <= 0) return state;
  let s = state;
  let remaining = Math.min(seconds, RULES.duration - s.elapsed);
  while (remaining > 1e-8 && s.phase === "playing") {
    const dt = Math.min(.05, remaining);
    remaining -= dt;
    s = { ...s, elapsed: Math.min(RULES.duration, s.elapsed + dt),
      hp: Math.max(0, s.hp - RULES.fatigueHp * dt), san: Math.max(0, s.san - RULES.fatigueSan * dt) };
    let penalties = 0;
    s = { ...s, tasks: s.tasks.map(t => {
      if (!t.overdue && s.elapsed - t.born >= RULES.deadline - 1e-8) {
        penalties++; return { ...t, overdue: true };
      }
      return t;
    }) };
    s = { ...s, yield: Math.max(0, s.yield - penalties * RULES.overdueYield) };
    if (s.work) {
      const progress = Math.min(workDuration(s), s.work.progress + dt);
      s = { ...s, work: { ...s.work, progress }, tasks: s.tasks.map(t => t.id === s.work?.target ? { ...t, progress } : t) };
      if (progress >= workDuration(s) - 1e-8) s = completeWork(s);
    }
    if (s.elapsed >= RULES.duration - 1e-8) {
      s = { ...s, elapsed: RULES.duration, phase: "finished", work: null, dashUntil: 0 };
    } else s = spawn(s);
  }
  return s;
}
export function resultFor(s: ActionState) {
  // Due jobs waiting for a free station also belong to the handover.
  const pending = TROUBLES.filter(t => t.at <= s.elapsed).length - s.resolved;
  const title = ACTION_TITLES.find(t => s.resolved >= t.minResolved && s.bestCombo >= t.minCombo &&
    pending <= t.maxPending && s.hintsUsed >= (t.minHints ?? 0))!;
  return { pending, overtime: pending * 10, title };
}
export function clockFor(s: ActionState) {
  const minutes = Math.min(1020, 480 + Math.floor(s.elapsed * 3));
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

// One authoritative state. Phaser reads it each frame; React subscribes at 10 Hz.
export class SurvivalRuntime {
  private state = createGame();
  private snapshot = this.state;
  private listeners = new Set<() => void>();
  private publishIn = 0;
  getState = () => this.state;
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private set(next: ActionState, publish = true) {
    if (next === this.state) return;
    this.state = next;
    if (publish) {
      this.snapshot = next;
      this.listeners.forEach(listener => listener());
      this.publishIn = 0;
    }
  }
  start = () => this.set(startGame());
  pause = () => this.set(pauseGame(this.state));
  resume = () => this.set(resumeGame(this.state));
  begin = (location: GameLocationId | null) => this.set(beginWork(this.state, location));
  stop = () => this.set(stopWork(this.state));
  dash = () => this.set(dash(this.state));
  tick = (seconds: number) => {
    if (this.state.phase !== "playing") return;
    const previous = this.state;
    const next = advanceGame(previous, seconds);
    this.publishIn += seconds;
    this.set(next, this.publishIn >= .1 || previous.notice !== next.notice || previous.phase !== next.phase);
  };
}
