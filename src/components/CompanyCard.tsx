import Link from "next/link";
import type { Route } from "next";
import type { Company } from "@/types/content";

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
      <ul className="quiet-tags">
        {company.industrySegments.slice(0, 2).map((segment) => (
          <li key={segment}>{segment}</li>
        ))}
        <li>{company.jobCategories[0]}</li>
      </ul>
      <Link className="text-link" href={`/companies/${company.slug}` as Route}>
        企業詳細を見る
      </Link>
    </article>
  );
}
