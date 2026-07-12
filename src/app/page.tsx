import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateCta } from "@/components/AffiliateCta";
import { CareerTimeline } from "@/components/CareerTimeline";
import { DiagnosisCta } from "@/components/DiagnosisCta";
import { StructuredData } from "@/components/StructuredData";
import { companies, segments } from "@/data/companies";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: { absolute: "製造業経験を半導体キャリアへ｜市場価値診断 | Manufacturing Compass" },
  description:
    "生産技術、品質保証、設備保全、設計、製造DXなどの経験を、半導体業界の職種に置き換えて整理します。12問・登録不要のキャリア診断で、狙いやすい職種と次に準備することが分かります。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "製造業経験を半導体キャリアへ｜市場価値診断",
    description: "12問・登録不要。製造業で積んだ経験に近い半導体職種と、次に準備することを整理します。",
    url: siteUrl,
  },
};

const diagnosisOutputs = [
  ["いまの経験に近い半導体職種", "生産技術、品質、設備、設計、製造DXなど、担当してきた仕事から近い入口を探します。"],
  ["転職時に伝えやすい強み", "担当工程、不良の原因、改善前後の数字まで分けて、求人票の言葉と対応させます。"],
  ["足りない経験", "半導体固有のプロセス、装置、材料、英語など、求人ごとの差を見ます。"],
  ["今日15分でできる行動", "改善実績を『課題・行動・効果』の3行で書くところまで具体化します。"],
  ["エージェントに相談するためのメモ", "希望だけでなく、装置トラブルや海外調整などの具体例を持って相談できる形にします。"],
] as const;

const practicalExamples = [
  "担当した装置のトラブル事例を一つ整理する",
  "英語を使った場面を三つ思い出す",
  "不良率や停止時間の改善前後を確認する",
  "求人票にある言葉と自分の経験を対応させる",
] as const;

const featuredCompanyIds = ["tsmc", "nvidia", "tokyo-electron", "intel", "kioxia"];

export default function Home() {
  const featuredCompanies = featuredCompanyIds.flatMap((id) => {
    const company = companies.find((item) => item.id === id);
    return company ? [company] : [];
  });

  return (
    <main className="home-editorial">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "WebSite", name: "Manufacturing Compass", url: siteUrl, inLanguage: "ja" }} />

      <section className="home-hero home-hero-editorial">
        <div className="hero-copy">
          <p className="section-label">製造業で働く人のための、半導体キャリア案内</p>
          <h1>製造業で積んだ経験は、半導体でどこまで通用する？</h1>
          <p>
            生産技術、品質、設備、設計、製造DX。今までやってきた仕事を半導体業界の職種に置き換え、いま狙いやすい仕事と、次に準備することを12問で整理します。
          </p>
          <div className="actions"><Link className="button primary home-primary-action" href="/career-compass">12問の診断を始める</Link></div>
          <p className="hero-assurance">所要時間は約3分です。氏名、メールアドレス、電話番号の入力はありません。</p>
        </div>
        <aside className="operator-note">
          <p>RYOのメモ</p>
          <blockquote>
            私も最初は、自分の工程改善や品質の経験が、半導体の求人につながるとは思っていませんでした。会社名ではなく仕事を分解して比べると、初めて見える選択肢があります。
          </blockquote>
          <Link href="/about">このサイトを作っている人</Link>
        </aside>
      </section>

      <section className="home-section story-section" aria-labelledby="why-title">
        <header className="editorial-heading">
          <p className="section-label">このサイトを作った理由</p>
          <h2 id="why-title">過去の自分が欲しかった、経験の使い道を探す道具</h2>
        </header>
        <div className="story-columns">
          <div>
            <p>私は地方の国立大学を卒業し、新卒で地元に比較的近い大手電子部品メーカーのグループ会社に入りました。</p>
            <p>当時は、半導体業界へ行きたいという明確な目標があったわけではありません。自宅から比較的近く、大学で学んだことも多少は生かせそうだった。正直に言えば、そのくらいの理由で選んだ会社でした。</p>
            <p>地方の工場で、製造技術、工程改善、品質、不良解析、めっきなどの表面処理を一つずつ経験しました。改善が年1億円を超えるコスト削減につながったこともあります。海外工場で働き、Python、SQL、BIによる製造データ活用や製造DXにも関わりました。</p>
          </div>
          <div>
            <p>それでも当時は、自分を半導体業界の人材だとは考えていませんでした。何度か転職活動をする中で、工程条件、歩留まり、不良解析、品質、設備、海外工場との調整など、電子部品と半導体の求人に重なる部分があると初めて気づきました。</p>
            <p>最初の会社を転職する直前の年収は約700万円でした。その後は複数のメーカーで経験を積み、転職後に仕事内容とのミスマッチを感じたこともあります。</p>
            <p>電子部品だけでなく半導体まで、日系だけでなく外資系まで求人を見るようになり、仕事内容、専門性、将来性、年収を総合して、30代で外資系半導体メーカーへの転職を決めました。私の場合は、選択肢を広げた結果として年収1,000万円を超える見込みですが、すべての人に同じ結果が出るわけではありません。</p>
          </div>
        </div>
      </section>

      <section className="home-section diagnosis-output" aria-labelledby="output-title">
        <header className="editorial-heading"><p className="section-label">診断すると分かること</p><h2 id="output-title">経験を、求人で伝わる言葉に置き換える</h2></header>
        <div className="ruled-list">
          {diagnosisOutputs.map(([title, body], index) => <article key={title}><span>{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
        <aside className="practical-note"><strong>たとえば、こんな準備です</strong><ul>{practicalExamples.map((item) => <li key={item}>{item}</li>)}</ul></aside>
      </section>

      <section className="home-section score-note" aria-labelledby="score-title">
        <div><p className="section-label">点数をつけて終わる診断ではありません</p><h2 id="score-title">市場価値は、一つの数字だけでは決まりません</h2></div>
        <div><p>経験年数が同じでも、担当範囲、成果、英語、勤務地、業界によって評価は変わります。この診断の目的は、優劣を決めることではありません。</p><p>どの経験を強みとして話せるか。次に何を補うか。今すぐ転職しなくても、半年後の選択肢を増やすために使えます。</p></div>
      </section>

      <section className="home-section" aria-labelledby="timeline-title">
        <header className="editorial-heading"><p className="section-label">RYOのキャリア年表</p><h2 id="timeline-title">最初から計画されていたキャリアではありません</h2><p>働きながら経験を積み、求人と比べる中で、少しずつ選択肢が見えるようになりました。</p></header>
        <CareerTimeline />
      </section>

      <section className="home-section industry-bridge" aria-labelledby="bridge-title">
        <div><p className="section-label">電子部品から半導体まで見る</p><h2 id="bridge-title">同じ業界ではない。でも、経験が重なる求人はあります</h2></div>
        <div>
          <p>電子部品と半導体は、製品、市場、技術領域が同じではありません。一方、転職市場では、工程条件の管理、歩留まり改善、不良解析、品質、設備、データ分析、海外工場との連携などが近い経験として扱われる場合があります。</p>
          <p>ただし、半導体固有のプロセス、製造装置、材料、クリーンルーム、真空、プラズマ、ガス、薬液、品質規格、前工程・後工程の経験を求める求人もあります。電子部品経験があれば必ず転職できる、という話ではありません。</p>
          <p className="caution-note">半導体には景気循環があり、電子部品も製品分野で状況が違います。将来性だけでなく、仕事内容、勤務地、働き方、専門性との相性まで確認してください。</p>
        </div>
      </section>

      <section className="home-section directory-section" aria-labelledby="map-title">
        <header className="editorial-heading"><p className="section-label">半導体業界地図</p><h2 id="map-title">会社名より先に、業界での役割を知る</h2><p>設計する会社、製造する会社、装置を作る会社では、近い経験も仕事の進め方も変わります。</p></header>
        <div className="directory-list">{segments.map((segment) => <Link href={`/segments/${segment.slug}`} key={segment.id}><strong>{segment.name}</strong><span>{segment.roleInValueChain}</span></Link>)}</div>
        <Link className="text-link" href="/industry-map">半導体業界地図を詳しく見る</Link>
      </section>

      <section className="home-section directory-section" aria-labelledby="companies-title">
        <header className="editorial-heading"><p className="section-label">企業研究</p><h2 id="companies-title">公開情報と出典から、企業ごとの違いを比べる</h2><p>会社の優劣ではなく、事業領域、職種、勤務地、英語、これまでの経験との距離を確認します。</p></header>
        <div className="company-rows">{featuredCompanies.map((company) => <Link href={`/companies/${company.slug}`} key={company.id}><span>{company.businessModel}</span><strong>{company.nameJa}</strong><p>{company.summary}</p></Link>)}</div>
        <Link className="text-link" href="/companies">企業一覧を見る</Link>
      </section>

      <section className="home-section agent-intro" aria-labelledby="agent-title">
        <div><p className="section-label">転職エージェント</p><h2 id="agent-title">求人をもらう前に、自分の経験を話してみる</h2></div>
        <div><p>私は複数のエージェントを使い、電子部品の工程改善、品質、海外勤務、データ活用が、どの求人につながるかを相談しました。担当者や時期で紹介求人は変わります。登録先を増やすことより、何を確かめたいかを先にメモするのがおすすめです。</p><Link className="text-link" href="/career-agents">私が使った転職エージェントを見る</Link></div>
      </section>

      <div className="home-section"><AffiliateCta title="経験を話せる状態にして、求人との距離を確かめる" body="担当工程、改善前後の数字、英語を使った場面を箇条書きにしてから相談すると、紹介求人との違いも確認しやすくなります。" /></div>
      <div className="home-section home-final-cta"><DiagnosisCta /></div>
    </main>
  );
}
