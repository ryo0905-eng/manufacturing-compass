import { MemoryRankingExplorer } from "@/components/MemoryRankingExplorer";
import { memoryMarketIds, memoryMarkets, memoryRankingMeta as meta } from "@/data/memory-market-share";
import { formatMemoryRevenue } from "@/lib/memory-ranking";
import styles from "./MemoryRanking.module.css";

/** Both factual tables are server rendered, regardless of the interactive selection. */
export function MemoryRanking() {
  return <div className={styles.root}>
    <p className={styles.meta}>対象：{meta.period} ／ 確認日：{meta.checkedAt}。2026年通年の数値ではありません。</p>
    <MemoryRankingExplorer />
    <details className={styles.tables}>
      <summary>DRAM・NAND両方の売上・シェアを一覧表で確認する</summary>
      {memoryMarketIds.map((id) => {
        const market = memoryMarkets[id];
        return <section key={id} className={styles.tableSection}>
          <h3>{market.label}の一覧</h3>
          <p>{market.scope}</p>
          <div className={styles.tableWrap} tabIndex={0} role="region" aria-label={`${market.label}の売上・シェア一覧。横にスクロールできます`}>
            <table>
              <caption>{meta.period}。売上単位：{meta.revenueUnit}（1百万米ドル＝100万米ドル）</caption>
              <thead><tr><th scope="col">掲載順位</th><th scope="col">企業</th><th scope="col">売上高</th><th scope="col">売上シェア</th></tr></thead>
              <tbody>
                {market.rows.map((row) => <tr key={row.companyId}><td>{row.rank}</td><th scope="row">{row.name}</th><td>{formatMemoryRevenue(row.revenueUsdM)}</td><td>{row.sharePct}%</td></tr>)}
                {market.others && <tr><td>順位外</td><th scope="row">その他</th><td>{formatMemoryRevenue(market.others.revenueUsdM)}</td><td>{market.others.sharePct}%</td></tr>}
              </tbody>
            </table>
          </div>
          <p className={styles.note}>{market.note}</p>
          <p className={styles.source}>表の出典：<a href={market.source.url} target="_blank" rel="noopener noreferrer">TrendForce（{market.source.publishedAt}）</a> ／ <a href={market.source.figureUrl} target="_blank" rel="noopener noreferrer">原表を確認する</a>。確認日：{meta.checkedAt}</p>
        </section>;
      })}
    </details>
  </div>;
}
