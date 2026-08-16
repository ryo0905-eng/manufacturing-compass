import type { Metadata } from "next";
import Link from "next/link";
import { CareerCompassTool } from "@/components/CareerCompassTool";
import { StructuredData } from "@/components/StructuredData";
import { marketValueProfiles } from "@/data/career-compass";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "半導体・製造業エンジニアの適職診断｜12問で職種と準備を整理",
  description: "製造技術、品質管理、設備、生産技術、設計、技術営業などの経験から、接点のある半導体職種、活かせる強み、次に準備することを12問で整理します。登録不要です。",
  alternates: { canonical: "/career-compass" },
  openGraph: {
    title: "半導体・製造業エンジニア向けキャリア診断",
    description: "12問で、製造業経験と接点のある半導体職種、強み、次の準備を整理します。",
    type: "website",
    url: "/career-compass",
  },
};

const targetRoles = [...new Set(Object.values(marketValueProfiles).flatMap((profile) => profile.reachableRoles))];
const faqs = [
  { question: "利用に登録は必要ですか？", answer: "登録は不要です。回答と結果はブラウザ内で処理し、サーバーやデータベースへ保存しません。" },
  { question: "診断結果は採用可能性を示しますか？", answer: "示しません。回答と静的ルールから、経験と職種の接点、応募前に整理したい材料、次の準備をまとめる参考情報です。" },
  { question: "半導体業界の経験がなくても使えますか？", answer: "使えます。製造、品質、設備、設計、技術営業などの経験を、半導体求人で比較しやすい言葉へ置き換えます。" },
];

export default function CareerCompassPage() {
  return (
    <main className="page career-compass-page">
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Career Compass", item: `${siteUrl}/career-compass` },
        ],
      }} />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
      }} />
      <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><span>Career Compass</span></nav>
      <header className="career-compass-landing-hero">
        <p className="section-label">Career Compass ・ 登録不要</p>
        <h1>半導体・製造業エンジニア向けキャリア診断</h1>
        <p>今の仕事内容と実績から、接点のある半導体職種、伝えやすい強み、次に準備するとよいことを整理します。</p>
        <ul><li>全12問</li><li>回答は保存しません</li><li>結果はその場で表示</li></ul>
        <a className="button primary" href="#career-compass-tool">12問の診断を始める</a>
        <small>職種候補、経験の言い換え、今日・30日・半年後の準備が分かります。</small>
      </header>
      <section id="career-compass-tool" aria-label="Career Compass 診断フォーム"><CareerCompassTool /></section>

      <div className="career-compass-seo-content">
        <section><p className="section-label">What you get</p><h2>この診断で分かること</h2><p>製造業で積んだ経験と半導体職種の接点、強みとして先に伝える材料、補足すると選択肢が広がる経験を分けて確認できます。結果には企業研究、学習、相談へ進むための次の行動も表示します。</p></section>
        <section><h2>こんな人におすすめ</h2><ul><li>生産技術や製造技術の経験を半導体へどうつなぐか整理したい</li><li>品質保証・品質管理、設備保全、設計、技術営業の次の職種を比較したい</li><li>転職相談や求人応募の前に、実績と確認事項を言葉にしたい</li></ul></section>
        <section><h2>対象となる職種・キャリア領域</h2><div className="career-compass-role-list">{targetRoles.map((role) => <span key={role}>{role}</span>)}</div><p>実際の判定ロジックが扱う職種だけを掲載しています。結果は採用可能性や企業からの評価を示すものではありません。</p></section>
        <section><h2>診断結果のサンプル</h2><div className="career-compass-result-sample"><strong>例：生産技術の経験をプロセスエンジニアと比較</strong><p>歩留まり改善や量産立ち上げを活かせる経験として整理し、数字で示す実績、工程知識、次に学ぶ実務ツールを提示します。</p><ul><li>接点のある職種</li><li>活かせる経験と半導体求人での言い換え</li><li>今日、30日、3か月、半年、1年の準備</li><li>関連記事・企業・学習ツール</li></ul></div></section>
        <section><h2>判定の考え方</h2><p>現在の職種、担当業務、経験期間、半導体との接点、成果の説明方法、専門スキルなどを静的ルールで整理します。回答そのもの、現在年収、結果一式をAnalyticsへ送りません。人の適性や合否を断定する診断ではありません。</p></section>
        <section><h2>製造業・半導体における職種の違い</h2><p>同じ「改善」でも、生産技術は量産ライン全体、プロセスエンジニアは工程条件や歩留まり、設備エンジニアは装置の安定稼働を主な軸にします。まず経験を仕事内容の軸で分けると、企業名だけで探すより求人を比較しやすくなります。</p></section>
        <section><h2>診断後にできること</h2><p>結果に合う業界地図、企業一覧、製造工程記事、Cpk・DoEなどの実務ツールへ進めます。転職エージェントは選択肢の中心ではなく、確認したい論点が明確になった後の相談手段として案内します。</p></section>
        <section><h2>運営・編集方針</h2><p>Manufacturing Compassは、製造業で約10年働いてきたRYOが運営しています。企業・業界情報は公開情報と出典を確認し、実体験と分けて掲載します。詳しくは<Link href="/about">運営者情報</Link>をご覧ください。</p></section>
        <section><h2>よくある質問</h2>{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
        <section><h2>関連する情報</h2><nav className="career-compass-related-directory"><Link href="/industry-map">半導体業界地図</Link><Link href="/companies">半導体企業一覧</Link><Link href="/guides/semiconductor-manufacturing-process">半導体製造工程</Link><Link href="/tools">実務学習ツール</Link></nav></section>
      </div>
    </main>
  );
}
