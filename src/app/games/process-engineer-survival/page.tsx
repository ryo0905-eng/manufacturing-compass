import type { Metadata } from "next";
import Link from "next/link";
import { ProcessEngineerSurvivalGame } from "@/components/ProcessEngineerSurvivalGame";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";
import "./game.css";

const title = "製造技術者サバイバル｜工場トラブルの原因調査ゲーム";
const description = "2台の異常。原因は1つ？ 工場の観察・比較試験・対策を通じて、良品が流れる状態を取り戻す無料ゲーム。稼働90秒＋時間制限のない調査で、製造技術の問題解決を体験できます。";
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
        name: "製造技術者サバイバル ～原因を見抜き、工場を立て直す～",
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
          <p className="section-label">FACTORY INVESTIGATION PROTOTYPE</p>
          <h1>製造技術者サバイバル<br /><span>2台の異常。原因は1つ？</span></h1>
          <p>止める範囲を決め、記録を比べ、条件を一つ変えて試す。警告を消すだけではなく、良品が流れる工場を取り戻そう。生産技術の判断を体験する、原因調査プロトタイプです。</p>
        </div>
        <aside><strong>稼働90秒 ＋ 時間制限のない調査</strong><span>実プレイは調査の分だけ長くなります</span><span>ログイン不要・プレイ状態の保存なし</span><span>PC / スマートフォン操作対応</span></aside>
      </header>

      <ProcessEngineerSurvivalGame />

      <article className="survival-about">
        <section>
          <p className="section-label">ABOUT THIS GAME</p>
          <h2>製造業あるあるを、問題解決の入口に</h2>
          <p>このゲームは、製造技術・生産技術・プロセスエンジニアの仕事を題材にしたフィクションです。登場する会社、工場、人物、数値はすべて架空で、実在する組織とは関係ありません。</p>
          <p>同じ頃に異常が出た2台を、正常な設備と比較します。観察した事実から原因候補を考え、材料を替える確認試験や対策後の試運転で、予想と結果を照合します。再挑戦では、同じ症状でも原因の異なるケースを体験できます。</p>
          <p>終了後は本人の行動記録を振り返り、「比較＝層別」「一つだけ変えて試す＝条件をそろえた確認」「止める＝影響封じ込め」を学習ツールへつなぎます。</p>
        </section>
        <section>
          <p className="section-label">HOW IT WORKS</p>
          <h2>調査は落ち着いて、対策の効果は工場で</h2>
          <p>矢印キー・WASDまたは方向ボタンで移動。Shift・DASHで短距離加速し、対象の近くでSpace・Enter・ACTIONを一押しすると操作パネルが開きます。調査・比較・選択中は時計、生産、作業がすべて止まります。</p>
          <p>作業を確定すると時計が動きます。停止は即時、再起動は2秒、正常材料への切替は3秒、保全への交換依頼は5秒、少量試運転は4秒です。試験品は納入数に含めません。B/Cの対策後確認と良品20個を目指し、稼働90秒で終了します。不良が増えても途中で操作を奪われません。</p>
          <p>別タブやウィンドウへ移ると一時停止し、戻った後は再開操作が必要です。設備ごとに6秒で1個を生産し、検査は全数を判別する教材上の簡略モデルです。危険作業は操作せず保全への依頼として扱います。実工程の安全手順や原因証明を保証するシミュレーターではありません。</p>
        </section>
      </article>
    </main>
  );
}
