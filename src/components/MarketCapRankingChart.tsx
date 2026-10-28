"use client";

import { useState, type KeyboardEvent } from "react";
import { MetricBarChart, type MetricBarChartItem } from "@/components/MetricBarChart";
import { trackEvent } from "@/lib/analytics";
import styles from "./MarketCapRankingTable.module.css";

type Scope = "world" | "japan" | "all";
type ChartGroup = { items: MetricBarChartItem[]; description: string; scale: string };
type Props = { groups: Record<Scope, ChartGroup>; formattedDate: string; sourceSlug?: string };
const tabs: { id: Scope; label: string }[] = [
  { id: "world", label: "世界" }, { id: "japan", label: "日本" }, { id: "all", label: "全体" },
];

export function MarketCapRankingChart({ groups, formattedDate, sourceSlug }: Props) {
  const [scope, setScope] = useState<Scope>("world");
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
  const controls = <div className={styles.chartTabs} role="tablist" aria-label="グラフの対象">
    {tabs.map((tab, index) => <button key={tab.id} type="button" role="tab" id={`market-cap-tab-${tab.id}`} data-chart-scope={tab.id}
      aria-selected={scope === tab.id} aria-controls="market-cap-chart-panel" tabIndex={scope === tab.id ? 0 : -1}
      onClick={() => select(tab.id)} onKeyDown={event => onTabKey(event, index)}>{tab.label}</button>)}
  </div>;
  const footer = group.items.length > 10 ? <button className={styles.chartExpand} type="button" aria-expanded={expanded}
    onClick={() => setExpanded(!expanded)}>{expanded ? "上位10社に戻す" : `掲載${group.items.length}社をすべて見る`} <span aria-hidden="true">{expanded ? "↑" : "↓"}</span></button> : null;

  return <MetricBarChart className={styles.overviewChart} eyebrow="Market cap · ranking"
      title="時価総額の早見グラフ" sourceSlug={sourceSlug} items={items} controls={controls} footer={footer}
      panelId="market-cap-chart-panel" panelLabelledBy={`market-cap-tab-${scope}`}
      note={`${formattedDate}基準・米ドル。${group.description} ${group.scale}棒は0から対象内の1位までの共通尺度です。企業名から一覧へ移動できます。`} />;
}
