import { jobNoteMeta } from "@/data/job-posting-note";
import { media } from "@/lib/chip-pulse-media";
import { articleWatchItem, watchUpdatedAt } from "@/lib/watch";
import { earningsReleases, earningsUpdatedAt } from "@/lib/earnings";
import { defectPareto } from "@/data/defect-pareto";
import { improvementReportMeta } from "@/data/improvement-report";
import { measurementPlanner } from "@/data/measurement-planner";
import { japanWorkRoute, japanWorkUpdatedAt } from "@/data/japan-work";
import { rankingTimeMachineMetadata } from "@/data/ranking-time-machine";
import { processRoute, processRelease } from "@/data/semiconductor-process";
import { improvementRoute, improvementRelease } from "@/data/improvement-confidence";
import { correlationRelease, correlationRoute, isCorrelationPublished } from "@/data/correlation-causation";
import { inspectionRelease } from "@/data/ai-visual-inspection";
import { taguchiRelease } from "@/data/taguchi";
import { bayesianRelease } from "@/data/bayesian-optimization";
import { englishPracticalToolIds, englishPracticalTools, isEnglishPracticalToolPublished } from "@/data/practical-tools-english";
import type { MetadataRoute } from "next";
import { englishGuides, isEnglishGuidePublished } from "@/content/guides/en";
import { englishCpkRelease, isEnglishCpkPublished } from "@/data/cpk-english";
import { companies, isCompanyIndexable, segments } from "@/data/companies";
import { companyLocations } from "@/data/company-locations";
import { beginnerGuides, canonicalComparePairs, rankings } from "@/data/editorial";
import { companyCompareSlug, siteUrl } from "@/lib/format";
import { getCompanyComparisonProfile, isComparisonIndexable } from "@/data/company-comparisons";

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
    defectPareto.route,
    improvementReportMeta.route,
    measurementPlanner.route,
    rankingTimeMachineMetadata.route,
    japanWorkRoute,
    processRoute,
    improvementRoute,
    ...(isCorrelationPublished() ? [correlationRoute] : []),
    "",
    "/tools",
    "/tools/cpk",
    "/tools/doe",
    "/tools/taguchi",
    "/tools/bayesian-optimization",
    "/tools/ai-visual-inspection",
    "/tools/control-chart",
    "/tools/yield-analysis",
    "/tools/yield-dashboard",
    "/tools/gage-rr",
    "/tools/line-balance",
    "/tools/oee",
    "/tools/process-comparison",
    "/labs/jev",
    "/games/palm-fab",
    "/games/process-engineer-survival",
    "/career-compass",
    "/career-priorities",
    "/career-consultation",
    "/career-agents",
    "/roles",
    "/industry-map",
    "/semiconductor-watch",
    "/semiconductor-watch/earnings",
    "/semiconductor-watch/earnings/compare",
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
    ...(path === "/career-consultation" ? { lastModified: contentDate(jobNoteMeta.updatedAt) } : {}),
    ...(path === defectPareto.route ? { lastModified: contentDate(defectPareto.updatedAt) } : {}),
    ...(path === improvementReportMeta.route ? { lastModified: contentDate(improvementReportMeta.updatedAt) } : {}),
    ...(path === measurementPlanner.route ? { lastModified: contentDate(measurementPlanner.updatedAt) } : {}),
    ...(path === rankingTimeMachineMetadata.route ? { lastModified: contentDate(rankingTimeMachineMetadata.updatedAt) } : {}),
    ...(path === processRoute ? { lastModified: contentDate(processRelease.updatedAt) } : {}),
    ...(path === japanWorkRoute ? { lastModified: contentDate(japanWorkUpdatedAt) } : {}),
    ...(path === improvementRoute ? { lastModified: contentDate(improvementRelease.updatedAt) } : {}),
    ...(path === correlationRoute ? { lastModified: contentDate(correlationRelease.updatedAt) } : {}),
    ...(path === "/tools/ai-visual-inspection" ? { lastModified: contentDate(inspectionRelease.updatedAt) } : {}),
    ...(path === "/tools/taguchi" ? { lastModified: contentDate(taguchiRelease.updatedAt) } : {}),
    ...(path === "/tools/bayesian-optimization" ? { lastModified: contentDate(bayesianRelease.updatedAt) } : {}),
    ...(path === "/tools/process-comparison" ? { lastModified: contentDate("2026-09-16") } : {}),
    ...(path === "/labs/jev" ? { lastModified: contentDate("2026-09-20") } : {}),
    ...(path === "/games/palm-fab" ? { lastModified: contentDate("2026-10-08") } : {}),
    ...(path === "/games/process-engineer-survival" ? { lastModified: contentDate("2026-09-20") } : {}),
    ...(path === "/roles" ? { lastModified: contentDate("2026-09-17") } : {}),
    ...(path === "/career-priorities" ? { lastModified: contentDate("2026-10-04") } : {}),
    ...(path === "/guides" || path === "/guides/industry" ? { lastModified: guidesLastModified } : {}),
    ...(path === "/semiconductor-map" ? { lastModified: contentDate(latestLocationVerifiedAt) } : {}),
    ...(path === "/semiconductor-watch" ? { lastModified: new Date(watchUpdatedAt) } : {}),
    ...(path === "/semiconductor-watch/earnings" || path === "/semiconductor-watch/earnings/compare" ? { lastModified: contentDate(earningsUpdatedAt) } : {}),
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
    ...(segment.id === "materials" ? { lastModified: contentDate("2026-10-08") } : {}),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const compareRoutes = canonicalComparePairs.filter((ids) => isComparisonIndexable(companyCompareSlug(ids))).map((ids) => ({
    url: `${siteUrl}/compare/${companyCompareSlug(ids)}`,
    lastModified: contentDate(getCompanyComparisonProfile(companyCompareSlug(ids))!.research!.updatedAt),
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
    lastModified: contentDate("2026-10-08"),
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

  const newsRoutes = media.articles.map(article => ({ url: `${siteUrl}/semiconductor-watch/${article.id}`, lastModified: new Date(articleWatchItem(article).updatedAt) }));
  const earningsRoutes = earningsReleases.map(release => ({ url: `${siteUrl}/semiconductor-watch/earnings/${release.companyId}`, lastModified: contentDate(release.checkedAt) }));
  return [...newsRoutes, ...earningsRoutes, ...practicalToolRoutes, ...staticRoutes, ...segmentRoutes, ...companyRoutes, ...compareRoutes, ...guideRoutes, ...rankingRoutes, ...englishGuideRoutes, ...englishToolRoutes];
}
