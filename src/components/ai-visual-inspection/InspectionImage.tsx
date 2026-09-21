"use client";
import { useEffect, useRef } from "react";
import type { GrayImage } from "@/lib/ai-visual-inspection/processing";
import styles from "./inspection.module.css";

export function InspectionImage({ image, mask, truth, label }: { image: GrayImage; mask?: Uint8Array; truth?: Uint8Array; label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    const result = context.createImageData(image.width, image.height);
    const edge = (region: Uint8Array, i: number) => region[i] && (i % image.width === 0 || i % image.width === image.width - 1 || i < image.width || i >= region.length - image.width || !region[i-1] || !region[i+1] || !region[i-image.width] || !region[i+image.width]);
    image.pixels.forEach((gray, index) => {
      let color = [gray, gray, gray];
      if (mask && edge(mask, index)) color = [0, 80, 255];
      if (truth && edge(truth, index) && (index % image.width + Math.floor(index / image.width)) % 6 < 3) color = [230, 30, 150];
      result.data.set([...color, 255], index * 4);
    });
    context.putImageData(result, 0, 0);
  }, [image, mask, truth]);
  return <canvas ref={canvas} width={image.width} height={image.height} role="img" aria-label={label} className={styles.image}>{label}</canvas>;
}
