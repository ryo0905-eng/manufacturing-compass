import { calculateEffect, calculateGrandMean, cellMean } from "@/lib/doe/effects";
import type { DoeExperiment } from "@/lib/doe/types";

export type AnovaTermId = "temperature" | "pressure" | "temperature:pressure" | "error";
export type AnovaRow = { id: AnovaTermId; label: string; ss: number; df: number; ms: number; f: number | null; p: number | null };
export type AnovaResult = { rows: AnovaRow[]; total: { ss: number; df: number }; errorMs: number };

function logGamma(value: number): number {
  const coefficients = [676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7];
  if (value < .5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * value)) - logGamma(1 - value);
  const shifted = value - 1;
  const sum = coefficients.reduce((current, coefficient, index) => current + coefficient / (shifted + index + 1), .9999999999998099);
  const t = shifted + coefficients.length - .5;
  return .5 * Math.log(2 * Math.PI) + (shifted + .5) * Math.log(t) - t + Math.log(sum);
}

function betaFraction(a: number, b: number, x: number) {
  const tiny = 1e-30;
  let c = 1;
  let d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < tiny) d = tiny;
  d = 1 / d;
  let result = d;
  for (let step = 1; step <= 100; step += 1) {
    const even = (step * (b - step) * x) / ((a + 2 * step - 1) * (a + 2 * step));
    d = 1 + even * d; if (Math.abs(d) < tiny) d = tiny;
    c = 1 + even / c; if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d; result *= d * c;
    const odd = -((a + step) * (a + b + step) * x) / ((a + 2 * step) * (a + 2 * step + 1));
    d = 1 + odd * d; if (Math.abs(d) < tiny) d = tiny;
    c = 1 + odd / c; if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const change = d * c; result *= change;
    if (Math.abs(change - 1) < 3e-7) break;
  }
  return result;
}

function regularizedBeta(x: number, a: number, b: number) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const scale = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? scale * betaFraction(a, b, x) / a : 1 - scale * betaFraction(b, a, 1 - x) / b;
}

function fSurvival(f: number, numeratorDf: number, denominatorDf: number) {
  if (!Number.isFinite(f)) return 0;
  if (f <= 0) return 1;
  const x = (numeratorDf * f) / (numeratorDf * f + denominatorDf);
  return Math.max(0, Math.min(1, 1 - regularizedBeta(x, numeratorDf / 2, denominatorDf / 2)));
}

export function calculateAnova(experiment: DoeExperiment, responseId: string): AnovaResult {
  const observations = experiment.runs.map((run) => run.responses[responseId]).filter((value): value is number => value !== undefined && Number.isFinite(value));
  const grandMean = calculateGrandMean(experiment, responseId);
  const totalSs = observations.reduce((sum, value) => sum + (value - grandMean) ** 2, 0);
  const terms = [
    { id: "temperature" as const, label: "温度 A", factors: ["temperature"] },
    { id: "pressure" as const, label: "圧力 B", factors: ["pressure"] },
    { id: "temperature:pressure" as const, label: "交互作用 A×B", factors: ["temperature", "pressure"] },
  ].map((term) => ({ ...term, ss: observations.length * calculateEffect(experiment, term.factors, responseId).estimate ** 2 / 4 }));
  const errorSs = experiment.runs.reduce((sum, run) => {
    const value = run.responses[responseId];
    return value === undefined ? sum : sum + (value - cellMean(experiment, run.levels, responseId)) ** 2;
  }, 0);
  const errorDf = Math.max(observations.length - 4, 1);
  const errorMs = errorSs / errorDf;
  const rows: AnovaRow[] = terms.map((term) => {
    const f = errorMs === 0 ? Number.POSITIVE_INFINITY : term.ss / errorMs;
    return { id: term.id, label: term.label, ss: term.ss, df: 1, ms: term.ss, f, p: fSurvival(f, 1, errorDf) };
  });
  rows.push({ id: "error", label: "誤差", ss: errorSs, df: errorDf, ms: errorMs, f: null, p: null });
  return { rows, total: { ss: totalSs, df: observations.length - 1 }, errorMs };
}
