"use client";

import { useMemo, useState } from "react";
import { analyzeExperiment, cellMean, conditionMean } from "@/lib/doe/effects";
import { doePresets, type DoePreset } from "@/lib/doe/presets";
import type { DoeExperiment } from "@/lib/doe/types";
import { trackEvent } from "@/lib/analytics";

const initialResponses = [72, 81, 76, 94];

function experimentWith(values: number[]): DoeExperiment {
  return {
    factors: [
      { id: "temperature", name: "温度", unit: "℃", levels: [{ code: -1, label: "低", value: 160 }, { code: 1, label: "高", value: 200 }] },
      { id: "pressure", name: "圧力", unit: "kPa", levels: [{ code: -1, label: "低", value: 80 }, { code: 1, label: "高", value: 120 }] },
    ],
    responses: [{ id: "strength", name: "強度", unit: "MPa", goal: "maximize" }],
    runs: [
      { id: "run-1", standardOrder: 1, runOrder: 1, levels: { temperature: -1, pressure: -1 }, responses: { strength: values[0] } },
      { id: "run-2", standardOrder: 2, runOrder: 2, levels: { temperature: 1, pressure: -1 }, responses: { strength: values[1] } },
      { id: "run-3", standardOrder: 3, runOrder: 3, levels: { temperature: -1, pressure: 1 }, responses: { strength: values[2] } },
      { id: "run-4", standardOrder: 4, runOrder: 4, levels: { temperature: 1, pressure: 1 }, responses: { strength: values[3] } },
    ],
  };
}

function format(value: number) { return value.toFixed(2); }

function explanation(interaction: number, range: number, linesCross: boolean) {
  const relative = range === 0 ? 0 : Math.abs(interaction) / range;
  if (linesCross) return "2本の線が交差しています。温度の効果が圧力条件によって逆転しているため、温度や圧力を単独で評価すると誤解する可能性があります。";
  if (relative >= .2) return "2本の線の傾きが大きく異なります。温度の効果が圧力条件によって変わるため、主効果だけで条件を決めないよう注意が必要です。";
  if (relative >= .05) return "2本の線は完全には平行ではありません。条件による効果の違いが見られるため、交互作用も確認します。";
  return "2本の線はおおむね平行です。この例では、温度の効果は圧力条件によって大きく変化していません。";
}

export function DoeLearningTool() {
  const [responses, setResponses] = useState(initialResponses);
  const experiment = useMemo(() => experimentWith(responses), [responses]);
  const analysis = useMemo(() => analyzeExperiment(experiment, "strength"), [experiment]);
  const effectA = analysis.effects.find((effect) => effect.id === "temperature")?.estimate ?? 0;
  const effectB = analysis.effects.find((effect) => effect.id === "pressure")?.estimate ?? 0;
  const effectAB = analysis.effects.find((effect) => effect.id === "temperature:pressure")?.estimate ?? 0;
  const aLow = conditionMean(experiment, "temperature", -1, "strength");
  const aHigh = conditionMean(experiment, "temperature", 1, "strength");
  const bLow = conditionMean(experiment, "pressure", -1, "strength");
  const bHigh = conditionMean(experiment, "pressure", 1, "strength");
  const interactionLines = [
    { label: "圧力 低", values: [cellMean(experiment, { temperature: -1, pressure: -1 }, "strength"), cellMean(experiment, { temperature: 1, pressure: -1 }, "strength")] },
    { label: "圧力 高", values: [cellMean(experiment, { temperature: -1, pressure: 1 }, "strength"), cellMean(experiment, { temperature: 1, pressure: 1 }, "strength")] },
  ];
  const linesCross = Math.sign(interactionLines[0].values[1] - interactionLines[0].values[0]) !== Math.sign(interactionLines[1].values[1] - interactionLines[1].values[0]);

  function updateResponse(index: number, value: number) { setResponses((current) => current.map((item, itemIndex) => itemIndex === index ? value : item)); }
  function applyPreset(preset: DoePreset) { setResponses([...preset.values]); trackEvent("doe_preset_selected", { preset: preset.id }); }
  function reset() { setResponses(initialResponses); trackEvent("doe_reset"); }

  return <section className="doe-workspace" aria-label="2因子2水準の実験計画法学習ツール">
    <div className="doe-controls">
      <header><div><p className="section-label">2 FACTORS / 2 LEVELS</p><h2>4つの実験結果を動かす</h2></div><button onClick={reset} type="button">初期値に戻す</button></header>
      <div className="doe-presets" aria-label="学習プリセット">{doePresets.map((preset) => <button key={preset.id} onClick={() => applyPreset(preset)} type="button">{preset.label}</button>)}</div>
      <div className="doe-run-table" role="table" aria-label="実験条件と応答">
        <div className="doe-run-row doe-run-row--header" role="row"><span>実験</span><span>温度</span><span>圧力</span><span>強度 MPa</span></div>
        {experiment.runs.map((run, index) => <label className="doe-run-row" key={run.id} role="row"><span>{run.standardOrder}</span><span>{run.levels.temperature === -1 ? "低 160℃" : "高 200℃"}</span><span>{run.levels.pressure === -1 ? "低 80kPa" : "高 120kPa"}</span><span className="doe-response-control"><input aria-label={`実験${run.standardOrder}の強度`} min="50" max="110" step="1" type="range" value={responses[index]} onChange={(event) => updateResponse(index, Number(event.target.value))} /><input aria-label={`実験${run.standardOrder}の強度数値`} min="0" step="0.1" type="number" value={responses[index]} onChange={(event) => updateResponse(index, Number(event.target.value))} /></span></label>)}
      </div>
      <p className="doe-control-hint">4つの応答値を変えると、主効果と交互作用が即時に更新されます。</p>
    </div>

    <div className="doe-results" aria-live="polite">
      <header><div><p className="section-label">LIVE ANALYSIS</p><h2>主効果と交互作用</h2></div><dl><div><dt>全平均</dt><dd>{format(analysis.grandMean)}</dd></div><div><dt>温度 A</dt><dd>{effectA >= 0 ? "+" : ""}{format(effectA)}</dd></div><div><dt>圧力 B</dt><dd>{effectB >= 0 ? "+" : ""}{format(effectB)}</dd></div><div><dt>交互作用 AB</dt><dd>{effectAB >= 0 ? "+" : ""}{format(effectAB)}</dd></div></dl></header>
      <p className="doe-explanation">{explanation(effectAB, analysis.responseRange, linesCross)}</p>
      <div className="doe-plots"><EffectPlot title="主効果プロット" series={[{ label: "温度", values: [aLow, aHigh] }, { label: "圧力", values: [bLow, bHigh] }]} /><EffectPlot interaction title="交互作用プロット" series={interactionLines} /></div>
      <aside className="doe-warning"><strong>反復なしの学習用モデル</strong><p>{analysis.warnings[0]} 実務では実験順のランダム化、反復、残差の確認も必要です。</p></aside>
    </div>
  </section>;
}

function EffectPlot({ interaction = false, series, title }: { interaction?: boolean; series: { label: string; values: number[] }[]; title: string }) {
  const all = series.flatMap((item) => item.values); const min = Math.min(...all) - 4; const max = Math.max(...all) + 4;
  const plot = { x: 48, y: 28, width: 250, height: 145 }; const y = (value: number) => plot.y + plot.height - ((value - min) / Math.max(max - min, 1)) * plot.height;
  return <figure className="doe-plot"><strong>{title}</strong><svg viewBox="0 0 340 215" role="img" aria-label={title}><rect x={plot.x} y={plot.y} width={plot.width} height={plot.height} rx="5" />{[0, .25, .5, .75, 1].map((tick) => <line className="doe-grid-line" key={tick} x1={plot.x} x2={plot.x + plot.width} y1={plot.y + tick * plot.height} y2={plot.y + tick * plot.height} />)}{series.map((item, index) => { const x1 = interaction ? plot.x + 35 : plot.x + 25 + index * 125; const x2 = interaction ? plot.x + plot.width - 35 : x1 + 75; return <g className={`doe-series doe-series--${index + 1}`} key={item.label}><path d={`M${x1},${y(item.values[0])} L${x2},${y(item.values[1])}`} /><circle cx={x1} cy={y(item.values[0])} r="4" /><circle cx={x2} cy={y(item.values[1])} r="4" /><text x={(x1 + x2) / 2} y="197" textAnchor="middle">{interaction ? item.label : item.label}</text></g>; })}<text x={plot.x} y="18">{max.toFixed(0)}</text><text x={plot.x} y="190">{min.toFixed(0)}</text></svg><figcaption>{interaction ? "線の非平行や交差に注目します。" : "傾きが主効果の方向と大きさです。"}</figcaption></figure>;
}
