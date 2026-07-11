import Link from "next/link";
import { AffiliateCta } from "@/components/AffiliateCta";
import { CompanyCard } from "@/components/CompanyCard";
import { StructuredData } from "@/components/StructuredData";
import { companies, segments } from "@/data/companies";
import { siteUrl } from "@/lib/format";

const trustItems = [
  { title: "ログイン不要", body: "アカウント登録なしで使えます" },
  { title: "入力内容を保存しない", body: "ブラウザ上で結果を整理します" },
  { title: "静的ルールで診断", body: "回答に応じた根拠を確認できます" },
  { title: "すぐに結果を表示", body: "次に狙う職種と行動がわかります" },
];

const resultOverview = [
  { label: "Career route", title: "経験がつながる職種", body: "現在の経験を、半導体業界の職種へ翻訳します。" },
  { label: "Market value", title: "市場価値と年収の目安", body: "今の立ち位置と、次に狙えるゾーンを整理します。" },
  { label: "Experience", title: "強みと準備ポイント", body: "評価される経験と、補いたい要素を分けて確認できます。" },
  { label: "Today quest", title: "今日からできる一手", body: "市場価値につながる行動を、ひとつに絞って提案します。" },
];

const questFlow = [
  { stage: "01", title: "現在地", body: "職種と近い経験" },
  { stage: "02", title: "経験", body: "実績・英語・半導体接点" },
  { stage: "03", title: "狙い", body: "年収・外資・専門性" },
  { stage: "04", title: "今日の一手", body: "市場価値を上げる行動" },
];

export default function Home() {
  const featuredCompanies = segments.flatMap((segment) => {
    const company = companies.find((item) => segment.relatedCompanyIds.includes(item.id));
    return company ? [company] : [];
  });

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
            <span>4 Stage Career Compass</span>
            <span>No login</span>
          </div>
          <h1>
            <span>半導体業界で、</span>
            <span>次に狙う職種と</span>
            <span>準備がわかる。</span>
          </h1>
          <p>
            今の経験がどの職種につながるか。市場価値、想定年収、伸ばしたいスキル、今日からできる行動まで整理します。
          </p>
          <div className="actions">
            <Link className="button primary home-primary-action" href="/career-compass">
              無料でキャリアの現在地を確認する
            </Link>
            <Link className="button ghost" href="/industry-map">半導体業界の全体像を見る</Link>
          </div>
          <p className="hero-assurance">所要時間は数分。氏名や連絡先の入力はありません。</p>
        </div>

        <div className="compass-stage" aria-label="Career Compassで整理できる4つの段階">
          <div className="compass-grid" />
          <div className="compass-orbit orbit-one" />
          <div className="compass-orbit orbit-two" />
          <div className="compass-core">
            <span>MC</span>
            <strong>Career Compass</strong>
          </div>
          {questFlow.map((step, index) => (
            <div className={`compass-node node-${index + 1}`} key={step.stage}>
              <span>Stage {step.stage}</span>
              <strong>{step.title}</strong>
            </div>
          ))}
          <div className="route-card">
            <span>Result preview</span>
            <strong>経験がつながる職種</strong>
            <small>Route / Market value / Skill / Today Quest</small>
          </div>
        </div>
      </section>

      <section className="home-trust-strip" aria-label="Career Compassの特徴">
        {trustItems.map((item) => (
          <div key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.body}</span>
          </div>
        ))}
      </section>

      <section className="home-section home-result-overview">
        <div className="section-header">
          <div>
            <p className="eyebrow">What you will know</p>
            <h2>診断後に、転職の判断材料が残る。</h2>
            <p>点数だけで終わらず、経験の見せ方と次の行動まで一続きで確認できます。</p>
          </div>
          <Link className="text-link" href="/career-compass">Career Compassを始める</Link>
        </div>

        <div className="result-overview-layout">
          <div className="result-output-list">
            {resultOverview.map((item, index) => (
              <article key={item.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="eyebrow">{item.label}</p>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="quest-flow-panel">
            <p className="eyebrow">4 Stage Flow</p>
            <h3>答える順番にも、理由があります。</h3>
            <p>現在地から狙いを整理し、最後に今日の一手へつなげます。</p>
            <ol>
              {questFlow.map((step) => (
                <li key={step.stage}>
                  <span>{step.stage}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <small>{step.body}</small>
                  </div>
                </li>
              ))}
            </ol>
            <Link className="button primary" href="/career-compass">現在地を確認する</Link>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Industry map</p>
            <h2>職種だけでなく、業界のどこで働くかを見る。</h2>
            <p>同じ半導体業界でも、企業の役割によって求められる経験は異なります。</p>
          </div>
          <Link className="text-link" href="/industry-map">業界地図を見る</Link>
        </div>
        <div className="segment-strip">
          {segments.map((segment, index) => (
            <Link className="segment-tile" href={`/segments/${segment.slug}`} key={segment.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p className="eyebrow">{segment.shortName}</p>
              <h3>{segment.name}</h3>
              <p>{segment.description}</p>
              <small>{segment.roleInValueChain}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section spotlight-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Company research</p>
            <h2>業界の役割から、代表的な企業を知る。</h2>
            <p>各領域の企業情報を、公開情報と出典をもとに整理しています。</p>
          </div>
          <Link className="text-link" href="/companies">企業一覧を見る</Link>
        </div>
        <div className="company-grid">
          {featuredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>

      <section className="home-section editorial-note" aria-labelledby="editorial-note-title">
        <div>
          <p className="eyebrow">How we research</p>
          <h2 id="editorial-note-title">キャリア判断に使える、確かな情報を。</h2>
        </div>
        <p>
          企業公式サイト、IR、採用情報などの公開情報を優先し、情報ソースと最終更新日を掲載します。診断結果は転職可能性を断定するものではなく、相談論点と準備を整理するための参考情報です。
        </p>
        <div className="editorial-links">
          <Link className="text-link" href="/about">編集・運営方針を見る</Link>
          <Link className="text-link" href="/disclaimer">診断結果の考え方を見る</Link>
        </div>
      </section>

      <div className="home-section">
        <AffiliateCta
          title="半導体業界に強い転職エージェントに相談する"
          body="診断で経験の見せ方と相談論点が見えたら、今狙える職種とこれからの準備を第三者に確認できます。"
        />
      </div>
    </main>
  );
}
