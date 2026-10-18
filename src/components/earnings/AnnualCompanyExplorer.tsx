"use client";
import { trackEvent } from "@/lib/analytics";
import { annualWindow, type AnnualSeries, type AnnualYears } from "@/lib/earnings-history-math";
import { AnnualCompanyAnalysis } from "./AnnualHistory";
import { AnnualPeriodControl, useAnnualYears } from "./AnnualPeriodControl";

export function AnnualCompanyExplorer({ series, initialYears = 10 }: { series: AnnualSeries; initialYears?: AnnualYears }) {
  const { years, changeYears } = useAnnualYears(initialYears);
  return <AnnualCompanyAnalysis series={annualWindow(series, years)} years={years} controls={<AnnualPeriodControl years={years} onChange={next => {
      if (changeYears(next)) trackEvent("earnings_history_action", { action: "period_select", years: next, company_ids: series.companyId, ui_version: "annual-v2" });
    }} />} />;
}
