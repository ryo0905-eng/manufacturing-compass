// Tool-local implementation; existing DOE calculations remain unchanged.
function logGamma(value: number): number {
  const c = [676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7];
  if (value < .5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * value)) - logGamma(1 - value);
  const z = value - 1, t = z + c.length - .5;
  const sum = c.reduce((s, coefficient, i) => s + coefficient / (z + i + 1), .9999999999998099);
  return .5 * Math.log(2 * Math.PI) + (z + .5) * Math.log(t) - t + Math.log(sum);
}
function betaFraction(a: number, b: number, x: number): number {
  const safe = (v: number) => Math.abs(v) < 1e-30 ? (v < 0 ? -1e-30 : 1e-30) : v;
  let c = 1, d = 1 / safe(1 - (a + b) * x / (a + 1)), result = d;
  for (let m = 1; m <= 500; m++) {
    const even = m * (b - m) * x / ((a + 2 * m - 1) * (a + 2 * m));
    d = 1 / safe(1 + even * d); c = safe(1 + even / c); result *= d * c;
    const odd = -(a + m) * (a + b + m) * x / ((a + 2 * m) * (a + 2 * m + 1));
    d = 1 / safe(1 + odd * d); c = safe(1 + odd / c);
    const factor = d * c; result *= factor;
    if (Number.isFinite(result) && Math.abs(factor - 1) < 1e-13) return result;
  }
  throw new Error('信頼区間の数値計算が収束しませんでした。');
}
function beta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const scale = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log1p(-x));
  return x < (a + 1) / (a + b + 2) ? scale * betaFraction(a, b, x) / a : 1 - scale * betaFraction(b, a, 1 - x) / b;
}
export function t975(df: number): number {
  if (!Number.isFinite(df) || df < 1) throw new Error('自由度が不正です。');
  const upperTail = (t: number) => .5 * beta(df / (df + t * t), df / 2, .5);
  let low = 0, high = 1;
  while (upperTail(high) > .025 && high < 128) high *= 2;
  if (upperTail(high) > .025) throw new Error('信頼区間の探索範囲を超えました。');
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    if (upperTail(mid) > .025) low = mid; else high = mid;
    if (high - low < 1e-11) return (low + high) / 2;
  }
  throw new Error('信頼区間の探索が収束しませんでした。');
}
export function summarize(values: readonly number[]) {
  if (values.length < 2 || !values.every(Number.isFinite)) throw new Error('各条件に有限の測定値が2個以上必要です。');
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (values.length - 1);
  if (!Number.isFinite(mean) || !Number.isFinite(variance)) throw new Error('測定値の計算範囲を超えました。');
  return { n: values.length, mean, variance };
}
export function analyze(before: readonly number[], after: readonly number[]) {
  const a = summarize(before), b = summarize(after);
  const av = a.variance / a.n, bv = b.variance / b.n, se2 = av + bv;
  if (!(se2 > 0) || !Number.isFinite(se2)) throw new Error('ばらつきがないため、信頼区間を計算できません。');
  const df = se2 ** 2 / (av ** 2 / (a.n - 1) + bv ** 2 / (b.n - 1));
  const difference = a.mean - b.mean, se = Math.sqrt(se2), margin = t975(df) * se;
  const lower = difference - margin, upper = difference + margin;
  if (![difference, lower, upper].every(Number.isFinite)) throw new Error('推定結果が有限値になりませんでした。');
  return { before: a, after: b, difference, se, df, lower, upper };
}
export type Analysis = ReturnType<typeof analyze>;
export function describe(result: Analysis, threshold: number) {
  if (result.lower > threshold) return '推定の幅全体が、ほしい改善幅を上回っています。採用判断には他の品質特性や安定性の確認も必要です。';
  if (result.upper < 0) return '推定の幅は負の側にあります。今回の観測では、目標へ近づく方向と逆の変化が示されています。';
  if (result.lower > 0 && result.upper < threshold) return '差ゼロから離れていますが、推定の幅はほしい改善幅に届いていません。差の存在と実務上の価値は別です。';
  if (result.lower <= 0 && result.upper >= 0) return '推定の幅に差ゼロを含みます。改善の大きさには不確かさが残ります。差がないと証明したわけではありません。';
  return '推定の幅が、ほしい改善幅の線にかかっています。今回の観測だけでは、その幅を超えるか明確ではありません。';
}
