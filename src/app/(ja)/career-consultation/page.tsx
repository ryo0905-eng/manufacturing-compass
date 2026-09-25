import { JobPostingNote } from "@/components/JobPostingNote";
import { jobNoteMeta } from "@/data/job-posting-note";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/format";
import type { Metadata } from "next";
import Link from "next/link";
import { CareerCompassLink } from "@/components/CareerCompassLink";
import { CareerPrioritiesLink } from "@/components/CareerPrioritiesLink";
import { CareerAgentsLink } from "@/components/CareerAgentsLink";
import { ConsultationTemplate } from "@/components/ConsultationTemplate";
import { agentFocusOptions } from "@/data/affiliateLinks";

export const metadata: Metadata = {
  title: "半導体転職の相談準備・求人票の確認ノート",
  description: "半導体転職の求人票を8項目で確認。2件の記載状況も並べて、応募前に聞く質問をノートへ整理できます。登録・個人情報入力なしで相談を準備。",
  alternates: { canonical: "/career-consultation" },
};

const consultationTopics = [
  {
    label: "Route",
    title: "今狙う職種",
    body: "品質、プロセス、設備、装置、FAEのどこに寄せるか。",
  },
  {
    label: "Proof",
    title: "職務経歴書の見せ方",
    body: "改善前後、効果額、停止時間、再発防止をどう書くか。",
  },
  {
    label: "Reward",
    title: "年収レンジ",
    body: "求人票の給与内訳と、希望条件をどう確認するか。",
  },
  {
    label: "Next",
    title: "30日で積む経験",
    body: "応募前に増やす実績、学習、英語準備を決める。",
  },
];

export default function CareerConsultationPage() {
  return (
    <main className="page">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "WebApplication", "@id": `${siteUrl}${jobNoteMeta.href}`, url: `${siteUrl}${jobNoteMeta.href}`, name: "求人票の確認ノート", applicationCategory: "BusinessApplication", operatingSystem: "Web", inLanguage: "ja", dateModified: jobNoteMeta.updatedAt, offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } }} />
      <section className="consultation-hero">
        <p className="eyebrow">転職を考える前の次の一歩</p>
        <h1>相談する前に、論点を4つだけ揃える。</h1>
        <p>
          職種、実績、希望条件、準備期間を箇条書きにすると、相談したいことを伝えやすくなります。
        </p>
        <div className="actions">
          <CareerCompassLink className="button primary" ctaLocation="career_consultation_hero" ctaVariant="consultation_prep" sourcePage="/career-consultation">
            経験と近い職種を整理する
          </CareerCompassLink>
          <Link className="button ghost" href={jobNoteMeta.href}>求人票の確認ノートを作る</Link>
          <Link className="button ghost" href="/companies">
            企業を見直す
          </Link>
        </div>
      </section>

      <section className="consultation-grid" aria-label="相談前に整理する論点">
        {consultationTopics.map((topic) => (
          <div className="consultation-card" key={topic.label}>
            <span>{topic.label}</span>
            <h2>{topic.title}</h2>
            <p>{topic.body}</p>
          </div>
        ))}
      </section>

      <section className="section" id="job-posting-note" aria-labelledby="job-posting-note-title" style={{ scrollMarginTop: 88 }}>
        <h2 id="job-posting-note-title">求人票の確認ノート</h2>
        <JobPostingNote />
        <details><summary>確認項目の考え方と出典</summary><p>求人票の記載を自分で読み、相談で聞きたいことを整理するための編集部のチェック項目です。希望条件を決める「転職の軸ノート」とあわせて使えます。求人票は雇用契約書ではありません。採用時の条件は書面で確認してください。</p><p>参考：<a href={jobNoteMeta.source} target="_blank" rel="noopener noreferrer">ハローワーク「求人情報の見方」</a>。項目と用語の確認日：<time dateTime={jobNoteMeta.sourceCheckedAt}>{jobNoteMeta.sourceCheckedAt}</time>。質問文は相談用の編集例です。</p></details>
      </section>

      <section className="section" aria-labelledby="consultation-template-title">
        <h2 id="consultation-template-title">相談に持っていくメモを作る</h2>
        <ConsultationTemplate />
      </section>

      <section className="section" aria-labelledby="consultation-agents-title">
        <h2 id="consultation-agents-title">メモができたら、相談したい内容で相手を探す</h2>
        <p>経験の伝え方、英語を使う仕事、専門性や待遇。確認したい論点に合わせて、相談先の特徴と利用経験を比較できます。</p>
        <CareerAgentsLink className="button secondary" ctaLocation="consultation_after_template">相談先を比較する</CareerAgentsLink>
        <ul className="source-list">
          {agentFocusOptions.map((option) => (
            <li key={option.id}>
              <CareerAgentsLink className="text-link" focus={option.id} ctaLocation="consultation_theme">{option.label}</CareerAgentsLink>
            </li>
          ))}
        </ul>
      </section>

      <section className="cta-panel" aria-labelledby="career-priorities-title">
        <p className="section-label">希望条件も、相談前に整理する</p>
        <h2 id="career-priorities-title">勤務地・仕事内容・待遇。今回、大切にしたいことは？</h2>
        <p>転職の軸ノートで、変えたいこと・残したいことから仮の優先順位を整理し、求人票や面接で確認したい質問をメモにできます。「まだ迷う」のままでも大丈夫です。</p>
        <div className="cta-actions">
          <CareerPrioritiesLink
            className="button primary"
            ctaLocation="consultation_after_topics"
          >
            転職の軸ノートで整理する
          </CareerPrioritiesLink>
        </div>
        <p className="disclosure">目安3〜5分・ログイン不要。回答は保存されません。完成したノートをコピーして、相談に使えます。</p>
      </section>
    </main>
  );
}
