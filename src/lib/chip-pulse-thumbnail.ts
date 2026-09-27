import type { PulseProcess, PulseSignal, PulseThumbnail } from "@/data/chip-pulse";

export const pulseThumbnailRoot = "/images/chip-pulse/";

const processThumbnailLabels: Record<PulseProcess, string> = {
  Design: "設計",
  Lithography: "露光",
  Deposition: "成膜",
  Etch: "エッチング",
  Metrology: "検査・計測",
  Assembly: "後工程・実装",
  Test: "テスト",
  Materials: "材料",
};

export type PulseThumbnailPresentation =
  | { kind: "image"; src: string; alt: string; credit: string; creditUrl: string }
  | { kind: "process"; process: PulseProcess | "General"; label: string };

export function assertValidPulseThumbnail(thumbnail: PulseThumbnail) {
  const isLocalImage = thumbnail.src.startsWith(pulseThumbnailRoot)
    && !thumbnail.src.includes("..")
    && !/[?#%\\\s]/.test(thumbnail.src)
    && /\.(?:avif|jpe?g|png|webp)$/i.test(thumbnail.src);
  if (!isLocalImage) throw new Error("Chip Pulse thumbnail must be a local raster image under /images/chip-pulse/.");
  if (!thumbnail.alt.trim()) throw new Error("Chip Pulse thumbnail alt text is required.");
  if (!thumbnail.credit.trim()) throw new Error("Chip Pulse thumbnail credit is required.");
  let creditUrl: URL;
  try {
    creditUrl = new URL(thumbnail.creditUrl);
  } catch {
    throw new Error("Chip Pulse thumbnail credit URL is invalid.");
  }
  if (creditUrl.protocol !== "https:") throw new Error("Chip Pulse thumbnail credit URL must use HTTPS.");
}

export function resolvePulseThumbnail(signal: Pick<PulseSignal, "processes" | "thumbnail">, imageFailed = false): PulseThumbnailPresentation {
  if (signal.thumbnail) {
    assertValidPulseThumbnail(signal.thumbnail);
    if (!imageFailed) return { kind: "image", ...signal.thumbnail };
  }
  const process: PulseProcess | "General" = signal.processes.length > 0 ? signal.processes[0] : "General";
  return {
    kind: "process",
    process,
    label: process === "General" ? "半導体産業" : processThumbnailLabels[process],
  };
}
