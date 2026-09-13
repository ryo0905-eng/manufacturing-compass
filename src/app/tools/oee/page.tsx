import type { Metadata } from "next";
import Link from "next/link";
import { OeeSimulator } from "@/components/OeeSimulator";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "OEE計算・改善シミュレーター｜設備総合効率と良品数を比較",
  description: "時間稼働率・性能稼働率・良品率からOEEを計算し、停止・速度・不良改善による推定良品数を比較できる無料ツールです。",
  alternates: { canonical: "/tools/oee" },
  openGraph: { title: "OEE計算・改善シミュレーター｜Manufacturing Compass", description: "設備総合効率とロスの内訳、改善後の推定良品数をブラウザ内で比較できます。", url: `${siteUrl}/tools/oee` },
};

export default function OeePage() {
  return <main className="mini-app-page">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "OEE計算・改善シミュレーター", url: `${siteUrl}/tools/oee`, applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" }, inLanguage: "ja" }} />
    <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">実務ツール</Link><span>/</span><span>OEE改善シミュレーター</span></nav>
    <header className="mini-app-hero"><div><p className="section-label">OVERALL EQUIPMENT EFFECTIVENESS</p><h1>OEE改善シミュレーター</h1><p>停止・速度・不良のロスを分け、改善後の良品生産量を比較します。</p></div><p className="privacy-note"><strong>登録不要・ブラウザ内で計算</strong><span>入力した生産データは保存・外部送信しません。</span></p></header>
    <OeeSimulator />
    <article className="mini-app-document">
      <section><h2>OEE（設備総合効率）の計算</h2><p>OEEは「時間稼働率 × 性能稼働率 × 良品率」です。時間稼働率は停止によるロス、性能稼働率は理想速度との差、良品率は不良によるロスを表します。</p></section>
      <section><h2>入力と単位</h2><p>負荷時間と停止時間は分、理想サイクルタイムは秒／個で入力します。ツール内で単位を秒へそろえ、性能稼働率と推定生産数を計算します。計画停止は負荷時間に含めません。</p></section>
      <section><h2>改善シナリオの前提</h2><p>負荷時間と理想サイクルタイムを固定し、改善後の停止時間・性能稼働率・良品率を指定します。推定値は条件間の比較用で、設備能力、材料供給、人員、需要などの制約や実際の生産増を保証しません。</p></section>
    </article>
    <nav className="tool-related-links" aria-label="関連する実務ツール"><span>関連ツール</span><Link href="/tools/line-balance">工程の山積みを見直す →</Link><Link href="/tools/control-chart">工程の安定性を確認する →</Link><Link href="/guides/six-sigma">DMAICの全体像を読む →</Link></nav>
  </main>;
}
