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

const learningSteps = [
  { number: "01", title: "効果を見る", body: "主効果と交互作用から、条件による応答の変化を整理します。" },
  { number: "02", title: "実験を組む", body: "反復で実験誤差を測り、ランダム化で時間変化の偏りを防ぎます。" },
  { number: "03", title: "結果を判断する", body: "ANOVAとp値で差の確かさを確認し、効果量から工程上の重要性を考えます。" },
  { number: "04", title: "モデルを診断する", body: "残差から、外れ値、ばらつきの違い、実験順に沿った変化を探します。" },
  { number: "05", title: "条件を確かめる", body: "候補条件で確認実験を行い、予測の差と再現性を確かめます。" },
];

const experimentChecklist = [
  "目的と応答を明確にしたか",
  "因子範囲は安全で実行可能か",
  "測定システムを信頼できるか",
  "必要な反復回数を確保したか",
  "実施順をランダム化したか",
  "ロット・日時・実施順を記録するか",
  "残差と確認実験まで計画したか",
  "実験範囲外へ外挿していないか",
];

export default function DoeToolPage() {
  return <main className="doe-page">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "実験計画法（DoE）学習ツール", url: `${siteUrl}/tools/doe`, applicationCategory: "EducationalApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" }, inLanguage: "ja" }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "実務ツール", item: `${siteUrl}/tools/cpk` }, { "@type": "ListItem", position: 3, name: "DoE学習ツール", item: `${siteUrl}/tools/doe` }] }} />
    <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><span>DoE学習ツール</span></nav>
    <header className="doe-hero"><div><h1>実験計画法（DoE）学習ツール</h1><p>効果を見るところから確認実験まで、データを動かして順番に学びます。</p></div><p><strong>2因子・2水準・反復あり</strong><span>JMPなどを使う前の基本復習に</span></p></header>
    <DoeLearningTool />

    <article className="doe-document">
      <header><p className="section-label">LEARNING SUMMARY</p><h2>DoEで判断する順番を、実務へ持ち帰る</h2><p>数値を計算して終わりではなく、差を見つけ、誤差と区別し、モデルを疑い、最後に新しい実験で確かめます。</p></header>
      <ol className="doe-learning-summary">{learningSteps.map((step) => <li key={step.number}><span>{step.number}</span><div><strong>{step.title}</strong><p>{step.body}</p></div></li>)}</ol>
      <div className="doe-takeaway-grid">
        <section><p className="section-label">BEFORE THE EXPERIMENT</p><h3>実験を始める前のチェック</h3><ul>{experimentChecklist.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section><p className="section-label">SCOPE &amp; LIMITS</p><h3>このツールの限界</h3><p>このツールは、2因子2水準の実験を単純化した学習用モデルです。実際の工程では、因子数、水準数、ブロック、ロット差、欠測、非線形性、測定誤差なども考慮します。</p><p>表示されたp値や推奨条件を、そのまま実際の工程条件として使用しないでください。工程知識、安全性、実験記録と合わせて判断します。</p></section>
      </div>
    </article>

    <section className="doe-advanced-learning" aria-labelledby="doe-advanced-title">
      <header><div><p className="section-label">ADVANCED LEARNING</p><h2 id="doe-advanced-title">発展編：因子が増えたら、どの設計を選ぶ？</h2></div><p>基本編で扱った2因子なら4条件です。因子が増えたときは、実験回数だけでなく、残したい情報から設計を選びます。</p></header>
      <nav aria-label="発展編の学習テーマ"><span aria-current="step"><b>01</b>実験回数と情報量</span><span><b>02</b>L8の列割り付け</span><span><b>03</b>交絡を見抜く</span><span><b>04</b>曲率と3水準</span></nav>
      <DoeDesignComparison />
    </section>

    <section className="doe-next-learning"><div><p className="section-label">KEEP LEARNING</p><h3>次の実務学習へ</h3><p>工程能力や製造業・半導体の技術解説も、実際の判断とつなげて確認できます。</p></div><nav aria-label="次に学ぶ内容"><Link href="/tools/cpk"><span>Cp・Cpk計算ツール</span><strong>平均とばらつきから工程能力を学ぶ</strong></Link><Link href="/guides"><span>技術ガイド</span><strong>製造業・半導体の解説を読む</strong></Link></nav></section>
  </main>;
}
