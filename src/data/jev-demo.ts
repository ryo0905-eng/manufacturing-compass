export const jevModel = "typesafe-ai/jev";
export const jevQuestionVersion = "investigation-routing-v1";
export const jevVerifiedAt = "2026-09-20";
export const jevInputPricePerMillion = 0.042;

export const jevCategories = {
  equipment: { label: "設備・保全", criteria: "Only production equipment, maintenance, cleaning or recipe changes are explicitly recorded. Multiple changes in this same category remain equipment. Measuring instruments belong to measurement." },
  material: { label: "材料", criteria: "Only raw material or consumable batch/source changes are explicitly recorded." },
  measurement: { label: "測定・検査", criteria: "Only measurement/inspection instrument, calibration, method or threshold changes are explicitly recorded." },
  multiple: { label: "複数領域", criteria: "Explicit changes span at least two categories: production equipment, material, measurement. Multiple actions in one category do not qualify." },
  unknown: { label: "変更記載なし", criteria: "No change is explicitly recorded. Symptoms, suspicions, missing records and denied changes are not changes." },
} as const;
export type JevCategory = keyof typeof jevCategories;

interface RouteDefinition {
  label: string; code: string; criteria: string; next: string;
  href?: string; link?: string;
}
export const jevRoutes = {
  spc: { label: "時系列・管理図", code: "SPC", criteria: "Review time-ordered trends and control charts when the onset, persistence or statistical stability is the unresolved issue and no more specific evidence source is indicated.", next: "時間順のデータで、変化が始まった位置と継続性を確認します。", href: "/tools/control-chart", link: "管理図を体験する" },
  fdc: { label: "装置ログ", code: "FDC", criteria: "Review equipment sensor traces or alarm logs when instrument readings or alarms during processing are implicated, rather than a documented maintenance event.", next: "該当時刻のセンサー波形と警報ログを照合します。このサイトにFDC解析の接続はありません。" },
  maintenance: { label: "保全履歴", code: "Maintenance", criteria: "Review maintenance work details when the anomaly is localized to serviced equipment and comparable material/measurement observations support checking that work.", next: "作業内容・実施時刻と、保全前後の記録を確認します。設備操作は行いません。" },
  recipe: { label: "工程条件", code: "Recipe", criteria: "Compare recorded recipe versions and setpoints when a process-condition difference is the most specific unresolved lead.", next: "設定値と実際の条件を分け、比較可能な条件をそろえます。", href: "/tools/process-comparison", link: "工程条件の比較を体験する" },
  material: { label: "材料・ロット", code: "Material", criteria: "Trace material batches when the anomaly follows the same material across comparable equipment and measurements, or a material change is the only concrete lead with no contradictory measurement evidence.", next: "材料ロットと製造ロットを対応させ、装置をまたぐ傾向を確認します。", href: "/tools/yield-analysis", link: "歩留まりの比較を体験する" },
  metrology: { label: "測定系", code: "Metrology", criteria: "Check measurement validity when the same specimen gets conflicting results across instruments/methods, reference specimens shift, or inspection thresholds changed. Resolve comparability before trusting apparent process/material differences.", next: "同じ試料・基準試料を使い、測定器や判定基準による差を確認します。", href: "/tools/gage-rr", link: "測定のばらつきを体験する" },
  history: { label: "工程履歴", code: "Process History", criteria: "Reconstruct lot/equipment/change chronology when concrete changes overlap, cannot be separated, or records conflict and attribution requires tracing which conditions each lot experienced.", next: "ロットが通った装置・時刻・変更履歴を並べ、比較できる組合せを探します。", href: "/tools/yield-dashboard", link: "履歴をつないだ調査を体験する" },
  inspection: { label: "欠陥の分布", code: "Defect Inspection", criteria: "Inspect defect images, locations or morphology when the defect pattern is the main unresolved lead and measurement validity is not in dispute.", next: "欠陥の位置・形状・種類を分けて偏りを確認します。リンク先では調査の流れを学べます。", href: "/tools/yield-dashboard", link: "原因調査の流れを体験する" },
  collect: { label: "基本情報を集める", code: "Collect Facts", criteria: "Collect basic facts when the report lacks any concrete discriminating evidence: onset, affected equipment/lots, measurements or verified changes. A guess alone is insufficient.", next: "発生時刻、対象ロット・装置、測定方法、変更記録を集めます。" },
} as const satisfies Record<string, RouteDefinition>;
export type JevRoute = keyof typeof jevRoutes;
export function jevRouteInfo(key: JevRoute): RouteDefinition { return jevRoutes[key]; }

// One dimension: how much usable isolation evidence is recorded, not urgency or safety.
export const jevCompletenessLevels = [
  { label: "症状のみ", criteria: "Only a vague symptom or suspicion; affected population and timing are not established." },
  { label: "対象が具体的", criteria: "Affected equipment/lots or timing are concrete, but change history and controlled comparisons are absent." },
  { label: "履歴あり", criteria: "Concrete change/history records exist, but no usable controlled comparison result is reported, or comparisons are too confounded or contradictory to isolate conditions." },
  { label: "比較あり", criteria: "At least one usable comparison result separates conditions (same specimen across instruments, same material across equipment, or comparable before/after observations); independent confirmation is absent." },
  { label: "再確認あり", criteria: "A usable discriminating comparison has been independently repeated or confirmed, with the compared conditions documented. This does not establish root cause." },
] as const;

export interface JevEvidence { id: string; title: string; report: string }
export interface JevSample { id: string; title: string; report: string; evidence: readonly JevEvidence[] }

// Fictional educational states. Branches are alternative situations, never cumulative.
export const jevSamples: readonly JevSample[] = [
  {
    id: "batch", title: "不合格が増えた",
    report: "半導体の量産工程で、材料ロットを切り替えた後から不合格が増えた。材料以外の記録と比較データは、まだ確認していない。",
    evidence: [
      { id: "across-tools", title: "別の装置でも同じ傾向", report: "同じ材料を使った装置A・Bで増加し、従来材料のロットは両装置で従来どおりだった。同じ製品・検査条件で比較し、再測定でも傾向が再現した。設備と検査条件の変更はない。" },
      { id: "same-specimen", title: "同じ試料なのに結果が違う", report: "同じ試料を別の検査器で測ると従来どおりの結果だった。新旧どちらの材料の試料も、元の検査器だけ不合格が増えた。検査設定の変更記録はなく、測定器間の差はまだ再確認していない。" },
    ],
  },
  {
    id: "shift", title: "測定値がずれた",
    report: "装置Aの清掃翌日から、製品の測定値が高くなった。同じ日に検査器も校正されている。材料は変えていない。",
    evidence: [
      { id: "reference", title: "基準試料もずれていた", report: "加工していない保管中の基準試料も、校正した検査器では高い値になった。別の検査器では従来どおりだった。再測定はまだ行っていない。" },
      { id: "serviced-only", title: "装置Aの製品だけに偏る", report: "基準試料は両検査器とも従来どおりだった。同じ材料・同じ製品を装置Aと未清掃の装置Bで比較すると、装置Aの製品だけが高い。別の検査器で再測定しても同じ差を確認した。" },
    ],
  },
  {
    id: "unclear", title: "原因候補が食い違う",
    report: "半導体製品の不良が増えたという連絡があった。担当者は材料を疑っているが、発生時刻、対象ロット、装置、変更記録は未確認。",
    evidence: [
      { id: "overlap", title: "変更時刻が重なっていた", report: "記録から、装置Aの保全と材料切り替えが同じ時刻に行われ、その後のロットで増加したと分かった。片方だけを変えた比較はなく、測定条件も未確認。" },
      { id: "conflict", title: "記録同士が矛盾している", report: "同じロットの装置履歴が二つあり、装置Aと装置Bのどちらを通ったか食い違う。材料の変更有無も二つの記録で矛盾している。どちらが正しいか確認できず、比較データはない。" },
    ],
  },
];
