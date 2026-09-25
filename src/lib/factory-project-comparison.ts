import { factoryProjects, factoryProjectSources, type FactoryProject } from "@/data/factory-projects";

export function getFactoryProjectPair(a: string, b: string): [FactoryProject, FactoryProject] | null {
  if (a === b) return null;
  const first = factoryProjects.find(project => project.id === a);
  const second = factoryProjects.find(project => project.id === b);
  return first && second ? [first, second] : null;
}

export function factoryProjectComparisonText(pair: [FactoryProject, FactoryProject]) {
  return ["半導体工場プロジェクトの比較", "資料確認時点の情報です。予定は変更される場合があります。",
    ...pair.map((project, index) => [
      "", `${index === 0 ? "A" : "B"}：${project.name}`, `所在地：${project.location}`,
      `段階：${project.stage}`, `確認できた節目：${project.actual}`, `今後の予定・未確認事項：${project.planned}`,
      project.note, `確認日：${project.checkedAt}`,
      ...project.sourceNumbers.map(number => `出典：${factoryProjectSources[number - 1].url}`),
    ].join("\n")),
    "", "工場の計画は、現在の求人や配属先を示すものではありません。",
  ].join("\n");
}
