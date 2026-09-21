"use client";

import { useEffect, useRef, useState } from "react";
import type { Condition, Observation, Prediction } from "@/lib/bayesian-optimization/types";
import { bayesianText as text } from "@/data/bayesian-optimization";
import styles from "./bayesian.module.css";

export type MapView = "prediction" | "uncertainty" | "truth";
const x = (point: Condition) => 5 + (point.temperature - 300) * 2;
const y = (point: Condition) => 405 - (point.pressure - 20) * 5;

function heatColor(value: number, view: MapView): string {
  // Sequential luminance: dark = low quality metric / high epistemic uncertainty.
  const ratio = Math.max(0, Math.min(1, view === "uncertainty" ? 1 - value / 1.5 : value / 12));
  return `rgb(${Math.round(38 + 202 * ratio)},${Math.round(76 + 169 * ratio)},${Math.round(113 + 136 * ratio)})`;
}

export function ExperimentMap({ surface, truth, observations, selected, recommended, planned, view, onSelect, disabled }: {
  surface: readonly Prediction[] | undefined;
  truth: readonly (Condition & { value: number })[] | undefined;
  observations: readonly Observation[];
  selected: Condition;
  recommended?: Condition;
  planned: readonly Condition[];
  view: MapView;
  onSelect: (point: Condition) => void;
  disabled: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const values = view === "truth" ? truth : surface;
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) { setCanvasFailed(true); return; }
    ctx.clearRect(0, 0, 410, 410);
    ctx.fillStyle = "#f7f7f8"; ctx.fillRect(0, 0, 410, 410);
    if (!values) return;
    values.forEach(point => {
      const value = "value" in point ? point.value : view === "uncertainty" ? point.sd : point.mean;
      ctx.fillStyle = heatColor(value, view);
      ctx.fillRect(x(point) - 5, y(point) - 5, 10, 10);
    });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.current?.animate?.([{ opacity: 0.7 }, { opacity: 1 }], { duration: 200 });
    }
  }, [values, view]);

  const additional = observations.filter(o => o.run >= 7 && o.method !== "confirmation");
  // Coincident measurements use one label with all run numbers, never hide earlier runs.
  const groups = new Map<string, Observation[]>();
  for (const observation of observations) {
    const key = `${observation.temperature}:${observation.pressure}`;
    groups.set(key, [...(groups.get(key) ?? []), observation]);
  }
  return <figure className={styles.mapFigure}>
    <div className={styles.axisTop}><span>圧力（Pa）</span><strong>{values ? view === "truth" ? text.truth : view === "uncertainty" ? text.uncertainty : text.prediction : "まだ調べていない範囲"}</strong></div>
    <div className={styles.mapRow}><div className={styles.yTicks} aria-hidden="true"><span>100</span><span>60</span><span>20</span></div>
      <div className={styles.map}>
        <canvas ref={canvas} width={410} height={410} aria-hidden="true" />
        <svg viewBox="0 0 410 410" role="img" aria-label="温度と圧力の実験マップ。下の入力欄でも条件を選べます。各実験の数値は実験履歴で確認できます。"
          className={disabled ? styles.lockedMap : undefined}
          onClick={event => {
            if (disabled || event.detail > 1) return;
            const box = event.currentTarget.getBoundingClientRect();
            const clamp = (value: number) => Math.max(0, Math.min(40, Math.round(value)));
            onSelect({ temperature: 300 + 5 * clamp(((event.clientX - box.left) / box.width * 410 - 5) / 10), pressure: 20 + 2 * clamp((405 - (event.clientY - box.top) / box.height * 410) / 10) });
          }}>
          <path d="M5 205H405M205 5V405" stroke="#60666d" strokeOpacity=".25" strokeDasharray="3 6" fill="none" />
          {view === "truth" && additional.length > 1 && <polyline points={additional.map(p => `${x(p)},${y(p)}`).join(" ")} fill="none" stroke="#1d1d1f" strokeWidth="2" strokeDasharray="5 3" />}
          {planned.map(point => <rect key={`${point.temperature}:${point.pressure}`} x={x(point) - 7} y={y(point) - 7} width="14" height="14" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeDasharray="3 2" />)}
          {[...groups.entries()].map(([key, group]) => {
            const point = group[group.length - 1];
            const labelX = Math.max(23, Math.min(366, x(point) + 12));
            const labelY = Math.max(20, Math.min(395, y(point) - 9));
            return <g key={`${key}:${point.run}`} className={point.run === observations.length ? styles.latestPoint : undefined}>
              <title>{group.map(o => `${o.run}回目：${o.temperature}℃、${o.pressure}Pa、${o.value.toFixed(2)}%`).join(" / ")}</title>
              <circle cx={x(point)} cy={y(point)} r="4" fill="#fff" stroke="#1d1d1f" strokeWidth="2" />
              <text x={labelX} y={labelY} fontSize="12" fontWeight="600" paintOrder="stroke" stroke="#fff" strokeWidth="3" fill="#1d1d1f">{group.map(o => o.run).join(",")}</text>
            </g>;
          })}
          {recommended && <path d={`M${x(recommended)} ${y(recommended) - 9}l9 9 -9 9 -9 -9Z`} fill="#fff" stroke="#1d1d1f" strokeWidth="2"><title>次の推奨点</title></path>}
          <g stroke="#fff" strokeWidth="5"><path d={`M${x(selected) - 9} ${y(selected)}h18M${x(selected)} ${y(selected) - 9}v18`} /></g>
          <path d={`M${x(selected) - 9} ${y(selected)}h18M${x(selected)} ${y(selected) - 9}v18`} stroke="#1769aa" strokeWidth="2" />
        </svg>
      </div>
    </div>
    <div className={styles.xTicks} aria-hidden="true"><span>300</span><span>400</span><span>500℃</span></div>
    <figcaption>
      <div className={styles.legend}><span>○ 実験済み・番号</span><span>＋ 選択中</span>{recommended && <span>◇ 次の推奨</span>}{planned.length > 0 && <span>□ DOE予定</span>}</div>
      {values && <div className={styles.colorLegend}><span>{view === "uncertainty" ? "0：小さい" : "0%以下：むらが小さい"}</span><span className={view === "uncertainty" ? styles.uncertaintyRamp : styles.qualityRamp} /><span>{view === "uncertainty" ? "1.5：大きい" : "12%以上：大きい"}</span></div>}
      {canvasFailed && <p>マップの色を描画できません。条件入力と数値表示・実験履歴で操作できます。</p>}
    </figcaption>
  </figure>;
}

export function ImprovementChart({ observations, truth, best }: {
  observations: readonly Observation[]; truth?: readonly number[]; best?: number;
}) {
  const values = truth ?? observations.map(o => o.value);
  const low = Math.min(0, ...values), high = Math.max(12, ...values);
  const px = (index: number) => 48 + index * 42;
  const py = (value: number) => 150 - (value - low) / (high - low) * 120;
  let minimum = Infinity;
  const step = values.map((value, i) => {
    minimum = Math.min(minimum, value);
    return i === 0 ? `M${px(i)} ${py(minimum)}` : `H${px(i)}V${py(minimum)}`;
  }).join(" ");
  return <figure className={styles.improvement}>
    <svg viewBox="0 0 540 185" role="img" aria-label={`${truth ? "真値" : "観測値"}と累積最小値。横軸は実験回数、縦軸は膜厚むら%。各回の値は実験履歴にあります。`}>
      {[0, 0.5, 1].map(ratio => <g key={ratio}><path d={`M48 ${150 - ratio * 120}H515`} stroke="#e5e7eb" /><text x="38" y={154 - ratio * 120} textAnchor="end" fontSize="11" fill="#60666d">{(low + ratio * (high - low)).toFixed(0)}</text></g>)}
      <text x="12" y="18" fontSize="11" fill="#60666d">%</text>
      {truth && best !== undefined && <path d={`M48 ${py(best)}H515`} stroke="#60666d" strokeDasharray="5 4" />}
      <path d={step} fill="none" stroke="#1769aa" strokeWidth="2" />
      {values.map((value, index) => <circle key={index} cx={px(index)} cy={py(value)} r="4" fill="#fff" stroke="#1d1d1f"><title>{`${index + 1}回目：${value.toFixed(2)}%`}</title></circle>)}
      {Array.from({ length: 12 }, (_, i) => <text key={i} x={px(i)} y="171" textAnchor="middle" fontSize="11" fill="#60666d">{i + 1}</text>)}
      <text x="516" y="184" textAnchor="end" fontSize="10" fill="#60666d">実験回数</text>
    </svg>
    <figcaption>○ {truth ? "各条件の真値" : text.observed}　 ━ {truth ? text.trueBest : text.observedBest}{truth && "　 ┄ 操作可能な格子内の最良値"}
      {!truth && <span>測定ノイズを含みます。この線の改善だけでは、本当に良くなったとは限りません。</span>}
    </figcaption>
  </figure>;
}
