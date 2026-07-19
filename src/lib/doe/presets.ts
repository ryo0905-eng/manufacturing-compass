export const doePresets = [
  { id: "none", label: "主効果なし", values: [80, 80, 80, 80] },
  { id: "factor-a", label: "温度だけ効果", values: [70, 90, 70, 90] },
  { id: "additive", label: "両因子に効果", values: [65, 80, 75, 90] },
  { id: "interaction", label: "交互作用あり", values: [70, 76, 72, 96] },
  { id: "crossover", label: "効果が逆転", values: [68, 92, 94, 70] },
  { id: "subtle", label: "差が小さい", values: [79, 81, 80, 82] },
] as const;

export type DoePreset = typeof doePresets[number];
