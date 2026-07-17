import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "Manufacturing Compass へのお問い合わせ、掲載情報の修正依頼、広告掲載のご相談はこちらからご連絡ください。",
};

const contactFormUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSdJZ41z2c2hJbCD8QaWp7yBLCKMTqLFG1hQ3eoVizk4_lFj1g/viewform";

export default function ContactPage() {
  return (
    <main className="page">
      <section className="page-hero legal-hero">
        <p className="eyebrow">運営者への連絡</p>
        <h1>お問い合わせ</h1>
        <p>
          掲載情報の修正依頼、広告掲載、提携、その他のお問い合わせは、下記フォームからご連絡ください。
        </p>
      </section>

      <section className="legal-layout">
        <article className="contact-form-card">
          <h2>お問い合わせフォーム</h2>
          <p>
            内容を確認後、必要に応じて返信します。履歴書、勤務先の機密情報、健康情報など、問い合わせ対応に不要な情報は入力しないでください。
          </p>
          <iframe
            className="contact-form-frame"
            src={`${contactFormUrl}?embedded=true`}
            title="Manufacturing Compass お問い合わせフォーム"
            loading="lazy"
          >
            読み込んでいます…
          </iframe>
          <p className="contact-form-fallback">
            フォームが表示されない場合は、
            <a href={contactFormUrl} rel="noopener noreferrer" target="_blank">
              Googleフォームを別画面で開く
            </a>
            からご連絡ください。
          </p>
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
