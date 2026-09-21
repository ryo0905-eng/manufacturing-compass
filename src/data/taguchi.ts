import type { Stage } from '@/lib/taguchi/types';
export const taguchiRelease = { updatedAt: '2026-09-21', sourcesCheckedAt: '2026-09-21' };
export const text = {
  title: 'タグチメソッド体験', subtitle: 'ばらつきに強い条件を探す',
  intro: '普段は良い条件が、環境の変化にも強いとは限りません。原料の状態を変えて、膜厚むらを比べましょう。',
  disclaimer: '架空の教育用モデルです。実設備の推奨条件ではありません。',
  privacy: '登録不要・ブラウザ内で計算。測定値・条件・履歴は保存・送信せず、ページを離れると失われます。',
  quality: '膜厚むら（%）— 小さいほど均一',
  baseline: '基準条件', candidate: '選択候補', nominal: '通常環境', stress: '誤差条件', confirmation: '確認実験',
  start: '通常環境で9条件を実験する', lock: 'この条件を基準に、6回実験する', remaining: '残る8条件を48回まとめて実験する', confirm: '基準と候補を18回で確認する',
  retry: '同じシードでやり直す', recommend: 'SN比が最大の条件を選ぶ',
  noise: '原料特性：反応しやすさ', noiseLabels: ['低い', '基準', '高い'],
  noiseHint: '量産では揃えにくい状態を、実験では意図的に振ります。教材上の相対水準です。',
  sliderHint: '取得済みの測定を切り替えます。動かしても実験回数は増えません。',
  snHint: '膜厚むらの大きさと変動をまとめた指標。SN比は大きいほど良い。',
  graphHint: '小さい点は各測定、大きい点は状態別の平均。線は測定した3水準を結んだもので、中間状態の予測ではありません。',
  error: '解析を計算できませんでした。観測履歴は保持し、解析と推奨を停止しています。',
  noData: '未実験', same: '同じ条件を候補にしても確認できます。別の新しい測定として比較します。',
  completed: '確認実験が終了しました。今回試した誤差条件の範囲で振り返りましょう。',
  resultLimit: 'この試験条件での比較です。全環境への強さ、量産適合性、再現性が証明されたわけではありません。',
  sdLimit: '標準偏差は意図的に振った3状態を含む試験結果の散らばりです。量産工程の標準偏差ではありません。',
  similar: 'SN比の差は小さい結果', better: '候補のSN比が高い結果', worse: '候補のSN比が低い結果',
  history: '全観測と集計を見る', mechanism: 'しくみを見る', effects: '因子水準別の平均SN比',
} as const;
export const stages: Record<Stage, { title: string; hint: string }> = {
  ready: { title: '① 普段の条件で比べる', hint: '温度×圧力の9条件を、まず通常環境で1回ずつ試します。' },
  baseline: { title: '① 比較の基準を選ぶ', hint: '9条件から基準にする条件を選びます。確定すると、この基準は最後まで固定されます。' },
  stress: { title: '② 環境を変える', hint: '原料状態を動かすと、選んだ条件の品質はどう変わりますか？' },
  compare: { title: '③・④ 条件を比べ直して選ぶ', hint: '同じ3状態で測った9条件を比較。低さと変動の両方を見て候補を選びます。' },
  review: { title: '⑤ 新しい測定で確かめる', hint: '探索時の測定を再利用せず、基準と候補を同じ誤差条件で測り直しました。' },
};
export const related = [
  { id: 'doe', href: '/tools/doe', title: 'DOEで効果と交互作用を学ぶ' },
  { id: 'comparison', href: '/tools/process-comparison', title: '工程比較で2条件の分布を見る' },
  { id: 'cpk', href: '/tools/cpk', title: '安定した工程の能力を別途評価する' },
] as const;
