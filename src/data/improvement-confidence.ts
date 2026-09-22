export const improvementRoute = '/tools/improvement-confidence';
export const improvementRelease = { status: 'published', updatedAt: '2026-09-22', sourcesCheckedAt: '2026-09-22' } as const;
export const VERSION = 'improvement-confidence-v1';
export const sampleSizes = [5, 20, 100] as const;
export const changes = [0, 1, 4] as const;
export const deviations = [1, 3, 6] as const;
export const thresholds = [1, 2, 3] as const;
export type Settings = { change: typeof changes[number]; sd: typeof deviations[number]; n: typeof sampleSizes[number]; threshold: typeof thresholds[number] };
export const defaultSettings: Settings = { change: 1, sd: 3, n: 20, threshold: 2 };
export const cases = [
  { id: 'case_1', change: 0, title: '実際には変わっていない', lesson: '真の平均差は0nmです。それでも取り出したサンプルの平均は揺れます。区間がゼロを含んでも、差がないと証明できたわけではありません。' },
  { id: 'case_2', change: 1, title: '小さな変化がある', lesson: '真の平均差は1nmです。差ゼロから離れて見えても、今回ほしい改善幅2nmとは別の話です。差の存在と、実務上の価値を分けて考えます。' },
  { id: 'case_3', change: 4, title: '大きな変化がある', lesson: '真の平均差は4nmです。今回の観測がどこまで改善幅を支持するかは、推定の幅と2nmの線で確認します。量産への採用には安定性や他の品質特性も必要です。' },
] as const;
export const actions = [
  { id: 'candidate', label: '採用候補として次の確認へ', feedback: '区間全体がほしい改善幅を超えるかを確かめ、工程の安定性・他の品質特性・費用・安全性を確認しましょう。この比較だけでは量産条件を採用できません。' },
  { id: 'measure', label: '追加測定を計画する', feedback: '欲しい精度と測定の費用を考え、次の実験の測定数と評価時点を先に決めましょう。良い結果が出るまで測り続けると、通常の95%という説明をそのまま使えません。' },
  { id: 'method', label: '比較方法を見直す', feedback: '実工程では、装置・材料・測定方法・実施時期が揃っているかを確認しましょう。交絡や測定の偏りは、測定数を増やすだけでは解消できません。' },
] as const;
export type ActionId = typeof actions[number]['id'];
export const copy = {
  title: 'サンプル数と信頼区間を体験｜改善の差を見極める',
  heading: 'その改善、本当に効いた？',
  description: '架空の膜厚データで、測定数・平均差・95%信頼区間の関係を体験。約5分の3ケースから、差の不確かさと実務上ほしい改善幅を分けて考えます。',
  model: '教育用の架空データです。目標膜厚は100nm、変更前の真の平均は108nm。目標へ近づく変化を調べます。薄くするほど良いという意味ではありません。条件間・観測間で独立した正規分布を仮定し、測定と工程のばらつきをまとめています。実工程の物理モデルではありません。',
  privacy: '回答・設定・測定値はこの画面内だけで扱い、保存・送信しません。利用状況は段階などの固定分類だけを計測します。',
  interval: 'この推定の幅は、Welch方式の両側95%信頼区間です。同じ手順で独立した実験を繰り返すと、作られる区間のおよそ95%が真の平均差を含む、という方法の性質を表します。今回の区間に95%の確率で真値がある、という意味ではありません。',
  repeated: '5→20→100個は同じ実験に測定を追加する学習用の比較です。結果を見ながら良いところで止めたり、都合のよい実験だけを選んだりすると、通常の95%という説明をそのまま判断に使えません。実務では測定数と評価時点を先に計画します。',
};
export const sources = [
  { title: 'NIST：2群の平均差・標準誤差・Welch–Satterthwaite自由度', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm' },
  { title: 'NIST：信頼区間の解釈とサンプル数・ばらつき', url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm' },
];
export const related = [
  { id: 'comparison', href: '/tools/process-comparison', label: '工程条件の比較：実測値を整理する' },
  { id: 'correlation', href: '/tools/correlation-causation', label: '相関と因果：比較方法を見直す' },
  { id: 'doe', href: '/tools/doe', label: 'DOE：次の実験を計画する' },
] as const;
