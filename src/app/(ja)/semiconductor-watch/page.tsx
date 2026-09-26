import type { Metadata } from "next";
import Link from "next/link";
import { ChipPulseDashboard } from "@/components/chip-pulse/ChipPulseDashboard";
import { StructuredData } from "@/components/StructuredData";
import { pulseCompanies, pulseDisplayDate, pulseMarketCapAsOf, pulseSignals, pulseUpdatedAt } from "@/data/chip-pulse";
import { calculatePulseKpis, formatPulseChange } from "@/lib/chip-pulse";
import { siteUrl } from "@/lib/format";
import styles from "./page.module.css";

const title = "半導体業界ウォッチ Chip Pulse｜ニュース・市場・テーマを可視化";
const description = "半導体企業の市場動向、テーマ、24時間の変化、設備投資を企業・地域・セクター横断で探索するダッシュボードの公開プロトタイプです。";

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
  const headlineKpis = calculatePulseKpis(pulseCompanies, pulseSignals);

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
        <aside className={styles.heroSignal} aria-label="今日の市場ムード">
          <div className={styles.signalHeading}><span>MARKET REGIME</span><b><i /> POSITIVE</b></div>
          <strong>AI / HBM led</strong>
          <p>メモリとテスト装置へ上昇が波及</p>
          <svg viewBox="0 0 300 72" role="img" aria-label="市場ムードの上向き推移を表すデモグラフ">
            <path d="M2 59 C28 58 34 47 56 49 S91 61 112 43 S149 18 169 30 S205 48 225 25 S260 13 298 6" />
            <circle cx="298" cy="6" r="4" />
          </svg>
          <dl>
            <div><dt>GLOBAL</dt><dd>{formatPulseChange(headlineKpis.weightedChange)}</dd></div>
            <div><dt>LEAD THEME</dt><dd>{headlineKpis.topTheme}</dd></div>
            <div><dt>SIGNALS</dt><dd>{headlineKpis.signalCount}</dd></div>
          </dl>
        </aside>
      </header>

      <aside className={styles.demoNotice} aria-label="デモデータについて">
        <strong>操作体験用のデモです</strong>
        <p>日次騰落、ニュース、テーマスコア、今後のイベントは固定した架空データです。速報、投資情報、AI生成要約ではありません。</p>
        <dl><div><dt>Snapshot</dt><dd>{pulseDisplayDate}</dd></div><div><dt>Market cap basis</dt><dd>{pulseMarketCapAsOf.replaceAll("-", ".")}</dd></div></dl>
      </aside>

      <ChipPulseDashboard />

      <section className={styles.method} aria-labelledby="chip-pulse-method-title">
        <div><p>HOW TO READ</p><h2 id="chip-pulse-method-title">ニュースを並べず、関係をたどる</h2></div>
        <ol>
          <li><span>01</span><strong>全体の強弱を見る</strong><p>KPIとHeatmapで、動いている企業・セクターを把握します。</p></li>
          <li><span>02</span><strong>条件を重ねる</strong><p>地域、カテゴリ、テーマを組み合わせて、同じ材料の広がりを確認します。</p></li>
          <li><span>03</span><strong>既存データへ進む</strong><p>企業情報、ランキング、業界地図、工場マップで背景を深掘りします。</p></li>
        </ol>
      </section>
    </main>
  );
}
