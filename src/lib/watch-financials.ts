import { annualLineSegments, annualDomain, annualUnit, operatingMargin, reportedValue, type AnnualPoint, type AnnualSeries } from "./earnings-history-math";

export const watchMetrics = [
  { id: "revenue", label: "売上高" },
  { id: "operating_income", label: "営業利益" },
  { id: "operating_margin", label: "営業利益率" },
] as const;
export type WatchMetric = typeof watchMetrics[number]["id"];

export function watchFinancials(series: AnnualSeries, metric: WatchMetric) {
  const points: AnnualPoint[] = series.periods.map(period => ({ period, value: metric === "operating_margin"
    ? operatingMargin(period) : reportedValue(metric === "revenue" ? period.revenue : period.operatingIncome) }));
  const latest = points.at(-1);
  const period = latest?.period;
  const field = period && (metric === "revenue" ? period.revenue : period.operatingIncome);
  const missingReason = !period ? "年次履歴未取得" : latest?.value !== null ? null
    : field && field.status !== "reported" ? field.reason
    : metric === "operating_margin" && period.revenue.status !== "reported" ? period.revenue.reason
    : "売上高がゼロ以下、または数値未取得のため算出不可";
  // Display billions of the original currency, without exchange-rate conversion.
  const divisor = period?.unit === "million" ? 1000 : 1;
  return {
    points, segments: annualLineSegments(points), domain: annualDomain(points.map(point => point.value)),
    latest: latest?.value ?? null, missingReason,
    displayValue: latest?.value == null ? (metric === "operating_margin" ? "算出不可" : field?.status === "unpublished" ? "未公表" : "未取得") : new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 }).format(metric === "operating_margin" ? latest.value : latest.value / divisor),
    unit: metric === "operating_margin" ? "%" : period ? annualUnit({ ...period, unit: "billion" }) : "",
    calculated: metric !== "revenue" && field?.status === "reported" && Boolean(field.calculation),
  };
}

export function watchYearMonth(date: string) { return date.slice(0, 7).replace("-", "/"); }
