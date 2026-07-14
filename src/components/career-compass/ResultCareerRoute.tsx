export type ResultCareerRouteStage = {
  actions: string[];
  label: string;
  outcome?: string;
  role?: string;
};

type ResultCareerRouteProps = {
  currentRole: string;
  stages: ResultCareerRouteStage[];
};

export function ResultCareerRoute({ currentRole, stages }: ResultCareerRouteProps) {
  if (stages.length === 0) return null;

  return (
    <section className="result-section result-career-route" aria-labelledby="result-career-route-title">
      <div className="result-section-heading result-career-route__heading">
        <div>
          <p className="result-kicker">Career Route</p>
          <h2 id="result-career-route-title">今の経験から、1年後の選択肢へ</h2>
        </div>
        <p>現在の経験を起点に、狙える職種と、その先の選択肢を準備行動でつなぎます。</p>
      </div>

      <div className="result-career-route__canvas">
        <div className="result-career-route__origin">
          <span>Current Experience</span>
          <strong>{currentRole || "現在の経験"}</strong>
          <small>診断で選択した現在地</small>
        </div>

        <div className="result-career-route__connector" aria-hidden="true">
          <span>経験を翻訳</span>
          <i />
          <b>→</b>
        </div>

        <ol className="result-career-route__stages">
          {stages.map((stage, index) => {
            const outcome = stage.outcome !== stage.role ? stage.outcome : undefined;

            return (
              <li key={stage.label}>
                <div className="result-career-route__stage-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{stage.label}</strong>
                </div>
                <div className="result-career-route__stage-body">
                  <small>{index === 0 ? "狙える職種" : "選択肢の広がり"}</small>
                  {stage.role ? <h3>{stage.role}</h3> : null}
                  {stage.actions.length > 0 ? (
                    <div className="result-career-route__actions">
                      <span>次の準備</span>
                      <ul>{stage.actions.map((action) => <li key={action}>{action}</li>)}</ul>
                    </div>
                  ) : null}
                  {outcome ? <p><span>到達イメージ</span>{outcome}</p> : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <small className="result-career-route__note">職種と時期は回答に基づく準備の目安です。求人状況や選考結果を保証するものではありません。</small>
    </section>
  );
}
