import type { JevRoute } from "./jev-demo";
export const jevVisualVersion = "probability-flow-v3";

export function formatProbability(value: number): string {
  return value > 0 && value < 0.001 ? "0.1％未満" : (value * 100).toFixed(1) + "％";
}

export function formatProbabilityDelta(before: number, after: number): string {
  const points = Math.round((after - before) * 1000) / 10;
  return points === 0 ? "±0.0pt" : (points > 0 ? "+" : "−") + Math.abs(points).toFixed(1) + "pt";
}
export type FactoryArea = "material" | "equipment" | "metrology" | "records";
export const factoryAreas: { id: FactoryArea; label: string }[] = [
  { id: "material", label: "材料" }, { id: "equipment", label: "装置" },
  { id: "metrology", label: "検査器" }, { id: "records", label: "記録" },
];
export const routeArea: Record<JevRoute, FactoryArea> = {
  material: "material", maintenance: "equipment", fdc: "equipment", recipe: "equipment",
  metrology: "metrology", spc: "records", history: "records", inspection: "records", collect: "records",
};
export type VisualScene = { title: string; note: string; stations: Record<FactoryArea, readonly string[]> };
export type VisualCase = { label: string; initial: VisualScene; branches: readonly { id: string; label: string; scene: VisualScene }[] };
export const visualCases: Record<string, VisualCase> = {
  batch: {
    label: "① 不合格",
    initial: { title: "材料を替えたら、不合格が増えた。", note: "材料以外の変更は、まだ分からない。",
      stations: { material: ["旧 → 新"], equipment: ["変更 ?"], metrology: ["不合格 ↑"], records: ["比較なし"] } },
    branches: [
      { id: "across-tools", label: "A 装置比較", scene: { title: "新材料だと、装置AでもBでも増える。", note: "同じ製品・検査条件。再測定でも同じ傾向。",
        stations: { material: ["旧 / 新"], equipment: ["装置 A ｜ B", "旧 → ｜ →", "新 ↑ ｜ ↑"], metrology: ["同じ条件"], records: ["再測定も一致"] } } },
      { id: "same-specimen", label: "B 検査器比較", scene: { title: "同じ試料。検査器を替えると結果が違う。", note: "新旧どちらの材料でも同じ差。再確認はまだ。",
        stations: { material: ["旧も新も"], equipment: ["同じ試料"], metrology: ["検査器 ①｜②", "不合格 ↑｜→"], records: ["再確認 ?"] } } },
    ],
  },
  shift: {
    label: "② 測定値",
    initial: { title: "清掃の翌日、測定値が上がった。", note: "装置の清掃と検査器の校正は同じ日。",
      stations: { material: ["変更なし"], equipment: ["装置A 清掃"], metrology: ["校正", "測定値 ↑"], records: ["同じ日"] } },
    branches: [
      { id: "reference", label: "A 基準試料", scene: { title: "加工していない基準試料まで、高く出る。", note: "同じ基準試料を別の検査器で比較。再測定はまだ。",
        stations: { material: ["変更なし"], equipment: ["基準は未加工"], metrology: ["検査器 ①｜②", "基準 ↑ ｜ →"], records: ["再測定 ?"] } } },
      { id: "serviced-only", label: "B 装置比較", scene: { title: "どちらの検査器でも、装置Aの製品だけ高い。", note: "同じ材料・製品。別の検査器で再測定しても同じ差。",
        stations: { material: ["同じ材料"], equipment: ["清掃A｜未清掃B", "値 ↑ ｜ →"], metrology: ["基準は両方 →"], records: ["再測定も一致"] } } },
    ],
  },
  unclear: {
    label: "③ 記録",
    initial: { title: "「不良が増えた」。でも、記録がない。", note: "材料が怪しいという話だけでは、まだ決められない。",
      stations: { material: ["疑いのみ ?"], equipment: ["対象 ?"], metrology: ["条件 ?"], records: ["時刻・ロット ?"] } },
    branches: [
      { id: "overlap", label: "A 同時変更", scene: { title: "材料の切替と装置の保全が、同時だった。", note: "どちらか一つだけを変えた比較はない。",
        stations: { material: ["切替"], equipment: ["装置A 保全"], metrology: ["条件 ?"], records: ["切替 ＝ 保全", "同じ時刻"] } } },
      { id: "conflict", label: "B 記録の矛盾", scene: { title: "同じロットなのに、二つの記録が食い違う。", note: "どちらが正しいか、まだ確認できていない。",
        stations: { material: ["変更あり / なし", "?"], equipment: ["経路 A / B", "?"], metrology: ["比較なし"], records: ["記録① ≠ 記録②"] } } },
    ],
  },
};
export function getVisualScene(sampleId: string, evidenceId: string | null): VisualScene {
  const item = visualCases[sampleId] ?? visualCases.batch;
  return item.branches.find(branch => branch.id === evidenceId)?.scene ?? item.initial;
}
