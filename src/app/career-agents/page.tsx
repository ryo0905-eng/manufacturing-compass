import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { affiliateAgents, getAgentCtaLabel, getAgentRel, getAgentUrl } from "@/data/affiliateLinks";

export const metadata: Metadata = {
  title: "製造業エンジニアにおすすめの転職エージェント | Project Compass",
  description:
    "製造業・半導体業界で働くエンジニア向けに、実体験をもとに転職エージェントを紹介します。メーカー転職、外資系、ハイクラス転職を考える人向けの比較ページです。",
};

export default function CareerAgentsPage() {
  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">Career agents</p>
        <h1>製造業エンジニアにおすすめの転職エージェント</h1>
        <p>
          本ページにはアフィリエイト広告を含みます。筆者の実体験と調査をもとに、製造業エンジニア向けに転職エージェントを紹介しています。
        </p>
      </section>

      <AffiliateDisclosure />

      <section className="agent-grid" aria-label="転職エージェント一覧">
        {affiliateAgents.map((agent) => {
          const url = getAgentUrl(agent);

          return (
            <article className="agent-card" id={agent.id} key={agent.id}>
              <div>
                <p className="eyebrow">{agent.category}</p>
                <h2>{agent.name}</h2>
                <p>{agent.description}</p>
              </div>
              <dl>
                <div>
                  <dt>おすすめする人</dt>
                  <dd>{agent.recommendedFor}</dd>
                </div>
                <div>
                  <dt>筆者メモ</dt>
                  <dd>{agent.note}</dd>
                </div>
              </dl>
              {url ? (
                <a className="button primary" href={url} rel={getAgentRel(agent)} target="_blank">
                  {getAgentCtaLabel(agent)}
                </a>
              ) : (
                <span className="button disabled">{getAgentCtaLabel(agent)}</span>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
