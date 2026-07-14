import type { CareerInfo, Company } from "@/types/content";

type ComparisonEntry = {
  career?: CareerInfo;
  company: Company;
};

type CompanyComparisonSummaryProps = {
  entries: ComparisonEntry[];
};

export function CompanyComparisonSummary({ entries }: CompanyComparisonSummaryProps) {
  if (entries.length < 2) return null;

  const [first, second] = entries;
  const sharedRoles = first.company.jobCategories.filter((role) => second.company.jobCategories.includes(role));

  const rows = [
    {
      label: "事業モデル",
      values: entries.map(({ company }) => [company.businessModel]),
    },
    {
      label: "主な職種",
      values: entries.map(({ company }) => company.jobCategories.slice(0, 4)),
    },
    {
      label: "向いている経験",
      values: entries.map(({ career }) => career?.suitableBackgrounds.slice(0, 2) ?? ["掲載データなし"]),
    },
  ];

  return (
    <section className="company-comparison-summary" aria-labelledby="comparison-summary-title">
      <header>
        <div>
          <p className="section-label">Comparison snapshot</p>
          <h2 id="comparison-summary-title">キャリアとの接点を先に比べる</h2>
        </div>
        <p>会社の優劣ではなく、現在の経験に近い仕事内容があるかを確認するための要約です。</p>
      </header>

      <div className="company-comparison-summary__head" aria-hidden="true">
        <span>比較軸</span>
        {entries.map(({ company }, index) => (
          <div key={company.id}>
            <small>Company {index + 1}</small>
            <strong>{company.nameJa}</strong>
          </div>
        ))}
      </div>

      <dl>
        {rows.map((row) => (
          <div className="company-comparison-summary__row" key={row.label}>
            <dt>{row.label}</dt>
            {row.values.map((values, index) => (
              <dd key={entries[index].company.id}>
                <small>{entries[index].company.nameJa}</small>
                {values.map((value) => <span key={value}>{value}</span>)}
              </dd>
            ))}
          </div>
        ))}
      </dl>

      <div className="company-comparison-summary__shared">
        <span>共通する職種キーワード</span>
        {sharedRoles.length > 0 ? (
          <div>{sharedRoles.map((role) => <strong key={role}>{role}</strong>)}</div>
        ) : (
          <p>既存データ上で完全一致する職種名はありません。近い仕事内容は下の詳細表で確認してください。</p>
        )}
      </div>
      <small className="company-comparison-summary__note">職種名が同じでも、担当範囲や採用条件は企業・求人ごとに異なります。</small>
    </section>
  );
}
