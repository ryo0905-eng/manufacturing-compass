import type { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";
import { EarningsCompare } from "@/components/earnings/EarningsCompare";
import { EarningsShell } from "@/components/earnings/EarningsShell";
import { earningsReleases, earningsUpdatedAt } from "@/lib/earnings";
import { siteUrl } from "@/lib/format";
import styles from "@/components/earnings/Earnings.module.css";

const title = "半導体企業の決算比較｜Chip Pulse";
const description = "2〜3社の最新決算を、期間・通貨・会計基準を明示して比較します。";
export const metadata: Metadata = { title, description, alternates: { canonical: "/semiconductor-watch/earnings/compare" }, openGraph: { title, description, url: "/semiconductor-watch/earnings/compare", type: "website" } };

export default function EarningsComparePage() {
  return <EarningsShell>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: `${siteUrl}/semiconductor-watch/earnings/compare`, dateModified: earningsUpdatedAt }} />
    <div className={styles.hero}><p className={styles.eyebrow}>COMPARE LATEST RELEASES</p><h1>各社の最新発表を比べる</h1><p>同じ期間の比較ではありません。対象期間、会計基準、通貨と単位を見ながら、会社の違いを整理してください。</p></div>
    <aside className={styles.notice}>円・米ドル・ユーロ・ウォンの換算や順位付けはしていません。営業利益は各社の会計基準による実績です。Samsungの数値はDS部門で、メモリ単独ではありません。前年同期比は各社の同じ会計期間との比較です。</aside>
    <EarningsCompare releases={earningsReleases} />
  </EarningsShell>;
}
