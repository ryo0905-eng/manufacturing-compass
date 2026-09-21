import { analyze, confirmation, type Analysis } from './analysis';
import { runBatch } from './simulator';
import { conditions, experiment, getCondition, levels, SEED, type Observation, type Stage } from './types';
export type Session = { seed: number; stage: Stage; observations: Observation[]; baseline: string | null; candidate: string | null; analysis: Analysis | null; result: ReturnType<typeof confirmation> | null; error: boolean };
export type Command = { type: 'nominal' } | { type: 'baseline'; conditionId: string } | { type: 'remaining' } | { type: 'confirm'; conditionId: string };
export function createSession(seed = SEED): Session {
  return { seed, stage: 'ready', observations: [], baseline: null, candidate: null, analysis: null, result: null, error: false };
}
function stressPlan(ids: readonly string[]) {
  return ids.flatMap(id => levels.flatMap(z => [1, 2].map(r => experiment('stress', id, z, r))));
}
export function advance(s: Session, command: Command, calculate = analyze): Session {
  if (s.error || s.stage === 'review') return s;
  let plan; let stage: Stage; let baseline = s.baseline, candidate = s.candidate;
  if (command.type === 'nominal' && s.stage === 'ready') {
    plan = conditions.map(c => experiment('nominal', c.id, 0, 1)); stage = 'baseline';
  } else if (command.type === 'baseline' && s.stage === 'baseline') {
    getCondition(command.conditionId); baseline = command.conditionId;
    plan = stressPlan([baseline]); stage = 'stress';
  } else if (command.type === 'remaining' && s.stage === 'stress') {
    plan = stressPlan(conditions.filter(c => c.id !== baseline).map(c => c.id)); stage = 'compare';
  } else if (command.type === 'confirm' && s.stage === 'compare' && baseline) {
    getCondition(command.conditionId); candidate = command.conditionId;
    plan = (['baseline', 'candidate'] as const).flatMap(arm => levels.flatMap(z => [1, 2, 3].map(r => experiment('confirmation', arm === 'baseline' ? baseline! : candidate!, z, r, arm))));
    stage = 'review';
  } else return s; // Duplicate/out-of-stage commands do not spend experiments.
  const observations = [...s.observations, ...runBatch(plan, s.seed, s.observations.length)];
  const next: Session = { ...s, stage, baseline, candidate, observations, analysis: null, result: null };
  try {
    if (stage === 'compare' || stage === 'review') next.analysis = calculate(observations);
    if (stage === 'review') next.result = confirmation(observations);
  } catch { next.error = true; next.analysis = null; next.result = null; }
  return next;
}
