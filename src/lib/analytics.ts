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
  career_compass_related_click: { destination_type: "article" | "company" | "tool" | "industry_map" | "location_map" | "career_content"; destination_group: string };
  career_compass_agent_click: { cta_location: "career_compass_result"; destination_group: string };
  career_compass_cta_click: { source_page: string; cta_location: string; cta_variant: string };
};

export type LocationMapAnalyticsEventMap = {
  location_map_prefecture_select: {
    prefecture_code: string;
    selection_source: "filter" | "result_nav" | "selector";
  };
  location_map_filter_use: {
    filter_type: "job_family" | "keyword" | "location_type";
    filter_value?: string;
    result_count?: number;
  };
  location_map_view_change: { view: "list" | "regions" };
  location_map_location_open: { company_id: string; location_id: string };
  location_map_company_click: { company_id: string; location_id: string };
  location_map_official_career_click: {
    company_id: string;
    hiring_status: string;
    location_id: string;
  };
  location_map_career_compass_click: {
    cta_location: "related_links";
    source_page: "semiconductor_map";
  };
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

export function trackLocationMapEvent<EventName extends keyof LocationMapAnalyticsEventMap>(
  eventName: EventName,
  properties: LocationMapAnalyticsEventMap[EventName],
) {
  trackEvent(eventName, properties);
}
