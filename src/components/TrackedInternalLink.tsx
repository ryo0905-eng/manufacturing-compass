"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { observeVisibleOnce } from "@/lib/observe-visible";

type TrackedInternalLinkProps = ComponentProps<typeof Link> & {
  eventName: string;
  eventProperties?: Record<string, boolean | number | string | undefined>;
  viewEventName?: string;
};

export function TrackedInternalLink({
  eventName,
  eventProperties,
  viewEventName,
  onClick,
  ...props
}: TrackedInternalLinkProps) {
  const link = useRef<HTMLAnchorElement>(null);
  const viewed = useRef(false);
  useEffect(() => {
    if (!viewEventName || !link.current || viewed.current) return;
    return observeVisibleOnce(link.current, () => {
      viewed.current = true;
      trackEvent(viewEventName, eventProperties);
    });
  }, [viewEventName, eventProperties]);
  return (
    <Link
      {...props}
      ref={link}
      onClick={(event) => {
        trackEvent(eventName, eventProperties);
        onClick?.(event);
      }}
    />
  );
}
