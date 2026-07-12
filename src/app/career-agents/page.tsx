import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { DiagnosisCta } from "@/components/DiagnosisCta";
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
  title: "私が使った製造業・半導体向け転職エージェント",
  description: "RYOが実際に利用した製造業・半導体・外資系向け転職エージェントを、相談した内容、登録前に確認したいこと、広告の有無とともに紹介します。",
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
        <p className="section-label">RYOの利用経験</p>
        <h1>私が使った製造業・半導体向け転職エージェント</h1>
        <p>JACリクルートメント、タイズ、ギブクリエーション、ロバート・ウォルターズ、エンワールドを、実際に利用したり求人紹介を受けたりしました。</p>
        <p>同じ経歴でも、担当者、時期、地域、職種によって対応や紹介求人は変わります。ここで書くのは私個人の利用経験です。サービスの優劣や、転職結果を保証するものではありません。</p>
      </section>

      <AffiliateDisclosure label="広告表記" text={affiliateDisclosureText} />

      <section className="agent-use-note">
        <h2>私の場合、相談先ごとに確かめたいことを変えました</h2>
        <p>製造業の経験をどう伝えるか、外資系まで広げるか、専門職と管理職のどちらを見るか。一社ですべてを決めず、紹介された求人と自分の希望の差も見ました。</p>
        <p>タイズ経由で次の外資系半導体メーカーへの転職が決まり、ギブクリエーション経由で過去のメーカーへ転職した経験があります。転職先の具体名は、匿名性を守るため掲載していません。</p>
      </section>

      <nav className="agent-focus-nav" aria-label="相談したい内容で絞り込む">
        <strong>相談したい内容から先に見る</strong>
        <div>
          <Link aria-current={!selectedFocus ? "page" : undefined} href="/career-agents#agents">すべて</Link>
          {agentFocusOptions.map((option) => <Link aria-current={selectedFocus === option.id ? "page" : undefined} href={`/career-agents?focus=${option.id}#agents`} key={option.id}>{option.label}</Link>)}
        </div>
      </nav>

      <section className="agent-experience-list" id="agents" aria-label="転職エージェントの利用経験">
        {orderedAgents.map((agent) => {
          const url = getAgentUrl(agent);
          return (
            <article id={agent.id} key={agent.id}>
              <header><p>{agent.category}</p><h2>{agent.name}</h2></header>
              <dl>
                <div><dt>どのような相談に向いているか</dt><dd><p>{agent.description}</p><ul>{agent.consultationTopics.map((topic) => <li key={topic}>{topic}</li>)}</ul></dd></div>
                <div><dt>RYOがどのように利用したか</dt><dd><p>{agent.personalExperience}</p></dd></div>
                <div><dt>登録前に確認したいこと</dt><dd><p>{agent.pointsToConfirm}</p><p className="small-note">担当者や求人状況によって内容は変わります。希望職種、勤務地、働き方を登録前後に確認してください。</p></dd></div>
                <div><dt>公式情報</dt><dd><a className="text-link" href={agent.sourceUrl} rel="noopener noreferrer" target="_blank">公式情報・対象領域を確認する ↗</a><small>確認日 {agent.lastUpdated}</small></dd></div>
                <div><dt>{agent.linkType === "affiliate" ? "アフィリエイトリンク" : "サービスへのリンク"}</dt><dd>
                  {agent.affiliateCreativeHtml ? <div className="agent-affiliate-creative"><span>広告・アフィリエイトリンク</span><div dangerouslySetInnerHTML={{ __html: agent.affiliateCreativeHtml }} /><small>このリンクを経由した登録により、当サイトに報酬が発生する場合があります。</small></div> : url ? <a className="button secondary" href={url} rel={getAgentRel(agent)} target="_blank">{getAgentCtaLabel(agent)} ↗</a> : null}
                </dd></div>
              </dl>
            </article>
          );
        })}
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
