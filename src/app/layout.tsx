import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://manufacturing-compass.vercel.app"),
  title: {
    default: "Manufacturing Compass | 半導体キャリア市場価値診断",
    template: "%s | Manufacturing Compass",
  },
  description: "半導体業界での市場価値、想定年収、伸ばすべきスキル、今日の一手を整理する日本語キャリアプラットフォームです。",
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
            <p>Manufacturing Compass は公開情報をもとに半導体業界研究を支援します。企業情報は必ず公式情報もあわせて確認してください。</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
