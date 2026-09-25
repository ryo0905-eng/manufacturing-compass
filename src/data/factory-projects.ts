import type { Source } from "@/types/content";

export type FactoryProject = {
  id: string; name: string; location: string; stage: string;
  actual: string; planned: string; note: string; checkedAt: string;
  sourceNumbers: number[]; summary: string; companySlug?: string;
};
export const factoryProjectMeta = {
  sourceSlug: "japan-semiconductor-factory-projects",
  updatedAt: "2026-09-26",
  snapshotDate: "2026-09-20",
} as const;

export const factoryProjectSources: Source[] = [
  {
    "title": "［1］TSMC 2025 Annual Report — 2025年版、株主向け説明・事業概要。JASM第1工場の量産開始、第2工場の建設状況。",
    "url": "https://investor.tsmc.com/sites/ir/annual-report/2025/2025%20Annual%20Report.E.pdf",
    "publisher": "TSMC",
    "accessedAt": "2026-09-20"
  },
  {
    "title": "［2］Rapidus：IIM — ページ更新日記載なし。所在地、試作ラインの稼働時期、量産予定。",
    "url": "https://www.rapidus.inc/iim/",
    "publisher": "Rapidus",
    "accessedAt": "2026-09-20"
  },
  {
    "title": "［3］キオクシア岩手：第2製造棟の稼働開始について — 2025年9月30日発表。",
    "url": "https://www.kioxia-iwate.co.jp/news/20250930-1.html",
    "publisher": "キオクシア岩手",
    "accessedAt": "2026-09-20"
  },
  {
    "title": "［4］Kioxia・Sandisk：北上工場Fab2の稼働開始 — 本文日付2025年9月29日。段階的な能力拡大の方針。",
    "url": "https://apac.kioxia.com/en-apac/about/news/2025/20250930-1.html",
    "publisher": "Kioxia・Sandisk",
    "accessedAt": "2026-09-20"
  },
  {
    "title": "［5］マイクロン：広島工場のクリーンルーム着工 — 2026年7月4日発表。着工、所在地、装置搬入の予定。",
    "url": "https://jp.micron.com/about/press/news/micron-breaks-ground-on-hiroshima-cleanroom-to-support-advanced-memory-for-ai",
    "publisher": "Micron Technology",
    "accessedAt": "2026-09-20"
  }
];

export const factoryProjects: FactoryProject[] = [
  {
    "id": "jasm-1",
    "name": "JASM 第1工場",
    "location": "熊本県菊陽町",
    "stage": "量産開始",
    "actual": "2024年末に量産開始",
    "planned": "量産開始済み。今後の増設予定はこの比較の対象外",
    "note": "第2工場の建設計画とは分けて扱います。",
    "checkedAt": "2026-09-20",
    "sourceNumbers": [
      1
    ],
    "summary": "量産開始。2024年末に量産を開始［1］",
    "companySlug": "tsmc"
  },
  {
    "id": "jasm-2",
    "name": "JASM 第2工場",
    "location": "熊本県菊陽町",
    "stage": "建設中",
    "actual": "2025年に建設開始",
    "planned": "量産開始時期は今回の参照資料では未確認",
    "note": "第1工場の量産開始時期を流用しません。",
    "checkedAt": "2026-09-20",
    "sourceNumbers": [
      1
    ],
    "summary": "建設中。2025年に建設開始。量産開始時期は今回の参照資料では確認できず［1］",
    "companySlug": "tsmc"
  },
  {
    "id": "rapidus-iim",
    "name": "Rapidus IIM",
    "location": "北海道千歳市",
    "stage": "パイロットライン稼働",
    "actual": "2025年4月に試作ライン稼働",
    "planned": "2027年に量産開始予定",
    "note": "試作ラインの稼働と量産開始を区別します。",
    "checkedAt": "2026-09-20",
    "sourceNumbers": [
      2
    ],
    "summary": "パイロットライン稼働。2025年4月に試作ライン稼働。量産開始は2027年の予定［2］"
  },
  {
    "id": "kioxia-k2",
    "name": "キオクシア 北上工場第2製造棟（K2）",
    "location": "岩手県北上市",
    "stage": "稼働開始を発表済み",
    "actual": "2025年9月に稼働開始を発表",
    "planned": "生産能力は市場動向に応じて段階的に拡大する方針",
    "note": "稼働開始は計画能力のすべてが立ち上がったことを意味しません。",
    "checkedAt": "2026-09-20",
    "sourceNumbers": [
      3,
      4
    ],
    "summary": "稼働開始を発表済み。2025年9月に稼働開始を発表。生産能力は段階的に拡大する方針［3・4］",
    "companySlug": "kioxia"
  },
  {
    "id": "micron-hiroshima-cleanroom",
    "name": "マイクロン 広島工場の新クリーンルーム",
    "location": "広島県東広島市",
    "stage": "着工を発表済み",
    "actual": "2026年7月に着工発表",
    "planned": "2028年後半に装置搬入開始予定。量産開始日ではありません",
    "note": "再確認待ち。2026-09-20時点の掲載情報です。日程は公式資料で再確認してください。",
    "checkedAt": "2026-09-20",
    "sourceNumbers": [
      5
    ],
    "summary": "着工を発表済み。2026年7月に着工発表。装置搬入開始は2028年後半の予定で、量産開始日を示すものではない［5］",
    "companySlug": "micron"
  }
];
