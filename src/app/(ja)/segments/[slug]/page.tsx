import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateCta } from "@/components/AffiliateCta";
import { CareerCompassLink } from "@/components/CareerCompassLink";
import { CompanyCard } from "@/components/CompanyCard";
import { StructuredData } from "@/components/StructuredData";
import { companies, segments } from "@/data/companies";
import { electronicComponentsOverview } from "@/data/electronic-components-overview";
import { materialsNavigation } from "@/data/materials-navigation";
import { getGuideBySlug } from "@/content/guides";
import { siteUrl } from "@/lib/format";

type SegmentPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return segments.map((segment) => ({ slug: segment.slug }));
}

export async function generateMetadata({ params }: SegmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const segment = segments.find((item) => item.slug === slug);

  if (!segment) {
    return {};
  }

  if (segment.id === "electronic-components") {
    const title = "電子部品メーカー一覧｜日本の11社と製品分野の違い";
    const description = "電子部品メーカー日本11社の製品分野を比較。コンデンサなどの受動部品、コネクタ、センサ、電源機器の役割と企業研究のポイントを紹介します。";
    return { title, description, alternates: { canonical: "/segments/electronic-components" }, openGraph: { title, description, type: "website", url: "/segments/electronic-components" } };
  }

  if (segment.id === "materials") {
    const title = "半導体材料の分類と役割｜ウェーハ・ガス・薬液・レジストから探す";
    const description = "半導体材料を工程と役割から調べる入口。ウェーハ、高純度ガス、薬液、フォトレジスト、CMPスラリーの解説と企業研究へつなぎ、掲載範囲と比較条件を示します。";
    return { title, description, alternates: { canonical: "/segments/materials" }, openGraph: { title, description, type: "website", url: "/segments/materials" } };
  }

  if (segment.id === "fabless") {
    const companyCount = companies.filter((company) => company.industrySegments.includes(segment.id)).length;

    return {
      title: `ファブレス企業一覧【2026年版】日本・海外${companyCount}社`,
      description: `ファブレスとは、半導体の企画・設計を中心に、ウェーハ製造を主に外部へ委託する事業モデルです。日本・海外${companyCount}社の主力分野と、ファウンドリ・IDMとの違いを整理します。`,
      alternates: { canonical: "/segments/fabless" },
      openGraph: {
        title: `ファブレス企業一覧【2026年版】日本・海外${companyCount}社`,
        description: "日本・海外のファブレス企業を、主力分野と企業詳細へのリンク付きで整理します。",
        type: "website",
        url: "/segments/fabless",
      },
    };
  }

  return {
    title: `${segment.name}の半導体企業`,
    description: `${segment.name}領域の役割、代表企業、転職で見られやすい経験を整理します。`,
    alternates: { canonical: `/segments/${segment.slug}` },
    openGraph: {
      title: `${segment.name}の半導体企業`,
      description: `${segment.name}領域の役割、代表企業、転職で見られやすい経験を整理します。`,
      type: "website",
      url: `/segments/${segment.slug}`,
    },
  };
}

export default async function SegmentPage({ params }: SegmentPageProps) {
  const { slug } = await params;
  const segment = segments.find((item) => item.slug === slug);

  if (!segment) {
    notFound();
  }

  const segmentCompanies = companies.filter((company) => company.industrySegments.includes(segment.id));
  const relatedCompanies = companies.filter((company) => segment.relatedCompanyIds.includes(company.id));
  const jobCategories = Array.from(new Set(segmentCompanies.flatMap((company) => company.jobCategories))).slice(0, 8);
  const isFabless = segment.id === "fabless";
  const isElectronicComponents = segment.id === "electronic-components";
  const japaneseFablessCompanies = isFabless
    ? segmentCompanies.filter((company) => company.headquartersCountry === "日本")
    : [];
  const overseasFablessCompanies = isFabless
    ? segmentCompanies.filter((company) => company.headquartersCountry !== "日本")
    : [];
  const fablessFaq = isFabless ? [
    {
      question: "ファブレスとは何ですか？",
      answer: "半導体の企画・設計や製品開発を中心に担い、ウェーハ製造を主にファウンドリなどの外部企業へ委託する事業モデルです。",
    },
    {
      question: "ファブレス企業は工場を一切持たないのですか？",
      answer: "必ずしも、すべての工場や設備を一切持たないという意味ではありません。一般には大規模なウェーハ量産を主に外部へ委託する点を指し、研究開発、評価、テスト、パッケージなどの設備を持つ場合や、事業ごとに製造形態が異なる場合があります。",
    },
    {
      question: "ファブレスとファウンドリの違いは何ですか？",
      answer: "ファブレスは主に半導体を設計し、ファウンドリは顧客から受け取った設計データをもとにウェーハ上へ半導体を受託製造します。設計側と製造側として分業する関係です。",
    },
    {
      question: "ファブレスとIDMの違いは何ですか？",
      answer: "ファブレスはウェーハ製造を主に外部へ委託します。IDMは自社製品の設計と製造を一体で持つ企業です。ただし、実際にはIDMが一部製造を委託するなど、企業や事業ごとに境界が異なります。",
    },
  ] : [];

  return (
    <main className="page">
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "半導体業界地図", item: `${siteUrl}/industry-map` },
          { "@type": "ListItem", position: 3, name: isFabless ? "ファブレス企業一覧" : segment.id === "electronic-components" ? "電子部品メーカー一覧" : `${segment.name}の半導体企業`, item: `${siteUrl}/segments/${segment.slug}` },
        ],
      }} />
      {isElectronicComponents ? <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "掲載する電子部品メーカー",
        numberOfItems: segmentCompanies.length,
        itemListElement: segmentCompanies.map((company, index) => ({
          "@type": "ListItem", position: index + 1, name: company.nameJa,
          url: `${siteUrl}/companies/${company.slug}`,
        })),
      }} /> : null}
      {isFabless ? <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "日本・海外のファブレス企業一覧",
        numberOfItems: segmentCompanies.length,
        itemListElement: segmentCompanies.map((company, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: company.nameJa,
          url: `${siteUrl}/companies/${company.slug}`,
        })),
      }} /> : null}
      {isFabless ? <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: fablessFaq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }} /> : null}
      <nav className="cpk-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span>/</span><Link href="/industry-map">半導体業界地図</Link><span>/</span><span>{isFabless ? "ファブレス企業一覧" : segment.name}</span>
      </nav>
      <section className="page-hero">
        <p className="eyebrow">{segment.shortName}</p>
        <h1>{isFabless ? `ファブレス企業一覧【2026年版】日本・海外${segmentCompanies.length}社` : segment.id === "materials" ? "半導体材料の分類と役割" : segment.id === "electronic-components" ? "電子部品メーカー一覧" : `${segment.name}の半導体企業`}</h1>
        <p>{segment.description}</p>
        {isFabless ? <p>「工場を持たない」は、主にウェーハ量産を外部へ委託するという意味です。研究開発・評価設備を持つ場合や、事業によって製造形態が異なる場合もあります。</p> : null}
        {isFabless ? <div className="actions"><Link className="button ghost" href="/guides/semiconductor-foundry">ファウンドリとの違いを見る</Link><Link className="button ghost" href="/industry-map">半導体業界地図で位置を見る</Link></div> : null}
        {segment.id === "foundry" ? <Link className="text-link" href="/guides/semiconductor-foundry">ファウンドリの意味と分業の仕組みを図解で見る</Link> : null}
        {segment.id === "idm" ? <Link className="text-link" href="/guides/analog-semiconductor-companies">アナログ半導体の意味・用途・主要企業を図解で見る</Link> : null}
        {segment.id === "equipment" ? <Link className="text-link" href="/guides/semiconductor-equipment-manufacturers">製造工程別の装置と主要メーカーを図解で見る</Link> : null}
        {segment.id === "materials" ? <Link className="text-link" href="/guides/semiconductor-silicon-wafer-manufacturers">シリコンウェーハの製造工程と主要メーカーを図解で見る</Link> : null}
      </section>

      {segment.id === "materials" ? <section className="home-section" aria-labelledby="materials-title">
        <h2 id="materials-title">材料の役割から調べる</h2>
        <p>材料は基板、工程で使うガス・液体、パターン形成、研磨などで役割が異なります。以下は当サイトの公開解説への入口です。企業DBの掲載はSUMCOの1社で、材料メーカー全体の一覧ではありません。金属材料、封止材、各種化合物基板などは、この入口では網羅していません。</p>
        <div className="company-grid">{materialsNavigation.map(material => {
          const guide = getGuideBySlug(material.slug);
          if (!guide) return null;
          return <article className="info-card" key={material.slug}>
            <h3>{material.name}</h3><p>{material.role}</p>
            <p><strong>比較するとき：</strong>{material.point}</p>
            <Link className="text-link" href={`/guides/${material.slug}` as Route}>{material.name}の種類・メーカー・出典を見る</Link>
            <p className="disclosure">解説更新日：{guide.updatedAt}。企業公式の根拠と確認日は各解説に掲載。</p>
          </article>;
        })}</div>
        <p className="disclosure">入口の編集更新日：2026-10-08。材料や工程の記述はリンク先の既存解説に基づきます。全記事の出典を本日再確認したという意味ではありません。</p>
      </section> : null}

      <section className="segment-detail-grid" aria-label={`${segment.name}の概要`}>
        <div>
          <span>Role</span>
          <b>{segment.roleInValueChain}</b>
        </div>
        <div>
          <span>Companies</span>
          <b>{segmentCompanies.length} 社</b>
        </div>
        <div>
          <span>Entry point</span>
          <b>{jobCategories.slice(0, 3).join(" / ")}</b>
        </div>
      </section>

      {isFabless ? (
        <section className="home-section" aria-labelledby="fabless-differences-title">
          <div className="section-header">
            <div>
              <p className="eyebrow">事業モデルの違い</p>
              <h2 id="fabless-differences-title">ファブレス・ファウンドリ・IDMの違い</h2>
            </div>
          </div>
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead><tr><th>分類</th><th>主な役割</th><th>ウェーハ製造</th></tr></thead>
              <tbody>
                <tr><th>ファブレス</th><td>製品企画、回路・SoC設計、ソフトウェア、顧客対応</td><td>主にファウンドリなどへ委託</td></tr>
                <tr><th>ファウンドリ</th><td>顧客設計の半導体を製造プロセスと工場で量産</td><td>受託製造を担う</td></tr>
                <tr><th>IDM</th><td>自社製品の企画・設計から製造、販売までを担う</td><td>自社製造を持ち、外部委託を併用する場合もある</td></tr>
              </tbody>
            </table>
          </div>
          <p><Link className="text-link" href="/guides/semiconductor-foundry">ファウンドリの仕組みとIDM・OSATとの違いを詳しく見る</Link></p>
        </section>
      ) : null}

      {isElectronicComponents ? <>
        <section className="home-section" aria-labelledby="electronic-component-types">
          <div className="section-header"><div><p className="eyebrow">製品分野の違い</p><h2 id="electronic-component-types">電子部品の種類と役割</h2></div></div>
          <p>電子部品には、電気を蓄えるもの、機器をつなぐもの、周囲の状態を検知するものなどがあります。扱う製品によって、企業研究で見る技術や用途も変わります。</p>
          <div className="comparison-table-wrap" role="region" aria-label="電子部品の種類と役割" tabIndex={0}>
            <table className="comparison-table">
              <thead><tr><th scope="col">分野</th><th scope="col">製品例</th><th scope="col">役割</th><th scope="col">企業研究のポイント</th></tr></thead>
              <tbody>{electronicComponentsOverview.componentTypes.map((item) => <tr key={item.name}><th scope="row">{item.name}</th><td>{item.examples}</td><td>{item.role}</td><td>{item.researchPoint}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="disclosure">出典：<a href={electronicComponentsOverview.source.url} target="_blank" rel="noreferrer">{electronicComponentsOverview.source.publisher}「{electronicComponentsOverview.source.title}」</a>（確認日 {electronicComponentsOverview.source.accessedAt}）</p>
        </section>
        <section className="home-section" aria-labelledby="electronic-company-comparison">
          <div className="section-header"><div><p className="eyebrow">掲載企業の製品分野</p><h2 id="electronic-company-comparison">日本の電子部品メーカー11社を比べる</h2></div></div>
          <p>当サイトの時価総額ランキングに掲載する日本企業を、企業DBの製品・事業情報から整理しています。業界全体を網羅した一覧ではなく、各社は下記以外にも事業を持つ場合があります。順序は規模や優劣を示すものではありません。</p>
          <div className="comparison-table-wrap" role="region" aria-label="電子部品メーカーの製品分野" tabIndex={0}>
            <table className="comparison-table">
              <thead><tr><th scope="col">企業</th><th scope="col">事業領域</th><th scope="col">主な製品・領域の例</th><th scope="col">公式出典</th></tr></thead>
              <tbody>{segmentCompanies.map((company) => <tr key={company.id}>
                <th scope="row"><Link href={`/companies/${company.slug}` as Route}>{company.nameJa}</Link></th>
                <td>{company.businessModel}</td><td>{company.mainProducts.join(" / ")}</td>
                <td>{company.sources.filter((source) => source.title !== "採用情報").map((source, index) => <span key={source.url}>{index > 0 ? " / " : ""}<a href={source.url} target="_blank" rel="noreferrer">{source.title}</a><small>（確認日 {source.accessedAt}）</small></span>)}</td>
              </tr>)}</tbody>
            </table>
          </div>
          <p>各社ページは事業概要の簡易紹介です。最新の製品情報や募集状況は各社の公式情報も確認してください。</p>
          <p><Link className="text-link" href="/guides/electronic-components-market-cap-ranking">時価総額から電子部品メーカーを見る</Link> / <Link className="text-link" href="/industry-map#industry-zone-electronic-components">業界地図で掲載企業を見る</Link></p>
          <p className="disclosure">ページ更新日：{electronicComponentsOverview.updatedAt}。各社情報の確認日は表内の出典に記載しています。</p>
        </section>
      </> : null}

      {!isElectronicComponents ? (
      <section className="home-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">関連企業</p>
            <h2>{isFabless ? "日本のファブレス企業" : "この領域の企業"}</h2>
          </div>
          <Link className="text-link" href="/industry-map">
            半導体企業一覧へ
          </Link>
        </div>
        <div className="company-grid">
          {(isFabless ? japaneseFablessCompanies : segmentCompanies).map((company) => (
            <CompanyCard company={company} key={company.id} />
          ))}
        </div>
      </section>
      ) : null}

      {isFabless ? (
        <section className="home-section" aria-labelledby="overseas-fabless-title">
          <div className="section-header">
            <div>
              <p className="eyebrow">海外企業</p>
              <h2 id="overseas-fabless-title">海外のファブレス・ファブレス系企業</h2>
            </div>
          </div>
          <p>企業分類は主な事業モデルを簡略化したものです。製造拠点の保有状況や外部委託範囲は、企業・製品・時点によって異なります。</p>
          <div className="company-grid">
            {overseasFablessCompanies.map((company) => (
              <CompanyCard company={company} key={company.id} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="home-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">キャリアのキーワード</p>
            <h2>求人で見かけやすい職種</h2>
          </div>
          <CareerCompassLink
            className="text-link"
            ctaLocation="segment_job_categories"
            ctaVariant="segment_to_role"
            sourcePage={`/segments/${segment.slug}`}
          >
            経験から近い職種を確認する
          </CareerCompassLink>
        </div>
        <div className="keyword-grid">
          {jobCategories.map((category) => (
            <Link className="keyword-chip" href={`/industry-map?query=${encodeURIComponent(category)}` as Route} key={category}>
              {category}
            </Link>
          ))}
        </div>
      </section>

      {!isFabless && !isElectronicComponents && relatedCompanies.length > 0 ? (
        <section className="home-section">
          <div className="section-header">
            <div>
              <p className="eyebrow">代表的な企業</p>
              <h2>代表企業</h2>
            </div>
          </div>
          <div className="result-company-list">
            {relatedCompanies.map((company) => (
              <Link href={`/companies/${company.slug}` as Route} key={company.id}>
                <strong>{company.nameJa}</strong>
                <small>{company.businessModel}</small>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {isFabless ? (
        <section className="home-section capability-faq" aria-labelledby="fabless-faq-title">
          <div className="section-header"><div><p className="eyebrow">FAQ</p><h2 id="fabless-faq-title">ファブレス企業についてよくある質問</h2></div></div>
          {fablessFaq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
          <p className="disclosure">分類の確認日: {segment.lastUpdated}。各社の主力分野と出典は企業詳細ページで確認できます。</p>
        </section>
      ) : null}

      <AffiliateCta title={`${segment.name}領域に近いキャリアを相談する`} />
    </main>
  );
}
