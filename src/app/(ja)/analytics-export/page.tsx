import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compass Analytics | アクセス解析の集計ツール",
  description: "Manufacturing Compass の運営者向けアクセス解析集計ツールと、Google データの取り扱いについて説明します。",
  alternates: { canonical: "/analytics-export" },
  robots: { index: false, follow: false },
};

export default function AnalyticsExportPage() {
  return (
    <main className="page">
      <section className="page-hero legal-hero">
        <p className="eyebrow">運営者向けツール</p>
        <h1>Compass Analytics</h1>
        <p>
          Manufacturing Compass の運営者が、サイトの利用状況と検索状況を確認するための集計ツールです。
          Google Analytics 4 と Google Search Console の集計データを Google スプレッドシートに保存し、サイトの改善に役立てます。
          一般の方に提供するログインサービスではありません。
        </p>
        <p><a href="#privacy">プライバシーポリシー</a> · <a href="#terms">利用条件</a></p>
      </section>

      <section className="legal-layout">
        <article id="privacy">
          <h2>プライバシーポリシー</h2>
          <p>このツールは、運営者が許可した Google アカウントの権限を使い、Google Analytics 4 の日別・ページ別集計と、Search Console の日別・ページ別・検索語別集計を読み取ります。取得する指標には、表示回数、セッション、アクティブユーザー、検索結果のクリック数、表示回数、クリック率、平均掲載順位が含まれます。</p>
          <p>集計データは、サイトの利用状況の把握、検索パフォーマンスの分析、コンテンツや導線の改善に使用します。取得結果は運営者が管理する Google スプレッドシートに保存され、運営者が Google Drive の共有設定とアクセス権を管理します。検索語やページ URL には個人情報などが含まれる可能性があります。</p>
          <p>データの取得と保存は Google のサービスを通じて行います。運営者が別の連携サービスでシートを参照する場合は、そのサービスに許可したアクセス範囲と利用条件に従って処理されます。このツール自体は取得データを広告配信や販売のために送信しません。</p>
          <p>保存したデータは、運営者がスプレッドシート上で削除できます。ツールによる取得を停止するには、Apps Script の時間主導トリガーを削除し、必要に応じて Google アカウントの接続設定からアクセス権を取り消します。アクセス権の取り消しだけでは、保存済みのシートのデータは削除されません。</p>
          <p>このツールについてのお問い合わせは<Link href="/contact">お問い合わせページ</Link>からご連絡ください。サイト全体の情報の扱いは<Link href="/privacy">サイトのプライバシーポリシー</Link>をご覧ください。</p>
        </article>

        <article id="terms">
          <h2>利用条件</h2>
          <p>このツールは Manufacturing Compass の運営者が、自身にアクセス権のあるプロパティの集計を確認するために利用します。Google の各サービスの利用には、それぞれの利用条件が適用されます。</p>
          <p>集計値は各サービスの定義、処理の遅延、取得上限などにより異なる場合があります。数値の意味と対象期間を確認したうえで利用します。</p>
        </article>

        <p className="legal-updated-at">最終更新日：2026年10月29日</p>
      </section>
    </main>
  );
}
