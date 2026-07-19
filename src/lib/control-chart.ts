export type ControlChartScenario = "stable" | "shift" | "outlier" | "trend" | "cycle";
export type ControlRule = { id: "limit" | "side" | "trend"; label: string; points: number[] };

const base = [99.4,100.7,99.8,100.4,99.2,100.2,100.8,99.6,100.1,99.5,100.5,99.7,100.3,99.3,100.6,99.9,100.4,99.4,100.2,99.6,100.7,99.8,100.3,99.5];

export function scenarioValues(scenario: ControlChartScenario) {
  return base.map((value, index) => {
    if (scenario === "shift" && index >= 12) return value + 2.4;
    if (scenario === "outlier" && index === 17) return value + 4.8;
    if (scenario === "trend" && index >= 10) return value + (index - 10) * .34;
    if (scenario === "cycle" && index >= 8) return value + Math.sin((index - 8) * Math.PI / 2) * 2;
    return value;
  });
}

export function analyzeIndividualsChart(values: number[], baselineLength = 10) {
  const baseline = values.slice(0, baselineLength);
  const center = baseline.reduce((sum, value) => sum + value, 0) / baseline.length;
  const movingRanges = baseline.slice(1).map((value, index) => Math.abs(value - baseline[index]));
  const mrBar = movingRanges.reduce((sum, value) => sum + value, 0) / movingRanges.length;
  const sigma = mrBar / 1.128;
  const ucl = center + 3 * sigma;
  const lcl = center - 3 * sigma;
  const rules: ControlRule[] = [];
  const outside = values.flatMap((value, index) => value > ucl || value < lcl ? [index] : []);
  if (outside.length) rules.push({ id: "limit", label: "1点が3σ管理限界の外側", points: outside });
  for (let start = 0; start <= values.length - 8; start += 1) {
    const window = values.slice(start, start + 8);
    if (window.every((value) => value > center) || window.every((value) => value < center)) rules.push({ id: "side", label: "8点連続で中心線の同じ側", points: window.map((_, offset) => start + offset) });
  }
  for (let start = 0; start <= values.length - 6; start += 1) {
    const window = values.slice(start, start + 6);
    const increasing = window.slice(1).every((value, index) => value > window[index]);
    const decreasing = window.slice(1).every((value, index) => value < window[index]);
    if (increasing || decreasing) rules.push({ id: "trend", label: "6点連続で増加または減少", points: window.map((_, offset) => start + offset) });
  }
  const uniqueRules = rules.filter((rule, index) => rules.findIndex((candidate) => candidate.id === rule.id) === index);
  return { center, mrBar, sigma, ucl, lcl, rules: uniqueRules, flaggedPoints: new Set(uniqueRules.flatMap((rule) => rule.points)) };
}
