import Link from "next/link";
import type { Route } from "next";
import { CareerCompassLink } from "@/components/CareerCompassLink";

const navItems = [
  { href: "/industry-map", label: "業界地図" },
  { href: "/companies", label: "企業を探す" },
  { href: "/guides", label: "記事" },
  { href: "/tools", label: "技術を学ぶ" },
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
      <CareerCompassLink className="header-cta" ctaLocation="global_header" ctaVariant="experience_to_role">
        経験から職種を探す
      </CareerCompassLink>
    </header>
  );
}
