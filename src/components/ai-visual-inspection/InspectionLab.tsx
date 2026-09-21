"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { inspectionKinds, inspectionModels, inspectionSteps, inspectionTextures, inspectionRelease } from "@/data/ai-visual-inspection";
import { InspectionClient } from "@/lib/ai-visual-inspection/client";
import { changeLighting, inspectRule } from "@/lib/ai-visual-inspection/processing";
import { countErrors, maskIoU } from "@/lib/ai-visual-inspection/evaluation";
import { loadLesson } from "@/lib/ai-visual-inspection/lesson";
import type { LessonMode, LessonSample } from "@/lib/ai-visual-inspection/lesson";
import { ASSET_ROOT, MODEL_IDS } from "@/lib/ai-visual-inspection/protocol";
import type { ImageResult, InspectionSettings, ModelId } from "@/lib/ai-visual-inspection/protocol";
import { trackEvent } from "@/lib/analytics";
import { InspectionImage } from "./InspectionImage";
import styles from "./inspection.module.css";

const defaults: InspectionSettings = { model: "balanced", gain: 1, rule: { threshold: 112, minimumArea: 12, corrected: false }, scoreThreshold: .5, minimumArea: 12 };
type Training = Record<ModelId, { total: number; counts: Record<string, number>; examples: { file: string; kind: keyof typeof inspectionKinds; texture: keyof typeof inspectionTextures; taughtDefective: boolean; labelAltered: boolean }[] }>;
type Filter = "all" | "missed" | "rejected";
function event(name: "start" | "step_complete" | "model_change" | "lighting_change" | "confirmation" | "finish" | "error" | "related", category: string) {
  // Only call with fixed categories below. Never send images, results or slider values.
  trackEvent(`visual_inspection_${name}`, { lesson_version: inspectionRelease.version, category });
}
function Control({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (n: number) => void }) {
  const change = (value: string) => { if (value !== "" && Number.isFinite(Number(value))) onChange(Math.max(min, Math.min(max, Math.round(Number(value) / step) * step))); };
  return <label className={styles.control}><span>{label}</span><input type="range" min={min} max={max} step={step} value={value} onChange={e => change(e.target.value)} /><input aria-label={`${label} 数値入力`} type="number" min={min} max={max} step={step} value={Number(value.toFixed(2))} onChange={e => change(e.target.value)} /></label>;
}
function Counts({ title, decisions, truth }: { title: string; decisions: (boolean | null)[]; truth: boolean[] }) {
  const counts = truth.length ? countErrors(decisions, truth) : null;
  return <section className={styles.count}><h3>{title}</h3><p>不良品を通した <strong>{counts ? `${counts.missed} / ${counts.bad}` : "未評価"}</strong><small>母数：不良品</small></p><p>良品をはじいた <strong>{counts ? `${counts.rejected} / ${counts.good}` : "未評価"}</strong><small>母数：良品</small></p></section>;
}

export function InspectionLab() {
  const [started, setStarted] = useState(false), [step, setStep] = useState(0);
  const [settings, setSettings] = useState(defaults), [locked, setLocked] = useState<InspectionSettings | null>(null);
  const [data, setData] = useState<{ mode: LessonMode; rows: LessonSample[] } | null>(null);
  const [loadError, setLoadError] = useState(""), [retry, setRetry] = useState(0);
  const [outcome, setOutcome] = useState<{ key: string; results: ImageResult[]; changed: number[] } | null>(null);
  const [failure, setFailure] = useState<{ key: string; message: string } | null>(null);
  const [selected, setSelected] = useState(0), [filter, setFilter] = useState<Filter>("all"), [showTruth, setShowTruth] = useState(false);
  const [training, setTraining] = useState<Training | null>(null), [trainingError, setTrainingError] = useState(false);
  const [choice, setChoice] = useState(""), [reason, setReason] = useState(""), [finished, setFinished] = useState(false);
  const client = useRef<InspectionClient | null>(null);
  const previous = useRef<{ dataset: string; decisions: boolean[] } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null), opener = useRef<HTMLElement | null>(null);
  const mode: LessonMode = step === 4 && locked ? "confirmation" : "practice";
  const activeSettings = step === 4 && locked ? locked : settings;
  const rows = useMemo(() => data?.mode === mode ? data.rows.filter(row => step !== 0 || row.texture === "flat" && row.kind !== "scratch") : [], [data, mode, step]);
  const key = JSON.stringify([rows.map(row => row.id), activeSettings, retry]);
  const results = outcome?.key === key ? outcome.results : null;
  const error = failure?.key === key ? failure.message : "";
  const processed = useMemo(() => rows.map(row => { const image = changeLighting(row.image, activeSettings.gain); return { image, rule: inspectRule(image, activeSettings.rule) }; }), [rows, activeSettings]);
  const truth = rows.map(row => row.defective);
  const ruleDecisions = processed.map(row => row.rule.defective), aiDecisions = rows.map((_, i) => results?.[i].ai.defective ?? null);
  const index = Math.min(selected, Math.max(0, rows.length - 1)), sample = rows[index];
  const current = processed[index], ai = results?.[index].ai;

  useEffect(() => { client.current = new InspectionClient(); return () => { client.current?.dispose(); }; }, []);
  useEffect(() => {
    if (!started) return;
    const controller = new AbortController();
    setLoadError("");
    loadLesson(mode, controller.signal).then(rows => { if (!controller.signal.aborted) setData({ mode, rows }); }).catch(() => { if (!controller.signal.aborted) { setLoadError("教材画像を読み込めませんでした。"); event("error", "lesson_load"); } });
    return () => controller.abort();
  }, [started, mode, retry]);
  useEffect(() => {
    if (step !== 2 || training) return;
    const controller = new AbortController();
    setTrainingError(false);
    fetch(`${ASSET_ROOT}/lesson/training.json`, { signal: controller.signal }).then(response => { if (!response.ok) throw Error(); return response.json(); }).then(value => { if (!controller.signal.aborted) setTraining(value); }).catch(() => { if (!controller.signal.aborted) setTrainingError(true); });
    return () => controller.abort();
  }, [step, training, retry]);
  useEffect(() => {
    if (!rows.length) return;
    let active = true;
    const timer = setTimeout(() => {
      const dataset = rows.map(row => row.id).join(",");
      client.current!.inspect({ images: rows.map(row => row.image), settings: activeSettings }).then(response => {
        if (!active) return;
        const decisions = response.results.flatMap(row => [row.rule.defective, row.ai.defective]);
        const old = previous.current;
        const changed = rows.flatMap((_, i) => old?.dataset === dataset && (old.decisions[i*2] !== decisions[i*2] || old.decisions[i*2+1] !== decisions[i*2+1]) ? [i] : []);
        previous.current = { dataset, decisions };
        setOutcome({ key, results: response.results, changed });
        setFailure(null);
      }).catch(error => { if (active && error.name !== "AbortError") { setFailure({ key, message: "AIは未評価です。読み込み・実行に失敗しました。" }); event("error", "inference"); } });
    }, 120);
    return () => { active = false; clearTimeout(timer); };
  }, [key, rows, activeSettings]);

  function go(next: number) { event("step_complete", String(step + 1)); setStep(next); setSelected(0); setFilter("all"); }
  function openZoom() { opener.current = document.activeElement as HTMLElement; dialog.current?.showModal(); }
  function comparison() { return sample && current ? <div className={styles.comparison}>
    <figure><figcaption>ルール <strong>{current.rule.defective ? "停止：不良判定" : "通過：良品判定"}</strong></figcaption><InspectionImage image={current.image} mask={current.rule.mask} truth={showTruth ? sample.truth : undefined} label={`画像${index+1} ルールの検出領域。${current.rule.defective ? "不良判定" : "良品判定"}`} /></figure>
    <figure><figcaption>AI <strong>{ai ? ai.defective ? "停止：不良判定" : "通過：良品判定" : "未評価"}</strong></figcaption><InspectionImage image={current.image} mask={ai?.mask} truth={showTruth ? sample.truth : undefined} label={`画像${index+1} AIの検出領域。${ai ? ai.defective ? "不良判定" : "良品判定" : "未評価"}`} /></figure>
  </div> : null; }
  if (!started) return <section className={styles.start}><p>同じ基板画像を、2つの方法で検査します。</p><button type="button" onClick={() => { setStarted(true); event("start", "lesson"); }}>約5分の体験を始める</button><p className={styles.small}>教育用合成画像・端末内推論。初回にモデルと実行用ファイルを取得します。</p></section>;
  return <section className={styles.lab} aria-label="AI外観検査の操作画面">
    <nav className={styles.steps} aria-label="体験の段階">{inspectionSteps.map((s, i) => <button key={s.title} type="button" aria-current={step === i ? "step" : undefined} onClick={() => go(i)}>{i+1}. {s.title}</button>)}</nav>
    <h2>{inspectionSteps[step].title}</h2><p>{inspectionSteps[step].hint}</p>
    <p className={styles.small}>{mode === "practice" ? "練習用：調整を繰り返す画像です。未知画像への性能とは呼びません。" : "確認済み：練習とは別の固定24枚。開発側では評価済みで、実工場の未知画像への保証ではありません。"}</p>
    {loadError && <p role="alert">{loadError} <button onClick={() => setRetry(n => n+1)}>再読み込み</button></p>}
    {!sample && !loadError && <p role="status">教材画像を読み込み中…</p>}
    <fieldset disabled={step === 4} className={styles.controls}><legend>検査の設定{step === 4 ? "（固定中）" : ""}</legend>
      <Control label={activeSettings.rule.corrected ? "周囲との明るさの差" : "暗さのしきい値"} value={activeSettings.rule.threshold} min={0} max={255} onChange={threshold => setSettings(s => ({ ...s, rule: { ...s.rule, threshold } }))} />
      <Control label="最小検出面積（画素）" value={activeSettings.rule.minimumArea} min={1} max={100} onChange={minimumArea => setSettings(s => ({ ...s, rule: { ...s.rule, minimumArea } }))} />
      {step > 0 && <label><input type="checkbox" checked={activeSettings.rule.corrected} onChange={e => setSettings(s => ({ ...s, rule: { ...s.rule, corrected: e.target.checked, threshold: e.target.checked ? 8 : 112 } }))} />照明むら補正（しきい値も初期値へ切替）</label>}
      {step > 0 && <Control label="AIの欠陥らしさのしきい値" value={activeSettings.scoreThreshold} min={.1} max={.9} step={.05} onChange={scoreThreshold => setSettings(s => ({ ...s, scoreThreshold }))} />}
      {step >= 3 && <Control label="撮影の明るさ（倍率）" value={activeSettings.gain} min={.7} max={1.3} step={.1} onChange={gain => { setSettings(s => ({ ...s, gain })); event("lighting_change", "adjusted"); }} />}
      {step >= 3 && <button type="button" onClick={() => { setSettings(s => ({ ...s, gain: 1 })); event("lighting_change", "standard"); }}>明るさを標準に戻す</button>}
    </fieldset>
    {step === 2 && <section className={styles.training}><label htmlFor="inspection-model">この例で事前学習したモデルに切り替える</label><select id="inspection-model" value={settings.model} onChange={e => { const model = e.target.value as ModelId; setSettings(s => ({ ...s, model })); event("model_change", model); }}>{MODEL_IDS.map(id => <option key={id} value={id}>{inspectionModels[id]}</option>)}</select>
      <p>今ここで学習しているわけではありません。</p>{training && <><p>学習は計{training[settings.model].total.toLocaleString()}枚。良品ラベル{training[settings.model].counts.good ?? 0}枚・汚れ{training[settings.model].counts.dirt ?? 0}枚・傷{training[settings.model].counts.scratch ?? 0}枚。</p><details><summary>実際に教えた画像の代表例</summary><p>種類・模様・ラベル変更の各組合せから先頭の1枚を表示。この数枚だけで学習したものではありません。</p><div className={styles.thumbnails}>{training[settings.model].examples.map(example => <figure key={example.file}>{/* Native image preserves the 128px grayscale teaching asset. */}<img src={`${ASSET_ROOT}/lesson/${example.file}`} width={128} height={128} alt={`${inspectionKinds[example.kind]}・${inspectionTextures[example.texture]}。${example.taughtDefective ? "不良" : "良品"}として教えた例`} /><figcaption>{example.taughtDefective ? "不良" : "良品"}として教えた{example.labelAltered ? "（誤ラベル）" : ""}</figcaption></figure>)}</div></details></>}{trainingError && <p role="alert">学習例を読み込めませんでした。<button onClick={() => setRetry(n => n+1)}>再読み込み</button></p>}</section>}
    {step === 4 && <div className={styles.confirmation}><button disabled={!sample || !results} onClick={() => { setLocked(structuredClone(settings)); setSelected(0); setFilter("all"); event("confirmation", locked ? "seen_again" : "open"); }}>{locked ? "現在の練習設定で、確認済み24枚を再評価" : "設定を固定して、別の24枚を開く"}</button><p className={styles.small}>ルール：{activeSettings.rule.corrected ? "補正あり" : "基本"}・しきい値{activeSettings.rule.threshold}・面積{activeSettings.rule.minimumArea} ／ AI：{inspectionModels[activeSettings.model]}・しきい値{activeSettings.scoreThreshold}・面積12 ／ 明るさ{activeSettings.gain}倍</p></div>}
    <p className={styles.small}>使用中のAI：{inspectionModels[activeSettings.model]} ／ AIの最小検出面積：12画素</p>
    {sample && current && <>
      <div className={styles.toolbar}><button disabled={index === 0} onClick={() => setSelected(index-1)}>前の画像</button><strong>画像 {index+1} / {rows.length} · 正解：{sample.defective ? `不良（${inspectionKinds[sample.kind]}）` : "良品"}</strong><button disabled={index === rows.length-1} onClick={() => setSelected(index+1)}>次の画像</button></div>
      {comparison()}
      <div className={styles.toolbar}><span>━━ 検出領域</span><label><input type="checkbox" checked={showTruth} onChange={e => setShowTruth(e.target.checked)} />┄┄ 正解領域を重ねる</label><button onClick={openZoom}>同じ画像を拡大</button></div>
      <p role="status" aria-live="polite">{error || (!results ? "AIを評価中… 件数は全画像の処理後に更新します。" : `全${rows.length}枚の評価完了。前回から${outcome?.changed.length ?? 0}枚の良否判定が変わりました。`)}</p>
      {error && <button onClick={() => setRetry(n => n+1)}>AIを再試行</button>}
      <div className={styles.metrics}><Counts title="ルール" decisions={ruleDecisions} truth={truth} /><Counts title="AI" decisions={aiDecisions} truth={truth} />{step === 4 && <Counts title="併用：どちらかが不良なら止める" decisions={aiDecisions.map((v, i) => v === null ? null : v || ruleDecisions[i])} truth={truth} />}</div>
      <label htmlFor="inspection-filter">画像一覧</label><select id="inspection-filter" value={filter} onChange={e => setFilter(e.target.value as Filter)}><option value="all">すべて</option><option value="missed">見逃した画像（どちらかの方式）</option><option value="rejected">はじいた良品（どちらかの方式）</option></select>
      <div className={styles.thumbnails}>{rows.map((row, i) => { const missed = row.defective && (!ruleDecisions[i] || aiDecisions[i] === false); const rejected = !row.defective && (ruleDecisions[i] || aiDecisions[i] === true); if (filter === "missed" && !missed || filter === "rejected" && !rejected) return null; return <button key={row.id} aria-pressed={index === i} onClick={() => { setSelected(i); opener.current = document.activeElement as HTMLElement; dialog.current?.showModal(); }}><InspectionImage image={processed[i].image} label={`画像${i+1} 正解：${row.defective ? "不良" : "良品"}`} /><span>{i+1} · {row.defective ? "不良" : "良品"}{missed ? "／見逃し" : rejected ? "／過検出" : ""}{results && outcome?.changed.includes(i) ? "／△変更" : ""}</span></button>; })}</div>
      <details><summary>詳しく見る：検出位置と比較の前提</summary><p>AIは欠陥領域を出す小型U-Netです。欠陥らしさは校正済みの確率ではありません。検出領域から良否を決めています。</p><p>選択画像の領域一致率（IoU）：ルール {formatIoU(maskIoU(current.rule.mask, sample.truth))} ／ AI {ai ? formatIoU(maskIoU(ai.mask, sample.truth)) : "未評価"}。欠陥も検出もない場合は対象なしです。</p><p>このルールは二値化・8近傍の連結領域・面積除去だけです。照明補正以外にも、位置合わせ・形状処理・テンプレート照合で改善できる場合があります。</p><p>学習・調整・評価は元の基板単位で分割しています。この画面は限られた練習・確認画像の比較で、方式全体の優劣を示しません。AIモデルの学習枚数は各2,400枚、16エポック、1,200更新です。</p></details>
      <dialog ref={dialog} aria-labelledby="inspection-zoom-title" className={styles.dialog} onClose={() => opener.current?.focus()}><button autoFocus onClick={() => dialog.current?.close()}>閉じる（Esc）</button><h2 id="inspection-zoom-title">画像{index+1}を比較</h2>{comparison()}<p>実線：検出領域 ／ 破線：正解領域{showTruth ? "" : "（表示OFF）"}</p></dialog>
    </>}
    {step === 4 && locked && <section className={styles.reflection}><h3>この条件なら、どう採用しますか？</h3><p>ルール：設定と撮像の調整。AI：画像収集・領域ラベル作成・学習後の検証。併用：両方の準備と検証が必要です。</p><label htmlFor="inspection-choice">採用候補</label><select id="inspection-choice" value={choice} onChange={e => { setChoice(e.target.value); setFinished(false); }}><option value="">選んでください</option>{["ルール", "AI", "併用", "追加検証"].map(v => <option key={v}>{v}</option>)}</select><label htmlFor="inspection-reason">重視したこと</label><select id="inspection-reason" value={reason} onChange={e => { setReason(e.target.value); setFinished(false); }}><option value="">選んでください</option>{["見逃しを抑える", "良品をはじきすぎない", "設定・データ準備の負担", "撮影条件への対応"].map(v => <option key={v}>{v}</option>)}</select><button disabled={!choice || !reason || !results} onClick={() => { setFinished(true); event("finish", "reflection"); }}>この理由で振り返りを終える</button>{finished && <p role="status">「{choice}」を「{reason}」から選びました。一律の正解はありません。撮像条件と必要な検証を現場ごとに考えましょう。</p>}<p><Link href="/tools/gage-rr" onClick={() => event("related", "gage_rr")}>次はGage R&amp;Rで、連続値の測定ばらつきを体験 →</Link></p></section>}
    <div className={styles.toolbar}>{step > 0 && <button onClick={() => go(step-1)}>ひとつ前へ</button>}{step < 4 && <button disabled={!sample} onClick={() => go(step+1)}>次へ：{inspectionSteps[step+1].title}</button>}<button onClick={() => { setSettings(defaults); go(0); setChoice(""); setReason(""); setFinished(false); }}>練習を最初から（確認済みは保持）</button></div>
  </section>;
}
function formatIoU(value: number | null) { return value === null ? "対象なし" : `${(value * 100).toFixed(1)}%`; }
