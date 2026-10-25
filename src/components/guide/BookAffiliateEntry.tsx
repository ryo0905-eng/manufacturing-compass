"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import { observeVisibleOnce } from "@/lib/observe-visible";
import styles from "./MoshimoBookLink.module.css";

export function BookAffiliateEntry({ sourceSlug }: { sourceSlug?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const viewed = useRef(false);
  useEffect(() => {
    if (!ref.current || viewed.current) return;
    return observeVisibleOnce(ref.current, () => {
      viewed.current = true;
      try {
        trackEvent("book_affiliate_entry_view", {
          source_slug: sourceSlug, source_page: sourceSlug, destination_path: "#industry-map-books",
          cta_location: "world_ranking_after_table", ui_version: "books-v2",
        });
      } catch { /* Reading the article must not depend on analytics. */ }
    });
  }, [sourceSlug]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    try {
      trackEvent("article_internal_click", {
        source_slug: sourceSlug, source_page: sourceSlug, destination_path: "#industry-map-books",
        cta_location: "world_ranking_after_table", ui_version: "books-v2",
      });
    } catch { /* Reading the article must not depend on analytics. */ }
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = document.getElementById("industry-map-books");
    if (!destination) return;
    destination.tabIndex = -1;
    // Make the native anchor destination focusable without delaying/cancelling its scroll.
    destination.focus({ preventScroll: true });
  }
  return <p className={styles.entry} ref={ref}>
    ランキングの企業を、工程・装置・材料のつながりで理解したい方へ：<a href="#industry-map-books" onClick={handleClick}>業界地図2冊の特徴と購入先を見る（広告）</a>
  </p>;
}
