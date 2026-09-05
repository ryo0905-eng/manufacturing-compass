"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

type CareerAgentsLinkProps = Omit<ComponentProps<typeof Link>, "href">;

export function CareerAgentsLink({ onClick, ...props }: CareerAgentsLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      href="/career-agents"
      onClick={(event) => {
        trackEvent("career_agents_cta_click", {
          source_page: pathname,
          cta_location: "shared_affiliate_cta",
          destination_path: "/career-agents",
        });
        onClick?.(event);
      }}
    />
  );
}
