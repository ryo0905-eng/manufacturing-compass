"use client";

import { useEffect, useState } from "react";
import { readAnnualYears, type AnnualYears } from "@/lib/earnings-history-math";
import styles from "./AnnualHistory.module.css";

export function useAnnualYears(initialYears: AnnualYears) {
  const [years, setYears] = useState(initialYears);
  useEffect(() => {
    const restore = () => setYears(readAnnualYears(new URLSearchParams(window.location.search).get("years")));
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  function changeYears(next: AnnualYears) {
    if (next === years) return false;
    setYears(next);
    const url = new URL(window.location.href);
    url.searchParams.set("years", String(next));
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
    return true;
  }
  return { years, changeYears };
}

export function AnnualPeriodControl({ years, onChange }: { years: AnnualYears; onChange: (years: AnnualYears) => void }) {
  return <div className={styles.controls} role="group" aria-label="年次の掲載期間">{([5, 10, 20] as const).map(value => <button key={value} type="button" aria-pressed={years === value} onClick={() => onChange(value)}>{value}年</button>)}</div>;
}
