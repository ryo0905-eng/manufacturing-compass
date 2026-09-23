import type { ToolId } from "@/data/learning-tools";

export const finderGoals = [
  { id: "defects", label: "どの不良が多いか整理したい" },
  { id: "capability", label: "規格とばらつきの関係を確認したい" },
  { id: "comparison", label: "変更前後の測定値を比べたい" },
  { id: "planning", label: "平均を知るための測定数を考えたい" },
  { id: "measurement", label: "測定のばらつきを調べたい" },
  { id: "stability", label: "工程の時間変化を調べたい" },
] as const;
export type FinderGoal = typeof finderGoals[number]["id"];
export type FinderMode = "input" | "learn";
export type FinderData = "measurements" | "summary" | "unknown";
export type FinderAnswers = { goal?: FinderGoal; mode?: FinderMode; data?: FinderData };
export const finderModes = [
  { id: "input", label: "自分のデータ・数値で使う" },
  { id: "learn", label: "まず架空例で学ぶ" },
] as const;
export const finderDataOptions = {
  capability: [
    { id: "measurements", label: "測定値と規格値がある" },
    { id: "summary", label: "平均・短期標準偏差と規格値がある" },
    { id: "unknown", label: "まだそろっていない・分からない" },
  ],
  comparison: [
    { id: "measurements", label: "2条件それぞれの測定値がある" },
    { id: "summary", label: "平均などの要約値だけがある" },
    { id: "unknown", label: "まだそろっていない・分からない" },
  ],
  planning: [
    { id: "summary", label: "想定標準偏差と、平均の推定幅を決められる" },
    { id: "measurements", label: "過去の測定値だけがある" },
    { id: "unknown", label: "まだそろっていない・分からない" },
  ],
} as const;
export const finderUpdatedAt = "2026-09-23";
export const finderSource = { title: "NIST：工程能力と前提条件", url: "https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm" };
export type FinderAdvice = { toolId: ToolId; reason: string; preparation: string; limit: string; learn: string; secondary?: ToolId };
export const finderAdvice: Record<FinderGoal, FinderAdvice> = {
  defects: {
    toolId: "defect-pareto", reason: "分類別の件数から、パレート図と構成比・累積比率を作れます。",
    preparation: "同じ集計期間・対象の分類名と件数を2列で用意してください。",
    limit: "入力件数の内訳を整理します。不良率・歩留まりや、重大性を含む対策順位を自動判定しません。",
    learn: "移動先の「架空例を試す」で、件数と累積比率の図を確認できます。",
  },
  capability: {
    toolId: "cpk", reason: "規格と測定値のばらつきの関係を整理できます。",
    preparation: "規格値と測定値、または平均と短期標準偏差を用意します。要約値の入力には、全体の標準偏差をそのまま使わないでください。",
    limit: "測定値からはPp・Ppk、平均・短期標準偏差からはCp・Cpkを計算します。工程の安定性や分布の前提を自動判定しません。",
    learn: "移動先で「動かして理解」を選ぶと、平均やばらつきを変えて学べます。", secondary: "control-chart",
  },
  comparison: {
    toolId: "process-comparison", reason: "2条件の平均・ばらつき・分布を並べて確認できます。",
    preparation: "2条件それぞれの測定値を、同じ測定項目・単位で用意してください。要約値だけではこのツールの入力に使えません。",
    limit: "分布の比較を整理するツールです。有意性・因果関係・同等性を自動判定しません。",
    learn: "架空の測定データで、平均差と推定の幅の読み方を学べます。", secondary: "improvement-report",
  },
  planning: {
    toolId: "measurement-planner", reason: "単一の平均をどの程度の幅で推定したいかから、測定数と時間の目安を比較できます。",
    preparation: "想定標準偏差、平均の推定幅、1回の測定時間を準備します。過去データしかない場合は、標準偏差と測定条件を先に整理してください。",
    limit: "95%・正規近似、想定標準偏差を固定した概算です。不良検出や改善差の検出力の計画には使えません。",
    learn: "移動先の架空例で、推定幅と測定数・時間の関係を試せます。",
  },
  measurement: {
    toolId: "gage-rr", reason: "部品差と測定誤差を分ける見方を、疑似測定データで学べます。",
    preparation: "まず教材で、部品・測定者・繰り返し測定の関係を確認します。",
    limit: "このサイトのGage R&Rは教材用です。手元の測定データの取り込み・解析には対応していません。",
    learn: "教材の条件を動かして、測定誤差の見え方を確認できます。",
  },
  stability: {
    toolId: "control-chart", reason: "時間順の測定値と管理限界を読み、次に調べることを教材で学べます。",
    preparation: "まず教材で見方を学び、手元の調査では測定順序・測定条件・工程の変更記録を整理してください。",
    limit: "このサイトの管理図は生成データを使う教材です。手元の時系列データの取り込み・解析には対応していません。",
    learn: "教材で工程の変化を加え、管理図のシグナルを確認できます。",
  },
};
