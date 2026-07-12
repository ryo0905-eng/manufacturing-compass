import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "Manufacturing Compass へのお問い合わせ、掲載情報の修正依頼、広告掲載のご相談はこちらからご連絡ください。",
};

const contactEmail = "contact@mfg-compass.com";

export default function ContactPage() {
  return (
    <main className="page">
      <section className="page-hero legal-hero">
        <p className="eyebrow">運営者への連絡</p>
        <h1>お問い合わせ</h1>
        <p>
          掲載情報の修正依頼、広告掲載、提携、その他のお問い合わせは、下記メールアドレスまでご連絡ください。
        </p>
      </section>

      <section className="legal-layout">
        <article className="contact-card">
          <h2>連絡先</h2>
          <p>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
          <small>
            内容確認後、必要に応じて返信します。営業・広告掲載のご相談は、サービス内容、掲載希望ページ、提携条件を添えてご連絡ください。
          </small>
        </article>

        <article>
          <h2>掲載情報の修正依頼</h2>
          <p>
            企業情報、採用情報、リンク切れ、表記ゆれなどにお気づきの場合は、対象ページURLと修正内容をお知らせください。
            公式情報を確認したうえで、必要に応じて修正します。
          </p>
        </article>

        <article>
          <h2>広告・提携について</h2>
          <p>
            製造業・半導体業界のキャリア支援、転職、学習、職務経歴書支援など、ユーザーの意思決定に役立つサービスのみ掲載を検討します。
            審査のうえ、掲載をお断りする場合があります。
          </p>
        </article>
      </section>
    </main>
  );
}
