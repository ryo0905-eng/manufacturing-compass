import { companies } from "@/data/companies";
import { companyLocations, locationSources } from "@/data/company-locations";
import { hiringSignals } from "@/data/hiring-signals";
import type {
  CompanyLocation,
  CompanyLocationFilters,
  EffectiveHiringSignal,
  HiringSignal,
} from "@/types/company-location";

const companyById = new Map(companies.map((company) => [company.id, company]));
const locationById = new Map(companyLocations.map((location) => [location.id, location]));
const sourceIdSet = new Set(locationSources.map((source) => source.id));

const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase("ja-JP").trim();

const hasDuplicate = (values: string[]) => new Set(values).size !== values.length;

export const getEffectiveHiringSignal = (
  signal: HiringSignal,
  asOf = new Date().toISOString().slice(0, 10),
): EffectiveHiringSignal => ({
  ...signal,
  status: signal.expiresAt < asOf ? "review-expired" : signal.status,
});

export const getHiringSignals = (asOf?: string): EffectiveHiringSignal[] =>
  hiringSignals.map((signal) => getEffectiveHiringSignal(signal, asOf));

export const getHiringSignalsByLocationId = (
  locationId: string,
  asOf?: string,
): EffectiveHiringSignal[] =>
  getHiringSignals(asOf).filter((signal) => signal.locationId === locationId);

export const getCompanyLocationById = (id: string): CompanyLocation | undefined => locationById.get(id);

export const getPublicCompanyLocations = (): CompanyLocation[] =>
  companyLocations.filter((location) => location.contentStatus === "complete");

export const filterCompanyLocations = (
  filters: CompanyLocationFilters = {},
  asOf?: string,
): CompanyLocation[] => {
  const query = filters.query ? normalize(filters.query) : "";
  const signals = getHiringSignals(asOf);

  return getPublicCompanyLocations().filter((location) => {
    const company = companyById.get(location.companyId);
    const searchableText = normalize(
      [
        company?.name,
        company?.nameJa,
        location.name,
        location.prefectureName,
        location.municipality,
        location.address,
        ...location.mainProducts,
      ]
        .filter(Boolean)
        .join(" "),
    );

    if (query && !searchableText.includes(query)) return false;
    if (filters.companyId && location.companyId !== filters.companyId) return false;
    if (filters.prefectureCode && location.prefectureCode !== filters.prefectureCode) return false;
    if (filters.locationType && !location.locationTypes.includes(filters.locationType)) return false;
    if (filters.industryCategory && !location.industryCategories.includes(filters.industryCategory)) return false;
    if (filters.jobFamily && !location.jobFamilies.includes(filters.jobFamily)) return false;
    if (filters.operationalStatus && location.operationalStatus !== filters.operationalStatus) return false;
    if (
      filters.hiringStatus &&
      !signals.some((signal) => signal.locationId === location.id && signal.status === filters.hiringStatus)
    ) {
      return false;
    }

    return true;
  });
};

export const getPublicLocationCountsByPrefecture = (): Map<string, number> => {
  const counts = new Map<string, number>();

  for (const location of getPublicCompanyLocations()) {
    counts.set(location.prefectureCode, (counts.get(location.prefectureCode) ?? 0) + 1);
  }

  return counts;
};

export const validateCompanyLocationData = (): string[] => {
  const errors: string[] = [];
  const locationIds = companyLocations.map((location) => location.id);
  const locationSlugs = companyLocations.map((location) => `${location.companyId}/${location.slug}`);
  const sourceIds = locationSources.map((source) => source.id);
  const hiringSignalIds = hiringSignals.map((signal) => signal.id);

  if (hasDuplicate(locationIds)) errors.push("CompanyLocation.id に重複があります。");
  if (hasDuplicate(locationSlugs)) errors.push("同一企業内の CompanyLocation.slug に重複があります。");
  if (hasDuplicate(sourceIds)) errors.push("LocationSource.id に重複があります。");
  if (hasDuplicate(hiringSignalIds)) errors.push("HiringSignal.id に重複があります。");

  for (const location of companyLocations) {
    if (!companyById.has(location.companyId)) {
      errors.push(`${location.id}: companyId ${location.companyId} が企業データに存在しません。`);
    }

    for (const sourceId of location.sourceIds) {
      if (!sourceIdSet.has(sourceId)) errors.push(`${location.id}: sourceId ${sourceId} が未定義です。`);
    }

    for (const entity of location.legalEntities) {
      for (const sourceId of entity.sourceIds) {
        if (!sourceIdSet.has(sourceId)) errors.push(`${location.id}: 法人の sourceId ${sourceId} が未定義です。`);
      }
    }

    for (const facility of location.facilities ?? []) {
      for (const sourceId of facility.sourceIds) {
        if (!sourceIdSet.has(sourceId)) errors.push(`${facility.id}: sourceId ${sourceId} が未定義です。`);
      }
      for (const event of facility.statusEvents ?? []) {
        if (!sourceIdSet.has(event.sourceId)) errors.push(`${facility.id}: 状態変更の sourceId ${event.sourceId} が未定義です。`);
      }
    }

    for (const event of location.statusEvents ?? []) {
      if (!sourceIdSet.has(event.sourceId)) errors.push(`${location.id}: 状態変更の sourceId ${event.sourceId} が未定義です。`);
    }
  }

  for (const signal of hiringSignals) {
    if (!companyById.has(signal.companyId)) {
      errors.push(`${signal.id}: companyId ${signal.companyId} が企業データに存在しません。`);
    }
    if (signal.locationId && !locationById.has(signal.locationId)) {
      errors.push(`${signal.id}: locationId ${signal.locationId} が未定義です。`);
    }
    if (!sourceIdSet.has(signal.sourceId)) {
      errors.push(`${signal.id}: sourceId ${signal.sourceId} が未定義です。`);
    }
    if (signal.locationFacilityId && signal.locationId) {
      const facilityExists = locationById
        .get(signal.locationId)
        ?.facilities?.some((facility) => facility.id === signal.locationFacilityId);
      if (!facilityExists) {
        errors.push(`${signal.id}: locationFacilityId ${signal.locationFacilityId} が未定義です。`);
      }
    }
  }

  return errors;
};
