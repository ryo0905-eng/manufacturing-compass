"use client";

import { useState, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import { earningsCompanyName, earningsCompanySlug, earningsFinancialScope, earningsMetricText, earningsSourceHref, earningsUnitName, type EarningsRelease, type EarningsStatement } from "@/lib/earnings";
import { EarningsInternalLink, EarningsSourceLink } from "./EarningsLinks";
import styles from "./Earnings.module.css";

const initialSelection = ["applied-materials", "lam-research"];
const memorySelection = ["kioxia", "micron"];

function CompareEvidence({ release, item }: { release: EarningsRelease; item?: EarningsStatement }) {
  if (!item) return <span>未取得</span>;
  const href = earningsSourceHref(release, item.source);
  return <>{item.text}{href ? <small><EarningsSourceLink href={href} companyId={release.companyId} documentId={item.source.documentId}>原資料：{item.source.locator} ↗</EarningsSourceLink></small> : null}</>;
}

function CompareMetric({ release, metricKey, percentage = false }: { release: EarningsRelease; metricKey: keyof EarningsRelease["metrics"]; percentage?: boolean }) {
  const metric = release.metrics[metricKey];
  const href = metric.status === "reported" ? earningsSourceHref(release, metric.source) : null;
  return <>
    <strong className={styles.compareValue}>{earningsMetricText(metric, release, percentage)}</strong>
    <small>{release.period.label} · {earningsFinancialScope(release)} · {release.accountingStandard}{percentage ? " · 各社の前年同期比" : ` · ${release.currency}`}</small>
    {metric.status === "reported" ? <>{metric.calculation ? <small>算出：{metric.calculation}</small> : null}{href ? <small><EarningsSourceLink href={href} companyId={release.companyId} documentId={metric.source.documentId}>原資料：{metric.source.locator} ↗</EarningsSourceLink></small> : null}</> : <small>{metric.reason}</small>}
  </>;
}

function CompareRow({ title, releases, children }: { title: string; releases: EarningsRelease[]; children: (release: EarningsRelease) => ReactNode }) {
  return <section className={styles.compareRow} data-count={releases.length} aria-label={title}>
    <h3>{title}</h3>
    {releases.map((release) => <div className={styles.compareCell} role="group" aria-label={`${earningsCompanyName(release.companyId)}の${title}`} key={release.companyId}>
      <strong className={styles.compareCellName}>{earningsCompanyName(release.companyId)}</strong>
      {children(release)}
    </div>)}
  </section>;
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
    <p className={styles.fine}>同じ事業領域の2〜3社を選べます。各社の最新発表は期間が揃っていません。</p>
    <div className={styles.selector} role="group" aria-label="比較する企業">
      {releases.filter((release) => release.segment === segment).map((release) => <label key={release.companyId} className={styles.choice}><input type="checkbox" checked={selection.includes(release.companyId)} onChange={() => toggle(release.companyId)} disabled={!selection.includes(release.companyId) && selection.length >= 3} />{earningsCompanyName(release.companyId)}</label>)}
    </div>
    <button className={styles.primaryButton} type="button" onClick={compare}>選んだ企業を比較する</button>
    <p className={styles.filterResult} aria-live="polite">{message || `${visible.map((release) => earningsCompanyName(release.companyId)).join(" と ")} の最新発表を表示中。選択後に比較を実行してください。`}</p>
    <section className={styles.compareResults} aria-labelledby="compare-results-title">
      <div className={styles.compareResultsHeading}><div><p className={styles.eyebrow}>SIDE BY SIDE</p><h2 id="compare-results-title">比較結果</h2></div><p>数値の大小で順位付けせず、事業の変化と今後の見通しを読みます。</p></div>
      <div className={styles.compareHeader} data-count={visible.length}>
        <p>発表と数値の範囲</p>
        {visible.map((release) => <div key={release.companyId}>
          <span className={styles.eyebrow}>{release.business}</span>
          <h3>{earningsCompanyName(release.companyId)}</h3>
          <p>{release.period.label} · {release.period.kind === "quarter" ? "単四半期" : release.period.kind === "cumulative" ? "累計" : "通期"}<br />{release.period.start ? `${release.period.start}〜` : "期首未取得 / 終了日 "}{release.period.end}</p>
          <p>数値範囲：{earningsFinancialScope(release)}<br />{release.accountingStandard} · {release.currency} · 原資料単位：{earningsUnitName(release)}</p>
          <small>発表 {release.announcedAt} · 確認 {release.checkedAt}</small>
        </div>)}
      </div>
      <CompareRow title="売上高・前年同期比" releases={visible}>{(release) => <CompareMetric release={release} metricKey="revenueYoY" percentage />}</CompareRow>
      <CompareRow title="伸びた事業・会社が挙げた要因" releases={visible}>{(release) => <CompareEvidence release={release} item={release.growth[0]} />}</CompareRow>
      <CompareRow title="懸念点・確認したいこと" releases={visible}>{(release) => <CompareEvidence release={release} item={release.concerns[0]} />}</CompareRow>
      <CompareRow title="会社の見通し" releases={visible}>{(release) => <CompareEvidence release={release} item={release.outlook[0]} />}</CompareRow>
      <CompareRow title="売上高" releases={visible}>{(release) => <CompareMetric release={release} metricKey="revenue" />}</CompareRow>
      <CompareRow title="営業利益" releases={visible}>{(release) => <CompareMetric release={release} metricKey="operatingIncome" />}</CompareRow>
      <div className={styles.compareNext}><h3>企業研究に使う</h3><p>決算で伸びた領域と、調べたい職種・国内拠点が同じ事業範囲か、企業ページと公式採用情報で確かめましょう。業績の変化だけで採用状況は判断できません。</p><div>{visible.map((release) => <div key={release.companyId}><strong>{earningsCompanyName(release.companyId)}</strong><EarningsInternalLink href={`/companies/${earningsCompanySlug(release.companyId)}#career-prep`} companyId={release.companyId} destination="company_career_prep">事業・仕事内容とキャリア準備 →</EarningsInternalLink><EarningsInternalLink href={`/semiconductor-watch/earnings/${release.companyId}`} companyId={release.companyId} destination="detail">決算の詳細と根拠 →</EarningsInternalLink></div>)}</div></div>
    </section>
  </>;
}
