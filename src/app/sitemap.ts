import type { MetadataRoute } from "next";
import { companies, segments } from "@/data/companies";
import { companyCompareSlug, siteUrl } from "@/lib/format";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/career-compass", "/career-consultation", "/industry-map", "/companies", "/compare"].map((path) => ({
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

  const segmentRoutes = segments.map((segment) => ({
    url: `${siteUrl}/segments/${segment.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const compareRoutes = [
    ["tsmc", "micron"],
    ["tsmc", "tokyo-electron"],
    ["tokyo-electron", "skyworks"],
  ].map((ids) => ({
    url: `${siteUrl}/compare/${companyCompareSlug(ids)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticRoutes, ...segmentRoutes, ...companyRoutes, ...compareRoutes];
}
