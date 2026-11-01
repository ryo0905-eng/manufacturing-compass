"use client";

import { useState } from "react";
import styles from "./litho.module.css";
import { calculateConditions, initialConditions, type Conditions } from "./model";

const defects = [
  { name: "断線・線幅細り", what: "レジストの線が細くなり、途中で途切れます。", cause: "過大な露光量や現像の進みすぎなど。", action: "露光量や現像時間を確認し、線幅を測定します。", shape: "thin" },
  { name: "残渣・ブリッジ", what: "除去したい部分にレジストが残り、線同士がつながります。", cause: "露光不足や現像不足などで、除去したい部分にレジストが残る。", action: "露光量と現像条件、汚染の有無を確認します。", shape: "bridge" },
  { name: "パターン倒れ", what: "細いレジストのパターンが傾いたり倒れたりします。", cause: "細く背の高いレジストが、現像・乾燥時の力などで倒れる。", action: "レジスト形状や膜厚、現像・乾燥条件を見直します。", shape: "collapse" },
  { name: "解像不良", what: "光の像がぼやけ、狙った形を十分に再現できません。", cause: "焦点ずれや光学像のコントラスト不足など。", action: "焦点、露光量、光学条件やレジストを確認します。", shape: "blur" },
] as const;

function Profile({ shape, label }: { shape: string; label: string }) {
  return <svg viewBox="0 0 360 150" role="img" aria-label={`${label}の模式図`} className={styles.defectDiagram}>
    <rect x="20" y="110" width="320" height="25" fill="#a9cfe1"/>
    {shape === "thin" ? <><rect x="75" y="48" width="13" height="62" fill="#798de0"/><rect x="180" y="77" width="13" height="33" fill="#798de0"/><rect x="275" y="48" width="13" height="62" fill="#798de0"/></> : shape === "collapse" ? <><path d="M65 110 L110 55 L125 62 L90 110 Z M165 110 L220 85 L228 98 L190 110 Z M255 110 L285 52 L300 58 L280 110 Z" fill="#798de0"/></> : shape === "blur" ? <><path d="M50 110 Q55 55 90 58 Q125 60 130 110 M145 110 Q155 65 180 65 Q205 65 215 110 M230 110 Q235 55 270 58 Q305 60 310 110" fill="#a6b5e8" stroke="#798de0" strokeWidth="3"/></> : <><rect x="55" y="48" width={shape === "bridge" ? 60 : 38} height="62" fill="#798de0"/><rect x="160" y="48" width={shape === "bridge" ? 60 : 38} height="62" fill="#798de0"/><rect x="265" y="48" width="38" height="62" fill="#798de0"/>{shape === "bridge" && <rect x="110" y="96" width="55" height="14" fill="#798de0"/>}</>}
    <text x="25" y="145" fontSize="11" fill="#40556a">基板 / 現像後のレジスト（模式図）</text>
  </svg>;
}

function Fem({ dose, focus }: Conditions) {
  const doses = Array.from({ length: 13 }, (_, i) => 70 + i * 5);
  const focuses = Array.from({ length: 9 }, (_, i) => 0.4 - i * 0.1);
  return <div className={styles.femWrap}><svg viewBox="0 0 520 310" role="img" aria-label={`焦点・露光量マトリクス。現在の露光量 ${dose}%、焦点 ${focus.toFixed(2)} マイクロメートル`}>
    {focuses.map((f, y) => doses.map((d, x) => <rect key={`${x}-${y}`} x={65 + x * 32} y={20 + y * 25} width="30" height="23" fill={calculateConditions({ dose: d, focus: f }).inSpec ? "#58bcae" : "#e1ebf1"}/>))}
    <circle cx={80 + (dose - 70) / 5 * 32} cy={31.5 + (0.4 - focus) / 0.1 * 25} r="7" fill="#102f54" stroke="white" strokeWidth="3"/>
    {[70, 80, 90, 100, 110, 120, 130].map(d => <text key={d} x={80 + (d - 70) / 5 * 32} y="267" textAnchor="middle" fontSize="11">{d}</text>)}
    {[-0.4, -0.2, 0, 0.2, 0.4].map(f => <text key={f} x="55" y={35 + (0.4 - f) / 0.1 * 25} textAnchor="end" fontSize="11">{f.toFixed(1)}</text>)}
    <text x="270" y="298" textAnchor="middle" fontSize="13">露光量（基準比 %）</text><text transform="translate(14 145) rotate(-90)" textAnchor="middle" fontSize="13">フォーカス（µm）</text>
  </svg><p>🟩 CD規格内（目標 ±10%）　□ 規格外　● 現在条件</p><p>各セルは中心の条件を評価しています。点はスライダーの値を連続的に示します。</p></div>;
}

export function LithoLearningLab() {
  const [dose, setDose] = useState(initialConditions.dose);
  const [focus, setFocus] = useState(initialConditions.focus);
  const [saved, setSaved] = useState<Conditions | null>(null);
  const [selected, setSelected] = useState(0);
  const current = { dose, focus };
  const result = calculateConditions(current);
  const old = saved && calculateConditions(saved);
  const defect = defects[selected];
  const shape = result.state === "パターン倒れ" ? "collapse" : result.state === "解像不良寄り" ? "blur" : result.cd < 90 ? "thin" : result.cd > 110 ? "bridge" : "normal";
  return <>
    <section id="simulator" className={styles.lab}><div className={styles.sectionHeading}><h2><span aria-hidden="true">☷</span> リソグラフィシミュレーター</h2><p>露光量と焦点を変えて、工程余裕を確かめます</p></div>
      <div className={styles.workspace}><div className={styles.visual}><div className={styles.visualHeader}><span>フォーカス・露光量マトリクス（FEM）</span><small>教育用</small></div><Fem {...current}/><h3>現像後のライン断面：{result.state}</h3><Profile shape={shape} label={result.state}/><p>断面は条件に応じた概念図で、欠陥の発生を予測するものではありません。</p></div>
      <div className={styles.controls}><div className={styles.controlHeader}><h3>露光条件</h3><button type="button" onClick={() => { setDose(initialConditions.dose); setFocus(initialConditions.focus); }}>条件をリセット</button></div><p>基準条件を露光量 100%、フォーカス 0 µm とします。</p><div className={styles.control}><label htmlFor="litho-dose">露光量 <output htmlFor="litho-dose">{dose}%</output></label><input id="litho-dose" type="range" min="70" max="130" step="1" value={dose} onChange={e => setDose(Number(e.target.value))}/><div><span>70%</span><span>130%</span></div></div><div className={styles.control}><label htmlFor="litho-focus">フォーカスオフセット <output htmlFor="litho-focus">{focus.toFixed(2)} µm</output></label><input id="litho-focus" type="range" min="-0.4" max="0.4" step="0.01" value={focus} onChange={e => setFocus(Number(e.target.value))}/><div><span>−0.40 µm</span><span>+0.40 µm</span></div></div></div></div>
      <div className={styles.results} aria-live="polite"><div><span>推定 CD / 目標比</span><strong>{result.cd.toFixed(1)}<small> %</small></strong></div><div><span>CD規格判定</span><strong className={styles.risk}>{result.inSpec ? "規格内" : "規格外"}</strong><p>目標の 90〜110%</p></div><div><span>露光量の余裕</span><strong>{result.doseMargin.toFixed(1)}<small> ポイント</small></strong><p>焦点を固定した場合</p></div><div><span>焦点の余裕</span><strong>{result.focusMargin.toFixed(2)}<small> µm</small></strong><p>露光量を固定した場合</p></div></div>
      <section className={styles.comparison}><div className={styles.comparisonHeader}><div><p className={styles.eyebrow}>COMPARE</p><h3>条件を保存して比べる</h3><p>今の条件を保存してから、スライダーを変えてみましょう。</p></div><div className={styles.comparisonActions}><button type="button" onClick={() => setSaved({ ...current })}>{saved ? "現在の条件で保存し直す" : "現在の条件を保存"}</button>{saved && <button type="button" onClick={() => setSaved(null)}>保存を消す</button>}</div></div>{saved && old ? <div className={styles.tableWrap}><table><caption>保存した条件と現在の条件の比較</caption><thead><tr><th>項目</th><th>保存した条件</th><th>現在の条件</th></tr></thead><tbody><tr><th scope="row">露光量</th><td>{saved.dose}%</td><td>{dose}%</td></tr><tr><th scope="row">フォーカス</th><td>{saved.focus.toFixed(2)} µm</td><td>{focus.toFixed(2)} µm</td></tr><tr><th scope="row">推定 CD</th><td>{old.cd.toFixed(1)}%</td><td>{result.cd.toFixed(1)}%</td></tr><tr><th scope="row">判定</th><td>{old.inSpec ? "規格内" : "規格外"}</td><td>{result.inSpec ? "規格内" : "規格外"}</td></tr></tbody></table></div> : <p className={styles.comparisonEmpty}>保存すると、条件と結果をここに並べて表示します。</p>}<p className={styles.comparisonNote}>保存はこの画面を開いている間だけです。リセットは現在の条件にのみ適用されます。</p></section>
      <details className={styles.model}><summary>計算モデルと注意事項</summary><strong>学習モデル：CD = 100 − 0.5 ×（露光量 − 100）＋ 80 × 焦点²</strong><p>ポジレジストの残るラインを想定し、露光量が増えると細く、焦点ずれは符号によらず二次的に太くなると仮定します。余裕は他方の条件を固定したときの CD 規格境界までの距離です。規格外では 0 と表示します。焦点の絶対値が 0.35 µm 以上で CD が目標の 100% 未満の場合はパターン倒れ、それ以外の焦点の絶対値が 0.35 µm 以上の場合は解像不良の模式図を表示します。CD 規格内でも解像不良の図になる場合があります。</p><p>教育用の簡易モデルであり、実測値や特定の装置・レジストの特性を示すものではありません。実際の形状や工程余裕、欠陥発生を予測するものではありません。</p></details>
    </section>
    <section className={styles.defects}><div className={styles.defectHeading}><h2><span aria-hidden="true">▦</span> リソグラフィの主な不良を学ぶ</h2><div className={styles.defectButtons} role="group" aria-label="不良の種類">{defects.map((item, i) => <button key={item.name} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>{item.name}</button>)}</div></div><div className={styles.defectCard}><Profile shape={defect.shape} label={defect.name}/><div><h3>{defect.name}</h3><p>{defect.what}</p><dl><div><dt>主な原因</dt><dd>{defect.cause}</dd></div><div><dt>対策の方向性</dt><dd>{defect.action}</dd></div></dl></div></div></section>
  </>;
}
