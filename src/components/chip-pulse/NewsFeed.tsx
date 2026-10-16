"use client";
import { useEffect, useState, type ReactNode } from "react";
import { MediaLink } from "./MediaLinks";
import { inWatchWindow, readWatchHash, watchDate, watchTopics, type WatchItem, type WatchTopic } from "@/lib/watch-types";
import { watchKindLabel } from "./WatchCard";
import { trackEvent } from "@/lib/analytics";
import styles from "./Media.module.css";

export function NewsFeed({ items, now, children, excludeIds = [] }: { items: WatchItem[]; now: string; children?: ReactNode; excludeIds?: string[] }) {
  const [topic, setTopic] = useState<WatchTopic | "all">("all");
  useEffect(() => {
    const restore = () => setTopic(readWatchHash(window.location.hash));
    restore();
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => { window.removeEventListener("hashchange", restore); window.removeEventListener("popstate", restore); };
  }, []);
  const recent = items.filter(item => item.kind !== "factory" && inWatchWindow(item.date, now) && !excludeIds.includes(item.id));
  const filtered = recent.filter(item => topic === "all" || item.topics.includes(topic)).sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.id.localeCompare(b.id));
  const archive = items.filter(item => !excludeIds.includes(item.id) && !recent.some(entry => entry.id === item.id));
  function select(next: WatchTopic | "all") {
    setTopic(next);
    window.history.pushState(null, "", next === "all" ? "#explore" : `#theme=${next}`);
    trackEvent("chip_pulse_filter_change", { dimension: "theme", value: next, result_count: recent.filter(item => next === "all" || item.topics.includes(next)).length, ui_version: "daily-v1" });
  }
  return <>
    {children}
    <section className={styles.section} id="explore" aria-labelledby="explore-title">
      <div className={styles.sectionHead}><h2 id="explore-title">直近30日の動き</h2><p aria-live="polite">{topic === "all" ? "すべて" : watchTopics.find(item => item.id === topic)?.label} · {filtered.length}件</p></div>
      <nav className={styles.topicNav} aria-label="興味のあるテーマを選ぶ">
        <button type="button" aria-controls="recent-updates" aria-pressed={topic === "all"} onClick={() => select("all")}>すべて</button>
        {watchTopics.map(item => <button key={item.id} type="button" aria-controls="recent-updates" aria-pressed={topic === item.id} onClick={() => select(item.id)}>{item.label}</button>)}
      </nav>
      <p className={styles.filterHelp}>冒頭に掲載した主な動きは除いています。テーマを選ぶと、この一覧が切り替わります。</p>
      <noscript><p className={styles.filterHelp}>全テーマを表示しています。各記事・原資料はそのまま読めます。</p></noscript>
      <div id="recent-updates">{filtered.length ? <ul className={styles.dailyRows}>{filtered.map(item => <li key={item.id} id={`signal-${item.id.replace(/^[^:]+:/, "")}`}>
        <div className={styles.rowMeta}><span className={styles.kind}>{watchKindLabel[item.kind]}</span><span>{item.dateLabel} <time dateTime={item.date}>{watchDate(item.date)}</time></span><span>{item.companyNames.join("・")}</span></div>
        <h3><MediaLink href={item.href} articleId={item.id} action="article" destination={item.kind} placement="explore">{item.title} →</MediaLink></h3>
        <p>{item.summary}</p><small className={styles.status}>{item.status}</small>
        {item.changed ? <p className={styles.warning}>出典に変更あり。前回確認時の要約です。</p> : null}
      </li>)}</ul> : <p className={styles.empty}>直近30日に、この一覧へ追加できる掲載情報はありません。冒頭の主な動きと、下の背景解説もご覧ください。</p>}</div>
    </section>
    <section className={styles.section} aria-labelledby="background-title"><div className={styles.sectionHead}><h2 id="background-title">テーマの背景を知る</h2></div><div className={styles.topicSections}>{watchTopics.map(item => <article className={styles.topicSection} key={item.id}><header><h3>{item.label}</h3><p>{item.description}</p></header><MediaLink className={styles.backgroundLink} href={item.href} articleId={`topic:${item.id}`} action="background" destination="guide" placement="explore">{item.linkLabel} →</MediaLink>{item.id === "investment" ? <p className={styles.fine}>工場の計画・実績は、確認日付きの工場一覧で確認できます。</p> : null}</article>)}</div></section>
    {archive.length ? <section className={styles.section} aria-labelledby="archive-title"><h2 id="archive-title">過去の掲載と継続調査</h2><p className={styles.fine}>30日より前の発表と、確認日付きの工場情報。新着とは区別しています。</p><ul className={styles.changeList}>{archive.map(item => <li key={item.id} id={`signal-${item.id.replace(/^[^:]+:/, "")}`}><time dateTime={item.date}>{watchDate(item.date)}</time><MediaLink href={item.href} articleId={item.id} action="article" destination={item.kind} placement="updates">{item.title} →</MediaLink></li>)}</ul></section> : null}
  </>;
}
