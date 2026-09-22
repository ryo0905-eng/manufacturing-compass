import type { Metadata } from 'next';
import Link from 'next/link';
import { StructuredData } from '@/components/StructuredData';
import { ProcessExplorer } from '@/components/semiconductor-process/ProcessExplorer';
import { ProcessDiagram } from '@/components/semiconductor-process/ProcessDiagram';
import { journey, processSteps, processCopy, processSources, processRelease, processRoute } from '@/data/semiconductor-process';
import { siteUrl } from '@/lib/format';
import styles from '@/components/semiconductor-process/process.module.css';
export const metadata: Metadata = {
  title: processCopy.title, description: processCopy.description, alternates: { canonical: processRoute }, robots: { index: true, follow: true },
  openGraph: { title: processCopy.title, description: processCopy.description, url: `${siteUrl}${processRoute}`, type: 'website' },
  twitter: { card: 'summary_large_image', title: processCopy.title, description: processCopy.description },
};
export default function SemiconductorProcessPage() {
  return <main className={styles.page}>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: '半導体ができるまで', description: processCopy.description, url: `${siteUrl}${processRoute}`, applicationCategory: 'EducationalApplication', operatingSystem: 'Web', inLanguage: 'ja', dateModified: processRelease.updatedAt, offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' } }}/>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'ホーム', item: siteUrl }, { '@type': 'ListItem', position: 2, name: '学習ツール', item: `${siteUrl}/tools` }, { '@type': 'ListItem', position: 3, name: '半導体ができるまで', item: `${siteUrl}${processRoute}` }] }}/>
    <nav className={styles.breadcrumb} aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">学習ツール</Link><span>/</span><span>半導体ができるまで</span></nav>
    <header className={styles.hero}><p className={styles.eyebrow}>触って分かる工程図鑑 · 教育用 · 約5分</p><h1>{processCopy.heading}</h1><p>膜をつける。模様を写す。選んだ場所を削る。<br/>ウエハの一部分を拡大して、何が変わるのかを確かめましょう。</p><p className={styles.small}>{processCopy.privacy}</p></header>
    <ProcessExplorer/>
    <noscript><p>動かす体験にはJavaScriptが必要です。全体像と工程の解説、下の静止図はそのまま読めます。</p></noscript>
    <article className={styles.document}>
      <h2>前工程と後工程を、流れでつかむ</h2><p>前工程では、ウエハ上に素子と配線を作ります。後工程では、チップの切り分けや接続・保護、検査などを行います。配線形成を指すBEOLと、組み立てを中心とする「後工程」は同じ意味ではありません。</p>
      <details className={styles.detail}><summary>完成までの6地点を文章で読む</summary>{journey.map(item=><section key={item.id}><h3>{item.label}</h3><p>{item.body}</p></section>)}</details>
      <h2>露光・現像・エッチングは、別の役割</h2><p>光でレジストの性質を変え、現像でそのレジストに窓を開け、エッチングで下の膜へ形を移します。光を当てた瞬間にシリコンや下の膜が削れるわけではありません。</p>
      <div className={styles.staticExample}><ProcessDiagram step={5} progress={1}/></div>
      <details className={styles.detail}><summary>8工程の役割と関連記事</summary>{processSteps.map(step=><section key={step.id}><h3>{step.verb}（{step.term}）</h3><p>{step.after}</p><p>{step.explanation}</p><Link href={step.guide}>詳しい記事を読む →</Link></section>)}</details>
      <h2>なぜ、何度も加工するの？</h2><p>場所・材料・目的を変えて、素子や配線の構造を作るためです。洗浄は不要物を除いて次の処理に備え、形を作る加工を支えます。実際の工程には熱処理や研磨などもあり、この例だけを繰り返せば動くチップができるわけではありません。</p>
      <h2>出典・更新日</h2><ul>{processSources.map(source=><li key={source.id}><a href={source.url}>{source.title}</a></li>)}</ul><p>図は公開情報をもとに独自に制作した模式図です。実物の寸法比、特定製品の製造手順や装置性能を示すものではありません。</p><p className={styles.small}>最終更新日：<time dateTime={processRelease.updatedAt}>{processRelease.updatedAt}</time> ／ 出典確認日：<time dateTime={processRelease.sourcesCheckedAt}>{processRelease.sourcesCheckedAt}</time></p>
    </article>
  </main>;
}
