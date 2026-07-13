import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/AffiliateCta";
import { companies, getCareerInfo, getCompanyBySlug } from "@/data/companies";

type CareerPrepPageProps = {
  params: Promise<{ slug: string }>;
};

function fallbackActions(companyName: string) {
  return {
    suitableBackgrounds: ["近い職種や製品経験を整理できる人", "顧客・品質・装置・設計のいずれかに接点がある人"],
    usefulSkills: ["職務経歴の数値化", "求人票の要件整理", "英語資料の読解"],
    preparationActions6Months: [`${companyName}の募集職種を3つ読み、共通要件を書き出す`, "改善実績を数字で1つ整理する", "英語で担当業務を3文にする"],
    preparationActions1Year: ["近い職種で成果を作る", "半導体の基礎用語を説明できるようにする", "応募軸を2つに絞る"],
    notes: "公開情報を確認しながら、準備ポイントを整理中です。",
  };
}

export function generateStaticParams() {
  return companies.map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({ params }: CareerPrepPageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);

  if (!company) {
    return {};
  }

  const isSearchReady = Boolean(getCareerInfo(company.id));

  return {
    title: `${company.nameJa}を目指すキャリア準備`,
    description: `${company.nameJa}を目指すために整理したい経験、伸ばすスキル、半年後・1年後の準備をまとめます。`,
    alternates: { canonical: `/companies/${company.slug}/career-prep` },
    robots: isSearchReady ? undefined : { index: false, follow: true },
  };
}

export default async function CareerPrepPage({ params }: CareerPrepPageProps) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  const career = getCareerInfo(company.id);
  const prep = career ?? fallbackActions(company.nameJa);

  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">応募前のキャリア準備</p>
        <h1>{company.nameJa}を目指す準備</h1>
        <p>{company.careerSummary}</p>
        <div className="actions">
          <Link className="button primary" href="/career-compass">
            Questで現在地を見る
          </Link>
          <Link className="button ghost" href={`/companies/${company.slug}`}>
            企業詳細へ
          </Link>
        </div>
      </section>

      <section className="prep-grid" aria-label="キャリア準備">
        <article className="prep-card">
          <span>Fit</span>
          <h2>近い経験</h2>
          <ul>
            {prep.suitableBackgrounds.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="prep-card">
          <span>Skill</span>
          <h2>伸ばすスキル</h2>
          <ul>
            {prep.usefulSkills.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="prep-card">
          <span>6 months</span>
          <h2>半年の準備</h2>
          <ul>
            {prep.preparationActions6Months.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="prep-card">
          <span>1 year</span>
          <h2>1年の準備</h2>
          <ul>
            {prep.preparationActions1Year.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="today-quest-card article-quest">
        <div className="quest-check" aria-hidden="true" />
        <div>
          <span>Today Quest</span>
          <strong>{prep.preparationActions6Months[0]}</strong>
          <small>{prep.notes}</small>
        </div>
      </section>

      <AffiliateCta title={`${company.nameJa}への近づき方を相談する`} />
    </main>
  );
}
