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
          <h2 id="result-career-route-title">今の経験から見える選択肢。</h2>
        </div>
        <p>今検討しやすい仕事と、準備を続けた先の候補を分けて見ます。</p>
      </div>

      <div className="result-career-route__current">
        <span>今の経験</span>
        <div>
          <strong>{currentRole || "現在の経験"}</strong>
          <small>回答で選択した仕事内容</small>
        </div>
      </div>
      <ol className="result-career-route__stages">
        {stages.map((stage, index) => {
          const outcome = stage.outcome !== stage.role ? stage.outcome : undefined;

          return (
            <li key={stage.label}>
              <div className="result-career-route__stage-head">
                <span>{stage.label}</span>
                <small>{index === 0 ? "今検討しやすい仕事" : "準備後の選択肢"}</small>
              </div>
              <div className="result-career-route__stage-body">
                {stage.role ? <h3>{stage.role}</h3> : null}
                {stage.actions.length > 0 ? (
                  <div className="result-career-route__actions">
                    <span>次に進めること</span>
                    <ul>{stage.actions.map((action) => <li key={action}>{action}</li>)}</ul>
                  </div>
                ) : null}
                {outcome ? <p><span>候補</span>{outcome}</p> : null}
              </div>
            </li>
          );
        })}
      </ol>

      <small className="result-career-route__note">職種と時期は回答に基づく準備の目安です。最新の求人条件は各社の採用情報をご確認ください。</small>
    </section>
  );
}
