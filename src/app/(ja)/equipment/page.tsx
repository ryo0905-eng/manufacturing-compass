import type { Metadata } from "next";
import Link from "next/link";
import { EquipmentExplorer } from "@/components/equipment-explorer/EquipmentExplorer";
import styles from "@/components/equipment-explorer/equipment.module.css";
import { StructuredData } from "@/components/StructuredData";
import { equipmentProcesses } from "@/data/database/processes";
import { companies } from "@/data/companies";
import { getReleasedEquipment } from "@/lib/equipment-catalog";
import { parseEquipmentFilters } from "@/lib/equipment-explorer";
import { siteUrl } from "@/lib/format";

const route = "/equipment";
const title = "半導体製造装置Explorer｜工程・メーカーから機種を探して比較";
const description = "半導体製造装置を工程・メーカー・分類で検索。公開仕様と出典を最大3機種で比較し、CMP・リソグラフィLabで原理を学べます。";
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  return { title, description, alternates: { canonical: route }, robots: { index: Object.keys(params).length === 0, follow: true }, openGraph: { title, description, url: route, type: "website" } };
}
export default async function EquipmentPage({ searchParams }: Props) {
  const records = getReleasedEquipment();
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) if (value !== undefined) params.set(key, Array.isArray(value) ? value[0] : value);
  const initial = parseEquipmentFilters(params, records);
  const manufacturers = companies.filter(c => records.some(r => r.manufacturerId === c.id)).map(c => ({ id: c.id, name: c.nameJa, href: `/companies/${c.slug}` }));
  return <main className={styles.page}>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url: `${siteUrl}${route}`, inLanguage: "ja" }}/>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "製造装置Explorer", item: `${siteUrl}${route}` }] }}/>
    <nav className={styles.breadcrumb} aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><span>製造装置Explorer</span></nav>
    <header className={styles.hero}><h1>半導体製造装置 Explorer</h1><p>工程から機種を探し、仕様を比べ、加工の原理を操作して理解する。</p><p>初期収録 {records.length}機種 · {manufacturers.length}メーカー。公式情報を個別確認した限定的なデータセットです。</p></header>
    <EquipmentExplorer records={records} processes={equipmentProcesses} manufacturers={manufacturers} initial={initial}/>
    <noscript><p>装置の概要・仕様・出典はそのまま読めます。検索条件の変更・比較への追加・共有URLの作成にはJavaScriptが必要です。</p></noscript>
    <section style={{ marginTop: 32 }}><h2>企業と業界の変化も調べる</h2><nav className={styles.links} aria-label="企業・時系列データ"><Link href="/industry-map">業界地図・企業一覧</Link><Link href="/compare">企業を比較</Link><Link href="/semiconductor-map">工場・拠点マップ</Link><Link href="/tools/ranking-time-machine">ランキングの変化を見る</Link><Link href="/semiconductor-watch/earnings">企業決算を見る</Link><Link href="/semiconductor-watch">業界Watch</Link></nav></section>
  </main>;
}
