import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateCta } from "@/components/AffiliateCta";
import { rankings } from "@/data/editorial";

export const metadata: Metadata = {
  title: "経験別に探す半導体企業",
  description: "設備、品質、英語など、これまでの経験との接点から半導体企業を調べるための企業リストです。",
};

export default function RankingsPage() {
  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">経験別の企業研究</p>
        <h1>経験から探す半導体企業リスト</h1>
        <p>会社の優劣や順位ではなく、これまでの経験と仕事内容の接点を調べる候補として整理します。</p>
      </section>

      <section className="article-grid" aria-label="経験別の企業リスト一覧">
        {rankings.map((ranking) => (
          <Link className="article-card" href={`/rankings/${ranking.slug}`} key={ranking.slug}>
            <span>{ranking.companyIds.length} companies</span>
            <h2>{ranking.title}</h2>
            <p>{ranking.description}</p>
            <small>{ranking.criteria.join(" / ")}</small>
          </Link>
        ))}
      </section>

      <AffiliateCta title="企業リストを見た後、狙い方を相談する" />
    </main>
  );
}
