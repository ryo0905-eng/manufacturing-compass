import type { GuideArticle } from "@/content/guides/types";

export type EnglishGuideArticle = GuideArticle & {
  translation: {
    sourceSlug: string;
    sourceUpdatedAt: string;
    translatedAt: string;
    /** Null until the named reviewer has actually reviewed this English edition. */
    reviewedAt: string | null;
  };
};
