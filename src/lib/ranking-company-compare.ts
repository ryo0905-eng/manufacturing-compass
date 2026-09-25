import { japanSemiconductorMarketCapRanking, worldSemiconductorMarketCapRanking, type SemiconductorMarketCapCompany } from "@/data/semiconductor-market-cap";
import { industryMapZones, type IndustryMapZoneId } from "@/data/industry-map";
import { japanWorkCompanies, japanWorkEvidence } from "@/data/japan-work";

export const rankingComparePath = "/guides/semiconductor-market-cap-ranking";
export const comparisonCompanies = Array.from(new Map([...worldSemiconductorMarketCapRanking, ...japanSemiconductorMarketCapRanking].map(company => [company.id, company])).values());
export const comparisonCompanyById = new Map(comparisonCompanies.map(company => [company.id, company]));
// Explicit taxonomy mapping: these explain a category, not a trading relationship.
const categoryZones: Record<string, IndustryMapZoneId[]> = {
  "ファブレス": ["fabless"], "ファブレス・ソフトウェア": ["fabless"], "ファウンドリ": ["foundry"],
  "IDM": ["idm"], "IDM（総合電機）": ["idm"], "メモリ・IDM": ["idm"], "IDM・ファウンドリ": ["idm", "foundry"],
  "EDA・IP": ["eda-ip"], "OSAT・後工程": ["osat"], "製造装置": ["equipment"], "検査・計測装置": ["inspection"],
  "材料・ウェーハ": ["materials"], "材料・フォトニクス": ["materials"], "材料・電子部品": ["materials"],
};
export function categoryExplanations(company: SemiconductorMarketCapCompany) {
  return (categoryZones[company.category] ?? []).map(id => industryMapZones.find(zone => zone.id === id)!).map(zone => ({ label: zone.label, description: zone.description }));
}
// companySlug is an explicit editorial mapping; only actual map nodes are linked.
export function comparisonMapId(company: SemiconductorMarketCapCompany) {
  const supplementalMapping: Record<string, string> = { arm: "arm", synopsys: "synopsys", ase: "ase" };
  const id = company.companySlug ?? supplementalMapping[company.id];
  return id && industryMapZones.some(zone => [...zone.companyIds, ...zone.supplementalCompanyIds].includes(id)) ? id : undefined;
}
export function domesticRank(id: string) { return japanSemiconductorMarketCapRanking.find(company => company.id === id)?.domesticRank; }
// Both catalogs use the same fixed company IDs; never infer a match from names.
export function comparisonJapanWorks(id: string) {
  if (!comparisonCompanyById.has(id) || !japanWorkCompanies.some(company => company.companyId === id && company.status === "published")) return [];
  return japanWorkEvidence.filter(work => work.companyId === id && work.status === "published");
}
export function addComparisonCompany(ids: readonly string[], id: string): { ids: string[]; notice: string } {
  if (!comparisonCompanyById.has(id) || ids.includes(id)) return { ids: [...ids], notice: "" };
  if (ids.length >= 2) return { ids: [...ids], notice: "比較は2社までです。選択中の会社を外してから追加してください。" };
  return { ids: [...ids, id], notice: "" };
}
export function readRankingComparisonHash(hash: string): { kind: "anchor" } | { kind: "invalid" } | { kind: "pair"; ids: [string, string] } {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  if (!params.has("compare")) return { kind: "anchor" };
  const ids = params.get("compare")!.split(",");
  if (params.getAll("compare").length !== 1 || ids.length !== 2 || ids[0] === ids[1] || ids.some(id => !comparisonCompanyById.has(id))) return { kind: "invalid" };
  return { kind: "pair", ids: [ids[0], ids[1]] };
}
export function rankingComparisonUrl(origin: string, ids: readonly string[]) {
  if (readRankingComparisonHash(`#compare=${ids.join(",")}`).kind !== "pair") throw new Error("2社を選択してください。");
  return `${origin}${rankingComparePath}#compare=${ids.join(",")}`;
}
export type CompareSource = "world" | "japan" | "example" | "shared_link";
export type CompareDestination = "company" | "industry_map" | "japan_work";
export type CompareAction = "entry_view" | "selection_start" | "result_view" | "related_click" | "copy_success";
export function comparisonEventProperties(action: CompareAction, ids: readonly string[], source: CompareSource, destination?: CompareDestination) {
  const safeIds = ids.filter(id => comparisonCompanyById.has(id)).slice(0, 2);
  return { action, ...(action === "entry_view" ? {} : { source }), ...(safeIds[0] ? { company_a: safeIds[0] } : {}), ...(safeIds[1] ? { company_b: safeIds[1] } : {}), ...(destination ? { destination } : {}) };
}
