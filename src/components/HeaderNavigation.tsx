"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { CareerCompassLink } from "@/components/CareerCompassLink";
import { headerNavItems } from "@/data/header";
import { trackEvent } from "@/lib/analytics";
import styles from "@/components/Header.module.css";

const desktopQuery = "(min-width: 1024px)";

function currentPage(pathname: string, href: string): "page" | "location" | undefined {
  if (pathname === href) return "page";
  if (pathname.startsWith(`${href}/`) || (href === "/industry-map" && pathname.startsWith("/segments/"))) {
    return "location";
  }
  return undefined;
}

export function HeaderNavigation() {
  const pathname = usePathname();
  // Reset disclosure state when navigation also happens outside this header.
  return <Navigation key={pathname} pathname={pathname} />;
}

function Navigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const query = window.matchMedia(desktopQuery);
    function resetMenu() {
      // Keep focus on a visible control when crossing the breakpoint.
      if (query.matches && document.activeElement === toggleRef.current) {
        panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      } else if (!query.matches && panelRef.current?.contains(document.activeElement)) {
        toggleRef.current?.focus();
      }
      setOpen(false);
    }
    query.addEventListener("change", resetMenu);
    return () => query.removeEventListener("change", resetMenu);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
    }
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={styles.navigation}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={toggleRef}
        className={styles.toggle}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{open ? "×" : "☰"}</span>
        {open ? "閉じる" : "メニュー"}
      </button>
      <nav ref={panelRef} id={panelId} className={styles.panel} data-open={open} aria-label="メインナビゲーション">
        {headerNavItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={styles.link}
            aria-current={currentPage(pathname, item.href)}
            onClick={() => {
              trackEvent("header_nav_click", {
                destination_id: item.id,
                display_mode: window.matchMedia(desktopQuery).matches ? "desktop" : "mobile_menu",
              });
              setOpen(false);
            }}
          >
            {item.label}
          </Link>
        ))}
        {/* One persistent CTA shares exposure tracking across desktop/mobile and reopenings. */}
        <CareerCompassLink
          className={styles.cta}
          ctaLocation="global_header"
          ctaVariant="header_navigation_v2"
          aria-current={currentPage(pathname, "/career-compass")}
          onClick={() => setOpen(false)}
        >
          キャリアを整理する
        </CareerCompassLink>
      </nav>
    </div>
  );
}
