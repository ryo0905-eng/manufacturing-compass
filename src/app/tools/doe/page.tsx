import type { Metadata } from "next";
import Link from "next/link";
import { DoeDesignComparison } from "@/components/DoeDesignComparison";
import { DoeLearningTool } from "@/components/DoeLearningTool";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "実験計画法（DoE）学習ツール｜効果・ANOVA・残差を理解",
  description: "2因子2水準の実験を動かし、主効果、交互作用、反復、ランダム化、ANOVA、p値、残差、確認実験まで順番に学べる無料ツールです。",
  alternates: { canonical: "/tools/doe" },
};

export default function DoeToolPage() {
  return <main className="doe-page">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "実験計画法（DoE）学習ツール", url: `${siteUrl}/tools/doe`, applicationCategory: "EducationalApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" }, inLanguage: "ja" }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "実務ツール", item: `${siteUrl}/tools/cpk` }, { "@type": "ListItem", position: 3, name: "DoE学習ツール", item: `${siteUrl}/tools/doe` }] }} />
    <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><span>DoE学習ツール</span></nav>
    <header className="doe-hero"><div><h1>実験計画法（DoE）学習ツール</h1><p>効果を見るところから確認実験まで、データを動かして順番に学びます。</p></div><p><strong>2因子・2水準・反復あり</strong><span>JMPなどを使う前の基本復習に</span></p></header>
    <DoeLearningTool />
    <nav className="tool-related-links" aria-label="関連する実務学習ツール"><span>関連ツール</span><Link href="/tools/cpk">Cp・Cpkを計算し、平均とばらつきを動かして学ぶ <span aria-hidden="true">→</span></Link></nav>
    <DoeDesignComparison />
    <article className="doe-document"><header><p className="section-label">LEARNING SUMMARY</p><h2>DoEで判断する順番を、実務へ持ち帰る</h2><p>数値を計算して終わりではなく、差を見つけ、誤差と区別し、モデルを疑い、最後に新しい実験で確かめます。</p></header><ol className="doe-learning-summary"><li><span>01</span><div><strong>効果を見る</strong><p>主効果と交互作用から、条件による応答の変化を整理します。</p></div></li><li><span>02</span><div><strong>実験を組む</strong><p>反復で実験誤差を測り、ランダム化で時間変化の偏りを防ぎます。</p></div></li><li><span>03</span><div><strong>結果を判断する</strong><p>ANOVAとp値で差の確かさを確認し、効果量から工程上の重要性を考えます。</p></div></li><li><span>04</span><div><strong>モデルを診断する</strong><p>残差から、外れ値、ばらつきの違い、実験順に沿った変化を探します。</p></div></li><li><span>05</span><div><strong>条件を確かめる</strong><p>候補条件で確認実験を行い、予測の差と再現性を確かめます。</p></div></li></ol><div className="doe-takeaway-grid"><section><p className="section-label">BEFORE THE EXPERIMENT</p><h3>実験を始める前のチェック</h3><ul><li>目的と応答を明確にしたか</li><li>因子範囲は安全で実行可能か</li><li>測定システムを信頼できるか</li><li>必要な反復回数を確保したか</li><li>実施順をランダム化したか</li><li>ロット・日時・実施順を記録するか</li><li>残差と確認実験まで計画したか</li><li>実験範囲外へ外挿していないか</li></ul></section><section><p className="section-label">SCOPE &amp; LIMITS</p><h3>このツールの限界</h3><p>このツールは、2因子2水準の実験を単純化した学習用モデルです。実際の工程では、因子数、水準数、ブロック、ロット差、欠測、非線形性、測定誤差なども考慮します。</p><p>表示されたp値や推奨条件を、そのまま実際の工程条件として使用しないでください。工程知識、安全性、実験記録と合わせて判断します。</p></section></div><section className="doe-next-learning"><div><p className="section-label">KEEP LEARNING</p><h3>次の実務学習へ</h3><p>工程能力や製造業・半導体の技術解説も、実際の判断とつなげて確認できます。</p></div><nav aria-label="次に学ぶ内容"><Link href="/tools/cpk"><span>Cp・Cpk計算ツール</span><strong>平均とばらつきから工程能力を学ぶ</strong></Link><Link href="/guides"><span>技術ガイド</span><strong>製造業・半導体の解説を読む</strong></Link></nav></section></article>
  </main>;
}
