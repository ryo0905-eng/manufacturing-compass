import type { DoeAnalysis, DoeEffect, DoeExperiment } from "@/lib/doe/types";

function values(experiment: DoeExperiment, responseId: string) {
  return experiment.runs.map((run) => run.responses[responseId]).filter((value): value is number => value !== undefined && Number.isFinite(value));
}

export function calculateGrandMean(experiment: DoeExperiment, responseId: string) {
  const responseValues = values(experiment, responseId);
  if (responseValues.length === 0) throw new Error("有効な応答値がありません。");
  return responseValues.reduce((sum, value) => sum + value, 0) / responseValues.length;
}

export function calculateEffect(experiment: DoeExperiment, factorIds: string[], responseId: string): DoeEffect {
  const scored = experiment.runs.map((run) => ({
    sign: factorIds.reduce((product, factorId) => product * run.levels[factorId], 1),
    value: run.responses[responseId],
  })).filter((item): item is { sign: number; value: number } => item.value !== undefined && Number.isFinite(item.value));
  const high = scored.filter((item) => item.sign > 0);
  const low = scored.filter((item) => item.sign < 0);
  if (high.length === 0 || low.length === 0) throw new Error("効果を計算できる実験条件が不足しています。");
  const mean = (items: typeof scored) => items.reduce((sum, item) => sum + item.value, 0) / items.length;
  const estimate = mean(high) - mean(low);
  return { id: factorIds.join(":"), kind: factorIds.length === 1 ? "main" : "interaction", factorIds, estimate, absoluteEstimate: Math.abs(estimate) };
}

export function conditionMean(experiment: DoeExperiment, factorId: string, levelCode: number, responseId: string) {
  const matching = experiment.runs.filter((run) => run.levels[factorId] === levelCode).map((run) => run.responses[responseId]).filter((value): value is number => value !== undefined && Number.isFinite(value));
  if (matching.length === 0) throw new Error("条件平均を計算できません。");
  return matching.reduce((sum, value) => sum + value, 0) / matching.length;
}

export function cellMean(experiment: DoeExperiment, levels: Record<string, number>, responseId: string) {
  const matching = experiment.runs.filter((run) => Object.entries(levels).every(([factorId, code]) => run.levels[factorId] === code)).map((run) => run.responses[responseId]).filter((value): value is number => value !== undefined && Number.isFinite(value));
  if (matching.length === 0) throw new Error("条件に対応する応答値がありません。");
  return matching.reduce((sum, value) => sum + value, 0) / matching.length;
}

export function analyzeExperiment(experiment: DoeExperiment, responseId: string): DoeAnalysis {
  const factorIds = experiment.factors.map((factor) => factor.id);
  const responseValues = values(experiment, responseId);
  const effects = [
    ...factorIds.map((factorId) => calculateEffect(experiment, [factorId], responseId)),
    ...(factorIds.length >= 2 ? [calculateEffect(experiment, factorIds.slice(0, 2), responseId)] : []),
  ];
  return {
    grandMean: calculateGrandMean(experiment, responseId),
    effects,
    responseRange: Math.max(...responseValues) - Math.min(...responseValues),
    warnings: ["反復がないため実験誤差を分離できず、統計的有意性は判断できません。"],
  };
}
