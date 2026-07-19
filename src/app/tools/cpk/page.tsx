import type { Metadata } from "next";
import Link from "next/link";
import { CpkCalculator } from "@/components/CpkCalculator";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "Cp・Cpk計算ツール｜生データ貼り付け・登録不要",
  description: "測定データまたは平均・標準偏差から、Cp・Cpk・Cpu・Cplを無料で計算。Excelの列を貼り付けでき、入力データは保存しません。",
  alternates: { canonical: "/tools/cpk" },
  openGraph: {
    title: "Cp・Cpk計算ツール｜Manufacturing Compass",
    description: "測定データを貼り付けて工程能力指数をブラウザ内で計算できます。登録不要・データ保存なし。",
    url: `${siteUrl}/tools/cpk`,
  },
};

export default function CpkToolPage() {
  return (
    <main className="cpk-page">
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Cp・Cpk計算ツール",
        url: `${siteUrl}/tools/cpk`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
        inLanguage: "ja",
      }} />
      <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span aria-hidden="true">/</span><span>Cp・Cpk計算</span></nav>
      <header className="cpk-hero">
        <p className="section-label">QUALITY TOOL / PROCESS CAPABILITY</p>
        <h1>Cp・Cpk計算ツール</h1>
        <p>測定データを貼り付けるだけで、工程能力指数を確認できます。登録不要で、入力データは端末の外へ送信しません。</p>
        <ul aria-label="ツールの特徴"><li>Excelから貼り付け</li><li>片側規格に対応</li><li>データ保存なし</li></ul>
      </header>

      <CpkCalculator />

      <section className="cpk-guide" aria-labelledby="cpk-guide-title">
        <p className="section-label">HOW TO READ</p>
        <h2 id="cpk-guide-title">CpとCpkの違い</h2>
        <div>
          <article><span>Cp</span><h3>ばらつきと規格幅を見る</h3><p>工程平均の偏りを考慮せず、規格幅に対して工程のばらつきがどの程度収まるかを示します。</p></article>
          <article><span>Cpk</span><h3>平均の偏りも含めて見る</h3><p>上限側のCpuと下限側のCplの小さい方です。平均が規格中心からずれると、Cpより小さくなります。</p></article>
        </div>
        <aside>
          <strong>計算前に確認したいこと</strong>
          <p>Cp・Cpkだけでは工程が統計的に安定しているか判断できません。管理図などで特殊原因の有無を確認し、データの分布、測定システム、サンプリング方法も合わせて評価してください。1.33などの基準値は一般的な目安であり、顧客要求や社内基準を優先してください。</p>
        </aside>
      </section>
    </main>
  );
}
