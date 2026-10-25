"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { CareerCompassLink } from "@/components/CareerCompassLink";
import { currentNavigationPage, headerDirectLinkIds, siteLinks, siteNavigationGroups, type SiteLinkId } from "@/data/site-navigation";
import { trackEvent } from "@/lib/analytics";
import styles from "@/components/Header.module.css";

const desktopQuery = "(min-width: 1160px)";
const navigationIds: readonly SiteLinkId[] = [...siteNavigationGroups.flatMap((group) => [...group.linkIds]), ...headerDirectLinkIds];

export function HeaderNavigation() {
  const pathname = usePathname();
  return <Navigation key={pathname} pathname={pathname} />;
}

function Navigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const groupButtons = useRef(new Map<string, HTMLButtonElement>());
  const activeId = navigationIds.filter((id) => currentNavigationPage(pathname, siteLinks[id].href))
    .sort((a, b) => siteLinks[b].href.length - siteLinks[a].href.length)[0];

  function closeMenus() {
    setOpen(false);
    setOpenGroup(null);
  }

  useEffect(() => {
    const query = window.matchMedia(desktopQuery);
    function resetMenu() {
      if (query.matches) {
        if (document.activeElement === toggleRef.current) groupButtons.current.values().next().value?.focus();
        else if (document.activeElement instanceof HTMLElement && panelRef.current?.contains(document.activeElement)) {
          const id = document.activeElement.closest<HTMLElement>("[data-navigation-group]")?.dataset.navigationGroup;
          if (id) groupButtons.current.get(id)?.focus();
        }
      } else if (panelRef.current?.contains(document.activeElement)) toggleRef.current?.focus();
      setOpen(false);
      setOpenGroup(null);
    }
    query.addEventListener("change", resetMenu);
    function resetForHash() { setOpen(false); setOpenGroup(null); }
    window.addEventListener("hashchange", resetForHash);
    return () => {
      query.removeEventListener("change", resetMenu);
      window.removeEventListener("hashchange", resetForHash);
    };
  }, []);

  useEffect(() => {
    if (!open && !openGroup) return;
    function handleClick(event: MouseEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setOpen(false);
        setOpenGroup(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (window.matchMedia(desktopQuery).matches && openGroup) groupButtons.current.get(openGroup)?.focus();
      else toggleRef.current?.focus();
      setOpen(false);
      setOpenGroup(null);
    }
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, openGroup]);

  function navigate(id: SiteLinkId) {
    closeMenus();
    if (id === "search" && window.location.pathname === "/") {
      document.getElementById("site-search-input")?.focus({ preventScroll: true });
    }
    try {
      trackEvent("header_nav_click", {
        destination_id: id,
        display_mode: window.matchMedia(desktopQuery).matches ? "desktop" : "mobile_menu",
      });
    } catch {
      // Analytics must not prevent following a navigation link.
    }
  }

  function navigationLink(id: SiteLinkId) {
    return <Link key={id} href={siteLinks[id].href} className={styles.link}
      aria-current={activeId === id ? currentNavigationPage(pathname, siteLinks[id].href) : undefined}
      onClick={() => navigate(id)}>{siteLinks[id].label}</Link>;
  }

  return (
    <div ref={rootRef} className={styles.navigation} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) closeMenus();
    }}>
      <button ref={toggleRef} className={styles.toggle} type="button" aria-expanded={open} aria-controls={panelId}
        onClick={() => { setOpen((value) => !value); setOpenGroup(null); }}>
        <span aria-hidden="true">{open ? "×" : "☰"}</span>{open ? "閉じる" : "メニュー"}
      </button>
      <nav ref={panelRef} id={panelId} className={styles.panel} data-open={open} aria-label="メインナビゲーション">
        {siteNavigationGroups.map((group) => {
          const expanded = openGroup === group.id;
          const groupId = `${panelId}-${group.id}`;
          return <div key={group.id} className={styles.group} data-navigation-group={group.id} onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setOpenGroup((value) => value === group.id ? null : value);
          }}>
            <button ref={(element) => { if (element) groupButtons.current.set(group.id, element); else groupButtons.current.delete(group.id); }}
              type="button" className={styles.groupToggle} data-active={(group.linkIds as readonly string[]).includes(activeId)}
              aria-expanded={expanded} aria-controls={groupId}
              onClick={() => setOpenGroup((value) => value === group.id ? null : group.id)}>
              {group.menuLabel}<span aria-hidden="true">⌄</span>
            </button>
            <span className={styles.mobileGroupLabel}>{group.label}</span>
            <div id={groupId} className={styles.groupLinks} data-open={expanded}>{group.linkIds.map(navigationLink)}</div>
          </div>;
        })}
        {headerDirectLinkIds.map(navigationLink)}
        <CareerCompassLink className={styles.cta} ctaLocation="global_header" ctaVariant="header_navigation_v2"
          aria-current={currentNavigationPage(pathname, "/career-compass")} onClick={closeMenus}>
          キャリアを整理する
        </CareerCompassLink>
      </nav>
    </div>
  );
}
