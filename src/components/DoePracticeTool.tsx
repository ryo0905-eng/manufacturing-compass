"use client";

import { useMemo, useState } from "react";
import { analyzeExperiment, cellMean } from "@/lib/doe/effects";
import type { DoeExperiment, DoeRun } from "@/lib/doe/types";
import { trackEvent } from "@/lib/analytics";

const cells = [
  { temperature: -1, pressure: -1, mean: 72 },
  { temperature: 1, pressure: -1, mean: 81 },
  { temperature: -1, pressure: 1, mean: 76 },
  { temperature: 1, pressure: 1, mean: 94 },
];
const errorPattern = [-1.05, .2, .85, -.45, 1.15, -.7, .55, -1.2, .65, 1.05, -.25, -.8];
const randomizedOrder = [7, 0, 10, 5, 2, 9, 4, 11, 1, 6, 8, 3];

function buildExperiment(errorSize: number, driftSize: number, randomized: boolean): DoeExperiment {
  const planned = cells.flatMap((cell, cellIndex) => Array.from({ length: 3 }, (_, replicate) => ({ cell, cellIndex, replicate, standardIndex: cellIndex * 3 + replicate })));
  const order = randomized ? randomizedOrder : planned.map((_, index) => index);
  const runs: DoeRun[] = order.map((plannedIndex, runIndex) => {
    const item = planned[plannedIndex];
    const centeredPosition = runIndex / 11 - .5;
    const observed = item.cell.mean + errorPattern[plannedIndex] * errorSize + centeredPosition * driftSize;
    return { id: `practice-${plannedIndex}`, standardOrder: item.standardIndex + 1, runOrder: runIndex + 1, levels: { temperature: item.cell.temperature, pressure: item.cell.pressure }, responses: { strength: observed } };
  });
  return { factors: [{ id: "temperature", name: "温度", unit: "℃", levels: [{ code: -1, label: "低", value: 160 }, { code: 1, label: "高", value: 200 }] }, { id: "pressure", name: "圧力", unit: "kPa", levels: [{ code: -1, label: "低", value: 80 }, { code: 1, label: "高", value: 120 }] }], responses: [{ id: "strength", name: "強度", unit: "MPa" }], runs };
}

export function DoePracticeTool() {
  const [errorSize, setErrorSize] = useState(2);
  const [driftSize, setDriftSize] = useState(0);
  const [randomized, setRandomized] = useState(false);
  const experiment = useMemo(() => buildExperiment(errorSize, driftSize, randomized), [errorSize, driftSize, randomized]);
  const analysis = useMemo(() => analyzeExperiment(experiment, "strength"), [experiment]);
  const effects = Object.fromEntries(analysis.effects.map((effect) => [effect.id, effect.estimate]));
  const residuals = experiment.runs.map((run) => { const fitted = cellMean(experiment, run.levels, "strength"); return { order: run.runOrder, value: (run.responses.strength ?? 0) - fitted, response: run.responses.strength ?? 0, levels: run.levels }; });
  const sse = residuals.reduce((sum, residual) => sum + residual.value ** 2, 0);
  const pureError = Math.sqrt(sse / Math.max(experiment.runs.length - 4, 1));
  const maxEffect = Math.max(...analysis.effects.map((effect) => effect.absoluteEstimate));
  const residualTrend = residuals[residuals.length - 1].value - residuals[0].value;
  const guide = driftSize < 4
    ? { step: "1", title: "時間による変化を上げてみる", body: "スライダーを4以上へ動かし、標準順の結果がどう変わるか見てください。" }
    : !randomized
      ? { step: "2", title: "次に、実験順をランダム化する", body: "時間変化を残したまま順番だけを変え、因子効果と残差を比べてください。" }
      : { step: "✓", title: "時間変化は消えず、条件への偏り方が変わった", body: "ランダム化は変化を消すのではなく、特定の条件だけへ重なることを避ける操作です。" };
  const message = driftSize >= 4 && !randomized ? "標準順では、後半ほど大きくなる時間変化が特定の条件と重なっています。因子効果と時間ドリフトを混同する可能性があります。" : driftSize >= 4 && randomized ? "実験順を分散したことで、時間ドリフトが特定の条件へ偏りにくくなりました。残差には実験順に沿った傾向が残るため、原因の確認は必要です。" : errorSize >= 5 ? "同じ条件内のばらつきが大きく、条件平均の差だけでは効果が明確か判断しにくい状態です。反復によって誤差の大きさを確認できます。" : "条件内のばらつきは比較的小さく、観測された効果との差を確認しやすい状態です。";

  function changeOrder(next: boolean) { setRandomized(next); trackEvent("doe_run_order_changed", { order: next ? "randomized" : "standard" }); }
  return <section className="doe-practice-workspace">
    <div className="doe-practice-controls"><header><div><p className="section-label">12 RUNS / 3 REPLICATES</p><h2>誤差と実験順を動かす</h2></div></header>
      <label className="doe-practice-slider"><span><b>実験誤差</b><output>{errorSize.toFixed(1)}</output></span><input min="0" max="8" step=".5" type="range" value={errorSize} onChange={(event) => setErrorSize(Number(event.target.value))} /></label>
      <label className="doe-practice-slider doe-time-change"><span><b>時間による変化 <small>装置の暖機・工具摩耗など</small></b><output>{driftSize.toFixed(1)}</output></span><input min="0" max="16" step="1" type="range" value={driftSize} onChange={(event) => setDriftSize(Number(event.target.value))} /><span className="doe-time-change-scale"><i>実験1 {driftSize === 0 ? "±0" : `−${(driftSize / 2).toFixed(1)}`}</i><em aria-hidden="true">時間 →</em><i>実験12 {driftSize === 0 ? "±0" : `＋${(driftSize / 2).toFixed(1)}`}</i></span></label>
      <div className="doe-practice-guide" data-complete={randomized && driftSize >= 4 ? "true" : "false"}><span>{guide.step}</span><div><strong>{guide.title}</strong><p>{guide.body}</p></div></div>
      <fieldset className={`doe-order-toggle${driftSize >= 4 && !randomized ? " is-next" : ""}`}><legend>実施順</legend><div><button aria-pressed={!randomized} onClick={() => changeOrder(false)} type="button">標準順</button><button aria-pressed={randomized} onClick={() => changeOrder(true)} type="button">ランダム化</button></div></fieldset>
      <div className="doe-run-sequence"><strong>実験データ <small>実施順に、反復と時間による変化を確認</small></strong><div className="doe-run-table-scroll"><table><thead><tr><th>実施順</th><th>条件</th><th>反復</th><th>温度</th><th>圧力</th><th>時間変化</th><th>強度 MPa</th></tr></thead><tbody>{experiment.runs.map((run) => { const timeChange = ((run.runOrder - 1) / 11 - .5) * driftSize; const condition = Math.floor((run.standardOrder - 1) / 3) + 1; const replicate = ((run.standardOrder - 1) % 3) + 1; return <tr key={run.id}><td>{run.runOrder}</td><td><i className={`doe-condition-mark doe-condition-mark--${condition}`} />{condition}</td><td>{replicate}</td><td>{run.levels.temperature === -1 ? "低 160℃" : "高 200℃"}</td><td>{run.levels.pressure === -1 ? "低 80kPa" : "高 120kPa"}</td><td className="doe-time-cell">{timeChange === 0 ? "±0.0" : `${timeChange > 0 ? "+" : ""}${timeChange.toFixed(1)}`}</td><td className="doe-response-cell">{run.responses.strength?.toFixed(1)}</td></tr>; })}</tbody></table></div></div>
    </div>
    <div className="doe-practice-results"><header><div><p className="section-label">EFFECTS VS ERROR</p><h2>効果をどこまで信頼できるか</h2></div><dl><div><dt>温度 A</dt><dd>{effects.temperature.toFixed(2)}</dd></div><div><dt>圧力 B</dt><dd>{effects.pressure.toFixed(2)}</dd></div><div><dt>交互作用</dt><dd>{effects["temperature:pressure"].toFixed(2)}</dd></div><div><dt>条件内σ</dt><dd>{pureError.toFixed(2)}</dd></div></dl></header>
      <p className="doe-practice-message"><strong>{driftSize >= 4 ? "時間による変化が結果へ加わっています。" : "時間による変化はほとんどありません。"}</strong>{message}</p>
      <div className="doe-practice-plots"><ReplicatePlot experiment={experiment} /><EffectErrorPlot effects={analysis.effects.map((effect) => ({ label: effect.id === "temperature" ? "温度" : effect.id === "pressure" ? "圧力" : "AB", value: effect.absoluteEstimate }))} error={pureError} max={Math.max(maxEffect, pureError, 1)} /><ResidualOrderPlot residuals={residuals} trend={residualTrend} /></div>
      <aside className="doe-practice-note"><strong>ランダム化の役割</strong><p>未知の時間変化を消す操作ではありません。特定の因子水準へ偏らせにくくし、残差や実験記録から変化を見つけやすくします。</p></aside>
    </div>
  </section>;
}

function ReplicatePlot({ experiment }: { experiment: DoeExperiment }) { const groups = cells.map((cell) => experiment.runs.filter((run) => run.levels.temperature === cell.temperature && run.levels.pressure === cell.pressure).map((run) => run.responses.strength ?? 0)); const all = groups.flat(); const min = Math.min(...all) - 3; const max = Math.max(...all) + 3; const y = (value: number) => 170 - ((value - min) / Math.max(max - min, 1)) * 130; return <figure className="doe-practice-plot doe-replicate-plot"><strong>反復値と条件平均</strong><svg viewBox="0 0 360 210" role="img" aria-label="4条件の反復値"><rect x="42" y="28" width="290" height="145" rx="5" />{groups.map((values, index) => { const x = 78 + index * 70; const mean = values.reduce((sum, value) => sum + value, 0) / values.length; return <g key={index}>{values.map((value, point) => <circle key={point} cx={x + (point - 1) * 7} cy={y(value)} r="4" />)}<line x1={x - 16} x2={x + 16} y1={y(mean)} y2={y(mean)} /><text x={x} y="195" textAnchor="middle">{["低・低", "高・低", "低・高", "高・高"][index]}</text></g>; })}</svg><figcaption>点は反復値、横線は条件平均です。</figcaption></figure>; }
function EffectErrorPlot({ effects, error, max }: { effects: { label: string; value: number }[]; error: number; max: number }) { const items = [...effects, { label: "誤差σ", value: error }]; return <figure className="doe-practice-plot doe-effect-error-plot"><strong>効果と条件内ばらつき</strong><div>{items.map((item) => <p key={item.label}><span>{item.label}</span><i style={{ width: `${(item.value / max) * 100}%` }} /><b>{item.value.toFixed(2)}</b></p>)}</div><figcaption>効果量と誤差は同じ意味の指標ではなく、大きさを考える入口として並べています。</figcaption></figure>; }
function ResidualOrderPlot({ residuals, trend }: { residuals: { order: number; value: number }[]; trend: number }) { const bound = Math.max(...residuals.map((item) => Math.abs(item.value)), 1); const y = (value: number) => 101 - (value / bound) * 62; return <figure className="doe-practice-plot doe-residual-plot"><strong>実験順対残差</strong><svg viewBox="0 0 360 210" role="img" aria-label="実験順に対する残差"><rect x="42" y="28" width="290" height="145" rx="5" /><line className="doe-residual-zero" x1="42" x2="332" y1="101" y2="101" />{residuals.map((item) => <circle key={item.order} cx={52 + ((item.order - 1) / 11) * 270} cy={y(item.value)} r="4" />)}<text x="42" y="194">実験1</text><text x="332" y="194" textAnchor="end">実験12</text></svg><figcaption>{Math.abs(trend) > bound * .7 ? "実験順に沿った残差の変化を確認してください。" : "残差が0付近へランダムに散るか確認します。"}</figcaption></figure>; }
