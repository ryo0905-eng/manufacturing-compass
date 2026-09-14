"use client";

import { learningCourses, type LearningCourseKey } from "@/data/learning-affiliates";
import { trackEvent } from "@/lib/analytics";

export function StatisticsCourseLink({ sourcePage, courseKey }: { sourcePage: string; courseKey: LearningCourseKey }) {
  const course = learningCourses[courseKey];
  return (
    <a
      className="button ghost"
      href={course.url}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      onClick={() => trackEvent("affiliate_outbound_click", {
        service_id: course.provider,
        course_id: course.id,
        source_page: sourcePage,
        cta_location: "statistics_learning_after_content",
      })}
    >
      Udemyで{course.name}を見る（新しいタブ）
    </a>
  );
}
