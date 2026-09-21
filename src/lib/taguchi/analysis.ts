import { conditions, levels, type Observation, type Level } from './types';
export type Statistics = { count: number; mean: number; sd: number; sn: number };
export type ConditionResult = Statistics & { conditionId: string };
export function statistics(values: readonly number[]): Statistics {
  if (!values.length || values.some(v => !Number.isFinite(v) || v < 0)) throw new Error('Invalid measurements');
  const scale = Math.max(...values);
  if (scale === 0) throw new Error('SN ratio is unbounded for all-zero observations');
  const mean = values.reduce((s, v) => s + v / values.length, 0);
  const sd = values.length > 1 ? Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2 / (values.length - 1), 0)) : 0;
  const sn = -20 * Math.log10(scale) - 10 * Math.log10(values.reduce((s, v) => s + (v / scale) ** 2 / values.length, 0));
  if (![mean, sd, sn].every(Number.isFinite)) throw new Error('Calculation out of range');
  return { count: values.length, mean, sd, sn };
}
export function balanced(observations: readonly Observation[], repeats: number): Statistics {
  if (observations.length !== repeats * 3 || new Set(observations.map(o => o.id)).size !== observations.length
    || levels.some(level => {
      const atLevel = observations.filter(o => o.noise === level);
      return atLevel.length !== repeats || new Set(atLevel.map(o => o.replicate)).size !== repeats;
    })) throw new Error('Unbalanced experiment');
  return statistics(observations.map(o => o.value));
}
export function analyze(observations: readonly Observation[]) {
  const stress = observations.filter(o => o.phase === 'stress');
  if (stress.length !== 54) throw new Error('Incomplete stress experiment');
  const results: ConditionResult[] = conditions.map(c => ({ conditionId: c.id, ...balanced(stress.filter(o => o.conditionId === c.id), 2) }));
  const best = results.reduce((a, b) => b.sn > a.sn ? b : a);
  const effects = (axis: 'a' | 'b'): { level: Level; sn: number }[] => levels.map(level => {
    const ids = conditions.filter(c => c[axis] === level).map(c => c.id);
    return { level, sn: results.filter(r => ids.includes(r.conditionId)).reduce((sum, r) => sum + r.sn, 0) / 3 };
  });
  return { results, best, effects: { a: effects('a'), b: effects('b') } };
}
export type Analysis = ReturnType<typeof analyze>;
export function confirmation(observations: readonly Observation[]) {
  const rows = observations.filter(o => o.phase === 'confirmation');
  if (rows.length !== 18) throw new Error('Incomplete confirmation');
  const baseline = balanced(rows.filter(o => o.arm === 'baseline'), 3);
  const candidate = balanced(rows.filter(o => o.arm === 'candidate'), 3);
  const delta = candidate.sn - baseline.sn;
  return { baseline, candidate, delta, outcome: Math.abs(delta) < .1 ? 'similar' as const : delta > 0 ? 'better' as const : 'worse' as const };
}
