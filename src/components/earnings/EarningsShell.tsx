import Link from "next/link";
import type { ReactNode } from "react";
import { earningsUpdatedAt } from "@/lib/earnings";
import styles from "./Earnings.module.css";

export function EarningsShell({ children }: { children: ReactNode }) {
  return <main className={styles.page}><div className={styles.shell}>
    <header className={styles.masthead}>
      <div><Link href="/semiconductor-watch" className={styles.brand}>Chip Pulse<span>.</span></Link><p>Manufacturing Compass / 業界ウォッチ</p></div>
      <small>決算データ確認日：{earningsUpdatedAt.replaceAll("-", "/")}</small>
    </header>
    <nav className={styles.topNav} aria-label="業界ウォッチの分野">
      <Link href="/semiconductor-watch">ニュース</Link>
      <Link href="/semiconductor-watch/earnings">決算・IR</Link>
      <Link href="/semiconductor-watch/earnings/compare">企業比較</Link>
    </nav>
    {children}
  </div></main>;
}
