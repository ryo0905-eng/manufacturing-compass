import type { PulseSignal } from "@/data/chip-pulse";
import styles from "./ChipPulseDashboard.module.css";

const toneIcons: Record<PulseSignal["tone"], string> = { positive: "↑", negative: "↓", mixed: "±", neutral: "→" };

export function ChangeTimeline({ signals, onOpen }: { signals: PulseSignal[]; onOpen: (signalId: string) => void }) {
  return (
    <section className={styles.timeline} aria-labelledby="change-timeline-title">
      <header><span>PAST 24H / DEMO</span><h2 id="change-timeline-title">昨日から変わったこと</h2></header>
      {signals.length > 0 ? (
        <div className={styles.timelineList}>
          {signals.slice(0, 6).map((signal) => (
            <details key={signal.id} onToggle={(event) => { if (event.currentTarget.open) onOpen(signal.id); }}>
              <summary>
                <time dateTime={signal.occurredAt}>{signal.timeLabel}</time>
                <i className={styles[`tone_${signal.tone}`]} aria-hidden="true">{toneIcons[signal.tone]}</i>
                <span>{signal.title}</span>
              </summary>
              <div><p>{signal.summary}</p><strong>読みどころ</strong><p>{signal.impact}</p><ul>{signal.themes.map((theme) => <li key={theme}>{theme}</li>)}</ul></div>
            </details>
          ))}
        </div>
      ) : <p className={styles.emptyText}>この条件に該当する24時間シグナルはありません。</p>}
    </section>
  );
}
