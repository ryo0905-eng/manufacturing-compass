import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { MeasurementPlanner } from "@/components/MeasurementPlanner";
import { measurementPlanner as meta } from "@/data/measurement-planner";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: meta.title, description: meta.description,
  alternates: { canonical: meta.route }, robots: { index: true, follow: true },
  openGraph: { title: meta.title, description: meta.description, url: `${siteUrl}${meta.route}`, type: "website", locale: "ja_JP", images: [{ url: "/images/measurement-planner-comparison.png", width: 1200, height: 630, alt: "架空例で平均の推定幅と測定数・時間を比較" }] },
  twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: ["/images/measurement-planner-comparison.png"] },
};
export default function MeasurementPlannerPage() {
  return <main className="mini-app-page">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: meta.title, description: meta.description, url: `${siteUrl}${meta.route}`, applicationCategory: "EducationalApplication", operatingSystem: "Web", inLanguage: "ja", dateModified: meta.updatedAt, offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "学習ツール", item: `${siteUrl}/tools` }, { "@type": "ListItem", position: 3, name: "平均の測定計画", item: `${siteUrl}${meta.route}` }] }} />
    <nav aria-label="パンくず"><Link href="/tools">計算・学習ツール</Link> / 平均の測定計画</nav>
    <header className="mini-app-hero"><div><h1>平均の測定計画ツール</h1><p>平均をこの精度で知るには、何個測ればよい？ 想定するばらつきから、精度と測定時間の3案を比較します。</p></div></header>
    <MeasurementPlanner />
    <section className="capability-document" aria-labelledby="planner-method"><h2 id="planner-method">計算方法と前提</h2>
      <p>信頼水準95%、正規分布の係数1.96を使用します。測定数 n = max(1, ceil((1.96 × σ / E)²))、推定幅 Eₙ = 1.96 × σ / √n、測定時間 = n × 1測定の所要時間。測定数は整数へ切り上げ、100万件まで対応します。</p>
      <p>この式は標準偏差が既知の場合の平均推定に基づきます。過去の測定から標準偏差を推定して使う場合、その推定誤差を含めた精度の保証にはなりません。測定数が少ない場合や分布が強く偏る場合、正規近似の妥当性を確認してください。</p>
      <p>95%は同じ方法で繰り返し区間を作った場合の被覆率を指します。個々の測定値の95%がこの幅に収まる、という意味ではありません。有限ロットからの非復元抽出の補正も行いません。</p>
      <p>σとEは同じ単位で入力します。測定器の分解能や測定方法の偏りを、測定数だけで解決できるものではありません。</p>
      <p>出典：<a href={meta.source}>NIST/SEMATECH — Sample sizes required（平均推定の測定数）</a>。式の前提と本文を確認した日・計算仕様更新日：<time dateTime={meta.updatedAt}>{meta.updatedAt}</time>。</p>
    </section>
  </main>;
}
