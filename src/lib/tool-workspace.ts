export type WorkspaceInputs = {
  cpk: { mode: "raw" | "summary"; rawData: string; mean: string; standardDeviation: string; lsl: string; usl: string };
  "process-comparison": { nameA: string; nameB: string; measurement: string; unit: string; dataA: string; dataB: string; lower: string; upper: string };
};
export type WorkspaceTool = keyof WorkspaceInputs;
export const workspaceMaxBytes = 2 * 1024 * 1024;
export type WorkspaceErrorCode = "size" | "json" | "format" | "version" | "tool" | "input";
export class WorkspaceError extends Error {
  constructor(public readonly code: WorkspaceErrorCode) { super(code); }
}
const fields = {
  cpk: ["mode", "rawData", "mean", "standardDeviation", "lsl", "usl"],
  "process-comparison": ["nameA", "nameB", "measurement", "unit", "dataA", "dataB", "lower", "upper"],
} as const;
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function pickInput<T extends WorkspaceTool>(tool: T, value: unknown): WorkspaceInputs[T] {
  if (!isRecord(value)) throw new WorkspaceError("input");
  const clean: Record<string, string> = {};
  for (const key of fields[tool]) {
    if (!Object.hasOwn(value, key) || typeof value[key] !== "string") throw new WorkspaceError("input");
    clean[key] = value[key];
  }
  if (tool === "cpk" && clean.mode !== "raw" && clean.mode !== "summary") throw new WorkspaceError("input");
  return clean as WorkspaceInputs[T];
}
function checkSize(text: string) {
  if (new TextEncoder().encode(text).byteLength > workspaceMaxBytes) throw new WorkspaceError("size");
}
export function serializeWorkspace<T extends WorkspaceTool>(tool: T, input: WorkspaceInputs[T]): string {
  const text = JSON.stringify({ format: "mfg-compass-workspace", version: 1, tool, input: pickInput(tool, input) }, null, 2);
  checkSize(text);
  return text;
}
export function parseWorkspace<T extends WorkspaceTool>(text: string, tool: T): WorkspaceInputs[T] {
  checkSize(text);
  let value: unknown;
  try { value = JSON.parse(text.replace(/^\uFEFF/, "")); } catch { throw new WorkspaceError("json"); }
  if (!isRecord(value) || value.format !== "mfg-compass-workspace") throw new WorkspaceError("format");
  if (value.version !== 1) throw new WorkspaceError("version");
  if (value.tool !== tool) throw new WorkspaceError("tool");
  return pickInput(tool, value.input);
}
export function workspaceFilename(tool: WorkspaceTool, date = new Date()): string {
  const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return `mfg-compass-${tool}-${day}.json`;
}
