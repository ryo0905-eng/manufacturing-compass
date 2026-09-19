import type { Metadata } from "next";
import Link from "next/link";
import { JevDemo } from "@/components/JevDemo";
import styles from "./jev.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jevで半導体の不具合報告を分類する｜実験デモ",
  description: "半導体の架空報告から、Jevが変更の種類を選択肢と確率で返す実験デモです。",
  alternates: { canonical: "/labs/jev" },
  robots: { index: false, follow: true },
};

export default function JevPage() {
  const enabled = process.env.JEV_DEMO_ENABLED === "true" && Boolean(process.env.AI_GATEWAY_API_KEY);

  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="パンくず">
        <Link href="/">ホーム</Link><span>/</span><Link href="/tools">実務ツール</Link><span>/ Jevデモ</span>
      </nav>

      <header className={styles.hero}>
        <p className={styles.heroLabel}>JEV × SEMICONDUCTOR</p>
        <h1>この報告、<br />まず何を確認する？</h1>
        <p>Jevが半導体の架空報告を5つに分類。情報を足すと判断がどう変わるか、すぐ試せます。</p>
      </header>

      <JevDemo enabled={enabled} />

      <details className={styles.about}>
        <summary>このデモについて</summary>
        <div>
          <p>分類対象は、報告文に明記された「設備・材料・測定・手順」の変更です。原因の特定や工程条件の判断には使いません。次の確認項目はManufacturing Compassが用意した案内です。</p>
          <p>送信するのは固定の架空データだけです。Vercel AI Gateway経由でTypeSafe AIのJevを呼び出し、結果はブラウザを閉じると消えます。詳しくは<Link href="/privacy">プライバシーポリシー</Link>をご覧ください。</p>
          <p className={styles.sources}>
            <a href="https://docs.typesafe.ai/introduction">Jev公式ドキュメント</a>
            <a href="https://vercel.com/kb/guide/typesafe-jev-and-ai-sdk">Vercelの導入ガイド</a>
            <span>確認日：2026年9月20日</span>
          </p>
        </div>
      </details>
    </main>
  );
}
