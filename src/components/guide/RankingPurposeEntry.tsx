import type { ReactNode } from "react";
import { rankingPurposes, rankingPurposeContext, type ReaderPurpose } from "@/data/ranking-purpose";
import { getAgentsByIds } from "@/data/affiliateLinks";
import { RankingPurposeChooser, RankingPurposeLink } from "./RankingPurposeChooser";
import { TrackedAffiliateCreative } from "@/components/TrackedAffiliateCreative";
import styles from "./RankingPurposeEntry.module.css";

export function RankingPurposeEntry() {
  const agents = getAgentsByIds(["makers-job", "jac-recruitment", "semiconductor-job"]);
  const panels = Object.fromEntries(rankingPurposes.map(purpose => [purpose.id, <div key={purpose.id}>
    {purpose.id === "career" ? <p>まずは仕事内容や経験との接点を整理し、必要に応じて相談先を調べられます。</p> : purpose.id === "investment" ? <p>株価と業績は別の指標です。企業の事業や原資料と合わせて確認できます。特定銘柄の売買を勧める案内ではありません。</p> : null}
    <ul className={styles.links}>{purpose.links.map(link => <li key={link.id}>
      <RankingPurposeLink purpose={purpose.id} destination={link.id} href={link.href}>{link.label} →</RankingPurposeLink>
    </li>)}</ul>
    {purpose.id === "career" ? <>
      <h4>相談したいテーマから、相談先を探す</h4>
      <p className={styles.note}>広告・アフィリエイトを含み、申込み等により当サイトが報酬を受け取る場合があります。公開情報に基づく紹介で、並び順はおすすめ順位ではありません。求人紹介・転職成功を保証するものではありません。</p>
      <div className={styles.agents}>{agents.map(agent => <article key={agent.id}>
        <h5>{agent.name}</h5><p className={styles.topic}>{agent.description}</p>
        <dl><div><dt>こんな方に</dt><dd>{agent.recommendedFor}</dd></div></dl>
        {agent.partnership === "approved" && agent.affiliateCreativeHtml ? <TrackedAffiliateCreative agentId={agent.id} html={agent.affiliateCreativeHtml}
          sourcePage={rankingPurposeContext.source_page} ctaLocation={rankingPurposeContext.cta_location} readerPurpose="career" uiVersion={rankingPurposeContext.ui_version} /> : null}
      </article>)}</div>
    </> : null}
  </div>])) as Record<ReaderPurpose, ReactNode>;

  return <section className={styles.entry} id="research-next" aria-labelledby="ranking-purpose-title">
    <h2 id="ranking-purpose-title">気になった企業から、次に調べる</h2>
    <p>株価、仕事、技術、企業研究。今の関心に近いカードから、次の調べ方を見つけられます。</p>
    <RankingPurposeChooser panels={panels} />
    <noscript><div className={styles.fallback}><p>目的に合うページから、続きを調べられます。</p>
      {rankingPurposes.map(purpose => <div key={purpose.id}><h3>{purpose.label}</h3><ul>{purpose.links.map(link => <li key={link.id}><a href={link.href}>{link.label}</a></li>)}</ul></div>)}
    </div></noscript>
  </section>;
}
