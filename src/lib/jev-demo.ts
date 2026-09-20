import {
  jevCategories, jevRoutes, jevCompletenessLevels, jevModel, jevQuestionVersion, jevSamples,
  type JevCategory, type JevRoute,
} from "@/data/jev-demo";

export function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function parseJevRequest(value: unknown) {
  if (!object(value) || Object.keys(value).sort().join(",") !== "evidenceId,sampleId") return null;
  const sample = jevSamples.find((item) => item.id === value.sampleId);
  if (!sample) return null;
  if (value.evidenceId === null) return { sample, evidence: null };
  const evidence = sample.evidence.find((item) => item.id === value.evidenceId);
  return evidence ? { sample, evidence } : null;
}
export function buildJevRequest(sampleId: string, evidenceId: string | null) {
  const selected = parseJevRequest({ sampleId, evidenceId });
  if (!selected) throw new Error("Invalid sample");
  return {
    model: jevModel,
    state: selected.sample.report + (selected.evidence ? `\n追加報告：${selected.evidence.report}` : ""),
    questions: {
      change: {
        type: "choice" as const,
        instructions: "Classify explicitly documented changes only, not causes. Read the complete report. Denials, suspicions and unresolved conflicting records do not establish a change. Distinguish production equipment from measurement equipment. Changes within one category stay in that category.",
        criteria: Object.fromEntries(Object.entries(jevCategories).map(([key, value]) => [key, value.criteria])),
      },
      comparison: {
        type: "boolean" as const,
        instructions: "Does this report document at least one usable comparison result that separates conditions? A proposed comparison or an uncontrolled coincidence is not a result.",
        criteria: {
          true: "Actual comparison results are recorded with a shared reference: same specimen across instruments, same product/material across equipment, or comparable before/after observations.",
          false: "No comparison result, only speculation or a future plan; simultaneous confounded changes, or conflicting unverified records cannot support a usable comparison.",
        },
      },
      completeness: {
        type: "score" as const,
        instructions: "Rate only the documented evidence available to isolate conditions in this fictional report. Do not rate urgency, safety, root cause certainty or writing quality. Unverified conflicting records do not count as established facts.",
        criteria: jevCompletenessLevels.map((level) => level.criteria),
      },
      route: {
        type: "choice" as const,
        instructions: "Choose ONE next information source a human should inspect in this educational investigation. Use the entire state, including comparative and contradictory evidence, not merely change keywords. Select the most specific unresolved check; a known change need not be the next check. If observations are not comparable, checking measurement validity can precede material/equipment attribution. Do not assert root cause, decide lot disposition or operate equipment.",
        criteria: Object.fromEntries(Object.entries(jevRoutes).map(([key, value]) => [key, value.criteria])),
      },
    },
  };
}

export interface JevChoice<K extends string> {
  type: "choice"; choice: K; probabilities: Record<K, number>; confidence: number;
}
export interface JevDecisions {
  change: JevChoice<JevCategory>;
  comparison: { type: "boolean"; probability: number };
  completeness: { type: "score"; score: number; probabilities: Record<string, number>; confidence: number };
  route: JevChoice<JevRoute>;
}
export interface JevResult {
  sampleId: string; evidenceId: string | null; decisions: JevDecisions;
  model: string; questionVersion: string; inputTokens: number;
  elapsedMs: number; measuredAt: string;
}
const probability = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1;

function roundingError(value: unknown): number {
  if (value === undefined) return 0;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 15) throw new Error("Invalid rounding");
  return 0.5 * 10 ** -value;
}
function distribution(value: unknown, keys: readonly string[], rounding: number) {
  if (!object(value) || Object.keys(value).length !== keys.length || keys.some((key) => !probability(value[key]))) throw new Error("Invalid probabilities");
  const result = Object.fromEntries(keys.map((key) => [key, value[key] as number]));
  // Allow normal provider rounding, without renormalizing or inventing values.
  if (Math.abs(Object.values(result).reduce((a, b) => a + b, 0) - 1) > 0.000001 + keys.length * rounding) throw new Error("Invalid distribution");
  return result;
}
function choice<K extends string>(value: unknown, confidence: unknown, keys: readonly K[], rounding: number): JevChoice<K> {
  if (!object(value) || value.type !== "choice" || typeof value.choice !== "string" || !keys.includes(value.choice as K) || !probability(confidence)) throw new Error("Invalid choice");
  const probabilities = distribution(value.probabilities, keys, rounding) as Record<K, number>;
  if (probabilities[value.choice as K] + 0.000001 < Math.max(...Object.values<number>(probabilities))) throw new Error("Invalid distribution");
  return { type: "choice", choice: value.choice as K, probabilities, confidence };
}
export function parseJevResponse(value: unknown): Pick<JevResult, "decisions" | "model" | "inputTokens" | "questionVersion"> {
  if (!object(value) || !object(value.response) || value.response.modelId !== jevModel || !object(value.answers) || !object(value.usage)) throw new Error("Invalid response");
  const answers = value.answers;
  if (value.rounding !== undefined && !object(value.rounding)) throw new Error("Invalid rounding");
  const rounding = object(value.rounding) ? value.rounding : {};
  const probabilityError = roundingError(rounding.probabilityDecimals);
  const scoreError = roundingError(rounding.scoreDecimals);
  if (Object.keys(answers).sort().join(",") !== "change,comparison,completeness,route") throw new Error("Invalid answers");
  const metadata = value.providerMetadata;
  const confidence = object(metadata) && object(metadata.typesafe) && object(metadata.typesafe.confidence) ? metadata.typesafe.confidence : {};
  const change = choice(answers.change, confidence.change, Object.keys(jevCategories) as JevCategory[], probabilityError);
  const route = choice(answers.route, confidence.route, Object.keys(jevRoutes) as JevRoute[], probabilityError);
  const comparison = answers.comparison;
  if (!object(comparison) || comparison.type !== "boolean" || !probability(comparison.probability)) throw new Error("Invalid boolean");
  const score = answers.completeness;
  if (!object(score) || score.type !== "score" || typeof score.score !== "number" || !Number.isFinite(score.score) || score.score < 0 || score.score > 4 || !probability(confidence.completeness)) throw new Error("Invalid score");
  const probabilities = distribution(score.probabilities, ["0", "1", "2", "3", "4"], probabilityError);
  const weighted = Object.entries(probabilities).reduce((sum, [level, p]) => sum + Number(level) * p, 0);
  if (Math.abs(weighted - score.score) > 0.000001 + 10 * probabilityError + scoreError) throw new Error("Invalid score");
  const tokens = value.usage.inputTokens;
  if (typeof tokens !== "number" || !Number.isSafeInteger(tokens) || tokens < 0) throw new Error("Invalid usage");
  return {
    decisions: {
      change, route,
      comparison: { type: "boolean", probability: comparison.probability },
      completeness: { type: "score", score: score.score, probabilities, confidence: confidence.completeness },
    },
    model: value.response.modelId, inputTokens: tokens, questionVersion: jevQuestionVersion,
  };
}

// Only structured quota fields are inspected; never expose raw upstream messages.
export function jevFailureStatus(error: unknown): 402 | 429 | 502 {
  let current = error;
  for (let depth = 0; depth < 5 && object(current); depth++) {
    if (current.statusCode === 402 || current.type === "quota_for_entity_exceeded") return 402;
    let body: unknown = current.responseBody;
    if (typeof body === "string" && body.length <= 10000) {
      try { body = JSON.parse(body); } catch { body = null; }
    }
    if (object(body) && object(body.error) && body.error.type === "quota_for_entity_exceeded") return 402;
    if (current.statusCode === 429) return 429;
    current = current.cause;
  }
  return 502;
}
