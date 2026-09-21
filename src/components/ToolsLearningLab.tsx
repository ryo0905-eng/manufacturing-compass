"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

import { learningTools as tools, type ToolId } from "@/data/learning-tools";

const storageKey = "mc-tools-opened-v1";
const deviceType = () => typeof window === "undefined" ? "unknown" : window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";

function MiniPreview({ type, title }: { type: string; title: string }) {
  return <div className={`tool-mini-preview tool-mini-preview--${type}`} onPointerDown={() => trackEvent("tool_preview_interaction", { tool_name: title, source_section: "tool_card", device_type: deviceType() })}>
    <svg viewBox="0 0 320 142" role="img" aria-label={type === "inspection" ? "同じ合成基板画像をルールとAIで比較する模式図" : `${title}の動きを示すプレビュー`}>
      {type !== "inspection" && <path className="preview-grid" d="M24 20V120H304M24 70H304" />}
      {type === "inspection" && <><rect x="32" y="22" width="108" height="90" rx="5" fill="#e2e5e9" stroke="#94a3b8"/><rect x="180" y="22" width="108" height="90" rx="5" fill="#e2e5e9" stroke="#94a3b8"/><circle cx="70" cy="55" r="7" fill="#334155"/><circle cx="108" cy="84" r="5" fill="#334155"/><circle cx="218" cy="55" r="7" fill="#334155"/><circle cx="256" cy="84" r="5" fill="#334155"/><text x="86" y="133" textAnchor="middle">ルール</text><text x="234" y="133" textAnchor="middle">AI</text></>}
      {type === "gage" && <><g className="gage-parts"><path d="M48 93L48 53M42 57L54 57M42 89L54 89M100 105L100 70M94 74L106 74M94 101L106 101M152 78L152 38M146 42L158 42M146 74L158 74M204 98L204 61M198 65L210 65M198 94L210 94M256 72L256 31M250 35L262 35M250 68L262 68" /><circle cx="48" cy="73" r="5"/><circle cx="100" cy="87" r="5"/><circle cx="152" cy="58" r="5"/><circle cx="204" cy="80" r="5"/><circle cx="256" cy="51" r="5"/></g><text x="24" y="136">部品差</text><text x="245" y="136">測定誤差</text></>}
      {type === "chart" && <><path className="limit" d="M24 38H304M24 103H304"/><path className="center" d="M24 70H304"/><polyline className="data-line chart-shift" points="24,74 45,66 66,72 87,62 108,73 129,67 150,71 171,65 192,49 213,45 234,40 255,35 276,31 297,28"/><circle className="signal-dot" cx="276" cy="31" r="5"/><text x="27" y="34">UCL</text><text x="27" y="116">LCL</text></>}
      {type === "yield" && <><path className="limit" d="M24 102L304 102"/><path className="" d="M164 20V120"/><polyline className="data-line" points="24,51 44,48 64,55 84,50 104,53 124,47 144,52 164,54 184,57 204,78 224,88 244,91 264,86 284,94 304,90"/><circle className="signal-dot" cx="244" cy="91" r="5"/><text x="26" y="116">歩留まり下限</text></>}
      {type === "cpk" && <><path className="spec" d="M67 22V120M274 22V120"/><path className="distribution" d="M36 120C70 119 91 111 111 75C132 36 158 27 180 74C199 111 224 119 298 120"/><g className="cpk-values"><text x="36" y="34">Cp 1.42</text><text x="218" y="34">Cpk 1.31</text></g><text x="60" y="136">LSL</text><text x="267" y="136">USL</text></>}
      {type === "taguchi" && <><path className="interaction-a" d="M50 32L164 105L275 25"/><path className="interaction-b" d="M50 56L164 89L275 45"/><text x="28" y="136">原料特性：低い</text><text x="235" y="136">高い</text></>}
      {type === "bayesian" && <><path className="interaction-a" d="M45 42L100 91L168 63L224 94L274 102"/><circle cx="45" cy="42" r="4"/><circle cx="100" cy="91" r="4"/><circle cx="168" cy="63" r="4"/><circle cx="224" cy="94" r="4"/><path className="interaction-b" d="M274 94l8 8 -8 8 -8 -8Z"/><text x="30" y="136">実験</text><text x="225" y="136">次の候補</text></>}
      {type === "doe" && <><path className="interaction-a" d="M70 99L257 43"/><path className="interaction-b" d="M70 48L257 94"/><circle cx="70" cy="99" r="4"/><circle cx="257" cy="43" r="4"/><circle cx="70" cy="48" r="4"/><circle cx="257" cy="94" r="4"/><text x="58" y="136">低</text><text x="247" y="136">高</text></>}
      {type === "balance" && <><rect className="balance-segment balance-segment--1" x="52" y="66" width="48" height="54"/><rect className="balance-segment balance-segment--2" x="52" y="42" width="48" height="24"/><rect className="balance-segment balance-segment--1" x="136" y="34" width="48" height="86"/><rect className="balance-segment balance-segment--2" x="136" y="18" width="48" height="16"/><rect className="balance-segment balance-segment--1" x="220" y="72" width="48" height="48"/><path className="limit" d="M24 50H304"/><text x="25" y="46">タクト</text></>}
      {type === "comparison" && <><path className="interaction-a" d="M45 64H90V40H135V26H180V47H225V64H280"/><path className="interaction-b" d="M45 115H90V99H135V79H180V91H225V115H280"/><text x="25" y="47">A</text><text x="25" y="95">B</text></>}
      {type === "oee" && <><rect className="oee-preview-track" x="50" y="37" width="230" height="17"/><rect className="oee-preview-bar" x="50" y="37" width="166" height="17"/><rect className="oee-preview-track" x="50" y="76" width="230" height="17"/><rect className="oee-preview-bar oee-preview-bar--improved" x="50" y="76" width="203" height="17"/><text x="50" y="31">現状 OEE</text><text x="50" y="70">改善後</text></>}
      {type === "jev" && <><rect className="jev-state" x="34" y="48" width="62" height="38" rx="5"/><path className="interaction-a" d="M103 67H142"/><circle className="signal-dot" cx="164" cy="67" r="20"/><path className="interaction-b" d="M186 55H288M186 67H267M186 79H243"/><text x="48" y="71">報告</text><text x="153" y="70">Jev</text><text x="238" y="47">確認先</text></>}
    </svg>
    <p>{type === "inspection" ? "同じ画像・同じ正解で比較（模式図）" : type === "taguchi" ? "誤差条件への反応を、2条件で比較" : type === "bayesian" ? "観測から、次に試す条件を選ぶ" : type === "jev" ? "追加情報で、判断の分布が変化" : type === "comparison" ? "2条件の分布とばらつきを比較" : type === "gage" ? "誤差が増えると部品差が見えにくくなる" : type === "chart" ? "平均シフトを管理限界で検出" : type === "yield" ? "低下した製品・装置へ絞り込む" : type === "cpk" ? "中心がずれるとCpkが低下" : type === "doe" ? "線が交差すると交互作用あり" : type === "balance" ? "工程負荷とタクト超過を比較" : "改善条件から良品数を推定"}</p>
  </div>;
}

export function ToolsLearningLab() {
  const [opened, setOpened] = useState<ToolId[]>([]);
  useEffect(() => {
    try { setOpened(JSON.parse(localStorage.getItem(storageKey) ?? "[]") as ToolId[]); } catch { setOpened([]); }
    trackEvent("tools_page_view", { source_section: "tools_hub", device_type: deviceType() });
  }, []);

  function recordOpen(id: ToolId, title: string, source: string) {
    const next = Array.from(new Set([...opened, id]));
    setOpened(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Navigation and learning remain available when storage is blocked. */ }
    trackEvent("tool_card_click", { tool_name: title, source_section: source, device_type: deviceType() });
  }

  function resetProgress() { setOpened([]); try { localStorage.removeItem(storageKey); } catch { /* No stored progress to remove. */ } }

  return <>
    <nav className="tools-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span aria-hidden="true">/</span><span>学習ツール</span></nav>
    <section className="tools-lab-hero">
      <div className="tools-lab-hero__copy"><p className="tools-eyebrow"><span aria-hidden="true" />無料・登録不要の実務ツール</p><h1>製造技術を、計算して、<br />動かして理解する。</h1><p>品質管理・統計手法と現場改善を、数値やグラフを動かしながら学び、試せます。</p><div className="tools-hero-actions"><a className="tools-primary-cta" href="#learning-roadmap">ツールを選ぶ <span aria-hidden="true">↓</span></a><a className="tools-secondary-cta" href="#tool-lab">{tools.length}個のツールを見る</a></div></div>
      <div className="tools-flow-visual" aria-label="測定、安定性、能力、改善の4段階"><span>測定</span><i>→</i><span>安定性</span><i>→</i><span>能力</span><i>→</i><span>改善</span><small>DATA → DECISION → ACTION</small></div>
    </section>

    <aside className="tools-game-entry">
      <div><p className="section-label">FACTORY INVESTIGATION PROTOTYPE</p><h2>2台の異常。原因は1つ？</h2><p>観察・比較試験・対策で、良品が流れる工場を取り戻す原因調査ゲーム。稼働90秒＋時間制限のない調査で、生産技術の判断を体験します。</p></div>
      <Link href="/games/process-engineer-survival">製造技術者サバイバルで遊ぶ <span aria-hidden="true">→</span></Link>
    </aside>

    <section className="learning-roadmap" id="learning-roadmap" aria-labelledby="roadmap-title"><header><div><p className="section-label">TOOL ROADMAP</p><h2 id="roadmap-title">今の用事から選ぶ{tools.length}の入口</h2></div><p>測定・安定性・歩留まり・原因調査・工程能力・条件探索に加え、AI外観検査や次に見る場所を選ぶAIデモを試せます。</p></header><ol>{tools.map((tool) => <li key={tool.id}><span>{tool.step}</span><div><small>{tool.role}</small><h3>{tool.question}</h3><p>{tool.title}</p><Link href={tool.href} onClick={() => recordOpen(tool.id, tool.title, "learning_roadmap")}>試す <i aria-hidden="true">→</i></Link></div></li>)}</ol></section>

    <section className="tools-lab-directory" id="tool-lab" aria-labelledby="tools-title"><header><div><p className="section-label">INTERACTIVE TOOLS</p><h2 id="tools-title">動かして、3分で試す</h2></div><div className="tools-progress" aria-live="polite"><span><b>{opened.length}</b> / {tools.length} ツールを体験済み</span>{opened.length > 0 && <button onClick={resetProgress} type="button">進捗をリセット</button>}</div></header><div className="tools-card-grid">{tools.map((tool) => <article className="learning-tool-card" key={tool.id}><header><div><span>{tool.step} / {tool.role}</span><h3>{tool.title}</h3></div><em>{tool.badge}</em></header><MiniPreview type={tool.preview} title={tool.title}/><strong className="tool-card-message">{tool.message}</strong><p>{tool.description}</p><ul>{tool.features.map(feature => <li key={feature}>{feature}</li>)}</ul><dl><div><dt>所要時間</dt><dd>{tool.time}</dd></div><div><dt>難易度</dt><dd>{tool.level}</dd></div><div><dt>実務利用</dt><dd>{tool.id === "jev" ? "教育デモ" : (tool.id === "bayesian-optimization" || tool.id === "taguchi" || tool.id === "ai-visual-inspection") ? "教育用" : "可能"}</dd></div></dl><footer><Link className="tool-card-primary" href={tool.href} onClick={() => recordOpen(tool.id, tool.title, "tool_card_cta")}>すぐ試す <span aria-hidden="true">→</span></Link></footer></article>)}</div></section>
  </>;
}
