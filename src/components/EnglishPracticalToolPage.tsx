import type { ReactNode } from "react";
import { StructuredData } from "@/components/StructuredData";
import { PracticalToolLanguageLink } from "@/components/PracticalToolLanguageLink";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { englishPracticalToolIds, englishPracticalTools, isEnglishPracticalToolPublished, type EnglishPracticalToolId } from "@/data/practical-tools-english";
import { isEnglishCpkPublished } from "@/data/cpk-english";
import { siteUrl } from "@/lib/format";

export function EnglishPracticalToolPage({ id, children, className = "mini-app-page" }: { id: EnglishPracticalToolId; children: ReactNode; className?: string }) {
  const edition = englishPracticalTools[id];
  const published = isEnglishPracticalToolPublished(id);
  return <main className={className}>
    {published ? <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: edition.title, description: edition.description, url: `${siteUrl}/en/tools/${id}`, inLanguage: "en", applicationCategory: "BusinessApplication", operatingSystem: "Web", isAccessibleForFree: true, dateModified: edition.updatedAt }} /> : <aside className="guide-note"><strong>Editorial preview</strong><p>This English edition is awaiting human review and is not yet open for search indexing.</p></aside>}
    <PracticalToolLanguageLink id={id} locale="en" />
    <header className="mini-app-hero"><div><h1>{edition.title}</h1><p>{edition.description}</p></div><p className="privacy-note"><strong>No signup · Calculated in your browser</strong><span>Input data and results are not stored or sent to servers, analytics or external APIs. Inputs are lost when you leave, reload or switch language.</span></p></header>
    {children}
    <nav className="tool-related-links" aria-label="Related tools">
      <span>Related tools</span>
      {englishPracticalToolIds.filter(other => other !== id && isEnglishPracticalToolPublished(other)).map(other => <TrackedInternalLink key={other} href={`/en/tools/${other}`} hrefLang="en" eventName="tool_related_content_click" eventProperties={{ tool_id: id, locale: "en", destination_path: `/en/tools/${other}` }}>{englishPracticalTools[other].title} →</TrackedInternalLink>)}
      {isEnglishCpkPublished() && <TrackedInternalLink href="/en/tools/cpk" hrefLang="en" eventName="tool_related_content_click" eventProperties={{ tool_id: id, locale: "en", destination_path: "/en/tools/cpk" }}>Cp and Cpk calculator →</TrackedInternalLink>}
    </nav>
    <article className="mini-app-document">
      {edition.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
      <section><h2>Sources and edition dates</h2><ul>{edition.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> · Checked <time dateTime={source.checkedAt}>{source.checkedAt}</time></li>)}</ul>
        <p>English edition updated {edition.updatedAt}. Translation date: {edition.translatedAt}. Japanese source content updated: {edition.sourceUpdatedAt}.</p>
        {published && <p>Reviewed by {edition.reviewedBy} on {edition.reviewedAt}. Published {edition.publishedAt}.</p>}
      </section>
    </article>
  </main>;
}
