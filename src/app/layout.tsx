import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://mfg-compass.com"),
  title: {
    default: "Manufacturing Compass | 半導体キャリア市場価値診断",
    template: "%s | Manufacturing Compass",
  },
  description: "半導体業界での市場価値、想定年収、伸ばすべきスキル、今日の一手を整理する日本語キャリアプラットフォームです。",
  verification: {
    google: "3flJsORA3BERm-KxYL_CVe5fX6yGFtwJYKLpj3d0TxI",
  },
  openGraph: {
    title: "Manufacturing Compass",
    description: "半導体キャリアの市場価値と次の一手を、もっとわかりやすく。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <div className="site-shell">
          <Header />
          {children}
          <footer className="footer">
            <div>
              <p>Manufacturing Compass は公開情報をもとに半導体業界研究を支援します。企業情報は必ず公式情報もあわせて確認してください。</p>
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
      </body>
    </html>
  );
}
