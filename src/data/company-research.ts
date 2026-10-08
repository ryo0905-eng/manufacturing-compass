import type { Source } from "@/types/content";

// Product facts only. Role suggestions below are editorial research prompts, not vacancies.
export type CompanyResearch = { facts: string; source: Source; sourceScope?: string };
const source = (publisher: string, url: string): Source => ({ title: "公式の事業・製品情報", publisher, url, accessedAt: "2026-10-08" });
export const companyResearch: Record<string, CompanyResearch> = {
  tsmc: { facts: "TSMCは顧客の半導体製造を受託するファウンドリです。自社ブランドのメモリ製品を売る会社との比較では、顧客設計を量産へつなぐ役割に注目します。", source: source("TSMC", "https://www.tsmc.com/english/aboutTSMC/company_profile") },
  micron: { facts: "Micronの製品一覧にはDRAM、NANDフラッシュ、SSDがあります。DRAMは作業中のデータ保持、NANDは電源を切っても残す記憶に使われ、製品別に仕事の対象が異なります。", source: source("Micron Technology", "https://www.micron.com/products") },
  kioxia: { facts: "キオクシアはフラッシュメモリとSSDの製品を案内しています。記憶素子の製造と、SSD製品の開発・評価を分けて研究できます。", source: source("KIOXIA", "https://www.kioxia.com/ja-jp/business.html") },
  "tokyo-electron": { facts: "東京エレクトロンは塗布・現像、成膜、エッチング、洗浄などの製造工程に対応する装置を紹介しています。同じ装置職でも、担当製品と工程を特定して調べる必要があります。", source: source("Tokyo Electron", "https://www.tel.com/product/") },
  screen: { facts: "SCREENは洗浄、塗布・現像、熱処理などの表面処理装置を紹介しています。洗浄は残留物や汚染を取り除く工程で、回路の形成を支えます。", source: source("SCREEN Semiconductor Solutions", "https://www.screen.co.jp/spe/en"), sourceScope: "公式ページの検索掲載文で事業領域を確認。ページ本文の再取得は未完了。" },
  advantest: { facts: "アドバンテストはSoC・メモリのテストシステム、ハンドラなどの周辺機器、ソフトウェアを紹介しています。テスタは電気特性を測り、ハンドラは測定対象を運ぶなど役割が異なります。", source: source("Advantest", "https://www.advantest.com/en/products/") },
  "applied-materials": { facts: "Applied Materialsは成膜、材料除去、材料特性の変更、検査・計測などの装置を紹介しています。材料を積む工程と削る工程では、確認する加工条件が異なります。", source: source("Applied Materials", "https://www.appliedmaterials.com/us/en/semiconductor/products.html") },
  "lam-research": { facts: "Lam Researchの製品案内は成膜、エッチング、剥離・洗浄などに分かれています。エッチングは不要な材料を取り除く工程で、成膜と組み合わせて構造を作ります。", source: source("Lam Research", "https://www.lamresearch.com/products/") },
  asml: { facts: "ASMLはEUV・DUV露光装置に加え、計測・検査などの製品とサービスを紹介しています。露光は回路パターンを転写する工程で、他の加工装置とは役割が異なります。", source: source("ASML", "https://www.asml.com/en/products") },
  kla: { facts: "KLAは欠陥検査・レビュー、計測、プロセス制御などを紹介しています。装置が加工する条件と、加工結果を測る条件を分けて研究できます。", source: source("KLA", "https://www.kla.com/products") },
  teradyne: { facts: "Teradyneはデジタル・ミックスドシグナルなど幅広い半導体テストを紹介しています。UltraFLEX・J750などの製品群があり、対象デバイスとテスト環境ごとに確認します。", source: source("Teradyne", "https://www.teradyne.com/semiconductor-testing/"), sourceScope: "公式ページの検索掲載文で製品領域を確認。個別仕様は対象外。" },
  renesas: { facts: "ルネサスの製品一覧にはマイコン・マイクロプロセッサ、アナログ製品などがあります。マイコンは機器を制御する小さな計算機で、回路だけでなく組み込みソフトとの接点もあります。", source: source("Renesas Electronics", "https://www.renesas.com/en/products") },
  rohm: { facts: "ロームはパワー半導体とアナログICを軸とする製品群を紹介しています。パワー半導体は電力を扱い、アナログICは電源や連続的な信号を扱います。", source: source("ROHM", "https://www.rohm.com/analogpower"), sourceScope: "公式ページの検索掲載文で製品領域を確認。ページ本文の再取得は未完了。" },
  infineon: { facts: "Infineonの製品分類にはパワー半導体、マイコン、センサーがあります。電力変換、制御、検知のどこを担当する製品かで、経験との接点が変わります。", source: source("Infineon Technologies", "https://www.infineon.com/") },
  onsemi: { facts: "onsemiはパワーマネジメント、イメージセンサーなどを紹介しています。電源を扱う仕事と、画像を電気信号として取り出す仕事を分けて研究できます。", source: source("onsemi", "https://www.onsemi.com/products") },
  nvidia: { facts: "NVIDIAはアクセラレーテッドコンピューティングとAIを事業の中心として紹介しています。計算用ハードウェアと、それを使うソフトウェアの両方から事業を理解します。", source: source("NVIDIA", "https://www.nvidia.com/en-us/about-nvidia/") },
  amd: { facts: "AMDの製品一覧はCPU、グラフィックス、AIアクセラレータ、組み込み・アダプティブコンピューティングを含みます。CPU・GPU・組み込み製品のどこに関わるかを分けて調べます。", source: source("AMD", "https://www.amd.com/en/products.html") },
  qualcomm: { facts: "QualcommはSnapdragonなどのプラットフォームを、モバイル、車載、IoTなどの用途別に紹介しています。端末内の計算と通信を、製品・システムの両面から調べられます。", source: source("Qualcomm", "https://www.qualcomm.com/products") },
  qorvo: { facts: "Qorvoは増幅器、RF制御製品、無線通信関連部品などを紹介しています。RFは無線信号を扱う領域で、信号の増幅や周波数・位相の制御など機能を分けて読みます。", source: source("Qorvo", "https://www.qorvo.com/products") },
  "analog-devices": { facts: "Analog Devicesの公式製品分類にはデータコンバータがあります。アナログの測定信号とデジタルデータを変換する部品として、測定・信号処理の接点を調べられます。", source: source("Analog Devices", "https://www.analog.com/en/product-category.html"), sourceScope: "公式ページの検索掲載文でデータコンバータの分類を確認。動的な製品一覧全体は未取得。" },
  "texas-instruments": { facts: "Texas Instrumentsはアナログと組み込み処理を中心に紹介しています。電源・信号の回路と、機器を制御する処理を分けて製品を調べられます。", source: source("Texas Instruments", "https://www.ti.com/") },
  disco: { facts: "ディスコはダイシングソー、グラインダ、ポリッシャ、精密加工ツールを紹介しています。切断、薄化、研磨の装置と消耗工具を組み合わせて加工を支える領域です。", source: source("DISCO", "https://www.disco.co.jp/jp/products/") },
  lasertec: { facts: "レーザーテックはEUV・DUVのマスク関連とウェーハ関連の検査・計測装置を紹介しています。回路を転写する原版であるマスクと、ウェーハのどちらを測るかを区別します。", source: source("Lasertec", "https://www.lasertec.co.jp/products/semiconductor/index.html") },
  nikon: { facts: "ニコンの半導体装置一覧にはArF液浸、ArF、KrF、i線などの露光装置があります。露光方式と対象工程を分けて担当製品を確認します。", source: source("Nikon", "https://www.nikon.com/business/semi/lineup/") },
  canon: { facts: "キヤノンは半導体露光装置の製品一覧と、後工程向けi線ステッパーやナノインプリント技術への案内を掲載しています。露光と型による転写の技術を区別して研究します。", source: source("Canon", "https://global.canon/ja/product/indtech/semicon/") },
  "samsung-electronics": { facts: "Samsung Semiconductorはメモリ、System LSI、ファウンドリの各事業を紹介しています。会社全体の半導体情報を、応募する事業部の仕事内容にそのまま当てはめないようにします。", source: source("Samsung Electronics", "https://semiconductor.samsung.com/") },
  sumco: { facts: "SUMCOは半導体製造の基板となるシリコンウェーハを提供しています。完成チップの回路設計とは異なり、基板材料の品質と製造を調べる入口です。", source: source("SUMCO", "https://www.sumcosi.com/products/") },
  "hitachi-hightech": { facts: "日立ハイテクはドライエッチング装置とCD-SEM・欠陥検査装置を紹介しています。CD-SEMは電子顕微鏡で微細な回路寸法を測る装置です。", source: source("Hitachi High-Tech", "https://www.hitachi-hightech.com/global/en/products/semiconductor-manufacturing/") },
  marvell: { facts: "Marvellはネットワーク、ストレージ、カスタムシリコンなどデータインフラ向けの製品群を紹介しています。データを運ぶ、保存する、処理する役割を分けて調べます。", source: source("Marvell Technology", "https://www.marvell.com/products.html") },
  nxp: { facts: "NXPはマイコン・プロセッサ、接続、セキュリティなどの製品を紹介しています。機器制御と通信、認証のどこを担当するかを分けて研究できます。", source: source("NXP Semiconductors", "https://www.nxp.com/products:PCPRODCAT") },
};
