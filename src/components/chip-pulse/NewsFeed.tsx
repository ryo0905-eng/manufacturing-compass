"use client";
import { useEffect, useState, type ReactNode } from "react";
import { MediaLink } from "./MediaLinks";
import { inWatchWindow, readWatchHash, watchDate, watchTopics, type WatchItem, type WatchTopic } from "@/lib/watch-types";
import { watchKindLabel } from "./WatchCard";
import { trackEvent } from "@/lib/analytics";
import styles from "./Media.module.css";

export function NewsFeed({ items, now, children }: { items: WatchItem[]; now: string; children: ReactNode }) {
  const [topic, setTopic] = useState<WatchTopic | "all">("all");
  useEffect(() => {
    const restore = () => setTopic(readWatchHash(window.location.hash));
    restore();
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => { window.removeEventListener("hashchange", restore); window.removeEventListener("popstate", restore); };
  }, []);
  const filtered = items.filter(item => topic === "all" || item.topics.includes(topic));
  function select(next: WatchTopic | "all") {
    setTopic(next);
    window.history.pushState(null, "", next === "all" ? "#explore" : `#theme=${next}`);
    trackEvent("chip_pulse_filter_change", { dimension: "theme", value: next, result_count: items.filter(item => next === "all" || item.topics.includes(next)).length, ui_version: "topics-v1" });
  }
  return <>
    <nav className={styles.topicNav} aria-label="興味のあるテーマを選ぶ">
      <button type="button" aria-label="すべて" aria-controls="explore" aria-pressed={topic === "all"} onClick={() => select("all")}>すべて</button>
      {watchTopics.map(t => <button key={t.id} type="button" aria-label={t.label} aria-controls="explore" aria-pressed={topic === t.id} onClick={() => select(t.id)}>{t.label}</button>)}
    </nav>
    <p className={styles.filterHelp}>テーマを選ぶと「テーマから探す」の内容が切り替わります。注目記事は全体共通です。</p>
    <noscript><p className={styles.filterHelp}>JavaScriptが無効のため全テーマを表示しています。各記事・解説はそのまま読めます。</p></noscript>
    {children}
    <section className={styles.section} id="explore" aria-labelledby="explore-title">
      <div className={styles.sectionHead}><div><p className={styles.eyebrow}>EXPLORE THE INDUSTRY</p><h2 id="explore-title">テーマから探す</h2></div><p aria-live="polite">{topic === "all" ? "すべて" : watchTopics.find(t => t.id === topic)?.label} · {filtered.length}件</p></div>
      <div className={styles.topicSections}>{watchTopics.filter(t => topic === "all" || t.id === topic).map(t => {
        const entries = filtered.filter(item => topic === "all" ? item.primaryTopic === t.id : item.topics.includes(t.id)).sort((a,b) => Date.parse(b.date)-Date.parse(a.date) || a.id.localeCompare(b.id));
        const hasRecentNews = entries.some(item => item.kind === "article" && !item.changed && inWatchWindow(item.date, now));
        return <section className={styles.topicSection} key={t.id} aria-labelledby={`topic-${t.id}`}>
          <header><h3 id={`topic-${t.id}`}>{t.label}</h3><p>{t.description}</p></header>
          {!hasRecentNews ? <p className={styles.empty}>直近30日のニュース掲載はありません。確認日付きの情報と背景解説から調べられます。</p> : null}
          <ul className={styles.rows}>{entries.map(item => <li key={item.id} id={`signal-${item.id.replace(/^[^:]+:/, "")}`}>
            <div className={styles.rowMeta}><span className={styles.kind}>{watchKindLabel[item.kind]}</span><span>{item.dateLabel} <time dateTime={item.date}>{watchDate(item.date)}</time></span></div>
            <h4><MediaLink href={item.href} articleId={item.id} action="article" destination={item.kind} placement="explore">{item.title}<span aria-hidden="true"> →</span></MediaLink></h4>
            <p>{item.summary}</p><span className={styles.status}>{item.status}</span>
            {item.changed ? <p className={styles.warning}>出典に変更あり。前回確認時の要約です。</p> : null}
          </li>)}</ul>
          <MediaLink className={styles.backgroundLink} href={t.href} articleId={`topic:${t.id}`} action="background" placement="explore" destination="guide"><small>背景を知る</small>{t.linkLabel} <span aria-hidden="true">→</span></MediaLink>
        </section>;
      })}</div>
    </section>
  </>;
}
