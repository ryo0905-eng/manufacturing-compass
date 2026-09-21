import type { Metadata } from "next";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import Link from "next/link";
import "@/app/globals.css";
import { siteUrl } from "@/lib/format";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "製造技術者の仕事とキャリアを支える | Manufacturing Compass",
    template: "%s | Manufacturing Compass",
  },
  description: "Cp・Cpkなどの実務ツール、半導体技術記事、キャリア現在地チェックで、製造技術者の仕事と次の一歩を支えます。",
  verification: {
    google: "3flJsORA3BERm-KxYL_CVe5fX6yGFtwJYKLpj3d0TxI",
  },
  openGraph: {
    title: "Manufacturing Compass",
    description: "製造技術者の仕事に役立つ実務ツールと、半導体キャリアの次の一歩を分かりやすく。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <meta
          name="impact-site-verification"
          {...{ value: "e89c898a-5aba-449d-bd8b-cc42f1143d1e" }}
        />
      </head>
      <body>
        <div className="site-shell">
          <Header />
          {children}
          <footer className="footer">
            <div>
              <p>Manufacturing Compassは、製造業で約10年働いてきたRYOが運営しています。企業情報は公開情報と出典を確認し、実体験とは分けて掲載します。</p>
              <nav aria-label="サイト情報">
                <Link href="/about">運営者情報</Link>
                <Link href="/privacy">プライバシーポリシー</Link>
                <Link href="/disclaimer">免責事項</Link>
                <Link href="/advertising-policy">広告掲載ポリシー</Link>
                <Link href="/contact">お問い合わせ</Link>
              </nav>
            </div>
          </footer>
        </div>
        <SiteAnalytics />
      </body>
    </html>
  );
}
