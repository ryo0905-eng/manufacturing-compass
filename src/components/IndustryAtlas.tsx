import { CompanyExplorer } from "@/components/CompanyExplorer";
import { getCareerInfo } from "@/data/companies";
import { getPublicCompanyLocations } from "@/lib/company-locations";
import { buildAtlasCompanies, buildDirectoryCompanies } from "@/lib/company-explorer";
import type { Company } from "@/types/content";

export function IndustryAtlas({ companies }: { companies: Company[] }) {
  const directory = buildDirectoryCompanies(
    companies,
    getPublicCompanyLocations().map((location) => location.companyId),
    companies.filter((company) => getCareerInfo(company.id)).map((company) => company.id),
  );
  return <CompanyExplorer mode="atlas" sourcePage="/industry-map" items={buildAtlasCompanies(directory)} fallbackItems={directory} />;
}
