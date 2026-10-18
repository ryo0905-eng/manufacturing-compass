import { annualLineSegments, annualDomain, annualWindow, comparableAnnualPeriods, operatingMargin, reportedValue, type AnnualPoint, type AnnualSeries, type AnnualYears } from "./earnings-history-math";

export const watchMetrics = [
  { id: "revenue", label: "売上の伸び", chartLabel: "売上前年比" },
  { id: "operating_margin", label: "営業利益率", chartLabel: "営業利益率" },
] as const;
export type WatchMetric = typeof watchMetrics[number]["id"];
export type WatchFinancialPoint = AnnualPoint & {
  previousPeriod?: AnnualPoint["period"];
  missingReason: string | null;
};
export type WatchFinancialDomain = ReturnType<typeof annualDomain>;

export function watchFinancials(series: AnnualSeries, metric: WatchMetric, years: AnnualYears = 10) {
  const window = new Set(annualWindow(series, years).periods);
  // Calculate before slicing: the first displayed year may use a preceding year outside the window.
  const points: WatchFinancialPoint[] = series.periods.map((period, index) => {
    const previousPeriod = series.periods[index - 1];
    const revenue = reportedValue(period.revenue);
    let value: number | null = null;
    let missingReason: string | null = null;
    if (revenue === null) {
      missingReason = period.revenue.status !== "reported" ? `本期の売上高：${period.revenue.reason}` : "本期の売上高が未取得";
    } else if (metric === "operating_margin") {
      value = operatingMargin(period);
      if (value === null) missingReason = period.operatingIncome.status !== "reported"
        ? `営業利益：${period.operatingIncome.reason}` : "売上高がゼロ以下のため算出不可";
    } else if (!previousPeriod) {
      missingReason = "前年の通期実績が未取得のため算出不可";
    } else if (!comparableAnnualPeriods(previousPeriod, period)) {
      missingReason = period.breakBefore ?? "前年と期間・会計基準・対象範囲・通貨・単位が比較できないため算出不可";
    } else {
      const previousRevenue = reportedValue(previousPeriod.revenue);
      if (previousRevenue === null) missingReason = previousPeriod.revenue.status !== "reported"
        ? `前年の売上高：${previousPeriod.revenue.reason}` : "前年の売上高が未取得";
      else if (previousRevenue <= 0) missingReason = "前年の売上高がゼロ以下のため算出不可";
      else value = (revenue / previousRevenue - 1) * 100;
    }
    if (value !== null && !Number.isFinite(value)) {
      value = null;
      missingReason = "計算結果が有限値にならないため算出不可";
    }
    return { period, previousPeriod, value, missingReason };
  }).filter(point => window.has(point.period));
  const latest = points.at(-1);
  const income = latest?.period.operatingIncome;
  return {
    points, segments: annualLineSegments(points),
    latest: latest?.value ?? null, missingReason: latest?.missingReason ?? (latest ? null : "年次履歴未取得"),
    displayValue: latest?.value == null ? "算出不可" : new Intl.NumberFormat("ja-JP", {
      maximumFractionDigits: 1, signDisplay: metric === "revenue" ? "exceptZero" : "auto",
    }).format(latest.value),
    calculated: metric === "operating_margin" && income?.status === "reported" && Boolean(income.calculation),
  };
}

/** Always pass the complete company cohort so filtering cannot change the vertical scale. */
export function watchFinancialDomain(histories: AnnualSeries[], metric: WatchMetric, years: AnnualYears = 10): WatchFinancialDomain {
  return annualDomain(histories.flatMap(series => watchFinancials(series, metric, years).points.map(point => point.value)));
}

export function watchYearMonth(date: string) { return date.slice(0, 7).replace("-", "/"); }
