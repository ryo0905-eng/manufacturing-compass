"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChangeTimeline } from "@/components/chip-pulse/ChangeTimeline";
import { DailyBrief } from "@/components/chip-pulse/DailyBrief";
import { IndustryFilters } from "@/components/chip-pulse/IndustryFilters";
import { InvestmentRadar } from "@/components/chip-pulse/InvestmentRadar";
import { MarketHeatmap } from "@/components/chip-pulse/MarketHeatmap";
import { ThemePulse } from "@/components/chip-pulse/ThemePulse";
import { UpcomingEvents } from "@/components/chip-pulse/UpcomingEvents";
import {
  pulseBriefLines,
  pulseCompanies,
  pulseEvents,
  pulseSignals,
  pulseThemes,
  type PulseFilters,
} from "@/data/chip-pulse";
import { factoryProjects } from "@/data/factory-projects";
import {
  calculatePulseKpis,
  filterPulseBriefLines,
  filterPulseCompanies,
  filterPulseEvents,
  filterPulseSignals,
  formatPulseChange,
  getDefaultPulseFilters,
  isDefaultPulseFilters,
  pulseRegionMatches,
} from "@/lib/chip-pulse";
import { trackEvent } from "@/lib/analytics";
import styles from "./ChipPulseDashboard.module.css";

const defaults: PulseFilters = getDefaultPulseFilters();

const projectTags: Record<string, { category: "Foundry" | "Memory"; themes: string[] }> = {
  "jasm-1": { category: "Foundry", themes: ["Foundry"] },
  "jasm-2": { category: "Foundry", themes: ["Foundry"] },
  "rapidus-iim": { category: "Foundry", themes: ["EUV", "Foundry"] },
  "kioxia-k2": { category: "Memory", themes: ["HBM"] },
  "micron-hiroshima-cleanroom": { category: "Memory", themes: ["AI", "HBM"] },
};

function scopeText(filters: PulseFilters, selectedName?: string) {
  if (selectedName) return `${selectedName}に関連する要点`;
  const values = [
    filters.region !== "Global" ? filters.region : null,
    filters.category !== "All" ? filters.category : null,
    filters.theme !== "All" ? filters.theme : null,
  ].filter(Boolean);
  return values.length > 0 ? `${values.join(" × ")} の要点` : "Global × 全カテゴリの要点";
}

export function ChipPulseDashboard() {
  const [filters, setFilters] = useState<PulseFilters>(defaults);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const visibleCompanies = useMemo(() => filterPulseCompanies(pulseCompanies, filters), [filters]);
  const selectedCompany = visibleCompanies.find((company) => company.id === selectedCompanyId);

  useEffect(() => {
    if (selectedCompanyId && !visibleCompanies.some((company) => company.id === selectedCompanyId)) {
      setSelectedCompanyId(null);
    }
  }, [selectedCompanyId, visibleCompanies]);

  const activeCompanyId = selectedCompany?.id ?? null;
  const scopedCompanies = activeCompanyId ? visibleCompanies.filter((company) => company.id === activeCompanyId) : visibleCompanies;
  const visibleSignals = useMemo(
    () => filterPulseSignals(pulseSignals, filters, activeCompanyId),
    [activeCompanyId, filters],
  );
  const visibleEvents = useMemo(
    () => filterPulseEvents(pulseEvents, filters, activeCompanyId),
    [activeCompanyId, filters],
  );
  const briefLines = useMemo(
    () => filterPulseBriefLines(pulseBriefLines, filters, activeCompanyId),
    [activeCompanyId, filters],
  );
  const kpis = calculatePulseKpis(scopedCompanies, visibleSignals);
  const visibleThemes = pulseThemes.filter((theme) => {
    if (activeCompanyId) return selectedCompany?.themes.includes(theme.id);
    if (filters.theme !== "All") return theme.id === filters.theme;
    return visibleCompanies.some((company) => company.themes.includes(theme.id));
  });
  const visibleProjects = factoryProjects.filter((project) => {
    if (!pulseRegionMatches("Japan", filters.region)) return false;
    const tags = projectTags[project.id];
    if (!tags) return false;
    if (filters.category !== "All" && filters.category !== tags.category) return false;
    if (filters.theme !== "All" && !tags.themes.includes(filters.theme)) return false;
    if (selectedCompany && project.companySlug !== selectedCompany.companySlug) return false;
    return true;
  });
  function changeFilter<Key extends keyof PulseFilters>(key: Key, requestedValue: PulseFilters[Key]) {
    const defaultValue = defaults[key];
    const value = filters[key] === requestedValue ? defaultValue : requestedValue;
    const next = { ...filters, [key]: value };
    setFilters(next);
    trackEvent("chip_pulse_filter_change", {
      dimension: key,
      value: String(value),
      result_count: filterPulseCompanies(pulseCompanies, next).length,
    });
  }

  function resetFilters() {
    setFilters(getDefaultPulseFilters());
    setSelectedCompanyId(null);
    trackEvent("chip_pulse_filter_change", { dimension: "all", value: "reset", result_count: pulseCompanies.length });
  }

  function selectCompany(companyId: string, source: "treemap" | "list" | "signal") {
    const next = selectedCompanyId === companyId ? null : companyId;
    if (next && !visibleCompanies.some((company) => company.id === companyId)) setFilters(getDefaultPulseFilters());
    setSelectedCompanyId(next);
    trackEvent("chip_pulse_company_select", { company_id: companyId, source, action: next ? "select" : "clear" });
  }

  function openSignal(signalId: string) {
    trackEvent("chip_pulse_signal_open", { signal_id: signalId, company_id: activeCompanyId ?? "all" });
  }

  function relatedClick(destination: string) {
    trackEvent("chip_pulse_related_click", { destination_id: destination, company_id: activeCompanyId ?? "all" });
  }

  return (
    <div className={styles.dashboard}>
      <section className={styles.kpis} aria-label="Today's Pulse">
        <article><span>MARKET PULSE</span><strong className={kpis.weightedChange !== null && kpis.weightedChange < 0 ? styles.downValue : styles.upValue}>{formatPulseChange(kpis.weightedChange)}</strong><small>時価総額加重 · Japan {formatPulseChange(kpis.japanWeightedChange)}</small></article>
        <article><span>MARKET BREADTH</span><strong>{kpis.rising}<i>↑</i> / {kpis.falling}<b>↓</b></strong><small>上昇 / 下落企業</small></article>
        <article><span>FOCUS THEME</span><strong>{kpis.topTheme ?? "—"}</strong><small>関連企業が最多</small></article>
        <article><span>24H SIGNALS</span><strong>{kpis.signalCount}</strong><small>条件に合う変化</small></article>
      </section>

      <IndustryFilters filters={filters} resultCount={visibleCompanies.length} onChange={changeFilter} onReset={resetFilters} />

      {selectedCompany ? (
        <aside className={styles.selectionBar} aria-live="polite">
          <span>FOCUS</span><strong>{selectedCompany.name}</strong><small>{selectedCompany.category} · {selectedCompany.region} · {formatPulseChange(selectedCompany.changePercent)}</small>
          {selectedCompany.companySlug ? <Link href={`/companies/${selectedCompany.companySlug}`} onClick={() => relatedClick("selected_company")}>企業情報を見る →</Link> : null}
          <button type="button" onClick={() => setSelectedCompanyId(null)}>選択を解除</button>
        </aside>
      ) : null}

      {visibleCompanies.length === 0 ? (
        <section className={styles.zeroState}>
          <span>NO MATCH</span><h2>条件に一致する企業がありません</h2><p>地域・カテゴリ・テーマのいずれかを広げると、関連する企業とシグナルを再表示できます。</p><button type="button" onClick={resetFilters}>すべての条件を解除</button>
        </section>
      ) : (
        <>
          <DailyBrief lines={briefLines} scopeLabel={scopeText(filters, selectedCompany?.name)} />

          <div className={styles.cockpit}>
            <MarketHeatmap companies={visibleCompanies} selectedCompanyId={activeCompanyId} onSelect={selectCompany} />
            <ChangeTimeline
              signals={visibleSignals}
              onOpen={openSignal}
              onCompanySelect={(companyId) => selectCompany(companyId, "signal")}
              onRelatedClick={relatedClick}
            />
          </div>

          <ThemePulse themes={visibleThemes} />
        </>
      )}

      <details className={styles.secondaryData}>
        <summary><span>予定・設備投資・関連データ</span><strong>次に起きることと背景を深掘りする</strong><i>開く ＋</i></summary>
        <div className={styles.secondaryContent}>
          <div className={styles.lowerGrid}>
            <UpcomingEvents events={visibleEvents} />
            <InvestmentRadar projects={visibleProjects} onRelatedClick={relatedClick} />
          </div>
          <nav className={styles.related} aria-label="Chip Pulseから詳しく調べる">
            <header><span>GO DEEPER</span><h2>既存データで背景を確認する</h2></header>
            <div>
              <Link href="/industry-map" onClick={() => relatedClick("industry_map")}><strong>半導体業界地図</strong><span>企業と工程のつながり</span></Link>
              <Link href="/guides/semiconductor-market-cap-ranking" onClick={() => relatedClick("market_cap_ranking")}><strong>時価総額ランキング</strong><span>世界・日本企業を比較</span></Link>
              <Link href="/guides/semiconductor-equipment-sales-ranking" onClick={() => relatedClick("equipment_ranking")}><strong>装置ランキング</strong><span>売上規模と対応工程</span></Link>
              <Link href="/guides/memory-manufacturer-ranking" onClick={() => relatedClick("memory_ranking")}><strong>メモリ比較</strong><span>DRAM・NANDの構造</span></Link>
              <Link href="/semiconductor-map" onClick={() => relatedClick("location_map")}><strong>企業・工場マップ</strong><span>国内拠点を探す</span></Link>
              <Link href="/companies" onClick={() => relatedClick("companies")}><strong>半導体企業一覧</strong><span>事業・職種から企業研究</span></Link>
            </div>
          </nav>
        </div>
      </details>

      {!isDefaultPulseFilters(filters) ? <button className={styles.floatingReset} type="button" onClick={resetFilters}>条件をリセット</button> : null}
    </div>
  );
}
