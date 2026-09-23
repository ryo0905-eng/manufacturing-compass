"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { ImprovementReportPreview } from "@/components/ImprovementReportPreview";
import { reportFields, reportNotesErrors, type ReportNotes } from "@/data/improvement-report";
import type { Comparison } from "@/lib/process-comparison";
import { trackEvent } from "@/lib/analytics";
import styles from "./ImprovementReport.module.css";
export function reportAction(action: "open_editor" | "print_requested" | "feedback_click") {
  try { trackEvent("improvement_report_action", { tool_id: "improvement-report", action, locale: "ja" }); } catch { /* Keep local work usable. */ }
}
export function ImprovementReportEditor({ result, notes, onChange, needsReview, resultRef }: { result: Comparison | null; notes: ReportNotes; onChange: (notes: ReportNotes) => void; needsReview: boolean; resultRef?: RefObject<HTMLHeadingElement | null> }) {
  const [mounted, setMounted] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [status, setStatus] = useState("");
  const [requested, setRequested] = useState(false);
  const valid = !!result && reportNotesErrors(notes).length === 0;
  const revision = useRef(0);
  const lock = useRef(false);
  useEffect(() => { setMounted(true); return () => { document.body.removeAttribute("data-improvement-print"); }; }, []);
  useEffect(() => { revision.current++; setStatus(""); }, [result, notes]);
  useEffect(() => {
    if (!valid) return;
    const before = () => document.body.setAttribute("data-improvement-print", "true");
    const after = () => document.body.removeAttribute("data-improvement-print");
    window.addEventListener("beforeprint", before); window.addEventListener("afterprint", after);
    return () => { window.removeEventListener("beforeprint", before); window.removeEventListener("afterprint", after); after(); };
  }, [valid]);
  async function print() {
    if (!valid || lock.current) return;
    lock.current = true; setPrinting(true); setStatus("");
    const version = revision.current;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const root = document.getElementById("improvement-report-print-root");
      if (!root) throw new Error("印刷画面の準備ができていません。");
      await Promise.race([
        Promise.all(Array.from(root.querySelectorAll("img")).map(img => img.decode())).then(() => document.fonts.ready),
        new Promise((_, reject) => timeout = setTimeout(() => reject(new Error("画像の読み込みが完了しませんでした。再度お試しください。")), 10000)),
      ]);
      if (version !== revision.current) throw new Error("内容が変更されました。プレビューを確認して再度印刷してください。");
      document.body.setAttribute("data-improvement-print", "true");
      reportAction("print_requested"); setRequested(true); window.print();
      setStatus("印刷画面でPDF保存または印刷を選択してください。保存完了はこのサイトから確認できません。");
    } catch (cause) { setStatus(cause instanceof Error ? cause.message : "印刷を準備できませんでした。再度お試しください。"); }
    finally { clearTimeout(timeout); document.body.removeAttribute("data-improvement-print"); lock.current = false; setPrinting(false); }
  }
  return <section className={styles.editor} aria-labelledby="report-editor-title">
    <h2 id="report-editor-title">報告内容を編集</h2><p>本人の記述と計算から作る観察文を区別します。未記入の項目は「未記入」と表示します。</p>
    {needsReview && <p role="status">データを変更しています。再計算後、以前の考察・未確認事項・次の行動が今回の数値に合うか確認してください。</p>}
    <div className={styles.fields}>{(Object.keys(reportFields) as (keyof ReportNotes)[]).map(key => {
      const field = reportFields[key], remaining = field.limit - Array.from(notes[key]).length;
      return <label className={styles.field} key={key}><span>{field.label}</span>{key === "reportDate" ? <input type="date" value={notes[key]} onChange={event => onChange({ ...notes, [key]: event.target.value })} /> : <textarea rows={key === "reportTitle" ? 2 : 3} value={notes[key]} aria-invalid={remaining < 0} onChange={event => onChange({ ...notes, [key]: event.target.value })} />}<small>{remaining >= 0 ? `残り${remaining}文字` : `${-remaining}文字超過。短くすると印刷・保存できます。`}</small></label>;
    })}</div>
    {reportNotesErrors(notes).length > 0 && <ul role="alert">{reportNotesErrors(notes).map(error => <li key={error}>{error}</li>)}</ul>}
    {result ? <><h3 ref={resultRef}>レポートのプレビュー</h3><ImprovementReportPreview result={result} notes={notes} /></> : <p>比較を再計算すると、印刷できるレポートが表示されます。</p>}
    <div className={styles.actions}><button type="button" disabled={!valid || printing} onClick={print}>{printing ? "印刷準備中…" : "印刷・PDF保存"}</button></div>
    <p>A4縦・余白12mm。ブラウザのヘッダー・フッターをオフにすると読みやすくなります。長い記述は複数ページになります。</p><p role="status">{status}</p>
    {requested && <a href="/contact" onClick={() => reportAction("feedback_click")}>社内報告で使いにくかった点を教える →</a>}
    {mounted && valid && result && createPortal(<div id="improvement-report-print-root" className={styles.printRoot}><ImprovementReportPreview result={result} notes={notes} /></div>, document.body)}
  </section>;
}
