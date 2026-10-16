import { directoryCompanyZones } from "@/data/company-explorer";
import { industryMapSupplementalCompanies, industryMapZones } from "@/data/industry-map";
import type { Company } from "@/types/content";
import type { CompanyExplorerFilters, CompanyExplorerItem } from "@/types/company-explorer";

export function buildDirectoryCompanies(
  companies: Company[],
  locationCompanyIds: readonly string[],
  careerCompanyIds: readonly string[],
): CompanyExplorerItem[] {
  const locations = new Set(locationCompanyIds);
  const careers = new Set(careerCompanyIds);
  return companies.map((company): CompanyExplorerItem => {
    const primaryZone = industryMapZones.find((zone) => zone.companyIds.includes(company.id))?.id
      ?? directoryCompanyZones[company.id];
    if (!primaryZone) throw new Error(`Missing company explorer role: ${company.id}`);
    return {
      id: company.id,
      slug: company.slug,
      name: company.name,
      nameJa: company.nameJa,
      summary: company.summary,
      headquartersCountry: company.headquartersCountry,
      businessModel: company.businessModel,
      mainProducts: company.mainProducts,
      jobCategories: company.jobCategories,
      industrySegments: company.industrySegments,
      primaryZone,
      websiteUrl: company.websiteUrl,
      profileKind: "company",
      sources: company.sources,
      lastUpdated: company.lastUpdated,
      hasPublicLocations: locations.has(company.id),
      hasCareerPreparation: careers.has(company.id),
    };
  });
}

export function buildAtlasCompanies(directory: CompanyExplorerItem[]): CompanyExplorerItem[] {
  const byId = new Map(directory.map((company) => [company.id, company]));
  const supplemental = new Map(industryMapSupplementalCompanies.map((company) => [company.id, company]));
  return industryMapZones.flatMap((zone) => [...zone.companyIds, ...zone.supplementalCompanyIds].map((id): CompanyExplorerItem => {
    const existing = byId.get(id);
    if (existing) return existing;
    const company = supplemental.get(id);
    if (!company) throw new Error(`Missing industry map company: ${id}`);
    return {
      ...company,
      primaryZone: zone.id,
      industrySegments: [],
      profileKind: "map" as const,
      sources: [company.source],
      lastUpdated: company.source.accessedAt,
      hasPublicLocations: false,
      hasCareerPreparation: false,
    };
  }));
}

export function normalizeCompanySearch(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("ja").trim();
}

export function filterExplorerCompanies(items: CompanyExplorerItem[], filters: CompanyExplorerFilters) {
  const tokens = normalizeCompanySearch(filters.query).split(/\s+/).filter(Boolean);
  return items.filter((company) => {
    if (filters.region === "japan" && company.headquartersCountry !== "日本") return false;
    if (filters.region === "overseas" && company.headquartersCountry === "日本") return false;
    if (filters.locationsOnly && !company.hasPublicLocations) return false;
    if (filters.segment !== "all" && !company.industrySegments.includes(filters.segment)) return false;
    const text = normalizeCompanySearch([
      company.name, company.nameJa, company.summary, company.businessModel, company.headquartersCountry,
      ...company.mainProducts, ...company.jobCategories,
    ].join(" "));
    return tokens.every((token) => text.includes(token));
  });
}
