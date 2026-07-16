import type { GuideArticle } from "@/content/guides/types";

export const semiconductorExhaustGasAbatementManufacturersGuide: GuideArticle = {
  slug: "semiconductor-exhaust-gas-abatement-manufacturers",
  title: "半導体用排ガス除害装置メーカーとは？Edwards・荏原・カンケンテクノ・日本酸素を図解",
  description:
    "半導体の排ガス除害装置について、真空ポンプ下流の流れ、燃焼・プラズマ・湿式・乾式・触媒の違い、副生成物・安全・環境管理、主要メーカーと比較軸を初心者向けに図解します。",
  targetQuery: "半導体 排ガス 除害装置 メーカー",
  searchIntent:
    "半導体の排ガス除害装置とは何か、燃焼・プラズマ・湿式・乾式・触媒方式の違い、真空ポンプとの接続、副生成物・安全・環境・保守、主要メーカーと比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Edwards Vacuum、荏原製作所、カンケンテクノ、日本酸素グループの公式製品・技術情報をもとに、排気を受け取る、反応条件を整える、分解・酸化・吸収・吸着する、粉・液を分離する、排出・監視する流れへ整理しました。ガス名だけで方式を決めず、濃度・流量・混合・副生成物・真空ポンプ・配管・ユーティリティ・排水・安全・保守を一体で扱います。",
  showCareerCtas: false,
  experienceBasis: [
    "半導体ガスと真空工程の記事を公開したうえで、使用後のガスを安全・環境要求へ合わせるサブファブ装置を独立させる必要があると判断",
    "Edwardsで燃焼・プラズマ除害、荏原で燃焼・乾式・触媒・湿式とポイントオブユースの製品領域を確認",
    "カンケンテクノで半導体排ガス処理と電気・ハイブリッド・湿式など、日本酸素で燃焼式とガス供給を含む関連設備を確認",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Environmental Solutions - Abatement",
      url: "https://www.edwardsvacuum.com/en-us/semiconductor/our-products/abatement",
      publisher: "Edwards Vacuum",
      accessedAt: "2026-07-16",
    },
    {
      title: "Atlas Abatement",
      url: "https://www.edwardsvacuum.com/en-us/semiconductor/our-products/abatement/atlas",
      publisher: "Edwards Vacuum",
      accessedAt: "2026-07-16",
    },
    {
      title: "Proteus Plasma Abatement",
      url: "https://www.edwardsvacuum.com/en-uk/semiconductor/our-products/abatement/proteus",
      publisher: "Edwards Vacuum",
      accessedAt: "2026-07-16",
    },
    {
      title: "Exhaust Abatement Systems",
      url: "https://www.ebara.com/global-en/precision/gas-abatement/",
      publisher: "EBARA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "半導体 排ガス処理装置",
      url: "https://www.kanken-techno.co.jp/",
      publisher: "カンケンテクノ株式会社",
      accessedAt: "2026-07-16",
    },
    {
      title: "燃焼式排ガス処理装置",
      url: "https://www.tn-sanso.co.jp/jp/business/product/list/detail/?pdid=68",
      publisher: "日本酸素グループ",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約17分",
  intro: {
    problem:
      "除害装置を調べると、燃焼、プラズマ、湿式、乾式、触媒、スクラバが並び、どのガスを何へ変える装置なのか、真空ポンプとの違いが分かりにくくありませんか。",
    conclusion:
      "排ガス除害装置は、プロセス装置と真空ポンプから出る有害・可燃・温室効果・腐食性ガスを、分解・酸化・吸収・吸着などで処理し、安全に排出できる状態へ近づける装置です。比較では、対象排気、処理方式、分解・除去性能、副生成物、ポンプ・配管、ユーティリティ、安全、保守・環境データをそろえます。",
    learnings:
      "除害の役割、ポイントオブユース、燃焼・プラズマ・湿式・乾式・触媒、副生成物、DRE、真空ポンプ連携、主要メーカー、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "私は除害装置を、『有害ガスを消す箱』ではなく、ガスを別の物質へ変え、その副生成物まで安全に管理する反応・分離システムとして見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜プロセス排気を処理し、安全な排出へつなぐ",
      description: "代表的なポイントオブユース除害を単純化しています。処理順序と方式はガス・装置で異なります。",
      stages: [
        { label: "01 / RECEIVE", title: "ポンプ排気を受け取る", body: "ガス、パージ、反応副生成物を配管・温度・希釈条件を保って導入する" },
        { label: "02 / CONDITION", title: "反応条件を整える", body: "流量、濃度、温度、酸化剤、水、燃料、電力などを処理方式へ合わせる" },
        { label: "03 / REACT", title: "分解・酸化する", body: "燃焼、プラズマ、加熱、触媒などで安定・低毒性の物質へ変換する" },
        { label: "04 / CAPTURE", title: "吸収・吸着する", body: "湿式洗浄、乾式吸着、トラップなどで水溶性成分、酸性成分、粒子を捕集する" },
        { label: "05 / SEPARATE", title: "粉・液を分離する", body: "反応で生じた固体・液体・塩・酸を、閉塞や再飛散を抑えて回収する" },
        { label: "06 / MONITOR", title: "排出・状態を監視する", body: "温度、圧力、流量、炎・プラズマ、差圧、排水、排出濃度、警報を管理する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "処理方式",
      rightLabel: "基本的な考え方",
      rows: [
        { left: "燃焼・熱分解", right: "高温と酸化反応などで可燃性・温室効果ガスを分解し、後段で酸性成分や粉を捕集する" },
        { left: "プラズマ", right: "高エネルギー電子・活性種で安定な分子を分解し、燃料使用や処理ガス負荷を用途に合わせる" },
        { left: "湿式", right: "水・薬液へ溶解・反応させて水溶性・酸性成分や粒子を除去する。排水処理が必要になる" },
        { left: "乾式吸着", right: "吸着剤・反応剤へガスを固定する。排水を抑えやすいが、交換・廃棄・破過管理が必要" },
        { left: "触媒", right: "触媒で反応温度・エネルギーを下げる。被毒、温度、ガス組成、交換・再生を管理する" },
        { left: "複合方式", right: "燃焼＋湿式、プラズマ＋湿式など、分解と副生成物捕集を段階化する" },
      ],
    },
  ],
  sections: [
    {
      id: "role",
      heading: "除害は、真空ポンプの下流でガスの化学状態を変える",
      lead: "排気、処理、工場排出の役割を分けます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "設備",
          rightLabel: "主な役割",
          rows: [
            { left: "プロセス装置", right: "成膜・エッチング・洗浄・注入などで材料ガスを使用し、未反応ガスと副生成物を排出する" },
            { left: "真空ポンプ", right: "チャンバー圧力を保ちながら排気を圧縮・移送し、除害装置へ送る" },
            { left: "ポイントオブユース除害", right: "装置近くで高濃度の排気を分解・吸収・吸着し、長い未処理配管を減らす" },
            { left: "共通排気・中央処理", right: "複数設備からの低濃度・大流量排気をまとめ、工場設備として処理・排出する" },
            { left: "排水・廃棄物処理", right: "湿式排水、吸着剤、粉、スラッジなど、気体から移した物質を安全に処理する" },
          ],
        },
      ],
      paragraphs: [
        "荏原は除害装置を、製造工程で使うガスを無害化して安全に排出する装置と説明し、分解、毒性ガス処理、可燃性ガス処理、脱臭を用途に挙げています。",
        "ガスが気体から消えても、元素は粉・液・別の気体へ移ります。除害効率だけでなく、生成物の捕集・排水・廃棄まで確認します。",
      ],
    },
    {
      id: "selection",
      heading: "方式選定は、ガス名ではなく排気の状態から始める",
      lead: "同じプロセス名でもレシピとクリーニングで排気が変わります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "確認する排気条件",
          rightLabel: "方式・設計へ与える影響",
          rows: [
            { left: "ガス種・混合", right: "未反応原料、反応副生成物、クリーニングガス、酸化剤、パージの同時流入と反応性を見る" },
            { left: "濃度・流量・変動", right: "定常とピーク、レシピ切替、複数チャンバー同時処理、希釈後の総流量を確認する" },
            { left: "温度・圧力", right: "凝縮、昇華、反応速度、配管堆積、ポンプ排気条件、装置入口条件へ影響する" },
            { left: "可燃・支燃・反応性", right: "安全な混合順序、希釈、着火源、逆火・爆発防止、インターロックを設計する" },
            { left: "腐食・毒性", right: "材料、シール、洗浄、漏えい検知、排気、保守作業、廃棄物管理を決める" },
            { left: "温室効果", right: "対象分子の分解、代替ガス、使用量削減、処理効率、装置エネルギーを合わせて評価する" },
          ],
        },
      ],
      paragraphs: [
        "EdwardsはCVD・エッチング・水素系など用途別の燃焼除害と、PFCなどを対象にしたプラズマ除害を展開しています。",
        "日本酸素グループはCVD・エッチングで排出される可燃性・毒性・PFCなどを対象にした燃焼式装置を公式に示しています。",
      ],
    },
    {
      id: "performance",
      heading: "DREだけでなく、出口濃度・副生成物・稼働率を一緒に見る",
      lead: "高い分解率でも、入口濃度や別の生成物で結果が変わります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "評価項目",
          rightLabel: "主な意味と注意点",
          rows: [
            { left: "DRE", right: "入口と出口の対象物質量から求める分解・除去効率。測定方法、濃度、流量、運転条件を確認する" },
            { left: "出口濃度・排出量", right: "効率だけでなく実際に排出される濃度・質量と、法令・社内基準への適合を見る" },
            { left: "副生成物", right: "酸性ガス、NOx、CO、粉、塩、排水など新たに生じる物質と捕集方法を確認する" },
            { left: "処理容量・変動追従", right: "ピーク流量、複数入口、レシピ切替、クリーニング時に性能を保てるか" },
            { left: "稼働率・バイパス", right: "保守・異常時に未処理排気を出さず、プロセス装置の停止時間を抑える構成か" },
            { left: "エネルギー・水・燃料", right: "処理性能に加え、電力、燃料、水、薬品、排水、冷却の年間負荷を見る" },
            { left: "保守周期", right: "粉・腐食・吸着剤・バーナ・プラズマ源・スクラバの清掃交換と作業安全を確認する" },
          ],
        },
      ],
      paragraphs: [
        "Edwards Atlasは燃焼式、Proteusはプラズマ式として、対象ガス、処理効率、燃料・電力、NOx、保守など異なる設計軸を示しています。",
        "性能値は入口ガス・流量・濃度・ユーティリティで変わります。実レシピの通常運転、クリーニング、異常遷移を含めて確認します。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体用排ガス除害装置の代表企業4社",
      lead: "処理方式、真空ポンプ・ガス供給、現地保守の範囲が異なります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "公式情報で確認できる主な領域",
          rows: [
            { left: "Edwards Vacuum｜英国系", right: "半導体向け燃焼・プラズマ除害、温度管理、ドライポンプ、統合サブファブ、監視・保守サービスを展開" },
            { left: "荏原製作所｜日本", right: "ポイントオブユースの燃焼・湿式・乾式・触媒などの除害と、ドライ真空ポンプを展開" },
            { left: "カンケンテクノ｜日本", right: "半導体などの有害・可燃・支燃・温室効果ガス向け排ガス処理装置を専門に、研究開発から保守まで展開" },
            { left: "日本酸素グループ｜日本", right: "燃焼式排ガス処理、MOCVD関連設備、特殊材料ガス供給・精製・配管などガスハンドリングを含む領域を展開" },
          ],
        },
      ],
      paragraphs: [
        "真空・除害を統合する企業、環境装置を専門とする企業、ガス供給から排気処理まで扱う企業で、設計・サービスの境界が異なります。",
        "市場シェアや一律の処理性能順位は扱いません。対象排気、処理方式、測定条件、保守・ユーティリティをそろえます。",
      ],
    },
    {
      id: "comparison",
      heading: "除害装置メーカーは、8つの条件をそろえて比較する",
      lead: "化学反応、安全、環境、稼働を同じ表で確認します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較軸",
          rightLabel: "具体的な確認事項",
          rows: [
            { left: "1. 対象排気", right: "工程、ガス、混合、濃度、流量、ピーク、温度、圧力、クリーニング、パージ" },
            { left: "2. 処理方式", right: "燃焼・プラズマ・湿式・乾式・触媒・複合、反応剤、成立条件、起動停止" },
            { left: "3. 処理性能", right: "DRE、出口濃度、測定方法、変動追従、複数入口、低負荷・高負荷条件" },
            { left: "4. 副生成物", right: "NOx、CO、酸性成分、粉、塩、排水、吸着剤、捕集、閉塞、腐食、廃棄" },
            { left: "5. 排気系連携", right: "ドライポンプ、加熱配管、希釈、パージ、トラップ、差圧、逆流、インターロック" },
            { left: "6. ユーティリティ", right: "電力、燃料、水、薬品、冷却、排水、排気、設置面積、熱負荷" },
            { left: "7. 安全・規制", right: "漏えい、炎・プラズマ、温度、圧力、可燃性、緊急停止、排出測定、法令・工場基準" },
            { left: "8. 稼働・支援", right: "保守周期、清掃交換、冗長性、遠隔監視、拠点、部品、教育、廃棄物対応" },
          ],
        },
      ],
      paragraphs: [
        "最初にプロセス側と除害側で、入口ガスの設計値・実測値・最悪条件を共有します。平均値だけではピーク時の未処理や安全余裕を判断できません。",
        "次に通常運転、クリーニング、立上げ、停止、異常時を含む運転マトリクスを作り、処理性能・排出・インターロックを確認します。",
      ],
    },
    {
      id: "jobs",
      heading: "除害装置メーカーの仕事は、化学反応・設備安全・保守をつなぐ",
      lead: "プロセス装置の外側で量産と環境を支える仕事です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "REACTION", title: "反応・燃焼・プラズマ", body: "分解、酸化、吸収、吸着、触媒、反応速度、副生成物を設計します。" },
            { label: "MECHANICAL", title: "機械・配管", body: "反応器、バーナ、スクラバ、配管、熱、流体、腐食、粉体対策を設計します。" },
            { label: "CONTROL", title: "電装・安全制御", body: "センサ、燃料・電力、パージ、インターロック、警報、通信を設計します。" },
            { label: "ENVIRONMENT", title: "環境・分析", body: "入口・出口ガス、DRE、副生成物、排水、排出量、規制適合を評価します。" },
            { label: "APPLICATION", title: "プロセス・アプリ", body: "工程ガス、ポンプ、配管、レシピに合う処理方式と運転条件を作ります。" },
            { label: "SERVICE", title: "フィールド・保守", body: "据付、立上げ、清掃交換、故障解析、排出測定、作業安全を支援します。" },
          ],
        },
      ],
      paragraphs: [
        "化学工学、燃焼、プラズマ、流体、設備、環境、安全、保全、フィールドサービスの経験を接続できます。",
        "求人では、反応器設計、アプリケーション、環境分析、現地保守、サービス企画のどこを担当し、どの工程排気を扱うか確認します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体用排ガス除害装置でよくある質問",
      lead: "役割と方式の違いを整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "除害装置とは何ですか？", answer: "製造工程から出る有害・可燃・温室効果・腐食性ガスを、分解・酸化・吸収・吸着などで処理し、安全な排出へ近づける装置です。" },
            { question: "スクラバと除害装置は同じですか？", answer: "広い意味で重なる場合があります。湿式スクラバは除害方式の一つで、半導体では燃焼・プラズマ・乾式・触媒や複合方式も使われます。" },
            { question: "真空ポンプとの違いは？", answer: "真空ポンプは排気をチャンバーから取り出し圧縮・移送します。除害装置は排気中の物質を化学・物理処理します。" },
            { question: "主なメーカーは？", answer: "この記事ではEdwards Vacuum、荏原製作所、カンケンテクノ、日本酸素グループを代表例として紹介しています。" },
            { question: "DREが高ければ十分ですか？", answer: "十分とは限りません。出口濃度、副生成物、処理容量、異常時、稼働率、電力・水・燃料、廃棄物まで確認します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜分解した後の物質まで追う",
      lead: "除害は、気体の反応・分離・排出を一体で管理する工程です。",
      blocks: [
        {
          type: "cards",
          columns: 4,
          items: [
            { label: "EXHAUST", title: "入口を定義する", body: "ガス、混合、濃度、流量、温度、レシピをそろえる" },
            { label: "METHOD", title: "方式を組み合わせる", body: "分解、酸化、吸収、吸着、捕集の役割を分ける" },
            { label: "BYPRODUCT", title: "出口まで追う", body: "気体、粉、液、塩、排水、廃棄物を確認する" },
            { label: "UPTIME", title: "量産で守る", body: "安全、稼働、保守、監視、ユーティリティを評価する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "真空ポンプメーカー", href: "/guides/semiconductor-vacuum-pump-manufacturers", description: "除害装置へ排気を送るポンプと配管を見る" },
            { label: "半導体ガスメーカー", href: "/guides/semiconductor-gas-manufacturers", description: "供給から使用・排気までのガス全体を見る" },
            { label: "マスフローコントローラーメーカー", href: "/guides/semiconductor-mass-flow-controller-manufacturers", description: "プロセスへ入るガス流量の制御を見る" },
            { label: "成膜装置メーカー", href: "/guides/semiconductor-deposition-equipment-manufacturers", description: "CVD・ALDなどの排気発生工程を見る" },
            { label: "エッチング装置メーカー", href: "/guides/semiconductor-etching-equipment-manufacturers", description: "反応性ガスとクリーニング排気が出る工程を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "除害が支える工程装置の全体地図を見る" },
          ],
        },
      ],
      paragraphs: [
        "企業を調べるときは、公式製品を一つ選び、対象排気、処理方式、処理性能、副生成物、排気系連携、ユーティリティ、安全・規制、稼働・支援の8項目で整理してください。",
      ],
    },
  ],
  todayQuest:
    "Edwards・荏原・カンケンテクノ・日本酸素から1社を選び、公式製品を対象ガス・処理方式・副生成物・真空ポンプ連携・ユーティリティ・保守の6項目で整理する",
  relatedGuideSlugs: [
    "semiconductor-vacuum-pump-manufacturers",
    "semiconductor-gas-manufacturers",
    "semiconductor-mass-flow-controller-manufacturers",
    "semiconductor-deposition-equipment-manufacturers",
    "semiconductor-deposition-process",
    "semiconductor-etching-equipment-manufacturers",
    "semiconductor-etching-process",
    "semiconductor-ion-implantation-equipment-manufacturers",
    "semiconductor-equipment-manufacturers",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: [],
};
