import { CareerCompassCta } from "@/components/CareerCompassCta";
import { CompanyExplorer } from "@/components/CompanyExplorer";
import { getCareerInfo } from "@/data/companies";
import { getPublicCompanyLocations } from "@/lib/company-locations";
import { buildDirectoryCompanies } from "@/lib/company-explorer";
import type { Company, IndustrySegment } from "@/types/content";

type FilterableCompaniesProps = {
  companies: Company[];
  initialQuery?: string;
  segments: IndustrySegment[];
};

export function FilterableCompanies({ companies, initialQuery = "", segments }: FilterableCompaniesProps) {
  const items = buildDirectoryCompanies(
    companies,
    getPublicCompanyLocations().map((location) => location.companyId),
    companies.filter((company) => getCareerInfo(company.id)).map((company) => company.id),
  );
  return <>
    <CompanyExplorer mode="directory" sourcePage="/companies" items={items} initialQuery={initialQuery} segments={segments} />
    <CareerCompassCta
      body="企業の分野を調べたあと、現在の仕事内容と実績から、接点のある半導体職種と次に準備したいことを整理できます。"
      ctaLocation="companies_after_filters"
      ctaVariant="company_research_to_role"
      sourcePage="/companies"
      title="気になる企業の分野が見えてきたら、自分の経験も同じ軸で見る"
    />
  </>;
}
