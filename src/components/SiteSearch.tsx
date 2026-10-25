"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { siteLinks } from "@/data/site-navigation";
import { trackSiteSearchEvent } from "@/lib/analytics";
import { getSiteSearchPage, normalizeSiteSearch, SITE_SEARCH_PAGE_SIZE, siteSearchFilters, siteSearchKindLabels, type SiteSearchEntry, type SiteSearchFilter } from "@/lib/site-search";
import styles from "@/components/HomeDiscovery.module.css";

const examples = ["Cpk", "エッチング", "東京エレクトロン", "職種"];

export function SiteSearch({ entries }: { entries: readonly SiteSearchEntry[] }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<SiteSearchFilter>("all");
  const [limit, setLimit] = useState(SITE_SEARCH_PAGE_SIZE);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const composing = useRef(false);
  const started = useRef(false);
  const results = useMemo(() => getSiteSearchPage(entries, query, kind, limit), [entries, query, kind, limit]);
  const hasQuery = Boolean(normalizeSiteSearch(query));

  useEffect(() => {
    function focusSearch() {
      if (window.location.hash === "#home-search") inputRef.current?.focus({ preventScroll: true });
    }
    focusSearch();
    window.addEventListener("hashchange", focusSearch);
    return () => window.removeEventListener("hashchange", focusSearch);
  }, []);

  function commitQuery(value: string) {
    setInput(value);
    setQuery(value);
    setLimit(SITE_SEARCH_PAGE_SIZE);
    if (!started.current && normalizeSiteSearch(value)) {
      started.current = true;
      trackSiteSearchEvent("site_search_start", { result_kind: kind, result_count: getSiteSearchPage(entries, value, kind).total });
    }
  }

  function clearSearch() {
    setInput("");
    setQuery("");
    setKind("all");
    setLimit(SITE_SEARCH_PAGE_SIZE);
    inputRef.current?.focus();
  }

  return (
    <section id="home-search" className={styles.search} aria-labelledby="site-search-title">
      <h2 id="site-search-title">記事・企業・ツールを探す</h2>
      <form role="search" aria-labelledby="site-search-title" onSubmit={(event) => {
        event.preventDefault();
        if (composing.current) return;
        commitQuery(input);
        if (normalizeSiteSearch(input)) resultsRef.current?.focus({ preventScroll: true });
      }}>
        <label className={styles.fieldLabel} htmlFor="site-search-input">キーワード</label>
        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            id="site-search-input"
            type="search"
            value={input}
            placeholder="例：Cpk、エッチング、東京エレクトロン"
            autoComplete="off"
            enterKeyHint="search"
            onCompositionStart={() => { composing.current = true; }}
            onCompositionEnd={(event) => { composing.current = false; commitQuery(event.currentTarget.value); }}
            onChange={(event) => {
              setInput(event.currentTarget.value);
              if (!composing.current) commitQuery(event.currentTarget.value);
            }}
          />
          <button className={styles.submit} type="submit">検索</button>
          {input && <button type="button" className={styles.clear} onClick={clearSearch}>クリア</button>}
        </div>
      </form>
      {!hasQuery && <div className={styles.examples}>
        <span>検索例</span>
        {examples.map((example) => <button type="button" key={example} onClick={() => { commitQuery(example); inputRef.current?.focus(); }}>{example}</button>)}
      </div>}
      {hasQuery && <div className={styles.results}>
        <div className={styles.filters} role="group" aria-label="検索結果の種類">
          {siteSearchFilters.map((filter) => <button key={filter.id} type="button" aria-pressed={kind === filter.id} onClick={() => {
            if (kind === filter.id) return;
            setKind(filter.id);
            setLimit(SITE_SEARCH_PAGE_SIZE);
            trackSiteSearchEvent("site_search_filter", { result_kind: filter.id, result_count: getSiteSearchPage(entries, query, filter.id).total });
          }}>{filter.label}</button>)}
        </div>
        <h3 ref={resultsRef} tabIndex={-1} className={styles.resultHeading}>検索結果</h3>
        <p className={styles.count} role="status">{results.total}件中{results.items.length}件を表示</p>
        {results.total > 0 ? <>
          <ul ref={listRef} className={styles.resultList}>
            {results.items.map((entry) => <li key={entry.id}>
              <Link href={entry.href} onClick={() => trackSiteSearchEvent("site_search_result_click", { result_id: entry.id, result_kind: entry.kind })}>
                <span className={styles.kind}>{siteSearchKindLabels[entry.kind]}</span>
                <strong>{entry.title}</strong>
                <p>{entry.description}</p>
              </Link>
            </li>)}
          </ul>
          {results.hasMore && <button type="button" className={styles.more} onClick={() => {
            const nextIndex = results.items.length;
            setLimit((value) => value + SITE_SEARCH_PAGE_SIZE);
            requestAnimationFrame(() => listRef.current?.querySelectorAll<HTMLAnchorElement>("a")[nextIndex]?.focus());
          }}>さらに{Math.min(SITE_SEARCH_PAGE_SIZE, results.total - results.items.length)}件を表示</button>}
        </> : <div className={styles.empty}>
          <p>該当する情報が見つかりませんでした。短い語や別の表記で検索するか、一覧から探せます。</p>
          <nav aria-label="一覧から探す">{(["guides", "industry_map", "tools"] as const).map((id) => <Link href={siteLinks[id].href} key={id}>{siteLinks[id].label} →</Link>)}</nav>
        </div>}
      </div>}
      <noscript><p>キーワード検索はJavaScriptを有効にすると利用できます。下の目的別リンクからも探せます。</p></noscript>
    </section>
  );
}
