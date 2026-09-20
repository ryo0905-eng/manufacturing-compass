import type { Metadata } from "next";
import Link from "next/link";
import { ProcessEngineerSurvivalGame } from "@/components/ProcessEngineerSurvivalGame";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";
import "./game.css";

const title = "製造技術者サバイバル｜生産技術あるあるゲーム";
const description = "歩留まり急落、出荷保留、上司報告、Excel停止。工場トラブルを処理しながら定時を目指す、無料の生産技術・製造業あるあるゲームです。";
const canonicalPath = "/games/process-engineer-survival";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalPath },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${canonicalPath}`,
    type: "website",
    locale: "ja_JP",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function ProcessEngineerSurvivalPage() {
  return (
    <main className="survival-page">
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "VideoGame",
        name: "製造技術者サバイバル ～定時まで生き残れ～",
        description,
        url: `${siteUrl}${canonicalPath}`,
        applicationCategory: "GameApplication",
        operatingSystem: "Web",
        playMode: "SinglePlayer",
        inLanguage: "ja",
        isAccessibleForFree: true,
        author: { "@type": "Organization", name: "Manufacturing Compass", url: siteUrl },
      }} />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "製造技術者サバイバル", item: `${siteUrl}${canonicalPath}` },
        ],
      }} />

      <nav className="survival-breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link><span aria-hidden="true">/</span><span>製造技術者サバイバル</span>
      </nav>

      <header className="survival-page__intro">
        <div>
          <p className="section-label">PIXEL FACTORY EXPERIENCE</p>
          <h1>製造技術者サバイバル<br /><span>～定時まで生き残れ～</span></h1>
          <p>歩留まり急落、出荷保留、海外工場からの着信。工場を歩き回り、現場とデータから手掛かりを集めて、月曜日の17時を目指すミニゲームです。</p>
        </div>
        <aside><strong>所要時間 約5分</strong><span>ログイン不要・データ保存なし</span><span>PC / スマートフォン対応</span></aside>
      </header>

      <ProcessEngineerSurvivalGame />

      <article className="survival-about">
        <section>
          <p className="section-label">ABOUT THIS GAME</p>
          <h2>製造業あるあるを、問題解決の入口に</h2>
          <p>このゲームは、製造技術・生産技術・プロセスエンジニアの仕事を題材にしたフィクションです。登場する会社、工場、人物、数値はすべて架空で、実在する組織とは関係ありません。</p>
          <p>選択肢に唯一の正解があるわけではありません。現場ヒアリング、SPC、層別、4Mの変化点確認など、トラブル時に「次に何を確かめるか」を考えるきっかけとして遊べるようにしています。</p>
        </section>
        <section>
          <p className="section-label">HOW IT WORKS</p>
          <h2>行動が、後半の情報を変える</h2>
          <p>序盤で現場へ話を聞くと、作業者から設備の異音を教えてもらいやすくなります。SPCを確認していれば、データ解析時に異常発生時点から調査を始められます。調査度が高いと、会議や終盤で根拠を使った選択肢が開きます。</p>
        </section>
      </article>
    </main>
  );
}
