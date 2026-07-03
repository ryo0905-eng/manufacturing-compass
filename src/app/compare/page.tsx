import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { CompareSelector } from "@/components/CompareSelector";
import { companies } from "@/data/companies";
import { companyCompareSlug, getDefaultComparePairs } from "@/lib/format";

export const metadata: Metadata = {
  title: "半導体企業比較",
  description: "半導体企業を事業領域、職種、英語必要度、日本拠点、キャリア準備ポイントで比較できます。",
};

export default function ComparePage() {
  const pairs = getDefaultComparePairs();

  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">Company compare</p>
        <h1>半導体企業比較</h1>
        <p>会社の優劣ではなく、役割とキャリアの距離感だけを比べます。</p>
      </section>

      <CompareSelector companies={companies} />

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Recommended</p>
            <h2>よく見る比較</h2>
          </div>
        </div>
        <div className="grid-3">
          {pairs.map(([first, second]) => (
            <article className="info-card" key={`${first.id}-${second.id}`}>
              <p className="eyebrow">Compare</p>
              <h3>
                {first.nameJa} / {second.nameJa}
              </h3>
              <p>{first.businessModel} と {second.businessModel}</p>
              <Link className="text-link" href={`/compare/${companyCompareSlug([first.id, second.id])}` as Route}>
                比較を見る
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
