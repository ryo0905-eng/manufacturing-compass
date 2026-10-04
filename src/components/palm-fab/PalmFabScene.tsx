"use client";

import { fabBalance, type MachineId } from "@/data/palm-fab";
import { duration, type FabState } from "@/lib/palm-fab/simulation";
import styles from "./PalmFabGame.module.css";

const assets = "/games/palm-fab";
const spots = {
  processOut: [218, 282], washIn: [388, 273], washOut: [502, 316],
  inspectIn: [432, 376], inspectOut: [260, 520], shipped: [106, 538],
} as const;

function CaseSprite({ x, y, small = false }: { x: number; y: number; small?: boolean }) {
  const size = small ? 33 : 41;
  return <g pointerEvents="none" aria-hidden="true">
    <ellipse cx={x} cy={y + 13} rx={size * .41} ry="6" fill="#17394b" opacity=".26" />
    <image href={`${assets}/case.webp`} x={x - size / 2} y={y - size / 2} width={size} height={size} />
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
    <ellipse cx="88" cy="164" rx="89" ry="25" fill="#143a4b" opacity=".28" />
    {selected && <ellipse cx="88" cy="158" rx="98" ry="32" fill="none" stroke="#ffc943" strokeWidth="5" strokeDasharray="10 5" />}
    <image href={`${assets}/${id}.webp`} x="-4" y="-8" width="185" height="185" />
    {working && <ellipse className={styles.chamberGlow} cx="78" cy="111" rx="42" ry="23" fill={id === "inspect" ? "#a590ff" : "#5effe0"} opacity=".24" />}
    {machine.level > 1 && <g aria-hidden="true"><path d="M21 148 Q90 184 159 150" fill="none" stroke="#ffd34f" strokeWidth="5" /><circle cx="159" cy="153" r="6" fill="#ffe26a" /></g>}
    {machine.level > 2 && <g aria-hidden="true"><path d="M35 35 L52 24 M116 21 L133 30" stroke="#fce883" strokeWidth="6" strokeLinecap="round" /><circle cx="142" cy="34" r="5" fill="#fcce47" /></g>}
    {machine.level > 3 && <g aria-hidden="true"><circle cx="170" cy="80" r="10" fill="#45dbb5" stroke="#e8fff1" strokeWidth="3" /><path d="M168 80h5" stroke="#fff" strokeWidth="3" /></g>}
    <circle cx="144" cy="34" r={working ? 7 : 5} fill={working ? "#42fa9a" : "#78b1aa"} stroke="#eaffee" strokeWidth="2" />
    <rect x="20" y="157" width="130" height="7" rx="3.5" fill="#173d50" opacity=".75" />
    <rect x="20" y="157" width={130 * progress} height="7" rx="3.5" fill="#49f5cd" />
    <rect x="0" y="-34" width="154" height="31" rx="13" fill={selected ? "#086377" : "#12374c"} stroke={selected ? "#66e6ec" : "#6ea2ae"} strokeWidth="2" />
    <circle cx="16" cy="-18" r="6" fill={working ? "#40f59b" : "#89b6af"} />
    <text x="30" y="-11" fill="#fff" fontSize="18" fontWeight="800">{name} <tspan fontSize="12">Lv.{machine.level}</tspan></text>
    <rect x="-10" y="-35" width="195" height="218" fill="transparent" />
  </g>;
}

export function PalmFabScene({ state, selected, onSelect, reducedMotion, mobile }: {
  state: FabState; selected: MachineId | null; onSelect: (id: MachineId) => void; reducedMotion: boolean; mobile: boolean;
}) {
  const robot = state.robot;
  const robotFrom = robot ? spots[robot.from] : spots.processOut;
  const robotTo = robot ? spots[robot.to] : spots.processOut;
  const fraction = robot ? reducedMotion ? 0 : 1 - robot.remaining / fabBalance.transferSeconds : 0;
  const robotX = robotFrom[0] + (robotTo[0] - robotFrom[0]) * fraction;
  const robotY = robotFrom[1] + (robotTo[1] - robotFrom[1]) * fraction;
  const sceneWidth = mobile ? 620 : 1000;
  const sceneHeight = mobile ? 670 : 680;
  return <svg className={styles.scene} viewBox={`0 0 ${sceneWidth} ${sceneHeight}`} role="group" aria-label="加工、洗浄、検査、出荷の順にケースが流れる工場。装置を選んで強化できます">
    <defs>
      <linearGradient id="laneGlow" x1="0" x2="1"><stop stopColor="#e9d15e" stopOpacity=".55" /><stop offset=".6" stopColor="#65e5d3" stopOpacity=".65" /><stop offset="1" stopColor="#ffd46a" stopOpacity=".55" /></linearGradient>
      <radialGradient id="dockGlow"><stop stopColor="#ffedab" stopOpacity=".8" /><stop offset="1" stopColor="#ffedab" stopOpacity="0" /></radialGradient>
    </defs>
    <image href={`${assets}/cleanroom.webp`} x="0" y="0" width={sceneWidth} height={sceneHeight} preserveAspectRatio="xMidYMin slice" />
    <rect width={sceneWidth} height={sceneHeight} fill="#d5f0f2" opacity=".06" pointerEvents="none" />
    <path d="M121 301 C197 307 291 298 382 296 S487 324 449 370 S366 448 264 523 S169 541 111 539" fill="none" stroke="#ffffff" strokeWidth="36" strokeLinecap="round" opacity=".47" pointerEvents="none" />
    <path d="M121 301 C197 307 291 298 382 296 S487 324 449 370 S366 448 264 523 S169 541 111 539" fill="none" stroke="url(#laneGlow)" strokeWidth="4" strokeDasharray="12 13" pointerEvents="none" />
    <path d="M331 374 H530" stroke="#ffc547" strokeWidth="35" opacity=".25" strokeLinecap="round" pointerEvents="none" />
    <path d="M331 374 H530" stroke="#f59c26" strokeWidth="3" strokeDasharray="8 6" opacity=".9" pointerEvents="none" />
    {!mobile && <g pointerEvents="none" aria-hidden="true"><ellipse cx="863" cy="598" rx="93" ry="22" fill="#163c4f" opacity=".23" /><image href={`${assets}/materials-rack.webp`} x="770" y="420" width="190" height="190" /></g>}
    <MachineSprite id="process" x={55} y={172} state={state} selected={selected === "process"} onSelect={onSelect} />
    <MachineSprite id="wash" x={390} y={189} state={state} selected={selected === "wash"} onSelect={onSelect} />
    <MachineSprite id="inspect" x={241} y={402} state={state} selected={selected === "inspect"} onSelect={onSelect} />
    {state.queues.processOut.slice(0, 3).map((item, index) => <CaseSprite key={item.id} x={229 + index * 28} y={290 + index * 4} small />)}
    {state.queues.washIn.slice(0, 3).map((item, index) => <CaseSprite key={item.id} x={379 - index * 29} y={273 + index * 5} small />)}
    {state.queues.washOut.slice(0, 3).map((item, index) => <CaseSprite key={item.id} x={518 - index * 28} y={327 + index * 5} small />)}
    {state.queues.inspectIn.map((item, index) => <CaseSprite key={item.id} x={346 + index * 34} y={374} />)}
    <g pointerEvents="none">
      <rect x="365" y="332" width="181" height="30" rx="13" fill={state.queues.inspectIn.length >= 3 ? "#ffd875" : "#123a51"} stroke="#fff0bd" strokeWidth="2" />
      <text x="379" y="353" fill={state.queues.inspectIn.length >= 3 ? "#51320b" : "#fff"} fontSize="16" fontWeight="800">検査待ち {state.queues.inspectIn.length} / {fabBalance.queueLimit}</text>
    </g>
    {state.queues.inspectOut.slice(0, 3).map((item, index) => <CaseSprite key={item.id} x={237 - index * 29} y={521 + index * 4} small />)}
    <g transform="translate(42 492)" pointerEvents="none">
      <ellipse cx="67" cy="61" rx="78" ry="39" fill="url(#dockGlow)" />
      <path d="M1 20 L71 0 L138 20 L68 41 Z" fill="#f5fbf6" stroke="#21485b" strokeWidth="4" />
      <path d="M1 20 L68 41 L68 72 L1 50 Z" fill="#bfd9dd" stroke="#21485b" strokeWidth="4" />
      <path d="M68 41 L138 20 L138 51 L68 72 Z" fill="#407b94" stroke="#21485b" strokeWidth="4" />
      <path d="M8 27 L67 46" stroke="#ffd062" strokeWidth="5" strokeDasharray="9 6" />
      <text x="27" y="33" fill="#1d536c" fontSize="22" fontWeight="900">出荷</text>
      <path d="M89 48 H119 M110 39 L121 48 L110 57" stroke="#fff3b3" strokeWidth="5" fill="none" />
    </g>
    {state.shipmentFlash > 0 && <g opacity={state.shipmentFlash} pointerEvents="none"><circle cx="105" cy="530" r="51" fill="none" stroke="#ffc44e" strokeWidth="8" /><text x="130" y="485" fill="#654009" stroke="#fff4ca" strokeWidth="3" paintOrder="stroke" fontSize="30" fontWeight="900">+{fabBalance.coinsPerCase}</text></g>}
    <g transform={`translate(${robotX} ${robotY})`} aria-hidden="true" pointerEvents="none">
      <ellipse cy="17" rx="29" ry="9" fill="#173b50" opacity=".32" />
      <image href={`${assets}/robot.webp`} x="-40" y="-34" width="80" height="80" />
      {robot && <CaseSprite x={0} y={-16} small />}
    </g>
  </svg>;
}
