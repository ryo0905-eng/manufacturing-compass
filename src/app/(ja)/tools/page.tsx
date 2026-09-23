import { learningTools } from "@/data/learning-tools";
import type { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";
import { ToolsLearningLab } from "@/components/ToolsLearningLab";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "製造業の品質管理・統計学習ツール｜無料で動かして学ぶ",
  description: "困りごとと手元のデータから、最大3問で使うツールをご案内。工程比較、測定計画、Cp・Cpk、管理図などを無料・登録不要で使い、学べます。",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "製造業の品質管理・統計学習ラボ｜Manufacturing Compass",
    description: "測定・工程管理・能力評価・条件最適化を、無料のインタラクティブツールで体験できます。",
    url: `${siteUrl}/tools`,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function ToolsPage() {
  return (
    <main className="tools-page tools-lab-page">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "製造業の品質管理・統計学習ラボ", description: "製造データの判断を4ステップで学べる無料ツール集", url: `${siteUrl}/tools`, mainEntity: { "@type": "ItemList", numberOfItems: learningTools.length, itemListElement: learningTools.map(({ title: name, href }, index) => ({ "@type": "ListItem", position: index + 1, name, url: `${siteUrl}${href}` })) } }} />
      <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "学習ツール", item: `${siteUrl}/tools` }] }} />
      <ToolsLearningLab />
      <aside className="tools-game-entry">
        <div><p className="section-label">企業研究の実験企画</p><h2>半導体企業ランキング・タイムマシン</h2><p>主要20社の2010〜2025年の年末時価総額を、再生・年の移動・企業選択で比較。GAFAM・トヨタとの比較や装置5社・日本企業10社への切り替え、比較URLの共有もできます。</p></div>
        <TrackedInternalLink href="/tools/ranking-time-machine" eventName="tool_card_click" eventProperties={{ tool_name: 'ランキング・タイムマシン', source_section: 'tools_experiment' }}>時価総額の推移を見る →</TrackedInternalLink>
        <TrackedInternalLink href="/guides/japan-semiconductor-market-cap-history" eventName="article_internal_click" eventProperties={{ source_slug: "tools", destination_path: "/guides/japan-semiconductor-market-cap-history" }}>日本企業10社の変化を記事で読む →</TrackedInternalLink>
      </aside>
    </main>
  );
}
