"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  industryMapCareers,
  industryMapMetadata,
  industryMapSupplementalCompanies,
  industryMapZoneRelations,
  industryMapZones,
  type IndustryMapSupplementalCompany,
  type IndustryMapZone,
} from "@/data/industry-map";
import { trackEvent } from "@/lib/analytics";

type CompanySummary = {
  id: string;
  slug: string;
  name: string;
  nameJa: string;
  summary: string;
  headquartersCountry: string;
  businessModel: string;
  mainProducts: string[];
  jobCategories: string[];
  hasPublicLocations: boolean;
  hasCareerPreparation: boolean;
  lastUpdated: string;
};

type AtlasCompany = {
  id: string;
  name: string;
  nameJa: string;
  summary: string;
  headquartersCountry: string;
  businessModel: string;
  mainProducts: string[];
  jobCategories: string[];
  hasPublicLocations: boolean;
  hasCareerPreparation: boolean;
  slug?: string;
  websiteUrl?: string;
  source?: IndustryMapSupplementalCompany["source"];
  sourceKind: "company-page" | "map-profile";
};

type IndustryAtlasProps = {
  companies: CompanySummary[];
  totalCompanyCount: number;
};

const UI_VERSION = "editorial-map-v1";

function trackIndustryMapEvent(eventName: `industry_map_${string}`, properties: Parameters<typeof trackEvent>[1]) {
  trackEvent(eventName, { ...properties, source_page: "/industry-map", ui_version: UI_VERSION });
}

function normalized(value: string) {
  return value.toLocaleLowerCase("ja").normalize("NFKC");
}

function matchesQuery(company: AtlasCompany, query: string) {
  if (!query) return true;
  return [company.name, company.nameJa, company.businessModel, company.headquartersCountry, ...company.mainProducts, ...company.jobCategories]
    .some((value) => normalized(value).includes(query));
}

export function IndustryAtlas({ companies, totalCompanyCount }: IndustryAtlasProps) {
  const companiesById = useMemo(() => new Map(companies.map((company) => [company.id, company])), [companies]);
  const supplementalById = useMemo(
    () => new Map(industryMapSupplementalCompanies.map((company) => [company.id, company])),
    [],
  );
  const [query, setQuery] = useState("");
  const [japaneseOnly, setJapaneseOnly] = useState(false);
  const [locationsOnly, setLocationsOnly] = useState(false);
  const [showCareers, setShowCareers] = useState(false);
  const [selected, setSelected] = useState<AtlasCompany | null>(null);
  const originRef = useRef<HTMLButtonElement | null>(null);

  const companyForId = (id: string): AtlasCompany | undefined => {
    const company = companiesById.get(id);
    if (company) return { ...company, sourceKind: "company-page" };
    const supplemental = supplementalById.get(id);
    if (!supplemental) return undefined;
    return {
      ...supplemental,
      hasPublicLocations: false,
      hasCareerPreparation: false,
      sourceKind: "map-profile",
      source: supplemental.source,
    };
  };

  const mapCompanies = industryMapZones.flatMap((zone) => [...zone.companyIds, ...zone.supplementalCompanyIds])
    .map(companyForId)
    .filter((company): company is AtlasCompany => company !== undefined);
  const normalizedQuery = normalized(query.trim());
  const isFiltering = Boolean(normalizedQuery || japaneseOnly || locationsOnly);
  const isVisible = (company: AtlasCompany) => matchesQuery(company, normalizedQuery)
    && (!japaneseOnly || company.headquartersCountry === "日本")
    && (!locationsOnly || company.hasPublicLocations);
  const resultCount = mapCompanies.filter(isVisible).length;

  const fallbackCompanies = normalizedQuery && resultCount === 0
    ? companies
      .filter((company) => matchesQuery({ ...company, sourceKind: "company-page" }, normalizedQuery))
      .slice(0, 3)
    : [];

  function openCompany(company: AtlasCompany, trigger: HTMLButtonElement) {
    originRef.current = trigger;
    setSelected(company);
    trackIndustryMapEvent("industry_map_node_open", {
      node_type: "company",
      node_id: company.id,
      mode: "editorial",
      view: "atlas",
      entry_point: "company_card",
    });
    trackIndustryMapEvent("industry_map_detail_view", {
      node_type: "company",
      node_id: company.id,
      mode: "editorial",
      view: "atlas",
      entry_point: "company_card",
    });
  }

  function closeDetail() {
    setSelected(null);
    requestAnimationFrame(() => {
      if (originRef.current?.isConnected && !originRef.current.hidden) originRef.current.focus({ preventScroll: true });
    });
  }

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDetail();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  function toggleFilter(filter: "japanese" | "locations", nextValue: boolean) {
    if (filter === "japanese") setJapaneseOnly(nextValue);
    else setLocationsOnly(nextValue);
    setSelected(null);
    trackIndustryMapEvent("industry_map_filter_use", {
      filter_type: filter === "japanese" ? "japanese_company" : "public_locations",
      enabled: nextValue,
    });
  }

  function clearFilters() {
    setQuery("");
    setJapaneseOnly(false);
    setLocationsOnly(false);
    setSelected(null);
  }

  return (
    <section className={`industry-atlas${isFiltering ? " is-filtering" : ""}`} aria-labelledby="industry-atlas-title">
      <header className="industry-atlas__header">
        <div>
          <p className="section-label">SEMICONDUCTOR INDUSTRY ATLAS</p>
          <h2 id="industry-atlas-title">企業を眺めながら、半導体業界の分業をつかむ</h2>
          <p>設計、製造、後工程と、それらを支える材料・装置・検査を8つの領域に整理しました。企業名から詳しい情報へ進めます。</p>
        </div>
        <dl aria-label="地図の収録内容">
          <div><dt>領域</dt><dd>{industryMapZones.length}</dd></div>
          <div><dt>代表企業</dt><dd>{mapCompanies.length}</dd></div>
          <div><dt>企業記事</dt><dd>{totalCompanyCount}</dd></div>
        </dl>
      </header>

      <div className="industry-atlas__reading-guide" aria-label="この地図の読み方">
        <article><span>01</span><strong>設計と製造は分業</strong><p>EDA・IP、ファブレス、ファウンドリ、OSATが役割を分けます。</p></article>
        <article><span>02</span><strong>材料と装置が横断支援</strong><p>材料・製造装置・検査装置は複数の製造工程に関わります。</p></article>
        <article><span>03</span><strong>製品分野はタグで確認</strong><p>メモリ、アナログ、パワーなどは企業カードの製品タグで示します。</p></article>
      </div>

      <nav className="industry-atlas__category-nav" aria-label="業界地図の領域">
        {industryMapZones.map((zone) => (
          <a
            href={`#industry-zone-${zone.id}`}
            key={zone.id}
            onClick={() => trackIndustryMapEvent("industry_map_category_click", { category: zone.id, destination: "map_zone" })}
          >{zone.label}</a>
        ))}
      </nav>

      <div className="industry-atlas__toolbar">
        <label className="industry-atlas__search">
          <span className="sr-only">企業名・製品・職種で検索</span>
          <span aria-hidden="true">⌕</span>
          <input
            onBlur={() => {
              if (normalizedQuery) trackIndustryMapEvent("industry_map_search_result", { result_count: resultCount });
            }}
            onChange={(event) => { setQuery(event.target.value); setSelected(null); }}
            placeholder="企業名・製品・職種で検索"
            type="search"
            value={query}
          />
        </label>
        <label><input checked={japaneseOnly} onChange={(event) => toggleFilter("japanese", event.target.checked)} type="checkbox" />日本企業</label>
        <label><input checked={locationsOnly} onChange={(event) => toggleFilter("locations", event.target.checked)} type="checkbox" />国内拠点情報あり</label>
        <button aria-pressed={showCareers} onClick={() => {
          setShowCareers((value) => !value);
          trackIndustryMapEvent("industry_map_career_layer_change", { enabled: !showCareers });
        }} type="button">職種との接点</button>
        <output aria-live="polite">{isFiltering ? `${resultCount}社` : `代表${mapCompanies.length}社`}</output>
        {isFiltering ? <button className="industry-atlas__clear" onClick={clearFilters} type="button">条件をクリア</button> : null}
      </div>

      {resultCount === 0 ? (
        <div className="industry-atlas__empty">
          <strong>地図の代表企業には一致しませんでした</strong>
          <p>検索語を短くするか、条件を解除してください。</p>
          {fallbackCompanies.length > 0 ? (
            <ul>{fallbackCompanies.map((company) => <li key={company.id}><Link href={`/companies/${company.slug}` as Route}>{company.nameJa}の企業情報を見る</Link></li>)}</ul>
          ) : null}
          <Link href="/companies">掲載企業の一覧から探す</Link>
        </div>
      ) : null}

      <div className="industry-atlas__flow" aria-label="半導体産業の一般的な役割の流れ">
        {industryMapZoneRelations.slice(0, 3).map((relation) => {
          const from = industryMapZones.find((zone) => zone.id === relation.from);
          const to = industryMapZones.find((zone) => zone.id === relation.to);
          return <div key={`${relation.from}-${relation.to}`}><strong>{from?.label}</strong><span>{relation.label}<i aria-hidden="true">→</i></span><strong>{to?.label}</strong></div>;
        })}
        <p>材料・製造装置・検査装置は、製造工程を横断して支えます。線は一般的な役割の接点で、個別企業の取引関係を示すものではありません。</p>
      </div>

      <div className="industry-atlas__zones">
        {industryMapZones.map((zone) => (
          <Zone
            companyForId={companyForId}
            isVisible={isVisible}
            key={zone.id}
            onOpen={openCompany}
            showCareers={showCareers}
            zone={zone}
          />
        ))}
      </div>

      <footer className="industry-atlas__footer">
        <p>分類は各社の主な役割を理解するための整理です。複数領域を担う企業もあります。最終更新：{industryMapMetadata.lastUpdated}</p>
        <div><Link href="/semiconductor-map">日本の半導体企業・工場マップ</Link><Link href="/guides/semiconductor-market-cap-ranking">時価総額ランキング</Link><Link href="/guides/semiconductor-salary-ranking">年収ランキング</Link></div>
      </footer>

      {selected ? <><button aria-label="企業詳細を閉じる" className="industry-atlas__backdrop" onClick={closeDetail} type="button" /><CompanyDetail company={selected} onClose={closeDetail} /></> : null}
    </section>
  );
}

function Zone({ companyForId, isVisible, onOpen, showCareers, zone }: {
  companyForId: (id: string) => AtlasCompany | undefined;
  isVisible: (company: AtlasCompany) => boolean;
  onOpen: (company: AtlasCompany, trigger: HTMLButtonElement) => void;
  showCareers: boolean;
  zone: IndustryMapZone;
}) {
  const zoneCompanies = [...zone.companyIds, ...zone.supplementalCompanyIds]
    .map(companyForId)
    .filter((company): company is AtlasCompany => company !== undefined);
  const careers = zone.careerIds.map((id) => industryMapCareers.find((career) => career.id === id)).filter((career) => career !== undefined).slice(0, 2);
  return (
    <section className={`industry-atlas__zone industry-atlas__zone--${zone.id}`} id={`industry-zone-${zone.id}`}>
      <header><p>{zone.labelEn}</p><h3>{zone.label}</h3><span>{zoneCompanies.length}社</span><small>{zone.description}</small></header>
      <div className="industry-atlas__zone-tags">{zone.productTags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="industry-atlas__companies">
        {zoneCompanies.map((company) => (
          <article className={`industry-atlas__company${isVisible(company) ? "" : " is-muted"}`} key={company.id}>
            <header>
              <div>
                {company.slug ? <Link href={`/companies/${company.slug}` as Route} onClick={() => trackIndustryMapEvent("industry_map_content_click", { company_id: company.id, destination: "company", link_location: "company_card" })}>{company.nameJa}</Link> : <strong>{company.nameJa}</strong>}
                <small>{company.name}</small>
              </div>
              <span>{company.headquartersCountry}</span>
            </header>
            <p>{company.summary}</p>
            <ul>{company.mainProducts.slice(0, 2).map((product) => <li key={product}>{product}</li>)}</ul>
            {company.hasPublicLocations ? <em>国内拠点情報あり</em> : null}
            <button onClick={(event) => onOpen(company, event.currentTarget)} type="button">地図内で詳しく見る <span aria-hidden="true">→</span></button>
          </article>
        ))}
      </div>
      {showCareers ? (
        <div className="industry-atlas__careers">
          <strong>この領域と接点のある職種</strong>
          {careers.map((career) => <article key={career.id}><div><b>{career.label}</b><p>{career.description}</p></div><Link href={`/companies?query=${encodeURIComponent(career.query)}` as Route}>関連企業</Link></article>)}
          <Link href="/career-compass">経験との接点を整理する</Link>
        </div>
      ) : null}
      <Link className="industry-atlas__zone-link" href={zone.guideHref as Route}>{zone.guideLabel} <span aria-hidden="true">→</span></Link>
    </section>
  );
}

function DetailShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { ref.current?.focus({ preventScroll: true }); }, []);
  return <aside aria-label="選択した企業の詳細" className="industry-explorer__detail industry-atlas__detail" ref={ref} tabIndex={-1}><button className="industry-explorer__detail-close" onClick={onClose} type="button"><span aria-hidden="true">×</span> 閉じる</button>{children}</aside>;
}

function CompanyDetail({ company, onClose }: { company: AtlasCompany; onClose: () => void }) {
  const trackClick = (destination: string) => trackIndustryMapEvent("industry_map_content_click", { company_id: company.id, destination, link_location: "detail_panel", node_type: "company", node_id: company.id });
  return (
    <DetailShell onClose={onClose}>
      <p className="section-label">{company.name} / Company</p>
      <h3>{company.nameJa}</h3>
      <strong className="industry-explorer__detail-subtitle">{company.businessModel}・{company.headquartersCountry}</strong>
      <p>{company.summary}</p>
      <div className="industry-explorer__detail-list"><span>主な製品・領域</span>{company.mainProducts.slice(0, 3).map((product) => <small key={product}>{product}</small>)}</div>
      <div className="industry-explorer__detail-actions">
        {company.slug ? <Link className="industry-explorer__detail-link" href={`/companies/${company.slug}` as Route} onClick={() => trackClick("company")}>企業情報を詳しく見る <span aria-hidden="true">→</span></Link> : <a className="industry-explorer__detail-link" href={company.websiteUrl} onClick={() => trackClick("official_source")} rel="noreferrer" target="_blank">公式情報を見る <span aria-hidden="true">↗</span></a>}
        {company.slug && company.hasPublicLocations ? <Link className="industry-explorer__detail-secondary" href={`/companies/${company.slug}#japan-locations` as Route} onClick={() => trackClick("company_locations")}>国内拠点を確認する</Link> : null}
        {company.slug && company.hasCareerPreparation ? <Link className="industry-explorer__detail-secondary" href={`/companies/${company.slug}#career-prep` as Route} onClick={() => trackClick("career_preparation")}>キャリア準備を見る</Link> : null}
      </div>
      {company.source ? <p className="industry-atlas__source">地図内の簡易紹介です。出典：<a href={company.source.url} rel="noreferrer" target="_blank">{company.source.publisher}</a>（確認日 {company.source.accessedAt}）</p> : null}
    </DetailShell>
  );
}
