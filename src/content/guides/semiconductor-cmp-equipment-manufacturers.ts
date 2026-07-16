import type { GuideArticle } from "@/content/guides/types";

export const semiconductorCmpEquipmentManufacturersGuide: GuideArticle = {
  slug: "semiconductor-cmp-equipment-manufacturers",
  title: "半導体のCMP装置メーカーとは？Applied Materials・荏原製作所を初心者向けに図解",
  description:
    "半導体のCMP装置メーカーは、ウェーハ上の薄膜を化学的・機械的に研磨し、次の回路層を作れる平面へ整える量産装置を開発します。装置構成、研磨・洗浄・終点検出、主要企業、比較方法、仕事内容を図解します。",
  targetQuery: "半導体 CMP装置 メーカー",
  searchIntent:
    "半導体CMP装置の構成、研磨ヘッド・定盤・スラリー供給・洗浄・終点検出の役割、Applied Materials・荏原製作所など主要メーカーの製品領域と比較方法を知りたい",
  status: "published",
  category: "foundation",
  presentation: "structured",
  author: "RYO",
  reviewedBy: "RYO",
  basisLabel: "この記事の調査・編集方針",
  basisNote:
    "Applied Materials、荏原製作所、Revasum、岡本工作機械製作所の公式製品・技術情報をもとに、CMP装置の構成、量産用途、SiC・研究開発向け装置を整理しました。市場シェアや企業の優劣ではなく、対象材料・工程をそろえて装置メーカーを比較する基礎を説明します。",
  showCareerCtas: false,
  experienceBasis: [
    "既存のCMP技術記事で化学作用・機械作用と平坦化原理を整理したうえで、量産装置と企業ポートフォリオを独立して調べる記事が必要だと判断",
    "Applied Materialsと荏原製作所の公式情報で、複数研磨ステーション、研磨ヘッド、研磨後洗浄、乾燥、終点・膜厚計測などの装置構成を確認",
    "Revasumと岡本工作機械製作所の公式情報で、SiC単枚処理や研究開発向けCMPを確認し、量産前工程CMPと対象用途を分けて整理",
  ],
  publishedAt: "2026-07-16",
  updatedAt: "2026-07-16",
  sources: [
    {
      title: "Reflexion LK Prime CMP",
      url: "https://www.appliedmaterials.com/sg/en/product-library/reflexion-lk-prime-cmp.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Product Library | CMP",
      url: "https://www.appliedmaterials.com/in/en/product-library.html",
      publisher: "Applied Materials",
      accessedAt: "2026-07-16",
    },
    {
      title: "Model F-REX",
      url: "https://www.ebara.com/global-en/products/FREX/",
      publisher: "EBARA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "F-REX300XA型",
      url: "https://ebara.com/jp-ja/products/FREX300XA/",
      publisher: "株式会社荏原製作所",
      accessedAt: "2026-07-16",
    },
    {
      title: "Nano-level Polishing Technique that Supports Semiconductor",
      url: "https://ebara.com/global-en/technology/information/polishing-technology-ex/",
      publisher: "EBARA Corporation",
      accessedAt: "2026-07-16",
    },
    {
      title: "6EZ Silicon Carbide Polisher",
      url: "https://www.revasum.com/",
      publisher: "Revasum, Inc.",
      accessedAt: "2026-07-16",
    },
    {
      title: "CMP SPP600S",
      url: "https://www.okamoto.co.jp/en/products/spp600s/",
      publisher: "Okamoto Machine Tool Works, Ltd.",
      accessedAt: "2026-07-16",
    },
  ],
  readTime: "約15分",
  intro: {
    problem:
      "Applied Materialsや荏原製作所のCMP装置を見ても、研磨テーブルとヘッドの数、研磨後洗浄、終点検出、SiC向け研磨装置など、何を同じ条件で比較すればよいか分かりにくくありませんか。",
    conclusion:
      "CMP装置は、搬送、研磨ヘッド、定盤・パッド、スラリー供給、パッド調整、終点・膜厚計測、研磨後洗浄、乾燥、制御を統合します。企業比較では、対象材料・工程、研磨構成、平坦化性能、欠陥、洗浄、量産性をそろえます。",
    learnings:
      "CMP装置の役割と構成、研磨・終点・洗浄の流れ、装置アーキテクチャ、対象材料、主要メーカー、消耗材・計測との関係、比較軸、関連職種。",
  },
  overviewBlocks: [
    {
      type: "quote",
      quote:
        "CMP装置メーカーを比べるときは、『磨けるか』より先に、『どの材料と構造を、どの高さで止め、どの清浄度で次工程へ渡す装置か』をそろえて見ます。",
      caption: "この記事の見方",
    },
    {
      type: "process-flow",
      title: "図解｜搬入から研磨・終点・洗浄・乾燥まで",
      description:
        "量産用CMP装置を単純化した流れです。研磨テーブル、ヘッド、洗浄モジュールの数と処理順序は装置・用途で異なります。",
      stages: [
        { label: "01 / LOAD", title: "ウェーハを搬入", body: "表面・裏面を傷つけずに装置内へ運び、研磨ヘッドへ受け渡す" },
        { label: "02 / POLISH", title: "化学＋機械で研磨", body: "スラリー、パッド、圧力、回転を組み合わせ、高い部分を優先して除去する" },
        { label: "03 / ENDPOINT", title: "終点を判断", body: "光学、渦電流、トルク、時間、膜厚などから残膜・材料変化を捉える" },
        { label: "04 / CLEAN", title: "研磨残留物を洗浄", body: "スラリー、砥粒、研磨くず、薬液残留物を化学・物理洗浄で除去する" },
        { label: "05 / DRY", title: "乾燥して次工程へ", body: "乾燥跡、再付着、腐食を抑え、処理履歴とともにウェーハを搬出する" },
      ],
    },
    {
      type: "mapping",
      leftLabel: "装置の要素",
      rightLabel: "主な役割",
      rows: [
        { left: "搬送・ロードポート", right: "FOUPからウェーハを識別・搬送し、研磨・洗浄モジュールへ受け渡す" },
        { left: "研磨ヘッド", right: "ウェーハを保持し、複数領域の圧力、回転、外周保持を制御する" },
        { left: "定盤・研磨パッド", right: "ウェーハと相対運動し、接触・摩擦・スラリー輸送によって高い部分を除去する" },
        { left: "スラリー供給", right: "砥粒と薬液を流量・温度・状態を管理してパッドへ届ける" },
        { left: "コンディショナー", right: "パッド表面を整え、研磨速度とスラリー保持を安定させる" },
        { left: "終点・膜厚計測", right: "材料変化や残膜を捉え、研磨停止と面内補正へ使う" },
        { left: "洗浄・乾燥", right: "研磨後の粒子・残留物を除き、清浄で乾いたウェーハを次工程へ渡す" },
        { left: "制御・データ", right: "搬送、レシピ、圧力、回転、信号、消耗材、保守履歴を管理する" },
      ],
    },
  ],
  sections: [
    {
      id: "definition",
      heading: "CMP装置メーカーとは、薄膜の平坦化を量産設備へする企業",
      lead: "表面を滑らかにするだけでなく、異なる材料を必要な高さへそろえます。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "PLANARIZE", title: "高さをそろえる", body: "段差の高い部分を優先して除去し、次の成膜・露光へ進める平面を作ります。" },
            { label: "SELECT", title: "材料を選んで止める", body: "対象膜、停止膜、配線、絶縁膜の研磨速度を調整し、必要材料を残します。" },
            { label: "PRODUCTION", title: "量産で繰り返す", body: "膜厚、平坦度、欠陥、消耗材、生産性をウェーハ間・装置間で管理します。" },
          ],
        },
        {
          type: "note",
          title: "デバイスCMPと基板研磨を分ける",
          body: "回路形成途中の薄膜・配線を平坦化するCMPと、シリコン・SiCなどの基板自体を鏡面へ仕上げる研磨は、装置名や原理が近くても対象・目的が異なります。企業比較ではどちらの工程かを先に確認します。",
        },
      ],
      paragraphs: [
        "CMPはスラリーの化学作用と、パッド・砥粒・圧力・相対運動の機械作用を組み合わせます。装置メーカーは反応と接触を面内で制御し、終点で止め、研磨残留物を装置内で洗浄します。",
        "量産装置では研磨速度だけでなく、ディッシング、エロージョン、スクラッチ、粒子、腐食、面内均一性、装置間再現性、稼働率も評価します。",
      ],
    },
    {
      id: "architecture",
      heading: "研磨ヘッド・定盤・搬送の構成が、装置の処理順序を決める",
      lead: "複数の研磨・洗浄モジュールを、直列・並列で動かして量産性を作ります。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "装置構成の見方",
          rightLabel: "確認すること",
          rows: [
            { left: "研磨テーブル数", right: "粗研磨・仕上げ、異なる材料、連続処理を何段で構成できるか" },
            { left: "研磨ヘッド数", right: "同時処理数、搬送待ち、ヘッドごとの校正・保守、装置内整合をどう管理するか" },
            { left: "一対一・共有構成", right: "一つのテーブルへ専用ヘッドを置くか、複数ヘッドがテーブルを移動するか" },
            { left: "洗浄・乾燥モジュール", right: "研磨直後から洗浄までの待ち時間、複数段洗浄、同時処理、交差汚染をどう抑えるか" },
            { left: "搬送経路", right: "直列・並列処理、再処理、製品切替、モジュール停止時の迂回に対応できるか" },
            { left: "モジュール化", right: "対象工程に合わせた構成変更、増設、改造、保守をどの単位で行えるか" },
          ],
        },
      ],
      paragraphs: [
        "Applied MaterialsはReflexion LK Primeについて、複数の研磨パッド、研磨ヘッド、洗浄・乾燥チャンバーを備え、直列・並列などの処理構成へ対応すると説明しています。",
        "荏原製作所のF-REXは、一つのテーブルと一つのヘッドを組にしたデュアルモジュール構造、研磨後洗浄、乾燥、オプションの終点・膜厚計測を公式情報で示しています。構成思想が異なるため、同じ工程条件で比較します。",
      ],
    },
    {
      id: "head-platen",
      heading: "研磨ヘッドと定盤は、圧力・相対運動・面内分布を作る",
      lead: "平均研磨量だけでなく、中心から外周までの除去分布を制御します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "HEAD", title: "多領域圧力制御", body: "ウェーハ背面を複数領域へ分けて加圧し、面内の研磨量を補正します。" },
            { label: "RETAINER", title: "外周保持", body: "リテーナリングでウェーハ位置を保ち、外周のパッド接触へ影響を与えます。" },
            { label: "PLATEN", title: "回転定盤", body: "パッドを保持し、ウェーハとの速度・軌跡・接触時間を作ります。" },
            { label: "PAD", title: "研磨パッド", body: "硬さ、弾性、気孔、溝で接触とスラリー輸送、局所平坦化を変えます。" },
            { label: "CONDITION", title: "パッド調整", body: "ドレッサーで使用中のパッド表面を整え、目詰まりと研磨速度変化を抑えます。" },
            { label: "MOTION", title: "相対運動", body: "ヘッドと定盤の回転・揺動を制御し、面内の滞在時間を配分します。" },
          ],
        },
      ],
      paragraphs: [
        "研磨圧力を一様にすれば膜厚が一様になるとは限りません。元の膜厚分布、パッド状態、温度、スラリー流れ、外周形状を見ながら、領域別圧力と運動を調整します。",
        "ヘッド、リング、パッドは接触して摩耗するため、部品状態と交換後の校正が結果へ影響します。装置の機械精度と消耗材管理を分けずに見ます。",
      ],
    },
    {
      id: "endpoint-clean",
      heading: "終点検出と研磨後洗浄までが、CMP装置の処理範囲",
      lead: "必要な高さで止めても、スラリーや研磨くずが残れば次工程へ渡せません。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "機能",
          rightLabel: "主な役割",
          rows: [
            { left: "時間・研磨量管理", right: "事前の研磨速度と時間から除去量を管理し、基礎となる停止点を作る" },
            { left: "光学終点", right: "反射光などの変化から膜厚・材料変化を捉える" },
            { left: "渦電流終点", right: "導電性材料の残膜変化を非接触信号として捉える" },
            { left: "トルク・摩擦信号", right: "材料や接触状態が変わるときの機械負荷変化を検出する" },
            { left: "インライン膜厚", right: "研磨途中・後の膜厚情報を測り、残り研磨と次ウェーハの補正へ使う" },
            { left: "研磨後洗浄・乾燥", right: "砥粒、研磨くず、薬液残留物を除去し、腐食・傷・乾燥跡を抑える" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "CMPの仕組み", href: "/guides/semiconductor-cmp-process", description: "終点、平坦化、不良のメカニズムを見る" },
            { label: "CMPスラリーメーカー", href: "/guides/semiconductor-cmp-slurry-manufacturers", description: "対象膜・砥粒・選択性と主要企業を見る" },
            { label: "洗浄装置メーカー", href: "/guides/semiconductor-cleaning-equipment-manufacturers", description: "CMP後洗浄を含む洗浄装置の方式を見る" },
          ],
        },
      ],
      paragraphs: [
        "終点信号は対象材料と膜構成で使いやすさが変わります。一つの信号だけでなく、時間、事前膜厚、装置信号、研磨後計測を組み合わせて停止と補正を設計します。",
        "研磨直後の表面ではスラリーが乾く前に洗浄へ移る必要があります。装置内で研磨から洗浄・乾燥までつなぐ構成は、搬送待ち、再付着、交差汚染を抑えるためにも重要です。",
      ],
    },
    {
      id: "applications",
      heading: "配線・絶縁膜・メモリ・SiCでは、装置要求が変わる",
      lead: "CMPという名前が同じでも、材料と製品構造をそろえて比較します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "対象・用途",
          rightLabel: "主な装置課題",
          rows: [
            { left: "絶縁膜・STI", right: "膜種間の選択性、停止性、パターン密度による高さ差、面内均一性を管理する" },
            { left: "タングステン・コンタクト", right: "金属とバリア・絶縁膜の除去比、残膜、腐食、スクラッチを管理する" },
            { left: "銅配線", right: "低い圧力、ディッシング・エロージョン、バリア除去、腐食、研磨後洗浄を管理する" },
            { left: "3D NAND・厚膜", right: "長い研磨時間、厚い膜、大きな段差、複数定盤での安定処理と生産性を両立する" },
            { left: "先端接合・パッケージ", right: "接合前平坦度、異種材料、薄いウェーハ、配線・絶縁材料の高さを管理する" },
            { left: "SiC・基板研磨", right: "硬い基板材料を対象に、表面粗さ、損傷層、研磨速度、単枚再現性を管理する" },
          ],
        },
      ],
      paragraphs: [
        "Applied Materialsと荏原製作所の量産CMPは、回路形成途中の薄膜平坦化を主な比較対象にできます。一方、RevasumはSiC向けの単枚研磨装置を公開しており、対象材料と製造段階が異なります。",
        "岡本工作機械製作所は研究開発向けのマニュアルCMP装置と、基板仕上げ向けの全自動ポリッシャーを公開しています。量産デバイスCMP、基板研磨、研究開発を同じ仕様表へ混ぜません。",
      ],
    },
    {
      id: "manufacturers",
      heading: "半導体CMP・研磨装置の代表企業4社",
      lead: "市場順位ではなく、公式情報から確認できる対象装置と用途を整理します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "企業",
          rightLabel: "主なCMP・研磨装置領域",
          rows: [
            { left: "Applied Materials｜米国", right: "Reflexionシリーズなど量産用CMP。複数研磨・洗浄・乾燥モジュール、工程制御を統合" },
            { left: "荏原製作所｜日本", right: "F-REXシリーズなど量産用CMP。デュアルモジュール、研磨後洗浄、終点・膜厚計測の選択肢" },
            { left: "Revasum｜米国", right: "SiC向け全自動単枚ポリッシャー。基板・デバイス向けの研削・研磨・CMP領域" },
            { left: "岡本工作機械製作所｜日本", right: "研究開発向けCMP、シリコンウェーハ・各種基板向け研磨、全自動ファイナルポリッシャー" },
          ],
        },
        {
          type: "note",
          title: "代表企業は網羅的な順位表ではない",
          body: "量産前工程、基板製造、化合物半導体、研究開発では装置市場と要求仕様が異なります。掲載企業は用途の違いを説明する代表例で、シェアや性能順位を示しません。",
        },
      ],
      paragraphs: [
        "企業名だけでCMP装置を比較せず、まず回路形成途中の平坦化か、基板の鏡面仕上げか、研究開発かを確認します。次にウェーハ径、材料、装置自動化、研磨・洗浄構成をそろえます。",
        "製品ラインアップは追加・再編されます。特定製品や求人を調べる場合は、各社の最新製品ページと採用情報を確認してください。",
      ],
    },
    {
      id: "comparison",
      heading: "CMP装置メーカーは、6つの条件をそろえて比較する",
      lead: "装置構成の違いを、対象工程と量産結果へ結び付けます。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "比較条件",
          rightLabel: "確認すること",
          rows: [
            { left: "1. 対象材料・製造段階", right: "絶縁膜、金属、メモリ、接合、SiC、基板仕上げ、研究開発のどれか" },
            { left: "2. 研磨構成", right: "テーブル・ヘッド数、一対一・共有構成、粗研磨・仕上げ、直列・並列処理" },
            { left: "3. 平坦化性能", right: "研磨速度、面内・ウェーハ間均一性、選択性、終点、ディッシング・エロージョン" },
            { left: "4. 欠陥・洗浄", right: "スクラッチ、粒子、残留物、腐食、交差汚染、洗浄・乾燥方式" },
            { left: "5. 量産性能", right: "スループット、稼働率、装置面積、搬送、装置間整合、製品切替、保守時間" },
            { left: "6. 消耗材・データ・環境", right: "スラリー、パッド、リング、ブラシ、純水、電力、排液、計測・制御、使用履歴" },
          ],
        },
      ],
      paragraphs: [
        "処理能力や膜厚均一性などの公称値は、レシピ、材料、膜厚、ウェーハ径、装置構成、測定定義で変わります。異なる条件の数値をそのまま横並びにしません。",
        "CMPは接触加工で消耗材を多く使います。初期性能だけでなく、パッド・リング・ブラシの寿命、交換後復帰、スラリー使用量、純水・排液、部品供給、サービスまで含めて量産価値を見ます。",
      ],
    },
    {
      id: "ecosystem",
      heading: "CMP装置は、スラリー・パッド・洗浄・計測と一緒に使う",
      lead: "装置本体だけで平坦化結果と欠陥を説明することはできません。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "SLURRY", title: "スラリー", body: "砥粒、反応剤、分散状態、pHなどで研磨速度、選択性、傷、腐食が変わります。" },
            { label: "PAD", title: "パッド・ドレッサー", body: "硬さ、弾性、気孔、溝、表面状態で接触とスラリー輸送が変わります。" },
            { label: "HEAD PARTS", title: "ヘッド部品", body: "膜、リテーナリング、背面支持部品の状態が圧力分布と外周研磨へ影響します。" },
            { label: "POST CLEAN", title: "研磨後洗浄", body: "薬液、ブラシ、純水、乾燥で砥粒・研磨くず・残留物を除去します。" },
            { label: "METROLOGY", title: "膜厚・形状・欠陥計測", body: "残膜、段差、面内分布、傷、粒子を測り、次の研磨条件へ返します。" },
            { label: "FACILITY", title: "工場設備", body: "スラリー、薬液、純水、排液、電力、圧縮空気などを安定供給します。" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "膜厚・段差・欠陥を測る装置企業を見る" },
            { label: "配線形成", href: "/guides/semiconductor-interconnect-process", description: "導体充填後のCMPが多層配線へ入る流れを見る" },
          ],
        },
      ],
      paragraphs: [
        "スラリーやパッドのロット、装置部品の摩耗、洗浄ブラシ、純水品質が変わると、同じレシピでも結果が変化します。装置データと消耗材履歴、研磨後計測を結び付けます。",
        "企業研究ではCMP装置メーカーだけでなく、研磨材、パッド、精密部品、洗浄装置、膜厚・表面形状・欠陥計測まで工程の周辺企業を確認すると、技術と職種の幅が見えます。",
      ],
    },
    {
      id: "jobs",
      heading: "CMP装置メーカーの主な職種",
      lead: "表面化学、接触機械、流体、計測、量産保守を横断します。",
      blocks: [
        {
          type: "mapping",
          leftLabel: "職種",
          rightLabel: "主な仕事",
          rows: [
            { left: "プロセス・アプリケーション", right: "材料・構造に合わせてスラリー、パッド、圧力、回転、終点、洗浄を設計する" },
            { left: "機械・メカトロニクス", right: "研磨ヘッド、定盤、搬送、回転、加圧、振動、精密位置決めを設計する" },
            { left: "流体・設備", right: "スラリー、薬液、純水、温調、ろ過、排液、洗浄・乾燥モジュールを設計する" },
            { left: "電気・制御・ソフトウェア", right: "装置シーケンス、モーション、終点信号、膜厚補正、安全、データ連携を開発する" },
            { left: "フィールドサービス", right: "据付、立ち上げ、校正、部品交換、故障解析、装置復帰、稼働率改善を支える" },
            { left: "生産・品質・サプライチェーン", right: "精密部品・装置の組立、検査、変更管理、清浄度、供給、出荷品質を管理する" },
          ],
        },
      ],
      paragraphs: [
        "装置保全、研磨、精密機械、モーション制御、流体、薬液設備、計測、品質、生産技術、データ解析、顧客対応の経験は接点を整理しやすい領域です。求人では対象材料、装置、自動化、開発か量産支援かを確認します。",
        "経験を説明するときは、膜厚均一性、再現性、傷・粒子、稼働率、復旧時間、消耗材寿命、安全、スラリー・純水使用量のどこへ貢献したかを、担当範囲と一緒に言語化します。",
      ],
    },
    {
      id: "faq",
      heading: "半導体CMP装置メーカーでよくある質問",
      lead: "装置と工程の範囲を簡潔に整理します。",
      blocks: [
        {
          type: "faq",
          items: [
            { question: "半導体CMP装置とは何ですか？", answer: "スラリーの化学作用とパッド・砥粒の機械作用を組み合わせ、回路形成途中の薄膜を研磨・平坦化する量産装置です。研磨後洗浄と乾燥を統合する装置もあります。" },
            { question: "主なCMP装置メーカーは？", answer: "量産デバイスCMPではApplied Materialsと荏原製作所が代表例です。この記事ではSiC向けのRevasum、研究開発・基板研磨向けの岡本工作機械製作所も、用途の違う例として紹介しています。" },
            { question: "CMP装置とウェーハ研磨装置は同じですか？", answer: "原理や構成が近い場合がありますが、回路形成途中の薄膜を選択的に平坦化するCMPと、基板自体を鏡面へ仕上げる研磨では対象・目的が異なります。製造段階を確認します。" },
            { question: "CMP装置は何を測って停止しますか？", answer: "時間に加え、光学、渦電流、トルク・摩擦、インライン膜厚などの信号を、対象材料に合わせて使います。研磨後の膜厚・形状計測も次の条件補正へ使います。" },
            { question: "CMP後に洗浄するのはなぜですか？", answer: "ウェーハへ残るスラリー、砥粒、研磨くず、薬液残留物を除き、傷、粒子、腐食、乾燥跡を抑えて次工程へ渡すためです。" },
            { question: "CMP装置はどこを比較しますか？", answer: "対象材料・工程、テーブル・ヘッド構成、平坦化・終点性能、欠陥・洗浄、スループット・稼働率、消耗材・データ・環境条件をそろえて比較します。" },
          ],
        },
      ],
      paragraphs: [],
    },
    {
      id: "summary",
      heading: "まとめ｜対象材料・研磨構成・洗浄をそろえてメーカーを見る",
      lead: "CMP装置は、化学・機械・計測・洗浄を統合して薄膜の高さを量産管理します。",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            { label: "TARGET", title: "材料と工程をそろえる", body: "デバイス薄膜、配線、メモリ、SiC、基板、研究開発を分ける" },
            { label: "ARCHITECTURE", title: "装置構成を見る", body: "研磨テーブル・ヘッド、搬送、終点、洗浄・乾燥の組み合わせを見る" },
            { label: "PRODUCTION", title: "量産全体で比較する", body: "平坦度、欠陥、生産性、消耗材、保守、環境、サービスまで確認する" },
          ],
        },
        {
          type: "links",
          items: [
            { label: "CMPの仕組み", href: "/guides/semiconductor-cmp-process", description: "化学機械研磨と平坦化の原理を見る" },
            { label: "半導体製造装置メーカー", href: "/guides/semiconductor-equipment-manufacturers", description: "工程別の装置企業を一つの地図で見る" },
            { label: "洗浄装置メーカー", href: "/guides/semiconductor-cleaning-equipment-manufacturers", description: "CMP後洗浄を含む装置方式を見る" },
            { label: "検査・計測装置メーカー", href: "/guides/semiconductor-inspection-equipment-manufacturers", description: "残膜・段差・表面欠陥を測る装置を見る" },
            { label: "膜厚・光学計測装置メーカー", href: "/guides/semiconductor-thin-film-optical-metrology-manufacturers", description: "CMP前後の残膜・厚さ・形状を測る光学計測を見る" },
            { label: "半導体業界地図", href: "/industry-map", description: "装置・材料・半導体メーカーの位置を見る" },
          ],
        },
      ],
      paragraphs: [
        "気になる企業を調べるときは、公式製品から一つの装置を選び、対象材料、製造段階、研磨テーブル・ヘッド、終点検出、洗浄・乾燥を確認してください。同じ用途の装置へ条件をそろえると違いが見えます。",
      ],
    },
  ],
  todayQuest: "Applied Materials・荏原製作所から1社を選び、公式製品の研磨・終点・洗浄・乾燥機能を確認する",
  relatedGuideSlugs: [
    "semiconductor-cmp-process",
    "semiconductor-cmp-slurry-manufacturers",
    "semiconductor-equipment-manufacturers",
    "semiconductor-cleaning-equipment-manufacturers",
    "semiconductor-inspection-equipment-manufacturers",
    "semiconductor-thin-film-optical-metrology-manufacturers",
    "semiconductor-interconnect-process",
    "semiconductor-deposition-process",
    "semiconductor-etching-process",
    "semiconductor-silicon-wafer-manufacturing",
    "semiconductor-manufacturing-process",
    "equipment-engineer-route",
  ],
  relatedCompanyIds: ["applied-materials", "screen", "kla"],
};
