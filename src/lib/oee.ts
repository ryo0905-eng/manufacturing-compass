import { getToolText, type ToolLocale } from "@/data/practical-tool-text";
export type OeeInputs = {
  loadingMinutes: number;
  downtimeMinutes: number;
  idealCycleSeconds: number;
  totalCount: number;
  defectCount: number;
};

export type OeeScenario = {
  downtimeMinutes: number;
  performanceRate: number;
  qualityRate: number;
};

export function validateOeeInputs(input: OeeInputs, locale: ToolLocale = "ja") {
  const t = getToolText(locale);
  const errors: string[] = [];
  if (!Number.isFinite(input.loadingMinutes) || input.loadingMinutes <= 0) errors.push(t("負荷時間は0より大きい数値で入力してください。"));
  if (!Number.isFinite(input.downtimeMinutes) || input.downtimeMinutes < 0) errors.push(t("停止時間は0以上で入力してください。"));
  else if (input.downtimeMinutes >= input.loadingMinutes) errors.push(t("停止時間は負荷時間より短くしてください。稼働時間が0以下になります。"));
  if (!Number.isFinite(input.idealCycleSeconds) || input.idealCycleSeconds <= 0) errors.push(t("理想サイクルタイムは0より大きい数値で入力してください。"));
  if (!Number.isFinite(input.totalCount) || input.totalCount <= 0) errors.push(t("総生産数は0より大きい数値で入力してください。"));
  if (!Number.isFinite(input.defectCount) || input.defectCount < 0) errors.push(t("不良数は0以上で入力してください。"));
  else if (input.defectCount > input.totalCount) errors.push(t("不良数は総生産数以下にしてください。"));
  const runtimeMinutes = input.loadingMinutes - input.downtimeMinutes;
  if (runtimeMinutes > 0 && input.idealCycleSeconds > 0 && input.totalCount > 0) {
    const performance = input.idealCycleSeconds * input.totalCount / (runtimeMinutes * 60);
    if (performance > 1) errors.push(t("現状の性能稼働率が100%を超えます。理想サイクルタイム、総生産数、停止時間を見直してください。"));
  }
  return errors;
}

export function calculateOee(input: OeeInputs) {
  const runtimeMinutes = input.loadingMinutes - input.downtimeMinutes;
  const availability = runtimeMinutes / input.loadingMinutes;
  const performance = input.idealCycleSeconds * input.totalCount / (runtimeMinutes * 60);
  const quality = (input.totalCount - input.defectCount) / input.totalCount;
  return { runtimeMinutes, availability, performance, quality, oee: availability * performance * quality, goodCount: input.totalCount - input.defectCount };
}

export function validateOeeScenario(input: OeeInputs, scenario: OeeScenario, locale: ToolLocale = "ja") {
  const t = getToolText(locale);
  const errors: string[] = [];
  if (!Number.isFinite(scenario.downtimeMinutes) || scenario.downtimeMinutes < 0 || scenario.downtimeMinutes >= input.loadingMinutes) errors.push(t("改善後の停止時間は0以上、負荷時間未満で入力してください。"));
  if (!Number.isFinite(scenario.performanceRate) || scenario.performanceRate < 0 || scenario.performanceRate > 1) errors.push(t("改善後の性能稼働率は0〜100%で入力してください。"));
  if (!Number.isFinite(scenario.qualityRate) || scenario.qualityRate < 0 || scenario.qualityRate > 1) errors.push(t("改善後の良品率は0〜100%で入力してください。"));
  return errors;
}

export function calculateOeeScenario(input: OeeInputs, scenario: OeeScenario) {
  const runtimeMinutes = input.loadingMinutes - scenario.downtimeMinutes;
  const availability = runtimeMinutes / input.loadingMinutes;
  const estimatedTotalCount = runtimeMinutes * 60 / input.idealCycleSeconds * scenario.performanceRate;
  const estimatedGoodCount = estimatedTotalCount * scenario.qualityRate;
  return { runtimeMinutes, availability, estimatedTotalCount, estimatedGoodCount, oee: availability * scenario.performanceRate * scenario.qualityRate };
}
