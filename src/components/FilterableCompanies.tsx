"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Company, IndustrySegment } from "@/types/content";
import { CompanyCard } from "@/components/CompanyCard";
import { trackEvent } from "@/lib/analytics";

type FilterableCompaniesProps = {
  companies: Company[];
  initialQuery?: string;
  segments: IndustrySegment[];
};

export function FilterableCompanies({ companies, initialQuery = "", segments }: FilterableCompaniesProps) {
  const [query, setQuery] = useState(initialQuery);
  const [segment, setSegment] = useState("all");
  const [region, setRegion] = useState("all");

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return companies.filter((company) => {
      const matchesSegment = segment === "all" || company.industrySegments.includes(segment);
      const matchesRegion = region === "all" || (region === "japan" ? company.headquartersCountry === "日本" : company.headquartersCountry !== "日本");
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [company.name, company.nameJa, company.summary, company.businessModel, ...company.mainProducts, ...company.jobCategories]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesSegment && matchesRegion && matchesQuery;
    });
  }, [companies, query, region, segment]);

  function trackKeywordUse() {
    if (query.trim()) {
      trackEvent("companies_filter_use", { filter_type: "keyword" });
    }
  }

  return (
    <section className="interactive-panel" aria-labelledby="company-search-title">
      <div className="toolbar">
        <div>
          <p className="eyebrow">企業データベース</p>
          <h2 id="company-search-title">企業を探す</h2>
        </div>
        <p>{filteredCompanies.length} 社</p>
      </div>
      <div className="filters">
        <label>
          <span>キーワード</span>
          <input
            value={query}
            onBlur={trackKeywordUse}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") trackKeywordUse(); }}
            placeholder="例: 品質保証、ファウンドリ、英語"
            type="search"
          />
        </label>
        <label>
          <span>セグメント</span>
          <select value={segment} onChange={(event) => {
            setSegment(event.target.value);
            trackEvent("companies_filter_use", { filter_type: "segment", filter_value: event.target.value });
          }}>
            <option value="all">すべて</option>
            {segments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>本社地域</span>
          <select value={region} onChange={(event) => {
            setRegion(event.target.value);
            trackEvent("companies_filter_use", { filter_type: "region", filter_value: event.target.value });
          }}>
            <option value="all">日本・海外すべて</option>
            <option value="japan">日本企業</option>
            <option value="overseas">海外企業</option>
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
      {filteredCompanies.length === 0 ? (
        <p className="companies-empty">条件に一致する企業はありません。キーワードまたは分類を変えて確認してください。</p>
      ) : null}
    </section>
  );
}
