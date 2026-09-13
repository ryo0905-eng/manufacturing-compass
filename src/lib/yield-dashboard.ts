export const defectKeys = ["thickness", "particle", "alignment", "electrical"] as const;
export type DefectKey = (typeof defectKeys)[number];

export type ProcessConditions = {
  pressurePa: number;
  rfPowerW: number;
  temperatureC: number;
  gasFlowSccm: number;
};

export type DashboardLot = {
  id: string;
  date: string;
  product: string;
  equipment: string;
  inspected: number;
  good: number;
  defects: Record<DefectKey, number>;
  conditions: ProcessConditions;
};

export type DashboardFilters = {
  dateStart: string;
  dateEnd: string;
  product: string;
  equipment: string;
  focusDefect: DefectKey | "";
};

export type DashboardSummary = {
  lotCount: number;
  inspected: number;
  good: number;
  defective: number;
  yieldRate: number | null;
};

export type BreakdownRow = DashboardSummary & { key: string };

export function lotDefective(lot: DashboardLot) {
  return defectKeys.reduce((sum, key) => sum + lot.defects[key], 0);
}

export function summarizeLots(lots: DashboardLot[]): DashboardSummary {
  const inspected = lots.reduce((sum, lot) => sum + lot.inspected, 0);
  const good = lots.reduce((sum, lot) => sum + lot.good, 0);
  return {
    lotCount: lots.length,
    inspected,
    good,
    defective: inspected - good,
    yieldRate: inspected ? good / inspected : null,
  };
}

export function filterDashboardLots(lots: DashboardLot[], filters: DashboardFilters) {
  return lots.filter((lot) =>
    lot.date >= filters.dateStart
    && lot.date <= filters.dateEnd
    && (!filters.product || lot.product === filters.product)
    && (!filters.equipment || lot.equipment === filters.equipment));
}

export function summarizeDefects(lots: DashboardLot[]) {
  return defectKeys.map((key) => ({
    key,
    count: lots.reduce((sum, lot) => sum + lot.defects[key], 0),
  })).sort((left, right) => right.count - left.count);
}

export function groupLots(lots: DashboardLot[], dimension: "date" | "product" | "equipment"): BreakdownRow[] {
  const keys = [...new Set(lots.map((lot) => lot[dimension]))].sort((a, b) => a.localeCompare(b, "ja"));
  return keys.map((key) => ({ key, ...summarizeLots(lots.filter((lot) => lot[dimension] === key)) }));
}

export function groupDefectRate(lots: DashboardLot[], dimension: "product" | "equipment", defect: DefectKey): BreakdownRow[] {
  return groupLots(lots, dimension).map((row) => {
    const selected = lots.filter((lot) => lot[dimension] === row.key);
    const defective = selected.reduce((sum, lot) => sum + lot.defects[defect], 0);
    return { ...row, defective, yieldRate: row.inspected ? 1 - defective / row.inspected : null };
  });
}

export function averageConditions(lots: DashboardLot[]): ProcessConditions | null {
  if (!lots.length) return null;
  const sum = lots.reduce((current, lot) => ({
    pressurePa: current.pressurePa + lot.conditions.pressurePa,
    rfPowerW: current.rfPowerW + lot.conditions.rfPowerW,
    temperatureC: current.temperatureC + lot.conditions.temperatureC,
    gasFlowSccm: current.gasFlowSccm + lot.conditions.gasFlowSccm,
  }), { pressurePa: 0, rfPowerW: 0, temperatureC: 0, gasFlowSccm: 0 });
  return {
    pressurePa: sum.pressurePa / lots.length,
    rfPowerW: sum.rfPowerW / lots.length,
    temperatureC: sum.temperatureC / lots.length,
    gasFlowSccm: sum.gasFlowSccm / lots.length,
  };
}

export function validateDashboardLots(lots: DashboardLot[]) {
  const ids = new Set<string>();
  const errors: string[] = [];
  for (const lot of lots) {
    if (ids.has(lot.id)) errors.push(`${lot.id}: lot ID is duplicated`);
    ids.add(lot.id);
    const defects = lotDefective(lot);
    if (lot.inspected <= 0 || lot.good < 0 || lot.good + defects !== lot.inspected) {
      errors.push(`${lot.id}: good + exclusive defects must equal inspected`);
    }
  }
  return errors;
}
