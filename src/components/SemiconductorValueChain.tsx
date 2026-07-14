import type { Route } from "next";
import Link from "next/link";
import type { IndustrySegment } from "@/types/content";

type SemiconductorValueChainProps = {
  segments: IndustrySegment[];
};

const primarySegmentIds = ["fabless", "idm", "foundry", "memory"] as const;

const stageLabels: Record<(typeof primarySegmentIds)[number], string> = {
  fabless: "設計を中心に担う",
  idm: "設計から製造まで担う",
  foundry: "顧客から製造を受託する",
  memory: "メモリ製品を開発・量産する",
};

export function SemiconductorValueChain({ segments }: SemiconductorValueChainProps) {
  const primarySegments = primarySegmentIds
    .map((id) => segments.find((segment) => segment.id === id))
    .filter((segment): segment is IndustrySegment => segment !== undefined);
  const equipment = segments.find((segment) => segment.id === "equipment");

  return (
    <section className="semiconductor-value-chain" aria-labelledby="value-chain-title">
      <header>
        <div>
          <p className="section-label">Semiconductor structure</p>
          <h2 id="value-chain-title">会社の役割から、業界のつながりを見る</h2>
        </div>
        <p>企業によって複数の役割を持つ場合があります。ここでは、既存データの主な事業モデルを起点に整理しています。</p>
      </header>

      <div className="semiconductor-value-chain__canvas">
        <div className="semiconductor-value-chain__flow" aria-label="半導体企業の主な役割">
          {primarySegments.map((segment, index) => (
            <div className={`semiconductor-value-chain__stage semiconductor-value-chain__stage--${segment.id}`} key={segment.id}>
              <Link href={`/segments/${segment.slug}` as Route}>
                <span>{String(index + 1).padStart(2, "0")} / {segment.shortName}</span>
                <small>{stageLabels[segment.id as keyof typeof stageLabels]}</small>
                <strong>{segment.name}</strong>
                <p>{segment.roleInValueChain}</p>
                <i aria-hidden="true">詳しく見る →</i>
              </Link>
            </div>
          ))}
        </div>

        {equipment ? (
          <div className="semiconductor-value-chain__support">
            <div aria-hidden="true"><i /><i /><i /><i /></div>
            <Link href={`/segments/${equipment.slug}` as Route}>
              <span>Supporting every stage / {equipment.shortName}</span>
              <strong>{equipment.name}</strong>
              <p>{equipment.roleInValueChain}</p>
              <i aria-hidden="true">全工程を横断して支える →</i>
            </Link>
          </div>
        ) : null}
      </div>
      <small className="semiconductor-value-chain__note">この図は企業の優劣や工程の厳密な順番を示すものではありません。各社の事業範囲は企業詳細と公式情報でご確認ください。</small>
    </section>
  );
}
