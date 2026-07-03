import { companies, getCareerInfo } from "@/data/companies";
import type { Company } from "@/types/content";

export const siteUrl = "https://manufacturing-compass.vercel.app";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function companyCompareSlug(companyIds: string[]) {
  return companyIds.join("-vs-");
}

export function getCompaniesFromCompareSlug(slug: string) {
  const ids = slug.split("-vs-");
  return ids
    .map((id) => companies.find((company) => company.id === id))
    .filter((company): company is Company => Boolean(company));
}

export function getDefaultComparePairs() {
  return [
    [companies[0], companies[1]],
    [companies[0], companies[2]],
    [companies[2], companies[3]],
  ].filter((pair) => pair.every(Boolean));
}

export function careerReadinessSummary(companyId: string) {
  const info = getCareerInfo(companyId);

  if (!info) {
    return "公開情報を確認しながら、準備ポイントを整理中です。";
  }

  return info.notes;
}
