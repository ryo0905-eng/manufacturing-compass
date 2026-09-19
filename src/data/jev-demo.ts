export const jevModel = "typesafe-ai/jev";
export const jevQuestionVersion = "report-change-v2";
export const jevVerifiedAt = "2026-09-20";
export const jevInputPricePerMillion = 0.042;

export const jevCategories = {
  equipment: { label: "設備・保全の変更", criteria: "A production equipment adjustment, repair, maintenance or cleaning change is explicitly reported, with no simultaneous material or measurement change. Multiple changes that all belong to production equipment still count as equipment. A measuring or inspection instrument belongs to measurement, not equipment.", next: "作業記録と発生時刻を照合し、変更前後・別装置の同じ製品で差を確認します。時間的な前後関係だけでは原因を確定できません。", href: "/tools/yield-dashboard", link: "歩留まり原因調査を体験する" },
  material: { label: "材料の変更", criteria: "A raw material or consumable batch/source change is explicitly reported, with no simultaneous equipment or measurement change.", next: "材料ロットと製造ロットの対応、受入記録、他の装置で同じ材料を使った場合を確認します。", href: "/tools/yield-dashboard", link: "ロットを分けた調査を学ぶ" },
  measurement: { label: "測定・検査の変更", criteria: "A measuring or inspection instrument, measurement method, calibration, inspection threshold or inspector change is explicitly reported, with no simultaneous production-equipment or material change. Replacement or calibration of a measuring instrument counts only as measurement.", next: "同じ試料の再測定、基準試料、測定手順と判定基準の変更履歴を確認します。", href: "/tools/gage-rr", link: "測定のばらつきを学ぶ" },
  multiple: { label: "複数の変更", criteria: "Changes in at least two different categories among production equipment, material, and measurement are explicitly reported. Never select multiple merely because two or more changes occurred within the same category.", next: "変更点を時系列で並べ、一つずつ切り分けて比較できるデータや確認実験を検討します。", href: "/tools/doe", link: "確認実験の考え方を学ぶ" },
  unknown: { label: "変更の記載なし・情報不足", criteria: "No change in any of equipment, material or measurement is explicitly reported. Defects, suspected causes, denied changes, and requests to investigate alone are not evidence of a change.", next: "発生時刻、対象製品・装置・材料ロット、測定方法、直前の変更履歴を集めます。記載がないことと、変更がないことは別です。", href: "/tools/control-chart", link: "時系列の変化を学ぶ" },
} as const;
export type JevCategory = keyof typeof jevCategories;
export type JevVariant = "before" | "after";
export interface JevSample {
  id: string; title: string; report: string; additional: string;
  expected: Record<JevVariant, JevCategory>; note: string;
}
// Entirely fictional educational examples. Expectations require editorial review;
// they describe reported changes, never root causes or real production decisions.
export const jevSamples: JevSample[] = [
  { id: "cleaning", title: "清掃と不良増加", report: "半導体の量産工程で、装置Aの清掃後から外観不良が増えた。", additional: "同じ時点で検査装置の判定しきい値も変更されていた。", expected: { before: "equipment", after: "multiple" }, note: "清掃だけに注目せず、検査条件の変更も区別する例です。" },
  { id: "batch", title: "材料ロットの切り替え", report: "材料ロットを切り替えた後から、ウェーハ上の欠陥数が増えた。", additional: "設備と検査条件は変えていない。同じ材料ロットを使う別装置でも増加した。", expected: { before: "material", after: "material" }, note: "情報が増えても分類が変わらない例です。材料が原因と確定したわけではありません。" },
  { id: "gauge", title: "測定器の交換", report: "測定器を交換した日から、膜厚の測定値が高くなった。", additional: "製造条件と材料は変えていない。旧測定器で同じ試料を測ると従来の値だった。", expected: { before: "measurement", after: "measurement" }, note: "観察された値と工程そのものの変化を分けて考えます。" },
  { id: "missing", title: "短い不良報告", report: "今朝から半導体製品の不良が増えた。詳細はまだ分からない。", additional: "昨夜、装置の搬送部品を交換した記録が見つかった。", expected: { before: "unknown", after: "equipment" }, note: "初報には変更情報がなく、追加調査で記載が得られる例です。" },
  { id: "simultaneous", title: "同時に変わった条件", report: "装置の保全と材料ロットの切り替えを同じ日に行い、その後から不良が増えた。", additional: "両方を変更する前のデータしかなく、片方だけを変えた比較データはない。", expected: { before: "multiple", after: "multiple" }, note: "一つの原因へ無理に振り分けないための例です。" },
  { id: "negation", title: "変更していないという記録", report: "材料も装置も変更していないが、検査不合格が増えた。", additional: "確認すると、検査装置の判定しきい値だけが前日に変更されていた。", expected: { before: "unknown", after: "measurement" }, note: "材料・装置という単語の存在と、実際の変更記載を区別します。" },
  { id: "suspected", title: "推測だけの初報", report: "担当者は材料が怪しいと言っているが、材料変更や設備変更の記録はまだ確認できていない。", additional: "調査したところ、直前に材料の供給元を変更したことが記録で確認された。", expected: { before: "unknown", after: "material" }, note: "推測と確認済みの変更記載を区別します。" },
  { id: "calibration", title: "校正後の値のずれ", report: "検査用測定器の校正後から、基準試料の測定値がずれている。", additional: "同じ日に装置の加熱部品も交換していた。", expected: { before: "measurement", after: "multiple" }, note: "別分野の変更情報が加わる例です。" },
  { id: "two-repairs", title: "二つの保全作業", report: "半導体製造装置のポンプ交換と清掃を実施した後、測定値のばらつきが増えた。", additional: "材料と測定方法は変更していない。", expected: { before: "equipment", after: "equipment" }, note: "作業が二つあっても、分類分野は一つという境界例です。" },
  { id: "stable", title: "追加しても分からない例", report: "製品の歩留まりが低下した。直前の変更については未確認。", additional: "不良は装置Aに集中していたが、保全・材料・測定の変更履歴はまだ確認していない。", expected: { before: "unknown", after: "unknown" }, note: "装置への集中は、設備変更があった証拠にはなりません。" },
];
