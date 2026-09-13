import type { Metadata } from "next";
import Link from "next/link";
import { LineBalanceSimulator } from "@/components/LineBalanceSimulator";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "山積み表・ラインバランス計算ツール｜工程負荷を可視化",
  description: "工程ごとの作業時間を山積み表で可視化し、タクト超過と作業再配分をブラウザ内で比較できる無料ツールです。登録不要。",
  alternates: { canonical: "/tools/line-balance" },
  openGraph: { title: "山積み表・ラインバランス計算ツール｜Manufacturing Compass", description: "作業を工程間で移し、タクト超過の変化をすぐ比較できます。", url: `${siteUrl}/tools/line-balance` },
};

export default function LineBalancePage() {
  return <main className="mini-app-page">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "山積み表・ラインバランス計算ツール", url: `${siteUrl}/tools/line-balance`, applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" }, inLanguage: "ja" }} />
    <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">実務ツール</Link><span>/</span><span>山積み表・ラインバランス</span></nav>
    <header className="mini-app-hero"><div><p className="section-label">LINE BALANCE</p><h1>山積み表・ラインバランス</h1><p>工程ごとの負荷を積み上げて、作業の再配分による変化を試せます。</p></div><p className="privacy-note"><strong>登録不要・ブラウザ内で計算</strong><span>工程名、作業名、時間は保存・外部送信しません。</span></p></header>
    <LineBalanceSimulator />
    <article className="mini-app-document">
      <section><h2>使い方</h2><p>目標タクトタイム、工程、作業時間を入力し、各作業の所属工程を選びます。棒がタクト線を超える工程を確認し、作業を別工程へ移して比較してください。</p></section>
      <section><h2>計算の前提</h2><p>各工程を1人が担当し、所属する作業を順番に行う単純モデルです。手待ち、搬送、並列設備、作業の先行制約、技能や安全上の制約は自動では考慮しません。表示結果は自動最適化や、現場での実行可能性を保証するものではありません。</p></section>
      <section><h2>結果の見方</h2><p>工程合計は、その工程へ割り当てた作業時間の合計です。タクト超過は各工程で目標を超えた秒数の合計です。総作業時間が変わらないまま超過が減るかを比較できます。</p></section>
    </article>
    <nav className="tool-related-links" aria-label="関連する実務ツール"><span>関連ツール</span><Link href="/tools/oee">OEEの改善効果を試す →</Link><Link href="/tools/doe">改善条件を実験計画法で学ぶ →</Link></nav>
  </main>;
}
