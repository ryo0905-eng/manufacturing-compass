import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/StructuredData";
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
  ["経験に近い半導体職種", "担当してきた工程や設備から、仕事の接点がある職種を探します。"],
  ["転職で伝えやすい強み", "改善実績や不良解析を、求人票と比べやすい言葉に置き換えます。"],
  ["今日15分でできること", "数字の確認など、次の準備につながる小さな課題を一つ出します。"],
] as const;

export default function Home() {
  return (
    <main className="home-editorial home-simple">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "WebSite", name: "Manufacturing Compass", url: siteUrl, inLanguage: "ja" }} />

      <section className="home-hero home-hero-editorial home-simple-hero">
        <div className="hero-copy">
          <h1>製造業で積んだ経験は、半導体でどこまで通用する？</h1>
          <p>生産技術、品質、設備、設計、製造DXの経験から、近い職種と次に準備することを12問で整理します。</p>
          <div className="actions"><Link className="button primary home-primary-action" href="/career-compass">12問の診断を始める</Link></div>
          <p className="hero-assurance">約3分・登録不要</p>
        </div>
      </section>

      <section className="home-section home-simple-section" aria-labelledby="output-title">
        <header className="editorial-heading">
          <p className="section-label">診断で分かること</p>
          <h2 id="output-title">会社名ではなく、仕事の中身から見る</h2>
        </header>
        <div className="ruled-list compact-output-list">
          {diagnosisOutputs.map(([title, body], index) => <article key={title}><span>{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className="home-section home-simple-section operator-summary" aria-labelledby="operator-title">
        <div>
          <p className="section-label">RYOの実体験</p>
          <h2 id="operator-title">求人を比べて、初めて気づいたこと</h2>
        </div>
        <div>
          <p>私は電子部品メーカーで、製造技術、工程改善、品質、不良解析に関わってきました。当時は、その経験が半導体の仕事につながるとは考えていませんでした。製造現場で積んだ経験を、社外でどう説明すればよいかも分かりませんでした。</p>
          <p>転職活動で求人票を比べるうちに、工程条件、歩留まり、設備、品質など、仕事の進め方に重なる部分があると気づきました。そこで半導体、さらに外資系まで求人を見るようになりました。</p>
          <p>会社の中では当たり前の仕事でも、求人では別の名前で書かれています。Manufacturing Compassは、過去の自分が欲しかった「今の経験を別の仕事と比べる道具」として作っています。</p>
          <Link className="text-link" href="/about">RYOについて詳しく見る</Link>
        </div>
      </section>

      <section className="home-section home-simple-section research-routes" aria-labelledby="research-title">
        <header className="editorial-heading">
          <p className="section-label">業界地図・企業研究</p>
          <h2 id="research-title">半導体業界のどこに、今の経験が近いのかを見る。</h2>
        </header>
        <nav aria-label="半導体業界と企業を調べる">
          <Link href="/industry-map">業界地図を見る</Link>
          <Link href="/companies">企業を探す</Link>
          <Link href="/compare">企業を比較する</Link>
        </nav>
      </section>

      <section className="home-section home-simple-section home-final-action" aria-labelledby="final-action-title">
        <h2 id="final-action-title">まずは、今の経験を一度言葉にしてみる。</h2>
        <Link className="button primary" href="/career-compass">12問の診断を始める</Link>
        <Link className="text-link" href="/industry-map">半導体業界地図を見る</Link>
      </section>
    </main>
  );
}
