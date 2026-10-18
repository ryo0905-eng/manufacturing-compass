import { useId } from "react";
import { annualDomain, annualLineSegments, annualNumber, annualPoints, annualUnit, reportedValue, type AnnualChartMetric, type AnnualSeries } from "@/lib/earnings-history-math";
import styles from "./AnnualHistory.module.css";

export const annualColors = ["#1769aa", "#9b4b26", "#367552"];
const width = 640;
const height = 280;
const left = 68;
const right = 18;
const top = 26;
const bottom = 38;
const compactNumber = (value: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);

export function AnnualAmountChart({ series, mini = false }: { series: AnnualSeries; mini?: boolean }) {
  const id = useId();
  const first = series.periods[0];
  if (!first) return <p>年次データは未取得です。</p>;
  const keys = mini ? ["revenue"] as const : ["revenue", "operatingIncome"] as const;
  // Separate reporting currencies/units must never share an amount axis.
  const sameUnit = series.periods.every(period => period.currency === first.currency && period.unit === first.unit);
  if (!sameUnit) return <p>通貨・単位が変わるため、金額グラフは表示していません。各期の表を確認してください。</p>;
  const domain = annualDomain(series.periods.flatMap(period => keys.map(key => reportedValue(period[key]))));
  const y = (value: number) => top + (domain.max - value) / (domain.max - domain.min) * (height - top - bottom);
  const slot = (width - left - right) / series.periods.length;
  const barWidth = Math.min(32, slot / (keys.length + 1.5));
  return <figure className={styles.chart}>
    <figcaption>{mini ? "年次5年の売上高" : "売上高・営業利益"} <small>（{annualUnit(first)}）</small></figcaption>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={id}>
      <title id={id}>{`${series.name}の${mini ? "売上高" : "売上高と営業利益"}。通期実績、${first.label}から${series.periods.at(-1)?.label}。数値と出典は表で確認できます。`}</title>
      {[domain.min, (domain.min + domain.max) / 2, domain.max].map(value => <g key={value}><line className={styles.grid} x1={left} x2={width - right} y1={y(value)} y2={y(value)} /><text x={left - 8} y={y(value) + 4} textAnchor="end">{compactNumber(value)}</text></g>)}
      <line className={styles.zero} x1={left} x2={width - right} y1={y(0)} y2={y(0)} />
      {series.periods.map((period, index) => <g key={period.end}>
        {keys.map((key, keyIndex) => { const value = reportedValue(period[key]); return value === null ? null : <rect key={key} x={left + slot * (index + 0.5) + (keyIndex - keys.length / 2) * barWidth} y={Math.min(y(value), y(0))} width={barWidth - 3} height={value === 0 ? 1 : Math.abs(y(value) - y(0))} rx={2} fill={annualColors[keyIndex]}><title>{`${period.label}：${key === "revenue" ? "売上高" : "営業利益"} ${annualNumber(value)} ${annualUnit(period)}`}</title></rect>; })}
        <text x={left + slot * (index + 0.5)} y={height - 12} textAnchor="middle">{period.end.slice(0, 7)}</text>
      </g>)}
    </svg>
    {!mini ? <div className={styles.legend}>{keys.map((key, index) => <span key={key}><i className={styles.key} style={{ background: annualColors[index] }} aria-hidden="true" />{key === "revenue" ? "売上高" : "営業利益"}</span>)}</div> : null}
  </figure>;
}

export function AnnualLineChart({ series, metric }: { series: AnnualSeries[]; metric: AnnualChartMetric }) {
  const id = useId();
  const all = series.map(item => ({ series: item, points: annualPoints(item, metric) }));
  const dates = [...new Set(all.flatMap(item => item.points.map(point => point.period.end)))].sort();
  if (!dates.length) return <p>年次データは未取得です。</p>;
  const start = Date.parse(dates[0]);
  const span = Date.parse(dates.at(-1)!) - start || 1;
  const x = (date: string) => left + (Date.parse(date) - start) / span * (width - left - right);
  const domain = annualDomain(all.flatMap(item => item.points.map(point => point.value)));
  const y = (value: number) => top + (domain.max - value) / (domain.max - domain.min) * (height - top - bottom);
  const label = metric === "margin" ? "営業利益率（%）" : "売上高指数（各社の掲載最古期＝100）";
  const ticks = [...new Set([dates[0], dates[Math.floor((dates.length - 1) / 2)], dates.at(-1)!])];
  return <figure className={styles.chart}>
    <figcaption>{label}</figcaption>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={id}>
      <title id={id}>{`${series.map(item => item.name).join("・")}の${label}。横軸は実際の決算期末日。欠測や比較範囲の変更箇所は接続していません。数値は各社の表で確認できます。`}</title>
      {[domain.min, (domain.min + domain.max) / 2, domain.max].map(value => <g key={value}><line className={styles.grid} x1={left} x2={width - right} y1={y(value)} y2={y(value)} /><text x={left - 8} y={y(value) + 4} textAnchor="end">{annualNumber(value)}</text></g>)}
      <line className={styles.zero} x1={left} x2={width - right} y1={y(0)} y2={y(0)} />
      {all.map((item, index) => <g key={item.series.companyId}>
        {annualLineSegments(item.points).map((segment, segmentIndex) => <polyline key={segmentIndex} fill="none" stroke={annualColors[index]} strokeWidth={2.5} strokeDasharray={index === 1 ? "8 4" : index === 2 ? "2 4" : undefined} points={segment.map(point => `${x(point.period.end)},${y(point.value!)}`).join(" ")} />)}
        {item.points.filter(point => point.value !== null).map(point => <circle key={point.period.end} cx={x(point.period.end)} cy={y(point.value!)} r={4} fill={annualColors[index]}><title>{`${item.series.name} ${point.period.label}（期末${point.period.end}）：${annualNumber(point.value, metric === "margin" ? "%" : "")}`}</title></circle>)}
      </g>)}
      {ticks.map((date, index) => <text key={date} x={x(date)} y={height - 12} textAnchor={index === 0 ? "start" : index === ticks.length - 1 ? "end" : "middle"}>{date.slice(0, 7)}</text>)}
    </svg>
    <div className={styles.legend}>{series.map((item, index) => <span key={item.companyId}><i className={styles.key} style={{ background: annualColors[index] }} aria-hidden="true" />{item.name}{index === 1 ? "（破線）" : index === 2 ? "（点線）" : "（実線）"}</span>)}</div>
  </figure>;
}
