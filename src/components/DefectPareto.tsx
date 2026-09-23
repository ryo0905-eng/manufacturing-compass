"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Controls";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { paretoSample, paretoNotes } from "@/data/defect-pareto";
import { parsePareto, calculatePareto, paretoPercent, paretoSvg, paretoTable, type ParetoInput, type ParetoResult } from "@/lib/defect-pareto";
import { usePracticalToolJourney } from "@/lib/use-practical-tool-journey";
import { trackEvent } from "@/lib/analytics";
import styles from "./DefectPareto.module.css";

function action(value: string) { try { trackEvent("pareto_action", { tool_id: "defect-pareto", action: value }); } catch { /* Local operations remain available. */ } }
export function DefectPareto() {
  const [input, setInput] = useState("");
  const [sample, setSample] = useState(false);
  const [result, setResult] = useState<ParetoResult | null>(null);
  const [pending, setPending] = useState<ParetoInput | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState("");
  const [copying, setCopying] = useState(false);
  const revision = useRef(0), busy = useRef(false);
  const journey = usePracticalToolJourney("defect-pareto", "ja", result, "custom");
  function invalidate() { revision.current++; setResult(null); setPending(null); setError(""); setStatus(""); setFallback(""); }
  function edit(value: string) { journey.start(); invalidate(); setSample(false); setInput(value); }
  function calculate() {
    journey.calculate(); invalidate();
    try { const parsed = parsePareto(input); if (parsed.duplicates.length) setPending(parsed); else setResult(calculatePareto(parsed)); }
    catch (cause) { journey.error(); setError(cause instanceof Error ? cause.message : "入力を確認してください。"); }
  }
  async function copy() {
    if (!result || busy.current) return;
    busy.current = true; setCopying(true); setStatus(""); setFallback("");
    const version = revision.current, text = paretoTable(result, sample);
    try { await navigator.clipboard.writeText(text); if (version === revision.current) setStatus("集計表をコピーしました。"); action("copy_success"); }
    catch { if (version === revision.current) { setFallback(text); setStatus("下のテキストを選択してコピーしてください。"); } }
    finally { busy.current = false; setCopying(false); }
  }
  function save() {
    if (!result) return;
    let url: string | undefined;
    try {
      url = URL.createObjectURL(new Blob([paretoSvg(result, sample, true)], { type: "image/svg+xml;charset=utf-8" }));
      const link = document.createElement("a"); link.href = url; link.download = "defect-pareto.svg";
      document.body.appendChild(link); try { link.click(); } finally { link.remove(); }
      setStatus("図の保存を開始しました。"); action("svg_requested");
    } catch { setStatus("図を保存できませんでした。集計表のコピーをご利用ください。"); }
    finally { if (url) { const objectUrl = url; window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000); } }
  }
  return <div className={styles.tool}>
    <form className={styles.panel} onSubmit={event => { event.preventDefault(); calculate(); }}>
      <h2 ref={journey.inputRef}>分類と件数を貼り付ける</h2>
      <p>表計算ソフトの2列をコピーして貼り付けます。タブまたはカンマ区切り、最大30行。見出しは「分類・件数」の2列なら省略せず貼り付けられます。</p>
      <label htmlFor="pareto-input">分類・件数</label>
      <textarea id="pareto-input" value={input} rows={8} maxLength={12000} placeholder={paretoSample} aria-describedby="pareto-help pareto-error" aria-invalid={Boolean(error)} onChange={event => edit(event.target.value)} />
      <p id="pareto-help">分類名は40文字まで。件数は0〜10億の整数・桁区切りなし。カンマを含む分類名はタブ区切りにしてください。入力は端末内で処理し、保存・外部送信しません。</p>
      {sample && <p>教材用の架空例を表示しています。</p>}
      <div className={styles.actions}><Button variant="primary" type="submit">パレート図を作る</Button><Button onClick={() => { journey.sample(); invalidate(); setSample(true); setInput(paretoSample); setResult(calculatePareto(parsePareto(paretoSample))); }}>架空例を試す</Button><Button onClick={() => { journey.clear(); invalidate(); setInput(""); setSample(false); }}>入力をクリア</Button></div>
      <p id="pareto-error" role={error ? "alert" : undefined}>{error}</p>
    </form>
    {pending && <section className={styles.panel} aria-labelledby="pareto-merge">
      <h2 id="pareto-merge">同名の分類を合算しますか？</h2><p>名前の前後の空白を除いた、完全一致の分類をまとめます。二重に貼り付けていないか確認してください。</p>
      <ul>{pending.duplicates.map(row => <li key={row.label}>{row.label}：{row.occurrences}行 → 合計{row.count.toLocaleString("ja-JP")}件</li>)}</ul>
      <div className={styles.actions}><Button variant="primary" onClick={() => { setResult(calculatePareto(pending)); setPending(null); action("merge_confirmed"); }}>確認して合算する</Button><Button onClick={() => setPending(null)}>合算せず入力を見直す</Button></div>
    </section>}
    {result && <section className={styles.panel} aria-labelledby="pareto-result">
      <h2 id="pareto-result" ref={journey.resultRef}>不良分類の内訳{sample ? "（架空例）" : ""}</h2>
      <p>合計<strong>{result.total.toLocaleString("ja-JP")}件</strong>・{result.rows.length}分類。同じ件数は入力順で表示します。</p>
      {!result.total && <p role="status">合計0件のため、構成比と累積比率は算出できません。</p>}
      <figure><div className={styles.chart} tabIndex={0} role="region" aria-label="パレート図。横にスクロールできます" dangerouslySetInnerHTML={{ __html: paretoSvg(result, sample) }} /><figcaption>番号と分類名は下の集計表で確認できます。件数順は対策の優先順位を保証しません。</figcaption></figure>
      <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="分類別の集計表"><table><caption>入力件数の構成比（小数第1位へ丸め、累積比率は丸め前の件数から計算）</caption><thead><tr><th scope="col">番号</th><th scope="col">分類</th><th scope="col">件数</th><th scope="col">構成比</th><th scope="col">累積比率</th></tr></thead><tbody>{result.rows.map((row, i) => <tr key={row.label}><td>{i + 1}</td><th scope="row">{row.label}</th><td>{row.count.toLocaleString("ja-JP")}</td><td>{result.total ? paretoPercent(row.share) : "算出不可"}</td><td>{result.total ? paretoPercent(row.cumulative) : "算出不可"}</td></tr>)}</tbody></table></div>
      <div className={styles.actions}><Button onClick={copy} disabled={copying}>{copying ? "コピー中…" : "集計表をコピー"}</Button><Button onClick={save}>図を保存（SVG）</Button></div>
      <p role="status">{status}</p>{fallback && <label>手動コピー用<textarea readOnly value={fallback} rows={8} onFocus={event => event.currentTarget.select()} /></label>}
      <h3>次に確認すること</h3><ul>{paretoNotes.map(note => <li key={note}>{note}</li>)}</ul>
      <nav aria-label="次の調査"><TrackedInternalLink href="/tools/yield-dashboard" eventName="tool_result_related_click" eventProperties={{ tool_id: "defect-pareto", destination_tool: "yield-dashboard", locale: "ja", placement: "result" }}>製品・装置・履歴に分けて原因候補を調べる教材へ →</TrackedInternalLink><p>移動先は架空データの教材です。入力データは引き継ぎません。</p></nav>
    </section>}
  </div>;
}
