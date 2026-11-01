"use client";

import { useRef, useState } from "react";
import styles from "./cmp.module.css";
import { calculateConditions, initialConditions, materials, type Conditions } from "./model";

const defects = [
  { name: "Dishing", ja: "ディッシング", what: "配線などの幅広い部分が、周囲より皿のようにくぼみます。", cause: "材料ごとの削れやすさの差や、研磨のしすぎ。", action: "材料の選択性や終点、追加研磨の時間を見直します。" },
  { name: "Erosion", ja: "エロージョン", what: "配線が密集する領域全体が、周囲より低くなります。", cause: "配線密度や材料の削れやすさの違い、過剰な研磨。", action: "パターン密度や研磨条件、終点の管理を見直します。" },
  { name: "Scratch", ja: "スクラッチ", what: "研磨面に線状の傷が生じます。", cause: "大きな粒子や異物、パッドとの接触など。", action: "スラリーやパッドの状態、異物管理を確認します。" },
  { name: "Over polish", ja: "過剰研磨", what: "必要な膜まで削られ、残したい厚さを下回ります。", cause: "研磨時間が長すぎる、または除去速度が想定より大きい。", action: "終点の検出と研磨時間、膜厚のばらつきを確認します。" },
  { name: "Under polish", ja: "研磨不足", what: "除去したい膜が残り、凹凸や不要な導電膜が残ります。", cause: "研磨時間が短い、または除去速度が想定より小さい。", action: "残膜を測定し、終点と研磨条件を確認します。" },
] as const;

function Surface({ progress, label, polishing = false }: { progress: number; label: string; polishing?: boolean }) {
  const bump = 22 * (1 - Math.min(progress, 1));
  const y = 91 + Math.min(progress, 1.3) * 17;
  const path = `M20 ${y} C45 ${y} 45 ${y-bump} 70 ${y-bump} S95 ${y} 120 ${y} S145 ${y-bump} 170 ${y-bump} S195 ${y} 220 ${y} S245 ${y-bump} 270 ${y-bump} S295 ${y} 320 ${y} L320 147 L20 147 Z`;
  return <div className={styles.surface}><strong>{label}</strong><svg viewBox="0 0 340 200" role="img" aria-label={`${label}の膜表面の模式図`}>
    {polishing && <g><path d="M160 15v22m-8-8 8 8 8-8" fill="none" stroke="#367cae" strokeWidth="3"/><rect x="151" y="38" width="18" height="23" rx="2" fill="#8babc3"/><ellipse cx="160" cy="66" rx="105" ry="15" fill="#c6d9e6" stroke="#7d9eb6" strokeWidth="2"/><path d="M95 45q65-24 130 0m-10-9 10 9-13 2" fill="none" stroke="#138ed0" strokeWidth="2"/>{[65,95,125,155,185,215,245,275].map((x,i)=><circle key={x} cx={x} cy={87+i%2*4} r="3" fill="#49aafa"/>)}<text x="20" y="25" fontSize="13" fill="#315d7a">研磨パッド</text><text x="235" y="30" fontSize="13" fill="#315d7a">スラリー</text><path d="M267 34l-10 42" stroke="#315d7a"/></g>}
    <rect x="20" y="147" width="300" height="26" fill="#a6b8c8"/><rect x="20" y="127" width="300" height="20" fill="#9dcde5"/><path d={path} fill="#9cbdf3" stroke="#617ad5" strokeWidth="2"/>
    <text x="25" y="190" fill="#496980" fontSize="12">膜表面</text><text x="275" y="190" fill="#496980" fontSize="12">基板</text>
  </svg></div>;
}

function DefectDiagram({ name }: { name: typeof defects[number]["name"] }) {
  return <svg viewBox="0 0 360 160" role="img" aria-label={`${name}の模式断面図`} className={styles.defectDiagram}>
    <rect x="20" y="100" width="320" height="35" fill="#a9cfe1"/><rect x="20" y="55" width="320" height="45" fill="#83b9e4"/>
    <rect x="65" y="55" width="60" height="45" fill="#ffc96c"/><rect x="150" y="55" width="60" height="45" fill="#ffc96c"/><rect x="235" y="55" width="60" height="45" fill="#ffc96c"/>
    {name === "Dishing" && <path d="M65 55 Q95 83 125 55" fill="#e8f5fc" stroke="#286da9" strokeWidth="3"/>}
    {name === "Erosion" && <path d="M20 55 H65 Q180 90 295 55 H340" fill="#f1f9fd" stroke="#286da9" strokeWidth="3"/>}
    {name === "Scratch" && <path d="M125 55 l15 13 13-13 M210 55 l12 9 10-9" fill="none" stroke="#8657ca" strokeWidth="4"/>}
    {name === "Over polish" && <><rect x="20" y="43" width="320" height="19" fill="#f1f9fd"/><path d="M20 62 H340 M20 48 H340" stroke="#db7a46" strokeWidth="2" strokeDasharray="5 4"/></>}
    {name === "Under polish" && <path d="M20 55 V38 H340 V55 Z" fill="#a8b5f1" stroke="#617ad5" strokeWidth="2"/>}
    <text x="25" y="152" fontSize="11" fill="#40556a">基板側</text><text x="245" y="152" fontSize="11" fill="#40556a">概念を示す模式図</text>
  </svg>;
}

export function CmpLearningLab() {
  const comparisonDialog = useRef<HTMLDialogElement>(null);
  const [pressure, setPressure] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(1);
  const [selected, setSelected] = useState(0);
  const [material, setMaterial] = useState<Conditions["material"]>("A");
  const [baseline, setBaseline] = useState<Conditions | null>(null);
  const current: Conditions = { material, pressure, speed, time };
  const { mrr, removal, progress, risk } = calculateConditions(current);
  const baselineResult = baseline ? calculateConditions(baseline) : null;
  const defect = defects[selected];
  const controls = [
    { id: "pressure", label: "研磨圧力 P", value: pressure, set: setPressure, min: 0.5, max: 2, step: 0.1 },
    { id: "speed", label: "相対速度 V", value: speed, set: setSpeed, min: 0.5, max: 2, step: 0.1 },
    { id: "time", label: "研磨時間 t", value: time, set: setTime, min: 0.2, max: 2, step: 0.1 },
  ];
  return <>
    <section id="simulator" className={styles.lab} aria-labelledby="sim-title"><div className={styles.sectionHeading}><h2 id="sim-title"><span aria-hidden="true">☷</span> CMPシミュレーター</h2><p>条件を変えて、平坦化・除去量の変化を体験</p><button type="button" onClick={() => comparisonDialog.current?.showModal()}>条件を比較 ↗</button></div>
      <div className={styles.workspace}><div className={styles.visual}><div className={styles.visualHeader}><span>表面の変化</span><small>教育用の模式図</small></div><div className={styles.surfaces}><Surface progress={0} label="研磨前 / Before"/><Surface progress={progress / 2} label="研磨中 / During" polishing/><Surface progress={progress} label="設定結果 / After"/></div><p>化学作用 ＋ 機械作用で膜を除去し、段差を小さくします。図は実寸・実形状を再現しない概念図です。</p></div>
        <div className={styles.controls}><div className={styles.controlHeader}><h3>研磨条件</h3><button type="button" onClick={() => { setPressure(initialConditions.pressure); setSpeed(initialConditions.speed); setTime(initialConditions.time); setMaterial(initialConditions.material); }}>条件をリセット</button></div><p>シミュレーション用の相対値（基準＝1.0）</p><fieldset className={styles.materials}><legend>架空の膜</legend>{(Object.keys(materials) as Conditions["material"][]).map(key => <label key={key}><input type="radio" name="cmp-material" value={key} checked={material === key} onChange={() => setMaterial(key)}/><span>{materials[key].label} <small>係数 {materials[key].coefficient.toFixed(1)}</small></span></label>)}</fieldset>{controls.map(c => <div className={styles.control} key={c.id}><label htmlFor={c.id}>{c.label}<output htmlFor={c.id}>{c.value.toFixed(1)} 倍</output></label><input id={c.id} type="range" min={c.min} max={c.max} step={c.step} value={c.value} onChange={e => c.set(Number(e.target.value))}/><div><span>{c.min.toFixed(1)}</span><span>{c.max.toFixed(1)}</span></div></div>)}
      <div className={styles.results} aria-live="polite"><div><span>相対研磨速度</span><strong>{mrr.toFixed(2)} <small>倍</small></strong><p>係数 × 圧力 × 速度</p></div><div><span>相対除去量</span><strong>{removal.toFixed(2)} <small>倍</small></strong><p>研磨速度 × 時間</p></div><div><span>平坦化の目安</span><strong>{Math.round(progress * 100)}<small> %</small></strong><p>教材上の上限は 100%</p></div><div><span>条件の確認ポイント</span><strong className={styles.risk}>{risk}</strong><p>教材上の目安</p></div></div></div></div>
      <div className={styles.formula}><strong>MRR = K × P × V</strong><span>教育用の簡易モデル。実際の量産条件・膜種依存や欠陥発生確率は再現しません。</span></div>
      <dialog ref={comparisonDialog} className={styles.dialog} aria-labelledby="comparison-title"><form method="dialog"><button className={styles.closeButton}>閉じる ×</button></form><section className={styles.comparison} aria-labelledby="comparison-title"><div className={styles.comparisonHeader}><div><p className={styles.eyebrow}>COMPARE</p><h3 id="comparison-title">条件を保存して比べる</h3><p>現在の条件を保存し、この画面を閉じて膜やスライダーを変更した後、もう一度比較を開いてください。</p></div><div className={styles.comparisonActions}><button type="button" onClick={() => setBaseline({ ...current })}>{baseline ? "現在の条件で保存し直す" : "現在の条件を保存"}</button>{baseline && <button type="button" onClick={() => setBaseline(null)}>保存を消す</button>}</div></div>
        {baseline && baselineResult ? <div className={styles.tableWrap}><table><caption>保存した条件と現在の条件の比較</caption><thead><tr><th scope="col">項目</th><th scope="col">保存した条件</th><th scope="col">現在の条件</th></tr></thead><tbody><tr><th scope="row">膜（係数）</th><td>{materials[baseline.material].label}（{materials[baseline.material].coefficient.toFixed(1)}）</td><td>{materials[material].label}（{materials[material].coefficient.toFixed(1)}）</td></tr><tr><th scope="row">圧力 / 速度 / 時間</th><td>{baseline.pressure.toFixed(1)} / {baseline.speed.toFixed(1)} / {baseline.time.toFixed(1)} 倍</td><td>{pressure.toFixed(1)} / {speed.toFixed(1)} / {time.toFixed(1)} 倍</td></tr><tr><th scope="row">相対研磨速度</th><td>{baselineResult.mrr.toFixed(2)} 倍</td><td>{mrr.toFixed(2)} 倍</td></tr><tr><th scope="row">相対除去量</th><td>{baselineResult.removal.toFixed(2)} 倍</td><td>{removal.toFixed(2)} 倍</td></tr><tr><th scope="row">平坦化の目安</th><td>{Math.round(baselineResult.progress * 100)}%</td><td>{Math.round(progress * 100)}%</td></tr><tr><th scope="row">確認ポイント</th><td>{baselineResult.risk}</td><td>{risk}</td></tr></tbody></table></div> : <p className={styles.comparisonEmpty}>保存すると、条件と結果をここに並べて表示します。</p>}
        <p className={styles.comparisonNote}>保存はこの画面を開いている間だけです。リセットは現在の条件にのみ適用されます。</p></section></dialog>
      <details className={styles.model}><summary>計算モデルと注意事項</summary><strong>学習モデル　MRR = K × P × V</strong><p>研磨速度 MRR は、係数 K、圧力 P、相対速度 V の積で考えます。基準の圧力・速度・時間をそれぞれ 1.0 とし、膜 A の係数を 1.0、膜 B を 0.6 と仮定しています。係数は教材のための架空値で、特定の材料の優劣や実際の選択比を示しません。平坦化は相対除去量に比例すると仮定し、1.0 で上限に達します。確認ポイントは表示上の除去量が 0.6 未満で研磨不足、1.4 超で過剰研磨、それ以外で圧力 1.5 以上なら傷に注意とする独自の目安です。</p><p>これは教育用の簡易モデルであり、実際の量産条件や膜種依存を正確に再現するものではありません。実際の結果は材料・膜構成・装置・スラリー・パッド・温度などで変わります。欠陥の発生確率や安全な条件を示すものではありません。</p></details>
    </section>
    <section className={styles.defects} aria-labelledby="defect-title"><div className={styles.defectHeading}><h2 id="defect-title"><span aria-hidden="true">▦</span> CMPの主な不良を学ぶ</h2><div className={styles.defectButtons} role="group" aria-label="不良の種類">{defects.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.name}</button>)}</div></div><div className={styles.defectCard}><DefectDiagram name={defect.name}/><div><h3>{defect.name} <small>（{defect.ja}）</small></h3><p>{defect.what}</p><dl><div><dt>主な原因</dt><dd>{defect.cause}</dd></div><div><dt>対策の方向性</dt><dd>{defect.action}</dd></div></dl></div></div></section>
  </>;
}
