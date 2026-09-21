/** Publication metadata for the English Cpk tool. */
export const englishCpkRelease: {
  status: "draft" | "published";
  translatedAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  publishedAt: string | null;
} = {
  status: "published",
  translatedAt: "2026-09-21",
  updatedAt: "2026-09-21",
  reviewedAt: "2026-09-21",
  publishedAt: "2026-09-21",
};

export function isEnglishCpkPublished() {
  return englishCpkRelease.status === "published" && Boolean(englishCpkRelease.reviewedAt) && Boolean(englishCpkRelease.publishedAt);
}

export const englishCpkFaq = [
  { question: "Why does raw data produce Pp and Ppk?", answer: "The raw-data calculation uses the overall sample standard deviation of all supplied measurements. It does not estimate within-subgroup variation, so the output is labeled Pp and Ppk." },
  { question: "Can I use a one-sided specification?", answer: "Yes. Supply only USL for an upper-sided index (Ppu or Cpu), or only LSL for a lower-sided index (Ppl or Cpl). Pp and Cp require both limits and are not shown for a one-sided specification." },
  { question: "Does Cpk of 1.33 guarantee a good process?", answer: "No. 1.33 is a commonly used reference, not a guarantee of quality or stability. Consider customer requirements, internal standards, the measurement system, sampling and the process distribution." },
];

export const englishCpkSections = [
  { heading: "Cp and Cpk versus Pp and Ppk", paragraphs: [
    "Cp and Cpk use a within-process standard deviation, often estimated from variation within rational subgroups. Pp and Ppk use overall standard deviation. Here, raw data uses the sample standard deviation with denominator n−1. The tool does not infer subgroup structure or a time horizon from pasted values.",
    "In the mean-and-standard-deviation mode, supply your own appropriate short-term estimate. The tool labels these results Cp and Cpk; it does not estimate the within-process standard deviation for you.",
  ] },
  { heading: "How the indices are calculated", paragraphs: [
    "Cp = (USL − LSL) / (6σ). Cpu = (USL − mean) / (3σ), Cpl = (mean − LSL) / (3σ), and Cpk is the smaller of Cpu and Cpl. For Pp, Ppu, Ppl and Ppk, this tool uses the overall sample standard deviation in the same expressions.",
    "USL and LSL are specification limits, not control limits. With only one specification limit, the corresponding one-sided index is shown; a specification midpoint and a two-sided potential index are undefined.",
  ] },
  { heading: "Read 1.33 as a reference, not a pass/fail rule", paragraphs: [
    "The appropriate capability requirement depends on the product, process stage, customer and internal criteria. A displayed value cannot guarantee product quality. A negative Cpk or Ppk means the mean is beyond the specified limit; zero means the mean is on that limit.",
  ] },
  { heading: "Check stability and the measurement system separately", paragraphs: [
    "Examine time-ordered data with an appropriate control chart, and consider measurement variation, sampling, material lots and the shape of the distribution. Capability indices alone do not demonstrate statistical control or establish a cause for poor performance.",
    "Do not infer an actual nonconforming rate from these indices without checking the distributional assumptions. The learning curves are theoretical normal distributions, not fitted evidence of normality in your measurements.",
  ] },
  { heading: "Using the calculator and learning mode", paragraphs: [
    "The calculator starts with a fixed illustrative dataset. Select another example, paste your own measurements, or supply summary statistics. Use a decimal point, separate values with newlines, commas or tabs, and omit thousands separators and units. Click Calculate after editing. Invalid tokens are counted; correct them before relying on the result.",
    "The histogram is available only for raw data. Copy results to take the numerical summary and explanation into your notes. If clipboard access fails, select and copy the read-only text manually.",
    "In Explore and learn, change the mean, standard deviation or limits while comparing with a saved baseline. Presets update the current conditions; Reset restores both sets of values. Moving a specification limit changes the evaluation, not the process itself.",
  ] },
  { heading: "Privacy and limitations", paragraphs: [
    "Calculations run in your browser. Measurements, specification values, results and clipboard text are not sent to a server, analytics service or external API, and are not saved by this tool. Reloading the page or switching language clears the working state.",
    "Site analytics record fixed interaction categories, such as input mode, sample ID and language. This tool does not replace a validated capability study or your organization's decision process.",
  ] },
];

export const englishCpkSources = [
  { title: "NIST — What is Process Capability?", url: "https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm", checkedAt: "2026-09-21" },
  { title: "Minitab — Overall capability for Normal Capability Analysis", url: "https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/capability-analysis/how-to/capability-analysis/normal-capability-analysis/interpret-the-results/all-statistics-and-graphs/overall-capability/", checkedAt: "2026-09-21" },
  { title: "Minitab — Potential (within) capability for Normal Capability Analysis", url: "https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/capability-analysis/how-to/capability-analysis/normal-capability-analysis/interpret-the-results/all-statistics-and-graphs/potential-within-capability/", checkedAt: "2026-09-21" },
];
