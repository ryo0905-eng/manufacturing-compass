"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Company, IndustrySegment } from "@/types/content";
import { CompanyCard } from "@/components/CompanyCard";

type FilterableCompaniesProps = {
  companies: Company[];
  initialQuery?: string;
  segments: IndustrySegment[];
};

export function FilterableCompanies({ companies, initialQuery = "", segments }: FilterableCompaniesProps) {
  const [query, setQuery] = useState(initialQuery);
  const [segment, setSegment] = useState("all");

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return companies.filter((company) => {
      const matchesSegment = segment === "all" || company.industrySegments.includes(segment);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [company.name, company.nameJa, company.summary, company.businessModel, ...company.mainProducts, ...company.jobCategories]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesSegment && matchesQuery;
    });
  }, [companies, query, segment]);

  return (
    <section className="interactive-panel" aria-labelledby="company-search-title">
      <div className="toolbar">
        <div>
          <p className="eyebrow">Company database</p>
          <h2 id="company-search-title">企業を探す</h2>
        </div>
        <p>{filteredCompanies.length} 社</p>
      </div>
      <div className="filters">
        <label>
          <span>キーワード</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例: 品質保証、ファウンドリ、英語" />
        </label>
        <label>
          <span>セグメント</span>
          <select value={segment} onChange={(event) => setSegment(event.target.value)}>
            <option value="all">すべて</option>
            {segments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="category-links" aria-label="カテゴリページ">
        {segments.map((item) => (
          <Link href={`/segments/${item.slug}`} key={item.id}>
            {item.name}
          </Link>
        ))}
      </div>
      <div className="company-grid">
        {filteredCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </section>
  );
}
