import type { Metadata } from "next";
import Link from "next/link";
import { ProcessEngineerSurvivalGame } from "@/components/ProcessEngineerSurvivalGame";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";
import "./game.css";

const title = "製造技術者サバイバル｜生産技術あるあるゲーム";
const description = "3分間で工場の月曜日を駆け抜ける無料アクションゲーム。歩留まり急落や出荷保留を長押しで復旧し、現場のヒントと段取りで連続ボーナスを狙おう。";
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
          <p>警告が鳴ったら、次はどこへ？ 工場を駆け回り、長押しでラインを復旧。現場のヒントと段取りを使って、3分間の月曜日を乗り切ろう。</p>
        </div>
        <aside><strong>1プレイ 3分</strong><span>ログイン不要・データ保存なし</span><span>PC / スマートフォン対応</span></aside>
      </header>

      <ProcessEngineerSurvivalGame />

      <article className="survival-about">
        <section>
          <p className="section-label">ABOUT THIS GAME</p>
          <h2>製造業あるあるを、問題解決の入口に</h2>
          <p>このゲームは、製造技術・生産技術・プロセスエンジニアの仕事を題材にしたフィクションです。登場する会社、工場、人物、数値はすべて架空で、実在する組織とは関係ありません。</p>
          <p>複数のトラブルをどの順番で処理するか、ヒントを取りに行くか、その場で復旧するか。限られた時間の使い方を考えながら遊べます。終了後は現場ヒアリング、SPC、層別、4Mなどの考え方を関連ツールで学べます。</p>
        </section>
        <section>
          <p className="section-label">HOW IT WORKS</p>
          <h2>段取りがはまると、連続復旧が気持ちいい</h2>
          <p>矢印キー・WASDまたは画面の方向キーで移動し、設備の近くでSpace・EnterまたはACTIONを3秒長押し。現場担当・解析PCのヒントがあれば1秒で復旧できます。12秒以内に続けて復旧すると最大5倍のボーナス。ShiftまたはDASHで短距離加速できます。</p>
          <p>180秒で8時から17時まで進み、終盤は最大4件が同時発生します。休憩室ではHP・SANを回復でき、0になっても最後まで遊べます。一時停止や別タブへの移動中は時計が止まります。実工程での作業時間や安全手順を再現するシミュレーターではありません。</p>
        </section>
      </article>
    </main>
  );
}
