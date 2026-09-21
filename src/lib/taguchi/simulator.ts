import { getCondition, VERSION, type Experiment, type Level, type Observation } from './types';

// Separate from analysis. This response is a fictional apparatus, not a process recommendation.
export function response(conditionId: string, z: Level): number {
  const { a, b } = getCondition(conditionId);
  if (![-1, 0, 1].includes(z)) throw new Error('Invalid noise level');
  return 1 + .25 * (a + 1) ** 2 + .15 * (b + 1) ** 2 + (1.5 - .5 * a - .3 * b) * z ** 2 + .3 * (1 - a) * z;
}
function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619);
  return h >>> 0;
}
function draw(state: number): number {
  let t = (state + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export function measurement(e: Experiment, seed: number): number {
  return response(e.conditionId, e.noise) + .06 * draw(hash(`${VERSION}:measurement:${seed}:${e.id}`)) - .03;
}
export function runBatch(experiments: readonly Experiment[], seed: number, offset: number): Observation[] {
  // Order and measurements have independent seeds. Stable experiment IDs make batch splitting harmless.
  return [...experiments].sort((a, b) => {
    const order = (e: Experiment) => draw(hash(`${VERSION}:order:${seed}:${e.id}`));
    return order(a) - order(b) || a.id.localeCompare(b.id);
  }).map((e, i) => ({ ...e, order: offset + i + 1, value: measurement(e, seed) }));
}
