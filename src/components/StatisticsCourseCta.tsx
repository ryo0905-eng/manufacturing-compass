import { StatisticsCourseLink } from "@/components/StatisticsCourseLink";
import { getLearningCourseKey, learningCourses, statisticsLearningContexts } from "@/data/learning-affiliates";
import styles from "./StatisticsCourseCta.module.css";

export function StatisticsCourseCta({ sourcePage }: { sourcePage: string }) {
  const context = statisticsLearningContexts[sourcePage];
  if (!context) return null;
  const courseKey = getLearningCourseKey(sourcePage);
  const course = learningCourses[courseKey];

  return (
    <aside className={`cta-panel ${styles.panel}`} aria-labelledby="statistics-course-title">
      <p className="section-label">広告・学習の選択肢</p>
      <h2 id="statistics-course-title">{course.title}</h2>
      <p>{context}</p>
      <p>{course.experience ? <><strong>運営者の実体験：</strong>{course.experience} </> : null}{course.body}</p>
      <p className="disclosure">{course.disclosure}</p>
      <div className="cta-actions"><StatisticsCourseLink sourcePage={sourcePage} courseKey={courseKey} /></div>
      <p className="disclosure">講座内容・対象レベル・価格はリンク先でご確認ください。</p>
    </aside>
  );
}
