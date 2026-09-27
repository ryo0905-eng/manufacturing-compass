"use client";
import { useState } from "react";
import { NewsThumbnail } from "./NewsThumbnail";
import { MediaLink } from "./MediaLinks";
import { newsFields, newsDate, type NewsArticle, type NewsUpdate } from "@/lib/chip-pulse-media";
import { trackEvent } from "@/lib/analytics";
import styles from "./Media.module.css";
export function NewsFeed({ articles, updates }: { articles: NewsArticle[]; updates: NewsUpdate[] }) {
 const [field,setField] = useState<keyof typeof newsFields>("all");
 const visible = articles.filter(article => field === "all" || article.fields.includes(field));
 return <>
  <div className={styles.tabs} role="group" aria-label="最新ニュースの分野">
   {Object.entries(newsFields).map(([id,label]) => <button key={id} type="button" aria-pressed={field===id} onClick={() => { setField(id as keyof typeof newsFields); trackEvent("chip_pulse_filter_change",{dimension:"field",value:id}); }}>{label}</button>)}
  </div>
  <p className={styles.fine} aria-live="polite">{newsFields[field]}：{visible.length}件。絞り込みはこの一覧のみが対象です。</p>
  <ul className={styles.rows}>{visible.map(article => <li className={styles.row} id={`signal-${article.id}`} key={article.id}>
    <div className={styles.rowBody}>
      <div className={styles.rowText}><div className={styles.meta}><time dateTime={article.publishedAt}>{newsDate(article.publishedAt)}</time> · {article.sourceName} {article.version>1 ? "· 更新あり" : ""}</div>
      <h3><MediaLink href={`/semiconductor-watch/${article.id}`} articleId={article.id} action="article">{article.title}</MediaLink></h3></div>
      <p>{article.summary}{article.sourceCheck==="changed" ? "（出典に変更あり・再確認待ち）" : ""}</p>
      <div className={styles.tags}>{article.fields.map(f => <span key={f}>{newsFields[f as keyof typeof newsFields]}</span>)}</div>
      <MediaLink className={styles.read} href={`/semiconductor-watch/${article.id}`} articleId={article.id} action="article">事実と背景を読む →</MediaLink>
    </div>
    <div className={styles.thumb}><NewsThumbnail signal={article} /></div>
  </li>)}</ul>
  {!visible.length ? <p className={styles.empty}>この分野の編集済みニュースはありません。「すべて」で他のニュースを確認できます。</p>:null}
  {field === "all" && updates.length>0 ? <section className={styles.section}><h2>公式発表のリンク</h2><p className={styles.fine}>本文の要約は未掲載です。発表内容は原文をご確認ください。</p>{updates.map(update => <article className={styles.official} id={`signal-${update.id}`} key={update.id}><div className={styles.meta}>{newsDate(update.publishedAt)} · {update.sourceName}</div><h3><MediaLink href={update.sourceUrl} articleId={update.id} action="source">{update.title} ↗</MediaLink></h3></article>)}</section>:null}
  {field !== "all" && updates.length>0 ? <p className={styles.fine}>未分類の公式発表 {updates.length}件は「すべて」に掲載しています。</p>:null}
 </>;
}
