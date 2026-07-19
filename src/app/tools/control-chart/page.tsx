import type { Metadata } from "next";
import Link from "next/link";
import { ControlChartLearningTool } from "@/components/ControlChartLearningTool";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = { title: "管理図学習ツール｜Xbar-R・I-MRと異常ルールを理解", description: "Xbar-RとI-MR管理図で異常を動かし、Western Electric・Nelsonルール、管理限界と規格限界の違いを学べる無料ツールです。", alternates: { canonical: "/tools/control-chart" } };

export default function ControlChartPage(){return <main className="control-chart-page">
  <StructuredData data={{"@context":"https://schema.org","@type":"WebApplication",name:"管理図学習ツール",url:`${siteUrl}/tools/control-chart`,applicationCategory:"EducationalApplication",operatingSystem:"Web",offers:{"@type":"Offer",price:"0",priceCurrency:"JPY"},inLanguage:"ja"}} />
  <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">実務ツール</Link><span>/</span><span>管理図</span></nav>
  <header className="control-chart-hero"><div><h1>管理図 学習ツール</h1><p>測定方法と判定ルールを選び、異常の見え方を時系列で理解します。</p></div><p><strong>Xbar-R・I-MR</strong><span>Western Electric・Nelson対応</span></p></header>
  <ControlChartLearningTool />
  <article className="control-chart-document"><header><p className="section-label">PRACTICAL SUMMARY</p><h2>管理図は、データの取り方から選ぶ</h2><p>同じ時点で複数個を測るならXbar-R、1個ずつならI-MRが入口です。Xbar-Rでは、まずR管理図で群内ばらつきを確認してからXbar管理図を読みます。</p></header><div><section><h3>判定ルール</h3><p>基本の3σ、Western Electric、Nelsonでは感度が異なります。ルールを増やすほど小さな変化を検出しやすくなりますが、誤警報も増えます。</p></section><section><h3>管理限界と規格限界</h3><p>管理限界は工程データ、規格限界は製品要求から決まります。管理状態と規格適合は別の判断です。</p></section><section><h3>検出後の行動</h3><p>原因を断定せず、設備、材料、測定器、作業者、環境、変更履歴を検出時刻と照合します。</p></section></div></article>
  <nav className="tool-related-links" aria-label="関連ツール"><span>関連ツール</span><Link href="/tools/cpk">工程能力を確認する →</Link><Link href="/tools/doe">実験計画法を学ぶ →</Link></nav>
</main>}
