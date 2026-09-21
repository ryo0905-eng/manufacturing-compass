import { getToolText, type ToolLocale } from "@/data/practical-tool-text";
export type LineStation = { id: string; name: string };
export type LineTask = { id: string; name: string; seconds: number; stationId: string };

export type LineBalanceResult = {
  stationTotals: Record<string, number>;
  totalWorkSeconds: number;
  totalExcessSeconds: number;
  longestStationId: string;
  longestStationSeconds: number;
};

export function validateLineBalance(taktTime: number, stations: LineStation[], tasks: LineTask[], locale: ToolLocale = "ja") {
  const t = getToolText(locale);
  const errors: string[] = [];
  if (!Number.isFinite(taktTime) || taktTime <= 0) errors.push(t("目標タクトタイムは0より大きい数値で入力してください。"));
  if (stations.length === 0) errors.push(t("工程を1つ以上追加してください。"));
  if (stations.some((station) => !station.name.trim())) errors.push(t("工程名の空欄を入力してください。"));
  if (tasks.some((task) => !task.name.trim())) errors.push(t("作業名の空欄を入力してください。"));
  if (tasks.some((task) => !Number.isFinite(task.seconds) || task.seconds <= 0)) errors.push(t("各作業時間は0より大きい数値で入力してください。"));
  if (tasks.some((task) => !stations.some((station) => station.id === task.stationId))) errors.push(t("所属工程がない作業を見直してください。"));
  return errors;
}

export function analyzeLineBalance(taktTime: number, stations: LineStation[], tasks: LineTask[]): LineBalanceResult {
  const stationTotals = Object.fromEntries(stations.map((station) => [station.id, 0]));
  for (const task of tasks) stationTotals[task.stationId] = (stationTotals[task.stationId] ?? 0) + task.seconds;
  const longest = stations.reduce((best, station) => stationTotals[station.id] > best.seconds ? { id: station.id, seconds: stationTotals[station.id] } : best, { id: stations[0]?.id ?? "", seconds: stations[0] ? stationTotals[stations[0].id] : 0 });
  return {
    stationTotals,
    totalWorkSeconds: tasks.reduce((sum, task) => sum + task.seconds, 0),
    totalExcessSeconds: stations.reduce((sum, station) => sum + Math.max(0, stationTotals[station.id] - taktTime), 0),
    longestStationId: longest.id,
    longestStationSeconds: longest.seconds,
  };
}
