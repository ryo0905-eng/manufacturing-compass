import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/StructuredData";
import { EarningsInternalLink, EarningsSourceLink, EarningsView } from "@/components/earnings/EarningsLinks";
import { EarningsShell } from "@/components/earnings/EarningsShell";
import { earningsCompanyName, earningsCompanySlug, earningsFinancialScope, earningsMetricText, earningsReleases, earningsSegmentName, earningsSourceHref, earningsUnitName, getEarningsRelease, type EarningsRelease, type EarningsStatement } from "@/lib/earnings";
import { siteUrl } from "@/lib/format";
import styles from "@/components/earnings/Earnings.module.css";

type Props = { params: Promise<{ companyId: string }> };
export function generateStaticParams() { return earningsReleases.map((release) => ({ companyId: release.companyId })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { companyId } = await params;
  const release = getEarningsRelease(companyId);
  if (!release) return {};
  const name = earningsCompanyName(companyId);
  return { title: `${name}の決算・IR要点｜Chip Pulse`, description: `${name}の${release.period.label}の業績、成長要因、見通しを公式資料に基づき整理。`, alternates: { canonical: `/semiconductor-watch/earnings/${companyId}` }, openGraph: { title: `${name}の決算・IR要点`, type: "article", url: `/semiconductor-watch/earnings/${companyId}` } };
}

function EvidenceList({ release, items }: { release: EarningsRelease; items: EarningsStatement[] }) {
  return <ul className={styles.evidenceList}>{items.map((item) => { const href = earningsSourceHref(release, item.source); return <li key={item.text}>{item.text}{href ? <span><EarningsSourceLink href={href} companyId={release.companyId} documentId={item.source.documentId}>根拠：{item.source.locator} ↗</EarningsSourceLink></span> : null}</li>; })}</ul>;
}

export default async function EarningsDetailPage({ params }: Props) {
  const { companyId } = await params;
  const release = getEarningsRelease(companyId);
  if (!release) notFound();
  const name = earningsCompanyName(companyId);
  const revision = release.forecastRevision;
  return <EarningsShell>
    <EarningsView companyId={companyId} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebPage", name: `${name}の決算・IR要点`, url: `${siteUrl}/semiconductor-watch/earnings/${companyId}`, dateModified: release.checkedAt, citation: release.documents.map((document) => document.url) }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "業界ウォッチ", item: `${siteUrl}/semiconductor-watch` }, { "@type": "ListItem", position: 2, name: "決算・IR", item: `${siteUrl}/semiconductor-watch/earnings` }, { "@type": "ListItem", position: 3, name, item: `${siteUrl}/semiconductor-watch/earnings/${companyId}` }] }} />
    <article className={styles.detail}>
      <header className={styles.hero}><p className={styles.eyebrow}>EARNINGS DETAIL / {earningsSegmentName(release.segment)} / {release.business}</p><h1>{name}の決算を読む</h1><p>{release.period.label} · {release.period.start ? `${release.period.start}〜` : "期首未取得 / 終了日 "}{release.period.end}</p><small>発表 {release.announcedAt} · 情報確認 {release.checkedAt} · データ第{release.version}版</small></header>
      <div className={styles.detailLayout}>
        <div>
          <section className={styles.brief}><p className={styles.eyebrow}>THREE POINTS</p><h2>今回の決算で押さえること</h2><EvidenceList release={release} items={release.highlights} /></section>
          <section className={styles.section}><p className={styles.eyebrow}>RESULTS</p><h2>主要数値</h2><p className={styles.fine}>数値範囲：{earningsFinancialScope(release)}。{release.period.kind === "quarter" ? "単四半期" : release.period.kind === "cumulative" ? "累計" : "通期"}実績。{release.accountingStandard}、{release.currency}建て、原資料単位は{earningsUnitName(release)}。会社予想ではありません。</p><dl className={styles.detailMetrics}>{(["revenue", "operatingIncome", "revenueYoY"] as const).map((key) => { const metric = release.metrics[key]; const label = key === "revenue" ? "売上高" : key === "operatingIncome" ? "営業利益" : "売上高・前年同期比"; const href = metric.status === "reported" ? earningsSourceHref(release, metric.source) : null; return <div key={key}><dt>{label}</dt><dd>{earningsMetricText(metric, release, key === "revenueYoY")}</dd><small>{metric.status === "reported" ? <>{metric.calculation ? `算出：${metric.calculation} · ` : ""}{href ? <EarningsSourceLink href={href} companyId={companyId} documentId={metric.source.documentId}>{metric.source.locator} ↗</EarningsSourceLink> : null}</> : metric.reason}</small></div>; })}</dl></section>
          <section className={styles.section}><p className={styles.eyebrow}>COMPANY EXPLANATION</p><h2>何が伸び、何を確認したいか</h2><h3>伸びた部分・会社が挙げた要因</h3><EvidenceList release={release} items={release.growth} /><h3>弱かった部分・資料で分からないこと</h3><EvidenceList release={release} items={release.weakness} /><h3>懸念点・読み方の注意</h3><EvidenceList release={release} items={release.concerns} /></section>
          <section className={styles.section}><p className={styles.eyebrow}>OUTLOOK</p><h2>会社の見通し</h2><EvidenceList release={release} items={release.outlook} /><div className={styles.revision}><strong>会社予想：{revision.status === "up" ? "上方修正" : revision.status === "down" ? "下方修正" : revision.status === "flat" ? "据え置き" : revision.status === "unpublished" ? "未公表" : "改定方向は未確認"}</strong><p>{revision.target} · {revision.text}</p>{revision.source ? <p><EarningsSourceLink href={earningsSourceHref(release, revision.source) ?? "#"} companyId={companyId} documentId={revision.source.documentId}>今回の根拠 ↗</EarningsSourceLink>{revision.previousSource && earningsSourceHref(release, revision.previousSource) ? <> ／ <EarningsSourceLink href={earningsSourceHref(release, revision.previousSource)!} companyId={companyId} documentId={revision.previousSource.documentId}>前回予想の根拠 ↗</EarningsSourceLink></> : null}</p> : null}</div></section>
          <section className={styles.section}><p className={styles.eyebrow}>CHANGE / INTERPRETATION</p><h2>前回からの変化</h2><p>{release.change.text}</p><p className={styles.fine}>比較元：{release.change.basis} · <EarningsSourceLink href={earningsSourceHref(release, release.change.source) ?? "#"} companyId={companyId} documentId={release.change.source.documentId}>{release.change.source.locator} ↗</EarningsSourceLink></p><h3>サイトの横断的な見方</h3><p className={styles.editorial}>{release.editorialNote}</p><p className={styles.fine}>この見方は原資料の数値と会社説明を整理した編集上の解釈です。</p></section>
          <section className={styles.section}><p className={styles.eyebrow}>SOURCES / COVERAGE</p><h2>資料と未確認の範囲</h2><ul className={styles.sourceList}>{release.documents.map((document) => <li key={document.id}><EarningsSourceLink href={document.url} companyId={companyId} documentId={document.id}>{document.title} ↗</EarningsSourceLink><small>{document.kind.toUpperCase()}</small></li>)}</ul><ul className={styles.unknowns}>{release.unverified.map((item) => <li key={item}>{item}</li>)}</ul></section>
        </div>
        <aside className={styles.sidePanel}><p className={styles.eyebrow}>NEXT READING</p><h2>数字から事業へ</h2><p>ニュースは出来事、決算は業績と会社見通し、業界地図は関係する工程を示します。</p><EarningsInternalLink href={`/companies/${earningsCompanySlug(companyId)}`} companyId={companyId} destination="company">企業詳細を見る →</EarningsInternalLink><EarningsInternalLink href={release.segment === "equipment" ? "/industry-map#industry-zone-equipment" : "/industry-map"} companyId={companyId} destination="industry_map">業界地図で役割を確認 →</EarningsInternalLink><EarningsInternalLink href="/semiconductor-watch" companyId={companyId} destination="news">関連ニュースを探す →</EarningsInternalLink><EarningsInternalLink href="/semiconductor-watch/earnings/compare" companyId={companyId} destination="compare">他社と比較する →</EarningsInternalLink></aside>
      </div>
      <nav className={styles.related}><Link href="/semiconductor-watch/earnings">決算一覧へ戻る</Link><Link href={release.segment === "equipment" ? "/guides/semiconductor-equipment-sales-ranking" : "/guides/memory-manufacturer-ranking"}>{release.segment === "equipment" ? "装置メーカーの役割と規模を見る" : "メモリメーカーの違いを見る"}</Link></nav>
    </article>
  </EarningsShell>;
}
