import type { Metadata } from 'next';
import Link from 'next/link';
import { StructuredData } from '@/components/StructuredData';
import { ImprovementTool } from '@/components/improvement-confidence/ImprovementTool';
import { copy, improvementRoute, improvementRelease, sources } from '@/data/improvement-confidence';
import { siteUrl } from '@/lib/format';
import styles from '@/components/improvement-confidence/improvement.module.css';
export const metadata: Metadata = {
  title: copy.title, description: copy.description, alternates: { canonical: improvementRoute }, robots: { index: true, follow: true },
  openGraph: { title: copy.title, description: copy.description, url: `${siteUrl}${improvementRoute}`, type: 'website' },
  twitter: { card: 'summary_large_image', title: copy.title, description: copy.description },
};
export default function ImprovementPage() {
  return <main className={styles.page}>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: copy.title, description: copy.description, url: `${siteUrl}${improvementRoute}`, applicationCategory: 'EducationalApplication', operatingSystem: 'Web', inLanguage: 'ja', dateModified: improvementRelease.updatedAt, offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' } }}/>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'ホーム', item: siteUrl }, { '@type': 'ListItem', position: 2, name: '学習ツール', item: `${siteUrl}/tools` }, { '@type': 'ListItem', position: 3, name: '改善の差を見極める', item: `${siteUrl}${improvementRoute}` }] }}/>
    <nav className={styles.breadcrumb} aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">学習ツール</Link><span>/</span><span>改善の差を見極める</span></nav>
    <header className={styles.hero}><p className={styles.small}>教育用 · 案内付き約5分＋自由実験</p><h1>{copy.heading}</h1><p>平均値が変わって見える。その差はどれくらい確かで、実務上ほしい改善幅に届くのでしょうか。</p><p className={styles.small}>{copy.model}</p><p className={styles.small}>{copy.privacy}</p></header>
    <ImprovementTool/>
    <noscript><p>操作にはJavaScriptが必要です。以下の解説と出典はそのまま読めます。</p></noscript>
    <article className={styles.document}>
      <h2>平均差と、推定の幅を分けて読む</h2><p>平均差は「変更前の平均−変更後の平均」です。点は今回のサンプルから求めた差、横線はその推定の幅です。差ゼロの線と、実務上ほしい改善幅の線を別々に見比べます。量産への採用を自動判定するものではありません。</p>
      <h2>測定数を増やすと何が変わる？</h2><p>真の平均差は測定数で変わりません。標本平均は取り出すサンプルによって揺れます。同じばらつきなら測定数が多いほど推定の精度は高まりますが、測定を追加するたびに区間が必ず狭くなるわけではありません。</p><p>測定数を増やしても、比較方法の偏りや交絡は解消できません。実工程では測定の信頼性、無作為化、独立性、工程の安定性も確かめます。</p>
      <details><summary>95%信頼区間の意味と計算式</summary><p>{copy.interval}</p><p>区間がゼロを含んでも「差がない」「同等」と証明したことにはなりません。独立した正規分布の2群を前提に、等分散を仮定しないWelch方式を使います。p値や必要サンプル数は算出しません。</p><div className={styles.formula}><p>平均差 d = 平均A − 平均B</p><p>標準誤差 SE = √(sA²/nA + sB²/nB)</p><p>自由度 ν = (sA²/nA + sB²/nB)² ÷ ((sA²/nA)²/(nA−1) + (sB²/nB)²/(nB−1))</p><p>区間 = d ± t(0.975, ν) × SE</p><p>s²は不偏分散、nは測定数。表示のみ小数2桁に丸め、計算と基準線との比較は丸め前の値を使います。</p></div></details>
      <h2>出典・更新日</h2><ul>{sources.map(source => <li key={source.url}><a href={source.url}>{source.title}</a></li>)}</ul><p>架空値・生成ルール・学習構成は独自の教材です。実設備の推奨条件や性能保証ではありません。</p><p className={styles.small}>最終更新日：<time dateTime={improvementRelease.updatedAt}>{improvementRelease.updatedAt}</time> ／ 出典確認日：<time dateTime={improvementRelease.sourcesCheckedAt}>{improvementRelease.sourcesCheckedAt}</time></p>
    </article>
  </main>;
}
