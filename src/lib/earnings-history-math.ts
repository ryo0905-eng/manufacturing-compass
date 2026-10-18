export type AnnualSource = { url: string; locator: string };
export type AnnualMetric =
  | { status: "reported"; value: number; source: AnnualSource; calculation?: string; calculationInputs?: number[] }
  | { status: "unretrieved" | "unpublished"; reason: string; source?: AnnualSource };
export type AnnualPeriod = {
  label: string;
  start: string;
  end: string;
  currency: "EUR" | "USD" | "JPY" | "KRW" | "TWD";
  unit: "million" | "billion";
  accountingStandard: string;
  financialScope: string;
  source: AnnualSource;
  breakBefore?: string;
  revenue: AnnualMetric;
  operatingIncome: AnnualMetric;
};
export type AnnualSeries = {
  companyId: string;
  name: string;
  segment: "equipment" | "memory" | "fabless" | "foundry" | "idm";
  checkedAt: string;
  coverageNote: string;
  periods: AnnualPeriod[];
};
export type AnnualChartMetric = "margin" | "revenueIndex";
export type AnnualPoint = { period: AnnualPeriod; value: number | null };

export function reportedValue(metric: AnnualMetric): number | null {
  return metric.status === "reported" && Number.isFinite(metric.value) ? metric.value : null;
}

export function operatingMargin(period: AnnualPeriod): number | null {
  const revenue = reportedValue(period.revenue);
  const income = reportedValue(period.operatingIncome);
  return revenue !== null && revenue > 0 && income !== null ? income / revenue * 100 : null;
}

export function comparableAnnualPeriods(previous: AnnualPeriod, next: AnnualPeriod) {
  const gap = (Date.parse(next.end) - Date.parse(previous.end)) / 86400000;
  return !next.breakBefore && gap >= 330 && gap <= 400
    && previous.currency === next.currency && previous.unit === next.unit
    && previous.accountingStandard === next.accountingStandard
    && previous.financialScope === next.financialScope;
}

export function annualPoints(series: AnnualSeries, metric: AnnualChartMetric): AnnualPoint[] {
  const base = series.periods[0];
  const baseRevenue = base ? reportedValue(base.revenue) : null;
  let sharesBase = true;
  return series.periods.map((period, index) => {
    if (index > 0 && !comparableAnnualPeriods(series.periods[index - 1], period)) sharesBase = false;
    const revenue = reportedValue(period.revenue);
    return { period, value: metric === "margin" ? operatingMargin(period)
      : sharesBase && baseRevenue !== null && baseRevenue > 0 && revenue !== null && revenue > 0
        ? revenue / baseRevenue * 100 : null };
  });
}

/** Missing observations and changes in reporting basis must break the line. */
export function annualLineSegments(points: AnnualPoint[]): AnnualPoint[][] {
  const segments: AnnualPoint[][] = [];
  let current: AnnualPoint[] = [];
  for (let index = 0; index < points.length; index++) {
    const point = points[index];
    if (point.value === null) { current = []; continue; }
    if (!current.length || (index > 0 && !comparableAnnualPeriods(points[index - 1].period, point.period))) {
      current = [];
      segments.push(current);
    }
    current.push(point);
  }
  return segments;
}

export function annualDomain(values: Array<number | null>) {
  const finite = values.filter((value): value is number => value !== null && Number.isFinite(value));
  const min = Math.min(0, ...finite);
  const max = Math.max(0, ...finite);
  const padding = (max - min || 1) * 0.12;
  return { min: min < 0 ? min - padding : 0, max: max > 0 ? max + padding : 1 };
}

export function annualUnit(period: AnnualPeriod) {
  return `${period.unit === "million" ? "百万" : "十億"}${{ EUR: "ユーロ", USD: "米ドル", JPY: "円", KRW: "ウォン", TWD: "台湾ドル" }[period.currency]}`;
}

export function annualNumber(value: number | null, suffix = "") {
  return value === null ? "算出不可" : `${new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 }).format(value)}${suffix}`;
}
