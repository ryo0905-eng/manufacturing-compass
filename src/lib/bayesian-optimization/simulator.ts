import { normal, uniform } from "./random";
import { candidates, NOISE_SD, validateCondition, type Condition, type Observation } from "./types";

/** Fictional response, not a physical model. Only the apparatus and final review may use this. */
export function trueResponse(point: Condition): number {
  validateCondition(point);
  // Shift the proposed valley: the unshifted function made the DOE centre nearly optimal.
  const u = (point.temperature - 400) / 100 - 0.35;
  const v = (point.pressure - 60) / 40 + 0.3;
  return 2 + 1.5 * (v - 0.55 * u) ** 2 + 0.6 * (u + 0.2) ** 2 + 0.7 * (1 - Math.cos(4 * u + v));
}

export function measure(point: Condition, noiseState: number): { value: number; noiseState: number } {
  const noise = normal(noiseState);
  return { value: trueResponse(point) + NOISE_SD * noise.value, noiseState: noise.state };
}

export function initialNoiseState(seed: number): number { return (seed ^ 0xa341316c) >>> 0; }

export function doePlan(seed: number): Condition[] {
  const points: Condition[] = [
    { temperature: 300, pressure: 20 }, { temperature: 500, pressure: 20 },
    { temperature: 300, pressure: 100 }, { temperature: 500, pressure: 100 },
    { temperature: 400, pressure: 60 },
  ];
  let state = (seed ^ 0xc8013ea4) >>> 0;
  for (let i = points.length - 1; i > 0; i--) {
    const draw = uniform(state); state = draw.state;
    const j = Math.floor(draw.value * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }
  return points;
}

export function reveal(observations: readonly Observation[]) {
  if (observations.length !== 12) throw new Error("答え合わせは12回の実験後です。");
  const surface = candidates.map(point => ({ ...point, value: trueResponse(point) }));
  const best = surface.reduce((a, b) => b.value < a.value ? b : a);
  return { surface, best, values: observations.map(trueResponse) };
}
