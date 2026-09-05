"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import type { AgentFocus } from "@/data/affiliateLinks";

type CareerAgentsLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  focus?: AgentFocus;
  ctaLocation?: "shared_affiliate_cta" | "consultation_after_template" | "consultation_theme";
};

export function CareerAgentsLink({ onClick, focus, ctaLocation = "shared_affiliate_cta", ...props }: CareerAgentsLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      href={focus ? `/career-agents?focus=${focus}#agents` : "/career-agents"}
      onClick={(event) => {
        trackEvent("career_agents_cta_click", {
          source_page: pathname,
          cta_location: ctaLocation,
          destination_path: "/career-agents",
          destination_group: focus,
        });
        onClick?.(event);
      }}
    />
  );
}
