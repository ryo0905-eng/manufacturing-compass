import { careerTimeline } from "@/data/operator";

export function CareerTimeline() {
  return (
    <ol className="career-timeline">
      {careerTimeline.map((item, index) => (
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
