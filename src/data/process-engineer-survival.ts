export const GAME_VERSION = "factory-investigation-v3" as const;
export const RULES = { duration: 90, faultAt: 12, cycle: 6, trial: 4, restart: 2, material: 3, cooling: 5, target: 20,
  walkSpeed: 220, dashSpeed: 400, dashDuration: .2, dashCooldown: 1.2 } as const;
export const MACHINE_IDS = ["machine-a", "machine-b", "machine-c"] as const;
export type MachineId = typeof MACHINE_IDS[number];
export const SHARED_MACHINES = ["machine-b", "machine-c"] as const;
export const EQUIPMENT_CONNECTIONS = { cooling: SHARED_MACHINES, commonMaterial: SHARED_MACHINES, independent: ["machine-a"] } as const;
export type GameLocationId = MachineId | "cooling" | "material" | "quality" | "analysis-pc";
export type CaseId = "case-a" | "case-b";
export type Hypothesis = "cooling" | "material";
export type Lot = "L1" | "L2" | "N";
export type GameLocation = { id: GameLocationId; label: string; shortLabel: string; x: number; y: number; width: number; height: number; kind: "machine" | "person" | "pc" | "utility" };
export const GAME_LOCATIONS: GameLocation[] = [
  { id: "material", label: "材料置場", shortLabel: "材料", x: 85, y: 235, width: 76, height: 64, kind: "utility" },
  { id: "machine-a", label: "設備A", shortLabel: "設備A", x: 302, y: 112, width: 110, height: 52, kind: "machine" },
  { id: "machine-b", label: "設備B", shortLabel: "設備B", x: 302, y: 238, width: 110, height: 52, kind: "machine" },
  { id: "machine-c", label: "設備C", shortLabel: "設備C", x: 302, y: 366, width: 110, height: 52, kind: "machine" },
  { id: "cooling", label: "B/C共通冷却", shortLabel: "共通冷却", x: 475, y: 303, width: 78, height: 50, kind: "utility" },
  { id: "quality", label: "現場担当・検査", shortLabel: "現場 / 検査", x: 599, y: 235, width: 86, height: 58, kind: "person" },
  { id: "analysis-pc", label: "記録・解析PC", shortLabel: "記録PC", x: 595, y: 388, width: 100, height: 54, kind: "pc" },
];
export const CASES = {
  "case-a": { label: "ケース1", cause: "cooling", answer: "B/C共通冷却の流量低下", explanation: "このケースでは共通冷却が原因です。正常材料でも不良が再現し、冷却系対策を行うと確認試験は正常になります。" },
  "case-b": { label: "ケース2", cause: "material", answer: "B/Cに供給した材料L2の異常", explanation: "このケースでは材料L2が原因です。冷却系は正常で、正常材料へ切り替えると生産条件での確認試験は正常になります。" },
} as const;
export const ACTIONS = {
  restart: { label: "個別再起動", seconds: RULES.restart, description: "警告は一度消えます。原因への対策ではありません。" },
  material: { label: "正常材料へ切替", seconds: RULES.material, description: "対象を停止し、供給中の材料を隔離して正常材料Nへ切り替えます。" },
  cooling: { label: "フィルター交換を依頼", seconds: RULES.cooling, description: "B/Cの停止が必要。保全担当へ依頼します。材料条件は変えません。" },
  diagnostic: { label: "正常材料で比較", seconds: RULES.trial, description: "変える：試験品の材料だけをNへ。固定：設備・冷却条件。生産用の材料は変更しません。" },
  verification: { label: "対策後を確認", seconds: RULES.trial, description: "変えない：現在の生産材料・設備・冷却条件。この条件で良品になるか確認します。" },
} as const;
export type WorkKind = keyof typeof ACTIONS;
export const OBSERVATIONS = {
  "machine-a": "設備Aの状態", "machine-b": "設備Bの状態", "machine-c": "設備Cの状態",
  cooling: "共通冷却の流量", material: "材料の使用記録", quality: "現場ヒアリング", "analysis-pc": "設備別・ロット別の検査記録",
} as const;
export const QUIPS = {
  start: "「原因、一言で言える？」— まずは『確認中』でいきましょう。",
  onset: "現場「B/Cの供給材料をL1からL2へ切り替えました」",
  restart: "再起動はした。解決はまだ、確認していない。",
  verified: "試験品は良好。この生産条件で再開できます。",
  delivered: "良品が置場に到着。対策が、製品になって返ってきた！",
} as const;
export const TITLES = [
  { id: "restored", label: "根拠で工場を立て直した人", description: "良品が流れる日常を、取り戻しました。", condition: "success" },
  { id: "verified", label: "次のシフトへ、良い引継ぎ", description: "復旧は確認できた。次は良品を積み上げよう。", condition: "verified" },
  { id: "investigator", label: "「確認中」に根拠がある人", description: "未解決でも、観察と試験の記録は次の一手になります。", condition: "fallback" },
] as const;
export const LEARNING_ITEMS = [
  { id: "stratify", title: "比較する＝層別", description: "設備別・材料別に分け、同じところと違うところを探します。", href: "/tools/yield-analysis" },
  { id: "countermeasure", title: "一つだけ変えて試す", description: "条件をそろえた確認で、仮説と観測結果を比べます。", href: "/tools/doe" },
  { id: "four-m", title: "変化点を探す＝4M", description: "材料・設備など、異常の前後に変わったことを整理します。", href: "/tools/yield-dashboard" },
  { id: "floor", title: "止める＝影響封じ込め", description: "拡大を止める判断と、原因を取り除く対策を区別します。", href: "/tools/yield-dashboard" },
  { id: "spc", title: "発生時点を絞る", description: "時間の記録と変化を照合します。実工程では管理図なども役立ちます。", href: "/tools/control-chart" },
] as const;
