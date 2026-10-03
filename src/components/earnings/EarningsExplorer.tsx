"use client";

import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { earningsCompanyName, earningsFinancialScope, earningsMetricText, earningsSegmentName, type EarningsRelease } from "@/lib/earnings";
import { EarningsInternalLink } from "./EarningsLinks";
import styles from "./Earnings.module.css";

export function EarningsExplorer({ releases, themes }: { releases: EarningsRelease[]; themes: string[] }) {
  const [company, setCompany] = useState("all");
  const [segment, setSegment] = useState("all");
  const [theme, setTheme] = useState("all");
  const visible = useMemo(() => releases.filter((release) => (segment === "all" || release.segment === segment) && (company === "all" || release.companyId === company) && (theme === "all" || release.themes.includes(theme))), [company, releases, segment, theme]);

  return <section className={styles.section} aria-labelledby="earnings-list-title">
    <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>COMPANY RESULTS</p><h2 id="earnings-list-title">企業別の最新発表</h2></div><span>発表日の新しい順 · {visible.length}社</span></div>
    <div className={styles.filters}>
      <label>事業領域<select value={segment} onChange={(event) => { setSegment(event.target.value); setCompany("all"); trackEvent("earnings_filter_change", { filter: "segment", value: event.target.value }); }}><option value="all">すべて</option><option value="equipment">製造装置</option><option value="memory">メモリ関連</option></select></label>
      <label>企業<select value={company} onChange={(event) => { setCompany(event.target.value); trackEvent("earnings_filter_change", { filter: "company", value: event.target.value }); }}>
        <option value="all">すべての企業</option>{releases.filter((release) => segment === "all" || release.segment === segment).map((release) => <option key={release.companyId} value={release.companyId}>{earningsCompanyName(release.companyId)}</option>)}
      </select></label>
      <label>テーマ<select value={theme} onChange={(event) => { setTheme(event.target.value); trackEvent("earnings_filter_change", { filter: "theme", value: event.target.value }); }}>
        <option value="all">すべてのテーマ</option>{themes.map((option) => <option key={option} value={option}>{option}</option>)}
      </select></label>
    </div>
    <p className={styles.filterResult} aria-live="polite">{visible.length}社の決算を表示中</p>
    {visible.length === 0 ? <p className={styles.empty}>一致する決算はありません。条件を広げてください。</p> : null}
    <div className={styles.list}>{visible.map((release) => <article className={styles.listCard} key={release.id}>
      <div className={styles.cardTop}><div><p className={styles.eyebrow}>{earningsSegmentName(release.segment)} / {release.business}</p><h3>{earningsCompanyName(release.companyId)}</h3></div><span>発表 {release.announcedAt.replaceAll("-", "/")}</span></div>
      <p className={styles.period}>{release.period.label} · 終了日 {release.period.end} · {release.accountingStandard} · 数値範囲：{earningsFinancialScope(release)}</p>
      <p className={styles.headline}>{release.highlights[0]?.text}</p>
      <dl className={styles.metrics}><div><dt>売上高</dt><dd>{earningsMetricText(release.metrics.revenue, release)}</dd></div><div><dt>営業利益</dt><dd>{earningsMetricText(release.metrics.operatingIncome, release)}</dd></div><div><dt>売上高・前年同期比</dt><dd>{earningsMetricText(release.metrics.revenueYoY, release, true)}</dd></div></dl>
      <ol className={styles.takeaways}>{release.highlights.map((item) => <li key={item.text}>{item.text}</li>)}</ol>
      <div className={styles.tags}>{release.themes.map((item) => <span key={item}>{item}</span>)}</div>
      <p className={styles.cardFooter}><EarningsInternalLink href={`/semiconductor-watch/earnings/${release.companyId}`} companyId={release.companyId} destination="detail">決算の背景と原資料を見る →</EarningsInternalLink></p>
    </article>)}</div>
  </section>;
}
