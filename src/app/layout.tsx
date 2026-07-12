import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://mfg-compass.com"),
  title: {
    default: "製造業経験を半導体キャリアへ | Manufacturing Compass",
    template: "%s | Manufacturing Compass",
  },
  description: "製造業で積んだ経験を半導体業界の職種に置き換え、次に準備することを見つける専門メディア＋キャリアツールです。",
  verification: {
    google: "3flJsORA3BERm-KxYL_CVe5fX6yGFtwJYKLpj3d0TxI",
  },
  openGraph: {
    title: "Manufacturing Compass",
    description: "製造業で積んだ経験に近い半導体職種と、次に準備することを分かりやすく。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="ja">
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
        <Analytics />
        {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
      </body>
    </html>
  );
}
