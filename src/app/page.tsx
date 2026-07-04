import Link from "next/link";
import { AffiliateCta } from "@/components/AffiliateCta";
import { CompanyCard } from "@/components/CompanyCard";
import { StructuredData } from "@/components/StructuredData";
import { companies, segments } from "@/data/companies";
import { siteUrl } from "@/lib/format";

const resultCards = [
  { label: "Career Route", value: "設備保全 → 装置FE", note: "近い入口" },
  { label: "Power Score", value: "78", note: "Growth" },
  { label: "Estimated Reward", value: "620〜820万", note: "目安" },
  { label: "Recommended Skill", value: "停止時間の数値化", note: "伸ばす" },
  { label: "Today Quest", value: "改善実績を1つ書く", note: "今日" },
];

const questFlow = [
  { stage: "01", title: "現在地", body: "職種と近い経験" },
  { stage: "02", title: "経験", body: "実績・英語・半導体接点" },
  { stage: "03", title: "狙い", body: "年収・外資・専門性" },
  { stage: "04", title: "今日の一手", body: "市場価値を上げる行動" },
];

export default function Home() {
  const featuredCompanies = companies.slice(0, 8);

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
            <span>4 Stage Career Quest</span>
            <span>No login</span>
          </div>
          <h1>半導体キャリアの次のルートを探索する。</h1>
          <p>4つのStageで、今の市場価値、想定年収、伸ばすSkill、Today Questを表示します。</p>
          <div className="actions">
            <Link className="button primary" href="/career-compass">Questを開始する</Link>
            <Link className="button ghost" href="/industry-map">業界地図を見る</Link>
          </div>
          <div className="hero-metrics" aria-label="MVP の概要">
            <div><strong>4</strong><span>Stages</span></div>
            <div><strong>{companies.length}</strong><span>Companies</span></div>
            <div><strong>1</strong><span>Today Quest</span></div>
          </div>
        </div>

        <div className="compass-stage" aria-label="半導体キャリア市場価値診断">
          <div className="compass-grid" />
          <div className="compass-orbit orbit-one" />
          <div className="compass-orbit orbit-two" />
          <div className="compass-core">
            <span>MC</span>
            <strong>4 Stage Quest</strong>
          </div>
          {questFlow.map((step, index) => (
            <div className={`compass-node node-${index + 1}`} key={step.stage}>
              <span>Stage {step.stage}</span>
              <strong>{step.title}</strong>
            </div>
          ))}
          <div className="route-card">
            <span>Route unlocked</span>
            <strong>装置FEルート</strong>
            <small>Power / Reward / Skill / Today Quest</small>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Sample result</p>
            <h2>入力後に見えるもの。</h2>
          </div>
          <Link className="text-link" href="/career-compass">Questを開始する</Link>
        </div>
        <div className="sample-result-grid">
          {resultCards.map((card) => (
            <article className="sample-result-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.note}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">4 Stage Quest Flow</p>
            <h2>現在地から、今日の一手まで。</h2>
          </div>
        </div>
        <div className="quest-flow-grid">
          {questFlow.map((step) => (
            <article className="quest-flow-card" key={step.stage}>
              <span>{step.stage}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="today-quest-preview">
          <div>
            <p className="eyebrow">Today Quest Preview</p>
            <h2>今日やることが、1つ出る。</h2>
            <p>将来は保存、完了、履歴化して、市場価値の積み上げにします。</p>
          </div>
          <div className="today-quest-card">
            <div className="quest-check" aria-hidden="true" />
            <div>
              <span>Today Quest</span>
              <strong>担当装置の停止時間を、改善前後で1行にする</strong>
              <small>保存・完了・履歴化予定</small>
            </div>
          </div>
          <Link className="button primary" href="/career-compass">Questを開始する</Link>
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Industry map</p>
            <h2>診断後、近い領域を見る。</h2>
          </div>
          <Link className="text-link" href="/industry-map">業界地図を見る</Link>
        </div>
        <div className="segment-strip">
          {segments.map((segment, index) => (
            <Link className="segment-tile" href={`/segments/${segment.slug}`} key={segment.id}>
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
            <h2>診断後に気になる企業を見る。</h2>
          </div>
          <Link className="text-link" href="/companies">
            すべて見る
          </Link>
        </div>
        <div className="company-grid">
          {featuredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>

      <div className="home-section">
        <AffiliateCta
          title="半導体業界に強い転職エージェントに相談する"
          body="診断でルートと相談論点が見えたら、今狙える会社と半年後の準備を確認できます。"
        />
      </div>
    </main>
  );
}
