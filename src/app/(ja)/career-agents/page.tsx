import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AgentConsultationMatrix } from "@/components/AgentConsultationMatrix";
import { DiagnosisCta } from "@/components/DiagnosisCta";
import { TrackedAffiliateCreative } from "@/components/TrackedAffiliateCreative";
import {
  agentFocusOptions,
  affiliateAgents,
  affiliateDisclosureText,
  getAgentCtaLabel,
  getAgentRel,
  getAgentUrl,
  type AgentFocus,
} from "@/data/affiliateLinks";

export const metadata: Metadata = {
  title: "製造業・半導体向け転職エージェントの比較",
  description: "製造業・半導体・外資系向け転職エージェントを、運営者の利用経験と公開情報をもとに、相談内容や登録前の確認点とともに紹介します。",
  alternates: { canonical: "/career-agents" },
};

type CareerAgentsPageProps = { searchParams: Promise<{ focus?: string | string[] }> };

function isAgentFocus(value: string | undefined): value is AgentFocus {
  return agentFocusOptions.some((option) => option.id === value);
}

export default async function CareerAgentsPage({ searchParams }: CareerAgentsPageProps) {
  const params = await searchParams;
  const focusValue = Array.isArray(params.focus) ? params.focus[0] : params.focus;
  const selectedFocus = isAgentFocus(focusValue) ? focusValue : undefined;
  const orderedAgents = selectedFocus
    ? [...affiliateAgents].sort((left, right) => Number(right.focusAreas.includes(selectedFocus)) - Number(left.focusAreas.includes(selectedFocus)))
    : affiliateAgents;

  return (
    <main className="page career-agents-page agent-editorial-page">
      <section className="page-hero editorial-page-hero">
        <p className="section-label">利用経験と公開情報</p>
        <h1>製造業・半導体向け転職エージェントの比較</h1>
        <p>運営者の利用経験と各社の公開情報をもとに、相談先の特徴と登録前の確認点を整理します。利用経験は、実際に利用したサービスについてのみ紹介します。</p>
      </section>

      <AffiliateDisclosure label="広告表記" text={affiliateDisclosureText} />

      <aside className="agent-common-note">
        担当者、時期、地域、職種によって紹介求人は変わります。希望職種・勤務地・働き方は、登録前後に確認してください。
      </aside>

      <AgentConsultationMatrix agents={affiliateAgents} focusOptions={agentFocusOptions} />

      <nav className="agent-focus-nav" aria-label="相談したい内容で絞り込む">
        <strong>相談したい内容から先に見る</strong>
        <div>
          <Link aria-current={!selectedFocus ? "page" : undefined} href="/career-agents#agents">すべて</Link>
          {agentFocusOptions.map((option) => <Link aria-current={selectedFocus === option.id ? "page" : undefined} href={`/career-agents?focus=${option.id}#agents`} key={option.id}>{option.label}</Link>)}
        </div>
      </nav>

      <section className="agent-experience-list" id="agents" aria-label="転職エージェントの比較">
        {orderedAgents.map((agent) => {
          const url = getAgentUrl(agent);
          return (
            <article id={agent.id} key={agent.id}>
              <header><p>{agent.category}</p><h2>{agent.name}</h2><p>{agent.description}</p></header>
              <dl>
                <div><dt>利用者像の目安</dt><dd><p>{agent.recommendedFor}</p></dd></div>
                <div><dt>どんな相談に向くか</dt><dd><ul>{agent.consultationTopics.map((topic) => <li key={topic}>{topic}</li>)}</ul></dd></div>
                {agent.personalExperience ? <div><dt>RYOの利用経験</dt><dd><p>{agent.personalExperience}</p></dd></div> : null}
                <div><dt>登録前に確認すること</dt><dd><p>{agent.pointsToConfirm}</p></dd></div>
              </dl>
              <footer className="agent-link-row">
                <div>
                  {!agent.affiliateCreativeHtml ? <a className="text-link" href={agent.sourceUrl} rel="noopener noreferrer" target="_blank">公式情報 ↗</a> : null}
                  <small>確認日 {agent.checkedAt}</small>
                </div>
                {agent.affiliateCreativeHtml ? <TrackedAffiliateCreative agentId={agent.id} html={agent.affiliateCreativeHtml} /> : url ? <a className="button secondary" href={url} rel={getAgentRel(agent)} target="_blank">{getAgentCtaLabel(agent)} ↗</a> : null}
              </footer>
            </article>
          );
        })}
      </section>

      <section className="agent-prep-editorial" aria-labelledby="agent-tips">
        <h2 id="agent-tips">転職エージェントの使い方のコツ</h2>
        <ul>
          <li>情報収集は総合型、製造・半導体特化、外資特化など役割の違う複数のエージェントで広く行い、応募段階では信頼できる窓口に絞ります。</li>
          <li>「調べる求人」と「応募する求人」を分け、応募では業界か職種のどちらかを固定して、不慣れな要素を同時に変えすぎないようにします。</li>
          <li>同じ求人への重複応募を避けるため、企業・応募日・エージェント・次のステップを一つのリストで管理します。</li>
          <li>応募を強く勧められたら、合う理由、評価される経験、希望との違いを質問し、その場で決めずに考えます。</li>
        </ul>
      </section>

      <section className="agent-prep-editorial" aria-labelledby="agent-faq">
        <h2 id="agent-faq">よくある質問</h2>
        <h3>複数のエージェントに登録していることは伝えるべきですか？</h3>
        <p>複数利用していることや応募状況を伝えると、同じ求人への重複応募を避けやすくなります。共有する情報の範囲は自分で確認しましょう。</p>
        <h3>応募を強く勧められたらどうすればよいですか？</h3>
        <p>合う理由や評価される経験、希望との違いを聞き、その場で決めずに検討しましょう。</p>
        <h3>情報収集と応募で使い分けは必要ですか？</h3>
        <p>情報収集では役割の違う複数の窓口を使い、応募する際は信頼できる窓口に絞ると、選択肢を広げながら応募状況を管理しやすくなります。</p>
      </section>

      <section className="agent-prep-editorial">
        <h2>相談前は、箇条書きで十分です</h2>
        <p>完璧な職務経歴書を作ってから登録する必要はありません。まずは次の項目をメモしておくと、求人との違いを話しやすくなります。</p>
        <ul><li>担当した工程・製品・装置</li><li>不良や停止の原因をどう絞ったか</li><li>改善前後の率・件数・時間・コスト</li><li>顧客・他部門・海外工場との関わり</li><li>英語を使った具体的な場面</li><li>避けたい仕事内容と希望する働き方</li></ul>
      </section>

      <DiagnosisCta title="相談前のメモを、12問から作る" body="近い職種、伝えやすい強み、足りない経験、今日書き出す内容まで確認できます。" />
    </main>
  );
}
