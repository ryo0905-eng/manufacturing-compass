export const measurementPlanner = {
  route: "/tools/measurement-planner",
  title: "平均の測定計画ツール｜測定数と推定精度・作業時間を比較",
  description: "想定標準偏差と平均の推定幅から、測定数の目安と作業時間を計算。95%・正規近似の前提で3つの測定計画を比較できます。",
  updatedAt: "2026-09-23",
  source: "https://www.itl.nist.gov/div898/handbook/prc/section2/prc222.htm",
} as const;
export const measurementSample = { sigma: "2", precision: "0.5", unit: "nm", seconds: "30" };
export const measurementNotes = [
  "想定した標準偏差を固定した概算です。",
  "独立した代表的な測定と、平均の正規近似を前提とします。標準偏差が既知の場合の式を使い、推定した標準偏差の不確かさは織り込んでいません。",
  "工程の時間変化、測定間の相関、測定の偏りは考慮していません。同じ試料を繰り返し測っても、独立した製品を測った個数とは限りません。",
  "平均の推定精度の計画であり、不良検出・合否判定・改善差の検出力・品質保証を示すものではありません。",
  "所要時間は測定そのものの合計です。準備・移動・待ち時間は含みません。",
] as const;
