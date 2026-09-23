import type { GuideArticle } from './types';
import { japanCompanies } from '@/data/ranking-japan';
import { rankingTimeMachineCompanies } from '@/data/ranking-time-machine';

export const japanSemiconductorMarketCapHistoryGuide: GuideArticle = {
  slug: 'japan-semiconductor-market-cap-history',
  title: '日本の半導体関連企業の時価総額ランキング推移｜主要10社・2010〜2025年',
  description: '東京エレクトロン、アドバンテスト、信越化学など、日本の半導体関連10社の2010〜2025年末の時価総額を比較。順位変化、年別表、メーカー・装置・材料の違いを確認し、バーレースチャートで操作できます。',
  targetQuery: '日本 半導体企業 時価総額 ランキング 推移',
  searchIntent: '日本の半導体関連企業の市場評価と順位が、長期的にどう変化したか知りたい',
  status: 'published', category: 'industry', presentation: 'structured', author: 'Manufacturing Compass編集部',
  showIntroSummary: false, showExperienceBasis: false, showCareerCtas: false, experienceBasis: [],
  publishedAt: '2026-09-23', updatedAt: '2026-09-23', readTime: '7分',
  sources: [
    ...[rankingTimeMachineCompanies.find(c => c.id === 'tokyo-electron')!, ...japanCompanies].map(c => ({ title: `${c.name} 年末時価総額履歴`, url: c.sourceUrl, publisher: 'CompaniesMarketCap', accessedAt: '2026-09-23' })),
    ...japanCompanies.map(c => ({ title: `${c.name} 公式事業情報`, url: c.businessSourceUrl, publisher: c.name, accessedAt: '2026-09-23' })),
    { title: '製品・サービス', url: 'https://www.tel.co.jp/product/', publisher: '東京エレクトロン', accessedAt: '2026-09-23' },
    { title: 'SCREENグループ会社：日本', url: 'https://www.screen.co.jp/about/japan', publisher: 'SCREENホールディングス', accessedAt: '2026-09-23' },
  ],
  intro: { problem: '世界の時価総額ランキングだけでは、日本の企業同士の変化を追いにくいことがあります。', conclusion: 'メーカー・装置・材料の10社に対象を固定し、2010〜2025年の年末値を比較します。', learnings: '過去と現在の順位、年末の評価額、比較できることとできないことが分かります。' },
  sections: [
    { id: 'scope', heading: '日本の半導体関連10社を、同じ期間で比較する', paragraphs: [
      'ここでのランキングは、2010〜2025年の年末履歴を比較できる10社を選んだものです。各年の日本TOP10や現在の上位10社ではなく、国内企業全体を網羅していません。',
      '半導体メーカーはルネサスとローム。装置・検査は東京エレクトロン、アドバンテスト、ディスコ、SCREENホールディングス、レーザーテック。材料は信越化学、SUMCO、東京応化工業を対象とします。',
      'キオクシアなど上場期間が短い企業や非上場企業は初版に含めません。過去の全企業を復元したランキングではなく、選定した企業の長期比較として読んでください。',
    ] },
    { id: 'history', heading: '順位と時価総額の変化を見る', paragraphs: [], blocks: [{ type: 'ranking-history', kind: 'japan' }] },
    { id: 'roles', heading: '同じ半導体関連企業でも、産業の中での役割が違う', paragraphs: [
      '半導体メーカーはチップや半導体ソリューションを提供します。ルネサスは組み込み半導体、ロームは半導体製品を扱います。装置メーカーは半導体を作る・調べる工程を支えます。例えばアドバンテストは半導体テスト、ディスコは切断・研削・研磨、レーザーテックは検査装置に関わります。',
      '材料企業は、チップの基板となるシリコンウェーハやパターン形成に使う材料などを供給します。信越化学、SUMCO、東京応化工業も、それぞれの製品・事業範囲が異なります。分類は企業全体を一つの製品に限定するものではありません。',
      'SCREENの数値はSCREENホールディングス全体です。半導体製造装置を担うグループ会社SCREEN Semiconductor Solutions単体の時価総額ではありません。信越化学も半導体材料以外の事業を含むため、半導体部門の価値として比較しないでください。',
    ], blocks: [{ type: 'links', items: [
      { label: '半導体業界地図', href: '/industry-map', description: 'メーカー・装置・材料のつながりから企業を調べる' },
      { label: '日本の半導体工場・拠点マップ', href: '/semiconductor-map', description: '企業の拠点と事業の関係を確認する' },
    ] }] },
    { id: 'method', heading: '出典・単位・比較の限界', paragraphs: [
      'CompaniesMarketCapの各社「End of year Market Cap」を2026年9月23日に確認しました。対象は2010〜2025年末、単位は十億米ドルです。2026年途中の値は使用していません。出典の丸め値を使い、兆・百万ドル表示は十億ドルへ単位変換しています。独自の為替換算、欠損補間、物価調整は行っていません。',
      '同じ丸め値は同順位、その次の順位は人数分進めます。全市場で同一時刻に取得した値とは限りません。出典の為替・株式数などの詳細な調整方法を独立に再現した数値でもありません。',
      '名称・ロゴは現在の企業を識別するもので、各年当時の社名や組織を再現していません。買収、事業構成、発行株式数、為替の変化も含むため、時価総額の増減を半導体事業だけの成長や投資収益とは解釈できません。順位は技術力・働きやすさ・就職先としての優劣を決めるものでもありません。',
    ] },
    { id: 'related', heading: '現在のランキングや世界企業との比較も見る', paragraphs: ['現在の順位を知りたい場合は基準日時点のランキングへ、海外企業との違いを知りたい場合は比較記事へ進めます。'], blocks: [{ type: 'links', items: [
      { label: '半導体企業の時価総額ランキング', href: '/guides/semiconductor-market-cap-ranking', description: '基準日時点の世界TOP30・日本TOP10。この記事の固定10社とは対象が異なります' },
      { label: 'NVIDIAとIntelの時価総額推移', href: '/guides/nvidia-intel-market-cap-history', description: '2社の年末評価額の変化を比較する' },
      { label: '製造装置メーカーの売上高ランキング', href: '/guides/semiconductor-equipment-sales-ranking', description: '企業全体の市場評価とは異なる、装置事業の売上規模を見る' },
    ] }] },
  ],
  relatedGuideSlugs: ['semiconductor-market-cap-ranking', 'nvidia-intel-market-cap-history', 'semiconductor-equipment-sales-ranking'],
  relatedCompanyIds: ['tokyo-electron', 'advantest', 'renesas', 'rohm'],
};
