import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentCta } from "@/components/AgentCta";
import { DiagnosisCta } from "@/components/DiagnosisCta";
import { StructuredData } from "@/components/StructuredData";
import { TodayAction } from "@/components/TodayAction";
import { beginnerGuides, getGuideBySlug } from "@/data/editorial";
import { siteUrl } from "@/lib/format";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return beginnerGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <main className="page guide-page">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, author: { "@type": "Person", name: "RYO" }, publisher: { "@type": "Organization", name: "Manufacturing Compass" }, mainEntityOfPage: `${siteUrl}/guides/${guide.slug}`, inLanguage: "ja" }} />
      <article className="article-layout">
        <header className="article-hero">
          <p className="section-label">製造業から半導体を考えるガイド・{guide.readTime}</p>
          <h1>{guide.title}</h1>
          <p>{guide.description}</p>
          <small>執筆：RYO（製造業経験 約10年）</small>
          <dl className="guide-intro-summary">
            <div><dt>悩み</dt><dd>{guide.intro.problem}</dd></div>
            <div><dt>結論</dt><dd>{guide.intro.conclusion}</dd></div>
            <div><dt>読むと分かること</dt><dd>{guide.intro.learnings}</dd></div>
          </dl>
        </header>

        <div className="article-body">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.points ? <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
            </section>
          ))}
        </div>

        <TodayAction action={guide.todayQuest} />

        <AgentCta agentId="ties" />

        <DiagnosisCta title="自分の経験に近い半導体職種を確かめる" body="記事で書き出した経験をもとに、強み、足りない経験、次の準備を12問で確認できます。" />
        <p className="back-link"><Link className="text-link" href="/guides">ガイド一覧へ戻る</Link></p>
      </article>
    </main>
  );
}
