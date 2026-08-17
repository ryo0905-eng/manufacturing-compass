import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { FilterableCompanies } from "@/components/FilterableCompanies";
import { StructuredData } from "@/components/StructuredData";
import { companies, segments } from "@/data/companies";
import { siteUrl } from "@/lib/format";

const japaneseCompanyCount = companies.filter((company) => company.headquartersCountry === "日本").length;
const overseasCompanyCount = companies.length - japaneseCompanyCount;

export const metadata: Metadata = {
  title: `半導体メーカー・企業一覧【2026年版】世界・日本の${companies.length}社`,
  description: `世界・日本の半導体メーカー・関連企業${companies.length}社を、IDM、ファブレス、ファウンドリ、製造装置、材料など分野別に整理。事業、製品、国内拠点、職種から検索・比較できます。`,
  alternates: { canonical: "/companies" },
  openGraph: {
    title: `半導体メーカー・企業一覧【2026年版】世界・日本の${companies.length}社`,
    description: "半導体企業を分野と本社地域で絞り込み、事業・製品・職種を比較できる企業研究ハブです。",
    type: "website",
    url: "/companies",
  },
};

type CompaniesPageProps = {
  searchParams: Promise<{ query?: string }>;
};

const adjacentAreas = [
  {
    name: "EDA・IP",
    description: "回路設計ソフトや再利用できる設計資産を提供し、製造前の設計を支える領域です。",
    href: "/guides/semiconductor-market-cap-ranking",
    linkLabel: "EDA・IPを含む企業分類を見る",
  },
  {
    name: "OSAT・後工程",
    description: "組立、パッケージング、テストを受託し、ウェーハ上のダイを出荷できる製品へ仕上げる領域です。",
    href: "/guides/semiconductor-packaging-process",
    linkLabel: "後工程とOSATの役割を見る",
  },
  {
    name: "電子部品（隣接領域）",
    description: "受動部品やセラミック部品など、半導体とともに最終製品を構成する領域です。MVPの企業一覧は半導体関連へ限定しています。",
    href: "/industry-map#supply-chain-applications",
    linkLabel: "最終製品までのつながりを見る",
  },
] as const;

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const { query = "" } = await searchParams;

  return (
    <main className="page companies-page">
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "半導体企業一覧", item: `${siteUrl}/companies` },
        ],
      }} />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "半導体メーカー・企業一覧",
        numberOfItems: companies.length,
        itemListElement: companies.map((company, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: company.nameJa,
          url: `${siteUrl}/companies/${company.slug}`,
        })),
      }} />

      <nav className="cpk-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span>/</span><span>半導体企業一覧</span>
      </nav>

      <header className="page-hero companies-hero">
        <p className="section-label">2026年版・公開情報から企業研究</p>
        <h1>半導体メーカー・企業一覧</h1>
        <p>
          世界・日本の半導体関連企業を、設計、製造、装置、材料などの役割で整理した一覧です。
          会社名だけでなく、主力製品、日本拠点、職種を検索し、企業詳細や比較へ進めます。
        </p>
        <dl className="companies-hero__facts" aria-label="掲載範囲">
          <div><dt>掲載企業</dt><dd>{companies.length}社</dd></div>
          <div><dt>日本企業</dt><dd>{japaneseCompanyCount}社</dd></div>
          <div><dt>海外企業</dt><dd>{overseasCompanyCount}社</dd></div>
          <div><dt>企業分類</dt><dd>{segments.length}分野</dd></div>
        </dl>
        <div className="actions">
          <Link className="button ghost" href="/industry-map">業界構造を地図で見る</Link>
          <Link className="button ghost" href="/compare">2社を比較する</Link>
        </div>
      </header>

      <section className="companies-role" aria-labelledby="companies-role-title">
        <div>
          <p className="section-label">このページの役割</p>
          <h2 id="companies-role-title">企業名から探す前に、分野の違いを押さえる</h2>
          <p>
            半導体企業は、同じ市場で一律に競う会社ではありません。設計する企業、受託製造する企業、
            自社で設計・製造する企業、製造装置や材料を供給する企業に分かれます。
          </p>
        </div>
        <aside>
          <strong>業界地図との使い分け</strong>
          <p><Link href="/industry-map">半導体業界地図</Link>は工程と企業間の関係を理解するページ、この企業一覧は条件から企業を検索・比較するページです。</p>
        </aside>
      </section>

      <section className="companies-taxonomy" aria-labelledby="companies-taxonomy-title">
        <header>
          <p className="section-label">分野別に理解する</p>
          <h2 id="companies-taxonomy-title">掲載企業の6分類</h2>
          <p>分類を選ぶと、役割の説明と該当企業をまとめたページへ移動できます。</p>
        </header>
        <div>
          {segments.map((segment) => {
            const segmentCompanies = companies.filter((company) => company.industrySegments.includes(segment.id));
            return (
              <article key={segment.id}>
                <span>{segment.shortName}</span>
                <h3>{segment.name}</h3>
                <p>{segment.description}</p>
                <small>{segmentCompanies.length}社を掲載</small>
                <ul className="companies-taxonomy__companies" aria-label={`${segment.name}の掲載企業`}>
                  {segmentCompanies.map((company) => (
                    <li key={company.id}>
                      <Link href={`/companies/${company.slug}` as Route}>{company.nameJa}</Link>
                    </li>
                  ))}
                </ul>
                <Link href={`/segments/${segment.slug}` as Route}>{segment.name}の企業を見る <span aria-hidden="true">→</span></Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="companies-adjacent" aria-labelledby="companies-adjacent-title">
        <header>
          <h2 id="companies-adjacent-title">隣接する企業分類</h2>
          <p>個別企業データが未整備の領域は、薄い企業ページを増やさず、まず工程・業界記事で役割を説明しています。</p>
        </header>
        <div>
          {adjacentAreas.map((area) => (
            <article key={area.name}>
              <h3>{area.name}</h3>
              <p>{area.description}</p>
              <Link href={area.href}>{area.linkLabel} <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <FilterableCompanies companies={companies} initialQuery={query} segments={segments} />

      <nav className="companies-next-links" aria-label="企業研究を深めるページ">
        <Link href="/guides/semiconductor-manufacturing-process"><strong>半導体製造工程を図解で理解</strong><span>前工程・後工程と、装置・材料のつながりを見る</span></Link>
        <Link href="/guides/semiconductor-market-cap-ranking"><strong>2026年の時価総額ランキング</strong><span>基準日付きで企業規模と業界分類を確認する</span></Link>
        <Link href="/compare/asml-vs-tokyo-electron"><strong>ASMLと東京エレクトロンを比較</strong><span>装置領域、職種、英語の違いを同じ軸で比べる</span></Link>
      </nav>
    </main>
  );
}
