import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { NewsFeed } from "@/components/chip-pulse/NewsFeed";
import { MediaLink } from "@/components/chip-pulse/MediaLinks";
import { WatchCard, watchKindLabel } from "@/components/chip-pulse/WatchCard";
import { media, newsDate } from "@/lib/chip-pulse-media";
import { watchItems, watchHighlights, watchChanges, watchUpdatedAt, watchEditorial } from "@/lib/watch";
import { inWatchWindow, watchDate } from "@/lib/watch-types";
import { siteUrl } from "@/lib/format";
import styles from "@/components/chip-pulse/Media.module.css";

const title = "半導体業界ウォッチ｜ニュース・決算・工場投資からつながりを知る";
const description = "半導体の公式発表を、企業・工程・背景から読み解く。AI・メモリ、装置・材料、設計・製造、後工程、工場投資の動きから、気になるテーマを深掘りできます。";
export const metadata: Metadata = { title, description, alternates: { canonical: "/semiconductor-watch" }, openGraph: { title, description, url: "/semiconductor-watch", type: "website" } };
// Keep relative freshness honest even when collection or editing has stopped.
export const revalidate = 3600;

export default function SemiconductorWatchPage() {
  const now = new Date().toISOString();
  const highlights = watchHighlights;
  const dates = highlights.filter(item => item.kind !== "factory").map(item => item.date).sort();
  const staleCollection = !media.status.checkedAt || !inWatchWindow(media.status.checkedAt, now, 2);
  const staleEditing = !inWatchWindow(watchEditorial.updatedAt, now, 7);
  const dailyCount = media.edition.articleIds.length;
  return <main className={styles.page}><div className={styles.shell}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url: siteUrl + "/semiconductor-watch", dateModified: watchUpdatedAt }} />
    <header className={styles.masthead}><Link href="/semiconductor-watch" className={styles.brand}>Chip Pulse<span> / 業界ウォッチ</span></Link><MediaLink href="/semiconductor-watch/earnings" articleId="watch" action="background" destination="earnings" placement="navigation">決算・IRを読み比べる →</MediaLink></header>
    <section className={styles.intro} aria-labelledby="watch-title">
      <div className={styles.introHeading}><div><p className={styles.eyebrow}>MANUFACTURING COMPASS</p><h1 id="watch-title">半導体業界ウォッチ</h1><p>気になる動きから、企業と技術のつながりへ。</p></div><div className={styles.issue}><span>最終編集</span><strong>{watchDate(watchEditorial.updatedAt)}</strong><span>公式情報を確認して、週2〜3回を目安に編集</span></div></div>
      <div className={styles.brief}><h2>今回、押さえたい動き</h2>{dates.length ? <p className={styles.fine}>注目枠の資料公表日：{watchDate(dates[0])}〜{watchDate(dates.at(-1)!)}</p> : null}
        {highlights.length ? <ol>{highlights.map(item => <li key={item.id}><MediaLink href={item.href} articleId={item.id} action="article" destination={item.kind} placement="brief">{item.title}<span aria-hidden="true"> →</span></MediaLink></li>)}</ol> : <p>掲載中の情報と背景解説を、下のテーマから調べられます。</p>}
      </div>
      <p className={styles.collection}>収集確認：{media.status.checkedAt ? `${newsDate(media.status.checkedAt,true)} JST` : "未実施"} · {watchDate(media.edition.date)}集計対象の発表 {dailyCount}件（要約済み）</p>
      {staleEditing ? <p className={styles.warning}>最終編集から7日以上経過しています。掲載時点の情報です。原資料の更新日もご確認ください。</p> : null}
      {media.status.state !== "success" || staleCollection ? <p className={styles.warning}>{media.status.state === "partial" ? "一部の取得先を更新できませんでした。" : media.status.state === "failed" ? "直近の収集に失敗しました。" : staleCollection ? "収集確認から2日以上経過しています。" : "収集処理の稼働前です。"} 確認済みの掲載内容を表示しています。</p> : null}
    </section>
    <NewsFeed items={watchItems} now={now}>
      {highlights.length ? <section className={styles.section} aria-labelledby="featured-title"><div className={styles.sectionHead}><div><p className={styles.eyebrow}>IN FOCUS</p><h2 id="featured-title">変化を読む、注目の入口</h2></div><span>編集で選んだ{highlights.length}件</span></div><div className={styles.featured}><WatchCard item={highlights[0]} featured />{highlights.length > 1 ? <div className={styles.sideCards}>{highlights.slice(1).map(item => <WatchCard key={item.id} item={item} />)}</div> : null}</div></section> : null}
    </NewsFeed>
    <section className={styles.section} aria-labelledby="changes-title"><div className={styles.sectionHead}><div><p className={styles.eyebrow}>UPDATE LOG</p><h2 id="changes-title">新しく掲載・確認した内容</h2></div><span>サイト内の掲載・確認日順</span></div><ul className={styles.changeList}>{watchChanges.map(item => <li key={item.id}><time dateTime={item.updatedAt}>{watchDate(item.updatedAt)}</time><div><small>{watchKindLabel[item.kind]} · {item.updateLabel}</small><MediaLink href={item.href} articleId={item.id} action="article" destination={item.kind} placement="updates">{item.title} →</MediaLink></div></li>)}</ul><p className={styles.fine}>確認日の更新が、元の発表内容の変化を意味するとは限りません。改訂のあるニュースでは詳細に履歴を表示します。</p></section>
    <section className={styles.section} aria-labelledby="official-title"><h2 id="official-title">公式発表も確認する</h2><p>本文の要約を掲載していない開示です。内容は原文で確認できます。</p><details className={styles.disclosure}><summary>公式発表のリンク（{media.updates.length}件）</summary><ul className={styles.officialList}>{media.updates.map(update => {
      const destination = watchEditorial.sourceDestinations[update.id];
      return <li id={`signal-${update.id}`} key={update.id}><span className={styles.fine}>SEC公表 {newsDate(update.publishedAt)}</span><MediaLink href={update.sourceUrl} articleId={update.id} action="source" placement="official">{update.title} ↗</MediaLink>{destination ? <MediaLink href={destination.href} articleId={update.id} action="article" destination={destination.destination} placement="official">{destination.label} →</MediaLink> : null}</li>;
    })}</ul></details></section>
    <details className={styles.disclosure}><summary>更新・出典について</summary><p>公式情報の候補は毎日収集し、記事は原文・数値・対象期間を確認して週2〜3回を目安に編集します。新しい記事がない日もあります。出典の公表、掲載、内容更新、収集確認の日付を分けて表示します。</p><p>SEC公表日時はSEC上の受理日時で、企業発表や出来事そのものの日時とは異なります。時刻不明の資料に時刻を補いません。工場の実績と計画、決算の実績と会社見通しも区別します。</p><p>自動要約：{media.status.ai === "disabled" ? "停止中。原資料を確認した記事を編集して掲載しています。" : "処理状況と記事ごとの確認方法は、出典欄をご覧ください。"}</p></details>
  </div></main>;
}
