export type GageScenarioId = "capable" | "repeatability" | "operator" | "interaction" | "narrow-parts";

export type GageSettings = {
  partSpread: number;
  repeatability: number;
  operatorBias: number;
  interaction: number;
};

export type GageMeasurement = {
  runOrder: number;
  part: number;
  operator: number;
  replicate: number;
  value: number;
};

export type GageVarianceSource = "repeatability" | "operator" | "interaction" | "reproducibility" | "gage" | "part" | "total";

export type GageVarianceComponent = {
  id: GageVarianceSource;
  label: string;
  variance: number;
  standardDeviation: number;
  studyVariation: number;
  contributionPercent: number;
  studyPercent: number;
};

export type GageAnovaRow = {
  id: "part" | "operator" | "interaction" | "repeatability";
  label: string;
  ss: number;
  df: number;
  ms: number;
};

export type GageAnalysis = {
  components: GageVarianceComponent[];
  anova: GageAnovaRow[];
  ndc: number;
  gagePercent: number;
  dominantError: "repeatability" | "reproducibility";
  partMeans: number[];
  operatorMeans: number[];
  cellMeans: number[][];
};
