"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Controls";
import { jobNoteItems, jobNoteStatuses, jobNoteCaution, type JobNoteAnswers, type JobNoteId } from "@/data/job-posting-note";
import { createJobComparison, createJobNote, isJobNoteStatus } from "@/lib/job-posting-note";
import { trackEvent } from "@/lib/analytics";
import { observeVisibleOnce } from "@/lib/observe-visible";
import styles from "./JobPostingNote.module.css";

type NoteMode = "single" | "compare";
function track(action: "view" | "start" | "result" | "copy_success" | "copy_fallback" | "reset", mode: NoteMode = "single") {
  try { trackEvent(mode === "single" ? "job_posting_note" : "job_posting_comparison", { action, ui_version: mode === "single" ? "note-v1" : "compare-v1" }); } catch { /* Keep local note creation available. */ }
}
export function JobPostingNote() {
  const [mode, setMode] = useState<NoteMode>("single");
  const [answersB, setAnswersB] = useState<JobNoteAnswers>({});
  const [comparison, setComparison] = useState<ReturnType<typeof createJobComparison>>(null);
  const [answers, setAnswers] = useState<JobNoteAnswers>({});
  const [result, setResult] = useState<ReturnType<typeof createJobNote>>(null);
  const [status, setStatus] = useState("");
  const [copying, setCopying] = useState(false);
  const revision = useRef(0), busy = useRef(false), seen = useRef(new Set<string>());
  const entryRef = useRef<HTMLParagraphElement>(null), resultRef = useRef<HTMLHeadingElement>(null);
  const output = mode === "single" ? result : comparison;
  useEffect(() => {
    if (!entryRef.current || seen.current.has(`${mode}:view`)) return;
    return observeVisibleOnce(entryRef.current, () => { seen.current.add(`${mode}:view`); track("view", mode); });
  }, [mode]);
  useEffect(() => {
    if (!output || !resultRef.current || seen.current.has(`${mode}:result`)) return;
    return observeVisibleOnce(resultRef.current, () => { seen.current.add(`${mode}:result`); track("result", mode); });
  }, [output, mode]);
  function change(id: JobNoteId, value: string, side: "a" | "b" = "a") {
    if (!isJobNoteStatus(value)) return;
    if (!seen.current.has(`${mode}:start`)) { seen.current.add(`${mode}:start`); track("start", mode); }
    revision.current++; (side === "a" ? setAnswers : setAnswersB)(current => ({ ...current, [id]: value })); setResult(null); setComparison(null); setStatus("");
  }
  async function copy() {
    if (!output || busy.current) return;
    busy.current = true; setCopying(true); setStatus("");
    const version = revision.current;
    try { await navigator.clipboard.writeText(output.text); if (revision.current === version) setStatus("コピーしました。手元のメモに貼り付けられます。"); track("copy_success", mode); }
    catch { if (revision.current === version) setStatus("自動コピーできませんでした。下のノートを選択してコピーしてください。"); track("copy_fallback", mode); }
    finally { busy.current = false; setCopying(false); }
  }
  const reviewed = jobNoteItems.filter(item => answers[item.id] && answers[item.id] !== "unread").length;
  const reviewedB = jobNoteItems.filter(item => answersB[item.id] && answersB[item.id] !== "unread").length;
  function switchMode(next: NoteMode) {
    if (next === mode) return;
    revision.current++; setMode(next); setResult(null); setComparison(null); setStatus("");
  }
  return <div className={styles.note}>
    <div className={styles.actions} role="group" aria-label="確認する求人票の数">
      <Button aria-pressed={mode === "single"} onClick={() => switchMode("single")}>1件を確認</Button>
      <Button aria-pressed={mode === "compare"} onClick={() => switchMode("compare")}>2件を並べて確認</Button>
    </div>
    <p ref={entryRef}>求人票を手元で見ながら、8項目の記載状況を選びます。全部読めていなくても、途中までのノートを作れます。</p>
    <p>会社名・求人本文・経歴の入力は不要です。回答は保存されず、ページを離れると消えます。</p>
    {mode === "compare" && <p>求人A・求人Bの記載状況を項目ごとに並べます。各求人で1項目以上選ぶと比較ノートを作れます。待遇の差や求人の優劣は判定しません。モードを切り替えても選択は保持します。</p>}
    <form onSubmit={event => {
      event.preventDefault(); revision.current++; setStatus("");
      if (mode === "single") setResult(createJobNote(answers));
      else setComparison(createJobComparison(answers, answersB));
    }}>
      <div className={mode === "compare" ? styles.comparisonFields : styles.fields}>{jobNoteItems.map((item, index) => <div className={styles.field} key={item.id}>
        <p id={`job-note-${item.id}-help`}><strong>{index + 1}. {item.title}</strong><br />{item.help}</p>
        <div className={mode === "compare" ? styles.pair : undefined}>{(mode === "compare" ? ["a", "b"] as const : ["a"] as const).map(side => {
          const id = side === "a" ? `job-note-${item.id}` : `job-note-b-${item.id}`;
          return <div key={side}>
            <label htmlFor={id}>{mode === "compare" ? `求人${side === "a" ? "A" : "B"}：${item.title}` : item.title}</label>
            <select id={id} value={(side === "a" ? answers : answersB)[item.id] ?? "unread"} aria-describedby={`job-note-${item.id}-help`} onChange={event => change(item.id, event.target.value, side)}>
              {jobNoteStatuses.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </div>;
        })}</div>
      </div>)}</div>
      <p role="status">記載状況を選んだ項目：{mode === "compare" ? `求人A ${reviewed}/${jobNoteItems.length}・求人B ${reviewedB}/${jobNoteItems.length}` : `${reviewed}/${jobNoteItems.length}`}</p>
      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={!reviewed || (mode === "compare" && !reviewedB)}>{mode === "compare" ? "2件の比較ノートを作る" : "確認ノートを作る"}</Button>
        <Button disabled={!reviewed && !reviewedB && !output} onClick={() => { revision.current++; setAnswers({}); setAnswersB({}); setResult(null); setComparison(null); setStatus(""); track("reset", mode); }}>選択をクリア</Button>
      </div>
      <p className={styles.help}>「選択をクリア」は求人A・Bの両方を消去します。</p>
    </form>
    {output && <section className={styles.result} aria-labelledby="job-note-result">
      <h3 id="job-note-result" ref={resultRef}>応募前に確認したいこと</h3>
      {mode === "compare" && comparison ? <>
        <p>求人A・Bは手元の求人票と対応させてください。同じ記載状況でも、条件が同じとは限りません。</p>
        <div className={styles.comparisonFields}>{comparison.rows.map(row => <section className={styles.field} key={row.id}>
          <h4>{row.title}</h4>
          <div className={styles.pair}>{(["a", "b"] as const).map(side => <div key={side}>
            <strong>求人{side === "a" ? "A" : "B"}</strong>
            <p>{jobNoteStatuses.find(item => item.id === row[side])?.label}</p>
            {(row[side] === "missing" || row[side] === "unclear") && <p>確認したいこと：{row.question}</p>}
          </div>)}</div>
        </section>)}</div>
        <p>まだ読んでいない項目は未読のまま残しています。コピー後、A・Bがどの求人か自分用に追記できます。</p>
      </> : result && <>
        {result.questions.length ? <ul>{result.questions.map(item => <li key={item.id}><strong>{item.title}</strong>（{item.status === "missing" ? "記載が見つからない" : "意味が曖昧"}）<p>{item.question}</p></li>)}</ul> : <p>今回の選択から追加された質問はありません。まだ読んでいない項目があれば、引き続き確認できます。</p>}
        <p>まだ読んでいない項目：{result.unread.length ? result.unread.map(item => item.title).join("、") : "なし"}</p>
      </>}
      <p>{jobNoteCaution}</p>
      <Button onClick={copy} disabled={copying}>{copying ? "コピー中…" : "確認ノートをコピー"}</Button>
      <p role="status">{status}</p>
      <label htmlFor="job-note-copy">持ち帰り用ノート（手動でもコピーできます）</label>
      <textarea id="job-note-copy" readOnly rows={12} value={output.text} onFocus={event => event.currentTarget.select()} />
      <a href="#consultation-template-title">経験・希望条件も相談メモに整理する ↓</a>
    </section>}
  </div>;
}
