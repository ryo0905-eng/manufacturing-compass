import Link from "next/link";
import type { Route } from "next";
import type { Company } from "@/types/content";

type CompanyCardProps = {
  company: Company;
};

export function CompanyCard({ company }: CompanyCardProps) {
  const primarySegment = company.industrySegments[0] ?? "other";

  return (
    <article className={`company-card company-card--${primarySegment}`}>
      <div className="company-card__heading">
        <div>
          <span className="company-card__system-label">MC / COMPANY</span>
          <p className="eyebrow">{company.businessModel}</p>
          <h3>{company.nameJa}</h3>
          <p className="company-name">{company.name}</p>
        </div>
        <span className="company-card__visual" aria-hidden="true"><i /><i /><i /></span>
      </div>
      <p className="company-card__summary">{company.summary}</p>
      <dl className="company-card__facts">
        <div><dt>主力領域</dt><dd>{company.mainProducts.slice(0, 2).join(" / ")}</dd></div>
        <div><dt>主な職種</dt><dd>{company.jobCategories.slice(0, 2).join(" / ")}</dd></div>
        <div><dt>国内拠点</dt><dd>{company.locationsJapan.slice(0, 2).join(" / ")}</dd></div>
      </dl>
      <footer className="company-card__footer">
        <span>{primarySegment.toUpperCase()}</span>
        <Link className="text-link" href={`/companies/${company.slug}` as Route}>
          企業詳細を見る <i aria-hidden="true">→</i>
        </Link>
      </footer>
    </article>
  );
}
