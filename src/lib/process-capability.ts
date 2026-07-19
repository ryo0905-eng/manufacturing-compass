export type CapabilityInputs = {
  mean: number;
  standardDeviation: number;
  lowerSpecificationLimit?: number;
  upperSpecificationLimit?: number;
};

export type CapabilityResult = CapabilityInputs & {
  cp?: number;
  cpl?: number;
  cpu?: number;
  cpk?: number;
};

export function sampleStandardDeviation(values: number[]) {
  if (values.length < 2) return undefined;

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const squaredDifferences = values.reduce((sum, value) => sum + (value - mean) ** 2, 0);
  return Math.sqrt(squaredDifferences / (values.length - 1));
}

export function calculateCapability(inputs: CapabilityInputs): CapabilityResult {
  const { mean, standardDeviation, lowerSpecificationLimit, upperSpecificationLimit } = inputs;
  if (!Number.isFinite(mean) || !Number.isFinite(standardDeviation) || standardDeviation <= 0) {
    throw new Error("平均値と0より大きい標準偏差を入力してください。");
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

  const cpl = lowerSpecificationLimit === undefined
    ? undefined
    : (mean - lowerSpecificationLimit) / (3 * standardDeviation);
  const cpu = upperSpecificationLimit === undefined
    ? undefined
    : (upperSpecificationLimit - mean) / (3 * standardDeviation);
  const cp = lowerSpecificationLimit === undefined || upperSpecificationLimit === undefined
    ? undefined
    : (upperSpecificationLimit - lowerSpecificationLimit) / (6 * standardDeviation);
  const cpk = cpl === undefined ? cpu : cpu === undefined ? cpl : Math.min(cpl, cpu);

  return { ...inputs, cp, cpl, cpu, cpk };
}
