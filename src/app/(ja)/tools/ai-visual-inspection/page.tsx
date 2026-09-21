import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
import { InspectionLab } from "@/components/ai-visual-inspection/InspectionLab";
import { inspectionRelease } from "@/data/ai-visual-inspection";
import { siteUrl } from "@/lib/format";
import styles from "@/components/ai-visual-inspection/inspection.module.css";
const route = "/tools/ai-visual-inspection";
const title = "AI外観検査ラボ｜ルールベースとの違いを体験";
const description = "同じ合成基板画像をルールベースとAIで検査。しきい値、学習例、撮影の明るさを変えて、見逃しと過検出から採用方法を考える無料の画像検査体験です。";
export const metadata: Metadata = { title, description, alternates: { canonical: route }, robots: { index: false, follow: true }, openGraph: { title, description, url: `${siteUrl}${route}`, type: "website" } };
export default function InspectionPage() {
  return <main className={styles.page}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: title, description, url: `${siteUrl}${route}`, applicationCategory: "EducationalApplication", operatingSystem: "Web", inLanguage: "ja", dateModified: inspectionRelease.updatedAt, offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "学習ツール", item: `${siteUrl}/tools` }, { "@type": "ListItem", position: 3, name: title, item: `${siteUrl}${route}` }] }} />
    <nav className={styles.breadcrumb} aria-label="パンくず"><Link href="/tools">学習ツール</Link><span aria-hidden="true">/</span><span>AI外観検査</span></nav>
    <header className={styles.hero}><p className={styles.small}>教育用・試用版</p><h1>{title}</h1><p>同じ画像、違う検査。動かして、使いどころを考える。</p><p className={styles.small}>架空の基板表面を使います。実工場の性能保証ではありません。</p></header>
    <InspectionLab />
    <noscript><p>画像検査の操作にはJavaScriptが必要です。概要は以下から読めます。</p></noscript>
    <article className={styles.document}>
      <h2>AI外観検査とルールベースの違い</h2>
      <p>ルールベースは、人が決めた明るさや面積などの条件で検査します。白い面の黒い汚れのように判定条件が明確な対象では、簡単な処理が役立ちます。AIは、例として与えた画像とラベルから欠陥の特徴を学びます。正常な模様や傷にばらつきがある場合に役立つことがありますが、良品の種類が足りない、特定の傷に偏る、ラベルを間違えると、結果に影響します。</p>
      <h2>使い方</h2>
      <p>最初は暗さと最小面積を調整し、汚れだけを検出してみてください。次に正常模様と傷を加え、同じ画像に対する検出領域を比べます。学習例の構成が異なる4モデルを切り替えたら、撮影の明るさを変更し、両方式で何が変わるか確かめます。最後は設定を固定して別の24枚を開き、採用候補と重視した理由を選びます。その場で再学習は行いません。</p>
      <h2>結果の読み方と比較の限界</h2>
      <p>不良品を通した数と、良品をはじいた数を、それぞれの母数と一緒に見てください。正解率だけでは、不良の見逃しと良品の廃棄を区別できません。併用は「どちらかが不良と判定したら止める」方式です。見逃しを抑える一方、過検出が増える場合があります。準備する設定、画像、領域ラベルの負担も判断材料です。</p>
      <p>画像と正解領域は独自の合成データです。特定の二値化処理と小型モデルの比較であり、方式全体の優劣ではありません。位置合わせや形状処理などのルール改善も選択肢です。練習画像で繰り返し調整した結果を、未知画像の性能とは呼びません。実工程では光学系、照明、対象製品をそろえた追加検証が必要です。</p>
      <p className={styles.small}>画像・判定結果は端末内で処理し、外部AIへ送信しません。操作状態はページ内のメモリだけで保持し、再読み込みで消えます。<Link href="/privacy">プライバシーの取り扱い</Link></p>
      <h2>処理・利用条件</h2><p className={styles.small}>学習済みモデルは本教材独自のものです。推論エンジンはONNX Runtime Web 1.22.0。<a href="/ai-visual-inspection/v2/NOTICE.md">教材・ライブラリの利用条件</a> ／ <a href="/ai-visual-inspection/v2/manifest.json">モデルの構成記録</a>。最終更新日：<time dateTime={inspectionRelease.updatedAt}>{inspectionRelease.updatedAt}</time>。</p>
    </article>
  </main>;
}
