import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateCta } from "@/components/AffiliateCta";
import { GuideThumbnail } from "@/components/guide/GuideThumbnail";
import { StructuredData } from "@/components/StructuredData";
import { guideCategoryDetails, guideCategoryOrder } from "@/content/guides/categories";
import { beginnerGuides } from "@/data/editorial";
import {
  semiconductorProcessSeriesDetailSlugs as processSeriesDetailSlugs,
  semiconductorProcessSeriesHubSlug as processSeriesHubSlug,
  semiconductorProcessSeriesPhases as processSeriesPhases,
  semiconductorProcessSeriesSlugs as processSeriesSlugs,
} from "@/data/guide-series";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "半導体・製造業DXの記事と実体験",
  description: "製造業DX・AI、半導体・製造技術、企業・業界研究、キャリアの実体験を、公開情報と運営者の経験を分けて解説します。",
  alternates: { canonical: "/guides" },
};

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

export default function GuidesPage() {
  const featuredGuide = beginnerGuides.find((guide) => guide.featured) ?? beginnerGuides[0];
  const processSeriesGuides = processSeriesSlugs
    .map((slug) => beginnerGuides.find((guide) => guide.slug === slug))
    .filter((guide) => guide !== undefined);
  const processHubGuide = processSeriesGuides.find((guide) => guide.slug === processSeriesHubSlug);
  const processGuideNumbers = new Map<string, number>(
    processSeriesDetailSlugs.map((slug, index) => [slug, index + 1]),
  );
  const processPhases = processSeriesPhases.map((phase) => ({
    ...phase,
    guides: phase.slugs
      .map((slug) => processSeriesGuides.find((guide) => guide.slug === slug))
      .filter((guide) => guide !== undefined),
  }));
  const processSeriesSlugSet = new Set(processSeriesSlugs);
  const otherGuides = beginnerGuides.filter(
    (guide) => guide.slug !== featuredGuide.slug && !processSeriesSlugSet.has(guide.slug),
  );
  const categorizedGuides = guideCategoryOrder.map((category) => ({
    category,
    guides: otherGuides.filter((guide) => guide.category === category),
  }));

  return (
    <main className="page guides-hub-page">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "ItemList", name: "半導体製造工程シリーズ", numberOfItems: processSeriesGuides.length, itemListElement: processSeriesGuides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, name: guide.title, url: `${siteUrl}/guides/${guide.slug}` })) }} />
      <section className="guides-hub-hero">
        <div className="guides-hub-hero__copy">
          <p className="section-label">製造業・半導体を深く知る</p>
          <h1>記事・読みもの</h1>
          <p>AI活用、技術解説、企業研究、キャリアの実体験を、公開情報と運営者の経験を分けてまとめています。</p>
        </div>
        <aside className="guides-author-card" aria-label="執筆者について">
          <p>WRITTEN &amp; REVIEWED BY</p>
          <strong>RYO</strong>
          <span>製造業経験 約10年</span>
          <p>電子部品の製造技術・品質・海外工場・製造DXを経て、外資系半導体企業のRFフィルタ事業へ。実体験と公開情報を分けて書きます。</p>
          <Link href="/about">執筆者と編集方針を見る <span aria-hidden="true">→</span></Link>
        </aside>
      </section>

      <nav className="guides-category-nav" aria-label="記事のカテゴリ">
        {guideCategoryOrder.map((category) => (
          <Link href={`#guide-category-${category}`} key={category}>
            <strong>{guideCategoryDetails[category].label}</strong>
            <span>{guideCategoryDetails[category].description}</span>
            <i aria-hidden="true">↓</i>
          </Link>
        ))}
      </nav>

      <section className="guides-feature" aria-labelledby="featured-guide-title">
        <header className="guides-section-heading">
          <div><p className="section-label">Featured story</p><h2 id="featured-guide-title">まず読んでほしい、転職の実体験</h2></div>
          <p>成功談だけでなく、異業種でのミスマッチや短期離職、経験の近い部分と未経験部分の分け方まで記録しました。</p>
        </header>
        <Link className="guides-feature-card" href={`/guides/${featuredGuide.slug}`}>
          <div className="guides-feature-route" aria-hidden="true">
            <span>RYO&apos;S CAREER STORY</span>
            <ol>
              <li><small>01</small><strong>電子部品</strong><p>工程改善・品質</p></li>
              <li><small>02</small><strong>異業種DX</strong><p>ミスマッチ</p></li>
              <li><small>03</small><strong>外資系半導体</strong><p>RFフィルタのプロセス職</p></li>
            </ol>
          </div>
          <div className="guides-feature-copy">
            <span className={`guides-category guides-category--${featuredGuide.category}`}>{guideCategoryDetails[featuredGuide.category].label}</span>
            <h3>{featuredGuide.title}</h3>
            <p>{featuredGuide.description}</p>
            <dl>
              <div><dt>執筆・確認</dt><dd>{featuredGuide.reviewedBy}</dd></div>
              <div><dt>公開日</dt><dd><time dateTime={featuredGuide.publishedAt}>{formatDate(featuredGuide.publishedAt)}</time></dd></div>
              <div><dt>読了時間</dt><dd>{featuredGuide.readTime}</dd></div>
            </dl>
            <strong className="guides-read-link">実体験を読む <span aria-hidden="true">→</span></strong>
          </div>
        </Link>
      </section>

      <section className="guides-process-series" aria-labelledby="process-series-title">
        <header className="guides-section-heading">
          <div><p className="section-label">Semiconductor process</p><h2 id="process-series-title">半導体ができるまでを、工程順に読む</h2></div>
          <p>まず全体像をつかみ、気になった工程へ進める全15記事のシリーズです。図解とやさしい言葉で、工程前後の変化と仕組みを整理します。</p>
        </header>

        {processHubGuide ? (
          <Link className="guides-process-hub" href={`/guides/${processHubGuide.slug}`}>
            <div className="guides-process-hub__copy">
              <span>START HERE · 全体像</span>
              <h3>{processHubGuide.title}</h3>
              <p>{processHubGuide.description}</p>
              <strong>最初に全工程を見る <span aria-hidden="true">→</span></strong>
            </div>
            <ol className="guides-process-hub__route" aria-label="半導体製造の4段階">
              {processSeriesPhases.map((phase) => (
                <li key={phase.number}><small>{phase.number}</small><span>{phase.label}</span></li>
              ))}
            </ol>
          </Link>
        ) : null}

        <div className="guides-process-phases">
          {processPhases.map((phase) => (
            <section className="guides-process-phase" key={phase.number} aria-labelledby={`process-phase-${phase.number}`}>
              <header>
                <span>{phase.number}</span>
                <div><small>{phase.label}</small><h3 id={`process-phase-${phase.number}`}>{phase.title}</h3></div>
              </header>
              <p>{phase.description}</p>
              <ol>
                {phase.guides.map((guide) => (
                  <li key={guide.slug}>
                    <Link href={`/guides/${guide.slug}`}>
                      <span>{String(processGuideNumbers.get(guide.slug) ?? "").padStart(2, "0")}</span>
                      <strong>{guide.title.split("とは？")[0]}の仕組み</strong>
                      <i aria-hidden="true">→</i>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </section>

      <section className="guides-library" aria-labelledby="guide-library-title">
        <header className="guides-section-heading">
          <div><p className="section-label">Article library</p><h2 id="guide-library-title">テーマから読む</h2></div>
          <p>関心のあるテーマから、AI活用、技術、企業、キャリアの記事へ進めます。</p>
        </header>
        <div className="guides-library__groups">
          {categorizedGuides.map(({ category, guides }) => (
            guides.length > 0 ? (
              <section className="guides-category-section" id={`guide-category-${category}`} key={category} aria-labelledby={`guide-category-${category}-title`}>
                <header className="guides-category-section__heading">
                  <div>
                    <h3 id={`guide-category-${category}-title`}>{guideCategoryDetails[category].label}</h3>
                    <p>{guideCategoryDetails[category].description}</p>
                  </div>
                  <span>{guides.length}記事</span>
                </header>
                <div className="guides-card-grid">
                  {guides.map((guide) => (
                    <Link className={`guides-article-card guides-article-card--${guide.category}`} href={`/guides/${guide.slug}`} key={guide.slug}>
                      <GuideThumbnail category={guide.category} slug={guide.slug} title={guide.title} />
                      <div className="guides-article-card__meta">
                        <span className={`guides-category guides-category--${guide.category}`}>{guideCategoryDetails[guide.category].label}</span>
                        <span>{guide.readTime}</span>
                      </div>
                      <h3>{guide.title}</h3>
                      <p>{guide.description}</p>
                      <div className="guides-article-card__quest">
                        <small>Today Quest</small>
                        <strong>{guide.todayQuest}</strong>
                      </div>
                      <footer>
                        <span>RYO</span>
                        <time dateTime={guide.updatedAt}>更新 {formatDate(guide.updatedAt)}</time>
                        <i aria-hidden="true">→</i>
                      </footer>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null
          ))}
        </div>
      </section>

      <AffiliateCta title="記事を読んだ後、転職ルートを相談する" />
    </main>
  );
}
