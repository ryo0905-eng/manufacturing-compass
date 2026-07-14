import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { SemiconductorValueChain } from "@/components/SemiconductorValueChain";
import { companies, segments } from "@/data/companies";

export const metadata: Metadata = {
  title: "半導体業界地図",
  description: "ファブレス、ファウンドリ、メモリ、半導体製造装置の違いと代表企業を転職者目線で整理します。",
};

export default function IndustryMapPage() {
  return (
    <main className="page">
      <section className="page-hero">
        <p className="section-label">業界での役割から見る</p>
        <h1>半導体業界地図</h1>
        <p>設計、製造、メモリ、装置。求人を見る前に、会社がどこで価値を出しているかをつかみます。分類は製品が同じという意味ではなく、半導体の設計・製造を支える役割で分けています。</p>
      </section>

      <SemiconductorValueChain segments={segments} />

      <section className="section">
        <div className="industry-map-directory-heading">
          <p className="section-label">Segment directory</p>
          <h2>各領域の特徴と代表企業</h2>
          <p>興味のある領域から、仕事内容と企業情報を詳しく確認できます。</p>
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
