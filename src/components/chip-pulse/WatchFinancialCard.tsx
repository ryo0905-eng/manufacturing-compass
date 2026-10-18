import { CompanyCardLogo } from "@/components/CompanyCardLogo";
import { annualNumber, annualUnit, comparableAnnualPeriods, reportedValue, type AnnualPeriod, type AnnualYears, type AnnualSeries } from "@/lib/earnings-history-math";
import { watchExchange, watchFinancials, watchMetrics, watchPercent, watchYenAmount, watchYearMonth, type WatchMetric, type WatchFinancialDomain } from "@/lib/watch-financials";
import type { WatchCompany } from "@/lib/watch-explorer";
import { WatchFinancialChart } from "./WatchFinancialChart";
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
  const boundary = data?.points.some(point => point.previousPeriod && !comparableAnnualPeriods(point.previousPeriod, point.period));
  const linkProps = { href: `${company.href}?years=${years}#annual-history`, articleId: company.id, action: "article", destination: "earnings", placement: "explore", uiVersion: "cards-v2", reloadDocument: true } as const;
  return <li id={company.anchorId} className={styles.financialItem} data-selected={selected} data-missing={data?.latest == null}>
    <div className={styles.financialCard}>
      <MediaLink {...linkProps} className={styles.cardPrimaryLink}>
        <div className={styles.cardHeading}><h3>{company.name}</h3><span className={styles.cardLogo}><CompanyCardLogo companyId={company.id} name={company.name} size="ranking" fallback="none" /></span></div>
        <div className={styles.cardMetric}><strong>{data?.displayValue ?? "未取得"}</strong></div>
      </MediaLink>
      <p className={styles.cardLatest}>{last ? <time dateTime={last.end}>{watchYearMonth(last.end)}期 · 通期</time> : "直近期未取得"}
        {metric === "revenue" ? <><br />前年比 {watchPercent(data?.revenueYoY ?? null, true)}</> : null}</p>
      {data ? <WatchFinancialChart key={`${metric}-${years}`} companyId={company.id} name={company.name} metric={metric} domain={domain} points={data.points} segments={data.segments} /> : <p className={styles.cardScope}>年次履歴未取得</p>}
      <div className={styles.cardDates}>{first && last ? <><time dateTime={first.end}>{watchYearMonth(first.end)}</time><time dateTime={last.end}>{watchYearMonth(last.end)}</time></> : null}</div>
      <p className={styles.cardScope}>{company.id === "samsung-electronics" ? "DS部門" : last?.financialScope ?? company.scope}{data && data.points.length < years ? ` · ${data.points.length}期掲載` : ""}{data?.calculated ? " · 営業利益は算出値" : ""}{boundary ? " · 範囲・期間等の変更あり" : ""}
        {data?.latest == null ? <><br />{data?.missingReason ?? "年次履歴未取得"}</> : null}
        {metric === "revenue" && data?.revenueYoY == null ? <><br />{data?.growthMissingReason ?? "前年の通期実績が未取得"}</> : null}</p>
      <MediaLink {...linkProps} className={styles.cardDetailLink}>業績・出典を見る <span aria-hidden="true">→</span><span className={styles.srOnly}>（{company.name}）</span></MediaLink>
    </div>
    {data ? <div className={styles.srOnly}><table>
      <caption>{company.name}の年次{label}。円換算は{watchExchange.asOf}の同一為替で換算した規模比較用の概算。前年比＝本期売上高÷前年売上高×100−100。</caption>
      <thead><tr><th scope="col">期末日</th><th scope="col">売上高（原通貨・掲載単位）</th><th scope="col">売上高（円換算・概算）</th><th scope="col">前年期末日</th><th scope="col">前年売上高（原通貨・掲載単位）</th><th scope="col">売上前年比（%）</th>{metric === "operating_margin" ? <><th scope="col">営業利益（原通貨・掲載単位）</th><th scope="col">営業利益率（営業利益÷売上高×100）</th></> : null}<th scope="col">対象範囲・算出不可理由・比較の注記</th></tr></thead>
      <tbody>{data.points.map(point => <tr key={point.period.end}>
        <th scope="row">{point.period.end}</th><td>{amount(point.period, "revenue")}</td><td>{watchYenAmount(point.revenueYen)}</td>
        <td>{point.previousPeriod?.end ?? "未取得"}</td><td>{amount(point.previousPeriod, "revenue")}</td><td>{watchPercent(point.revenueYoY, true)}</td>
        {metric === "operating_margin" ? <><td>{amount(point.period, "operatingIncome")}</td><td>{watchPercent(point.value)}</td></> : null}
        <td>{[point.period.financialScope, point.missingReason, point.growthMissingReason, point.period.breakBefore].filter(Boolean).join(" · ")}</td>
      </tr>)}</tbody>
    </table></div> : null}
  </li>;
}
