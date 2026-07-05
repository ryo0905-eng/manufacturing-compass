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

      <section className="agent-guide">
        <div>
          <span>How to choose</span>
          <h2>製造業エンジニアは、職種の翻訳が得意な相談先を選ぶ</h2>
          <p>
            半導体転職では、企業名だけでなく「品質保証を品質職へ寄せるのか」「設備保全を装置メーカーへ寄せるのか」の整理が重要です。
            エージェントを選ぶときは、メーカー転職、外資系、ハイクラス、職務経歴書の見せ方のどこに強いかを確認しましょう。
          </p>
        </div>
        <ul>
          <li>生産技術・品質保証・設備保全・設計・FAEのどれに近いかを先に整理する</li>
          <li>現年収だけでなく、半導体向けに翻訳した場合の評価レンジを聞く</li>
          <li>今すぐ狙う企業と、半年後に狙うストレッチ企業を分けて相談する</li>
        </ul>
      </section>

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

      <section className="agent-guide compact">
        <div>
          <span>Before consultation</span>
          <h2>相談前に準備するとよいこと</h2>
          <p>
            完璧な職務経歴書は不要です。まずは、担当工程、扱った設備や製品、改善前後の数字、顧客対応や英語対応の有無をメモしておくと相談が具体的になります。
          </p>
        </div>
      </section>
    </main>
  );
}
