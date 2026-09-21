export const englishPracticalToolIds = ["oee", "line-balance", "process-comparison"] as const;
export type EnglishPracticalToolId = typeof englishPracticalToolIds[number];

type EnglishToolEdition = {
  title: string;
  description: string;
  status: "draft" | "published";
  translatedAt: string;
  updatedAt: string;
  sourceUpdatedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  publishedAt: string | null;
  sections: { heading: string; paragraphs: string[] }[];
  sources: { title: string; url: string; checkedAt: string }[];
};

// Editorial dates are separate from the production deployment date in the private experiment log.
const draft = {
  status: "draft" as const, translatedAt: "2026-09-21", updatedAt: "2026-09-21",
  reviewedAt: null, reviewedBy: null, publishedAt: null,
};

export const englishPracticalTools: Record<EnglishPracticalToolId, EnglishToolEdition> = {
  oee: {
    ...draft, sourceUpdatedAt: "2026-09-21",
    title: "OEE Calculator & Improvement Simulator",
    description: "Calculate availability, performance and quality, then compare estimated good output under an improvement scenario. Free, no signup, calculated in your browser.",
    sections: [
      { heading: "How to use this calculator", paragraphs: ["Start with the fictional sample or enter your production data. Enter time in minutes, ideal cycle time in seconds per part, and production and reject counts. Change the scenario inputs to compare estimated output."] },
      { heading: "Understand the three factors", paragraphs: ["OEE = availability × performance × quality. Availability is run time divided by planned production time. Performance compares ideal production time with actual run time. Quality is good count divided by total count.", "Planned production time excludes periods when production is not scheduled. Stops within scheduled production, including changeovers, belong in stop time. Use a consistent definition for both the current state and the scenario."] },
      { heading: "Read the improvement scenario", paragraphs: ["The scenario holds planned production time and ideal cycle time constant. It estimates good count from the remaining run time, ideal rate, scenario performance and scenario quality. Fractional counts are retained in the calculation and rounded only for display.", "This is a comparison of assumptions, not a production forecast. Material supply, staffing, equipment constraints and demand are not modeled. An OEE increase alone does not establish the cause of an improvement."] },
    ],
    sources: [{ title: "Vorne / OEE.com — Calculating OEE", url: "https://www.oee.com/calculating-oee/", checkedAt: "2026-09-21" }],
  },
  "line-balance": {
    ...draft, sourceUpdatedAt: "2026-09-13",
    title: "Yamazumi Chart & Line Balancing Tool",
    description: "Build a stacked workload chart, move tasks between stations and compare time above takt with a baseline. Free manual line balancing, with no signup.",
    sections: [
      { heading: "Build and compare a workload chart", paragraphs: ["Enter target takt time in seconds. Add stations and tasks, enter each task duration, and select its assigned station. Each colored segment in the chart represents one task. The sample is fictional.", "Use Set current state as baseline before changing assignments. Moving a task redistributes time without changing total work time. Deleting a station moves its tasks to the first remaining station; at least one station is retained. Reset sample restores both the working state and baseline."] },
      { heading: "Takt time and time above takt", paragraphs: ["Takt time is available production time divided by customer demand, expressed in consistent units. This tool accepts your target takt rather than calculating demand.", "The chart follows the yamazumi approach of stacking work elements against takt. Here, each bar represents a station. Total time above takt is the sum of each station's positive excess over the target. It is not a direct prediction of output or elapsed line cycle time."] },
      { heading: "Check whether a reassignment is feasible", paragraphs: ["The tool supports manual comparison, not automatic optimization. It does not validate task precedence, travel, parallel work, machine capacity, safety or operator qualifications. Check those constraints before applying a proposed assignment."] },
    ],
    sources: [
      { title: "Lean Enterprise Institute — Operator Balance Chart", url: "https://www.lean.org/lexicon-terms/operator-balance-chart/", checkedAt: "2026-09-21" },
      { title: "Lean Enterprise Institute — Takt Time", url: "https://www.lean.org/lexicon-terms/takt-time/", checkedAt: "2026-09-21" },
    ],
  },
  "process-comparison": {
    ...draft, sourceUpdatedAt: "2026-09-16",
    title: "Compare Two Data Sets: Mean, Variation & Histograms",
    description: "Compare two measurement data sets using descriptive statistics and shared-scale histograms. Copy a table for Excel or save a PNG, entirely in your browser.",
    sections: [
      { heading: "Paste measurements and export the comparison", paragraphs: ["Enter 2–10,000 numbers per condition, one per line. Use a decimal point and omit headings, units and thousands separators. Blank lines are ignored. Use the same measurement and unit for both conditions; names and specification limits are optional.", "Compare the data, then copy the table for Excel or save the shared-scale chart as a PNG. If clipboard access is unavailable, select and copy the fallback text. Changing an input clears the previous results until you compare again."] },
      { heading: "Read the statistics and histograms", paragraphs: ["The mean describes the arithmetic center and the median the middle of the sorted values. Sample standard deviation is the square root of the sum of squared deviations from the mean divided by n−1.", "Both histograms use the same horizontal range, bin widths and percentage scale. Each percentage is relative to its own condition's sample size. The common range includes specification limits and is split into 5–20 bins, so distant limits can make the distributions look narrow.", "Values on a specification limit count as within specification. One-sided limits are supported. The within-specification percentage describes only the entered sample; it is not a guarantee of population yield or future quality."] },
      { heading: "What this comparison cannot establish", paragraphs: ["This tool provides descriptive statistics, not hypothesis tests, confidence intervals or paired-data analysis. Similar means do not prove equivalence, and a before/after difference does not establish causality. Check measurement methods, lots, collection periods and sample sizes before drawing conclusions."] },
    ],
    sources: [
      { title: "NIST — Measures of Scale", url: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm", checkedAt: "2026-09-21" },
      { title: "NIST — Histogram", url: "https://www.itl.nist.gov/div898/handbook/eda/section3/histogra.htm", checkedAt: "2026-09-21" },
    ],
  },
};

export function isEnglishPracticalToolPublished(id: EnglishPracticalToolId) {
  const edition = englishPracticalTools[id];
  return edition.status === "published" && Boolean(edition.reviewedAt && edition.reviewedBy && edition.publishedAt);
}
