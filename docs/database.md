# Database Design

## 方針

Phase 1.5 ではローカル静的データで診断を実装する。

将来 Supabase に移行しやすいように、診断、企業、職種、年収レンジ、アフィリエイト CTA を分けて設計する。

年収、企業情報、採用情報には情報ソース URL と最終更新日を持たせる。推測値は断定せず、レンジと目安として表示する。

## Phase 1.5 必須データ

- DiagnosisQuestion
- DiagnosisOption
- DiagnosisRule
- DiagnosisResult
- MarketValueBand
- RoleProfile
- Company
- CareerInfo
- AffiliatePartner
- LearningPartner

## Entity: DiagnosisQuestion

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| order | number | 表示順 |
| title | string | 質問文 |
| description | string | 補足 |
| optionIds | string[] | 選択肢 |
| required | boolean | 必須 |

## Entity: DiagnosisOption

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| questionId | string | 質問 ID |
| label | string | 表示名 |
| description | string | 補足 |
| tags | string[] | 診断用タグ |
| scoreModifiers | object | スコア補正 |

## Entity: DiagnosisRule

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| name | string | ルール名 |
| conditions | object | 適用条件 |
| marketValueScoreDelta | number | 市場価値スコア補正 |
| salaryBandId | string | 年収レンジ |
| reachableRoleIds | string[] | 今狙える職種 |
| stretchRoleIds | string[] | 将来狙える職種 |
| growthLeverIds | string[] | 伸ばすべき要素 |
| ctaIds | string[] | 表示する CTA |

## Entity: DiagnosisResult

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| title | string | 結果タイトル |
| summary | string | 要約 |
| marketValueScore | number | 市場価値スコア |
| salaryRangeCurrent | string | 現在の想定年収レンジ |
| salaryRangePotential | string | 伸ばした後の想定年収レンジ |
| reachableCompanyIds | string[] | 今狙いやすい会社 |
| stretchCompanyIds | string[] | 将来狙える会社 |
| reachableRoleIds | string[] | 今狙いやすい職種 |
| growthLeverIds | string[] | 伸ばすべき要素 |
| actionsToday | string[] | 今日やること |
| roadmap30Days | string[] | 30日ロードマップ |
| roadmap90Days | string[] | 90日ロードマップ |
| roadmap6Months | string[] | 6か月ロードマップ |
| recommendedCtaIds | string[] | 推奨 CTA |
| disclaimer | string | 注意書き |

## Entity: MarketValueBand

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| label | string | 例: Entry, Growth, High Potential |
| scoreMin | number | 最小スコア |
| scoreMax | number | 最大スコア |
| salaryRangeJa | string | 想定年収レンジ |
| description | string | 説明 |
| sources | Source[] | 情報ソース |
| lastUpdated | string | 最終更新日 |

## Entity: RoleProfile

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| slug | string | URL 用識別子 |
| name | string | 職種名 |
| segmentIds | string[] | 関連セグメント |
| typicalSalaryRange | string | 年収レンジ目安 |
| requiredExperience | string[] | 必要経験 |
| usefulSkills | string[] | 有用スキル |
| englishImpact | string | 英語力の影響 |
| nextActions | string[] | 次の行動 |
| sources | Source[] | 情報ソース |
| lastUpdated | string | 最終更新日 |

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
| revenue | string | 売上 |
| operatingIncome | string | 営業利益 |
| marketCap | string | 時価総額 |
| employees | string | 従業員数 |
| fiscalYear | string | 数値の対象年度 |
| currency | string | 通貨 |
| japanPresence | string | 日本での事業状況 |
| locationsJapan | string[] | 日本拠点 |
| englishRequirement | string | 英語必要度 |
| jobCategories | string[] | 募集職種カテゴリ |
| careerSummary | string | 転職者向け要約 |
| sources | Source[] | 情報ソース |
| lastUpdated | string | 最終更新日 |

## Entity: CareerInfo

| Field | Type | Note |
| --- | --- | --- |
| companyId | string | 企業 ID |
| typicalRoles | string[] | 代表的な職種 |
| recommendedExperience | string[] | 推奨経験 |
| usefulSkills | string[] | 有用なスキル |
| englishLevel | string | 英語目安 |
| helpfulCertifications | string[] | 役立つ資格 |
| suitableBackgrounds | string[] | 今狙いやすい経歴 |
| stretchBackgrounds | string[] | 将来狙える経歴 |
| preparationActions6Months | string[] | 半年の準備 |
| preparationActions1Year | string[] | 1年の準備 |
| steppingStoneCompanies | string[] | ステップになる会社 |
| sources | Source[] | 情報ソース |
| lastUpdated | string | 最終更新日 |

## Entity: AffiliatePartner

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| name | string | パートナー名 |
| url | string | アフィリエイト URL |
| category | string | 転職エージェント等 |
| targetUser | string | 対象ユーザー |
| triggerCondition | string | 表示条件 |
| ctaText | string | CTA 文言 |
| disclosureText | string | 広告表記 |
| isActive | boolean | 有効状態 |

## Entity: LearningPartner

| Field | Type | Note |
| --- | --- | --- |
| id | string | 一意 ID |
| name | string | サービス名 |
| category | string | 英語、資格、統計、半導体講座など |
| url | string | アフィリエイト URL |
| targetGap | string | 対応する不足要素 |
| ctaText | string | CTA 文言 |
| disclosureText | string | 広告表記 |
| isActive | boolean | 有効状態 |

## Shared Type: Source

| Field | Type | Note |
| --- | --- | --- |
| title | string | 情報源名 |
| url | string | URL |
| publisher | string | 発行元 |
| accessedAt | string | 確認日 |
