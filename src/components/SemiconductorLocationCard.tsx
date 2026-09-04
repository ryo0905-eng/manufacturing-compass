import type { Route } from "next";
import Link from "next/link";
import styles from "@/components/semiconductor-location-map.module.css";
import type { CompanyLocation, EffectiveHiringSignal, JobFamily, LocationSource, LocationType } from "@/types/company-location";

const locationTypeLabels: Record<LocationType, string> = {
  headquarters: "本社",
  office: "オフィス",
  factory: "工場",
  "research-development": "研究開発",
  "design-center": "設計・開発",
  "field-service": "フィールドサービス",
  logistics: "物流・施設",
};

const jobFamilyLabels: Record<JobFamily, string> = {
  "process-production": "生産・プロセス",
  "equipment-facility": "設備・施設",
  "quality-reliability": "品質・信頼性",
  "equipment-development": "装置開発",
  "circuit-software-design": "設計・ソフトウェア",
  "field-application-service": "FAE・フィールドサービス",
  "supply-chain-corporate": "サプライチェーン・管理",
};

const operationalStatusLabels = {
  operating: "稼働中",
  "under-construction": "建設中",
  planned: "計画中",
  "status-unconfirmed": "状態確認中",
} as const;

function hiringLabel(signal: EffectiveHiringSignal) {
  switch (signal.status) {
    case "official-opening-confirmed":
      return `公式求人を確認（${signal.checkedAt}時点）`;
    case "career-page-available":
      return `公式採用ページあり（${signal.checkedAt}確認）`;
    case "no-current-opening-confirmed":
      return `拠点別の中途求人は確認できず（${signal.checkedAt}時点）`;
    case "review-expired":
      return `採用情報を再確認中（前回確認 ${signal.checkedAt}）`;
  }
}

type SemiconductorLocationCardProps = {
  company: {
    nameJa: string;
    slug: string;
  };
  location: CompanyLocation;
  hiringSignal?: EffectiveHiringSignal;
  sources: LocationSource[];
};

export function SemiconductorLocationCard({
  company,
  location,
  hiringSignal,
  sources,
}: SemiconductorLocationCardProps) {
  return (
    <article className={styles.card} id={location.id}>
      <header className={styles.cardHeader}>
        <div>
          <p className={styles.companyName}>{company.nameJa}</p>
          <h3>{location.name}</h3>
          <p className={styles.address}>{location.address ?? `${location.prefectureName}${location.municipality}`}</p>
        </div>
        <span className={styles.status}>{operationalStatusLabels[location.operationalStatus]}</span>
      </header>

      <ul className={styles.tagList} aria-label="拠点種別">
        {location.locationTypes.map((type) => <li key={type}>{locationTypeLabels[type]}</li>)}
      </ul>

      <dl className={styles.facts}>
        <div>
          <dt>主な役割・技術</dt>
          <dd>{location.mainProducts.length > 0 ? location.mainProducts.join(" / ") : "公式情報で拠点固有の内容を確認中"}</dd>
        </div>
        <div>
          <dt>関連する職種</dt>
          <dd>
            {location.jobFamilies.length > 0
              ? location.jobFamilies.map((family) => jobFamilyLabels[family]).join(" / ")
              : "拠点固有の職種は確認中"}
          </dd>
        </div>
      </dl>

      {location.facilities && location.facilities.length > 1 ? (
        <div className={styles.facilities}>
          <strong>同じ拠点内の施設状況</strong>
          <ul>
            {location.facilities.map((facility) => (
              <li key={facility.id}>
                <div>
                  <span>{facility.name}</span>
                  {facility.statusEvents?.map((event) => (
                    <p key={`${facility.id}-${event.type}-${event.announcedAt}`}>
                      {event.note}{event.expectedTimingText ? `（${event.expectedTimingText}）` : ""}
                    </p>
                  ))}
                </div>
                <small>{operationalStatusLabels[facility.operationalStatus]}</small>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hiringSignal ? (
        <div className={styles.hiring} data-status={hiringSignal.status}>
          <div>
            <strong>{hiringLabel(hiringSignal)}</strong>
            {hiringSignal.roleLabels.length > 0 ? <p>{hiringSignal.roleLabels.join(" / ")}</p> : null}
          </div>
          <a href={hiringSignal.careerUrl} rel="noreferrer">公式採用情報を見る</a>
        </div>
      ) : null}

      <footer className={styles.cardFooter}>
        <Link href={`/companies/${company.slug}` as Route}>企業詳細を見る <span aria-hidden="true">→</span></Link>
        <details>
          <summary>情報源と確認日</summary>
          <ul>
            {sources.map((source) => (
              <li key={source.id}>
                <a href={source.url} rel="noreferrer">{source.title}</a>
                <span>{source.accessedAt}確認</span>
              </li>
            ))}
          </ul>
        </details>
      </footer>
    </article>
  );
}
