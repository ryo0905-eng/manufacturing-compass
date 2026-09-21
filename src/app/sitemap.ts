import { taguchiRelease } from "@/data/taguchi";
import { bayesianRelease } from "@/data/bayesian-optimization";
import { englishPracticalToolIds, englishPracticalTools, isEnglishPracticalToolPublished } from "@/data/practical-tools-english";
import type { MetadataRoute } from "next";
import { englishGuides, isEnglishGuidePublished } from "@/content/guides/en";
import { englishCpkRelease, isEnglishCpkPublished } from "@/data/cpk-english";
import { companies, isCompanyIndexable, segments } from "@/data/companies";
import { companyLocations } from "@/data/company-locations";
import { beginnerGuides, comparePairs, rankings } from "@/data/editorial";
import { companyCompareSlug, siteUrl } from "@/lib/format";

function contentDate(date: string) {
  return new Date(`${date}T00:00:00+09:00`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const searchReadyCompanies = companies.filter(isCompanyIndexable);
  const latestGuideUpdatedAt = beginnerGuides.reduce(
    (latest, guide) => guide.updatedAt > latest ? guide.updatedAt : latest,
    "1970-01-01",
  );
  const guidesLastModified = contentDate(latestGuideUpdatedAt);
  const latestLocationVerifiedAt = companyLocations
    .filter((location) => location.contentStatus === "complete")
    .reduce((latest, location) => location.lastVerifiedAt > latest ? location.lastVerifiedAt : latest, "1970-01-01");
  const staticRoutes = [
    "",
    "/tools",
    "/tools/cpk",
    "/tools/doe",
    "/tools/taguchi",
    "/tools/bayesian-optimization",
    "/tools/control-chart",
    "/tools/yield-analysis",
    "/tools/yield-dashboard",
    "/tools/gage-rr",
    "/tools/line-balance",
    "/tools/oee",
    "/tools/process-comparison",
    "/labs/jev",
    "/games/process-engineer-survival",
    "/career-compass",
    "/career-priorities",
    "/career-consultation",
    "/career-agents",
    "/roles",
    "/industry-map",
    "/semiconductor-map",
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
    ...(path === "/tools/taguchi" ? { lastModified: contentDate(taguchiRelease.updatedAt) } : {}),
    ...(path === "/tools/bayesian-optimization" ? { lastModified: contentDate(bayesianRelease.updatedAt) } : {}),
    ...(path === "/tools/process-comparison" ? { lastModified: contentDate("2026-09-16") } : {}),
    ...(path === "/labs/jev" ? { lastModified: contentDate("2026-09-20") } : {}),
    ...(path === "/games/process-engineer-survival" ? { lastModified: contentDate("2026-09-20") } : {}),
    ...(path === "/roles" ? { lastModified: contentDate("2026-09-17") } : {}),
    ...(path === "/career-priorities" ? { lastModified: contentDate("2026-09-06") } : {}),
    ...(path === "/guides" || path === "/guides/industry" ? { lastModified: guidesLastModified } : {}),
    ...(path === "/semiconductor-map" ? { lastModified: contentDate(latestLocationVerifiedAt) } : {}),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/career-agents" || path === "/semiconductor-map" ? 0.85 : 0.8,
  }));

  const companyRoutes = searchReadyCompanies.map((company) => ({
    url: `${siteUrl}/companies/${company.slug}`,
    lastModified: new Date(company.lastUpdated),
    changeFrequency: "monthly" as const,
    priority: 0.75,
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

  const englishGuideRoutes = englishGuides.filter(isEnglishGuidePublished).map((guide) => ({
    url: `${siteUrl}/en/guides/${guide.slug}`,
    lastModified: contentDate(guide.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.66,
  }));

  const englishToolRoutes = isEnglishCpkPublished() ? [{
    url: `${siteUrl}/en/tools/cpk`, lastModified: contentDate(englishCpkRelease.updatedAt),
    changeFrequency: "monthly" as const, priority: 0.8,
  }] : [];

  const practicalToolRoutes = englishPracticalToolIds.filter(isEnglishPracticalToolPublished).map(id => ({
    url: `${siteUrl}/en/tools/${id}`, lastModified: contentDate(englishPracticalTools[id].updatedAt),
    changeFrequency: "monthly" as const, priority: 0.8,
  }));

  return [...practicalToolRoutes, ...staticRoutes, ...segmentRoutes, ...companyRoutes, ...compareRoutes, ...guideRoutes, ...rankingRoutes, ...englishGuideRoutes, ...englishToolRoutes];
}
