import { comparisonFields, features, goals, products, type ComparisonField, type Environment, type Feature, type Goal, type Product, type Skill, type Volume } from "@/data/tool-navigator";

export type NavigatorState = { goal: Goal; skill: Skill; volume: Volume; environment: Environment; required: Feature[]; preferred: Feature[]; selected: string[]; fields: ComparisonField[]; differences: boolean; confirmedOnly: boolean };
export const initialState: NavigatorState = { goal: "yield", skill: "any", volume: "any", environment: "any", required: [], preferred: [], selected: [], fields: comparisonFields.map(([id]) => id), differences: false, confirmedOnly: false };
const allowed = <T extends string>(value: string | null, values: readonly T[], fallback: T): T => values.find(v => v === value) ?? fallback;
const list = <T extends string>(value: string | null, values: readonly T[]): T[] => [...new Set((value ?? "").split(",").filter((v): v is T => values.includes(v as T)))];
export function parseNavigatorState(params: URLSearchParams): NavigatorState {
  const featureIds = features.map(f => f.id);
  const required = list(params.get("required"), featureIds);
  return { goal: allowed(params.get("goal"), goals.map(g => g.id), "yield"), skill: allowed(params.get("skill"), ["any", "nocode", "code"] as const, "any"), volume: allowed(params.get("volume"), ["any", "files", "large"] as const, "any"), environment: allowed(params.get("env"), ["any", "local", "cloud"] as const, "any"), required, preferred: list(params.get("preferred"), featureIds).filter(id => !required.includes(id)), selected: list(params.get("selected"), products.map(p => p.id)).slice(0, 4), fields: params.has("fields") ? list(params.get("fields"), comparisonFields.map(([id]) => id)) : initialState.fields, differences: params.get("diff") === "1", confirmedOnly: params.get("confirmed") === "1" };
}
export function serializeNavigatorState(state: NavigatorState): string {
  const p = new URLSearchParams({ goal: state.goal, skill: state.skill, volume: state.volume, env: state.environment, required: state.required.join(","), preferred: state.preferred.join(","), selected: state.selected.join(","), fields: state.fields.join(","), diff: state.differences ? "1" : "0", confirmed: state.confirmedOnly ? "1" : "0" });
  return p.toString();
}
export function evaluateProduct(product: Product, state: NavigatorState) {
  const reasons = [`「${goals.find(g => g.id === state.goal)?.short}」に関係する役割`];
  const checks: string[] = [];
  for (const id of state.required) (product.features[id] === "yes" ? reasons : checks).push(`${features.find(f => f.id === id)?.label}${product.features[id] === "yes" ? "に対応" : "の対応は未確認"}`);
  for (const id of state.preferred) (product.features[id] === "yes" ? reasons : checks).push(`希望する${features.find(f => f.id === id)?.label}${product.features[id] === "yes" ? "に対応" : "は未確認"}`);
  if (state.environment !== "any") (product.environments.includes(state.environment) ? reasons : checks).push(product.environments.includes(state.environment) ? "選択した導入環境で利用できる" : "選択した導入環境の詳細は要確認");
  if (state.skill !== "any") (product.skills.includes(state.skill) ? reasons : checks).push(product.skills.includes(state.skill) ? "選択したスキルに合う利用方法がある" : "選択したスキルでの利用方法は要確認");
  if (state.volume !== "any") (product.volumes.includes(state.volume) ? reasons : checks).push(product.volumes.includes(state.volume) ? "選択したデータ規模に関係する利用方法がある" : "選択したデータ規模での運用は要確認");
  return { product, reasons, checks };
}
export function findCandidates(state: NavigatorState) {
  return products.filter(p => p.goals.includes(state.goal) && (!state.confirmedOnly || state.required.every(id => p.features[id] === "yes"))).map(p => evaluateProduct(p, state));
}
