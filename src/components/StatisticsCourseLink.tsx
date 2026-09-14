"use client";

import { statisticsCourse } from "@/data/learning-affiliates";
import { trackEvent } from "@/lib/analytics";

export function StatisticsCourseLink({ sourcePage }: { sourcePage: string }) {
  return (
    <a
      className="button ghost"
      href={statisticsCourse.url}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      onClick={() => trackEvent("affiliate_outbound_click", {
        service_id: statisticsCourse.provider,
        course_id: statisticsCourse.id,
        source_page: sourcePage,
        cta_location: "statistics_learning_after_content",
      })}
    >
      Udemyで{statisticsCourse.name}を見る（新しいタブ）
    </a>
  );
}
