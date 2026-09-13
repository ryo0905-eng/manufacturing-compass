import type { DateRange, YieldRow } from "@/lib/yield-analysis";

export type YieldScenarioId = "equipment" | "mix";
export type YieldScenario = {
  id: YieldScenarioId;
  title: string;
  shortTitle: string;
  description: string;
  rows: YieldRow[];
  baseline: DateRange;
  comparison: DateRange;
  initialProduct?: string;
};

const start = new Date("2026-08-03T00:00:00Z");
const dateAt = (index: number) => new Date(start.getTime() + index * 86_400_000).toISOString().slice(0, 10);
const baseline = { start: dateAt(0), end: dateAt(27) };
const comparison = { start: dateAt(28), end: dateAt(41) };

function equipmentScenarioRows(): YieldRow[] {
  const rows: YieldRow[] = [];
  const products = ["製品A", "製品B"];
  const equipment = ["装置A", "装置B"];
  for (let day = 0; day < 42; day += 1) {
    for (let productIndex = 0; productIndex < products.length; productIndex += 1) {
      for (let equipmentIndex = 0; equipmentIndex < equipment.length; equipmentIndex += 1) {
        const inspectedCount = 92 + ((day * 7 + productIndex * 11 + equipmentIndex * 5) % 19);
        const worsened = day >= 28 && productIndex === 0 && equipmentIndex === 1;
        const rate = worsened ? 0.095 + (day % 3) * 0.008 : 0.018 + ((day + productIndex + equipmentIndex) % 3) * 0.004;
        rows.push({ date: dateAt(day), product: products[productIndex], equipment: equipment[equipmentIndex], inspectedCount, defectiveCount: Math.round(inspectedCount * rate) });
      }
    }
  }
  return rows;
}

function mixScenarioRows(): YieldRow[] {
  const rows: YieldRow[] = [];
  for (let day = 0; day < 42; day += 1) {
    const isComparison = day >= 28;
    const aInspected = isComparison ? 50 : 450;
    const bInspected = isComparison ? 450 : 50;
    for (let equipmentIndex = 0; equipmentIndex < 2; equipmentIndex += 1) {
      rows.push({ date: dateAt(day), product: "製品A", equipment: `装置${equipmentIndex ? "B" : "A"}`, inspectedCount: aInspected, defectiveCount: isComparison ? ((day + equipmentIndex) % 2) : equipmentIndex === day % 2 ? 5 : 4 });
      rows.push({ date: dateAt(day), product: "製品B", equipment: `装置${equipmentIndex ? "B" : "A"}`, inspectedCount: bInspected, defectiveCount: bInspected / 10 });
    }
  }
  return rows;
}

export const yieldScenarios: Record<YieldScenarioId, YieldScenario> = {
  equipment: {
    id: "equipment",
    title: "シナリオA｜特定装置での悪化",
    shortTitle: "A. 特定装置で悪化",
    description: "同じ製品でも、比較期間に装置Bの不良率が上昇します。全体から装置比較、同一製品へ絞って確認できます。",
    rows: equipmentScenarioRows(),
    baseline,
    comparison,
    initialProduct: "製品A",
  },
  mix: {
    id: "mix",
    title: "シナリオB｜製品構成の変化",
    shortTitle: "B. 製品構成が変化",
    description: "製品Aは99%、製品Bは90%のまま、生産割合だけが90:10から10:90へ変わり、全体歩留まりが低下します。",
    rows: mixScenarioRows(),
    baseline,
    comparison,
  },
};

export const yieldCsvTemplateRows: YieldRow[] = [
  { date: "2026-08-01", product: "製品A", equipment: "装置A", inspectedCount: 100, defectiveCount: 2 },
  { date: "2026-08-01", product: "製品A", equipment: "装置B", inspectedCount: 120, defectiveCount: 3 },
  { date: "2026-08-02", product: "製品A", equipment: "装置A", inspectedCount: 105, defectiveCount: 2 },
];
