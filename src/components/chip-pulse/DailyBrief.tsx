import type { PulseBriefLine } from "@/data/chip-pulse";
import styles from "./ChipPulseDashboard.module.css";

export function DailyBrief({ lines, scopeLabel }: { lines: PulseBriefLine[]; scopeLabel: string }) {
  return (
    <section className={styles.brief} aria-labelledby="daily-brief-title">
      <header>
        <span>確認済みニュースから要約</span>
        <h2 id="daily-brief-title">今日の3行</h2>
        <p>{scopeLabel}</p>
      </header>
      {lines.length > 0 ? (
        <ul>{lines.map((line) => <li key={line.id}><i aria-hidden="true" /><div><p>{line.text}</p>{line.signalIds?.length ? <p className={styles.briefLinks}>{line.signalIds.map((signalId, index) => <a href={`#signal-${signalId}`} key={signalId}>根拠ニュース{line.signalIds && line.signalIds.length > 1 ? ` ${index + 1}` : ""}</a>)}</p> : null}</div></li>)}</ul>
      ) : <p className={styles.emptyText}>この条件に合う編集サマリーはありません。条件を広げて確認してください。</p>}
    </section>
  );
}
