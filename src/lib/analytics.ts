"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { track as trackVercelEvent } from "@vercel/analytics";

type AnalyticsValue = boolean | number | string;
type AnalyticsProperties = Record<string, AnalyticsValue | undefined>;

export type AnalyticsEventMap = {
  career_compass_start: { source_page: "career_compass" };
  career_compass_step: { step_number: number; total_steps: number };
  career_compass_complete: { result_type: string; recommended_role_group: string };
  career_compass_result_view: { result_type: string; recommended_role_group: string };
  career_compass_related_click: { destination_type: "article" | "company" | "tool" | "industry_map" | "career_content"; destination_group: string };
  career_compass_agent_click: { cta_location: "career_compass_result"; destination_group: string };
  career_compass_cta_click: { source_page: string; cta_location: string; cta_variant: string };
};

function isProductionGaHost() {
  return process.env.NODE_ENV === "production"
    && typeof window !== "undefined"
    && window.location.hostname === "mfg-compass.com";
}

/**
 * Sends the same product event to Vercel Analytics and, when configured, GA4.
 * Keep values to finite, non-identifying categories. Never pass names, email
 * addresses, free text, or full diagnosis answers to this function.
 */
export function trackEvent(eventName: string, properties: AnalyticsProperties = {}) {
  const eventProperties = Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  ) as Record<string, AnalyticsValue>;

  trackVercelEvent(eventName, eventProperties);

  if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && isProductionGaHost()) {
    sendGAEvent("event", eventName, eventProperties);
  }
}


export function trackCareerCompassEvent<EventName extends keyof AnalyticsEventMap>(
  eventName: EventName,
  properties: AnalyticsEventMap[EventName],
) {
  trackEvent(eventName, properties);
}
