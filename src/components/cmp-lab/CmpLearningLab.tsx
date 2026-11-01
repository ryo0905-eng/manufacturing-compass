"use client";

import { useState } from "react";
import styles from "./cmp.module.css";

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
  const mrr = pressure * speed;
  const removal = mrr * time;
  const progress = Math.min(removal, 1);
  const risk = removal < 0.6 ? "研磨不足に注意" : removal > 1.4 ? "過剰研磨に注意" : pressure >= 1.5 ? "傷に注意" : "基準に近い";
  const defect = defects[selected];
  const controls = [
    { id: "pressure", label: "研磨圧力 P", value: pressure, set: setPressure, min: 0.5, max: 2, step: 0.1 },
    { id: "speed", label: "相対速度 V", value: speed, set: setSpeed, min: 0.5, max: 2, step: 0.1 },
    { id: "time", label: "研磨時間 t", value: time, set: setTime, min: 0.2, max: 2, step: 0.1 },
  ];
  return <>
    <section id="simulator" className={styles.lab} aria-labelledby="sim-title"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>01 / EXPLORE</p><h2 id="sim-title">条件を変えて、平坦化を見る</h2></div><p>まずはスライダーを動かして、表面と結果の変化を比べてみましょう。</p></div>
      <div className={styles.workspace}><div className={styles.visual}><div className={styles.visualHeader}><span>表面の変化</span><small>教育用の模式図</small></div><div className={styles.surfaces}><Surface progress={0} label="研磨前 / Before"/><Surface progress={progress / 2} label="途中 / During"/><Surface progress={progress} label="設定条件の結果 / After"/></div><p>高い部分が優先的に削られ、表面の段差が小さくなるイメージです。図は実際の膜厚や形状を再現していません。</p></div>
        <div className={styles.controls}><div className={styles.controlHeader}><h3>研磨条件</h3><button type="button" onClick={() => { setPressure(1); setSpeed(1); setTime(1); }}>リセット</button></div><p>すべて基準条件を 1.0 とした倍率</p>{controls.map(c => <div className={styles.control} key={c.id}><label htmlFor={c.id}>{c.label}<output htmlFor={c.id}>{c.value.toFixed(1)} 倍</output></label><input id={c.id} type="range" min={c.min} max={c.max} step={c.step} value={c.value} onChange={e => c.set(Number(e.target.value))}/><div><span>{c.min.toFixed(1)}</span><span>{c.max.toFixed(1)}</span></div></div>)}</div></div>
      <div className={styles.results} aria-live="polite"><div><span>相対研磨速度</span><strong>{mrr.toFixed(2)} <small>倍</small></strong><p>圧力 × 速度</p></div><div><span>相対除去量</span><strong>{removal.toFixed(2)} <small>倍</small></strong><p>研磨速度 × 時間</p></div><div><span>平坦化の目安</span><strong>{Math.round(progress * 100)}<small> %</small></strong><p>教材上の上限は 100%</p></div><div><span>条件の確認ポイント</span><strong className={styles.risk}>{risk}</strong><p>教材上の目安</p></div></div>
      <div className={styles.model}><strong>学習モデル　MRR = K × P × V</strong><p>研磨速度 MRR は、係数 K、圧力 P、相対速度 V の積で考えます。ここでは K を固定し、基準の圧力・速度・時間をそれぞれ 1.0 としています。平坦化は相対除去量に比例すると仮定し、1.0 で上限に達します。確認ポイントは除去量 0.6 未満で研磨不足、1.4 超で過剰研磨、それ以外で圧力 1.5 以上なら傷に注意とする独自の目安です。</p><p>これは教育用の簡易モデルであり、実際の量産条件や膜種依存を正確に再現するものではありません。実際の結果は材料・膜構成・装置・スラリー・パッド・温度などで変わります。欠陥の発生確率や安全な条件を示すものではありません。</p></div>
    </section>
    <section className={styles.defects} aria-labelledby="defect-title"><p className={styles.eyebrow}>02 / DISCOVER</p><h2 id="defect-title">CMPの不良を見てみよう</h2><p>名前を選ぶと、断面の変化と原因・対策の方向性を確認できます。</p><div className={styles.defectButtons} role="group" aria-label="不良の種類">{defects.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.name}</button>)}</div><div className={styles.defectCard}><DefectDiagram name={defect.name}/><div><p className={styles.eyebrow}>DEFECT MECHANISM</p><h3>{defect.name} <small>（{defect.ja}）</small></h3><p>{defect.what}</p><dl><div><dt>主な原因</dt><dd>{defect.cause}</dd></div><div><dt>対策の方向性</dt><dd>{defect.action}</dd></div></dl></div></div></section>
  </>;
}
