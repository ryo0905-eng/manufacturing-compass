import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateCta } from "@/components/AffiliateCta";
import { rankings } from "@/data/editorial";

export const metadata: Metadata = {
  title: "半導体企業ランキング",
  description: "設備、品質、英語など、キャリア準備の観点で半導体企業を探せるランキングです。",
};

export default function RankingsPage() {
  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">Career rankings</p>
        <h1>経験から探す半導体企業ランキング</h1>
        <p>会社の優劣ではなく、あなたの経験をどこへ接続しやすいかで整理します。</p>
      </section>

      <section className="article-grid" aria-label="ランキング一覧">
        {rankings.map((ranking) => (
          <Link className="article-card" href={`/rankings/${ranking.slug}`} key={ranking.slug}>
            <span>{ranking.companyIds.length} companies</span>
            <h2>{ranking.title}</h2>
            <p>{ranking.description}</p>
            <small>{ranking.criteria.join(" / ")}</small>
          </Link>
        ))}
      </section>

      <AffiliateCta title="ランキングを見た後、狙い方を相談する" />
    </main>
  );
}
