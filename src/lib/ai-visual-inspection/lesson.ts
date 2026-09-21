import { ASSET_ROOT } from "./protocol";
import type { GrayImage } from "./processing";
export type LessonMode = "practice" | "confirmation";
export type LessonSample = {
  id: string; kind: "good" | "dirt" | "scratch"; texture: "flat" | "wave" | "lines";
  defective: boolean; image: GrayImage; truth: Uint8Array;
};
const digest = async (bytes: Uint8Array) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new Uint8Array(bytes))), b => b.toString(16).padStart(2, "0")).join("");
export async function loadLesson(mode: LessonMode, signal: AbortSignal): Promise<LessonSample[]> {
  const prefix = `${ASSET_ROOT}/lesson/${mode}`;
  const responses = await Promise.all(["json", "pixels", "masks"].map(extension => fetch(`${prefix}.${extension}`, { signal })));
  if (responses.some(r => !r.ok)) throw new Error("教材画像を読み込めませんでした。");
  const [metadata, pixels, masks] = await Promise.all([responses[0].json(), responses[1].arrayBuffer(), responses[2].arrayBuffer()]);
  if (metadata.size !== 128 || !Array.isArray(metadata.images) || metadata.images.length !== 24 || pixels.byteLength !== 24 * 16384 || masks.byteLength !== pixels.byteLength) throw new Error("教材画像の形式が一致しません。");
  const gray = new Uint8Array(pixels), truth = new Uint8Array(masks);
  if (await digest(gray) !== metadata.pixelsSha256 || await digest(truth) !== metadata.masksSha256) throw new Error("教材画像の整合性を確認できませんでした。");
  const ids = new Set<string>();
  return metadata.images.map((row: Omit<LessonSample, "image" | "truth">, index: number) => {
    const mask = truth.slice(index * 16384, (index + 1) * 16384);
    if (typeof row.id !== "string" || ids.has(row.id) || !["good", "dirt", "scratch"].includes(row.kind) || !["flat", "wave", "lines"].includes(row.texture) || typeof row.defective !== "boolean" || mask.some(v => v !== 0 && v !== 1) || mask.some(Boolean) !== row.defective || (row.kind !== "good") !== row.defective) throw new Error("正解データが不正です。");
    ids.add(row.id);
    return { id: row.id, kind: row.kind, texture: row.texture, defective: row.defective,
      image: { width: 128, height: 128, pixels: gray.slice(index * 16384, (index + 1) * 16384) }, truth: mask };
  });
}
