import type { SelectionMethod, Stage } from "@/lib/bayesian-optimization/types";

export const bayesianRelease = { updatedAt: "2026-09-21", sourcesCheckedAt: "2026-09-21" };
export const bayesianText = {
  title: "ベイズ最適化を体験する",
  introduction: "温度と圧力を選んで、膜厚むらを小さく。12回の実験で、次の条件を探します。",
  disclaimer: "架空の教育用モデルです。実設備の推奨条件ではありません。",
  privacy: "登録不要・ブラウザ内で計算。実験条件・測定値は保存・送信せず、ページを離れると失われます。",
  quality: "膜厚むら（%）— 小さいほど均一",
  experiment: "実験する",
  doeButton: "5回まとめて実験する",
  confirmButton: "この条件をもう1回測る",
  retry: "同じシードでやり直す",
  mechanism: "しくみを見る",
  history: "実験履歴",
  prediction: "品質予測",
  uncertainty: "不確かさ",
  truth: "真の分布",
  selectRecommendation: "推奨点を選ぶ",
  selectHint: "マップをタップ、または温度・圧力を入力して選びます。",
  uncertaintyHint: "平均的な膜厚むらを、モデルがまだ絞り込めていない程度です。",
  recommendationHint: "良さそうな場所と、まだ不確かな場所を合わせて選びます。",
  firstResult: "1点だけでは、周りの様子はまだわかりません。",
  doeResult: "6点の観測から予測しました。次は自分で1条件を選んでみましょう。",
  better: "予測より膜厚むらが小さく、周辺の予測も変わりました。",
  worse: "予測より膜厚むらが大きく、周辺の予測も変わりました。",
  close: "予測に近い結果。観測を加えて地図を更新しました。",
  completed: "12回の実験が終了。ノイズを除いて振り返りましょう。",
  error: "予測を計算できませんでした。観測履歴は残しています。予測と推奨を停止しました。",
  observed: "観測値",
  observedBest: "これまでの観測最小値",
  trueBest: "実験した条件の真値の最小値",
  truthReview: "ノイズを除いて振り返る",
  observedReview: "観測値で振り返る",
  repeatNote: "同じ条件でも測定値は変わります。1回の確認だけで再現性を証明したことにはなりません。",
  errors: "値は範囲内の刻みで入力してください。温度は5℃、圧力は2Pa刻みです。",
} as const;

export const stageText: Record<Stage, { title: string; hint: string }> = {
  first: { title: "まず試す", hint: "好きな条件で、最初の1回を試してみましょう。" },
  doe: { title: "広く調べる", hint: "今回はDOEで初期データを集めます。離れた条件も調べて、全体をつかみます。" },
  manual: { title: "予測を使う", hint: "色が濃い場所ほど、膜厚むらが小さい予測です。次はどこを試しますか？" },
  explore: { title: "次を選び直す", hint: "推奨点を使っても、自分で選んでも構いません。" },
  confirm: { title: "確かめる", hint: "実験済みの中で、モデルが良いと考える条件をもう1回測ります。" },
  review: { title: "振り返る", hint: "真の分布を公開しました。予測と見比べてみましょう。" },
};

export const methodText: Record<SelectionMethod, string> = { manual: "自分で選択", doe: "DOE", bo: "BO推奨", confirmation: "確認実験" };
export const bayesianLinks = [
  { id: "taguchi", href: "/tools/taguchi", title: "タグチメソッドで、誤差に強い条件を探す", detail: "原料状態を変えて品質を比較する、別の架空モデルです。" },
  { id: "doe", href: "/tools/doe", title: "DOEで、効果と交互作用を学ぶ", detail: "初期実験だけでなく、追加調査・確認にも使えます。" },
  { id: "comparison", href: "/tools/process-comparison", title: "工程比較で、2条件の分布を比べる", detail: "次は十分な測定数を集めて、ばらつきも確認します。" },
  { id: "cpk", href: "/tools/cpk", title: "安定した工程の能力を、別途評価する", detail: "今回の12点からCpkは算出しません。" },
] as const;
