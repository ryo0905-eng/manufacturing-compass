"use client";

import { useMemo, useState } from "react";
import { analyzeExperiment, cellMean } from "@/lib/doe/effects";
import { calculateAnova, type AnovaTermId } from "@/lib/doe/anova";
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
  const [selectedAnovaTerm, setSelectedAnovaTerm] = useState<AnovaTermId>("temperature");
  const experiment = useMemo(() => buildExperiment(errorSize, driftSize, randomized), [errorSize, driftSize, randomized]);
  const analysis = useMemo(() => analyzeExperiment(experiment, "strength"), [experiment]);
  const anova = useMemo(() => calculateAnova(experiment, "strength"), [experiment]);
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
  const selectedAnova = anova.rows.find((row) => row.id === selectedAnovaTerm) ?? anova.rows[0];

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
      <AnovaLesson anova={anova} selected={selectedAnova} onSelect={setSelectedAnovaTerm} />
    </div>
  </section>;
}

function AnovaLesson({ anova, selected, onSelect }: { anova: ReturnType<typeof calculateAnova>; selected: ReturnType<typeof calculateAnova>["rows"][number]; onSelect: (id: AnovaTermId) => void }) {
  const [metric, setMetric] = useState<"ss" | "df" | "ms" | "f" | "p">("p");
  const isError = selected.id === "error";
  const ratio = selected.f ?? 1;
  const verdict = isError ? "このばらつきが、効果を判断する物差しになります。" : selected.p !== null && selected.p < .05 ? "この例では、誤差だけでは説明しにくい大きさです。" : "この例では、誤差に対して十分大きいとは言い切れません。";
  const pLabel = selected.p === null ? "比較の基準" : selected.p < .001 ? "p < .001" : `p = ${selected.p.toFixed(3)}`;
  return <section className="doe-anova-lesson" aria-label="分散分析を触って理解する"><header><div><p className="section-label">STEP 3 / ANOVA</p><h3>効果を、実験誤差と比べる</h3></div><p>行と用語を選ぶと、ANOVAが何を計算しているか確認できます。</p></header><div className="doe-anova-layout"><div className="doe-anova-table-scroll"><table><thead><tr><th>変動要因</th><th><span>平方和</span><small>SS: Sum of Squares</small></th><th><span>自由度</span><small>df: degrees of freedom</small></th><th><span>平均平方</span><small>MS: Mean Square</small></th><th>F値</th><th className="is-primary">p値</th></tr></thead><tbody>{anova.rows.map((row) => <tr aria-selected={row.id === selected.id} key={row.id} onClick={() => onSelect(row.id)}><th scope="row"><button type="button" onClick={() => onSelect(row.id)}>{row.label}</button></th><td>{row.ss.toFixed(2)}</td><td>{row.df}</td><td>{row.ms.toFixed(2)}</td><td>{row.f === null ? "—" : Number.isFinite(row.f) ? row.f.toFixed(2) : "∞"}</td><td className="is-primary">{row.p === null ? "—" : row.p < .001 ? "< .001" : row.p.toFixed(3)}</td></tr>)}</tbody><tfoot><tr><th>全体</th><td>{anova.total.ss.toFixed(2)}</td><td>{anova.total.df}</td><td colSpan={3}>—</td></tr></tfoot></table></div><div className="doe-anova-inspector" aria-live="polite"><span>{selected.label}</span><strong>{pLabel}</strong><div className="doe-anova-ratio"><i style={{ width: `${isError ? 12 : Math.min(100, Math.max(3, ratio * 8))}%` }} /></div><p>{isError ? `同じ条件を繰り返した差から、比較の基準となる誤差MS ${anova.errorMs.toFixed(2)} を求めます。` : `F値は ${Number.isFinite(ratio) ? ratio.toFixed(2) : "∞"}。効果のMSが誤差MSの何倍かを表し、このF値からp値を求めます。`}</p><b>{verdict} p値だけで工程上の重要性までは決まりません。</b></div></div><div className="doe-anova-concepts"><nav aria-label="ANOVA用語の解説">{(["ss", "df", "ms", "f", "p"] as const).map((item) => <button aria-pressed={metric === item} key={item} onClick={() => setMetric(item)} type="button">{item === "df" ? "自由度（df）" : item === "ms" ? "平均平方（MS）" : item === "ss" ? "平方和（SS）" : `${item.toUpperCase()}値`}</button>)}</nav><AnovaConcept metric={metric} selected={selected} errorMs={anova.errorMs} /></div></section>;
}

function AnovaConcept({ metric, selected, errorMs }: { metric: "ss" | "df" | "ms" | "f" | "p"; selected: ReturnType<typeof calculateAnova>["rows"][number]; errorMs: number }) {
  const content = {
    ss: { title: "平方和は、平均との差を全部集めた変動量", body: `${selected.label}が受け持つ変動は ${selected.ss.toFixed(2)}。差を二乗して足すので、プラスとマイナスが打ち消し合いません。`, formula: `SS = ${selected.ss.toFixed(2)}` },
    df: { title: "自由度は、自由に残っている情報の数", body: selected.id === "error" ? "12個の測定値から4条件の平均を決めると、条件内で自由にばらつける情報は 12 − 4 = 8 個残ります。" : "2水準の差を表すには1つの数があれば足ります。一方の差が決まると、全平均との関係でもう一方も決まるため自由度は1です。", formula: selected.id === "error" ? "df = 12 − 4 = 8" : "df = 2水準 − 1 = 1" },
    ms: { title: "平均平方は、情報1個あたりの変動量", body: `平方和を自由度で割り、情報量の異なる要因を同じ尺度へそろえます。${selected.label}では ${selected.ss.toFixed(2)} ÷ ${selected.df} です。`, formula: `MS = SS ÷ df = ${selected.ms.toFixed(2)}` },
    f: { title: "F値は、効果の変動と誤差の変動の比", body: selected.f === null ? "誤差MSは分母として、各効果が偶然のばらつきよりどれほど大きいかを測ります。" : `${selected.label}のMSを誤差MS ${errorMs.toFixed(2)} で割ります。1付近なら誤差と同程度、大きいほど誤差だけでは説明しにくくなります。`, formula: selected.f === null ? `誤差MS = ${errorMs.toFixed(2)}` : `F = ${selected.ms.toFixed(2)} ÷ ${errorMs.toFixed(2)} = ${Number.isFinite(selected.f) ? selected.f.toFixed(2) : "∞"}` },
    p: { title: "p値は、効果がない世界でこの差が出る確率", body: selected.p === null ? "誤差行にはp値はありません。この誤差を基準に、各効果のp値を求めます。" : `本当は${selected.label}の効果がないと仮定したとき、今回以上のF値が偶然に出る確率です。小さいほど「誤差だけでは説明しにくい」と考えます。`, formula: selected.p === null ? "効果の行を選んで確認" : selected.p < .001 ? "p < .001" : `p = ${selected.p.toFixed(3)}` },
  }[metric];
  return <div aria-live="polite"><span>{metric === "df" || metric === "ss" ? "まずここ" : "選択中の用語"}</span><strong>{content.title}</strong><p>{content.body}</p>{metric === "ss" && <div className="doe-ss-example" aria-label="平均10に対する平方和の計算例"><span><small>測定値</small><b>8</b><b>10</b><b>12</b></span><i>平均との差</i><span><small>差</small><b>−2</b><b>0</b><b>＋2</b></span><i>二乗</i><span><small>差²</small><b>4</b><b>0</b><b>4</b></span><em>合計 8</em></div>}<code>{content.formula}</code></div>;
}

function ReplicatePlot({ experiment }: { experiment: DoeExperiment }) { const groups = cells.map((cell) => experiment.runs.filter((run) => run.levels.temperature === cell.temperature && run.levels.pressure === cell.pressure).map((run) => run.responses.strength ?? 0)); const all = groups.flat(); const min = Math.min(...all) - 3; const max = Math.max(...all) + 3; const y = (value: number) => 170 - ((value - min) / Math.max(max - min, 1)) * 130; return <figure className="doe-practice-plot doe-replicate-plot"><strong>反復値と条件平均</strong><svg viewBox="0 0 360 210" role="img" aria-label="4条件の反復値"><rect x="42" y="28" width="290" height="145" rx="5" />{groups.map((values, index) => { const x = 78 + index * 70; const mean = values.reduce((sum, value) => sum + value, 0) / values.length; return <g key={index}>{values.map((value, point) => <circle key={point} cx={x + (point - 1) * 7} cy={y(value)} r="4" />)}<line x1={x - 16} x2={x + 16} y1={y(mean)} y2={y(mean)} /><text x={x} y="195" textAnchor="middle">{["低・低", "高・低", "低・高", "高・高"][index]}</text></g>; })}</svg><figcaption>点は反復値、横線は条件平均です。</figcaption></figure>; }
function EffectErrorPlot({ effects, error, max }: { effects: { label: string; value: number }[]; error: number; max: number }) { const items = [...effects, { label: "誤差σ", value: error }]; return <figure className="doe-practice-plot doe-effect-error-plot"><strong>効果と条件内ばらつき</strong><div>{items.map((item) => <p key={item.label}><span>{item.label}</span><i style={{ width: `${(item.value / max) * 100}%` }} /><b>{item.value.toFixed(2)}</b></p>)}</div><figcaption>効果量と誤差は同じ意味の指標ではなく、大きさを考える入口として並べています。</figcaption></figure>; }
function ResidualOrderPlot({ residuals, trend }: { residuals: { order: number; value: number }[]; trend: number }) { const bound = Math.max(...residuals.map((item) => Math.abs(item.value)), 1); const y = (value: number) => 101 - (value / bound) * 62; return <figure className="doe-practice-plot doe-residual-plot"><strong>実験順対残差</strong><svg viewBox="0 0 360 210" role="img" aria-label="実験順に対する残差"><rect x="42" y="28" width="290" height="145" rx="5" /><line className="doe-residual-zero" x1="42" x2="332" y1="101" y2="101" />{residuals.map((item) => <circle key={item.order} cx={52 + ((item.order - 1) / 11) * 270} cy={y(item.value)} r="4" />)}<text x="42" y="194">実験1</text><text x="332" y="194" textAnchor="end">実験12</text></svg><figcaption>{Math.abs(trend) > bound * .7 ? "実験順に沿った残差の変化を確認してください。" : "残差が0付近へランダムに散るか確認します。"}</figcaption></figure>; }
