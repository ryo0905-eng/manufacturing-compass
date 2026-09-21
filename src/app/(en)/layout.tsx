import type { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Manufacturing Compass", template: "%s | Manufacturing Compass" },
  description: "Understand semiconductor equipment, wafer handling, and the companies behind the manufacturing process.",
  openGraph: { type: "website", locale: "en_US", siteName: "Manufacturing Compass" },
};

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <span className="brand"><span className="brand-mark">MC</span><span>Manufacturing Compass</span></span>
            <nav className="nav" aria-label="Primary navigation"><Link href="/" hrefLang="ja">Main site (Japanese)</Link></nav>
          </header>
          {children}
          <footer className="footer">
            <div>
              <p>Manufacturing Compass is run by RYO, a manufacturing professional with about ten years of experience. Company information is based on public sources and kept separate from personal experience.</p>
              <nav aria-label="Site information (Japanese)">
                <Link href="/about" hrefLang="ja">About (Japanese)</Link>
                <Link href="/privacy" hrefLang="ja">Privacy policy (Japanese)</Link>
                <Link href="/disclaimer" hrefLang="ja">Disclaimer (Japanese)</Link>
                <Link href="/advertising-policy" hrefLang="ja">Advertising policy (Japanese)</Link>
                <Link href="/contact" hrefLang="ja">Contact (Japanese)</Link>
              </nav>
            </div>
          </footer>
        </div>
        <SiteAnalytics />
      </body>
    </html>
  );
}
