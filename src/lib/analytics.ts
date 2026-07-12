"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { track as trackVercelEvent } from "@vercel/analytics";

type AnalyticsValue = boolean | number | string;
type AnalyticsProperties = Record<string, AnalyticsValue | undefined>;

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

  if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    sendGAEvent("event", eventName, eventProperties);
  }
}
