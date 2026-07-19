import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateCta } from "@/components/AffiliateCta";
import { CareerResultPreview } from "@/components/CareerResultPreview";
import { CareerRouteMap } from "@/components/CareerRouteMap";
import { DiagnosisLaunchPanel } from "@/components/DiagnosisLaunchPanel";
import { GuideThumbnail } from "@/components/guide/GuideThumbnail";
import { StructuredData } from "@/components/StructuredData";
import { beginnerGuides } from "@/data/editorial";
import { companies } from "@/data/companies";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: { absolute: "製造業経験を半導体キャリアへ｜キャリア現在地チェック | Manufacturing Compass" },
  description:
    "生産技術、品質保証、設備保全、設計、製造DXなどの経験を、半導体業界の職種に置き換えて整理します。12問・登録不要の現在地チェックで、経験に近い職種と次に準備することが分かります。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "製造業経験を半導体キャリアへ｜キャリア現在地チェック",
    description: "12問・登録不要。製造業で積んだ経験に近い半導体職種と、次に準備することを整理します。",
    url: siteUrl,
  },
};

const diagnosisOutputs = [
  ["01", "経験に近い半導体職種", "担当してきた工程や設備から、仕事の接点がある職種を探します。"],
  ["02", "転職で伝えやすい強み", "改善実績や不良解析を、求人票と比べやすい言葉に置き換えます。"],
  ["03", "今日15分でできること", "数字の確認など、次の準備につながる小さな課題を一つ出します。"],
] as const;

const researchRoutes = [
  { href: "/industry-map", number: "01", title: "業界地図を見る", body: "設計・製造・装置の役割から見る" },
  { href: "/companies", number: "02", title: "企業を探す", body: "事業領域や職種から調べる" },
  { href: "/compare", number: "03", title: "企業を比較する", body: "2社の違いを表で確認する" },
] as const;

const featuredCompanyIds = ["tokyo-electron", "tsmc", "micron"] as const;

const featuredCompanies = featuredCompanyIds
  .map((id) => companies.find((company) => company.id === id))
  .filter((company) => company !== undefined);

const processHubGuide = beginnerGuides.find((guide) => guide.slug === "semiconductor-manufacturing-process");

const processStages = [
  { number: "01", label: "材料・基板", title: "シリコンウェーハを作る", detail: "単結晶・スライス・鏡面仕上げ" },
  { number: "02", label: "前工程・素子形成", title: "微細な回路を作る", detail: "成膜・露光・エッチング・注入" },
  { number: "03", label: "前工程・配線と管理", title: "つないで、測る", detail: "CMP・多層配線・検査計測" },
  { number: "04", label: "テスト・組立", title: "完成品へ仕上げる", detail: "試験・個片化・接続・封止" },
] as const;

const featuredGuides = beginnerGuides.filter((guide) => guide.category !== "technology").slice(0, 3);

export default function Home() {
  return (
    <main className="home-editorial home-simple">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "WebSite", name: "Manufacturing Compass", url: siteUrl, inLanguage: "ja" }} />

      <section className="home-hero home-hero-editorial home-simple-hero">
        <div className="hero-copy">
          <p className="section-label">製造業の経験から、半導体の仕事を考える</p>
          <h1>
            <span>製造業の経験を、</span>
            <span>半導体の仕事につなげる。</span>
          </h1>
          <p>生産技術、品質、設備、設計、製造DXなどの経験から、接点のある半導体職種と、次に準備したいことを整理できます。</p>
          <div className="actions"><Link className="button primary home-primary-action" href="/career-compass">現在地を確認する <span aria-hidden="true">→</span></Link></div>
          <p className="hero-assurance">12問・約3分・入力内容は保存されません</p>
        </div>
        <CareerResultPreview />
        <dl className="home-fact-strip" aria-label="診断の概要">
          <div><dt>12問</dt><dd>経験を確認する質問</dd></div>
          <div><dt>約3分</dt><dd>すき間時間で完了</dd></div>
          <div><dt>登録不要</dt><dd>連絡先の入力なし</dd></div>
        </dl>
      </section>

      <section className="home-section home-simple-section home-tools-overview" aria-labelledby="home-tools-title">
        <header className="editorial-heading editorial-heading--split">
          <div><p className="section-label">WORK &amp; LEARNING TOOLS</p><h2 id="home-tools-title">仕事で使う。動かして理解する。</h2></div>
          <p>製造技術の計算と学び直しを、登録不要・ブラウザ内で使える小さなツールにしました。</p>
        </header>
        <div className="home-tools-grid">
          <Link href="/tools/cpk"><span>01 / PROCESS CAPABILITY</span><h3>Cp・Cpk計算ツール</h3><p>測定データからPp・Ppkと分布を確認。平均とばらつきを動かす学習モードも利用できます。</p><strong>計算・学習を始める <i aria-hidden="true">→</i></strong><dl><div><dt>Cpk</dt><dd>1.42</dd></div><div><dt>Cp</dt><dd>1.58</dd></div></dl></Link>
          <Link href="/tools/doe"><span>02 / DESIGN OF EXPERIMENTS</span><h3>実験計画法（DoE）学習ツール</h3><p>効果、反復、ANOVA、残差、確認実験まで。DoEの判断手順をデータを動かして学べます。</p><strong>5ステップで学ぶ <i aria-hidden="true">→</i></strong><dl><div><dt>学習</dt><dd>5段階</dd></div><div><dt>反復</dt><dd>12実験</dd></div></dl></Link>
        </div>
        <Link className="text-link home-section-link" href="/tools">実務ツールをすべて見る</Link>
      </section>

      <section className="home-section home-simple-section home-career-routes" aria-labelledby="career-route-title">
        <header className="editorial-heading editorial-heading--split">
          <div>
            <p className="section-label">Experience to Semiconductor</p>
            <h2 id="career-route-title">今の経験は、半導体のどの仕事につながる？</h2>
          </div>
          <p>業界が変わっても、工程改善、品質、設備、設計などの仕事には共通点があります。まずは仕事内容の近さから入口を探します。</p>
        </header>
        <CareerRouteMap />
        <p className="home-career-routes__note">診断では12問の回答から、より近い職種と伝えやすい経験を整理します。</p>
      </section>

      <section className="home-section home-simple-section" aria-labelledby="output-title">
        <header className="editorial-heading">
          <p className="section-label">診断で分かること</p>
          <h2 id="output-title">会社名ではなく、仕事の中身から見る</h2>
        </header>
        <div className="diagnosis-feature-list">
          {diagnosisOutputs.map(([number, title, body]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className="home-section home-simple-section home-quest-explainer" aria-labelledby="home-quest-title">
        <div>
          <p className="section-label">Today Quest</p>
          <h2 id="home-quest-title">結果を見て終わらず、今日できる一歩まで。</h2>
          <p>診断結果に合わせて、職務経歴の棚卸しや求人確認につながる15分程度の小さな課題を提案します。</p>
          <Link className="text-link" href="/career-compass">自分のToday Questを確認する</Link>
        </div>
        <aside aria-label="Today Questの表示例">
          <span>TODAY QUEST / 15 MIN</span>
          <strong>改善実績を1つ書く</strong>
          <ol>
            <li><i aria-hidden="true">1</i>改善前の課題</li>
            <li><i aria-hidden="true">2</i>自分が行ったこと</li>
            <li><i aria-hidden="true">3</i>時間・歩留まりなどの数字</li>
          </ol>
          <small>完璧な文章ではなく、まず事実を3行で残します。</small>
        </aside>
      </section>

      {processHubGuide ? (
        <section className="home-section home-simple-section home-process-entry" aria-labelledby="home-process-title">
          <header className="editorial-heading editorial-heading--split">
            <div><p className="section-label">Semiconductor process</p><h2 id="home-process-title">半導体は、どうやって作られる？</h2></div>
            <p>材料から完成品までの流れを知ると、装置・材料・デバイス企業の役割や、プロセス職の仕事がつながって見えてきます。</p>
          </header>
          <div className="home-process-entry__panel">
            <div className="home-process-entry__copy">
              <span>全15記事・初心者向け図解シリーズ</span>
              <h3>{processHubGuide.title}</h3>
              <p>設計、ウェーハ製造、前工程、テスト、組立、最終検査までを一つの流れで整理しました。まず全体像を読み、気になる工程の詳しい仕組みへ進めます。</p>
              <div>
                <Link className="home-process-entry__primary" href={`/guides/${processHubGuide.slug}`}>半導体製造工程の全体像を読む <span aria-hidden="true">→</span></Link>
                <Link className="text-link" href="/guides#process-series-title">15記事を工程順に見る</Link>
              </div>
            </div>
            <ol className="home-process-entry__stages" aria-label="半導体製造工程シリーズの4段階">
              {processStages.map((stage) => (
                <li key={stage.number}>
                  <span>{stage.number}</span>
                  <div><small>{stage.label}</small><strong>{stage.title}</strong><p>{stage.detail}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section className="home-section home-simple-section research-routes" aria-labelledby="research-title">
        <header className="editorial-heading">
          <p className="section-label">業界地図・企業研究</p>
          <h2 id="research-title">半導体業界のどこに、今の経験が近いのかを見る。</h2>
        </header>
        <nav aria-label="半導体業界と企業を調べる">
          {researchRoutes.map((route) => (
            <Link href={route.href} key={route.href}>
              <span>{route.number}</span>
              <strong>{route.title}</strong>
              <small>{route.body}</small>
              <i aria-hidden="true">→</i>
            </Link>
          ))}
        </nav>
      </section>

      <section className="home-section home-simple-section home-company-spotlight" aria-labelledby="company-spotlight-title">
        <header className="editorial-heading editorial-heading--split">
          <div><p className="section-label">Featured companies</p><h2 id="company-spotlight-title">注目企業を、事業と職種から見る</h2></div>
          <p>知名度や印象ではなく、主力領域と今の経験との接点から企業研究を始められます。</p>
        </header>
        <div>
          {featuredCompanies.map((company, index) => (
            <Link href={`/companies/${company.slug}`} key={company.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><small>{company.businessModel}</small><strong>{company.nameJa}</strong></div>
              <p>{company.careerSummary}</p>
              <i aria-hidden="true">→</i>
            </Link>
          ))}
        </div>
        <Link className="text-link home-section-link" href="/companies">企業一覧から探す</Link>
      </section>

      <section className="home-section home-simple-section home-guide-preview" aria-labelledby="home-guide-title">
        <header className="editorial-heading editorial-heading--split">
          <div><p className="section-label">Guides &amp; real stories</p><h2 id="home-guide-title">実体験と公開情報から、転職を具体化する</h2></div>
          <p>職種のつながり、求人の見方、年収や英語など、次の判断に必要なテーマを整理しています。</p>
        </header>
        <div className="home-guide-preview__grid">
          {featuredGuides.map((guide) => (
            <Link href={`/guides/${guide.slug}`} key={guide.slug}>
              <GuideThumbnail category={guide.category} compact slug={guide.slug} title={guide.title} />
              <span>{guide.readTime}</span>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <small><b>Today Quest</b>{guide.todayQuest}</small>
            </Link>
          ))}
        </div>
        <Link className="text-link home-section-link" href="/guides">ガイドをすべて見る</Link>
      </section>

      <section className="home-section home-simple-section operator-summary" aria-labelledby="operator-title">
        <div className="operator-summary__profile">
          <p className="section-label">RYOの実体験</p>
          <h2 id="operator-title">求人を比べて、初めて気づいたこと</h2>
          <div className="operator-summary__stamp" aria-label="RYO、製造業経験約10年">
            <strong>RYO</strong>
            <span>製造業経験 約10年</span>
          </div>
          <ul>
            <li>製造技術・工程改善・品質</li>
            <li>海外工場・製造DX</li>
            <li>電子部品から半導体へ</li>
          </ul>
        </div>
        <div className="operator-summary__story">
          <p>私は電子部品メーカーで、製造技術、工程改善、品質、不良解析に関わってきました。当時は、その経験が半導体の仕事につながるとは考えていませんでした。製造現場で積んだ経験を、社外でどう説明すればよいかも分かりませんでした。</p>
          <p>転職活動で求人票を比べるうちに、工程条件、歩留まり、設備、品質などに重なる部分があると気づきました。Manufacturing Compassは、過去の自分が欲しかった「今の経験を別の仕事と比べる道具」として作っています。</p>
          <Link className="text-link" href="/about">RYOについて詳しく見る</Link>
        </div>
      </section>

      <section className="home-section home-simple-section home-agent-path">
        <AffiliateCta
          title="診断結果をもとに、相談したい論点を整理する"
          body="今狙える職種、半年後に広がる選択肢、経験の伝え方が見えてきたら、相談先の特徴を比較できます。"
        />
      </section>

      <DiagnosisLaunchPanel className="home-section home-simple-section" />
    </main>
  );
}
