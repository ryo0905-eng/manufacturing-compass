"use client";

import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackCareerCompassEvent } from "@/lib/analytics";

type CareerCompassLinkProps = Omit<ComponentProps<typeof Link>, "href" | "ref"> & {
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
  const ref = useRef<HTMLAnchorElement>(null);
  const observed = useRef<string | null>(null);
  const source = sourcePage ?? pathname;

  useEffect(() => {
    const element = ref.current;
    const key = `${source}:${ctaLocation}:${ctaVariant}`;
    if (!element || observed.current === key || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5)) {
        observed.current = key;
        trackCareerCompassEvent("career_compass_cta_view", {
          source_page: source,
          cta_location: ctaLocation,
          cta_variant: ctaVariant,
        });
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [source, ctaLocation, ctaVariant]);

  return (
    <Link
      {...props}
      ref={ref}
      href="/career-compass"
      onClick={(event) => {
        trackCareerCompassEvent("career_compass_cta_click", {
          cta_location: ctaLocation,
          cta_variant: ctaVariant,
          source_page: source,
        });
        onClick?.(event);
      }}
    />
  );
}
