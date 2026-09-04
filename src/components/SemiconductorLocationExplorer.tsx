"use client";

import { useEffect, useMemo, useState } from "react";
import { SemiconductorLocationCard } from "@/components/SemiconductorLocationCard";
import styles from "@/components/semiconductor-location-map.module.css";
import type {
  CompanyLocation,
  EffectiveHiringSignal,
  JobFamily,
  LocationSource,
  LocationType,
} from "@/types/company-location";

type CompanySummary = {
  id: string;
  name: string;
  nameJa: string;
  slug: string;
};

export type LocationExplorerInitialFilters = {
  prefectureCode?: string;
  locationType?: LocationType;
  jobFamily?: JobFamily;
};

type SemiconductorLocationExplorerProps = {
  companies: CompanySummary[];
  hiringSignals: EffectiveHiringSignal[];
  initialFilters?: LocationExplorerInitialFilters;
  locations: CompanyLocation[];
  sources: LocationSource[];
};

const locationTypeOptions: Array<{ value: LocationType; label: string }> = [
  { value: "factory", label: "工場" },
  { value: "research-development", label: "研究開発" },
  { value: "design-center", label: "設計・開発" },
  { value: "headquarters", label: "本社" },
  { value: "office", label: "オフィス" },
  { value: "field-service", label: "フィールドサービス" },
  { value: "logistics", label: "物流・施設" },
];

const jobFamilyOptions: Array<{ value: JobFamily; label: string }> = [
  { value: "process-production", label: "生産・プロセス" },
  { value: "equipment-facility", label: "設備・施設" },
  { value: "quality-reliability", label: "品質・信頼性" },
  { value: "equipment-development", label: "装置開発" },
  { value: "circuit-software-design", label: "設計・ソフトウェア" },
  { value: "field-application-service", label: "FAE・フィールドサービス" },
  { value: "supply-chain-corporate", label: "サプライチェーン・管理" },
];

const locationTypeValues = new Set<LocationType>(locationTypeOptions.map((option) => option.value));
const jobFamilyValues = new Set<JobFamily>(jobFamilyOptions.map((option) => option.value));

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("ja-JP").trim();
}

function readFiltersFromUrl(validPrefectures: Set<string>): LocationExplorerInitialFilters {
  const params = new URLSearchParams(window.location.search);
  const prefectureCode = params.get("prefecture") ?? undefined;
  const locationType = params.get("type") as LocationType | null;
  const jobFamily = params.get("job") as JobFamily | null;

  return {
    prefectureCode: prefectureCode && validPrefectures.has(prefectureCode) ? prefectureCode : undefined,
    locationType: locationType && locationTypeValues.has(locationType) ? locationType : undefined,
    jobFamily: jobFamily && jobFamilyValues.has(jobFamily) ? jobFamily : undefined,
  };
}

export function SemiconductorLocationExplorer({
  companies,
  hiringSignals,
  initialFilters = {},
  locations,
  sources,
}: SemiconductorLocationExplorerProps) {
  const [query, setQuery] = useState("");
  const [prefectureCode, setPrefectureCode] = useState(initialFilters.prefectureCode ?? "all");
  const [locationType, setLocationType] = useState<LocationType | "all">(initialFilters.locationType ?? "all");
  const [jobFamily, setJobFamily] = useState<JobFamily | "all">(initialFilters.jobFamily ?? "all");

  const companyById = useMemo(() => new Map(companies.map((company) => [company.id, company])), [companies]);
  const sourceById = useMemo(() => new Map(sources.map((source) => [source.id, source])), [sources]);
  const hiringByLocationId = useMemo(
    () => new Map(hiringSignals.filter((signal) => signal.locationId).map((signal) => [signal.locationId, signal])),
    [hiringSignals],
  );
  const prefectures = useMemo(() => {
    const byCode = new Map<string, string>();
    for (const location of locations) byCode.set(location.prefectureCode, location.prefectureName);
    return [...byCode.entries()].sort(([codeA], [codeB]) => codeA.localeCompare(codeB));
  }, [locations]);
  const validPrefectures = useMemo(() => new Set(prefectures.map(([code]) => code)), [prefectures]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (prefectureCode !== "all") params.set("prefecture", prefectureCode);
    if (locationType !== "all") params.set("type", locationType);
    if (jobFamily !== "all") params.set("job", jobFamily);
    const nextUrl = `${window.location.pathname}${params.size > 0 ? `?${params.toString()}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);
  }, [jobFamily, locationType, prefectureCode]);

  useEffect(() => {
    const handlePopState = () => {
      const filters = readFiltersFromUrl(validPrefectures);
      setPrefectureCode(filters.prefectureCode ?? "all");
      setLocationType(filters.locationType ?? "all");
      setJobFamily(filters.jobFamily ?? "all");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [validPrefectures]);

  const filteredLocations = useMemo(() => {
    const normalizedQuery = normalize(query);
    return locations.filter((location) => {
      const company = companyById.get(location.companyId);
      const matchesQuery = !normalizedQuery || normalize([
        company?.name,
        company?.nameJa,
        location.name,
        location.prefectureName,
        location.municipality,
        location.address,
        ...location.mainProducts,
      ].filter(Boolean).join(" ")).includes(normalizedQuery);
      return matchesQuery
        && (prefectureCode === "all" || location.prefectureCode === prefectureCode)
        && (locationType === "all" || location.locationTypes.includes(locationType))
        && (jobFamily === "all" || location.jobFamilies.includes(jobFamily));
    });
  }, [companyById, jobFamily, locationType, locations, prefectureCode, query]);

  const prefectureGroups = useMemo(() => filteredLocations.reduce((groups, location) => {
    const group = groups.get(location.prefectureCode) ?? [];
    group.push(location);
    groups.set(location.prefectureCode, group);
    return groups;
  }, new Map<string, CompanyLocation[]>()), [filteredLocations]);

  const selectedLocationTypeLabel = locationTypeOptions.find((option) => option.value === locationType)?.label;
  const selectedJobFamilyLabel = jobFamilyOptions.find((option) => option.value === jobFamily)?.label;
  const selectedPrefectureLabel = prefectures.find(([code]) => code === prefectureCode)?.[1];
  const hasFilters = Boolean(query.trim()) || prefectureCode !== "all" || locationType !== "all" || jobFamily !== "all";

  function clearAll() {
    setQuery("");
    setPrefectureCode("all");
    setLocationType("all");
    setJobFamily("all");
  }

  return (
    <section className={styles.directory} aria-labelledby="location-directory-title">
      <header className={styles.directoryHeader}>
        <p className="section-label">全国の確認済み拠点</p>
        <h2 id="location-directory-title">都道府県別の半導体関連拠点一覧</h2>
        <p>企業名、拠点名、技術から検索し、勤務地・拠点種別・職種で絞り込めます。</p>
      </header>

      <div className={styles.explorerControls}>
        <label className={styles.searchField}>
          <span>企業名・拠点名・技術</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例：熊本、製造装置、SiC"
            type="search"
            value={query}
          />
        </label>
        <div className={styles.filterGrid}>
          <label>
            <span>都道府県</span>
            <select onChange={(event) => setPrefectureCode(event.target.value)} value={prefectureCode}>
              <option value="all">すべて</option>
              {prefectures.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
            </select>
          </label>
          <label>
            <span>拠点種別</span>
            <select onChange={(event) => setLocationType(event.target.value as LocationType | "all")} value={locationType}>
              <option value="all">すべて</option>
              {locationTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label>
            <span>職種</span>
            <select onChange={(event) => setJobFamily(event.target.value as JobFamily | "all")} value={jobFamily}>
              <option value="all">すべて</option>
              {jobFamilyOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className={styles.resultsBar}>
        <p aria-live="polite"><strong>{filteredLocations.length}</strong>拠点</p>
        <div className={styles.activeFilters} aria-label="適用中の条件">
          {query.trim() ? <button onClick={() => setQuery("")} type="button">検索語 ×</button> : null}
          {selectedPrefectureLabel ? <button onClick={() => setPrefectureCode("all")} type="button">{selectedPrefectureLabel} ×</button> : null}
          {selectedLocationTypeLabel ? <button onClick={() => setLocationType("all")} type="button">{selectedLocationTypeLabel} ×</button> : null}
          {selectedJobFamilyLabel ? <button onClick={() => setJobFamily("all")} type="button">{selectedJobFamilyLabel} ×</button> : null}
        </div>
        {hasFilters ? <button className={styles.clearButton} onClick={clearAll} type="button">すべて解除</button> : null}
      </div>

      {filteredLocations.length > 0 ? (
        <>
          <nav className={styles.prefectureNav} aria-label="検索結果の都道府県">
            {[...prefectureGroups.values()].map((group) => {
              const prefecture = group[0];
              return (
                <button onClick={() => setPrefectureCode(prefecture.prefectureCode)} key={prefecture.prefectureCode} type="button">
                  {prefecture.prefectureName}<span>{group.length}</span>
                </button>
              );
            })}
          </nav>

          {[...prefectureGroups.entries()].map(([code, group]) => {
            const prefecture = group[0];
            return (
              <section className={styles.prefectureSection} id={`prefecture-${code}`} key={code}>
                <header><h3>{prefecture.prefectureName}</h3><span>{group.length}拠点</span></header>
                <div className={styles.cardGrid}>
                  {group.map((location) => {
                    const company = companyById.get(location.companyId);
                    if (!company) return null;
                    const locationSources = location.sourceIds
                      .map((sourceId) => sourceById.get(sourceId))
                      .filter((source) => source !== undefined);
                    return (
                      <SemiconductorLocationCard
                        company={company}
                        hiringSignal={hiringByLocationId.get(location.id)}
                        key={location.id}
                        location={location}
                        sources={locationSources}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </>
      ) : (
        <div className={styles.emptyState}>
          <h3>条件に一致する拠点はありません</h3>
          <p>検索語を短くするか、都道府県・拠点種別・職種の条件を外して確認してください。</p>
          <button onClick={clearAll} type="button">すべての条件を解除</button>
        </div>
      )}
    </section>
  );
}
