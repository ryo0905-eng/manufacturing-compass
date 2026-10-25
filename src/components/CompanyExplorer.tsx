"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CompanyCardLogo } from "@/components/CompanyCardLogo";
import { CareerCompassLink } from "@/components/CareerCompassLink";
import { industryMapCareers, industryMapMetadata, industryMapZones } from "@/data/industry-map";
import { trackEvent } from "@/lib/analytics";
import { filterExplorerCompanies, normalizeCompanySearch } from "@/lib/company-explorer";
import { readIndustryCompanyHash } from "@/lib/industry-map-entry";
import type { IndustrySegment } from "@/types/content";
import type { CompanyExplorerFilters, CompanyExplorerItem } from "@/types/company-explorer";
import styles from "./CompanyExplorer.module.css";

const UI_VERSION = "overview-atlas-v3";
const overviewZones = ["eda-ip", "fabless", "foundry", "osat", "inspection", "materials", "idm", "equipment"]
  .flatMap((id) => industryMapZones.filter((zone) => zone.id === id));
const emptyFilters: CompanyExplorerFilters = { query: "", region: "all", locationsOnly: false, segment: "all" };

type CompanyExplorerProps = {
  items: CompanyExplorerItem[];
  initialQuery?: string;
  segments?: IndustrySegment[];
};

export function CompanyExplorer({ items, initialQuery = "", segments = [] }: CompanyExplorerProps) {
  const rootRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const originRef = useRef<HTMLButtonElement | null>(null);
  const restoredIds = useRef(new Set<string>());
  const lastSearch = useRef("");
  const [filters, setFilters] = useState<CompanyExplorerFilters>({ ...emptyFilters, query: initialQuery });
  const [showCareers, setShowCareers] = useState(false);
  const [selected, setSelected] = useState<CompanyExplorerItem | null>(null);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => filterExplorerCompanies(items, filters), [items, filters]);
  const groups = overviewZones.map((zone) => ({ zone, companies: filtered.filter((company) => company.primaryZone === zone.id) }))
    .filter((group) => group.companies.length > 0);
  const filterCount = Number(filters.region !== "all") + Number(filters.locationsOnly) + Number(filters.segment !== "all");
  const isFiltering = Boolean(filters.query.trim() || filters.region !== "all" || filters.locationsOnly || filters.segment !== "all");

  function record(eventName: string, properties: Parameters<typeof trackEvent>[1] = {}) {
    try {
      trackEvent(eventName, { ...properties, source_page: "/industry-map", ui_version: UI_VERSION });
    } catch {
      // Analytics availability must not prevent company research.
    }
  }

  function closeDetail() {
    setSelected(null);
    requestAnimationFrame(() => {
      const trigger = originRef.current;
      if (trigger?.isConnected && trigger.getClientRects().length > 0) trigger.focus({ preventScroll: true });
      else searchRef.current?.focus({ preventScroll: true });
    });
  }

  useEffect(() => {
    let frame: number | undefined;
    function restore() {
      const entry = readIndustryCompanyHash(window.location.hash, items.map((company) => company.id));
      if (entry.kind === "anchor") { setSelected(null); setNotice(""); return; }
      if (entry.kind === "invalid") {
        setSelected(null);
        setNotice("指定された企業は地図に未収録です。地図から企業を選んでください。");
        return;
      }
      const company = items.find((item) => item.id === entry.id)!;
      setFilters({ ...emptyFilters });
      setNotice("");
      setSelected(company);
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const button = rootRef.current?.querySelector<HTMLButtonElement>(`[data-atlas-company="${company.id}"] button`);
        originRef.current = button ?? null;
        button?.scrollIntoView({ block: "center", behavior: "instant" });
      });
      if (!restoredIds.current.has(company.id)) {
        restoredIds.current.add(company.id);
        record("industry_map_detail_view", { node_type: "company", node_id: company.id, mode: "editorial", view: "atlas", entry_point: "shared_link" });
      }
    }
    restore();
    window.addEventListener("hashchange", restore);
    return () => { window.removeEventListener("hashchange", restore); if (frame !== undefined) cancelAnimationFrame(frame); };
    // The server supplies a fixed catalog for each page. Filters do not change it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function openCompany(company: CompanyExplorerItem, trigger: HTMLButtonElement) {
    originRef.current = trigger;
    setSelected(company);
    const properties = { node_type: "company", node_id: company.id, mode: "editorial", view: "atlas", entry_point: "company_card" };
    record("industry_map_node_open", properties);
    record("industry_map_detail_view", properties);
  }

  function filterChanged(next: Partial<CompanyExplorerFilters>, filterType: string, value?: string | boolean) {
    setFilters((current) => ({ ...current, ...next }));
    setSelected(null);
    record("industry_map_filter_use", { filter_type: filterType, filter_value: value });
  }

  function recordSearch() {
    const query = normalizeCompanySearch(filters.query);
    if (!query || query === lastSearch.current) return;
    lastSearch.current = query;
    record("industry_map_search_result", { result_count: filtered.length });
  }

  function contentClick(company: CompanyExplorerItem, destination: string, placement: string) {
    record("industry_map_content_click", { company_id: company.id, node_type: "company", node_id: company.id, destination, link_location: placement });
  }

  return (
    <section ref={rootRef} className={`${styles.root} ${styles.atlas}${isFiltering ? ` ${styles.filtering}` : ""}`} id="company-search" tabIndex={-1} aria-labelledby="industry-atlas-title">
      <h2 id="industry-atlas-title" className={styles.srOnly}><span id="company-search-title">業界のつながりから企業を探す</span></h2>
      {notice ? <p role="status" className={styles.empty}>{notice}</p> : null}
      <div className={styles.toolbar}>
        <label className={styles.search}>
          <span className={styles.srOnly}>企業名・製品・職種で検索</span>
          <input ref={searchRef} type="search" value={filters.query} placeholder="企業名・製品・職種で検索（例：TSMC、メモリ）" onChange={(event) => { setFilters((current) => ({ ...current, query: event.target.value })); setSelected(null); }} onBlur={recordSearch} onKeyDown={(event) => { if (event.key === "Enter") recordSearch(); }} />
        </label>
        <output aria-live="polite">{filtered.length}社</output>
        {isFiltering ? <button type="button" onClick={() => { setFilters({ ...emptyFilters }); setSelected(null); lastSearch.current = ""; record("industry_map_filter_use", { filter_type: "clear" }); }}>条件をクリア</button> : null}
        <details className={styles.filters} data-company-filters="">
          <summary>絞り込み{filterCount ? `（${filterCount}条件）` : ""}{showCareers ? "・職種表示中" : ""}</summary>
          <div className={styles.filterOptions}>
            <label><span>本社地域</span><select value={filters.region} onChange={(event) => filterChanged({ region: event.target.value as CompanyExplorerFilters["region"] }, "region", event.target.value)}>
              <option value="all">日本・海外すべて</option><option value="japan">日本企業</option><option value="overseas">海外企業</option>
            </select></label>
            <label><span>製品・事業分野</span><select value={filters.segment} onChange={(event) => filterChanged({ segment: event.target.value }, "segment", event.target.value)}>
              <option value="all">すべての分野</option>{segments.map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)}
            </select></label>
            <label className={styles.checkbox}><input type="checkbox" checked={filters.locationsOnly} onChange={(event) => filterChanged({ locationsOnly: event.target.checked }, "locations", event.target.checked)} />国内拠点情報あり</label>
            <button type="button" aria-pressed={showCareers} onClick={() => { setShowCareers(!showCareers); record("industry_map_career_layer_change", { enabled: !showCareers }); }}>職種との接点</button>
            <p className={styles.filterNote}>6分類は企業詳細のある37社が対象です。簡易紹介7社は企業名・製品・職種から検索できます。</p>
          </div>
        </details>
      </div>
      {!filtered.length ? <div className={styles.empty} role="status">
        <strong>条件に一致する企業はありませんでした</strong><p>検索語を短くするか、条件を解除してください。</p>
      </div> : null}
      <div className={styles.flow} aria-label="半導体産業の一般的な役割の流れ">
        <p><strong>設計</strong><span aria-hidden="true"> → </span><strong>製造</strong><span aria-hidden="true"> → </span><strong>後工程</strong></p>
        <p>材料・装置・検査は複数工程を支えます。個別企業の取引関係を示す矢印ではありません。</p>
      </div>
      <div className={styles.groups} data-company-map-grid="">
        {groups.map(({ zone, companies }) => <section key={zone.id} data-zone={zone.id} className={styles.zone} id={`industry-zone-${zone.id}`}>
          <span id={`directory-zone-${zone.id}`} className={styles.anchor} aria-hidden="true" />
          <header className={styles.zoneHeading}><h3>{zone.label}</h3><span>{companies.length}社</span></header>
          <div className={styles.cards}>{companies.map((company) => <article key={company.id} className={styles.card} data-atlas-company={company.id} data-company-explorer-company={company.id}>
            <button type="button" className={company.profileKind === "map" ? styles.supplemental : undefined} aria-label={`${company.nameJa}の概要を見る${company.profileKind === "map" ? "（簡易紹介）" : ""}`} aria-haspopup="dialog" aria-pressed={selected?.id === company.id} onClick={(event) => openCompany(company, event.currentTarget)}>
              <CompanyCardLogo companyId={company.id} name={company.name} size="overview" />
              <strong>{company.nameJa}</strong>{company.profileKind === "map" ? <small className={styles.profileLabel} aria-hidden="true">簡易紹介</small> : null}
            </button>
          </article>)}</div>
          {showCareers ? <div className={styles.careers}><strong>この領域と接点のある職種</strong>{zone.careerIds.map((id) => industryMapCareers.find((career) => career.id === id)).filter((career) => career !== undefined).slice(0, 2).map((career) => <p key={career.id}><b>{career.label}</b><span>{career.description}</span><Link href={`/industry-map?query=${encodeURIComponent(career.query)}` as Route}>関連企業を探す</Link></p>)}<CareerCompassLink ctaLocation={`industry_map_zone_${zone.id}`} ctaVariant="zone_to_experience_v1" sourcePage="/industry-map">自分の経験に近い職種と、次の準備を整理する</CareerCompassLink></div> : null}
        </section>)}
      </div>
      <details className={styles.linkIndex} data-company-link-index="">
        <summary>全{items.length}社の企業詳細・公式情報</summary>
        <div className={styles.linkGroups}>{overviewZones.map((zone) => <section key={zone.id}>
          <h3>{zone.label}</h3>
          <ul>{items.filter((company) => company.primaryZone === zone.id).map((company) => <li key={company.id}>
            {company.slug ? <Link href={`/companies/${company.slug}` as Route} onClick={() => contentClick(company, "company", "company_link_index")}>{company.nameJa}<span>企業詳細 →</span></Link>
              : <a href={company.websiteUrl} target="_blank" rel="noreferrer" onClick={() => contentClick(company, "official_source", "company_link_index")}>{company.nameJa}<span>公式情報・簡易紹介 ↗</span></a>}
          </li>)}</ul>
        </section>)}</div>
      </details>
      <details className={styles.explanations}>
        <summary>8領域の役割と関連情報</summary>
        <div className={styles.linkGroups}>{overviewZones.map((zone) => <section key={zone.id}>
          <h3>{zone.label}</h3><p>{zone.description}</p>
          <Link href={zone.guideHref as Route} onClick={() => record("industry_map_category_click", { category: zone.id, destination: "guide" })}>{zone.guideLabel} →</Link>
        </section>)}</div>
      </details>
      <p className={styles.related}><Link href="#japanese-companies">日本企業を分野別に見る</Link><Link href="/compare">2社を比較する</Link><Link href="/semiconductor-map">日本の拠点から探す</Link></p>
      <p className={styles.note}>詳細37社・簡易紹介7社を掲載し、全企業を網羅したものではありません。分類は主な役割による整理です。一社が複数の分野を担う場合があります。地図の基本分類更新：{industryMapMetadata.lastUpdated}。</p>
      <p className={styles.credit}>ロゴは企業識別のために掲載しています。画像提供：<a href="https://companiesmarketcap.com/" target="_blank" rel="noreferrer">CompaniesMarketCap</a>／<a href="https://companieslogo.com/" target="_blank" rel="noreferrer">CompaniesLogo</a>。権利は各権利者に帰属します。</p>
      {selected ? <CompanyExplorerDialog company={selected} onClose={closeDetail} onNavigate={(destination) => contentClick(selected, destination, "detail_panel")} /> : null}
    </section>
  );
}

export function CompanyExplorerDialog({ company, onClose, onNavigate }: { company: CompanyExplorerItem; onClose: () => void; onNavigate: (destination: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => { if (dialog?.open) dialog.close(); };
  }, []);
  return <dialog ref={ref} className={styles.dialog} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }}>
    <div className={styles.dialogBody}>
      <button className={styles.close} type="button" onClick={onClose} autoFocus>閉じる <span aria-hidden="true">×</span></button>
      <CompanyCardLogo companyId={company.id} name={company.name} />
      <h2 id={titleId}>{company.nameJa}</h2><p className={styles.englishName}>{company.name}</p>
      <p className={styles.business}>{company.businessModel}・{company.headquartersCountry}</p>
      <p>{company.summary}</p>
      <dl><div><dt>主な製品・領域</dt><dd>{company.mainProducts.join(" / ")}</dd></div><div><dt>主な職種</dt><dd>{company.jobCategories.join(" / ")}</dd></div></dl>
      <nav className={styles.dialogLinks} aria-label="企業研究を続ける">
        {company.slug ? <Link href={`/companies/${company.slug}` as Route} onClick={() => onNavigate("company")}>企業情報を詳しく見る →</Link> : <a href={company.websiteUrl} target="_blank" rel="noreferrer" onClick={() => onNavigate("official_source")}>公式情報を見る ↗</a>}
        {company.slug && company.hasPublicLocations ? <Link href={`/companies/${company.slug}#japan-locations` as Route} onClick={() => onNavigate("company_locations")}>国内拠点を確認する</Link> : null}
        {company.slug && company.hasCareerPreparation ? <Link href={`/companies/${company.slug}#career-prep` as Route} onClick={() => onNavigate("career_preparation")}>キャリア準備を見る</Link> : null}
      </nav>
      <div className={styles.sources}>{company.profileKind === "map" ? <p>地図内の簡易紹介です。詳細は公式情報で確認してください。</p> : null}<p>企業情報の更新日：{company.lastUpdated}</p><ul>{company.sources.map((source) => <li key={`${source.url}-${source.title}`}><a href={source.url} target="_blank" rel="noreferrer">{source.publisher}：{source.title}</a><span>（確認日 {source.accessedAt}）</span></li>)}</ul></div>
    </div>
  </dialog>;
}
