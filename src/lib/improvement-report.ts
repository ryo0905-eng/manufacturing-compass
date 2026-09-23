import { calculateCapability } from "@/lib/process-capability";
import { formatComparisonNumber as f, type Comparison, type Summary } from "@/lib/process-comparison";
export function capabilityRows(result: Comparison): string[][] {
  if (result.lower === undefined && result.upper === undefined) return [];
  const keys = result.lower === undefined ? [{ label: "Ppu", key: "upper" }] : result.upper === undefined ? [{ label: "Ppl", key: "lower" }] : [{ label: "Pp", key: "potential" }, { label: "Ppk", key: "performance" }];
  function values(summary: Summary) {
    if (summary.sd === 0) return keys.map(() => "算出不可（標準偏差ゼロ）");
    try {
      // Dimensionless scaling avoids overflow in differences and 3s/6s.
      const scale = Math.max(Math.abs(summary.mean), summary.sd, Math.abs(result.lower ?? 0), Math.abs(result.upper ?? 0));
      const capability = calculateCapability({ mean: summary.mean / scale, standardDeviation: summary.sd / scale, lowerSpecificationLimit: result.lower === undefined ? undefined : result.lower / scale, upperSpecificationLimit: result.upper === undefined ? undefined : result.upper / scale, method: "overall" });
      return keys.map(({ key }) => {
        const value = capability[key as "potential" | "performance" | "upper" | "lower"];
        return value !== undefined && Number.isFinite(value) ? f(value) : "算出不可（数値範囲外）";
      });
    } catch { return keys.map(() => "算出不可（計算条件を確認）"); }
  }
  const a = values(result.a), b = values(result.b);
  return keys.map((item, index) => [item.label, a[index], b[index]]);
}
export function reportObservations(result: Comparison): string[] {
  const output = [
    `平均はAの${f(result.a.mean)}からBの${f(result.b.mean)}へ変化した（B−A：${f(result.difference)}）。`,
    `標本標準偏差はAの${f(result.a.sd)}からBの${f(result.b.sd)}へ変化した。`,
  ];
  if (result.a.rate !== undefined && result.b.rate !== undefined) output.push(`観測データの規格内率はAの${f(result.a.rate)}%からBの${f(result.b.rate)}%へ変化した。`);
  return output;
}
