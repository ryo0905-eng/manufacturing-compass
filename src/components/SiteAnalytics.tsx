import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";

/** Mounted once by each language's root layout. */
export function SiteAnalytics() {
  const gaMeasurementId = process.env.VERCEL_ENV === "production"
    ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    : undefined;

  return <>
    <Analytics />
    {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
  </>;
}
