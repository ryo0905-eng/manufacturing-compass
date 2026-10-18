import type { Route } from "next";
import { factoryProjects } from "@/data/factory-projects";

export const researchPages = {
  industry_map: {
    href: "/industry-map",
    label: "企業の役割を調べる",
    lead: "企業が何をつくり、半導体産業のどの役割を担うかを調べるページです。日本・海外の企業を8つの役割で俯瞰し、ロゴや社名から企業概要を確認できます。",
    quickLinks: [
      { href: "#company-search", label: "企業を探す", destination: "company_search" },
    ],
  },
  semiconductor_map: {
    href: "/semiconductor-map",
    label: "勤務地・拠点を探す",
    lead: "国内拠点の所在地と役割を、都道府県・拠点種別から調べるページです。企業公式情報をもとに、工場、研究開発、設計、本社・事業所を勤務地単位で整理しています。",
    quickLinks: [
      { href: "#location-directory-title", label: "地域・拠点で絞り込む", destination: "location_search" },
    ],
  },
  factory_projects: {
    href: "/guides/japan-semiconductor-factory-projects",
    label: "新設・増設の進捗を見る",
    lead: `新設・増設の主要${factoryProjects.length}案件を、建設・試作・量産の段階と予定から比較する記事です。企業公式情報から、確認できた節目と今後の予定を分けて整理しています。`,
    quickLinks: [
      { href: "#projects", label: `主要${factoryProjects.length}案件を見る`, destination: "factory_list" },
      { href: "#factory-comparison-title", label: "2案件を比較する", destination: "factory_compare" },
    ],
  },
} as const satisfies Record<string, {
  href: Route;
  label: string;
  lead: string;
  quickLinks: readonly { href: Route; label: string; destination: string }[];
}>;

export type ResearchPageId = keyof typeof researchPages;
export type ResearchDestination = ResearchPageId
  | (typeof researchPages)[ResearchPageId]["quickLinks"][number]["destination"];
