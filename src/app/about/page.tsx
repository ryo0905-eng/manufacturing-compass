import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "運営者情報",
  description:
    "Manufacturing Compass の運営目的、編集方針、掲載情報の確認方針について説明します。",
};

export default function AboutPage() {
  return (
    <main className="page">
      <section className="page-hero legal-hero">
        <p className="eyebrow">About</p>
        <h1>運営者情報</h1>
        <p>
          Manufacturing Compass は、製造業エンジニアが半導体業界でのキャリア選択を考えるための情報サイトです。
          企業研究、職種理解、市場価値診断、転職相談の準備をわかりやすく整理します。
        </p>
      </section>

      <section className="legal-layout">
        <article>
          <h2>運営目的</h2>
          <p>
            半導体業界への転職は、企業名だけで判断しにくく、職種、工程、装置、英語力、改善実績など複数の観点で整理する必要があります。
            Manufacturing Compass は、今すぐ応募できる可能性と、半年後・1年後に挑戦できる可能性を分けて考えられるよう支援します。
          </p>
        </article>

        <article>
          <h2>編集方針</h2>
          <ul>
            <li>企業公式サイト、IR、採用情報、信頼できる公開情報を優先します。</li>
            <li>年収、待遇、採用条件などは変わる可能性があるため、必ず公式情報の確認を推奨します。</li>
            <li>診断結果はキャリア整理の参考情報であり、転職成功や年収を保証するものではありません。</li>
            <li>アフィリエイト収益よりも、ユーザーの意思決定に役立つ情報を優先します。</li>
          </ul>
        </article>

        <article>
          <h2>主なコンテンツ</h2>
          <ul>
            <li>半導体キャリア市場価値診断</li>
            <li>半導体業界地図、企業一覧、企業比較</li>
            <li>製造業エンジニア向けの転職エージェント紹介</li>
            <li>職務経歴書や転職相談前に整理したいキャリア準備情報</li>
          </ul>
        </article>

        <article>
          <h2>連絡先</h2>
          <p>
            掲載情報の修正依頼、広告掲載、その他のお問い合わせは
            <Link href="/contact">お問い合わせ</Link>
            からご連絡ください。
          </p>
        </article>
      </section>
    </main>
  );
}
