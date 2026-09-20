export type GameLocationId =
  | "machine-a"
  | "machine-b"
  | "machine-c"
  | "quality"
  | "boss"
  | "meeting"
  | "break-room"
  | "analysis-pc";

export type GameLocation = {
  id: GameLocationId;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
  width: number;
  height: number;
  kind: "machine" | "person" | "room" | "pc";
};

export const GAME_LOCATIONS: GameLocation[] = [
  { id: "machine-a", label: "生産設備A", shortLabel: "設備A", x: 145, y: 126, width: 122, height: 58, kind: "machine" },
  { id: "machine-b", label: "生産設備B", shortLabel: "設備B", x: 332, y: 126, width: 122, height: 58, kind: "machine" },
  { id: "machine-c", label: "生産設備C", shortLabel: "設備C", x: 519, y: 126, width: 122, height: 58, kind: "machine" },
  { id: "quality", label: "品質担当エリア", shortLabel: "品質", x: 686, y: 118, width: 116, height: 76, kind: "person" },
  { id: "boss", label: "上司席", shortLabel: "上司席", x: 112, y: 334, width: 92, height: 64, kind: "person" },
  { id: "meeting", label: "会議室", shortLabel: "会議室", x: 284, y: 344, width: 126, height: 86, kind: "room" },
  { id: "break-room", label: "休憩室", shortLabel: "休憩室", x: 468, y: 344, width: 112, height: 86, kind: "room" },
  { id: "analysis-pc", label: "PC・データ解析席", shortLabel: "解析PC", x: 656, y: 344, width: 118, height: 72, kind: "pc" },
];


export const GAME_VERSION = "factory-action-v2" as const;
export const RULES = {
  duration: 180, repair: 3, hintedRepair: 1, hint: 1, rest: 2,
  restCooldown: 20, deadline: 30, comboWindow: 12, maxCombo: 5,
  walkSpeed: 220, dashSpeed: 400, dashDuration: .2, dashCooldown: 1.2,
  fatigueHp: .16, fatigueSan: .12, overdueYield: 3, repairYield: 1,
} as const;
export type RepairLocation = "machine-a" | "machine-b" | "machine-c" | "meeting";
export type Trouble = { id: string; at: number; location: RepairLocation; title: string; quip: string };
export const WAVES = [
  { at: 0, cap: 1 }, { at: 20, cap: 2 }, { at: 60, cap: 3 }, { at: 140, cap: 4 },
] as const;
const scenarios: Array<[RepairLocation, string, string]> = [
  ["machine-a", "歩留まり急落", "朝礼より先に、歩留まりが着席した。"],
  ["machine-b", "設備Bの異音", "昨日から？ その情報、今来ました。"],
  ["machine-c", "出荷保留", "赤い保留票だけ、発色がいい。"],
  ["meeting", "海外工場から着信", "quickly の定義は、まだ未確認。"],
  ["machine-a", "条件のずれ", "とりあえず戻す前に、変更点を確認。"],
  ["machine-b", "14時の報告待ち", "原因を一枚で。余白も一枚分。"],
  ["machine-c", "ロット切替異常", "全体平均は平和。層別すると事件。"],
  ["meeting", "共有Excelが停止", "保存は操作ではない。思想である。"],
  ["machine-a", "昼休み直前の警告", "昼休みは、未来の自分への投資。"],
  ["machine-c", "夕方の新しい不良", "月曜日は最後まで月曜日。"],
];
export const TROUBLES: Trouble[] = [
  0, 20, 24, 34, 40, 48, 55, 60, 64, 68, 76, 82, 88, 94, 100, 106,
  112, 118, 124, 130, 140, 142, 144, 146, 155, 159, 163, 170, 174,
].map((at, index) => {
  const [location, title, quip] = scenarios[index % scenarios.length];
  return { id: `monday-${index + 1}`, at, location, title, quip };
});
export const ACTION_TITLES = [
  { id: "legend", label: "定時退社の伝説", description: "引継ぎゼロ。通知も、あなたの背中を見送った。", minResolved: 20, minCombo: 4, maxPending: 0 },
  { id: "combo", label: "復旧の連鎖職人", description: "止まった設備を次々再起動。現場に流れを取り戻した。", minResolved: 10, minCombo: 5, maxPending: 99 },
  { id: "floor", label: "現場に愛された技術者", description: "走るだけじゃない。聞いて、調べて、段取りで勝った。", minResolved: 8, minCombo: 1, maxPending: 99, minHints: 3 },
  { id: "survivor", label: "月曜日を生き延びた人", description: "未解決は引継ぎへ。明日の自分に読めるメモを残そう。", minResolved: 0, minCombo: 0, maxPending: 99 },
];
export const LEARNING_ITEMS = [
  { id: "four-m", title: "4Mで変化点を確認する", description: "人・設備・材料・方法のどこが、正常時から変わったかを整理します。", href: "/tools/yield-dashboard" },
  { id: "spc", title: "SPCで異常発生時点を絞る", description: "平均値だけでなく時系列で見て、いつから工程が変わったかを探します。", href: "/tools/control-chart" },
  { id: "floor", title: "現場ヒアリングを記録と組み合わせる", description: "作業者の観察を手掛かりにし、時刻・ロット・変更履歴と照合します。", href: "/tools/yield-dashboard" },
  { id: "stratify", title: "装置別・ロット別に層別する", description: "全体平均に隠れた偏りを、意味のある単位へ分けて確認します。", href: "/tools/yield-analysis" },
  { id: "countermeasure", title: "対症療法と原因解析を分ける", description: "条件を戻して復旧することと、原因を検証して再発を防ぐことは別の仕事です。", href: "/tools/doe" },
] as const;
