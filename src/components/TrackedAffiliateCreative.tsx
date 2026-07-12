"use client";

import type { MouseEvent } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackedAffiliateCreativeProps = {
  agentId: string;
  html: string;
};

export function TrackedAffiliateCreative({ agentId, html }: TrackedAffiliateCreativeProps) {
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const link = target.closest("a");

    if (!link || !event.currentTarget.contains(link)) return;

    trackEvent("affiliate_outbound_click", {
      agent_id: agentId,
      cta_location: "affiliate_creative",
      source_page: "career_agents",
    });
  }

  return (
    <div className="agent-affiliate-creative" onClick={handleClick}>
      <span>広告・アフィリエイトリンク</span>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
