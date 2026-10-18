"use client";

import { useEffect, useState, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import { annualWindow, type AnnualSeries } from "@/lib/earnings-history-math";
import { WatchFinancialCard } from "./WatchFinancialCard";
import { watchExchange, watchFinancialDomain, watchMetrics } from "@/lib/watch-financials";
import { watchDate, watchTopics, type WatchItem } from "@/lib/watch-types";
import {
  companiesForTopic, readWatchSelection, sortWatchCompanies, watchNewsForTopic, watchSelectionHash,
  type WatchCompany, type WatchSelection,
} from "@/lib/watch-explorer";
import { MediaLink } from "./MediaLinks";
import styles from "./WatchExplorer.module.css";

const uiVersion = "cards-v2";
type Props = { companies: WatchCompany[]; news: WatchItem[]; now: string; histories?: AnnualSeries[]; children?: ReactNode };

export function WatchExplorer({ companies, news, now, histories = [], children }: Props) {
  const [selection, setSelection] = useState<WatchSelection>(() => readWatchSelection("", companies));
  const [expanded, setExpanded] = useState(false);
  const visible = companiesForTopic(companies, selection.topic);
  const ordered = sortWatchCompanies(visible, histories, selection.metric, selection.sort, selection.years);
  const articles = watchNewsForTopic(news, selection.topic, now);
  const domain = watchFinancialDomain(histories.filter(series => companies.some(company => company.id === series.companyId)), selection.metric, selection.years);
  const metric = watchMetrics.find(item => item.id === selection.metric)!;

  useEffect(() => {
    const restore = () => {
      setSelection(readWatchSelection(window.location.hash, companies));
      setExpanded(window.location.hash.startsWith("#signal-"));
    };
    restore();
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => { window.removeEventListener("hashchange", restore); window.removeEventListener("popstate", restore); };
  }, [companies]);

  // Old article links may point inside an archive or the additional news rows.
  useEffect(() => {
    if (!window.location.hash.startsWith("#signal-")) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    let parent = target.parentElement;
    while (parent) {
      if (parent.tagName === "DETAILS") (parent as HTMLDetailsElement).open = true;
      parent = parent.parentElement;
    }
    target.scrollIntoView({ block: "start" });
  }, [selection, expanded]);

  function select(next: WatchSelection, dimension: "theme" | "metric" | "period" | "sort") {
    if (dimension === "theme" && next.topic === selection.topic) return;
    if (dimension === "metric" && next.metric === selection.metric) return;
    if (dimension === "period" && next.years === selection.years) return;
    if (dimension === "sort" && next.sort === selection.sort) return;
    setSelection(next);
    if (dimension === "theme") setExpanded(false);
    window.history.pushState(null, "", watchSelectionHash(next));
    if (dimension !== "metric") trackEvent("chip_pulse_filter_change", {
      dimension, value: dimension === "theme" ? next.topic : dimension === "sort" ? next.sort : String(next.years), years: next.years, result_count: companiesForTopic(companies, next.topic).length, ui_version: uiVersion,
    });
    else trackEvent("chip_pulse_metric_select", { metric: next.metric, years: next.years, ui_version: uiVersion });
  }

  function selectTheme(topic: WatchSelection["topic"]) {
    const company = companiesForTopic(companies, topic).some(item => item.id === selection.company) ? selection.company : null;
    select({ ...selection, topic, company }, "theme");
  }

  return <>
    <nav className={styles.themes} aria-label="興味のあるテーマを選ぶ">
      <button type="button" aria-pressed={selection.topic === "all"} aria-controls="watch-chart watch-news" onClick={() => selectTheme("all")}>すべて</button>
      {watchTopics.map(topic => <button type="button" key={topic.id} aria-pressed={selection.topic === topic.id} aria-controls="watch-chart watch-news" onClick={() => selectTheme(topic.id)}>{topic.label}</button>)}
    </nav>

    <section className={styles.explorer} id="explore" aria-labelledby="watch-chart-title">
      <div className={styles.sectionHead}><div><h2 id="watch-chart-title">企業の業績を、ひと目で</h2><p>年次{selection.years}年 · 気になる企業から詳しく見る</p></div><span aria-live="polite">{visible.length}社</span></div>
      <div className={styles.controlBar}><div className={styles.metrics} role="group" aria-label="財務指標を選ぶ">{watchMetrics.map(metric => <button type="button" key={metric.id} aria-pressed={selection.metric === metric.id} aria-controls="watch-chart" onClick={() => select({ ...selection, metric: metric.id }, "metric")}>{metric.label}</button>)}</div>
      <div className={styles.metrics} role="group" aria-label="掲載期間を選ぶ">{([5, 10, 20] as const).map(years => <button type="button" key={years} aria-pressed={selection.years === years} aria-controls="watch-chart" onClick={() => select({ ...selection, years }, "period")}>{years}年</button>)}</div></div>
      {selection.metric === "revenue" ? <div className={styles.metrics} role="group" aria-label="売上高カードの並び順">{([{ id: "revenue", label: "売上高順" }, { id: "growth", label: "売上前年比順" }] as const).map(sort => <button type="button" key={sort.id} aria-pressed={selection.sort === sort.id} aria-controls="watch-chart" onClick={() => select({ ...selection, sort: sort.id }, "sort")}>{sort.label}</button>)}</div> : null}
      <p className={styles.chartNote}>{selection.metric === "revenue" ? <>
        同一為替で円換算した規模比較用の概算です（為替基準日 <time dateTime={watchExchange.asOf}>{watchExchange.asOf}</time>）。過去当時の円建て実績とは異なります。
        <MediaLink href={watchExchange.source.url} articleId="watch-exchange" action="source" placement="explore" uiVersion={uiVersion}>換算元：FRB H.10</MediaLink>。
      </> : "営業利益率（%）の推移。"}縦軸は全12社で共通、破線は{selection.metric === "revenue" ? "0円" : "0%"}です。通期実績の比較であり、各社で決算期・対象範囲が異なります。ホバー・タップ・左右キーで各期の値を確認できます。</p>
      <p className={styles.sortNote}>{selection.metric === "operating_margin" ? "直近通期の営業利益率が高い順" : selection.sort === "growth" ? "直近通期の売上前年比が高い順" : "直近通期の円換算売上高が大きい順"}</p>
      <p className={styles.srOnly} role="status">{metric.chartLabel}を{visible.length}社に表示（最大{selection.years}年）</p>
      <div id="watch-chart">
        {visible.length ? <ul className={styles.financialGrid} aria-label={`企業別の年次${metric.chartLabel}`}>{ordered.map(company => <WatchFinancialCard key={company.id} company={company} series={histories.find(series => series.companyId === company.id)} years={selection.years} metric={selection.metric} domain={domain} selected={selection.company === company.id} />)}</ul>
          : <div className={styles.empty}><p>このテーマの掲載決算はありません。</p><button type="button" onClick={() => selectTheme("all")}>すべての企業へ戻る</button></div>}
      </div>
      <details className={styles.disclosure}><summary>掲載期間が短い企業・比較の注意</summary><ul>{histories.filter(series => visible.some(company => company.id === series.companyId)).map(series => <li key={series.companyId}><strong>{series.name}：{annualWindow(series, selection.years).periods.length}期掲載（最大{selection.years}年）</strong><p>{series.coverageNote}</p></li>)}</ul></details>
      <MediaLink href="/semiconductor-watch/earnings" articleId="watch" action="background" destination="earnings" placement="navigation" uiVersion={uiVersion} className={styles.allEarnings}>決算一覧・比較へ <span aria-hidden="true">→</span></MediaLink>
      <details className={styles.disclosure}><summary>最新四半期の決算一覧</summary><ul>{visible.map(company => <li key={company.id}>
        <h3>{company.name} · 売上前年比 {company.metricLabel}</h3>
        <p>{company.period} · {company.periodKind} · {company.scope}</p>
        <p>売上高 {company.revenueLabel} · 営業利益 {company.operatingIncomeLabel}</p>
        <p>{company.summary}</p>{company.metricNote ? <p>{company.metricNote}</p> : null}
        <p>発表 {watchDate(company.announcedAt)} · 数値確認 {watchDate(company.checkedAt)}<br />{company.freshness.text}</p>
        <MediaLink href={company.href} articleId={company.id} action="article" destination="earnings" placement="explore" uiVersion={uiVersion}>最新四半期の数値・出典を見る →</MediaLink>
        {company.sourceHref ? <MediaLink href={company.sourceHref} articleId={company.id} action="source" placement="explore" uiVersion={uiVersion}>原資料 ↗</MediaLink> : null}
        <p>次回の決算発表：{company.nextEvent ? <MediaLink href={company.nextEvent.href} articleId={company.id} action="source" placement="schedule" uiVersion={uiVersion}>{company.nextEvent.label} ↗</MediaLink> : "日程は未確認です。"}</p>
      </li>)}</ul></details>
    </section>

    <section className={styles.news} id="watch-news" aria-labelledby="watch-news-title">
      <div className={styles.sectionHead}><div><h2 id="watch-news-title">テーマ全体のニュース</h2><p>直近30日 · {selection.topic === "all" ? "すべてのテーマ" : watchTopics.find(topic => topic.id === selection.topic)?.label}</p></div><span aria-live="polite">{articles.length}件</span></div>
      {articles.length ? <>
        <NewsRows items={articles.slice(0, 5)} />
        {articles.length > 5 ? <details className={styles.more} open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}><summary>{expanded ? "閉じる" : `もっと見る（${articles.length - 5}件）`}</summary><NewsRows items={articles.slice(5)} /></details> : null}
      </> : <p className={styles.empty}>このテーマで直近30日に掲載したニュースはありません。</p>}
    </section>
    <noscript><p className={styles.subtle}>全テーマの企業とニュースを表示しています。各社の決算・原資料や「もっと見る」はそのまま開けます。</p></noscript>
    {children}
  </>;
}

function NewsRows({ items }: { items: WatchItem[] }) {
  return <ul className={styles.newsRows}>{items.map(item => <li key={item.id} id={`signal-${item.id.replace(/^article:/, "")}`}>
    <time dateTime={item.date}>{watchDate(item.date)}</time>
    <div><MediaLink href={item.href} articleId={item.id} action="article" placement="explore" uiVersion={uiVersion}>{item.title}<span aria-hidden="true"> →</span></MediaLink>{item.changed ? <small>出典変更・再確認中。詳細には前回確認時の内容を掲載しています。</small> : null}</div>
  </li>)}</ul>;
}
