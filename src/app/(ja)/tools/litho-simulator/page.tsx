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
  { href: "/tools/semiconductor-process", title: "半導体ができるまで", text: "露光を工程全体の中で見る" },
];
export default function LithoSimulatorPage() {
  return <main className={styles.page}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: title, description, url: `${siteUrl}${route}`, applicationCategory: "EducationalApplication", operatingSystem: "Web", inLanguage: "ja", dateModified: "2026-11-01", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } }}/>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "学習ツール", item: `${siteUrl}/tools` }, { "@type": "ListItem", position: 3, name: "リソグラフィを触って学ぶ", item: `${siteUrl}${route}` }] }}/>
    <nav className={styles.breadcrumb} aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">学習ツール</Link><span>/</span><span>リソグラフィを触って学ぶ</span></nav>
    <header className={styles.hero}><div><p className={styles.eyebrow}>LITHOGRAPHY INTERACTIVE LAB</p><h1>リソグラフィを、触って学ぶ。</h1><p>露光量と焦点を変えながら、線幅・工程余裕・不良の仕組みを理解するインタラクティブ教材。</p><a className={styles.cta} href="#simulator">まず触ってみる <span aria-hidden="true">↓</span></a><p className={styles.heroNote}>無料・登録不要 / 教育用の簡易モデル</p></div><div className={styles.heroArt} aria-hidden="true"><span>Focus</span><b>＋</b><span>Exposure</span><div className={styles.wafer}/><small>PATTERNING</small></div></header>
    <section className={styles.basics}><div><p className={styles.eyebrow}>THE BASICS</p><h2>リソグラフィって、何をする工程？</h2><p>光に反応するレジストにマスクのパターンを転写し、現像して次の加工に使う形を作る工程です。</p><p>ポジレジストでは光を受けた部分が現像液に溶けやすくなります。露光量や焦点が、残るラインの形に影響します。</p></div><div className={styles.basicsCards}><div><b>01</b><strong>塗布</strong><span>ウエハにレジストを塗る</span></div><div><b>02</b><strong>露光</strong><span>光でパターンを転写する</span></div><div><b>03</b><strong>現像</strong><span>溶けやすい部分を除く</span></div></div></section>
    <LithoLearningLab/><noscript><p>条件の変更と不良の切り替えには JavaScript が必要です。</p></noscript>
    <section className={styles.related}><p className={styles.eyebrow}>KEEP LEARNING</p><h2>リソグラフィをもっと深く知る</h2><p>工程の背景や装置を、記事と工程図鑑で確認しましょう。</p><div className={styles.linkGrid}>{links.map(link => <Link href={link.href} key={link.href}><strong>{link.title} <span aria-hidden="true">↗</span></strong><small>{link.text}</small></Link>)}</div></section>
    <section className={styles.sources}><h2>参考情報・更新日</h2><ul><li><a href="https://www.asml.com/en/technology/lithography-principles">ASML: Lithography principles</a></li><li><a href="https://www.microchemicals.com/dokumente/application_notes/exposure_photoresist.pdf">MicroChemicals: Exposure of Photoresists</a></li><li><a href="https://www.microchemicals.com/dokumente/application_notes/lithography_trouble_shooting.pdf">MicroChemicals: Photolithography Trouble Shooter</a></li></ul><p>最終更新日・出典確認日：<time dateTime="2026-11-01">2026年11月1日</time></p></section>
  </main>;
}
