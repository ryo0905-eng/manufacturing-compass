import type { Metadata } from "next";
import Link from "next/link";
import { CareerTimeline } from "@/components/CareerTimeline";
import { DiagnosisCta } from "@/components/DiagnosisCta";
import { editorialPrinciples, operatorProfile } from "@/data/operator";

export const metadata: Metadata = {
  title: "このサイトを作っている人",
  description: "Manufacturing Compassを運営するRYOの製造業での経験、転職の迷い、サイトで大切にしている編集方針を紹介します。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="page about-page">
      <section className="page-hero editorial-page-hero">
        <p className="section-label">運営者について</p>
        <h1>このサイトを作っている人</h1>
        <p>Manufacturing Compassを運営しているRYOです。</p>
        <p>{operatorProfile.introduction}</p>
        <p>{operatorProfile.summary}</p>
        <p>最初から半導体業界を目指していたわけではありません。複数回の転職活動をする中で、電子部品経験と半導体求人に共通する部分があると気づき、少しずつ選択肢を広げました。</p>
      </section>

      <section className="about-essay" aria-labelledby="straight-title">
        <h2 id="straight-title">キャリアは一直線ではありませんでした</h2>
        <div className="story-columns">
          <div>
            <p>最初の会社は、長期的なキャリア戦略で選んだわけではありません。地元に比較的近く、大学で学んだことを多少は生かせそうだと思った会社が、たまたま電子部品メーカーでした。</p>
            <p>地方工場で工程改善、品質、不良解析を経験しても、それが社外でどう評価されるかはよく分かりませんでした。転職活動をするまで、自分の経験が半導体求人につながるとも考えていません。</p>
            <p>何度か求人票を読み、工程条件、歩留まり、再発防止、設備、海外工場との調整といった言葉を見比べて、初めて共通点に気づきました。</p>
          </div>
          <div>
            <p>転職すれば必ずよくなるわけでもありません。私も転職してから仕事内容とのミスマッチに気づいたことがあります。専門職として技術を深めるか、管理職を目指すか。海外と日本のどちらで働くか。途中で何度も迷いました。</p>
            <p>それでも、ミスマッチまで含めた経験が無駄になったわけではありません。今の会社や業界の外にある求人と比べると、自分が続けたい仕事、避けたい働き方、次に積む経験が少しずつ具体的になりました。</p>
            <p>半導体や外資系は、すべての人に合う答えではありません。隣接する業界まで見ることと、転職を急ぐことも別です。</p>
          </div>
        </div>
      </section>

      <section className="about-timeline" aria-labelledby="about-timeline-title">
        <header className="editorial-heading"><p className="section-label">これまでの仕事と転職</p><h2 id="about-timeline-title">働きながら、選択肢を見つけてきました</h2></header>
        <CareerTimeline />
      </section>

      <section className="about-essay" aria-labelledby="why-tool-title">
        <h2 id="why-tool-title">診断して終わらない道具を作りたい</h2>
        <p>迷ったとき、私もChatGPTに相談します。ただ、会話しただけでは、担当工程や改善実績が職務経歴書に残るわけではありません。次の日には同じところで迷うこともありました。</p>
        <p>だからManufacturing Compassでは、点数を出すだけでなく、改善実績を「課題・行動・効果」の3行で書く、英語を使った場面を三つ思い出す、といった今日の行動まで示します。</p>
        <p>今すぐ転職する必要はありません。半年後に応募できる求人を一つ増やすために、今日15分で何を残すか。その積み重ねに使えるサービスを目指しています。</p>
      </section>

      <section className="editorial-principles" aria-labelledby="principles-title">
        <header className="editorial-heading"><p className="section-label">編集方針</p><h2 id="principles-title">このサイトで大切にすること</h2></header>
        <div>{editorialPrinciples.map((item, index) => <article key={item.title}><span>{index + 1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div>
      </section>

      <DiagnosisCta title="今の会社の外で、経験がどう読まれるかを確かめる" />

      <p className="contact-note">掲載情報の修正依頼、広告掲載、その他のお問い合わせは <Link href="/contact">お問い合わせ</Link> からご連絡ください。</p>
    </main>
  );
}
