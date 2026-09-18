"use client";

import { useId, useState } from "react";
import type { Route } from "next";
import { memoryMarketIds, memoryMarkets, memoryRankingMeta, type MemoryMarketId } from "@/data/memory-market-share";
import { formatMemoryRevenue } from "@/lib/memory-ranking";
import { trackEvent } from "@/lib/analytics";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import styles from "./MemoryRanking.module.css";

export function MemoryRankingExplorer() {
  const [selected, setSelected] = useState<MemoryMarketId>("dram");
  const panelId = useId();
  const market = memoryMarkets[selected];

  function selectMarket(next: MemoryMarketId) {
    if (next === selected) return;
    setSelected(next);
    trackEvent("memory_ranking_market_select", {
      market: next,
      source_slug: memoryRankingMeta.sourceSlug,
    });
  }

  return <div className={styles.explorer}>
    <fieldset className={styles.controls}>
      <legend>比較するメモリを選ぶ</legend>
      <div className={styles.buttons}>
        {memoryMarketIds.map((id) => <button type="button" key={id}
          aria-pressed={selected === id} aria-controls={panelId}
          onClick={() => selectMarket(id)}>{memoryMarkets[id].label}</button>)}
      </div>
    </fieldset>
    <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">
      {market.label}：{market.rows.length}社を表示。{market.scope}
    </p>
    <div id={panelId}>
      <div className={styles.context}>
        <h3>{market.label}は何に使う？</h3>
        <p>{market.usage}</p>
        <p className={styles.scope}>{market.scope}</p>
      </div>
      <figure className={styles.chart}>
        <figcaption>
          <strong>{market.label}メーカーの売上シェア</strong>
          <span>{memoryRankingMeta.period}／売上高ベース</span>
        </figcaption>
        <p className={styles.scaleNote}>両市場とも0〜100%の共通尺度。各市場のシェアを合算しません。</p>
        <div className={styles.axis} aria-hidden="true"><span>0%</span><span>50%</span><span>100%</span></div>
        <ol className={styles.rows}>
          {market.rows.map((row) => <li key={row.companyId} data-company={row.companyId}>
            <div className={styles.rowHeading}>
              <span><small>掲載{row.rank}位</small> <strong>{row.name}</strong></span>
              <b>{row.sharePct}%</b>
            </div>
            <div className={styles.track} aria-hidden="true"><span style={{ width: `${row.sharePct}%` }} /></div>
            <div className={styles.rowDetails}>
              <span>売上 {formatMemoryRevenue(row.revenueUsdM)} {memoryRankingMeta.revenueUnit}</span>
              {row.companySlug && <TrackedInternalLink
                href={`/companies/${row.companySlug}` as Route} eventName="article_company_click"
                eventProperties={{ source_slug: memoryRankingMeta.sourceSlug, company_id: row.companySlug }}>
                {row.name}の企業情報 →
              </TrackedInternalLink>}
            </div>
          </li>)}
        </ol>
        {market.others && <p className={styles.other}>その他（順位外）：{market.others.sharePct}% ／ 売上 {formatMemoryRevenue(market.others.revenueUsdM)} {memoryRankingMeta.revenueUnit}</p>}
      </figure>
      <p className={styles.note}>{market.note}</p>
      <p className={styles.source}>出典：<a href={market.source.url} target="_blank" rel="noopener noreferrer">TrendForce「{market.source.title}」</a>（発表 {market.source.publishedAt}）</p>
    </div>
    <noscript><p>グラフの切り替えにはJavaScriptが必要です。下のDRAM・NAND両方の一覧表は、そのまま確認できます。</p></noscript>
  </div>;
}
