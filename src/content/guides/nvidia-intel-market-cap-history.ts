import type { GuideArticle } from './types';
import { rankingTimeMachineCompanies } from '@/data/ranking-time-machine';

export const nvidiaIntelMarketCapHistoryGuide: GuideArticle = {
  slug: 'nvidia-intel-market-cap-history', title: 'NVIDIAとIntelの時価総額推移を比較｜2010〜2025年',
  description: 'NVIDIAとIntelの2010〜2025年末の時価総額を、折れ線図と16年分の表で比較。年末値の逆転と評価額の差を確認し、GPU・CPUや事業モデルの違い、比較の限界を解説します。',
  targetQuery: 'NVIDIA Intel 時価総額 推移 比較', searchIntent: 'NVIDIAとIntelの市場評価の大小関係がいつ、どの程度変わったか知りたい',
  status: 'published', category: 'industry', presentation: 'structured', author: 'Manufacturing Compass編集部',
  showIntroSummary: false, showExperienceBasis: false, showCareerCtas: false, experienceBasis: [],
  publishedAt: '2026-09-23', updatedAt: '2026-09-23', readTime: '5分',
  sources: [
    ...rankingTimeMachineCompanies.filter(c => ['nvidia', 'intel'].includes(c.id)).map(c => ({ title: `${c.name} 年末時価総額履歴`, url: c.sourceUrl, publisher: 'CompaniesMarketCap', accessedAt: '2026-09-23' })),
    { title: 'About NVIDIA', url: 'https://www.nvidia.com/en-us/about-nvidia/', publisher: 'NVIDIA', accessedAt: '2026-09-23' },
    { title: 'Company Overview', url: 'https://www.intel.com/content/www/us/en/company-overview/company-overview.html', publisher: 'Intel', accessedAt: '2026-09-23' },
  ],
  intro: { problem: 'NVIDIAとIntelの名前は知っていても、市場評価の差がどう変わったかは一時点の順位だけでは分かりません。', conclusion: '16年分の年末値で、評価額と大小関係の変化を比較します。', learnings: '年末値の逆転、企業の役割の違い、数値だけでは分からないことを整理できます。' },
  sections: [
    { id: 'history', heading: '2010〜2025年末のNVIDIAとIntelを比較', paragraphs: ['比較するのは企業全体の時価総額です。GPU・CPUの売上や製品シェアではありません。初めの年から同じ線形軸で表示しているため、規模が小さい年の違いは表でも確認してください。'], blocks: [{ type: 'ranking-history', kind: 'nvidia-intel' }] },
    { id: 'business', heading: 'GPU・CPUと事業モデルの違い', paragraphs: [
      'NVIDIAはGPUを出発点に、並列計算やAI向けのハードウェア・ソフトウェア基盤を提供しています。GPUは多くの処理を並列に進める用途で使われます。企業全体の時価総額には、単体チップ以外の事業への評価も含まれます。',
      'IntelはCPUなどの製品に加え、半導体の製造技術・生産基盤を持ち、ファウンドリ事業も展開しています。CPUは汎用的な計算や制御を担いますが、両社の事業を「GPUだけ」「CPUだけ」と分けることはできません。',
      '設計・ソフトウェア基盤と製造設備では、投資や事業の構成が異なります。市場評価の変化を理解するには決算や事業資料も必要です。この図だけから、特定の技術や経営施策が時価総額の変化を引き起こしたとは断定できません。',
    ] },
    { id: 'method', heading: '年末の逆転と、実際に逆転した日は異なる', paragraphs: [
      '出典はCompaniesMarketCapの「End of year Market Cap」、確認日は2026年9月23日です。2010〜2025年の丸め済み年末値を十億米ドルで表示しています。兆ドルからの単位変換以外に独自の為替換算、欠損補間、物価調整は行っていません。2026年途中の値は含みません。',
      'ここでいう逆転年は、前年末とその年末の大小関係を比較した結果です。年内に最初に逆転した日や、その後の短期的な再逆転までは分かりません。折れ線の間は観測された日次値ではありません。',
      '時価総額は株価だけでなく発行株式数にも左右されます。企業全体への期待や事業構成も含むため、増減率は株式を保有した場合の投資収益ではありません。技術力、就職先としての適性、働きやすさの比較にも置き換えられません。',
    ] },
    { id: 'related', heading: '日本企業や業界全体へ比較を広げる', paragraphs: [], blocks: [{ type: 'links', items: [
      { label: '日本の半導体関連10社の時価総額推移', href: '/guides/japan-semiconductor-market-cap-history', description: 'メーカー・装置・材料を含む日本企業の変化を見る' },
      { label: '半導体企業の時価総額ランキング', href: '/guides/semiconductor-market-cap-ranking', description: '基準日時点の順位と事業分類を確認する' },
      { label: '半導体業界地図', href: '/industry-map', description: '設計・製造・装置・材料のつながりを調べる' },
    ] }] },
  ],
  relatedGuideSlugs: ['japan-semiconductor-market-cap-history', 'semiconductor-market-cap-ranking'], relatedCompanyIds: [],
};
