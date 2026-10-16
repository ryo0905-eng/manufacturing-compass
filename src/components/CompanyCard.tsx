import type { Route } from "next";
import type { Company } from "@/types/content";
import { CompanyCardLogo } from "@/components/CompanyCardLogo";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";

type CompanyCardProps = {
  company: Company;
};

export function CompanyCard({ company }: CompanyCardProps) {
  const primarySegment = company.industrySegments[0] ?? "other";
  const regionLabel = company.headquartersCountry === "日本" ? "日本企業" : `海外企業・${company.headquartersCountry}`;

  return (
    <article className={`company-card company-card--${primarySegment}`}>
      <div className="company-card__heading">
        <div>
          <span className="company-card__system-label">MC / COMPANY</span>
          <p className="eyebrow">{regionLabel} / {company.businessModel}</p>
          <h3>{company.nameJa}</h3>
          <p className="company-name">{company.name}</p>
        </div>
        <CompanyCardLogo companyId={company.id} name={company.name} />
      </div>
      <p className="company-card__summary">{company.summary}</p>
      <dl className="company-card__facts">
        <div><dt>主力領域</dt><dd>{company.mainProducts.slice(0, 2).join(" / ")}</dd></div>
        <div><dt>主な職種</dt><dd>{company.jobCategories.slice(0, 2).join(" / ")}</dd></div>
        <div><dt>本社地域</dt><dd>{company.headquartersCountry}</dd></div>
      </dl>
      <footer className="company-card__footer">
        <span>{primarySegment.toUpperCase()}</span>
        <TrackedInternalLink className="text-link" href={`/companies/${company.slug}` as Route} eventName="companies_company_open" eventProperties={{ company_id: company.id, placement: "company_card", ui_version: "directory-visuals-v1" }}>
          企業詳細を見る <i aria-hidden="true">→</i>
        </TrackedInternalLink>
      </footer>
    </article>
  );
}
