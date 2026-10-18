import exchange from "@/data/watch-exchange-rates.json";
import { annualLineSegments, annualDomain, annualWindow, comparableAnnualPeriods, operatingMargin, reportedValue, type AnnualPoint, type AnnualPeriod, type AnnualSeries, type AnnualYears } from "./earnings-history-math";

export const watchMetrics = [
  { id: "revenue", label: "売上高", chartLabel: "売上高" },
  { id: "operating_margin", label: "営業利益率", chartLabel: "営業利益率" },
] as const;
export type WatchMetric = typeof watchMetrics[number]["id"];
export type WatchSort = "revenue" | "growth";
export type WatchFinancialPoint = AnnualPoint & {
  previousPeriod?: AnnualPeriod;
  revenueYen: number | null;
  revenueYoY: number | null;
  growthMissingReason: string | null;
  missingReason: string | null;
};
export type WatchFinancialDomain = ReturnType<typeof annualDomain>;
export const watchExchange = exchange;
const quotes = exchange.quotes;
export const watchYenRates: Record<AnnualPeriod["currency"], number> = {
  JPY: 1, USD: quotes.jpyPerUsd, EUR: quotes.usdPerEur * quotes.jpyPerUsd,
  KRW: quotes.jpyPerUsd / quotes.krwPerUsd, TWD: quotes.jpyPerUsd / quotes.twdPerUsd,
};

export function watchYenValue(value: number | null, period: Pick<AnnualPeriod, "currency" | "unit">): number | null {
  if (value === null) return null;
  const converted = value * (period.unit === "million" ? 1e6 : 1e9) * watchYenRates[period.currency];
  return Number.isFinite(converted) ? converted : null;
}

export function watchYenAmount(value: number | null) {
  if (value === null) return "未取得";
  const trillion = Math.abs(value) >= 1e12;
  return `約${new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 }).format(value / (trillion ? 1e12 : 1e8))}${trillion ? "兆円" : "億円"}`;
}

export function watchPercent(value: number | null, signed = false) {
  return value === null ? "算出不可" : `${new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 1, signDisplay: signed ? "exceptZero" : "auto",
  }).format(value)}%`;
}

function revenueGrowth(period: AnnualPeriod, previous?: AnnualPeriod) {
  const revenue = reportedValue(period.revenue);
  if (revenue === null) return { value: null, reason: period.revenue.status !== "reported" ? `本期の売上高：${period.revenue.reason}` : "本期の売上高が未取得" };
  if (!previous) return { value: null, reason: "前年の通期実績が未取得のため算出不可" };
  if (!comparableAnnualPeriods(previous, period)) return { value: null, reason: period.breakBefore ?? "前年と期間・会計基準・対象範囲・通貨・単位が比較できないため算出不可" };
  const previousRevenue = reportedValue(previous.revenue);
  if (previousRevenue === null) return { value: null, reason: previous.revenue.status !== "reported" ? `前年の売上高：${previous.revenue.reason}` : "前年の売上高が未取得" };
  if (previousRevenue <= 0) return { value: null, reason: "前年の売上高がゼロ以下のため算出不可" };
  const value = (revenue / previousRevenue - 1) * 100;
  return Number.isFinite(value) ? { value, reason: null } : { value: null, reason: "計算結果が有限値にならないため算出不可" };
}

export function watchFinancials(series: AnnualSeries, metric: WatchMetric, years: AnnualYears = 10) {
  const included = new Set(annualWindow(series, years).periods);
  // Calculate before slicing: the first displayed year may use a preceding year outside the window.
  const points: WatchFinancialPoint[] = series.periods.map((period, index) => {
    const previousPeriod = series.periods[index - 1];
    const revenue = reportedValue(period.revenue);
    const growth = revenueGrowth(period, previousPeriod);
    const revenueYen = revenue !== null && revenue >= 0 ? watchYenValue(revenue, period) : null;
    let value = metric === "revenue" ? revenueYen : operatingMargin(period);
    let missingReason: string | null = null;
    if (value !== null && !Number.isFinite(value)) value = null;
    if (value === null) {
      if (period.revenue.status !== "reported") missingReason = `売上高：${period.revenue.reason}`;
      else if (revenue === null) missingReason = "売上高が未取得";
      else if (metric === "revenue") missingReason = "売上高が負、または円換算できないため表示不可";
      else if (period.operatingIncome.status !== "reported") missingReason = `営業利益：${period.operatingIncome.reason}`;
      else missingReason = "売上高がゼロ以下、または営業利益が未取得のため算出不可";
    }
    return { period, previousPeriod, value, revenueYen, revenueYoY: growth.value, growthMissingReason: growth.reason, missingReason };
  }).filter(point => included.has(point.period));
  const latest = points.at(-1);
  const income = latest?.period.operatingIncome;
  return {
    points, segments: annualLineSegments(points), latest: latest?.value ?? null,
    revenueYoY: latest?.revenueYoY ?? null, growthMissingReason: latest?.growthMissingReason ?? (latest ? null : "前年の通期実績が未取得"),
    missingReason: latest?.missingReason ?? (latest ? null : "年次履歴未取得"),
    displayValue: metric === "revenue" ? watchYenAmount(latest?.value ?? null) : watchPercent(latest?.value ?? null),
    calculated: metric === "operating_margin" && income?.status === "reported" && Boolean(income.calculation),
  };
}

/** Always pass the complete cohort so filtering cannot change the vertical scale. */
export function watchFinancialDomain(histories: AnnualSeries[], metric: WatchMetric, years: AnnualYears = 10): WatchFinancialDomain {
  const domain = annualDomain(histories.flatMap(series => watchFinancials(series, metric, years).points.map(point => point.value)));
  if (metric !== "revenue") return domain;
  const step = 10 ** Math.floor(Math.log10(domain.max));
  return { min: 0, max: Math.ceil(domain.max / step) * step };
}

export function watchYearMonth(date: string) { return date.slice(0, 7).replace("-", "/"); }
