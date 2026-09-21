import type { Detection, GrayImage, RuleSettings } from "./processing.js";

export const MODEL_IDS = ["balanced", "dirt-biased", "normal-poor", "label-errors"] as const;
export type ModelId = typeof MODEL_IDS[number];
export type InspectionSettings = {
  model: ModelId;
  gain: number;
  rule: RuleSettings;
  scoreThreshold: number;
  minimumArea: number;
};
// No labels, generator parameters, or truth masks cross this boundary.
export type InspectionRequest = {
  id: number;
  images: GrayImage[];
  settings: InspectionSettings;
};
export type ImageResult = {
  image: GrayImage;
  rule: Detection;
  ai: Detection;
  scores: Float32Array;
};
export type InspectionResponse =
  | { id: number; status: "complete"; results: ImageResult[]; elapsedMs: number; inferenceCount: number }
  | { id: number; status: "error"; code: "inspection-failed" };
export const ASSET_ROOT = "/ai-visual-inspection/v2";
