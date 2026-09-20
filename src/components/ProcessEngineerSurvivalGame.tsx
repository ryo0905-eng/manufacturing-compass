"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from "react";
import { GAME_LOCATIONS, GAME_VERSION, LEARNING_ITEMS, RULES } from "@/data/process-engineer-survival";
import { clockFor, resultFor, SurvivalRuntime } from "@/lib/process-engineer-survival";
import { trackGameEvent } from "@/lib/analytics";
import { ProcessEngineerSurvivalCanvas, type Direction, type SurvivalCanvasHandle } from "./ProcessEngineerSurvivalCanvas";

const context = { stage_id: "monday-morning", game_version: GAME_VERSION } as const;
const meters = [["hp", "HP"], ["san", "SAN"], ["yield", "Yield"], ["trust", "Trust"], ["boss", "Boss"]] as const;

export function ProcessEngineerSurvivalGame() {
  const [runtime] = useState(() => new SurvivalRuntime());
  const state = useSyncExternalStore(runtime.subscribe, runtime.getSnapshot, runtime.getSnapshot);
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [nearby, setNearby] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const handle = useRef<SurvivalCanvasHandle | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const lastNotice = useRef(0);
  const completeSent = useRef(false);
  const region = useRef<HTMLDivElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const pauseButton = useRef<HTMLButtonElement>(null);
  const result = resultFor(state);

  const onReady = useCallback((value: SurvivalCanvasHandle | null) => { handle.current = value; setReady(Boolean(value)); }, []);
  const onError = useCallback(() => { setError(true); runtime.pause(); }, [runtime]);
  const onNearby = useCallback((value: string | null) => setNearby(value), []);

  const enableSound = () => {
    try {
      if (!audio.current) audio.current = new AudioContext();
      void audio.current.resume().catch(() => {});
    } catch { /* The game is fully playable without audio. */ }
  };
  const pause = useCallback(() => { runtime.pause(); handle.current?.clear(); }, [runtime]);
  useEffect(() => {
    const visibility = () => { if (document.hidden) pause(); };
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("blur", pause);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [pause]);
  useEffect(() => () => { void audio.current?.close().catch(() => {}); }, []);
  useEffect(() => {
    if (state.phase === "paused") pauseButton.current?.focus();
    if (state.phase === "finished") resultHeading.current?.focus();
  }, [state.phase]);
  useEffect(() => {
    const notice = state.notice;
    if (!notice || lastNotice.current === notice.serial) return;
    lastNotice.current = notice.serial;
    if (notice.kind === "repair") trackGameEvent("game_repair_complete", { ...context, trouble_id: notice.troubleId!, station_id: notice.location });
    const sound = audio.current;
    if (muted || !sound || sound.state !== "running") return;
    const frequencies = notice.kind === "repair" ? [440, 554, 660 + notice.combo * 55] : [520, 780];
    frequencies.forEach((frequency, index) => {
      const oscillator = sound.createOscillator(), gain = sound.createGain();
      const at = sound.currentTime + index * .065;
      oscillator.type = "square"; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.0001, at);
      gain.gain.exponentialRampToValueAtTime(.035, at + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, at + .12);
      oscillator.connect(gain); gain.connect(sound.destination);
      oscillator.start(at); oscillator.stop(at + .13);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  }, [state.notice, muted]);
  useEffect(() => {
    if (state.phase !== "finished" || completeSent.current) return;
    completeSent.current = true;
    trackGameEvent("game_complete", { ...context, ending: "clocked_out", title_id: result.title.id,
      resolved_band: state.resolved >= 8 ? "8_plus" : state.resolved >= 5 ? "5_to_7" : "0_to_4" });
  }, [state.phase, state.resolved, result.title.id]);

  const start = (retry: boolean) => {
    enableSound();
    handle.current?.clear();
    if (retry) { setReady(false); setRun(value => value + 1); trackGameEvent("game_retry", context); }
    lastNotice.current = 0; completeSent.current = false;
    setNearby(null); setShareMessage(""); runtime.start();
    trackGameEvent("game_start", context);
    region.current?.focus();
  };
  const resume = () => { enableSound(); handle.current?.clear(); runtime.resume(); region.current?.focus(); };
  const share = async () => {
    const text = `製造技術者サバイバル：${result.title.label}\n${state.score}点 / 復旧${state.resolved}件 / 最大${state.bestCombo}連続\nhttps://mfg-compass.com/games/process-engineer-survival`;
    try { await navigator.clipboard.writeText(text); setShareMessage("結果をコピーしました"); }
    catch { setShareMessage(text); }
  };
  const pointer = (event: PointerEvent<HTMLButtonElement>, action: () => void) => {
    event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); action();
  };
  const key = (event: KeyboardEvent<HTMLButtonElement>, action: () => void) => {
    if (event.key === " " || event.key === "Enter") { event.preventDefault(); if (!event.repeat) action(); }
  };
  const playing = state.phase === "playing" && ready;
  const nearest = GAME_LOCATIONS.find(l => l.id === nearby);
  const instructions = state.work ? "長押し中…離すと中断・修理の進捗は保持" : nearest ? `${nearest.label}：ACTION長押し` : "警告の設備へ移動 → ACTION長押し";
  return <section className="survival-game" aria-label="製造技術者サバイバル">
    <div className="survival-toolbar">
      <span>3 MIN SHIFT · 月曜日の朝</span>
      <button type="button" aria-pressed={muted} onClick={() => { if (muted) enableSound(); setMuted(!muted); }}>音 {muted ? "OFF" : "ON"}</button>
      <button type="button" disabled={!playing} onClick={pause}>一時停止</button>
    </div>
    <div className="survival-hud" aria-label="現在のステータス">
      {meters.map(([id, label]) => <div className="survival-meter" key={id}><div><span>{label}</span><strong>{Math.round(state[id])}{id === "yield" ? "%" : ""}</strong></div><span className="survival-meter__track" aria-hidden="true"><i style={{ width: `${state[id]}%` }} /></span></div>)}
      <div className="survival-clock"><span>TIME</span><strong>{clockFor(state)}</strong><small>あと{Math.ceil(RULES.duration - state.elapsed)}秒</small></div>
    </div>
    <div className="survival-scorebar">
      <strong>{state.score.toLocaleString()} pts</strong><span>復旧 {state.resolved}件</span>
      <strong className="survival-combo">{state.elapsed - state.lastRepair <= RULES.comboWindow ? `×${state.combo} CHAIN · あと${Math.max(0, Math.ceil(RULES.comboWindow - state.elapsed + state.lastRepair))}秒` : "12秒以内の連続復旧でボーナス"}</strong>
    </div>
    <div ref={region} tabIndex={-1} className="survival-stage" aria-label="工場アクション操作領域" onPointerDown={event => {
      if (state.phase === "playing" && !(event.target as HTMLElement).closest("button, a")) region.current?.focus();
    }}>
      <ProcessEngineerSurvivalCanvas key={run} runtime={runtime} onReady={onReady} onNearbyChange={onNearby} onError={onError} />
      {error ? <div className="survival-overlay"><h2>マップを読み込めませんでした</h2><p>通信状況を確認して再読み込みしてください。</p><button onClick={() => window.location.reload()}>再読み込み</button></div> :
        state.phase === "intro" ? <div className="survival-overlay survival-intro">
          <p className="survival-kicker">180 SECONDS / MONDAY SHIFT</p><h2>止まったラインを、動かそう。</h2>
          <p>まず目の前の設備Aへ。ACTIONを3秒長押しで復旧！ 次の警告は自分の順番でさばこう。</p>
          <ul><li>移動：矢印 / WASD　ダッシュ：Shift</li><li>作業：Space / Enter長押し（スマホは下のボタン）</li><li>◆ 現場・解析PCでヒント → 復旧が1秒に</li><li>12秒以内の連続復旧で最大5倍！</li></ul>
          <button disabled={!ready} onClick={() => start(false)}>{ready ? "8:00 出社する" : "工場を準備中…"}</button>
        </div> : state.phase === "paused" ? <div className="survival-overlay"><h2>ひと息つこう。</h2><p>時計は止まっています。準備ができたら再開してください。</p><button ref={pauseButton} onClick={resume}>仕事に戻る</button></div> :
        state.phase === "finished" ? <div className="survival-overlay survival-result">
          <p className="survival-kicker">17:00 / SHIFT COMPLETE</p><h2 ref={resultHeading} tabIndex={-1}>{result.title.label}</h2><p>{result.title.description}</p>
          <dl>
            <div><dt>SCORE</dt><dd>{state.score}</dd></div><div><dt>復旧 / 最大連続</dt><dd>{state.resolved}件 / ×{state.bestCombo}</dd></div>
            <div><dt>Final Yield</dt><dd>{state.yield}%</dd></div><div><dt>HP / SAN</dt><dd>{Math.round(state.hp)} / {Math.round(state.san)}</dd></div>
            <div><dt>Trust / Boss</dt><dd>{state.trust} / {state.boss}</dd></div><div><dt>引継ぎ案件</dt><dd>{result.pending}件</dd></div>
          </dl><p>推定残業 {result.overtime}分（未解決1件につき10分・発生待ちを含む）</p>
          <div className="survival-result__actions"><button onClick={() => start(true)}>もう一度、月曜日へ</button><button className="is-secondary" onClick={share}>結果をコピー</button></div>
          <p className="survival-share-message" role="status">{shareMessage}</p>
        </div> : null}
    </div>
    <div className="survival-dispatch">
      <div className="survival-tickets" aria-label="対応案件">{state.tasks.map(task => <div key={task.id} data-overdue={task.overdue}>
        <strong>{GAME_LOCATIONS.find(l => l.id === task.location)?.shortLabel}</strong><span>{task.title}</span>
        <b>{task.overdue ? "要対応" : `あと${Math.max(0, Math.ceil(RULES.deadline - state.elapsed + task.born))}秒`}</b>
      </div>)}{!state.tasks.length && <span>ラインは順調。次の呼び出しに備えよう。</span>}</div>
      <p className="survival-hints">◆ ヒント：{state.hints.length ? state.hints.map(id => GAME_LOCATIONS.find(l => l.id === id)?.shortLabel).join(" / ") : "現場担当・解析PCで1秒長押し"}</p>
      <p className="survival-bubble" role="status">{state.notice?.text ?? "「今日こそ定時で帰る」— 朝8時のあなた"}</p>
    </div>
    <div className="survival-controls" aria-label="ゲーム操作">
      <div className="survival-dpad">{(["up", "left", "down", "right"] as Direction[]).map(direction => {
        const change = (pressed: boolean) => handle.current?.setDirection(direction, pressed);
        return <button key={direction} type="button" disabled={!playing} className={`is-${direction}`}
          aria-label={`${({ up: "上", down: "下", left: "左", right: "右" })[direction]}へ移動`}
          onPointerDown={event => pointer(event, () => change(true))} onPointerUp={() => change(false)}
          onPointerCancel={() => change(false)} onLostPointerCapture={() => change(false)}
          onKeyDown={event => key(event, () => change(true))} onKeyUp={event => key(event, () => change(false))} onBlur={() => change(false)}
        >{({ up: "▲", down: "▼", left: "◀", right: "▶" })[direction]}</button>;
      })}</div>
      <div className="survival-prompt"><strong>{instructions}</strong><span>休憩室でHP・SAN回復 / 0でも完走できます</span></div>
      <div className="survival-action-buttons">
        <button type="button" className="survival-action" disabled={!playing}
          onPointerDown={event => pointer(event, () => handle.current?.setAction(true))}
          onPointerUp={() => handle.current?.setAction(false)} onPointerCancel={() => handle.current?.setAction(false)}
          onLostPointerCapture={() => handle.current?.setAction(false)}
          onKeyDown={event => key(event, () => handle.current?.setAction(true))} onKeyUp={event => key(event, () => handle.current?.setAction(false))}
          onBlur={() => handle.current?.setAction(false)}
        >ACTION<small>長押しで作業</small></button>
        <button type="button" className="survival-action survival-dash" disabled={!playing || state.elapsed < state.dashReadyAt}
          onPointerDown={event => pointer(event, () => handle.current?.dash())}
          onKeyDown={event => key(event, () => handle.current?.dash())}
        >{state.elapsed < state.dashReadyAt ? "充電中…" : "DASH"}<small>Shift / 短距離加速</small></button>
      </div>
    </div>
    {state.phase === "finished" && <section className="survival-learning">
      <header><p className="section-label">PLAY → LEARN → TRY</p><h2>現場のヒントを、次の判断へ</h2>
        <p>今回はヒントを{state.hintsUsed}件の復旧に活用しました。復旧と原因の証明は別の仕事です。ゲームの短縮時間は演出であり、実工程では安全・品質手順と検証を優先してください。</p></header>
      <div>{LEARNING_ITEMS.map(item => <article key={item.id}><h3>{item.title}</h3><p>{item.description}</p><Link href={item.href} onClick={() => trackGameEvent("related_tool_click", { ...context, destination_id: item.id })}>関連ツールで学ぶ →</Link></article>)}</div>
    </section>}
  </section>;
}
