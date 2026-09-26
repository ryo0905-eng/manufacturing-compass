import type { Metadata } from "next";
import Link from "next/link";
import { ChipPulseDashboard } from "@/components/chip-pulse/ChipPulseDashboard";
import { StructuredData } from "@/components/StructuredData";
import { pulseDisplayDate, pulseMarketCapAsOf, pulseSignals, pulseUpdatedAt } from "@/data/chip-pulse";
import { siteUrl } from "@/lib/format";
import styles from "./page.module.css";

const title = "半導体業界ウォッチ Chip Pulse｜ニュース・市場・テーマを可視化";
const description = "半導体企業の公式発表、市場テーマ、設備投資を、企業・地域・セクター横断で探索できる情報ダッシュボードです。";

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
  const checkedAt = new Date(pulseUpdatedAt).getTime();
  const signals24h = pulseSignals.filter((signal) => {
    const age = checkedAt - new Date(signal.occurredAt).getTime();
    return age >= 0 && age <= 24 * 60 * 60 * 1000;
  }).length;
  const sourceCount = new Set(pulseSignals.map((signal) => signal.sourceName)).size;

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
        dateModified: pulseUpdatedAt,
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
          <strong>24h / {signals24h === 0 ? "QUIET" : `${signals24h} UPDATES`}</strong>
          <p>{signals24h === 0 ? "直近24時間の重要更新は確認されていません" : "直近24時間に重要な公式更新があります"}</p>
          <dl><div><dt>30 DAYS</dt><dd>{pulseSignals.length} signals</dd></div><div><dt>SOURCES</dt><dd>{sourceCount} official</dd></div><div><dt>NEXT</dt><dd>Micron 9/30</dd></div></dl>
        </aside>
      </header>

      <aside className={styles.sourceNotice} aria-label="データの出典と更新について">
        <strong>公式情報スナップショット</strong>
        <p>企業IR・規制提出・業界団体の公開情報を編集整理しています。株価速報ではなく、更新はリアルタイムではありません。各シグナルから原文を確認できます。</p>
        <dl><div><dt>Snapshot</dt><dd>{pulseDisplayDate}</dd></div><div><dt>Market cap basis</dt><dd>{pulseMarketCapAsOf.replaceAll("-", ".")}</dd></div></dl>
      </aside>

      <ChipPulseDashboard />
    </main>
  );
}
