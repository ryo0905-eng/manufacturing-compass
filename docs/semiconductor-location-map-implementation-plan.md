# 日本の半導体企業・拠点マップ 実装計画

最終更新日: 2026-09-05

## 状態

公開V0の実装順序と変更ファイル案です。コード変更、パッケージ追加、ルート追加はまだ行っていません。

V0は公式確認済み10社・24拠点の一覧と都道府県選択図で需要を検証します。正確な施設ピン、Leaflet、背景タイル、座標はV1へ延期します。実装へ進む場合に、`docs/PRD.md`、`docs/architecture.md`、`docs/database.md`、`docs/seo.md`、`docs/conversion-architecture.md` を実際の変更と同じ作業単位で更新します。

## V0実装前ゲート

次を満たしたため、V0は公開実装へ進める判断です。

- 10社・24拠点の名称、住所、役割、出典、確認日を企業公式情報で確認している
- 採用状態を拠点の存在情報から分離している
- 都道府県選択図が施設位置を示すものではないと明記できる
- 全国ページだけをindexし、薄い都道府県ページを作らない
- 座標と第三者地図データをV0で使用しない

代表10拠点のhuman reviewはV1の実装前ゲートとして残します。

## 実装原則

- 全国ページの静的な拠点一覧を最初に完成させ、都道府県選択図を後から追加する
- 拠点一覧と都道府県選択図は、同じ静的データと同じ絞り込み結果を使う
- Server Componentをページの入口とし、操作部分だけClient Componentにする
- 実行時ジオコーディング、データベース、ログイン、求人APIを追加しない
- 都道府県選択図を使わなくても、静的一覧だけで検索意図へ答えられるようにする
- 公開前の開発はPreviewで行い、V0の公開基準を満たすまでsitemapと既存ページからリンクしない
- 既存 `Company.locationsJapan` を一度に削除せず、確認済み企業から段階的に置き換える

## 実装順序

### 1. 型と静的データ

状態: 2026-09-04 完了

最初にUIから独立したデータ層を作ります。

新規候補:

- `src/types/company-location.ts`
- `src/data/company-locations.ts`
- `src/data/hiring-signals.ts`
- `src/lib/company-locations.ts`

役割:

- `company-location.ts`: 拠点、施設、法人関係、状態変更、座標、採用シグナルの型
- `company-locations.ts`: 物理拠点、施設、出典、公開状態
- `hiring-signals.ts`: 短い周期で更新する公式採用情報
- `company-locations.ts`のlib側: 企業、都道府県、拠点種別、職種による純粋な取得・絞り込み

データファイルと取得関数を同名にする場合は、`@/data/company-locations` と `@/lib/company-locations` のimport元を明示します。混乱が大きければlib側だけ `location-filters.ts` とします。

完了条件:

- 重複する拠点IDがない
- 全 `companyId` が既存企業データに存在する
- 全 `sourceId` が定義済みである
- `complete` の拠点だけが公開対象になる
- V0の公開判定に座標を使用しない
- 期限切れ採用情報を `official-opening-confirmed` として返さない

### 2. 地図なしの全国ページ

状態: 2026-09-04 完了。実装時は `noindex, follow` とし、2026-09-05のSEO設定完了時に全国URLだけindex対象へ変更

先に検索エンジンと地図を使えないユーザーへ価値を提供します。

新規候補:

- `src/app/semiconductor-map/page.tsx`
- `src/components/SemiconductorLocationCard.tsx`
- `src/components/semiconductor-location-map.module.css`

初期内容:

- metadataとcanonical
- BreadcrumbList
- 公開拠点のItemList
- ページの役割、掲載数、更新日
- 全公開拠点の一覧
- 掲載基準、求人状態、座標精度の説明
- 企業詳細へのリンク

この段階ではLeafletを追加しません。一覧だけで「半導体 工場 日本」「半導体 企業 地図」の検索意図へどこまで答えられるかをPreviewで確認します。

完了条件:

- JavaScript無効でも全公開拠点を読める
- 企業名、拠点名、都道府県、市区町村、拠点種別、役割、確認日を表示できる
- 企業説明を既存企業詳細から重複転載しない
- 求人状態を会社や拠点の恒久属性として表示しない

### 3. 検索と絞り込み

状態: 2026-09-04 完了。有限の3条件だけURLへ同期し、自由入力検索語は計測・URLへ送らない

新規候補:

- `src/components/SemiconductorLocationExplorer.tsx`

主要機能:

- 企業名、拠点名、製品・技術の検索
- 都道府県、拠点種別、職種の主要3フィルター
- 業界分類、稼働状態、期限内の公式求人確認の追加フィルター
- 適用中条件、件数、個別解除、全解除
- 0件表示
- 一覧／地域選択の切り替えのうち、一覧側の状態管理

検索結果はClient Componentの初期レンダーにも含め、初期HTMLから一覧が消えない構成にします。自由入力検索語をAnalyticsへ送りません。

完了条件:

- 同じ条件から毎回同じ結果が返る
- 複数種別を持つ拠点を正しく検索できる
- 期限切れ求人が求人フィルターへ残らない
- 条件付きURLを共有して同じ状態を復元できる
- パラメータ付きURLはindex対象にしない

### 4. 都道府県選択図の追加

状態: 2026-09-04 完了。47都道府県を8地域に分け、掲載県だけ件数付きで選択可能にする

変更候補:

- `src/components/SemiconductorPrefectureSelector.tsx`
- `src/components/SemiconductorLocationExplorer.tsx`
- `src/components/semiconductor-location-map.module.css`

実装方針:

- 北海道、東北、関東、中部、近畿、中国、四国、九州・沖縄の地域ブロックに都道府県ボタンを配置する
- 公開拠点がある都道府県だけ件数を表示し、選択可能にする
- 選択中の都道府県と一覧の絞り込み状態を一つの親コンポーネントで管理する
- 地理的な距離や施設位置を示す地図ではないと明記する
- 外部SVG、地理データ、座標、背景タイル、地図パッケージを使わない

完了条件:

- 都道府県選択と一覧が同期する
- 選択図を閉じても条件を失わない
- 地理的な配置を理解できなくても都道府県名から選べる
- キーボードと一覧だけで同じ情報へ到達できる
- 0件の都道府県を選択できない

### 5. SEOと全国ページの公開設定

状態: 2026-09-05 完了。全国URLだけをindexし、パラメータURLはnoindex、canonicalは全国URLへ統一する

新規候補:

- `src/app/sitemap.ts`

V0では `/semiconductor-map` だけをindexし、sitemapへ追加します。熊本は2拠点のため、`/semiconductor-map/kumamoto` を含む都道府県ページは作りません。

完了条件:

- 全国ページのcanonicalが `/semiconductor-map` である
- パラメータ付き絞り込みURLをindex対象にしない
- 全国ページをsitemapへ追加する
- 画面にない求人や企業情報を構造化データへ追加しない

### 6. 既存ページとの接続

状態: 2026-09-05 完了。企業一覧、業界地図、確認済み企業詳細、勤務地優先のCareer Compass結果から接続

変更候補:

- `src/app/companies/page.tsx`
- `src/app/companies/[slug]/page.tsx`
- `src/app/industry-map/page.tsx`
- `src/components/CareerCompassTool.tsx`
- `src/app/sitemap.ts`

接続順:

1. 企業一覧から `日本の拠点を地図で探す`
2. 業界地図から `この分野の国内拠点を見る`
3. 企業詳細へ確認済み国内拠点を表示
4. Career Compassで `勤務地を優先` を選んだ結果から拠点マップへ誘導
5. 全国ページをsitemapへ追加

グローバルヘッダーへの追加は初期公開に含めません。既存ページからの利用と検索流入を確認し、主要導線に昇格させる価値がある場合に判断します。

企業詳細では、現在の自由文字列 `locationsJapan` を直ちに削除しません。確認済み `CompanyLocation` がある企業だけ、構造化された拠点一覧へ置き換えます。

### 7. 計測と公開確認

状態: 2026-09-05 実装完了、実ブラウザ確認待ち

変更候補:

- `src/lib/analytics.ts`
- `tests/e2e/semiconductor-location-map.spec.ts`
- `docs/PRD.md`
- `docs/architecture.md`
- `docs/database.md`
- `docs/seo.md`
- `docs/conversion-architecture.md`
- `TASKS.md`

Analyticsには拠点マップ用の有限イベント型を追加します。

- 都道府県選択
- 有限分類のフィルター利用
- 拠点詳細表示
- 企業詳細への遷移
- 公式採用情報への遷移
- Career Compassへの遷移

Playwrightは既存のDesktop ChromeとPixel 7設定を使い、次を確認します。

- 全国ページの初期一覧
- モバイルで一覧が初期表示される
- 検索と主要3フィルター
- 0件からの条件解除
- 一覧／都道府県選択図の切り替え
- 拠点選択と企業詳細への遷移
- 全国ページのcanonical
- キーボードによる主要操作

有限イベント型と各UIからの送信、上記を対象にしたE2Eを追加しました。検索語そのものは送らず、検索利用時は結果件数だけを送ります。`npm run typecheck` は通過しました。E2Eはsandbox内でポート権限エラー、権限許可後はNext.js開発サーバーが60秒以内に応答せず停止したため、同日中の再試行はせずPreview確認へ引き継ぎます。

## 変更しないもの

- Supabaseや外部データベース
- ログイン、お気に入り、保存履歴
- 求人API、求人転載、応募機能
- 現在地、通勤時間、経路検索
- 年収フィルター
- 全47都道府県のページ
- 企業一覧と業界地図の既存検索意図
- 未確認企業のindex設定

## 作業単位

変更を次の小さな単位に分けます。

1. `data`: 型、公式確認済み10社・24拠点、取得関数
2. `list`: 全国ページ、静的一覧、掲載基準
3. `filters`: 検索、主要3フィルター、URL状態
4. `prefecture-selector`: 都道府県選択図と一覧同期
5. `seo`: 全国ページのcanonical、構造化データ、sitemap
6. `integration`: 企業一覧、企業詳細、業界地図、Career Compass、sitemap
7. `measurement`: 型付きイベント、E2E、正本文書更新

各単位で差分を確認し、コード変更では `npm run typecheck` を最大1回実行します。`npm run build` は明示的に依頼された場合だけ実行します。ブラウザ確認はインタラクティブUIを実装し、確認を依頼された段階でPC・スマホを確認します。

## 公開判定

Previewで次を満たした場合だけV0を公開します。

- 10社・24拠点の公開データがある
- 全公開拠点に正式名称、所在地、役割、出典、確認日がある
- 全国ページが都道府県選択図なしでも検索意図へ答えている
- 都道府県選択図が施設位置を表さないことを明記している
- 座標と背景地図を読み込まない
- 求人期限切れ、建設中、閉鎖予定を誤表示しない
- モバイルの一覧、絞り込み、地域選択が利用できる
- sitemap、canonical、robots、内部リンクが矛盾しない
- Analyticsへ自由入力や個人情報を送らない

2026-09-05時点で、データ、表示、SEO、内部導線、計測コードは上記基準を満たしています。残る公開ゲートは、Preview上でDesktop Chrome・Pixel 7のE2Eを完走させることです。

条件を満たさない場合は、公開件数を水増しせずPreviewのままデータ整備へ戻ります。

## V1への移行条件

正確な施設ピンは、V0公開後に次を満たした場合だけ追加します。

- 都道府県選択、拠点詳細、企業詳細への遷移から利用需要を確認できる
- 代表10拠点の座標レビューを完了している
- 公開する各ピンが `human-reviewed` である
- 座標ソースの保存・表示条件と出典を確認している
- 詳細地図が一覧よりユーザーの判断を改善すると説明できる

V1の変更候補は、`package.json`、`package-lock.json`、`src/components/SemiconductorLocationMap.tsx` です。Leaflet、地理院淡色タイル、ABR Geocoderの採用案は、V0の利用結果を見て再確認します。
