import { hypotheses, methods, reflections, type Dataset, type Method } from '@/data/correlation-causation';
import { generate, type Observation } from './model';
import { summarize } from './analysis';
export type Session = {
  stage: number; reached: number; hypothesis: number | null; reflection: number | null;
  observation: readonly Observation[]; experiments: Partial<Record<Method, readonly Observation[]>>;
  error: string | null;
};
export type Action = { type: 'start'; hypothesis: number } | { type: 'navigate'; stage: number } | { type: 'experiment'; method: Method } | { type: 'reflect'; answer: number };
export function createSession(): Session {
  const base: Session = { stage: 0, reached: 0, hypothesis: null, reflection: null, observation: [], experiments: {}, error: null };
  try { const observation = generate('observation'); summarize(observation); return { ...base, observation }; }
  catch { return { ...base, error: '教材データを読み込めませんでした。再挑戦してください。' }; }
}
export function transition(state: Session, action: Action, generator: (dataset: Dataset) => readonly Observation[] = generate): Session {
  if (state.error) return state;
  if (action.type === 'start') {
    if (state.hypothesis !== null || !Number.isInteger(action.hypothesis) || !hypotheses[action.hypothesis]) return state;
    return { ...state, hypothesis: action.hypothesis, stage: 1, reached: 1 };
  }
  if (action.type === 'navigate') {
    const allowed = action.stage <= state.reached || (state.stage === 1 && action.stage === 2);
    if (!Number.isInteger(action.stage) || action.stage < 0 || action.stage > 4 || !allowed) return state;
    return { ...state, stage: action.stage, reached: Math.max(state.reached, action.stage) };
  }
  if (action.type === 'experiment') {
    if (state.stage < 2 || !methods.includes(action.method) || state.experiments[action.method]) return state;
    try {
      const rows = generator(action.method);
      if (rows.length !== 40 || rows.some(row => row.dataset !== action.method)) throw new Error('Invalid experiment');
      for (const filter of ['all', 'A', 'B'] as const) summarize(rows, filter);
      const experiments = { ...state.experiments, [action.method]: rows };
      const stage = methods.every(method => experiments[method]) ? 4 : 3;
      return { ...state, experiments, stage, reached: Math.max(state.reached, stage) };
    } catch { return { ...state, error: '実験データを集計できません。履歴を保持し、実験と解析を停止しました。再挑戦してください。' }; }
  }
  if (state.stage !== 4 || state.reflection !== null || !Number.isInteger(action.answer) || !reflections[action.answer]) return state;
  return { ...state, reflection: action.answer };
}
