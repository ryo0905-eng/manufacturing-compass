import Link from "next/link";
import { isStockMarketAvailable } from "@/lib/stock-market-release";
import styles from "./WatchNavigation.module.css";

type Section = "watch" | "stocks" | "earnings" | "compare";
export function WatchNavigation({ current, section }: { current?: Section; section?: Section }) {
  const links = [
    { id: "watch", href: "/semiconductor-watch", label: "業界ウォッチ" },
    ...(isStockMarketAvailable() ? [{ id: "stocks", href: "/semiconductor-watch/stocks", label: "株式市場" }] : []),
    { id: "earnings", href: "/semiconductor-watch/earnings", label: "決算・IR" },
    { id: "compare", href: "/semiconductor-watch/earnings/compare", label: "業績比較" },
  ];
  return <nav className={styles.nav} aria-label="業界ウォッチの分野">{links.map(link => <Link key={link.id} href={link.href} aria-current={current === link.id ? "page" : section === link.id ? "location" : undefined}>{link.label}</Link>)}</nav>;
}
