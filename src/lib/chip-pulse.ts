import type {
  PulseBriefLine,
  PulseCompany,
  PulseEvent,
  PulseFilters,
  PulseSignal,
  PulseTheme,
  PulseThemeId,
} from "@/data/chip-pulse";
import { pulseThemeDefinitions, pulseUpdatedAt } from "@/data/chip-pulse";

export type TreemapRect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  company: PulseCompany;
};

export type TreemapGroupRect = {
  id: PulseCompany["category"];
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
};

export type PulseKpis = {
  signalCount24h: number;
  signalCount: number;
  activeCompanies: number;
  sourceCount: number;
  topTheme: PulseThemeId | null;
};

export type PulseCompanyActivity = { count: number; score: number };

type WeightedItem<T> = { id: string; value: number; item: T };
type Bounds = { x: number; y: number; width: number; height: number };
type WeightedRect<T> = Bounds & WeightedItem<T>;

const emptyFilters: PulseFilters = { region: "Global", category: "All", theme: "All" };

export function isDefaultPulseFilters(filters: PulseFilters) {
  return filters.region === "Global" && filters.category === "All" && filters.theme === "All";
}

export function getDefaultPulseFilters(): PulseFilters {
  return { ...emptyFilters };
}

export function pulseRegionMatches(region: PulseCompany["region"], selectedRegion: PulseFilters["region"]) {
  if (selectedRegion === "Global") return true;
  if (selectedRegion === "Asia") return ["Japan", "Taiwan", "Korea", "China"].includes(region);
  return region === selectedRegion;
}

export function companyMatchesFilters(company: PulseCompany, filters: PulseFilters) {
  return pulseRegionMatches(company.region, filters.region)
    && (filters.category === "All" || company.category === filters.category)
    && (filters.theme === "All" || company.themes.includes(filters.theme));
}

export function filterPulseCompanies(companies: PulseCompany[], filters: PulseFilters) {
  return companies.filter((company) => companyMatchesFilters(company, filters));
}

function tagsMatchFilters(
  item: Pick<PulseSignal, "regions" | "categories" | "themes">,
  filters: PulseFilters,
) {
  return item.regions.some((region) => pulseRegionMatches(region, filters.region))
    && (filters.category === "All" || item.categories.includes(filters.category))
    && (filters.theme === "All" || item.themes.includes(filters.theme));
}

export function filterPulseSignals(signals: PulseSignal[], filters: PulseFilters, selectedCompanyId: string | null) {
  return signals.filter((signal) => tagsMatchFilters(signal, filters)
    && (!selectedCompanyId || signal.companyIds.includes(selectedCompanyId)));
}

export function filterPulseEvents(events: PulseEvent[], filters: PulseFilters, selectedCompanyId: string | null) {
  return events.filter((event) => tagsMatchFilters(event, filters)
    && (!selectedCompanyId || event.companyIds.includes(selectedCompanyId)));
}

export function filterPulseBriefLines(lines: PulseBriefLine[], filters: PulseFilters, selectedCompanyId: string | null) {
  const matching = lines.filter((line) => tagsMatchFilters(line, filters)
    && (!selectedCompanyId || line.companyIds.includes(selectedCompanyId)));
  return [...matching].sort((a, b) => b.priority - a.priority).slice(0, 3);
}

export function calculatePulseKpis(companies: PulseCompany[], signals: PulseSignal[], asOf = pulseUpdatedAt): PulseKpis {
  const companyIds = new Set(companies.map((company) => company.id));
  const themeCounts = new Map<PulseThemeId, number>();
  for (const signal of signals) {
    for (const theme of signal.themes) themeCounts.set(theme, (themeCounts.get(theme) ?? 0) + 1);
  }
  const topTheme = [...themeCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? null;
  const asOfTime = new Date(asOf).getTime();
  const dayInMs = 24 * 60 * 60 * 1000;
  const activeCompanies = new Set(signals.flatMap((signal) => signal.companyIds).filter((id) => companyIds.has(id)));

  return {
    signalCount24h: signals.filter((signal) => {
      const age = asOfTime - new Date(signal.occurredAt).getTime();
      return age >= 0 && age <= dayInMs;
    }).length,
    signalCount: signals.length,
    activeCompanies: activeCompanies.size,
    sourceCount: new Set(signals.map((signal) => signal.sourceName)).size,
    topTheme,
  };
}

export function getPulseCompanyActivity(companyId: string, signals: PulseSignal[]): PulseCompanyActivity {
  const related = signals.filter((signal) => signal.companyIds.includes(companyId));
  const toneWeight: Record<PulseSignal["tone"], number> = { positive: 1, negative: -1, mixed: 0, neutral: 0 };
  return {
    count: related.length,
    score: related.reduce((sum, signal) => sum + toneWeight[signal.tone], 0),
  };
}

export function buildPulseThemes(signals: PulseSignal[]): PulseTheme[] {
  return Object.entries(pulseThemeDefinitions).flatMap(([id, definition]) => {
    const themeId = id as PulseThemeId;
    const matching = signals.filter((signal) => signal.themes.includes(themeId));
    if (matching.length === 0) return [];
    return [{
      id: themeId,
      label: definition.label,
      signalCount: matching.length,
      companyCount: new Set(matching.flatMap((signal) => signal.companyIds)).size,
      latestAt: [...matching].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))[0].occurredAt,
      note: definition.note,
    }];
  }).sort((a, b) => b.signalCount - a.signalCount || b.companyCount - a.companyCount || a.id.localeCompare(b.id));
}

function splitWeighted<T>(items: WeightedItem<T>[], bounds: Bounds): WeightedRect<T>[] {
  if (items.length === 0) return [];
  if (items.length === 1) return [{ ...bounds, ...items[0] }];

  const total = items.reduce((sum, item) => sum + item.value, 0);
  let bestIndex = 1;
  let running = items[0].value;
  let smallestDifference = Math.abs(total / 2 - running);
  for (let index = 2; index < items.length; index += 1) {
    running += items[index - 1].value;
    const difference = Math.abs(total / 2 - running);
    if (difference < smallestDifference) {
      bestIndex = index;
      smallestDifference = difference;
    }
  }

  const first = items.slice(0, bestIndex);
  const second = items.slice(bestIndex);
  const firstValue = first.reduce((sum, item) => sum + item.value, 0);
  const ratio = total > 0 ? firstValue / total : first.length / items.length;

  if (bounds.width >= bounds.height) {
    const firstWidth = bounds.width * ratio;
    return [
      ...splitWeighted(first, { ...bounds, width: firstWidth }),
      ...splitWeighted(second, { x: bounds.x + firstWidth, y: bounds.y, width: bounds.width - firstWidth, height: bounds.height }),
    ];
  }

  const firstHeight = bounds.height * ratio;
  return [
    ...splitWeighted(first, { ...bounds, height: firstHeight }),
    ...splitWeighted(second, { x: bounds.x, y: bounds.y + firstHeight, width: bounds.width, height: bounds.height - firstHeight }),
  ];
}

export function layoutPulseTreemap(companies: PulseCompany[], width = 1000, height = 520) {
  const categories = new Map<PulseCompany["category"], PulseCompany[]>();
  for (const company of companies) {
    const categoryCompanies = categories.get(company.category) ?? [];
    categoryCompanies.push(company);
    categories.set(company.category, categoryCompanies);
  }

  const weightedCategories = [...categories.entries()]
    .map(([category, categoryCompanies]) => ({
      id: category,
      value: categoryCompanies.reduce((sum, company) => sum + company.marketCapUsdB, 0),
      item: categoryCompanies,
    }))
    .sort((a, b) => b.value - a.value);
  const categoryRects = splitWeighted(weightedCategories, { x: 0, y: 0, width, height });

  const groups: TreemapGroupRect[] = categoryRects.map((rect) => ({
    id: rect.id as PulseCompany["category"],
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    value: rect.value,
  }));
  const rects: TreemapRect[] = categoryRects.flatMap((group) => {
    const weightedCompanies = [...group.item]
      .sort((a, b) => b.marketCapUsdB - a.marketCapUsdB)
      .map((company) => ({ id: company.id, value: company.marketCapUsdB, item: company }));
    return splitWeighted(weightedCompanies, group).map((rect) => ({
      id: rect.id,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      company: rect.item,
    }));
  });

  return { groups, rects };
}
