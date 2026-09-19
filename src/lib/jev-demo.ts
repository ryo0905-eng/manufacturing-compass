import { jevCategories, jevModel, jevQuestionVersion, jevSamples, type JevCategory, type JevVariant } from "@/data/jev-demo";

export function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function parseJevRequest(value: unknown) {
  if (!object(value) || Object.keys(value).sort().join(",") !== "sampleId,variant") return null;
  const sample = jevSamples.find((item) => item.id === value.sampleId);
  if (!sample || (value.variant !== "before" && value.variant !== "after")) return null;
  return { sample, variant: value.variant as JevVariant };
}
export function buildJevRequest(sampleId: string, variant: JevVariant) {
  const selected = parseJevRequest({ sampleId, variant });
  if (!selected) throw new Error("Invalid sample");
  return {
    model: jevModel,
    state: selected.sample.report + (variant === "after" ? `\n追加報告：${selected.sample.additional}` : ""),
    questions: {
      change: {
        type: "choice" as const,
        instructions: "Classify only the changes explicitly reported in this fictional semiconductor incident report. Do not identify root causes. Distinguish observed changes from suspicions and negations. Treat measuring and inspection instruments as measurement, not production equipment. Multiple changes within one category remain that single category. Select multiple only when changes span at least two different categories. If no change is explicitly documented, select unknown.",
        criteria: Object.fromEntries(Object.entries(jevCategories).map(([key, value]) => [key, value.criteria])),
      },
    },
  };
}
const probability = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1;
export interface JevResult {
  sampleId: string; variant: JevVariant; choice: JevCategory;
  probabilities: Record<JevCategory, number>; confidence: number;
  model: string; questionVersion: string; inputTokens: number;
  elapsedMs: number; measuredAt: string;
}
export function parseJevResponse(value: unknown): Pick<JevResult, "choice" | "probabilities" | "confidence" | "model" | "inputTokens" | "questionVersion"> {
  if (!object(value) || !object(value.response) || value.response.modelId !== jevModel || !object(value.answers) || !object(value.usage)) throw new Error("Invalid response");
  const answer = value.answers.change;
  const metadata = value.providerMetadata;
  const confidence = object(metadata) && object(metadata.typesafe) && object(metadata.typesafe.confidence)
    ? metadata.typesafe.confidence.change : undefined;
  if (!object(answer) || answer.type !== "choice" || typeof answer.choice !== "string" || !Object.hasOwn(jevCategories, answer.choice) || !probability(confidence) || !object(answer.probabilities)) throw new Error("Invalid choice");
  const probabilities = answer.probabilities;
  const keys = Object.keys(jevCategories);
  if (Object.keys(probabilities).length !== keys.length || keys.some((key) => !probability(probabilities[key]))) throw new Error("Invalid probabilities");
  const values = keys.map((key) => probabilities[key] as number);
  if (Math.abs(values.reduce((a, b) => a + b, 0) - 1) > 0.01 || (probabilities[answer.choice] as number) + 0.000001 < Math.max(...values)) throw new Error("Invalid distribution");
  const tokens = value.usage.inputTokens;
  if (typeof tokens !== "number" || !Number.isSafeInteger(tokens) || tokens < 0) throw new Error("Invalid usage");
  return { choice: answer.choice as JevCategory, probabilities: Object.fromEntries(keys.map((key) => [key, probabilities[key]])) as Record<JevCategory, number>, confidence, model: value.response.modelId, inputTokens: tokens, questionVersion: jevQuestionVersion };
}

// Gateway may wrap a quota rejection in a 500-class SDK error.
// Inspect structured quota fields only; never return raw upstream messages.
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
