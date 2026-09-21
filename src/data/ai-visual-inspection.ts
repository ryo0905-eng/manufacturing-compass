export const inspectionRelease = { version: "synthetic-board-v2-seed17", updatedAt: "2026-09-22" } as const;
export const inspectionSteps = [
  { title: "汚れを探す", hint: "暗さと面積を動かして、汚れだけを残してみましょう。" },
  { title: "模様と傷を比べる", hint: "模様をはじいていませんか？ 照明むら補正も試せます。" },
  { title: "教えた例を変える", hint: "同じ画像でも、事前学習した例の構成で結果が変わります。" },
  { title: "撮影条件を変える", hint: "明るさを変え、見逃し・過検出と検出領域を見比べましょう。" },
  { title: "採用方法を考える", hint: "設定を固定し、別の24枚で準備負担と判定結果を比べましょう。" },
] as const;
export const inspectionModels = {
  balanced: "良品模様と欠陥を広く含む",
  "dirt-biased": "汚れに偏り、傷の例がない",
  "normal-poor": "良品の模様が平坦な面だけ",
  "label-errors": "傷300枚を良品として教えた",
} as const;
export const inspectionKinds = { good: "良品", dirt: "汚れ", scratch: "傷" } as const;
export const inspectionTextures = { flat: "平坦", wave: "濃淡むら", lines: "規則模様" } as const;
