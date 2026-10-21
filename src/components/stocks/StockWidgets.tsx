"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { stockListings } from "@/data/stock-market";
import { stockCompanyFromSymbol } from "@/lib/stock-market";
import styles from "./Stocks.module.css";

const modules = {
  mini: { tag: "tv-mini-chart", src: "https://widgets.tradingview-widget.com/w/ja/tv-mini-chart.js" },
  market: { tag: "tv-market-data", src: "https://widgets.tradingview-widget.com/w/ja/tv-market-data.js" },
} as const;
const marketSymbols = JSON.stringify([{ sectionName: "半導体関連企業・米国上場（USD）", symbols: stockListings.filter(item => item.embedding !== "external").map(item => item.symbol) }]);

function WebWidget({ kind, symbol, onSelect }: { kind: keyof typeof modules; symbol?: string; onSelect?: (id: string) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const module = modules[kind];
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    const element = document.createElement(module.tag);
    element.setAttribute("theme", "light");
    element.style.display = "block";
    element.style.width = "100%";
    element.style.height = "100%";
    if (kind === "mini" && symbol) {
      element.setAttribute("symbol", symbol);
      element.setAttribute("time-frame", "6M");
    } else {
      element.setAttribute("symbol-sectors", marketSymbols);
      element.setAttribute("view", "performance");
      element.setAttribute("heatmap", "");
    }
    // Keep an informative fallback if the module never upgrades the custom element.
    const placeholder = document.createElement("p");
    placeholder.textContent = "市場データを読み込み中です。表示されない場合は下の外部リンクから確認できます。";
    element.appendChild(placeholder);
    const selectSymbol = (event: Event) => {
      if (!(event instanceof CustomEvent) || !onSelect) return;
      const detail: unknown = event.detail;
      if (!detail || typeof detail !== "object" || !("context" in detail)) return;
      const context = detail.context;
      if (!context || typeof context !== "object" || !("symbol" in context)) return;
      const id = stockCompanyFromSymbol(context.symbol);
      if (!id) return;
      event.preventDefault();
      onSelect(id);
    };
    element.addEventListener("tv-link-open", selectSymbol);
    container.appendChild(element);
    return () => { element.removeEventListener("tv-link-open", selectSymbol); element.remove(); };
  }, [kind, symbol, module, onSelect]);

  return <>
    <Script id={`stocks-${kind}-module`} src={module.src} type="module" strategy="afterInteractive" onError={() => setFailed(true)} />
    {failed ? <p className={styles.widgetError} role="status">市場データを読み込めませんでした。外部リンクをご利用ください。</p> : null}
    <div ref={host} className={styles.webWidget} hidden={failed} />
  </>;
}

export function MiniChart({ symbol }: { symbol: string }) {
  return <div className={styles.miniChart}><WebWidget kind="mini" symbol={symbol} /></div>;
}

export function SymbolOverview({ symbol, name, sourceUrl }: { symbol: string; name: string; sourceUrl: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    // Each initialization owns a separate node. A late script cannot overwrite the next chart.
    const mount = document.createElement("div");
    mount.style.width = "100%";
    mount.style.height = "100%";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.textContent = JSON.stringify({
      symbols: [[name, `${symbol}|1D`]], locale: "ja", colorTheme: "light", autosize: true,
      width: "100%", height: "100%", chartOnly: false, chartType: "candlesticks", showVolume: true,
      showMA: false, hideDateRanges: false, hideMarketStatus: false, hideSymbolLogo: false,
      scalePosition: "right", scaleMode: "Normal", changeMode: "price-and-percent", valuesTracking: "1",
      dateRanges: ["1w|15", "1m|60", "3m|60", "12m|1D"],
    });
    script.onerror = () => setFailed(true);
    mount.appendChild(script);
    container.appendChild(mount);
    return () => { script.onerror = null; script.remove(); mount.remove(); };
  }, [symbol, name]);

  return <>
    {failed ? <p className={styles.widgetError} role="status">チャートを読み込めませんでした。下の外部リンクから確認できます。</p> : null}
    <div className={`${styles.chartContainer} tradingview-widget-container`} hidden={failed}>
      <div ref={host} className={`tradingview-widget-container__widget ${styles.chartMount}`} />
      <div className={`tradingview-widget-copyright ${styles.attribution}`}>
        <a href={sourceUrl} rel="noopener nofollow" target="_blank"><span className="blue-text">{name} stock price</span></a><span className="trademark"> by TradingView</span>
      </div>
    </div>
  </>;
}

// A compact official watchlist beside the chart; the full Performance table remains below.
export function StockQuotes() {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    const mount = document.createElement("div");
    mount.style.height = "100%";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.onerror = () => setFailed(true);
    script.textContent = JSON.stringify({
      colorTheme: "light", dateRange: "1M", showChart: false, locale: "ja",
      width: "100%", height: "100%", isTransparent: true, showSymbolLogo: true,
      tabs: [{ title: "米国上場 · USD", symbols: stockListings.filter(item => item.embedding !== "external").map(item => ({ s: item.symbol, d: item.ticker })) }],
    });
    mount.appendChild(script);
    container.appendChild(mount);
    return () => { script.onerror = null; script.remove(); mount.remove(); };
  }, []);
  if (failed) return <p className={styles.widgetError}>株価一覧を読み込めませんでした。企業ボタンから個別チャートを確認できます。</p>;
  return <div className={`tradingview-widget-container ${styles.quotesContainer}`}>
    <div ref={host} className={`tradingview-widget-container__widget ${styles.quotesMount}`} />
    <div className={`tradingview-widget-copyright ${styles.attribution}`}><a href="https://www.tradingview.com/markets/stocks-usa/" target="_blank" rel="noopener nofollow">株式市場</a><span className="trademark"> by TradingView</span></div>
  </div>;
}

export function StockMarketTable({ onSelect }: { onSelect: (id: string) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const target = host.current;
    if (!target) return;
    if (!("IntersectionObserver" in window)) { setNear(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNear(true); observer.disconnect(); }
    }, { rootMargin: "240px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  return <div ref={host} className={styles.tableScroll} role="region" aria-label="主要企業の期間別パフォーマンス。横にスクロールできます" tabIndex={0}>
    <div className={styles.tableCanvas}>{near ? <WebWidget kind="market" onSelect={onSelect} /> : <p>比較表はこの位置までスクロールすると読み込みます。</p>}</div>
  </div>;
}
