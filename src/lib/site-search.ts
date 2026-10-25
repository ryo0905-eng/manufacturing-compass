import type { Route } from "next";

export type SiteSearchKind = "article" | "company" | "tool" | "page";
export type SiteSearchFilter = SiteSearchKind | "all";
export type SiteSearchEntry = {
  id: string;
  kind: SiteSearchKind;
  title: string;
  description: string;
  href: Route;
  keywords: readonly string[];
};

export const SITE_SEARCH_PAGE_SIZE = 12;
export const siteSearchFilters = [
  { id: "all", label: "すべて" },
  { id: "article", label: "記事" },
  { id: "company", label: "企業" },
  { id: "tool", label: "ツール" },
  { id: "page", label: "案内ページ" },
] as const;
export const siteSearchKindLabels: Record<SiteSearchKind, string> = {
  article: "記事", company: "企業", tool: "ツール", page: "案内ページ",
};

export function normalizeSiteSearch(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("ja").trim().replace(/\s+/g, " ");
}

export function searchSiteEntries(entries: readonly SiteSearchEntry[], query: string, kind: SiteSearchFilter = "all") {
  const normalized = normalizeSiteSearch(query);
  if (!normalized) return [];
  const tokens = normalized.split(" ");
  return entries.flatMap((entry, index) => {
    if (kind !== "all" && entry.kind !== kind) return [];
    const title = normalizeSiteSearch(entry.title);
    const keywords = entry.keywords.map(normalizeSiteSearch);
    const names = [title, ...keywords].join(" ");
    const text = `${names} ${normalizeSiteSearch(entry.description)}`;
    if (!tokens.every((token) => text.includes(token))) return [];
    const score = title === normalized ? 0
      : keywords.includes(normalized) ? 1
      : tokens.every((token) => title.includes(token)) ? 2
      : tokens.every((token) => names.includes(token)) ? 3 : 4;
    return [{ entry, score, index }];
  }).sort((a, b) => a.score - b.score || a.index - b.index).map(({ entry }) => entry);
}

export function getSiteSearchPage(entries: readonly SiteSearchEntry[], query: string, kind: SiteSearchFilter = "all", limit = SITE_SEARCH_PAGE_SIZE) {
  const matches = searchSiteEntries(entries, query, kind);
  const items = matches.slice(0, Math.max(0, limit));
  return { items, total: matches.length, hasMore: items.length < matches.length };
}
