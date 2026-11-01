/** Educational coefficients, not measured properties of a real material or slurry. */
export const materials = {
  A: { label: "架空の膜 A", coefficient: 1 },
  B: { label: "架空の膜 B", coefficient: 0.6 },
} as const;

export type Conditions = { material: keyof typeof materials; pressure: number; speed: number; time: number };
export const initialConditions: Conditions = { material: "A", pressure: 1, speed: 1, time: 1 };

export function calculateConditions({ material, pressure, speed, time }: Conditions) {
  const mrr = materials[material].coefficient * pressure * speed;
  const removal = mrr * time;
  // Round before classifying so the thresholds agree with the displayed values.
  const displayedRemoval = Math.round((removal + Number.EPSILON) * 100) / 100;
  const progress = Math.min(removal, 1);
  const risk = displayedRemoval < 0.6 ? "研磨不足に注意" : displayedRemoval > 1.4 ? "過剰研磨に注意" : pressure >= 1.5 ? "傷に注意" : "基準に近い";
  return { mrr, removal, progress, risk };
}
