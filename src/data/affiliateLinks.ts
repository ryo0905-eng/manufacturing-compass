export type AffiliateAgent = {
  id: string;
  name: string;
  category: string;
  description: string;
  recommendedFor: string;
  affiliateUrl?: string;
  officialUrl: string;
  hasAffiliate: boolean;
  note: string;
};

export const affiliateDisclosureText =
  "当サイトはアフィリエイト広告を利用しています。掲載内容は筆者の実体験・調査をもとに作成していますが、サービス内容や条件は変更される場合があります。最新情報は各公式サイトをご確認ください。";

export const affiliateAgents: AffiliateAgent[] = [
  {
    id: "jac-recruitment",
    name: "JACリクルートメント",
    category: "ハイクラス・外資系転職",
    description: "管理職、専門職、外資系、グローバル企業の転職相談に強い転職エージェントです。",
    recommendedFor: "半導体・製造業で年収アップ、外資系、マネジメント、専門職を狙いたい人",
    affiliateUrl: undefined,
    officialUrl: "https://www.jac-recruitment.jp/",
    hasAffiliate: false,
    note: "外資系半導体、グローバルメーカー、ハイクラス転職を考える人の比較候補にしやすいです。",
  },
  {
    id: "ties",
    name: "タイズ",
    category: "メーカー・製造業転職",
    description: "メーカー、製造業、技術職の転職支援に特化した転職エージェントです。",
    recommendedFor: "関西メーカー、製造業エンジニア、生産技術、品質、設計職で転職を考える人",
    affiliateUrl: undefined,
    officialUrl: "https://www.ee-ties.com/",
    hasAffiliate: false,
    note: "製造業経験を半導体・電子部品・装置メーカーへ接続したい人と相性がよい候補です。",
  },
  {
    id: "give-creation",
    name: "ギブクリエーション",
    category: "製造業・技術職転職",
    description: "製造業・技術職領域の転職支援候補として管理します。",
    recommendedFor: "製造業エンジニアとして、職務経歴の見せ方から相談したい人",
    affiliateUrl: undefined,
    officialUrl: "",
    hasAffiliate: false,
    note: "公式URL確認後に officialUrl または affiliateUrl を設定してください。",
  },
  {
    id: "robert-walters",
    name: "ロバート・ウォルターズ",
    category: "外資系・バイリンガル転職",
    description: "外資系、英語を使うポジション、バイリンガル人材の転職支援に強いエージェントです。",
    recommendedFor: "英語を活かして外資系半導体、FAE、営業技術、管理職を狙いたい人",
    affiliateUrl: undefined,
    officialUrl: "https://www.robertwalters.co.jp/",
    hasAffiliate: false,
    note: "英語力が市場価値に直結しやすいFAE・営業技術・外資系職種の相談候補です。",
  },
  {
    id: "enworld",
    name: "エンワールド",
    category: "外資系・グローバル転職",
    description: "外資系・グローバル企業の転職支援に強い転職エージェントです。",
    recommendedFor: "英語、外資系、グローバルメーカー、専門職転職を視野に入れたい人",
    affiliateUrl: undefined,
    officialUrl: "https://www.enworld.com/",
    hasAffiliate: false,
    note: "外資系メーカーやグローバルポジションの情報収集先として比較しやすいです。",
  },
];

export function getAffiliateAgent(agentId: string) {
  return affiliateAgents.find((agent) => agent.id === agentId);
}

export function getPrimaryAgent() {
  return affiliateAgents.find((agent) => agent.hasAffiliate) ?? affiliateAgents[0];
}

export function getAgentUrl(agent: AffiliateAgent) {
  return agent.hasAffiliate && agent.affiliateUrl ? agent.affiliateUrl : agent.officialUrl;
}

export function getAgentCtaLabel(agent: AffiliateAgent) {
  if (!getAgentUrl(agent)) {
    return "準備中";
  }

  return agent.hasAffiliate ? "無料相談してみる" : "公式サイトを見る";
}

export function getAgentRel(agent: AffiliateAgent) {
  return "sponsored noopener noreferrer";
}
