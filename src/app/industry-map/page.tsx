import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { companies, segments } from "@/data/companies";

export const metadata: Metadata = {
  title: "半導体業界地図",
  description: "ファブレス、ファウンドリ、メモリ、半導体製造装置の違いと代表企業を転職者目線で整理します。",
};

export default function IndustryMapPage() {
  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">Industry map</p>
        <h1>半導体業界地図</h1>
        <p>設計、製造、メモリ、装置。求人を見る前に、会社の役割だけ先につかみます。</p>
      </section>

      <section className="section">
        <div className="segment-map">
          {segments.map((segment) => {
            const relatedCompanies = companies.filter((company) => segment.relatedCompanyIds.includes(company.id));

            return (
              <article className="segment-card" key={segment.id}>
                <p className="eyebrow">{segment.shortName}</p>
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
