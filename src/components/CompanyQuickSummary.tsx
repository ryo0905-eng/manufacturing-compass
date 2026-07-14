import type { CareerInfo, Company } from "@/types/content";

type CompanyQuickSummaryProps = {
  career?: CareerInfo;
  company: Company;
  segmentNames: string[];
};

function SummaryIcon({ type }: { type: "category" | "focus" | "location" | "research" | "roles" | "suitable" }) {
  return (
    <span className={`company-quick-summary__icon company-quick-summary__icon--${type}`} aria-hidden="true">
      <i /><i /><i />
    </span>
  );
}

export function CompanyQuickSummary({ career, company, segmentNames }: CompanyQuickSummaryProps) {
  const items = [
    {
      key: "category" as const,
      label: "カテゴリー",
      values: segmentNames.length > 0 ? segmentNames : [company.businessModel],
    },
    {
      key: "focus" as const,
      label: "主力領域",
      values: company.mainProducts.slice(0, 3),
    },
    {
      key: "roles" as const,
      label: "主な職種",
      values: (career?.typicalRoles ?? company.jobCategories).slice(0, 4),
    },
    {
      key: "location" as const,
      label: "国内拠点",
      values: company.locationsJapan,
    },
    {
      key: "suitable" as const,
      label: "向いている経験",
      values: career?.suitableBackgrounds.slice(0, 2) ?? ["公開情報を確認しながら整理中です"],
    },
    {
      key: "research" as const,
      label: "企業研究で見るポイント",
      values: [career?.notes ?? company.careerSummary],
    },
  ];

  return (
    <section className="company-quick-summary" aria-labelledby="company-quick-summary-title">
      <header>
        <div>
          <p className="section-label">Company at a glance</p>
          <h2 id="company-quick-summary-title">転職目線で見る6つのポイント</h2>
        </div>
        <p>公開情報と既存のキャリアデータを、短時間で確認できるよう整理しています。</p>
      </header>
      <dl>
        {items.map((item) => (
          <div className={`company-quick-summary__item company-quick-summary__item--${item.key}`} key={item.key}>
            <dt><SummaryIcon type={item.key} />{item.label}</dt>
            <dd>
              {item.values.map((value) => <span key={value}>{value}</span>)}
            </dd>
          </div>
        ))}
      </dl>
      <small>企業の優劣や選考難易度を示す評価ではありません。最新の募集職種・条件は公式採用情報をご確認ください。</small>
    </section>
  );
}
