import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://manufacturing-compass.vercel.app"),
  title: {
    default: "Manufacturing Compass | 半導体業界への転職を、もっとわかりやすく",
    template: "%s | Manufacturing Compass",
  },
  description: "半導体業界地図、企業データベース、企業比較、キャリア準備情報を通じて、今狙える会社と将来チャレンジできる会社を整理する日本語キャリアプラットフォームです。",
  openGraph: {
    title: "Manufacturing Compass",
    description: "半導体業界への転職を、もっとわかりやすく。",
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
            <p>Manufacturing Compass は公開情報をもとに半導体業界研究を支援します。企業情報は必ず公式情報もあわせて確認してください。</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
