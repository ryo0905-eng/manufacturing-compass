import { efemEnglishGuide } from "./semiconductor-wafer-handling-efem-manufacturers";
import type { EnglishGuideArticle } from "./types";

// Separate from the Japanese registry: a translation is not a new Japanese article.
export const englishGuides: EnglishGuideArticle[] = [efemEnglishGuide];

export function isEnglishGuidePublished(guide: EnglishGuideArticle) {
  return guide.status === "published" && Boolean(guide.translation.reviewedAt) && Boolean(guide.publishedAt);
}

export function getEnglishGuide(slug: string) {
  return englishGuides.find((guide) => guide.slug === slug);
}

export function getPublishedEnglishTranslation(sourceSlug: string) {
  return englishGuides.find((guide) => guide.translation.sourceSlug === sourceSlug && isEnglishGuidePublished(guide));
}
