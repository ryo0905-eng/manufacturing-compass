import type { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";
import { EarningsAnalysisCompare } from "@/components/earnings/EarningsAnalysisCompare";
import { EarningsShell } from "@/components/earnings/EarningsShell";
import { earningsReleases, earningsUpdatedAt } from "@/lib/earnings";
import { siteUrl } from "@/lib/format";
import { readAnnualYears } from "@/lib/earnings-history-math";
import { annualHistories, annualHistoryUpdatedAt } from "@/lib/earnings-history";
import styles from "@/components/earnings/Earnings.module.css";

const title = "半導体企業の決算比較｜Chip Pulse";
const description = "半導体企業2〜3社の最大20年の年次の営業利益率・売上高指数と最新四半期決算を、対象期間・通貨・会計基準を明示して比較します。";
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  return { title, description, alternates: { canonical: "/semiconductor-watch/earnings/compare" }, robots: { index: !Object.values(params).some(value => value !== undefined), follow: true }, openGraph: { title, description, url: "/semiconductor-watch/earnings/compare", type: "website" } };
}

export default async function EarningsComparePage({ searchParams }: Props) {
  const params = await searchParams;
  const initialGroup = params.group === "memory" ? "memory" : "equipment";
  const initialCompany = typeof params.company === "string" ? params.company : undefined;
  return <EarningsShell>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: `${siteUrl}/semiconductor-watch/earnings/compare`, dateModified: [earningsUpdatedAt, annualHistoryUpdatedAt].sort().at(-1) }} />
    <div className={styles.hero}><p className={styles.eyebrow}>ANNUAL TRENDS / LATEST QUARTER</p><h1>半導体企業の業績を比べる</h1><p>最大20年の年次の推移と最新四半期を切り替え、成長性と収益性を読みます。対象期間、会計基準、通貨と単位を見ながら、会社の違いを整理してください。</p></div>
    <aside className={styles.notice}>円・米ドル・ユーロ・ウォンの換算や売上額の順位付けはしていません。営業利益は各社の会計基準による実績です。サムスン電子の数値はDS部門で、メモリ単独ではありません。前年同期比は各社の同じ会計期間との比較です。</aside>
    <EarningsAnalysisCompare histories={annualHistories} releases={earningsReleases} initialGroup={initialGroup} initialCompany={initialCompany} initialYears={readAnnualYears(params.years)} />
  </EarningsShell>;
}
