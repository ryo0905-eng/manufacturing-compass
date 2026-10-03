"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { earningsCompanyName, earningsMetricText, earningsSourceHref, type EarningsRelease, type EarningsStatement } from "@/lib/earnings";
import { EarningsInternalLink, EarningsSourceLink } from "./EarningsLinks";
import styles from "./Earnings.module.css";

const initialSelection = ["applied-materials", "lam-research"];

function CompareEvidence({ release, item }: { release: EarningsRelease; item?: EarningsStatement }) {
  if (!item) return <span>未取得</span>;
  const href = earningsSourceHref(release, item.source);
  return <span>{item.text}{href ? <> <EarningsSourceLink href={href} companyId={release.companyId} documentId={item.source.documentId}>原資料 ↗</EarningsSourceLink></> : null}</span>;
}

function CompareMetric({ release, metricKey, label, percentage = false }: { release: EarningsRelease; metricKey: keyof EarningsRelease["metrics"]; label: string; percentage?: boolean }) {
  const metric = release.metrics[metricKey];
  const href = metric.status === "reported" ? earningsSourceHref(release, metric.source) : null;
  return <div><dt>{label}</dt><dd>{earningsMetricText(metric, release, percentage)}{metricKey === "operatingIncome" ? <small>{release.accountingStandard}の連結営業利益</small> : null}{href && metric.status === "reported" ? <small><EarningsSourceLink href={href} companyId={release.companyId} documentId={metric.source.documentId}>{metric.source.locator} ↗</EarningsSourceLink></small> : null}</dd></div>;
}

export function EarningsCompare({ releases }: { releases: EarningsRelease[] }) {
  const [selection, setSelection] = useState(initialSelection);
  const [shown, setShown] = useState(initialSelection);
  const [message, setMessage] = useState("");

  function toggle(id: string) {
    setMessage("");
    setSelection((current) => current.includes(id) ? current.filter((entry) => entry !== id) : current.length < 3 ? [...current, id] : current);
  }

  function compare() {
    if (selection.length < 2) { setMessage("2〜3社を選んでください。"); return; }
    setShown(selection);
    setMessage(`${selection.length}社の最新発表を表示しています。`);
    trackEvent("earnings_compare_run", { company_count: selection.length, company_ids: [...selection].sort().join("+") });
  }

  const visible = shown.flatMap((id) => releases.find((release) => release.companyId === id) ?? []);
  return <>
    <div className={styles.selector} role="group" aria-label="比較する企業">
      {releases.map((release) => <label key={release.companyId} className={styles.choice}><input type="checkbox" checked={selection.includes(release.companyId)} onChange={() => toggle(release.companyId)} disabled={!selection.includes(release.companyId) && selection.length >= 3} />{earningsCompanyName(release.companyId)}</label>)}
    </div>
    <button className={styles.primaryButton} type="button" onClick={compare}>選んだ企業を比較する</button>
    <p className={styles.filterResult} aria-live="polite">{message || "Applied Materials と Lam Research の最新発表を表示中。選択後に比較を実行してください。"}</p>
    <div className={styles.compareGrid}>{visible.map((release) => <article className={styles.compareCard} key={release.id}>
      <p className={styles.eyebrow}>{release.business}</p><h2>{earningsCompanyName(release.companyId)}</h2>
      <p className={styles.period}>{release.period.label}<br />{release.period.start ? `${release.period.start}〜` : "期首未取得 / 終了日 "}{release.period.end}<br />発表 {release.announcedAt} · 確認 {release.checkedAt}</p>
      <p className={styles.standard}>{release.accountingStandard} · {release.currency} · 表示単位は百万</p>
      <dl className={styles.compareMetrics}>
        <CompareMetric release={release} metricKey="revenue" label="売上高" />
        <CompareMetric release={release} metricKey="operatingIncome" label="営業利益" />
        <CompareMetric release={release} metricKey="revenueYoY" label="売上高・前年同期比" percentage />
      </dl>
      <div className={styles.compareTopic}><h3>成長要因・伸びた部分</h3><p><CompareEvidence release={release} item={release.growth[0]} /></p></div>
      <div className={styles.compareTopic}><h3>懸念点・確認したいこと</h3><p><CompareEvidence release={release} item={release.concerns[0]} /></p></div>
      <div className={styles.compareTopic}><h3>会社の見通し</h3><p><CompareEvidence release={release} item={release.outlook[0]} /></p></div>
      <p className={styles.cardFooter}><EarningsInternalLink href={`/semiconductor-watch/earnings/${release.companyId}`} companyId={release.companyId} destination="detail">この企業の根拠と詳細 →</EarningsInternalLink></p>
    </article>)}</div>
  </>;
}
