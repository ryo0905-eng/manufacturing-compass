"use client";

import {
  getAffiliateAgent,
  getAgentCtaLabel,
  getAgentRel,
  getAgentUrl,
  getPrimaryAgent,
} from "@/data/affiliateLinks";
import { trackEvent } from "@/lib/analytics";

type AgentCtaProps = {
  agentId?: string;
};

export function AgentCta({ agentId }: AgentCtaProps) {
  const agent = (agentId ? getAffiliateAgent(agentId) : undefined) ?? getPrimaryAgent();
  const url = getAgentUrl(agent);

  return (
    <section className="agent-cta">
      <div>
        <p className="eyebrow">{agent.category}</p>
        <h2>{agent.name}</h2>
        <p>{agent.description}</p>
        <b>{agent.recommendedFor}</b>
      </div>
      {url ? (
        <a
          className="button primary"
          href={url}
          onClick={() => trackEvent("affiliate_outbound_click", {
            agent_id: agent.id,
            cta_location: "agent_cta",
          })}
          rel={getAgentRel(agent)}
          target="_blank"
        >
          {getAgentCtaLabel(agent)}
        </a>
      ) : (
        <span className="button disabled">{getAgentCtaLabel(agent)}</span>
      )}
    </section>
  );
}
