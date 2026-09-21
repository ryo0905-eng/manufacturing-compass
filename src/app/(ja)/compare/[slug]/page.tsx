import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/AffiliateCta";
import { CareerPrioritiesLink } from "@/components/CareerPrioritiesLink";
import { CompanyComparisonSummary } from "@/components/CompanyComparisonSummary";
import { StructuredData } from "@/components/StructuredData";
import { getCompanyComparisonProfile } from "@/data/company-comparisons";
import { companies, getCareerInfo } from "@/data/companies";
import { comparePairs } from "@/data/editorial";
import { companyCompareSlug, getCompaniesFromCompareSlug, siteUrl } from "@/lib/format";

type CompareDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return comparePairs.map((pair) => ({ slug: companyCompareSlug(pair) }));
}

export async function generateMetadata({ params }: CompareDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparedCompanies = getCompaniesFromCompareSlug(slug);
  const comparisonProfile = getCompanyComparisonProfile(slug);

  if (comparedCompanies.length < 2) {
    return {};
  }

  if (comparisonProfile) {
    return {
      title: comparisonProfile.title,
      description: comparisonProfile.description,
      alternates: {
        canonical: `/compare/${slug}`,
      },
      openGraph: {
        title: comparisonProfile.title,
        description: comparisonProfile.description,
        type: "article",
        url: `/compare/${slug}`,
      },
    };
  }

  return {
    title: `${comparedCompanies.map((company) => company.nameJa).join(" vs ")} 比較`,
    description: `${comparedCompanies.map((company) => company.nameJa).join(" と ")}を、事業領域、職種、英語必要度、キャリア準備ポイントで比較します。`,
    alternates: { canonical: `/compare/${slug}` },
    openGraph: {
      title: `${comparedCompanies.map((company) => company.nameJa).join(" vs ")} 比較`,
      description: `${comparedCompanies.map((company) => company.nameJa).join(" と ")}の事業領域、職種、日本拠点、準備ポイントを比較します。`,
      type: "article",
      url: `/compare/${slug}`,
    },
  };
}

export default async function CompareDetailPage({ params }: CompareDetailPageProps) {
  const { slug } = await params;
  const comparedCompanies = getCompaniesFromCompareSlug(slug);
  const comparisonProfile = getCompanyComparisonProfile(slug);

  if (comparedCompanies.length < 2) {
    notFound();
  }

  const comparisonEntries = comparedCompanies.map((company) => ({ company, career: getCareerInfo(company.id) }));

  return (
    <main className="page">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "半導体企業比較", item: `${siteUrl}/compare` },
        { "@type": "ListItem", position: 3, name: comparisonProfile?.heading ?? "企業比較", item: `${siteUrl}/compare/${slug}` },
      ] }} />
      <nav className="cpk-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span>/</span><Link href="/compare">企業比較</Link><span>/</span><span>{comparisonProfile?.heading ?? "2社比較"}</span>
      </nav>
      <section className="page-hero">
        <p className="eyebrow">企業比較</p>
        <h1>{comparisonProfile?.heading ?? `${comparedCompanies.map((company) => company.nameJa).join(" と ")} の比較`}</h1>
        <p>{comparisonProfile?.lead ?? "勝ち負けではなく、事業領域、向いている経験、準備ポイントの違いを整理します。"}</p>
        <div className="actions">
          <Link className="button ghost" href="/compare">
            比較を選び直す
          </Link>
        </div>
      </section>

      {comparisonProfile ? (
        <section className="section" aria-labelledby="featured-comparison-title">
          <div className="section-header">
            <div>
              <p className="section-label">最初に結論</p>
              <h2 id="featured-comparison-title">{comparisonProfile.summaryHeading}</h2>
            </div>
          </div>
          <p>{comparisonProfile.summary}</p>
          <div className="grid-3">
            {comparisonProfile.highlights.map((highlight) => (
              <article className="info-card" key={highlight.label}>
                <p className="section-label">{highlight.label}</p>
                <h3>{highlight.title}</h3>
                <p>{highlight.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <CompanyComparisonSummary entries={comparisonEntries} />

      {comparisonProfile?.research ? (
        <section className="section" aria-labelledby="comparison-research-title">
          <h2 id="comparison-research-title">公式情報と、求人ごとに確かめること</h2>
          <p>拠点の存在や職種紹介は、現在の募集や配属を保証しません。下の質問は当サイトが整理した企業研究の観点です。</p>
          {comparisonProfile.research.companies.map((entry) => {
            const company = comparedCompanies.find((item) => item.id === entry.companyId);
            if (!company) return null;
            return (
              <article key={entry.companyId}>
                <h3>{company.nameJa}：公式情報で確認できること</h3>
                <p>{entry.facts}</p>
                <ul className="source-list">
                  {entry.sources.map((source) => (
                    <li key={source.url}><a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> — {source.publisher}／確認日 {source.accessedAt}</li>
                  ))}
                </ul>
                <Link className="text-link" href={`/companies/${company.slug}` as Route}>{company.nameJa}の企業情報を見る</Link>
              </article>
            );
          })}
          <h3>求人票・面接で使う確認リスト（編集上の提案）</h3>
          <dl>
            {comparisonProfile.research.questions.map((question) => (
              <div key={question.label}><dt><strong>{question.label}</strong></dt><dd>{question.body}</dd></div>
            ))}
          </dl>
          <p>確認した条件の優先順位は、このページ下部の「転職の軸ノート」で整理できます。</p>
          <p className="disclosure">この確認リストの最終更新日：{comparisonProfile.research.updatedAt}。既存の企業比較表の出典・確認日はページ下部に別記しています。</p>
        </section>
      ) : null}

      <section className="comparison-table-wrap" aria-label="企業比較表">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>比較軸</th>
              {comparedCompanies.map((company) => (
                <th key={company.id}>{company.nameJa}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>事業領域</th>
              {comparedCompanies.map((company) => (
                <td key={company.id}>{company.businessModel}</td>
              ))}
            </tr>
            <tr>
              <th>主力製品</th>
              {comparedCompanies.map((company) => (
                <td key={company.id}>{company.mainProducts.join(" / ")}</td>
              ))}
            </tr>
            <tr>
              <th>日本拠点</th>
              {comparedCompanies.map((company) => (
                <td key={company.id}>{company.locationsJapan.join(" / ")}</td>
              ))}
            </tr>
            <tr>
              <th>募集職種の例</th>
              {comparedCompanies.map((company) => (
                <td key={company.id}>{company.jobCategories.join(" / ")}</td>
              ))}
            </tr>
            <tr>
              <th>英語必要度</th>
              {comparedCompanies.map((company) => (
                <td key={company.id}>{company.englishRequirement}</td>
              ))}
            </tr>
            <tr>
              <th>今狙いやすい背景</th>
              {comparedCompanies.map((company) => {
                const career = getCareerInfo(company.id);
                return <td key={company.id}>{career?.suitableBackgrounds.join(" / ") ?? "掲載データなし（推測で補完していません）"}</td>;
              })}
            </tr>
            <tr>
              <th>半年後の準備</th>
              {comparedCompanies.map((company) => {
                const career = getCareerInfo(company.id);
                return <td key={company.id}>{career?.preparationActions6Months.join(" / ") ?? "掲載データなし（推測で補完していません）"}</td>;
              })}
            </tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <div className="company-grid">
          {comparedCompanies.map((company) => (
            <article className="company-card" key={company.id}>
              <p className="eyebrow">{company.businessModel}</p>
              <h2>{company.nameJa}</h2>
              <p>{company.careerSummary}</p>
              <Link className="text-link" href={`/companies/${company.slug}` as Route}>
                詳細を見る
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-panel" aria-labelledby="comparison-priorities-title">
        <h2 id="comparison-priorities-title">2社の違いを、自分が大切にしたい条件で見る</h2>
        <p>勤務地・仕事内容・待遇のうち、今回は何を重視するか。仮の優先順位と、求人票や面接で確かめたい質問を整理できます。</p>
        <CareerPrioritiesLink className="button primary" ctaLocation="comparison_after_companies">転職の軸ノートで整理する</CareerPrioritiesLink>
      </section>

      {comparisonProfile ? (
        <section className="section" aria-labelledby="comparison-sources-title">
          <div className="section-header">
            <div>
              <p className="section-label">公式情報</p>
              <h2 id="comparison-sources-title">比較に使った情報ソース</h2>
            </div>
          </div>
          <div className="company-grid">
            {comparedCompanies.map((company) => (
              <article className="company-card" key={company.id}>
                <h3>{company.nameJa}</h3>
                <ul className="source-list">
                  {company.sources.map((source) => (
                    <li key={source.url}>
                      <a className="text-link" href={source.url} target="_blank" rel="noreferrer">
                        {source.title}
                      </a>
                      <br />
                      {source.publisher} / 確認日: {source.accessedAt}
                    </li>
                  ))}
                </ul>
                <p className="disclosure">最終更新日: {company.lastUpdated}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <AffiliateCta title="比較した企業に近いキャリアを相談する" />
    </main>
  );
}
