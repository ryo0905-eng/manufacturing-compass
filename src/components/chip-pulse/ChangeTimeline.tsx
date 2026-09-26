"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  pulseCompanies,
  pulseProcessLabels,
  type PulseSignal,
} from "@/data/chip-pulse";
import styles from "./ChipPulseDashboard.module.css";

const toneIcons: Record<PulseSignal["tone"], string> = { positive: "↑", negative: "↓", mixed: "±", neutral: "→" };

type ChangeTimelineProps = {
  signals: PulseSignal[];
  onOpen: (signalId: string) => void;
  onCompanySelect: (companyId: string) => void;
  onRelatedClick: (destination: string) => void;
};

export function ChangeTimeline({ signals, onOpen, onCompanySelect, onRelatedClick }: ChangeTimelineProps) {
  const [showAll, setShowAll] = useState(false);
  const orderedSignals = useMemo(
    () => [...signals].sort((a, b) => b.importance - a.importance || b.occurredAt.localeCompare(a.occurredAt)),
    [signals],
  );
  const displayedSignals = showAll ? orderedSignals : orderedSignals.slice(0, 3);

  return (
    <section className={styles.timeline} aria-labelledby="change-timeline-title">
      <header>
        <div><span>PAST 24H / DEMO</span><h2 id="change-timeline-title">昨日から変わったこと</h2></div>
        <p><strong>必読 {Math.min(3, signals.length)}</strong> / 全{signals.length}件</p>
      </header>
      {displayedSignals.length > 0 ? (
        <div className={styles.timelineList}>
          {displayedSignals.map((signal, index) => {
            const primaryCompany = pulseCompanies.find((company) => company.id === signal.primaryCompanyId);
            const relatedCompanies = signal.companyIds
              .filter((companyId) => companyId !== signal.primaryCompanyId)
              .map((companyId) => pulseCompanies.find((company) => company.id === companyId))
              .filter((company) => company !== undefined);
            return (
              <details key={signal.id} onToggle={(event) => { if (event.currentTarget.open) onOpen(signal.id); }}>
                <summary>
                  <div className={styles.signalMeta}>
                    <time dateTime={signal.occurredAt}>{signal.timeLabel}</time>
                    {index < 3 ? <b>MUST READ</b> : null}
                    <span aria-label={`重要度 ${signal.importance}`}>{"●".repeat(signal.importance)}</span>
                  </div>
                  <div className={styles.signalHeadline}>
                    <i className={styles[`tone_${signal.tone}`]} aria-hidden="true">{toneIcons[signal.tone]}</i>
                    <div><small>{primaryCompany?.shortName ?? signal.regions[0]}</small><h3>{signal.title}</h3></div>
                  </div>
                  <ul className={styles.signalTags}>
                    <li>{signal.regions[0]}</li>
                    {signal.themes.slice(0, 2).map((theme) => <li key={theme}>{theme === "Advanced Packaging" ? "Packaging" : theme}</li>)}
                  </ul>
                </summary>
                <div className={styles.signalDetail}>
                  <p>{signal.summary}</p>
                  <strong>なぜ見るか</strong><p>{signal.impact}</p>
                  <dl><div><dt>影響工程</dt><dd>{signal.processes.map((process) => pulseProcessLabels[process]).join(" / ")}</dd></div></dl>
                  {relatedCompanies.length > 0 ? <div className={styles.relatedCompanies}><span>関連企業</span>{relatedCompanies.map((company) => <button key={company.id} onClick={() => onCompanySelect(company.id)} type="button">{company.shortName}</button>)}</div> : null}
                  <Link href="/industry-map" onClick={() => onRelatedClick("industry_map_from_signal")}>業界地図でつながりを見る →</Link>
                </div>
              </details>
            );
          })}
          {signals.length > 3 ? <button className={styles.showSignals} onClick={() => setShowAll((current) => !current)} type="button">{showAll ? "必読3件に戻す" : `残り${signals.length - 3}件を表示`}</button> : null}
        </div>
      ) : <p className={styles.emptyText}>この条件に該当する24時間シグナルはありません。</p>}
    </section>
  );
}
