"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  pulseCompanies,
  pulseProcessLabels,
  type PulseSignal,
} from "@/data/chip-pulse";
import styles from "./ChipPulseDashboard.module.css";

type ChangeTimelineProps = {
  signals: PulseSignal[];
  asOf: string;
  onOpen: (signalId: string) => void;
  onCompanySelect: (companyId: string) => void;
  onRelatedClick: (destination: string) => void;
};

export function ChangeTimeline({ signals, asOf, onOpen, onCompanySelect, onRelatedClick }: ChangeTimelineProps) {
  const [showAll, setShowAll] = useState(false);
  const orderedSignals = useMemo(
    () => [...signals].sort((a, b) => b.importance - a.importance || b.occurredAt.localeCompare(a.occurredAt)),
    [signals],
  );
  const asOfTime = new Date(asOf).getTime();
  const signals24h = orderedSignals.filter((signal) => {
    const age = asOfTime - new Date(signal.occurredAt).getTime();
    return age >= 0 && age <= 24 * 60 * 60 * 1000;
  });

  return (
    <section className={styles.timeline} id="important-news" aria-labelledby="change-timeline-title">
      <header>
        <div><span>確認済みニュース / 直近30日</span><h2 id="change-timeline-title">重要ニュース</h2></div>
        <p><strong>24時間 {signals24h.length}件</strong> / 30日 {signals.length}件</p>
      </header>
      {signals.length > 0 && signals24h.length === 0 ? <p className={styles.quietSignal}>直近24時間は重要更新なし。直近30日の文脈を表示しています。</p> : null}
      {orderedSignals.length > 0 ? (
        <div className={styles.timelineList}>
          {orderedSignals.map((signal, index) => {
            const primaryCompany = pulseCompanies.find((company) => company.id === signal.primaryCompanyId);
            const relatedCompanies = signal.companyIds
              .filter((companyId) => companyId !== signal.primaryCompanyId)
              .map((companyId) => pulseCompanies.find((company) => company.id === companyId))
              .filter((company) => company !== undefined);
            return (
              <details className={!showAll && index >= 3 ? styles.collapsedSignal : undefined} id={`signal-${signal.id}`} key={signal.id} onToggle={(event) => { if (event.currentTarget.open) onOpen(signal.id); }}>
                <summary>
                  <div className={styles.signalMeta}>
                    <time dateTime={signal.occurredAt}>{signal.timeLabel}</time>
                    {index < 3 ? <b>重要ニュース</b> : null}
                  </div>
                  <div className={styles.signalHeadline}>
                    <i className={styles.tone_neutral} aria-hidden="true">公</i>
                    <div><small>{primaryCompany?.shortName ?? signal.sourceName}</small><h3>{signal.title}</h3></div>
                  </div>
                  <ul className={styles.signalTags}>
                    <li>{signal.regions[0]}</li>
                    {signal.themes.slice(0, 2).map((theme) => <li key={theme}>{theme === "Advanced Packaging" ? "Packaging" : theme}</li>)}
                  </ul>
                </summary>
                <div className={styles.signalDetail}>
                  <strong>確認できた事実</strong><p>{signal.summary}</p>
                  <strong>業界への影響（編集部の見方）</strong><p>{signal.impact}</p>
                  <dl><div><dt>影響工程</dt><dd>{signal.processes.map((process) => pulseProcessLabels[process]).join(" / ")}</dd></div></dl>
                  {relatedCompanies.length > 0 ? <div className={styles.relatedCompanies}><span>関連企業</span>{relatedCompanies.map((company) => <button key={company.id} onClick={() => onCompanySelect(company.id)} type="button">{company.shortName}</button>)}</div> : null}
                  <a href={signal.sourceUrl} target="_blank" rel="noreferrer">{signal.sourceName}の原文を確認 ↗</a>
                  <Link href="/industry-map" onClick={() => onRelatedClick("industry_map_from_signal")}>業界地図でつながりを見る →</Link>
                </div>
              </details>
            );
          })}
          {signals.length > 3 ? <button className={styles.showSignals} onClick={() => setShowAll((current) => !current)} type="button">{showAll ? "重要3件に戻す" : `その他のニュース ${signals.length - 3}件を表示`}</button> : null}
        </div>
      ) : <p className={styles.emptyText}>この条件に該当する公式シグナルはありません。</p>}
    </section>
  );
}
