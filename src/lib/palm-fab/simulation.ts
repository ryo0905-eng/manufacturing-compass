import { fabBalance, machineIds, type MachineId } from "@/data/palm-fab";

export const SAVE_VERSION = 1;
export const SAVE_KEY = "mc-palm-fab-v1";

type QueueId = "processOut" | "washIn" | "washOut" | "inspectIn" | "inspectOut";
export type Case = { id: number };
export type Machine = { level: number; case: Case | null; remaining: number };
export type Transport = { case: Case; from: QueueId; to: QueueId | "shipped"; remaining: number };
export type FabState = {
  version: typeof SAVE_VERSION;
  coins: number;
  shipped: number;
  created: number;
  nextId: number;
  elapsed: number;
  upgrades: number;
  paused: boolean;
  machines: Record<MachineId, Machine>;
  queues: Record<QueueId, Case[]>;
  robot: Transport | null;
  shipmentFlash: number;
};

export function newFab(): FabState {
  return {
    version: SAVE_VERSION, coins: fabBalance.startingCoins, shipped: 0, created: 0,
    nextId: 1, elapsed: 0, upgrades: 0, paused: false,
    machines: {
      process: { level: 1, case: null, remaining: 0 },
      wash: { level: 1, case: null, remaining: 0 },
      inspect: { level: 1, case: null, remaining: 0 },
    },
    queues: { processOut: [], washIn: [], washOut: [], inspectIn: [], inspectOut: [] },
    robot: null, shipmentFlash: 0,
  };
}

export function duration(id: MachineId, level: number): number {
  return fabBalance.machines[id].seconds[level - 1];
}

export function upgradeCost(id: MachineId, level: number): number | null {
  return fabBalance.machines[id].costs[level - 1] ?? null;
}

export function buyUpgrade(state: FabState, id: MachineId): FabState {
  const cost = upgradeCost(id, state.machines[id].level);
  if (cost === null || state.coins < cost) return state;
  return {
    ...state, coins: state.coins - cost, upgrades: state.upgrades + 1,
    machines: { ...state.machines, [id]: { ...state.machines[id], level: state.machines[id].level + 1 } },
  };
}

function clone(state: FabState): FabState {
  return {
    ...state,
    machines: Object.fromEntries(machineIds.map(id => [id, { ...state.machines[id] }])) as FabState["machines"],
    queues: Object.fromEntries(Object.entries(state.queues).map(([id, queue]) => [id, [...queue]])) as FabState["queues"],
    robot: state.robot ? { ...state.robot } : null,
  };
}

/** One deterministic simulation step. A blocked machine keeps its case until its output has room. */
export function stepFab(previous: FabState): FabState {
  if (previous.paused) return previous;
  const state = clone(previous);
  const dt = fabBalance.tickSeconds;
  state.elapsed += dt;
  state.shipmentFlash = Math.max(0, state.shipmentFlash - dt);

  if (state.robot) {
    state.robot.remaining = Math.max(0, state.robot.remaining - dt);
    if (state.robot.remaining <= 0) {
      const { case: item, to } = state.robot;
      if (to === "shipped") {
        state.shipped += fabBalance.wafersPerCase;
        state.coins += fabBalance.coinsPerCase;
        state.shipmentFlash = 0.9;
        state.robot = null;
      } else if (state.queues[to].length < fabBalance.queueLimit) {
        state.queues[to].push(item);
        state.robot = null;
      }
    }
  }

  for (const id of machineIds) {
    const machine = state.machines[id];
    const output: QueueId = id === "process" ? "processOut" : id === "wash" ? "washOut" : "inspectOut";
    if (machine.case) {
      machine.remaining = Math.max(0, machine.remaining - dt);
      if (machine.remaining <= 0 && state.queues[output].length < fabBalance.queueLimit) {
        state.queues[output].push(machine.case);
        machine.case = null;
      }
    }
    if (!machine.case) {
      const input = id === "wash" ? state.queues.washIn : id === "inspect" ? state.queues.inspectIn : null;
      const next = input ? input.shift() : { id: state.nextId++ };
      if (next) {
        if (!input) state.created++;
        machine.case = next;
        machine.remaining = duration(id, machine.level);
      }
    }
  }

  if (!state.robot) {
    const jobs: { from: QueueId; to: QueueId | "shipped" }[] = [
      { from: "inspectOut", to: "shipped" },
      { from: "washOut", to: "inspectIn" },
      { from: "processOut", to: "washIn" },
    ];
    const job = jobs.find(({ from, to }) => state.queues[from].length > 0 &&
      (to === "shipped" || state.queues[to].length < fabBalance.queueLimit));
    if (job) {
      const item = state.queues[job.from].shift();
      if (item) state.robot = { case: item, from: job.from, to: job.to, remaining: fabBalance.transferSeconds };
    }
  }
  return state;
}

export function advanceFab(initial: FabState, seconds: number): FabState {
  let state = initial;
  const count = Math.min(100_000, Math.max(0, Math.floor(seconds / fabBalance.tickSeconds)));
  for (let index = 0; index < count; index++) state = stepFab(state);
  return state;
}

export function goalFor(shipped: number): number {
  return fabBalance.goals.find(goal => goal > shipped) ?? Math.ceil((shipped + 1) / 1000) * 1000;
}

export function countInFactory(state: FabState): number {
  return Object.values(state.machines).filter(machine => machine.case).length +
    Object.values(state.queues).reduce((sum, queue) => sum + queue.length, 0) +
    Number(Boolean(state.robot));
}

export function readFabSave(raw: string | null): FabState | null {
  if (!raw || raw.length > 20_000) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const state = value as FabState;
    const validInt = (n: unknown, max = 1e9) => Number.isSafeInteger(n) && (n as number) >= 0 && (n as number) <= max;
    const validCase = (item: unknown): item is Case => Boolean(item && typeof item === "object" && validInt((item as Case).id) && (item as Case).id > 0);
    if (state.version !== SAVE_VERSION || !validInt(state.coins) || !validInt(state.shipped) ||
      state.shipped % fabBalance.wafersPerCase !== 0 || !validInt(state.created) || !validInt(state.nextId) ||
      !validInt(state.upgrades) || typeof state.paused !== "boolean" || !Number.isFinite(state.elapsed) || state.elapsed < 0 ||
      !state.machines || !state.queues) return null;
    for (const id of machineIds) {
      const m = state.machines[id];
      if (!m || !validInt(m.level, fabBalance.maxLevel) || m.level < 1 ||
        !Number.isFinite(m.remaining) || m.remaining < 0 || m.remaining > 20 ||
        (m.case !== null && !validCase(m.case))) return null;
    }
    for (const id of ["processOut", "washIn", "washOut", "inspectIn", "inspectOut"] as QueueId[]) {
      const queue = state.queues[id];
      if (!Array.isArray(queue) || queue.length > fabBalance.queueLimit || !queue.every(validCase)) return null;
    }
    if (state.robot && (!validCase(state.robot.case) ||
      !["processOut", "washOut", "inspectOut"].includes(state.robot.from) ||
      !["washIn", "inspectIn", "shipped"].includes(state.robot.to) ||
      !Number.isFinite(state.robot.remaining) || state.robot.remaining < 0 || state.robot.remaining > fabBalance.transferSeconds)) return null;
    const ids = [
      ...machineIds.flatMap(id => state.machines[id].case ? [state.machines[id].case.id] : []),
      ...Object.values(state.queues).flatMap(queue => queue.map(item => item.id)),
      ...(state.robot ? [state.robot.case.id] : []),
    ];
    if (new Set(ids).size !== ids.length || ids.some(id => id >= state.nextId) ||
      state.created !== state.nextId - 1 || state.created !== state.shipped / fabBalance.wafersPerCase + ids.length) return null;
    state.shipmentFlash = 0;
    return state;
  } catch {
    return null;
  }
}
