import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentCta } from "@/components/AgentCta";
import { AffiliateCta } from "@/components/AffiliateCta";
import { beginnerGuides, getGuideBySlug } from "@/data/editorial";

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
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <main className="page">
      <article className="article-layout">
        <header className="article-hero">
          <p className="eyebrow">Starter guide / {guide.readTime}</p>
          <h1>{guide.title}</h1>
          <p>{guide.description}</p>
        </header>

        <div className="article-body">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>

        <section className="today-quest-card article-quest">
          <div className="quest-check" aria-hidden="true" />
          <div>
            <span>Today Quest</span>
            <strong>{guide.todayQuest}</strong>
            <small>診断で自分向けに調整できます</small>
          </div>
        </section>

        <AgentCta agentId="ties" />

        <div className="actions">
          <Link className="button primary" href="/career-compass">
            Questを開始する
          </Link>
          <Link className="button ghost" href="/guides">
            ガイド一覧へ
          </Link>
        </div>
      </article>

      <AffiliateCta title="職務経歴書にどう書くか相談する" />
    </main>
  );
}
