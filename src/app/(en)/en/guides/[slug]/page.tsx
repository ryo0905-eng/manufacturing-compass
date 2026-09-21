import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideBlocks } from "@/components/guide/GuideBlocks";
import { GuideLanguageLink } from "@/components/guide/GuideLanguageLink";
import { StructuredData } from "@/components/StructuredData";
import { englishGuides, getEnglishGuide, isEnglishGuidePublished } from "@/content/guides/en";
import { siteUrl } from "@/lib/format";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // Drafts are reviewable by URL, but are noindex and excluded from discovery links.
  return englishGuides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getEnglishGuide(slug);
  if (!guide) return {};
  const published = isEnglishGuidePublished(guide);
  const path = `/en/guides/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    robots: published ? { index: true, follow: true } : { index: false, follow: true },
    alternates: {
      canonical: path,
      ...(published ? { languages: {
        ja: `${siteUrl}/guides/${guide.translation.sourceSlug}`,
        en: `${siteUrl}${path}`,
      } } : {}),
    },
    openGraph: {
      type: "article", locale: "en_US", url: path,
      title: guide.title, description: guide.description,
      ...(published ? { publishedTime: guide.publishedAt } : {}),
      modifiedTime: guide.updatedAt, authors: [guide.author],
    },
    twitter: { card: "summary", title: guide.title, description: guide.description },
  };
}

export default async function EnglishGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getEnglishGuide(slug);
  if (!guide) notFound();
  const published = isEnglishGuidePublished(guide);
  const faqItems = [...(guide.overviewBlocks ?? []), ...guide.sections.flatMap((section) => section.blocks ?? [])]
    .flatMap((block) => block.type === "faq" ? block.items : []);

  return <main className="page guide-page">
    {published ? <>
      <StructuredData data={{
        "@context": "https://schema.org", "@type": "Article",
        headline: guide.title, description: guide.description,
        author: { "@type": "Person", name: guide.author },
        publisher: { "@type": "Organization", name: "Manufacturing Compass" },
        datePublished: guide.publishedAt, dateModified: guide.updatedAt,
        citation: guide.sources.map((source) => source.url),
        mainEntityOfPage: `${siteUrl}/en/guides/${guide.slug}`, inLanguage: "en",
        translationOfWork: { "@type": "Article", url: `${siteUrl}/guides/${guide.translation.sourceSlug}`, inLanguage: "ja" },
      }} />
      {faqItems.length ? <StructuredData data={{ "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "en", mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }} /> : null}
    </> : null}
    <article className="article-layout">
      <header className="article-hero">
        <GuideLanguageLink slug={guide.translation.sourceSlug} locale="en" />
        {!published ? <aside className="guide-note"><strong>Editorial preview</strong><p>This English edition is awaiting human review and is not yet open for search indexing.</p></aside> : null}
        <p className="section-label">Semiconductor equipment · {guide.readTime}</p>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
        <small>By {guide.author} · English edition updated <time dateTime={guide.updatedAt}>{guide.updatedAt}</time>
          {published ? <> · Published <time dateTime={guide.publishedAt}>{guide.publishedAt}</time> · Reviewed by {guide.reviewedBy} on <time dateTime={guide.translation.reviewedAt!}>{guide.translation.reviewedAt}</time></> : null}
        </small>
        <p className="section-label">Adapted from the Japanese edition updated {guide.translation.sourceUpdatedAt}. Translated {guide.translation.translatedAt}. Source check dates are listed below.</p>
        <dl className="guide-intro-summary">
          <div><dt>The question</dt><dd>{guide.intro.problem}</dd></div>
          <div><dt>The answer</dt><dd>{guide.intro.conclusion}</dd></div>
          <div><dt>What you will learn</dt><dd>{guide.intro.learnings}</dd></div>
        </dl>
      </header>
      {guide.overviewBlocks ? <GuideBlocks blocks={guide.overviewBlocks} sourceSlug={guide.slug} locale="en" /> : null}
      <nav className="guide-toc" aria-label="Table of contents">
        <strong>In this guide</strong>
        <ol>{guide.sections.map((section, index) => <li key={section.id ?? index}><a href={`#${section.id ?? `section-${index + 1}`}`}>{section.heading}</a></li>)}</ol>
      </nav>
      <div className="article-body">
        {guide.sections.map((section, index) => <section id={section.id ?? `section-${index + 1}`} key={section.id ?? index}>
          <h2>{section.heading}</h2>
          {section.lead ? <p className="guide-section-lead">{section.lead}</p> : null}
          {section.blocks ? <GuideBlocks blocks={section.blocks} sourceSlug={guide.slug} locale="en" /> : null}
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.points ? <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
        </section>)}
      </div>
      <section className="guide-sources" aria-labelledby="guide-sources-title">
        <h2 id="guide-sources-title">Sources and references</h2>
        <p>Manufacturer pages support the product examples. Comparison questions are editorial guidance, not product specifications or a supplier ranking.</p>
        <ul>{guide.sources.map((source) => <li key={source.url}>
          <a href={source.url} rel="noopener noreferrer" target="_blank">{source.title}</a>
          <span>{source.publisher} · Checked <time dateTime={source.accessedAt}>{source.accessedAt}</time></span>
        </li>)}</ul>
      </section>
    </article>
  </main>;
}
