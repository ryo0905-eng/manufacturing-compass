"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { Route } from "next";
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { FactoryProject } from "@/data/factory-projects";
import type { Source } from "@/types/content";
import type { CompanyLocation, EffectiveHiringSignal, LocationCompany, LocationSource } from "@/types/company-location";
import { trackLocationMapEvent } from "@/lib/analytics";
import {
  canMapLocation, defaultExplorerState, explorerSearchParams, filterExplorerRows, getLocationStatuses,
  jobFamilyOptions, locationRegions, locationTypeOptions, mappableLocations, readExplorerState, regionCounts, statusOptions,
  type LocationExplorerRow, type LocationExplorerState,
} from "@/lib/location-explorer";
import type { LocationMapPoint } from "./SemiconductorLocationMap";
import styles from "./SemiconductorLocationExplorer.module.css";

const LocationMap = dynamic(() => import("./SemiconductorLocationMap"), {
  ssr: false, loading: () => <div className={styles.mapPlaceholder} role="status">地図を読み込んでいます…</div>,
});
export type LocationAppProps = {
  companies: LocationCompany[]; locations: CompanyLocation[]; projects: FactoryProject[];
  sources: LocationSource[]; projectSources: Source[]; hiringSignals: EffectiveHiringSignal[];
  initialState: LocationExplorerState;
};
const statusLabel = (value: string) => statusOptions.find(item => item.value === value)?.label ?? value;

class MapBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <p role="status" className={styles.notice}>地図を読み込めませんでした。拠点一覧をご利用ください。</p> : this.props.children;
  }
}

function FilterGroup({ title, options, values, onChange }: {
  title: string; options: { value: string; label: string }[]; values: string[]; onChange: (values: string[]) => void;
}) {
  return <details className={styles.filterGroup} open><summary>{title}{values.length > 0 && <span>{values.length}</span>}</summary>
    <fieldset><legend className={styles.srOnly}>{title}</legend>{options.map(option => <label key={option.value}>
      <input type="checkbox" checked={values.includes(option.value)} onChange={() => onChange(values.includes(option.value)
        ? values.filter(value => value !== option.value) : [...values, option.value])} /><span>{option.label}</span>
    </label>)}</fieldset></details>;
}

export function SemiconductorLocationApp({ companies, locations, projects, sources, projectSources, hiringSignals, initialState }: LocationAppProps) {
  const [state, setState] = useState(initialState);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [shareNotice, setShareNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const trackedEntry = useRef(false);
  const data = useMemo(() => ({ locations, companies, projects }), [locations, companies, projects]);
  const companyById = useMemo(() => new Map(companies.map(company => [company.id, company])), [companies]);
  const rows = useMemo(() => filterExplorerRows(data, state, query), [data, state, query]);
  const pins = useMemo(() => mappableLocations(rows), [rows]);
  const counts = useMemo(() => regionCounts(rows), [rows]);
  const selected = rows.find(row => state.projectId ? row.project?.id === state.projectId : row.location.id === state.locationId);
  const selectedLocation = selected?.location;
  const mapPoints = useMemo<LocationMapPoint[]>(() => pins.map(location => {
    const matchingProjects = rows.filter(row => row.location.id === location.id).flatMap(row => row.project ? [row.project] : []);
    const statuses = matchingProjects.length ? matchingProjects.map(project => project.operationalStatus) : getLocationStatuses(location, projects);
    const primary = statuses.includes("under-construction") ? "construction" : statuses.includes("pilot") ? "pilot"
      : statuses.includes("planned") ? "planned" : statuses.includes("operating") ? "operating" : "unconfirmed";
    return { id: location.id, name: `${companyById.get(location.companyId)?.nameJa ?? ""} ${location.name}`,
      latitude: location.coordinates!.latitude, longitude: location.coordinates!.longitude,
      status: primary, label: [...new Set(statuses)].map(statusLabel).join("・") };
  }), [pins, rows, projects, companyById]);
  const prefectures = useMemo(() => [...new Map(locations.map(location => [location.prefectureCode, location.prefectureName])).entries()]
    .sort(([a], [b]) => a.localeCompare(b)).map(([value, label]) => ({ value, label })), [locations]);
  const activeCompanies = companies.filter(company => locations.some(location => location.companyId === company.id));

  function navigate(next: LocationExplorerState) {
    const available = filterExplorerRows(data, next, query);
    if (!available.some(row => next.projectId ? row.project?.id === next.projectId : row.location.id === next.locationId)) {
      next = { ...next, locationId: undefined, projectId: undefined };
    }
    const params = explorerSearchParams(next).toString();
    const url = `${window.location.pathname}${params ? `?${params}` : ""}`;
    if (url !== `${window.location.pathname}${window.location.search}`) window.history.pushState(null, "", url);
    setState(next); setShareNotice("");
  }
  useEffect(() => {
    const restore = () => { setState(readExplorerState(new URLSearchParams(window.location.search), data)); setQuery(""); };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [data]);
  useEffect(() => {
    if (initialState.projectId && !trackedEntry.current) {
      trackedEntry.current = true;
      trackLocationMapEvent("location_map_location_open", { company_id: locations.find(location => location.id === initialState.locationId)?.companyId ?? "",
        location_id: initialState.locationId ?? "", project_id: initialState.projectId, selection_source: "url" });
    }
  }, [initialState, locations]);
  useEffect(() => {
    const sheet = dialog.current, media = window.matchMedia("(max-width: 899px)");
    const sync = () => {
      if (selectedLocation && media.matches && sheet && !sheet.open) sheet.showModal();
      if ((!selectedLocation || !media.matches) && sheet?.open) sheet.close();
    };
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [selectedLocation]);
  function filter(next: Partial<LocationExplorerState>, kind: "company" | "status" | "location_type" | "job_family" | "region") {
    navigate({ ...state, ...next }); trackLocationMapEvent("location_map_filter_use", { filter_type: kind });
  }
  function selectRow(row: LocationExplorerRow, source: "pin" | "list") {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    navigate({ ...state, locationId: row.location.id, projectId: row.project?.id });
    trackLocationMapEvent("location_map_location_open", { company_id: row.location.companyId, location_id: row.location.id,
      project_id: row.project?.id, selection_source: source });
  }
  function closeDetails() {
    navigate({ ...state, locationId: undefined, projectId: undefined });
    if (dialog.current?.open) dialog.current.close();
    requestAnimationFrame(() => { if (returnFocus.current?.isConnected) returnFocus.current.focus(); else resultHeading.current?.focus(); });
  }
  function clear() {
    setQuery(""); navigate({ ...defaultExplorerState(), mode: state.mode, view: state.view, format: state.format });
    trackLocationMapEvent("location_map_filter_use", { filter_type: "clear" });
  }
  const chips: { label: string; remove: () => void }[] = [
    ...state.companyIds.map(value => ({ label: companyById.get(value)?.nameJa ?? value, remove: () => filter({ companyIds: state.companyIds.filter(item => item !== value) }, "company") })),
    ...state.prefectureCodes.map(value => ({ label: prefectures.find(item => item.value === value)?.label ?? value, remove: () => filter({ prefectureCodes: state.prefectureCodes.filter(item => item !== value) }, "region") })),
    ...state.types.map(value => ({ label: locationTypeOptions.find(item => item.value === value)?.label ?? value, remove: () => filter({ types: state.types.filter(item => item !== value) }, "location_type") })),
    ...state.statuses.map(value => ({ label: statusLabel(value), remove: () => filter({ statuses: state.statuses.filter(item => item !== value) }, "status") })),
    ...(state.job ? [{ label: jobFamilyOptions.find(item => item.value === state.job)?.label ?? state.job, remove: () => filter({ job: undefined }, "job_family") }] : []),
    ...(query ? [{ label: `検索：${query}`, remove: () => setQuery("") }] : []),
  ];
  function companyLink(location: CompanyLocation) {
    const company = companyById.get(location.companyId);
    if (!company) return null;
    return company.slug ? <Link href={`/companies/${company.slug}` as Route} onClick={() => trackLocationMapEvent("location_map_company_click", {
      company_id: company.id, location_id: location.id,
    })}>企業詳細を見る →</Link> : <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackLocationMapEvent("location_map_official_click", {
      company_id: company.id, location_id: location.id,
    })}>企業公式サイトを見る ↗</a>;
  }
  function sourceLinks(location: CompanyLocation, project?: FactoryProject) {
    const references = project ? project.sourceNumbers.map(number => projectSources[number - 1]).filter(Boolean)
      : location.sourceIds.map(id => sources.find(source => source.id === id)).filter((source): source is LocationSource => Boolean(source));
    return <ul className={styles.sources}>{references.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul>;
  }
  const details = selected && selectedLocation ? <>
    <p className={styles.eyebrow}>{companyById.get(selectedLocation.companyId)?.nameJa}</p>
    <h3>{selected.project?.name ?? selectedLocation.name}</h3>
    <p>{selectedLocation.address ?? `${selectedLocation.prefectureName}${selectedLocation.municipality}`}</p>
    <div className={styles.badges}>{(selected.project ? [selected.project.operationalStatus] : getLocationStatuses(selectedLocation, projects))
      .map(status => <span key={status}>{statusLabel(status)}</span>)}</div>
    <p>{selectedLocation.mainProducts.join("・") || "拠点固有の製品・技術は未確認です。"}</p>
    {!canMapLocation(selectedLocation) && <p className={styles.notice}>施設座標は確認中です。地図には仮位置を表示していません。</p>}
    {selectedLocation.facilities && <section><h4>同じ敷地の施設</h4><ul>{selectedLocation.facilities.map(facility =>
      <li key={facility.id}>{facility.name}：{statusLabel(facility.operationalStatus)}</li>)}</ul></section>}
    <section className={styles.timeline}><h4>確認できた節目と予定</h4>
      {(selected.project ? [selected.project] : projects.filter(project => project.locationId === selectedLocation.id)).map(project =>
        <section key={project.id}><h5>{project.name}</h5><ol>{project.milestones.map((milestone, index) => <li key={index} data-outcome={milestone.outcome}>
          <span>{milestone.outcome === "planned" ? "予定" : "実績"}</span><time>{milestone.dateLabel}</time><p>{milestone.label}
            {milestone.sourceNumbers.map(number => <a key={number} href={projectSources[number - 1]?.url} target="_blank" rel="noopener noreferrer">［{number}］</a>)}</p>
        </li>)}</ol><p>{project.note}</p><small>案件資料確認日：{project.checkedAt}</small></section>)}
      {!(selected.project || projects.some(project => project.locationId === selectedLocation.id)) && <p>掲載できる新設・増設の節目情報はありません。</p>}
      {[...(selectedLocation.statusEvents ?? []), ...(selectedLocation.facilities ?? []).flatMap(facility => facility.statusEvents ?? [])].map((event, index) =>
        <p key={index}>{event.effectiveAt ?? event.expectedTimingText ?? event.announcedAt}：{event.note}
          <a href={sources.find(source => source.id === event.sourceId)?.url} target="_blank" rel="noopener noreferrer"> 出典</a></p>)}
    </section><p>拠点情報確認日：{selectedLocation.lastVerifiedAt}</p>
    {selectedLocation.coordinates && <details><summary>位置情報の確認根拠</summary><p>{selectedLocation.coordinates.verificationNote}</p>
      <p>座標確認日：{selectedLocation.coordinates.verifiedAt}（{selectedLocation.coordinates.reviewStatus === "human-reviewed" ? "人による確認" : "エージェント照合"}）</p>
      <a href={selectedLocation.coordinates.evidenceUrl ?? sources.find(source => source.id === selectedLocation.coordinates?.sourceId)?.url} target="_blank" rel="noopener noreferrer">位置情報の出典</a></details>}
    <details><summary>情報源と確認日</summary>{sourceLinks(selectedLocation, selected.project)}</details>
    <div className={styles.detailLinks}>{companyLink(selectedLocation)}
      {hiringSignals.filter(signal => signal.locationId === selectedLocation.id).map(signal => <a key={signal.id} href={signal.careerUrl} target="_blank" rel="noopener noreferrer"
        onClick={() => trackLocationMapEvent("location_map_official_career_click", { company_id: selectedLocation.companyId, location_id: selectedLocation.id, hiring_status: signal.status })}>
        {signal.status === "review-expired" ? "採用情報を再確認中：公式ページへ" : signal.status === "official-opening-confirmed" ? "公式求人を確認" : "公式採用ページで確認"}（{signal.checkedAt}確認）↗</a>)}</div>
  </> : null;

  return <section className={styles.app} aria-labelledby="location-directory-title">
    <header className={styles.appHeader}><div><p className={styles.eyebrow}>JAPAN SEMICONDUCTOR EXPLORER</p><h2 id="location-directory-title">日本地図から拠点と計画を探す</h2></div>
      <dl className={styles.metrics}><div><dt>掲載拠点</dt><dd>{locations.length}<small>拠点</small></dd></div>
        <div><dt>新設・増設</dt><dd>{projects.length}<small>案件</small></dd></div>
        <div><dt>地図表示可能</dt><dd>{locations.filter(canMapLocation).length}<small>拠点</small></dd></div></dl></header>
    <div className={styles.toolbar}>
      <div className={styles.segment} aria-label="探索対象">{([['locations', '拠点を探す'], ['projects', '新設・増設を探す']] as const).map(([mode, label]) =>
        <button key={mode} type="button" aria-pressed={state.mode === mode} onClick={() => {
          navigate({ ...state, mode, locationId: undefined, projectId: undefined }); trackLocationMapEvent("location_map_mode_change", { mode });
        }}>{label}</button>)}</div>
      <button type="button" className={styles.filterToggle} aria-expanded={filtersOpen} aria-controls="location-filters" onClick={() => setFiltersOpen(!filtersOpen)}>絞り込み{chips.length ? `（${chips.length}）` : ""}</button>
      <button type="button" aria-pressed={state.view === "map"} onClick={() => {
        const view = state.view === "map" ? "list" : "map"; navigate({ ...state, view }); trackLocationMapEvent("location_map_view_change", { view });
      }}>{state.view === "map" ? "地図を閉じる" : "地図を表示"}</button>
      <button type="button" onClick={async () => {
        const params = explorerSearchParams(state).toString();
        const shareUrl = `${window.location.origin}${window.location.pathname}${params ? `?${params}` : ""}`;
        try { await navigator.clipboard.writeText(shareUrl); setShareNotice("表示条件のURLをコピーしました。検索語は含みません。"); }
        catch { setShareNotice("アドレス欄のURLをコピーして共有できます。検索語は含みません。"); }
      }}>共有</button></div>
    {shareNotice && <p role="status" className={styles.notice}>{shareNotice}</p>}
    <div className={styles.chips} aria-label="適用中の条件">{chips.map((chip, index) => <button key={`${chip.label}-${index}`} type="button" onClick={chip.remove} aria-label={`${chip.label}の条件を解除`}>{chip.label} ×</button>)}
      {chips.length > 0 && <button type="button" onClick={clear}>すべて解除</button>}</div>
    <div className={styles.workspace} data-view={state.view}>
      <aside id="location-filters" className={styles.filters} data-open={filtersOpen} aria-label="絞り込み検索">
        <div className={styles.filterHeading}><strong>絞り込み検索</strong><button type="button" onClick={clear}>条件をクリア</button></div>
        <label className={styles.search}><span>企業名・拠点名・技術</span><input type="search" value={query} onChange={event => {
          setQuery(event.target.value);
          if (state.locationId) navigate({ ...state, locationId: undefined, projectId: undefined });
        }}
          onBlur={() => { if (query.trim()) trackLocationMapEvent("location_map_filter_use", { filter_type: "keyword", result_count: rows.length }); }} placeholder="会社名・地域・製品など" /></label>
        <FilterGroup title="会社" values={state.companyIds} options={activeCompanies.map(company => ({ value: company.id, label: company.nameJa }))} onChange={companyIds => filter({ companyIds }, "company")} />
        <FilterGroup title="都道府県" values={state.prefectureCodes} options={prefectures} onChange={prefectureCodes => filter({ prefectureCodes }, "region")} />
        <FilterGroup title="状態" values={state.statuses} options={statusOptions} onChange={statuses => filter({ statuses: statuses as LocationExplorerState['statuses'] }, "status")} />
        <FilterGroup title="拠点の種類" values={state.types} options={locationTypeOptions} onChange={types => filter({ types: types as LocationExplorerState['types'] }, "location_type")} />
        <label className={styles.search}><span>関連する職種</span><select value={state.job ?? ""} onChange={event => filter({ job: (event.target.value || undefined) as LocationExplorerState['job'] }, "job_family")}>
          <option value="">すべての職種</option>{jobFamilyOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label></aside>
      <div className={styles.center}>
        {state.view === "map" && <MapBoundary><LocationMap points={mapPoints} selectedId={selected?.location.id} onSelect={id => {
          const row = rows.find(item => item.location.id === id); if (row) selectRow(row, "pin");
        }} /></MapBoundary>}
        <section className={styles.regionChart} aria-label="地域別の掲載件数"><h3>地域別の掲載{state.mode === "projects" ? "案件" : "拠点"}数</h3>
          <div>{counts.map(region => <button type="button" key={region.id} disabled={!region.count} onClick={() => {
            const all = locationRegions.find(item => item.id === region.id)!;
            filter({ prefectureCodes: all.codes.filter(code => locations.some(location => location.prefectureCode === code)) }, "region");
          }}><span>{region.label}</span><span className={styles.barTrack}><i style={{ width: `${region.count / Math.max(1, ...counts.map(item => item.count)) * 100}%` }} /></span><strong>{region.count}</strong></button>)}</div>
          <p>現在の条件に一致する掲載データの件数です。</p></section>
        <p className={styles.mapNote}>検索結果：{rows.length}{state.mode === "projects" ? "案件" : "拠点"} ／ 地図：{pins.length}物理拠点。座標未確認の拠点も一覧に含みます。</p></div>
      <div className={styles.results}>
        <header className={styles.resultHeader}><h3 ref={resultHeading} tabIndex={-1}>{state.mode === "projects" ? "新設・増設の案件" : "拠点一覧"}</h3>
          <p aria-live="polite"><strong>{rows.length}</strong>{state.mode === "projects" ? "案件" : "拠点"}</p>
          <div className={styles.segment} aria-label="結果の表示形式">{([['cards', '一覧'], ['table', '表']] as const).map(([format, label]) => <button type="button" key={format} aria-pressed={state.format === format} onClick={() => {
            navigate({ ...state, format }); trackLocationMapEvent("location_map_view_change", { view: format });
          }}>{label}</button>)}</div></header>
        {rows.length === 0 && <div className={styles.empty}><h4>条件に一致する拠点はありません</h4><p>検索語や絞り込み条件を変更してみてください。</p><button type="button" onClick={clear}>すべての条件を解除</button></div>}
        {state.format === "cards" ? <div className={styles.cards}>{rows.map(row => <article key={row.id} id={row.id} className={styles.card} data-selected={selected?.id === row.id}>
          <p className={styles.eyebrow}>{companyById.get(row.location.companyId)?.nameJa}</p>
          <h4><button type="button" aria-pressed={selected?.id === row.id} onClick={() => selectRow(row, "list")}>{row.project?.name ?? row.location.name}<span aria-hidden="true"> →</span></button></h4>
          <p>{row.location.prefectureName} {row.location.municipality}</p>
          <div className={styles.badges}>{(row.project ? [row.project.operationalStatus] : getLocationStatuses(row.location, projects)).map(status => <span key={status}>{statusLabel(status)}</span>)}</div>
          <p>{row.project?.summary ?? (row.location.mainProducts.join("・") || "拠点固有の製品・技術は未確認")}</p>
          <details><summary>拠点情報・出典</summary><p>{row.location.address}</p>
            <p>{row.location.locationTypes.map(type => locationTypeOptions.find(item => item.value === type)?.label).join("・")}</p>
            <p>関連職種：{row.location.jobFamilies.map(job => jobFamilyOptions.find(item => item.value === job)?.label).join("・") || "拠点固有の対応は未確認"}</p>
            <p>拠点情報確認日：{row.location.lastVerifiedAt}</p>{sourceLinks(row.location, row.project)}{companyLink(row.location)}</details></article>)}</div>
          : <div className={styles.tableScroll} role="region" aria-label="拠点比較表" tabIndex={0}><table><caption>{state.mode === "projects" ? "新設・増設案件の比較" : "掲載拠点の比較"}</caption>
            <thead><tr><th scope="col">企業・拠点</th><th scope="col">所在地</th><th scope="col">状態・進捗</th><th scope="col">情報確認日・出典</th></tr></thead>
            <tbody>{rows.map(row => <tr key={row.id} id={row.id} data-selected={selected?.id === row.id}><th scope="row"><span>{companyById.get(row.location.companyId)?.nameJa}</span><button type="button" onClick={() => selectRow(row, "list")}>{row.project?.name ?? row.location.name}</button>{companyLink(row.location)}</th>
              <td>{row.location.address ?? `${row.location.prefectureName}${row.location.municipality}`}</td><td>{row.project?.summary ?? getLocationStatuses(row.location, projects).map(statusLabel).join("・")}</td>
              <td>{row.project?.checkedAt ?? row.location.lastVerifiedAt}<details><summary>出典</summary>{sourceLinks(row.location, row.project)}</details></td></tr>)}</tbody></table></div>}
        {selected && <section className={styles.desktopDetail} aria-label="選択した拠点の詳細"><button type="button" className={styles.closeDetail} onClick={closeDetails}>詳細を閉じる ×</button>{details}</section>}</div>
    </div>
    <dialog ref={dialog} className={styles.sheet} aria-label="選択した拠点の詳細" onCancel={event => { event.preventDefault(); closeDetails(); }}>
      <button type="button" className={styles.closeDetail} onClick={closeDetails} autoFocus>詳細を閉じる ×</button>{details}</dialog>
    <noscript><p>地図の表示と絞り込みにはJavaScriptを使用します。掲載拠点と出典は、このページの一覧から確認できます。</p></noscript>
  </section>;
}
