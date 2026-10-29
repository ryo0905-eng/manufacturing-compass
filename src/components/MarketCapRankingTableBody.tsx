"use client";

import { useState } from "react";
import type { Route } from "next";
import type { SemiconductorMarketCapCompany } from "@/data/semiconductor-market-cap";
import { RankingCompareButton } from "@/components/RankingCompanyCompare";
import { RankingCompanyName } from "@/components/RankingCompanyName";
import { CountryRegion } from "@/components/CountryRegion";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { trackEvent } from "@/lib/analytics";
import styles from "./MarketCapRankingTable.module.css";

type Row = { company: SemiconductorMarketCapCompany & { domesticRank?: number }; group: string; previous?: { changePercent: number; rankMovement: number } };
type Reference = { id: string; name: string; marketCapUsdB: number; comparisonLabel: string; display: string };
type Sort = "rank" | "cap_desc" | "cap_asc" | "change";

export function MarketCapRankingTableBody({ rows, scope, title, reference }: { rows: Row[]; scope: "world" | "japan"; title: string; reference?: Reference }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState<Sort>("rank");
  const filtered = (q: string, g: string, c: string) => rows.filter(({ company, group: itemGroup }) =>
    (!q.trim() || [company.name, company.englishName].some(name => name.toLocaleLowerCase().includes(q.trim().toLocaleLowerCase()))) &&
    (!g || itemGroup === g) && (!c || company.country === c));
  const visible = filtered(query, group, country);
  const sorted = [...visible].sort((a, b) => {
    if (sort === "cap_desc") return b.company.marketCapUsdB - a.company.marketCapUsdB;
    if (sort === "cap_asc") return a.company.marketCapUsdB - b.company.marketCapUsdB;
    if (sort === "change") return (b.previous?.changePercent ?? -Infinity) - (a.previous?.changePercent ?? -Infinity) || a.company.rank - b.company.rank;
    return 0;
  });
  const showReference = reference && !query.trim() && !group && !country;
  const referencePosition = showReference ? (sort === "cap_asc"
    ? sorted.findIndex(row => row.company.marketCapUsdB > reference.marketCapUsdB)
    : sorted.findIndex(row => row.company.marketCapUsdB < reference.marketCapUsdB)) : -1;
  const insertAt = referencePosition < 0 ? sorted.length : referencePosition;
  const maxValue = Math.max(...rows.map(row => row.company.marketCapUsdB), reference?.marketCapUsdB ?? 1);
  const metric = (value: number, display: string, isReference = false) => {
    const ratio = reference ? (value / reference.marketCapUsdB).toFixed(1) : undefined;
    return <><strong>{display}</strong><span className={styles.track} aria-hidden="true"><i style={{ width: `${Math.max(0, Math.min(100, value / maxValue * 100))}%` }} /></span>{reference ? <small className={styles.ratio}>{isReference ? "比較基準：1.0倍" : `${reference.comparisonLabel}の${ratio === "0.0" ? "0.1倍未満" : `約${ratio}倍`}`}</small> : null}</>;
  };
  const send = (properties: { action: "filter" | "search" | "sort" | "reset"; filter_type?: string; value?: string; result_count?: number }) => {
    try { trackEvent("ranking_table_control", { ...properties, scope, source_page: "semiconductor-market-cap-ranking" }); } catch { /* Controls remain usable without analytics. */ }
  };
  const referenceRow = showReference ? <tr key="reference" role="row" className={styles.reference} aria-label={`参考：${reference.name}（順位対象外）`}>
    <td role="cell" className={styles.rank} aria-label={scope === "world" ? "順位対象外" : "国内順位対象外"} />
    <th role="rowheader" scope="row" className={styles.company}><span className={styles.referenceCompany}><span className={styles.referenceBadge}>参考</span><RankingCompanyName companyId={reference.id} name={reference.name} /></span><span className={styles.referenceNote}>業界外の比較対象・自動車／日本</span></th>
    <td role="cell" className={`market-cap-value ${styles.value}`}>{metric(reference.marketCapUsdB, reference.display, true)}</td><td role="cell" className={styles.change}>—</td><td role="cell" className={styles.compare}><span className={styles.referenceNote}>半導体ランキング対象外</span></td>
  </tr> : null;
  const renderedRows = sorted.map(({ company, previous }) => <tr key={company.id} role="row" id={`${scope}-company-${company.id}`} tabIndex={-1}>
    <td role="cell" className={`market-cap-rank ${styles.rank}`}>{scope === "world" ? company.rank : company.domesticRank ?? company.rank}{scope === "japan" && <small>世界{company.rank}位</small>}</td>
    <th scope="row" role="rowheader" className={styles.company}><RankingCompanyName companyId={company.companySlug ?? company.id} name={company.name}>{company.companySlug ? <TrackedInternalLink eventName="article_company_click" eventProperties={{ company_id: company.companySlug, source_slug: "semiconductor-market-cap-ranking" }} href={`/companies/${company.companySlug}` as Route}>{company.name}</TrackedInternalLink> : company.name}</RankingCompanyName>
      <dl className={styles.metadata}><div><dt className={styles.srOnly}>国・地域</dt><dd><CountryRegion country={company.country} /></dd></div><div><dt className={styles.srOnly}>分類</dt><dd><span aria-hidden="true">·</span>{company.category}</dd></div></dl>
      <details className={styles.business}><summary>事業・銘柄情報</summary><div>{company.englishName !== company.name ? `${company.englishName} · ` : ""}{company.ticker} · {company.mainBusiness}</div></details></th>
    <td role="cell" className={`market-cap-value ${styles.value}`}>{metric(company.marketCapUsdB, company.marketCapDisplay)}</td>
    <td role="cell" className={styles.change}>{previous ? <><span className={previous.changePercent > 0 ? styles.positive : previous.changePercent < 0 ? styles.negative : undefined}>{previous.changePercent > 0 ? "+" : ""}{previous.changePercent.toFixed(1)}%</span><small>世界順位 {previous.rankMovement > 0 ? `▲${previous.rankMovement}` : previous.rankMovement < 0 ? `▼${-previous.rankMovement}` : "―"}</small></> : "—"}</td>
    <td role="cell" className={styles.compare}><RankingCompareButton id={company.id} source={scope} /></td></tr>);
  if (referenceRow) renderedRows.splice(insertAt, 0, referenceRow);
  return <>
    <div className={styles.controls}>
      <label>企業名検索<input type="search" value={query} onChange={e => { const value = e.target.value; setQuery(value); send({ action: "search", result_count: filtered(value, group, country).length }); }} /></label>
      <label>分類<select value={group} onChange={e => { setGroup(e.target.value); send({ action: "filter", filter_type: "category", value: e.target.value }); }}><option value="">すべて</option>{[...new Set(rows.map(row => row.group))].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
      {scope === "world" && <label>国・地域<select value={country} onChange={e => { setCountry(e.target.value); send({ action: "filter", filter_type: "country", value: e.target.value }); }}><option value="">すべて</option>{[...new Set(rows.map(row => row.company.country))].map(value => <option key={value} value={value}>{value}</option>)}</select></label>}
      <label>並び替え<select value={sort} onChange={e => { const value = e.target.value as Sort; setSort(value); send({ action: "sort", value }); }}><option value="rank">順位順（既定）</option><option value="cap_desc">時価総額の大きい順</option><option value="cap_asc">時価総額の小さい順</option><option value="change">前回比の増減率順</option></select></label>
      <button type="button" onClick={() => { setQuery(""); setGroup(""); setCountry(""); setSort("rank"); send({ action: "reset" }); }}>リセット</button>
    </div>
    <div className={`market-cap-table-wrap ${styles.tableWrap}`}><table className="market-cap-table" role="table" aria-label={`${title}の時価総額ランキング`}><thead role="rowgroup"><tr role="row"><th scope="col">{scope === "world" ? "順位" : "国内"}</th><th scope="col">企業名</th><th scope="col">時価総額</th><th scope="col">前回比</th><th scope="col">比較</th></tr></thead><tbody role="rowgroup">{renderedRows.length ? renderedRows : <tr><td colSpan={5}>条件に合う企業がありません</td></tr>}</tbody></table></div>
    <p className={styles.note}>前回比は2026年10月1日時点のデータがある企業のみ表示しています。順位の変動は世界順位での比較です。</p>
  </>;
}
