import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { AffiliateCta } from "@/components/AffiliateCta";
import { careerResearchLists } from "@/data/career-research-lists";
import { companyResearch } from "@/data/company-research";
import { getCareerInfo } from "@/data/companies";
import { getRankingBySlug, getRankingCompanies, rankings } from "@/data/editorial";

type RankingPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return rankings.map((ranking) => ({ slug: ranking.slug }));
}

export async function generateMetadata({ params }: RankingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const ranking = getRankingBySlug(slug);

  if (!ranking) {
    return {};
  }

  return {
    title: ranking.title,
    description: ranking.description,
    alternates: { canonical: `/rankings/${ranking.slug}` },
  };
}

export default async function RankingPage({ params }: RankingPageProps) {
  const { slug } = await params;
  const ranking = getRankingBySlug(slug);

  if (!ranking) {
    notFound();
  }

  const rankingCompanies = getRankingCompanies(ranking);

  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">経験別の企業研究</p>
        <h1>{ranking.title}</h1>
        <p>{ranking.description}</p>
      </section>

      <p className="tool-related-links"><Link href="/tools/semiconductor-process">半導体ができるまでを、動く断面図で確かめる →</Link></p>


      <p className="ranking-order-note">
        掲載順は企業の優劣やおすすめ順位を示すものではありません。各社の事業内容や公開されている職種を確認するための候補リストです。
      </p>

      <section className="ranking-criteria" aria-label="企業を整理した観点">
        {ranking.criteria.map((criterion) => (
          <div key={criterion}>
            <span>Research point</span>
            <strong>{criterion}</strong>
          </div>
        ))}
      </section>

      <p>以下の対象職種と経験の接点は、当サイトの企業研究の提案です。一般的な製品・職種紹介と、現在募集中の求人は区別してください。日本の中途募集、勤務地、英語要件は未確認のため、各社の公式採用情報で応募時に照合します。</p>
      <p className="disclosure">リスト編集更新日：2026-10-08。製品情報と既存の職種情報の確認日は各項目に表示しています。</p>
      <section className="ranking-list" aria-label="企業リスト">
        {rankingCompanies.map((company) => {
          const point = careerResearchLists[ranking.slug]?.[company.id];
          const research = companyResearch[company.id];
          const career = getCareerInfo(company.id);
          const jobSources = company.sources.filter(source => /career|jobs|職種|採用|engineering|open positions/i.test(source.title));
          return (
          <article className="ranking-item" key={company.id}>
            <div>
              <p className="eyebrow">{company.businessModel}</p>
              <h2>{company.nameJa}</h2>
              {research ? <><h3>公式情報で確認できる事業</h3><p>{research.facts}</p><p className="disclosure"><a className="text-link" href={research.source.url} target="_blank" rel="noopener noreferrer">{research.source.publisher}：{research.source.title}</a>／確認日：{research.source.accessedAt}</p>{research.sourceScope ? <p className="disclosure">{research.sourceScope}</p> : null}</> : null}
              {point ? <><h3>対象職種・経験との接点（編集上の提案）</h3><p><strong>職種の研究候補：</strong>{point.roles}</p><p>{point.connection}</p><p><strong>確認する質問：</strong>{point.question}</p></> : null}
              {career ? <p className="disclosure">既存の職種・準備情報の確認日：{career.lastUpdated}。新卒向け職種紹介や過去の求人を含み、現在の中途募集を示すものではありません。</p> : <p className="disclosure">企業別キャリア情報は整理中です。上記の候補職種を、この企業の募集済み職種として確認したものではありません。</p>}
              <ul className="source-list">{jobSources.map(source => <li key={source.url}><a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}（職種・募集条件の確認先）</a>／既存データ確認日：{source.accessedAt}</li>)}</ul>
              <div className="actions">
                <Link className="text-link" href={`/companies/${company.slug}` as Route}>
                  企業詳細
                </Link>
                <Link className="text-link" href={`/companies/${company.slug}#career-prep` as Route}>
                  準備を見る
                </Link>
              </div>
            </div>
          </article>
        ); })}
      </section>

      <section className="section">
        <p>気になる企業が見つかったら、仕事と勤務条件の確認へ。</p>
        <TrackedInternalLink href="/career-priorities#workstyle" eventName="workstyle_check_entry" eventProperties={{ cta_location: "ranking", source_page: `/rankings/${ranking.slug}` }}>半導体の仕事・働き方から質問を作る</TrackedInternalLink>
      </section>
      <AffiliateCta title="企業リストをもとに相談する" />
    </main>
  );
}
