"use client";

import { useState } from "react";
import type { AnnualSeries } from "@/lib/earnings-history-math";
import type { EarningsRelease } from "@/lib/earnings";
import { AnnualCompare } from "./AnnualCompare";
import { EarningsCompare } from "./EarningsCompare";
import styles from "./AnnualHistory.module.css";

export function EarningsAnalysisCompare({ histories, releases, initialGroup, initialCompany }: { histories: AnnualSeries[]; releases: EarningsRelease[]; initialGroup: "equipment" | "memory"; initialCompany?: string }) {
  const [mode, setMode] = useState<"annual" | "quarter">("annual");
  return <>
    <div className={styles.controls} role="group" aria-label="比較する決算の期間"><button type="button" aria-controls="compare-annual" aria-pressed={mode === "annual"} onClick={() => setMode("annual")}>年次5年</button><button type="button" aria-controls="compare-latest" aria-pressed={mode === "quarter"} onClick={() => setMode("quarter")}>最新四半期</button></div>
    <div id="compare-annual" hidden={mode !== "annual"}><AnnualCompare histories={histories} initialGroup={initialGroup} initialCompany={initialCompany} /></div>
    <div id="compare-latest" hidden={mode !== "quarter"}><EarningsCompare releases={releases} /></div>
  </>;
}
