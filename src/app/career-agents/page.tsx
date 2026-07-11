import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import {
  agentFocusOptions,
  affiliateAgents,
  affiliateDisclosureText,
  getAgentCtaLabel,
  getAgentRel,
  getAgentUrl,
  officialLinkDisclosureText,
  type AgentFocus,
} from "@/data/affiliateLinks";

export const metadata: Metadata = {
  title: "製造業エンジニア向け転職エージェントの選び方・比較 | Manufacturing Compass",
  description:
    "製造業・半導体業界のエンジニア向けに、メーカー転職、外資系、専門職など相談目的別の転職エージェントの選び方を公式情報から整理します。",
};

type CareerAgentsPageProps = {
  searchParams: Promise<{ focus?: string | string[] }>;
};

function isAgentFocus(value: string | undefined): value is AgentFocus {
  return agentFocusOptions.some((option) => option.id === value);
}

export default async function CareerAgentsPage({ searchParams }: CareerAgentsPageProps) {
  const params = await searchParams;
  const focusValue = Array.isArray(params.focus) ? params.focus[0] : params.focus;
  const selectedFocus = isAgentFocus(focusValue) ? focusValue : undefined;
  const selectedOption = agentFocusOptions.find((option) => option.id === selectedFocus);
  const orderedAgents = selectedFocus
    ? [...affiliateAgents].sort((left, right) => Number(right.focusAreas.includes(selectedFocus)) - Number(left.focusAreas.includes(selectedFocus)))
    : affiliateAgents;
  const hasAffiliateLink = affiliateAgents.some((agent) => agent.linkType === "affiliate" && agent.affiliateUrl);

  return (
    <main className="page career-agents-page">
      <section className="career-agents-hero">
        <div>
          <p className="eyebrow">Career agents</p>
          <h1>
            <span>半導体・製造業の</span>
            <span>転職エージェントを、</span>
            <span>相談目的から選ぶ</span>
          </h1>
          <p>
            知名度だけで決めるのではなく、製造業経験の翻訳、外資系転職、年収・専門性など、相談したい内容との相性から比較します。
          </p>
          <div className="actions">
            <a className="button primary" href="#agent-focus">相談目的を選ぶ</a>
            <Link className="button ghost" href="/career-compass">診断で相談テーマを整理する</Link>
          </div>
        </div>
        <aside className="career-agents-hero-note">
          <span>選び方の基準</span>
          <strong>会社名より先に、何を相談したいかを決める。</strong>
          <p>掲載順は、サービスの優劣やランキングを表すものではありません。</p>
        </aside>
      </section>

      <AffiliateDisclosure
        label={hasAffiliateLink ? "広告表記" : "リンクについて"}
        text={hasAffiliateLink ? affiliateDisclosureText : officialLinkDisclosureText}
      />

      <section className="agent-focus-section" id="agent-focus" aria-labelledby="agent-focus-title">
        <div className="agent-section-heading">
          <div>
            <p className="eyebrow">Choose your topic</p>
            <h2 id="agent-focus-title">まず、相談したいことを選ぶ</h2>
          </div>
          <p>登録先を一度に決める必要はありません。相談テーマに合う候補から、求人や担当領域を確認できます。</p>
        </div>
        <nav className="agent-focus-grid" aria-label="相談目的で絞り込む">
          {agentFocusOptions.map((option, index) => {
            const isSelected = option.id === selectedFocus;

            return (
              <Link
                aria-current={isSelected ? "true" : undefined}
                className={isSelected ? "agent-focus-card selected" : "agent-focus-card"}
                href={`/career-agents?focus=${option.id}#agents`}
                key={option.id}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{option.label}</h3>
                <p>{option.description}</p>
                <small>{option.note}</small>
              </Link>
            );
          })}
        </nav>
      </section>

      <section className="agent-results-section" id="agents" aria-labelledby="agent-results-title">
        <div className="agent-section-heading">
          <div>
            <p className="eyebrow">Compare consultation options</p>
            <h2 id="agent-results-title">{selectedOption ? `「${selectedOption.label}」の相談候補` : "相談先を共通の軸で比較する"}</h2>
          </div>
          <p>
            {selectedOption
              ? "選んだテーマとの接点がある候補を先に表示しています。掲載順は優劣を示しません。"
              : "公式情報で確認できる対象領域を、同じ項目で整理しています。"}
          </p>
        </div>

        <div className="career-agent-grid">
          {orderedAgents.map((agent) => {
            const url = getAgentUrl(agent);
            const isMatched = selectedFocus ? agent.focusAreas.includes(selectedFocus) : false;

            return (
              <article className={isMatched ? "career-agent-card matched" : "career-agent-card"} id={agent.id} key={agent.id}>
                <header>
                  <div>
                    <p className="eyebrow">{agent.category}</p>
                    <h3>{agent.name}</h3>
                  </div>
                  {isMatched ? <span>選んだテーマに対応</span> : null}
                </header>
                <p className="career-agent-description">{agent.description}</p>

                <div className="career-agent-role-list" aria-label={`${agent.name}の対象領域`}>
                  {agent.suitableRoles.map((role) => <span key={role}>{role}</span>)}
                </div>

                <dl>
                  <div>
                    <dt>向いている相談テーマ</dt>
                    <dd><ul>{agent.consultationTopics.map((topic) => <li key={topic}>{topic}</li>)}</ul></dd>
                  </div>
                  <div>
                    <dt>相談時に確認したいこと</dt>
                    <dd>{agent.pointsToConfirm}</dd>
                  </div>
                </dl>

                <footer>
                  <div>
                    <a href={agent.sourceUrl} rel="noopener noreferrer" target="_blank">情報源</a>
                    <small>確認日 {agent.lastUpdated}</small>
                  </div>
                  {url ? (
                    <a className="agent-official-link" href={url} rel={getAgentRel(agent)} target="_blank">
                      {getAgentCtaLabel(agent)} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="agent-official-link disabled">{getAgentCtaLabel(agent)}</span>
                  )}
                </footer>
              </article>
            );
          })}
        </div>
      </section>

      <section className="agent-preparation" aria-labelledby="agent-preparation-title">
        <div>
          <p className="eyebrow">Before consultation</p>
          <h2 id="agent-preparation-title">相談前に、これだけメモしておく</h2>
          <p>完璧な職務経歴書は不要です。経験と希望を短く整理しておくと、相談先との相性も判断しやすくなります。</p>
        </div>
        <ul>
          <li>担当した工程・製品・装置</li>
          <li>最も説明しやすい実績</li>
          <li>改善前後の率・件数・時間</li>
          <li>顧客・他部門との関わり</li>
          <li>英語を使った場面</li>
          <li>希望勤務地・勤務形態</li>
        </ul>
        <aside>
          <span>Career Compass</span>
          <strong>相談テーマが決まっていない場合は、診断結果から相談メモを作れます。</strong>
          <Link className="button primary" href="/career-compass">キャリアの現在地を確認する</Link>
        </aside>
      </section>

      <section className="agent-editorial-policy" aria-labelledby="agent-policy-title">
        <div>
          <p className="eyebrow">Editorial policy</p>
          <h2 id="agent-policy-title">掲載と比較の考え方</h2>
        </div>
        <ul>
          <li>掲載順はランキングやサービスの優劣を示しません。</li>
          <li>各社公式サイトの対象領域・サービス情報を優先して整理します。</li>
          <li>求人状況や支援対象は変わるため、相談前に公式情報をご確認ください。</li>
          <li>アフィリエイトリンクを掲載する場合は、リンクの近くとページ上部で明示します。</li>
        </ul>
        <Link className="text-link" href="/advertising-policy">広告掲載ポリシーを見る</Link>
      </section>
    </main>
  );
}
