import { MediaLink } from "./MediaLinks";
import { watchDate, type WatchItem, type WatchVisual as Visual } from "@/lib/watch-types";
import styles from "./Media.module.css";

export const watchKindLabel = { article: "ニュース", earnings: "決算・IR", factory: "工場の現在地" };
export function WatchVisual({ visual }: { visual: Visual }) {
  return <figure className={`${styles.visual} ${styles[visual.kind]}`}>
    <figcaption>{visual.label}</figcaption>
    <div className={styles.visualValues}>{visual.values.map((value, index) => <div key={`${value.label}-${index}`} data-active={value.active || undefined}>
      <span>{value.label}</span><strong>{value.value}</strong>{value.active && visual.kind === "process" ? <small>この発表に関係</small> : null}
    </div>)}</div>
    <p>{visual.note}</p>
  </figure>;
}
export function WatchCard({ item, featured = false }: { item: WatchItem; featured?: boolean }) {
  return <article className={featured ? styles.leadCard : styles.smallCard}>
    <div className={styles.cardMeta}><span className={styles.kind}>{watchKindLabel[item.kind]}</span><span>{item.dateLabel} <time dateTime={item.date}>{watchDate(item.date)}</time></span></div>
    <h3><MediaLink href={item.href} articleId={item.id} action="article" destination={item.kind} placement="featured">{item.title}</MediaLink></h3>
    <p className={styles.cardSummary}>{item.summary}</p>
    {featured && item.visual ? <WatchVisual visual={item.visual} /> : null}
    {featured && item.reason ? <p className={styles.reason}><strong>ここに注目</strong>{item.reason}</p> : null}
    <div className={styles.cardBottom}><span>{item.companyNames.join(" / ")}</span><MediaLink href={item.href} articleId={item.id} action="article" destination={item.kind} placement="featured">{item.kind === "earnings" ? "実績と見通しを読む" : item.kind === "factory" ? "計画と実績を比べる" : "事実と背景を読む"} <span aria-hidden="true">→</span></MediaLink></div>
  </article>;
}
