/** Pixel processing shared by display and evaluation. No generator/labels here. */
export type GrayImage = { width: number; height: number; pixels: Uint8Array };
export type Detection = { mask: Uint8Array; defective: boolean; regions: number };
export type RuleSettings = { threshold: number; minimumArea: number; corrected: boolean };

function validateImage(image: GrayImage) {
  const { width, height, pixels } = image;
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || pixels.length !== width * height) {
    throw new Error("画像の大きさが一致しません。");
  }
}

export function changeLighting(image: GrayImage, gain: number): GrayImage {
  validateImage(image);
  if (!Number.isFinite(gain) || gain < 0.7 || gain > 1.3) throw new Error("明るさが範囲外です。");
  return { ...image, pixels: Uint8Array.from(image.pixels, p => Math.floor(Math.min(255, Math.max(0, p * gain)) + 0.5)) };
}

/** 8-connected components, including diagonal neighbours. */
export function extractRegions(binary: Uint8Array, width: number, height: number, minimumArea: number): Detection {
  validateImage({ pixels: binary, width, height });
  if (!Number.isInteger(minimumArea) || minimumArea < 1) throw new Error("検出面積が範囲外です。");
  const visited = new Uint8Array(binary.length), mask = new Uint8Array(binary.length);
  const queue = new Int32Array(binary.length);
  let regions = 0;
  for (let start = 0; start < binary.length; start++) {
    if (!binary[start] || visited[start]) continue;
    let head = 0, tail = 1;
    queue[0] = start; visited[start] = 1;
    while (head < tail) {
      const index = queue[head++], x = index % width, y = Math.floor(index / width);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= width || yy >= height) continue;
        const next = yy * width + xx;
        if (binary[next] && !visited[next]) { visited[next] = 1; queue[tail++] = next; }
      }
    }
    if (tail >= minimumArea) {
      regions++;
      for (let i = 0; i < tail; i++) mask[queue[i]] = 1;
    }
  }
  return { mask, defective: regions > 0, regions };
}

/** 17×17 local mean, edge replication, separable box filter. */
export function localMean(image: GrayImage): Float64Array {
  validateImage(image);
  const { pixels, width, height } = image;
  const horizontal = new Float64Array(pixels.length), mean = new Float64Array(pixels.length);
  const clamp = (n: number, limit: number) => Math.min(limit - 1, Math.max(0, n));
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let dx = -8; dx <= 8; dx++) sum += pixels[y * width + clamp(dx, width)];
    for (let x = 0; x < width; x++) {
      horizontal[y * width + x] = sum / 17;
      sum += pixels[y * width + clamp(x + 9, width)] - pixels[y * width + clamp(x - 8, width)];
    }
  }
  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let dy = -8; dy <= 8; dy++) sum += horizontal[clamp(dy, height) * width + x];
    for (let y = 0; y < height; y++) {
      mean[y * width + x] = sum / 17;
      sum += horizontal[clamp(y + 9, height) * width + x] - horizontal[clamp(y - 8, height) * width + x];
    }
  }
  return mean;
}

export function inspectRule(image: GrayImage, settings: RuleSettings): Detection {
  validateImage(image);
  if (!Number.isFinite(settings.threshold) || settings.threshold < 0 || settings.threshold > 255) throw new Error("しきい値が範囲外です。");
  const mean = settings.corrected ? localMean(image) : null;
  const binary = Uint8Array.from(image.pixels, (p, i) => Number(mean ? mean[i] - p >= settings.threshold : p < settings.threshold));
  return extractRegions(binary, image.width, image.height, settings.minimumArea);
}

export function inspectScores(scores: Float32Array, width: number, height: number, threshold: number, minimumArea: number): Detection {
  if (scores.length !== width * height || !Number.isFinite(threshold) || threshold < 0 || threshold > 1) throw new Error("AIの出力またはしきい値が不正です。");
  const binary = Uint8Array.from(scores, value => {
    if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error("AIの出力が不正です。");
    return Number(value >= threshold);
  });
  return extractRegions(binary, width, height, minimumArea);
}
