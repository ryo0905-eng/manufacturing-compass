import type { Metadata } from 'next';
import Link from 'next/link';
import { StructuredData } from '@/components/StructuredData';
import { TaguchiTool } from '@/components/taguchi/TaguchiTool';
import { text, taguchiRelease } from '@/data/taguchi';
import { siteUrl } from '@/lib/format';
import styles from '@/components/taguchi/taguchi.module.css';
const title = `${text.title}｜${text.subtitle}`;
const description = '架空の成膜工程で原料状態を変え、ばらつきに強い条件を探す無料学習アプリ。L9の実験配置、望小特性のSN比、基準と候補の確認実験をグラフで体験できます。';
const route = '/tools/taguchi';
export const metadata: Metadata = { title, description, alternates: { canonical: route }, openGraph: { title, description, url: `${siteUrl}${route}`, type: 'website' }, twitter: { card: 'summary_large_image', title, description } };
export default function TaguchiPage() {
  return <main className={styles.page}>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: title, description, url: `${siteUrl}${route}`, applicationCategory: 'EducationalApplication', operatingSystem: 'Web', inLanguage: 'ja', dateModified: taguchiRelease.updatedAt, offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' } }} />
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'ホーム', item: siteUrl }, { '@type': 'ListItem', position: 2, name: '学習ツール', item: `${siteUrl}/tools` }, { '@type': 'ListItem', position: 3, name: text.title, item: `${siteUrl}${route}` }] }} />
    <nav className={styles.breadcrumb} aria-label="パンくず"><Link href="/tools">学習ツール</Link><span aria-hidden="true">/</span><span>タグチメソッド</span></nav>
    <header className={styles.hero}><h1>{text.title}<span>{text.subtitle}</span></h1><p>{text.intro}</p><p className={styles.small}>{text.disclaimer}<br />{text.privacy}</p></header>
    <TaguchiTool />
    <noscript><p>実験操作にはJavaScriptが必要です。以下の概要・使い方・しくみはそのまま読めます。</p></noscript>
    <article className={styles.document}>
      <h2>タグチメソッドで、誤差に強い条件を探す</h2>
      <p>タグチメソッドのパラメータ設計では、調整できる制御因子と、量産や使用時に揃えにくい誤差因子を分けます。実験では誤差因子も意図的に変え、その影響を受けにくい条件を探します。</p>
      <p>この教材は、静特性・望小特性のパラメータ設計の入口です。タグチメソッド全体を網羅するものではありません。動特性、望大・望目特性、許容差設計は扱いません。</p>
      <h2>使い方：普段の良さから、変化への強さへ</h2>
      <ol><li>温度×圧力の9条件を通常環境で1回ずつ実験し、基準条件を選びます。</li><li>基準条件を原料特性の3状態で2回ずつ測り、スライダーで違いを見ます。</li><li>残る8条件も同じ誤差条件で測り、基準と候補の線を比べます。</li><li>SN比を参考に候補を選びます。基準と同じ条件でも構いません。</li><li>基準と候補を、新しい3状態×3反復の測定で確認します。</li></ol>
      <p>計81回の仮想実験を一括操作で進めます。ボタンを81回押す必要はありません。スライダーは取得済みの測定表示を切り替え、実験回数を増やしません。</p>
      <h2>制御因子と誤差因子</h2>
      <p>制御因子は温度360／400／440℃と圧力40／60／80Pa。誤差因子は原料の反応しやすさを表す低い／基準／高いの相対水準です。実物の物性値や管理規格ではありません。</p>
      <p>膜厚むらは教材上「面内膜厚の標準偏差÷平均膜厚×100」の指標で、小さいほど均一です。個々の膜厚測定点は生成せず、品質指標を直接返します。面内の膜厚むら、原料状態による品質の変化、測定ノイズは区別します。</p>
      <details><summary>{text.mechanism}：実験配置・SN比・モデルの前提</summary>
        <h3>L9の内側と、誤差条件の外側</h3>
        <p>L9直交表の第1・第2列に温度と圧力を割り付けます。今回は2因子3水準の全9組み合わせに一致し、実験回数を削減していません。外側は誤差因子1つの3水準。それぞれ2反復し、9×3×2＝54観測を比較に使います。</p>
        <p>最初の通常環境9観測はSN比へ含めません。基準状態だけの重みを増やさず、3状態を等しく比較します。この重みは教材の試験計画であり、量産時に各原料状態が現れる確率ではありません。実施順はバッチ内でランダム化し、時系列のドリフトはモデル化しません。</p>
        <h3>望小特性のSN比</h3>
        <pre>{'SN比 = −10 log10{Σ(y²) / n}'}</pre>
        <p>各条件の6観測を、それぞれ二乗してから平均します。状態ごとの平均を二乗する計算ではありません。SN比は大きいほど良く、負の値も正常です。小さなばらつきだけでなく、品質値の大きさも反映するため、純粋な標準偏差や合格確率とは異なります。</p>
        <p>因子水準別の応答図は、その水準を含む3条件のSN比を平均して示します。因子ごとの最高水準を組み合わせれば必ず最良になるとは限りません。補助表示する候補は、実験済み9条件の観測SN比最大点です。同値ではL9行順で選びます。</p>
        <h3>仮想装置と再現性</h3>
        <p>固定の架空関数が、制御因子によって誤差因子への感度が変わる様子を表します。物理的な成膜機構のモデルではなく、ベイズ最適化アプリとも別の仮想装置です。条件・測定値の引き継ぎはしません。</p>
        <p>測定ノイズは−0.03〜+0.03パーセントポイントの一様分布です。SN比の計算に正規分布は仮定しません。版taguchi-deposition-v1、シード20260921、同じ実験IDで同じ測定を再現します。確認には独立した乱数列を使い、同じ条件を2群に選んでも別測定になります。</p>
      </details>
      <h2>確認結果の読み方と限界</h2>
      <p>確認では基準と候補をそれぞれ9回測り直します。SN比の差が±0.10 dB未満なら教材上「差が小さい」と表示しますが、有意差検定や同等性の証明ではありません。改善しない結果でも体験は完了します。</p>
      <p>{text.sdLimit} {text.resultLimit} 原料以外の誤差因子、安全性、長期安定性も別途検討が必要です。このデータからCpkや量産適合性を判定しません。</p>
      <p><Link href="/tools/doe">DOEで効果・交互作用を学ぶ</Link> ／ <Link href="/tools/bayesian-optimization">予測から次の実験を選ぶ体験へ</Link></p>
      <h2>出典・更新日</h2>
      <ul><li><a href="https://www.itl.nist.gov/div898/handbook/pri/section5/pri56.htm">NIST：Taguchi designs、内側・外側の実験計画</a></li><li><a href="https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/doe/supporting-topics/taguchi-designs/what-is-the-signal-to-noise-ratio/">Minitab：タグチ計画のSN比</a></li></ul>
      <p>仮想応答関数と体験フローは独自の教材設計です。出典が本教材の性能を保証するものではありません。</p>
      <p>最終更新日：<time dateTime={taguchiRelease.updatedAt}>{taguchiRelease.updatedAt}</time> ／ 出典確認日：<time dateTime={taguchiRelease.sourcesCheckedAt}>{taguchiRelease.sourcesCheckedAt}</time></p>
    </article>
  </main>;
}
