export type ParetoEntry = { label: string; count: number; occurrences: number };
export type ParetoRow = ParetoEntry & { share: number; cumulative: number };
export type ParetoResult = { rows: ParetoRow[]; total: number };
export type ParetoInput = { entries: ParetoEntry[]; duplicates: ParetoEntry[] };

/** Two pasted columns, not a general CSV importer. Never silently drop invalid rows. */
export function parsePareto(text: string): ParetoInput {
  if (text.length > 12000) throw new Error("入力は12,000文字以内にしてください。");
  const lines = text.replace(/^\uFEFF/, "").split(/\r\n|\n|\r/).map((value, index) => ({ value, line: index + 1 })).filter(({ value }) => value.trim());
  if (lines[0] && /^分類[\t,]件数$/.test(lines[0].value.trim())) lines.shift();
  if (!lines.length) throw new Error("分類と件数を入力してください。");
  if (lines.length > 30) throw new Error("見出しを除いて30行以内にしてください。");
  const groups = new Map<string, ParetoEntry>();
  for (const { value, line } of lines) {
    const cells = value.split(value.includes("\t") ? "\t" : ",");
    if (cells.length !== 2) throw new Error(`${line}行目：分類と件数の2列にしてください。カンマを含む分類名にはタブ区切りを使ってください。`);
    const label = cells[0].trim(), raw = cells[1].trim();
    if (!label || Array.from(label).length > 40 || /[\u0000-\u001f\u007f\ufffe\uffff]/.test(label)) throw new Error(`${line}行目：分類名は制御文字を含まない1〜40文字にしてください。`);
    if (!/^\d+$/.test(raw) || !Number.isSafeInteger(Number(raw)) || Number(raw) > 1000000000) throw new Error(`${line}行目：件数は0〜10億の整数を、桁区切りなしで入力してください。`);
    const old = groups.get(label);
    groups.set(label, { label, count: (old?.count ?? 0) + Number(raw), occurrences: (old?.occurrences ?? 0) + 1 });
  }
  const entries = [...groups.values()];
  return { entries, duplicates: entries.filter(row => row.occurrences > 1) };
}
export function calculatePareto(input: ParetoInput): ParetoResult {
  const total = input.entries.reduce((sum, row) => sum + row.count, 0);
  let cumulative = 0;
  const rows = input.entries.map((row, order) => ({ ...row, order })).sort((a, b) => b.count - a.count || a.order - b.order).map(({ order: _order, ...row }) => {
    cumulative += row.count;
    return { ...row, share: total ? row.count / total : 0, cumulative: total ? cumulative / total : 0 };
  });
  return { rows, total };
}
export const paretoPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
// Prefix possible spreadsheet formulas, including names beginning with whitespace after trim.
const safeCell = (value: string) => /^[=+@-]/.test(value) ? `'${value}` : value;
export function paretoTable(result: ParetoResult, sample = false) {
  return ["番号\t分類\t件数\t構成比\t累積比率", ...result.rows.map((row, index) => [index + 1, safeCell(row.label), row.count, result.total ? paretoPercent(row.share) : "算出不可", result.total ? paretoPercent(row.cumulative) : "算出不可"].join("\t")), `合計\t\t${result.total}\t${result.total ? "100.0%" : "算出不可"}\t`, sample ? "注記：教材用の架空例。構成比は入力件数の内訳で、不良率・歩留まりではありません。" : "注記：構成比は入力件数の内訳で、不良率・歩留まりではありません。"].join("\n");
}
const xml = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!);
/** Same geometry in preview and export. All user text is escaped before SVG markup. */
export function paretoSvg(result: ParetoResult, sample: boolean, includeLegend = false) {
  const width = Math.max(includeLegend ? 960 : 720, result.rows.length * 52 + 160), height = 390 + (includeLegend ? result.rows.length * 24 + 40 : 0);
  const left = 95, top = 65, chartHeight = 230, plotWidth = width - 170, slot = plotWidth / result.rows.length;
  const text = (x: number, y: number, label: string, anchor = "start") => `<text x="${x}" y="${y}" text-anchor="${anchor}">${xml(label)}</text>`;
  const ticks = [0, .25, .5, .75, 1].map(f => {
    const y = top + chartHeight * (1 - f);
    return `<path d="M${left} ${y}H${width - 75}" stroke="#e5e7eb"/>${text(left - 8, y + 5, String(result.total * f), "end")}${text(width - 66, y + 5, `${f * 100}%`)}`;
  }).join("");
  const bars = result.rows.map((row, i) => {
    const x = left + slot * i + slot * .15, barHeight = result.total ? chartHeight * row.share : 0;
    return `<rect x="${x}" y="${top + chartHeight - barHeight}" width="${slot * .7}" height="${barHeight}" fill="#1769aa"><title>${xml(row.label)}：${row.count}件</title></rect>${text(left + slot * (i + .5), top + chartHeight + 24, String(i + 1), "middle")}`;
  }).join("");
  const points = result.rows.map((row, i) => `${left + slot * (i + .5)},${top + chartHeight * (1 - row.cumulative)}`).join(" ");
  const dots = result.total ? result.rows.map((row, i) => `<circle cx="${left + slot * (i + .5)}" cy="${top + chartHeight * (1 - row.cumulative)}" r="4" fill="#785518"/>`).join("") : "";
  const legend = includeLegend ? result.rows.map((row, i) => text(24, 402 + i * 24, `${i + 1}. ${row.label}：${row.count}件 / ${result.total ? paretoPercent(row.share) : "比率算出不可"}`)).join("") : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="件数順の棒と累積比率。分類名と数値は集計表を参照。" font-family="sans-serif" font-size="14" fill="#1d1d1f"><rect width="100%" height="100%" fill="white"/>${text(24, 28, `不良分類のパレート図${sample ? "（架空例）" : ""}`)}${text(24, 51, "件数")}${text(width - 110, 51, "累積比率")}${ticks}${bars}${result.total ? `<polyline points="${points}" fill="none" stroke="#785518" stroke-width="2.5"/>` : ""}${dots}${text(24, 347, "青い棒：件数　茶色の線と点：累積比率　横軸：表の番号")}${text(24, 372, result.total ? "構成比は入力件数の内訳。不良率ではありません。" : "合計0件のため、構成比・累積比率は算出できません。")}${legend}</svg>`;
}
