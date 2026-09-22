import { workRoles, workNote, workSources, workRelease, assemblyWorkRoles, assemblyWorkSources, interconnectWorkRoles, interconnectWorkSources } from '@/data/semiconductor-work';
import { waferPreparationCopy, waferPreparationSteps } from '@/data/semiconductor-wafer-preparation';
import { WaferPreparationDiagram } from '@/components/semiconductor-process/WaferPreparationDiagram';
import { testingCopy, testingLessons, testingModes, testingSteps } from '@/data/semiconductor-testing';
import { TestingDiagram, TestingReadout } from '@/components/semiconductor-process/TestingDiagram';
import { interconnectSteps, interconnectCopy } from '@/data/semiconductor-interconnect';
import { InterconnectDiagram } from '@/components/semiconductor-process/InterconnectDiagram';
import { assemblySteps, assemblyCopy } from '@/data/semiconductor-assembly';
import { AssemblyDiagram } from '@/components/semiconductor-process/AssemblyDiagram';
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
    <header className={styles.hero}><p className={styles.eyebrow}>触って分かる工程図鑑 · 教育用 · 各体験 約3〜5分</p><h1>{processCopy.heading}</h1><p>膜に形を作る前工程。チップを切り分け、つなぎ、保護する後工程。<br/>ウエハ準備・加工・組立・検査を6つの体験で動かして、ウエハから製品になる流れを確かめましょう。</p><p className={styles.small}>{processCopy.privacy}</p></header>
    <ProcessExplorer/>
    <noscript><p>動かす体験にはJavaScriptが必要です。全体像と工程の解説、下の静止図はそのまま読めます。</p></noscript>
    <article className={styles.document}>
      <h2>前工程と後工程を、流れでつかむ</h2><p>前工程では、ウエハ上に素子と配線を作ります。後工程では、チップの切り分けや接続・保護、検査などを行います。配線形成を指すBEOLと、組み立てを中心とする「後工程」は同じ意味ではありません。</p>
      <details className={styles.detail}><summary>完成までの6地点を文章で読む</summary>{journey.map(item=><section key={item.id}><h3>{item.label}</h3><p>{item.body}</p></section>)}</details>
      <h2>{waferPreparationCopy.heading}</h2><p>{waferPreparationCopy.intro}</p><div className={styles.staticExample}><WaferPreparationDiagram step="wafer-clean-check" progress={1}/></div><details className={styles.detail}><summary>ウエハ準備8工程の役割と関連記事</summary>{waferPreparationSteps.map(step=><section key={step.id}><h3>{step.verb}（{step.term}）</h3><p>{step.after}</p><p>{step.explanation}</p><Link href={step.guide}>詳しい記事を読む →</Link></section>)}</details><p>{waferPreparationCopy.limits}</p>
      <h2>露光・現像・エッチングは、別の役割</h2><p>光でレジストの性質を変え、現像でそのレジストに窓を開け、エッチングで下の膜へ形を移します。光を当てた瞬間にシリコンや下の膜が削れるわけではありません。</p>
      <div className={styles.staticExample}><ProcessDiagram step={5} progress={1}/></div>
      <details className={styles.detail}><summary>8工程の役割と関連記事</summary>{processSteps.map(step=><section key={step.id}><h3>{step.verb}（{step.term}）</h3><p>{step.after}</p><p>{step.explanation}</p><Link href={step.guide}>詳しい記事を読む →</Link></section>)}</details>
      <h2>なぜ、何度も加工するの？</h2><p>場所・材料・目的を変えて、素子や配線の構造を作るためです。洗浄は不要物を除いて次の処理に備え、形を作る加工を支えます。実際の工程には熱処理や研磨などもあり、この例だけを繰り返せば動くチップができるわけではありません。</p>
      <h2>{assemblyCopy.heading}</h2><p>{assemblyCopy.intro}</p><p>固定・電気的な接続・保護は別の役割です。組立が終わっても最終検査が必要です。</p><div className={styles.staticExample}><AssemblyDiagram step="trim-form" progress={1} inside/></div><p className={styles.small}>内部を見る模式図です。実際の樹脂が透明なわけではありません。</p><details className={styles.detail}><summary>組立7工程の役割と関連記事</summary>{assemblySteps.map(step=><section key={step.id}><h3>{step.verb}（{step.term}）</h3><p>{step.after}</p><p>{step.explanation}</p><Link href={step.guide}>詳しい記事を読む →</Link></section>)}</details><p>{assemblyCopy.limits}</p>
      <h2>{interconnectCopy.heading}</h2><p>{interconnectCopy.intro}</p><p>溝に横方向の配線、穴に上下の接続を作ります。CMPは表面の余分な金属と導電性下地を取り除き、必要な接続を残して隣り合う配線を隔てます。</p><div className={styles.staticExample}><InterconnectDiagram step="cap" progress={1} connected/></div><p className={styles.small}>破線は接続経路の強調です。電流や動作のシミュレーションではありません。</p><details className={styles.detail}><summary>配線7工程の役割と関連記事</summary>{interconnectSteps.map(step=><section key={step.id}><h3>{step.verb}（{step.term}）</h3><p>{step.after}</p><p>{step.explanation}</p><Link href={step.guide}>詳しい記事を読む →</Link></section>)}</details><p>{interconnectCopy.limits}</p>
      <h2>{testingCopy.heading}</h2><p>見た目の検査と電気的な試験は別です。電極や端子へ接触し、テスタで信号を与えて応答を受け取り、期待や規格と比べます。</p>{testingModes.map(mode=><section key={mode}><h3>{testingLessons[mode].heading}</h3><p>{testingLessons[mode].intro}</p><div className={styles.staticExample}><TestingDiagram mode={mode} step={3} progress={1}/></div><TestingReadout mode={mode} step={3} progress={1}/><details className={styles.detail}><summary>{mode==='wafer-test'?'ウエハ検査':'最終検査'}4工程の役割と関連記事</summary>{testingSteps(mode).map(step=><section key={step.id}><h3>{step.verb}</h3><p>{step.after}</p><p>{step.explanation}</p><Link href={step.guide}>詳しい記事を読む →</Link></section>)}</details></section>)}<p>{testingCopy.limits}</p>
      <h2>薄膜加工を支える仕事</h2><p>加工条件を整える人、装置の調子を保つ人、測定・検査で確かめる人。体験のまとめでは、3つの役割を図で見られます。</p><p>{workNote}</p>
      <details className={styles.detail}><summary>3つの仕事を文章で読む</summary>{workRoles.map(role=><section key={role.id}><h3>{role.label}</h3><p>{role.name}</p><p>困りごと：{role.problem}</p><p>調べること：{role.investigate}</p><p>関わる人：{role.people}</p><p>{role.next}</p><Link href={role.guide}>{role.guideLabel} →</Link></section>)}</details>
      <p className={styles.small}>職種名や募集状況の一覧ではなく、公開された職務説明から役割を紹介しています。計測・検査と品質保証は同じ職種とは限りません。</p><ul>{workSources.map(source=><li key={source.id}><a href={source.url}>{source.title}</a></li>)}</ul><p className={styles.small}>仕事紹介の更新・出典確認日：<time dateTime={workRelease.updatedAt}>{workRelease.updatedAt}</time></p>
      <h2>切り分け・組み立てを支える仕事</h2><p>組立条件を整える人、装置を支える人、品質を確かめる人。固定・接続・保護の役割を、仕事の側から見直します。</p><p>{workNote}</p>
      <details className={styles.detail}><summary>組立を支える3つの仕事を文章で読む</summary>{assemblyWorkRoles.map(role=><section key={role.id}><h3>{role.label}</h3><p>{role.name}</p><p>困りごと：{role.problem}</p><p>調べること：{role.investigate}</p><p>関わる人：{role.people}</p><p>{role.next}</p><Link href={role.guide}>{role.guideLabel} →</Link></section>)}</details>
      <p className={styles.small}>企業の公開職務説明を役割の参考にしています。国内の統一職種名や募集中の求人を示すものではありません。</p><ul>{assemblyWorkSources.map(source=><li key={source.id}><a href={source.url}>{source.title}</a></li>)}</ul><p className={styles.small}>組立の仕事紹介の更新・出典確認日：<time dateTime={workRelease.updatedAt}>{workRelease.updatedAt}</time></p>
      <h2>配線づくり・CMPを支える仕事</h2><p>表面の余分な導電膜を除き、溝や穴に必要な金属を残す。そのための条件・装置・測定を、それぞれの仕事から見てみましょう。</p><p>{workNote}</p>
      <details className={styles.detail}><summary>配線・CMPを支える3つの仕事を文章で読む</summary>{interconnectWorkRoles.map(role=><section key={role.id}><h3>{role.label}</h3><p>{role.name}</p><p>困りごと：{role.problem}</p><p>調べること：{role.investigate}</p><p>関わる人：{role.people}</p><p>{role.next}</p><Link href={role.guide}>{role.guideLabel} →</Link></section>)}</details>
      <p className={styles.small}>公開職務説明を役割の参考にしています。募集中の求人や統一された担当範囲を示すものではありません。計測・検査と品質保証は同じ職種とは限りません。</p><ul>{interconnectWorkSources.map(source=><li key={source.id}><a href={source.url}>{source.title}</a></li>)}</ul><p className={styles.small}>配線・CMPの仕事紹介の更新・出典確認日：<time dateTime={workRelease.updatedAt}>{workRelease.updatedAt}</time></p>
      <h2>出典・更新日</h2><ul>{processSources.map(source=><li key={source.id}><a href={source.url}>{source.title}</a></li>)}</ul><p>図は公開情報をもとに独自に制作した模式図です。実物の寸法比、特定製品の製造手順や装置性能を示すものではありません。</p><p className={styles.small}>最終更新日：<time dateTime={processRelease.updatedAt}>{processRelease.updatedAt}</time> ／ 出典確認日：<time dateTime={processRelease.sourcesCheckedAt}>{processRelease.sourcesCheckedAt}</time></p>
    </article>
  </main>;
}
