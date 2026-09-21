// Deliberately independent of simulator/random/session: observations are the only experiment input.
import { candidates, conditionKey, NOISE_SD, validateCondition, type Condition, type Observation, type Prediction } from "./types";

export const MODEL = { lengthScale: 0.3, signalSd: 1.5, noiseSd: NOISE_SD, exploration: 2, jitter: 1e-10 } as const;

export function kernel(a: Condition, b: Condition): number {
  const r = Math.hypot((a.temperature - b.temperature) / 200, (a.pressure - b.pressure) / 80) / MODEL.lengthScale;
  const z = Math.sqrt(5) * r;
  return MODEL.signalSd ** 2 * (1 + z + z * z / 3) * Math.exp(-z);
}

function cholesky(matrix: number[][]): number[][] {
  const n = matrix.length;
  const l = Array.from({ length: n }, () => Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let value = matrix[i][j];
      for (let k = 0; k < j; k++) value -= l[i][k] * l[j][k];
      if (i === j) {
        if (!(value > 0) || !Number.isFinite(value)) throw new Error("予測モデルの計算を完了できませんでした。");
        l[i][j] = Math.sqrt(value);
      } else l[i][j] = value / l[j][j];
    }
  }
  return l;
}

function forward(l: number[][], b: number[]): number[] {
  const out = Array<number>(b.length).fill(0);
  for (let i = 0; i < b.length; i++) {
    let value = b[i];
    for (let j = 0; j < i; j++) value -= l[i][j] * out[j];
    out[i] = value / l[i][i];
  }
  return out;
}

export function fitModel(observations: readonly Observation[], priorMean: number) {
  if (observations.length < 1 || observations.length > 12 || !Number.isFinite(priorMean)) throw new Error("モデル入力が不正です。");
  for (const observation of observations) {
    validateCondition(observation);
    if (!Number.isFinite(observation.value)) throw new Error("測定値が不正です。");
  }
  const l = cholesky(observations.map((a, i) => observations.map((b, j) =>
    kernel(a, b) + (i === j ? MODEL.noiseSd ** 2 + MODEL.jitter : 0))));
  const residuals = forward(l, observations.map(o => o.value - priorMean));
  const alpha = Array<number>(observations.length).fill(0);
  for (let i = alpha.length - 1; i >= 0; i--) {
    let value = residuals[i];
    for (let j = i + 1; j < alpha.length; j++) value -= l[j][i] * alpha[j];
    alpha[i] = value / l[i][i];
  }
  return (point: Condition): Prediction => {
    validateCondition(point);
    const k = observations.map(o => kernel(o, point));
    const v = forward(l, k);
    const mean = priorMean + k.reduce((sum, value, i) => sum + value * alpha[i], 0);
    const variance = MODEL.signalSd ** 2 - v.reduce((sum, value) => sum + value * value, 0);
    if (!Number.isFinite(mean) || !Number.isFinite(variance) || variance < -1e-8) throw new Error("予測が数値範囲を超えました。");
    const sd = Math.sqrt(Math.max(0, variance));
    return { ...point, mean, sd, lcb: mean - MODEL.exploration * sd };
  };
}

export function analyze(observations: readonly Observation[], priorMean: number) {
  const predict = fitModel(observations, priorMean);
  const surface = candidates.map(predict);
  const visited = new Set(observations.map(conditionKey));
  const unvisited = surface.filter(point => !visited.has(conditionKey(point)));
  if (!unvisited.length) throw new Error("次の候補がありません。");
  const recommendation = unvisited.reduce((a, b) => b.lcb < a.lcb ? b : a);
  const confirmation = surface.filter(point => visited.has(conditionKey(point))).reduce((a, b) => b.mean < a.mean ? b : a);
  return { surface, recommendation, confirmation };
}

export type Analysis = ReturnType<typeof analyze>;
