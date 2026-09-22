import type { Metadata } from 'next';
import Link from 'next/link';
import { StructuredData } from '@/components/StructuredData';
import { CorrelationTool } from '@/components/correlation-causation/CorrelationTool';
import { copy, correlationRelease, correlationRoute, explanations, isCorrelationPublished, sources } from '@/data/correlation-causation';
import { siteUrl } from '@/lib/format';
import styles from '@/components/correlation-causation/correlation.module.css';
export const metadata: Metadata = {
  title: copy.title, description: copy.description,
  alternates: { canonical: correlationRoute },
  robots: { index: isCorrelationPublished(), follow: true },
  openGraph: { title: copy.title, description: copy.description, url: `${siteUrl}${correlationRoute}`, type: 'website' },
  twitter: { card: 'summary_large_image', title: copy.title, description: copy.description },
};
export default function CorrelationPage() {
  return <main className={styles.page}>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: copy.title, description: copy.description, url: `${siteUrl}${correlationRoute}`, applicationCategory: 'EducationalApplication', operatingSystem: 'Web', inLanguage: 'ja', dateModified: correlationRelease.updatedAt, offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' } }}/>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'ホーム', item: siteUrl }, { '@type': 'ListItem', position: 2, name: '学習ツール', item: `${siteUrl}/tools` }, { '@type': 'ListItem', position: 3, name: '相関と因果ラボ', item: `${siteUrl}${correlationRoute}` }] }}/>
    <nav className={styles.breadcrumb} aria-label="パンくず"><Link href="/">ホーム</Link><span aria-hidden="true">/</span><Link href="/tools">学習ツール</Link><span aria-hidden="true">/</span><span>相関と因果ラボ</span></nav>
    <header className={styles.hero}><p className={styles.eyebrow}>教育用 · 約5分{!isCorrelationPublished() && ' · 内容レビュー待ち'}</p><h1>{copy.title}</h1><p>{copy.intro}</p><p>架空の半導体加工工程で「高温ほど不良が多い」を調べます。製品別の見え方と、比較方法を変えた実験結果を確かめましょう。</p><p className={styles.small}>{copy.disclaimer}<br/>{copy.privacy}</p></header>
    <CorrelationTool/>
    <nav className={styles.breadcrumb} aria-label="関連ツール"><Link href="/tools/improvement-confidence">比較方法の次は、平均差と推定の幅を体験する →</Link></nav>
    <noscript><p>操作にはJavaScriptが必要です。以下の解説と出典はそのまま読めます。</p></noscript>
    <article className={styles.document}>{explanations.map(section => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
      <h2>出典・更新日</h2><ul>{sources.map(source => <li key={source.url}><a href={source.url}>{source.title}</a></li>)}</ul><p>架空数値・生成ルール・体験の構成は独自の教材設計です。出典がこの教材や実工程の性能を保証するものではありません。</p><p>最終更新日：<time dateTime={correlationRelease.updatedAt}>{correlationRelease.updatedAt}</time> ／ 出典確認日：<time dateTime={correlationRelease.sourcesCheckedAt}>{correlationRelease.sourcesCheckedAt}</time></p>
    </article>
  </main>;
}
