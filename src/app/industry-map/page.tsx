import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { CareerCompassCta } from "@/components/CareerCompassCta";
import { IndustryMapExplorer } from "@/components/IndustryMapExplorer";
import { StructuredData } from "@/components/StructuredData";
import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { companies, segments } from "@/data/companies";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "半導体業界地図・業界マップ【2026年版】サプライチェーンを図解",
  description: "半導体の設計、材料、前工程、製造装置、後工程、検査、最終製品の関係を業界地図で図解。日本・海外の代表企業と職種を、操作できるマップとテキスト一覧で整理します。",
  alternates: { canonical: "/industry-map" },
  openGraph: {
    title: "半導体業界地図・業界マップ【2026年版】",
    description: "設計から最終製品まで、半導体サプライチェーンと代表企業の関係を図解します。",
    type: "website",
    url: "/industry-map",
  },
};

const supplyChain = [
  {
    id: "design",
    label: "01",
    title: "設計・EDA・IP",
    description: "製品仕様を回路へ落とし込み、設計ソフトやIPを使って製造へ渡すデータを作ります。",
    companyIds: ["nvidia", "amd", "socionext"],
    guideHref: "/guides/ic-chip-manufacturing-companies",
    guideLabel: "設計企業と製造企業の分業を見る",
  },
  {
    id: "materials",
    label: "02",
    title: "材料・ウェーハ",
    description: "シリコンウェーハ、フォトレジスト、ガス、薬液など、回路形成に必要な基板と材料を供給します。",
    companyIds: ["sumco"],
    guideHref: "/guides/semiconductor-silicon-wafer-manufacturers",
    guideLabel: "シリコンウェーハメーカーを見る",
  },
  {
    id: "front-end",
    label: "03",
    title: "前工程・ウェーハ加工",
    description: "成膜、露光、エッチング、注入、CMPなどを繰り返し、ウェーハ上へ素子と配線を形成します。",
    companyIds: ["tsmc", "samsung-electronics", "intel", "micron", "kioxia"],
    guideHref: "/guides/semiconductor-manufacturing-process",
    guideLabel: "前工程・後工程を図解で見る",
  },
  {
    id: "equipment",
    label: "04",
    title: "製造装置・搬送",
    description: "露光、成膜、加工、洗浄、搬送などの装置で前工程・後工程を横断して支えます。",
    companyIds: ["asml", "tokyo-electron", "applied-materials", "screen"],
    guideHref: "/guides/semiconductor-equipment-manufacturers",
    guideLabel: "工程別の製造装置メーカーを見る",
  },
  {
    id: "back-end",
    label: "05",
    title: "後工程・パッケージ",
    description: "ウェーハテスト後のダイを切り分け、接続・封止・放熱構造を加えて製品形態へ仕上げます。",
    companyIds: ["disco"],
    guideHref: "/guides/semiconductor-packaging-process",
    guideLabel: "パッケージングとOSATの役割を見る",
  },
  {
    id: "inspection",
    label: "06",
    title: "検査・計測・テスト",
    description: "欠陥、寸法、膜厚、電気特性を確認し、工程改善と出荷判定へ情報を戻します。",
    companyIds: ["kla", "lasertec", "advantest", "teradyne"],
    guideHref: "/guides/semiconductor-inspection-metrology",
    guideLabel: "検査・計測の違いを見る",
  },
  {
    id: "applications",
    label: "07",
    title: "最終製品・用途",
    description: "完成した半導体は、AIサーバー、自動車、産業機器、通信機器、スマートフォンなどの機能を支えます。",
    companyIds: ["nvidia", "qualcomm", "renesas", "infineon"],
    guideHref: "/guides/analog-semiconductor-companies",
    guideLabel: "用途から半導体企業を見る",
  },
] as const;

export default function IndustryMapPage() {
  const companySummaries = companies.map((company) => ({
    id: company.id,
    slug: company.slug,
    name: company.name,
    nameJa: company.nameJa,
    summary: company.summary,
    businessModel: company.businessModel,
    mainProducts: company.mainProducts,
    jobCategories: company.jobCategories,
  }));

  return (
    <main className="page industry-map-page">
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "半導体業界地図", item: `${siteUrl}/industry-map` },
        ],
      }} />
      <nav className="cpk-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span>/</span><span>半導体業界地図・業界マップ</span>
      </nav>
      <header className="industry-map-hero">
        <div>
          <p className="section-label">SEMICONDUCTOR ECOSYSTEM</p>
          <h1>半導体業界地図・業界マップ</h1>
          <p>設計、材料、前工程、製造装置、後工程、検査、最終製品まで。工程をたどりながら、日本・海外企業と職種のつながりを探索します。</p>
        </div>
        <p><strong>6工程 × 3つの視点</strong><span>ドラッグ・ズーム・クリックで確認</span></p>
      </header>

      <IndustryMapExplorer companies={companySummaries} totalCompanyCount={companies.length} />

      <section className="section industry-supply-chain" aria-labelledby="industry-supply-chain-title">
        <div className="industry-map-directory-heading">
          <p className="section-label">Searchable supply chain</p>
          <h2 id="industry-supply-chain-title">半導体サプライチェーンを7段階で理解する</h2>
          <p>操作地図の内容を、検索エンジンやキーボード操作でも読めるテキストとして整理しています。装置・材料は一つの工程だけでなく複数工程を支えます。</p>
        </div>
        <ol>
          {supplyChain.map((stage) => {
            const stageCompanies = stage.companyIds
              .map((id) => companies.find((company) => company.id === id))
              .filter((company) => company !== undefined);

            return (
              <li id={`supply-chain-${stage.id}`} key={stage.id}>
                <span>{stage.label}</span>
                <div>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                  <ul aria-label={`${stage.title}の代表企業`}>
                    {stageCompanies.map((company) => (
                      <li key={company.id}>
                        <TrackedInternalLink
                          eventName="industry_map_category_click"
                          eventProperties={{ category: stage.id, destination: "company" }}
                          href={`/companies/${company.slug}` as Route}
                        >
                          {company.nameJa}<small>{company.headquartersCountry === "日本" ? "日本" : "海外"}</small>
                        </TrackedInternalLink>
                      </li>
                    ))}
                  </ul>
                  <TrackedInternalLink
                    className="text-link"
                    eventName="industry_map_category_click"
                    eventProperties={{ category: stage.id, destination: "guide" }}
                    href={stage.guideHref}
                  >
                    {stage.guideLabel} <span aria-hidden="true">→</span>
                  </TrackedInternalLink>
                </div>
              </li>
            );
          })}
        </ol>
        <aside>
          <strong>企業名や職種から探す場合</strong>
          <p>このページは業界構造と関係を理解するための地図です。条件を指定して企業を探す場合は、<Link href="/companies">半導体メーカー・企業一覧</Link>を使ってください。</p>
        </aside>
      </section>

      <CareerCompassCta
        body="工程改善、設備、品質、生産技術などの経験を12問で整理し、接点のある半導体工程・職種と次の準備を確認できます。"
        ctaLocation="industry_map_after_supply_chain"
        ctaVariant="process_to_role"
        sourcePage="/industry-map"
        title="業界の流れが分かったら、自分の経験がつながる場所を確認する"
      />

      <section className="section">
        <div className="industry-map-directory-heading">
          <p className="section-label">Explore without interaction</p>
          <h2>一覧から各領域を確認する</h2>
          <p>操作が難しい場合や、特定領域を詳しく読みたい場合は、こちらから企業情報へ進めます。</p>
        </div>
        <div className="segment-map">
          {segments.map((segment) => {
            const relatedCompanies = companies.filter((company) => segment.relatedCompanyIds.includes(company.id));

            return (
              <article className="segment-card" key={segment.id}>
                <p className="section-label">{segment.shortName}</p>
                <h2>{segment.name}</h2>
                <p>{segment.description}</p>
                <Link className="text-link" href={`/segments/${segment.slug}` as Route}>
                  {segment.name}を詳しく見る
                </Link>
                <strong>代表企業</strong>
                <ul className="tag-list">
                  {relatedCompanies.map((company) => (
                    <li key={company.id}>
                      <Link href={`/companies/${company.slug}` as Route}>{company.nameJa}</Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
