import { measurementNotes, measurementPlanner } from "@/data/measurement-planner";
export type MeasurementInput = { sigma: string; precision: string; unit: string; seconds: string };
export type MeasurementPlan = { count: number; halfWidth: number; target: number; totalSeconds?: number };
export type MeasurementResult = {
  sigma: number; unit: string; seconds?: number; plan: MeasurementPlan;
  alternatives: { label: string; plan?: MeasurementPlan; error?: string }[];
};
const limit = 1_000_000;
const decimal = /^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
function positive(text: string, label: string): number {
  const value = Number(text);
  if (!decimal.test(text.trim()) || !Number.isFinite(value) || value <= 0) throw new Error(`${label}は0より大きい有限の数値を入力してください。`);
  return value;
}
export function planMean(sigma: number, target: number, seconds?: number): MeasurementPlan {
  if (![sigma, target].every(value => Number.isFinite(value) && value > 0) || (seconds !== undefined && (!Number.isFinite(seconds) || seconds <= 0))) throw new Error("計算条件は0より大きい有限の数値にしてください。");
  const ratio = 1.96 * (sigma / target);
  const squared = ratio * ratio;
  if (!Number.isFinite(squared)) throw new Error("数値が計算可能な範囲を超えています。条件を見直してください。");
  const count = Math.max(1, Math.ceil(squared));
  if (count > limit) throw new Error("測定数が対応範囲の100万件を超えます。上限への丸めは行っていません。");
  const halfWidth = sigma * (1.96 / Math.sqrt(count));
  const totalSeconds = seconds === undefined ? undefined : count * seconds;
  if (!Number.isFinite(halfWidth) || halfWidth <= 0 || (totalSeconds !== undefined && !Number.isFinite(totalSeconds))) throw new Error("推定幅または時間が計算可能な範囲を超えています。");
  return { count, halfWidth, target, totalSeconds };
}
export function calculateMeasurementPlan(input: MeasurementInput): MeasurementResult {
  const sigma = positive(input.sigma, "想定標準偏差");
  const target = positive(input.precision, "平均の推定幅");
  const seconds = input.seconds.trim() ? positive(input.seconds, "1測定の所要時間") : undefined;
  const plan = planMean(sigma, target, seconds);
  const alternatives = [
    { label: "幅を半分にする", target: target / 2 },
    { label: "入力した幅", target },
    { label: "幅を2倍にする", target: target * 2 },
  ].map(item => {
    try { return { label: item.label, plan: planMean(sigma, item.target, seconds) }; }
    catch (error) { return { label: item.label, error: error instanceof Error ? error.message : "計算できません。" }; }
  });
  return { sigma, unit: input.unit.trim(), seconds, plan, alternatives };
}
export function measurementNumber(value: number): string { return Number(value.toPrecision(6)).toString(); }
export function measurementTime(seconds?: number): string { return seconds === undefined ? "未指定" : `${measurementNumber(seconds / 60)}分（${measurementNumber(seconds)}秒）`; }
export function measurementCopy(result: MeasurementResult): string {
  const unit = result.unit ? ` ${result.unit}` : "（単位未指定）";
  return [
    "平均の測定計画（95%・正規近似）", `想定標準偏差：${measurementNumber(result.sigma)}${unit}`,
    `目標の平均推定幅：±${measurementNumber(result.plan.target)}${unit}`,
    `1測定の所要時間：${result.seconds === undefined ? "未指定" : `${measurementNumber(result.seconds)}秒`}`,
    "計算式：n = max(1, ceil((1.96 × σ / E)²))、推定幅 = 1.96 × σ / √n",
    ...result.alternatives.map(item => item.plan ? `${item.label}：目標±${measurementNumber(item.plan.target)}${unit}、${item.plan.count}件、推定幅±${measurementNumber(item.plan.halfWidth)}${unit}、${measurementTime(item.plan.totalSeconds)}` : `${item.label}：${item.error}`),
    ...measurementNotes, `出典：${measurementPlanner.source}`, `計算仕様更新日：${measurementPlanner.updatedAt}`,
  ].join("\n");
}
