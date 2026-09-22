import { processSteps, questions, type ProcessStepId } from '@/data/semiconductor-process';
export const OPENINGS = [{ x: 156, width: 72 }, { x: 352, width: 72 }] as const;
export const REGIONS = [{ x: 40, width: 116, opening: false }, { x: 156, width: 72, opening: true }, { x: 228, width: 124, opening: false }, { x: 352, width: 72, opening: true }, { x: 424, width: 116, opening: false }] as const;
export function frame(step: number, progress: number) {
  if (!Number.isInteger(step) || step < 0 || step >= processSteps.length || !Number.isFinite(progress) || progress < 0 || progress > 1) throw new Error('Invalid process frame');
  const film = step < 1 ? 0 : step === 1 ? 52 * progress : 52;
  const resist = step < 2 ? 0 : step === 2 ? 34 * progress : step === 6 ? 34 * (1 - progress) : step > 6 ? 0 : 34;
  const etch = step < 5 ? 0 : step === 5 ? progress : 1;
  const developed = step < 4 ? 0 : step === 4 ? progress : 1;
  return {
    substrate: { x: 40, y: 256, width: 500, height: 72 },
    regions: REGIONS.map(r => ({ ...r, filmHeight: r.opening ? film * (1 - etch) : film, resistHeight: r.opening ? resist * (1 - developed) : resist })),
    exposed: step === 3 ? progress : step > 3 ? 1 : 0,
    dirt: step === 0 ? 1 - progress : 0,
    residue: step === 5 ? progress : step === 6 ? 1 : step === 7 ? 1 - progress : 0,
    exposureActive: step === 3,
  };
}
export type ProcessState = { view: 'overview' | 'process' | 'summary'; overview: number; step: number; progress: number; playing: boolean; token: number; reduced: boolean; started: boolean; completed: ProcessStepId[]; explained: string[]; announcement: string };
export type ProcessAction = { type: 'enter' } | { type: 'overview'; index: number } | { type: 'step'; index: number } | { type: 'play' } | { type: 'pause' } | { type: 'replay' } | { type: 'scrub'; progress: number } | { type: 'tick'; token: number; progress: number } | { type: 'motion'; reduced: boolean } | { type: 'question'; id: string } | { type: 'summary' };
export type ProcessEvent = { name: string; step_id?: ProcessStepId; question_id?: string };
export function initialState(): ProcessState {
  return { view: 'overview', overview: 2, step: 0, progress: 0, playing: false, token: 0, reduced: false, started: false, completed: [], explained: [], announcement: '' };
}
export function transition(state: ProcessState, action: ProcessAction): { state: ProcessState; events: ProcessEvent[] } {
  const events: ProcessEvent[] = [];
  let next = state;
  const stop = () => ({ ...state, playing: false, token: state.token + 1 });
  switch (action.type) {
    case 'enter':
      next = { ...stop(), view: 'process', started: true };
      if (!state.started) events.push({ name: 'semiconductor_process_started' });
      break;
    case 'overview':
      if (!Number.isInteger(action.index) || action.index < 0 || action.index > 5) break;
      next = { ...stop(), view: 'overview', overview: action.index }; break;
    case 'step':
      if (!state.started || !Number.isInteger(action.index) || action.index < 0 || action.index >= processSteps.length) break;
      next = { ...stop(), view: 'process', step: action.index, progress: 0, announcement: `${processSteps[action.index].verb}：加工前の状態です。` }; break;
    case 'play':
    case 'replay':
      if (state.view !== 'process' || state.playing) break;
      next = { ...state, token: state.token + 1, progress: state.reduced ? 1 : action.type === 'replay' || state.progress === 1 ? 0 : state.progress, playing: !state.reduced, announcement: `${processSteps[state.step].verb}を開始します。` }; break;
    case 'pause':
      if (!state.playing) break;
      next = { ...stop(), announcement: '再生を停止しました。再開ボタンで続けられます。' }; break;
    case 'scrub':
      if (state.view !== 'process' || !Number.isFinite(action.progress)) break;
      next = { ...stop(), progress: Math.max(0, Math.min(1, action.progress)) }; break;
    case 'tick':
      if (!state.playing || action.token !== state.token || !Number.isFinite(action.progress)) break;
      next = { ...state, progress: Math.max(state.progress, Math.min(1, action.progress)), playing: action.progress < 1 }; break;
    case 'motion':
      next = { ...state, reduced: action.reduced };
      if (state.playing && action.reduced) next = { ...next, progress: 1, playing: false, token: state.token + 1 };
      break;
    case 'question':
      if (!questions.some(q => q.id === action.id) || state.explained.includes(action.id)) break;
      next = { ...state, explained: [...state.explained, action.id] };
      events.push({ name: 'semiconductor_process_question_opened', question_id: action.id }); break;
    case 'summary':
      if (!state.completed.includes('clean-after')) break;
      next = { ...stop(), view: 'summary' }; break;
  }
  if (next.view === 'process' && next.progress === 1) {
    const id = processSteps[next.step].id;
    if (!next.completed.includes(id)) {
      next = { ...next, completed: [...next.completed, id] };
      events.push({ name: 'semiconductor_process_step_completed', step_id: id });
      if (next.completed.length === processSteps.length) events.push({ name: 'semiconductor_process_completed' });
    }
    if (state.progress !== 1 || state.step !== next.step || action.type === 'play' || action.type === 'replay') next = { ...next, announcement: `${processSteps[next.step].term}が完了しました。${processSteps[next.step].after}` };
  }
  return { state: next, events };
}
