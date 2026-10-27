"use client";

import type { MouseEvent } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackedAffiliateCreativeProps = {
  agentId: string;
  html: string;
  sourcePage?: string;
  ctaLocation?: string;
  readerPurpose?: string;
  uiVersion?: string;
};

export function TrackedAffiliateCreative({ agentId, html, sourcePage = "career_agents", ctaLocation = "affiliate_creative", readerPurpose, uiVersion }: TrackedAffiliateCreativeProps) {
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const link = target.closest("a");

    if (!link || !event.currentTarget.contains(link)) return;

    try {
      trackEvent("affiliate_outbound_click", {
        agent_id: agentId,
        cta_location: ctaLocation,
        source_page: sourcePage,
        reader_purpose: readerPurpose,
        ui_version: uiVersion,
      });
    } catch { /* Opening the advertiser must not depend on analytics. */ }
  }

  return (
    <div className="agent-affiliate-creative" onClick={handleClick}>
      <span>広告・アフィリエイトリンク</span>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
