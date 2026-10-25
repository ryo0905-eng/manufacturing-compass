"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { trackCareerCompassEvent, type AnalyticsEventMap } from "@/lib/analytics";
import { observeVisibleOnce } from "@/lib/observe-visible";

type PreviewViewProps = AnalyticsEventMap["career_compass_preview_view"] & {
  children: ReactNode;
};

export function CareerCompassPreviewView({ children, source_page, cta_location, cta_variant }: PreviewViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const viewed = useRef(false);

  useEffect(() => {
    if (!ref.current || viewed.current) return;
    return observeVisibleOnce(ref.current, () => {
      viewed.current = true;
      trackCareerCompassEvent("career_compass_preview_view", { source_page, cta_location, cta_variant });
    });
  }, [source_page, cta_location, cta_variant]);

  return <div ref={ref}>{children}</div>;
}
