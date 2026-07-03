import Link from "next/link";
import { AffiliateCta } from "@/components/AffiliateCta";
import { CompanyCard } from "@/components/CompanyCard";
import { StructuredData } from "@/components/StructuredData";
import { companies, segments } from "@/data/companies";
import { siteUrl } from "@/lib/format";

const compassSteps = [
  { label: "価値", value: "Score" },
  { label: "年収", value: "Salary" },
  { label: "伸ばす", value: "Skill" },
  { label: "今日", value: "Action" },
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
            <span>Market value check</span>
          </div>
          <h1>あなたの半導体キャリア市場価値を、3分で見える化。</h1>
          <p>経験から想定年収、狙える会社、伸ばすべきスキル、今日やることまで整理します。</p>
          <div className="actions">
            <Link className="button primary" href="/career-compass">市場価値を診断する</Link>
            <Link className="button ghost" href="/industry-map">業界地図を見る</Link>
          </div>
          <div className="hero-metrics" aria-label="MVP の概要">
            <div><strong>4</strong><span>Segments</span></div>
            <div><strong>{companies.length}</strong><span>Companies</span></div>
            <div><strong>0</strong><span>Login required</span></div>
          </div>
        </div>

        <div className="compass-stage" aria-label="半導体キャリア市場価値診断">
          <div className="compass-grid" />
          <div className="compass-orbit orbit-one" />
          <div className="compass-orbit orbit-two" />
          <div className="compass-core">
            <span>MC</span>
            <strong>Market Value</strong>
          </div>
          {compassSteps.map((step, index) => (
            <div className={`compass-node node-${index + 1}`} key={step.label}>
              <span>{step.label}</span>
              <strong>{step.value}</strong>
            </div>
          ))}
          <div className="route-card">
            <span>Production → Process</span>
            <strong>市場価値 81</strong>
            <small>年収 / 伸ばすこと / 今日の一手</small>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="conversion-band">
          <div>
            <p className="eyebrow">Start here</p>
            <h2>まずは、いまの市場価値を知る。</h2>
          </div>
          <p>職種、年数、英語、狙いから、年収レンジと次の一手を返します。</p>
          <Link className="button primary" href="/career-compass">診断する</Link>
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
