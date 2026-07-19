"use client";

import { useMemo, useState } from "react";
import { calculateCapability, sampleStandardDeviation, type CapabilityResult } from "@/lib/process-capability";
import { trackEvent } from "@/lib/analytics";

type InputMode = "raw" | "summary";

function optionalNumber(value: string) {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function format(value?: number) {
  return value === undefined ? "—" : value.toFixed(3);
}

function interpretation(cpk?: number) {
  if (cpk === undefined) return "規格値を確認してください";
  if (cpk < 0) return "平均が規格範囲の外側です";
  if (cpk < 1) return "ばらつきが規格幅に対して大きい状態です";
  if (cpk < 1.33) return "工程や要求水準に照らして確認が必要です";
  if (cpk < 1.67) return "一般的な目安では余裕が見られます";
  return "一般的な目安では十分な余裕が見られます";
}

export function CpkCalculator() {
  const [mode, setMode] = useState<InputMode>("raw");
  const [rawData, setRawData] = useState("");
  const [mean, setMean] = useState("");
  const [standardDeviation, setStandardDeviation] = useState("");
  const [lsl, setLsl] = useState("");
  const [usl, setUsl] = useState("");
  const [result, setResult] = useState<CapabilityResult>();
  const [sampleCount, setSampleCount] = useState<number>();
  const [error, setError] = useState("");

  const parsedRawData = useMemo(
    () => rawData.split(/[\s,，;；]+/).map((value) => value.trim()).filter(Boolean).map(Number),
    [rawData],
  );

  function switchMode(nextMode: InputMode) {
    setMode(nextMode);
    setResult(undefined);
    setError("");
  }

  function calculate() {
    try {
      let calculatedMean: number;
      let calculatedStandardDeviation: number;
      let count: number | undefined;

      if (mode === "raw") {
        if (parsedRawData.length < 2 || parsedRawData.some((value) => !Number.isFinite(value))) {
          throw new Error("数値データを2点以上、改行・空白・カンマ区切りで入力してください。");
        }
        calculatedMean = parsedRawData.reduce((sum, value) => sum + value, 0) / parsedRawData.length;
        calculatedStandardDeviation = sampleStandardDeviation(parsedRawData) ?? 0;
        count = parsedRawData.length;
      } else {
        calculatedMean = Number(mean);
        calculatedStandardDeviation = Number(standardDeviation);
        if (mean.trim() === "" || standardDeviation.trim() === "") {
          throw new Error("平均値と標準偏差を入力してください。");
        }
      }

      const lowerSpecificationLimit = optionalNumber(lsl);
      const upperSpecificationLimit = optionalNumber(usl);
      if (Number.isNaN(lowerSpecificationLimit) || Number.isNaN(upperSpecificationLimit)) {
        throw new Error("規格値には数値を入力してください。");
      }

      const nextResult = calculateCapability({
        mean: calculatedMean,
        standardDeviation: calculatedStandardDeviation,
        lowerSpecificationLimit,
        upperSpecificationLimit,
      });
      setResult(nextResult);
      setSampleCount(count);
      setError("");
      trackEvent("cpk_calculation_completed", {
        input_mode: mode,
        specification_type: lsl.trim() && usl.trim() ? "two_sided" : "one_sided",
      });
    } catch (cause) {
      setResult(undefined);
      setSampleCount(undefined);
      setError(cause instanceof Error ? cause.message : "入力内容を確認してください。");
    }
  }

  function reset() {
    setRawData("");
    setMean("");
    setStandardDeviation("");
    setLsl("");
    setUsl("");
    setResult(undefined);
    setSampleCount(undefined);
    setError("");
  }

  return (
    <div className="cpk-calculator">
      <section className="cpk-input-panel" aria-labelledby="cpk-input-title">
        <div className="cpk-panel-heading">
          <span>01</span>
          <div><p>INPUT</p><h2 id="cpk-input-title">測定値と規格値を入力</h2></div>
        </div>

        <div className="cpk-mode-tabs" role="group" aria-label="入力方法">
          <button className={mode === "raw" ? "active" : ""} onClick={() => switchMode("raw")} type="button">生データから計算</button>
          <button className={mode === "summary" ? "active" : ""} onClick={() => switchMode("summary")} type="button">平均・標準偏差から計算</button>
        </div>

        {mode === "raw" ? (
          <label className="cpk-field cpk-field--wide">
            <span>測定データ</span>
            <textarea
              inputMode="decimal"
              onChange={(event) => setRawData(event.target.value)}
              placeholder={"10.02\n9.98\n10.05\n10.01"}
              rows={7}
              value={rawData}
            />
            <small>Excelの列をそのまま貼り付けできます。改行・空白・カンマ区切りに対応しています。</small>
          </label>
        ) : (
          <div className="cpk-field-grid">
            <label className="cpk-field"><span>平均値</span><input inputMode="decimal" onChange={(event) => setMean(event.target.value)} placeholder="例：10.01" value={mean} /></label>
            <label className="cpk-field"><span>標準偏差</span><input inputMode="decimal" onChange={(event) => setStandardDeviation(event.target.value)} placeholder="例：0.03" value={standardDeviation} /></label>
          </div>
        )}

        <div className="cpk-field-grid">
          <label className="cpk-field"><span>下限規格（LSL）</span><input inputMode="decimal" onChange={(event) => setLsl(event.target.value)} placeholder="例：9.90" value={lsl} /></label>
          <label className="cpk-field"><span>上限規格（USL）</span><input inputMode="decimal" onChange={(event) => setUsl(event.target.value)} placeholder="例：10.10" value={usl} /></label>
        </div>
        <p className="cpk-field-note">片側規格の場合は、該当する規格値だけ入力してください。</p>

        {error ? <p className="cpk-error" role="alert">{error}</p> : null}
        <div className="cpk-actions">
          <button className="button primary" onClick={calculate} type="button">Cp・Cpkを計算する</button>
          <button className="cpk-reset" onClick={reset} type="button">入力をクリア</button>
        </div>
      </section>

      <section className={`cpk-result-panel${result ? " has-result" : ""}`} aria-live="polite" aria-labelledby="cpk-result-title">
        <div className="cpk-panel-heading">
          <span>02</span>
          <div><p>RESULT</p><h2 id="cpk-result-title">工程能力の計算結果</h2></div>
        </div>
        {result ? (
          <>
            <div className="cpk-primary-result"><small>Cpk</small><strong>{format(result.cpk)}</strong><p>{interpretation(result.cpk)}</p></div>
            <dl className="cpk-metrics">
              <div><dt>Cp</dt><dd>{format(result.cp)}</dd></div>
              <div><dt>Cpu</dt><dd>{format(result.cpu)}</dd></div>
              <div><dt>Cpl</dt><dd>{format(result.cpl)}</dd></div>
              <div><dt>平均</dt><dd>{format(result.mean)}</dd></div>
              <div><dt>標準偏差</dt><dd>{format(result.standardDeviation)}</dd></div>
              {sampleCount ? <div><dt>データ数</dt><dd>{sampleCount}</dd></div> : null}
            </dl>
            <div className="cpk-formula-note">
              <strong>計算条件</strong>
              <p>生データでは標本標準偏差（n−1）を使用しています。片側規格ではCpは算出せず、CpuまたはCplをCpkとして表示します。</p>
            </div>
          </>
        ) : (
          <div className="cpk-empty-result"><span aria-hidden="true">σ</span><p>入力したデータはブラウザ内だけで計算され、サーバーには保存されません。</p></div>
        )}
      </section>
    </div>
  );
}
