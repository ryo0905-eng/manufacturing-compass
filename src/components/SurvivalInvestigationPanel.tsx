"use client";

import { useEffect, useRef, useState } from "react";
import { ACTIONS, GAME_LOCATIONS, OBSERVATIONS, type MachineId, type WorkKind } from "@/data/process-engineer-survival";
import { busy, inspectionRows, isMachine, machineName, observation, workError, type Command, type GameState } from "@/lib/process-engineer-survival";

type Props = { state: GameState; onCommand: (cmd: Command) => void; onClose: () => void };
export function SurvivalInvestigationPanel({ state, onCommand, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState<"root" | "observe" | "work" | "tests" | "confirm" | "notebook">(state.panel === "notebook" ? "notebook" : "root");
  const [selection, setSelection] = useState<{ kind: WorkKind; target: MachineId | "cooling" } | null>(null);
  const target = state.panel === "notebook" ? null : state.panel;
  const machine = target && isMachine(target) ? target : null;
  const title = target ? GAME_LOCATIONS.find(l => l.id === target)?.label : "調査ノート";
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => { element?.close(); };
  }, []);
  const inspect = () => { if (target) onCommand({ type: "observe", target }); setView("observe"); };
  const choose = (kind: WorkKind, workTarget: MachineId | "cooling") => { setSelection({ kind, target: workTarget }); setView("confirm"); };
  const record = <div className="survival-notebook">
    <section><h3>観察した事実</h3>{state.entries.some(e => e.category === "fact") ? <ul>{state.entries.filter(e => e.category === "fact").map(e => <li key={e.id}><small>{e.at.toFixed(1)}s</small> {e.text}</li>)}</ul> : <p>まだ未記録。対象の「調べる」で記録します。</p>}</section>
    <section><h3>原因候補（仮説・いつでも変更可）</h3><div className="survival-panel-actions">
      <button aria-pressed={state.hypothesis === "cooling"} onClick={() => onCommand({ type: "hypothesis", value: "cooling" })}>共通冷却{state.hypothesis === "cooling" ? " ✓" : ""}</button>
      <button aria-pressed={state.hypothesis === "material"} onClick={() => onCommand({ type: "hypothesis", value: "material" })}>材料{state.hypothesis === "material" ? " ✓" : ""}</button>
    </div><p>選んだだけでは正解になりません。確認結果と見比べよう。</p></section>
    <section><h3>確認結果・作業結果</h3>{state.entries.some(e => e.category === "result") ? <ul>{state.entries.filter(e => e.category === "result").map(e => <li key={e.id}><small>{e.at.toFixed(1)}s</small> {e.text}</li>)}</ul> : <p>まだ確認していません。</p>}</section>
  </div>;
  const error = selection ? workError(state, selection.kind, selection.target) : null;
  return <dialog ref={dialog} className="survival-panel" aria-labelledby="investigation-title" onCancel={event => { event.preventDefault(); onClose(); }}>
    <header><div><p className="survival-kicker">調査中 · 時計 / 生産 / 作業は停止</p><h2 id="investigation-title">{title}</h2></div><button onClick={onClose}>現場へ戻る</button></header>
    <p className="survival-panel-goal">目標：B/Cの対策後確認 ＋ 良品20個。まず「何が違う？」を比べよう。</p>
    <nav aria-label="操作パネル内"><button disabled={view === "root" || !target} onClick={() => setView("root")}>対象の操作</button><button disabled={view === "notebook"} onClick={() => setView("notebook")}>調査ノート</button></nav>
    {view === "root" && target && <div className="survival-panel-actions">
      <button onClick={inspect}>調べる<span>状態・観察をノートへ</span></button>
      {machine ? <>
        <button disabled={busy(state, machine) || (!state.machines[machine].running && state.machines[machine].revision > 0 && !state.machines[machine].verified)}
          onClick={() => onCommand({ type: state.machines[machine].running ? "stop" : "resume", target: machine })}>
          {state.machines[machine].running ? "停止する" : state.machines[machine].revision > 0 && !state.machines[machine].verified ? "再開には対策後確認が必要" : "生産を再開する"}
          <span>停止は即時。生産と仕掛品の流れを止める</span>
        </button>
        <button onClick={() => setView("work")}>試す / 対策する<span>再起動・材料・試運転</span></button>
      </> : target === "cooling" ? <>
        <button disabled={busy(state, "machine-b") || busy(state, "machine-c")} onClick={() => onCommand({ type: "stop", target: "pair" })}>B/Cを停止する<span>共通系統の作業準備</span></button>
        <button onClick={() => choose("cooling", "cooling")}>保全へ交換依頼<span>条件を確認してから確定</span></button>
      </> : target === "material" ? <>
        <button onClick={() => choose("material", "machine-b")}>Bの材料を切り替える</button>
        <button onClick={() => choose("material", "machine-c")}>Cの材料を切り替える</button>
      </> : <>
        <button disabled={busy(state, "machine-b") || busy(state, "machine-c")} onClick={() => onCommand({ type: "stop", target: "pair" })}>B/Cを停止する<span>まず影響範囲を抑える</span></button>
        <button onClick={() => setView("notebook")}>事実と仮説を比較する</button>
      </>}
    </div>}
    {view === "work" && machine && <div className="survival-panel-actions">
      <button onClick={() => choose("restart", machine)}>個別再起動<span>2秒 / 原因は取り除かない</span></button>
      <button onClick={() => choose("material", machine)}>正常材料へ切替<span>3秒 / 停止が必要</span></button>
      <button onClick={() => setView("tests")}>少量試運転<span>比較試験 / 対策後確認</span></button>
    </div>}
    {view === "tests" && machine && <div className="survival-panel-actions">
      <button onClick={() => choose("diagnostic", machine)}>正常材料で比較<span>材料だけを変えて試す / 4秒</span></button>
      <button onClick={() => choose("verification", machine)}>対策後を確認<span>現在の生産条件のまま試す / 4秒</span></button>
    </div>}
    {view === "confirm" && selection && <section>
      <h3>{selection.target === "cooling" ? "B/C共通冷却" : machineName(selection.target)}：{ACTIONS[selection.kind].label}</h3>
      <p>{ACTIONS[selection.kind].description}</p>
      <p>所要：稼働時間 {ACTIONS[selection.kind].seconds}秒。確定すると時計が動き、作業中は別の場所へ移動できます。</p>
      {selection.kind !== "restart" && <p>未検査の仕掛品は取り分けて保留し、不良数・良品数には含めません。検査済みの搬送待ち品は結果を保持します。試験品も納入数には含めません。</p>}
      {(selection.kind === "diagnostic" || selection.kind === "verification") && isMachine(selection.target) && <p>試験材料：{selection.kind === "diagnostic" ? "正常材料N" : state.machines[selection.target].lot}。終了後は停止状態で結果を待ち、再開を自分で選びます。</p>}
      {error && <p className="survival-panel-warning" role="status">{error}</p>}
      <div className="survival-panel-actions">
        {selection.target !== "cooling" && state.machines[selection.target].running && selection.kind !== "restart" && <button disabled={busy(state, selection.target)} onClick={() => onCommand({ type: "stop", target: selection.target as MachineId })}>対象を停止する</button>}
        {selection.target === "cooling" && (state.machines["machine-b"].running || state.machines["machine-c"].running) && <button disabled={busy(state, "machine-b") || busy(state, "machine-c")} onClick={() => onCommand({ type: "stop", target: "pair" })}>B/Cを停止する</button>}
        <button disabled={Boolean(error)} onClick={() => onCommand({ type: "work", ...selection })}>作業を確定する</button>
      </div>
    </section>}
    {view === "observe" && target && <section>
      <h3>{OBSERVATIONS[target]}</h3><p className="survival-observation">{observation(state, target)}</p>
      {target === "analysis-pc" && <>
        <div className="survival-table-scroll"><table><caption>設備別・材料別（通常生産の検査完了品）</caption><thead><tr><th>設備</th><th>材料</th><th>○ 良品</th><th>× 不良</th></tr></thead><tbody>
          {inspectionRows(state).map(row => <tr key={row.machine + row.lot}><td>{machineName(row.machine)}</td><td>{row.lot}</td><td>{row.good}</td><td>{row.bad}</td></tr>)}
        </tbody></table></div>
        <details><summary>製品履歴（試験品・仕掛品を含む）</summary><ul>{state.products.map(p => <li key={p.id}>{p.born.toFixed(1)}s開始 / {machineName(p.machine)} / {p.lot} / {p.kind === "production" ? "通常" : "試験"} / {p.status === "held" ? "未検査保留" : p.status === "flowing" ? "搬送中" : p.quality === "good" ? "○良好" : "×不良"}</li>)}</ul></details>
      </>}
      <p>これは観察結果です。原因候補と確認試験の結果を比べて判断しましょう。</p>
    </section>}
    {view === "notebook" && record}
  </dialog>;
}
