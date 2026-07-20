import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { IndustryMapExplorer } from "@/components/IndustryMapExplorer";
import { companies, segments } from "@/data/companies";

export const metadata: Metadata = {
  title: "半導体業界地図",
  description: "半導体の設計、製造、テストまでの工程と、ファブレス、ファウンドリ、IDM、製造装置、代表企業、職種のつながりを操作できる地図で整理します。",
};

export default function IndustryMapPage() {
  const companySummaries = companies.map((company) => ({
    id: company.id,
    slug: company.slug,
    name: company.name,
    nameJa: company.nameJa,
    summary: company.summary,
    businessModel: company.businessModel,
    mainProducts: company.mainProducts,
    jobCategories: company.jobCategories,
  }));

  return (
    <main className="page industry-map-page">
      <nav className="cpk-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span>/</span><span>半導体業界地図</span>
      </nav>
      <header className="industry-map-hero">
        <div>
          <p className="section-label">SEMICONDUCTOR ECOSYSTEM</p>
          <h1>半導体業界地図</h1>
          <p>設計から製造、テストまで。工程をたどりながら、企業、装置、職種がどこでつながるかを探索します。</p>
        </div>
        <p><strong>6工程 × 3つの視点</strong><span>ドラッグ・ズーム・クリックで確認</span></p>
      </header>

      <IndustryMapExplorer companies={companySummaries} totalCompanyCount={companies.length} />

      <section className="section">
        <div className="industry-map-directory-heading">
          <p className="section-label">Explore without interaction</p>
          <h2>一覧から各領域を確認する</h2>
          <p>操作が難しい場合や、特定領域を詳しく読みたい場合は、こちらから企業情報へ進めます。</p>
        </div>
        <div className="segment-map">
          {segments.map((segment) => {
            const relatedCompanies = companies.filter((company) => segment.relatedCompanyIds.includes(company.id));

            return (
              <article className="segment-card" key={segment.id}>
                <p className="section-label">{segment.shortName}</p>
                <h2>{segment.name}</h2>
                <p>{segment.description}</p>
                <Link className="text-link" href={`/segments/${segment.slug}` as Route}>
                  {segment.name}を詳しく見る
                </Link>
                <strong>代表企業</strong>
                <ul className="tag-list">
                  {relatedCompanies.map((company) => (
                    <li key={company.id}>
                      <Link href={`/companies/${company.slug}` as Route}>{company.nameJa}</Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
