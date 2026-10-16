import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { NewsFeed } from "@/components/chip-pulse/NewsFeed";
import { MediaLink } from "@/components/chip-pulse/MediaLinks";
import { WatchSchedule } from "@/components/chip-pulse/WatchSchedule";
import { watchKindLabel } from "@/components/chip-pulse/WatchCard";
import { media, newsDate } from "@/lib/chip-pulse-media";
import { watchItems, recentWatchItems, watchUpdatedAt } from "@/lib/watch";
import { watchCalendar } from "@/lib/watch-calendar";
import { inWatchWindow, watchDate } from "@/lib/watch-types";
import { siteUrl } from "@/lib/format";
import styles from "@/components/chip-pulse/Media.module.css";

const title = "半導体業界ウォッチ｜最新ニュース・決算と発表予定";
const description = "半導体の公式発表を、企業・工程・背景から読み解く。AI・メモリ、装置・材料、設計・製造、後工程、工場投資の動きから、気になるテーマを深掘りできます。";
export const metadata: Metadata = { title, description, alternates: { canonical: "/semiconductor-watch" }, openGraph: { title, description, url: "/semiconductor-watch", type: "website" } };
// Keep relative freshness honest even when collection or editing has stopped.
export const revalidate = 3600;

export default function SemiconductorWatchPage() {
  const now = new Date().toISOString();
  const highlights = recentWatchItems(watchItems, now, 7).filter(item => !item.changed).slice(0, 3);
  const staleCollection = !media.status.checkedAt || !inWatchWindow(media.status.checkedAt, now, 2);
  const unreviewed = media.updates.filter(update => !watchCalendar.reviews.some(review => review.id === update.id && review.sourceUrl === update.sourceUrl && review.status !== "recheck")).length;
  return <main className={styles.page}><div className={styles.shell}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url: siteUrl + "/semiconductor-watch", dateModified: watchUpdatedAt }} />
    <header className={styles.masthead}><Link href="/semiconductor-watch" className={styles.brand}>Chip Pulse<span> / 業界ウォッチ</span></Link><MediaLink href="/semiconductor-watch/earnings" articleId="watch" action="background" destination="earnings" placement="navigation">決算・IRを読み比べる →</MediaLink></header>
    <section className={styles.intro} aria-labelledby="watch-title">
      <div className={styles.introHeading}><div><p className={styles.eyebrow}>MANUFACTURING COMPASS</p><h1 id="watch-title">半導体業界ウォッチ</h1><p>最近の変化と、次の発表を短時間で。</p></div><div className={styles.issue}><span>掲載内容・日程の更新</span><strong>{watchDate(watchUpdatedAt)}</strong><span>公表日と確認日を分けて表示</span></div></div>
      <p className={styles.collection}>候補収集：{media.status.checkedAt ? `${newsDate(media.status.checkedAt, true)} JST` : "未実施"} · 原文確認待ち {unreviewed}件</p>
      {media.status.state !== "success" || staleCollection ? <p className={styles.warning}>{media.status.state === "partial" ? "一部の取得先を更新できませんでした。" : media.status.state === "failed" ? "直近の収集に失敗しました。" : staleCollection ? "収集確認から2日以上経過しています。" : "収集処理の稼働前です。"} 前回確認済みの内容を表示しています。</p> : null}
    </section>
    <section className={styles.section} aria-labelledby="featured-title"><div className={styles.sectionHead}><div><p className={styles.eyebrow}>RECENT CHANGES</p><h2 id="featured-title">直近7日の主な動き</h2></div><MediaLink href="/semiconductor-watch/earnings" articleId="watch" action="background" destination="earnings" placement="navigation">12社の決算一覧 →</MediaLink></div>
      {highlights.length ? <ul className={styles.dailyRows}>{highlights.map(item => <li key={item.id} id={`signal-${item.id.replace(/^[^:]+:/, "")}`}><div className={styles.rowMeta}><span className={styles.kind}>{watchKindLabel[item.kind]}</span><time dateTime={item.date}>{watchDate(item.date)}</time><span>{item.companyNames.join("・")}</span></div><h3><MediaLink href={item.href} articleId={item.id} action="article" destination={item.kind} placement="featured">{item.title} →</MediaLink></h3><p>{item.summary}</p><small className={styles.status}>{item.status}</small></li>)}</ul> : <p className={styles.empty}>直近7日に掲載できる新しい動きはありません。次の発表予定と掲載中の決算をご覧ください。</p>}
    </section>
    <WatchSchedule now={now} />
    <NewsFeed items={watchItems} now={now} excludeIds={highlights.map(item => item.id)} />
    <section className={styles.section} aria-labelledby="official-title"><h2 id="official-title">公式発表も確認する</h2><p>本文の要約を掲載していない開示です。内容は原文で確認できます。</p><details className={styles.disclosure}><summary>公式発表のリンク（{media.updates.length}件）</summary><ul className={styles.officialList}>{media.updates.map(update => {
      const review = watchCalendar.reviews.find(entry => entry.id === update.id && entry.sourceUrl === update.sourceUrl);
      const destination = review?.href ? { href: review.href, label: "関連する掲載内容", destination: "earnings" as const } : undefined;
      return <li id={`signal-${update.id}`} key={update.id}><span className={styles.fine}>SEC公表 {newsDate(update.publishedAt)} · {review?.status === "linked" ? "掲載済みの情報へ接続" : review?.status === "skipped" ? "掲載対象外" : "原文確認待ち"}</span><MediaLink href={update.sourceUrl} articleId={update.id} action="source" placement="official">{update.title} ↗</MediaLink>{destination ? <MediaLink href={destination.href} articleId={update.id} action="article" destination={destination.destination} placement="official">{destination.label} →</MediaLink> : null}</li>;
    })}</ul></details></section>
    <details className={styles.disclosure}><summary>更新・出典について</summary><p>公式情報の候補を毎日収集し、原文・数値・対象期間を確認できた内容を掲載します。収集の成功だけでは記事や決算の確認完了とは扱いません。新しい記事がない日もあります。出典の公表、掲載、内容更新、収集確認の日付を分けて表示します。</p><p>SEC公表日時はSEC上の受理日時で、企業発表や出来事そのものの日時とは異なります。時刻不明の資料に時刻を補いません。工場の実績と計画、決算の実績と会社見通しも区別します。</p><p>自動要約：{media.status.ai === "disabled" ? "停止中。原資料を確認した記事を編集して掲載しています。" : "処理状況と記事ごとの確認方法は、出典欄をご覧ください。"}</p></details>
  </div></main>;
}
