"use client";

import { trackEvent } from "@/lib/analytics";
import { rankingPurposeContext, type ReaderPurpose, type RankingPurposeDestination } from "@/data/ranking-purpose";

type RankingPurposeAction =
  | { action: "view" }
  | { action: "select"; reader_purpose: ReaderPurpose }
  | { action: "related_click"; reader_purpose: ReaderPurpose; destination_id: RankingPurposeDestination };

export function trackRankingPurposeEvent(action: RankingPurposeAction) {
  try {
    trackEvent("ranking_purpose", { ...rankingPurposeContext, ...action });
  } catch { /* Selection and navigation remain usable without analytics. */ }
}
