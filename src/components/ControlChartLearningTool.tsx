"use client";

import { useMemo, useState } from "react";
import { analyzeIndividualsChart, scenarioValues, type ControlChartScenario } from "@/lib/control-chart";
import { trackEvent } from "@/lib/analytics";

const scenarios = [
  { id: "stable", label: "正常工程", note: "ランダムなばらつき" },
  { id: "shift", label: "平均シフト", note: "途中から中心が移動" },
  { id: "outlier", label: "単発外れ", note: "1点だけ大きく変化" },
  { id: "trend", label: "傾向", note: "少しずつ上昇" },
  { id: "cycle", label: "周期変動", note: "一定周期で上下" },
] as const;

const nextChecks: Record<ControlChartScenario,string> = {
  stable: "大きな異常パターンは見つかりません。ただし、管理状態は品質保証や規格適合を意味しません。",
  shift: "変更点の時刻と、材料ロット、設備設定、工具交換、作業者、測定器の記録を照合します。",
  outlier: "点を削除する前に、入力ミス、測定器、材料、設備アラーム、再測定結果を確認します。",
  trend: "工具摩耗、設備の暖機、汚れの蓄積、環境変化など、時間とともに進む原因を確認します。",
  cycle: "交代勤務、温度制御、設備サイクル、材料供給など、同じ周期を持つ記録と比較します。",
};

export function ControlChartLearningTool() {
  const [scenario, setScenario] = useState<ControlChartScenario>("stable");
  const [showSpecs, setShowSpecs] = useState(false);
  const values = useMemo(() => scenarioValues(scenario), [scenario]);
  const analysis = useMemo(() => analyzeIndividualsChart(values), [values]);
  const highlighted = analysis.flaggedPoints;
  const min = Math.min(analysis.lcl, ...values, ...(showSpecs ? [95] : [])) - .8;
  const max = Math.max(analysis.ucl, ...values, ...(showSpecs ? [105] : [])) + .8;
  const x = (index: number) => 55 + index / (values.length - 1) * 790;
  const y = (value: number) => 260 - (value - min) / (max - min) * 205;
  function choose(next: ControlChartScenario) { setScenario(next); trackEvent("control_chart_scenario_selected", { scenario: next }); }
  return <section className="control-chart-tool"><header><div><p className="section-label">INDIVIDUALS CONTROL CHART</p><h2>異常の形を、時系列で見つける</h2><p>最初の10点を安定期間として管理限界を計算し、その後の変化を監視します。</p></div><dl><div><dt>中心線</dt><dd>{analysis.center.toFixed(2)}</dd></div><div><dt>UCL</dt><dd>{analysis.ucl.toFixed(2)}</dd></div><div><dt>LCL</dt><dd>{analysis.lcl.toFixed(2)}</dd></div></dl></header><div className="control-scenarios">{scenarios.map((item) => <button aria-pressed={scenario === item.id} key={item.id} onClick={() => choose(item.id)} type="button"><strong>{item.label}</strong><span>{item.note}</span></button>)}</div><figure className="control-chart-figure"><svg viewBox="0 0 900 310" role="img" aria-label={`${scenarios.find((item) => item.id === scenario)?.label}のI管理図`}><rect x="48" y="42" width="805" height="224" rx="6" /><rect className="control-baseline-area" x="48" y="42" width={x(9)-48} height="224" /><text className="control-period-label" x="60" y="61">限界算出期間</text><text className="control-period-label" x={x(10)+8} y="61">監視期間</text>{showSpecs && <><line className="control-spec-line" x1="48" x2="853" y1={y(105)} y2={y(105)} /><line className="control-spec-line" x1="48" x2="853" y1={y(95)} y2={y(95)} /><text className="control-spec-label" x="848" y={y(105)-5} textAnchor="end">USL</text><text className="control-spec-label" x="848" y={y(95)-5} textAnchor="end">LSL</text></>}<line className="control-limit-line" x1="48" x2="853" y1={y(analysis.ucl)} y2={y(analysis.ucl)} /><line className="control-center-line" x1="48" x2="853" y1={y(analysis.center)} y2={y(analysis.center)} /><line className="control-limit-line" x1="48" x2="853" y1={y(analysis.lcl)} y2={y(analysis.lcl)} /><text x="848" y={y(analysis.ucl)-5} textAnchor="end">UCL</text><text x="848" y={y(analysis.center)-5} textAnchor="end">CL</text><text x="848" y={y(analysis.lcl)-5} textAnchor="end">LCL</text><path className="control-data-line" d={values.map((value,index) => `${index ? "L" : "M"}${x(index)},${y(value)}`).join(" ")} />{values.map((value,index) => <g key={index}><circle className={highlighted.has(index) ? "is-alert" : ""} cx={x(index)} cy={y(value)} r={highlighted.has(index) ? 6 : 4} /><text className="control-point-number" x={x(index)} y="287" textAnchor="middle">{index+1}</text></g>)}</svg><figcaption>青線は測定値、破線は工程データから求めた管理限界です。赤い点は選択中のルールで検出された点です。</figcaption></figure><div className="control-interpretation"><section><p className="section-label">RULE CHECK</p><h3>{analysis.rules.length ? `${analysis.rules.length}種類のパターンを検出` : scenario === "cycle" ? "限界外でなくても、周期性を疑う" : "設定したルールでは異常なし"}</h3><ul>{["1点が3σ管理限界の外側","8点連続で中心線の同じ側","6点連続で増加または減少"].map((label) => { const found = analysis.rules.some((rule) => rule.label === label); return <li data-found={found} key={label}><span>{found ? "検出" : "—"}</span>{label}</li>; })}</ul></section><section><p className="section-label">NEXT CHECK</p><h3>次に何を確認する？</h3><p>{nextChecks[scenario]}</p></section></div><div className="control-limits-lesson"><div><p className="section-label">CONTROL LIMITS VS SPECIFICATIONS</p><h3>管理限界と規格限界は、別の境界</h3><p>管理限界は工程データから求め、変化を監視します。規格限界は顧客・設計・社内要求で決まります。</p></div><button aria-pressed={showSpecs} onClick={() => { setShowSpecs((current) => !current); trackEvent("control_chart_spec_limits_toggled", { visible: !showSpecs }); }} type="button"><span>{showSpecs ? "規格限界を表示中" : "規格限界は非表示"}</span><strong>{showSpecs ? "規格内でも管理状態とは限らない" : "規格限界を重ねて比較する"}</strong></button></div></section>;
}
