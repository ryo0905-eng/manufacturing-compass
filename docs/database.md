# Database Design

## 方針

企業情報、財務情報、採用情報には、必ず情報ソース URL と最終更新日を持たせます。推測値は使わず、不確かな情報は不確かと明記します。

Phase 1 では、これらのモデルをローカル静的データとして実装する想定です。将来 Supabase に移行しやすいように、ID、slug、参照関係、情報ソースは最初から明示します。

## Phase 1 必須データ

Phase 1 の初期公開に最低限必要なデータは以下です。

- Company
- IndustrySegment
- CompanySegment
- CareerInfo
- AffiliatePartner

CompanyMetric、CompanyLocation、Article、ComparisonPage は Phase 1 で必要な範囲だけ最小限に作成し、詳細化は Phase 2 以降で行います。

## Entity: Company

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| slug | string | URL 用識別子 |
| name | string | 英語名 |
| nameJa | string | 日本語名 |
| summary | string | 会社概要 |
| headquartersCountry | string | 本社所在国 |
| websiteUrl | string | 公式サイト |
| careerUrl | string | 採用ページ |
| industrySegments | string[] | 関連セグメント |
| businessModel | string | IDM、ファブレス、ファウンドリ等 |
| mainProducts | string[] | 主力製品 |
| competitors | string[] | 競合企業 ID |
| revenue | number | 売上 |
| operatingIncome | number | 営業利益 |
| marketCap | number | 時価総額 |
| employees | number | 従業員数 |
| fiscalYear | string | 数値の対象年度 |
| currency | string | 売上・利益・時価総額の通貨 |
| japanPresence | string | 日本での事業状況 |
| locationsJapan | string[] | 日本拠点 |
| englishRequirement | string | 英語必要度 |
| jobCategories | string[] | 募集職種カテゴリ |
| careerSummary | string | 転職者向け要約 |
| affiliateCtaType | string | CTA 種別 |
| sources | Source[] | 情報ソース |
| lastUpdated | string | 最終更新日 |

## Entity: IndustrySegment

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| slug | string | URL 用識別子 |
| name | string | セグメント名 |
| description | string | 説明 |
| parentSegmentId | string | 親セグメント |
| relatedCompanyIds | string[] | 関連企業 |
| sources | Source[] | 情報ソース |
| lastUpdated | string | 最終更新日 |

## Entity: CompanySegment

| Field | Type | Note |
| --- | --- | --- |
| companyId | string | 企業 ID |
| segmentId | string | セグメント ID |
| role | string | その企業の役割 |
| importance | string | 主力、関連、補助など |

## Entity: ProductCategory

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| slug | string | URL 用識別子 |
| name | string | 製品カテゴリ名 |
| description | string | 説明 |
| segmentIds | string[] | 関連セグメント |
| companyIds | string[] | 関連企業 |

## Entity: CompanyMetric

| Field | Type | Note |
| --- | --- | --- |
| companyId | string | 企業 ID |
| fiscalYear | string | 会計年度 |
| revenue | number | 売上 |
| operatingIncome | number | 営業利益 |
| marketCap | number | 時価総額 |
| employees | number | 従業員数 |
| currency | string | 通貨 |
| sources | Source[] | 情報ソース |
| lastUpdated | string | 最終更新日 |

## Entity: CompanyLocation

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| companyId | string | 企業 ID |
| country | string | 国 |
| region | string | 地域 |
| city | string | 都市 |
| role | string | 拠点の役割 |
| sources | Source[] | 情報ソース |
| lastUpdated | string | 最終更新日 |

## Entity: CareerInfo

| Field | Type | Note |
| --- | --- | --- |
| companyId | string | 企業 ID |
| sources | Source[] | 情報ソース |
| lastUpdated | string | 最終更新日 |
| typicalRoles | string[] | 代表的な職種 |
| recommendedExperience | string[] | 推奨経験 |
| usefulSkills | string[] | 有用なスキル |
| englishLevel | string | 英語目安 |
| helpfulCertifications | string[] | 役立つ資格 |
| typicalCareerPaths | string[] | よくあるキャリアパス |
| suitableBackgrounds | string[] | 今狙いやすい経歴 |
| stretchBackgrounds | string[] | 将来狙える経歴 |
| preparationActions6Months | string[] | 半年の準備 |
| preparationActions1Year | string[] | 1年の準備 |
| steppingStoneCompanies | string[] | ステップになる会社 |
| notes | string | 補足 |

## Entity: CareerReadiness

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| roleSlug | string | 職種識別子 |
| currentBackground | string | 現在の経験 |
| reachableCompanies | string[] | 今狙いやすい会社 |
| stretchCompanies | string[] | 将来狙える会社 |
| gaps | string[] | 準備課題 |
| nextActions | string[] | 次の行動 |

## Entity: CareerRoadmap

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| targetRole | string | 目標職種 |
| targetCompanyIds | string[] | 目標企業 |
| actionsNow | string[] | 今日からできる行動 |
| actions6Months | string[] | 半年の行動 |
| actions1Year | string[] | 1年の行動 |
| steppingStoneRoles | string[] | ステップ職種 |
| steppingStoneCompanies | string[] | ステップ企業 |

## Entity: AffiliatePartner

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| name | string | パートナー名 |
| url | string | アフィリエイト URL |
| category | string | 転職エージェント等 |
| targetUser | string | 対象ユーザー |
| disclosureText | string | 広告表記 |
| isActive | boolean | 有効状態 |

## Entity: Article

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| slug | string | URL 用識別子 |
| title | string | タイトル |
| description | string | 説明 |
| category | string | カテゴリ |
| targetKeywords | string[] | 対象キーワード |
| relatedCompanyIds | string[] | 関連企業 |
| sources | Source[] | 情報ソース |
| lastUpdated | string | 最終更新日 |

## Entity: ComparisonPage

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| slug | string | URL 用識別子 |
| companyIds | string[] | 比較企業 |
| title | string | タイトル |
| comparisonAxes | string[] | 比較軸 |
| summary | string | 要約 |
| targetKeywords | string[] | 対象キーワード |
| sources | Source[] | 情報ソース |
| lastUpdated | string | 最終更新日 |

## Shared Type: Source

| Field | Type | Note |
| --- | --- | --- |
| title | string | 情報源名 |
| url | string | URL |
| publisher | string | 発行元 |
| accessedAt | string | 確認日 |
