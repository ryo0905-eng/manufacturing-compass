import { PracticalToolLanguageLink } from "@/components/PracticalToolLanguageLink";
import { practicalToolAlternates } from "@/lib/practical-tool-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { ProcessComparisonTool } from "@/components/ProcessComparisonTool";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";
import styles from "./comparison.module.css";

export const metadata: Metadata = {
  title: "工程条件の比較ツール｜2条件の平均・ばらつき・分布を比較",
  description: "変更前後・装置A/Bの測定値を貼り付けて、平均・標本標準偏差・規格内率と共通スケールの分布図を比較。Excel用コピーとPNG保存に対応。登録不要、ブラウザ内で計算。",
  alternates: practicalToolAlternates("process-comparison", "ja"),
  openGraph: { title: "工程条件の比較ツール｜Manufacturing Compass", description: "2条件の実測データを比較し、報告資料に使える表とPNGを作成。", url: `${siteUrl}/tools/process-comparison` },
};
export default function ProcessComparisonPage() {
  return <main className={styles.page}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "工程条件の比較ツール", url: `${siteUrl}/tools/process-comparison`, applicationCategory: "BusinessApplication", operatingSystem: "Web", inLanguage: "ja", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" }, dateModified: "2026-09-16" }} />
    <nav className={styles.nav} aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">実務ツール</Link><span>/ 工程条件の比較</span></nav>
    <header><h1>工程条件の比較ツール</h1><p>変更前後や装置A・Bの測定値を比較し、報告資料に使える表と分布図を作ります。</p><p className={styles.privacy}><strong>登録不要・ブラウザ内で計算</strong><br />測定値・条件名・計算結果は保存せず、サーバー・Analytics・外部APIへ送信しません。ページを離れると入力は失われます。</p></header>
    <PracticalToolLanguageLink id="process-comparison" locale="ja" />
    <ProcessComparisonTool />
    <nav className={styles.nav} aria-label="関連ツール"><Link href="/tools/cpk">規格に対する工程能力を確認する</Link><Link href="/tools/doe">実験計画法を学ぶ</Link><Link href="/tools/control-chart">時系列の安定性を学ぶ</Link></nav>
    <article className={styles.sources}><h2>数値と分布の読み方</h2><p>平均は測定値の中心、中央値は値を並べたときの中央、標本標準偏差は平均まわりのばらつきの指標です。標本標準偏差は偏差の二乗和を件数−1で割った値の平方根で求めます。</p><p>分布図は同じ区間幅で測定値を区切り、各条件内の割合を表示します。件数が異なる場合も同じ縦軸で見比べられます。規格線を含む共通範囲を5〜20区間に分けるため、離れた規格値では分布が狭く見える場合があります。</p><p>本ツールは入力データの記述統計に限定します。検定・信頼区間・対応ペアの解析は行いません。平均が近いことは同等性の証明ではなく、変更前後の差だけで変更の効果を確定することもできません。</p><h2>出典・更新日</h2><ul><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm">NIST：ばらつきの指標と標本標準偏差</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/histogra.htm">NIST：ヒストグラムと相対度数</a></li></ul><p>最終更新日・出典確認日：<time dateTime="2026-09-16">2026年9月16日</time></p></article>
  </main>;
}
