import type { MetadataRoute } from "next";
import { companies, getCareerInfo, segments } from "@/data/companies";
import { beginnerGuides, comparePairs, rankings } from "@/data/editorial";
import { companyCompareSlug, siteUrl } from "@/lib/format";

function contentDate(date: string) {
  return new Date(`${date}T00:00:00+09:00`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const searchReadyCompanies = companies.filter((company) => getCareerInfo(company.id));
  const latestGuideUpdatedAt = beginnerGuides.reduce(
    (latest, guide) => guide.updatedAt > latest ? guide.updatedAt : latest,
    "1970-01-01",
  );
  const guidesLastModified = contentDate(latestGuideUpdatedAt);
  const staticRoutes = [
    "",
    "/tools",
    "/tools/cpk",
    "/tools/doe",
    "/tools/control-chart",
    "/tools/gage-rr",
    "/career-compass",
    "/career-consultation",
    "/career-agents",
    "/industry-map",
    "/companies",
    "/compare",
    "/guides",
    "/guides/industry",
    "/rankings",
    "/about",
    "/privacy",
    "/disclaimer",
    "/advertising-policy",
    "/contact",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    ...(path === "/guides" || path === "/guides/industry" ? { lastModified: guidesLastModified } : {}),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/career-agents" ? 0.85 : 0.8,
  }));

  const companyRoutes = searchReadyCompanies.map((company) => ({
    url: `${siteUrl}/companies/${company.slug}`,
    lastModified: new Date(company.lastUpdated),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const companyPrepRoutes = searchReadyCompanies.map((company) => ({
    url: `${siteUrl}/companies/${company.slug}/career-prep`,
    lastModified: new Date(company.lastUpdated),
    changeFrequency: "monthly" as const,
    priority: 0.68,
  }));

  const segmentRoutes = segments.map((segment) => ({
    url: `${siteUrl}/segments/${segment.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const compareRoutes = comparePairs.map((ids) => ({
    url: `${siteUrl}/compare/${companyCompareSlug(ids)}`,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const guideRoutes = beginnerGuides.map((guide) => ({
    url: `${siteUrl}/guides/${guide.slug}`,
    lastModified: contentDate(guide.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.66,
  }));

  const rankingRoutes = rankings.map((ranking) => ({
    url: `${siteUrl}/rankings/${ranking.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.66,
  }));

  return [...staticRoutes, ...segmentRoutes, ...companyRoutes, ...companyPrepRoutes, ...compareRoutes, ...guideRoutes, ...rankingRoutes];
}
