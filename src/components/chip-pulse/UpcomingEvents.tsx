import type { PulseEvent } from "@/data/chip-pulse";
import styles from "./ChipPulseDashboard.module.css";

const eventLabels: Record<PulseEvent["eventType"], string> = { earnings: "決算", product: "製品", conference: "展示会・会合", investor: "IR", macro: "政策・経済" };

export function UpcomingEvents({ events }: { events: PulseEvent[] }) {
  return (
    <section className={styles.events} aria-labelledby="upcoming-events-title">
      <header className={styles.sectionHeading}><div><span>NEXT 7 DAYS / DEMO</span><h2 id="upcoming-events-title">Upcoming Events</h2></div></header>
      {events.length > 0 ? <ol>{events.map((event) => (
        <li key={event.id}><time dateTime={event.date}>{event.dateLabel}</time><div><span>{eventLabels[event.eventType]}</span><strong>{event.title}</strong><p>{event.themes.join(" · ")}</p></div></li>
      ))}</ol> : <p className={styles.emptyText}>この条件に該当する予定イベントはありません。</p>}
    </section>
  );
}
