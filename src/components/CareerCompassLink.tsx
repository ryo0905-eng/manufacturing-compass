"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

type CareerCompassLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  ctaLocation: string;
  ctaVariant: string;
  sourcePage?: string;
};

export function CareerCompassLink({
  ctaLocation,
  ctaVariant,
  onClick,
  sourcePage,
  ...props
}: CareerCompassLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      href="/career-compass"
      onClick={(event) => {
        trackEvent("career_compass_cta_click", {
          cta_location: ctaLocation,
          cta_variant: ctaVariant,
          source_page: sourcePage ?? pathname,
        });
        onClick?.(event);
      }}
    />
  );
}
