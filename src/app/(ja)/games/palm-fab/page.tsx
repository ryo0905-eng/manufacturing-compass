import type { Metadata } from "next";
import { PalmFabLoader } from "@/components/palm-fab/PalmFabLoader";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";
import styles from "./page.module.css";
import "./game-shell.css";

const title = "手のひら半導体工場｜小さな工場を育てるゲーム";
const description = "加工、洗浄、検査の流れを眺め、詰まりを見つけて装置を強化する無料の小さな工場ゲーム。登録不要で遊べ、進行状況はブラウザ内に保存されます。";
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
    <PalmFabLoader />
  </main>;
}
