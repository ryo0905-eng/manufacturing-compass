import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { BayesianOptimizationTool } from "@/components/bayesian-optimization/BayesianOptimizationTool";
import { bayesianRelease, bayesianText as text } from "@/data/bayesian-optimization";
import { siteUrl } from "@/lib/format";
import styles from "@/components/bayesian-optimization/bayesian.module.css";

const title = "ベイズ最適化を体験する｜DOEから次の実験を選ぶ";
const description = "架空の成膜工程で温度と圧力を操作。DOEの初期実験、ガウス過程の予測、不確かさ、ベイズ最適化による追加実験を約5分で体験する無料学習アプリです。";
const route = "/tools/bayesian-optimization";
export const metadata: Metadata = {
  title, description, alternates: { canonical: route },
  openGraph: { title, description, url: `${siteUrl}${route}`, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function BayesianOptimizationPage() {
  return <main className={styles.page}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: text.title, description, url: `${siteUrl}${route}`, applicationCategory: "EducationalApplication", operatingSystem: "Web", inLanguage: "ja", dateModified: bayesianRelease.updatedAt, offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "学習ツール", item: `${siteUrl}/tools` }, { "@type": "ListItem", position: 3, name: text.title, item: `${siteUrl}${route}` }] }} />
    <nav className={styles.breadcrumb} aria-label="パンくず"><Link href="/tools">学習ツール</Link><span aria-hidden="true">/</span><span>ベイズ最適化</span></nav>
    <header className={styles.hero}><h1>{text.title}</h1><p>{text.introduction}</p><p className={styles.small}>{text.disclaimer}<br />{text.privacy}</p></header>
    <BayesianOptimizationTool />
    <noscript><p>実験操作にはJavaScriptが必要です。以下の概要・使い方・しくみは、そのまま読めます。</p></noscript>
    <article className={styles.document}>
      <h2>ベイズ最適化とは？ 次の実験を、予測から選ぶ</h2>
      <p>ベイズ最適化は、これまでの観測から予測モデルを作り、良い結果が期待できる場所と、まだ不確かな場所を考慮して次の条件を選ぶ方法です。実験のたびにモデルと推奨を更新します。限られた回数で必ず最良条件に到達するわけではありません。</p>
      <p>このアプリでは、プロセスインフォマティクスに関わる「実験・データ・モデル・次の実験」の循環を、温度と圧力の2変数で体験します。実工程の知識、測定の妥当性、安全性や量産での安定性を置き換えるものではありません。</p>
      <h2>使い方：12回の実験で一周する</h2>
      <ol><li>マップ、スライダー、数値入力のいずれかで条件を選び、まず1回実験します。</li><li>DOEの四隅＋中央を5回まとめて実験します。最初の1回もモデルに使います。</li><li>予測マップを見て、次の1回は自分で条件を選びます。</li><li>残り4回は、自分で選ぶかBOの推奨点を使って実験します。</li><li>実験済みの中でモデルが良いと考える条件を1回測り直し、真の分布と探索経路を振り返ります。</li></ol>
      <h2>DOEとベイズ最適化の関係</h2>
      <p>今回は、初期の範囲を広く調べる方法として、2因子2水準の完全実施要因計画に中心点を1つ加えています。DOEとBOが必須のセットという意味ではありません。BOは既存のデータや別の初期配置からも始められ、DOEは追加調査や確認実験にも利用できます。</p>
      <p>この5点だけで曲率や測定誤差を十分に推定できるとは限りません。実工程では反復、実施順、ロット差、測定システムなどを目的に応じて計画します。<Link href="/tools/doe">DOEの効果・交互作用・確認実験を学ぶ →</Link></p>
      <details className={styles.mechanism} id="mechanism"><summary>{text.mechanism}</summary>
        <h3>膜厚むらと測定ノイズ</h3>
        <p>教材の膜厚むらは「面内膜厚の標準偏差 ÷ 平均膜厚 × 100」で定義し、小さいほど均一です。実際の膜厚測定点は生成せず、この品質指標を直接返します。面内のむらと、同じ条件を測り直した際の測定ノイズは別です。</p>
        <h3>ガウス過程：予測と不確かさ</h3>
        <p>Matérn 5/2カーネルのガウス過程回帰を使います。温度・圧力をそれぞれ0〜1へ正規化し、長さ尺度0.3、信号標準偏差1.5ポイント、既知の測定ノイズ標準偏差0.10ポイントを固定します。平均は初期6観測の平均を固定して使用します。これらは教材用の設定であり、実工程で適切な値とは限りません。</p>
        <p>不確かさマップは、ノイズを除いた平均的な品質（潜在応答）の予測標準偏差です。次回の測定値の予測分散は「潜在応答の分散＋測定ノイズの分散」になります。モデルの仮定が誤っていれば、不確かさが小さくても外れることがあります。</p>
        <p>固定カーネルでは不確かさは主に測定位置と回数で変わり、観測値が予想外だったこと自体で増減するものではありません。測定済みの点でも、ノイズがあるためゼロにはなりません。</p>
        <h3>獲得関数：次に調べる場所の選び方</h3>
        <pre>LCB = 予測平均 − 2 × 潜在応答の予測標準偏差</pre>
        <p>この値が最小の未実験点を次に推奨します。良さの予測と探索の余地を合わせる、ベイズ最適化の一方式です。41×41点をすべて評価し、同点では圧力、温度の昇順を使います。手動では同じ条件を再測定できます。確認実験は、実験済み条件の予測平均が最小の点です。</p>
        <h3>仮想装置の前提</h3>
        <p>温度300〜500℃を5℃刻み、圧力20〜100Paを2Pa刻みで操作します。ノイズは独立な平均0・標準偏差0.10ポイントの正規分布です。交互作用と局所的な起伏を持つ固定の架空関数を使いますが、特定の成膜方式や物理法則を再現していません。</p>
        <p>同じ版（deposition-v1）、シード（20260921）、操作順なら結果を再現できます。DOE順序と測定ノイズは別の乱数列です。予測・推奨には観測済みデータと固定設定だけを渡し、真の応答関数は使いません。</p>
      </details>
      <h2>結果を見るときの注意</h2>
      <p>探索中の改善線は「これまでの観測最小値」で、測定ノイズを含みます。最後に真値へ切り替えると、偶然の好結果との違いを確認できます。比較する最良値は操作可能な41×41点の中での最良値であり、連続空間の厳密な最適解ではありません。</p>
      <p>{text.repeatNote} また、良い条件を見つけることと物理的な原因の解明は別です。このデータから工程能力や量産適合性を判定しません。</p>
      <p><Link href="/tools/taguchi">次はタグチメソッドで、原料状態の変化に強い条件を比べる →</Link></p>
      <h2>出典・更新日</h2>
      <ul><li><a href="https://www.itl.nist.gov/div898/handbook/pri/section3/pri337.htm">NIST：要因計画への中心点の追加</a></li><li><a href="https://gaussianprocess.org/gpml/chapters/RW2.pdf">Rasmussen &amp; Williams：Gaussian Processes for Machine Learning, Chapter 2</a></li><li><a href="https://botorch.org/docs/acquisition">BoTorch：獲得関数</a></li></ul>
      <p>仮想応答関数・画面構成は本教材独自の設計です。出典が本教材の性能を保証するものではありません。</p>
      <p>最終更新日：<time dateTime={bayesianRelease.updatedAt}>{bayesianRelease.updatedAt}</time> ／ 出典確認日：<time dateTime={bayesianRelease.sourcesCheckedAt}>{bayesianRelease.sourcesCheckedAt}</time></p>
    </article>
  </main>;
}
