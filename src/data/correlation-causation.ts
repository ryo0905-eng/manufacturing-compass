export const correlationRoute = '/tools/correlation-causation';
export const correlationRelease: { status: 'review' | 'published'; updatedAt: string; sourcesCheckedAt: string } = {
  status: 'published', updatedAt: '2026-09-22', sourcesCheckedAt: '2026-09-22',
};
export function isCorrelationPublished() { return correlationRelease.status === 'published'; }
export const VERSION = 'correlation-causation-v1';
export const SEED = 20260922;
export const temperatures = [380, 420] as const;
export const products = ['A', 'B'] as const;
export type Product = typeof products[number];
export type Temperature = typeof temperatures[number];
export type Method = 'conventional' | 'randomized';
export type Dataset = 'observation' | Method;
export const methods: readonly Method[] = ['conventional', 'randomized'];
export const methodLabels: Record<Method, string> = {
  conventional: '従来の製品構成で比較', randomized: '製品ごとに温度を無作為に割付',
};
export const datasetLabels: Record<Dataset, string> = { observation: '最初の観察・100ロット', conventional: '従来構成の追加実験・40ロット', randomized: '無作為割付の追加実験・40ロット' };
// Each row is [low temperature count, high temperature count].
export const allocations: Record<Dataset, Record<Product, readonly [number, number]>> = {
  observation: { A: [45, 5], B: [5, 45] },
  conventional: { A: [18, 2], B: [2, 18] },
  randomized: { A: [10, 10], B: [10, 10] },
};
export const baseRates: Record<Product, Record<Temperature, number>> = { A: { 380: 8, 420: 6 }, B: { 380: 24, 420: 22 } };
export const noiseAmplitude = 0.8;
export const hypotheses = ['温度の影響', '製品など別の影響', 'まだ判断できない'] as const;
export const reflections = ['全体の平均だけでもう一度比較する', '製品内で無作為に割り付け、反復して比較する', '色分けの結果だけで原因を決める'] as const;
export const stages = ['気づく', '分ける', '確かめる', '比べ直す', '振り返る'] as const;
export const copy = {
  title: '相関関係と因果関係の違い｜散布図で体験する製造データ',
  description: '架空の半導体加工データで、相関と因果の違いを約5分で体験。製品別の色分けと無作為割付の比較から、次に必要な実験を学びます。',
  intro: '相関関係は、二つの変数の間に一定の関連が見られること。因果関係は、一方を変えることが他方を変化させる関係です。一緒に変わって見えるだけでは、原因とは決められません。',
  disclaimer: '教育用の架空データです。380℃・420℃は実設備の推奨条件ではなく、物理モデルでもありません。',
  privacy: '回答と教材データはこの画面内だけで扱い、保存・送信しません。利用状況は段階や比較方法などの分類だけを計測します。',
};
export const explanations = [
  { title: '具体例：高温ほど不良が多い。それは温度のせい？', paragraphs: [
    '架空の半導体加工工程で、低温と高温のロットを比較します。最初の全体集計では高温側の不良率が高く見えます。しかし、製品Aと製品Bはもともとの不良率が異なり、高温側には製品Bが多く含まれています。',
    '不良率はロットごとに扱い、表はその単純平均です。実際の不良個数と検査個数は生成していないため、工場全体の個数加重の不良率ではありません。低温と高温の差はパーセントポイントで表示します。',
  ] },
  { title: '交絡とシンプソンのパラドックス', paragraphs: [
    '温度条件と不良率の両方に製品の違いが関わると、温度だけの関係を読み取りにくくなります。このような別の要因による混ざり込みを交絡と呼びます。',
    '全体では高温側の不良率が高い一方、製品別ではどちらも低くなる。このような集計と各群の傾向の逆転を、シンプソンのパラドックスと呼びます。全体平均には、製品ごとの値に加えて、各製品が何割含まれるかも影響します。',
    '製品別に分けることは手掛かりです。実際の観察データには装置、材料、時期など別の違いもあり得るので、色分けだけで因果関係が確定するわけではありません。',
  ] },
  { title: '原因を確かめるために、比較方法を変える', paragraphs: [
    '同じ製品の中で低温と高温を比べます。製品ごとに同数のロットを用意し、どのロットをどちらの温度で加工するか無作為に決め、実施順もランダム化します。製品の違いを分けて比較する考え方は、ブロック化と呼ばれます。',
    '今回の二つの方法は、それぞれ別の新規40ロットで比較します。無作為割付は製品構成を揃えた上で行うため、構成を揃える効果と無作為化だけの効果を個別に測る実験ではありません。従来構成でも製品内の比較はできますが、少数の組合せができ、全体平均は構成比の影響を受けます。',
    'この教材では温度の効果を持つ架空ルールが答えとして決まっています。観測から得た平均差はノイズを含みます。実工程の因果を判断するには、測定の信頼性、実験条件、安全性、反復や再現性、工程の知識も必要です。差が小さいだけで因果がないとは言えず、ここでは有意差・同等性・量産適合性を判定しません。',
  ] },
];
export const sources = [
  { title: 'NIST：散布図と、相関だけでは因果を証明できない理由', url: 'https://itl.nist.gov/div898/handbook/eda/section3/eda33q.htm' },
  { title: 'NIST：無作為化ブロック計画', url: 'https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm' },
];
