"use client";

import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { ctaLocation: string };

export function CareerPrioritiesLink({ ctaLocation, onClick, ...props }: Props) {
  const pathname = usePathname();
  const ref = useRef<HTMLAnchorElement>(null);
  const observed = useRef<string | null>(null);
  useEffect(() => {
    const element = ref.current;
    const key = `${pathname}:${ctaLocation}`;
    if (!element || observed.current === key || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.5)) {
        observed.current = key;
        trackEvent("career_priorities_cta_view", { source_page: pathname, cta_location: ctaLocation });
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [pathname, ctaLocation]);

  return <Link {...props} ref={ref} href="/career-priorities" onClick={event => {
    trackEvent("career_priorities_cta_click", { source_page: pathname, cta_location: ctaLocation });
    onClick?.(event);
  }} />;
}
