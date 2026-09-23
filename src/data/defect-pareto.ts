export const defectPareto = {
  route: "/tools/defect-pareto",
  title: "パレート図作成ツール｜不良の分類・件数から優先順位を整理",
  description: "不良の分類と件数を貼り付け、パレート図・構成比・累積比率を作成。集計表のコピーとSVG図の保存に対応。無料・登録不要、端末内で計算します。",
  updatedAt: "2026-09-23",
  source: "https://asq.org/quality-resources/pareto",
} as const;
export const paretoSample = "分類\t件数\n外観異常\t40\n寸法外れ\t25\n接続不良\t20\n汚れ\t10\nその他\t5";
export const paretoNotes = [
  "構成比の分母は入力した件数の合計です。検査数に対する不良率や歩留まりではありません。",
  "集計期間・対象・分類の定義をそろえてください。1製品に複数の不良を数える場合、合計は不良品数ではなく不良の延べ件数です。",
  "件数の多さだけでは対策の優先順位を決められません。重大性・影響・発生機会の違いも確認してください。",
  "図は原因や改善効果を証明しません。80%を一律の合否基準にせず、現場の記録と照合して調査対象を選びます。",
] as const;
