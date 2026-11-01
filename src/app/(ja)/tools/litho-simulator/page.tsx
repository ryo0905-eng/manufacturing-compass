import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { LithoLearningLab } from "@/components/litho-lab/LithoLearningLab";
import styles from "@/components/litho-lab/litho.module.css";
import { siteUrl } from "@/lib/format";

const route = "/tools/litho-simulator";
const title = "リソグラフィを触って学ぶ | Lithography Interactive Lab";
const description = "露光量と焦点を変えながら、フォトリソグラフィの工程余裕と不良を模式図で学ぶインタラクティブ教材です。";
export const metadata: Metadata = { title, description, alternates: { canonical: route }, robots: { index: true, follow: true }, openGraph: { title, description, url: `${siteUrl}${route}`, type: "website" }, twitter: { card: "summary_large_image", title, description } };

const links = [
  { href: "/guides/photolithography-process", title: "フォトリソグラフィとは", text: "原理から工程の役割まで詳しく読む" },
  { href: "/guides/semiconductor-lithography-equipment-manufacturers", title: "露光装置メーカー", text: "装置とメーカーの特徴を知る" },
  { href: "/guides/semiconductor-photomask-manufacturers", title: "フォトマスクメーカー", text: "回路原版を支える企業を知る" },
  { href: "/tools/cmp-simulator", title: "CMPを触って学ぶ", text: "研磨条件と平坦化の関係を体験する" },
  { href: "/tools/semiconductor-process", title: "半導体ができるまで", text: "露光を工程全体の中で見る" },
];
export default function LithoSimulatorPage() {
  return <main className={styles.page}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: title, description, url: `${siteUrl}${route}`, applicationCategory: "EducationalApplication", operatingSystem: "Web", inLanguage: "ja", dateModified: "2026-11-01", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } }}/>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "学習ツール", item: `${siteUrl}/tools` }, { "@type": "ListItem", position: 3, name: "リソグラフィを触って学ぶ", item: `${siteUrl}${route}` }] }}/>
    <nav className={styles.breadcrumb} aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">学習ツール</Link><span>/</span><span>リソグラフィを触って学ぶ</span></nav>
    <header className={styles.hero}><div className={styles.heroTitle}><div><p className={styles.eyebrow}>LITHOGRAPHY INTERACTIVE LAB</p><h1>リソグラフィを、触って学ぶ。</h1><div className={styles.badges}><span>無料・登録不要</span><span>教育用の簡易モデル</span></div></div></div><p className={styles.heroDescription}>露光量と焦点を変えながら、線幅・工程余裕・不良の仕組みを学ぶ体験型ラボ。</p><div className={styles.heroArt} aria-hidden="true"><div className={styles.wafer}/></div></header>
    <section className={styles.basics} aria-label="リソグラフィの基本"><strong>THE BASICS</strong><span>光で型を写す</span><span>現像でパターンになる</span><span>線幅は条件で動く</span></section>
    <LithoLearningLab/><noscript><p>条件の変更と不良の切り替えには JavaScript が必要です。</p></noscript>
    <section className={styles.related}><h2><span aria-hidden="true">↗</span> KEEP LEARNING</h2><div className={styles.linkGrid}>{links.map(link => <Link href={link.href} key={link.href}><strong>{link.title} <span aria-hidden="true">›</span></strong><small>{link.text}</small></Link>)}</div></section>
    <details className={styles.information}><summary>参考情報・更新日</summary><div className={styles.infoContent}><section className={styles.sources}><h2>参考情報・更新日</h2><ul><li><a href="https://www.asml.com/en/technology/lithography-principles">ASML: Lithography principles</a></li><li><a href="https://www.microchemicals.com/dokumente/application_notes/exposure_photoresist.pdf">MicroChemicals: Exposure of Photoresists</a></li><li><a href="https://www.microchemicals.com/dokumente/application_notes/lithography_trouble_shooting.pdf">MicroChemicals: Photolithography Trouble Shooter</a></li></ul><p>最終更新日・出典確認日：<time dateTime="2026-11-01">2026年11月1日</time></p></section></div></details>
  </main>;
}
