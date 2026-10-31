import Link from "next/link";
import type { Route } from "next";
import { foundryMarket as market, foundryRankingMeta as meta } from "@/data/foundry-market-share";
import styles from "./MemoryRanking.module.css";

export function FoundryRanking() {
  return <div className={styles.root}>
    <p className={styles.meta}>対象：{meta.period} ／ 確認日：{meta.checkedAt}。{market.scope}</p>
    <figure className={styles.chart}>
      <figcaption><strong>ファウンドリの売上シェア</strong><span>{meta.period}／売上高ベース</span></figcaption>
      <div className={styles.axis} aria-hidden="true"><span>0%</span><span>50%</span><span>100%</span></div>
      <ol className={styles.rows}>{market.rows.map(row => <li key={row.companyId}>
        <div className={styles.rowHeading}><small>{row.rank}位</small><strong>{row.name}</strong><b>{row.sharePct}%</b></div>
        <div className={styles.track} aria-hidden="true"><span style={{ width: `${row.sharePct}%` }} /></div>
      </li>)}</ol>
    </figure>
    <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="売上・シェア一覧。横にスクロールできます">
      <table><caption>{meta.period}。売上単位：{meta.revenueUnit}</caption>
        <thead><tr><th scope="col">順位</th><th scope="col">企業</th><th scope="col">売上高</th><th scope="col">シェア</th></tr></thead>
        <tbody>{market.rows.map(row => <tr key={row.companyId}><td>{row.rank}</td><th scope="row">{row.companySlug ? <Link href={`/companies/${row.companySlug}` as Route}>{row.name}</Link> : row.name}</th><td>{row.revenueUsdM.toLocaleString("en-US")}</td><td>{row.sharePct}%</td></tr>)}</tbody>
      </table>
    </div>
    <p className={styles.note}>上位10社の合計は売上53,488百万米ドル、市場シェア96.5%（原表のTotal）。数値の丸め差や合計差は補正していません。Samsungはファウンドリ事業、PSMCはロジックとメモリの受託製造、HuaHong GroupはHHGrace、HLMCなどグループ事業を含みます。</p>
    <p className={styles.source}>出典：<a href={market.source.url} target="_blank" rel="noopener noreferrer">TrendForce（{market.source.publishedAt}）</a> ／ <a href={market.source.figureUrl} target="_blank" rel="noopener noreferrer">原表</a>。確認日：{meta.checkedAt}</p>
  </div>;
}
