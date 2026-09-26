import type { PulseBriefLine } from "@/data/chip-pulse";
import styles from "./ChipPulseDashboard.module.css";

export function DailyBrief({ lines, scopeLabel }: { lines: PulseBriefLine[]; scopeLabel: string }) {
  return (
    <section className={styles.brief} aria-labelledby="daily-brief-title">
      <header>
        <span>10 SEC BRIEF / DEMO</span>
        <h2 id="daily-brief-title">今日の3行</h2>
        <p>{scopeLabel}</p>
      </header>
      {lines.length > 0 ? (
        <ul>{lines.map((line) => <li key={line.id}><i aria-hidden="true" /><p>{line.text}</p></li>)}</ul>
      ) : <p className={styles.emptyText}>この条件に合う編集サマリーはありません。条件を広げて確認してください。</p>}
    </section>
  );
}
