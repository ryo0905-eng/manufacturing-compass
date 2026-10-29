export type TreemapRect = { id: string; x: number; y: number; width: number; height: number };

/** Squarify positive values into a fixed rectangle, preserving their relative areas. */
export function layoutTreemap(items: { id: string; value: number }[], width: number, height: number): TreemapRect[] {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return [];
  const sorted = items.filter(item => Number.isFinite(item.value) && item.value > 0).sort((a, b) => b.value - a.value);
  const total = sorted.reduce((sum, item) => sum + item.value, 0);
  if (!Number.isFinite(total) || total <= 0) return [];
  const pending = sorted.map(item => ({ id: item.id, area: item.value / total * width * height }));
  const result: TreemapRect[] = [];
  let x = 0, y = 0, w = width, h = height;
  const worst = (row: typeof pending, side: number) => {
    if (!row.length || side <= 0) return Infinity;
    const sum = row.reduce((s, item) => s + item.area, 0);
    const areas = row.map(item => item.area);
    return Math.max(side * side * Math.max(...areas) / (sum * sum), sum * sum / (side * side * Math.min(...areas)));
  };
  while (pending.length) {
    const row = [pending.shift()!];
    while (pending.length && worst([...row, pending[0]], Math.min(w, h)) <= worst(row, Math.min(w, h))) row.push(pending.shift()!);
    const area = row.reduce((sum, item) => sum + item.area, 0);
    if (w >= h) {
      const rowWidth = area / h;
      let offset = y;
      for (const item of row) { const itemHeight = item.area / rowWidth; result.push({ id: item.id, x, y: offset, width: rowWidth, height: itemHeight }); offset += itemHeight; }
      x += rowWidth; w -= rowWidth;
    } else {
      const rowHeight = area / w;
      let offset = x;
      for (const item of row) { const itemWidth = item.area / rowHeight; result.push({ id: item.id, x: offset, y, width: itemWidth, height: rowHeight }); offset += itemWidth; }
      y += rowHeight; h -= rowHeight;
    }
  }
  return result;
}
