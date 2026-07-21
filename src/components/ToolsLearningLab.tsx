"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type ToolId = "gage-rr" | "control-chart" | "cpk" | "doe";

const tools = [
  { id: "gage-rr", href: "/tools/gage-rr", step: "01", question: "測れるか", title: "Gage R&R", role: "測定システムを評価", badge: "まず確認", message: "その測定値は、部品差を見分けられるか", description: "部品差と測定誤差を分け、信頼できるデータを集められるか確かめます。", features: ["繰返し性・再現性", "%GRR・ndc", "改善シミュレーション"], time: "5〜10分", level: "入門", preview: "gage" },
  { id: "control-chart", href: "/tools/control-chart", step: "02", question: "工程は安定しているか", title: "管理図", role: "工程の安定性を評価", badge: "実務向け", message: "工程の異常を、規格外になる前に見つける", description: "時系列の変化と管理限界を見比べ、特殊原因のシグナルを捉えます。", features: ["I-MR・Xbar-R", "異常ルール", "原因調査の流れ"], time: "5〜10分", level: "入門", preview: "chart" },
  { id: "cpk", href: "/tools/cpk", step: "03", question: "規格を満たせる能力があるか", title: "Cp・Cpk", role: "安定した工程の能力を評価", badge: "人気", message: "ばらつきだけでなく、中心のずれも評価する", description: "工程が安定していることを確認した後、規格幅に対するばらつきと中心のずれを評価します。", features: ["Cp・Cpk / Pp・Ppk", "ヒストグラム", "中心ずれの比較"], time: "3〜8分", level: "入門", preview: "cpk" },
  { id: "doe", href: "/tools/doe", step: "04", question: "どう改善するか", title: "実験計画法（DoE）", role: "改善条件を効率的に探索", badge: "次の一歩", message: "複数の条件を、効率よく比較する", description: "複数因子の主効果と交互作用を読み、改善条件を少ない実験で探索します。", features: ["2因子2水準", "交互作用・ANOVA", "残差・確認実験"], time: "8〜15分", level: "基礎", preview: "doe" },
] as const;

const storageKey = "mc-tools-opened-v1";
const deviceType = () => typeof window === "undefined" ? "unknown" : window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";

function MiniPreview({ type, title }: { type: string; title: string }) {
  return <div className={`tool-mini-preview tool-mini-preview--${type}`} onPointerDown={() => trackEvent("tool_preview_interaction", { tool_name: title, source_section: "tool_card", device_type: deviceType() })}>
    <svg viewBox="0 0 320 142" role="img" aria-label={`${title}の動きを示すプレビュー`}>
      <path className="preview-grid" d="M24 20V120H304M24 70H304" />
      {type === "gage" && <><g className="gage-parts"><path d="M48 93L48 53M42 57L54 57M42 89L54 89M100 105L100 70M94 74L106 74M94 101L106 101M152 78L152 38M146 42L158 42M146 74L158 74M204 98L204 61M198 65L210 65M198 94L210 94M256 72L256 31M250 35L262 35M250 68L262 68" /><circle cx="48" cy="73" r="5"/><circle cx="100" cy="87" r="5"/><circle cx="152" cy="58" r="5"/><circle cx="204" cy="80" r="5"/><circle cx="256" cy="51" r="5"/></g><text x="24" y="136">部品差</text><text x="245" y="136">測定誤差</text></>}
      {type === "chart" && <><path className="limit" d="M24 38H304M24 103H304"/><path className="center" d="M24 70H304"/><polyline className="data-line chart-shift" points="24,74 45,66 66,72 87,62 108,73 129,67 150,71 171,65 192,49 213,45 234,40 255,35 276,31 297,28"/><circle className="signal-dot" cx="276" cy="31" r="5"/><text x="27" y="34">UCL</text><text x="27" y="116">LCL</text></>}
      {type === "cpk" && <><path className="spec" d="M67 22V120M274 22V120"/><path className="distribution" d="M36 120C70 119 91 111 111 75C132 36 158 27 180 74C199 111 224 119 298 120"/><g className="cpk-values"><text x="36" y="34">Cp 1.42</text><text x="218" y="34">Cpk 1.31</text></g><text x="60" y="136">LSL</text><text x="267" y="136">USL</text></>}
      {type === "doe" && <><path className="interaction-a" d="M70 99L257 43"/><path className="interaction-b" d="M70 48L257 94"/><circle cx="70" cy="99" r="4"/><circle cx="257" cy="43" r="4"/><circle cx="70" cy="48" r="4"/><circle cx="257" cy="94" r="4"/><text x="58" y="136">低</text><text x="247" y="136">高</text></>}
    </svg>
    <p>{type === "gage" ? "誤差が増えると部品差が見えにくくなる" : type === "chart" ? "平均シフトを管理限界で検出" : type === "cpk" ? "中心がずれるとCpkが低下" : "線が交差すると交互作用あり"}</p>
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
      <div className="tools-lab-hero__copy"><p className="tools-eyebrow"><span aria-hidden="true" />無料・登録不要のインタラクティブ学習ラボ</p><h1>製造技術を、計算して、<br />動かして理解する。</h1><p>品質管理・統計手法を、数式を読むだけでなく、数値やグラフを動かしながら学べます。測定から条件最適化まで、実務の判断順に体験できます。</p><div className="tools-hero-actions"><a className="tools-primary-cta" href="#learning-roadmap">学習を始める <span aria-hidden="true">↓</span></a><a className="tools-secondary-cta" href="#tool-lab">4つのツールを見る</a></div></div>
      <div className="tools-flow-visual" aria-label="測定、安定性、能力、改善の4段階"><span>測定</span><i>→</i><span>安定性</span><i>→</i><span>能力</span><i>→</i><span>改善</span><small>DATA → DECISION → ACTION</small></div>
    </section>

    <section className="learning-roadmap" id="learning-roadmap" aria-labelledby="roadmap-title"><header><div><p className="section-label">LEARNING ROADMAP</p><h2 id="roadmap-title">製造データを判断する4ステップ</h2></div><p>測定の信頼性を確認し、工程の安定性を見極め、工程能力を評価し、最後に条件を改善します。</p></header><ol>{tools.map((tool) => <li key={tool.id}><span>{tool.step}</span><div><small>{tool.role}</small><h3>{tool.question}</h3><p>{tool.title}</p><Link href={tool.href} onClick={() => recordOpen(tool.id, tool.title, "learning_roadmap")}>学ぶ <i aria-hidden="true">→</i></Link></div></li>)}</ol></section>

    <section className="tools-lab-directory" id="tool-lab" aria-labelledby="tools-title"><header><div><p className="section-label">INTERACTIVE TOOLS</p><h2 id="tools-title">グラフを動かして、3分で試す</h2></div><div className="tools-progress" aria-live="polite"><span><b>{opened.length}</b> / 4 ツールを体験済み</span>{opened.length > 0 && <button onClick={resetProgress} type="button">進捗をリセット</button>}</div></header><div className="tools-card-grid">{tools.map((tool) => <article className="learning-tool-card" key={tool.id}><header><div><span>{tool.step} / {tool.role}</span><h3>{tool.title}</h3></div><em>{tool.badge}</em></header><MiniPreview type={tool.preview} title={tool.title}/><strong className="tool-card-message">{tool.message}</strong><p>{tool.description}</p><ul>{tool.features.map(feature => <li key={feature}>{feature}</li>)}</ul><dl><div><dt>学習時間</dt><dd>{tool.time}</dd></div><div><dt>難易度</dt><dd>{tool.level}</dd></div><div><dt>実務利用</dt><dd>可能</dd></div></dl><footer><Link className="tool-card-primary" href={tool.href} onClick={() => recordOpen(tool.id, tool.title, "tool_card_cta")}>すぐ試す <span aria-hidden="true">→</span></Link></footer></article>)}</div></section>
  </>;
}
