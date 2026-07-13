import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/AffiliateCta";
import { StructuredData } from "@/components/StructuredData";
import { companies, getCareerInfo, getCompanyBySlug, getSegmentById } from "@/data/companies";
import { siteUrl } from "@/lib/format";

type CompanyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return companies.map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);

  if (!company) {
    return {};
  }

  const isSearchReady = Boolean(getCareerInfo(company.id));

  return {
    title: `${company.nameJa}の転職・仕事内容・キャリア準備`,
    description: `${company.nameJa}の事業領域、主力製品、日本拠点、英語必要度、転職時に見たいポイントを整理します。`,
    alternates: { canonical: `/companies/${company.slug}` },
    robots: isSearchReady ? undefined : { index: false, follow: true },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  const career = getCareerInfo(company.id);
  const companySegments = company.industrySegments.map((segmentId) => getSegmentById(segmentId)).filter(Boolean);
  const compareTarget = companies.find((item) => item.id !== company.id && item.industrySegments.some((segment) => company.industrySegments.includes(segment)));
  const compareHref = (compareTarget ? `/compare/${company.id}-vs-${compareTarget.id}` : "/compare") as Route;

  return (
    <main className="page">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: company.name,
          alternateName: company.nameJa,
          url: company.websiteUrl,
          sameAs: company.sources.map((source) => source.url),
        }}
      />
      <section className="page-hero">
        <p className="eyebrow">{company.businessModel}</p>
        <h1>{company.nameJa}</h1>
        <p>{company.careerSummary}</p>
        <div className="actions">
          <Link className="button primary" href={compareHref}>
            近い会社と比較する
          </Link>
          <Link className="button ghost" href={`/companies/${company.slug}/career-prep` as Route}>
            準備を見る
          </Link>
          <Link className="button ghost" href="/companies">
            企業一覧に戻る
          </Link>
        </div>
      </section>

      <div className="detail-layout">
        <div className="stack">
          <section className="detail-panel">
            <p className="eyebrow">3分でわかる会社概要</p>
            <h2>業界での立ち位置</h2>
            <p>{company.summary}</p>
            <ul className="tag-list">
              {companySegments.map((segment) => (
                <li key={segment?.id}>{segment?.name}</li>
              ))}
            </ul>
          </section>

          <section className="detail-panel">
            <p className="eyebrow">主な製品</p>
            <h2>主力製品</h2>
            <ul className="tag-list">
              {company.mainProducts.map((product) => (
                <li key={product}>{product}</li>
              ))}
            </ul>
          </section>

          <section className="detail-panel">
            <p className="eyebrow">キャリア準備</p>
            <h2>近づくための準備</h2>
            {career ? (
              <div className="readiness-grid">
                <div className="readiness-block">
                  <h3>今近い経験</h3>
                  <ul>
                    {career.suitableBackgrounds.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="readiness-block">
                  <h3>次に近づく経験</h3>
                  <ul>
                    {career.stretchBackgrounds.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="readiness-block">
                  <h3>半年の準備</h3>
                  <ul>
                    {career.preparationActions6Months.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="readiness-block">
                  <h3>1年の準備</h3>
                  <ul>
                    {career.preparationActions1Year.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p>公開情報を確認しながら準備ポイントを整理中です。</p>
            )}
          </section>
        </div>

        <aside className="stack">
          <section className="detail-panel">
            <p className="eyebrow">基本情報</p>
            <h2>基本情報</h2>
            <dl className="mini-facts">
              <div>
                <dt>本社</dt>
                <dd>{company.headquartersCountry}</dd>
              </div>
              <div>
                <dt>日本拠点</dt>
                <dd>{company.locationsJapan.join(" / ")}</dd>
              </div>
              <div>
                <dt>職種</dt>
                <dd>{company.jobCategories.join(" / ")}</dd>
              </div>
              <div>
                <dt>英語必要度</dt>
                <dd>{company.englishRequirement}</dd>
              </div>
            </dl>
          </section>
          <section className="detail-panel">
            <p className="eyebrow">出典</p>
            <h2>情報ソース</h2>
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
          </section>
        </aside>
      </div>

      <AffiliateCta title={`${company.nameJa}に近い求人・キャリアを相談する`} />
    </main>
  );
}
