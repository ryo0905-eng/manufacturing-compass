import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "Manufacturing Compass における個人情報、アクセス解析、Cookie、広告配信、外部リンクの取り扱いについて説明します。",
};

export default function PrivacyPage() {
  return (
    <main className="page">
      <section className="page-hero legal-hero">
        <p className="eyebrow">個人情報の取り扱い</p>
        <h1>プライバシーポリシー</h1>
        <p>
          Manufacturing Compass は、ユーザーのプライバシーを尊重し、取得する情報を必要最小限にとどめます。
          本ページでは、当サイトにおける情報の取り扱いを説明します。
        </p>
      </section>

      <section className="legal-layout">
        <article>
          <h2>取得する情報</h2>
          <p>
            当サイトでは、アクセス解析、問い合わせ対応、サービス改善のために、閲覧ページ、利用端末、ブラウザ、参照元などの情報を取得する場合があります。
            お問い合わせ時には、返信に必要なメールアドレスや問い合わせ内容を取得します。
          </p>
        </article>

        <article>
          <h2>アクセス解析について</h2>
          <p>
            当サイトでは、サイト改善のために Vercel Analytics などのアクセス解析ツールを利用する場合があります。
            取得した情報は、ページ閲覧状況や導線改善の分析に使用し、個人を特定する目的では利用しません。
          </p>
        </article>

        <article>
          <h2>Cookie と広告について</h2>
          <p>
            当サイトでは、アフィリエイト広告やアクセス解析のために Cookie 等の技術が利用される場合があります。
            Cookie はブラウザ設定により無効化できますが、一部機能が正しく動作しない場合があります。
          </p>
        </article>

        <article>
          <h2>第三者配信サービス</h2>
          <p>
            当サイトは、A8.net、バリューコマース、もしもアフィリエイト、afb などのアフィリエイトサービスを利用する場合があります。
            外部サービスで取得される情報は、各サービスのプライバシーポリシーに従って管理されます。
          </p>
        </article>

        <article>
          <h2>お問い合わせ</h2>
          <p>
            個人情報の取り扱いに関するお問い合わせは、
            <Link href="/contact">お問い合わせページ</Link>
            よりご連絡ください。
          </p>
        </article>
      </section>
    </main>
  );
}
