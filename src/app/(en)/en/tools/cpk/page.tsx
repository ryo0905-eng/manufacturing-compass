import type { Metadata } from "next";
import Link from "next/link";
import { CpkToolExperience } from "@/components/CpkToolExperience";
import { CpkLanguageLink } from "@/components/CpkLanguageLink";
import { StructuredData } from "@/components/StructuredData";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { englishCpkRelease, englishCpkFaq, englishCpkSections, englishCpkSources, isEnglishCpkPublished } from "@/data/cpk-english";
import { siteUrl } from "@/lib/format";

const title = "Cp and Cpk Calculator — Pp, Ppk and Interactive Learning";
const description = "Calculate Pp and Ppk from raw measurements, or Cp and Cpk from a within-process standard deviation. Explore histograms, one-sided limits and an interactive learning model. No signup.";

export function generateMetadata(): Metadata {
  const published = isEnglishCpkPublished();
  return {
    title, description,
    robots: { index: published, follow: true },
    alternates: {
      canonical: "/en/tools/cpk",
      ...(published ? { languages: { ja: `${siteUrl}/tools/cpk`, en: `${siteUrl}/en/tools/cpk` } } : {}),
    },
    openGraph: { type: "website", locale: "en_US", title, description, url: `${siteUrl}/en/tools/cpk` },
    twitter: { card: "summary", title, description },
  };
}

export default function EnglishCpkPage() {
  const published = isEnglishCpkPublished();
  return <main className="cpk-page cpk-page--analysis">
    {published ? <>
      <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Cp and Cpk Calculator", url: `${siteUrl}/en/tools/cpk`, applicationCategory: "BusinessApplication", operatingSystem: "Web", inLanguage: "en", isAccessibleForFree: true, dateModified: englishCpkRelease.updatedAt }} />
      <StructuredData data={{ "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "en", mainEntity: englishCpkFaq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }} />
    </> : <aside className="guide-note"><strong>Editorial preview</strong><p>This English edition is awaiting human review and is not yet open for search indexing.</p></aside>}
    <CpkLanguageLink locale="en" />
    <header className="cpk-compact-hero">
      <div><h1>Cp and Cpk Calculator</h1><p>Explore process capability and distribution using measurements and specification limits.</p></div>
      <p className="privacy-note"><strong>No signup · Calculated in your browser</strong><span>Input data is not sent to servers, analytics or external APIs.</span></p>
    </header>
    <CpkToolExperience locale="en" />
    <nav className="tool-related-links" aria-label="Related tools (Japanese)">
      <span>Related tools (Japanese)</span>
      <TrackedInternalLink href="/tools/control-chart" hrefLang="ja" eventName="cpk_related_content_click" eventProperties={{ destination: "control_chart", locale: "en" }}>Control charts (Japanese) →</TrackedInternalLink>
      <TrackedInternalLink href="/tools/doe" hrefLang="ja" eventName="cpk_related_content_click" eventProperties={{ destination: "doe", locale: "en" }}>Design of experiments (Japanese) →</TrackedInternalLink>
      <Link href="/tools/process-comparison" hrefLang="ja">Compare two sets of measurements (Japanese) →</Link>
    </nav>
    <article className="capability-document">
      <header><h2>Understanding your results</h2><p>Check which standard deviation and specification limits the calculation uses.</p></header>
      {englishCpkSections.map(section => <section key={section.heading}><h3>{section.heading}</h3>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
      <section className="capability-faq"><h3>Frequently asked questions</h3>{englishCpkFaq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
      <section><h3>Sources and edition dates</h3>
        <ul>{englishCpkSources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> · Checked <time dateTime={source.checkedAt}>{source.checkedAt}</time></li>)}</ul>
        <p>English edition updated <time dateTime={englishCpkRelease.updatedAt}>{englishCpkRelease.updatedAt}</time>. Translation date: {englishCpkRelease.translatedAt}.</p>
        {published ? <p>Reviewed by RYO on {englishCpkRelease.reviewedAt}. Published {englishCpkRelease.publishedAt}.</p> : null}
      </section>
    </article>
  </main>;
}
