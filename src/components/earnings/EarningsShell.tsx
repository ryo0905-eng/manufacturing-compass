import Link from "next/link";
import type { ReactNode } from "react";
import { earningsUpdatedAt } from "@/lib/earnings";
import { WatchNavigation } from "@/components/chip-pulse/WatchNavigation";
import styles from "./Earnings.module.css";

export function EarningsShell({ children, current }: { children: ReactNode; current?: "earnings" | "compare" }) {
  return <main className={styles.page}><div className={styles.shell}>
    <header className={styles.masthead}>
      <div><Link href="/semiconductor-watch" className={styles.brand}>Chip Pulse<span>.</span></Link><p>Manufacturing Compass / 業界ウォッチ</p></div>
      <small>決算内容更新：{earningsUpdatedAt.replaceAll("-", "/")}</small>
    </header>
    <WatchNavigation current={current} section={current ? undefined : "earnings"} />
    {children}
  </div></main>;
}
