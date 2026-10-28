"use client";

import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { rankingPurposes, type ReaderPurpose, type RankingPurposeDestination } from "@/data/ranking-purpose";
import { observeVisibleOnce } from "@/lib/observe-visible";
import { trackRankingPurposeEvent } from "@/lib/ranking-purpose-analytics";
import styles from "./RankingPurposeEntry.module.css";

export function RankingPurposeChooser({ panels }: { panels: Record<ReaderPurpose, ReactNode> }) {
  const [selected, setSelected] = useState<ReaderPurpose | null>(null);
  const current = useRef<ReaderPurpose | null>(null);
  const choices = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const viewed = useRef(false);
  useEffect(() => {
    if (!choices.current || viewed.current) return;
    return observeVisibleOnce(choices.current, () => {
      viewed.current = true;
      trackRankingPurposeEvent({ action: "view" });
    });
  }, []);

  function showPanel() {
    panel.current?.focus({ preventScroll: true });
    panel.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }

  useEffect(() => {
    if (selected) showPanel();
  }, [selected]);

  function select(purpose: ReaderPurpose) {
    if (current.current === purpose) {
      showPanel();
      return;
    }
    current.current = purpose;
    setSelected(purpose);
    trackRankingPurposeEvent({ action: "select", reader_purpose: purpose });
  }

  return <>
    <div className={styles.choices} ref={choices} role="group" aria-label="次に調べたいこと">
      {rankingPurposes.map(purpose => <button key={purpose.id} id={`ranking-purpose-${purpose.id}`} type="button"
        className={styles[purpose.tone]} aria-pressed={selected === purpose.id} aria-controls="ranking-purpose-panel" onClick={() => select(purpose.id)}>
        <span className={styles.cardImage}><Image src={purpose.image} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 440px" loading="lazy" /></span>
        <strong>{purpose.label}</strong><span className={styles.description}>{purpose.description}</span>
        <span className={styles.cardAction}>{selected === purpose.id ? "案内を表示中" : "案内を見る"}<span aria-hidden="true"> →</span></span>
      </button>)}
    </div>
    <div id="ranking-purpose-panel" ref={panel} role="region" aria-labelledby="ranking-purpose-panel-title" tabIndex={-1} hidden={!selected} className={styles.panel}>
      {selected ? <h3 id="ranking-purpose-panel-title">{rankingPurposes.find(purpose => purpose.id === selected)?.label}の案内</h3> : null}
      {selected ? panels[selected] : null}
      {selected ? <button type="button" className={styles.back} onClick={() => {
        const choice = document.getElementById(`ranking-purpose-${selected}`);
        choice?.focus({ preventScroll: true });
        choice?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
      }}>← 目的を選び直す</button> : null}
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
