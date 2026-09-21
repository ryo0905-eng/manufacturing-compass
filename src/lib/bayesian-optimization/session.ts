import { analyze, type Analysis } from "./model";
import { doePlan, initialNoiseState, measure } from "./simulator";
import { DEFAULT_SEED, stageFor, type Condition, type Observation, type SelectionMethod } from "./types";

export type Session = {
  seed: number; noiseState: number; observations: Observation[];
  priorMean: number | null; analysis: Analysis | null; error: boolean; confirmationPrediction: number | null;
};
export function createSession(seed = DEFAULT_SEED): Session {
  return { seed, noiseState: initialNoiseState(seed), observations: [], priorMean: null, analysis: null, error: false, confirmationPrediction: null };
}

// One atomic command commits all DOE observations; callers cannot exceed the experiment budget.
export function runExperiment(session: Session, point: Condition, method: SelectionMethod, calculate = analyze): Session {
  const stage = stageFor(session.observations.length);
  if (stage === "review" || session.error) return session;
  if ((stage === "doe" && method !== "doe") || (stage === "confirm" && method !== "confirmation")
    || ((stage === "first" || stage === "manual") && method !== "manual")
    || (stage === "explore" && method !== "manual" && method !== "bo")) throw new Error("現在の段階では選べない操作です。");
  let points = [point];
  if (stage === "doe") points = doePlan(session.seed);
  if (method === "bo" || method === "confirmation") {
    if (!session.analysis) throw new Error("予測がありません。");
    points = [method === "bo" ? session.analysis.recommendation : session.analysis.confirmation];
  }
  let noiseState = session.noiseState;
  const observations = [...session.observations];
  for (const condition of points) {
    const measured = measure(condition, noiseState);
    noiseState = measured.noiseState;
    observations.push({ temperature: condition.temperature, pressure: condition.pressure, value: measured.value, run: observations.length + 1, method });
  }
  const priorMean = session.priorMean ?? (observations.length >= 6 ? observations.slice(0, 6).reduce((sum, o) => sum + o.value, 0) / 6 : null);
  const next: Session = { ...session, observations, noiseState, priorMean, analysis: null, error: false,
    confirmationPrediction: stage === "confirm" ? session.analysis!.confirmation.mean : session.confirmationPrediction };
  if (priorMean !== null) {
    try { next.analysis = calculate(observations, priorMean); }
    catch { next.error = true; }
  }
  return next;
}
