type CareerResultSnapshotProps = {
  currentRole?: string;
  recommendedSkill?: string;
  score: number;
  targetRole?: string;
  todayQuest?: string;
};

export function CareerResultSnapshot({ currentRole, recommendedSkill, score, targetRole, todayQuest }: CareerResultSnapshotProps) {
  const normalizedScore = Math.max(0, Math.min(100, score));

  return (
    <section className="career-result-snapshot" aria-labelledby="result-snapshot-title">
      <header>
        <div>
          <p className="result-kicker">Result at a glance</p>
          <h2 id="result-snapshot-title">診断結果の要点</h2>
        </div>
        <p>まずこの4項目を確認し、下のレポートで理由と準備手順を詳しく見られます。</p>
      </header>

      <div className="career-result-snapshot__grid">
        <article className="career-result-snapshot__score">
          <span>Power Score</span>
          <strong>{normalizedScore}<small>/100</small></strong>
          <div role="img" aria-label={`転職材料の整理度 ${normalizedScore}点`}><i style={{ width: `${normalizedScore}%` }} /></div>
          <small>応募準備を考えるための参考値</small>
        </article>

        <article className="career-result-snapshot__route">
          <span>Career Route</span>
          <div>
            <small>{currentRole || "現在の経験"}</small>
            <i aria-hidden="true">→</i>
            <strong>{targetRole || "近い職種を整理中"}</strong>
          </div>
        </article>

        <article>
          <span>Recommended Skill</span>
          <strong>{recommendedSkill || "経験の伝え方を整理する"}</strong>
          <small>選択肢を広げるために伸ばすこと</small>
        </article>

        <article className="career-result-snapshot__quest">
          <span>Today Quest</span>
          <strong>{todayQuest || "改善実績を1つ書き出す"}</strong>
          <a href="#today-quest">詳しい進め方を見る <i aria-hidden="true">↓</i></a>
        </article>
      </div>
      <small className="career-result-snapshot__note">スコアや職種は回答と静的ルールによる参考整理であり、企業評価や選考結果を示すものではありません。</small>
    </section>
  );
}
