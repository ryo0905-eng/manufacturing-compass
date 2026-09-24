"use client";

import { ToolWorkspaceFile } from "@/components/ToolWorkspaceFile";

import { PracticalToolNextSteps } from "@/components/PracticalToolNextSteps";

import { cpkText, type CpkLocale } from "@/data/cpk-text";

import { useRef, useState } from "react";
import { CapabilityHistogram } from "@/components/CapabilityHistogram";
import { Button, FieldMessage, InputField, Notice, SelectField, SelectionButton, TextareaField } from "@/components/ui/Controls";
import styles from "./CpkControls.module.css";
import { CpkResultCopy } from "@/components/CpkResultCopy";
import { capabilitySamples, initialCapabilitySample, sampleAsText, type CapabilitySample } from "@/data/cpk-samples";
import {
  analyzeCapability,
  calculateCapability,
  calculateOverallCapability,
  metricLabels,
  parseMeasurements,
  type CapabilityMethod,
  type CapabilityResult,
} from "@/lib/process-capability";
import { trackEvent } from "@/lib/analytics";
import { usePracticalToolJourney } from "@/lib/use-practical-tool-journey";

type InputMode = "raw" | "summary";
type Errors = { data?: string; limits?: string; summary?: string };

type ToolState = {
  mode: InputMode;
  rawData: string;
  mean: string;
  standardDeviation: string;
  lsl: string;
  usl: string;
  activeSampleId?: CapabilitySample["id"];
  result?: CapabilityResult;
  resultValues: number[];
  needsCalculation?: boolean;
  errors: Errors;
};

function resultForSample(sample: CapabilitySample) {
  return calculateOverallCapability([...sample.values], sample.lsl, sample.usl);
}

function sampleState(sample: CapabilitySample): ToolState {
  return {
    mode: "raw",
    rawData: sampleAsText(sample),
    mean: "",
    standardDeviation: "",
    lsl: String(sample.lsl),
    usl: String(sample.usl),
    activeSampleId: sample.id,
    result: resultForSample(sample),
    resultValues: [...sample.values],
    errors: {},
  };
}

function optionalNumber(value: string) {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function format(value?: number) {
  return value === undefined ? "—" : value.toFixed(3);
}

function benchmarkText(value: number | undefined, locale: CpkLocale) {
  const t = (text: string) => cpkText(locale, text);
  if (value === undefined) return t("片側の工程能力を表示しています。");
  const difference = value - 1.33;
  if (Math.abs(difference) < 0.03) return t("一般的に用いられる1.33という目安と、おおむね同じ水準です。");
  if (locale === "en") return `${Math.abs(difference).toFixed(2)} ${difference > 0 ? "above" : "below"} the commonly used reference value of 1.33.`;
  return difference > 0
    ? `一般的に用いられる1.33という目安を、${Math.abs(difference).toFixed(2)}上回っています。`
    : `一般的に用いられる1.33という目安を、${Math.abs(difference).toFixed(2)}下回っています。`;
}

function copyText(result: CapabilityResult, locale: CpkLocale) {
  const t = (text: string) => cpkText(locale, text);
  const labels = metricLabels(result.method);
  const analysis = analyzeCapability(result);
  return [
    `${locale === "en" ? "Method" : "計算方式"}: ${result.method === "overall" ? t("全体標準偏差によるPp・Ppk") : t("入力した短期標準偏差によるCp・Cpk")}`,
    result.sampleCount ? `${t("データ件数")}: ${result.sampleCount}` : undefined,
    `${t("平均")}: ${format(result.mean)}`,
    `${t("標準偏差")}: ${format(result.standardDeviation)}`,
    `LSL: ${format(result.lowerSpecificationLimit)}`,
    `USL: ${format(result.upperSpecificationLimit)}`,
    `${labels.potential}: ${format(result.potential)}`,
    `${labels.upper}: ${format(result.upper)}`,
    `${labels.lower}: ${format(result.lower)}`,
    `${labels.performance}: ${format(result.performance)}`,
    `${locale === "en" ? "Analysis" : "分析"}: ${t(analysis.heading)}${locale === "en" ? ". " : "。"}${t(analysis.summary)}`,
  ].filter(Boolean).join("\n");
}

export function CpkCalculator({ locale = "ja" }: { locale?: CpkLocale } = {}) {
  const t = (text: string) => cpkText(locale, text);
  const [state, setState] = useState<ToolState>(() => sampleState(initialCapabilitySample));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const parsed = parseMeasurements(state.rawData);
  const result = state.result;
  const journey = usePracticalToolJourney("cpk", locale, result, "sample");
  const labels = result ? metricLabels(result.method) : metricLabels(state.mode === "raw" ? "overall" : "short-term");
  const analysis = result ? analyzeCapability(result) : undefined;
  const resultText = result ? copyText(result, locale) : "";

  function update(patch: Partial<ToolState>) {
    journey.start();
    setState((current) => ({ ...current, ...patch, activeSampleId: undefined, errors: {}, result: undefined, resultValues: [], needsCalculation: true }));
  }

  function loadSample(sample: CapabilitySample) {
    journey.sample();
    setState(sampleState(sample));
    trackEvent("cpk_sample_changed", { sample: sample.id, ...(locale === "en" ? { locale } : {}) });
  }

  function startCustomData() {
    journey.start();
    setState({ mode: "raw", rawData: "", mean: "", standardDeviation: "", lsl: "", usl: "", resultValues: [], errors: {} });
    trackEvent("cpk_custom_data_started", locale === "en" ? { locale } : undefined);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function switchMode(mode: InputMode) {
    journey.start();
    setState((current) => ({ ...current, mode, activeSampleId: undefined, result: undefined, resultValues: [], errors: {}, needsCalculation: false }));
    trackEvent("cpk_input_mode_changed", { input_mode: mode, ...(locale === "en" ? { locale } : {}) });
  }

  function calculate() {
    journey.calculate();
    const errors: Errors = {};
    const lower = optionalNumber(state.lsl);
    const upper = optionalNumber(state.usl);
    if (Number.isNaN(lower) || Number.isNaN(upper)) errors.limits = t("規格値には有効な数値を入力してください。");
    else if (lower === undefined && upper === undefined) errors.limits = t("LSLまたはUSLを入力してください。");
    else if (lower !== undefined && upper !== undefined && lower >= upper) errors.limits = t("USLはLSLより大きい値にしてください。");

    try {
      let nextResult: CapabilityResult | undefined;
      let values: number[] = [];
      if (state.mode === "raw") {
        if (parsed.invalidCount > 0) errors.data = t("読み取れない値があるため計算できません。該当箇所を修正してください。");
        else if (parsed.values.length < 2) errors.data = parsed.values.length === 1 ? t("測定値が1件だけです。2件以上入力してください。") : t("有効な測定値を2件以上入力してください。");
        if (!errors.data && !errors.limits) {
          values = parsed.values;
          nextResult = calculateOverallCapability(values, lower, upper);
        }
      } else {
        const mean = Number(state.mean);
        const standardDeviation = Number(state.standardDeviation);
        if (state.mean.trim() === "" || !Number.isFinite(mean)) errors.summary = t("平均値には有効な数値を入力してください。");
        else if (state.standardDeviation.trim() === "" || !Number.isFinite(standardDeviation) || standardDeviation <= 0) errors.summary = t("短期標準偏差には0より大きい数値を入力してください。");
        if (!errors.summary && !errors.limits) {
          nextResult = calculateCapability({ mean, standardDeviation, lowerSpecificationLimit: lower, upperSpecificationLimit: upper, method: "short-term" });
        }
      }
      if (Object.keys(errors).length > 0 || !nextResult) {
        if (errors.data) textareaRef.current?.focus();
        journey.error();
        setState((current) => ({ ...current, errors, result: undefined, resultValues: [] }));
        return;
      }
      setState((current) => ({ ...current, errors: {}, result: nextResult, resultValues: values, needsCalculation: false }));
      trackEvent("cpk_calculation_completed", { input_mode: state.mode, specification_type: lower !== undefined && upper !== undefined ? "two_sided" : "one_sided", ...(locale === "en" ? { locale } : {}) });
    } catch (cause) {
      journey.error();
      const message = cause instanceof Error ? t(cause.message) : t("入力内容を確認してください。");
      setState((current) => ({ ...current, errors: state.mode === "raw" ? { data: message } : { summary: message }, result: undefined, resultValues: [] }));
    }
  }

  return (
    <div className="capability-workspace">
      <section className="capability-input" aria-labelledby="capability-input-title">
        <ToolWorkspaceFile tool="cpk" locale={locale} input={state} onRestore={input => {
          journey.start();
          setState({ ...input, resultValues: [], errors: {}, needsCalculation: true });
        }} />
        <div className="tool-section-heading"><h2 ref={journey.inputRef} id="capability-input-title">{t("データ入力")}</h2>{state.activeSampleId ? <span>{t("サンプルデータで表示中")}</span> : null}</div>
        <div className={styles.inputStack}>
          <fieldset className={styles.inputModes}>
            <legend>{t("入力方式")}</legend>
            <div className={styles.selectionGroup}>
              <SelectionButton selected={state.mode === "raw"} onClick={() => switchMode("raw")}>{t("生データ")}</SelectionButton>
              <SelectionButton selected={state.mode === "summary"} onClick={() => switchMode("summary")}>{t("平均・短期標準偏差")}</SelectionButton>
            </div>
          </fieldset>

          {state.mode === "raw" ? <>
            <SelectField id="capability-sample" label={t("サンプル")}
              description={state.activeSampleId ? t(capabilitySamples.find((sample) => sample.id === state.activeSampleId)?.description ?? "") : t("測定データを貼り付けて計算します。")}
              onChange={(event) => { const sample = capabilitySamples.find((item) => item.id === event.target.value); if (sample) loadSample(sample); }} value={state.activeSampleId ?? "custom"}>
              <option disabled value="custom">{t("自分のデータ")}</option>
              {capabilitySamples.map((sample) => <option key={sample.id} value={sample.id}>{t(sample.label)}</option>)}
            </SelectField>
            <div>
              <TextareaField ref={textareaRef} id="measurement-data" label={t("測定データ")} className={styles.measurement}
                description={t("1行1値のほか、カンマ・タブ区切りにも対応します。列名・単位・桁区切りは除いてください。")}
                error={state.errors.data} aria-invalid={parsed.invalidCount > 0 || Boolean(state.errors.data)} aria-describedby={`measurement-count${parsed.invalidCount ? " measurement-invalid" : ""}`}
                onChange={(event) => update({ rawData: event.target.value })} placeholder={"10.01\n9.98\n10.03"} value={state.rawData} />
              <FieldMessage id="measurement-count">{locale === "en" ? `${parsed.values.length} measurements recognized${parsed.invalidCount ? `; ${parsed.invalidCount} values could not be read` : ""}.` : <>{parsed.values.length}件の測定値を認識しました{parsed.invalidCount ? `。${parsed.invalidCount}件の値を読み取れませんでした` : ""}。</>}</FieldMessage>
              {parsed.invalidCount > 0 && <div id="measurement-invalid" className={styles.invalidMeasurements}>
                <FieldMessage error>{t("読み取れない値があるため計算できません。該当箇所を修正してください。")}</FieldMessage>
                <ul>{parsed.invalidValues.slice(0, 5).map(({ line, token }, index) => {
                  const characters = Array.from(token);
                  const preview = characters.length > 40 ? `${characters.slice(0, 40).join("")}…` : token;
                  return <li key={index}>{locale === "en" ? `Line ${line}: ` : `${line}行目：`}<code>{preview}</code></li>;
                })}</ul>
                {parsed.invalidCount > 5 && <p>{locale === "en" ? `${parsed.invalidCount - 5} more unreadable values.` : `ほか${parsed.invalidCount - 5}件の読み取れない値があります。`}</p>}
              </div>}
            </div>
          </> : <div className={styles.fields}>
            <InputField id="summary-mean" label={t("平均値")} inputMode="decimal" aria-invalid={Boolean(state.errors.summary)} aria-describedby="summary-message" onChange={(event) => update({ mean: event.target.value })} value={state.mean} />
            <InputField id="summary-sd" label={t("短期標準偏差")} inputMode="decimal" aria-invalid={Boolean(state.errors.summary)} aria-describedby="summary-message" onChange={(event) => update({ standardDeviation: event.target.value })} value={state.standardDeviation} />
            <FieldMessage id="summary-message" error={Boolean(state.errors.summary)}>{state.errors.summary ?? t("群内変動などから別途求めた短期標準偏差を入力してください。")}</FieldMessage>
          </div>}

          <div className={styles.fields}>
            <InputField id="lsl" label={t("下限規格 LSL")} inputMode="decimal" aria-invalid={Boolean(state.errors.limits)} aria-describedby="limits-message" onChange={(event) => update({ lsl: event.target.value })} value={state.lsl} />
            <InputField id="usl" label={t("上限規格 USL")} inputMode="decimal" aria-invalid={Boolean(state.errors.limits)} aria-describedby="limits-message" onChange={(event) => update({ usl: event.target.value })} value={state.usl} />
            <FieldMessage id="limits-message" error={Boolean(state.errors.limits)}>{state.errors.limits ?? t("片側規格では、該当する規格値だけ入力してください。")}</FieldMessage>
          </div>

          <Button variant="primary" onClick={calculate}>{t("計算する")}</Button>
          <div className={styles.actions}>
            <Button variant="text" onClick={startCustomData}>{t("自分のデータを入力")}</Button>
            <Button variant="text" onClick={() => loadSample(capabilitySamples[(capabilitySamples.findIndex((sample) => sample.id === state.activeSampleId) + 1) % capabilitySamples.length])}>{t("別のサンプルを試す")}</Button>
            <Button variant="text" onClick={startCustomData}>{t("入力をクリア")}</Button>
          </div>
        </div>
      </section>

      <section className="capability-results" aria-live="polite" aria-labelledby="capability-result-title">
        <div className="tool-section-heading"><h2 ref={journey.resultRef} id="capability-result-title">{t("計算結果")}</h2>{state.activeSampleId ? <span>{t("サンプルデータ")}</span> : null}</div>
        {result && analysis ? <div className="result-update" key={`${result.mean}-${result.standardDeviation}-${result.performance}`}>
          <div className="primary-capability"><div><span>{labels.performance}</span><strong>{format(result.performance)}</strong></div><p>{benchmarkText(result.performance, locale)}</p></div>
          <Notice>{t("1.33は一般的に用いられる目安の一つです。実際の判定では、顧客要求や社内基準を優先してください。")}</Notice>
          <section className="analysis-summary"><h3>{t(analysis.heading)}</h3><p>{t(analysis.summary)}</p></section>
          <div className="cpk-result-export">
            <p>{result.method === "overall" ? t("入力した全データの標本標準偏差（n−1）を使うため、結果はPp・Ppkです。") : t("入力された短期標準偏差を使うため、結果はCp・Cpkです。")}</p>
            <CpkResultCopy key={resultText} text={resultText} method={result.method} locale={locale} />
          </div>
          {state.resultValues.length > 0 ? <section className="result-section"><h3>{t("分布")}</h3><CapabilityHistogram result={result} values={state.resultValues} locale={locale} /></section> : <section className="result-section"><h3>{t("分布")}</h3><p className="capability-chart-empty">{t("要約値入力では、測定データの分布を表示できません。")}</p></section>}
          <details className="capability-result-details">
            <summary>{t("補助指標と確認候補")}</summary>
            <section className="result-section"><h3>{t("補助指標")}</h3><dl className="capability-metrics">
              <div><dt>{labels.potential}</dt><dd>{format(result.potential)}</dd></div><div><dt>{labels.upper}</dt><dd>{format(result.upper)}</dd></div><div><dt>{labels.lower}</dt><dd>{format(result.lower)}</dd></div>
              <div><dt>{t("平均")}</dt><dd>{format(result.mean)}</dd></div><div><dt>{t("標準偏差")}</dt><dd>{format(result.standardDeviation)}</dd></div><div><dt>{t("データ件数")}</dt><dd>{result.sampleCount ?? "—"}</dd></div>
              <div><dt>LSL</dt><dd>{format(result.lowerSpecificationLimit)}</dd></div><div><dt>USL</dt><dd>{format(result.upperSpecificationLimit)}</dd></div><div><dt>{t("規格中心")}</dt><dd>{format(result.specificationCenter)}</dd></div><div><dt>{t("中心からのずれ")}</dt><dd>{format(result.centerOffset)}</dd></div>
            </dl></section>
            <section className="result-section result-checks"><h3>{t("確認候補")}</h3><ul>{analysis.checks.map((check) => <li key={check}>{t(check)}</li>)}</ul></section>
          </details>
          <PracticalToolNextSteps tool="cpk" locale={locale} />
        </div> : <div className="empty-result"><p>{t(state.needsCalculation ? "入力が変更されました。再計算してください。" : "測定データと規格値を入力すると、ここに計算結果が表示されます。")}</p><small>{t("入力値や計算結果が外部へ送信されることはありません。")}</small></div>}
      </section>
    </div>
  );
}
