"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { earningsCompanyName, earningsCompactMetric, earningsFinancialScope, earningsMetricText, earningsSegments, type EarningsRelease } from "@/lib/earnings";
import { earningsFreshness, nextCompanyEvent, watchCalendar, watchEventDate } from "@/lib/watch-calendar";
import { EarningsInternalLink, EarningsSourceLink } from "./EarningsLinks";
import styles from "./Earnings.module.css";

type Filters = { segment: string; company: string; theme: string };
const initialFilters: Filters = { segment: "all", company: "all", theme: "all" };
export function readEarningsHash(hash: string, releases: EarningsRelease[], themes: string[]): Filters {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const segment = params.get("segment") ?? "all";
  const validSegment = segment in earningsSegments ? segment : "all";
  const company = params.get("company") ?? "all";
  const theme = params.get("theme") ?? "all";
  return {
    segment: validSegment,
    company: releases.some(release => release.companyId === company && (validSegment === "all" || release.segment === validSegment)) ? company : "all",
    theme: themes.includes(theme) ? theme : "all",
  };
}

export function EarningsExplorer({ releases, themes, now }: { releases: EarningsRelease[]; themes: string[]; now: string }) {
  const [filters, setFilters] = useState(initialFilters);
  useEffect(() => {
    const restore = () => setFilters(readEarningsHash(window.location.hash, releases, themes));
    restore();
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => { window.removeEventListener("hashchange", restore); window.removeEventListener("popstate", restore); };
  }, [releases, themes]);
  const visible = useMemo(() => releases.filter(release => (filters.segment === "all" || release.segment === filters.segment) && (filters.company === "all" || release.companyId === filters.company) && (filters.theme === "all" || release.themes.includes(filters.theme))), [filters, releases]);
  function select(key: keyof Filters, value: string) {
    const next = { ...filters, [key]: value, ...(key === "segment" ? { company: "all" } : {}) };
    setFilters(next);
    const params = new URLSearchParams(Object.entries(next).filter(([, item]) => item !== "all"));
    window.history.pushState(null, "", params.size ? `#${params}` : "#companies");
    trackEvent("earnings_filter_change", { filter: key, value, ui_version: "daily-v1" });
  }
  return <section className={styles.section} id="companies" aria-labelledby="earnings-list-title">
    <div className={styles.sectionHeading}><h2 id="earnings-list-title">企業別の掲載決算</h2><span>発表日の新しい順</span></div>
    <div className={styles.filters}>
      <label>事業領域<select value={filters.segment} onChange={event => select("segment", event.target.value)}><option value="all">すべて</option>{Object.entries(earningsSegments).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>企業<select value={filters.company} onChange={event => select("company", event.target.value)}><option value="all">すべての企業</option>{releases.filter(release => filters.segment === "all" || release.segment === filters.segment).map(release => <option key={release.companyId} value={release.companyId}>{earningsCompanyName(release.companyId)}</option>)}</select></label>
      <label>テーマ<select value={filters.theme} onChange={event => select("theme", event.target.value)}><option value="all">すべてのテーマ</option>{themes.map(theme => <option key={theme} value={theme}>{theme}</option>)}</select></label>
    </div>
    <p className={styles.filterResult} aria-live="polite">{visible.length}社の決算を表示中</p>
    <p className={styles.fine}>各社の対象期間・会計基準・通貨は異なります。売上高の前年比は、その会社の前年同期との比較です。</p>
    {visible.length === 0 ? <p className={styles.empty}>一致する決算はありません。条件を広げてください。</p> : <table className={styles.resultsTable}>
      <caption className={styles.srOnly}>主要半導体企業の掲載決算と次回発表予定</caption>
      <thead><tr>{["企業・対象期", "売上高", "営業利益", "売上前年比", "変化の要点", "次回決算"].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead>
      <tbody>{visible.map(release => {
        const freshness = earningsFreshness(release, now);
        const event = nextCompanyEvent(release.companyId, now);
        const calendar = event ?? watchCalendar.events.find(item => item.companyId === release.companyId && item.kind === "earnings");
        const expired = calendar?.date && !event;
        return <tr key={release.id}>
          <th scope="row"><EarningsInternalLink href={`/semiconductor-watch/earnings/${release.companyId}`} companyId={release.companyId} destination="detail">{earningsCompanyName(release.companyId)} →</EarningsInternalLink><small>{earningsSegments[release.segment]} · {release.period.label}</small><small>発表 {release.announcedAt.replaceAll("-", "/")}</small><small>{earningsFinancialScope(release)} · {release.accountingStandard} · {release.period.kind === "quarter" ? "単四半期" : release.period.kind === "cumulative" ? "累計" : "通期"}</small></th>
          <td data-label="売上高" className={styles.number}>{earningsCompactMetric(release.metrics.revenue, release)}</td>
          <td data-label="営業利益" className={styles.number}>{earningsCompactMetric(release.metrics.operatingIncome, release)}</td>
          <td data-label="売上前年比" className={styles.number}>{earningsMetricText(release.metrics.revenueYoY, release, true)}</td>
          <td data-label="変化の要点" className={styles.summaryCell}><p>{release.growth[0]?.text ?? release.highlights[0]?.text}</p><small>数値確認 {release.checkedAt.replaceAll("-", "/")}</small><small data-state={freshness.state}>{freshness.text}{freshness.check?.checkedAt ? `（${freshness.check.checkedAt.slice(0, 10).replaceAll("-", "/")}）` : ""}</small>{freshness.check?.notice ? <small><EarningsSourceLink href={freshness.check.notice.sourceUrl} companyId={release.companyId} documentId="notice">{freshness.check.notice.text} ↗</EarningsSourceLink></small> : null}</td>
          <td data-label="次回決算">{calendar ? <><EarningsSourceLink href={calendar.sourceUrl} companyId={release.companyId} documentId="calendar">{expired ? "予定日経過・結果確認中" : watchEventDate(calendar)} ↗</EarningsSourceLink><small>{calendar.checkedAt ? `日程確認 ${calendar.checkedAt.slice(0, 10).replaceAll("-", "/")}` : "日程の確認待ち"}</small></> : "未確認"}</td>
        </tr>;
      })}</tbody>
    </table>}
    <noscript><p className={styles.fine}>全社の掲載決算を表示しています。各社の詳細・原資料はそのまま読めます。</p></noscript>
  </section>;
}
