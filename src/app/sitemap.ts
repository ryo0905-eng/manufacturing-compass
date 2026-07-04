import type { MetadataRoute } from "next";
import { companies, segments } from "@/data/companies";
import { beginnerGuides, comparePairs, rankings } from "@/data/editorial";
import { companyCompareSlug, siteUrl } from "@/lib/format";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/career-compass", "/career-consultation", "/industry-map", "/companies", "/compare", "/guides", "/rankings"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const companyRoutes = companies.map((company) => ({
    url: `${siteUrl}/companies/${company.slug}`,
    lastModified: new Date(company.lastUpdated),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const companyPrepRoutes = companies.map((company) => ({
    url: `${siteUrl}/companies/${company.slug}/career-prep`,
    lastModified: new Date(company.lastUpdated),
    changeFrequency: "monthly" as const,
    priority: 0.68,
  }));

  const segmentRoutes = segments.map((segment) => ({
    url: `${siteUrl}/segments/${segment.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const compareRoutes = comparePairs.map((ids) => ({
    url: `${siteUrl}/compare/${companyCompareSlug(ids)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const guideRoutes = beginnerGuides.map((guide) => ({
    url: `${siteUrl}/guides/${guide.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.66,
  }));

  const rankingRoutes = rankings.map((ranking) => ({
    url: `${siteUrl}/rankings/${ranking.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.66,
  }));

  return [...staticRoutes, ...segmentRoutes, ...companyRoutes, ...companyPrepRoutes, ...compareRoutes, ...guideRoutes, ...rankingRoutes];
}
