export const yieldCsvColumns = ["date", "product", "equipment", "inspected_count", "defective_count"] as const;

export type YieldRow = {
  date: string;
  product: string;
  equipment: string;
  inspectedCount: number;
  defectiveCount: number;
};

export type DateRange = { start: string; end: string };
export type YieldSummary = {
  inspectedCount: number;
  defectiveCount: number;
  yieldRate: number | null;
  defectRate: number | null;
};

export type CsvParseResult = {
  rows: YieldRow[];
  errors: string[];
  warnings: string[];
  duplicateCount: number;
};

export type DailyYieldPoint = YieldSummary & {
  date: string;
  period: "baseline" | "comparison";
  uclDefectRate: number | null;
  lclDefectRate: number | null;
  lowerYieldLimit: number | null;
  upperYieldLimit: number | null;
  signal: boolean;
};

export type PChartResult = {
  available: boolean;
  reason?: string;
  warning?: string;
  pBar: number | null;
  centerYield: number | null;
  points: DailyYieldPoint[];
  signalDates: string[];
};

export type ComparisonRow = {
  key: string;
  baseline: YieldSummary;
  comparison: YieldSummary;
  baselineShare: number | null;
  comparisonShare: number | null;
  yieldChangePoints: number | null;
  comparable: boolean;
  smallSample: boolean;
};

export type MixComparison = {
  available: boolean;
  reason?: string;
  baselineYield: number | null;
  mixAdjustedYield: number | null;
  comparisonYield: number | null;
  products: Array<{ product: string; baselineYield: number | null; comparisonShare: number | null }>;
};

function isStrictDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parseCsvRecords(text: string): string[][] {
  const records: string[][] = [];
  let record: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") { record.push(field); field = ""; }
    else if (character === "\n") { record.push(field); records.push(record); record = []; field = ""; }
    else if (character !== "\r") field += character;
  }
  if (quoted) throw new Error("引用符が閉じられていません。");
  if (field.length > 0 || record.length > 0) { record.push(field); records.push(record); }
  return records.filter((row) => row.some((value) => value.trim() !== ""));
}

export function parseYieldCsv(text: string): CsvParseResult {
  let records: string[][];
  try { records = parseCsvRecords(text.replace(/^\uFEFF/, "")); }
  catch (error) { return { rows: [], errors: [error instanceof Error ? error.message : "CSVを読み取れませんでした。"], warnings: [], duplicateCount: 0 }; }
  if (records.length === 0) return { rows: [], errors: ["CSVが空です。"], warnings: [], duplicateCount: 0 };

  const headers = records[0].map((value) => value.trim());
  const missing = yieldCsvColumns.filter((column) => !headers.includes(column));
  if (missing.length) return { rows: [], errors: [`必須列がありません: ${missing.join(", ")}`], warnings: [], duplicateCount: 0 };
  const indexes = Object.fromEntries(yieldCsvColumns.map((column) => [column, headers.indexOf(column)])) as Record<(typeof yieldCsvColumns)[number], number>;
  const errors: string[] = [];
  const warnings: string[] = [];
  const valid: YieldRow[] = [];

  records.slice(1).forEach((record, recordIndex) => {
    const line = recordIndex + 2;
    const date = (record[indexes.date] ?? "").trim();
    const product = (record[indexes.product] ?? "").trim();
    const equipment = (record[indexes.equipment] ?? "").trim();
    const inspectedRaw = (record[indexes.inspected_count] ?? "").trim();
    const defectiveRaw = (record[indexes.defective_count] ?? "").trim();
    const inspectedCount = Number(inspectedRaw);
    const defectiveCount = Number(defectiveRaw);
    const lineErrors: string[] = [];
    if (!isStrictDate(date)) lineErrors.push("dateはYYYY-MM-DDの実在日");
    if (!product) lineErrors.push("productは必須");
    if (!equipment) lineErrors.push("equipmentは必須");
    if (inspectedRaw === "" || !Number.isInteger(inspectedCount) || inspectedCount < 0) lineErrors.push("inspected_countは0以上の整数");
    if (defectiveRaw === "" || !Number.isInteger(defectiveCount) || defectiveCount < 0) lineErrors.push("defective_countは0以上の整数");
    if (Number.isInteger(inspectedCount) && Number.isInteger(defectiveCount) && defectiveCount > inspectedCount) lineErrors.push("defective_countはinspected_count以下");
    if (lineErrors.length) errors.push(`${line}行目: ${lineErrors.join("、")}`);
    else valid.push({ date, product, equipment, inspectedCount, defectiveCount });
  });
  if (errors.length) return { rows: [], errors, warnings, duplicateCount: 0 };
  if (!valid.length) return { rows: [], errors: ["データ行がありません。"], warnings, duplicateCount: 0 };

  const merged = new Map<string, YieldRow>();
  let duplicateCount = 0;
  for (const row of valid) {
    const key = `${row.date}\u0000${row.product}\u0000${row.equipment}`;
    const current = merged.get(key);
    if (current) {
      duplicateCount += 1;
      current.inspectedCount += row.inspectedCount;
      current.defectiveCount += row.defectiveCount;
    } else merged.set(key, { ...row });
  }
  if (duplicateCount) warnings.push(`重複した集計キー${duplicateCount}行を、検査数と不良品数の合算として読み込みました。`);
  const zeroRows = [...merged.values()].filter((row) => row.inspectedCount === 0).length;
  if (zeroRows) warnings.push(`検査数0の行が${zeroRows}行あります。行は保持し、率と管理限界の計算対象には含めません。`);
  return { rows: [...merged.values()].sort((left, right) => left.date.localeCompare(right.date)), errors, warnings, duplicateCount };
}

export function summarizeYield(rows: YieldRow[]): YieldSummary {
  const inspectedCount = rows.reduce((sum, row) => sum + row.inspectedCount, 0);
  const defectiveCount = rows.reduce((sum, row) => sum + row.defectiveCount, 0);
  const defectRate = inspectedCount > 0 ? defectiveCount / inspectedCount : null;
  return { inspectedCount, defectiveCount, defectRate, yieldRate: defectRate === null ? null : 1 - defectRate };
}

export function inRange(date: string, range: DateRange) { return date >= range.start && date <= range.end; }

export function filterYieldRows(rows: YieldRow[], range: DateRange, product?: string, equipment?: string) {
  return rows.filter((row) => inRange(row.date, range) && (!product || row.product === product) && (!equipment || row.equipment === equipment));
}

export function analyzePChart(rows: YieldRow[], baseline: DateRange, comparison: DateRange, product?: string, equipment?: string): PChartResult {
  const selected = rows.filter((row) => (!product || row.product === product) && (!equipment || row.equipment === equipment));
  const baselineRows = selected.filter((row) => inRange(row.date, baseline));
  const baselineSummary = summarizeYield(baselineRows);
  const baselineDates = new Set(baselineRows.filter((row) => row.inspectedCount > 0).map((row) => row.date));
  let reason: string | undefined;
  if (baseline.start > baseline.end || comparison.start > comparison.end || baseline.end >= comparison.start) reason = "基準期間と比較期間が不正または重複しているため判定できません。";
  else if (!product) reason = "複数製品を含む全体推移は参考表示です。製品を選ぶと正式なシグナル判定を行います。";
  else if (baselineDates.size < 10) reason = `基準期間の有効日数が${baselineDates.size}日です。初版では10日以上を判定条件とします。`;
  else if (baselineSummary.inspectedCount === 0) reason = "基準期間の検査数が0のため判定できません。";
  else if (baselineSummary.defectRate === 0 || baselineSummary.defectRate === 1) reason = "基準不良率が0または100%のため、正規近似によるp管理図を判定に使えません。";
  const pBar = baselineSummary.defectRate;
  const warning = pBar !== null && baselineRows.some((row) => row.inspectedCount > 0 && (row.inspectedCount * pBar < 5 || row.inspectedCount * (1 - pBar) < 5))
    ? "期待不良数または期待良品数が5未満の点があります。正規近似が適切でない場合があります。"
    : undefined;

  const daily = new Map<string, YieldRow[]>();
  for (const row of selected) {
    const period = inRange(row.date, baseline) ? "baseline" : inRange(row.date, comparison) ? "comparison" : null;
    if (!period) continue;
    daily.set(row.date, [...(daily.get(row.date) ?? []), row]);
  }
  const points: DailyYieldPoint[] = [...daily.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([date, dateRows]) => {
    const summary = summarizeYield(dateRows);
    const canCalculate = !reason && pBar !== null && summary.inspectedCount > 0;
    const sigma = canCalculate ? Math.sqrt(pBar * (1 - pBar) / summary.inspectedCount) : null;
    const uclDefectRate = sigma === null || pBar === null ? null : Math.min(1, pBar + 3 * sigma);
    const lclDefectRate = sigma === null || pBar === null ? null : Math.max(0, pBar - 3 * sigma);
    const period = inRange(date, baseline) ? "baseline" as const : "comparison" as const;
    return { ...summary, date, period, uclDefectRate, lclDefectRate, lowerYieldLimit: uclDefectRate === null ? null : 1 - uclDefectRate, upperYieldLimit: lclDefectRate === null ? null : 1 - lclDefectRate, signal: period === "comparison" && summary.defectRate !== null && uclDefectRate !== null && summary.defectRate > uclDefectRate };
  });
  return { available: !reason, reason, warning, pBar, centerYield: pBar === null ? null : 1 - pBar, points, signalDates: points.filter((point) => point.signal).map((point) => point.date) };
}

export function compareByDimension(rows: YieldRow[], baseline: DateRange, comparison: DateRange, dimension: "product" | "equipment", product?: string): ComparisonRow[] {
  const scoped = product ? rows.filter((row) => row.product === product) : rows;
  const baselineRows = scoped.filter((row) => inRange(row.date, baseline));
  const comparisonRows = scoped.filter((row) => inRange(row.date, comparison));
  const baselineTotal = summarizeYield(baselineRows).inspectedCount;
  const comparisonTotal = summarizeYield(comparisonRows).inspectedCount;
  const keys = [...new Set(scoped.map((row) => row[dimension]))].sort((left, right) => left.localeCompare(right, "ja"));
  return keys.map((key) => {
    const baselineSummary = summarizeYield(baselineRows.filter((row) => row[dimension] === key));
    const comparisonSummary = summarizeYield(comparisonRows.filter((row) => row[dimension] === key));
    const comparable = baselineSummary.yieldRate !== null && comparisonSummary.yieldRate !== null;
    return { key, baseline: baselineSummary, comparison: comparisonSummary, baselineShare: baselineTotal ? baselineSummary.inspectedCount / baselineTotal : null, comparisonShare: comparisonTotal ? comparisonSummary.inspectedCount / comparisonTotal : null, yieldChangePoints: comparable ? (comparisonSummary.yieldRate! - baselineSummary.yieldRate!) * 100 : null, comparable, smallSample: Math.min(baselineSummary.inspectedCount, comparisonSummary.inspectedCount) < 100 };
  }).sort((left, right) => right.comparison.inspectedCount - left.comparison.inspectedCount);
}

export function calculateMixComparison(rows: YieldRow[], baseline: DateRange, comparison: DateRange): MixComparison {
  const baselineRows = rows.filter((row) => inRange(row.date, baseline));
  const comparisonRows = rows.filter((row) => inRange(row.date, comparison));
  const baselineSummary = summarizeYield(baselineRows);
  const comparisonSummary = summarizeYield(comparisonRows);
  const comparisonProducts = [...new Set(comparisonRows.filter((row) => row.inspectedCount > 0).map((row) => row.product))].sort((left, right) => left.localeCompare(right, "ja"));
  if (!comparisonSummary.inspectedCount) return { available: false, reason: "比較期間の検査数が0のため算出できません。", baselineYield: baselineSummary.yieldRate, mixAdjustedYield: null, comparisonYield: comparisonSummary.yieldRate, products: [] };
  const products = comparisonProducts.map((product) => {
    const productBaseline = summarizeYield(baselineRows.filter((row) => row.product === product));
    const productComparison = summarizeYield(comparisonRows.filter((row) => row.product === product));
    return { product, baselineYield: productBaseline.yieldRate, comparisonShare: productComparison.inspectedCount / comparisonSummary.inspectedCount };
  });
  const missing = products.filter((item) => item.baselineYield === null).map((item) => item.product);
  if (missing.length) return { available: false, reason: `比較期間の「${missing.join("、")}」に基準データがないため、黙って除外せず算出不可としました。`, baselineYield: baselineSummary.yieldRate, mixAdjustedYield: null, comparisonYield: comparisonSummary.yieldRate, products };
  const mixAdjustedYield = products.reduce((sum, item) => sum + item.baselineYield! * item.comparisonShare!, 0);
  return { available: baselineSummary.yieldRate !== null, reason: baselineSummary.yieldRate === null ? "基準期間の検査数が0のため算出できません。" : undefined, baselineYield: baselineSummary.yieldRate, mixAdjustedYield, comparisonYield: comparisonSummary.yieldRate, products };
}

export function yieldRowsToCsv(rows: YieldRow[]) {
  const escape = (value: string) => /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
  return [yieldCsvColumns.join(","), ...rows.map((row) => [row.date, escape(row.product), escape(row.equipment), row.inspectedCount, row.defectiveCount].join(","))].join("\n");
}
