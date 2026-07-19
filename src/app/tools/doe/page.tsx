import type { Metadata } from "next";
import Link from "next/link";
import { DoeLearningTool } from "@/components/DoeLearningTool";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "実験計画法（DoE）学習ツール｜主効果と交互作用を理解",
  description: "2因子2水準の4つの実験結果を動かし、主効果と交互作用プロットの変化を確認できる学習ツールです。反復なしで判断できること・できないことも解説します。",
  alternates: { canonical: "/tools/doe" },
};

export default function DoeToolPage() {
  return <main className="doe-page">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "実験計画法（DoE）学習ツール", url: `${siteUrl}/tools/doe`, applicationCategory: "EducationalApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" }, inLanguage: "ja" }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "実務ツール", item: `${siteUrl}/tools/cpk` }, { "@type": "ListItem", position: 3, name: "DoE学習ツール", item: `${siteUrl}/tools/doe` }] }} />
    <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><span>DoE学習ツール</span></nav>
    <header className="doe-hero"><div><h1>実験計画法（DoE）学習ツール</h1><p>4つの実験結果を動かして、主効果と交互作用を理解します。</p></div><p><strong>2因子・2水準・反復なし</strong><span>JMPなどを使う前の基本復習に</span></p></header>
    <DoeLearningTool />
    <nav className="tool-related-links" aria-label="関連する実務学習ツール"><span>関連ツール</span><Link href="/tools/cpk">Cp・Cpkを計算し、平均とばらつきを動かして学ぶ <span aria-hidden="true">→</span></Link></nav>
    <article className="doe-document"><header><h2>2因子2水準で何が分かる？</h2><p>4条件を比較し、各因子の平均的な効果と、因子の組み合わせによる効果の変化を整理します。</p></header><section><h3>主効果</h3><p>一方の因子について、低水準の平均と高水準の平均の差を取ったものです。正の効果は高水準で応答が増える方向を示します。</p></section><section><h3>交互作用</h3><p>ある因子の効果が、もう一方の因子の水準によって変わる状態です。交互作用プロットの線が非平行または交差するときは、主効果だけで条件を決めないよう注意します。</p></section><section><h3>反復なしでは判断できないこと</h3><p>同じ条件を繰り返していないため、実験誤差を効果から分離できません。このツールの効果量や線の形だけで統計的有意性を判断することはできません。</p></section><section><h3>実務で追加すること</h3><p>実施順のランダム化、反復、測定システムの確認、安全な因子範囲、残差分析を計画します。実験範囲外への外挿も避けます。</p></section></article>
  </main>;
}
