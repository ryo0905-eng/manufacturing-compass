import Link from "next/link";
import type { Route } from "next";
import type { Company } from "@/types/content";
import { careerReadinessSummary } from "@/lib/format";

type CompanyCardProps = {
  company: Company;
};

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <article className="company-card">
      <div>
        <p className="eyebrow">{company.businessModel}</p>
        <h3>{company.nameJa}</h3>
        <p className="company-name">{company.name}</p>
      </div>
      <p>{company.summary}</p>
      <dl className="mini-facts">
        <div>
          <dt>主な職種</dt>
          <dd>{company.jobCategories.slice(0, 3).join(" / ")}</dd>
        </div>
        <div>
          <dt>英語</dt>
          <dd>{company.englishRequirement}</dd>
        </div>
      </dl>
      <p className="readiness-note">{careerReadinessSummary(company.id)}</p>
      <Link className="text-link" href={`/companies/${company.slug}` as Route}>
        企業詳細を見る
      </Link>
    </article>
  );
}
