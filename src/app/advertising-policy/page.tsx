import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "広告掲載ポリシー",
  description:
    "Manufacturing Compass のアフィリエイト広告、広告表記、掲載基準、編集方針について説明します。",
};

export default function AdvertisingPolicyPage() {
  return (
    <main className="page">
      <section className="page-hero legal-hero">
        <p className="eyebrow">広告掲載について</p>
        <h1>広告掲載ポリシー</h1>
        <p>
          Manufacturing Compass は、アフィリエイト広告を利用する場合があります。
          広告収益よりも、製造業エンジニアのキャリア判断に役立つことを優先します。
        </p>
      </section>

      <section className="legal-layout">
        <article>
          <h2>広告表記</h2>
          <p>
            アフィリエイト広告を含むページでは、ページ上部またはCTA付近に広告を含む旨を表示します。
            広告リンクには、必要に応じて sponsored 属性を付与します。
          </p>
        </article>

        <article>
          <h2>掲載基準</h2>
          <ul>
            <li>製造業・半導体業界で働く人の意思決定に役立つこと</li>
            <li>サービス内容、料金、利用条件が確認できること</li>
            <li>過度に不安をあおる表現や、転職を急かす表現を避けること</li>
            <li>ユーザーに不利益があると判断したサービスは掲載しないこと</li>
          </ul>
        </article>

        <article>
          <h2>編集と広告の関係</h2>
          <p>
            当サイトでは、広告報酬の有無だけで掲載順位や紹介内容を決めません。
            記事や診断結果では、ユーザーの状況に合う相談先や準備内容を優先して紹介します。
          </p>
        </article>

        <article>
          <h2>関連ページ</h2>
          <p>
            転職エージェントの紹介は
            <Link href="/career-agents">製造業エンジニアにおすすめの転職エージェント</Link>
            をご確認ください。
          </p>
        </article>
      </section>
    </main>
  );
}
