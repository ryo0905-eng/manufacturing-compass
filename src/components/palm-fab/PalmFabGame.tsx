"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PalmFabScene } from "./PalmFabScene";
import { fabBalance, machineIds, type MachineId } from "@/data/palm-fab";
import { buyUpgrade, duration, goalFor, newFab, readFabSave, SAVE_KEY, stepFab, upgradeCost, type FabState } from "@/lib/palm-fab/simulation";
import styles from "./PalmFabGame.module.css";

function hint(state: FabState): string {
  if (state.machines.inspect.level > 1) return state.queues.inspectIn.length > 0 ? "検査が速くなりました。待ち行列が短くなる様子を見てみよう。" : "検査待ちが落ち着きました。次は加工や洗浄も強化できます。";
  if (state.queues.inspectIn.length >= 2 && state.coins >= 50) return "検査前に行列！検査装置を選んで強化すると、出荷が速くなります。";
  if (state.queues.inspectIn.length >= 2) return "検査前にケースが並んでいます。出荷で資金をためて検査を強化しよう。";
  return "ケースが加工 → 洗浄 → 検査へ流れます。装置をタップして様子を見よう。";
}

export default function PalmFabGame() {
  const [state, setState] = useState<FabState>(newFab);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<MachineId | null>(null);
  const [notice, setNotice] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobile, setMobile] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motion.matches);
    const onMotion = () => setReducedMotion(motion.matches);
    motion.addEventListener("change", onMotion);
    return () => motion.removeEventListener("change", onMotion);
  }, []);

  useEffect(() => {
    const viewport = window.matchMedia("(max-width: 800px)");
    setMobile(viewport.matches);
    const onViewport = () => setMobile(viewport.matches);
    viewport.addEventListener("change", onViewport);
    return () => viewport.removeEventListener("change", onViewport);
  }, []);

  useEffect(() => {
    try { const saved = readFabSave(localStorage.getItem(SAVE_KEY)); if (saved) setState(saved); } catch { /* Storage may be disabled. */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    let last = performance.now();
    let accumulator = 0;
    let frame = 0;
    const loop = (now: number) => {
      const delta = Math.min(0.3, Math.max(0, (now - last) / 1000));
      last = now;
      if (!document.hidden && !stateRef.current.paused) {
        accumulator += delta;
        const steps = Math.min(3, Math.floor((accumulator + 1e-9) / fabBalance.tickSeconds));
        if (steps > 0) {
          accumulator -= steps * fabBalance.tickSeconds;
          setState(current => { let next = current; for (let i = 0; i < steps; i++) next = stepFab(next); return next; });
        }
      } else accumulator = 0;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current)); } catch { /* Continue without persistence. */ } };
    const timer = window.setInterval(save, 2000);
    const onVisibility = () => { if (document.hidden) { const paused = { ...stateRef.current, paused: true }; stateRef.current = paused; setState(paused); save(); } last = performance.now(); accumulator = 0; };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", save);
    return () => { cancelAnimationFrame(frame); clearInterval(timer); document.removeEventListener("visibilitychange", onVisibility); window.removeEventListener("pagehide", save); save(); };
  }, [loaded]);

  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(""), 3600); return () => clearTimeout(timer); }, [notice]);

  const goal = goalFor(state.shipped);
  const previousGoal = fabBalance.goals.filter(value => value <= state.shipped).at(-1) ?? 0;
  const selectedMachine = selected ? state.machines[selected] : null;
  const cost = selected && selectedMachine ? upgradeCost(selected, selectedMachine.level) : null;
  const canBuy = cost !== null && state.coins >= cost;
  const name = selected ? fabBalance.machines[selected].name : "";
  const upgrade = () => {
    if (!selected || !canBuy) return;
    setState(current => buyUpgrade(current, selected));
    setNotice(selected === "inspect" && state.machines.inspect.level === 1 ? "改善成功！ 検査の処理が速くなりました" : `${name}装置を強化しました`);
  };
  const reset = () => {
    if (!window.confirm("工場を最初から始めますか？ 現在の進行状況は消えます。")) return;
    const fresh = newFab();
    setState(fresh); setSelected(null); setNotice("新しい工場が動き始めました");
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(fresh)); } catch { /* Continue without persistence. */ }
  };

  return <div className={styles.game}>
    <div className={styles.topbar}>
      <div className={styles.brand}>
        <Link href="/" className={styles.homeLink}>✦ Manufacturing Compass</Link>
        <h1>手のひら半導体工場 <span aria-hidden="true">◉</span></h1>
        <p>小さな一歩で、未来をつくる</p>
      </div>
      <div className={styles.hud}>
        <div className={styles.stat}><span>🟡 ゲーム内資金</span><strong>◉ {state.coins.toLocaleString()}</strong></div>
        <div className={styles.stat}><span>🔵 累計出荷</span><strong>{state.shipped.toLocaleString()} <small>枚</small></strong></div>
        <div className={styles.actions}><button type="button" onClick={() => setState(current => ({ ...current, paused: !current.paused }))}>{state.paused ? "▶ 再開" : "Ⅱ 一時停止"}</button><button type="button" onClick={reset}>↺ リセット</button></div>
      </div>
    </div>
    <div className={styles.layout}>
      <div className={styles.factory}>
        <PalmFabScene state={state} selected={selected} onSelect={setSelected} reducedMotion={reducedMotion} mobile={mobile} />
        <div className={styles.factoryHeading}><span className={styles.liveDot} /> <span>FAB 01 · {state.paused ? "一時停止中" : "稼働中"}</span></div>
        <div className={styles.hint} role="status">{hint(state)}</div>
      </div>
      <section className={styles.goal} aria-label="出荷目標">
        <div className={styles.goalIcon} aria-hidden="true">▤</div>
        <div className={styles.goalBody}><div className={styles.sectionTop}><span>MISSION · つぎの目標</span><strong>{goal.toLocaleString()} 枚出荷</strong></div><div className={styles.progress}><span style={{ width: `${Math.min(100, (state.shipped - previousGoal) / (goal - previousGoal) * 100)}%` }} /></div><p>{state.shipped.toLocaleString()} / {goal.toLocaleString()} 枚 · ケース1つで{fabBalance.wafersPerCase}枚</p></div>
      </section>
      <section className={styles.panel} aria-label="装置の詳細">
        {selected && selectedMachine ? <>
          <div className={styles.sectionTop}><span>SELECTED MACHINE</span><strong>⚙ {name}装置 <small>Lv.{selectedMachine.level}</small></strong></div>
          <div className={styles.panelBody}><p className={styles.role}>{fabBalance.machines[selected].role}</p>
          <div className={styles.detailGrid}><div><span>いまの処理時間</span><strong>{duration(selected, selectedMachine.level).toFixed(1)} 秒 / ケース</strong></div><div><span>強化後</span><strong>{cost === null ? "最大レベル" : `${duration(selected, selectedMachine.level + 1).toFixed(1)} 秒 / ケース`}</strong></div></div>
          {cost === null ? <p className={styles.maxed}>この装置は最大レベルです</p> : <><button className={styles.upgrade} type="button" disabled={!canBuy} onClick={upgrade}>⬆ {name}をアップグレード <span>◉ {cost}</span></button>{!canBuy && <p className={styles.shortage}>資金があと {cost - state.coins} 必要です。出荷で増えます。</p>}</>}
          </div>
        </> : <><div className={styles.sectionTop}><span>SELECT A MACHINE</span><strong>⚙ 装置をタップ</strong></div><div className={styles.panelBody}><p className={styles.role}>装置を選んで、処理速度と強化費用を確認しよう。</p><div className={styles.quickSelect}>{machineIds.map(id => <button type="button" key={id} onClick={() => setSelected(id)}>{fabBalance.machines[id].name}</button>)}</div></div></>}
      </section>
      <p className={styles.note}>製造工程と資金は遊びやすく簡略化した架空の設定です。進行状況はこのブラウザ内に保存されます。</p>
    </div>
    {notice && <div className={styles.notice} role="status">✦ {notice}</div>}
  </div>;
}
