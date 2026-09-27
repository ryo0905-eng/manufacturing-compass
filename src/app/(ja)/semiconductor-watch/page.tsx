import type { Metadata } from "next";
import Link from "next/link";
import { ChipPulseDashboard } from "@/components/chip-pulse/ChipPulseDashboard";
import { StructuredData } from "@/components/StructuredData";
import { pulseDisplayDate, pulseEvents, pulseMarketCapAsOf, pulseSignals, pulseUpdatedAt } from "@/data/chip-pulse";
import officialUpdates from "@/data/chip-pulse-official-updates.json";
import refreshStatus from "@/data/chip-pulse-refresh-status.json";
import { siteUrl } from "@/lib/format";
import { filterRecentPulseSignals, filterUpcomingPulseEvents } from "@/lib/chip-pulse";
import styles from "./page.module.css";

const title = "半導体業界ウォッチ Chip Pulse｜ニュース・市場・テーマを可視化";
const description = "半導体企業の公式発表、市場テーマ、設備投資を、企業・地域・セクター横断で探索できる情報ダッシュボードです。";

function formatJst(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/semiconductor-watch" },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/semiconductor-watch",
  },
};

export default function SemiconductorWatchPage() {
  const checkedAt = new Date(refreshStatus.lastSuccessfulAt).getTime();
  const recentSignals = filterRecentPulseSignals(pulseSignals, refreshStatus.lastSuccessfulAt);
  const signals24h = filterRecentPulseSignals(recentSignals, refreshStatus.lastSuccessfulAt, 1).length;
  const officialUpdates24h = officialUpdates.updates.filter((update) => {
    const age = checkedAt - new Date(update.publishedAt).getTime();
    return age >= 0 && age <= 24 * 60 * 60 * 1000;
  }).length;
  const updates24h = signals24h + officialUpdates24h;
  const nextEvent = filterUpcomingPulseEvents(pulseEvents, refreshStatus.lastSuccessfulAt)[0];

  return (
    <main className={styles.page}>
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "半導体業界ウォッチ Chip Pulse", item: `${siteUrl}/semiconductor-watch` },
        ],
      }} />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Chip Pulse",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description,
        url: `${siteUrl}/semiconductor-watch`,
        dateModified: checkedAt > new Date(pulseUpdatedAt).getTime() ? refreshStatus.lastSuccessfulAt : pulseUpdatedAt,
        isAccessibleForFree: true,
      }} />

      <nav className={styles.breadcrumb} aria-label="パンくず">
        <Link href="/">ホーム</Link><span aria-hidden="true">/</span><span>半導体業界ウォッチ</span>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p>半導体業界ウォッチ</p>
          <h1><span>Chip Pulse</span>半導体業界の「今」を<br /><em>3分で。</em></h1>
          <p className={styles.lead}>確認済みの公式ニュースから、何が起き、どの企業・工程に関係するかを毎朝3分で確認できます。</p>
        </div>
        <aside className={styles.heroSignal} aria-label="公式情報の確認状況">
          <div className={styles.signalHeading}><span>公式情報の確認状況</span><b><i /> {refreshStatus.status === "success" ? "正常" : "更新遅延"}</b></div>
          <strong>過去24時間 / {updates24h}件</strong>
          <p>{updates24h === 0 ? "新着なし（取得失敗とは区別しています）" : `確認済みニュース ${signals24h}件・公式メタデータ ${officialUpdates24h}件`}</p>
          <dl><div><dt>直近30日</dt><dd>{recentSignals.length + officialUpdates.updates.length}件</dd></div><div><dt>取得成功</dt><dd>{refreshStatus.sources.succeeded}/{refreshStatus.sources.attempted}</dd></div><div><dt>今後7日</dt><dd>{nextEvent ? `${nextEvent.date.slice(5)} ${nextEvent.title.split(" ")[0]}` : "確認済み予定なし"}</dd></div></dl>
        </aside>
      </header>

      <aside className={styles.sourceNotice} aria-label="データの出典と更新について">
        <strong>公式情報スナップショット</strong>
        <p>重要ニュースは公式情報を編集整理しています。未編集の公式開示はタイトル・提出種別・発表日だけを掲載します。株価速報ではなく、ページ閲覧時にAIを呼び出しません。</p>
        <dl><div><dt>最終正常更新</dt><dd>{formatJst(refreshStatus.lastSuccessfulAt)} JST</dd></div><div><dt>編集確認</dt><dd>{pulseDisplayDate}</dd></div><div><dt>時価総額の基準日</dt><dd>{pulseMarketCapAsOf.replaceAll("-", ".")}</dd></div></dl>
      </aside>

      <ChipPulseDashboard />
    </main>
  );
}
