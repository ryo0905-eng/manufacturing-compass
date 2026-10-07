import type { Metadata } from "next";
import PalmFabGame from "@/components/palm-fab/PalmFabGame";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";
import styles from "./page.module.css";
import "./game-shell.css";

const title = "手のひら半導体工場｜無料で遊べる工場育成ゲーム";
const description = "加工→洗浄→検査→出荷の流れを眺め、詰まりを見つけて装置を強化する無料ブラウザゲーム。登録不要でスマホ・PCから遊べ、進行状況は同じブラウザに保存されます。";
const canonicalPath = "/games/palm-fab";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalPath },
  openGraph: { title, description, url: `${siteUrl}${canonicalPath}`, type: "website", locale: "ja_JP" },
  twitter: { card: "summary", title, description },
};

export default function PalmFabPage() {
  return <main data-palm-fab-page className={styles.page}>
    <StructuredData data={{
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: "手のひら半導体工場",
      description,
      url: `${siteUrl}${canonicalPath}`,
      applicationCategory: "GameApplication",
      operatingSystem: "Web",
      playMode: "SinglePlayer",
      inLanguage: "ja",
      isAccessibleForFree: true,
      author: { "@type": "Organization", name: "Manufacturing Compass", url: siteUrl },
    }} />
    <PalmFabGame />
  </main>;
}
