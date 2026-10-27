"use client";

import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import Link from "next/link";
import type { Route } from "next";
import { rankingPurposes, type ReaderPurpose, type RankingPurposeDestination } from "@/data/ranking-purpose";
import { observeVisibleOnce } from "@/lib/observe-visible";
import { trackRankingPurposeEvent } from "@/lib/ranking-purpose-analytics";
import styles from "./RankingPurposeEntry.module.css";

export function RankingPurposeChooser({ panels }: { panels: Record<ReaderPurpose, ReactNode> }) {
  const [selected, setSelected] = useState<ReaderPurpose | null>(null);
  const current = useRef<ReaderPurpose | null>(null);
  const choices = useRef<HTMLDivElement>(null);
  const viewed = useRef(false);
  useEffect(() => {
    if (!choices.current || viewed.current) return;
    return observeVisibleOnce(choices.current, () => {
      viewed.current = true;
      trackRankingPurposeEvent({ action: "view" });
    });
  }, []);

  function select(purpose: ReaderPurpose) {
    if (current.current === purpose) return;
    current.current = purpose;
    setSelected(purpose);
    trackRankingPurposeEvent({ action: "select", reader_purpose: purpose });
  }

  return <>
    <div className={styles.choices} ref={choices} role="group" aria-label="次に調べたいこと">
      {rankingPurposes.map(purpose => <button key={purpose.id} id={`ranking-purpose-${purpose.id}`} type="button"
        aria-pressed={selected === purpose.id} aria-controls="ranking-purpose-panel" onClick={() => select(purpose.id)}>
        <strong>{purpose.label}</strong><span>{purpose.description}</span>
      </button>)}
    </div>
    <p className={styles.status} role="status">{selected ? "選んだ目的に合う案内を下に表示しました。" : ""}</p>
    <div id="ranking-purpose-panel" role="region" aria-labelledby={selected ? `ranking-purpose-${selected}` : "ranking-purpose-title"} hidden={!selected} className={styles.panel}>
      {selected ? panels[selected] : null}
    </div>
  </>;
}

export function RankingPurposeLink({ purpose, destination, href, children }: {
  purpose: ReaderPurpose; destination: RankingPurposeDestination; href: string; children: ReactNode;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackRankingPurposeEvent({ action: "related_click", reader_purpose: purpose, destination_id: destination });
    if (!href.startsWith("#") || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(href.slice(1));
    if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
  }
  return <Link href={href as Route} onClick={handleClick}>{children}</Link>;
}
