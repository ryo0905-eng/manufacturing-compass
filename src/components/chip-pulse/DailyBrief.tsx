import type { PulseBriefLine } from "@/data/chip-pulse";
import styles from "./ChipPulseDashboard.module.css";

export function DailyBrief({ lines, scopeLabel }: { lines: PulseBriefLine[]; scopeLabel: string }) {
  return (
    <section className={styles.brief} aria-labelledby="daily-brief-title">
      <header><span>DAILY BRIEF / DEMO</span><h2 id="daily-brief-title">今日の半導体業界</h2><p>{scopeLabel}</p></header>
      {lines.length > 0 ? (
        <ol>{lines.map((line) => <li key={line.id}><span aria-hidden="true">{String(lines.indexOf(line) + 1).padStart(2, "0")}</span><p>{line.text}</p></li>)}</ol>
      ) : <p className={styles.emptyText}>この条件に合う編集サマリーはありません。条件を広げて確認してください。</p>}
      <small>静的なタグ付き文章から表示しています。AI生成や速報ではありません。</small>
    </section>
  );
}
