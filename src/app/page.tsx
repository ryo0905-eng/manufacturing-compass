import Link from "next/link";
import { AffiliateCta } from "@/components/AffiliateCta";
import { CompanyCard } from "@/components/CompanyCard";
import { StructuredData } from "@/components/StructuredData";
import { companies, segments } from "@/data/companies";
import { siteUrl } from "@/lib/format";

export default function Home() {
  return (
    <main className="page">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Manufacturing Compass",
          url: siteUrl,
          inLanguage: "ja",
        }}
      />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Manufacturing Compass</p>
          <h1>半導体業界への転職を、もっとわかりやすく。</h1>
          <p>
            企業を見る前に、業界の構造とキャリアの距離感をつかむ。今狙える会社と、次に近づける会社を静かに整理します。
          </p>
          <div className="actions">
            <Link className="button primary" href="/industry-map">
              業界地図を見る
            </Link>
            <Link className="button ghost" href="/companies">
              企業を調べる
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-label="半導体ウェハーを模したビジュアル">
          <div className="wafer" />
          <div className="signal-line line-one" />
          <div className="signal-line line-two" />
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Industry map</p>
            <h2>業界を4つに分けて見る</h2>
          </div>
        </div>
        <div className="grid-3">
          {segments.slice(0, 3).map((segment) => (
            <article className="info-card" key={segment.id}>
              <p className="eyebrow">{segment.shortName}</p>
              <h3>{segment.name}</h3>
              <p>{segment.description}</p>
              <Link className="text-link" href="/industry-map">
                地図で確認する
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Companies</p>
            <h2>まず見る4社</h2>
          </div>
          <Link className="text-link" href="/companies">
            すべて見る
          </Link>
        </div>
        <div className="company-grid">
          {companies.slice(0, 3).map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>

      <AffiliateCta />
    </main>
  );
}
