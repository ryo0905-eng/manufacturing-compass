import type { JapanWorkCategory, JapanWorkCompany, JapanWorkEvidence, JapanWorkSource } from "@/types/japan-work";

export const japanWorkRoute = "/companies/global-japan" as const;
export const japanWorkUpdatedAt = "2026-09-22";
const nextReviewAt = "2026-12-21";

export const japanWorkCategories: { id: JapanWorkCategory; label: string; description: string }[] = [
  { id: "design", label: "設計・開発", description: "回路や製品、設計に必要な技術をつくる仕事。" },
  { id: "process", label: "製造・プロセス改善", description: "加工条件や生産の進め方を改善する仕事。顧客工場の改善支援も含みます。" },
  { id: "quality", label: "品質・評価", description: "製品の状態や不具合を調べ、品質を確かめる仕事。" },
  { id: "equipment", label: "装置の導入・保守", description: "工場の装置を立ち上げ、故障への対応や点検で稼働を支える仕事。" },
  { id: "application", label: "顧客向け技術支援", description: "製品選定・評価・使い方を技術面で支える仕事。FAEは顧客の設計課題を扱い、価格や契約を担う営業とは役割が異なります。" },
  { id: "business", label: "営業・事業支援", description: "顧客への提案、販売やマーケティングなどで事業を支える仕事。" },
];

export const japanWorkSources: JapanWorkSource[] = [
  { id: "jw-kla", title: "Japan / Life at KLA・オフィス所在地", publisher: "KLA", url: "https://www.kla.com/careers/locations/japan", accessedAt: japanWorkUpdatedAt },
  { id: "jw-kla-fae", title: "Field Application Engineer (E) / Yokohama", publisher: "KLA", url: "https://kla.wd1.myworkdayjobs.com/en-us/search/job/yokohama-japan/field-application-engineer--e-_2426438", accessedAt: japanWorkUpdatedAt },
  { id: "jw-lam", title: "Lam Research Japan / 社員の声", publisher: "Lam Research", url: "https://www.lamresearch.com/ja/careers/lrj/", accessedAt: japanWorkUpdatedAt },
  { id: "jw-infineon", title: "Japan / What we do・Japan office introduction", publisher: "Infineon Technologies", url: "https://www.infineon.com/regional/japan", accessedAt: japanWorkUpdatedAt },
  { id: "jw-applied", title: "日本の採用情報 / 注目のキャリアパス", publisher: "Applied Materials", url: "https://www.appliedmaterials.com/jp/ja/careers.html", accessedAt: japanWorkUpdatedAt },
  { id: "jw-applied-ce", title: "カスタマーエンジニア / R2628798", publisher: "Applied Materials", url: "https://jobs.appliedmaterials.com/job/yokkaichi/海外大学日本人学生対象-26年‐27年新卒-既卒向け-カスタマーエンジニア/95/100703965280", accessedAt: japanWorkUpdatedAt },
  { id: "jw-asml", title: "Japan – Working at ASML", publisher: "ASML", url: "https://www.asml.com/en/careers/working-at-asml/japan", accessedAt: japanWorkUpdatedAt },
  { id: "jw-asml-fse", title: "CS Kumamoto Field Service Engineer / J-00345835", publisher: "ASML", url: "https://www.asml.com/en/careers/find-your-job/cs-kumamoto-field-service-engineer-1st-line-fse--jasm-j00345835", accessedAt: japanWorkUpdatedAt },
  { id: "jw-micron", title: "Advanced Technology Japan Process Engineer, Dry Etch / JR109404", publisher: "Micron Technology", url: "https://careers.micron.com/careers/job/44041314-advanced-technology-japan-process-engineer-dry-etch-hiroshima-japan?domain=micron.com", accessedAt: japanWorkUpdatedAt },
  { id: "jw-tsmc", title: "TSMC Design Center in Japan", publisher: "TSMC", url: "https://www.tsmc.com/static/japanese/careers/designCenter_Japan.htm", accessedAt: japanWorkUpdatedAt },
  { id: "jw-adi", title: "日本の募集要項 / Field Application Engineer", publisher: "Analog Devices", url: "https://www.analog.com/jp/careers/student-resources.html", accessedAt: japanWorkUpdatedAt },
  { id: "jw-adi-fae", title: "フィールド・アプリケーション・エンジニアの仕事", publisher: "Analog Devices", url: "https://www.analog.com/jp/careers/career-opportunities.html", accessedAt: japanWorkUpdatedAt },
];

export const japanWorkCompanies: JapanWorkCompany[] = [
  { companyId: "kla", summary: "半導体の製造状態を調べる検査・計測装置の会社。", presence: "日本の公式紹介で、装置設置・カスタマーサービス、アプリケーション、営業の役割を確認できます。", presenceSourceIds: ["jw-kla"], careerUrl: "https://www.kla.com/careers/locations/japan", status: "published" },
  { companyId: "amd", summary: "CPUやGPUなど、計算処理を担う半導体の会社。", presence: "", presenceSourceIds: [], careerUrl: "https://www.amd.com/en/corporate/careers.html", status: "pending", pendingReason: "日本の具体的な業務と勤務地を結ぶ公式情報を追加調査中です。技術職がないことを意味しません。" },
  { companyId: "lam-research", summary: "半導体を加工するための製造装置の会社。", presence: "日本法人の社員紹介で、顧客工場での装置サポート、プロセス改善、営業の仕事が説明されています。", presenceSourceIds: ["jw-lam"], careerUrl: "https://www.lamresearch.com/ja/careers/lrj/", status: "published" },
  { companyId: "infineon", summary: "電力制御や車載・産業用途などの半導体の会社。", presence: "日本の事業紹介では営業・マーケティングに加え、製品開発と品質解析の機能を確認できます。", presenceSourceIds: ["jw-infineon"], careerUrl: "https://www.infineon.com/careers/our-locations/japan", status: "published" },
  { companyId: "applied-materials", summary: "材料を加工して半導体をつくる製造装置の会社。", presence: "日本の採用情報では装置の立ち上げ・保守と、加工条件を改善するプロセス支援が説明されています。", presenceSourceIds: ["jw-applied", "jw-applied-ce"], careerUrl: "https://www.appliedmaterials.com/jp/ja/careers.html", status: "published" },
  { companyId: "asml", summary: "微細な回路パターンを転写する露光装置の会社。", presence: "日本の公式紹介では露光装置の納入・設置・保守を担うカスタマーサポートが中心と説明されています。", presenceSourceIds: ["jw-asml"], careerUrl: "https://www.asml.com/en/careers/working-at-asml/japan", status: "published" },
  { companyId: "micron", summary: "データを記憶するメモリ・ストレージの会社。", presence: "広島勤務の公式職種情報で、製造プロセスの条件づくりと改善の業務を確認できます。", presenceSourceIds: ["jw-micron"], careerUrl: "https://careers.micron.com/", status: "published" },
  { companyId: "tsmc", summary: "顧客が設計した半導体の製造を引き受ける会社。", presence: "日本のデザインセンターでは、先端製造技術を使うための回路・ライブラリーなどの設計を扱っています。", presenceSourceIds: ["jw-tsmc"], careerUrl: "https://www.tsmc.com/static/japanese/careers/designCenter_Japan.htm", status: "published" },
  { companyId: "texas-instruments", summary: "アナログ半導体と組み込み処理向け半導体の会社。", presence: "", presenceSourceIds: [], careerUrl: "https://careers.ti.com/", status: "pending", pendingReason: "日本の具体的な技術業務の公式資料を追加確認中です。技術職がないことを意味しません。" },
  { companyId: "analog-devices", summary: "現実世界の信号を測り、変換・処理する半導体の会社。", presence: "日本法人の募集要項では、東京・大阪・名古屋勤務のFAE職を確認できます。", presenceSourceIds: ["jw-adi"], careerUrl: "https://www.analog.com/jp/careers.html", status: "published" },
];

const work = (entry: Omit<JapanWorkEvidence, "checkedAt" | "nextReviewAt" | "status">): JapanWorkEvidence => ({ ...entry, checkedAt: japanWorkUpdatedAt, nextReviewAt, status: "published" });

export const japanWorkEvidence: JapanWorkEvidence[] = [
  work({ id: "kla-install", companyId: "kla", categories: ["equipment"], officialTitle: "設置エンジニア／カスタマーサービス", titleKind: "role", summary: "日本の顧客に近い拠点から、装置の設置やサービスを支える役割です。", prefectures: [], locationIds: [], workplace: "日本。職種と個別拠点の対応は未確認です。", unknowns: "担当装置、配属拠点、顧客先での勤務形態は個別に確認が必要です。", classificationReason: "日本紹介の設置・カスタマーサービスの記述から装置の導入・保守に分類。", sourceIds: ["jw-kla"] }),
  work({ id: "kla-fae", companyId: "kla", categories: ["application"], officialTitle: "Field Application Engineer (E)", titleKind: "role", summary: "顧客の製造現場でKLA製品を導入・活用する際の技術支援を担う仕事です。", prefectures: ["神奈川県"], locationIds: [], workplace: "公式職種情報の勤務地は横浜。顧客の製造施設への技術支援が記載されています。", unknowns: "横浜本社の住所と、この職種の実際の就業場所は同一と断定していません。現在の募集状況は公式で確認してください。", classificationReason: "国内勤務地とtechnical applications supportの記載に基づき分類。", sourceIds: ["jw-kla-fae"] }),
  work({ id: "kla-sales", companyId: "kla", categories: ["business"], officialTitle: "営業・マーケティング", titleKind: "role", summary: "日本のチームに営業・マーケティングの役割が紹介されています。", prefectures: [], locationIds: [], workplace: "日本。職種別の都道府県は未確認です。", unknowns: "担当顧客や製品、技術職との分担は個別の職種情報で確認してください。", classificationReason: "日本紹介に明記された営業・マーケティングを分類。", sourceIds: ["jw-kla"] }),
  work({ id: "lam-service", companyId: "lam-research", categories: ["equipment"], officialTitle: "フィールドサービスエンジニア", titleKind: "role", summary: "顧客工場に駐在し、装置の不具合を調べて安定した稼働を支えます。", prefectures: [], locationIds: [], workplace: "日本の社員紹介に顧客工場への駐在の記載があります。", unknowns: "担当工場の都道府県、勤務時間、出張範囲はこの資料では確認していません。", classificationReason: "顧客工場での装置トラブル解決を導入・保守に分類。", sourceIds: ["jw-lam"] }),
  work({ id: "lam-process", companyId: "lam-research", categories: ["process", "application"], officialTitle: "フィールドプロセスエンジニア", titleKind: "role", summary: "装置を使う顧客の生産性を改善し、プロセス面から装置性能の確保と技術提案を担います。", prefectures: [], locationIds: [], workplace: "日本。個別の勤務拠点は未確認です。", unknowns: "担当工程と顧客先での勤務頻度は公式の個別職種情報で確認してください。", classificationReason: "顧客の生産性改善と技術提案の双方を明記した社員紹介に基づく。自社工場の製造職とは区別する。", sourceIds: ["jw-lam"] }),
  work({ id: "infineon-development", companyId: "infineon", categories: ["design"], officialTitle: "Product development", titleKind: "activity", summary: "日本での知見を活かす製品開発の機能が、日本の事業紹介に記載されています。", prefectures: [], locationIds: [], workplace: "日本。開発業務ごとの勤務地は未確認です。", unknowns: "公式の職種名、開発対象、各ラボへの配属は未確認です。事業機能の紹介であり求人ではありません。", classificationReason: "日本の事業機能として明記された製品開発を設計・開発に分類。", sourceIds: ["jw-infineon"] }),
  work({ id: "infineon-analysis", companyId: "infineon", categories: ["quality"], officialTitle: "Quality analysis", titleKind: "activity", summary: "渋谷の日本本社には、顧客支援のための品質解析設備があると説明されています。", prefectures: ["東京都"], locationIds: ["infineon-shibuya"], workplace: "東京都渋谷区の日本本社。品質解析機能の所在地として確認。", unknowns: "品質解析担当の正式な職種名、募集の有無、担当範囲は未確認です。", classificationReason: "本社のquality analysis機能を品質・評価に分類。設備の存在を求人と扱わない。", sourceIds: ["jw-infineon"] }),
  work({ id: "infineon-business", companyId: "infineon", categories: ["business"], officialTitle: "Sales and marketing", titleKind: "activity", summary: "日本の顧客に製品・サービスを届ける営業・マーケティングの業務が紹介されています。", prefectures: [], locationIds: [], workplace: "日本。業務別の配属先は未確認です。", unknowns: "個別職種名と勤務地は公式採用情報で確認してください。", classificationReason: "日本でのsales and marketingの記載に対応。", sourceIds: ["jw-infineon"] }),
  work({ id: "applied-ce", companyId: "applied-materials", categories: ["equipment"], officialTitle: "Customer Engineer（カスタマーエンジニア）", titleKind: "role", summary: "顧客の半導体工場で装置を設置・立ち上げし、点検や不具合対応で稼働を支えます。", prefectures: ["北海道", "岩手県", "三重県", "広島県", "熊本県"], locationIds: [], workplace: "職種情報に千歳・北上・四日市・東広島・熊本を記載。顧客工場での業務です。", unknowns: "参照資料は海外大学の新卒・既卒向けです。中途採用の条件や実際の配属先には一般化しません。", classificationReason: "国内勤務地と設置・定期保守・トラブル対応の職務記載に基づく。", sourceIds: ["jw-applied-ce"] }),
  work({ id: "applied-process", companyId: "applied-materials", categories: ["process", "application"], officialTitle: "プロセス サポート エンジニア", titleKind: "role", summary: "加工条件の組み合わせを調整し、顧客の半導体製造をプロセス面から支えます。", prefectures: [], locationIds: [], workplace: "日本の採用紹介。職種別の都道府県は未確認です。", unknowns: "カスタマーエンジニアの勤務地を、この職種には流用していません。", classificationReason: "日本の採用ページにあるプロセス条件の最適化を、改善と顧客向け技術支援に分類。", sourceIds: ["jw-applied"] }),
  work({ id: "asml-service", companyId: "asml", categories: ["equipment"], officialTitle: "CS Kumamoto Field Service Engineer (1st line FSE)", titleKind: "role", summary: "顧客先で露光装置の状態を監視し、機械・電気・光学などの不具合対応や保守を行います。", prefectures: ["熊本県"], locationIds: [], workplace: "熊本の顧客先。公式職種情報には現地でのシフト勤務を記載。", unknowns: "掲載例の勤務条件をASML全職種へ一般化しません。最新条件は公式情報を確認してください。", classificationReason: "熊本の個別職種に明記された装置保守・修理から分類。", sourceIds: ["jw-asml-fse"] }),
  work({ id: "micron-process", companyId: "micron", categories: ["process"], officialTitle: "Advanced Technology Japan Process Engineer, Dry Etch", titleKind: "role", summary: "製造プロセスの条件をつくり、装置条件の調整、新しい材料・設備の評価、異常の分析を進めます。", prefectures: ["広島県"], locationIds: [], workplace: "公式職種情報の勤務地は広島。個別建屋との対応は未確認です。", unknowns: "広島工場の住所を就業先として断定していません。配属チームや担当装置は個別に確認してください。", classificationReason: "広島勤務のプロセス条件確立・改善を主業務として分類。評価を含むが独立した品質職の根拠にはしない。", sourceIds: ["jw-micron"] }),
  work({ id: "tsmc-design", companyId: "tsmc", categories: ["design"], officialTitle: "メモリー設計／カスタムレイアウト設計／デジタルレイアウト設計／スタンダードセル開発", titleKind: "role", summary: "先端製造技術を使う回路や、設計に繰り返し使う部品・ライブラリーを開発する仕事です。", prefectures: ["神奈川県"], locationIds: ["tsmc-design-yokohama"], workplace: "横浜・みなとみらいのTSMC Japan Design Center。", unknowns: "資料には過去の説明会案内も含まれます。募集人数や開催日を現在の情報として扱っていません。", classificationReason: "日本デザインセンターの職種・勤務地・DTPの役割を根拠に分類。受託製造という世界の事業モデルから推定していない。", sourceIds: ["jw-tsmc"] }),
  work({ id: "adi-fae", companyId: "analog-devices", categories: ["application"], officialTitle: "Field Application Engineer", titleKind: "role", summary: "半導体の使い方について技術的な知識を提供し、顧客のシステム設計を支援します。", prefectures: ["東京都", "大阪府", "愛知県"], locationIds: [], workplace: "日本の募集要項に東京本社（港区）・大阪オフィス・名古屋オフィスを記載。", unknowns: "参照資料は新卒・既卒等向けです。経験者向け募集の条件や各拠点の担当製品は別途確認してください。", classificationReason: "日本のFAE募集要項と公式のFAE仕事内容の説明を組み合わせる。顧客設計の支援を自社の回路設計職とは区別。", sourceIds: ["jw-adi", "jw-adi-fae"] }),
];
