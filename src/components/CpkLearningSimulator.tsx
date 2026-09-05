"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { initialLearningState, learningControls, learningPresets, type LearningState } from "@/data/cpk-learning";
import { comparisonMessage, densityDomain, learningCapability, learningReducer, normalDensity } from "@/lib/cpk-learning";
import { trackEvent } from "@/lib/analytics";
import styles from './CpkLearningSimulator.module.css';

const fixed = (value?: number) => value === undefined ? '—' : value.toFixed(3);
const difference = (before?: number, after?: number) => {
  if (before === undefined || after === undefined) return '—';
  const delta = after - before;
  return `${delta > 0.0005 ? '+' : ''}${Math.abs(delta) < 0.0005 ? '0.000' : delta.toFixed(3)}`;
};

export function CpkLearningSimulator() {
  const [{ current, baseline }, dispatch] = useReducer(learningReducer, { current: initialLearningState, baseline: initialLearningState });
  const trackedControls = useRef(new Set<keyof LearningState>());
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header');
    if (!header) return;
    const measure = () => setHeaderHeight(getComputedStyle(header).position === 'sticky' ? header.getBoundingClientRect().height : 0);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  const result = learningCapability(current);
  const reference = learningCapability(baseline);
  const x = (value: number) => 52 + (value - densityDomain.min) / (densityDomain.max - densityDomain.min) * 600;
  const y = (value: number) => 220 - value / densityDomain.maxDensity * 185;
  const curve = (state: LearningState) => Array.from({ length: 641 }, (_, index) => {
    const value = densityDomain.min + index / 640 * (densityDomain.max - densityDomain.min);
    return `${index ? 'L' : 'M'}${x(value).toFixed(2)},${y(normalDensity(value, state)).toFixed(2)}`;
  }).join(' ');
  function update(key: keyof LearningState, value: number) {
    if (current[key] === value) return;
    dispatch({ type: 'update', key, value });
    if (!trackedControls.current.has(key)) {
      trackedControls.current.add(key);
      trackEvent('cpk_learning_control_used', { control: key });
    }
  }
  const metrics = <>{(['potential', 'performance'] as const).map((key, index) => <div key={key}><strong>{index ? 'Cpk' : 'Cp'}</strong><span>{fixed(reference[key])} → <b>{fixed(result[key])}</b></span><small>増減 {difference(reference[key], result[key])}</small></div>)}</>;

  return <div className={styles.workspace}>
    <section className={styles.summary} style={{ top: headerHeight }} aria-label="工程能力の基準と現在値"><span>基準 → 現在</span><div className={styles.metrics}>{metrics}</div></section>
    <section className={styles.graph} aria-labelledby="cpk-learning-result-title">
      <h2 id="cpk-learning-result-title">分布と工程能力を比べる</h2>
      <figure>
        <svg viewBox="0 0 700 270" role="img" aria-label={`理論正規分布の比較。基準Cp ${fixed(reference.potential)}、Cpk ${fixed(reference.performance)}。現在Cp ${fixed(result.potential)}、Cpk ${fixed(result.performance)}。横軸92から108、縦軸は固定の確率密度。`}>
          <rect x="52" y="28" width="600" height="192" fill="#fff" />
          {[0, 0.4, 0.8, 1.2, 1.6].map(tick => <g key={tick}><line x1="52" x2="652" y1={y(tick)} y2={y(tick)} stroke="#e5e7eb" /><text x="45" y={y(tick) + 4} textAnchor="end">{tick.toFixed(1)}</text></g>)}
          {[92, 96, 100, 104, 108].map(tick => <text key={tick} x={x(tick)} y="240" textAnchor="middle">{tick}</text>)}
          <text x="52" y="17">確率密度</text>
          <path d={curve(baseline)} fill="none" stroke="#737980" strokeWidth="2.5" strokeDasharray="7 5" />
          <path d={curve(current)} fill="none" stroke="#1769aa" strokeWidth="2.5" />
          {(['lsl', 'usl'] as const).map(key => <g key={key}>
            <line x1={x(baseline[key])} x2={x(baseline[key])} y1="28" y2="220" stroke="#737980" strokeWidth="2" strokeDasharray="3 5" />
            <line x1={x(current[key])} x2={x(current[key])} y1="28" y2="220" stroke="#b64c4c" strokeWidth="2" />
            <text x={x(current[key])} y="258" textAnchor="middle">{key.toUpperCase()}</text>
          </g>)}
        </svg>
        <figcaption>曲線：灰色の破線＝比較基準、青の実線＝現在。規格線：灰色の点線＝比較基準、赤の実線＝現在。重なる線は同じ位置です。縦横の目盛りは固定しています。</figcaption>
      </figure>
    </section>
    <section className={styles.controls} aria-labelledby="cpk-learning-controls-title">
      <h2 id="cpk-learning-controls-title">条件を動かす</h2>
      <div className={styles.actions}>
        <button type="button" onClick={() => { dispatch({ type: 'baseline' }); trackEvent('cpk_learning_baseline_set'); }}>今の条件を比較基準にする</button>
        <button type="button" onClick={() => { dispatch({ type: 'reset' }); trackEvent('cpk_learning_reset'); }}>初期値に戻す</button>
      </div>
      <p className={styles.hint}>プリセットは現在値だけを変更します。初期値に戻すと、比較基準も戻ります。</p>
      <div className={styles.presets} aria-label="学習プリセット">{learningPresets.map(preset => <button type="button" key={preset.id} onClick={() => { dispatch({ type: 'preset', state: preset.state }); trackEvent('cpk_learning_preset_selected', { preset: preset.id }); }}>{preset.label}</button>)}</div>
      {learningControls.map(control => <label className={styles.slider} key={control.key} htmlFor={`learning-${control.key}`}><span><b>{control.label}</b><output>{current[control.key].toFixed(2)}</output></span><input id={`learning-${control.key}`} min={control.min} max={control.max} step={control.step} type="range" value={current[control.key]} onChange={event => update(control.key, Number(event.target.value))} /></label>)}
      <p className={styles.hint}>まず平均だけを動かして、CpとCpkの違いを見てみてください。</p>
    </section>
    <section className={styles.explanation} aria-labelledby="cpk-comparison-title">
      <h2 id="cpk-comparison-title">比較基準から、何が変わった？</h2>
      <p>{comparisonMessage(baseline, current)}</p>
      <table><caption>条件の比較</caption><thead><tr><th scope="col">項目</th><th scope="col">基準</th><th scope="col">現在</th></tr></thead><tbody>{learningControls.map(control => <tr key={control.key}><th scope="row">{control.label}</th><td>{baseline[control.key].toFixed(2)}</td><td>{current[control.key].toFixed(2)}</td></tr>)}</tbody></table>
      <aside><strong>学習用の理論例です</strong><p>正規分布と入力した平均・短期標準偏差を前提にしています。Cpkだけで工程の安定性や実際の規格外率を判断することはできません。1.33は品質を保証する境界ではありません。</p><a href="https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm" target="_blank" rel="noopener noreferrer">出典：NIST 工程能力の解説</a><p>出典確認日：2026年9月6日</p></aside>
    </section>
  </div>;
}
