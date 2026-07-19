export type FactorLevel = { code: number; label: string; value?: number };
export type DoeFactor = { id: string; name: string; unit?: string; levels: FactorLevel[] };
export type DoeResponse = { id: string; name: string; unit?: string; goal?: "maximize" | "minimize" | "target"; target?: number };
export type DoeRun = { id: string; standardOrder: number; runOrder: number; levels: Record<string, number>; responses: Record<string, number | undefined> };
export type DoeExperiment = { factors: DoeFactor[]; responses: DoeResponse[]; runs: DoeRun[] };
export type DoeEffect = { id: string; kind: "main" | "interaction"; factorIds: string[]; estimate: number; absoluteEstimate: number };
export type DoeAnalysis = { grandMean: number; effects: DoeEffect[]; responseRange: number; warnings: string[] };
