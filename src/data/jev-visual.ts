import type { JevRoute } from "./jev-demo";

export const jevVisualVersion = "pixel-investigation-v1";
export type FactoryArea = "material" | "equipment" | "metrology" | "records";
export const factoryAreas: { id: FactoryArea; label: string }[] = [
  { id: "material", label: "材料" },
  { id: "equipment", label: "装置" },
  { id: "metrology", label: "検査器" },
  { id: "records", label: "記録" },
];
export const routeArea: Record<JevRoute, FactoryArea> = {
  material: "material", maintenance: "equipment", fdc: "equipment", recipe: "equipment",
  metrology: "metrology", spc: "records", history: "records", inspection: "records", collect: "records",
};
export const visualEvidence = {
  "across-tools": {
    label: "装置を比べる", title: "材料が同じなら、別の装置でも？",
    columns: ["装置A", "装置B"], rowLabels: ["旧材料", "新材料"],
    outcomes: [["usual", "usual"], ["increase", "increase"]],
    caption: "同じ製品・検査条件。再測定でも同じ傾向。",
  },
  "same-specimen": {
    label: "検査器を比べる", title: "同じ試料なのに、結果が違う。",
    columns: ["検査器①", "検査器②"], rowLabels: ["旧材料の試料", "新材料の試料"],
    outcomes: [["increase", "usual"], ["increase", "usual"]],
    caption: "各行は同じ試料。検査器間の差は、まだ再確認していない。",
  },
} as const;
export function getVisualEvidence(id: string | null) {
  return id === "across-tools" || id === "same-specimen" ? visualEvidence[id] : null;
}
