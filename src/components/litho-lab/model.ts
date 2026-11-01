// 教材用の架空係数。露光量は基準比%、焦点は µm、CD は目標比%。
// 露光量 1% の増加で CD が 0.5 ポイント減り、焦点ずれの二乗で太る。
export const doseSensitivity = 0.5;
export const focusSensitivity = 80;
export const initialConditions = { dose: 100, focus: 0 };
export type Conditions = typeof initialConditions;

export function calculateConditions({ dose, focus }: Conditions) {
  const cd = 100 - doseSensitivity * (dose - 100) + focusSensitivity * focus ** 2;
  // 余裕は他方の条件を固定したときの CD 規格境界までの距離。
  const doseLow = 100 + (focusSensitivity * focus ** 2 - 10) / doseSensitivity;
  const doseHigh = 100 + (focusSensitivity * focus ** 2 + 10) / doseSensitivity;
  const focusLimitSquared = (10 + doseSensitivity * (dose - 100)) / focusSensitivity;
  const focusLimit = focusLimitSquared >= 0 ? Math.sqrt(focusLimitSquared) : 0;
  const lowerFocusSquared = (-10 + doseSensitivity * (dose - 100)) / focusSensitivity;
  const lowerFocusLimit = lowerFocusSquared > 0 ? Math.sqrt(lowerFocusSquared) : 0;
  const inSpec = cd >= 90 - 1e-9 && cd <= 110 + 1e-9;
  const state = Math.abs(focus) >= 0.35 ? "解像不良・倒れ寄り" : cd < 90 ? "細り・断線寄り" : cd > 110 ? "太り・残渣寄り" : "正常に近い";
  return { cd, inSpec, state, doseMargin: inSpec ? Math.min(dose - doseLow, doseHigh - dose) : 0, focusMargin: inSpec ? Math.max(0, Math.min(focusLimit - Math.abs(focus), lowerFocusSquared > 0 ? Math.abs(focus) - lowerFocusLimit : Infinity)) : 0 };
}
