const routes = [
  { source: "工程改善", target: "プロセス" },
  { source: "品質・解析", target: "品質保証" },
  { source: "設備・保全", target: "装置技術" },
] as const;

export function ExperienceRouteVisual() {
  return (
    <aside className="experience-route-visual" aria-label="製造業の経験を半導体職種へ置き換える例">
      <div className="experience-route-visual__header">
        <span aria-hidden="true" className="experience-route-visual__mark"><i /><i /><i /></span>
        <p>経験を、半導体の仕事へ</p>
      </div>
      <ol>
        {routes.map((route, index) => (
          <li key={route.source}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{route.source}</strong>
            <i aria-hidden="true">→</i>
            <b>{route.target}</b>
          </li>
        ))}
      </ol>
      <small>12問の回答から、近い職種を整理します。</small>
    </aside>
  );
}
