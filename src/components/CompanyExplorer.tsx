"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CompanyCardLogo } from "@/components/CompanyCardLogo";
import { industryMapCareers, industryMapMetadata, industryMapZoneRelations, industryMapZones } from "@/data/industry-map";
import { trackEvent } from "@/lib/analytics";
import { filterExplorerCompanies, normalizeCompanySearch } from "@/lib/company-explorer";
import { readIndustryCompanyHash } from "@/lib/industry-map-entry";
import type { IndustrySegment } from "@/types/content";
import type { CompanyExplorerFilters, CompanyExplorerItem, CompanyExplorerMode, CompanyExplorerSource } from "@/types/company-explorer";
import styles from "./CompanyExplorer.module.css";

const UI_VERSION = "company-explorer-v1";
const emptyFilters: CompanyExplorerFilters = { query: "", region: "all", locationsOnly: false, segment: "all" };

type CompanyExplorerProps = {
  mode: CompanyExplorerMode;
  sourcePage: CompanyExplorerSource;
  items: CompanyExplorerItem[];
  fallbackItems?: CompanyExplorerItem[];
  initialQuery?: string;
  segments?: IndustrySegment[];
};

export function CompanyExplorer({ mode, sourcePage, items, fallbackItems = [], initialQuery = "", segments = [] }: CompanyExplorerProps) {
  const atlas = mode === "atlas";
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
  const groups = industryMapZones.map((zone) => ({ zone, companies: filtered.filter((company) => company.primaryZone === zone.id) }))
    .filter((group) => group.companies.length > 0);
  const isFiltering = Boolean(filters.query.trim() || filters.region !== "all" || filters.locationsOnly || filters.segment !== "all");
  const fallback = atlas && filtered.length === 0 && filters.query.trim()
    ? filterExplorerCompanies(fallbackItems, filters).filter((company) => !items.some((item) => item.id === company.id)).slice(0, 3)
    : [];

  function record(eventName: string, properties: Parameters<typeof trackEvent>[1] = {}) {
    try {
      trackEvent(eventName, { ...properties, source_page: sourcePage, ui_version: UI_VERSION });
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
    if (!atlas) return;
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
  }, [atlas, items]);

  function openCompany(company: CompanyExplorerItem, trigger: HTMLButtonElement) {
    originRef.current = trigger;
    setSelected(company);
    if (atlas) {
      const properties = { node_type: "company", node_id: company.id, mode: "editorial", view: "atlas", entry_point: "company_card" };
      record("industry_map_node_open", properties);
      record("industry_map_detail_view", properties);
    } else record("companies_summary_open", { company_id: company.id, placement: "company_card" });
  }

  function filterChanged(next: Partial<CompanyExplorerFilters>, filterType: string, value?: string | boolean) {
    setFilters((current) => ({ ...current, ...next }));
    setSelected(null);
    if (atlas) record("industry_map_filter_use", { filter_type: filterType, filter_value: value });
    else record("companies_filter_use", { filter_type: filterType, filter_value: value });
  }

  function recordSearch() {
    const query = normalizeCompanySearch(filters.query);
    if (!query || query === lastSearch.current) return;
    lastSearch.current = query;
    record(atlas ? "industry_map_search_result" : "companies_filter_use", { ...(atlas ? {} : { filter_type: "keyword" }), result_count: filtered.length });
  }

  function contentClick(company: CompanyExplorerItem, destination: string, placement: string) {
    if (atlas) record("industry_map_content_click", { company_id: company.id, node_type: "company", node_id: company.id, destination, link_location: placement });
    else record("companies_company_open", { company_id: company.id, destination, placement });
  }

  return (
    <section ref={rootRef} className={`${styles.root} ${atlas ? styles.atlas : styles.directory}${isFiltering ? ` ${styles.filtering}` : ""}`} id={atlas ? undefined : "company-search"} tabIndex={atlas ? undefined : -1} aria-labelledby={atlas ? "industry-atlas-title" : "company-search-title"}>
      <header className={styles.heading}>
        <div>
          <h2 id={atlas ? "industry-atlas-title" : "company-search-title"}>{atlas ? "企業を眺めながら、半導体業界の分業をつかむ" : "企業を探す"}</h2>
          <p>{atlas ? "設計・製造・後工程と、それを支える材料・装置。ロゴや企業名から概要を開けます。" : "主な役割ごとに掲載企業をまとめました。ロゴや企業名から概要を開き、企業詳細へ進めます。"}</p>
        </div>
        <span>{atlas ? "代表" : "掲載"}{items.length}社</span>
      </header>
      {atlas ? <p className={styles.readingGuide}>設計と製造は分業し、材料・装置・検査が工程を横断して支えます。メモリなどの製品分野は企業概要で確認できます。</p> : null}
      {notice ? <p role="status" className={styles.empty}>{notice}</p> : null}
      <div className={styles.toolbar}>
        <label className={styles.search}>
          <span>企業名・製品・職種で検索</span>
          <input ref={searchRef} type="search" value={filters.query} placeholder="例：TSMC、メモリ、品質保証" onChange={(event) => { setFilters((current) => ({ ...current, query: event.target.value })); setSelected(null); }} onBlur={recordSearch} onKeyDown={(event) => { if (event.key === "Enter") recordSearch(); }} />
        </label>
        <label><span>本社地域</span><select value={filters.region} onChange={(event) => filterChanged({ region: event.target.value as CompanyExplorerFilters["region"] }, "region", event.target.value)}>
          <option value="all">日本・海外すべて</option><option value="japan">日本企業</option><option value="overseas">海外企業</option>
        </select></label>
        {!atlas ? <label><span>製品・事業分野</span><select value={filters.segment} onChange={(event) => filterChanged({ segment: event.target.value }, "segment", event.target.value)}>
          <option value="all">すべての分野</option>{segments.map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)}
        </select></label> : null}
        <label className={styles.checkbox}><input type="checkbox" checked={filters.locationsOnly} onChange={(event) => filterChanged({ locationsOnly: event.target.checked }, "locations", event.target.checked)} />国内拠点情報あり</label>
        {atlas ? <button type="button" aria-pressed={showCareers} onClick={() => { setShowCareers(!showCareers); record("industry_map_career_layer_change", { enabled: !showCareers }); }}>職種との接点</button> : null}
        {isFiltering ? <button type="button" onClick={() => { setFilters({ ...emptyFilters }); setSelected(null); lastSearch.current = ""; record(atlas ? "industry_map_filter_use" : "companies_filter_use", { filter_type: "clear" }); }}>条件をクリア</button> : null}
        <output aria-live="polite">{filtered.length}社</output>
      </div>
      {groups.length ? <nav className={styles.categories} aria-label={atlas ? "業界地図の領域" : "企業一覧の領域"}>{groups.map(({ zone }) => <a key={zone.id} href={`#${atlas ? "industry-zone" : "directory-zone"}-${zone.id}`} onClick={() => { if (atlas) record("industry_map_category_click", { category: zone.id, destination: "map_zone" }); }}>{zone.label}</a>)}</nav> : null}
      {!filtered.length ? <div className={styles.empty} role="status">
        <strong>{atlas ? "地図の代表企業には一致しませんでした" : "条件に一致する企業はありませんでした"}</strong><p>検索語を短くするか、条件を解除してください。</p>
        {fallback.length ? <><p>企業一覧には、次の企業を掲載しています。</p><ul>{fallback.map((company) => <li key={company.id}><Link href={`/companies/${company.slug}` as Route} onClick={() => contentClick(company, "company", "empty_result")}>{company.nameJa}の企業詳細</Link></li>)}</ul></> : null}
        {atlas ? <Link href="/companies">全掲載企業から探す</Link> : null}
      </div> : null}
      {atlas ? <div className={styles.flow} aria-label="半導体産業の一般的な役割の流れ">
        {industryMapZoneRelations.slice(0, 3).map((relation) => <p key={`${relation.from}-${relation.to}`}><strong>{industryMapZones.find((zone) => zone.id === relation.from)?.label}</strong><span aria-hidden="true"> → </span><strong>{industryMapZones.find((zone) => zone.id === relation.to)?.label}</strong><small>{relation.label}</small></p>)}
        <p className={styles.flowNote}>材料・製造装置・検査装置は複数工程を支えます。矢印は一般的な役割の接点で、個別企業の取引関係ではありません。</p>
      </div> : null}
      <div className={styles.groups}>
        {groups.map(({ zone, companies }) => <section key={zone.id} data-zone={zone.id} className={styles.zone} id={`${atlas ? "industry-zone" : "directory-zone"}-${zone.id}`}>
          <header className={styles.zoneHeading}><h3>{zone.label}</h3><span>{companies.length}社</span>{atlas ? <p>{zone.description}</p> : null}</header>
          <div className={styles.cards}>{companies.map((company) => <article key={company.id} className={styles.card} data-atlas-company={atlas ? company.id : undefined} data-company-explorer-company={company.id}>
            <button type="button" aria-label={`${company.nameJa}の概要を見る`} aria-haspopup="dialog" aria-pressed={selected?.id === company.id} onClick={(event) => openCompany(company, event.currentTarget)}>
              <CompanyCardLogo companyId={company.id} name={company.name} size="compact" />
              <strong>{company.nameJa}</strong><span>{company.businessModel}</span>
            </button>
            {company.slug ? <Link href={`/companies/${company.slug}` as Route} onClick={() => contentClick(company, "company", "company_card")} aria-label={`${company.nameJa}の企業詳細`}>企業詳細 <span aria-hidden="true">→</span></Link>
              : <a href={company.websiteUrl} target="_blank" rel="noreferrer" onClick={() => contentClick(company, "official_source", "company_card")} aria-label={`${company.nameJa}の公式情報（新しいタブ）`}>公式情報 <span aria-hidden="true">↗</span></a>}
          </article>)}</div>
          {atlas && showCareers ? <div className={styles.careers}><strong>この領域と接点のある職種</strong>{zone.careerIds.map((id) => industryMapCareers.find((career) => career.id === id)).filter((career) => career !== undefined).slice(0, 2).map((career) => <p key={career.id}><b>{career.label}</b><span>{career.description}</span><Link href={`/companies?query=${encodeURIComponent(career.query)}` as Route}>関連企業を探す</Link></p>)}<Link href="/career-compass">経験との接点を整理する</Link></div> : null}
          {atlas ? <Link className={styles.zoneLink} href={zone.guideHref as Route}>{zone.guideLabel} <span aria-hidden="true">→</span></Link> : null}
        </section>)}
      </div>
      <p className={styles.note}>分類は主な役割による整理です。一社が複数の分野を担う場合があります。{atlas ? `地図の分類更新：${industryMapMetadata.lastUpdated}。` : "製品・事業分野の絞り込みは、会社ごとの複数分類に対応します。"}</p>
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
