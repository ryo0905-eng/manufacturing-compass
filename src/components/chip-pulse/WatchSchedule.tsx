import { earningsCompanyName } from "@/lib/earnings";
import { upcomingWatchEvents, watchCalendar, watchEventDate } from "@/lib/watch-calendar";
import { MediaLink } from "./MediaLinks";
import styles from "./Media.module.css";

export function WatchSchedule({ now }: { now: string }) {
  const events = upcomingWatchEvents(watchCalendar.events, now);
  return <section className={styles.section} aria-labelledby="schedule-title">
    <div className={styles.sectionHead}><div><p className={styles.eyebrow}>UP NEXT</p><h2 id="schedule-title">今後14日の発表予定</h2></div><span>企業の公式日程</span></div>
    {events.length ? <ul className={styles.scheduleList}>{events.map(event => <li key={event.id}>
      <time dateTime={event.date!}>{watchEventDate(event)}</time>
      <div><strong>{earningsCompanyName(event.companyId)}</strong><p>{event.period} · {event.kind === "monthly" ? "月次売上" : "決算・説明会"}</p><small>日程確認 {event.checkedAt?.slice(0, 10).replaceAll("-", "/")}</small></div>
      <MediaLink href={event.sourceUrl} articleId={`calendar:${event.id}`} action="source" placement="schedule">公式日程 ↗</MediaLink>
    </li>)}</ul> : <p className={styles.empty}>今後14日に掲載できる公式発表予定はありません。日程未公表・未確認の企業もあります。</p>}
    <p className={styles.fine}>日付は企業が公表する現地日付です。予定は変更される場合があります。次回日程が未公表の企業も、決算一覧で確認できます。</p>
  </section>;
}
