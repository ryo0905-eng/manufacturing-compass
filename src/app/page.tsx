import type { Metadata } from "next";
import Link from "next/link";
import { CareerResultPreview } from "@/components/CareerResultPreview";
import { CareerRouteMap } from "@/components/CareerRouteMap";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: { absolute: "製造業の経験を半導体の仕事につなぐ | Manufacturing Compass" },
  description:
    "自分の経験が半導体のどの仕事で生かせるのか。求人票を比べながら、仕事の接点と次に準備したいことを整理できるサイトです。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "製造業の経験を半導体の仕事につなぐ",
    description: "求人票を比べながら、今の経験と半導体の仕事との接点、次に準備したいことを整理します。",
    url: siteUrl,
  },
};

const researchLinks = [
  {
    href: "/industry-map",
    title: "半導体業界を知る",
    body: "設計、製造、装置、材料など、それぞれの役割を工程から確認します。",
  },
  {
    href: "/companies",
    title: "企業を調べる",
    body: "事業領域や職種を見ながら、気になる企業を比較します。",
  },
  {
    href: "/guides",
    title: "技術・キャリアガイドを読む",
    body: "半導体の技術解説と、転職活動で実際に迷ったことを分けて掲載しています。",
  },
] as const;

const learningTools = [
  {
    href: "/tools/cpk",
    title: "Cp・Cpk",
    body: "平均とばらつき、規格との関係を確認する",
  },
  {
    href: "/tools/control-chart",
    title: "管理図",
    body: "工程の時間変化と異常の見つけ方を学ぶ",
  },
  {
    href: "/tools/gage-rr",
    title: "Gage R&R",
    body: "部品差と測定システムの誤差を分ける",
  },
  {
    href: "/tools/doe",
    title: "実験計画法",
    body: "効果、交互作用、ANOVA、確認実験を順番に学ぶ",
  },
] as const;

export default function Home() {
  return (
    <main className="home-focused">
      <StructuredData
        data={{ "@context": "https://schema.org", "@type": "WebSite", name: "Manufacturing Compass", url: siteUrl, inLanguage: "ja" }}
      />

      <section className="home-focused__hero">
        <div className="home-focused__hero-copy">
          <p className="home-focused__label">製造業から半導体へ</p>
          <h1>自分の経験が、半導体のどの仕事で生かせるのか。</h1>
          <p>求人票を比べながら、仕事の接点と次に準備したいことを整理するサイトです。</p>
          <div className="home-focused__actions">
            <Link className="home-focused__button" href="/career-compass">
              自分の経験を整理する
            </Link>
            <Link className="home-focused__text-link" href="/industry-map">
              半導体業界地図を見る
            </Link>
          </div>
          <p className="home-focused__assurance">12問・登録不要・入力内容は保存されません</p>
        </div>
        <CareerResultPreview />
      </section>

      <section className="home-focused__section home-focused__career" aria-labelledby="home-career-title">
        <header className="home-focused__heading">
          <h2 id="home-career-title">会社名より、仕事の中身から見る。</h2>
          <p>
            工程改善、品質、設備、設計など、業界が変わっても重なる仕事があります。
            まずは今の仕事内容に近い入口から見ていきます。
          </p>
        </header>
        <CareerRouteMap />
        <div className="home-focused__career-note">
          <p>Career Compassでは、12問の回答から、経験に近い職種と次に整理したいことを確認できます。</p>
          <Link className="home-focused__text-link" href="/career-compass">
            自分の経験で確認する
          </Link>
        </div>
      </section>

      <section className="home-focused__section" aria-labelledby="home-research-title">
        <header className="home-focused__heading">
          <h2 id="home-research-title">調べたいところから始める。</h2>
          <p>最初からすべてを理解する必要はありません。気になる工程、企業、職種から確認できます。</p>
        </header>
        <nav className="home-focused__link-list" aria-label="半導体業界を調べる">
          {researchLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              <span>
                <strong>{item.title}</strong>
                <small>{item.body}</small>
              </span>
              <i aria-hidden="true">→</i>
            </Link>
          ))}
        </nav>
      </section>

      <section className="home-focused__section home-focused__learning" aria-labelledby="home-learning-title">
        <header className="home-focused__heading">
          <h2 id="home-learning-title">必要な技術を学び直す。</h2>
          <p>計算結果だけではなく、条件を変えたときに判断がどう変わるかをブラウザ上で確認できます。</p>
        </header>
        <nav className="home-focused__tool-list" aria-label="製造技術の学習ツール">
          {learningTools.map((tool) => (
            <Link href={tool.href} key={tool.href}>
              <strong>{tool.title}</strong>
              <span>{tool.body}</span>
              <i aria-hidden="true">→</i>
            </Link>
          ))}
        </nav>
        <Link className="home-focused__text-link" href="/tools">
          学習ツールをすべて見る
        </Link>
      </section>

      <section className="home-focused__section home-focused__about" aria-labelledby="home-about-title">
        <div>
          <h2 id="home-about-title">このサイトについて。</h2>
          <p>
            Manufacturing Compassは、製造業で約10年働いてきたRYOが運営しています。
            求人票を比べるなかで、自分の経験を別の仕事へどう説明するか迷ったことが、このサイトを作るきっかけでした。
          </p>
          <p>企業や業界の情報は公開情報と出典を確認し、実体験とは分けて掲載します。</p>
          <Link className="home-focused__text-link" href="/about">
            運営者について
          </Link>
        </div>
        <aside>
          <span>情報の扱い</span>
          <ul>
            <li>企業公式、IR、官公庁などの公開情報を優先</li>
            <li>事実と運営者の実体験を分けて掲載</li>
            <li>企業情報には出典と確認日を表示</li>
          </ul>
        </aside>
      </section>

      <section className="home-focused__final" aria-labelledby="home-final-title">
        <div>
          <h2 id="home-final-title">自分の経験と、半導体の仕事を一度比べてみる。</h2>
          <p>現在の仕事内容と実績を12問で整理し、近い職種と次に準備したいことを確認できます。</p>
        </div>
        <div>
          <Link className="home-focused__button" href="/career-compass">
            自分の経験を整理する
          </Link>
          <small>約3分・登録不要</small>
        </div>
      </section>
    </main>
  );
}
