import type { Metadata } from "next";
import Link from "next/link";
import { JevDemo } from "@/components/JevDemo";
import styles from "./jev.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Jevで半導体の不具合報告を分類する｜実験デモ",
  description: "架空の半導体不具合報告に情報を加え、Jevの分類・確率・応答時間を比較する実験デモ。原因の確定ではなく、報告に書かれた変更と次の確認項目を整理します。",
  alternates: { canonical: "/labs/jev" },
  robots: { index: false, follow: true },
};
export default function JevPage() {
  const enabled = process.env.JEV_DEMO_ENABLED === "true" && Boolean(process.env.AI_GATEWAY_API_KEY);
  return <main className={styles.page}>
    <nav className={styles.nav} aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/tools">実務ツール</Link><span>/ Jev実験デモ</span></nav>
    <header className={styles.hero}><p className={styles.label}>COMPASS LAB · 実験版</p><h1>不具合報告に情報を加えると、<br />Jevの分類は変わる？</h1><p>半導体の架空報告を使い、設備・材料・測定の変更をAIがどう読み取るかを比べます。分類から次の確認項目まで、手元で試せるデモです。</p><p className={styles.muted}>実APIを使った少数の架空例での検証段階です。教材・期待分類も編集レビュー前のため、実工程の原因判断や運転条件の決定には使用できません。</p></header>
    <JevDemo enabled={enabled} />
    <section className={styles.explanation}><h2>このデモで確かめること</h2><p>Jevは、入力した文章と質問に対して、ソフトウェアが扱える分類結果などを返すTypeSafe AIのモデルです。本デモでは「報告にどの分野の変更が明記されているか」を一つの質問として送信します。</p><p>「材料が怪しい」という推測と、「材料を変更した」という記録は異なります。否定表現、複数の変更、情報不足の例で、文章の表現が分類にどう影響するかを確認できます。確認項目の説明はCompassがあらかじめ用意したもので、Jevが生成した理由ではありません。</p><h2>結果を読むときの注意</h2><p>設備に関する分類でも、設備が不良の原因であると証明されたわけではありません。確率は提示した分類候補に対するモデルの出力です。確信度が高くても誤る可能性があり、英語以外の精度は自分の用途で確認するよう公式文書でも案内されています。</p><h2>データと利用制限</h2><p>送信するのは固定の架空文章と分類質問だけです。実行時にVercel AI Gatewayを経由してTypeSafe AIへ送信します。結果は画面内に保持し、必要な場合だけJSONで保存できます。Gateway側で予算・利用枠の上限に達すると、新たな実行を受け付けなくなります。詳しくは<Link href="/privacy">プライバシーポリシー</Link>をご覧ください。</p><h2>出典・確認日</h2><ul><li><a href="https://docs.typesafe.ai/introduction">TypeSafe：Jevの概要</a></li><li><a href="https://vercel.com/kb/guide/typesafe-jev-and-ai-sdk">Vercel：Gateway経由のJev利用方法・料金</a></li><li><a href="https://docs.typesafe.ai/models">TypeSafe：モデル・料金・言語対応</a></li><li><a href="https://docs.typesafe.ai/confidence">TypeSafe：確率と確信度</a></li></ul><p>最終更新日・出典確認日：<time dateTime="2026-09-20">2026年9月20日</time>。非公式の実験デモであり、TypeSafe AIとの提携を示すものではありません。</p></section>
  </main>;
}
