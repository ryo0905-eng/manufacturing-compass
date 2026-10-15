"use client";

import type { MouseEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import styles from "./MoshimoBookLink.module.css";

export function BookAffiliateEntry({ sourceSlug }: { sourceSlug?: string }) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    try {
      trackEvent("article_internal_click", {
        source_slug: sourceSlug, source_page: sourceSlug, destination_path: "#industry-map-books",
        cta_location: "world_ranking_after_table", ui_version: "books-v1",
      });
    } catch { /* Reading the article must not depend on analytics. */ }
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = document.getElementById("industry-map-books");
    if (!destination) return;
    destination.tabIndex = -1;
    // Make the native anchor destination focusable without delaying/cancelling its scroll.
    destination.focus({ preventScroll: true });
  }
  return <p className={styles.entry}>
    業界全体のつながりを本でも調べたい方へ：<a href="#industry-map-books" onClick={handleClick}>読んでよかった2冊（広告あり）</a>
  </p>;
}
