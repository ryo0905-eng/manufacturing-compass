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
        <p>半導体業界は、設計する会社、製造する会社、装置を作る会社、メモリを量産する会社などに分かれます。まずは役割の違いから見ていきます。</p>
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
                <strong>役割</strong>
                <p>{segment.roleInValueChain}</p>
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
