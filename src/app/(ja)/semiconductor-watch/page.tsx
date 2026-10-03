import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { NewsFeed } from "@/components/chip-pulse/NewsFeed";
import { MediaLink } from "@/components/chip-pulse/MediaLinks";
import { EarningsInternalLink } from "@/components/earnings/EarningsLinks";
import { media, latestArticles, editionArticles, newsDate, backgroundLinks } from "@/lib/chip-pulse-media";
import { siteUrl } from "@/lib/format";
import styles from "@/components/chip-pulse/Media.module.css";

const title = "Chip Pulse｜半導体ニュースを、工程と背景から読む";
const description = "半導体の公式発表を日本語で整理。設計・製造、メモリ、装置・材料、後工程の動きを、根拠と技術解説から理解するニュースメディア。";
export const metadata: Metadata = { title, description, alternates:{canonical:"/semiconductor-watch"}, openGraph:{title,description,url:"/semiconductor-watch",type:"website"} };

export default function SemiconductorWatchPage() {
 const highlights = editionArticles.slice(0,3);
 const week = latestArticles.filter(a => new Date(a.publishedAt).getTime() >= new Date(media.edition.end).getTime()-7*86400000 && new Date(a.publishedAt).getTime() < new Date(media.edition.end).getTime()).slice(0,3);
 return <main className={styles.page}><div className={styles.shell}>
  <StructuredData data={{"@context":"https://schema.org","@type":"CollectionPage",name:title,description,url:siteUrl+"/semiconductor-watch",dateModified:media.contentUpdatedAt}} />
  <header className={styles.masthead}><div><Link href="/semiconductor-watch" className={styles.brand}>Chip Pulse<span style={{color:"#77dfec"}}>.</span></Link><p>Manufacturing Compass / 半導体ニュース</p></div><div className={styles.issue}><strong>{newsDate(media.edition.date)} 朝刊</strong><span>内容更新 {newsDate(media.contentUpdatedAt,true)} JST</span></div></header>
  <div className={styles.intro}><p className={styles.eyebrow}>FROM NEWS TO UNDERSTANDING</p><h1>半導体の動きを、<br />自分の知識に。</h1><p>何が起きたか。どの工程に関係するか。<br />公式発表と技術の背景から、今日の業界を読み解く。</p></div>
  <nav className={styles.watchNav} aria-label="業界ウォッチの入口"><span aria-current="page">ニュース：何が起きたか</span><EarningsInternalLink href="/semiconductor-watch/earnings" destination="earnings_hub">決算・IR：業績への現れ方と会社の見通し →</EarningsInternalLink></nav>
  <section className={styles.brief} aria-labelledby="brief-title"><h2 id="brief-title">今日押さえること</h2><small>全体版 · 対象 {newsDate(media.edition.start,true)}〜{newsDate(media.edition.end,true)} JST</small>
   {highlights.length ? <ol>{highlights.map(a=><li key={a.id}><MediaLink href={`/semiconductor-watch/${a.id}`} articleId={a.id} action="article">{a.summary} <span aria-hidden="true">↗</span></MediaLink></li>)}</ol>:<p className={styles.empty}>この版の対象期間に掲載できる新着要約はありません。<br /><a href="#week">今週の背景から、業界の流れを確認する →</a></p>}
  </section>
  {media.status.state!=="success" ? <aside className={styles.warning}>{media.status.state==="not-run" ? "新しい収集処理の稼働前です。原文を再確認した記事を掲載しています。" : media.status.state==="partial" ? "一部の情報源を更新できませんでした。取得できた新着と、前回掲載した記事を表示しています。" : "今回の取得に失敗しました。前回の版と掲載内容を表示しています。"}</aside>:null}
  {highlights.length ? <section className={styles.section} id="important-news"><div className={styles.sectionHead}><h2>本日の注目</h2><span>全体版から {highlights.length}件</span></div><div className={styles.featured}>{highlights.map(a=><article className={styles.feature} key={a.id}><span className={styles.meta}>{newsDate(a.publishedAt)} · {a.sourceName}</span><h3><MediaLink href={`/semiconductor-watch/${a.id}`} articleId={a.id} action="article">{a.title}</MediaLink></h3><p>{a.summary}</p><MediaLink href={`/semiconductor-watch/${a.id}`} articleId={a.id} action="article">背景まで読む →</MediaLink></article>)}</div></section>:<div id="important-news" />}
  <section className={styles.section} aria-labelledby="latest-title"><div className={styles.sectionHead}><h2 id="latest-title">最新ニュース</h2><span>発表日の新しい順 · 当日版 {editionArticles.length}件</span></div><NewsFeed articles={latestArticles.slice(0,60)} updates={media.updates.slice(0,60)} /></section>
  <section className={styles.section} id="week"><div className={styles.sectionHead}><h2>今週の背景</h2><span>直近7日の記事と、理解を深める解説</span></div>
   {week.map(a=><article className={styles.official} key={a.id}><span className={styles.meta}>{newsDate(a.publishedAt)}</span><h3><MediaLink href={`/semiconductor-watch/${a.id}`} articleId={a.id} action="article">{a.title} →</MediaLink></h3></article>)}
   <div className={styles.background}>{Object.entries(backgroundLinks).map(([id,b])=><article key={id}><span className={styles.eyebrow}>背景を知る</span><h3><MediaLink href={b.href} articleId={id} action="background">{b.title} →</MediaLink></h3><p>{b.text}</p></article>)}</div>
  </section>
  <nav className={styles.footerLinks} aria-label="さらに調べる"><EarningsInternalLink href="/semiconductor-watch/earnings" destination="earnings_hub">装置メーカー5社の決算・IR ↗</EarningsInternalLink><Link href="/industry-map">半導体業界地図 ↗</Link><Link href="/guides/semiconductor-market-cap-ranking">企業規模を比較 ↗</Link><Link href="/companies">企業を調べる ↗</Link></nav>
  <details className={styles.fine}><summary>更新・出典について</summary><p>朝6時を区切りに公式情報を整理し、7時頃の更新を目指します。時刻は日本時間です。SEC資料の日時はSEC上での公表日時です。発表日しか分からない資料に時刻を補いません。自動要約は原文との照合を行いますが、重要な判断には出典もご確認ください。</p><p>取得確認：{media.status.checkedAt ? newsDate(media.status.checkedAt,true)+" JST" : "新処理の稼働前"} ／ AI要約：{media.status.ai==="success" ? "処理済み" : media.status.ai==="disabled" ? "停止中（公式リンクは更新）" : media.status.ai==="budget-stopped" ? "予算上限により停止" : "未完了（前回の記事を維持）"}</p></details>
 </div></main>;
}
