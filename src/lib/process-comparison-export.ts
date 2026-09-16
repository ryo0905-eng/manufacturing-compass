/** Rasterizes the same standalone SVG used by the screen. No network or storage. */
export async function downloadComparisonPng(svg: string): Promise<void> {
  const source = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("図の読み込みに失敗しました。"));
      image.src = source;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 2000; canvas.height = 1280;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("画像を作成できませんでした。");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("PNGへの変換に失敗しました。")), "image/png"));
    const output = URL.createObjectURL(blob);
    try {
      const link = document.createElement("a");
      link.href = output; link.download = "process-comparison.png";
      document.body.appendChild(link); link.click(); link.remove();
    } finally { setTimeout(() => URL.revokeObjectURL(output), 1000); }
  } finally { URL.revokeObjectURL(source); }
}
