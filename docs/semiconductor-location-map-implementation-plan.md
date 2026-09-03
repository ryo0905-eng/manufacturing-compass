# 日本の半導体企業・拠点マップ 実装計画

最終更新日: 2026-09-04

## 状態

公開MVPへ進むと判断した場合の実装順序と変更ファイル案です。コード変更、パッケージ追加、ルート追加はまだ行っていません。

代表10拠点の座標レビューと公開判断が完了するまで、`docs/PRD.md`、`docs/architecture.md`、`docs/database.md`、`docs/seo.md`、`docs/conversion-architecture.md` は変更しません。実装へ進む場合に、実際の変更と同じ作業単位で更新します。

## 実装前ゲート

次を満たすまで公開コードへ着手しません。

- 代表10拠点を人が確認し、位置の誤りと確認時間を記録している
- 10件中9件以上が `OK` または根拠付き修正済みである
- 市区町村代表点を施設ピンとして使わないことを確認している
- 20拠点以上を `human-reviewed` にできる見通しがある
- 地理院タイルとABRデータの出典表記を確定している
- 公開MVPを20〜25社・50〜70拠点まで整備できる運用時間を確保できる

## 実装原則

- 全国ページの静的な拠点一覧を最初に完成させ、地図は後から追加する
- 拠点一覧と地図は、同じ静的データと同じ絞り込み結果を使う
- Server Componentをページの入口とし、操作部分だけClient Componentにする
- 実行時ジオコーディング、データベース、ログイン、求人APIを追加しない
- 地図が読み込めなくても検索意図へ答えられるようにする
- 公開前の開発はPreviewで行い、公開基準を満たすまでsitemapと既存ページからリンクしない
- 既存 `Company.locationsJapan` を一度に削除せず、確認済み企業から段階的に置き換える

## 実装順序

### 1. 型と静的データ

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
- 地図公開対象は `human-reviewed` の座標だけになる
- 期限切れ採用情報を `official-opening-confirmed` として返さない

### 2. 地図なしの全国ページ

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

新規候補:

- `src/components/SemiconductorLocationExplorer.tsx`

主要機能:

- 企業名、拠点名、製品・技術の検索
- 都道府県、拠点種別、職種の主要3フィルター
- 業界分類、稼働状態、期限内の公式求人確認の追加フィルター
- 適用中条件、件数、個別解除、全解除
- 0件表示
- 一覧／地図切り替えのうち、一覧側の状態管理

検索結果はClient Componentの初期レンダーにも含め、初期HTMLから一覧が消えない構成にします。自由入力検索語をAnalyticsへ送りません。

完了条件:

- 同じ条件から毎回同じ結果が返る
- 複数種別を持つ拠点を正しく検索できる
- 期限切れ求人が求人フィルターへ残らない
- 条件付きURLを共有して同じ状態を復元できる
- パラメータ付きURLはindex対象にしない

### 4. 地図の追加

変更候補:

- `package.json`
- `package-lock.json`
- `src/components/SemiconductorLocationMap.tsx`
- `src/components/SemiconductorLocationExplorer.tsx`
- `src/components/semiconductor-location-map.module.css`

実装方針:

- 安定版のLeaflet 1.9系だけを追加する
- React用ラッパーは、直接統合より実装量が明確に減る場合だけ採用する
- 地図コンポーネントを遅延読み込みし、サーバーでは `window` を参照しない
- 地理院淡色タイルのURLと出典文言を一か所へ置く
- デフォルト画像アイコンへ依存せず、CSSまたはcircle markerでピンを描く
- 絞り込み後の拠点だけを地図へ渡す
- 一覧とピンの選択状態を一つの親コンポーネントで管理する
- 座標未確認の拠点は一覧へ残してもピンを作らない

全国表示で50〜70拠点が読めるかを先に確認し、必要な場合だけ都道府県単位の件数表示を追加します。初回からクラスタリング用パッケージを追加しません。

完了条件:

- 地図を開くまでLeafletとタイルを読み込まない
- 一覧選択とピン選択が同期する
- 地図を閉じても条件と選択状態を失わない
- 可視の地理院タイル出典を常時表示する
- キーボードと一覧だけで同じ情報へ到達できる
- 地図読み込み失敗時も一覧を使い続けられる

### 5. 都道府県SEOページ

新規候補:

- `src/app/semiconductor-map/[prefecture]/page.tsx`

既存の全国ページ用コンポーネントとデータ取得関数を再利用します。初期公開は、5拠点以上、複数企業、地域固有の説明を持てる都道府県だけに限定します。

初期候補:

- `/semiconductor-map/kumamoto`

公開条件を満たさない都道府県は、空ページや薄いテンプレートを生成しません。`generateStaticParams` は公開設定された都道府県だけを返します。

完了条件:

- 全国ページと地域ページでcanonicalが競合しない
- 地域固有の導入、産業上の特徴、拠点一覧、出典を持つ
- 地域ページから全国ページと企業詳細へ戻れる
- 画面にない求人や企業情報を構造化データへ追加しない

### 6. 既存ページとの接続

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
5. 全国ページと公開済み都道府県ページをsitemapへ追加

グローバルヘッダーへの追加は初期公開に含めません。既存ページからの利用と検索流入を確認し、主要導線に昇格させる価値がある場合に判断します。

企業詳細では、現在の自由文字列 `locationsJapan` を直ちに削除しません。確認済み `CompanyLocation` がある企業だけ、構造化された拠点一覧へ置き換えます。

### 7. 計測と公開確認

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
- 一覧／地図の切り替え
- 拠点選択と企業詳細への遷移
- 熊本ページのcanonicalと一覧
- キーボードによる主要操作

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

1. `data`: 型、20件以上のレビュー済み拠点、取得関数
2. `list`: 全国ページ、静的一覧、掲載基準
3. `filters`: 検索、主要3フィルター、URL状態
4. `map`: Leaflet、地理院タイル、一覧同期
5. `regional-seo`: 公開条件を満たす都道府県ページ
6. `integration`: 企業一覧、企業詳細、業界地図、Career Compass、sitemap
7. `measurement`: 型付きイベント、E2E、正本文書更新

各単位で差分を確認し、コード変更では `npm run typecheck` を最大1回実行します。`npm run build` は明示的に依頼された場合だけ実行します。ブラウザ確認はインタラクティブUIを実装し、確認を依頼された段階でPC・スマホを確認します。

## 公開判定

Previewで次を満たした場合だけ公開します。

- 20〜25社・50〜70拠点の公開データがある
- 全公開拠点に正式名称、所在地、役割、出典、確認日がある
- 全公開ピンが `human-reviewed` である
- 全国ページが地図なしでも検索意図へ答えている
- 熊本ページが5拠点以上、複数企業、地域固有情報を持つ
- 求人期限切れ、建設中、閉鎖予定を誤表示しない
- モバイルの一覧、絞り込み、地図切り替えが利用できる
- sitemap、canonical、robots、内部リンクが矛盾しない
- Analyticsへ自由入力や個人情報を送らない

条件を満たさない場合は、公開件数を水増しせずPreviewのままデータ整備へ戻ります。
