export type AgentFocus = "career-translation" | "global" | "specialist";

export type AffiliateAgent = {
  id: string;
  name: string;
  category: string;
  description: string;
  recommendedFor: string;
  focusAreas: AgentFocus[];
  suitableRoles: string[];
  consultationTopics: string[];
  pointsToConfirm: string;
  affiliateUrl?: string;
  officialUrl: string;
  linkType: "affiliate" | "official";
  sourceUrl: string;
  lastUpdated: string;
};

export const affiliateDisclosureText =
  "当サイトはアフィリエイト広告を利用しています。掲載内容は各社公式情報と運営者による調査をもとに作成していますが、サービス内容や条件は変更される場合があります。最新情報は各公式サイトをご確認ください。";

export const officialLinkDisclosureText =
  "現在掲載しているリンクは、各社公式サイトへの通常リンクです。掲載内容は公式情報をもとに編集しており、サービス内容や求人状況は変更される場合があります。最新情報は各公式サイトをご確認ください。";

export const agentFocusOptions: Array<{ id: AgentFocus; label: string; description: string; note: string }> = [
  {
    id: "career-translation",
    label: "製造業経験を半導体へ翻訳したい",
    description: "生産技術・品質・設備・設計など、今の経験に近い入口を整理する",
    note: "職務経歴の見せ方や、メーカー技術職との接続を相談したい人向け",
  },
  {
    id: "global",
    label: "外資系・英語を使う仕事を狙いたい",
    description: "外資系メーカー、グローバル職、英語を使う技術職を比較する",
    note: "FAE・技術営業・海外連携を含む選択肢を確認したい人向け",
  },
  {
    id: "specialist",
    label: "年収・専門性・マネジメントを相談したい",
    description: "専門職、管理職、ハイクラスの求人条件と現在地を確認する",
    note: "経験をどの役職・年収帯で評価されるか相談したい人向け",
  },
];

const lastUpdated = "2026-07-12";

export const affiliateAgents: AffiliateAgent[] = [
  {
    id: "jac-recruitment",
    name: "JACリクルートメント",
    category: "ハイクラス・外資系転職",
    description: "製造業の専門チームを持ち、管理職・専門職・外資系を含む求人を扱う転職エージェントです。",
    recommendedFor: "半導体・製造業で年収アップ、外資系、マネジメント、専門職を狙いたい人",
    focusAreas: ["global", "specialist"],
    suitableRoles: ["設計・研究開発", "製造マネジメント", "業界スペシャリスト"],
    consultationTopics: ["専門性を評価される職種・役職", "外資系・グローバル企業への接続", "年収条件とキャリアの優先順位"],
    pointsToConfirm: "希望する職種・年収帯・勤務地に合う求人の取り扱いがあるか",
    affiliateUrl: undefined,
    officialUrl: "https://www.jac-recruitment.jp/",
    linkType: "official",
    sourceUrl: "https://www.jac-recruitment.jp/market/manufacture/",
    lastUpdated,
  },
  {
    id: "ties",
    name: "タイズ",
    category: "メーカー・製造業転職",
    description: "メーカー、製造業、技術職の転職支援に特化した転職エージェントです。",
    recommendedFor: "関西メーカー、製造業エンジニア、生産技術、品質、設計職で転職を考える人",
    focusAreas: ["career-translation"],
    suitableRoles: ["研究開発・設計", "生産技術", "品質管理・保証", "製造・保全"],
    consultationTopics: ["製造業経験の職務経歴書への落とし込み", "メーカー技術職の求人比較", "現職に近い職種からのキャリア設計"],
    pointsToConfirm: "希望勤務地で、半導体・電子部品・製造装置に近い求人を扱っているか",
    affiliateUrl: undefined,
    officialUrl: "https://www.ee-ties.com/",
    linkType: "official",
    sourceUrl: "https://www.ee-ties.com/",
    lastUpdated,
  },
  {
    id: "give-creation",
    name: "ギブクリエーション",
    category: "製造業・技術職転職",
    description: "メーカー領域に特化し、転職軸やキャリアプランの整理を掲げる転職コンサルティング会社です。",
    recommendedFor: "製造業エンジニアとして、職務経歴の見せ方から相談したい人",
    focusAreas: ["career-translation", "specialist"],
    suitableRoles: ["メーカー技術職", "設計・生産技術", "品質・製造関連職"],
    consultationTopics: ["転職軸と価値観の整理", "メーカー経験の市場での見せ方", "今転職するか、現職で経験を積むか"],
    pointsToConfirm: "希望地域・職種の支援範囲と、担当コンサルタントの専門領域",
    affiliateUrl: undefined,
    officialUrl: "https://givecreation.com/",
    linkType: "official",
    sourceUrl: "https://givecreation.com/",
    lastUpdated,
  },
  {
    id: "robert-walters",
    name: "ロバート・ウォルターズ",
    category: "外資系・バイリンガル転職",
    description: "外資系、英語を使うポジション、バイリンガル人材の転職支援に強いエージェントです。",
    recommendedFor: "英語を活かして外資系半導体、FAE、営業技術、管理職を狙いたい人",
    focusAreas: ["global", "specialist"],
    suitableRoles: ["製品開発", "品質保証", "技術営業", "マネジメント"],
    consultationTopics: ["英語を使うメーカー技術職", "外資系・日系グローバル企業の比較", "英文レジュメと面接準備"],
    pointsToConfirm: "求人で求められる英語水準、勤務地、担当領域が現在の経験と合うか",
    affiliateUrl: undefined,
    officialUrl: "https://www.robertwalters.co.jp/",
    linkType: "official",
    sourceUrl: "https://www.robertwalters.co.jp/expertise/industrial-and-electrical.html",
    lastUpdated,
  },
  {
    id: "enworld",
    name: "エンワールド",
    category: "外資系・グローバル転職",
    description: "外資系・グローバル企業の転職支援に強い転職エージェントです。",
    recommendedFor: "英語、外資系、グローバルメーカー、専門職転職を視野に入れたい人",
    focusAreas: ["global", "specialist"],
    suitableRoles: ["半導体・電気・電子", "自動車・産業機械", "営業・専門職"],
    consultationTopics: ["外資系・日系グローバル企業への転職", "英語と専門性を使う職種", "入社後の活躍を含む長期的なキャリア"],
    pointsToConfirm: "希望職種の求人状況と、選考で必要になる英語・専門性の水準",
    affiliateUrl: undefined,
    officialUrl: "https://www.enworld.com/",
    linkType: "official",
    sourceUrl: "https://www.enworld.com/",
    lastUpdated,
  },
];

export function getAffiliateAgent(agentId: string) {
  return affiliateAgents.find((agent) => agent.id === agentId);
}

export function getPrimaryAgent() {
  return affiliateAgents.find((agent) => agent.linkType === "affiliate") ?? affiliateAgents[0];
}

export function getAgentUrl(agent: AffiliateAgent) {
  return agent.linkType === "affiliate" && agent.affiliateUrl ? agent.affiliateUrl : agent.officialUrl;
}

export function getAgentCtaLabel(agent: AffiliateAgent) {
  if (!getAgentUrl(agent)) {
    return "準備中";
  }

  return agent.linkType === "affiliate" ? "無料相談してみる" : "公式情報を確認する";
}

export function getAgentRel(agent: AffiliateAgent) {
  return agent.linkType === "affiliate" ? "sponsored noopener noreferrer" : "noopener noreferrer";
}
