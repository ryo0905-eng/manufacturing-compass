"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { earningsCompanyName, earningsFinancialScope, earningsMetricText, earningsSourceHref, earningsUnitName, type EarningsRelease, type EarningsStatement } from "@/lib/earnings";
import { EarningsInternalLink, EarningsSourceLink } from "./EarningsLinks";
import styles from "./Earnings.module.css";

const initialSelection = ["applied-materials", "lam-research"];
const memorySelection = ["kioxia", "micron"];

function CompareEvidence({ release, item }: { release: EarningsRelease; item?: EarningsStatement }) {
  if (!item) return <span>未取得</span>;
  const href = earningsSourceHref(release, item.source);
  return <span>{item.text}{href ? <> <EarningsSourceLink href={href} companyId={release.companyId} documentId={item.source.documentId}>原資料 ↗</EarningsSourceLink></> : null}</span>;
}

function CompareMetric({ release, metricKey, label, percentage = false }: { release: EarningsRelease; metricKey: keyof EarningsRelease["metrics"]; label: string; percentage?: boolean }) {
  const metric = release.metrics[metricKey];
  const href = metric.status === "reported" ? earningsSourceHref(release, metric.source) : null;
  return <div><dt>{label}</dt><dd>{earningsMetricText(metric, release, percentage)}{metricKey === "operatingIncome" ? <small>{release.accountingStandard}の{earningsFinancialScope(release)}の営業利益</small> : null}{href && metric.status === "reported" ? <small><EarningsSourceLink href={href} companyId={release.companyId} documentId={metric.source.documentId}>{metric.source.locator} ↗</EarningsSourceLink></small> : null}</dd></div>;
}

export function EarningsCompare({ releases }: { releases: EarningsRelease[] }) {
  const [segment, setSegment] = useState<EarningsRelease["segment"]>("equipment");
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

  function changeSegment(next: EarningsRelease["segment"]) {
    const nextSelection = next === "memory" ? memorySelection : initialSelection;
    setSegment(next);
    setSelection(nextSelection);
    setShown(nextSelection);
    setMessage("");
  }

  const visible = shown.flatMap((id) => releases.find((release) => release.companyId === id) ?? []);
  return <>
    <div className={styles.compareGroups} role="group" aria-label="比較する事業領域"><button type="button" aria-pressed={segment === "equipment"} onClick={() => changeSegment("equipment")}>製造装置</button><button type="button" aria-pressed={segment === "memory"} onClick={() => changeSegment("memory")}>メモリ関連</button></div>
    <p className={styles.fine}>事業領域ごとに選択できます。Samsungの数値はメモリ単独ではなくDS部門のため、数値の対象範囲に注意してください。</p>
    <div className={styles.selector} role="group" aria-label="比較する企業">
      {releases.filter((release) => release.segment === segment).map((release) => <label key={release.companyId} className={styles.choice}><input type="checkbox" checked={selection.includes(release.companyId)} onChange={() => toggle(release.companyId)} disabled={!selection.includes(release.companyId) && selection.length >= 3} />{earningsCompanyName(release.companyId)}</label>)}
    </div>
    <button className={styles.primaryButton} type="button" onClick={compare}>選んだ企業を比較する</button>
    <p className={styles.filterResult} aria-live="polite">{message || (segment === "equipment" ? "Applied Materials と Lam Research" : "キオクシアとMicron") + " の最新発表を表示中。選択後に比較を実行してください。"}</p>
    <div className={styles.compareGrid}>{visible.map((release) => <article className={styles.compareCard} key={release.id}>
      <p className={styles.eyebrow}>{release.business}</p><h2>{earningsCompanyName(release.companyId)}</h2>
      <p className={styles.period}>{release.period.label}<br />{release.period.start ? `${release.period.start}〜` : "期首未取得 / 終了日 "}{release.period.end}<br />発表 {release.announcedAt} · 確認 {release.checkedAt}</p>
      <p className={styles.standard}>数値範囲：{earningsFinancialScope(release)}<br />{release.accountingStandard} · {release.currency} · 原資料単位：{earningsUnitName(release)}</p>
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
