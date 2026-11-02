import type { EquipmentRecord, Fact } from "@/types/semiconductor-database";

export type EquipmentFilters = { query: string; process: string; manufacturer: string; category: string; compare: string[] };
export const emptyEquipmentFilters: EquipmentFilters = { query: "", process: "all", manufacturer: "all", category: "all", compare: [] };
export function normalizeEquipmentSearch(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/[®™]/g, "").replace(/ウェーハ|ウェハ/g, "ウエハ").trim();
}
export function parseEquipmentFilters(params: URLSearchParams, records: readonly EquipmentRecord[]): EquipmentFilters {
  const known = (key: string, values: string[]) => values.includes(params.get(key) ?? "") ? params.get(key)! : "all";
  return {
    query: (params.get("q") ?? "").slice(0, 120),
    process: known("process", records.flatMap(r => r.processIds)),
    manufacturer: known("manufacturer", records.map(r => r.manufacturerId)),
    category: known("category", records.map(r => r.category)),
    compare: [...new Set((params.get("compare") ?? "").split(","))].filter(id => records.some(r => r.id === id)).slice(0, 3),
  };
}
export function equipmentQuery(filters: EquipmentFilters) {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  for (const key of ["process", "manufacturer", "category"] as const) if (filters[key] !== "all") params.set(key, filters[key]);
  if (filters.compare.length) params.set("compare", filters.compare.join(","));
  return params.toString();
}
export function filterEquipment(records: readonly EquipmentRecord[], filters: EquipmentFilters, manufacturerNames: Record<string, string>) {
  const tokens = normalizeEquipmentSearch(filters.query).split(/\s+/).filter(Boolean);
  return records.filter(r => (filters.process === "all" || r.processIds.includes(filters.process))
    && (filters.manufacturer === "all" || r.manufacturerId === filters.manufacturer)
    && (filters.category === "all" || r.category === filters.category)
    && tokens.every(token => normalizeEquipmentSearch([r.name, r.englishName, ...r.aliases, r.summary, r.category, manufacturerNames[r.manufacturerId], ...Object.values(r.facts).flatMap(f => f.status === "verified" ? [f.value] : [])].join(" ")).includes(token)));
}
export function toggleEquipmentComparison(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter(value => value !== id) : ids.length < 3 ? [...ids, id] : ids;
}
export function factText(fact: Fact | undefined) {
  if (!fact) return "未確認";
  return fact.status === "verified" ? fact.value : ({ unconfirmed: "未確認", "not-public": "非公開", "not-applicable": "該当なし" } as const)[fact.status];
}
