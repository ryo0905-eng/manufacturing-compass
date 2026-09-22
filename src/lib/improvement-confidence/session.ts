import { cases, defaultSettings, sampleSizes, actions, type ActionId, type Settings } from '@/data/improvement-confidence';
import { analyze, type Analysis } from './statistics';
import { generate, validateSettings, type Observations } from './model';
export type Run = { number: number; settings: Settings; observations: Observations; result: Analysis };
export type Lesson = { observations: Observations; sizeIndex: number; maxSizeIndex: number; choice?: ActionId; complete: boolean };
export type Session = { revision: number; started: boolean; mode: 'guided' | 'free'; caseIndex: number; lessons: Lesson[]; settings: Settings; runs: Run[]; nextRun: number; error?: string };
export type Event = { name: string; mode: 'guided' | 'free'; case_id?: string };
export type Action = { type: 'start' } | { type: 'size'; index: number } | { type: 'choose'; choice: ActionId } | { type: 'reflect' } | { type: 'case'; index: number } | { type: 'free' } | { type: 'setting'; settings: Settings } | { type: 'run' } | { type: 'reset' };
export function initialSession(): Session {
  return { revision: 0, started: false, mode: 'guided', caseIndex: 0, lessons: [], settings: { ...defaultSettings }, runs: [], nextRun: 1 };
}
function lesson(index: number, make: typeof generate): Lesson {
  const observations = make({ change: cases[index].change, sd: 3, n: 100, threshold: 2 }, `guided:${cases[index].id}:1`);
  // Validate every selectable prefix before accepting this lesson.
  for (const n of sampleSizes) analyze(observations.before.slice(0, n), observations.after.slice(0, n));
  return { observations, sizeIndex: 0, maxSizeIndex: 0, complete: false };
}
export function transition(state: Session, action: Action, make = generate): { state: Session; events: Event[] } {
  if (state.error) return { state, events: [] };
  const events: Event[] = [];
  let next = state;
  try {
    const current = state.lessons[state.caseIndex];
    switch (action.type) {
      case 'start':
        if (state.started) break;
        next = { ...state, started: true, lessons: [lesson(0, make)] };
        events.push({ name: 'improvement_started', mode: 'guided' }); break;
      case 'size':
        if (!current || state.mode !== 'guided' || !Number.isInteger(action.index) || action.index < 0 || action.index > 2 || action.index > current.maxSizeIndex + 1) break;
        next = { ...state, lessons: state.lessons.map((l, i) => i === state.caseIndex ? { ...l, sizeIndex: action.index, maxSizeIndex: Math.max(l.maxSizeIndex, action.index) } : l) }; break;
      case 'choose':
        if (!current || current.complete || current.sizeIndex !== 2 || state.mode !== 'guided' || !actions.some(a => a.id === action.choice)) break;
        next = { ...state, lessons: state.lessons.map((l, i) => i === state.caseIndex ? { ...l, choice: action.choice } : l) }; break;
      case 'reflect':
        if (!current?.choice || current.complete || current.sizeIndex !== 2 || state.mode !== 'guided') break;
        next = { ...state, lessons: state.lessons.map((l, i) => i === state.caseIndex ? { ...l, complete: true } : l) };
        events.push({ name: 'improvement_case_completed', mode: 'guided', case_id: cases[state.caseIndex].id });
        if (next.lessons.length === 3 && next.lessons.every(l => l.complete)) events.push({ name: 'improvement_guided_completed', mode: 'guided' });
        break;
      case 'case':
        if (!state.started || !Number.isInteger(action.index) || action.index < 0 || action.index > 2 || (action.index > 0 && !state.lessons[action.index - 1]?.complete)) break;
        next = { ...state, mode: 'guided', caseIndex: action.index, lessons: state.lessons[action.index] ? state.lessons : [...state.lessons, lesson(action.index, make)] }; break;
      case 'free':
        if (state.lessons.length !== 3 || !state.lessons.every(l => l.complete)) break;
        next = { ...state, mode: 'free' }; break;
      case 'setting':
        if (state.mode !== 'free') break;
        validateSettings(action.settings); next = { ...state, settings: { ...action.settings } }; break;
      case 'run': {
        if (state.mode !== 'free' || state.runs.length >= 20) break;
        const settings = { ...state.settings }, observations = make(settings, `free:${state.nextRun}`);
        const result = analyze(observations.before, observations.after);
        next = { ...state, nextRun: state.nextRun + 1, runs: [...state.runs, { number: state.nextRun, settings, observations, result }] };
        events.push({ name: 'improvement_experiment_run', mode: 'free' }); break;
      }
      case 'reset':
        if (state.mode !== 'free' || state.runs.length !== 20) break;
        // Do not reuse an experiment's random stream after clearing its history.
        next = { ...state, runs: [] }; break;
    }
    return { state: next === state ? state : { ...next, revision: state.revision + 1 }, events };
  } catch (error) {
    return { state: { ...state, revision: state.revision + 1, error: error instanceof Error ? error.message : '計算を停止しました。' }, events: [] };
  }
}
