import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/AffiliateCta";
import { CompanyCard } from "@/components/CompanyCard";
import { companies, segments } from "@/data/companies";

type SegmentPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return segments.map((segment) => ({ slug: segment.slug }));
}

export async function generateMetadata({ params }: SegmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const segment = segments.find((item) => item.slug === slug);

  if (!segment) {
    return {};
  }

  return {
    title: `${segment.name}の半導体企業`,
    description: `${segment.name}領域の役割、代表企業、転職で見られやすい経験を整理します。`,
  };
}

export default async function SegmentPage({ params }: SegmentPageProps) {
  const { slug } = await params;
  const segment = segments.find((item) => item.slug === slug);

  if (!segment) {
    notFound();
  }

  const segmentCompanies = companies.filter((company) => company.industrySegments.includes(segment.id));
  const relatedCompanies = companies.filter((company) => segment.relatedCompanyIds.includes(company.id));
  const jobCategories = Array.from(new Set(segmentCompanies.flatMap((company) => company.jobCategories))).slice(0, 8);

  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">{segment.shortName}</p>
        <h1>{segment.name}の半導体企業</h1>
        <p>{segment.description}</p>
        {segment.id === "foundry" ? <Link className="text-link" href="/guides/semiconductor-foundry">ファウンドリの意味と分業の仕組みを図解で見る</Link> : null}
        {segment.id === "idm" ? <Link className="text-link" href="/guides/analog-semiconductor-companies">アナログ半導体の意味・用途・主要企業を図解で見る</Link> : null}
        {segment.id === "equipment" ? <Link className="text-link" href="/guides/semiconductor-equipment-manufacturers">製造工程別の装置と主要メーカーを図解で見る</Link> : null}
      </section>

      <section className="segment-detail-grid" aria-label={`${segment.name}の概要`}>
        <div>
          <span>Role</span>
          <b>{segment.roleInValueChain}</b>
        </div>
        <div>
          <span>Companies</span>
          <b>{segmentCompanies.length} 社</b>
        </div>
        <div>
          <span>Entry point</span>
          <b>{jobCategories.slice(0, 3).join(" / ")}</b>
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">関連企業</p>
            <h2>この領域の企業</h2>
          </div>
          <Link className="text-link" href="/companies">
            企業一覧へ
          </Link>
        </div>
        <div className="company-grid">
          {segmentCompanies.map((company) => (
            <CompanyCard company={company} key={company.id} />
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">キャリアのキーワード</p>
            <h2>求人で見かけやすい職種</h2>
          </div>
          <Link className="text-link" href="/career-compass">
            診断する
          </Link>
        </div>
        <div className="keyword-grid">
          {jobCategories.map((category) => (
            <Link className="keyword-chip" href={`/companies?query=${encodeURIComponent(category)}` as Route} key={category}>
              {category}
            </Link>
          ))}
        </div>
      </section>

      {relatedCompanies.length > 0 ? (
        <section className="home-section">
          <div className="section-header">
            <div>
              <p className="eyebrow">代表的な企業</p>
              <h2>代表企業</h2>
            </div>
          </div>
          <div className="result-company-list">
            {relatedCompanies.map((company) => (
              <Link href={`/companies/${company.slug}` as Route} key={company.id}>
                <strong>{company.nameJa}</strong>
                <small>{company.businessModel}</small>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <AffiliateCta title={`${segment.name}領域に近いキャリアを相談する`} />
    </main>
  );
}
