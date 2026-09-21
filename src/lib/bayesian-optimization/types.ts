export type Condition = { temperature: number; pressure: number };
export type SelectionMethod = "manual" | "doe" | "bo" | "confirmation";
export type Observation = Condition & { run: number; value: number; method: SelectionMethod };
export type Prediction = Condition & { mean: number; sd: number; lcb: number };
export type Stage = "first" | "doe" | "manual" | "explore" | "confirm" | "review";

export const VERSION = "deposition-v1";
export const DEFAULT_SEED = 20260921;
export const NOISE_SD = 0.1;
export const GRID_SIZE = 41;
export const BUDGET = 12;

export function validateCondition(point: Condition): void {
  if (!Number.isFinite(point.temperature) || !Number.isFinite(point.pressure)
    || point.temperature < 300 || point.temperature > 500 || (point.temperature - 300) % 5 !== 0
    || point.pressure < 20 || point.pressure > 100 || (point.pressure - 20) % 2 !== 0) {
    throw new Error("実験条件が操作範囲外です。");
  }
}

export function conditionKey(point: Condition): string {
  return `${point.temperature}:${point.pressure}`;
}

// Pressure-major order also defines deterministic tie breaking.
export const candidates: readonly Condition[] = Array.from({ length: GRID_SIZE ** 2 }, (_, index) => ({
  temperature: 300 + (index % GRID_SIZE) * 5,
  pressure: 20 + Math.floor(index / GRID_SIZE) * 2,
}));

export function stageFor(count: number): Stage {
  if (count === 0) return "first";
  if (count === 1) return "doe";
  if (count === 6) return "manual";
  if (count >= 7 && count <= 10) return "explore";
  if (count === 11) return "confirm";
  if (count === BUDGET) return "review";
  throw new Error("実験履歴の件数が不正です。");
}
