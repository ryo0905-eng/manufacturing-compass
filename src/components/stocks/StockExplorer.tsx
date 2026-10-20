"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CompanyCardLogo } from "@/components/CompanyCardLogo";
import { readStockCompany, stockHref, type StockCompanyProfile } from "@/lib/stock-market";
import { trackEvent } from "@/lib/analytics";
import { watchDate } from "@/lib/watch-types";
import { StockMarketTable, SymbolOverview } from "./StockWidgets";
import styles from "./Stocks.module.css";

export function StockExplorer({ profiles }: { profiles: StockCompanyProfile[] }) {
  const [companyId, setCompanyId] = useState(profiles[0]?.companyId ?? "nvidia");
  const chartHeading = useRef<HTMLHeadingElement>(null);
  const company = profiles.find(profile => profile.companyId === companyId) ?? profiles[0];
  useEffect(() => {
    const restore = () => setCompanyId(readStockCompany(window.location.hash));
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
    <section className={styles.section} aria-labelledby="stock-chart-title">
      <div className={styles.sectionHead}><h2 id="stock-chart-title" ref={chartHeading} tabIndex={-1}>企業の株価と、事業の動きを読む</h2>
        <label className={styles.selector}>企業を選ぶ<select value={company.companyId} onChange={event => select(event.target.value)}>{profiles.map(profile => <option key={profile.companyId} value={profile.companyId}>{profile.name} · {profile.ticker}{profile.embedding === "external" ? "（外部で確認）" : ""}</option>)}</select></label>
      </div>
      <div className={styles.detailGrid}>
        <div className={styles.chartPanel}>
          <div className={styles.companyHeader}><CompanyCardLogo companyId={company.companyId} name={company.name} size="overview" /><div><h3>{company.name}</h3><p>{company.exchange} · {company.ticker} · {company.currency}</p></div></div>
          <p className={styles.fine}>{company.listing}</p>
          {company.embedding === "external" ? <div className={styles.externalChart}><p>この日本株は、埋め込みでの提供範囲を確認できていません。</p><p>外部チャートと、当サイトの企業情報から事業の動きを確認できます。</p></div> : <SymbolOverview key={company.companyId} symbol={company.symbol} name={company.name} sourceUrl={company.sourceUrl} />}
          <a className={styles.sourceLink} href={company.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={() => relatedClick("external_chart")}>TradingViewで{company.name}の株価を確認 ↗</a>
          <p className={styles.fine}>価格は原通貨表示です。チャートの期間ボタンと、比較表の各期間は別々に操作・表示されます。表示されない場合は外部リンクをご利用ください。</p>
        </div>
        <aside className={styles.related} aria-label={`${company.name}の企業情報と関連記事`}>
          <h3>市場の動きから企業研究へ</h3><p>{company.summary}</p>
          <div className={styles.actions}>
            <Link href={company.companyHref} onClick={() => relatedClick("company")}>事業・仕事内容を見る →</Link>
            {company.earningsHref ? <Link href={company.earningsHref} onClick={() => relatedClick("earnings")}>掲載決算・会社見通しを見る →</Link> : <p className={styles.fine}>この企業の決算解説は未掲載です。</p>}
            <Link href="/compare" onClick={() => relatedClick("compare")}>企業の役割・仕事内容を比較 →</Link>
          </div>
          <h3>関連する掲載ニュース</h3>
          {company.news.length ? <ul className={styles.news}>{company.news.map(item => <li key={item.id}><time dateTime={item.date}>{item.dateLabel} {watchDate(item.date)}</time><Link href={item.href} onClick={() => relatedClick("news")}>{item.title} →</Link></li>)}</ul> : <p className={styles.fine}>関連する掲載記事はありません。</p>}
          <p className={styles.fine}>記事は公表日順です。掲載ニュースと株価の動きの因果関係を示すものではありません。</p>
        </aside>
      </div>
    </section>
    <section className={styles.section} aria-labelledby="stock-performance-title">
      <div className={styles.sectionHead}><div><h2 id="stock-performance-title">主要企業の期間別パフォーマンス</h2><p>米国上場{profiles.filter(profile => profile.embedding !== "external").length}社 · USD · 当日／1週／1か月／6か月／1年</p></div></div>
      <p className={styles.fine}>色と数値で変化を比較できます。銘柄リンクを選ぶと上の企業情報へ移動します。スマートフォンでは表を横にスクロールしてください。</p>
      <StockMarketTable onSelect={selectFromTable} />
      <p className={styles.fine}>TradingView算出のPerformanceです。配当込み収益率を保証する表示ではありません。市場・取引時間・休場日によって価格時点が異なり、遅延や欠測があります。</p>
      <details className={styles.disclosure}><summary>表が表示されない場合の確認先</summary><ul className={styles.companyLinks}>{profiles.filter(profile => profile.embedding !== "external").map(profile => <li key={profile.companyId}><a href={profile.sourceUrl} target="_blank" rel="noopener noreferrer">{profile.name} · {profile.ticker} ↗</a></li>)}</ul></details>
    </section>
  </>;
}
