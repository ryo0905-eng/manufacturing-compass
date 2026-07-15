import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateCta } from "@/components/AffiliateCta";
import { GuideThumbnail } from "@/components/guide/GuideThumbnail";
import type { GuideCategory } from "@/content/guides/types";
import { beginnerGuides } from "@/data/editorial";

export const metadata: Metadata = {
  title: "半導体業界・転職のガイドと実体験",
  description: "半導体の製造工程、企業、職種、求人の見方を、公開情報と製造業経験約10年のRYOの実体験を分けて解説します。",
  alternates: { canonical: "/guides" },
};

const categoryLabels: Record<GuideCategory, string> = {
  experience: "RYOの実体験",
  foundation: "半導体転職の基本",
  role: "職種別ルート",
  technology: "半導体の技術",
};

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

export default function GuidesPage() {
  const featuredGuide = beginnerGuides.find((guide) => guide.featured) ?? beginnerGuides[0];
  const otherGuides = beginnerGuides.filter((guide) => guide.slug !== featuredGuide.slug);

  return (
    <main className="page guides-hub-page">
      <section className="guides-hub-hero">
        <div className="guides-hub-hero__copy">
          <p className="section-label">製造業から半導体を考える</p>
          <h1><span>半導体業界と転職の</span><span>ガイド</span></h1>
          <p>製造工程や仕事の中身を理解し、会社名や年収だけに頼らず次のキャリアを考えるための記事をまとめています。</p>
        </div>
        <aside className="guides-author-card" aria-label="執筆者について">
          <p>WRITTEN &amp; REVIEWED BY</p>
          <strong>RYO</strong>
          <span>製造業経験 約10年</span>
          <p>電子部品の製造技術・品質・海外工場・製造DXを経て、外資系半導体メーカーへ。実体験と公開情報を分けて書きます。</p>
          <Link href="/about">執筆者と編集方針を見る <span aria-hidden="true">→</span></Link>
        </aside>
      </section>

      <section className="guides-feature" aria-labelledby="featured-guide-title">
        <header className="guides-section-heading">
          <div><p className="section-label">Featured story</p><h2 id="featured-guide-title">まず読んでほしい、転職の実体験</h2></div>
          <p>成功談だけでなく、異業種でのミスマッチや短期離職、半導体未経験への向き合い方まで記録しました。</p>
        </header>
        <Link className="guides-feature-card" href={`/guides/${featuredGuide.slug}`}>
          <div className="guides-feature-route" aria-hidden="true">
            <span>RYO&apos;S CAREER STORY</span>
            <ol>
              <li><small>01</small><strong>電子部品</strong><p>工程改善・品質</p></li>
              <li><small>02</small><strong>異業種DX</strong><p>ミスマッチ</p></li>
              <li><small>03</small><strong>外資系半導体</strong><p>プロセス職</p></li>
            </ol>
          </div>
          <div className="guides-feature-copy">
            <span className="guides-category guides-category--experience">{categoryLabels[featuredGuide.category]}</span>
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

      <section className="guides-library" aria-labelledby="guide-library-title">
        <header className="guides-section-heading">
          <div><p className="section-label">Career guides</p><h2 id="guide-library-title">悩みと経験から読む</h2></div>
          <p>半導体転職の基本から、設備・品質など今の仕事に近い入口を選べます。</p>
        </header>
        <div className="guides-card-grid" aria-label="半導体転職の記事">
          {otherGuides.map((guide) => (
            <Link className={`guides-article-card guides-article-card--${guide.category}`} href={`/guides/${guide.slug}`} key={guide.slug}>
              <GuideThumbnail category={guide.category} slug={guide.slug} title={guide.title} />
              <div className="guides-article-card__meta">
                <span className={`guides-category guides-category--${guide.category}`}>{categoryLabels[guide.category]}</span>
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

      <AffiliateCta title="ガイドを読んだ後、転職ルートを相談する" />
    </main>
  );
}
