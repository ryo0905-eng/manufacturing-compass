import { StatisticsCourseCta } from "@/components/StatisticsCourseCta";
import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { YieldAnalysisApp } from "@/components/YieldAnalysisApp";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "歩留まり解析ツール｜低下の検知・製品別／装置別の比較",
  description: "製造業の歩留まり低下をp管理図で検知し、製品別・装置別・製品構成比で調べる条件を絞る無料ツール。CSVはブラウザ内だけで解析します。",
  alternates: { canonical: "/tools/yield-analysis" },
  openGraph: {
    title: "歩留まり解析ツール｜低下の検知・製品別／装置別の比較",
    description: "いつ下がったか、どの製品・装置か、構成比の影響かをブラウザ内で比較します。",
    url: `${siteUrl}/tools/yield-analysis`,
    type: "website",
  },
};

export default function YieldAnalysisPage() {
  return <main className="yield-analysis-page">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "歩留まり解析ツール", description: "製造業の歩留まり低下をp管理図と製品別・装置別比較で調べる条件を絞るブラウザ内解析ツール", url: `${siteUrl}/tools/yield-analysis`, applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" }, inLanguage: "ja" }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "実務ツール", item: `${siteUrl}/tools` }, { "@type": "ListItem", position: 3, name: "歩留まり解析", item: `${siteUrl}/tools/yield-analysis` }] }} />
    <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">実務ツール</Link><span>/</span><span>歩留まり解析</span></nav>
    <header className="yield-analysis-hero"><div><p className="section-label">YIELD DROP INVESTIGATION</p><h1>歩留まり解析ツール</h1><p>低下を見つけ、製品・装置・構成比に分けて、調べるべき条件を絞ります。</p></div><p><strong>登録不要・ブラウザ内で解析</strong><span>アップロードしたデータは保存・外部送信しません。</span></p></header>
    <YieldAnalysisApp />
    <article className="yield-analysis-guide">
      <header><p className="section-label">HOW TO INVESTIGATE</p><h2>歩留まり低下の原因を、どう調べるか</h2><p>全体の数字だけで原因を決めず、時系列、製品、装置の順に条件を揃えます。</p></header>
      <div><section><span>01</span><h3>不良率の異常を時系列で見る</h3><p>基準期間を固定し、日ごとの検査数に合わせたp管理図で、通常のばらつきから外れた悪化を確認します。複数製品を混ぜた全体は参考とし、製品を選んで判定します。</p></section><section><span>02</span><h3>製品・装置で層別する</h3><p>検査数と不良品数を合算して比較します。装置差を見るときは同じ製品へ絞り、製品構成の違いを装置差と読み違えないようにします。</p></section><section><span>03</span><h3>記録と現物で仮説を確かめる</h3><p>保全、材料ロット、レシピ、治工具、検査条件の履歴をシグナル時刻と照合します。一致は原因の証明ではないため、現物確認や再現性で確かめます。</p></section></div>
      <aside><strong>計算根拠</strong><p>p管理図は、良品／不良品の二項データを対象とするNIST/SEMATECHの説明と3σ式を確認しています。初版では正規近似が難しい少数・低不良率や、過分散・依存性に対する高度な補正は行いません。</p><a href="https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc332.htm" rel="noreferrer" target="_blank">NIST/SEMATECH: Proportions Control Charts ↗</a></aside>
    </article>
    <nav className="tool-related-links" aria-label="関連ツールと解説"><span>関連ツール</span><Link href="/tools/yield-dashboard">架空工場で原因調査を体験 →</Link><Link href="/tools/control-chart">管理図の判定ルールを学ぶ →</Link><Link href="/tools/oee">不良ロスをOEEで見る →</Link><Link href="/guides/six-sigma">DMAICで調査の流れを整理 →</Link></nav>
  <StatisticsCourseCta sourcePage="/tools/yield-analysis" />
  </main>;
}
