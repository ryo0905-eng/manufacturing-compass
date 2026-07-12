import { careerTimeline } from "@/data/operator";

type TimelineItem = { readonly title: string; readonly body: string };

type CareerTimelineProps = {
  items?: readonly TimelineItem[];
};

export function CareerTimeline({ items = careerTimeline }: CareerTimelineProps) {
  return (
    <ol className="career-timeline">
      {items.map((item, index) => (
        <li key={item.title}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
