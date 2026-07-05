import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "免責事項",
  description:
    "Manufacturing Compass の掲載情報、診断結果、外部リンク、アフィリエイト広告に関する免責事項です。",
};

export default function DisclaimerPage() {
  return (
    <main className="page">
      <section className="page-hero legal-hero">
        <p className="eyebrow">Disclaimer</p>
        <h1>免責事項</h1>
        <p>
          Manufacturing Compass は、製造業・半導体業界のキャリア検討を支援する情報を提供しています。
          掲載内容は正確性に配慮していますが、最終判断は必ずご自身で公式情報を確認したうえで行ってください。
        </p>
      </section>

      <section className="legal-layout">
        <article>
          <h2>掲載情報について</h2>
          <p>
            当サイトに掲載する企業情報、職種情報、転職エージェント情報、年収レンジ、キャリア診断結果は、公開情報や運営者の調査をもとに作成しています。
            内容の正確性、完全性、最新性を保証するものではありません。
          </p>
        </article>

        <article>
          <h2>診断結果について</h2>
          <p>
            Career Compass の診断結果は、キャリアの現在地や相談論点を整理するための参考情報です。
            転職成功、内定獲得、年収アップ、特定企業への入社を保証するものではありません。
          </p>
        </article>

        <article>
          <h2>外部リンクについて</h2>
          <p>
            当サイトから移動した外部サイトで提供される情報、サービス、契約、トラブルについて、当サイトは責任を負いません。
            最新情報や利用条件は、各公式サイトでご確認ください。
          </p>
        </article>

        <article>
          <h2>広告・アフィリエイトについて</h2>
          <p>
            当サイトはアフィリエイト広告を利用する場合があります。広告リンク経由で申込みが発生した場合、当サイトが報酬を受け取ることがあります。
            詳細は<Link href="/advertising-policy">広告掲載ポリシー</Link>をご確認ください。
          </p>
        </article>
      </section>
    </main>
  );
}
