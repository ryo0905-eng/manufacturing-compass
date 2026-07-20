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
      <section className="page-hero industry-map-hero">
        <p className="section-label">Semiconductor ecosystem explorer</p>
        <h1>半導体業界地図</h1>
        <p>設計から製造、テストまで。工程をたどりながら、企業、装置、職種がどこでつながるかを一枚の地図で探索します。</p>
        <div className="industry-map-hero__guide">
          <span aria-hidden="true">01</span>
          <p><strong>全体を眺め、気になる場所を選ぶ。</strong><small>地図はドラッグ、ズーム、クリックで動かせます。</small></p>
          <Link className="text-link" href="#industry-explorer-title">地図を操作する ↓</Link>
        </div>
      </section>

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
