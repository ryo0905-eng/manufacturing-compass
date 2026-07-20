import type { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";
import { ToolsLearningLab } from "@/components/ToolsLearningLab";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "製造業の品質管理・統計学習ツール｜無料で動かして学ぶ",
  description: "Gage R&R、管理図、Cp・Cpk、実験計画法（DoE）を、数値とグラフを動かして学べる無料の学習ラボです。測定から工程改善まで4ステップで理解できます。",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "製造業の品質管理・統計学習ラボ｜Manufacturing Compass",
    description: "測定・工程管理・能力評価・条件最適化を、無料のインタラクティブツールで体験できます。",
    url: `${siteUrl}/tools`,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const toolItems = [
  ["Gage R&R 学習ツール", "/tools/gage-rr"],
  ["管理図 学習ツール", "/tools/control-chart"],
  ["Cp・Cpk計算・学習ツール", "/tools/cpk"],
  ["実験計画法（DoE）学習ツール", "/tools/doe"],
] as const;

export default function ToolsPage() {
  return (
    <main className="tools-page tools-lab-page">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "製造業の品質管理・統計学習ラボ", description: "製造データの判断を4ステップで学べる無料ツール集", url: `${siteUrl}/tools`, mainEntity: { "@type": "ItemList", numberOfItems: toolItems.length, itemListElement: toolItems.map(([name, href], index) => ({ "@type": "ListItem", position: index + 1, name, url: `${siteUrl}${href}` })) } }} />
      <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "学習ツール", item: `${siteUrl}/tools` }] }} />
      <ToolsLearningLab />
    </main>
  );
}
