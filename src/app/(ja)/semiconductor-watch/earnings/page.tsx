import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { EarningsExplorer } from "@/components/earnings/EarningsExplorer";
import { EarningsInternalLink, EarningsSourceLink } from "@/components/earnings/EarningsLinks";
import { EarningsShell } from "@/components/earnings/EarningsShell";
import { commonEarningsThemes, earningsCompanyName, earningsReleases, earningsSourceHref, earningsThemeOptions, earningsUpdatedAt, getEarningsRelease } from "@/lib/earnings";
import { siteUrl } from "@/lib/format";
import styles from "@/components/earnings/Earnings.module.css";

const title = "主要半導体企業の決算一覧｜売上・利益・見通しと発表予定";
const description = "NVIDIA・TSMC・Intelを含む半導体関連12社の掲載決算を一覧で確認。売上高、営業利益、前年比、次回発表予定から、会社見通しと原資料へ進めます。";
export const metadata: Metadata = { title, description, alternates: { canonical: "/semiconductor-watch/earnings" }, openGraph: { title, description, url: "/semiconductor-watch/earnings", type: "website" } };

export const revalidate = 3600;

export default function EarningsPage() {
  const now = new Date().toISOString();
  return <EarningsShell>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url: `${siteUrl}/semiconductor-watch/earnings`, dateModified: earningsUpdatedAt }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "業界ウォッチ", item: `${siteUrl}/semiconductor-watch` }, { "@type": "ListItem", position: 2, name: "決算・IR", item: `${siteUrl}/semiconductor-watch/earnings` }] }} />
    <div className={styles.hero}><p className={styles.eyebrow}>EARNINGS / IR</p><h1>主要半導体企業の決算一覧</h1><p>掲載決算の数字と変化を見渡し、気になる会社の見通し・原資料へ。</p><small>{earningsReleases.length}社 · 内容更新 {earningsUpdatedAt.replaceAll("-", "/")} · 最新発表の確認状況は企業ごとに表示</small></div>
    <EarningsExplorer releases={earningsReleases} themes={earningsThemeOptions} now={now} />
    <section className={styles.section} aria-labelledby="common-title"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>CROSS COMPANY</p><h2 id="common-title">複数社に見える動き</h2></div><span>会社ごとの説明と根拠を確認</span></div><div className={styles.themeGrid}>{commonEarningsThemes.map((theme) => <article className={styles.themeCard} key={theme.id}><span className={styles.themeTag}>{theme.theme}</span><h3>{theme.title}</h3><p>{theme.summary}</p><ul>{theme.evidence.map((entry) => { const release = getEarningsRelease(entry.companyId); const href = release && earningsSourceHref(release, entry.source); return <li key={entry.companyId}>{earningsCompanyName(entry.companyId)}{href ? <> · <EarningsSourceLink href={href} companyId={entry.companyId} documentId={entry.source.documentId}>{entry.source.locator} ↗</EarningsSourceLink></> : null}</li>; })}</ul></article>)}</div><p className={styles.fine}>共通テーマは各社が述べた内容を横断して整理したもので、業界全体の実績や因果関係を断定するものではありません。</p></section>
    <section className={styles.section} aria-labelledby="terms-title"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>TERMS</p><h2 id="terms-title">よく出る言葉</h2></div></div><dl className={styles.glossary}><div><dt>HBM</dt><dd>高速に大量のデータを扱う積層メモリ。AI向け半導体で使われます。</dd></div><div><dt>EUV</dt><dd>極端紫外線を使う露光技術。細かい回路パターンを形成します。</dd></div><div><dt>設備投資</dt><dd>工場や製造装置など、生産に使う設備への投資です。</dd></div></dl></section>
    <section className={styles.nextStep}><div><p className={styles.eyebrow}>COMPARE</p><h2>近い事業の会社を並べて読む</h2><p>製造装置またはメモリ関連から2〜3社を選び、主要数値と成長要因・懸念点・会社見通しを並べます。</p></div><EarningsInternalLink href="/semiconductor-watch/earnings/compare" destination="compare">企業比較へ →</EarningsInternalLink></section>
    <nav className={styles.related} aria-label="関連ページ"><Link href="/semiconductor-watch">ニュースを見る</Link><Link href="/industry-map">業界地図を見る</Link><Link href="/guides/semiconductor-equipment-sales-ranking">装置メーカーの役割と規模</Link></nav>
  </EarningsShell>;
}
