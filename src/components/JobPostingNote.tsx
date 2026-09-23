"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Controls";
import { jobNoteItems, jobNoteStatuses, jobNoteCaution, type JobNoteAnswers, type JobNoteId } from "@/data/job-posting-note";
import { createJobNote, isJobNoteStatus } from "@/lib/job-posting-note";
import { trackEvent } from "@/lib/analytics";
import { observeVisibleOnce } from "@/lib/observe-visible";
import styles from "./JobPostingNote.module.css";

function track(action: "view" | "start" | "result" | "copy_success" | "copy_fallback" | "reset") {
  try { trackEvent("job_posting_note", { action, ui_version: "note-v1" }); } catch { /* Keep local note creation available. */ }
}
export function JobPostingNote() {
  const [answers, setAnswers] = useState<JobNoteAnswers>({});
  const [result, setResult] = useState<ReturnType<typeof createJobNote>>(null);
  const [status, setStatus] = useState("");
  const [copying, setCopying] = useState(false);
  const revision = useRef(0), busy = useRef(false), seen = useRef(new Set<string>());
  const entryRef = useRef<HTMLParagraphElement>(null), resultRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!entryRef.current || seen.current.has("view")) return;
    return observeVisibleOnce(entryRef.current, () => { seen.current.add("view"); track("view"); });
  }, []);
  useEffect(() => {
    if (!result || !resultRef.current || seen.current.has("result")) return;
    return observeVisibleOnce(resultRef.current, () => { seen.current.add("result"); track("result"); });
  }, [result]);
  function change(id: JobNoteId, value: string) {
    if (!isJobNoteStatus(value)) return;
    if (!seen.current.has("start")) { seen.current.add("start"); track("start"); }
    revision.current++; setAnswers(current => ({ ...current, [id]: value })); setResult(null); setStatus("");
  }
  async function copy() {
    if (!result || busy.current) return;
    busy.current = true; setCopying(true); setStatus("");
    const version = revision.current;
    try { await navigator.clipboard.writeText(result.text); if (revision.current === version) setStatus("コピーしました。手元のメモに貼り付けられます。"); track("copy_success"); }
    catch { if (revision.current === version) setStatus("自動コピーできませんでした。下のノートを選択してコピーしてください。"); track("copy_fallback"); }
    finally { busy.current = false; setCopying(false); }
  }
  const reviewed = jobNoteItems.filter(item => answers[item.id] && answers[item.id] !== "unread").length;
  return <div className={styles.note}>
    <p ref={entryRef}>求人票を手元で見ながら、8項目の記載状況を選びます。全部読めていなくても、途中までのノートを作れます。</p>
    <p>会社名・求人本文・経歴の入力は不要です。回答は保存されず、ページを離れると消えます。</p>
    <form onSubmit={event => { event.preventDefault(); revision.current++; setStatus(""); setResult(createJobNote(answers)); }}>
      <div className={styles.fields}>{jobNoteItems.map((item, index) => <div className={styles.field} key={item.id}>
        <label htmlFor={`job-note-${item.id}`}>{index + 1}. {item.title}</label><p id={`job-note-${item.id}-help`}>{item.help}</p>
        <select id={`job-note-${item.id}`} value={answers[item.id] ?? "unread"} aria-describedby={`job-note-${item.id}-help`} onChange={event => change(item.id, event.target.value)}>
          {jobNoteStatuses.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
      </div>)}</div>
      <p role="status">記載状況を選んだ項目：{reviewed}/{jobNoteItems.length}</p>
      <div className={styles.actions}><Button type="submit" variant="primary" disabled={!reviewed}>確認ノートを作る</Button><Button disabled={!reviewed && !result} onClick={() => { revision.current++; setAnswers({}); setResult(null); setStatus(""); track("reset"); }}>選択をクリア</Button></div>
    </form>
    {result && <section className={styles.result} aria-labelledby="job-note-result">
      <h3 id="job-note-result" ref={resultRef}>応募前に確認したいこと</h3>
      {result.questions.length ? <ul>{result.questions.map(item => <li key={item.id}><strong>{item.title}</strong>（{item.status === "missing" ? "記載が見つからない" : "意味が曖昧"}）<p>{item.question}</p></li>)}</ul> : <p>今回の選択から追加された質問はありません。まだ読んでいない項目があれば、引き続き確認できます。</p>}
      <p>{jobNoteCaution}</p>
      <p>まだ読んでいない項目：{result.unread.length ? result.unread.map(item => item.title).join("、") : "なし"}</p>
      <Button onClick={copy} disabled={copying}>{copying ? "コピー中…" : "確認ノートをコピー"}</Button>
      <p role="status">{status}</p>
      <label htmlFor="job-note-copy">持ち帰り用ノート（手動でもコピーできます）</label>
      <textarea id="job-note-copy" readOnly rows={12} value={result.text} onFocus={event => event.currentTarget.select()} />
      <a href="#consultation-template-title">経験・希望条件も相談メモに整理する ↓</a>
    </section>}
  </div>;
}
