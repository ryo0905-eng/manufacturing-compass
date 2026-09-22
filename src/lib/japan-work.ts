import type { JapanWorkCompanyView, JapanWorkEvidence, JapanWorkFilters } from "@/types/japan-work";

export function matchesJapanWork(work: JapanWorkEvidence, filters: JapanWorkFilters): boolean {
  return work.status === "published"
    && (!filters.category || work.categories.includes(filters.category))
    && (!filters.prefecture || work.prefectures.includes(filters.prefecture));
}

export function filterJapanWorkCompanies(companies: JapanWorkCompanyView[], filters: JapanWorkFilters): JapanWorkCompanyView[] {
  return companies.filter((company) => company.status === "published" && company.works.some((work) => matchesJapanWork(work, filters)));
}

export function toggleJapanWorkComparison(ids: string[], id: string, allowedIds: string[]): string[] {
  const valid = [...new Set(ids)].filter((item) => allowedIds.includes(item)).slice(0, 2);
  if (!allowedIds.includes(id)) return valid;
  if (valid.includes(id)) return valid.filter((item) => item !== id);
  return valid.length < 2 ? [...valid, id] : valid;
}

export function isJapanWorkReviewExpired(work: Pick<JapanWorkEvidence, "nextReviewAt">, asOf: string): boolean {
  return work.nextReviewAt < asOf;
}

export function validateJapanWorkEvidence(
  works: JapanWorkEvidence[],
  companyIds: string[],
  sourceIds: string[],
  locations: { id: string; companyId: string; prefectureName: string }[],
  categoryIds: string[],
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const work of works) {
    if (ids.has(work.id)) errors.push(`${work.id}: duplicate ID`);
    ids.add(work.id);
    if (!companyIds.includes(work.companyId)) errors.push(`${work.id}: unknown company`);
    if (!work.categories.length || work.categories.some((id) => !categoryIds.includes(id))) errors.push(`${work.id}: invalid category`);
    if (!work.classificationReason.trim()) errors.push(`${work.id}: missing classification reason`);
    if (!work.sourceIds.length || work.sourceIds.some((id) => !sourceIds.includes(id))) errors.push(`${work.id}: invalid source`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(work.checkedAt) || !/^\d{4}-\d{2}-\d{2}$/.test(work.nextReviewAt) || work.checkedAt > work.nextReviewAt) errors.push(`${work.id}: invalid review dates`);
    for (const id of work.locationIds) {
      const location = locations.find((item) => item.id === id);
      if (!location || location.companyId !== work.companyId || !work.prefectures.includes(location.prefectureName)) errors.push(`${work.id}: invalid location relationship`);
    }
  }
  return errors;
}
