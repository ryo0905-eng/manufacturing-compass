import type { DashboardLot, DefectKey, ProcessConditions } from "@/lib/yield-dashboard";

export const defectLabels: Record<DefectKey, string> = {
  thickness: "膜厚外れ",
  particle: "異物",
  alignment: "位置ずれ",
  electrical: "電気特性外れ",
};

const start = new Date("2026-08-03T00:00:00Z");
const dateAt = (day: number) => new Date(start.getTime() + day * 86_400_000).toISOString().slice(0, 10);

function makeLots(): DashboardLot[] {
  const lots: DashboardLot[] = [];
  const products = ["AX-7", "BZ-4"];
  const equipment = ["CVD-01", "CVD-02"];
  for (let day = 0; day < 14; day += 1) {
    for (let productIndex = 0; productIndex < products.length; productIndex += 1) {
      for (let equipmentIndex = 0; equipmentIndex < equipment.length; equipmentIndex += 1) {
        const product = products[productIndex];
        const tool = equipment[equipmentIndex];
        const affected = day >= 8 && product === "AX-7" && tool === "CVD-02";
        const inspected = 480 + ((day * 17 + productIndex * 29 + equipmentIndex * 13) % 61);
        const defects = {
          thickness: affected ? 37 + (day % 4) * 3 : 3 + ((day + equipmentIndex) % 3),
          particle: 2 + ((day + productIndex * 2) % 4),
          alignment: 1 + ((day + equipmentIndex) % 3),
          electrical: 2 + ((day + productIndex + equipmentIndex) % 3),
        };
        const defective = Object.values(defects).reduce((sum, value) => sum + value, 0);
        lots.push({
          id: `F26-${String(day + 3).padStart(2, "0")}-${product.replace("-", "")}-${equipmentIndex + 1}`,
          date: dateAt(day), product, equipment: tool, inspected, good: inspected - defective, defects,
          conditions: {
            pressurePa: affected ? 455 : 410,
            rfPowerW: 620 + ((day + productIndex) % 2) * 2,
            temperatureC: 350 + ((day + equipmentIndex) % 2),
            gasFlowSccm: 180 + ((day + productIndex + equipmentIndex) % 3),
          },
        });
      }
    }
  }
  return lots;
}

export const yieldDashboardLots = makeLots();

export const dashboardPeriods = {
  all: { label: "全期間", start: "2026-08-03", end: "2026-08-16" },
  baseline: { label: "変更前 8/3〜8/10", start: "2026-08-03", end: "2026-08-10" },
  anomaly: { label: "低下期間 8/11〜8/16", start: "2026-08-11", end: "2026-08-16" },
} as const;

export const changeHistory = [
  { id: "history-clean", at: "2026-08-07 18:10", equipment: "CVD-01", type: "定期保全", detail: "チャンバー清掃を実施。条件変更なし", relevance: "comparison" },
  { id: "history-recipe", at: "2026-08-10 19:30", equipment: "CVD-02", type: "条件変更", detail: "AX-7の圧力設定を410 Paから455 Paへ変更", relevance: "candidate" },
  { id: "history-pump", at: "2026-08-13 08:20", equipment: "CVD-02", type: "点検", detail: "真空ポンプ点検。異常所見なし", relevance: "later" },
] as const;

export type ConfirmationRun = {
  id: string;
  group: "observation" | "confirmation";
  label: string;
  condition: ProcessConditions;
  inspected: number;
  defects: Record<DefectKey, number>;
};

export const confirmationRuns: ConfirmationRun[] = [
  { id: "confirm-current", group: "confirmation", label: "確認1｜変更後条件 455 Pa", condition: { pressurePa: 455, rfPowerW: 621, temperatureC: 350, gasFlowSccm: 180 }, inspected: 500, defects: { thickness: 43, particle: 4, alignment: 2, electrical: 3 } },
  { id: "confirm-return", group: "confirmation", label: "確認2｜410 Paへ戻す", condition: { pressurePa: 410, rfPowerW: 621, temperatureC: 350, gasFlowSccm: 180 }, inspected: 500, defects: { thickness: 5, particle: 3, alignment: 2, electrical: 3 } },
  { id: "confirm-repeat", group: "confirmation", label: "確認3｜410 Paで再現", condition: { pressurePa: 410, rfPowerW: 620, temperatureC: 350, gasFlowSccm: 181 }, inspected: 500, defects: { thickness: 6, particle: 4, alignment: 2, electrical: 2 } },
];
