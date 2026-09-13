"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { analyzeLineBalance, validateLineBalance, type LineStation, type LineTask } from "@/lib/line-balance";
import { trackEvent } from "@/lib/analytics";

type EditableTask = Omit<LineTask, "seconds"> & { seconds: string };
type LineState = { taktTime: string; stations: LineStation[]; tasks: EditableTask[] };

const sample: LineState = {
  taktTime: "50",
  stations: [{ id: "s1", name: "工程1" }, { id: "s2", name: "工程2" }, { id: "s3", name: "工程3" }],
  tasks: [
    { id: "t1", name: "部品セット", seconds: "25", stationId: "s1" },
    { id: "t2", name: "位置決め", seconds: "15", stationId: "s1" },
    { id: "t3", name: "加工", seconds: "50", stationId: "s2" },
    { id: "t4", name: "外観確認", seconds: "15", stationId: "s2" },
    { id: "t5", name: "測定", seconds: "20", stationId: "s3" },
    { id: "t6", name: "排出", seconds: "15", stationId: "s3" },
  ],
};

const clone = (state: LineState): LineState => ({ ...state, stations: state.stations.map((item) => ({ ...item })), tasks: state.tasks.map((item) => ({ ...item })) });
const numericTasks = (tasks: EditableTask[]) => tasks.map((task) => ({ ...task, seconds: Number(task.seconds) }));
const formatSeconds = (value: number) => `${Number.isInteger(value) ? value : value.toFixed(1)}秒`;

export function LineBalanceSimulator() {
  const [state, setState] = useState<LineState>(() => clone(sample));
  const [baseline, setBaseline] = useState<LineState>(() => clone(sample));
  const sequence = useRef(10);
  const interacted = useRef(false);
  useEffect(() => { trackEvent("line_balance_app_view"); }, []);

  const tasks = useMemo(() => numericTasks(state.tasks), [state.tasks]);
  const errors = validateLineBalance(Number(state.taktTime), state.stations, tasks);
  const result = errors.length ? null : analyzeLineBalance(Number(state.taktTime), state.stations, tasks);
  const baselineTasks = numericTasks(baseline.tasks);
  const baselineErrors = validateLineBalance(Number(baseline.taktTime), baseline.stations, baselineTasks);
  const baselineResult = baselineErrors.length ? null : analyzeLineBalance(Number(baseline.taktTime), baseline.stations, baselineTasks);

  function recordFirstInteraction() {
    if (!interacted.current) { interacted.current = true; trackEvent("line_balance_first_interaction"); }
  }
  function update(next: (current: LineState) => LineState) { recordFirstInteraction(); setState(next); }
  function reset() { setState(clone(sample)); setBaseline(clone(sample)); interacted.current = false; trackEvent("line_balance_reset"); }
  function addStation() {
    const id = `s${sequence.current++}`;
    update((current) => ({ ...current, stations: [...current.stations, { id, name: `工程${current.stations.length + 1}` }] }));
  }
  function removeStation(id: string) {
    update((current) => {
      if (current.stations.length === 1) return current;
      const stations = current.stations.filter((station) => station.id !== id);
      return { ...current, stations, tasks: current.tasks.map((task) => task.stationId === id ? { ...task, stationId: stations[0].id } : task) };
    });
  }
  function addTask() {
    const id = `t${sequence.current++}`;
    update((current) => ({ ...current, tasks: [...current.tasks, { id, name: `作業${current.tasks.length + 1}`, seconds: "10", stationId: current.stations[0]?.id ?? "" }] }));
  }

  return <section className="mini-tool-workspace" aria-labelledby="line-tool-title">
    <header className="mini-tool-heading"><div><p className="section-label">LINE BALANCE WORKSPACE</p><h2 id="line-tool-title">作業を移して、工程負荷を比較する</h2></div><div className="mini-tool-actions"><button type="button" onClick={() => { if (!errors.length) { setBaseline(clone(state)); trackEvent("line_balance_baseline_set"); } }}>現在を比較基準にする</button><button type="button" onClick={reset}>サンプルに戻す</button></div></header>
    <div className="mini-tool-grid">
      <div className="mini-tool-controls">
        <label className="mini-number-field"><span>目標タクトタイム <small>秒</small></span><input aria-invalid={!Number(state.taktTime) || Number(state.taktTime) < 0} inputMode="decimal" min="0" step="0.1" type="number" value={state.taktTime} onChange={(event) => update((current) => ({ ...current, taktTime: event.target.value }))} /></label>
        <section className="line-editor" aria-labelledby="station-editor-title"><header><h3 id="station-editor-title">工程</h3><button type="button" onClick={addStation}>＋ 工程を追加</button></header>{state.stations.map((station) => <div className="station-row" key={station.id}><input aria-label={`${station.name}の工程名`} value={station.name} onChange={(event) => update((current) => ({ ...current, stations: current.stations.map((item) => item.id === station.id ? { ...item, name: event.target.value } : item) }))} /><button aria-label={`${station.name}を削除`} disabled={state.stations.length === 1} type="button" onClick={() => removeStation(station.id)}>削除</button></div>)}</section>
        <section className="line-editor" aria-labelledby="task-editor-title"><header><h3 id="task-editor-title">作業</h3><button type="button" onClick={addTask}>＋ 作業を追加</button></header><div className="task-table-labels" aria-hidden="true"><span>作業名</span><span>秒</span><span>所属工程</span><span /></div>{state.tasks.map((task) => <div className="task-row" key={task.id}><input aria-label={`${task.name}の作業名`} value={task.name} onChange={(event) => update((current) => ({ ...current, tasks: current.tasks.map((item) => item.id === task.id ? { ...item, name: event.target.value } : item) }))} /><input aria-label={`${task.name}の所要時間（秒）`} inputMode="decimal" min="0" step="0.1" type="number" value={task.seconds} onChange={(event) => update((current) => ({ ...current, tasks: current.tasks.map((item) => item.id === task.id ? { ...item, seconds: event.target.value } : item) }))} /><select aria-label={`${task.name}の所属工程`} value={task.stationId} onChange={(event) => { const destination = event.target.value; update((current) => ({ ...current, tasks: current.tasks.map((item) => item.id === task.id ? { ...item, stationId: destination } : item) })); trackEvent("line_balance_task_moved", { source_station: task.stationId, destination_station: destination }); }}>{state.stations.map((station) => <option value={station.id} key={station.id}>{station.name || "名称未入力"}</option>)}</select><button aria-label={`${task.name}を削除`} type="button" onClick={() => update((current) => ({ ...current, tasks: current.tasks.filter((item) => item.id !== task.id) }))}>削除</button></div>)}</section>
        {errors.length > 0 && <div className="mini-tool-errors" role="alert"><strong>入力を見直してください</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
      </div>
      <div className="mini-tool-results" aria-live="polite">
        {result ? <><LineStackChart stations={state.stations} tasks={tasks} taktTime={Number(state.taktTime)} totals={result.stationTotals} /><dl className="mini-metrics"><div><dt>総作業時間</dt><dd>{formatSeconds(result.totalWorkSeconds)}</dd></div><div><dt>タクト超過 合計</dt><dd>{formatSeconds(result.totalExcessSeconds)}</dd></div><div><dt>最長工程</dt><dd>{state.stations.find((item) => item.id === result.longestStationId)?.name} {formatSeconds(result.longestStationSeconds)}</dd></div></dl><section className="comparison-panel"><h3>比較基準との差</h3>{baselineResult ? <p>超過合計 <strong>{formatSeconds(baselineResult.totalExcessSeconds)} → {formatSeconds(result.totalExcessSeconds)}</strong> ／ 総作業時間 <strong>{formatSeconds(baselineResult.totalWorkSeconds)} → {formatSeconds(result.totalWorkSeconds)}</strong></p> : <p>比較基準の入力が不正です。現在の状態を新しい比較基準にしてください。</p>}</section></> : <div className="mini-tool-empty">入力を修正すると、グラフと結果が表示されます。</div>}
      </div>
    </div>
  </section>;
}

function LineStackChart({ stations, tasks, taktTime, totals }: { stations: LineStation[]; tasks: LineTask[]; taktTime: number; totals: Record<string, number> }) {
  const max = Math.max(taktTime, ...Object.values(totals), 1) * 1.15;
  const width = Math.max(560, stations.length * 110 + 70); const plotHeight = 230; const baseY = 260; const chartWidth = width - 80; const barWidth = Math.min(64, chartWidth / Math.max(stations.length, 1) * .62);
  const colors = ["#4c72b0", "#dd8452", "#55a868", "#8172b2", "#937860", "#da8bc3"];
  const y = (value: number) => baseY - value / max * plotHeight;
  return <figure className="line-stack-chart"><svg viewBox={`0 0 ${width} 310`} role="img" aria-label={`工程別の積み上げ棒グラフ。タクトタイム${taktTime}秒`}><line className="chart-axis" x1="55" x2={width - 20} y1={baseY} y2={baseY} /><line className="takt-line" x1="55" x2={width - 20} y1={y(taktTime)} y2={y(taktTime)} /><text className="takt-label" x="58" y={y(taktTime) - 6}>タクト {taktTime}秒</text>{stations.map((station, stationIndex) => { const x = 70 + stationIndex * (chartWidth / stations.length); let accumulated = 0; return <g key={station.id}>{tasks.filter((task) => task.stationId === station.id).map((task, taskIndex) => { const height = task.seconds / max * plotHeight; const rectY = baseY - accumulated / max * plotHeight - height; accumulated += task.seconds; return <g key={task.id}><rect fill={colors[taskIndex % colors.length]} height={height} width={barWidth} x={x} y={rectY} /><title>{`${task.name}: ${task.seconds}秒`}</title></g>; })}<text className="bar-total" x={x + barWidth / 2} y={y(totals[station.id]) - 7} textAnchor="middle">{totals[station.id]}</text><text className="bar-label" x={x + barWidth / 2} y="282" textAnchor="middle">{station.name || "名称未入力"}</text></g>; })}</svg><figcaption>色の区切りが各作業、破線が目標タクトタイムです。</figcaption></figure>;
}
