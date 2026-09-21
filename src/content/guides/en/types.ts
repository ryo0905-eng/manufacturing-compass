import type { GuideArticle } from "@/content/guides/types";

export type EnglishGuideArticle = GuideArticle & {
  translation: {
    sourceSlug: string;
    sourceUpdatedAt: string;
    /** New Japanese revision awaiting translation review; does not change the reviewed English edition. */
    pendingSourceUpdatedAt?: string;
    translatedAt: string;
    /** Null until the named reviewer has actually reviewed this English edition. */
    reviewedAt: string | null;
  };
};
