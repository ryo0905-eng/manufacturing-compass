"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CompanyCardLogo } from "@/components/CompanyCardLogo";
import { readStockCompany, stockHref, type StockCompanyProfile } from "@/lib/stock-market";
import { trackEvent } from "@/lib/analytics";
import { watchDate } from "@/lib/watch-types";
import { StockMarketTable, StockQuotes, SymbolOverview } from "./StockWidgets";
import styles from "./Stocks.module.css";

export function StockExplorer({ profiles }: { profiles: StockCompanyProfile[] }) {
  const [companyId, setCompanyId] = useState(profiles[0]?.companyId ?? "nvidia");
  const chartHeading = useRef<HTMLHeadingElement>(null);
  const company = profiles.find(profile => profile.companyId === companyId) ?? profiles[0];
  useEffect(() => {
    const restore = () => {
      const hash = window.location.hash;
      // In-page links to sources/performance must not reset the selected company.
      if (!hash || new URLSearchParams(hash.replace(/^#/, "")).has("company")) {
        setCompanyId(readStockCompany(hash));
      }
    };
    restore();
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => { window.removeEventListener("hashchange", restore); window.removeEventListener("popstate", restore); };
  }, []);
  const select = useCallback((id: string) => {
    const href = stockHref(id);
    const selectedId = readStockCompany(href.slice(href.indexOf("#")));
    window.history.pushState(null, "", href);
    setCompanyId(selectedId);
    trackEvent("stock_market_company_select", { company_id: selectedId, ui_version: "stocks-v1" });
  }, []);
  const selectFromTable = useCallback((id: string) => {
    select(id);
    chartHeading.current?.focus({ preventScroll: true });
    chartHeading.current?.scrollIntoView({ block: "start" });
  }, [select]);
  const relatedClick = (destination: string) => trackEvent("stock_market_related_click", { company_id: companyId, destination, ui_version: "stocks-v1" });
  if (!company) return <p>掲載企業の情報を表示できませんでした。<Link href="/industry-map">企業一覧を見る</Link></p>;

  return <>
    <section className={styles.explorer} aria-labelledby="stock-chart-title">
      <div className={styles.sectionHead}><h2 id="stock-chart-title" ref={chartHeading} tabIndex={-1}>企業別チャート</h2>
        <label className={styles.selector}>企業を選ぶ<select value={company.companyId} onChange={event => select(event.target.value)}>{profiles.map(profile => <option key={profile.companyId} value={profile.companyId}>{profile.name} · {profile.ticker}{profile.embedding === "external" ? "（外部で確認）" : ""}</option>)}</select></label>
      </div>
      <div className={styles.companyPicker} role="group" aria-label="チャートに表示する企業">{profiles.map(profile => <button type="button" key={profile.companyId} aria-pressed={profile.companyId === company.companyId} onClick={() => select(profile.companyId)}><span>{profile.ticker}</span>{profile.embedding === "external" ? <small>外部</small> : null}</button>)}</div>
      <div className={styles.detailGrid}>
        <div className={styles.chartPanel}>
          <div className={styles.companyHeader}><CompanyCardLogo companyId={company.companyId} name={company.name} size="overview" /><div><h3>{company.name}</h3><p>{company.exchange} · {company.ticker} · {company.currency}</p></div><Link className={styles.companyDetailLink} href={company.companyHref} onClick={() => relatedClick("company")}>企業詳細 →</Link></div>
          <p className={styles.companySummary}>{company.summary}</p>
          <p className={styles.listing}>{company.listing}</p>
          {company.embedding === "external" ? <div className={styles.externalChart}><p>この日本株は、埋め込みでの提供範囲を確認できていません。</p><p>外部チャートと、当サイトの企業情報から事業の動きを確認できます。</p></div> : <SymbolOverview key={company.companyId} symbol={company.symbol} name={company.name} sourceUrl={company.sourceUrl} />}
          <a className={styles.sourceLink} href={company.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={() => relatedClick("external_chart")}>TradingViewで{company.name}の株価を確認 ↗</a>

        </div>
        <aside className={styles.related} aria-label={`${company.name}の企業情報と関連記事`}>
          <section className={styles.sidePanel} aria-labelledby="stock-quotes-title"><div className={styles.panelHead}><h3 id="stock-quotes-title">主要半導体企業の株価</h3><a href="#stock-performance-title" onClick={event => {
            event.preventDefault();
            const target = document.getElementById("stock-performance-title");
            target?.focus({ preventScroll: true });
            target?.scrollIntoView({ block: "start" });
          }}>期間別比較 ↓</a></div><StockQuotes /></section>
          <section className={styles.sidePanel}><div className={styles.panelHead}><h3>関連ニュース</h3><Link href="/semiconductor-watch">すべて見る →</Link></div>
          {company.news.length ? <ul className={styles.news}>{company.news.map(item => <li key={item.id}><time dateTime={item.date}>{item.dateLabel} {watchDate(item.date)}</time><Link href={item.href} onClick={() => relatedClick("news")}>{item.title} →</Link></li>)}</ul> : <p className={styles.emptyNews}>{company.name}の掲載記事はまだありません。<Link href="/semiconductor-watch">業界全体の動きを見る →</Link></p>}
          </section>
          <section className={styles.sidePanel}><h3>{company.name}を知る</h3>
          <div className={styles.actions}>
            <Link href={company.companyHref} onClick={() => relatedClick("company")}>事業・仕事内容を見る →</Link>
            {company.earningsHref ? <Link href={company.earningsHref} onClick={() => relatedClick("earnings")}>掲載決算・会社見通しを見る →</Link> : <p className={styles.fine}>この企業の決算解説は未掲載です。</p>}
            <Link href="/compare" onClick={() => relatedClick("compare")}>企業の役割・仕事内容を比較 →</Link>
          </div>
          </section>
        </aside>
      </div>
    </section>
    <section className={styles.performancePanel} aria-labelledby="stock-performance-title">
      <div className={styles.sectionHead}><div><h2 id="stock-performance-title" tabIndex={-1}>主要企業の期間別パフォーマンス</h2><p>米国上場{profiles.filter(profile => profile.embedding !== "external").length}社 · USD · 当日／1週／1か月／6か月／1年</p></div></div>

      <StockMarketTable onSelect={selectFromTable} />
      <p className={styles.fine}>TradingView算出のPerformanceです。配当込み収益率を保証する表示ではありません。市場・取引時間・休場日によって価格時点が異なり、遅延や欠測があります。</p>
      <details className={styles.disclosure}><summary>表が表示されない場合の確認先</summary><ul className={styles.companyLinks}>{profiles.filter(profile => profile.embedding !== "external").map(profile => <li key={profile.companyId}><a href={profile.sourceUrl} target="_blank" rel="noopener noreferrer">{profile.name} · {profile.ticker} ↗</a></li>)}</ul></details>
    </section>
  </>;
}
