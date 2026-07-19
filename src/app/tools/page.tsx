import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "製造技術の実務・学習ツール",
  description: "Cp・Cpk、実験計画法、管理図など、製造技術の判断を操作しながら学べる無料ツールです。",
  alternates: { canonical: "/tools" },
};

const tools = [
  { href: "/tools/cpk", number: "01", label: "PROCESS CAPABILITY", title: "Cp・Cpk計算ツール", description: "測定データからPp・Ppkとヒストグラムを確認できます。平均、標準偏差、規格値を動かしてCp・Cpkの違いを学ぶこともできます。", features: ["生データ計算", "Seaborn風ヒストグラム", "動かして理解"] },
  { href: "/tools/doe", number: "02", label: "DESIGN OF EXPERIMENTS", title: "実験計画法（DoE）学習ツール", description: "効果を見るところから、反復、ランダム化、ANOVA、残差、確認実験まで、DoEの判断手順を5ステップで学べます。", features: ["2因子2水準", "ANOVA・p値", "残差・確認実験"] },
  { href: "/tools/control-chart", number: "03", label: "STATISTICAL PROCESS CONTROL", title: "管理図 学習ツール", description: "正常工程へ平均シフト、外れ値、傾向、周期変動を加え、管理限界と非ランダムな並びを学べます。", features: ["I管理図", "異常パターン", "管理限界と規格限界"] },
] as const;

export default function ToolsPage() {
  return <main className="tools-page">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "ItemList", name: "製造技術の実務・学習ツール", numberOfItems: tools.length, itemListElement: tools.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.title, url: `${siteUrl}${tool.href}` })) }} />
    <section className="tools-page-hero"><p className="section-label">MANUFACTURING TOOLS</p><h1>製造技術を、計算して、動かして理解する。</h1><p>実務の確認と学び直しに使える、登録不要のブラウザツールです。入力内容は保存・外部送信しません。</p></section>
    <section className="tools-directory" aria-labelledby="tools-directory-title"><header><h2 id="tools-directory-title">利用できるツール</h2><p>解析ソフトを置き換えるのではなく、すぐ確認したい計算と、考え方を思い出すための学習を支えます。</p></header><div>{tools.map((tool) => <Link href={tool.href} key={tool.href}><span>{tool.number} / {tool.label}</span><h3>{tool.title}</h3><p>{tool.description}</p><ul>{tool.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><strong>ツールを開く <i aria-hidden="true">→</i></strong></Link>)}</div></section>
  </main>;
}
