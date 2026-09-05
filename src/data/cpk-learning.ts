export type LearningState = { mean: number; standardDeviation: number; lsl: number; usl: number };
export const learningControls: { key: keyof LearningState; label: string; min: number; max: number; step: number }[] = [
  { key: 'mean', label: '平均 μ', min: 96, max: 104, step: 0.05 },
  { key: 'standardDeviation', label: '標準偏差 σ', min: 0.25, max: 1.5, step: 0.05 },
  { key: 'lsl', label: '下限規格 LSL', min: 94, max: 99.5, step: 0.1 },
  { key: 'usl', label: '上限規格 USL', min: 100.5, max: 106, step: 0.1 },
];
export const learningPresets = [
  { id: 'centered', label: '中心・Cpk 1.33', state: { mean: 100, standardDeviation: 0.75, lsl: 97, usl: 103 } },
  { id: 'shifted', label: '平均が上限側', state: { mean: 101, standardDeviation: 0.75, lsl: 97, usl: 103 } },
  { id: 'variation', label: 'ばらつきが大きい', state: { mean: 100, standardDeviation: 1.2, lsl: 97, usl: 103 } },
  { id: 'narrow', label: '規格幅が狭い', state: { mean: 100, standardDeviation: 0.75, lsl: 98, usl: 102 } },
  { id: 'capable', label: '余裕のある工程', state: { mean: 100, standardDeviation: 0.5, lsl: 97, usl: 103 } },
] as const;
export const initialLearningState: LearningState = learningPresets[0].state;
