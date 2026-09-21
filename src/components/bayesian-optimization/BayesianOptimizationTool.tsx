"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { bayesianLinks, bayesianText as text, methodText, stageText } from "@/data/bayesian-optimization";
import { trackEvent } from "@/lib/analytics";
import { createSession, runExperiment } from "@/lib/bayesian-optimization/session";
import { doePlan, reveal } from "@/lib/bayesian-optimization/simulator";
import { conditionKey, stageFor, VERSION, type Condition, type SelectionMethod } from "@/lib/bayesian-optimization/types";
import { ExperimentMap, ImprovementChart, type MapView } from "./BayesianCharts";
import styles from "./bayesian.module.css";

const defaultPoint = { temperature: 400, pressure: 60 };
const number = (value: number) => value.toFixed(2);

export function BayesianOptimizationTool() {
  const [session, setSession] = useState(createSession);
  const current = useRef(session);
  const [selected, setSelected] = useState<Condition>(defaultPoint);
  const [temperature, setTemperature] = useState("400");
  const [pressure, setPressure] = useState("60");
  const [method, setMethod] = useState<SelectionMethod>("manual");
  const [view, setView] = useState<MapView>("prediction");
  const [truthGraph, setTruthGraph] = useState(true);
  const [message, setMessage] = useState("");
  const observations = session.observations;
  const stage = stageFor(observations.length);
  const review = stage === "review";
  const analysis = session.analysis;
  const answer = useMemo(() => review ? reveal(observations) : null, [review, observations]);
  const planned = useMemo(() => stage === "doe" ? doePlan(session.seed) : [], [stage, session.seed]);
  const shownPoint = stage === "confirm" && analysis ? analysis.confirmation : selected;
  const prediction = analysis?.surface.find(p => conditionKey(p) === conditionKey(shownPoint));
  const truthAtPoint = answer?.surface.find(p => conditionKey(p) === conditionKey(shownPoint));
  const lastAtPoint = observations.filter(o => conditionKey(o) === conditionKey(shownPoint)).at(-1);
  const invalid = temperature.trim() === "" || pressure.trim() === "" || Number(temperature) !== selected.temperature || Number(pressure) !== selected.pressure;
  const canChoose = stage !== "doe" && stage !== "confirm";
  const confirmation = review ? observations[11] : null;

  function choose(point: Condition, source: SelectionMethod = "manual") {
    setSelected(point); setTemperature(String(point.temperature)); setPressure(String(point.pressure)); setMethod(source);
  }
  function edit(axis: "temperature" | "pressure", value: string) {
    if (axis === "temperature") setTemperature(value); else setPressure(value);
    setMethod("manual");
    const n = Number(value), min = axis === "temperature" ? 300 : 20, max = axis === "temperature" ? 500 : 100, step = axis === "temperature" ? 5 : 2;
    if (value.trim() && Number.isFinite(n) && n >= min && n <= max && (n - min) % step === 0) setSelected(previous => ({ ...previous, [axis]: n }));
  }
  function execute() {
    // Reject a stale event from the same rendered frame; each command commits atomically.
    if (current.current !== session || session.error || review || (canChoose && invalid)) return;
    const selectedMethod = stage === "doe" ? "doe" : stage === "confirm" ? "confirmation" : method;
    const next = runExperiment(session, shownPoint, selectedMethod);
    current.current = next; setSession(next); setMethod("manual");
    const last = next.observations.at(-1)!;
    choose({ temperature: last.temperature, pressure: last.pressure });
    let summary: string = text.close;
    if (stage === "first") summary = text.firstResult;
    else if (stage === "doe") summary = text.doeResult;
    else if (stage === "confirm") { summary = text.completed; setView("truth"); }
    else if (prediction && last.value < prediction.mean - 0.1) summary = text.better;
    else if (prediction && last.value > prediction.mean + 0.1) summary = text.worse;
    setMessage(`${last.run}回目：${number(last.value)}%。${next.error ? text.error : summary}`);
    const name = stage === "first" ? "bo_started" : stage === "doe" ? "bo_doe_completed" : stage === "confirm" ? "bo_completed" : "bo_experiment";
    trackEvent(name, { version: VERSION, stage, method: selectedMethod });
  }
  function reset() {
    const next = createSession(session.seed); current.current = next; setSession(next);
    choose(defaultPoint); setView("prediction"); setTruthGraph(true); setMessage("最初の実験に戻りました。");
    trackEvent("bo_retried", { version: VERSION });
  }

  return <section className={styles.experience} aria-label="ベイズ最適化の実験">
    <header className={styles.stageHeader}><div><p className={styles.eyebrow}>約5分・架空の成膜工程</p><h2>{stageText[stage].title}</h2></div><span className={styles.counter}>実験 <strong>{observations.length}</strong> / 12</span></header>
    <p className={styles.stageHint}>{stageText[stage].hint}</p>
    <div className={styles.workspace}>
      <div className={styles.mapPanel}>
        <div className={styles.switches} role="group" aria-label="マップの表示">
          <button type="button" disabled={!analysis} aria-pressed={view === "prediction"} onClick={() => setView("prediction")}>{text.prediction}</button>
          <button type="button" disabled={!analysis} aria-pressed={view === "uncertainty"} onClick={() => setView("uncertainty")}>{text.uncertainty}</button>
          {review && <button type="button" aria-pressed={view === "truth"} onClick={() => setView("truth")}>{text.truth}</button>}
        </div>
        <ExperimentMap surface={analysis?.surface} truth={answer?.surface} observations={observations} selected={shownPoint}
          recommended={stage === "explore" ? analysis?.recommendation : undefined} planned={planned} view={view}
          disabled={!canChoose} onSelect={point => choose(point)} />
        <p className={styles.small}>{view === "uncertainty" ? text.uncertaintyHint : review && view === "truth" ? "破線は追加実験7〜11回目の順番です。DOEは一括計画の点群として表示しています。" : text.selectHint}</p>
      </div>
      <div className={styles.controls}>
        <h3>{text.quality}</h3>
        <fieldset disabled={!canChoose}><legend className={styles.srOnly}>実験条件</legend>
          {(["temperature", "pressure"] as const).map(axis => {
            const isTemperature = axis === "temperature";
            const label = isTemperature ? "温度" : "圧力", unit = isTemperature ? "℃" : "Pa";
            const min = isTemperature ? 300 : 20, max = isTemperature ? 500 : 100, step = isTemperature ? 5 : 2;
            return <div className={styles.condition} key={axis}>
              <label htmlFor={`bo-${axis}`}>{label}<span>{unit}</span></label>
              <input id={`bo-${axis}`} type="number" min={min} max={max} step={step} value={!canChoose ? shownPoint[axis] : isTemperature ? temperature : pressure}
                onChange={event => edit(axis, event.target.value)} aria-describedby={invalid ? "bo-input-error" : undefined} aria-invalid={invalid || undefined} />
              <input aria-label={`${label}をスライダーで選ぶ（${unit}）`} type="range" min={min} max={max} step={step} value={shownPoint[axis]} onChange={event => edit(axis, event.target.value)} />
            </div>;
          })}
        </fieldset>
        {invalid && canChoose && <p id="bo-input-error" className={styles.error}>{text.errors}</p>}
        <div className={styles.readout}>
          {view === "truth" && truthAtPoint ? <><span>選択条件の真値</span><strong>{number(truthAtPoint.value)}<small>%</small></strong></>
            : prediction ? <><span>選択条件の予測</span><strong>{number(prediction.mean)}<small>%</small></strong><span>不確かさ（標準偏差） {number(prediction.sd)} ポイント</span></>
            : <><span>{lastAtPoint ? "選択条件の観測値" : "条件を選んで実験しましょう"}</span>{lastAtPoint && <strong>{number(lastAtPoint.value)}<small>%</small></strong>}</>}
          {prediction && lastAtPoint && <span>直近の観測：{number(lastAtPoint.value)}%（{lastAtPoint.run}回目）</span>}
        </div>
        {stage === "explore" && analysis && <div className={styles.recommendation}><p>◇ {analysis.recommendation.temperature}℃・{analysis.recommendation.pressure}Pa</p><button type="button" onClick={() => choose(analysis.recommendation, "bo")}>{text.selectRecommendation}</button><p className={styles.small}>{text.recommendationHint}</p></div>}
        {!review && <button className={styles.primary} type="button" disabled={session.error || (canChoose && invalid)} onClick={event => { if (event.detail <= 1) execute(); }}>{stage === "doe" ? text.doeButton : stage === "confirm" ? text.confirmButton : text.experiment}</button>}
        {stage === "doe" && <p className={styles.small}>四隅＋中央をランダムな順番で実験。最初の自由実験も学習に使います。</p>}
        {stage === "confirm" && <p className={styles.small}>{text.repeatNote}</p>}
        <p role="status" aria-live="polite" aria-atomic="true" className={styles.message}>{message}</p>
        {session.error && <p role="alert" className={styles.error}>{text.error}</p>}
        {observations.length > 0 && <button className={styles.reset} type="button" onClick={reset}>{text.retry}</button>}
      </div>
    </div>
    <section className={styles.progress}><h3>実験回数と改善の記録</h3>
      {review && <div className={styles.switches} role="group" aria-label="改善グラフの表示"><button type="button" aria-pressed={truthGraph} onClick={() => setTruthGraph(true)}>{text.truthReview}</button><button type="button" aria-pressed={!truthGraph} onClick={() => setTruthGraph(false)}>{text.observedReview}</button></div>}
      <ImprovementChart observations={observations} truth={review && truthGraph ? answer?.values : undefined} best={answer?.best.value} />
    </section>
    {review && confirmation && answer && <section className={styles.review} aria-label="答え合わせ">
      <h3>最後に確かめた条件：{confirmation.temperature}℃・{confirmation.pressure}Pa</h3>
      <dl><div><dt>確認前の予測</dt><dd>{session.confirmationPrediction !== null ? `${number(session.confirmationPrediction)}%` : "計算できませんでした"}</dd></div><div><dt>確認実験の観測</dt><dd>{number(confirmation.value)}%</dd></div><div><dt>ノイズを除いた真値</dt><dd>{number(answer.values[11])}%</dd></div></dl>
      <p>操作可能な41×41点の中での最良値：<strong>{number(answer.best.value)}%</strong>（{answer.best.temperature}℃・{answer.best.pressure}Pa）。連続空間の厳密な最適解ではありません。</p>
      <p>{text.repeatNote} 良い条件が見つかっても、物理的な原因を解明したことにはなりません。</p>
      <nav className={styles.related} aria-label="次の学習">{bayesianLinks.map(link => <Link key={link.id} href={link.href} onClick={() => trackEvent("bo_related_clicked", { version: VERSION, destination: link.id })}><strong>{link.title} →</strong><span>{link.detail}</span></Link>)}</nav>
    </section>}
    <details className={styles.history}><summary>{text.history}（{observations.length}回）</summary>
      <div className={styles.tableScroll}><table><caption>膜厚むらは小さいほど均一です。同じ条件の再測定も1回として数えます。</caption><thead><tr><th scope="col">回</th><th scope="col">温度 ℃</th><th scope="col">圧力 Pa</th><th scope="col">観測 %</th><th scope="col">選び方</th>{review && <th scope="col">真値 %</th>}</tr></thead>
        <tbody>{observations.map((o, i) => <tr key={o.run}><th scope="row">{o.run}</th><td>{o.temperature}</td><td>{o.pressure}</td><td>{number(o.value)}</td><td>{methodText[o.method]}</td>{answer && <td>{number(answer.values[i])}</td>}</tr>)}</tbody></table></div>
    </details>
  </section>;
}
