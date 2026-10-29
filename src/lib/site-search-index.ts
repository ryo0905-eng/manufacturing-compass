// Server-side projection: clients receive only SiteSearchEntry metadata.
import type { Route } from "next";
import { beginnerGuides } from "@/content/guides";
import { companies, isCompanyIndexable } from "@/data/companies";
import { industryGuideCollections } from "@/data/guide-collections";
import { learningTools } from "@/data/learning-tools";
import { siteLinks } from "@/data/site-navigation";
import { buildAtlasCompanies, buildDirectoryCompanies } from "@/lib/company-explorer";
import type { SiteSearchEntry } from "@/lib/site-search";

const companyAliases: Record<string, readonly string[]> = {
  "tokyo-electron": ["Tokyo Electron", "TEL"],
  "applied-materials": ["Applied Materials", "AMAT", "アプライドマテリアルズ"],
  "lam-research": ["Lam Research", "ラムリサーチ"],
};
const toolAliases: Record<string, readonly string[]> = {
  cpk: ["Cp", "Cpk", "Pp", "Ppk", "工程能力"],
  "gage-rr": ["Gage R&R", "ゲージR&R", "測定誤差"],
  doe: ["DOE", "実験計画法"],
};

export function buildSiteSearchIndex(): SiteSearchEntry[] {
  const shortTitles = new Map(industryGuideCollections.flatMap((collection) => collection.guides.map((guide) => [guide.slug, guide.shortTitle] as const)));
  const atlasCompanies = buildAtlasCompanies(buildDirectoryCompanies(companies, [], []));
  const entries: SiteSearchEntry[] = [
    ...beginnerGuides.filter((guide) => guide.status === "published").map((guide): SiteSearchEntry => ({
      id: `article:${guide.slug}`, kind: "article", title: guide.title, description: guide.description,
      href: `/guides/${guide.slug}` as Route, keywords: [shortTitles.get(guide.slug) ?? guide.title],
    })),
    ...atlasCompanies.map((company): SiteSearchEntry => {
      const detail = companies.find((item) => item.id === company.id);
      return {
        id: `company:${company.id}`, kind: "company", title: company.name, description: company.summary,
        href: detail && isCompanyIndexable(detail)
          ? `/companies/${detail.slug}` as Route
          : `/industry-map#company=${company.id}` as Route,
        keywords: [company.nameJa, ...(companyAliases[company.id] ?? []), ...company.mainProducts, ...company.jobCategories],
      };
    }),
    ...learningTools.map((tool): SiteSearchEntry => ({
      id: `tool:${tool.id}`, kind: "tool", title: tool.title, description: tool.description,
      href: tool.href as Route, keywords: [...(toolAliases[tool.id] ?? []), tool.role, ...tool.features],
    })),
    { id: "tool:tool-navigator", kind: "tool", title: "Tool Navigator｜ソフトウェアを探して比較", description: siteLinks.tool_navigator.description, href: siteLinks.tool_navigator.href, keywords: [...siteLinks.tool_navigator.keywords] },
    ...Object.entries(siteLinks).filter(([id]) => id !== "search").map(([id, link]): SiteSearchEntry => ({
      id: `page:${id}`, kind: "page", title: link.label, description: link.description,
      href: link.href, keywords: [...link.keywords],
    })),
  ];

  // An article/tool can also be a navigation destination; keep one result and its aliases.
  const byHref = new Map<string, SiteSearchEntry>();
  for (const entry of entries) {
    const existing = byHref.get(entry.href);
    if (existing) existing.keywords = [...new Set([...existing.keywords, entry.title, ...entry.keywords])];
    else byHref.set(entry.href, entry);
  }
  return [...byHref.values()];
}
