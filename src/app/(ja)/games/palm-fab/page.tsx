import type { Metadata } from "next";
import Link from "next/link";
import { PalmFabLoader } from "@/components/palm-fab/PalmFabLoader";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "手のひら半導体工場｜小さな工場を育てるゲーム",
  description: "加工、洗浄、検査の流れを眺め、詰まりを見つけて装置を強化する小さな工場ゲーム。",
  robots: { index: false, follow: false },
};

export default function PalmFabPage() {
  return <main className={styles.page}>
    <nav className={styles.breadcrumb} aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><span>手のひら半導体工場</span></nav>
    <header className={styles.hero}><span className={styles.eyebrow}>PALM SEMICONDUCTOR FAB · PROTOTYPE</span><h1>手のひら半導体工場</h1><p>小さな工場を眺めて、詰まりを見つけて、少しずつ育てよう。</p></header>
    <PalmFabLoader />
  </main>;
}
