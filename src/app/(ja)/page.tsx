import type { Metadata } from "next";
import { CareerResultPreview } from "@/components/CareerResultPreview";
import { CareerPrioritiesLink } from "@/components/CareerPrioritiesLink";
import { CareerCompassLink } from "@/components/CareerCompassLink";
import { HomeLink } from "@/components/HomeLink";
import { HomeToolPreview } from "@/components/HomeToolPreview";
import { GuideThumbnail } from "@/components/guide/GuideThumbnail";
import { StructuredData } from "@/components/StructuredData";
import { guideCategoryDetails, guideCategoryOrder } from "@/content/guides/categories";
import type { GuideArticle } from "@/content/guides/types";
import { beginnerGuides } from "@/data/editorial";
import { homeGuideSlugs, homeResearchLinks, homeToolIds } from "@/data/home";
import { learningTools } from "@/data/learning-tools";
import { siteUrl } from "@/lib/format";

const title = "製造業の技術と、半導体の仕事を理解する。";
const description = "実務ツールで技術を学び、記事と業界地図で企業を調べ、自分の経験と次の準備を整理できます。";

export const metadata: Metadata = {
  title: { absolute: `${title} | Manufacturing Compass` },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: siteUrl },
};

const recommendedArticles = homeGuideSlugs.flatMap((slug) => {
  const article = beginnerGuides.find((guide) => guide.slug === slug);
  return article ? [article] : [];
});
const recommendedSlugs = new Set(recommendedArticles.map((article) => article.slug));
const latestArticles = beginnerGuides
  .filter((article) => !recommendedSlugs.has(article.slug))
  .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt) || left.slug.localeCompare(right.slug))
  .slice(0, 4);

function ArticleCard({ article, section }: { article: GuideArticle; section: "recommended" | "latest" }) {
  return (
    <HomeLink className="home-focused__article-card" href={`/guides/${article.slug}`} section={section} destination={article.slug} purpose="articles">
      <GuideThumbnail category={article.category} compact slug={article.slug} title={article.title} />
      <span>{guideCategoryDetails[article.category].label}<time dateTime={article.publishedAt}>{article.publishedAt.replaceAll("-", ".")}</time></span>
      <strong>{article.title}</strong>
      <p>{article.description}</p>
      <i aria-hidden="true">→</i>
    </HomeLink>
  );
}

export default function Home() {
  return (
    <main className="home-focused">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "WebSite", name: "Manufacturing Compass", url: siteUrl, inLanguage: "ja" }} />
      <section className="home-focused__hero" aria-labelledby="home-title">
        <h1 id="home-title">{title}</h1>
        <p>{description}</p>
        <nav className="home-focused__entry-grid" aria-label="目的から選ぶ">
          <HomeLink href="/tools" section="hero" destination="tools" purpose="technology">技術を学ぶ・使う<span aria-hidden="true">→</span></HomeLink>
          <HomeLink href="/industry-map" section="hero" destination="industry_map" purpose="industry">企業・業界を調べる<span aria-hidden="true">→</span></HomeLink>
          <CareerCompassLink ctaLocation="home_hero_purpose" ctaVariant="purpose_entry_v1" sourcePage="/">キャリアを整理する<span aria-hidden="true">→</span></CareerCompassLink>
        </nav>
      </section>

      <section className="home-focused__section" aria-labelledby="home-tools-title">
        <header className="home-focused__heading"><h2 id="home-tools-title">技術を学ぶ・使う</h2><p>測定値の比較や、グラフを通じた学び直しに。今の用事に合うツールから試せます。</p></header>
        <div className="home-focused__tool-grid">
          {homeToolIds.map((id) => {
            const tool = learningTools.find((item) => item.id === id);
            if (!tool) return null;
            return <HomeLink className="home-focused__tool-card" href={tool.href} key={id} section="tools" destination={id} purpose="technology">
              <h3>{tool.title}</h3><HomeToolPreview id={id} /><p>{tool.description}</p><span className="home-focused__text-link">{id === "yield-dashboard" ? "架空データで学ぶ" : "ツールを使う"}<i aria-hidden="true"> →</i></span>
            </HomeLink>;
          })}
        </div>
        <nav className="home-focused__tool-links" aria-label="その他の学習ツール">
          <HomeLink className="home-focused__text-link home-focused__more" href="/tools/ai-visual-inspection" section="tools" destination="ai-visual-inspection" purpose="technology">教育用・試用版：AI外観検査ラボで、ルールとAIを比べる →</HomeLink>
          <HomeLink className="home-focused__text-link home-focused__more" href="/tools" section="tools" destination="tools" purpose="technology">ツールをすべて見る →</HomeLink>
        </nav>
      </section>

      <section className="home-focused__section" aria-labelledby="home-research-title">
        <header className="home-focused__heading"><h2 id="home-research-title">半導体の企業・業界を調べる</h2><p>業界全体のつながりから、気になる企業や製品の違いまで確認できます。</p></header>
        <nav className="home-focused__research-grid" aria-label="企業・業界研究の入口">
          {homeResearchLinks.map((item) => <HomeLink href={item.href} key={item.id} section="research" destination={item.id} purpose="industry"><strong>{item.title}<span aria-hidden="true"> →</span></strong><p>{item.body}</p></HomeLink>)}
        </nav>
      </section>

      <section className="home-focused__section home-focused__career" aria-labelledby="home-career-title">
        <div>
          <header className="home-focused__heading"><h2 id="home-career-title">経験と次の準備を整理する</h2><p>今の仕事と半導体職種の接点を見つけ、次に準備したいことを整理します。</p></header>
          <CareerCompassLink className="home-focused__button" ctaLocation="home_career_section" ctaVariant="purpose_entry_v1" sourcePage="/">Career Compassで経験を整理する</CareerCompassLink>
          <p className="home-focused__assurance">12問・登録不要・回答は保存されません</p>
          <nav className="home-focused__career-links" aria-label="キャリアを考える補助ツール">
            <CareerPrioritiesLink className="home-focused__text-link" ctaLocation="home_career_support">転職の軸ノートで優先順位を整理する →</CareerPrioritiesLink>
            <HomeLink className="home-focused__text-link" href="/roles" section="career" destination="roles" purpose="career">仕事内容から職種を探す →</HomeLink>
          </nav>
        </div>
        <CareerResultPreview />
      </section>

      <section className="home-focused__section" aria-labelledby="home-recommended-title">
        <header className="home-focused__heading"><h2 id="home-recommended-title">はじめに読みたい記事</h2><p>半導体の工程、企業の役割、キャリアの準備を理解するために選んだ3記事です。</p></header>
        <div className="home-focused__article-grid home-focused__article-grid--recommended">{recommendedArticles.map((article) => <ArticleCard article={article} section="recommended" key={article.slug} />)}</div>
      </section>

      <section className="home-focused__section" aria-labelledby="home-latest-title">
        <header className="home-focused__heading"><h2 id="home-latest-title">最新記事</h2><p>最近公開した記事を紹介します。</p></header>
        <nav className="home-focused__article-categories" aria-label="記事のカテゴリ">{guideCategoryOrder.map((category) => <HomeLink href={`/guides#guide-category-${category}`} key={category} section="latest" destination={`category_${category}`} purpose="articles">{guideCategoryDetails[category].label}</HomeLink>)}</nav>
        <div className="home-focused__article-grid">{latestArticles.map((article) => <ArticleCard article={article} section="latest" key={article.slug} />)}</div>
        <HomeLink className="home-focused__text-link home-focused__more" href="/guides" section="latest" destination="guides" purpose="articles">すべての記事を見る →</HomeLink>
      </section>

      <section className="home-focused__section home-focused__about" aria-labelledby="home-about-title">
        <div><h2 id="home-about-title">運営者と情報の扱い</h2><p>Manufacturing Compassは、製造業で約10年働いてきたRYOが運営しています。技術とキャリアについて、次に何を確認するかを考えるための情報を届けます。</p><HomeLink className="home-focused__text-link" href="/about" section="about" destination="about" purpose="about">運営者について →</HomeLink></div>
        <ul><li>企業公式、IR、官公庁などの公開情報を優先</li><li>事実と運営者の実体験を分けて掲載</li><li>企業情報には出典と確認日を表示</li></ul>
      </section>
    </main>
  );
}
