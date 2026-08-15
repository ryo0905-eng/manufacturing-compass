"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

type TrackedInternalLinkProps = ComponentProps<typeof Link> & {
  eventName: string;
  eventProperties?: Record<string, boolean | number | string | undefined>;
};

export function TrackedInternalLink({
  eventName,
  eventProperties,
  onClick,
  ...props
}: TrackedInternalLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventProperties);
        onClick?.(event);
      }}
    />
  );
}
