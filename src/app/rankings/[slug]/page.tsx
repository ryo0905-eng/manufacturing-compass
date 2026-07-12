import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/AffiliateCta";
import { CompanyCard } from "@/components/CompanyCard";
import { getRankingBySlug, getRankingCompanies, rankings } from "@/data/editorial";

type RankingPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return rankings.map((ranking) => ({ slug: ranking.slug }));
}

export async function generateMetadata({ params }: RankingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const ranking = getRankingBySlug(slug);

  if (!ranking) {
    return {};
  }

  return {
    title: ranking.title,
    description: ranking.description,
  };
}

export default async function RankingPage({ params }: RankingPageProps) {
  const { slug } = await params;
  const ranking = getRankingBySlug(slug);

  if (!ranking) {
    notFound();
  }

  const rankingCompanies = getRankingCompanies(ranking);

  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">経験別の企業研究</p>
        <h1>{ranking.title}</h1>
        <p>{ranking.description}</p>
      </section>

      <section className="ranking-criteria" aria-label="ランキング基準">
        {ranking.criteria.map((criterion) => (
          <div key={criterion}>
            <span>Check</span>
            <strong>{criterion}</strong>
          </div>
        ))}
      </section>

      <section className="ranking-list" aria-label="企業ランキング">
        {rankingCompanies.map((company, index) => (
          <article className="ranking-item" key={company.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p className="eyebrow">{company.businessModel}</p>
              <h2>{company.nameJa}</h2>
              <p>{company.careerSummary}</p>
              <div className="actions">
                <Link className="text-link" href={`/companies/${company.slug}` as Route}>
                  企業詳細
                </Link>
                <Link className="text-link" href={`/companies/${company.slug}/career-prep` as Route}>
                  準備を見る
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">掲載企業</p>
            <h2>一覧でも見る</h2>
          </div>
        </div>
        <div className="company-grid">
          {rankingCompanies.slice(0, 3).map((company) => (
            <CompanyCard company={company} key={company.id} />
          ))}
        </div>
      </section>

      <AffiliateCta title={`${ranking.title}をもとに相談する`} />
    </main>
  );
}
