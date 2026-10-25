"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getStockListing, stockHref } from "@/lib/stock-market";
import {
  buildMarketCapGrowthRanking,
  daysBetween,
  findMarketCapComparisonSnapshot,
  type MarketCapComparisonSnapshot,
  type MarketCapGrowthMetric,
} from "@/lib/semiconductor-market-cap-growth";
import { semiconductorMarketCapChartHistory } from "@/data/semiconductor-market-cap-chart-history";
import {
  japanSemiconductorMarketCapRanking,
  semiconductorMarketCapMeta,
  worldSemiconductorMarketCapRanking,
  type SemiconductorMarketCapCompany,
} from "@/data/semiconductor-market-cap";
import {
  semiconductorMarketCapHistory,
  type SemiconductorMarketCapHistorySnapshot,
} from "@/data/semiconductor-market-cap-history";
import styles from "./SemiconductorMarketCapGrowthRanking.module.css";

type Period = { id: string; label: string; months: number };
type Scope = "world" | "japan";

const periods: Period[] = [
  { id: "1m", label: "前月比", months: 1 },
  { id: "3m", label: "3か月", months: 3 },
  { id: "6m", label: "6か月", months: 6 },
  { id: "12m", label: "1年", months: 12 },
];

const currentCompanies = new Map<string, SemiconductorMarketCapCompany>(
  [...worldSemiconductorMarketCapRanking, ...japanSemiconductorMarketCapRanking]
    .map((company) => [company.id, company]),
);

const latestSnapshot: SemiconductorMarketCapHistorySnapshot = {
  dataAsOf: semiconductorMarketCapMeta.dataAsOf,
  retrievedAt: semiconductorMarketCapMeta.retrievedAt,
  currency: semiconductorMarketCapMeta.currency,
  sourceName: semiconductorMarketCapMeta.sourceName,
  sourceUrl: semiconductorMarketCapMeta.sourceUrl,
  entries: [...currentCompanies.values()].map((company) => ({
    companyId: company.id,
    ticker: company.ticker,
    marketCapUsdB: company.marketCapUsdB,
    sourceRank: company.rank,
    sourceUrl: company.sourceUrl,
  })),
};

const allSnapshots = [latestSnapshot, ...semiconductorMarketCapHistory]
  .sort((first, second) => second.dataAsOf.localeCompare(first.dataAsOf));

function japaneseDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function marketCap(valueUsdB: number) {
  const absolute = Math.abs(valueUsdB);
  const sign = valueUsdB < 0 ? "−" : "";
  return absolute >= 1000
    ? `${sign}$${(absolute / 1000).toFixed(2)}兆`
    : `${sign}$${absolute.toFixed(1)}B`;
}

function changeAmount(valueUsdB: number) {
  const sign = valueUsdB > 0 ? "+" : valueUsdB < 0 ? "−" : "";
  return `${sign}${marketCap(Math.abs(valueUsdB))}`;
}

function changeRate(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function movementLabel(value: number) {
  if (value > 0) return `${value}位上昇`;
  if (value < 0) return `${Math.abs(value)}位下降`;
  return "変動なし";
}

function SourceLinks({ snapshot, label }: { snapshot: MarketCapComparisonSnapshot; label: string }) {
  const urls = snapshot.isChartHistory
    ? [snapshot.sourceUrl]
    : [...new Set([snapshot.sourceUrl, ...snapshot.entries.map((entry) => entry.sourceUrl)])];
  return (
    <span className={styles.sources}>
      {urls.map((url, index) => (
        <a href={url} key={url} rel="noopener noreferrer" target="_blank">
          {label}{urls.length > 1 ? ` ${index + 1}` : ""} ↗
        </a>
      ))}
    </span>
  );
}

function SnapshotHistory({ companies, category }: { companies: readonly SemiconductorMarketCapCompany[]; category: string }) {
  const worldIds = new Set(worldSemiconductorMarketCapRanking.map((company) => company.id));
  const japanIds = new Set(japanSemiconductorMarketCapRanking.map((company) => company.id));
  const [selectedDate, setSelectedDate] = useState(allSnapshots[1]?.dataAsOf ?? allSnapshots[0].dataAsOf);
  const selectedSnapshot = allSnapshots.find((snapshot) => snapshot.dataAsOf === selectedDate) ?? allSnapshots[0];
  const historyEntryByCompany = new Map(selectedSnapshot.entries.map((entry) => [entry.companyId, entry]));
  const historyRows = companies.flatMap((company) => {
    const entry = historyEntryByCompany.get(company.id);
    if (!entry || (category !== "all" && company.category !== category)) return [];
    return [{ company, entry }];
  }).sort((first, second) => first.entry.sourceRank - second.entry.sourceRank);
  const filteredCount = companies.filter((company) => category === "all" || company.category === category).length;

  return (
    <details className={styles.history}>
      <summary>保存済みスナップショットの履歴を見る</summary>
      <p>日付を選ぶと、その時点に出典へ掲載されていた順位と時価総額を確認できます。対象は現在のランキング掲載企業で、各時点に値がない企業は表示しません。</p>
      <div className={styles.tableWrap}>
        <table>
          <thead><tr><th scope="col">基準日</th><th scope="col">取得日</th><th scope="col">世界TOP30の比較可能数</th><th scope="col">日本18社の比較可能数</th><th scope="col">出典</th></tr></thead>
          <tbody>
            {allSnapshots.map((snapshot) => {
              const entries = new Set(snapshot.entries.map((entry) => entry.companyId));
              const worldCount = [...worldIds].filter((id) => entries.has(id)).length;
              const japanCount = [...japanIds].filter((id) => entries.has(id)).length;
              return (
                <tr key={snapshot.dataAsOf}>
                  <th scope="row">{japaneseDate(snapshot.dataAsOf)}</th>
                  <td>{japaneseDate(snapshot.retrievedAt)}</td>
                  <td>{worldCount} / {worldSemiconductorMarketCapRanking.length}社</td>
                  <td>{japanCount} / {japanSemiconductorMarketCapRanking.length}社</td>
                  <td><SourceLinks label={snapshot.sourceName} snapshot={snapshot} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <label className={styles.historyDate}>過去の基準日
        <select onChange={(event) => setSelectedDate(event.target.value)} value={selectedSnapshot.dataAsOf}>
          {allSnapshots.map((snapshot) => <option key={snapshot.dataAsOf} value={snapshot.dataAsOf}>{japaneseDate(snapshot.dataAsOf)}</option>)}
        </select>
      </label>
      <p>{japaneseDate(selectedSnapshot.dataAsOf)}基準・{selectedSnapshot.sourceName}の半導体カテゴリ全体における掲載順位です。比較可能な企業：{historyRows.length}社 / {filteredCount}社。</p>
      {historyRows.length > 0 ? (
        <div className={styles.tableWrap}>
          <table className={styles.historyValues}>
            <caption>保存時点の時価総額ランキング</caption>
            <thead><tr><th scope="col">出典掲載順位</th><th scope="col">企業</th><th scope="col">時価総額</th><th scope="col">ティッカー</th></tr></thead>
            <tbody>{historyRows.map(({ company, entry }) => (
              <tr key={company.id}><td>{entry.sourceRank}位</td><th scope="row">{company.companySlug ? <Link href={`/companies/${company.companySlug}`}>{company.name}</Link> : company.name}</th><td>{marketCap(entry.marketCapUsdB)}</td><td>{entry.ticker}</td></tr>
            ))}</tbody>
          </table>
        </div>
      ) : <p className={styles.empty}>この基準日には、選択した対象で比較できる値がありません。</p>}
    </details>
  );
}

export function SemiconductorMarketCapGrowthRanking({ stockMarketAvailable }: { stockMarketAvailable: boolean }) {
  const [periodId, setPeriodId] = useState("1m");
  const [scope, setScope] = useState<Scope>("world");
  const [category, setCategory] = useState("all");
  const [metric, setMetric] = useState<MarketCapGrowthMetric>("rate");

  const scopeCompanies = scope === "world" ? worldSemiconductorMarketCapRanking : japanSemiconductorMarketCapRanking;
  const categories = useMemo(() => [...new Set(scopeCompanies.map((company) => company.category))].sort((a, b) => a.localeCompare(b, "ja")), [scopeCompanies]);
  const selectedCategory = category === "all" || categories.includes(category) ? category : "all";
  const period = periods.find((item) => item.id === periodId) ?? periods[0];
  const comparison = findMarketCapComparisonSnapshot(
    semiconductorMarketCapMeta.dataAsOf,
    period.months,
    semiconductorMarketCapHistory,
    semiconductorMarketCapChartHistory,
  );
  const rows = useMemo(
    () => buildMarketCapGrowthRanking(scopeCompanies, comparison.snapshot, metric, selectedCategory),
    [scopeCompanies, comparison.snapshot, metric, selectedCategory],
  );
  const days = comparison.snapshot && !comparison.snapshot.isChartHistory
    ? daysBetween(comparison.snapshot.dataAsOf, semiconductorMarketCapMeta.dataAsOf)
    : undefined;
  const currentSource = latestSnapshot;

  return (
    <div className={styles.ranking}>
      <div className={styles.dataMeta}>
        <div><span>最新基準日</span><strong>{japaneseDate(semiconductorMarketCapMeta.dataAsOf)}</strong></div>
        <div><span>更新・取得日</span><strong>{japaneseDate(semiconductorMarketCapMeta.retrievedAt)}</strong></div>
        <div><span>通貨</span><strong>{semiconductorMarketCapMeta.currency}（USD）</strong></div>
        <div><span>最新データの出典</span><SourceLinks label={currentSource.sourceName} snapshot={currentSource} /></div>
      </div>

      <div className={styles.controls}>
        <fieldset>
          <legend>比較期間</legend>
          <div className={styles.segmented}>
            {periods.map((item) => (
              <button aria-pressed={period.id === item.id} key={item.id} onClick={() => setPeriodId(item.id)} type="button">{item.label}</button>
            ))}
          </div>
        </fieldset>
        <label>対象
          <select onChange={(event) => { setScope(event.target.value as Scope); setCategory("all"); }} value={scope}>
            <option value="world">世界TOP30</option>
            <option value="japan">日本18社</option>
          </select>
        </label>
        <label>企業分類
          <select onChange={(event) => setCategory(event.target.value)} value={selectedCategory}>
            <option value="all">すべて</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <fieldset>
          <legend>ランキングの基準</legend>
          <div className={styles.segmented}>
            <button aria-pressed={metric === "rate"} onClick={() => setMetric("rate")} type="button">増加率</button>
            <button aria-pressed={metric === "amount"} onClick={() => setMetric("amount")} type="button">増加額</button>
          </div>
        </fieldset>
      </div>

      {comparison.snapshot ? (
        <>
          <div className={styles.comparisonMeta}>
            {comparison.snapshot.isChartHistory ? (
              <p><strong>{period.label}</strong>の目標日は{japaneseDate(comparison.targetDate)}。比較には目標日以前で最も新しい企業別のチャート観測値を使い、各社の実際の観測日は表に記載しています。</p>
            ) : (
              <p><strong>{period.label}</strong>の目標日は{japaneseDate(comparison.targetDate)}。比較にはその日以前で最も新しい保存値、{japaneseDate(comparison.snapshot.dataAsOf)}を使用しました（実際の比較期間 {days} 日）。</p>
            )}
            <p>比較可能な企業：<strong>{rows.length}社</strong> / {selectedCategory === "all" ? scopeCompanies.length : scopeCompanies.filter((company) => company.category === selectedCategory).length}社。両方の基準日に時価総額がある企業だけを掲載しています。</p>
            <p>過去値の出典：<SourceLinks label={comparison.snapshot.sourceName} snapshot={comparison.snapshot} />（取得日 {japaneseDate(comparison.snapshot.retrievedAt)}。企業別のチャート履歴は各行から確認できます）</p>
          </div>

          {rows.length > 0 ? (
            <div className={styles.tableWrap}>
              <table className={styles.resultTable}>
                <caption>時価総額の増加率・増加額ランキング（{scope === "world" ? "世界TOP30" : "日本18社"}）</caption>
                <thead><tr><th scope="col">{metric === "rate" ? "増加率順位" : "増加額順位"}</th><th scope="col">企業</th><th scope="col">最新時価総額</th><th scope="col">比較時時価総額</th><th scope="col">増加率</th><th scope="col">増加額</th><th scope="col">比較対象内の時価総額順位</th></tr></thead>
                <tbody>
                  {rows.map((row) => {
                    const listing = stockMarketAvailable ? getStockListing(row.company.id) : undefined;
                    return (
                      <tr key={row.company.id}>
                        <td className={styles.growthRank}>{row.growthRank}</td>
                        <th scope="row" className={styles.company}>
                          <span>{row.company.companySlug ? <Link href={`/companies/${row.company.companySlug}`}>{row.company.name}</Link> : row.company.name}</span>
                          <small>{row.company.ticker} · {row.company.country} · {row.company.category}</small>
                          {listing ? <Link className={styles.stockLink} href={stockHref(row.company.id)}>株式市場ウォッチ ↗</Link> : null}
                        </th>
                        <td>{marketCap(row.company.marketCapUsdB)}</td>
                        <td>
                          {marketCap(row.previousMarketCapUsdB)}
                          <small>{japaneseDate(row.previousDataAsOf)} · <a href={row.previousSourceUrl} rel="noopener noreferrer" target="_blank">出典 ↗</a></small>
                        </td>
                        <td className={row.changePercent >= 0 ? styles.positive : styles.negative}>{changeRate(row.changePercent)}</td>
                        <td className={row.changeUsdB >= 0 ? styles.positive : styles.negative}>{changeAmount(row.changeUsdB)}</td>
                        <td><span>{row.previousMarketCapRank}位 → {row.currentMarketCapRank}位</span><small>{movementLabel(row.rankMovement)}</small></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : <p className={styles.empty}>この分類では、両方の基準日の時価総額を確認できる企業がありません。</p>}
        </>
      ) : (
        <div className={styles.empty}>
          <strong>{japaneseDate(comparison.targetDate)}以前の比較用スナップショットがありません。</strong>
          <p>値が直接保存されていないため、この期間のランキングは算出していません。</p>
        </div>
      )}

      <p className={styles.note}>増加率・増加額は米ドル建て時価総額の2時点比較です。株価上昇率とは異なり、株式数や為替の変化も含みます。順位変動は、選択した対象・分類のうち比較可能な企業内で算出しています。</p>
      <SnapshotHistory category={selectedCategory} companies={scopeCompanies} />
    </div>
  );
}
