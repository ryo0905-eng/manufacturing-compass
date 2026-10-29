"use client";

import { useState, type KeyboardEvent } from "react";
import { MetricBarChart, type MetricBarChartItem } from "@/components/MetricBarChart";
import { trackEvent } from "@/lib/analytics";
import styles from "./MarketCapRankingTable.module.css";

type Scope = "world" | "japan" | "all";
type Rectangle = { id: string; x: number; y: number; width: number; height: number; name: string; displayValue: string; share: string; href: string; labelLevel: 0 | 1 | 2 };
type ChartGroup = { items: MetricBarChartItem[]; rectangles: Rectangle[]; description: string; scale: string };
type Props = { groups: Record<Scope, ChartGroup>; formattedDate: string; sourceSlug?: string };
const tabs: { id: Scope; label: string }[] = [
  { id: "world", label: "世界" }, { id: "japan", label: "日本" }, { id: "all", label: "全体" },
];

export function MarketCapRankingChart({ groups, formattedDate, sourceSlug }: Props) {
  const [scope, setScope] = useState<Scope>("world");
  const [view, setView] = useState<"bar" | "treemap">("bar");
  const [expanded, setExpanded] = useState(false);
  const group = groups[scope];
  const items = expanded ? group.items : group.items.slice(0, 10);
  function select(next: Scope) {
    if (next === scope) return;
    setScope(next);
    setExpanded(false);
    try { trackEvent("ranking_chart_scope_change", { scope: next, source_page: "semiconductor-market-cap-ranking" }); } catch { /* Browsing must work without analytics. */ }
  }
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    select(tabs[next].id);
    event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-chart-scope="${tabs[next].id}"]`)?.focus();
  }
  function selectView(next: "bar" | "treemap") {
    if (next === view) return;
    setView(next);
    try { trackEvent("ranking_chart_view_change", { view: next, scope, source_page: "semiconductor-market-cap-ranking" }); } catch { /* Browsing must work without analytics. */ }
  }
  const controls = <><div className={styles.chartTabs} role="tablist" aria-label="グラフの対象">
    {tabs.map((tab, index) => <button key={tab.id} type="button" role="tab" id={`market-cap-tab-${tab.id}`} data-chart-scope={tab.id}
      aria-selected={scope === tab.id} aria-controls="market-cap-chart-panel" tabIndex={scope === tab.id ? 0 : -1}
      onClick={() => select(tab.id)} onKeyDown={event => onTabKey(event, index)}>{tab.label}</button>)}
  </div><div className={styles.viewToggle} role="group" aria-label="グラフの表示形式">
    <button type="button" aria-pressed={view === "bar"} onClick={() => selectView("bar")}>棒グラフ</button>
    <button type="button" aria-pressed={view === "treemap"} onClick={() => selectView("treemap")}>ツリーマップ</button>
  </div></>;
  const footer = group.items.length > 10 ? <button className={styles.chartExpand} type="button" aria-expanded={expanded}
    onClick={() => setExpanded(!expanded)}>{expanded ? "上位10社に戻す" : `掲載${group.items.length}社をすべて見る`} <span aria-hidden="true">{expanded ? "↑" : "↓"}</span></button> : null;

  if (view === "treemap") return <figure className={`salary-bar-chart metric-bar-chart ${styles.overviewChart}`}>
    <figcaption><span>Market cap · ranking</span><strong>時価総額 ツリーマップ</strong>{controls}<small>{formattedDate}基準・米ドル。{group.description}面積は掲載企業の時価総額に比例します。詳細は下の一覧をご覧ください。</small></figcaption>
    <div role="tabpanel" id="market-cap-chart-panel" aria-labelledby={`market-cap-tab-${scope}`}>
      <svg className={styles.treemap} viewBox="0 0 900 500" role="group" aria-label="時価総額の構成比">
        {group.rectangles.map((rect, index) => <a key={rect.id} href={rect.href} aria-label={`${rect.name}・${rect.displayValue}`} className={styles.treemapLink}>
          <title>{rect.name}・{rect.displayValue}</title>
          <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} fill={`hsl(211, 75%, ${35 + Math.round(index / Math.max(1, group.rectangles.length - 1) * 20)}%)`} stroke="white" strokeWidth="2" />
          {rect.labelLevel > 0 && <text x={rect.x + 8} y={rect.y + 20} fill="white" fontSize="14" pointerEvents="none"><tspan x={rect.x + 8}>{rect.name.length > Math.max(4, Math.floor((rect.width - 16) / 14)) ? `${rect.name.slice(0, Math.max(3, Math.floor((rect.width - 16) / 14) - 1))}…` : rect.name}</tspan><tspan x={rect.x + 8} dy="18">{rect.labelLevel === 2 ? `${rect.displayValue} · ` : ""}{rect.share}</tspan></text>}
        </a>)}
      </svg>
    </div>
  </figure>;
  return <MetricBarChart className={styles.overviewChart} eyebrow="Market cap · ranking"
      title={expanded ? "時価総額 早見グラフ" : "時価総額 TOP10 早見グラフ"} sourceSlug={sourceSlug} items={items} controls={controls} footer={footer}
      panelId="market-cap-chart-panel" panelLabelledBy={`market-cap-tab-${scope}`}
      note={`${formattedDate}基準・米ドル。${group.description} ${group.scale}棒は0から対象内の1位までの共通尺度です。企業を選ぶと詳細ページへ移動します。詳細未掲載の企業は一覧へ移動します。`} />;
}
