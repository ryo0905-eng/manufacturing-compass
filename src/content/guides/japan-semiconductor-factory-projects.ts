import type { GuideArticle } from "@/content/guides/types";

export const japanSemiconductorFactoryProjectsGuide: GuideArticle = {
  "slug": "japan-semiconductor-factory-projects",
  "title": "日本の半導体工場の新設・増設一覧｜主要5案件の場所と稼働時期",
  "description": "日本の半導体工場の新設・増設について、熊本・千歳・北上・広島の主要5案件を整理。量産開始、試作ライン稼働、建設中を分け、企業公式情報から場所と時期を確認します。",
  "targetQuery": "日本 半導体 工場新設 一覧",
  "searchIntent": "国内の半導体工場の新設・増設について場所と稼働時期を比較したい",
  "status": "published",
  "category": "industry",
  "presentation": "structured",
  "author": "RYO",
  "reviewedBy": "RYO",
  "experienceBasis": [],
  "showIntroSummary": false,
  "showExperienceBasis": false,
  "showCareerCtas": false,
  "publishedAt": "2026-09-20",
  "updatedAt": "2026-09-20",
  "sources": [
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
  ],
  "readTime": "4分",
  "intro": {
    "problem": "日本の半導体工場の新設・増設を調べるときは、場所と一緒に「どの段階まで進んでいるか」を見ると整理しやすくなります。建物の完成、試作ラインの稼働、量産開始は、それぞれ違う節目です。",
    "conclusion": "主要5案件の場所と進捗を公式情報から比較します。",
    "learnings": "建設・試作・量産と、それぞれの日付の意味を確認できます。"
  },
  "sections": [
    {
      "id": "scope",
      "heading": "掲載範囲と確認時点",
      "paragraphs": [
        "日本の半導体工場の新設・増設を調べるときは、場所と一緒に「どの段階まで進んでいるか」を見ると整理しやすくなります。建物の完成、試作ラインの稼働、量産開始は、それぞれ違う節目です。",
        "この記事では、企業の公式情報をもとに、最近稼働した工場と建設が進む主要5案件をまとめます。全国すべての計画を網羅した一覧ではありません。2026年9月20日に確認できた資料を使い、将来の日程は計画として記載しています。\n"
      ]
    },
    {
      "id": "projects",
      "heading": "新設・増設の主要5案件",
      "paragraphs": [
        "同じ企業の同じ地域でも、既存工場と新しい製造棟では段階が違います。JASMの第1工場と第2工場は、分けて読む必要があります。"
      ],
      "blocks": [
        {
          "type": "mapping",
          "leftLabel": "企業・案件／場所",
          "rightLabel": "確認できる段階・時期",
          "rows": [
            {
              "left": "JASM 第1工場（熊本県菊陽町）",
              "right": "量産開始。2024年末に量産を開始［1］"
            },
            {
              "left": "JASM 第2工場（熊本県菊陽町）",
              "right": "建設中。2025年に建設開始。量産開始時期は今回の参照資料では確認できず［1］"
            },
            {
              "left": "Rapidus IIM（北海道千歳市）",
              "right": "パイロットライン稼働。2025年4月に試作ライン稼働。量産開始は2027年の予定［2］"
            },
            {
              "left": "キオクシア 北上工場第2製造棟（K2）（岩手県北上市）",
              "right": "稼働開始を発表済み。2025年9月に稼働開始を発表。生産能力は段階的に拡大する方針［3・4］"
            },
            {
              "left": "マイクロン 広島工場の新クリーンルーム（広島県東広島市）",
              "right": "着工を発表済み。2026年7月に着工発表。装置搬入開始は2028年後半の予定で、量産開始日を示すものではない［5］"
            }
          ]
        }
      ]
    },
    {
      "id": "milestones",
      "heading": "稼働時期を比較するときに見ること",
      "paragraphs": [
        "まず、発表された日付が何を指しているかを確認しましょう。「着工」は工事の開始、「装置搬入」は製造装置を建物へ入れる段階です。その後の立ち上げや量産開始までを、一つの日付で表すことはできません。",
        "Rapidusは試作ラインの稼働と量産予定を別々に示しています。試作ラインが動いていることから、量産も始まっていると読み替えないようにします。［2］",
        "また、キオクシアのK2は稼働開始後も、市場動向に応じて生産能力を段階的に増やす方針です。「稼働開始」という発表だけでは、計画された能力のすべてが立ち上がったとは判断できません。［4］"
      ],
      "blocks": [
        {
          "type": "links",
          "items": [
            {
              "label": "半導体の製造工程",
              "href": "/guides/semiconductor-manufacturing-process",
              "description": "工場内の工程と役割を知る"
            }
          ]
        }
      ]
    },
    {
      "id": "locations",
      "heading": "工場の場所から企業研究につなげる",
      "paragraphs": [
        "気になる地域が見つかったら、日本の半導体企業・工場マップで、掲載されている周辺拠点や企業情報も確認できます。マップは工場だけでなく、研究開発や設計などの拠点を探すためのページです。この記事の5案件すべてがマップに登録されているわけではありません。",
        "勤務地として検討する場合は、企業の採用ページで、雇用する法人、募集職種、配属予定地を確認しましょう。工場の建設予定と、現在応募できる求人は別の情報です。"
      ],
      "blocks": [
        {
          "type": "links",
          "items": [
            {
              "label": "日本の半導体企業・工場マップ",
              "href": "/semiconductor-map",
              "description": "掲載されている周辺拠点や企業情報を確認する"
            }
          ]
        }
      ]
    },
    {
      "id": "updates",
      "heading": "出典と更新方針",
      "paragraphs": [
        "以下の企業公式資料を2026年9月20日に確認しました。予定の変更や稼働発表があった際に更新し、通常は月に一度、掲載案件の進捗を確認します。"
      ],
      "blocks": []
    }
  ],
  "relatedGuideSlugs": [
    "semiconductor-manufacturing-process",
    "semiconductor-foundry",
    "memory-manufacturer-ranking"
  ],
  "relatedCompanyIds": [
    "tsmc",
    "kioxia",
    "micron"
  ]
};
