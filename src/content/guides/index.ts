import { equipmentEngineerRouteGuide } from "@/content/guides/equipment-engineer-route";
import { qualityEngineerRouteGuide } from "@/content/guides/quality-engineer-route";
import { semiconductorCareerStartGuide } from "@/content/guides/semiconductor-career-start";
import type { GuideArticle } from "@/content/guides/types";

export type { GuideArticle } from "@/content/guides/types";

export const beginnerGuides: GuideArticle[] = [
  semiconductorCareerStartGuide,
  equipmentEngineerRouteGuide,
  qualityEngineerRouteGuide,
].filter((guide) => guide.status === "published");

export function getGuideBySlug(slug: string) {
  return beginnerGuides.find((guide) => guide.slug === slug);
}
