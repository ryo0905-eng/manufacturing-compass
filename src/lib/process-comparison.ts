export type ComparisonInput = {
  nameA: string; nameB: string; measurement: string; unit: string;
  dataA: string; dataB: string; lower: string; upper: string;
};
export type Summary = { count: number; mean: number; median: number; sd: number; min: number; max: number; inside?: number; rate?: number };
export type Comparison = {
  nameA: string; nameB: string; measurement: string; unit: string;
  lower?: number; upper?: number; a: Summary; b: Summary; difference: number;
  histogram: { min: number; max: number; a: number[]; b: number[] };
};
const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
function numberValue(text: string): number {
  const value = Number(text);
  if (!decimal.test(text) || !Number.isFinite(value)) throw new Error("有限の数値を入力してください（桁区切り・単位・複数列は使えません）。");
  return value;
}
export function parseMeasurements(text: string, name: string): number[] {
  const values: number[] = [];
  for (const [index, line] of text.split(/\r\n|\n|\r/).entries()) {
    if (!line.trim()) continue;
    try { values.push(numberValue(line.trim())); }
    catch { throw new Error(`${name}の${index + 1}行目：有限の数値を1行に1つ入力してください（桁区切り・単位・複数列は使えません）。`); }
    if (values.length > 10000) throw new Error(`${name}は10,000件以内にしてください。`);
  }
  if (values.length < 2) throw new Error(`${name}は2件以上入力してください。`);
  return values;
}
function summarize(values: number[], lower?: number, upper?: number): Summary {
  const sorted = [...values].sort((a, b) => a - b);
  const count = values.length;
  // Scale first so squaring large finite measurements does not overflow.
  const scale = Math.max(...values.map(Math.abs)) || 1;
  const normalized = values.map(value => value / scale);
  const center = normalized.reduce((sum, value) => sum + value / count, 0);
  const mean = sorted[0] === sorted[count - 1] ? sorted[0] : center * scale;
  const sd = sorted[0] === sorted[count - 1] ? 0 : Math.sqrt(normalized.reduce((sum, value) => sum + (value - center) ** 2 / (count - 1), 0)) * scale;
  const middle = Math.floor(count / 2);
  const median = count % 2 ? sorted[middle] : sorted[middle - 1] / 2 + sorted[middle] / 2;
  const inside = lower === undefined && upper === undefined ? undefined : values.filter(value => (lower === undefined || value >= lower) && (upper === undefined || value <= upper)).length;
  return { count, mean, median, sd, min: sorted[0], max: sorted[count - 1], inside, rate: inside === undefined ? undefined : inside / count * 100 };
}
export function compareProcesses(input: ComparisonInput): Comparison {
  const aValues = parseMeasurements(input.dataA, "条件A");
  const bValues = parseMeasurements(input.dataB, "条件B");
  const spec = (text: string, name: string) => {
    if (!text.trim()) return undefined;
    try { return numberValue(text.trim()); } catch { throw new Error(`${name}は有限の数値で入力してください。`); }
  };
  const lower = spec(input.lower, "下限規格");
  const upper = spec(input.upper, "上限規格");
  if (lower !== undefined && upper !== undefined && lower >= upper) throw new Error("下限規格は上限規格より小さくしてください。");
  const a = summarize(aValues, lower, upper), b = summarize(bValues, lower, upper);
  let min = Math.min(a.min, b.min, lower ?? Infinity, upper ?? Infinity);
  let max = Math.max(a.max, b.max, lower ?? -Infinity, upper ?? -Infinity);
  if (min === max) {
    const padding = Math.abs(min) * 0.05 || 1;
    min -= padding; max += padding;
  }
  const width = max - min;
  const difference = b.mean - a.mean;
  if (![min, max, width, difference, a.mean, b.mean, a.sd, b.sd].every(Number.isFinite) || width <= 0) throw new Error("数値の範囲が計算可能な幅を超えています。単位を換算して再入力してください。");
  const bins = Math.min(20, Math.max(5, Math.ceil(Math.sqrt(a.count + b.count))));
  const histogram = (values: number[]) => {
    const counts = Array<number>(bins).fill(0);
    for (const value of values) counts[Math.min(bins - 1, Math.max(0, Math.floor((value - min) / width * bins)))]++;
    return counts.map(count => count / values.length * 100);
  };
  const label = (value: string, fallback: string) => value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, 40) || fallback;
  return { nameA: label(input.nameA, "条件A"), nameB: label(input.nameB, "条件B"), measurement: label(input.measurement, "測定値"), unit: label(input.unit, ""), lower, upper, a, b, difference, histogram: { min, max, a: histogram(aValues), b: histogram(bValues) } };
}
export function formatComparisonNumber(value: number): string {
  return Object.is(value, -0) || value === 0 ? "0" : Number(value.toPrecision(8)).toString();
}
export function comparisonRows(result: Comparison): string[][] {
  const f = formatComparisonNumber;
  const rows = [["指標", `A：${result.nameA}`, `B：${result.nameB}`]];
  for (const [label, key] of [["件数", "count"], ["平均", "mean"], ["中央値", "median"], ["標本標準偏差", "sd"], ["最小", "min"], ["最大", "max"]] as const) rows.push([label, f(result.a[key]), f(result.b[key])]);
  if (result.a.inside !== undefined) {
    rows.push(["規格内件数", String(result.a.inside), String(result.b.inside)]);
    rows.push(["規格内率 (%)", f(result.a.rate!), f(result.b.rate!)]);
  }
  rows.push(["平均差 (B−A)", f(result.difference), ""]);
  return rows;
}
export function comparisonTsv(result: Comparison): string {
  // Prefix metadata so spreadsheet software never treats a user label as a formula.
  return [[`測定項目：${result.measurement}`, `単位：${result.unit || "指定なし"}`], ["下限規格", result.lower === undefined ? "指定なし" : formatComparisonNumber(result.lower)], ["上限規格", result.upper === undefined ? "指定なし" : formatComparisonNumber(result.upper)], ...comparisonRows(result), ["注記：記述統計のみ。差の有意性・同等性・因果関係は判定しません。"]].map(row => row.join("\t")).join("\n");
}
const xml = (text: string) => text.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!);
export function comparisonSvg(result: Comparison): string {
  const { histogram: h } = result;
  const f = formatComparisonNumber;
  const x = (value: number) => 90 + (value - h.min) / (h.max - h.min) * 820;
  const yMax = Math.max(...h.a, ...h.b, 1);
  const text = (x: number, y: number, value: string, extra = "") => `<text x="${x}" y="${y}" ${extra}>${xml(value)}</text>`;
  let body = text(30, 34, "工程条件の比較", 'font-size="22" font-weight="600"') + text(30, 60, `測定項目：${result.measurement}`) + text(30, 82, `単位：${result.unit || "指定なし"}`);
  for (const [index, values] of [h.a, h.b].entries()) {
    const top = 115 + index * 225, base = top + 135;
    body += text(30, top - 20, `${index === 0 ? "A" : "B"}：${index === 0 ? result.nameA : result.nameB}（n=${index === 0 ? result.a.count : result.b.count}）`);
    for (const fraction of [0, 0.5, 1]) {
      const y = base - fraction * 135;
      body += `<path d="M90 ${y}H910" stroke="#e5e7eb"/>` + text(80, y + 5, `${Number((yMax * fraction).toPrecision(3))}%`, 'text-anchor="end"');
    }
    values.forEach((value, bin) => { const height = value / yMax * 135; body += `<rect x="${90 + bin * 820 / values.length}" y="${base - height}" width="${820 / values.length - 2}" height="${height}" fill="${index === 0 ? "#4c72b0" : "#69737e"}"/>`; });
    for (const [label, value] of [["LSL", result.lower], ["USL", result.upper]] as const) if (value !== undefined) body += `<path d="M${x(value)} ${top}V${base}" stroke="#9a461b" stroke-width="2" stroke-dasharray="5 4"/>` + text(x(value), top - 4, label, 'text-anchor="middle"');
    for (let tick = 0; tick <= 4; tick++) body += text(90 + tick * 205, base + 24, f(h.min + (h.max - h.min) * tick / 4), 'text-anchor="middle" font-size="13"');
  }
  body += text(30, 550, `共通規格：下限 ${result.lower === undefined ? "指定なし" : f(result.lower)} / 上限 ${result.upper === undefined ? "指定なし" : f(result.upper)}`);
  body += text(30, 580, "縦軸：各条件内の割合 (%) ／ 横軸・区間幅・縦軸スケールは共通");
  body += text(30, 609, "記述統計のみ。差の有意性・同等性・因果関係は判定しません。", 'font-size="14"');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="640" viewBox="0 0 1000 640"><rect width="1000" height="640" fill="white"/><g fill="#1d1d1f" font-family="sans-serif" font-size="16">${body}</g></svg>`;
}
