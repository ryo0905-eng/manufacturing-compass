import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/StructuredData";
import styles from "@/components/semiconductor-location-map.module.css";
import { locationSources } from "@/data/company-locations";
import { factoryProjectSources } from "@/data/factory-projects";
import { locationCompanies } from "@/data/location-companies";
import { siteUrl } from "@/lib/format";
import { jobFamilyOptions, locationTypeOptions } from "@/lib/location-explorer";
import { getPrefectureLocationPages } from "@/lib/prefecture-locations";

type Props = { params: Promise<{ prefecture: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPrefectureLocationPages().map(page => ({ prefecture: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { prefecture } = await params;
  const page = getPrefectureLocationPages().find(item => item.slug === prefecture);
  if (!page) return {};
  const title = `${page.name}の半導体工場・拠点一覧｜半導体メーカー・製造拠点マップ`;
  const description = `${page.name}の半導体関連拠点${page.locations.length}か所について、所在地、拠点の種類、関連職種と公式情報を紹介します。`;
  const url = `/semiconductor-map/prefectures/${page.slug}`;
  return { title: { absolute: title }, description, alternates: { canonical: url }, openGraph: { title, description, type: "website", url } };
}

export default async function PrefecturePage({ params }: Props) {
  const { prefecture } = await params;
  const pages = getPrefectureLocationPages();
  const page = pages.find(item => item.slug === prefecture);
  if (!page) notFound();

  const companyById = new Map(locationCompanies.map(company => [company.id, company]));
  const names = [...new Set(page.locations.map(location => companyById.get(location.companyId)?.nameJa).filter((name): name is string => Boolean(name)))].join("、");
  const municipalities = [...new Set(page.locations.map(location => location.municipality))].join("、");
  const projects = page.projects.map(project => `${project.name}（${project.stage}）`).join("、");
  const intro = `${page.name}には、公式情報で確認した半導体関連拠点が${page.locations.length}か所あります（${municipalities}）。掲載企業は${names}です。`;
  const factoryCount = page.locations.filter(location => location.locationTypes.includes("factory")).length;
  const faq = [
    { question: `${page.name}に半導体工場はありますか？`, answer: `${factoryCount ? `掲載拠点のうち${factoryCount}か所に工場が含まれます。` : "掲載拠点に工場は含まれていません。"}${intro}拠点には本社・設計・研究開発なども含まれます。種類は各拠点の一覧をご確認ください。` },
    { question: `${page.name}の主な半導体企業はどこですか？`, answer: `当サイトの掲載企業は${names}です。掲載範囲は県内のすべての企業を網羅するものではありません。` },
    ...(page.projects.length ? [{ question: `${page.name}で進んでいる半導体工場の新設・増設計画は？`, answer: `掲載案件は${projects}です。稼働済みの案件も含み、予定は変更される可能性があります。` }] : []),
  ];
  const path = `/semiconductor-map/prefectures/${page.slug}`;
  return <main className="page">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "日本の半導体企業・工場マップ", item: `${siteUrl}/semiconductor-map` },
      { "@type": "ListItem", position: 3, name: page.name, item: `${siteUrl}${path}` },
    ] }} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "ItemList", name: `${page.name}の半導体工場・拠点一覧`,
      numberOfItems: page.locations.length, itemListElement: page.locations.map((location, index) => ({
        "@type": "ListItem", position: index + 1, name: `${companyById.get(location.companyId)?.nameJa ?? ""} ${location.name}`,
        url: `${siteUrl}${path}#${location.id}`,
      })) }} />
    <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/semiconductor-map">日本の半導体企業・工場マップ</Link><span>/</span><span>{page.name}</span></nav>
    <header className="page-hero"><h1>{page.name}の半導体工場・拠点一覧</h1>
      <p>{intro}</p>{page.projects.length ? <p>新設・増設の掲載案件は、{projects}です。</p> : null}</header>
    <section className="home-section" aria-labelledby="locations-title"><h2 id="locations-title">掲載拠点一覧</h2>
      <div className="company-grid">{page.locations.map(location => {
        const company = companyById.get(location.companyId);
        return <article className="info-card" id={location.id} key={location.id}>
          <h3>{company?.slug ? <Link href={`/companies/${company.slug}` as Route}>{company.nameJa}</Link> : company?.nameJa} {location.name}</h3>
          <p>市町村：{location.municipality}<br />拠点の種別：{location.locationTypes.map(type => locationTypeOptions.find(option => option.value === type)?.label ?? type).join("・")}</p>
          {location.jobFamilies.length ? <p>関連職種：{location.jobFamilies.map(job => jobFamilyOptions.find(option => option.value === job)?.label ?? job).join("・")}</p> : null}
          <p>確認日：{location.lastVerifiedAt}</p>
          <p>出典：{location.sourceIds.map((id, index) => {
            const source = locationSources.find(item => item.id === id);
            return source ? <span key={id}>{index > 0 ? " / " : ""}<a href={source.url} target="_blank" rel="noreferrer">{source.publisher}「{source.title}」</a>（確認日 {source.accessedAt}）</span> : null;
          })}</p>
        </article>;
      })}</div>
    </section>
    {page.projects.length ? <section className="home-section" aria-labelledby="projects-title"><h2 id="projects-title">新設・増設の掲載案件</h2>
      <p>稼働済みの案件も含みます。予定は変更される可能性があります。</p>
      <div className="company-grid">{page.projects.map(project => <article className="info-card" key={project.id}>
        <h3>{project.name}</h3><p>段階：{project.stage}（確認日 {project.checkedAt}）</p>
        <ul>{project.milestones.map((milestone, index) => <li key={index}>{milestone.dateLabel}：{milestone.label}（{milestone.outcome === "actual" ? "実績・発表" : "予定"}）</li>)}</ul>
        <p>{project.note}</p><p>出典：{project.sourceNumbers.map((number, index) => {
          const source = factoryProjectSources[number - 1];
          return source ? <span key={number}>{index > 0 ? " / " : ""}<a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>（確認日 {source.accessedAt}）</span> : null;
        })}</p>
      </article>)}</div>
    </section> : null}
    <section className="home-section" aria-labelledby="faq-title"><h2 id="faq-title">よくある質問</h2>
      {faq.map(item => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}
    </section>
    <section className={styles.methodology} aria-labelledby="methodology-title"><div><p className="section-label">出典・掲載基準</p><h2 id="methodology-title">公式情報で確認できた内容だけを掲載</h2></div>
      <ul><li>正式な拠点名、所在地、運営法人、半導体との関係を確認できる国内拠点を掲載しています。</li>
        <li>同じ敷地は1拠点として扱い、既存工場と新棟の状態を分けます。試作ラインの稼働は量産開始とは異なります。</li>
        <li>掲載数は当サイトの確認範囲であり、全国の工場数や求人件数を表しません。</li>
        <li>職種は拠点との根拠がある場合だけ表示します。所在地と現在の採用状況は別に確認しています。</li>
        <li>座標を照合できた拠点だけピンを表示し、施設の正門や建屋入口の位置は保証しません。</li>
        <li>公式ページの地図案内をエージェントが照合した座標は、人による確認と区別して記録しています。</li>
        <li>採用情報の確認期限を過ぎた場合は「再確認中」と表示します。</li></ul></section>
    <section className="home-section" aria-labelledby="other-prefectures"><h2 id="other-prefectures">他の都道府県から探す</h2>
      <ul>{pages.filter(item => item.slug !== page.slug).map(item => <li key={item.slug}><Link href={`/semiconductor-map/prefectures/${item.slug}` as Route}>{item.name}（{item.locations.length}拠点）</Link></li>)}</ul>
      <p><Link href="/semiconductor-map">日本の半導体企業・工場マップへ戻る</Link></p>
      <p><Link href="/guides/japan-semiconductor-factory-projects">日本の半導体工場の新設・増設ガイドを見る</Link></p>
    </section>
  </main>;
}
