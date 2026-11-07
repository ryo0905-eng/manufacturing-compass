import { factoryProjects } from "@/data/factory-projects";
import { getPublicCompanyLocations } from "@/lib/company-locations";
import type { FactoryProject } from "@/data/factory-projects";
import type { CompanyLocation } from "@/types/company-location";

export type PrefectureLocations = {
  slug: string;
  name: string;
  code: string;
  locations: CompanyLocation[];
  projects: FactoryProject[];
  lastVerifiedAt: string;
};

export function getPrefectureLocationPages(
  locations = getPublicCompanyLocations(),
  projects = factoryProjects,
): PrefectureLocations[] {
  const groups = new Map<string, CompanyLocation[]>();
  for (const location of locations) {
    const group = groups.get(location.prefectureSlug) ?? [];
    group.push(location);
    groups.set(location.prefectureSlug, group);
  }

  return Array.from(groups, ([slug, items]) => {
    const ids = new Set(items.map(item => item.id));
    return {
      slug,
      name: items[0].prefectureName,
      code: items[0].prefectureCode,
      locations: items,
      projects: projects.filter(project => ids.has(project.locationId)),
      lastVerifiedAt: items.reduce((latest, item) => item.lastVerifiedAt > latest ? item.lastVerifiedAt : latest, ""),
    };
  }).filter(group => group.locations.length >= 2 || group.projects.length > 0)
    .sort((a, b) => a.code.localeCompare(b.code));
}
