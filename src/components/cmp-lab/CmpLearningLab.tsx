"use client";

import { useState } from "react";
import styles from "./cmp.module.css";
import { calculateConditions, initialConditions, materials, type Conditions } from "./model";

const defects = [
  { name: "Dishing", ja: "ディッシング", what: "配線などの幅広い部分が、周囲より皿のようにくぼみます。", cause: "材料ごとの削れやすさの差や、研磨のしすぎ。", action: "材料の選択性や終点、追加研磨の時間を見直します。" },
  { name: "Erosion", ja: "エロージョン", what: "配線が密集する領域全体が、周囲より低くなります。", cause: "配線密度や材料の削れやすさの違い、過剰な研磨。", action: "パターン密度や研磨条件、終点の管理を見直します。" },
  { name: "Scratch", ja: "スクラッチ", what: "研磨面に線状の傷が生じます。", cause: "大きな粒子や異物、パッドとの接触など。", action: "スラリーやパッドの状態、異物管理を確認します。" },
  { name: "Over polish", ja: "過剰研磨", what: "必要な膜まで削られ、残したい厚さを下回ります。", cause: "研磨時間が長すぎる、または除去速度が想定より大きい。", action: "終点の検出と研磨時間、膜厚のばらつきを確認します。" },
  { name: "Under polish", ja: "研磨不足", what: "除去したい膜が残り、凹凸や不要な導電膜が残ります。", cause: "研磨時間が短い、または除去速度が想定より小さい。", action: "残膜を測定し、終点と研磨条件を確認します。" },
] as const;

function Surface({ progress, label }: { progress: number; label: string }) {
  const bump = 26 * (1 - Math.min(progress, 1));
  const y = 49 + Math.min(progress, 1.3) * 19;
  const path = `M20 ${y} C45 ${y} 45 ${y-bump} 70 ${y-bump} S95 ${y} 120 ${y} S145 ${y-bump} 170 ${y-bump} S195 ${y} 220 ${y} S245 ${y-bump} 270 ${y-bump} S295 ${y} 320 ${y} L320 118 L20 118 Z`;
  return <div className={styles.surface}><strong>{label}</strong><svg viewBox="0 0 340 160" role="img" aria-label={`${label}の膜表面の模式図`}><rect x="20" y="118" width="300" height="25" fill="#aebbc9"/><rect x="20" y="90" width="300" height="28" fill="#9dcde5"/><path d={path} fill="#99b9f8" stroke="#617ad5" strokeWidth="2"/><text x="30" y="137" fill="#34465a" fontSize="11">基板</text></svg></div>;
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
    <section id="simulator" className={styles.lab} aria-labelledby="sim-title"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>01 / EXPLORE</p><h2 id="sim-title">条件を変えて、平坦化を見る</h2></div><p>まずはスライダーを動かして、表面と結果の変化を比べてみましょう。</p></div>
      <div className={styles.workspace}><div className={styles.visual}><div className={styles.visualHeader}><span>表面の変化</span><small>教育用の模式図</small></div><div className={styles.surfaces}><Surface progress={0} label="研磨前 / Before"/><Surface progress={progress / 2} label="途中 / During"/><Surface progress={progress} label="設定条件の結果 / After"/></div><p>高い部分が優先的に削られ、表面の段差が小さくなるイメージです。図は実際の膜厚や形状を再現していません。</p></div>
        <div className={styles.controls}><div className={styles.controlHeader}><h3>研磨条件</h3><button type="button" onClick={() => { setPressure(initialConditions.pressure); setSpeed(initialConditions.speed); setTime(initialConditions.time); setMaterial(initialConditions.material); }}>条件をリセット</button></div><p>圧力・速度・時間は基準条件を 1.0 とした倍率</p><fieldset className={styles.materials}><legend>膜と研磨液の組み合わせ</legend>{(Object.keys(materials) as Conditions["material"][]).map(key => <label key={key}><input type="radio" name="cmp-material" value={key} checked={material === key} onChange={() => setMaterial(key)}/><span>{materials[key].label} <small>係数 {materials[key].coefficient.toFixed(1)}</small></span></label>)}<p>同じ研磨液を使う架空の例です。係数は実測値ではありません。</p></fieldset>{controls.map(c => <div className={styles.control} key={c.id}><label htmlFor={c.id}>{c.label}<output htmlFor={c.id}>{c.value.toFixed(1)} 倍</output></label><input id={c.id} type="range" min={c.min} max={c.max} step={c.step} value={c.value} onChange={e => c.set(Number(e.target.value))}/><div><span>{c.min.toFixed(1)}</span><span>{c.max.toFixed(1)}</span></div></div>)}</div></div>
      <div className={styles.results} aria-live="polite"><div><span>相対研磨速度</span><strong>{mrr.toFixed(2)} <small>倍</small></strong><p>係数 × 圧力 × 速度</p></div><div><span>相対除去量</span><strong>{removal.toFixed(2)} <small>倍</small></strong><p>研磨速度 × 時間</p></div><div><span>平坦化の目安</span><strong>{Math.round(progress * 100)}<small> %</small></strong><p>教材上の上限は 100%</p></div><div><span>条件の確認ポイント</span><strong className={styles.risk}>{risk}</strong><p>教材上の目安</p></div></div>
      <section className={styles.comparison} aria-labelledby="comparison-title"><div className={styles.comparisonHeader}><div><p className={styles.eyebrow}>COMPARE</p><h3 id="comparison-title">条件を保存して比べる</h3><p>今の条件を保存してから、膜やスライダーを変えてみましょう。</p></div><div className={styles.comparisonActions}><button type="button" onClick={() => setBaseline({ ...current })}>{baseline ? "現在の条件で保存し直す" : "現在の条件を保存"}</button>{baseline && <button type="button" onClick={() => setBaseline(null)}>保存を消す</button>}</div></div>
        {baseline && baselineResult ? <div className={styles.tableWrap}><table><caption>保存した条件と現在の条件の比較</caption><thead><tr><th scope="col">項目</th><th scope="col">保存した条件</th><th scope="col">現在の条件</th></tr></thead><tbody><tr><th scope="row">膜（係数）</th><td>{materials[baseline.material].label}（{materials[baseline.material].coefficient.toFixed(1)}）</td><td>{materials[material].label}（{materials[material].coefficient.toFixed(1)}）</td></tr><tr><th scope="row">圧力 / 速度 / 時間</th><td>{baseline.pressure.toFixed(1)} / {baseline.speed.toFixed(1)} / {baseline.time.toFixed(1)} 倍</td><td>{pressure.toFixed(1)} / {speed.toFixed(1)} / {time.toFixed(1)} 倍</td></tr><tr><th scope="row">相対研磨速度</th><td>{baselineResult.mrr.toFixed(2)} 倍</td><td>{mrr.toFixed(2)} 倍</td></tr><tr><th scope="row">相対除去量</th><td>{baselineResult.removal.toFixed(2)} 倍</td><td>{removal.toFixed(2)} 倍</td></tr><tr><th scope="row">平坦化の目安</th><td>{Math.round(baselineResult.progress * 100)}%</td><td>{Math.round(progress * 100)}%</td></tr><tr><th scope="row">確認ポイント</th><td>{baselineResult.risk}</td><td>{risk}</td></tr></tbody></table></div> : <p className={styles.comparisonEmpty}>保存すると、条件と結果をここに並べて表示します。</p>}
        <p className={styles.comparisonNote}>保存はこの画面を開いている間だけです。リセットは現在の条件にのみ適用されます。</p></section>
      <div className={styles.model}><strong>学習モデル　MRR = K × P × V</strong><p>研磨速度 MRR は、係数 K、圧力 P、相対速度 V の積で考えます。基準の圧力・速度・時間をそれぞれ 1.0 とし、膜 A の係数を 1.0、膜 B を 0.6 と仮定しています。係数は教材のための架空値で、特定の材料の優劣や実際の選択比を示しません。平坦化は相対除去量に比例すると仮定し、1.0 で上限に達します。確認ポイントは表示上の除去量が 0.6 未満で研磨不足、1.4 超で過剰研磨、それ以外で圧力 1.5 以上なら傷に注意とする独自の目安です。</p><p>これは教育用の簡易モデルであり、実際の量産条件や膜種依存を正確に再現するものではありません。実際の結果は材料・膜構成・装置・スラリー・パッド・温度などで変わります。欠陥の発生確率や安全な条件を示すものではありません。</p></div>
    </section>
    <section className={styles.defects} aria-labelledby="defect-title"><p className={styles.eyebrow}>02 / DISCOVER</p><h2 id="defect-title">CMPの不良を見てみよう</h2><p>名前を選ぶと、断面の変化と原因・対策の方向性を確認できます。</p><div className={styles.defectButtons} role="group" aria-label="不良の種類">{defects.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.name}</button>)}</div><div className={styles.defectCard}><DefectDiagram name={defect.name}/><div><p className={styles.eyebrow}>DEFECT MECHANISM</p><h3>{defect.name} <small>（{defect.ja}）</small></h3><p>{defect.what}</p><dl><div><dt>主な原因</dt><dd>{defect.cause}</dd></div><div><dt>対策の方向性</dt><dd>{defect.action}</dd></div></dl></div></div></section>
  </>;
}
