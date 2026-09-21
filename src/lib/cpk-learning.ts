import { initialLearningState, learningControls, type LearningState } from '../data/cpk-learning';
import { calculateCapability } from './process-capability';
import { cpkText, type CpkLocale } from '../data/cpk-text';
export type LearningComparison = { current: LearningState; baseline: LearningState };
export type LearningAction = { type: 'update'; key: keyof LearningState; value: number } | { type: 'preset'; state: LearningState } | { type: 'baseline' } | { type: 'reset' };
export function learningReducer(state: LearningComparison, action: LearningAction): LearningComparison {
  switch (action.type) {
    case 'baseline': return { ...state, baseline: { ...state.current } };
    case 'reset': return { current: { ...initialLearningState }, baseline: { ...initialLearningState } };
    case 'preset': return { ...state, current: { ...action.state } };
    case 'update': return { ...state, current: { ...state.current, [action.key]: action.value } };
  }
}
export function learningCapability(state: LearningState) {
  return calculateCapability({ mean: state.mean, standardDeviation: state.standardDeviation, lowerSpecificationLimit: state.lsl, upperSpecificationLimit: state.usl, method: 'short-term' });
}
export const densityDomain = { min: 92, max: 108, maxDensity: 1 / (0.25 * Math.sqrt(2 * Math.PI)) };
export function normalDensity(value: number, state: LearningState) {
  return Math.exp(-0.5 * ((value - state.mean) / state.standardDeviation) ** 2) / (state.standardDeviation * Math.sqrt(2 * Math.PI));
}
export function comparisonMessage(baseline: LearningState, current: LearningState, locale: CpkLocale = 'ja'): string {
  const text = (ja: string, en: string) => locale === 'en' ? en : ja;
  const changed = learningControls.filter(control => Math.abs(baseline[control.key] - current[control.key]) > 1e-9);
  const boundary = current.mean === current.lsl || current.mean === current.usl;
  const outside = current.mean < current.lsl || current.mean > current.usl;
  const suffix = outside ? text(' 平均が規格外にあるため、Cpkは負になります。', ' Cpk is negative because the mean is outside the specification limits.') : boundary ? text(' 平均が規格限界上にあるため、Cpkは0です。', ' Cpk is zero because the mean is on a specification limit.') : '';
  let message: string;
  if (!changed.length) message = text('比較基準と同じ状態です。平均・標準偏差・規格を一つずつ動かして比べてみてください。', 'The conditions match the baseline. Change the mean, standard deviation or limits one at a time to compare.');
  else if (changed.length === 1 && changed[0].key === 'mean') {
    const center = (current.lsl + current.usl) / 2;
    const delta = Math.abs(current.mean - center) - Math.abs(baseline.mean - center);
    message = Math.abs(delta) < 1e-9
      ? text('平均の位置は変わりましたが、規格中心からの距離は同じです。CpとCpkは変わりません。', 'The mean moved, but its distance from the specification midpoint is unchanged. Cp and Cpk stay the same.')
      : text(`平均が規格中心${delta < 0 ? 'へ近づいたため、Cpkは上がります' : 'から離れたため、Cpkは下がります'}。規格幅と標準偏差は同じなので、Cpは変わりません。`, `The mean moved ${delta < 0 ? 'closer to' : 'farther from'} the specification midpoint, so Cpk ${delta < 0 ? 'increases' : 'decreases'}. Cp is unchanged because the specification width and standard deviation are unchanged.`);
  } else if (changed.length === 1 && changed[0].key === 'standardDeviation') {
    const smaller = current.standardDeviation < baseline.standardDeviation;
    message = text(`標準偏差が${smaller ? '小さく' : '大きく'}なり、分布が${smaller ? '狭く' : '広く'}なりました。`, `Standard deviation ${smaller ? 'decreased' : 'increased'}, making the distribution ${smaller ? 'narrower' : 'wider'}.`);
    message += outside ? text(' 平均が規格外では、ばらつきを小さくするとCpkはさらに負の方向へ変わります。平均の位置も確認してください。', ' When the mean is outside the limits, reducing variation makes Cpk more negative. Check the mean position too.') : boundary ? text(' Cpは変わりますが、Cpkは0のままです。', ' Cp changes, but Cpk remains zero.') : text(` 平均と規格は同じなので、CpとCpkはともに${smaller ? '上がります' : '下がります'}。`, ` The mean and limits are unchanged, so both Cp and Cpk ${smaller ? 'increase' : 'decrease'}.`);
  } else if (changed.every(control => control.key === 'lsl' || control.key === 'usl')) {
    message = text('規格を変更しましたが、工程分布は変わっていません。Cp・Cpkの変化は評価する規格の変更によるもので、工程そのものが改善したことを示しません。', 'The specification limits changed, but the process distribution did not. Changes in Cp and Cpk reflect a different specification, not an improvement to the process itself.');
  } else message = text(`${changed.map(control => control.label).join('・')}を変更しています。複数の条件が変わっているため、一つの原因だけに結び付けず、比較表で確認してください。`, `${changed.map(control => cpkText('en', control.label)).join(', ')} changed. Multiple conditions changed; use the comparison table rather than attributing the result to a single cause.`);
  return message + suffix;
}
