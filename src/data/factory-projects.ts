import type { Source } from "@/types/content";
import type { OperationalStatus } from "@/types/company-location";

export type FactoryProjectMilestone = {
  dateLabel: string;
  label: string;
  outcome: "actual" | "planned";
  sourceNumbers: number[];
};

export type FactoryProject = {
  id: string; name: string; location: string; stage: string;
  actual: string; planned: string; note: string; checkedAt: string;
  sourceNumbers: number[]; summary: string; companySlug?: string;
  locationId: string; facilityId?: string; operationalStatus: OperationalStatus;
  milestones: FactoryProjectMilestone[];
};
export const factoryProjectMeta = {
  sourceSlug: "japan-semiconductor-factory-projects",
  updatedAt: "2026-10-31",
  snapshotDate: "2026-10-31",
} as const;

export const factoryProjectSources: Source[] = [
  {
    "title": "［1］TSMC 2025 Annual Report — 2025年版、株主向け説明・事業概要。JASM第1工場の量産開始、第2工場の建設状況。",
    "url": "https://investor.tsmc.com/sites/ir/annual-report/2025/2025%20Annual%20Report.E.pdf",
    "publisher": "TSMC",
    "accessedAt": "2026-10-01"
  },
  {
    "title": "［2］Rapidus：IIM — ページ更新日記載なし。所在地、試作ラインの稼働時期、量産予定。",
    "url": "https://www.rapidus.inc/iim/",
    "publisher": "Rapidus",
    "accessedAt": "2026-10-01"
  },
  {
    "title": "［3］キオクシア岩手：第2製造棟の稼働開始について — 2025年9月30日発表。",
    "url": "https://www.kioxia-iwate.co.jp/news/20250930-1.html",
    "publisher": "キオクシア岩手",
    "accessedAt": "2026-10-01"
  },
  {
    "title": "［4］Kioxia・Sandisk：北上工場Fab2の稼働開始 — 本文日付2025年9月29日。段階的な能力拡大の方針。",
    "url": "https://apac.kioxia.com/en-apac/about/news/2025/20250930-1.html",
    "publisher": "Kioxia・Sandisk",
    "accessedAt": "2026-10-01"
  },
  {
    "title": "［5］マイクロン：広島工場のクリーンルーム着工 — 2026年7月4日発表。着工、所在地、装置搬入の予定。",
    "url": "https://jp.micron.com/about/press/news/micron-breaks-ground-on-hiroshima-cleanroom-to-support-advanced-memory-for-ai",
    "publisher": "Micron Technology",
    "accessedAt": "2026-10-01"
  },
  {
    "title": "［6］TSMC 2026年第1四半期決算説明会 — 2026年4月16日。JASM第2工場の量産開始予定。",
    "url": "https://investor.tsmc.com/japanese/encrypt/files/encrypt_file/reports/2026-04/3cef85204275f94fd111485cfdf4adb3c0263c45/TSMC%201Q26%20Transcript.pdf",
    "publisher": "TSMC",
    "accessedAt": "2026-10-01"
  },
  { "title": "［7］Rapidus：2nm GAAトランジスタの動作確認 — 2025年7月18日発表。", "url": "https://www.rapidus.inc/news_topics/news-info/rapidus-achieves-significant-milestone-at-its-state-of-the-art-foundry-with-prototyping-of-leading-edge-2nm-gaa-transistors/", "publisher": "Rapidus", "accessedAt": "2026-10-31" },
  { "title": "［8］経済産業省：Rapidusの事業の進捗状況 — 先行評価用PDKのリリース。", "url": "https://www.meti.go.jp/policy/mono_info_service/joho/laws/josokuho/josokuho_futaiketsugi.pdf", "publisher": "経済産業省", "accessedAt": "2026-10-31" },
  { "title": "［9］Rapidus：解析センターとRCSの開所 — 2026年4月11日発表。", "url": "https://www.rapidus.inc/news_topics/news-info/rapidus-opens-analysis-center-and-rapidus-chiplet-solutions/", "publisher": "Rapidus", "accessedAt": "2026-10-31" },
  { "title": "［10］経済産業省：次世代半導体に関する審査基準 — 量産開始のマイルストーン。", "url": "https://www.meti.go.jp/shingikai/sankoshin/shomu_ryutsu/next_generation_semiconductor/pdf/20251118_1.pdf", "publisher": "経済産業省", "accessedAt": "2026-10-31" },
  { "title": "［11］経済産業省：2026年2月10日大臣記者会見 — JASM第2工場の計画変更。", "url": "https://www.meti.go.jp/english/speeches/press_conferences/2026/0210001.html", "publisher": "経済産業省", "accessedAt": "2026-10-31" }
];

export const factoryProjects: FactoryProject[] = [
  {
    "id": "jasm-1",
    locationId: "tsmc-jasm-kumamoto", facilityId: "tsmc-jasm-kumamoto-fab23", operationalStatus: "operating",
    milestones: [{ dateLabel: "2024年末", label: "量産開始", outcome: "actual", sourceNumbers: [1] }],
    "name": "JASM 第1工場",
    "location": "熊本県菊陽町",
    "stage": "量産開始",
    "actual": "2024年末に量産開始",
    "planned": "量産開始済み。今後の増設予定はこの比較の対象外",
    "note": "第2工場の建設計画とは分けて扱います。",
    "checkedAt": "2026-10-01",
    "sourceNumbers": [
      1
    ],
    "summary": "量産開始。2024年末に量産を開始［1］",
    "companySlug": "tsmc"
  },
  {
    "id": "jasm-2",
    locationId: "tsmc-jasm-kumamoto", facilityId: "tsmc-jasm-kumamoto-fab2", operationalStatus: "under-construction",
    milestones: [
      { dateLabel: "2025年", label: "建設開始", outcome: "actual", sourceNumbers: [1] },
      { dateLabel: "2026年2月", label: "3nmプロセスへの計画高度化を公表", outcome: "actual", sourceNumbers: [11] },
      { dateLabel: "2028年", label: "量産開始予定（2026年4月の説明時点）", outcome: "planned", sourceNumbers: [6] },
    ],
    "name": "JASM 第2工場",
    "location": "熊本県菊陽町",
    "stage": "建設中",
    "actual": "2025年に建設開始",
    "planned": "2028年に量産開始予定（TSMCの2026年4月説明時点）。3nmプロセスへの高度化が公表されている。",
    "note": "第1工場の量産開始時期を流用しません。プロセスの高度化により、量産開始時期などの予定は変更される可能性があります。",
    "checkedAt": "2026-10-31",
    "sourceNumbers": [
      1,
      6,
      11
    ],
    "summary": "建設中。2025年に建設開始。3nmプロセスへの計画高度化を公表。量産開始は2028年の予定［1・6・11］",
    "companySlug": "tsmc"
  },
  {
    "id": "rapidus-iim",
    locationId: "rapidus-chitose-iim", operationalStatus: "pilot",
    milestones: [
      { dateLabel: "2025年4月", label: "試作ライン稼働", outcome: "actual", sourceNumbers: [2] },
      { dateLabel: "2025年7月", label: "2nm GAAトランジスタの動作確認に成功", outcome: "actual", sourceNumbers: [7] },
      { dateLabel: "2025年12月", label: "先行評価用PDKをリリース", outcome: "actual", sourceNumbers: [8] },
      { dateLabel: "2026年4月", label: "解析センターと後工程拠点RCS（Rapidus Chiplet Solutions）を千歳に開設", outcome: "actual", sourceNumbers: [9] },
      { dateLabel: "2027年度後半", label: "量産開始予定", outcome: "planned", sourceNumbers: [10] },
    ],
    "name": "Rapidus IIM",
    "location": "北海道千歳市",
    "stage": "パイロットライン稼働",
    "actual": "2025年4月に試作ライン稼働",
    "planned": "2027年度後半に量産開始予定",
    "note": "試作ラインの稼働と量産開始を区別します。",
    "checkedAt": "2026-10-31",
    "sourceNumbers": [2, 7, 8, 9, 10],
    "summary": "パイロットライン稼働。2025年に2nm GAAトランジスタの動作確認と先行評価用PDKのリリース、2026年に解析センターと後工程拠点RCSの開所を発表。量産開始は2027年度後半の予定［2・7・8・9・10］"
  },
  {
    "id": "kioxia-k2",
    locationId: "kioxia-kitakami", facilityId: "kioxia-kitakami-k2", operationalStatus: "operating",
    milestones: [{ dateLabel: "2025年9月", label: "第2製造棟の稼働開始を発表。能力は段階的に拡大", outcome: "actual", sourceNumbers: [3, 4] }],
    "name": "キオクシア 北上工場第2製造棟（K2）",
    "location": "岩手県北上市",
    "stage": "稼働開始を発表済み",
    "actual": "2025年9月に稼働開始を発表",
    "planned": "生産能力は市場動向に応じて段階的に拡大する方針",
    "note": "稼働開始は計画能力のすべてが立ち上がったことを意味しません。",
    "checkedAt": "2026-10-01",
    "sourceNumbers": [
      3,
      4
    ],
    "summary": "稼働開始を発表済み。2025年9月に稼働開始を発表。生産能力は段階的に拡大する方針［3・4］",
    "companySlug": "kioxia"
  },
  {
    "id": "micron-hiroshima-cleanroom",
    locationId: "micron-hiroshima", facilityId: "micron-hiroshima-new-cleanroom", operationalStatus: "under-construction",
    milestones: [
      { dateLabel: "2026年7月", label: "着工を発表", outcome: "actual", sourceNumbers: [5] },
      { dateLabel: "2028年後半", label: "装置搬入開始予定（量産開始日ではありません）", outcome: "planned", sourceNumbers: [5] },
    ],
    "name": "マイクロン 広島工場の新クリーンルーム",
    "location": "広島県東広島市",
    "stage": "着工を発表済み",
    "actual": "2026年7月に着工発表",
    "planned": "2028年後半に装置搬入開始予定。量産開始日ではありません",
    "note": "装置搬入の予定時期であり、量産開始日ではありません。予定は変更される可能性があります。",
    "checkedAt": "2026-10-01",
    "sourceNumbers": [
      5
    ],
    "summary": "着工を発表済み。2026年7月に着工発表。装置搬入開始は2028年後半の予定で、量産開始日を示すものではない［5］",
    "companySlug": "micron"
  }
];
