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
  pulseThemeDefinitions,
  type PulseFilters,
} from "@/data/chip-pulse";
import officialUpdates from "@/data/chip-pulse-official-updates.json";
import refreshStatus from "@/data/chip-pulse-refresh-status.json";
import { factoryProjects } from "@/data/factory-projects";
import {
  buildPulseThemes,
  calculatePulseKpis,
  filterPulseBriefLines,
  filterPulseCompanies,
  filterPulseEvents,
  filterRecentPulseSignals,
  filterPulseSignals,
  filterUpcomingPulseEvents,
  getPulseCompanyActivity,
  getDefaultPulseFilters,
  isDefaultPulseFilters,
  pulseRegionMatches,
} from "@/lib/chip-pulse";
import { trackEvent } from "@/lib/analytics";
import styles from "./ChipPulseDashboard.module.css";

const defaults: PulseFilters = getDefaultPulseFilters();

type OfficialUpdate = {
  id: string;
  companyId: string;
  companyName: string;
  publishedAt: string;
  title: string;
  label: string;
  sourceUrl: string;
};

const publishedOfficialUpdates: OfficialUpdate[] = officialUpdates.updates;
const recentSignals = filterRecentPulseSignals(pulseSignals, refreshStatus.lastSuccessfulAt);
const upcomingEvents = filterUpcomingPulseEvents(pulseEvents, refreshStatus.lastSuccessfulAt);

const projectTags: Record<string, { category: "Foundry" | "Memory"; themes: string[] }> = {
  "jasm-1": { category: "Foundry", themes: ["Foundry"] },
  "jasm-2": { category: "Foundry", themes: ["Foundry"] },
  "rapidus-iim": { category: "Foundry", themes: ["EUV", "Foundry"] },
  "kioxia-k2": { category: "Memory", themes: ["HBM"] },
  "micron-hiroshima-cleanroom": { category: "Memory", themes: ["AI", "HBM"] },
};

function scopeText(filters: PulseFilters, selectedName?: string) {
  if (selectedName) return `${selectedName}に関連する要点`;
  const labels: Record<string, string> = {
    Japan: "日本", US: "米国", Asia: "アジア", Taiwan: "台湾", Korea: "韓国", China: "中国", Europe: "欧州",
    Fabless: "ファブレス", Foundry: "ファウンドリ", Equipment: "製造装置", Memory: "メモリ", Materials: "材料",
    "Advanced Packaging": "先端実装", Automotive: "車載",
  };
  const values = [
    filters.region !== "Global" ? (labels[filters.region] ?? filters.region) : null,
    filters.category !== "All" ? (labels[filters.category] ?? filters.category) : null,
    filters.theme !== "All" ? (labels[filters.theme] ?? filters.theme) : null,
  ].filter(Boolean);
  return values.length > 0 ? `${values.join(" × ")} の要点` : "全地域 × 全カテゴリの要点";
}

function formatJst(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
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
  const filteredSignals = useMemo(
    () => filterPulseSignals(recentSignals, filters, null),
    [filters],
  );
  const visibleSignals = useMemo(
    () => filterPulseSignals(recentSignals, filters, activeCompanyId),
    [activeCompanyId, filters],
  );
  const visibleEvents = useMemo(
    () => filterPulseEvents(upcomingEvents, filters, activeCompanyId),
    [activeCompanyId, filters],
  );
  const briefLines = filterPulseBriefLines(
    pulseBriefLines,
    defaults,
    null,
    recentSignals,
    filterRecentPulseSignals(recentSignals, refreshStatus.lastSuccessfulAt, 1).length > 0,
  );
  const kpis = calculatePulseKpis(pulseCompanies, recentSignals, refreshStatus.lastSuccessfulAt);
  const visibleThemes = buildPulseThemes(visibleSignals);
  const visibleProjects = factoryProjects.filter((project) => {
    if (!pulseRegionMatches("Japan", filters.region)) return false;
    const tags = projectTags[project.id];
    if (!tags) return false;
    if (filters.category !== "All" && filters.category !== tags.category) return false;
    if (filters.theme !== "All" && !tags.themes.includes(filters.theme)) return false;
    if (selectedCompany && project.companySlug !== selectedCompany.companySlug) return false;
    return true;
  });
  const visibleOfficialUpdates = filters.theme === "All" ? publishedOfficialUpdates.filter((update) => {
    const company = pulseCompanies.find((entry) => entry.id === update.companyId);
    return company && visibleCompanies.some((entry) => entry.id === company.id)
      && (!activeCompanyId || update.companyId === activeCompanyId);
  }) : [];
  const officialCount24h = publishedOfficialUpdates.filter((update) => {
    const age = new Date(refreshStatus.lastSuccessfulAt).getTime() - new Date(update.publishedAt).getTime();
    return age >= 0 && age <= 24 * 60 * 60 * 1000;
  }).length;
  function changeFilter<Key extends keyof PulseFilters>(key: Key, requestedValue: PulseFilters[Key]) {
    const defaultValue = defaults[key];
    const value = filters[key] === requestedValue ? defaultValue : requestedValue;
    const next = { ...filters, [key]: value };
    setFilters(next);
    trackEvent("chip_pulse_filter_change", {
      dimension: key,
      value: String(value),
      result_count: filterPulseSignals(recentSignals, next, null).length,
    });
  }

  function resetFilters() {
    setFilters(getDefaultPulseFilters());
    setSelectedCompanyId(null);
    trackEvent("chip_pulse_filter_change", { dimension: "all", value: "reset", result_count: recentSignals.length });
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

  function scrollTo(targetId: string) {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function focusTopTheme() {
    if (!kpis.topTheme) {
      scrollTo("important-news");
      return;
    }
    setFilters({ ...getDefaultPulseFilters(), theme: kpis.topTheme });
    setSelectedCompanyId(null);
    trackEvent("chip_pulse_filter_change", { dimension: "theme", value: kpis.topTheme, result_count: filterPulseCompanies(pulseCompanies, { ...getDefaultPulseFilters(), theme: kpis.topTheme }).length });
    requestAnimationFrame(() => scrollTo("important-news"));
  }

  const totalNews24h = kpis.signalCount24h + officialCount24h;
  const topThemeLabel = kpis.topTheme ? pulseThemeDefinitions[kpis.topTheme].label : "該当なし";
  const topThemeTie = kpis.topThemes.length > 1 ? `（同数${kpis.topThemes.length}テーマ・定義順）` : "";

  return (
    <div className={styles.dashboard}>
      <DailyBrief
        lines={briefLines}
        scopeLabel={`全体要約・対象は直近30日 / 最終正常更新 ${formatJst(refreshStatus.lastSuccessfulAt)} JST`}
      />

      {refreshStatus.status !== "success" ? (
        <aside className={styles.refreshWarning} role="status">
          <strong>{refreshStatus.status === "partial" ? "一部の情報源を更新できませんでした" : "情報源の更新に失敗しました"}</strong>
          <span>前回正常更新（{formatJst(refreshStatus.lastSuccessfulAt)} JST）の内容を表示しています。新着0件とは異なる状態です。</span>
        </aside>
      ) : null}

      <section className={styles.kpis} aria-label="ニュースを探す入口">
        <button type="button" onClick={() => scrollTo("important-news")}>
          <span>新着ニュース</span><strong>{totalNews24h}<i>件</i></strong><small>過去24時間・重複整理後。確認済み {kpis.signalCount24h}件 / 公式メタデータ {officialCount24h}件</small>
        </button>
        <button type="button" onClick={focusTopTheme} disabled={!kpis.topTheme}>
          <span>多く取り上げられたテーマ</span><strong>{topThemeLabel}</strong><small>直近30日の確認済みニュース {kpis.topThemeCount}件 {topThemeTie}</small>
        </button>
      </section>

      <p className={styles.kpiNote}>カードは全体集計で、下の絞り込みには連動しません。テーマが同数の場合は定義順の先頭を選びます。</p>

      <IndustryFilters filters={filters} resultCount={visibleSignals.length} onChange={changeFilter} onReset={resetFilters} />

      {selectedCompany ? (
        <aside className={styles.selectionBar} aria-live="polite">
          <span>FOCUS</span><strong>{selectedCompany.name}</strong><small>{selectedCompany.category} · {selectedCompany.region} · 公式シグナル {getPulseCompanyActivity(selectedCompany.id, filteredSignals).count}件</small>
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
          <p className={styles.scopeNote}>現在の一覧：{scopeText(filters, selectedCompany?.name)}</p>

          <ChangeTimeline
            signals={visibleSignals}
            asOf={refreshStatus.lastSuccessfulAt}
            onOpen={openSignal}
            onCompanySelect={(companyId) => selectCompany(companyId, "signal")}
            onRelatedClick={relatedClick}
          />

          {visibleOfficialUpdates.length > 0 ? (
            <section className={styles.officialFeed} id="other-news" aria-labelledby="official-feed-title">
              <header><div><span>その他の公式更新</span><h2 id="official-feed-title">未編集の公式発表・開示</h2></div><p>タイトル・提出種別・発表日のみ自動掲載。本文を読んだ要約ではありません。</p></header>
              <ul>{visibleOfficialUpdates.map((update) => (
                <li key={update.id}>
                  <time dateTime={update.publishedAt}>{update.publishedAt.slice(0, 10)}</time>
                  <span>{update.companyName} · {update.label}</span>
                  <a href={update.sourceUrl} target="_blank" rel="noreferrer">{update.title} ↗</a>
                </li>
              ))}</ul>
            </section>
          ) : null}

          <ThemePulse themes={visibleThemes} />

          <section className={styles.marketSection} aria-labelledby="market-section-title">
            <header><div><span>市場データ</span><h2 id="market-section-title">ニュースとは分けて企業規模を見る</h2></div><p>株価の騰落率・リアルタイム価格・独自Pulseスコアは表示していません。</p></header>
            <MarketHeatmap companies={visibleCompanies} signals={filteredSignals} selectedCompanyId={activeCompanyId} onSelect={selectCompany} />
          </section>
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
