"use client";

import { useMemo, useState } from "react";
import { calculateCapability } from "@/lib/process-capability";
import { trackEvent } from "@/lib/analytics";

type LearningState = { mean: number; standardDeviation: number; lsl: number; usl: number };

const presets = [
  { id: "centered", label: "中心・Cpk 1.33", state: { mean: 100, standardDeviation: 0.75, lsl: 97, usl: 103 } },
  { id: "shifted", label: "平均が上限側", state: { mean: 101, standardDeviation: 0.75, lsl: 97, usl: 103 } },
  { id: "variation", label: "ばらつきが大きい", state: { mean: 100, standardDeviation: 1.2, lsl: 97, usl: 103 } },
  { id: "narrow", label: "規格幅が狭い", state: { mean: 100, standardDeviation: 0.75, lsl: 98, usl: 102 } },
  { id: "capable", label: "余裕のある工程", state: { mean: 100, standardDeviation: 0.5, lsl: 97, usl: 103 } },
] as const;

const initialState: LearningState = presets[0].state;

function fixed(value?: number) {
  return value === undefined ? "—" : value.toFixed(3);
}

function learningMessage(result: ReturnType<typeof calculateCapability>) {
  if (result.potential === undefined || result.performance === undefined) return "規格値を確認してください。";
  const difference = result.potential - result.performance;
  if (difference >= 0.15) return "ばらつきが同じでも、平均が規格中心から離れるとCpkは下がります。Cpは規格幅と標準偏差だけで決まるため変わりません。";
  if (result.potential < 1.33) return "平均はおおむね中心ですが、規格幅に対してばらつきが大きいため、CpとCpkの両方が低下しています。";
  if (result.potential >= 1.67) return "平均が規格中心にあり、ばらつきも規格幅に対して小さいため、CpとCpkが近い高い値になっています。";
  return "平均が規格中心にあるため、CpkはCpとほぼ同じです。標準偏差を大きくすると、両方の値が下がります。";
}

export function CpkLearningSimulator() {
  const [state, setState] = useState<LearningState>(initialState);
  const result = useMemo(() => calculateCapability({ mean: state.mean, standardDeviation: state.standardDeviation, lowerSpecificationLimit: state.lsl, upperSpecificationLimit: state.usl, method: "short-term" }), [state]);
  const plot = { x: 54, y: 28, width: 612, height: 210 };
  const domainMin = 94;
  const domainMax = 106;
  const x = (value: number) => plot.x + ((value - domainMin) / (domainMax - domainMin)) * plot.width;
  const density = Array.from({ length: 121 }, (_, index) => {
    const value = domainMin + (index / 120) * (domainMax - domainMin);
    const height = Math.exp(-0.5 * ((value - state.mean) / state.standardDeviation) ** 2);
    return { value, y: plot.y + plot.height - height * (plot.height - 18) };
  });
  const curvePath = density.map((point, index) => `${index === 0 ? "M" : "L"}${x(point.value).toFixed(2)},${point.y.toFixed(2)}`).join(" ");
  const areaPath = `${curvePath} L${x(domainMax)},${plot.y + plot.height} L${x(domainMin)},${plot.y + plot.height} Z`;
  const center = (state.lsl + state.usl) / 2;

  function update(key: keyof LearningState, value: number) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(preset: typeof presets[number]) {
    setState(preset.state);
    trackEvent("cpk_learning_preset_selected", { preset: preset.id });
  }

  return (
    <div className="cpk-learning-workspace">
      <section className="cpk-learning-controls" aria-labelledby="cpk-learning-controls-title">
        <header><div><p className="section-label">LEARNING MODE</p><h2 id="cpk-learning-controls-title">条件を動かす</h2></div><button onClick={() => setState(initialState)} type="button">初期値に戻す</button></header>
        <div className="cpk-learning-presets" aria-label="学習プリセット">{presets.map((preset) => <button key={preset.id} onClick={() => applyPreset(preset)} type="button">{preset.label}</button>)}</div>
        <div className="cpk-learning-sliders">
          <label><span><b>平均 μ</b><output>{state.mean.toFixed(2)}</output></span><input min="96" max="104" step="0.05" type="range" value={state.mean} onChange={(event) => update("mean", Number(event.target.value))} /></label>
          <label><span><b>標準偏差 σ</b><output>{state.standardDeviation.toFixed(2)}</output></span><input min="0.25" max="1.5" step="0.05" type="range" value={state.standardDeviation} onChange={(event) => update("standardDeviation", Number(event.target.value))} /></label>
          <label><span><b>下限規格 LSL</b><output>{state.lsl.toFixed(2)}</output></span><input min="94" max="99.5" step="0.1" type="range" value={state.lsl} onChange={(event) => update("lsl", Math.min(Number(event.target.value), state.usl - 0.5))} /></label>
          <label><span><b>上限規格 USL</b><output>{state.usl.toFixed(2)}</output></span><input min="100.5" max="106" step="0.1" type="range" value={state.usl} onChange={(event) => update("usl", Math.max(Number(event.target.value), state.lsl + 0.5))} /></label>
        </div>
        <p className="cpk-learning-hint">まず「平均」を動かし、CpとCpkの違いを見てみてください。</p>
      </section>

      <section className="cpk-learning-result" aria-live="polite" aria-labelledby="cpk-learning-result-title">
        <header><div><p className="section-label">LIVE RESULT</p><h2 id="cpk-learning-result-title">分布と工程能力の変化</h2></div><dl><div><dt>Cp</dt><dd>{fixed(result.potential)}</dd></div><div><dt>Cpk</dt><dd>{fixed(result.performance)}</dd></div></dl></header>
        <p className="cpk-learning-message">{learningMessage(result)}</p>
        <figure className="cpk-learning-chart">
          <svg viewBox="0 0 720 280" role="img" aria-label={`平均${state.mean.toFixed(2)}、標準偏差${state.standardDeviation.toFixed(2)}、Cp ${fixed(result.potential)}、Cpk ${fixed(result.performance)}の理論正規分布`}>
            <rect className="learning-plot-background" x={plot.x} y={plot.y} width={plot.width} height={plot.height} rx="5" />
            {[0, .25, .5, .75, 1].map((tick) => <line className="learning-grid" key={tick} x1={plot.x} x2={plot.x + plot.width} y1={plot.y + tick * plot.height} y2={plot.y + tick * plot.height} />)}
            <rect className="learning-outside" x={plot.x} y={plot.y} width={Math.max(0, x(state.lsl) - plot.x)} height={plot.height} />
            <rect className="learning-outside" x={x(state.usl)} y={plot.y} width={Math.max(0, plot.x + plot.width - x(state.usl))} height={plot.height} />
            <path className="learning-density-area" d={areaPath} /><path className="learning-density-line" d={curvePath} />
            <line className="learning-reference learning-reference--spec" x1={x(state.lsl)} x2={x(state.lsl)} y1={plot.y} y2={plot.y + plot.height} /><line className="learning-reference learning-reference--spec" x1={x(state.usl)} x2={x(state.usl)} y1={plot.y} y2={plot.y + plot.height} />
            <line className="learning-reference learning-reference--center" x1={x(center)} x2={x(center)} y1={plot.y} y2={plot.y + plot.height} /><line className="learning-reference learning-reference--mean" x1={x(state.mean)} x2={x(state.mean)} y1={plot.y} y2={plot.y + plot.height} />
            <text x={x(state.lsl)} y="18" textAnchor="middle">LSL</text><text x={x(state.usl)} y="18" textAnchor="middle">USL</text><text x={x(state.mean)} y="270" textAnchor="middle">平均 {state.mean.toFixed(2)}</text>
          </svg>
          <figcaption>青は理論正規分布、薄い赤は規格外側です。赤線は規格限界、緑線は平均、紫の点線は規格中心を示します。</figcaption>
        </figure>
        <aside className="cpk-learning-note"><strong>学習用の理論例です</strong><p>正規分布と入力した平均・短期標準偏差を前提にしています。Cpkだけで工程の安定性や実際の規格外率を判断することはできません。</p></aside>
      </section>
    </div>
  );
}
