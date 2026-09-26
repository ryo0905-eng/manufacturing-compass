"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  pulseCompanies,
  pulseProcessLabels,
  pulseUpdatedAt,
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
  const asOfTime = new Date(pulseUpdatedAt).getTime();
  const signals24h = orderedSignals.filter((signal) => {
    const age = asOfTime - new Date(signal.occurredAt).getTime();
    return age >= 0 && age <= 24 * 60 * 60 * 1000;
  });
  const displayedSignals = showAll ? orderedSignals : orderedSignals.slice(0, 3);

  return (
    <section className={styles.timeline} aria-labelledby="change-timeline-title">
      <header>
        <div><span>OFFICIAL SIGNALS / 30D</span><h2 id="change-timeline-title">公式発表から変わったこと</h2></div>
        <p><strong>24h {signals24h.length}件</strong> / 30d {signals.length}件</p>
      </header>
      {signals.length > 0 && signals24h.length === 0 ? <p className={styles.quietSignal}>直近24時間は重要更新なし。直近30日の文脈を表示しています。</p> : null}
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
                    {index < 3 ? <b>KEY SIGNAL</b> : null}
                    <span aria-label={`重要度 ${signal.importance}`}>{"●".repeat(signal.importance)}</span>
                  </div>
                  <div className={styles.signalHeadline}>
                    <i className={styles[`tone_${signal.tone}`]} aria-hidden="true">{toneIcons[signal.tone]}</i>
                    <div><small>{primaryCompany?.shortName ?? signal.sourceName}</small><h3>{signal.title}</h3></div>
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
                  <a href={signal.sourceUrl} target="_blank" rel="noreferrer">{signal.sourceName}の原文を確認 ↗</a>
                  <Link href="/industry-map" onClick={() => onRelatedClick("industry_map_from_signal")}>業界地図でつながりを見る →</Link>
                </div>
              </details>
            );
          })}
          {signals.length > 3 ? <button className={styles.showSignals} onClick={() => setShowAll((current) => !current)} type="button">{showAll ? "主要3件に戻す" : `残り${signals.length - 3}件を表示`}</button> : null}
        </div>
      ) : <p className={styles.emptyText}>この条件に該当する公式シグナルはありません。</p>}
    </section>
  );
}
