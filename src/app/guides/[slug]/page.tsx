import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/AffiliateCta";
import { DiagnosisCta } from "@/components/DiagnosisCta";
import { StructuredData } from "@/components/StructuredData";
import { TodayAction } from "@/components/TodayAction";
import { GuideBlocks } from "@/components/guide/GuideBlocks";
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

  const relatedGuides = guide.relatedGuideSlugs
    .map((relatedSlug) => getGuideBySlug(relatedSlug))
    .filter((relatedGuide) => relatedGuide !== undefined);
  const faqItems = [
    ...(guide.overviewBlocks ?? []),
    ...guide.sections.flatMap((section) => section.blocks ?? []),
  ].flatMap((block) => block.type === "faq" ? block.items : []);

  return (
    <main className="page guide-page">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, author: { "@type": "Person", name: guide.author }, publisher: { "@type": "Organization", name: "Manufacturing Compass" }, datePublished: guide.publishedAt, dateModified: guide.updatedAt, citation: guide.sources.map((source) => source.url), mainEntityOfPage: `${siteUrl}/guides/${guide.slug}`, inLanguage: "ja" }} />
      {faqItems.length > 0 ? <StructuredData data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }} /> : null}
      <article className="article-layout">
        <header className="article-hero">
          <p className="section-label">製造業から半導体を考えるガイド・{guide.readTime}</p>
          <h1>{guide.title}</h1>
          <p>{guide.description}</p>
          <small>執筆・確認：{guide.reviewedBy}（製造業経験 約10年）・最終更新 <time dateTime={guide.updatedAt}>{guide.updatedAt.replaceAll("-", ".")}</time></small>
          <dl className="guide-intro-summary">
            <div><dt>悩み</dt><dd>{guide.intro.problem}</dd></div>
            <div><dt>結論</dt><dd>{guide.intro.conclusion}</dd></div>
            <div><dt>読むと分かること</dt><dd>{guide.intro.learnings}</dd></div>
          </dl>
          <aside className="guide-experience-basis" aria-label={guide.basisLabel ?? "この記事の実体験の根拠"}>
            <strong>{guide.basisLabel ?? "この記事の実体験の根拠"}</strong>
            <ul>{guide.experienceBasis.map((item) => <li key={item}>{item}</li>)}</ul>
            <small>{guide.basisNote ?? (guide.basisLabel
              ? "ランキングデータと企業分類の確認方法を明記し、記事末尾に主要な出典を掲載しています。"
              : guide.sources.length > 0
              ? "実体験と一般情報を分け、一般情報は記事末尾の公開情報で確認しています。"
              : "運営者本人の実体験をもとに、事実、判断、AIによる推測を分けて記載しています。")}</small>
          </aside>
        </header>

        {guide.overviewBlocks ? <GuideBlocks blocks={guide.overviewBlocks} /> : null}

        {guide.sections.length >= 4 ? (
          <nav className="guide-toc" aria-label="記事の目次">
            <strong>この記事の流れ</strong>
            <ol>
              {guide.sections.map((section, index) => (
                <li key={section.heading}><a href={`#${section.id ?? `section-${index + 1}`}`}>{section.heading}</a></li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="article-body">
          {guide.sections.map((section, index) => (
            <section id={section.id ?? `section-${index + 1}`} key={section.heading}>
              <h2>{section.heading}</h2>
              {section.lead ? <p className="guide-section-lead">{section.lead}</p> : null}
              {section.blocks ? <GuideBlocks blocks={section.blocks} /> : null}
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.points ? <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
            </section>
          ))}
        </div>

        {guide.sources.length > 0 ? (
          <section className="guide-sources" aria-labelledby="guide-sources-title">
            <p className="section-label">確認した公開情報</p>
            <h2 id="guide-sources-title">参考情報・出典</h2>
            <ul>
              {guide.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} rel="noopener noreferrer" target="_blank">{source.title}</a>
                  <span>{source.publisher}・確認日 {source.accessedAt.replaceAll("-", ".")}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {relatedGuides.length > 0 ? (
          <nav className="guide-related" aria-label="関連記事">
            <strong>次に読むガイド</strong>
            {relatedGuides.map((relatedGuide) => <Link href={`/guides/${relatedGuide.slug}`} key={relatedGuide.slug}>{relatedGuide.title}<span aria-hidden="true">→</span></Link>)}
          </nav>
        ) : null}

        <TodayAction action={guide.todayQuest} />

        {guide.showCareerCtas === false ? null : (
          <>
            <AffiliateCta
              title="整理した経験を、どの相談先に伝えるか決める"
              body="記事で整理した経験や希望条件をもとに、製造業・半導体、外資系、専門職など、相談したい内容に合う転職エージェントを比較できます。"
            />
            <DiagnosisCta title="自分の経験に近い半導体職種を確かめる" body="記事で書き出した経験をもとに、強み、足りない経験、次の準備を12問で確認できます。" />
          </>
        )}
        <p className="back-link"><Link className="text-link" href="/guides">ガイド一覧へ戻る</Link></p>
      </article>
    </main>
  );
}
