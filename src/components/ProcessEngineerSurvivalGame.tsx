"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from "react";
import { CASES, GAME_LOCATIONS, GAME_VERSION, LEARNING_ITEMS, MACHINE_IDS, RULES, type CaseId, type GameLocationId } from "@/data/process-engineer-survival";
import { counts, machineName, machineStatus, resultFor, SurvivalRuntime, type Command } from "@/lib/process-engineer-survival";
import { trackGameEvent } from "@/lib/analytics";
import { ProcessEngineerSurvivalCanvas, type Direction, type SurvivalCanvasHandle } from "./ProcessEngineerSurvivalCanvas";
import { SurvivalInvestigationPanel } from "./SurvivalInvestigationPanel";

const context = (caseId: CaseId) => ({ stage_id: "two-machines", game_version: GAME_VERSION, case_id: caseId } as const);
export function ProcessEngineerSurvivalGame() {
  const [runtime] = useState(() => new SurvivalRuntime());
  const state = useSyncExternalStore(runtime.subscribe, runtime.getSnapshot, runtime.getSnapshot);
  const [run, setRun] = useState(0), [ready, setReady] = useState(false), [error, setError] = useState(false);
  const [nearby, setNearby] = useState<GameLocationId | null>(null);
  const [muted, setMuted] = useState(false), [shareMessage, setShareMessage] = useState("");
  const handle = useRef<SurvivalCanvasHandle | null>(null), audio = useRef<AudioContext | null>(null);
  const lastNotice = useRef(0), completeSent = useRef(false);
  const region = useRef<HTMLDivElement>(null), resultHeading = useRef<HTMLHeadingElement>(null), pauseButton = useRef<HTMLButtonElement>(null);
  const result = resultFor(state), production = counts(state);
  const onReady = useCallback((value: SurvivalCanvasHandle | null) => { handle.current = value; setReady(Boolean(value)); }, []);
  const onError = useCallback(() => { setError(true); runtime.pause(); }, [runtime]);
  const onNearby = useCallback((value: GameLocationId | null) => setNearby(value), []);
  const enableSound = () => {
    try { if (!audio.current) audio.current = new AudioContext(); void audio.current.resume().catch(() => {}); }
    catch { /* Audio is optional. */ }
  };
  const pause = useCallback(() => { runtime.pause(); handle.current?.clear(); }, [runtime]);
  useEffect(() => {
    const visibility = () => { if (document.hidden) pause(); };
    window.addEventListener("blur", pause); document.addEventListener("visibilitychange", visibility);
    return () => { window.removeEventListener("blur", pause); document.removeEventListener("visibilitychange", visibility); };
  }, [pause]);
  useEffect(() => () => { void audio.current?.close().catch(() => {}); }, []);
  useEffect(() => {
    if (state.phase === "paused") pauseButton.current?.focus();
    if (state.phase === "finished") resultHeading.current?.focus();
  }, [state.phase]);
  useEffect(() => {
    const n = state.notice;
    if (!n || n.serial === lastNotice.current) return;
    lastNotice.current = n.serial;
    const sound = audio.current;
    if (n.kind !== "delivery" || muted || !sound || sound.state !== "running") return;
    [440, 554, 660, 880].forEach((frequency, i) => {
      const oscillator = sound.createOscillator(), gain = sound.createGain(), at = sound.currentTime + i * .075;
      oscillator.type = "square"; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.0001, at); gain.gain.exponentialRampToValueAtTime(.025, at + .008); gain.gain.exponentialRampToValueAtTime(.0001, at + .14);
      oscillator.connect(gain); gain.connect(sound.destination); oscillator.start(at); oscillator.stop(at + .15);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  }, [state.notice, muted]);
  useEffect(() => {
    if (state.phase !== "finished" || completeSent.current) return;
    completeSent.current = true;
    trackGameEvent("game_complete", { ...context(state.caseId), ending: result.success ? "target_met" : "investigation_carried_forward", title_id: result.title.id });
  }, [state.phase, state.caseId, result.success, result.title.id]);
  const start = (caseId: CaseId, retry = false) => {
    enableSound(); handle.current?.clear();
    if (retry) { setReady(false); setRun(value => value + 1); trackGameEvent("game_retry", context(caseId)); }
    lastNotice.current = 0; completeSent.current = false; setNearby(null); setShareMessage("");
    runtime.start(caseId); trackGameEvent("game_start", context(caseId)); region.current?.focus();
  };
  const resume = () => { enableSound(); handle.current?.clear(); runtime.resume(); if (!runtime.getState().panel) region.current?.focus(); };
  const closePanel = () => { handle.current?.clear(); runtime.close(); region.current?.focus(); };
  const dispatch = (cmd: Command) => {
    if (!runtime.command(cmd)) return;
    const ctx = context(state.caseId);
    if (cmd.type === "observe") trackGameEvent("game_observe", { ...ctx, observation_id: cmd.target });
    else if (cmd.type === "stop" || cmd.type === "resume") trackGameEvent("game_countermeasure", { ...ctx, action_id: cmd.type, station_id: cmd.target });
    else if (cmd.type === "work") {
      if (cmd.kind === "diagnostic" || cmd.kind === "verification") trackGameEvent("game_experiment", { ...ctx, experiment_id: cmd.kind, station_id: cmd.target });
      else trackGameEvent("game_countermeasure", { ...ctx, action_id: cmd.kind, station_id: cmd.target });
      region.current?.focus();
    }
  };
  const share = async () => {
    const text = "製造技術者サバイバル：" + result.title.label + "\n良品 " + result.good + " / 不良 " + result.bad + " / B・C確認 " + (result.verified ? "完了" : "調査継続") + "\nhttps://mfg-compass.com/games/process-engineer-survival";
    try { await navigator.clipboard.writeText(text); setShareMessage("結果をコピーしました"); } catch { setShareMessage(text); }
  };
  const pointer = (event: PointerEvent<HTMLButtonElement>, action: () => void) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); action(); };
  const key = (event: KeyboardEvent<HTMLButtonElement>, action: () => void) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); if (!event.repeat) action(); } };
  const playing = state.phase === "playing" && ready;
  const nearest = GAME_LOCATIONS.find(l => l.id === nearby);
  return <section className="survival-game" aria-label="製造技術者サバイバル">
    <div className="survival-toolbar"><span>原因調査プロトタイプ · {CASES[state.caseId].label}</span>
      <button type="button" aria-pressed={muted} onClick={() => { if (muted) enableSound(); setMuted(!muted); }}>音 {muted ? "OFF" : "ON"}</button>
      <button type="button" disabled={!playing} onClick={pause}>一時停止</button>
    </div>
    <div className="survival-hud">
      <div><span>残り稼働時間</span><strong>{Math.ceil(RULES.duration - state.elapsed)}<small>秒</small></strong><small>{state.phase === "investigating" || state.phase === "paused" ? "時計停止中" : "調査中は時間制限なし"}</small></div>
      <div><span>○ 良品</span><strong>{production.good}<small> / {RULES.target}個</small></strong><small>通常生産・検査完了品</small></div>
      <div><span>× 不良</span><strong>{production.bad}<small>個</small></strong><small>全数検査で自動保留</small></div>
    </div>
    <div className="survival-machine-strip" aria-label="設備の状態">{MACHINE_IDS.map(id => <div key={id}><strong>{machineName(id)}</strong><span>{machineStatus(state, id)}</span><small>材料 {state.machines[id].lot}{id !== "machine-a" ? " / 対策後確認 " + (state.machines[id].verified ? "✓" : "未") : " / 比較対象"}</small></div>)}</div>
    <div ref={region} tabIndex={-1} className="survival-stage" aria-label="工場操作領域" onPointerDown={event => {
      if (state.phase === "playing" && !(event.target as HTMLElement).closest("button, a")) region.current?.focus();
    }}>
      <ProcessEngineerSurvivalCanvas key={run} runtime={runtime} onReady={onReady} onNearbyChange={onNearby} onError={onError} />
      {error ? <div className="survival-overlay"><h2>マップを読み込めませんでした</h2><p>通信状況を確認して再読み込みしてください。</p><button onClick={() => window.location.reload()}>再読み込み</button></div>
        : state.phase === "intro" ? <div className="survival-overlay survival-intro">
          <p className="survival-kicker">90 SECONDS OF PRODUCTION + INVESTIGATION</p><h2>2台の異常。原因は1つ？</h2>
          <p>材料 → 設備 → 検査 → 良品置場。何が違うかを調べ、対策で工場を立て直そう。</p>
          <ul><li>移動：矢印 / WASD　ダッシュ：Shift</li><li>設備の近くでSpace / Enter / ACTIONを一押し</li><li>パネルを開くと時計も工場も停止。落ち着いて比較できます</li><li>目標：B/Cの対策後確認 ＋ 良品20個</li></ul>
          <p>稼働90秒。調査を含む実プレイはそれ以上かかります。</p>
          <button disabled={!ready} onClick={() => start("case-a")}>{ready ? "工場を動かす" : "工場を準備中…"}</button>
        </div>
        : state.phase === "paused" ? <div className="survival-overlay"><h2>時計を止めています</h2><p>画面を離れている間も、生産・作業は進みません。</p><button ref={pauseButton} onClick={resume}>{state.panel ? "調査に戻る" : "生産を再開する"}</button></div>
        : state.phase === "finished" ? <div className="survival-map-end">稼働90秒終了。下の結果と調査記録へ ↓</div> : null}
    </div>
    <p className="survival-bubble" role="status">{state.notice?.text ?? "警告を消すのではなく、良品が流れる状態を取り戻そう。"}</p>
    {state.elapsed < 10 && playing && <p className="survival-tutorial">最初は設備確認：目の前の設備Aに近づいてACTION →「調べる」。製品の□A・Nは「設備A・材料N」の印です。</p>}
    <div className="survival-controls" aria-label="ゲーム操作">
      <div className="survival-dpad">{(["up", "left", "down", "right"] as Direction[]).map(direction => {
        const change = (pressed: boolean) => handle.current?.setDirection(direction, pressed);
        return <button key={direction} type="button" disabled={!playing} className={"is-" + direction} aria-label={({ up: "上", down: "下", left: "左", right: "右" })[direction] + "へ移動"}
          onPointerDown={event => pointer(event, () => change(true))} onPointerUp={() => change(false)} onPointerCancel={() => change(false)} onLostPointerCapture={() => change(false)}
          onKeyDown={event => key(event, () => change(true))} onKeyUp={event => key(event, () => change(false))} onBlur={() => change(false)}
        >{({ up: "▲", down: "▼", left: "◀", right: "▶" })[direction]}</button>;
      })}</div>
      <div className="survival-prompt"><strong>{nearest ? nearest.label + "：ACTIONで操作" : "対象の近くへ移動してACTION"}</strong><span>目標：B/Cの確認 ＋ 良品20個</span><button disabled={!playing} onClick={() => runtime.open("notebook")}>調査ノート（時計停止）</button></div>
      <div className="survival-action-buttons">
        <button type="button" className="survival-action" disabled={!playing || !nearby} onClick={() => handle.current?.action()}>ACTION<small>一押しで調査・操作</small></button>
        <button type="button" className="survival-action survival-dash" disabled={!playing || state.elapsed < state.dashReadyAt}
          onPointerDown={event => pointer(event, () => handle.current?.dash())} onKeyDown={event => key(event, () => handle.current?.dash())}
        >{state.elapsed < state.dashReadyAt ? "充電中…" : "DASH"}<small>Shift / 短距離加速</small></button>
      </div>
    </div>
    {state.phase === "investigating" && <SurvivalInvestigationPanel state={state} onCommand={dispatch} onClose={closePanel} />}
    {state.phase === "finished" && <>
      <section className="survival-result" aria-labelledby="survival-result-title">
        <p className="survival-kicker">{result.success ? "目標達成" : "調査結果を次へ持ち帰ろう"}</p>
        <h2 id="survival-result-title" ref={resultHeading} tabIndex={-1}>{result.title.label}</h2><p>{result.title.description}</p>
        <dl><div><dt>品質 / 不良数</dt><dd>{result.bad}個（自動保留）</dd></div><div><dt>復旧 / 対策後確認</dt><dd>B {state.machines["machine-b"].verified ? "✓" : "未"} / C {state.machines["machine-c"].verified ? "✓" : "未"}</dd></div><div><dt>生産 / 良品数</dt><dd>{result.good} / {RULES.target}個</dd></div></dl>
        <p>試験完了品 {result.tests}個・未検査保留 {result.held}個・仕掛品 {result.pending}個は、良品・不良の集計から除外しています。</p>
        <details><summary>このケースの原因と解説を見る</summary><p><strong>{CASES[state.caseId].answer}</strong></p><p>{CASES[state.caseId].explanation}以下の行動記録とは別に、ケースの設定を解説しています。</p></details>
        <h3>あなたの判断と観測結果</h3>{state.entries.length ? <ol className="survival-timeline">{state.entries.map(e => <li key={e.id}><small>{e.at.toFixed(1)}s / {e.category === "fact" ? "観察" : e.category === "action" ? "判断・行動" : "結果"}</small><span>{e.text}</span></li>)}</ol> : <p>今回は操作記録がありません。次は設備を調べて、比較してみよう。</p>}
        <div className="survival-result__actions"><button onClick={() => start(state.caseId, true)}>同じケースをやり直す</button><button onClick={() => start(state.caseId === "case-a" ? "case-b" : "case-a", true)}>別の原因に挑戦</button><button className="is-secondary" onClick={share}>結果をコピー</button></div>
        <p className="survival-share-message" role="status">{shareMessage}</p>
      </section>
      <section className="survival-learning"><header><p className="section-label">PLAY → LEARN → TRY</p><h2>今回の判断を、問題解決の考え方へ</h2>
        <p>「同じ症状」だけで原因を決めず、比較し、一つずつ条件を確かめる体験です。この教材は全数検査と原因を単純化しており、結果は現実の原因証明を保証しません。実際の保全・品質判断は現場の安全手順と検証に従ってください。</p></header>
        <div>{LEARNING_ITEMS.map(item => <article key={item.id}><h3>{item.title}</h3><p>{item.description}</p><Link href={item.href} onClick={() => trackGameEvent("related_tool_click", { ...context(state.caseId), destination_id: item.id })}>関連ツールで学ぶ →</Link></article>)}</div>
      </section>
    </>}
  </section>;
}
