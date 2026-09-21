"use client";

import { getToolText, type ToolLocale } from "@/data/practical-tool-text";

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
const count = (value: number, locale: ToolLocale) => getToolText(locale)("{0}個", value.toFixed(1));

export function OeeSimulator({ locale = "ja" }: { locale?: ToolLocale } = {}) {
  const t = getToolText(locale);
  const record = (event: string, properties: Record<string, string> = {}) => trackEvent(event, { ...properties, ...(locale === "en" ? { locale } : {}) });
  const [inputs, setInputs] = useState<InputStrings>({ ...sample });
  const [scenario, setScenario] = useState<ScenarioStrings>({ ...sampleScenario });
  const interacted = useRef(false);
  const scenarioAtFocus = useRef<ScenarioStrings>({ ...sampleScenario });
  useEffect(() => { record("oee_app_view"); }, [locale]);
  const currentInput = toInput(inputs); const currentErrors = validateOeeInputs(currentInput, locale);
  const current = currentErrors.length ? null : calculateOee(currentInput);
  const scenarioInput = toScenario(scenario); const scenarioErrors = currentErrors.length ? [] : validateOeeScenario(currentInput, scenarioInput, locale);
  const improved = current && !scenarioErrors.length ? calculateOeeScenario(currentInput, scenarioInput) : null;

  function firstInteraction() { if (!interacted.current) { interacted.current = true; record("oee_first_interaction"); } }
  function updateInput(key: keyof InputStrings, value: string) { firstInteraction(); setInputs((currentValues) => ({ ...currentValues, [key]: value })); }
  function updateScenario(key: keyof ScenarioStrings, value: string) { firstInteraction(); setScenario((currentValues) => ({ ...currentValues, [key]: value })); }
  function commitScenario(key: keyof ScenarioStrings, factor: string) {
    if (current && improved && Number(scenario[key]) !== Number(scenarioAtFocus.current[key])) record("oee_scenario_changed", { factor });
    scenarioAtFocus.current[key] = scenario[key];
  }
  function reset() { scenarioAtFocus.current = { ...sampleScenario }; setInputs({ ...sample }); setScenario({ ...sampleScenario }); interacted.current = false; record("oee_reset"); }

  return <section className="mini-tool-workspace" aria-labelledby="oee-tool-title">
    <header className="mini-tool-heading"><div><p className="section-label">OEE IMPROVEMENT WORKSPACE</p><h2 id="oee-tool-title">{t("現状と改善シナリオを比較する")}</h2></div><button className="mini-reset-button" type="button" onClick={reset}>{t("サンプルに戻す")}</button></header>
    <div className="mini-tool-grid oee-grid">
      <div className="mini-tool-controls">
        <fieldset className="oee-fieldset"><legend>{t("現状")}</legend><p>{t("生産予定のない時間は負荷時間に含めません。生産予定内の段取り替えなどの停止は停止時間に含めます。")}</p><OeeField label={t("負荷時間")} unit={t("分")} field="loadingMinutes" value={inputs.loadingMinutes} onChange={updateInput} /><OeeField label={t("負荷時間内の停止時間")} unit={t("分")} field="downtimeMinutes" value={inputs.downtimeMinutes} onChange={updateInput} /><OeeField label={t("理想サイクルタイム")} unit={t("秒／個")} field="idealCycleSeconds" value={inputs.idealCycleSeconds} onChange={updateInput} /><OeeField label={t("総生産数")} unit={t("個")} field="totalCount" value={inputs.totalCount} onChange={updateInput} /><OeeField label={t("不良数")} unit={t("個")} field="defectCount" value={inputs.defectCount} onChange={updateInput} /></fieldset>
        {currentErrors.length > 0 && <ErrorList locale={locale} errors={currentErrors} />}
        <fieldset className="oee-fieldset oee-fieldset--scenario"><legend>{t("改善シナリオ")}</legend><p>{t("負荷時間と理想サイクルタイムは現状と同じ条件で比較します。")}</p><OeeScenarioField label={t("改善後の停止時間")} unit={t("分")} field="downtimeMinutes" value={scenario.downtimeMinutes} onChange={updateScenario} onFocus={() => { scenarioAtFocus.current["downtimeMinutes"] = scenario["downtimeMinutes"]; }} onCommit={() => commitScenario("downtimeMinutes", "downtime")} /><OeeScenarioField label={t("改善後の性能稼働率")} unit="%" field="performancePercent" value={scenario.performancePercent} onChange={updateScenario} onFocus={() => { scenarioAtFocus.current["performancePercent"] = scenario["performancePercent"]; }} onCommit={() => commitScenario("performancePercent", "performance")} /><OeeScenarioField label={t("改善後の良品率")} unit="%" field="qualityPercent" value={scenario.qualityPercent} onChange={updateScenario} onFocus={() => { scenarioAtFocus.current["qualityPercent"] = scenario["qualityPercent"]; }} onCommit={() => commitScenario("qualityPercent", "quality")} /></fieldset>
        {scenarioErrors.length > 0 && <ErrorList locale={locale} errors={scenarioErrors} />}
      </div>
      <div className="mini-tool-results" aria-live="polite">
        {current ? <><section className="oee-current"><h3>{t("現状のOEE")}</h3><strong>{pct(current.oee)}</strong><dl className="mini-metrics"><div><dt>{t("時間稼働率")}</dt><dd>{pct(current.availability)}</dd></div><div><dt>{t("性能稼働率")}</dt><dd>{pct(current.performance)}</dd></div><div><dt>{t("良品率")}</dt><dd>{pct(current.quality)}</dd></div><div><dt>{t("良品数")}</dt><dd>{current.goodCount}{t("個")}</dd></div></dl></section>{improved ? <><OeeComparisonChart locale={locale} currentGood={current.goodCount} improvedGood={improved.estimatedGoodCount} /><section className="oee-improved"><h3>{t("改善後の推定")}</h3><dl className="mini-metrics"><div><dt>OEE</dt><dd>{pct(improved.oee)}</dd></div><div><dt>{t("推定総生産数")}</dt><dd>{count(improved.estimatedTotalCount, locale)}</dd></div><div><dt>{t("推定良品数")}</dt><dd>{count(improved.estimatedGoodCount, locale)}</dd></div><div className="metric-highlight"><dt>{t("現状からの増分")}</dt><dd>{improved.estimatedGoodCount - current.goodCount >= 0 ? "+" : ""}{count(improved.estimatedGoodCount - current.goodCount, locale)}</dd></div></dl></section></> : <div className="mini-tool-empty">{t("改善シナリオを修正すると比較を表示します。")}</div>}</> : <div className="mini-tool-empty">{t("現状の入力を修正すると、OEEと比較結果が表示されます。")}</div>}
        <p className="calculation-note">{t("推定値は入力条件に基づく期待値で、小数のまま計算しています。表示は丸めており、実際の生産増を保証しません。")}</p>
      </div>
    </div>
  </section>;
}

function OeeField({ label, unit, field, value, onChange }: { label: string; unit: string; field: keyof InputStrings; value: string; onChange: (field: keyof InputStrings, value: string) => void }) { return <label className="mini-number-field"><span>{label} <small>{unit}</small></span><input inputMode="decimal" min="0" step="any" type="number" value={value} onChange={(event) => onChange(field, event.target.value)} /></label>; }
function OeeScenarioField({ label, unit, field, value, onChange, onFocus, onCommit }: { label: string; unit: string; field: keyof ScenarioStrings; value: string; onChange: (field: keyof ScenarioStrings, value: string) => void; onFocus: () => void; onCommit: () => void }) { return <label className="mini-number-field"><span>{label} <small>{unit}</small></span><input inputMode="decimal" min="0" step="any" type="number" value={value} onChange={(event) => onChange(field, event.target.value)} onFocus={onFocus} onBlur={onCommit} /></label>; }
function ErrorList({ errors, locale }: { errors: string[]; locale: ToolLocale }) { const t = getToolText(locale); return <div className="mini-tool-errors" role="alert"><strong>{t("入力を見直してください")}</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>; }
function OeeComparisonChart({ currentGood, improvedGood, locale }: { currentGood: number; improvedGood: number; locale: ToolLocale }) { const t = getToolText(locale); const max = Math.max(currentGood, improvedGood, 1); return <figure className="oee-comparison-chart"><h3>{t("良品生産量の比較")}</h3><div><span>{t("現状")}<i style={{ width: `${currentGood / max * 100}%` }} /><b>{count(currentGood, locale)}</b></span><span>{t("改善後")}<i style={{ width: `${improvedGood / max * 100}%` }} /><b>{count(improvedGood, locale)}</b></span></div><figcaption>{t("同じ負荷時間・理想サイクルタイムでの期待値比較")}</figcaption></figure>; }
