import { CompanyExplorer } from "@/components/CompanyExplorer";
import { getCareerInfo } from "@/data/companies";
import { getPublicCompanyLocations } from "@/lib/company-locations";
import { buildAtlasCompanies, buildDirectoryCompanies } from "@/lib/company-explorer";
import type { Company, IndustrySegment } from "@/types/content";

export function IndustryAtlas({ companies, initialQuery = "", segments }: { companies: Company[]; initialQuery?: string; segments: IndustrySegment[] }) {
  const directory = buildDirectoryCompanies(
    companies,
    getPublicCompanyLocations().map((location) => location.companyId),
    companies.filter((company) => getCareerInfo(company.id)).map((company) => company.id),
  );
  return <CompanyExplorer key={initialQuery} items={buildAtlasCompanies(directory)} initialQuery={initialQuery} segments={segments} />;
}
