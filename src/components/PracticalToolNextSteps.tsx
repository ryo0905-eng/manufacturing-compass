import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { isEnglishCpkPublished } from "@/data/cpk-english";
import { isEnglishPracticalToolPublished } from "@/data/practical-tools-english";
import styles from "./PracticalToolNextSteps.module.css";

export function PracticalToolNextSteps({ tool, locale }: { tool: "cpk" | "process-comparison"; locale: "ja" | "en" }) {
  const english = locale === "en";
  const links = tool === "cpk"
    ? [
      { id: "process-comparison", label: english ? "Compare distributions before and after a change" : "変更前後の分布を比べる", detail: english ? "Paste measurements for two conditions and compare their means and variation." : "2条件の測定値を貼り付けて、平均・ばらつき・分布を比較します。", published: !english || isEnglishPracticalToolPublished("process-comparison") },
      ...(!english ? [{ id: "control-chart", label: "工程の安定性の見方を学ぶ", detail: "教材データの管理図で、時間変化や異常シグナルを体験します。", published: true }] : []),
    ]
    : [
      { id: "cpk", label: english ? "Check capability against specification limits" : "規格に対する工程能力を確認する", detail: english ? "Calculate Pp/Ppk from measurements, or Cp/Cpk from a mean and within-process standard deviation." : "測定値からPp・Ppk、平均と短期標準偏差からCp・Cpkを計算します。", published: !english || isEnglishCpkPublished() },
      ...(!english ? [{ id: "improvement-confidence", label: "改善の差をどこまで信頼できるか学ぶ", detail: "架空データの教材で、測定数と平均差の信頼区間の関係を試します。", published: true }] : []),
    ];
  if (!english) links.push({ id: "measurement-planner", label: "次回の測定数を考える", detail: "平均の推定精度と測定時間から、次の測定計画を比較します。", published: true });
  const publishedLinks = links.filter(link => link.published);
  if (!publishedLinks.length) return null;
  return <nav className={styles.nextSteps} aria-label={english ? "Next steps after this result" : "この結果から次に調べる"}>
    <h3>{english ? "What would you like to check next?" : "この結果から、次に何を調べる？"}</h3>
    <ul>{publishedLinks.map(link => <li key={link.id}>
      <TrackedInternalLink href={`${english ? "/en" : ""}/tools/${link.id}`} target="_blank" rel="noopener"
        eventName="tool_result_related_click" eventProperties={{ tool_id: tool, destination_tool: link.id, locale, placement: "result", ui_version: "next-steps-v1" }}>
        {link.label} <span aria-hidden="true">↗</span>
      </TrackedInternalLink>
      <p>{link.detail}</p>
    </li>)}</ul>
    <p className={styles.note}>{english ? "Links open in a new tab. Your input data is not transferred automatically." : "別タブで開きます。入力データは自動転送されません。"}</p>
  </nav>;
}
