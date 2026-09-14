import { StatisticsCourseLink } from "@/components/StatisticsCourseLink";
import { statisticsCourse, statisticsLearningContexts } from "@/data/learning-affiliates";
import styles from "./StatisticsCourseCta.module.css";

export function StatisticsCourseCta({ sourcePage }: { sourcePage: string }) {
  const context = statisticsLearningContexts[sourcePage];
  if (!context) return null;

  return (
    <aside className={`cta-panel ${styles.panel}`} aria-labelledby="statistics-course-title">
      <p className="section-label">広告・学習の選択肢</p>
      <h2 id="statistics-course-title">統計の基礎を、動画で学び直す</h2>
      <p>{context}</p>
      <p><strong>運営者の実体験：</strong>{statisticsCourse.experience} 統計を学ぶ次の一歩として、統計検定2級を目標にするのも一つの方法です。</p>
      <p className="disclosure">{statisticsCourse.disclosure}</p>
      <div className="cta-actions"><StatisticsCourseLink sourcePage={sourcePage} /></div>
      <p className="disclosure">講座内容・対象レベル・価格はリンク先でご確認ください。</p>
    </aside>
  );
}
