import { CompanyCardLogo } from "@/components/CompanyCardLogo";
import { annualUnit, annualWindow, type AnnualYears, type AnnualSeries } from "@/lib/earnings-history-math";
import { watchFinancials, watchMetrics, watchYearMonth, type WatchMetric } from "@/lib/watch-financials";
import type { WatchCompany } from "@/lib/watch-explorer";
import { MediaLink } from "./MediaLinks";
import styles from "./WatchExplorer.module.css";

export function WatchFinancialCard({ company, series: history, metric, selected, years = 10 }: {
  company: WatchCompany; series?: AnnualSeries; years?: AnnualYears; metric: WatchMetric; selected: boolean;
}) {
  const series = history ? annualWindow(history, years) : undefined;
  const data = series ? watchFinancials(series, metric) : null;
  const label = watchMetrics.find(item => item.id === metric)!.label;
  const first = series?.periods[0];
  const last = series?.periods.at(-1);
  const width = 240, height = 50, inset = 3;
  const start = Date.parse(first?.end ?? "2000-01-01");
  const span = Math.max(1, Date.parse(last?.end ?? "2000-01-01") - start);
  const domain = data?.domain ?? { min: 0, max: 1 };
  const x = (date: string) => inset + (Date.parse(date) - start) / span * (width - inset * 2);
  const y = (value: number) => height - inset - (value - domain.min) / (domain.max - domain.min) * (height - inset * 2);
  const title = `${company.name}、最大${years}年・${series?.periods.length ?? 0}期の${label}、直近期${last?.label ?? "未取得"}：${data?.displayValue ?? "未取得"}${data?.unit ?? ""}`;
  return <li id={company.anchorId} className={styles.financialItem} data-selected={selected} data-missing={data?.latest === null}>
    <MediaLink href={`${company.href}?years=${years}#annual-history`} articleId={company.id} action="article" destination="earnings" placement="explore" uiVersion="cards-v2" reloadDocument className={styles.financialCard}>
      <div className={styles.cardHeading}><h3>{company.name}</h3><span className={styles.cardLogo}><CompanyCardLogo companyId={company.id} name={company.name} size="ranking" fallback="none" /></span></div>
      <div className={styles.cardMetric}><strong>{data?.displayValue ?? "未取得"}</strong><span>{data?.unit}</span></div>
      <svg className={styles.sparkline} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-labelledby={`spark-${company.id}`}>
        <title id={`spark-${company.id}`}>{title}</title>
        {data?.segments.map((segment, index) => {
          const coordinates = segment.map(point => `${x(point.period.end)},${y(point.value!)}`).join(" ");
          return <g key={index}>
            <polygon points={`${x(segment[0].period.end)},${y(0)} ${coordinates} ${x(segment.at(-1)!.period.end)},${y(0)}`} fill="#edf4fc" />
            <polyline points={coordinates} fill="none" stroke="#3976bd" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            {segment.map(point => <circle key={point.period.end} cx={x(point.period.end)} cy={y(point.value!)} r="1.7" fill="#3976bd" />)}
          </g>;
        })}
        {domain.min < 0 ? <line x1={inset} x2={width - inset} y1={y(0)} y2={y(0)} stroke="#b9c2ce" strokeDasharray="3 3" /> : null}
      </svg>
      <div className={styles.cardDates}>{first && last ? <><time dateTime={first.end}>{watchYearMonth(first.end)}</time><time dateTime={last.end}>{watchYearMonth(last.end)}</time></> : <span>年次履歴未取得</span>}</div>
      <p className={styles.cardScope}>{company.id === "samsung-electronics" ? "DS部門" : last?.financialScope ?? company.scope}{series && series.periods.length < years ? ` · ${series.periods.length}期掲載` : ""}{data?.calculated ? " · 営業利益は算出値" : ""}{data?.latest === null ? <><br />{data.missingReason}</> : null}</p>
      <span className={styles.srOnly}>年次の業績・数値表と出典を見る</span>
    </MediaLink>
    {data ? <div className={styles.srOnly}><table><caption>{company.name}の年次{label}</caption><thead><tr><th>期末日</th><th>{label}（原通貨・掲載単位）</th></tr></thead><tbody>{data.points.map(point => <tr key={point.period.end}><th>{point.period.end}</th><td>{point.value === null ? "算出不可・未取得" : `${point.value}${metric === "operating_margin" ? "%" : annualUnit(point.period)}`}{point.period.breakBefore ? `（${point.period.breakBefore}）` : ""}</td></tr>)}</tbody></table></div> : null}
  </li>;
}
