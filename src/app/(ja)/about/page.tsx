import type { Metadata } from "next";
import Link from "next/link";
import { CareerTimeline } from "@/components/CareerTimeline";
import { DiagnosisCta } from "@/components/DiagnosisCta";
import { aboutCareerTimeline, editorialPrinciples, operatorProfile } from "@/data/operator";

export const metadata: Metadata = {
  title: "このサイトを作っている人",
  description: "Manufacturing Compassを運営するRYOの製造業での経験、転職の迷い、サイトで大切にしている編集方針を紹介します。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="page about-page about-simple">
      <section className="page-hero editorial-page-hero">
        <p className="section-label">短いプロフィール</p>
        <h1>このサイトを作っている人</h1>
        <p>Manufacturing Compassを運営しているRYOです。</p>
        <p>{operatorProfile.introduction} {operatorProfile.summary}</p>
      </section>

      <section className="about-section" aria-labelledby="experience-title">
        <header className="editorial-heading"><p className="section-label">これまでの経験</p><h2 id="experience-title">地方の工場から始まりました</h2></header>
        <p>新卒時点では、半導体や外資系を目指していませんでした。地元に比較的近く、大学で学んだことを多少は生かせそうだと思った会社が、たまたま電子部品メーカーでした。</p>
        <CareerTimeline items={aboutCareerTimeline} />
      </section>

      <section className="about-section" aria-labelledby="bridge-title">
        <header className="editorial-heading"><p className="section-label">電子部品から半導体へ</p><h2 id="bridge-title">求人票を比べて、仕事の接点に気づいた</h2></header>
        <p>転職活動をするまで、自分の経験が半導体求人につながるとは考えていませんでした。求人票を読むと、工程条件、歩留まり、不良解析、設備、海外工場との調整など、電子部品の現場経験と重なる仕事がありました。</p>
        <p>製品や技術領域は同じではありません。半導体固有の経験を求める求人もあります。それでも、会社名ではなく仕事の中身で比べることで、応募先の見え方が変わりました。</p>
        <Link className="text-link" href="/guides/semiconductor-career-start">電子部品経験と半導体求人の見方を読む</Link>
      </section>

      <section className="about-section" aria-labelledby="transfer-title">
        <header className="editorial-heading"><p className="section-label">転職で感じたこと</p><h2 id="transfer-title">転職すれば、必ず正解になるわけではない</h2></header>
        <p>私も転職後に仕事内容とのミスマッチを感じました。専門職か管理職か、海外と日本のどちらで働くかでも迷っています。</p>
        <p>ミスマッチを経験すると、続けたい仕事と避けたい働き方が具体的になります。半導体や外資系も、すべての人に合う答えではありません。</p>
      </section>

      <section className="about-section" aria-labelledby="product-title">
        <header className="editorial-heading"><p className="section-label">このサイトで作りたいもの</p><h2 id="product-title">診断のあとに、行動が一つ残る道具</h2></header>
        <p>ChatGPTに相談しても、会話しただけでは改善実績が職務経歴書に残りません。そこで診断結果には、数字を確認する、事例を3行で書くなど、今日15分でできる課題を入れています。</p>
        <p>今すぐ応募するためだけではなく、半年後の求人を増やすためにも使えるサイトを目指します。</p>
      </section>

      <section className="editorial-principles" aria-labelledby="principles-title">
        <header className="editorial-heading"><p className="section-label">編集方針</p><h2 id="principles-title">このサイトで大切にすること</h2></header>
        <div>{editorialPrinciples.map((item, index) => <article key={item.title}><span>{index + 1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div>
      </section>

      <DiagnosisCta />
      <p className="contact-note">掲載情報の修正依頼などは <Link href="/contact">お問い合わせ</Link> からご連絡ください。</p>
    </main>
  );
}
