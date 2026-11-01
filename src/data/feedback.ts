export const feedbackSurveys = {
  cpk: { source: "/tools/cpk", context: "tool" },
  control_chart: { source: "/tools/control-chart", context: "tool" },
  market_cap: { source: "/guides/semiconductor-market-cap-ranking", context: "article" },
  factory_projects: { source: "/guides/japan-semiconductor-factory-projects", context: "article" },
} as const;

export type SurveyId = keyof typeof feedbackSurveys;
export const needs = [
  ["method", "方法の選び方"], ["interpretation", "結果の読み方"],
  ["data", "データの準備"], ["report", "報告資料の作成"],
  ["information", "知りたい情報が見つからない"], ["other", "その他"],
] as const;
export const features = {
  tool: [["batch", "Cpk・SPCの複数条件の一括解析"], ["csv", "CSV取り込み"], ["report", "報告書作成の省力化"], ["improve", "既存機能の改善"], ["other", "その他"], ["none", "特になし"]],
  article: [["updates", "情報の更新"], ["comparison", "比較しやすい表示"], ["research", "調査資料の整理"], ["improve", "既存機能の改善"], ["other", "その他"], ["none", "特になし"]],
} as const;
export const interests = [["free", "無料機能の改善"], ["early", "有料版が企画された場合の先行体験"], ["undecided", "まだわからない"]] as const;
