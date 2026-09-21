"use client";

import { useRef, useState } from "react";
import { processComparisonSample } from "@/data/process-comparison-sample";
import { trackEvent } from "@/lib/analytics";
import { compareProcesses, comparisonRows, comparisonSvg, comparisonTsv, type Comparison, type ComparisonInput } from "@/lib/process-comparison";
import { downloadComparisonPng } from "@/lib/process-comparison-export";
import styles from "@/app/(ja)/tools/process-comparison/comparison.module.css";

const empty: ComparisonInput = { nameA: "条件A", nameB: "条件B", measurement: "", unit: "", dataA: "", dataB: "", lower: "", upper: "" };

function record(action: "started" | "completed" | "copied" | "png_exported") {
  try { trackEvent(`process_comparison_${action}`); } catch { /* Analytics must not interrupt local work. */ }
}
export function ProcessComparisonTool() {
  const [input, setInput] = useState<ComparisonInput>(empty);
  const [result, setResult] = useState<Comparison | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState("");
  const [busy, setBusy] = useState(false);
  const started = useRef(false);
  const exporting = useRef(false);
  function start() { if (!started.current) { started.current = true; record("started"); } }
  function change(next: ComparisonInput) {
    start(); setInput(next); setResult(null); setError(""); setStatus(""); setFallback("");
  }
  const field = (key: keyof ComparisonInput, label: string, numeric = false) => <label>{label}<input value={input[key]} maxLength={numeric ? 100 : 40} inputMode={numeric ? "decimal" : "text"} onChange={event => change({ ...input, [key]: event.target.value })} /></label>;
  const rows = result ? comparisonRows(result) : [];
  const svg = result ? comparisonSvg(result) : "";
  async function copy() {
    if (!result || exporting.current) return;
    exporting.current = true; setBusy(true); setStatus("");
    const text = comparisonTsv(result);
    try { await navigator.clipboard.writeText(text); setFallback(""); setStatus("表をコピーしました。Excelへ貼り付けられます。"); record("copied"); }
    catch { setFallback(text); setStatus("自動コピーを利用できません。下のテキストを選択して手動でコピーしてください。"); }
    finally { exporting.current = false; setBusy(false); }
  }
  async function png() {
    if (!result || exporting.current) return;
    exporting.current = true; setBusy(true); setStatus("");
    try { await downloadComparisonPng(svg); setStatus("PNGの保存を開始しました。"); record("png_exported"); }
    catch { setStatus("PNGを作成できませんでした。再度お試しください。"); }
    finally { exporting.current = false; setBusy(false); }
  }
  return <div className={styles.tool}>
    <form onSubmit={event => {
      event.preventDefault(); start(); setStatus(""); setFallback("");
      try { setResult(compareProcesses(input)); setError(""); record("completed"); }
      catch (cause) { setResult(null); setError(cause instanceof Error ? cause.message : "入力を確認してください。"); }
    }}>
      <fieldset disabled={busy}>
        <legend>1. 比較するデータを入力</legend>
        <p id="comparison-input-help">1行に数値を1つ、各条件2〜10,000件。空行は無視します。見出し・単位・桁区切りを含めずに貼り付けてください。</p>
        <div className={styles.actions}><button type="button" onClick={() => change({ ...processComparisonSample })}>架空データで試す</button><button type="button" onClick={() => change({ ...empty })}>入力をクリア</button></div>
        <div className={styles.columns}>
          <div>{field("nameA", "条件Aの名前")}<label>条件Aの測定値<textarea value={input.dataA} rows={9} aria-describedby="comparison-input-help" spellCheck={false} onChange={event => change({ ...input, dataA: event.target.value })} /></label></div>
          <div>{field("nameB", "条件Bの名前")}<label>条件Bの測定値<textarea value={input.dataB} rows={9} aria-describedby="comparison-input-help" spellCheck={false} onChange={event => change({ ...input, dataB: event.target.value })} /></label></div>
        </div>
        <div className={styles.columns}>{field("measurement", "測定項目（任意）")}{field("unit", "共通の単位（任意）")}{field("lower", "下限規格 LSL（任意）", true)}{field("upper", "上限規格 USL（任意）", true)}</div>
        <p>両条件で同じ測定項目・単位を使ってください。規格は片側だけでも入力でき、境界値は規格内に数えます。</p>
        <button className={styles.primary} type="submit">2条件を比較する</button>
      </fieldset>
    </form>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {result && <section aria-labelledby="comparison-result-title">
      <h2 id="comparison-result-title">2. 比較結果</h2>
      <p>{result.measurement} ／ 単位：{result.unit || "指定なし"}。数値は有効数字8桁まで表示します。</p>
      <div className={styles.tableWrap}><table><caption>2条件の記述統計（平均差はB−A）</caption><thead><tr>{rows[0].map((value, index) => <th key={index} scope="col">{value}</th>)}</tr></thead><tbody>{rows.slice(1).map(row => <tr key={row[0]}><th scope="row">{row[0]}</th><td>{row[1]}</td><td>{row[2]}</td></tr>)}</tbody></table></div>
      <p>規格内率は入力した測定値の割合です。母集団の歩留まりや、今後の品質を保証する値ではありません。</p>
      <div className={styles.chartWrap}>
        {/* Local SVG is shared with PNG export; next/image optimization would send it outside this component. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.chart} width={1000} height={640} src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`} alt={`A：${result.nameA}とB：${result.nameB}のヒストグラム。上下とも横軸・区間幅・割合の縦軸は共通。規格線はLSL・USL。`} />
      </div>
      <details><summary>分布図の数値を確認</summary><div className={styles.tableWrap}><table><caption>共通区間の割合 (%)。区間は左端を含み、右端は最終区間だけ含みます。</caption><thead><tr><th scope="col">区間番号</th><th scope="col">A (%)</th><th scope="col">B (%)</th></tr></thead><tbody>{result.histogram.a.map((value, index) => <tr key={index}><th scope="row">{index + 1}</th><td>{value.toFixed(4)}</td><td>{result.histogram.b[index].toFixed(4)}</td></tr>)}</tbody></table></div></details>
      <p>差の有意性・同等性・因果関係は判定していません。測定方法、対象ロット、採取時期、サンプル数が比較に適しているかを確認してください。</p>
      <div className={styles.actions}><button type="button" disabled={busy} onClick={copy}>表をコピー（Excel用）</button><button type="button" disabled={busy} onClick={png}>図をPNGで保存</button></div>
    </section>}
    <p role="status" aria-live="polite">{status}</p>
    {fallback && <label>手動コピー用の表<textarea readOnly rows={12} value={fallback} onFocus={event => event.currentTarget.select()} /></label>}
  </div>;
}
