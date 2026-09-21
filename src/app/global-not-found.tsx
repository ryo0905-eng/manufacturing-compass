import type { Metadata } from "next";
import "./globals.css";
import JapaneseNotFound from "./(ja)/not-found";

export const metadata: Metadata = {
  title: "ページが見つかりません / Page not found | Manufacturing Compass",
  robots: { index: false, follow: true },
};

// Unmatched URLs have no language layout when multiple root layouts are used.
export default function GlobalNotFound() {
  return <html lang="ja"><body><div className="site-shell">
    <JapaneseNotFound />
    <p className="page" lang="en">Page not found. The links above lead to our Japanese company directory and home page.</p>
  </div></body></html>;
}
