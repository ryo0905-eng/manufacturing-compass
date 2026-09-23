import { learningTools, toolUsage, type ToolId } from "@/data/learning-tools";
import { finderAdvice, type FinderAnswers, type FinderGoal } from "@/data/tool-finder";

export function needsFinderData(answers: FinderAnswers): answers is FinderAnswers & { goal: "capability" | "comparison" | "planning" } {
  return answers.mode === "input" && (answers.goal === "capability" || answers.goal === "comparison" || answers.goal === "planning");
}
export function selectFinderGoal(goal: FinderGoal): FinderAnswers { return { goal }; }
export function selectFinderMode(answers: FinderAnswers, mode: "input" | "learn"): FinderAnswers { return { goal: answers.goal, mode }; }
function getTool(id: ToolId) {
  const tool = learningTools.find(item => item.id === id);
  return tool ? { id: tool.id, title: tool.title, href: tool.href, input: toolUsage[id].input } : null;
}
export function findTool(answers: FinderAnswers) {
  if (!answers.goal || !answers.mode || (needsFinderData(answers) && !answers.data)) return null;
  const advice = finderAdvice[answers.goal];
  const learning = answers.mode === "learn";
  const unsupported = !learning && (answers.goal === "measurement" || answers.goal === "stability");
  const preparation = !learning && (answers.data === "unknown" ||
    (answers.goal === "comparison" && answers.data !== "measurements") ||
    (answers.goal === "planning" && answers.data !== "summary"));
  const tool = getTool(learning && answers.goal === "comparison" ? "improvement-confidence" : advice.toolId);
  if (!tool) return null;
  return {
    tool,
    status: unsupported ? "unsupported" as const : preparation ? "prepare" as const : learning ? "learn" as const : "ready" as const,
    heading: unsupported ? "実データの解析には未対応です" : preparation ? "まず入力に必要なものをそろえましょう" : learning ? "まずはこの教材から" : "まずはこちら",
    reason: learning ? advice.learn : unsupported ? advice.limit : advice.reason,
    preparation: advice.preparation,
    limit: learning && answers.goal === "comparison" ? "架空データの教材です。手元の測定値の解析には対応していません。" : advice.limit,
    action: unsupported ? "見方を教材で学ぶ" : preparation ? "入力方法と例を確認する" : learning ? "架空例で学ぶ" : "ツールを開く",
    secondary: !learning && !unsupported && !preparation && advice.secondary ? getTool(advice.secondary) : null,
  };
}
