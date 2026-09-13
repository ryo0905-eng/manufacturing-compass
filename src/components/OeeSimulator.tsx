"use client";

import { useEffect, useRef, useState } from "react";
import { calculateOee, calculateOeeScenario, validateOeeInputs, validateOeeScenario, type OeeInputs, type OeeScenario } from "@/lib/oee";
import { trackEvent } from "@/lib/analytics";

type InputStrings = Record<keyof OeeInputs, string>;
type ScenarioStrings = { downtimeMinutes: string; performancePercent: string; qualityPercent: string };
const sample: InputStrings = { loadingMinutes: "480", downtimeMinutes: "60", idealCycleSeconds: "30", totalCount: "700", defectCount: "35" };
const sampleScenario: ScenarioStrings = { downtimeMinutes: "30", performancePercent: "83.333333", qualityPercent: "95" };
const toInput = (value: InputStrings): OeeInputs => Object.fromEntries(Object.entries(value).map(([key, item]) => [key, Number(item)])) as OeeInputs;
const toScenario = (value: ScenarioStrings): OeeScenario => ({ downtimeMinutes: Number(value.downtimeMinutes), performanceRate: Number(value.performancePercent) / 100, qualityRate: Number(value.qualityPercent) / 100 });
const pct = (value: number) => `${(value * 100).toFixed(2)}%`;
const count = (value: number) => `${value.toFixed(1)}個`;

export function OeeSimulator() {
  const [inputs, setInputs] = useState<InputStrings>({ ...sample });
  const [scenario, setScenario] = useState<ScenarioStrings>({ ...sampleScenario });
  const interacted = useRef(false);
  useEffect(() => { trackEvent("oee_app_view"); }, []);
  const currentInput = toInput(inputs); const currentErrors = validateOeeInputs(currentInput);
  const current = currentErrors.length ? null : calculateOee(currentInput);
  const scenarioInput = toScenario(scenario); const scenarioErrors = currentErrors.length ? [] : validateOeeScenario(currentInput, scenarioInput);
  const improved = current && !scenarioErrors.length ? calculateOeeScenario(currentInput, scenarioInput) : null;

  function firstInteraction() { if (!interacted.current) { interacted.current = true; trackEvent("oee_first_interaction"); } }
  function updateInput(key: keyof InputStrings, value: string) { firstInteraction(); setInputs((currentValues) => ({ ...currentValues, [key]: value })); }
  function updateScenario(key: keyof ScenarioStrings, value: string) { firstInteraction(); setScenario((currentValues) => ({ ...currentValues, [key]: value })); }
  function reset() { setInputs({ ...sample }); setScenario({ ...sampleScenario }); interacted.current = false; trackEvent("oee_reset"); }

  return <section className="mini-tool-workspace" aria-labelledby="oee-tool-title">
    <header className="mini-tool-heading"><div><p className="section-label">OEE IMPROVEMENT WORKSPACE</p><h2 id="oee-tool-title">現状と改善シナリオを比較する</h2></div><button className="mini-reset-button" type="button" onClick={reset}>サンプルに戻す</button></header>
    <div className="mini-tool-grid oee-grid">
      <div className="mini-tool-controls">
        <fieldset className="oee-fieldset"><legend>現状</legend><p>負荷時間から計画停止を除き、負荷時間内の停止だけを入力します。</p><OeeField label="負荷時間" unit="分" field="loadingMinutes" value={inputs.loadingMinutes} onChange={updateInput} /><OeeField label="負荷時間内の停止時間" unit="分" field="downtimeMinutes" value={inputs.downtimeMinutes} onChange={updateInput} /><OeeField label="理想サイクルタイム" unit="秒／個" field="idealCycleSeconds" value={inputs.idealCycleSeconds} onChange={updateInput} /><OeeField label="総生産数" unit="個" field="totalCount" value={inputs.totalCount} onChange={updateInput} /><OeeField label="不良数" unit="個" field="defectCount" value={inputs.defectCount} onChange={updateInput} /></fieldset>
        {currentErrors.length > 0 && <ErrorList errors={currentErrors} />}
        <fieldset className="oee-fieldset oee-fieldset--scenario"><legend>改善シナリオ</legend><p>負荷時間と理想サイクルタイムは現状と同じ条件で比較します。</p><OeeScenarioField label="改善後の停止時間" unit="分" field="downtimeMinutes" value={scenario.downtimeMinutes} onChange={updateScenario} onCommit={() => trackEvent("oee_scenario_changed", { factor: "downtime" })} /><OeeScenarioField label="改善後の性能稼働率" unit="%" field="performancePercent" value={scenario.performancePercent} onChange={updateScenario} onCommit={() => trackEvent("oee_scenario_changed", { factor: "performance" })} /><OeeScenarioField label="改善後の良品率" unit="%" field="qualityPercent" value={scenario.qualityPercent} onChange={updateScenario} onCommit={() => trackEvent("oee_scenario_changed", { factor: "quality" })} /></fieldset>
        {scenarioErrors.length > 0 && <ErrorList errors={scenarioErrors} />}
      </div>
      <div className="mini-tool-results" aria-live="polite">
        {current ? <><section className="oee-current"><h3>現状のOEE</h3><strong>{pct(current.oee)}</strong><dl className="mini-metrics"><div><dt>時間稼働率</dt><dd>{pct(current.availability)}</dd></div><div><dt>性能稼働率</dt><dd>{pct(current.performance)}</dd></div><div><dt>良品率</dt><dd>{pct(current.quality)}</dd></div><div><dt>良品数</dt><dd>{current.goodCount}個</dd></div></dl></section>{improved ? <><OeeComparisonChart currentGood={current.goodCount} improvedGood={improved.estimatedGoodCount} /><section className="oee-improved"><h3>改善後の推定</h3><dl className="mini-metrics"><div><dt>OEE</dt><dd>{pct(improved.oee)}</dd></div><div><dt>推定総生産数</dt><dd>{count(improved.estimatedTotalCount)}</dd></div><div><dt>推定良品数</dt><dd>{count(improved.estimatedGoodCount)}</dd></div><div className="metric-highlight"><dt>現状からの増分</dt><dd>{improved.estimatedGoodCount - current.goodCount >= 0 ? "+" : ""}{count(improved.estimatedGoodCount - current.goodCount)}</dd></div></dl></section></> : <div className="mini-tool-empty">改善シナリオを修正すると比較を表示します。</div>}</> : <div className="mini-tool-empty">現状の入力を修正すると、OEEと比較結果が表示されます。</div>}
        <p className="calculation-note">推定値は入力条件に基づく期待値で、小数のまま計算しています。表示は丸めており、実際の生産増を保証しません。</p>
      </div>
    </div>
  </section>;
}

function OeeField({ label, unit, field, value, onChange }: { label: string; unit: string; field: keyof InputStrings; value: string; onChange: (field: keyof InputStrings, value: string) => void }) { return <label className="mini-number-field"><span>{label} <small>{unit}</small></span><input inputMode="decimal" min="0" step="any" type="number" value={value} onChange={(event) => onChange(field, event.target.value)} /></label>; }
function OeeScenarioField({ label, unit, field, value, onChange, onCommit }: { label: string; unit: string; field: keyof ScenarioStrings; value: string; onChange: (field: keyof ScenarioStrings, value: string) => void; onCommit: () => void }) { return <label className="mini-number-field"><span>{label} <small>{unit}</small></span><input inputMode="decimal" min="0" step="any" type="number" value={value} onChange={(event) => onChange(field, event.target.value)} onBlur={onCommit} /></label>; }
function ErrorList({ errors }: { errors: string[] }) { return <div className="mini-tool-errors" role="alert"><strong>入力を見直してください</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>; }
function OeeComparisonChart({ currentGood, improvedGood }: { currentGood: number; improvedGood: number }) { const max = Math.max(currentGood, improvedGood, 1); return <figure className="oee-comparison-chart"><h3>良品生産量の比較</h3><div><span>現状 <i style={{ width: `${currentGood / max * 100}%` }} /><b>{count(currentGood)}</b></span><span>改善後 <i style={{ width: `${improvedGood / max * 100}%` }} /><b>{count(improvedGood)}</b></span></div><figcaption>同じ負荷時間・理想サイクルタイムでの期待値比較</figcaption></figure>; }
