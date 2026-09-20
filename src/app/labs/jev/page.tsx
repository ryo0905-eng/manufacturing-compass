import type { Metadata } from "next";
import Link from "next/link";
import { JevDemo } from "@/components/JevDemo";
import { StructuredData } from "@/components/StructuredData";
import { jevSamples } from "@/data/jev-demo";
import { siteUrl } from "@/lib/format";
import styles from "./jev.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jev AIを体験｜半導体の報告から次の確認先を選ぶデモ",
  description: "TypeSafe AIのJevを日本語で体験。半導体の架空報告に情報を加え、Choice・Boolean・Scoreと次の確認先がどう変わるかを比較できます。",
  alternates: { canonical: "/labs/jev" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Jev AI Lab｜情報を足すと、判断はどう変わる？",
    description: "半導体の架空報告で、型付き判断と調査ルートの変化を体験。",
    url: `${siteUrl}/labs/jev`, type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function JevPage({ searchParams }: { searchParams: Promise<{ case?: string | string[] }> }) {
  const enabled = process.env.JEV_DEMO_ENABLED === "true" && Boolean(process.env.AI_GATEWAY_API_KEY);
  const requested = (await searchParams).case;
  const initialSampleId = jevSamples.find((sample) => sample.id === requested)?.id ?? jevSamples[0].id;

  return (
    <main className={styles.page}>
      <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Jev AI Lab", url: `${siteUrl}/labs/jev`, applicationCategory: "EducationalApplication", operatingSystem: "Web", inLanguage: "ja", description: "架空の半導体報告から、Jevの型付き判断と次の確認先の変化を体験する教育デモ。" }} />
      <nav className={styles.nav} aria-label="パンくず">
        <Link href="/">ホーム</Link><span>/</span><Link href="/tools">実務ツール</Link><span>/ Jevデモ</span>
      </nav>

      <header className={styles.hero}>
        <p className={styles.heroLabel}>JEV AI × MANUFACTURING COMPASS</p>
        <h1>工場を見て、<br />次の一手を考えよう。</h1>
        <p>あなたなら、どこを調べる？ 情報をひとつ足して、Jevの提案と比べよう。</p>
      </header>

      <JevDemo key={initialSampleId} enabled={enabled} initialSampleId={initialSampleId} />

      <section className={styles.about} aria-labelledby="about-jev">
          <h2 id="about-jev">このデモについて</h2>
          <details><summary>仕組み・注意点・送信先</summary>
          <p>TypeSafe AIのJevは、stateと型付き質問から構造化された判断を返すSystem One Modelです。このデモでは1回のリクエストで4つの質問を評価し、次の確認先へつなげます。</p>
          <details><summary>Choice・Boolean・Scoreは何を返す？</summary><p>Choiceは選択肢と確率分布、Booleanは「比較記録がある」に該当する確率、Scoreは情報の充実度を返します。各質問は同じ報告を独立に評価します。一般のLLMにも構造化出力はありますが、この画面は文章の回答を表示せず、判断を直接ルートと指標に反映します。</p></details>
          <details><summary>追加情報で確信度が下がることもある？</summary><p>あります。情報が矛盾する場合や、複数の確認先が考えられる場合もあります。確信度は確率分布から導かれる指標で、正解率や原因の確定度ではありません。初報と追加後の確率は同じ選択肢・尺度で表示し、変化しない結果もそのまま残します。</p></details>
          <details><summary>実際の製造・品質判断に使える？</summary><p>教育・デモ用途の参考判断です。原因を断定せず、Lot Hold・設備停止・品質判定などは担当者と社内基準に従ってください。自動操作は行いません。リンク先は独立した学習ツールで、この報告の解析結果が自動で読み戻されることはありません。</p></details>
          <details><summary>データはどこへ送られる？</summary><p>実行操作時に固定の架空報告と質問をVercel AI Gateway経由でTypeSafe AIへ送信します。実データ・自由入力は受け付けません。画面内の結果は再読み込みで消えます。<Link href="/privacy">プライバシーポリシー</Link></p></details>
          <p className={styles.sources}>
            <a href="https://docs.typesafe.ai/introduction">Jev公式ドキュメント</a>
            <a href="https://docs.typesafe.ai/primitives/score">Scoreの仕様</a>
            <a href="https://docs.typesafe.ai/confidence">確率と確信度</a>
            <Link href="/tools">製造業の学習ツール</Link>
            <span>確認日：2026年9月20日</span>
          </p>
          <p>Manufacturing Compassによる非公式デモです。</p>
          </details>
      </section>
    </main>
  );
}
