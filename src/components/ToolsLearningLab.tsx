"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type ToolId = "gage-rr" | "control-chart" | "yield-analysis" | "yield-dashboard" | "cpk" | "doe" | "line-balance" | "oee" | "process-comparison" | "jev";

const tools = [
  { id: "gage-rr", href: "/tools/gage-rr", step: "01", question: "測れるか", title: "Gage R&R", role: "測定システムを評価", badge: "まず確認", message: "その測定値は、部品差を見分けられるか", description: "部品差と測定誤差を分け、信頼できるデータを集められるか確かめます。", features: ["繰返し性・再現性", "%GRR・ndc", "改善シミュレーション"], time: "5〜10分", level: "入門", preview: "gage" },
  { id: "control-chart", href: "/tools/control-chart", step: "02", question: "工程は安定しているか", title: "管理図", role: "工程の安定性を評価", badge: "実務向け", message: "工程の異常を、規格外になる前に見つける", description: "時系列の変化と管理限界を見比べ、特殊原因のシグナルを捉えます。", features: ["I-MR・Xbar-R", "異常ルール", "原因調査の流れ"], time: "5〜10分", level: "入門", preview: "chart" },
  { id: "yield-analysis", href: "/tools/yield-analysis", step: "03", question: "歩留まりはどこで下がったか", title: "歩留まり解析", role: "低下条件を絞り込み", badge: "新着", message: "いつ・どの製品・どの装置かを分けて見る", description: "p管理図、製品・装置比較、構成比の比較から、次に調べる条件を整理します。", features: ["CSV読込", "p管理図", "製品構成の比較"], time: "5〜10分", level: "基礎", preview: "yield" },
  { id: "yield-dashboard", href: "/tools/yield-dashboard", step: "04", question: "原因候補をどこまで掘れるか", title: "歩留まり原因調査", role: "BI調査フローを体験", badge: "新着", message: "不良・ロット・工程条件・履歴を一つにつなぐ", description: "架空の半導体工場で、偏りの発見から確認実験までをガイド付きで進めます。", features: ["連動フィルター", "条件・履歴比較", "確認実験"], time: "約5分", level: "基礎", preview: "yield" },
  { id: "cpk", href: "/tools/cpk", step: "05", question: "規格を満たせる能力があるか", title: "Cp・Cpk", role: "安定した工程の能力を評価", badge: "人気", message: "ばらつきだけでなく、中心のずれも評価する", description: "工程が安定していることを確認した後、規格幅に対するばらつきと中心のずれを評価します。", features: ["Cp・Cpk / Pp・Ppk", "ヒストグラム", "中心ずれの比較"], time: "3〜8分", level: "入門", preview: "cpk" },
  { id: "doe", href: "/tools/doe", step: "06", question: "どう改善するか", title: "実験計画法（DoE）", role: "改善条件を効率的に探索", badge: "次の一歩", message: "複数の条件を、効率よく比較する", description: "複数因子の主効果と交互作用を読み、改善条件を少ない実験で探索します。", features: ["2因子2水準", "交互作用・ANOVA", "残差・確認実験"], time: "8〜15分", level: "基礎", preview: "doe" },
  { id: "line-balance", href: "/tools/line-balance", step: "07", question: "工程の負荷は偏っていないか", title: "山積み表・ラインバランス", role: "作業配分を比較", badge: "実務ツール", message: "作業を移し、タクト超過の変化を見る", description: "工程別の作業時間を積み上げ、再配分前後の負荷を比較します。", features: ["積み上げ棒グラフ", "タクト超過", "配分の基準比較"], time: "3〜8分", level: "入門", preview: "balance" },
  { id: "oee", href: "/tools/oee", step: "08", question: "どのロスを改善するか", title: "OEE改善シミュレーター", role: "設備ロスを比較", badge: "実務ツール", message: "停止・速度・不良を、良品数につなげる", description: "OEEの内訳と改善シナリオから、推定良品生産量を比較します。", features: ["OEE自動計算", "3つのロス", "推定良品数"], time: "3〜5分", level: "入門", preview: "oee" },
  { id: "process-comparison", href: "/tools/process-comparison", step: "09", question: "2条件の測定値はどう違うか", title: "工程条件の比較", role: "実測データを比較", badge: "実務ツール", message: "変更前後の分布を、報告資料にまとめる", description: "2条件の平均・ばらつき・規格内率を比較し、表とPNGを持ち帰れます。", features: ["測定値を貼り付け", "共通スケールの分布図", "表コピー・PNG保存"], time: "約3分", level: "入門", preview: "comparison" },
  { id: "jev", href: "/labs/jev", step: "10", question: "次にどこを見るか", title: "Jev AI Lab", role: "AIの型付き判断を体験", badge: "NEW", message: "情報を足すと、確認先の確率はどう動く？", description: "半導体の架空報告で、Choice・Boolean・Scoreと調査ルートの変化を試します。", features: ["固定の架空データ", "初報との比較", "自動操作なし"], time: "約3分", level: "入門", preview: "jev" },
] as const;

const storageKey = "mc-tools-opened-v1";
const deviceType = () => typeof window === "undefined" ? "unknown" : window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";

function MiniPreview({ type, title }: { type: string; title: string }) {
  return <div className={`tool-mini-preview tool-mini-preview--${type}`} onPointerDown={() => trackEvent("tool_preview_interaction", { tool_name: title, source_section: "tool_card", device_type: deviceType() })}>
    <svg viewBox="0 0 320 142" role="img" aria-label={`${title}の動きを示すプレビュー`}>
      <path className="preview-grid" d="M24 20V120H304M24 70H304" />
      {type === "gage" && <><g className="gage-parts"><path d="M48 93L48 53M42 57L54 57M42 89L54 89M100 105L100 70M94 74L106 74M94 101L106 101M152 78L152 38M146 42L158 42M146 74L158 74M204 98L204 61M198 65L210 65M198 94L210 94M256 72L256 31M250 35L262 35M250 68L262 68" /><circle cx="48" cy="73" r="5"/><circle cx="100" cy="87" r="5"/><circle cx="152" cy="58" r="5"/><circle cx="204" cy="80" r="5"/><circle cx="256" cy="51" r="5"/></g><text x="24" y="136">部品差</text><text x="245" y="136">測定誤差</text></>}
      {type === "chart" && <><path className="limit" d="M24 38H304M24 103H304"/><path className="center" d="M24 70H304"/><polyline className="data-line chart-shift" points="24,74 45,66 66,72 87,62 108,73 129,67 150,71 171,65 192,49 213,45 234,40 255,35 276,31 297,28"/><circle className="signal-dot" cx="276" cy="31" r="5"/><text x="27" y="34">UCL</text><text x="27" y="116">LCL</text></>}
      {type === "yield" && <><path className="limit" d="M24 102L304 102"/><path className="" d="M164 20V120"/><polyline className="data-line" points="24,51 44,48 64,55 84,50 104,53 124,47 144,52 164,54 184,57 204,78 224,88 244,91 264,86 284,94 304,90"/><circle className="signal-dot" cx="244" cy="91" r="5"/><text x="26" y="116">歩留まり下限</text></>}
      {type === "cpk" && <><path className="spec" d="M67 22V120M274 22V120"/><path className="distribution" d="M36 120C70 119 91 111 111 75C132 36 158 27 180 74C199 111 224 119 298 120"/><g className="cpk-values"><text x="36" y="34">Cp 1.42</text><text x="218" y="34">Cpk 1.31</text></g><text x="60" y="136">LSL</text><text x="267" y="136">USL</text></>}
      {type === "doe" && <><path className="interaction-a" d="M70 99L257 43"/><path className="interaction-b" d="M70 48L257 94"/><circle cx="70" cy="99" r="4"/><circle cx="257" cy="43" r="4"/><circle cx="70" cy="48" r="4"/><circle cx="257" cy="94" r="4"/><text x="58" y="136">低</text><text x="247" y="136">高</text></>}
      {type === "balance" && <><rect className="balance-segment balance-segment--1" x="52" y="66" width="48" height="54"/><rect className="balance-segment balance-segment--2" x="52" y="42" width="48" height="24"/><rect className="balance-segment balance-segment--1" x="136" y="34" width="48" height="86"/><rect className="balance-segment balance-segment--2" x="136" y="18" width="48" height="16"/><rect className="balance-segment balance-segment--1" x="220" y="72" width="48" height="48"/><path className="limit" d="M24 50H304"/><text x="25" y="46">タクト</text></>}
      {type === "comparison" && <><path className="interaction-a" d="M45 64H90V40H135V26H180V47H225V64H280"/><path className="interaction-b" d="M45 115H90V99H135V79H180V91H225V115H280"/><text x="25" y="47">A</text><text x="25" y="95">B</text></>}
      {type === "oee" && <><rect className="oee-preview-track" x="50" y="37" width="230" height="17"/><rect className="oee-preview-bar" x="50" y="37" width="166" height="17"/><rect className="oee-preview-track" x="50" y="76" width="230" height="17"/><rect className="oee-preview-bar oee-preview-bar--improved" x="50" y="76" width="203" height="17"/><text x="50" y="31">現状 OEE</text><text x="50" y="70">改善後</text></>}
      {type === "jev" && <><rect className="jev-state" x="34" y="48" width="62" height="38" rx="5"/><path className="interaction-a" d="M103 67H142"/><circle className="signal-dot" cx="164" cy="67" r="20"/><path className="interaction-b" d="M186 55H288M186 67H267M186 79H243"/><text x="48" y="71">報告</text><text x="153" y="70">Jev</text><text x="238" y="47">確認先</text></>}
    </svg>
    <p>{type === "jev" ? "追加情報で、判断の分布が変化" : type === "comparison" ? "2条件の分布とばらつきを比較" : type === "gage" ? "誤差が増えると部品差が見えにくくなる" : type === "chart" ? "平均シフトを管理限界で検出" : type === "yield" ? "低下した製品・装置へ絞り込む" : type === "cpk" ? "中心がずれるとCpkが低下" : type === "doe" ? "線が交差すると交互作用あり" : type === "balance" ? "工程負荷とタクト超過を比較" : "改善条件から良品数を推定"}</p>
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
      <div className="tools-lab-hero__copy"><p className="tools-eyebrow"><span aria-hidden="true" />無料・登録不要の実務ツール</p><h1>製造技術を、計算して、<br />動かして理解する。</h1><p>品質管理・統計手法と現場改善を、数値やグラフを動かしながら学び、試せます。</p><div className="tools-hero-actions"><a className="tools-primary-cta" href="#learning-roadmap">ツールを選ぶ <span aria-hidden="true">↓</span></a><a className="tools-secondary-cta" href="#tool-lab">10個のツールを見る</a></div></div>
      <div className="tools-flow-visual" aria-label="測定、安定性、能力、改善の4段階"><span>測定</span><i>→</i><span>安定性</span><i>→</i><span>能力</span><i>→</i><span>改善</span><small>DATA → DECISION → ACTION</small></div>
    </section>

    <aside className="tools-game-entry">
      <div><p className="section-label">FACTORY INVESTIGATION PROTOTYPE</p><h2>2台の異常。原因は1つ？</h2><p>観察・比較試験・対策で、良品が流れる工場を取り戻す原因調査ゲーム。稼働90秒＋時間制限のない調査で、生産技術の判断を体験します。</p></div>
      <Link href="/games/process-engineer-survival">製造技術者サバイバルで遊ぶ <span aria-hidden="true">→</span></Link>
    </aside>

    <section className="learning-roadmap" id="learning-roadmap" aria-labelledby="roadmap-title"><header><div><p className="section-label">TOOL ROADMAP</p><h2 id="roadmap-title">今の用事から選ぶ10の入口</h2></div><p>測定・安定性・歩留まり・原因調査・工程能力・条件探索と、次に見る場所を選ぶAIデモを試せます。</p></header><ol>{tools.map((tool) => <li key={tool.id}><span>{tool.step}</span><div><small>{tool.role}</small><h3>{tool.question}</h3><p>{tool.title}</p><Link href={tool.href} onClick={() => recordOpen(tool.id, tool.title, "learning_roadmap")}>試す <i aria-hidden="true">→</i></Link></div></li>)}</ol></section>

    <section className="tools-lab-directory" id="tool-lab" aria-labelledby="tools-title"><header><div><p className="section-label">INTERACTIVE TOOLS</p><h2 id="tools-title">動かして、3分で試す</h2></div><div className="tools-progress" aria-live="polite"><span><b>{opened.length}</b> / {tools.length} ツールを体験済み</span>{opened.length > 0 && <button onClick={resetProgress} type="button">進捗をリセット</button>}</div></header><div className="tools-card-grid">{tools.map((tool) => <article className="learning-tool-card" key={tool.id}><header><div><span>{tool.step} / {tool.role}</span><h3>{tool.title}</h3></div><em>{tool.badge}</em></header><MiniPreview type={tool.preview} title={tool.title}/><strong className="tool-card-message">{tool.message}</strong><p>{tool.description}</p><ul>{tool.features.map(feature => <li key={feature}>{feature}</li>)}</ul><dl><div><dt>所要時間</dt><dd>{tool.time}</dd></div><div><dt>難易度</dt><dd>{tool.level}</dd></div><div><dt>実務利用</dt><dd>{tool.id === "jev" ? "教育デモ" : "可能"}</dd></div></dl><footer><Link className="tool-card-primary" href={tool.href} onClick={() => recordOpen(tool.id, tool.title, "tool_card_cta")}>すぐ試す <span aria-hidden="true">→</span></Link></footer></article>)}</div></section>
  </>;
}
