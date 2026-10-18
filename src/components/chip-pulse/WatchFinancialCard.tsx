import { annualNumber, annualUnit, reportedValue, type AnnualPeriod, type AnnualYears, type AnnualSeries } from "@/lib/earnings-history-math";
import { watchFinancials, watchMetrics, watchYearMonth, type WatchMetric, type WatchFinancialDomain } from "@/lib/watch-financials";
import type { WatchCompany } from "@/lib/watch-explorer";
import { MediaLink } from "./MediaLinks";
import styles from "./WatchExplorer.module.css";

function amount(period: AnnualPeriod | undefined, field: "revenue" | "operatingIncome") {
  if (!period) return "未取得";
  const value = reportedValue(period[field]);
  return value === null ? period[field].status === "unpublished" ? "未公表" : "未取得" : `${annualNumber(value)}${annualUnit(period)}`;
}

export function WatchFinancialCard({ company, series: history, metric, domain, selected, years = 10 }: {
  company: WatchCompany; series?: AnnualSeries; years?: AnnualYears; metric: WatchMetric; domain: WatchFinancialDomain; selected: boolean;
}) {
  const data = history ? watchFinancials(history, metric, years) : null;
  const label = watchMetrics.find(item => item.id === metric)!.chartLabel;
  const first = data?.points[0]?.period;
  const last = data?.points.at(-1)?.period;
  const width = 240, height = 36, inset = 3;
  const start = Date.parse(first?.end ?? "2000-01-01");
  const span = Math.max(1, Date.parse(last?.end ?? "2000-01-01") - start);
  const x = (date: string) => inset + (Date.parse(date) - start) / span * (width - inset * 2);
  const y = (value: number) => height - inset - (value - domain.min) / (domain.max - domain.min) * (height - inset * 2);
  const title = `${company.name}、最大${years}年・${data?.points.length ?? 0}期の${label}、直近期${last?.label ?? "未取得"}：${data?.displayValue ?? "未取得"}${data?.latest != null ? "%" : ""}。全12社で共通の縦軸、破線は0%。${data?.missingReason ?? ""}`;
  return <li id={company.anchorId} className={styles.financialItem} data-selected={selected} data-missing={data?.latest == null}>
    <MediaLink href={`${company.href}?years=${years}#annual-history`} articleId={company.id} action="article" destination="earnings" placement="explore" uiVersion="cards-v2" reloadDocument className={styles.financialCard}>
      <div className={styles.cardHeading}><h3>{company.name}</h3></div>
      <div className={styles.cardMetric}>{metric === "revenue" ? <span>前年比</span> : null}<strong>{data?.displayValue ?? "未取得"}</strong>{data?.latest != null ? <span>%</span> : null}</div>
      <svg className={styles.sparkline} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-labelledby={`spark-${company.id}`}>
        <title id={`spark-${company.id}`}>{title}</title>
        <line x1={inset} x2={width - inset} y1={y(0)} y2={y(0)} stroke="#b9c2ce" strokeDasharray="3 3" />
        {data?.segments.map((segment, index) => {
          const coordinates = segment.map(point => `${x(point.period.end)},${y(point.value!)}`).join(" ");
          return <g key={index}>
            <polygon points={`${x(segment[0].period.end)},${y(0)} ${coordinates} ${x(segment.at(-1)!.period.end)},${y(0)}`} fill="#edf4fc" />
            <polyline points={coordinates} fill="none" stroke="#3976bd" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            {segment.map(point => <circle key={point.period.end} cx={x(point.period.end)} cy={y(point.value!)} r="1.7" fill="#3976bd" />)}
          </g>;
        })}
      </svg>
      <div className={styles.cardDates}>{first && last ? <><time dateTime={first.end}>{watchYearMonth(first.end)}</time><time dateTime={last.end}>{watchYearMonth(last.end)}</time></> : <span>年次履歴未取得</span>}</div>
      <p className={styles.cardScope}>{company.id === "samsung-electronics" ? "DS部門" : last?.financialScope ?? company.scope}{data && data.points.length < years ? ` · ${data.points.length}期掲載` : ""}{data?.calculated ? " · 営業利益は算出値" : ""}{data?.latest == null ? <><br />{data?.missingReason ?? "年次履歴未取得"}</> : null}</p>
      <span className={styles.srOnly}>年次の業績・数値表と出典を見る</span>
    </MediaLink>
    {data ? <div className={styles.srOnly}><table>
      <caption>{company.name}の年次{label}{metric === "revenue" ? "（前年比＝本期売上高÷前年売上高×100−100）" : "（営業利益÷売上高×100）"}</caption>
      <thead><tr><th scope="col">期末日</th><th scope="col">売上高（原通貨・掲載単位）</th>{metric === "revenue" ? <><th scope="col">前年期末日</th><th scope="col">前年売上高（原通貨・掲載単位）</th></> : <th scope="col">営業利益（原通貨・掲載単位）</th>}<th scope="col">{label}（%）</th><th scope="col">算出不可理由・比較の注記</th></tr></thead>
      <tbody>{data.points.map(point => <tr key={point.period.end}>
        <th scope="row">{point.period.end}</th><td>{amount(point.period, "revenue")}</td>
        {metric === "revenue" ? <><td>{point.previousPeriod?.end ?? "未取得"}</td><td>{amount(point.previousPeriod, "revenue")}</td></> : <td>{amount(point.period, "operatingIncome")}</td>}
        <td>{point.value === null ? "算出不可" : `${annualNumber(point.value)}%`}</td><td>{point.missingReason ?? point.period.breakBefore ?? "—"}</td>
      </tr>)}</tbody>
    </table></div> : null}
  </li>;
}
