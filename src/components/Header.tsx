import Link from "next/link";
import type { Route } from "next";

const navItems = [
  { href: "/industry-map", label: "業界地図" },
  { href: "/companies", label: "企業一覧" },
  { href: "/compare", label: "企業比較" },
] satisfies Array<{ href: Route; label: string }>;

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Manufacturing Compass home">
        <span className="brand-mark">MC</span>
        <span>Manufacturing Compass</span>
      </Link>
      <nav className="nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
