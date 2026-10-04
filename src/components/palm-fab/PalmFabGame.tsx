"use client";

import { useEffect, useRef, useState } from "react";
import { fabBalance, machineIds, type MachineId } from "@/data/palm-fab";
import { buyUpgrade, duration, goalFor, newFab, readFabSave, SAVE_KEY, stepFab, upgradeCost, type FabState } from "@/lib/palm-fab/simulation";
import styles from "./PalmFabGame.module.css";

const spots = {
  processOut: [218, 264], washIn: [382, 252], washOut: [493, 296],
  inspectIn: [435, 355], inspectOut: [262, 501], shipped: [99, 513],
} as const;

function CaseSprite({ x, y, small = false }: { x: number; y: number; small?: boolean }) {
  return <g pointerEvents="none" transform={`translate(${x} ${y}) scale(${small ? .78 : 1})`} aria-hidden="true">
    <ellipse cx="0" cy="14" rx="18" ry="6" fill="#305570" opacity=".16" />
    <path d="M-15 0 L0 -7 L16 0 L1 7 Z" fill="#d6f9ff" stroke="#417d99" strokeWidth="2" />
    <path d="M-15 0 L1 7 L1 17 L-15 9 Z" fill="#90cde2" stroke="#417d99" strokeWidth="2" />
    <path d="M1 7 L16 0 L16 9 L1 17 Z" fill="#f9ffff" stroke="#417d99" strokeWidth="2" />
    <ellipse cx="0" cy="1" rx="9" ry="4" fill="#449aca" stroke="#246d9e" />
    <path d="M-7 -1 L7 3" stroke="#d8f7ff" strokeWidth="2" />
  </g>;
}

function MachineSprite({ id, x, y, state, selected, onSelect }: {
  id: MachineId; x: number; y: number; state: FabState; selected: boolean; onSelect: (id: MachineId) => void;
}) {
  const machine = state.machines[id];
  const working = Boolean(machine.case);
  const progress = working ? Math.max(0, Math.min(1, 1 - machine.remaining / duration(id, machine.level))) : 0;
  const name = fabBalance.machines[id].name;
  return <g transform={`translate(${x} ${y})`} role="button" tabIndex={0}
    aria-label={`${name}装置 レベル${machine.level}、詳細を開く`}
    onClick={() => onSelect(id)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(id); } }}
    className={styles.machine} data-selected={selected}>
    <ellipse cx="78" cy="131" rx="87" ry="24" fill="#4d7890" opacity=".18" />
    {selected && <ellipse cx="76" cy="126" rx="95" ry="31" fill="none" stroke="#f1a744" strokeWidth="4" strokeDasharray="7 5" />}
    <path d="M3 36 L37 13 L154 24 L122 48 Z" fill="#fcffff" stroke="#7299a8" strokeWidth="2" />
    <path d="M122 48 L154 24 L154 112 L122 137 Z" fill="#b4ccd3" stroke="#7299a8" strokeWidth="2" />
    <path d="M3 36 L122 48 L122 137 L3 122 Z" fill="#f5f8f5" stroke="#7299a8" strokeWidth="2" />
    <path d="M11 49 L113 59 L113 111 L11 100 Z" fill="#c0d6d7" stroke="#60899a" strokeWidth="2" />
    <path d="M17 56 L106 64 L106 102 L17 94 Z" fill="url(#fabWindow)" />
    <path d="M26 76 Q58 59 94 79" fill="none" stroke={working ? "#7ef7d6" : "#79aebc"} strokeWidth="5" opacity={working ? .9 : .45} />
    <circle cx="60" cy="80" r={working ? 15 : 12} fill={working ? "#65e8d9" : "#93bdca"} opacity=".8" />
    <circle cx="60" cy="80" r="8" fill="#eafcff" />
    <path d="M10 108 L112 119" stroke="#a1b9bd" strokeWidth="3" />
    <rect x="130" y="60" width="15" height="23" rx="2" fill="#466f85" />
    <rect x="133" y="64" width="9" height="12" rx="1" fill="#8be9d9" />
    <circle cx="127" cy="29" r="7" fill={working ? "#41d5a8" : "#b8d0cc"} stroke="#286b6e" strokeWidth="2" />
    {machine.level > 1 && <g><path d="M40 17 L40 1 L106 7 L106 20" fill="#90d6dc" stroke="#417e93" strokeWidth="2" /><path d="M45 7 L101 13" stroke="#e8ffff" strokeWidth="3" /></g>}
    {machine.level > 2 && <g><rect x="21" y="103" width="12" height="8" rx="2" fill="#32c4b2" /><rect x="38" y="105" width="12" height="8" rx="2" fill="#32c4b2" /></g>}
    {machine.level > 3 && <path d="M148 42 L165 34 L165 96 L148 106" fill="#a2e9dc" stroke="#417e93" strokeWidth="2" />}
    <rect x="14" y="120" width="102" height="6" rx="3" fill="#d8e5dd" />
    <rect x="14" y="120" width={102 * progress} height="6" rx="3" fill="#31bdad" />
    <rect x="-2" y="-20" width="137" height="28" rx="14" fill={selected ? "#174f65" : "#234d5f"} />
    <circle cx="14" cy="-6" r="5" fill={working ? "#49dc99" : "#8bb4b3"} />
    <text x="27" y="0" fill="#fff" fontSize="17" fontWeight="700">{name} <tspan fontSize="12">Lv.{machine.level}</tspan></text>
    <rect x="-12" y="-24" width="180" height="167" fill="transparent" />
  </g>;
}

function FactoryScene({ state, selected, onSelect, reducedMotion }: { state: FabState; selected: MachineId | null; onSelect: (id: MachineId) => void; reducedMotion: boolean }) {
  const robot = state.robot;
  const robotFrom = robot ? spots[robot.from] : spots.processOut;
  const robotTo = robot ? spots[robot.to] : spots.processOut;
  const fraction = robot ? reducedMotion ? 0 : 1 - robot.remaining / fabBalance.transferSeconds : 0;
  const robotX = robotFrom[0] + (robotTo[0] - robotFrom[0]) * fraction;
  const robotY = robotFrom[1] + (robotTo[1] - robotFrom[1]) * fraction;
  return <svg className={styles.scene} viewBox="0 0 620 600" role="group" aria-label="加工、洗浄、検査、出荷の順にケースが流れる工場。装置を選んで強化できます">
    <defs>
      <linearGradient id="fabWindow" x2="0" y2="1"><stop stopColor="#60cbd7" /><stop offset="1" stopColor="#197c9a" /></linearGradient>
      <pattern id="fabTiles" width="44" height="34" patternUnits="userSpaceOnUse" patternTransform="skewY(-12)"><rect width="44" height="34" fill="#e9f3ee" /><path d="M44 0H0V34" fill="none" stroke="#d2e4df" strokeWidth="2" /></pattern>
    </defs>
    <path d="M18 74 L397 13 L603 126 L603 548 L242 595 L18 482 Z" fill="#c6ddd7" opacity=".5" />
    <path d="M14 64 L397 7 L608 122 L608 530 L239 589 L14 476 Z" fill="url(#fabTiles)" stroke="#bfd9d2" strokeWidth="4" />
    <path d="M113 281 C205 300 326 307 449 281 S450 328 435 351 C385 391 353 444 265 501 S160 519 100 513" fill="none" stroke="#f7fbf3" strokeWidth="34" strokeLinecap="round" opacity=".8" />
    <path d="M113 281 C205 300 326 307 449 281 S450 328 435 351 C385 391 353 444 265 501 S160 519 100 513" fill="none" stroke="#e3b95e" strokeWidth="3" strokeDasharray="12 12" opacity=".8" />
    <text x="45" y="92" fill="#5d8e91" fontSize="17" fontWeight="700" letterSpacing="2">PALM FAB · 01</text>
    <g opacity=".75"><circle cx="542" cy="86" r="25" fill="#fff8da" /><path d="M525 88 Q540 60 555 86" fill="none" stroke="#acd4ae" strokeWidth="6" /></g>
    <MachineSprite id="process" x={55} y={156} state={state} selected={selected === "process"} onSelect={onSelect} />
    <MachineSprite id="wash" x={395} y={174} state={state} selected={selected === "wash"} onSelect={onSelect} />
    <MachineSprite id="inspect" x={241} y={387} state={state} selected={selected === "inspect"} onSelect={onSelect} />
    {state.queues.processOut.slice(0, 3).map((item, index) => <CaseSprite key={item.id} x={220 + index * 25} y={268 + index * 4} small />)}
    {state.queues.washIn.slice(0, 3).map((item, index) => <CaseSprite key={item.id} x={373 - index * 24} y={241 + index * 7} small />)}
    {state.queues.washOut.slice(0, 3).map((item, index) => <CaseSprite key={item.id} x={507 - index * 25} y={311 + index * 4} small />)}
    <path d="M333 352 H512" fill="none" stroke="#e5ae49" strokeWidth="14" opacity=".25" strokeLinecap="round" />
    {state.queues.inspectIn.map((item, index) => <CaseSprite key={item.id} x={347 + index * 32} y={351} />)}
    <rect x="380" y="318" width="166" height="25" rx="12" fill="#fff9e8" stroke="#dfb66d" />
    <text x="392" y="336" fill="#805423" fontSize="14" fontWeight="700">検査待ち {state.queues.inspectIn.length} / {fabBalance.queueLimit}</text>
    {state.queues.inspectOut.slice(0, 3).map((item, index) => <CaseSprite key={item.id} x={235 - index * 27} y={500 + index * 4} small />)}
    <g transform="translate(39 488)"><ellipse cx="57" cy="65" rx="69" ry="17" fill="#4d7890" opacity=".16" /><path d="M0 18 L57 0 L113 17 L56 36 Z" fill="#f7faf1" stroke="#6d9eaa" strokeWidth="3" /><path d="M0 18 L56 36 L56 66 L0 46 Z" fill="#d2e7df" stroke="#6d9eaa" strokeWidth="3" /><path d="M56 36 L113 17 L113 47 L56 66 Z" fill="#8ac8c7" stroke="#6d9eaa" strokeWidth="3" /><text x="20" y="29" fill="#27616c" fontSize="17" fontWeight="800">出荷</text><path d="M73 39 H96 M89 32 L97 39 L89 46" stroke="#f6ffdf" strokeWidth="4" fill="none" /></g>
    {state.shipmentFlash > 0 && <g opacity={state.shipmentFlash}><circle cx="96" cy="510" r="37" fill="none" stroke="#ffc65e" strokeWidth="6" /><text x="115" y="477" fill="#98601d" fontSize="24" fontWeight="800">+{fabBalance.coinsPerCase}</text></g>}
    <g transform={`translate(${robotX} ${robotY})`} aria-hidden="true"><ellipse cy="17" rx="27" ry="8" fill="#376680" opacity=".2" /><path d="M-24 -4 L1 -14 L25 -4 L0 7 Z" fill="#fcffff" stroke="#3c758d" strokeWidth="2" /><path d="M-24 -4 L0 7 L0 16 L-24 5 Z" fill="#65a7bd" stroke="#3c758d" strokeWidth="2" /><path d="M0 7 L25 -4 L25 6 L0 16 Z" fill="#d2edf1" stroke="#3c758d" strokeWidth="2" /><circle cx="-12" cy="10" r="4" fill="#254b68" /><circle cx="16" cy="13" r="4" fill="#254b68" /><circle cx="13" cy="1" r="3" fill="#f5bd5d" />{robot && <CaseSprite x={0} y={-23} small />}</g>
    {state.paused && <g><rect x="155" y="245" width="310" height="94" rx="22" fill="#173f50" opacity=".94" /><text x="310" y="302" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="700">一時停止中</text></g>}
  </svg>;
}

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
      <div className={styles.stat}><span>ゲーム内資金</span><strong>◉ {state.coins.toLocaleString()}</strong></div>
      <div className={styles.stat}><span>累計出荷</span><strong>{state.shipped.toLocaleString()} <small>枚</small></strong></div>
      <div className={styles.actions}><button type="button" onClick={() => setState(current => ({ ...current, paused: !current.paused }))}>{state.paused ? "▶ 再開" : "Ⅱ 一時停止"}</button><button type="button" onClick={reset}>リセット</button></div>
    </div>
    <div className={styles.layout}>
      <div className={styles.factory}>
        <div className={styles.factoryHeading}><span className={styles.liveDot} /> <span>小さな工場が稼働中</span><span className={styles.modelTag}>ゲーム用の簡略モデル</span></div>
        <FactoryScene state={state} selected={selected} onSelect={setSelected} reducedMotion={reducedMotion} />
        <div className={styles.hint} role="status">{hint(state)}</div>
      </div>
      <div className={styles.sidebar}>
        <section className={styles.goal} aria-label="出荷目標"><div className={styles.sectionTop}><span>つぎの目標</span><strong>{goal.toLocaleString()} 枚出荷</strong></div><div className={styles.progress}><span style={{ width: `${Math.min(100, (state.shipped - previousGoal) / (goal - previousGoal) * 100)}%` }} /></div><p>{state.shipped.toLocaleString()} / {goal.toLocaleString()} 枚 · ケース1つで{fabBalance.wafersPerCase}枚</p></section>
        <section className={styles.panel} aria-label="装置の詳細">
          {selected && selectedMachine ? <>
            <div className={styles.sectionTop}><span>選択中の装置</span><strong>{name} · Lv.{selectedMachine.level}</strong></div>
            <p className={styles.role}>{fabBalance.machines[selected].role}</p>
            <div className={styles.detailGrid}><div><span>いまの処理時間</span><strong>{duration(selected, selectedMachine.level).toFixed(1)} 秒 / ケース</strong></div><div><span>次のレベル</span><strong>{cost === null ? "最大レベル" : `${duration(selected, selectedMachine.level + 1).toFixed(1)} 秒 / ケース`}</strong></div></div>
            {cost === null ? <p className={styles.maxed}>この装置は最大レベルです</p> : <><button className={styles.upgrade} type="button" disabled={!canBuy} onClick={upgrade}>↑ {name}を強化 <span>◉ {cost}</span></button>{!canBuy && <p className={styles.shortage}>資金があと {cost - state.coins} 必要です。出荷で増えます。</p>}</>}
          </> : <><div className={styles.sectionTop}><span>装置を選ぶ</span><strong>タップで詳細を見る</strong></div><p className={styles.role}>工場の加工・洗浄・検査装置をタップすると、強化できるようになります。</p><div className={styles.quickSelect}>{machineIds.map(id => <button type="button" key={id} onClick={() => setSelected(id)}>{fabBalance.machines[id].name}</button>)}</div></>}
        </section>
        <p className={styles.note}>製造工程と資金は遊びやすく簡略化した架空の設定です。進行状況はこのブラウザ内に保存されます。</p>
      </div>
    </div>
    {notice && <div className={styles.notice} role="status">✦ {notice}</div>}
  </div>;
}
