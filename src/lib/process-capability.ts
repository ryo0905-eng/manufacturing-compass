export type CapabilityMethod = "overall" | "short-term";

export type CapabilityInputs = {
  mean: number;
  standardDeviation: number;
  lowerSpecificationLimit?: number;
  upperSpecificationLimit?: number;
  method: CapabilityMethod;
  sampleCount?: number;
};

export type CapabilityResult = CapabilityInputs & {
  potential?: number;
  lower?: number;
  upper?: number;
  performance?: number;
  specificationCenter?: number;
  centerOffset?: number;
};

export type ParsedMeasurements = {
  invalidCount: number;
  values: number[];
};

export type AnalysisResult = {
  heading: string;
  summary: string;
  checks: string[];
  direction?: "上限側" | "下限側";
};

export function parseMeasurements(input: string): ParsedMeasurements {
  const tokens = input.split(/[\s,，;；]+/).map((token) => token.trim()).filter(Boolean);
  const values: number[] = [];
  let invalidCount = 0;

  for (const token of tokens) {
    const value = Number(token);
    if (Number.isFinite(value)) values.push(value);
    else invalidCount += 1;
  }

  return { values, invalidCount };
}

export function arithmeticMean(values: number[]) {
  if (values.length === 0) return undefined;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function sampleStandardDeviation(values: number[]) {
  if (values.length < 2) return undefined;
  const mean = arithmeticMean(values) ?? 0;
  const squaredDifferences = values.reduce((sum, value) => sum + (value - mean) ** 2, 0);
  return Math.sqrt(squaredDifferences / (values.length - 1));
}

export function calculateCapability(inputs: CapabilityInputs): CapabilityResult {
  const { mean, standardDeviation, lowerSpecificationLimit, upperSpecificationLimit } = inputs;
  if (!Number.isFinite(mean)) throw new Error("平均値には有効な数値を入力してください。");
  if (!Number.isFinite(standardDeviation) || standardDeviation <= 0) {
    throw new Error("標準偏差には0より大きい数値を入力してください。");
  }
  if (lowerSpecificationLimit === undefined && upperSpecificationLimit === undefined) {
    throw new Error("上限規格または下限規格を入力してください。");
  }
  if (
    lowerSpecificationLimit !== undefined
    && upperSpecificationLimit !== undefined
    && lowerSpecificationLimit >= upperSpecificationLimit
  ) {
    throw new Error("上限規格は下限規格より大きい値にしてください。");
  }

  const lower = lowerSpecificationLimit === undefined
    ? undefined
    : (mean - lowerSpecificationLimit) / (3 * standardDeviation);
  const upper = upperSpecificationLimit === undefined
    ? undefined
    : (upperSpecificationLimit - mean) / (3 * standardDeviation);
  const potential = lowerSpecificationLimit === undefined || upperSpecificationLimit === undefined
    ? undefined
    : (upperSpecificationLimit - lowerSpecificationLimit) / (6 * standardDeviation);
  const performance = lower === undefined ? upper : upper === undefined ? lower : Math.min(lower, upper);
  const specificationCenter = lowerSpecificationLimit === undefined || upperSpecificationLimit === undefined
    ? undefined
    : (lowerSpecificationLimit + upperSpecificationLimit) / 2;
  const centerOffset = specificationCenter === undefined ? undefined : mean - specificationCenter;

  return { ...inputs, potential, lower, upper, performance, specificationCenter, centerOffset };
}

export function calculateOverallCapability(
  values: number[],
  lowerSpecificationLimit?: number,
  upperSpecificationLimit?: number,
) {
  if (values.length < 2) throw new Error("測定データを2件以上入力してください。");
  const mean = arithmeticMean(values) ?? Number.NaN;
  const standardDeviation = sampleStandardDeviation(values) ?? Number.NaN;
  if (standardDeviation === 0) throw new Error("すべて同じ値のため、標準偏差とPp・Ppkを計算できません。");
  return calculateCapability({
    mean,
    standardDeviation,
    lowerSpecificationLimit,
    upperSpecificationLimit,
    method: "overall",
    sampleCount: values.length,
  });
}

export function analyzeCapability(result: CapabilityResult): AnalysisResult {
  const { potential, performance, lower, upper, centerOffset } = result;
  const commonChecks = ["工程の管理状態", "測定システム", "サンプリング方法"];

  if (potential !== undefined && potential < 1.33) {
    return {
      heading: "ばらつきの確認を優先",
      summary: "規格幅に対して、工程のばらつきが大きい可能性があります。平均値を調整する前に、設備、材料、測定、作業方法など、ばらつきの原因を確認してください。",
      checks: ["測定システム", "材料ロット", "設備条件・工具摩耗", "作業者・周囲温度", "サンプリング方法"],
    };
  }

  const sideDifference = lower !== undefined && upper !== undefined ? Math.abs(lower - upper) : 0;
  if (potential !== undefined && performance !== undefined && potential - performance >= 0.15 && sideDifference >= 0.25) {
    const direction = centerOffset !== undefined && centerOffset > 0 ? "上限側" : "下限側";
    return {
      heading: `平均が${direction}へ偏っています`,
      summary: `ばらつき自体は比較的小さい一方、工程平均が規格中心から${direction}へずれています。設備のオフセット、工具摩耗、初期設定などを確認してください。`,
      checks: ["設備のオフセット", "工具摩耗", "初期設定・条件変更", ...commonChecks],
      direction,
    };
  }

  if (potential !== undefined && performance !== undefined && potential >= 1.33 && performance >= 1.33) {
    return {
      heading: "今回の分布は比較的良好",
      summary: "今回のデータでは、規格幅に対するばらつきと中心位置は比較的良好です。ただし、工程の安定性を示す結果ではありません。時系列の管理状態も併せて確認してください。",
      checks: commonChecks,
    };
  }

  return {
    heading: "規格中心との位置を確認",
    summary: "工程平均はおおむね規格中心にあります。能力をさらに改善する場合は、平均値の微調整よりも工程ばらつきの低減を確認してください。",
    checks: commonChecks,
  };
}

export function metricLabels(method: CapabilityMethod) {
  return method === "overall"
    ? { potential: "Pp", upper: "Ppu", lower: "Ppl", performance: "Ppk" }
    : { potential: "Cp", upper: "Cpu", lower: "Cpl", performance: "Cpk" };
}
