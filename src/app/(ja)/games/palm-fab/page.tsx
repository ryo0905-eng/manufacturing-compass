import type { Metadata } from "next";
import { PalmFabLoader } from "@/components/palm-fab/PalmFabLoader";
import styles from "./page.module.css";
import "./game-shell.css";

export const metadata: Metadata = {
  title: "手のひら半導体工場｜小さな工場を育てるゲーム",
  description: "加工、洗浄、検査の流れを眺め、詰まりを見つけて装置を強化する小さな工場ゲーム。",
  robots: { index: false, follow: false },
};

export default function PalmFabPage() {
  return <main data-palm-fab-page className={styles.page}><PalmFabLoader /></main>;
}
