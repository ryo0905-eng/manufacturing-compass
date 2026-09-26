import type {
  PulseBriefLine,
  PulseCompany,
  PulseEvent,
  PulseFilters,
  PulseSignal,
  PulseThemeId,
} from "@/data/chip-pulse";

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
  weightedChange: number | null;
  japanWeightedChange: number | null;
  rising: number;
  falling: number;
  unchanged: number;
  topTheme: PulseThemeId | null;
  signalCount: number;
};

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

export function companyMatchesFilters(company: PulseCompany, filters: PulseFilters) {
  return (filters.region === "Global" || company.region === filters.region)
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
  return (filters.region === "Global" || item.regions.includes(filters.region))
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

function weightedChange(companies: PulseCompany[]) {
  const total = companies.reduce((sum, company) => sum + company.marketCapUsdB, 0);
  if (total <= 0) return null;
  return companies.reduce((sum, company) => sum + company.changePercent * company.marketCapUsdB, 0) / total;
}

export function calculatePulseKpis(companies: PulseCompany[], signals: PulseSignal[]): PulseKpis {
  const themeCounts = new Map<PulseThemeId, number>();
  for (const company of companies) {
    for (const theme of company.themes) themeCounts.set(theme, (themeCounts.get(theme) ?? 0) + 1);
  }
  const topTheme = [...themeCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? null;

  return {
    weightedChange: weightedChange(companies),
    japanWeightedChange: weightedChange(companies.filter((company) => company.region === "Japan")),
    rising: companies.filter((company) => company.changePercent > 0).length,
    falling: companies.filter((company) => company.changePercent < 0).length,
    unchanged: companies.filter((company) => company.changePercent === 0).length,
    topTheme,
    signalCount: signals.length,
  };
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

export function formatPulseChange(value: number | null) {
  if (value === null) return "—";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}
