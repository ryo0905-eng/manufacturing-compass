import { stockListings, stockMarketMeta, type StockListing } from "@/data/stock-market";
import type { WatchItem } from "@/lib/watch-types";

export type StockCompanyProfile = StockListing & {
  name: string; summary: string; companyHref: string; earningsHref: string | null;
  news: Pick<WatchItem, "id" | "title" | "href" | "date" | "dateLabel">[];
};

export function getStockListing(companyId: string) {
  return stockListings.find(listing => listing.companyId === companyId);
}

export function stockCompanyFromSymbol(symbol: unknown) {
  return typeof symbol === "string"
    ? stockListings.find(listing => listing.embedding !== "external" && listing.symbol === symbol)?.companyId ?? null
    : null;
}

export function readStockCompany(hash: string) {
  const id = new URLSearchParams(hash.replace(/^#/, "")).get("company");
  return stockListings.find(listing => listing.companyId === id)?.companyId ?? stockListings[0].companyId;
}

export function stockHref(companyId: string) {
  const id = getStockListing(companyId)?.companyId ?? stockListings[0].companyId;
  return `${stockMarketMeta.route}#company=${encodeURIComponent(id)}`;
}

export function relatedStockNews(news: readonly WatchItem[], companyId: string, now: string) {
  const cutoff = Date.parse(now);
  return news.filter(item => item.kind === "article" && !item.changed && item.companyIds.includes(companyId) && Date.parse(item.date) <= cutoff)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.id.localeCompare(b.id)).slice(0, 3);
}

export function buildStockProfiles(
  companies: readonly { id: string; slug: string; nameJa: string; summary: string }[],
  releases: readonly { companyId: string }[], news: readonly WatchItem[], now: string,
): StockCompanyProfile[] {
  return stockListings.flatMap(listing => {
    const company = companies.find(item => item.id === listing.companyId);
    if (!company) return [];
    return [{ ...listing, name: company.nameJa, summary: company.summary,
      companyHref: `/companies/${company.slug}`,
      earningsHref: releases.some(release => release.companyId === company.id) ? `/semiconductor-watch/earnings/${company.id}` : null,
      news: relatedStockNews(news, company.id, now).map(({ id, title, href, date, dateLabel }) => ({ id, title, href, date, dateLabel })),
    }];
  });
}
