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
          <p className="eyebrow">Semiconductor career guide</p>
          <h1>半導体業界への転職を、もっとわかりやすく。</h1>
          <p>
            業界地図、企業研究、比較、キャリア準備をまとめて確認。今狙える会社と、半年後・1年後に向けて挑戦しやすくなる会社を前向きに整理します。
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
          <div className="hero-stat">
            <p className="eyebrow">MVP focus</p>
            <strong>半導体業界に一点突破</strong>
            <p>ファウンドリ、メモリ、製造装置、ファブレスから始めます。</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Industry map</p>
            <h2>まず業界の位置関係をつかむ</h2>
          </div>
          <p>半導体企業は同じ業界でも役割が大きく違います。求人を見る前に、どの領域が自分の経験と近いかを確認できます。</p>
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
            <h2>初期企業データ</h2>
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
