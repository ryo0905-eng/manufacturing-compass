# 日本の半導体企業・拠点マップ 企画仕様

最終更新日: 2026-09-03

## 状態

企画・データパイロット段階です。公開ページと地図UIは未実装です。

Search Console では全国の半導体工場マップ・一覧に関する初期需要を確認済みです。都道府県別の需要はまだ小さいため、公式情報を使った拠点データの更新負荷を確認してから公開MVPへ進みます。

## 目的

日本国内で半導体に関わる仕事を検討する人が、会社名だけでなく、勤務地、拠点の役割、関連職種から選択肢を探せるようにします。

中心となる流れは次です。

```text
半導体業界を知る
  → 日本のどこに、どのような拠点があるか知る
  → 自分の経験と接点のある職種・企業を調べる
  → 求人票で確認する条件を整理する
  → 必要な場合だけ相談準備・転職エージェント比較へ進む
```

企業や拠点の存在を、現在の求人、採用可能性、転職難易度と同一視しません。

## 対象ユーザー

初期の主対象は、勤務地の制約を持ちながら半導体業界への転職を検討する製造業経験者です。

- 生産技術、品質保証、設備保全、製造、装置設計、電気・制御、製造DXの経験者
- 電子部品、自動車、産業機械、化学などの経験を半導体へつなげたい人
- 転居せず通える範囲で選択肢を探したい人
- Uターン・Iターンを検討している人
- 半導体業界内で勤務地または職種を変えたい人

学生向けの網羅的な企業名鑑、全製造業の事業所検索、求人検索サイトの代替は初期対象にしません。

## 既存ページとの境界

| URL | 中心検索意図 | 役割 |
| --- | --- | --- |
| `/industry-map` | 半導体 業界地図 | 工程、企業分類、職種の関係を理解する |
| `/companies` | 半導体 メーカー 一覧 | 世界・日本の企業を分野、製品、職種から調べる |
| `/semiconductor-map` | 半導体 工場 日本、半導体 企業 地図 | 国内拠点を地域、拠点種別、職種から探す |
| `/semiconductor-map/[prefecture]` | 半導体 企業 熊本、半導体 企業 大阪 | 都道府県内の企業、拠点、仕事の違いを理解する |
| `/companies/[slug]` | 企業名 転職、企業名 仕事内容 | 企業単位の事業、国内拠点、キャリア準備を調べる |

`/industry-map` と `/semiconductor-map` を一つの画面へ統合しません。前者は産業構造、後者は地理と勤務地の探索に限定し、相互リンクします。

## MVP

### 公開MVPの目安

- 20〜25社
- 50〜70拠点
- 最初は1〜2件のindex可能な都道府県ページ
- 全国ハブを主対象とし、最初の都道府県候補は熊本とする
- 大阪、三重、広島、北海道、関東は、検索需要と固有データを確認してから拡張候補とする
- 工場、研究開発、設計、本社・事業所、フィールドサービスを区別する
- 生産・プロセス、設備、品質、装置開発、設計・ソフト、FAE・フィールドの職種分類を持つ

掲載数だけを増やさず、公開する全拠点で、拠点名、所在地、役割、出典、確認日をそろえます。

Search Console の初期データでは全国の「半導体 工場 マップ／一覧」に需要が集まり、都道府県別の表示は熊本に限られています。初期公開時に4〜6件の地域ページを同時作成せず、全国ページの利用と検索流入を確認してから増やします。

### データパイロット

公開実装前に、10社・20拠点を目安として次を確認します。

- 公式情報から拠点名と役割を特定できるか
- 拠点と職種の接点を、推測せず説明できるか
- 1拠点あたりの調査時間
- 採用情報を拠点単位で確認できる割合
- 同じ会社の本社、工場、研究所、サービス拠点を分離できるか
- 住所が非公開の場合の座標精度を明示できるか

パイロットは、既存の個別キャリア情報がある企業を優先します。地域別の候補数が不足する場合は、日本の主要雇用拠点を持つ企業を追加調査します。

### MVPに含めないもの

- 求人情報の転載、自動連携、自動公開
- 求人数のリアルタイム表示
- 年収条件による絞り込み
- 応募機能
- ログイン、お気に入り、検索履歴保存
- 現在地、通勤経路、通勤時間の取得
- 半導体との関係を確認できない電子部品企業の一括掲載
- 全47都道府県の薄いSEOページ

## UI / UX

### 共通

- 日本地図と結果一覧を同期する
- 都道府県、拠点種別、職種を主要フィルターにする
- 業界カテゴリと工程は追加条件として扱う
- 企業名、拠点名、製品・技術を検索できるようにする
- 結果件数を条件変更と同時に更新する
- 地図を操作しなくても、初期HTMLの一覧から全公開情報へ到達できるようにする

### デスクトップ

- 地図と拠点一覧を同時表示する
- 都道府県選択時に対象地域を強調する
- 拠点選択時に詳細パネルを表示する

### モバイル

- 一覧を初期表示にする
- 地図は明示的な切り替えで表示する
- 都道府県は検索またはチップから選択する
- 拠点詳細はボトムシートまたは一覧内展開で表示する
- 一度に表示する主要フィルターを3種類までにする

### 拠点カード

- 企業名、拠点名、市区町村
- 拠点種別
- 半導体領域と主な製品・技術
- 関連する職種
- 採用情報の確認状態と確認日
- 企業詳細への内部リンク
- 公式採用情報への外部リンク

地図上のピンやカードへ転職エージェント広告を直接混ぜません。

## データ設計

会社単位の `Company` と、拠点単位の `CompanyLocation` を分離します。拠点情報を `Company.locationsJapan` の自由な文字列だけで管理しません。

### CompanyLocation

```ts
type LocationEntity = {
  legalEntityName: string;
  relationship:
    | "operator"
    | "co-located"
    | "facility-management"
    | "field-service";
  sourceIds: string[];
};

type LocationStatusEvent = {
  type:
    | "opening"
    | "expansion"
    | "production-end"
    | "closure"
    | "relocation";
  announcedAt: string;
  effectiveAt?: string;
  expectedTimingText?: string;
  note: string;
  sourceId: string;
};

type LocationFacility = {
  id: string;
  name: string;
  locationTypes: LocationType[];
  mainProducts: string[];
  jobFamilies: JobFamily[];
  operationalStatus:
    | "operating"
    | "under-construction"
    | "planned"
    | "status-unconfirmed";
  statusEvents?: LocationStatusEvent[];
  sourceIds: string[];
};

type CompanyLocation = {
  id: string;
  companyId: string;
  legalEntities: LocationEntity[];
  slug: string;
  name: string;
  campusId?: string;
  prefectureCode: string;
  prefectureSlug: string;
  municipality: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    precision:
      | "facility"
      | "parcel"
      | "residential-detail"
      | "machiaza"
      | "municipality"
      | "prefecture";
    method: "official-map" | "address-geocode" | "named-facility";
    sourceId: string;
    verifiedAt: string;
    reviewStatus: "automated-check" | "human-reviewed";
  };
  locationTypes: LocationType[];
  industryCategories: LocationIndustryCategory[];
  processIds: string[];
  mainProducts: string[];
  jobFamilies: JobFamily[];
  facilities?: LocationFacility[];
  statusEvents?: LocationStatusEvent[];
  sourceIds: string[];
  lastVerifiedAt: string;
  operationalStatus:
    | "operating"
    | "under-construction"
    | "planned"
    | "status-unconfirmed";
  contentStatus: "complete" | "draft";
};
```

`companyId` は企業詳細へつなぐ親企業、`legalEntities` は実際に拠点を運営・利用する国内法人や事業会社を示します。Micron広島やTEL府中のように同じ住所へ複数法人が入る場合も、一つの物理拠点として表示できます。

JASM熊本のように同じキャンパス内で稼働中の工場と建設中の工場が混在する場合は、`facilities` で施設ごとの稼働状態を分けます。近接する別住所の拠点を一つの地区としてまとめる必要がある場合だけ `campusId` を使います。

ルネサス高崎のように、現在は稼働中でも生産終了や閉鎖が発表済みの場合は、現在状態を `operationalStatus`、将来変更を `statusEvents` に分けます。時期が公式に確定していない場合は日付へ丸めず、公式発表の表現を `expectedTimingText` に保持します。工場だけが対象で研究開発機能は継続する場合は、物理拠点全体ではなく該当する `facility` に履歴を付けます。

### HiringSignal

採用情報は変動が大きいため、拠点の基本情報から分離します。

```ts
type HiringSignal = {
  id: string;
  companyId: string;
  locationId?: string;
  locationFacilityId?: string;
  status:
    | "official-opening-confirmed"
    | "career-page-available"
    | "no-current-opening-confirmed"
    | "review-expired";
  careerUrl: string;
  roleLabels: string[];
  sourceId: string;
  checkedAt: string;
  expiresAt: string;
};
```

`no-current-opening-confirmed` は「募集なし」ではなく、確認時点で該当する公式求人を確認できなかった状態です。

### 分類

拠点種別は複数選択を許可します。

- `headquarters`
- `office`
- `factory`
- `research-development`
- `design-center`
- `field-service`
- `logistics`

職種は企業ごとの表記をそのまま検索軸にせず、共通の `JobFamily` へ対応付けます。原文の職種名は別途保持します。

- `process-production`
- `equipment-facility`
- `quality-reliability`
- `equipment-development`
- `circuit-software-design`
- `field-application-service`
- `supply-chain-corporate`

## 情報源と更新

### 優先順位

1. 企業公式の会社情報、国内拠点、事業所情報
2. 企業公式の採用ページ、公式求人
3. IR、統合報告書、公式ニュースリリース
4. 経済産業局、自治体などの企業集積・事業所マップ
5. 業界団体の会員情報

公的マップは候補発見と照合に使い、現在の採用状況を示す根拠には使いません。

### 更新周期

- 拠点の存在と役割: 6〜12か月
- 公式採用ページの有無: 1〜3か月
- `official-opening-confirmed`: 2〜4週間
- 新設、閉鎖、増設などの公式発表: 発見時に反映し、稼働中と計画段階を区別する
- 将来変更が発表済みの拠点: 3か月ごと、または追加の公式発表時

期限を過ぎた採用情報は削除せず `review-expired` とし、募集中フィルターから外します。

### 座標

- 企業公式住所を入力元とし、ジオコーダの正規化結果と一致レベルを保存する
- 「住所精度」の一語へまとめず、施設、地番、住居番号、町字、市区町村、都道府県を区別する
- 市区町村代表点を工場・研究所のピンとして公開しない
- 住所検索結果と、公式地図または施設名検索結果を照合する
- 自動照合だけでは `human-reviewed` にしない
- 座標の生成元、確認日、利用条件を追跡できるようにする
- API結果の保存・再配布・別地図への表示条件を確認し、本番利用できるデータだけを公開データへ移す

パイロットではデジタル庁アドレス・ベース・レジストリを使う住所検索と施設名検索を精度検証に利用します。本番候補は、自前で実行するABRジオコーダ、利用条件を満たす地図サービス、または企業公式の地図情報です。第三者APIの結果を、利用条件の確認なしに別の地図ライブラリへ表示しません。

### 公開基準

拠点を `complete` にするには、少なくとも次を満たします。

- 企業ID、正式な拠点名、都道府県、市区町村がある
- 拠点を運営する法人を確認できる
- 半導体との関係を公式情報で確認できる
- 拠点種別を確認できる
- 出典URL、発行元、確認日がある
- 座標精度を説明できる
- 座標の生成元と利用条件を確認できる
- 稼働中、建設中、計画中、確認不能を区別している
- 生産終了、閉鎖、移転などの発表済み変更を現在状態と分けている
- 拠点の存在と現在の求人を混同していない

職種を拠点へ紐づける場合は、公式求人、拠点別採用情報、公式な職種紹介のいずれかを根拠にします。会社全体の職種しか確認できない場合は、拠点固有の職種として表示しません。

## SEO

- `/semiconductor-map` は「日本の半導体企業・工場・研究拠点」を中心意図にする
- 都道府県ページは5拠点以上、複数企業、固有説明、出典がある場合を公開目安にする
- 初期の都道府県ページは1〜2件までとし、Search Console の表示だけでなく、地域固有の企業・拠点データと説明をそろえられる場合だけindexする
- 条件パラメータは共有に使用できるが、無制限にindexさせない
- 地図内の重要情報をClient Componentだけに閉じ込めない
- `BreadcrumbList` と `ItemList` を基本にする
- 実際の求人詳細を掲載しない限り `JobPosting` を使用しない
- 企業詳細は既存 `/companies/[slug]` をcanonicalとし、拠点ページへ企業説明を重複させない

## 既存導線との統合

- ランキングから「日本のどこに拠点があるか」へつなぐ
- 業界地図から、選択した工程・企業分類の国内拠点へつなぐ
- 企業一覧から、都道府県・拠点種別による探索へつなぐ
- 企業詳細へ確認済みの国内拠点一覧を表示する
- Career Compass で「勤務地を優先」を選んだ場合、結果から拠点マップへつなぐ
- 拠点マップから企業詳細、関連工程記事、Career Compassへ戻れるようにする

Career Compass の結果は採用可能性を示しません。職種または企業分類で地図を絞る場合も、経験との一般的な接点として扱います。

## 計測

- `location_map_prefecture_select`
- `location_map_filter_use`
- `location_map_location_open`
- `location_map_company_click`
- `location_map_official_career_click`
- `location_map_career_compass_click`

イベント値は都道府県コード、有限の職種分類、拠点種別などに限定します。自由入力の検索語、詳細な希望勤務地、Career Compass の回答一式は送信しません。

## 公開判断

全国の工場マップ・一覧に関する検索表示は確認できたため、公開MVPへ進む前に残りの条件を確認します。

- 10社・20拠点のパイロットを同じ品質基準で作成できる
- 採用状態と拠点の存在を分離して表示できる
- 更新期限切れを検出できる
- 既存の企業詳細、企業一覧、業界地図と検索意図が重複しない
- 熊本などの都道府県ページは、5拠点以上、複数企業、地域固有の説明をそろえられる

初期公開後は、掲載数より、都道府県選択、拠点詳細、企業詳細、公式採用情報、Career Compassへの遷移を一連で評価します。
