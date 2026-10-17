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
import type { CompanyExplorerFilters, CompanyExplorerItem } from "@/types/company-explorer";
import styles from "./CompanyExplorer.module.css";

const UI_VERSION = "unified-atlas-v2";
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
  const groups = industryMapZones.map((zone) => ({ zone, companies: filtered.filter((company) => company.primaryZone === zone.id) }))
    .filter((group) => group.companies.length > 0);
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
      <header className={styles.heading}>
        <div>
          <h2 id="industry-atlas-title"><span id="company-search-title">業界のつながりから企業を探す</span></h2>
          <p>設計・製造・後工程と、それを支える材料・装置。ロゴや企業名から概要を開き、企業詳細や公式情報へ進めます。</p>
        </div>
        <span>掲載{items.length}社</span>
      </header>
      <p className={styles.readingGuide}>設計と製造は分業し、材料・装置・検査が工程を横断して支えます。メモリなどの製品分野は企業概要で確認できます。</p>
      {notice ? <p role="status" className={styles.empty}>{notice}</p> : null}
      <div className={styles.toolbar}>
        <label className={styles.search}>
          <span>企業名・製品・職種で検索</span>
          <input ref={searchRef} type="search" value={filters.query} placeholder="例：TSMC、メモリ、品質保証" onChange={(event) => { setFilters((current) => ({ ...current, query: event.target.value })); setSelected(null); }} onBlur={recordSearch} onKeyDown={(event) => { if (event.key === "Enter") recordSearch(); }} />
        </label>
        <label><span>本社地域</span><select value={filters.region} onChange={(event) => filterChanged({ region: event.target.value as CompanyExplorerFilters["region"] }, "region", event.target.value)}>
          <option value="all">日本・海外すべて</option><option value="japan">日本企業</option><option value="overseas">海外企業</option>
        </select></label>
        <label><span>製品・事業分野</span><select value={filters.segment} onChange={(event) => filterChanged({ segment: event.target.value }, "segment", event.target.value)}>
          <option value="all">すべての分野</option>{segments.map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)}
        </select></label>
        <label className={styles.checkbox}><input type="checkbox" checked={filters.locationsOnly} onChange={(event) => filterChanged({ locationsOnly: event.target.checked }, "locations", event.target.checked)} />国内拠点情報あり</label>
        <button type="button" aria-pressed={showCareers} onClick={() => { setShowCareers(!showCareers); record("industry_map_career_layer_change", { enabled: !showCareers }); }}>職種との接点</button>
        {isFiltering ? <button type="button" onClick={() => { setFilters({ ...emptyFilters }); setSelected(null); lastSearch.current = ""; record("industry_map_filter_use", { filter_type: "clear" }); }}>条件をクリア</button> : null}
        <output aria-live="polite">{filtered.length}社</output>
      </div>
      <p className={styles.note}>製品・事業分野の6分類は企業詳細のある37社が対象です。簡易紹介7社は、企業名・製品・職種の検索で探せます。</p>
      {groups.length ? <nav className={styles.categories} aria-label="業界地図の領域">{groups.map(({ zone }) => <a key={zone.id} href={`#industry-zone-${zone.id}`} onClick={() => { record("industry_map_category_click", { category: zone.id, destination: "map_zone" }); }}>{zone.label}</a>)}</nav> : null}
      {!filtered.length ? <div className={styles.empty} role="status">
        <strong>条件に一致する企業はありませんでした</strong><p>検索語を短くするか、条件を解除してください。</p>
      </div> : null}
      <div className={styles.flow} aria-label="半導体産業の一般的な役割の流れ">
        {industryMapZoneRelations.slice(0, 3).map((relation) => <p key={`${relation.from}-${relation.to}`}><strong>{industryMapZones.find((zone) => zone.id === relation.from)?.label}</strong><span aria-hidden="true"> → </span><strong>{industryMapZones.find((zone) => zone.id === relation.to)?.label}</strong><small>{relation.label}</small></p>)}
        <p className={styles.flowNote}>材料・製造装置・検査装置は複数工程を支えます。矢印は一般的な役割の接点で、個別企業の取引関係ではありません。</p>
      </div>
      <div className={styles.groups}>
        {groups.map(({ zone, companies }) => <section key={zone.id} data-zone={zone.id} className={styles.zone} id={`industry-zone-${zone.id}`}>
          <span id={`directory-zone-${zone.id}`} className={styles.anchor} aria-hidden="true" />
          <header className={styles.zoneHeading}><h3>{zone.label}</h3><span>{companies.length}社</span><p>{zone.description}</p></header>
          <div className={styles.cards}>{companies.map((company) => <article key={company.id} className={styles.card} data-atlas-company={company.id} data-company-explorer-company={company.id}>
            <button type="button" aria-label={`${company.nameJa}の概要を見る`} aria-haspopup="dialog" aria-pressed={selected?.id === company.id} onClick={(event) => openCompany(company, event.currentTarget)}>
              <CompanyCardLogo companyId={company.id} name={company.name} size="compact" />
              <strong>{company.nameJa}</strong>{company.profileKind === "map" ? <small className={styles.profileLabel}>簡易紹介</small> : null}<span>{company.businessModel}</span>
            </button>
            {company.slug ? <Link href={`/companies/${company.slug}` as Route} onClick={() => contentClick(company, "company", "company_card")} aria-label={`${company.nameJa}の企業詳細`}>企業詳細 <span aria-hidden="true">→</span></Link>
              : <a href={company.websiteUrl} target="_blank" rel="noreferrer" onClick={() => contentClick(company, "official_source", "company_card")} aria-label={`${company.nameJa}の公式情報（新しいタブ）`}>公式情報 <span aria-hidden="true">↗</span></a>}
          </article>)}</div>
          {showCareers ? <div className={styles.careers}><strong>この領域と接点のある職種</strong>{zone.careerIds.map((id) => industryMapCareers.find((career) => career.id === id)).filter((career) => career !== undefined).slice(0, 2).map((career) => <p key={career.id}><b>{career.label}</b><span>{career.description}</span><Link href={`/industry-map?query=${encodeURIComponent(career.query)}` as Route}>関連企業を探す</Link></p>)}<Link href="/career-compass">経験との接点を整理する</Link></div> : null}
          <Link className={styles.zoneLink} href={zone.guideHref as Route}>{zone.guideLabel} <span aria-hidden="true">→</span></Link>
        </section>)}
      </div>
      <p className={styles.note}>分類は主な役割による整理です。一社が複数の分野を担う場合があります。地図の基本分類更新：{industryMapMetadata.lastUpdated}。</p>
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
