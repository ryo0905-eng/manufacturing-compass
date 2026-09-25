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
      <h2 id="statistics-course-title" style={{ scrollMarginTop: 100 }}>{course.title}</h2>
      <p>{context}</p>
      <p>{course.experience ? <><strong>運営者の実体験：</strong>{course.experience} </> : null}{course.body}</p>
      {sourcePage === "/tools/cpk" && <>
        <p>計算結果の読み方は、このページの「指標の見方」と「動かして理解」で確認できます。そのうえで、統計の基礎を動画で学びたい方への選択肢です。</p>
        <p>受講前に、講座のプレビューとカリキュラムで、平均・標準偏差・分布など学びたい内容と前提知識が自分に合うか確認してください。</p>
      </>}
      <p className="disclosure">{course.disclosure}</p>
      <div className="cta-actions"><StatisticsCourseLink sourcePage={sourcePage} courseKey={courseKey} /></div>
      <p className="disclosure">講座内容・対象レベル・価格はリンク先でご確認ください。</p>
    </aside>
  );
}
