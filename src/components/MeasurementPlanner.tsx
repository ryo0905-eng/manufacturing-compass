"use client";
import { useRef, useState } from "react";
import { measurementNotes, measurementSample } from "@/data/measurement-planner";
import { calculateMeasurementPlan, measurementCopy, measurementNumber, measurementTime, type MeasurementInput, type MeasurementResult } from "@/lib/measurement-planner";
import { usePracticalToolJourney } from "@/lib/use-practical-tool-journey";
import { trackEvent } from "@/lib/analytics";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import styles from "./MeasurementPlanner.module.css";

export function MeasurementPlanner() {
  const [input, setInput] = useState<MeasurementInput>({ ...measurementSample });
  const [result, setResult] = useState<MeasurementResult | null>(() => calculateMeasurementPlan(measurementSample));
  const [sample, setSample] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState("");
  const [copying, setCopying] = useState(false);
  const revision = useRef(0);
  const copyBusy = useRef(false);
  const journey = usePracticalToolJourney("measurement-planner", "ja", result, "sample");
  function clearOutput() { revision.current++; setError(""); setStatus(""); setFallback(""); }
  function edit(key: keyof MeasurementInput, value: string) {
    journey.start(); clearOutput(); setSample(false); setInput(current => ({ ...current, [key]: value })); setResult(null);
  }
  function loadSample() { journey.sample(); clearOutput(); setSample(true); setInput({ ...measurementSample }); setResult(calculateMeasurementPlan(measurementSample)); }
  async function copy() {
    if (!result || copyBusy.current) return;
    copyBusy.current = true; setCopying(true); setStatus(""); setFallback("");
    const version = revision.current, text = measurementCopy(result);
    try {
      await navigator.clipboard.writeText(text);
      if (version === revision.current) setStatus("計画をコピーしました。");
      try { trackEvent("measurement_plan_copied", { tool_id: "measurement-planner", locale: "ja" }); } catch { /* Keep local copy usable. */ }
    } catch {
      if (version === revision.current) { setFallback(text); setStatus("自動コピーできませんでした。下のテキストを選択してコピーしてください。"); }
    } finally { copyBusy.current = false; setCopying(false); }
  }
  const field = (key: keyof MeasurementInput, label: string, help?: string) => <label className={styles.field}>
    <span>{label}</span><input value={input[key]} inputMode={key === "unit" ? "text" : "decimal"} maxLength={key === "unit" ? 20 : 100} aria-describedby={help ? `planner-${key}-help` : undefined} onChange={event => edit(key, event.target.value)} />
    {help && <small id={`planner-${key}-help`}>{help}</small>}
  </label>;
  const unit = result?.unit ? ` ${result.unit}` : "（単位未指定）";
  return <div className={styles.tool}>
    <form className={styles.panel} onSubmit={event => {
      event.preventDefault(); journey.calculate(); clearOutput();
      try { setResult(calculateMeasurementPlan(input)); }
      catch (cause) { journey.error(); setResult(null); setError(cause instanceof Error ? cause.message : "入力を確認してください。"); }
    }}>
      <h2 ref={journey.inputRef}>測定前の条件を入力</h2>
      <p>{sample ? "架空例を表示中：標準偏差2 nm、推定幅±0.5 nm、1測定30秒。" : "入力した条件で計画します。"}</p>
      <div className={styles.fields}>
        {field("sigma", "想定標準偏差 σ", "過去の同等条件の測定から見積もります。不明な場合は、まず予備測定が必要です。")}
        {field("precision", "平均の推定幅 ±E", "区間全体の幅ではなく、平均の左右それぞれの幅です。標準偏差と同じ単位で入力してください。")}
        {field("unit", "単位（任意）")}
        {field("seconds", "1測定の所要時間・秒（任意）")}
      </div>
      <p>信頼水準95%固定・正規近似。入力はブラウザ内で計算し、外部へ送信しません。</p>
      <div className={styles.actions}><button type="submit">測定計画を計算</button><button type="button" onClick={loadSample}>架空例を試す</button></div>
      {error && <p role="alert">{error}</p>}
    </form>
    {result ? <section className={styles.panel} aria-labelledby="planner-result">
      <h2 id="planner-result" ref={journey.resultRef}>測定計画の目安{sample ? "（架空例）" : ""}</h2>
      <p><strong>{measurementNotes[0]}</strong></p>
      <dl className={styles.metrics}>
        <div><dt>測定数の目安</dt><dd>{result.plan.count.toLocaleString("ja-JP")}件</dd></div>
        <div><dt>この測定数での推定幅</dt><dd>±{measurementNumber(result.plan.halfWidth)}{unit}</dd></div>
        <div><dt>測定時間の合計</dt><dd>{measurementTime(result.plan.totalSeconds)}</dd></div>
      </dl>
      <p>準備・移動・待ち時間は含みません。表示数値は有効数字6桁に丸めています。</p>
      <h3>精度と負担を3案で比較</h3>
      <div className={styles.tableWrap}><table><caption>想定標準偏差は{measurementNumber(result.sigma)}{unit}で共通</caption><thead><tr><th scope="col">計画</th><th scope="col">目標の幅</th><th scope="col">測定数</th><th scope="col">推定幅</th><th scope="col">測定時間</th></tr></thead><tbody>{result.alternatives.map(item => <tr key={item.label}><th scope="row">{item.label}</th>{item.plan ? <><td>±{measurementNumber(item.plan.target)}{unit}</td><td>{item.plan.count.toLocaleString("ja-JP")}件</td><td>±{measurementNumber(item.plan.halfWidth)}{unit}</td><td>{measurementTime(item.plan.totalSeconds)}</td></> : <td colSpan={4}>{item.error}</td>}</tr>)}</tbody></table></div>
      <ul>{measurementNotes.slice(1).map(note => <li key={note}>{note}</li>)}</ul>
      <div className={styles.actions}><button type="button" disabled={copying} onClick={copy}>{copying ? "コピー中…" : "計画をコピー"}</button></div>
      <p role="status">{status}</p>
      {fallback && <label className={styles.field}>手動コピー用の計画<textarea readOnly value={fallback} rows={12} onFocus={event => event.currentTarget.select()} /></label>}
      <nav aria-label="次に学ぶ"><TrackedInternalLink href="/tools/improvement-confidence" eventName="tool_result_related_click" eventProperties={{ tool_id: "measurement-planner", destination_tool: "improvement-confidence", locale: "ja", placement: "result" }}>改善の差をどこまで信頼できるか学ぶ →</TrackedInternalLink><p>このツールは1つの平均の精度を計画します。変更前後の差の判断は、別の問いとして教材で学べます。</p></nav>
    </section> : <p role="status">条件を入力して「測定計画を計算」を押してください。</p>}
  </div>;
}
