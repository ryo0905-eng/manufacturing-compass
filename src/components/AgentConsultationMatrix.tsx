import type { AffiliateAgent, AgentFocus } from "@/data/affiliateLinks";

type FocusOption = {
  description: string;
  id: AgentFocus;
  label: string;
  note: string;
};

type AgentConsultationMatrixProps = {
  agents: AffiliateAgent[];
  focusOptions: FocusOption[];
};

export function AgentConsultationMatrix({ agents, focusOptions }: AgentConsultationMatrixProps) {
  return (
    <section className="agent-consultation-matrix" aria-labelledby="agent-matrix-title">
      <header>
        <div>
          <p className="section-label">Consultation map</p>
          <h2 id="agent-matrix-title">相談テーマから、確認するサービスを絞る</h2>
        </div>
        <p>利用経験と各社の公開情報をもとにした相談テーマの整理です。サービスの優劣や求人紹介を保証する評価ではありません。</p>
      </header>

      <div className="agent-consultation-matrix__themes">
        {focusOptions.map((option, index) => (
          <div key={option.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{option.label}</strong>
            <p>{option.description}</p>
          </div>
        ))}
      </div>

      <div className="agent-consultation-matrix__table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">利用したサービス</th>
              {focusOptions.map((option) => <th scope="col" key={option.id}>{option.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <th scope="row">
                  <a href={`#${agent.id}`}>{agent.name}</a>
                  <small>{agent.category}</small>
                </th>
                {focusOptions.map((option) => {
                  const isIncluded = agent.focusAreas.includes(option.id);
                  return (
                    <td data-label={option.label} key={option.id}>
                      {isIncluded ? <span><i aria-hidden="true" />相談テーマに含む</span> : <small>—</small>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <small className="agent-consultation-matrix__note">実際の紹介求人は担当者、時期、地域、経験によって変わります。各社の詳細と登録前の確認事項を続けてご覧ください。</small>
    </section>
  );
}
