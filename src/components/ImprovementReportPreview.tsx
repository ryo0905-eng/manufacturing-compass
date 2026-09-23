import { reportObservations, capabilityRows } from "@/lib/improvement-report";
import { comparisonSvg, formatComparisonNumber as f, type Comparison } from "@/lib/process-comparison";
import { improvementReportMeta, type ReportNotes } from "@/data/improvement-report";
import styles from "./ImprovementReport.module.css";
export function ImprovementReportPreview({ result, notes }: { result: Comparison; notes: ReportNotes }) {
  const rows = [["件数", String(result.a.count), String(result.b.count)], ["平均", f(result.a.mean), f(result.b.mean)], ["標本標準偏差", f(result.a.sd), f(result.b.sd)], ["最小", f(result.a.min), f(result.b.min)], ["最大", f(result.a.max), f(result.b.max)]];
  if (result.a.rate !== undefined) rows.push(["規格内率 (%)", f(result.a.rate), f(result.b.rate!)]);
  rows.push(...capabilityRows(result));
  return <article className={styles.report} data-report-preview>
    <header><p>社内検討用 / 工程改善レポート</p><h2>{notes.reportTitle || "工程条件の比較報告"}</h2><p>報告日：{notes.reportDate || "未記入"}　測定項目：{result.measurement}　単位：{result.unit || "未指定"}</p></header>
    <div className={styles.background}><p><strong>変更内容：</strong>{notes.changeDescription || "未記入"}</p><p><strong>測定条件：</strong>{notes.measurementConditions || "未記入"}</p></div>
    <section className={styles.numerical}><h3>数値と分布（入力データから計算）</h3><p>LSL：{result.lower === undefined ? "未指定" : f(result.lower)} / USL：{result.upper === undefined ? "未指定" : f(result.upper)}　平均差 B−A：{f(result.difference)}</p>
      <div className={styles.comparison}><table><thead><tr><th scope="col">指標</th><th scope="col">A：{result.nameA}</th><th scope="col">B：{result.nameB}</th></tr></thead><tbody>{rows.map(row => <tr key={row[0]}>{row.map((value, index) => index === 0 ? <th scope="row" key={index}>{value}</th> : <td key={index}>{value}</td>)}</tr>)}</tbody></table>
        {/* SVG labels are escaped by comparisonSvg; all image processing stays local. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={1000} height={640} src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(comparisonSvg(result))}`} alt="A・Bの分布図。共通の横軸・区間・割合で比較。" />
      </div>
    </section>
    <section><h3>自動の観察文（記述統計）</h3>{reportObservations(result).map(text => <p key={text}>{text}</p>)}</section>
    <section><h3>本人の記述</h3><p><strong>考察：</strong>{notes.interpretation || "未記入"}</p><p><strong>未確認事項：</strong>{notes.uncertainties || "未記入"}</p><p><strong>次の行動：</strong>{notes.nextAction || "未記入"}</p></section>
    <footer><p>標準偏差は全データの標本標準偏差（n−1）。Pp・Ppk等は全体変動に基づく指標です。数値は有効数字8桁。規格内率は観測データ内の割合です。差の有意性・同等性・因果関係、工程の安定性、将来品質は判定していません。</p><p>作成元：Manufacturing Compass / mfg-compass.com　計算仕様更新日：{improvementReportMeta.updatedAt}</p></footer>
  </article>;
}
