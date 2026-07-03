import Link from "next/link";
import { AffiliateCta } from "@/components/AffiliateCta";
import { CompanyCard } from "@/components/CompanyCard";
import { StructuredData } from "@/components/StructuredData";
import { companies, segments } from "@/data/companies";
import { siteUrl } from "@/lib/format";

const compassSteps = [
  { label: "業界", value: "Map" },
  { label: "企業", value: "Company" },
  { label: "距離", value: "Fit" },
  { label: "準備", value: "Next" },
];

export default function Home() {
  return (
    <main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Manufacturing Compass",
          url: siteUrl,
          inLanguage: "ja",
        }}
      />
      <section className="home-hero">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span>Manufacturing Compass</span>
            <span>Semiconductor career map</span>
          </div>
          <h1>求人を見る前に、半導体業界の現在地をつかむ。</h1>
          <p>会社名の羅列ではなく、業界構造、企業の役割、あなたの経験からの距離感をひとつの地図にします。</p>
          <div className="actions">
            <Link className="button primary" href="/industry-map">探索を始める</Link>
            <Link className="button ghost" href="/compare">企業を比べる</Link>
          </div>
          <div className="hero-metrics" aria-label="MVP の概要">
            <div><strong>4</strong><span>Segments</span></div>
            <div><strong>{companies.length}</strong><span>Companies</span></div>
            <div><strong>0</strong><span>Login required</span></div>
          </div>
        </div>

        <div className="compass-stage" aria-label="半導体キャリアコンパス">
          <div className="compass-grid" />
          <div className="compass-orbit orbit-one" />
          <div className="compass-orbit orbit-two" />
          <div className="compass-core">
            <span>MC</span>
            <strong>Career Compass</strong>
          </div>
          {compassSteps.map((step, index) => (
            <div className={`compass-node node-${index + 1}`} key={step.label}>
              <span>{step.label}</span>
              <strong>{step.value}</strong>
            </div>
          ))}
          <div className="route-card">
            <span>Quality → Process</span>
            <strong>半年で近づく準備</strong>
            <small>統計 / 歩留まり / 英語説明</small>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Industry map</p>
            <h2>まず、どの領域に近いか。</h2>
          </div>
          <Link className="text-link" href="/industry-map">業界地図を見る</Link>
        </div>
        <div className="segment-strip">
          {segments.map((segment, index) => (
            <Link className="segment-tile" href="/industry-map" key={segment.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p className="eyebrow">{segment.shortName}</p>
              <h3>{segment.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section spotlight-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Companies</p>
            <h2>気になる会社を、入口だけ見る。</h2>
          </div>
          <Link className="text-link" href="/companies">
            すべて見る
          </Link>
        </div>
        <div className="company-grid">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>

      <div className="home-section">
        <AffiliateCta />
      </div>
    </main>
  );
}
