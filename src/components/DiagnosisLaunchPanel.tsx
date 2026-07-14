import Link from "next/link";

type DiagnosisLaunchPanelProps = {
  className?: string;
  title?: string;
};

const resultOutputs = [
  { label: "Career Route", value: "経験に近い半導体職種" },
  { label: "Power Score", value: "転職材料の整理度" },
  { label: "Today Quest", value: "今日15分でできる準備" },
] as const;

export function DiagnosisLaunchPanel({
  className = "",
  title = "まずは、今の経験を一度言葉にしてみる。",
}: DiagnosisLaunchPanelProps) {
  return (
    <section className={`diagnosis-launch-panel ${className}`.trim()} aria-labelledby="diagnosis-launch-title">
      <div className="diagnosis-launch-panel__copy">
        <p className="section-label">Career Compass</p>
        <h2 id="diagnosis-launch-title">{title}</h2>
        <p>現在の仕事内容と実績を12問で整理し、半導体キャリアへつながる入口と次の準備を確認できます。</p>
        <ul aria-label="診断の利用条件">
          <li><strong>12問</strong><span>選択式</span></li>
          <li><strong>約3分</strong><span>所要時間</span></li>
          <li><strong>登録不要</strong><span>連絡先入力なし</span></li>
        </ul>
      </div>

      <div className="diagnosis-launch-panel__console" aria-label="診断結果に表示される内容">
        <div className="diagnosis-launch-panel__status">
          <span>Manufacturing Compass</span>
          <strong><i aria-hidden="true" />Ready</strong>
        </div>
        <dl>
          {resultOutputs.map((output, index) => (
            <div key={output.label}>
              <dt><span>{String(index + 1).padStart(2, "0")}</span>{output.label}</dt>
              <dd>{output.value}</dd>
            </div>
          ))}
        </dl>
        <Link className="button" href="/career-compass">12問の診断を始める <span aria-hidden="true">→</span></Link>
        <Link className="diagnosis-launch-panel__secondary" href="/industry-map">先に半導体業界地図を見る</Link>
      </div>
    </section>
  );
}
