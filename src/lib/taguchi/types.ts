export type Level = -1 | 0 | 1;
export type Condition = { id: string; a: Level; b: Level; temperature: number; pressure: number };
export type Phase = 'nominal' | 'stress' | 'confirmation';
export type Arm = 'design' | 'baseline' | 'candidate';
export type Stage = 'ready' | 'baseline' | 'stress' | 'compare' | 'review';
export type Experiment = { id: string; phase: Phase; conditionId: string; noise: Level; replicate: number; arm: Arm };
export type Observation = Experiment & { order: number; value: number };
export const levels: readonly Level[] = [-1, 0, 1];
// First two columns of L9: all 3 × 3 combinations, with no run-count saving.
export const conditions: readonly Condition[] = levels.flatMap((a, i) => levels.map((b, j) => ({ id: `c${i * 3 + j + 1}`, a, b, temperature: 400 + 40 * a, pressure: 60 + 20 * b })));
export const VERSION = 'taguchi-deposition-v1';
export const SEED = 20260921;
export function getCondition(id: string): Condition {
  const value = conditions.find(c => c.id === id);
  if (!value) throw new Error('Unknown condition');
  return value;
}
export function experiment(phase: Phase, conditionId: string, noise: Level, replicate: number, arm: Arm = 'design'): Experiment {
  getCondition(conditionId);
  return { id: `${phase}:${arm}:${conditionId}:${noise}:${replicate}`, phase, conditionId, noise, replicate, arm };
}
