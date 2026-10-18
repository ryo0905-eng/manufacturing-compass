"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { annualWindow, annualIndexBase, type AnnualYears, type AnnualChartMetric, type AnnualSeries } from "@/lib/earnings-history-math";
import { AnnualPeriodControl, useAnnualYears } from "./AnnualPeriodControl";
import { AnnualLineChart } from "./AnnualCharts";
import { AnnualDataTable } from "./AnnualHistory";
import { EarningsInternalLink } from "./EarningsLinks";
import styles from "./AnnualHistory.module.css";

export function AnnualCompare({ histories, initialGroup = "equipment", initialCompany, initialYears = 10 }: { histories: AnnualSeries[]; initialGroup?: "equipment" | "memory"; initialCompany?: string; initialYears?: AnnualYears }) {
  const { years, changeYears } = useAnnualYears(initialYears);
  const defaults = (group: "equipment" | "memory") => group === "equipment" ? ["applied-materials", "lam-research"] : ["kioxia", "micron"];
  const initial = initialCompany && histories.some(item => item.companyId === initialCompany && item.segment === initialGroup)
    ? [initialCompany, ...defaults(initialGroup).filter(id => id !== initialCompany)].slice(0, 2) : defaults(initialGroup);
  const [group, setGroup] = useState(initialGroup);
  const [selection, setSelection] = useState(initial);
  const [shown, setShown] = useState(initial);
  const [metric, setMetric] = useState<AnnualChartMetric>("margin");
  const [message, setMessage] = useState("");
  const visible = shown.flatMap(id => histories.filter(item => item.companyId === id).map(item => annualWindow(item, years)));
  function changeGroup(next: "equipment" | "memory") {
    setGroup(next); setSelection(defaults(next)); setShown(defaults(next)); setMessage("");
  }
  function compare() {
    if (selection.length < 2 || selection.length > 3) { setMessage("2〜3社を選んでください。"); return; }
    setShown(selection); setMessage(`${selection.length}社の比較を更新しました。`);
    trackEvent("earnings_history_action", { action: "compare_run", years, company_ids: [...selection].sort().join("+"), company_count: selection.length, metric, ui_version: "annual-v2" });
  }
  function changeMetric(next: AnnualChartMetric) {
    if (next === metric) return;
    setMetric(next);
    trackEvent("earnings_history_action", { action: "metric_select", years, metric: next, company_ids: [...shown].sort().join("+"), ui_version: "annual-v2" });
  }
  return <section className={styles.section} aria-labelledby="annual-compare-title">
    <h2 id="annual-compare-title">同業他社と年次{years}年を比較する</h2>
    <AnnualPeriodControl years={years} onChange={next => { if (changeYears(next)) trackEvent("earnings_history_action", { action: "period_select", years: next, company_ids: [...shown].sort().join("+"), ui_version: "annual-v2" }); }} />
    <div className={styles.controls} role="group" aria-label="年次比較の事業領域">{(["equipment", "memory"] as const).map(value => <button key={value} type="button" aria-pressed={group === value} onClick={() => changeGroup(value)}>{value === "equipment" ? "製造装置" : "メモリ関連"}</button>)}</div>
    <p className={styles.note}>同じ領域の2〜3社を選んで比較します。各社の会計期間・事業範囲は異なります。SamsungはDS部門で、メモリ単独ではありません。</p>
    <div className={styles.controls} role="group" aria-label="年次比較する企業">{histories.filter(item => item.segment === group).map(item => <label key={item.companyId}><input type="checkbox" checked={selection.includes(item.companyId)} disabled={!selection.includes(item.companyId) && selection.length >= 3} onChange={() => { setMessage(""); setSelection(current => current.includes(item.companyId) ? current.filter(id => id !== item.companyId) : current.length < 3 ? [...current, item.companyId] : current); }} /> {item.name}</label>)}</div>
    <div className={styles.controls}><button type="button" onClick={compare}>選んだ企業を比較する</button></div>
    <p className={styles.note} role="status">{message || `${visible.map(item => item.name).join("・")}を表示中。企業を選び、比較を実行してください。`}</p>
    <div className={styles.controls} role="group" aria-label="年次グラフの指標"><button type="button" aria-pressed={metric === "margin"} onClick={() => changeMetric("margin")}>営業利益率</button><button type="button" aria-pressed={metric === "revenueIndex"} onClick={() => changeMetric("revenueIndex")}>売上高指数</button></div>
    <AnnualLineChart series={visible} metric={metric} />
    <p className={styles.note}>横軸は実際の決算期末日です。売上高指数は各社の直近期につながる比較可能区間の最古期を100とする成長の比較で、企業規模の比較ではありません。起点の時期が異なります。通貨換算は行っていません。</p>
    <div className={styles.seriesTables}>{visible.map(item => <div key={item.companyId}><h3>{item.name}</h3><p className={styles.note}>指数の起点：{annualIndexBase(item)?.label}（期末 {annualIndexBase(item)?.end}） · {item.periods.length}期掲載（最大{years}年） · 確認 {item.checkedAt}。{item.coverageNote}</p><AnnualDataTable series={item} includeIndex /><EarningsInternalLink href={`/semiconductor-watch/earnings/${item.companyId}?years=${years}#annual-history`} companyId={item.companyId} destination="annual_history">企業別の業績・決算の背景を見る →</EarningsInternalLink></div>)}</div>
  </section>;
}
