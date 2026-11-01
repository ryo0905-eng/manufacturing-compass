import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { CmpLearningLab } from "@/components/cmp-lab/CmpLearningLab";
import styles from "@/components/cmp-lab/cmp.module.css";
import { siteUrl } from "@/lib/format";

const route = "/tools/cmp-simulator";
const title = "CMPを触って学ぶ | CMP Interactive Lab";
const description = "研磨条件を変えながら、CMPの仕組み、平坦化と不良を模式図で学ぶインタラクティブ教材です。";
export const metadata: Metadata = { title, description, alternates: { canonical: route }, robots: { index: true, follow: true }, openGraph: { title, description, url: `${siteUrl}${route}`, type: "website" }, twitter: { card: "summary_large_image", title, description } };

const links = [
  { href: "/guides/semiconductor-cmp-process", title: "CMPプロセスとは", text: "原理から工程の役割まで詳しく読む" },
  { href: "/guides/semiconductor-cmp-equipment-manufacturers", title: "CMP装置メーカー", text: "装置とメーカーの特徴を知る" },
  { href: "/guides/semiconductor-cmp-slurry-manufacturers", title: "CMPスラリーメーカー", text: "研磨を支える材料を知る" },
  { href: "/tools/semiconductor-process", title: "半導体ができるまで", text: "配線とCMPを工程全体の中で見る" },
];

export default function CmpSimulatorPage() {
  return <main className={styles.page}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: title, description, url: `${siteUrl}${route}`, applicationCategory: "EducationalApplication", operatingSystem: "Web", inLanguage: "ja", dateModified: "2026-11-01", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } }}/>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "学習ツール", item: `${siteUrl}/tools` }, { "@type": "ListItem", position: 3, name: "CMPを触って学ぶ", item: `${siteUrl}${route}` }] }}/>
    <nav className={styles.breadcrumb} aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">学習ツール</Link><span>/</span><span>CMPを触って学ぶ</span></nav>
    <header className={styles.hero}><div><p className={styles.eyebrow}>CMP INTERACTIVE LAB</p><h1>CMPを、触って学ぶ。</h1><p>研磨条件を変えながら、平坦化・除去量・不良の仕組みを理解するインタラクティブ教材。</p><a className={styles.cta} href="#simulator">まず触ってみる <span aria-hidden="true">↓</span></a><p className={styles.heroNote}>無料・登録不要 / 教育用の簡易モデル</p></div><div className={styles.heroArt} aria-hidden="true"><span>Chemical</span><b>＋</b><span>Mechanical</span><div className={styles.wafer}><i/><i/><i/><i/></div><small>PLANARIZATION</small></div></header>
    <section className={styles.basics}><div><p className={styles.eyebrow}>THE BASICS</p><h2>CMPって、何をする工程？</h2><p>CMP（化学機械研磨）は、スラリーと呼ばれる研磨液の化学作用と、パッドや粒子による機械作用を組み合わせて膜を取り除く工程です。</p><p>表面の段差を小さくすることで、その上に次の膜や配線を作りやすくします。配線形成では、余分な導電膜を除く役割もあります。</p></div><div className={styles.basicsCards}><div><b>01</b><strong>化学作用</strong><span>表面を反応させ、除去を助ける</span></div><div><b>02</b><strong>機械作用</strong><span>パッドと粒子の接触で削る</span></div><div><b>03</b><strong>平坦化</strong><span>段差を小さくし、次の加工へ</span></div></div></section>
    <CmpLearningLab/><noscript><p>条件の変更と不良の切り替えには JavaScript が必要です。</p></noscript>
    <section className={styles.related}><p className={styles.eyebrow}>KEEP LEARNING</p><h2>CMPをもっと深く知る</h2><p>工程の背景や装置・材料を、記事と工程図鑑で確認しましょう。</p><div className={styles.linkGrid}>{links.map(link => <Link href={link.href} key={link.href}><strong>{link.title} <span aria-hidden="true">↗</span></strong><small>{link.text}</small></Link>)}</div></section>
    <section className={styles.sources}><h2>参考情報・更新日</h2><ul><li><a href="https://doi.org/10.1557/s43578-020-00060-x">Journal of Materials Research: CMPにおける化学・機械現象のレビュー（Prestonの式）</a></li><li><a href="https://projects.iq.harvard.edu/files/vlassakgroup/files/16-m4-6.pdf">Harvard University: DishingとErosionのモデル</a></li><li><a href="https://dspace.mit.edu/entities/publication/4bccbcc0-0763-47f6-9b00-8d7917e44e0b">MIT: CMPにおけるパッドとスクラッチ</a></li></ul><p>最終更新日・出典確認日：<time dateTime="2026-11-01">2026年11月1日</time></p></section>
  </main>;
}
