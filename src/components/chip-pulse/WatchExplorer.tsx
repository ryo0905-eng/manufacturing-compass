"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import type { AnnualSeries } from "@/lib/earnings-history-math";
import { AnnualMini } from "@/components/earnings/AnnualHistory";
import { watchDate, watchTopics, type WatchItem } from "@/lib/watch-types";
import {
  companiesForTopic, defaultWatchCompany, readWatchSelection, relatedWatchNews,
  watchBar, watchChartDomain, watchNewsForTopic, watchSelectionHash,
  type WatchCompany, type WatchSelection,
} from "@/lib/watch-explorer";
import { MediaLink } from "./MediaLinks";
import styles from "./WatchExplorer.module.css";

const uiVersion = "explorer-v2";
type Props = { companies: WatchCompany[]; news: WatchItem[]; now: string; histories?: AnnualSeries[]; children?: ReactNode };

export function WatchExplorer({ companies, news, now, histories = [], children }: Props) {
  const [selection, setSelection] = useState<WatchSelection>(() => readWatchSelection("", companies));
  const [expanded, setExpanded] = useState(false);
  const visible = companiesForTopic(companies, selection.topic);
  const selected = visible.find(company => company.id === selection.company);
  const selectedHistory = histories.find(series => series.companyId === selected?.id);
  const articles = watchNewsForTopic(news, selection.topic, now);
  const related = selected ? relatedWatchNews(news, selected.id, now) : [];
  const domain = watchChartDomain(companies);
  const zero = watchBar(0, domain).zero;

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

  function select(next: WatchSelection, dimension: "theme" | "company") {
    if (dimension === "company" && window.matchMedia("(max-width: 760px)").matches) {
      window.requestAnimationFrame(() => {
        const panel = document.getElementById("watch-company");
        panel?.focus({ preventScroll: true });
        panel?.scrollIntoView({ block: "start" });
      });
    }
    if (dimension === "theme" && next.topic === selection.topic) return;
    if (next.topic === selection.topic && next.company === selection.company) return;
    setSelection(next);
    if (dimension === "theme") setExpanded(false);
    window.history.pushState(null, "", watchSelectionHash(next));
    if (dimension === "theme") trackEvent("chip_pulse_filter_change", {
      dimension: "theme", value: next.topic, result_count: companiesForTopic(companies, next.topic).length, ui_version: uiVersion,
    });
    else trackEvent("chip_pulse_company_select", { company_id: next.company ?? "none", source: "chart", action: "select", ui_version: uiVersion });
  }

  return <>
    <nav className={styles.themes} aria-label="興味のあるテーマを選ぶ">
      <button type="button" aria-pressed={selection.topic === "all"} aria-controls="watch-chart watch-news" onClick={() => select({ topic: "all", company: defaultWatchCompany(companies) }, "theme")}>すべて</button>
      {watchTopics.map(topic => <button type="button" key={topic.id} aria-pressed={selection.topic === topic.id} aria-controls="watch-chart watch-news" onClick={() => select({ topic: topic.id, company: defaultWatchCompany(companiesForTopic(companies, topic.id)) }, "theme")}>{topic.label}</button>)}
    </nav>

    <section className={styles.explorer} id="explore" aria-labelledby="watch-chart-title">
      <div className={styles.chart} id="watch-chart">
        <div className={styles.sectionHead}><div><h2 id="watch-chart-title">企業の売上前年比</h2><p>企業を選んで、要点と次の発表を確認</p></div><span aria-live="polite">{visible.length}社</span></div>
        <p className={styles.chartNote}>各社の前年同期との比較です。対象期・事業範囲は異なります。</p>
        <div className={styles.scale} aria-hidden="true"><span>{domain.min}%</span><span>{domain.max > 0 ? "+" : ""}{domain.max}%</span></div>
        {visible.length ? <ul className={styles.chartRows} aria-label="企業別の売上前年比">{visible.map((company, index) => {
          const geometry = watchBar(company.revenueYoY ?? 0, domain);
          const groupStart = index === 0 || visible[index - 1].segment !== company.segment;
          return <li key={company.id} id={company.anchorId} className={styles.chartRow} data-selected={selected?.id === company.id}>
            {groupStart ? <h3 className={styles.groupLabel}>{company.segmentLabel}</h3> : null}
            <button type="button" className={styles.companyButton} aria-pressed={selected?.id === company.id} aria-controls="watch-company" aria-describedby={`watch-meta-${company.id}`} onClick={() => select({ ...selection, company: company.id }, "company")}>
              <span className={styles.companyName}>{company.name}</span>
              <span className={styles.track} style={{ "--zero": `${zero}%` } as CSSProperties} aria-hidden="true">
                {company.revenueYoY !== null ? <span className={styles.bar} style={{ left: `${geometry.left}%`, width: `${geometry.width}%` }} /> : null}
                {company.revenueYoY === 0 ? <span className={styles.zeroDot} style={{ left: `${zero}%` }} /> : null}
              </span>
              <strong className={styles.value}>{company.metricLabel}</strong>
            </button>
            <div className={styles.rowMeta} id={`watch-meta-${company.id}`}><span>{company.period} · {company.periodKind} · {company.scope}</span></div>
            {company.freshness.state !== "verified" ? <p className={styles.rowStatus}>{company.freshness.text}</p> : null}
          </li>;
        })}</ul> : <div className={styles.empty}><p>このテーマの掲載決算はありません。</p><button type="button" onClick={() => select({ topic: "all", company: defaultWatchCompany(companies) }, "theme")}>すべての企業へ戻る</button></div>}
        <MediaLink href="/semiconductor-watch/earnings" articleId="watch" action="background" destination="earnings" placement="navigation" uiVersion={uiVersion} className={styles.allEarnings}>決算一覧・比較へ <span aria-hidden="true">→</span></MediaLink>
        <details className={styles.disclosure}><summary>企業別の数値・原資料</summary><ul>{visible.map(company => <li key={company.id}>
          <strong>{company.name} · {company.metricLabel}</strong><br /><small>{company.period} · {company.scope}</small>
          <MediaLink href={company.href} articleId={company.id} action="article" destination="earnings" placement="explore" uiVersion={uiVersion}>決算を見る →</MediaLink>
          {company.sourceHref ? <MediaLink href={company.sourceHref} articleId={company.id} action="source" placement="explore" uiVersion={uiVersion}>原資料 ↗</MediaLink> : null}
        </li>)}</ul></details>
      </div>

      <aside className={styles.companyPanel} id="watch-company" aria-labelledby="watch-company-title" tabIndex={-1}>
        <p className={styles.srOnly} role="status">{selected ? `${selected.name}の要点を表示中` : "このテーマの掲載決算はありません"}</p>
        {selected ? <div className={styles.panelContent} key={selected.id}>
          <p className={styles.panelLabel}>{selected.segmentLabel}</p>
          <h2 id="watch-company-title">{selected.name}</h2>
          <p className={styles.period}>{selected.period}<br />{selected.scope} · {selected.periodKind}</p>
          <div className={styles.metric}><span>売上高の前年同期比</span><strong>{selected.metricLabel}</strong></div>
          {selected.metricNote ? <p className={styles.subtle}>{selected.metricNote}</p> : null}
          <p className={styles.summary}>{selected.summary}</p>
          <p className={styles.subtle}>発表 <time dateTime={selected.announcedAt}>{watchDate(selected.announcedAt)}</time> · 数値確認 {watchDate(selected.checkedAt)}</p>
          <p className={styles.freshness} data-warning={selected.freshness.state !== "verified"}>{selected.freshness.text}</p>
          <MediaLink href={selected.href} articleId={selected.id} action="article" destination="earnings" placement="featured" uiVersion={uiVersion} className={styles.primary}>決算を見る <span aria-hidden="true">→</span></MediaLink>
          {selectedHistory ? <AnnualMini series={selectedHistory} /> : null}
          <div className={styles.nextEvent}><h3>次回の決算発表</h3>{selected.nextEvent ? <MediaLink href={selected.nextEvent.href} articleId={selected.id} action="source" placement="schedule" uiVersion={uiVersion}>{selected.nextEvent.label} ↗</MediaLink> : <p>日程は未確認です。</p>}</div>
          <div className={styles.related}><h3>関連ニュース</h3>{related.length ? related.map(item => <MediaLink key={item.id} href={item.href} articleId={item.id} action="article" placement="featured" uiVersion={uiVersion}><time dateTime={item.date}>{watchDate(item.date)}</time>{item.title}<span aria-hidden="true"> →</span>{item.changed ? <small>出典変更・再確認中</small> : null}</MediaLink>) : <p>直近30日の関連ニュースはありません。</p>}</div>
          <button className={styles.backToChart} type="button" onClick={() => {
            const button = document.getElementById(selected.anchorId)?.querySelector("button");
            button?.focus({ preventScroll: true });
            button?.scrollIntoView({ block: "center" });
          }}>企業を選び直す ↑</button>
        </div> : <div className={styles.empty}><h2 id="watch-company-title">テーマのニュースへ</h2><p>下の一覧から、発表と原資料を確認できます。</p></div>}
      </aside>
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
