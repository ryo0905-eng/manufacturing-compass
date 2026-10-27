import { getAffiliateAgent } from "@/data/affiliateLinks";

type RankingCareerAffiliate = {
  id: "makers-job" | "jac-recruitment" | "semiconductor-job";
  name: string;
  topic: string;
  audience: string;
  check: string;
  partnership: "approved";
  sourceUrl: string;
  checkedAt: string;
  creativeHtml: string | undefined;
};

/** Public service descriptions, separate from the operator's five personal experiences. */
export const rankingCareerAffiliates: readonly RankingCareerAffiliate[] = [
  {
    id: "makers-job", name: "メーカーズジョブ",
    topic: "製造業での経験を、次のメーカーでどう生かすか相談する",
    audience: "製造業の技術職として、経験や専門性を生かせる仕事を探したい方",
    check: "希望する職種・勤務地の支援範囲と、自分の経験に合う求人があるかを確認してください。",
    partnership: "approved", sourceUrl: "https://makers-job.jp/", checkedAt: "2026-10-27",
    creativeHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=4BCH7M+7MGUNM+5B0Y+TS3OI" rel="nofollow">【メーカーズジョブ】</a> <img border="0" width="1" height="1" src="https://www16.a8.net/0.gif?a8mat=4BCH7M+7MGUNM+5B0Y+TS3OI" alt="">',
  },
  {
    id: "jac-recruitment", name: "JAC Recruitment",
    topic: "専門職・管理職としての選択肢を相談する",
    audience: "製造業での専門性やマネジメント経験を生かし、次の役割を考えたい方",
    check: "希望する専門領域・役職・勤務地で、紹介可能な求人があるかを確認してください。",
    partnership: "approved", sourceUrl: "https://www.jac-recruitment.jp/market/manufacture/", checkedAt: "2026-10-27",
    creativeHtml: getAffiliateAgent("jac-recruitment")?.affiliateCreativeHtml,
  },
  {
    id: "semiconductor-job", name: "半導体Jobエージェント",
    topic: "半導体業界での正社員転職を相談する",
    audience: "半導体業界の仕事を候補に、正社員としての転職を考えている方",
    check: "希望職種・勤務地の求人と、業界経験に応じた支援があるかを確認してください。",
    partnership: "approved", sourceUrl: "https://semiconductor-job.com/", checkedAt: "2026-10-27",
    // Advertiser-provided free-text creative; only its explicitly editable label is set.
    creativeHtml: '<a href="//af.moshimo.com/af/c/click?a_id=5869608&p_id=6102&pc_id=17125&pl_id=78390" rel="nofollow" referrerpolicy="no-referrer-when-downgrade" attributionsrc>半導体Jobエージェントの公式サイトを見る</a><img src="//i.moshimo.com/af/i/impression?a_id=5869608&p_id=6102&pc_id=17125&pl_id=78390" width="1" height="1" style="border:none;" loading="lazy">',
  },
];
