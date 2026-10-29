import type { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";
import { ToolNavigator } from "@/components/ToolNavigator";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tool Navigator｜製造データのソフトウェア選定",
  description: "歩留まり分析、Cpk、装置データの活用に向けて、製品の役割と条件を比較するワークスペース。",
  alternates: { canonical: "/tools/navigator" },
  openGraph: { title: "Tool Navigator｜Manufacturing Compass", description: "製造データの課題からソフトウェアを探し、比較する。", url: `${siteUrl}/tools/navigator` },
};
export default function ToolNavigatorPage() {
  return <main><StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Tool Navigator", url: `${siteUrl}/tools/navigator`, applicationCategory: "BusinessApplication", operatingSystem: "Web", inLanguage: "ja" }} /><ToolNavigator /></main>;
}
