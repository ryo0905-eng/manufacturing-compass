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
    if (filters.region !== "Global" && filters.region !== "Japan") return false;
    const tags = projectTags[project.id];
    if (!tags) return false;
    if (filters.category !== "All" && filters.category !== tags.category) return false;
    if (filters.theme !== "All" && !tags.themes.includes(filters.theme)) return false;
    if (selectedCompany && project.companySlug !== selectedCompany.companySlug) return false;
    return true;
  });
  const importantSignals = [...visibleSignals]
    .sort((a, b) => b.importance - a.importance || b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 5);

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

  function selectCompany(companyId: string, source: "treemap" | "list") {
    const next = selectedCompanyId === companyId ? null : companyId;
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
        <article><span>GLOBAL PULSE</span><strong className={kpis.weightedChange !== null && kpis.weightedChange < 0 ? styles.downValue : styles.upValue}>{formatPulseChange(kpis.weightedChange)}</strong><small>対象企業の時価総額加重</small></article>
        <article><span>JAPAN PULSE</span><strong className={kpis.japanWeightedChange !== null && kpis.japanWeightedChange < 0 ? styles.downValue : styles.upValue}>{formatPulseChange(kpis.japanWeightedChange)}</strong><small>表示中の日本企業</small></article>
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
          <div className={styles.cockpit}>
            <MarketHeatmap companies={visibleCompanies} selectedCompanyId={activeCompanyId} onSelect={selectCompany} />
            <aside className={styles.rightRail}>
              <DailyBrief lines={briefLines} scopeLabel={scopeText(filters, selectedCompany?.name)} />
              <ChangeTimeline signals={visibleSignals} onOpen={openSignal} />
            </aside>
          </div>

          <ThemePulse themes={visibleThemes} />

          <section className={styles.news} aria-labelledby="important-news-title">
            <header className={styles.sectionHeading}><div><span>IMPORTANT NEWS / DEMO</span><h2 id="important-news-title">重要な変化を、企業とテーマで読む</h2></div><p>重要度順 5件</p></header>
            {importantSignals.length > 0 ? <div className={styles.newsGrid}>{importantSignals.map((signal) => {
              const linkedCompany = signal.companyIds.map((id) => pulseCompanies.find((company) => company.id === id)).find((company) => company?.companySlug);
              return <details key={signal.id} onToggle={(event) => { if (event.currentTarget.open) openSignal(signal.id); }}>
                <summary><span>重要度 {signal.importance}</span><time dateTime={signal.occurredAt}>{signal.timeLabel}</time><h3>{signal.title}</h3><p>{signal.summary}</p><i>詳細を見る</i></summary>
                <div><strong>なぜ見るか</strong><p>{signal.impact}</p><ul>{signal.themes.map((theme) => <li key={theme}>{theme}</li>)}</ul>{linkedCompany?.companySlug ? <Link href={`/companies/${linkedCompany.companySlug}`} onClick={() => relatedClick(`company_${linkedCompany.id}`)}>{linkedCompany.name}の企業情報 →</Link> : <Link href="/industry-map" onClick={() => relatedClick("industry_map_from_news")}>業界地図で関係を見る →</Link>}</div>
              </details>;
            })}</div> : <p className={styles.emptyText}>この条件に該当する重要シグナルはありません。</p>}
          </section>

          <div className={styles.lowerGrid}>
            <UpcomingEvents events={visibleEvents} />
            <InvestmentRadar projects={visibleProjects} onRelatedClick={relatedClick} />
          </div>
        </>
      )}

      <nav className={styles.related} aria-label="Chip Pulseから詳しく調べる">
        <header><span>GO DEEPER</span><h2>気になった動きを、既存データで深掘りする</h2></header>
        <div>
          <Link href="/industry-map" onClick={() => relatedClick("industry_map")}><strong>半導体業界地図</strong><span>企業と工程のつながりを見る</span></Link>
          <Link href="/guides/semiconductor-market-cap-ranking" onClick={() => relatedClick("market_cap_ranking")}><strong>時価総額ランキング</strong><span>基準日の世界・日本企業を比較</span></Link>
          <Link href="/guides/semiconductor-equipment-sales-ranking" onClick={() => relatedClick("equipment_ranking")}><strong>装置メーカーランキング</strong><span>売上規模と対応工程を見る</span></Link>
          <Link href="/guides/memory-manufacturer-ranking" onClick={() => relatedClick("memory_ranking")}><strong>メモリメーカー比較</strong><span>DRAM・NANDの市場構造を見る</span></Link>
          <Link href="/semiconductor-map" onClick={() => relatedClick("location_map")}><strong>企業・工場マップ</strong><span>国内拠点を勤務地から探す</span></Link>
          <Link href="/companies" onClick={() => relatedClick("companies")}><strong>半導体企業一覧</strong><span>事業・職種から企業研究へ</span></Link>
        </div>
      </nav>

      {!isDefaultPulseFilters(filters) ? <button className={styles.floatingReset} type="button" onClick={resetFilters}>条件をリセット</button> : null}
    </div>
  );
}
