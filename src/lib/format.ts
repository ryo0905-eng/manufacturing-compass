import { companies, getCareerInfo } from "@/data/companies";
import { canonicalComparePairs, comparePairs } from "@/data/editorial";
import type { Company } from "@/types/content";

export const siteUrl = "https://mfg-compass.com";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function companyCompareSlug(companyIds: string[]) {
  const comparison = normalizeCompanyComparison(companyIds.join("-vs-"));
  if (!comparison) throw new Error("Comparison requires exactly two different known company IDs");
  return comparison.slug;
}

export function normalizeCompanyComparison(slug: string): { slug: string; companies: [Company, Company] } | null {
  const ids = slug.split("-vs-");
  if (ids.length !== 2 || ids[0] === ids[1]) return null;
  const first = companies.find((company) => company.id === ids[0]);
  const second = companies.find((company) => company.id === ids[1]);
  if (!first || !second) return null;
  // Preserve the published editorial URLs. Other pairs use stable catalog order.
  const preferred = canonicalComparePairs.find((pair) => pair.includes(first.id) && pair.includes(second.id));
  const ordered: [Company, Company] = preferred
    ? (preferred[0] === first.id ? [first, second] : [second, first])
    : (companies.indexOf(first) < companies.indexOf(second) ? [first, second] : [second, first]);
  return { slug: ordered.map((company) => company.id).join("-vs-"), companies: ordered };
}

export function getCompaniesFromCompareSlug(slug: string) {
  return normalizeCompanyComparison(slug)?.companies ?? [];
}

export function getDefaultComparePairs() {
  return comparePairs
    .map((pair) => pair.map((id) => companies.find((company) => company.id === id)))
    .filter((pair): pair is [Company, Company] => pair.length === 2 && pair.every(Boolean));
}

export function careerReadinessSummary(companyId: string) {
  const info = getCareerInfo(companyId);

  if (!info) {
    return "公開情報を確認しながら、準備ポイントを整理中です。";
  }

  return info.notes;
}
