"use client";

import { useRef, useState } from "react";
import { CapabilityHistogram } from "@/components/CapabilityHistogram";
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

function benchmarkText(value?: number) {
  if (value === undefined) return "片側の工程能力を表示しています。";
  const difference = value - 1.33;
  if (Math.abs(difference) < 0.03) return "一般的に用いられる1.33という目安と、おおむね同じ水準です。";
  return difference > 0
    ? `一般的に用いられる1.33という目安を、${Math.abs(difference).toFixed(2)}上回っています。`
    : `一般的に用いられる1.33という目安を、${Math.abs(difference).toFixed(2)}下回っています。`;
}

function copyText(result: CapabilityResult) {
  const labels = metricLabels(result.method);
  const analysis = analyzeCapability(result);
  return [
    `計算方式: ${result.method === "overall" ? "全体標準偏差によるPp・Ppk" : "入力した短期標準偏差によるCp・Cpk"}`,
    result.sampleCount ? `データ件数: ${result.sampleCount}` : undefined,
    `平均: ${format(result.mean)}`,
    `標準偏差: ${format(result.standardDeviation)}`,
    `LSL: ${format(result.lowerSpecificationLimit)}`,
    `USL: ${format(result.upperSpecificationLimit)}`,
    `${labels.potential}: ${format(result.potential)}`,
    `${labels.upper}: ${format(result.upper)}`,
    `${labels.lower}: ${format(result.lower)}`,
    `${labels.performance}: ${format(result.performance)}`,
    `分析: ${analysis.heading}。${analysis.summary}`,
  ].filter(Boolean).join("\n");
}

export function CpkCalculator() {
  const [state, setState] = useState<ToolState>(() => sampleState(initialCapabilitySample));
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const parsed = parseMeasurements(state.rawData);
  const result = state.result;
  const labels = result ? metricLabels(result.method) : metricLabels(state.mode === "raw" ? "overall" : "short-term");
  const analysis = result ? analyzeCapability(result) : undefined;

  function update(patch: Partial<ToolState>) {
    setState((current) => ({ ...current, ...patch, activeSampleId: undefined, errors: {} }));
  }

  function loadSample(sample: CapabilitySample) {
    setState(sampleState(sample));
    setCopied(false);
    trackEvent("cpk_sample_changed", { sample: sample.id });
  }

  function startCustomData() {
    setState({ mode: "raw", rawData: "", mean: "", standardDeviation: "", lsl: "", usl: "", resultValues: [], errors: {} });
    setCopied(false);
    trackEvent("cpk_custom_data_started");
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function switchMode(mode: InputMode) {
    setState((current) => ({ ...current, mode, activeSampleId: undefined, result: undefined, resultValues: [], errors: {} }));
    setCopied(false);
  }

  function calculate() {
    const errors: Errors = {};
    const lower = optionalNumber(state.lsl);
    const upper = optionalNumber(state.usl);
    if (Number.isNaN(lower) || Number.isNaN(upper)) errors.limits = "規格値には有効な数値を入力してください。";
    else if (lower === undefined && upper === undefined) errors.limits = "LSLまたはUSLを入力してください。";
    else if (lower !== undefined && upper !== undefined && lower >= upper) errors.limits = "USLはLSLより大きい値にしてください。";

    try {
      let nextResult: CapabilityResult | undefined;
      let values: number[] = [];
      if (state.mode === "raw") {
        if (parsed.values.length < 2) errors.data = parsed.values.length === 1 ? "測定値が1件だけです。2件以上入力してください。" : "有効な測定値を2件以上入力してください。";
        else if (parsed.invalidCount > Math.max(3, Math.ceil(parsed.values.length * 0.2))) errors.data = "読み取れない値が多いため、データの区切りや見出しを確認してください。";
        if (!errors.data && !errors.limits) {
          values = parsed.values;
          nextResult = calculateOverallCapability(values, lower, upper);
        }
      } else {
        const mean = Number(state.mean);
        const standardDeviation = Number(state.standardDeviation);
        if (state.mean.trim() === "" || !Number.isFinite(mean)) errors.summary = "平均値には有効な数値を入力してください。";
        else if (state.standardDeviation.trim() === "" || !Number.isFinite(standardDeviation) || standardDeviation <= 0) errors.summary = "短期標準偏差には0より大きい数値を入力してください。";
        if (!errors.summary && !errors.limits) {
          nextResult = calculateCapability({ mean, standardDeviation, lowerSpecificationLimit: lower, upperSpecificationLimit: upper, method: "short-term" });
        }
      }
      if (Object.keys(errors).length > 0 || !nextResult) {
        setState((current) => ({ ...current, errors, result: undefined, resultValues: [] }));
        return;
      }
      setState((current) => ({ ...current, errors: {}, result: nextResult, resultValues: values }));
      setCopied(false);
      trackEvent("cpk_calculation_completed", { input_mode: state.mode, specification_type: lower !== undefined && upper !== undefined ? "two_sided" : "one_sided" });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "入力内容を確認してください。";
      setState((current) => ({ ...current, errors: state.mode === "raw" ? { data: message } : { summary: message }, result: undefined, resultValues: [] }));
    }
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(copyText(result));
    setCopied(true);
    trackEvent("cpk_result_copied", { method: result.method });
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="capability-workspace">
      <section className="capability-input" aria-labelledby="capability-input-title">
        <div className="tool-section-heading"><h2 id="capability-input-title">データ入力</h2>{state.activeSampleId ? <span>サンプルデータで表示中</span> : null}</div>
        <fieldset className="tool-segmented"><legend>入力方式</legend><div>
          <button aria-pressed={state.mode === "raw"} onClick={() => switchMode("raw")} type="button">生データ</button>
          <button aria-pressed={state.mode === "summary"} onClick={() => switchMode("summary")} type="button">平均・短期標準偏差</button>
        </div></fieldset>

        {state.mode === "raw" ? <>
          <div className="sample-selector"><label htmlFor="capability-sample">サンプル</label><select id="capability-sample" onChange={(event) => { const sample = capabilitySamples.find((item) => item.id === event.target.value); if (sample) loadSample(sample); }} value={state.activeSampleId ?? "custom"}><option disabled value="custom">自分のデータ</option>{capabilitySamples.map((sample) => <option key={sample.id} value={sample.id}>{sample.label}</option>)}</select><p>{state.activeSampleId ? capabilitySamples.find((sample) => sample.id === state.activeSampleId)?.description : "測定データを貼り付けて計算します。"}</p></div>
          <div className={`tool-field${state.errors.data ? " has-error" : ""}`}><label htmlFor="measurement-data">測定データ</label><textarea ref={textareaRef} id="measurement-data" aria-describedby="measurement-count measurement-error" aria-invalid={Boolean(state.errors.data)} onChange={(event) => update({ rawData: event.target.value })} value={state.rawData} />
            <p id="measurement-count" className="field-status">{parsed.values.length}件の測定値を認識しました{parsed.invalidCount ? `。${parsed.invalidCount}件の値を読み取れませんでした` : ""}。</p>{state.errors.data ? <p className="field-error" id="measurement-error" role="alert">{state.errors.data}</p> : null}</div>
        </> : <div className={`summary-fields${state.errors.summary ? " has-error" : ""}`}><div className="tool-field"><label htmlFor="summary-mean">平均値</label><input id="summary-mean" inputMode="decimal" onChange={(event) => update({ mean: event.target.value })} value={state.mean} /></div><div className="tool-field"><label htmlFor="summary-sd">短期標準偏差</label><input id="summary-sd" inputMode="decimal" onChange={(event) => update({ standardDeviation: event.target.value })} value={state.standardDeviation} /></div>{state.errors.summary ? <p className="field-error" role="alert">{state.errors.summary}</p> : <p className="field-status">群内変動などから別途求めた短期標準偏差を入力してください。</p>}</div>}

        <div className={`specification-fields${state.errors.limits ? " has-error" : ""}`}><div className="tool-field"><label htmlFor="lsl">下限規格 LSL</label><input id="lsl" inputMode="decimal" aria-invalid={Boolean(state.errors.limits)} onChange={(event) => update({ lsl: event.target.value })} value={state.lsl} /></div><div className="tool-field"><label htmlFor="usl">上限規格 USL</label><input id="usl" inputMode="decimal" aria-invalid={Boolean(state.errors.limits)} onChange={(event) => update({ usl: event.target.value })} value={state.usl} /></div>{state.errors.limits ? <p className="field-error" role="alert">{state.errors.limits}</p> : <p className="field-status">片側規格では、該当する規格値だけ入力してください。</p>}</div>

        <button className="tool-primary-button" onClick={calculate} type="button">計算する</button>
        <div className="tool-secondary-actions"><button onClick={startCustomData} type="button">自分のデータを入力</button><button onClick={() => loadSample(capabilitySamples[(capabilitySamples.findIndex((sample) => sample.id === state.activeSampleId) + 1) % capabilitySamples.length])} type="button">別のサンプルを試す</button><button onClick={startCustomData} type="button">入力をクリア</button></div>
      </section>

      <section className="capability-results" aria-live="polite" aria-labelledby="capability-result-title">
        <div className="tool-section-heading"><h2 id="capability-result-title">計算結果</h2>{state.activeSampleId ? <span>サンプルデータ</span> : null}</div>
        {result && analysis ? <div className="result-update" key={`${result.mean}-${result.standardDeviation}-${result.performance}`}>
          <div className="primary-capability"><div><span>{labels.performance}</span><strong>{format(result.performance)}</strong></div><p>{benchmarkText(result.performance)}</p></div>
          <p className="benchmark-note">1.33は一般的に用いられる目安の一つです。実際の判定では、顧客要求や社内基準を優先してください。</p>
          <section className="analysis-summary"><h3>{analysis.heading}</h3><p>{analysis.summary}</p></section>
          {state.resultValues.length > 0 ? <section className="result-section"><h3>分布</h3><CapabilityHistogram result={result} values={state.resultValues} /></section> : <section className="result-section"><h3>分布</h3><p className="capability-chart-empty">要約値入力では、測定データの分布を表示できません。</p></section>}
          <section className="result-section"><h3>補助指標</h3><dl className="capability-metrics">
            <div><dt>{labels.potential}</dt><dd>{format(result.potential)}</dd></div><div><dt>{labels.upper}</dt><dd>{format(result.upper)}</dd></div><div><dt>{labels.lower}</dt><dd>{format(result.lower)}</dd></div>
            <div><dt>平均</dt><dd>{format(result.mean)}</dd></div><div><dt>標準偏差</dt><dd>{format(result.standardDeviation)}</dd></div><div><dt>データ件数</dt><dd>{result.sampleCount ?? "—"}</dd></div>
            <div><dt>LSL</dt><dd>{format(result.lowerSpecificationLimit)}</dd></div><div><dt>USL</dt><dd>{format(result.upperSpecificationLimit)}</dd></div><div><dt>規格中心</dt><dd>{format(result.specificationCenter)}</dd></div><div><dt>中心からのずれ</dt><dd>{format(result.centerOffset)}</dd></div>
          </dl></section>
          <section className="result-section result-checks"><h3>確認候補</h3><ul>{analysis.checks.map((check) => <li key={check}>{check}</li>)}</ul></section>
          <div className="result-footer"><p>{result.method === "overall" ? "入力した全データの標本標準偏差（n−1）を使うため、結果はPp・Ppkです。" : "入力された短期標準偏差を使うため、結果はCp・Cpkです。"}</p><button className={copied ? "is-success" : ""} onClick={copyResult} type="button">{copied ? "コピーしました" : "結果をコピー"}</button></div>
        </div> : <div className="empty-result"><p>測定データと規格値を入力すると、ここに計算結果が表示されます。</p><small>入力値や計算結果が外部へ送信されることはありません。</small></div>}
      </section>
    </div>
  );
}
