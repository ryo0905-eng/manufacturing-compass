import { annualNumber, annualPoints, annualUnit, operatingMargin, type AnnualMetric, type AnnualSeries } from "@/lib/earnings-history-math";
import { AnnualAmountChart, AnnualLineChart } from "./AnnualCharts";
import { EarningsInternalLink, EarningsSourceLink } from "./EarningsLinks";
import styles from "./AnnualHistory.module.css";

function MetricCell({ metric }: { metric: AnnualMetric }) {
  return metric.status === "reported" ? <>{new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 3 }).format(metric.value)}{metric.calculation ? <small>算出：{metric.calculation}</small> : null}</> : <>{metric.status === "unpublished" ? "未公表" : "未取得"}<small>{metric.reason}</small></>;
}

export function AnnualDataTable({ series, includeIndex = false }: { series: AnnualSeries; includeIndex?: boolean }) {
  const points = annualPoints(series, "revenueIndex");
  return <div className={styles.tableWrap}><table className={styles.table}>
    <caption>{series.name}の年次実績・数値と出典</caption>
    <thead><tr><th scope="col">対象期間・単位</th><th scope="col">売上高</th><th scope="col">営業利益</th><th scope="col">営業利益率</th>{includeIndex ? <th scope="col">売上高指数</th> : null}<th scope="col">範囲・出典</th></tr></thead>
    <tbody>{series.periods.map((period, index) => <tr key={period.end}>
      <th scope="row">{period.label}<small>{period.start}〜{period.end}<br />{annualUnit(period)}</small></th>
      <td><MetricCell metric={period.revenue} /></td><td><MetricCell metric={period.operatingIncome} /></td>
      <td>{annualNumber(operatingMargin(period), "%")}</td>
      {includeIndex ? <td>{annualNumber(points[index].value)}</td> : null}
      <td><small>{period.financialScope} · {period.accountingStandard}{period.breakBefore ? <><br />接続なし：{period.breakBefore}</> : null}</small>
        <EarningsSourceLink href={period.source.url} companyId={series.companyId} documentId={`annual-period-${period.end}`}>期間の根拠 ↗</EarningsSourceLink>
        {(["revenue", "operatingIncome"] as const).map(key => { const source = period[key].source; return source ? <small key={key}><EarningsSourceLink href={source.url} companyId={series.companyId} documentId={`annual-${key}-${period.end}`}>{key === "revenue" ? "売上高" : "営業利益"}：{source.locator} ↗</EarningsSourceLink></small> : null; })}
      </td>
    </tr>)}</tbody>
  </table></div>;
}

export function AnnualCompanyAnalysis({ series }: { series: AnnualSeries }) {
  return <section id="annual-history" className={styles.section} aria-labelledby="annual-history-title">
    <h2 id="annual-history-title">年次5年の業績</h2>
    <p className={styles.note}>通期実績 · 確認 {series.checkedAt}。{series.coverageNote} 営業利益率は同じ期・範囲の営業利益÷売上高×100で算出。未取得はゼロに置き換えず、比較範囲の変更箇所は線を接続していません。</p>
    <div className={styles.charts}><AnnualAmountChart series={series} /><AnnualLineChart series={[series]} metric="margin" /></div>
    <AnnualDataTable series={series} />
    {series.segment === "equipment" || series.segment === "memory" ? <p><EarningsInternalLink href={`/semiconductor-watch/earnings/compare?group=${series.segment}&company=${series.companyId}`} companyId={series.companyId} destination="annual_compare">同業他社と年次5年を比較する →</EarningsInternalLink></p> : null}
  </section>;
}

export function AnnualMini({ series }: { series: AnnualSeries }) {
  return <div className={styles.mini}>
    <AnnualAmountChart series={series} mini />
    <p className={styles.note}>{series.periods.at(-1)?.financialScope} · 通期実績 · 確認 {series.checkedAt}</p>
    <details><summary>年次の数値と出典を見る</summary><AnnualDataTable series={series} /></details>
    <EarningsInternalLink href={`/semiconductor-watch/earnings/${series.companyId}#annual-history`} companyId={series.companyId} destination="annual_history">5年間の業績を見る →</EarningsInternalLink>
  </div>;
}
