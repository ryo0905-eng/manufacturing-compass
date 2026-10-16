import type { IndustryMapZoneId } from "@/data/industry-map";
import type { Source } from "@/types/content";

export type CompanyExplorerMode = "atlas" | "directory";
export type CompanyExplorerSource = "/industry-map" | "/companies";

export type CompanyExplorerItem = {
  id: string;
  name: string;
  nameJa: string;
  summary: string;
  headquartersCountry: string;
  businessModel: string;
  mainProducts: string[];
  jobCategories: string[];
  industrySegments: string[];
  primaryZone: IndustryMapZoneId;
  slug?: string;
  websiteUrl: string;
  profileKind: "company" | "map";
  sources: Source[];
  lastUpdated: string;
  hasPublicLocations: boolean;
  hasCareerPreparation: boolean;
};

export type CompanyExplorerFilters = {
  query: string;
  region: "all" | "japan" | "overseas";
  locationsOnly: boolean;
  segment: string;
};
