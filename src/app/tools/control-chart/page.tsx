import type { Metadata } from "next";
import Link from "next/link";
import { ControlChartLearningTool } from "@/components/ControlChartLearningTool";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = { title: "管理図学習ツール｜異常原因を動かして理解", description: "I管理図で正常工程、平均シフト、外れ値、傾向、周期変動を切り替え、管理限界と異常パターンの判断を学べる無料ツールです。", alternates: { canonical: "/tools/control-chart" } };

export default function ControlChartPage() {
  return <main className="control-chart-page"><StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "管理図学習ツール", url: `${siteUrl}/tools/control-chart`, applicationCategory: "EducationalApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" }, inLanguage: "ja" }} /><nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">実務ツール</Link><span>/</span><span>管理図</span></nav><header className="control-chart-hero"><div><h1>管理図 学習ツール</h1><p>異常を混ぜて、偶然のばらつきとの違いを時系列で理解します。</p></div><p><strong>I管理図・24測定</strong><span>登録不要・ブラウザ内で動作</span></p></header><ControlChartLearningTool /><article className="control-chart-document"><header><p className="section-label">PRACTICAL SUMMARY</p><h2>管理限界を超えた点だけを探さない</h2><p>工程の変化は、中心線の片側への偏り、連続的な傾向、周期的な並びとして現れることがあります。検出ルールは原因を断定するものではなく、記録を調べるきっかけです。</p></header><div><section><h3>管理限界</h3><p>工程データから計算し、工程の時間的な変化を監視する境界です。</p></section><section><h3>規格限界</h3><p>顧客、設計、社内基準で決まる製品要求です。管理限界とは目的も決め方も異なります。</p></section><section><h3>検出後の行動</h3><p>点を削除する前に、設備、材料、測定器、作業者、環境、変更履歴を時刻と照合します。</p></section></div></article><nav className="tool-related-links" aria-label="関連ツール"><span>関連ツール</span><Link href="/tools/cpk">工程能力を確認する →</Link><Link href="/tools/doe">実験計画法を学ぶ →</Link></nav></main>;
}
