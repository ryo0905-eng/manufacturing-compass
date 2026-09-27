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
  const checkedAt = new Date(refreshStatus.checkedAt).getTime();
  const recentSignals = filterRecentPulseSignals(pulseSignals, refreshStatus.checkedAt);
  const signals24h = filterRecentPulseSignals(recentSignals, refreshStatus.checkedAt, 1).length;
  const officialUpdates24h = officialUpdates.updates.filter((update) => {
    const age = checkedAt - new Date(update.publishedAt).getTime();
    return age >= 0 && age <= 24 * 60 * 60 * 1000;
  }).length;
  const updates24h = signals24h + officialUpdates24h;
  const nextEvent = filterUpcomingPulseEvents(pulseEvents, refreshStatus.checkedAt)[0];

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
        dateModified: checkedAt > new Date(pulseUpdatedAt).getTime() ? refreshStatus.checkedAt : pulseUpdatedAt,
        isAccessibleForFree: true,
      }} />

      <nav className={styles.breadcrumb} aria-label="パンくず">
        <Link href="/">ホーム</Link><span aria-hidden="true">/</span><span>半導体業界ウォッチ</span>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p>SEMICONDUCTOR INDUSTRY WATCH</p>
          <h1><span>Chip Pulse</span>半導体業界の「今」を<br /><em>3分で。</em></h1>
          <p className={styles.lead}>企業、セクター、地域、テーマを横断し、昨日からの変化を一枚のダッシュボードで探索します。</p>
        </div>
        <aside className={styles.heroSignal} aria-label="公式情報の確認状況">
          <div className={styles.signalHeading}><span>OFFICIAL SOURCE CHECK</span><b><i /> VERIFIED</b></div>
          <strong>24h / {updates24h === 0 ? "QUIET" : `${updates24h} UPDATES`}</strong>
          <p>{updates24h === 0 ? "直近24時間に新しい公式更新はありません" : `編集済みシグナル ${signals24h}件・自動取得 ${officialUpdates24h}件`}</p>
          <dl><div><dt>30 DAYS</dt><dd>{recentSignals.length + officialUpdates.updates.length} updates</dd></div><div><dt>MONITORED</dt><dd>{refreshStatus.sources.succeeded} sources</dd></div><div><dt>NEXT</dt><dd>{nextEvent ? `${nextEvent.date.slice(5)} ${nextEvent.title.split(" ")[0]}` : "予定なし"}</dd></div></dl>
        </aside>
      </header>

      <aside className={styles.sourceNotice} aria-label="データの出典と更新について">
        <strong>公式情報スナップショット</strong>
        <p>重要シグナルは公式情報を編集整理しています。新しい公式発表・開示はタイトルと日時のみ自動掲載し、原文へリンクします。株価速報ではなく、更新はリアルタイムではありません。</p>
        <dl><div><dt>Source check</dt><dd>{formatJst(refreshStatus.checkedAt)} JST</dd></div><div><dt>Editorial</dt><dd>{pulseDisplayDate}</dd></div><div><dt>Market cap</dt><dd>{pulseMarketCapAsOf.replaceAll("-", ".")}</dd></div></dl>
      </aside>

      <ChipPulseDashboard />
    </main>
  );
}
