import type { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";
import { WatchExplorer } from "@/components/chip-pulse/WatchExplorer";
import { WatchNavigation } from "@/components/chip-pulse/WatchNavigation";
import { MediaLink } from "@/components/chip-pulse/MediaLinks";
import { media, newsDate } from "@/lib/chip-pulse-media";
import { buildWatchCompanies, buildWatchNews, watchItems, watchUpdatedAt } from "@/lib/watch";
import { upcomingWatchEvents, watchCalendar, watchEventDate } from "@/lib/watch-calendar";
import { earningsCompanyName } from "@/lib/earnings";
import { watchNewsForTopic } from "@/lib/watch-explorer";
import { inWatchWindow, watchDate, watchTopics } from "@/lib/watch-types";
import { siteUrl } from "@/lib/format";
import { annualHistories, annualHistoryUpdatedAt } from "@/lib/earnings-history";
import { watchExchange } from "@/lib/watch-financials";
import styles from "@/components/chip-pulse/WatchExplorer.module.css";

const title = "半導体業界ウォッチ｜12社の財務グラフ・ニュース・発表予定";
const description = "主要半導体12社の売上高を円換算の棒グラフで一覧。共通の縦軸で規模を比べ、最新通期の売上高・前年比、最大20年の推移と営業利益率を確認できます。原通貨・出典、最新四半期の決算、ニュース・発表予定も掲載。";
export const metadata: Metadata = { title, description, alternates: { canonical: "/semiconductor-watch" }, openGraph: { title, description, url: "/semiconductor-watch", type: "website" } };
export const revalidate = 3600;
const uiVersion = "cards-v2";

export default function SemiconductorWatchPage() {
  const now = new Date().toISOString();
  const news = buildWatchNews();
  const recentIds = new Set(watchNewsForTopic(news, "all", now).map(item => item.id));
  const archive = watchItems.filter(item => item.kind !== "earnings" && !recentIds.has(item.id))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.id.localeCompare(b.id));
  const events = upcomingWatchEvents(watchCalendar.events, now);
  const staleCollection = !media.status.checkedAt || !inWatchWindow(media.status.checkedAt, now, 2);
  const itemIds = new Set(watchItems.map(item => item.id.replace(/^[^:]+:/, "")));
  const unreviewed = media.updates.filter(update => !watchCalendar.reviews.some(review => review.id === update.id && review.sourceUrl === update.sourceUrl && review.status !== "recheck")).length;

  return <main className={styles.page}><div className={styles.shell}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url: siteUrl + "/semiconductor-watch", dateModified: [watchUpdatedAt, annualHistoryUpdatedAt, watchExchange.checkedAt].sort().at(-1) }} />
    <header className={styles.header}><h1>半導体業界ウォッチ</h1><p>掲載内容・日程の更新 <time dateTime={watchUpdatedAt}>{watchDate(watchUpdatedAt)}</time></p></header>
    <WatchNavigation current="watch" />
    {media.status.state !== "success" || staleCollection ? <p className={styles.notice} role="status">{media.status.state === "partial" ? "一部の取得先を更新できませんでした。" : media.status.state === "failed" ? "直近の収集に失敗しました。" : staleCollection ? "収集確認から2日以上経過しています。" : "収集処理の稼働前です。"} 前回確認時の掲載内容を表示しています。</p> : null}
    <WatchExplorer companies={buildWatchCompanies(now)} news={news} now={now} histories={annualHistories}>
      <details className={styles.disclosure}><summary>今後14日の発表予定 <span>· {events.length}件</span></summary>
        {events.length ? <ul>{events.map(event => <li key={event.id}>
          <strong>{earningsCompanyName(event.companyId)}</strong> · {event.period} · {event.kind === "monthly" ? "月次売上" : "決算・説明会"}
          <MediaLink href={event.sourceUrl} articleId={`calendar:${event.id}`} action="source" placement="schedule" uiVersion={uiVersion}>{watchEventDate(event)} ↗</MediaLink>
          <small>日程確認 {event.checkedAt ? watchDate(event.checkedAt) : "未確認"}</small>
        </li>)}</ul> : <p>今後14日に掲載できる公式発表予定はありません。</p>}
        <p>企業が公表する現地日付です。予定は変更される場合があります。</p>
      </details>
      <details className={styles.disclosure}><summary>過去の掲載・工場の状況 <span>· {archive.length}件</span></summary>
        <p>30日より前の発表と、確認日付きの工場情報です。</p>
        <ul>{archive.map(item => <li key={item.id} id={`signal-${item.id.replace(/^[^:]+:/, "")}`}>
          <time dateTime={item.date}>{item.dateLabel} {watchDate(item.date)}</time>
          <MediaLink href={item.href} articleId={item.id} action="article" destination={item.kind} placement="updates" uiVersion={uiVersion}>{item.title} →</MediaLink>
          {item.changed ? <small>出典変更・再確認中</small> : null}
        </li>)}</ul>
      </details>
      <details className={styles.disclosure}><summary>テーマの背景を知る</summary>
        <ul>{watchTopics.map(topic => <li key={topic.id}><strong>{topic.label}</strong><MediaLink href={topic.href} articleId={`topic:${topic.id}`} action="background" destination="guide" placement="explore" uiVersion={uiVersion}>{topic.linkLabel} →</MediaLink></li>)}</ul>
      </details>
      <details className={styles.disclosure}><summary>公式リンク・更新と出典</summary>
        <p>候補収集 {media.status.checkedAt ? `${newsDate(media.status.checkedAt, true)} JST` : "未実施"} · 原文確認待ち {unreviewed}件</p>
        <p>公式発表の原文・数値・対象期間を確認できた内容を掲載しています。収集日時、公表日、数値確認日、内容更新日はそれぞれ異なります。取得の成功は、原文の確認完了を意味しません。</p>
        <p>グラフは各社の通期実績5期で、縦軸は企業ごとに異なります。企業間では通貨・対象期・事業範囲・会計基準が異なります。実績と会社見通し、工場の計画と稼働実績は区別しています。</p>
        <p>以下は本文の要約を掲載していない公式開示です。SECの日付は提出の受理日で、企業発表日とは異なる場合があります。</p>
        <ul>{media.updates.map(update => {
          const review = watchCalendar.reviews.find(entry => entry.id === update.id && entry.sourceUrl === update.sourceUrl);
          return <li id={itemIds.has(update.id) ? undefined : `signal-${update.id}`} key={update.id}>
            <small>SEC公表 {newsDate(update.publishedAt)} · {review?.status === "linked" ? "掲載済み" : review?.status === "skipped" ? "掲載対象外" : "原文確認待ち"}</small>
            <MediaLink href={update.sourceUrl} articleId={update.id} action="source" placement="official" uiVersion={uiVersion}>{update.title} ↗</MediaLink>
            {review?.href ? <MediaLink href={review.href} articleId={update.id} action="article" destination="earnings" placement="official" uiVersion={uiVersion}>関連する掲載内容 →</MediaLink> : null}
          </li>;
        })}</ul>
      </details>
    </WatchExplorer>
  </div></main>;
}
