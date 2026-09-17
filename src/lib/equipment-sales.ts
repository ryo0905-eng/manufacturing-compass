import type { EquipmentProcessSelection, EquipmentSalesCompany } from "../data/semiconductor-equipment-sales";

/** Keep the full ranking and scale fixed when highlighting a process. */
export function getEquipmentSalesView(companies: readonly EquipmentSalesCompany[], selection: EquipmentProcessSelection) {
  const max = Math.max(0, ...companies.map((company) => company.salesUsdB));
  return companies.map((company) => ({
    company,
    matches: selection === "all" || company.capabilities.some((item) => item.process === selection),
    barPercent: max > 0 ? company.salesUsdB / max * 100 : 0,
    capabilities: company.capabilities.filter((item) => selection === "all" || item.process === selection),
  }));
}
