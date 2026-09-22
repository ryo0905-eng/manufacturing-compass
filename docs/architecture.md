# Architecture

最終更新日: 2026-09-22

## 方針

Manufacturing Compass は、Next.js App Router 上で動く静的データ中心の実務・コンテンツ・キャリア支援サービスです。

Career Compass、インタラクティブ実務学習ツール、業界地図の操作部分だけを Client Component で動かし、企業、ガイド、ランキング、SEO メタデータは Server Components と静的データを基本にします。中心機能はログイン、個人情報保存、外部データベース、AI API に依存しません。Jev実験ページのみ、下記の限定した外部APIを使用します。実務ツールの入力と計算はブラウザ内で完結し、生データを外部へ送信しません。

## 技術構成

### ランキング・タイムマシン

- `/tools/ranking-time-machine` のServer Componentが説明・出典・metadata・WebApplication/BreadcrumbListを提供。操作は専用Client ComponentsとCSS Moduleに分離し、新しいライブラリは使わない。
- `src/data/ranking-time-machine.ts` は企業マスター、2015〜2025年の年次スナップショット220件、出典URL・確認日を管理する。企業IDで結び、既存企業ページへのリンクはサーバーで存在を確認する。
- 純粋な処理で欠損・重複・非正数を拒否し、同値は同順位（1,1,3）とする。スナップショットは年の昇順・連続を要求。丸め済み時価総額は十億米ドル単位。出典を混ぜず、為替換算・補間は行わない。
- 初期2015年の表はSSR。3秒間隔のタイマーは停止・アンマウント時に破棄し、非表示タブでも停止する。年度変更は確定値を一括反映、CSSの位置・幅のみ800msで遷移。共通行高をResizeObserverで測り、名前の折り返しに対応。動きを抑える設定では遷移なし。
- GA4/Vercelへ `ranking_timemachine_play/pause/year_change/company_click/related_click` を送る。year・ranking_type=market_cap・data_kind=real、企業操作に固定company ID、リンクにdestination。自動再生による年変更・自動停止・描画ではイベントを送らない。
- CompaniesMarketCapの利用規約 https://companiesmarketcap.com/terms-of-service/ 第5項の編集目的・出典明記条項を参照（2026-09-22確認）。数値を伴う業界解説として構成し、データ販売・API・CSV配信は行わない。商用利用全般の許諾があるとは記録しない。
- 2026年途中の数値と既存ランキング記事の基準日データは別管理。Samsung等の複合企業、AVGO系列の2016年統合、現存20社を選定した範囲を公開説明に含める。

### AI外観検査の技術検証

`scripts/ai-visual-inspection/` はWebビルドから分離したPythonの生成・学習・評価環境。固定した依存版、学習データ構成、シードを使い、出力はGit管理外の `.cache/ai-visual-inspection/` に保存する。実験出力を公開ディレクトリへ自動コピーしない。

`src/lib/ai-visual-inspection/` はラベルを参照しない画素処理・連結領域と、真値を扱う評価処理を分離する。オフラインゲート通過後、Worker内のONNX Runtime Web 1.22.0推論と要求管理Clientを実装。静的Workerは `sync_web.cjs` で同じTypeScriptソースから生成し、モデルは `export_web.py` が固定ハッシュを確認して出力する。Node上の実WASM数値照合は通過。モデル出力の端点誤差を `2^-23` 以内に限り補正し、超過・非有限値は拒否する。実ブラウザの一周と390px縦配置は確認済み。スライダーのラベル修正後のキーボード・連続操作確認と、実機性能確認は未完了。Server Componentページと5段階の操作UIを `/tools/ai-visual-inspection` に追加し、2026-09-22のユーザー指示でindex可能・sitemap掲載へ切り替えた。教材の固定24枚は `export_lesson.py` で書き出し、真値をWorkerから分離する。[実装記録](./ai-visual-inspection-web-runtime.md)を参照。モデルとランタイムは同一サイトの静的配信、推論は端末内。入力・判定結果・学習状態は送信・永続保存しない。固定カテゴリの既存Analyticsのみ利用する。詳しくは [仕様](./ai-visual-inspection-spec.md)。

### 共通UI

`src/styles/tokens.css` を日英共通の `globals.css` から読み込み、意味別の `--mc-*` トークンと既存CSS変数の互換エイリアスを一元管理する。`src/components/ui/Controls.tsx` は標準HTML属性を受け取る状態を持たない共通部品。Cpkの日英共通Client Componentsで先行利用し、配置は専用CSS Moduleへ分離する。操作・計算・計測は呼び出し側に残し、UIライブラリや新しいAPIへの依存は追加しない。部品の契約と移行ルールは `docs/design-system.md` を参照。

### 共通スタック

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Vercel
- Vercel Analytics
- 任意の GA4
- Playwright

## ルート

### 日英レイアウト

- 日本語ページは `src/app/(ja)`、英語ページは `src/app/(en)/en` に配置する。ルートグループ名はURLに含まれず、既存の日本語URL・API・robots・sitemapを維持する。
- 日英それぞれのルートレイアウトが `html lang`、メタデータ、ヘッダー・フッターを定義する。共通CSSと `SiteAnalytics` を利用し、各レイアウトで計測を1回だけ設置する。GA4の本番環境条件は従来どおり。
- 複数ルートレイアウト間の遷移はフルページ遷移になる。URLから言語を決め、Cookie・リクエストヘッダー・自動リダイレクトは使わない。
- 未登録URLは `global-not-found.tsx` で日英併記の404を返す。Next.js 16の `experimental.globalNotFound` を有効化する。各言語内の `notFound()` には言語別の404表示を持つ。本番のルーティングはVercelビルドで最終確認する。
- 英語記事は `src/content/guides/en` の独立レジストリに置き、既存 `GuideArticle` を拡張した翻訳情報で原文更新日・翻訳日・翻訳確認日を保持する。確認は実施者に沿って記録し、人間の確認とエージェントの確認を混同しない。原文更新日との差は対象テストで検出する。
- 英語の公開判定は `status: published`、空でない `publishedAt` と `translation.reviewedAt` の全条件。レビュー用draftは静的生成するがnoindex、sitemap・hreflang・日本語からの言語切り替え対象外。これはアクセス制限ではないため、非公開情報は置かない。
- 英語記事の自己参照canonicalと公開時の日英相互hreflangを生成する。日本語の記事一覧・記事数には英語版を混ぜない。英語トップと英語一覧は作らない。
- `/en/tools/cpk` は既存の `CpkToolExperience` と子コンポーネントに `locale="en"` を渡す。未指定は日本語。数式・サンプル・状態を複製せず、翻訳は `src/data/cpk-text.ts`、英語解説・公開管理は `src/data/cpk-english.ts` に分離する。
- Cpkの分析説明は共通の分岐結果を翻訳し、学習の比較説明も既存分岐に言語引数を加える。片側規格は規格中心を定義しない専用説明を日英共通で使う。計算結果は変更しない。
- Cpk英語版は `englishCpkRelease` のstatus・reviewedAt・publishedAtで検索公開を制御する。EFEMの公開状態とは独立し、確認前はnoindex・sitemap/hreflang/日本語からのリンク対象外とする。公開時は相互の自己参照canonical・ja/enを設定する。
- 英語の既存Cpkイベントには `locale=en` のみ追加し、測定値・規格・結果・コピー本文は送信しない。`cpk_language_switch` は固定パス・言語だけを送る。入力は言語切り替えや再読み込みで失われる。

### 中心導線

- `/`: サービス概要、Career Compass、記事・企業研究への入口
- `/career-compass`: 12問の現在地チェックと同一画面内の結果
- `/career-agents`: 転職エージェント比較
- `/career-consultation`: 相談論点の整理
- `/tools/process-comparison`: 実測2条件の記述統計・共通相対度数ヒストグラム、TSVコピーとPNG出力。計算とSVG生成は`src/lib/process-comparison.ts`、PNG化は`src/lib/process-comparison-export.ts`。同じ結果を画面・コピー・画像へ使い、サーバーAPIや永続化は追加しない。計測は`process_comparison_started/completed/copied/png_exported`の固定名のみ（プロパティなし）
- `/tools/cpk`: 生データからPp・Ppk、短期標準偏差からCp・Cpkを計算し、SVGヒストグラムと分析を表示
- `/tools/taguchi`: L9の2列による9制御条件×3誤差状態の望小SN比と確認実験を学ぶ。`src/lib/taguchi`でtypes・simulator・analysis・sessionを分離し、analysisは真値を参照しない。81回の段階進行と実験ID由来の乱数、独立した確認群を保持。操作は専用Client ComponentとSVG、説明はServer Component、文言・日付は`src/data/taguchi.ts`。状態はメモリのみ、失敗時は観測保持・解析停止。詳細は[専用仕様](./taguchi-spec.md)。
- `/tools/doe`: 2因子2水準を起点に、効果、実験誤差、ANOVA、残差、確認実験、設計選択を学ぶ
- `/tools/bayesian-optimization`: 架空成膜工程の12回の実験を、DOE→GP予測→LCBによる追加実験→確認→真値の振り返りとして体験する。`src/lib/bayesian-optimization` のmodelはtypesのみに依存し、simulatorの真値を参照しない。sessionは原子的なDOE追加と12回の予算、確認前予測を保持する。Server Componentの説明とClient Componentの操作、Canvasの面とSVGの点を分離し、状態はメモリのみ。計算失敗時は履歴を保持して予測を消去・停止する。文言と公開日付は`src/data/bayesian-optimization.ts`、詳細は[専用仕様](./bayesian-optimization-spec.md)。
- `/tools/control-chart`: 管理図で偶然原因と異常原因の判断を学ぶ
- `/tools/yield-analysis`: 日別の良品・不良品個数をp管理図で監視し、製品別・装置別・製品構成比で歩留まり低下の調査条件を絞る
- `/tools/yield-dashboard`: 固定の架空半導体工場データで、歩留まり低下から不良・製品・装置・ロット・工程条件・変更履歴・確認実験までを連動して調べる
- `/tools/gage-rr`: 交差型Gage R&Rで部品差、繰返し性、再現性、%GRR、ndcを学ぶ
- `/tools/line-balance`: 工程別の作業時間を山積み表示し、タクト超過と再配分前後を比較する
- `/tools/oee`: OEEの内訳と、停止・性能・良品率の改善による推定良品数を比較する
- `/games/process-engineer-survival`: Phaserの工場フロアとReactのイベントUIを組み合わせ、製造トラブルの判断をコミカルに体験する。ゲーム状態はブラウザメモリだけに保持する

`/diagnosis` と `/diagnosis/result` は存在しません。Career Compass の結果は URL を分けず、クライアント側の状態として同じページに表示します。

### 情報ページ

- `/industry-map`: 8つの事業領域を固定したゾーンに分け、役割、代表企業、製品分野を同時に俯瞰する。検索・絞り込み・職種表示・企業詳細パネルを提供し、静的な領域一覧も同じページに残す
- `/semiconductor-map`: 国内の半導体関連拠点を勤務地単位で探す。全国URLだけをindexし、絞り込みパラメータ付きURLは `noindex, follow` とする
- `/segments/[slug]`
- `/companies`
- `/companies/[slug]`
- `/compare`
- `/compare/[slug]`
- `/guides`
- `/guides/[slug]`
- `/rankings`
- `/rankings/[slug]`

### 信頼性・法務

- `/about`
- `/contact`
- `/privacy`
- `/disclaimer`
- `/advertising-policy`
- `/sitemap.xml`
- `/robots.txt`

旧 `/companies/[slug]/career-prep` は独立コンテンツを持たず、`/companies/[slug]#career-prep` へ恒久リダイレクトします。キャリア準備情報は企業詳細の初期HTMLへ統合し、旧URLは sitemap に含めません。

## ディレクトリ責務

```text
src/app/                    ルート、メタデータ、構造化データ
src/components/             共通UIとClient Components
src/components/career-compass/
                            Career Compass の結果表示部品
src/data/career-compass.ts  質問選択肢と結果プロファイル
src/data/companies.ts       セグメント、企業、キャリア準備情報
src/data/industry-map.ts    業界地図の工程、役割、代表企業、職種との接点
src/data/company-locations.ts
                            公式確認済みの半導体企業・物理拠点・出典
src/data/hiring-signals.ts  期限付きの拠点別採用確認状態
src/data/affiliateLinks.ts  エージェント、提携状態、CTA
src/data/learning-affiliates.ts 統計学習講座の広告情報とCTA掲載対象
src/data/salary-methodology.ts
                            参考年収帯の算出説明と出典
src/data/editorial.ts       ガイド記事の集約
src/content/guides/         記事データ
src/types/content.ts        企業・セグメント・出典の型
src/types/company-location.ts
                            拠点、施設、状態変更、採用シグナルの型
src/lib/analytics.ts        計測イベント
src/lib/company-locations.ts
                            公開拠点の取得、絞り込み、期限判定、データ検査
src/lib/format.ts           正規URLなどの共通処理
src/lib/doe/                DoEの効果・ANOVAなど、UIから独立した計算
src/lib/gage-rr/            Gage R&Rの疑似測定データ、ANOVA、分散成分計算
src/lib/yield-analysis.ts   CSV検証、個数加重集計、p管理図、層別・構成比比較
src/data/yield-dashboard.ts 架空工場のロット、排他的な不良、工程条件、変更履歴、確認実験
src/lib/yield-dashboard.ts  歩留まりの個数加重集計、絞り込み、層別、条件比較、整合性検査
src/data/process-engineer-survival.ts
                            設備接続、原因ケース、観察項目、作業・実験時間、称号、学習導線
src/lib/process-engineer-survival.ts
                            設備・材料・冷却・製品履歴・観察・作業・試運転の純粋関数と状態ストア
video/                      Web本体と依存関係を分けたショート動画生成パッケージ
video/manifests/            元記事、画面文言、音声設定、確認日、公開状態
video/src/components/       音声ミックス、共通枠、場面などの再利用部品
video/src/compositions/     動画ごとの図解と場面構成
video/docs/                 制作フロー、公開記録、計測ログ
```

表示ロジックとデータ定義を分けます。新しいコンテンツ種別を追加する時は、まず型と所有ファイルを決め、ページ内へ大きなデータを直書きしません。

`video/` は独立した `package.json` と lockfile を持ち、Vercel のWebビルドから実行しません。動画は公開記事の `sourceSlug`、確認日、音声ミックス、公開状態を持つマニフェストからローカル生成し、MP4、確認画像、収録音声、レンダーキャッシュはGit管理へ含めません。記事本文を動画側へ複製せず、動画公開前に内容、匿名化、BGMライセンスを人が確認します。標準手順は `video/docs/short-video-workflow.md`、制作結果は `video/docs/production-log.md` に記録します。

実務学習ツールは、ページをServer Component、操作部分を専用Client Component、統計計算を可能な限り`src/lib`へ分離します。同じ計算結果を複数の表示で独自計算せず、一つの解析結果から数値、グラフ、解釈を派生させます。

## 業界地図のデータフロー

```text
静的な領域・役割・既存企業参照・出典付き簡易企業・職種の接点
  → Server Componentから必要な企業概要だけを渡す
  → Client Componentで選択、検索、絞り込み、職種表示を管理
  → 記事、企業詳細、セグメント、Career Compassへ遷移
```

- ブラウザ操作や検索語を保存しない
- 自由入力の検索語をAnalyticsへ送らない
- 線はゾーン間の一般的な役割上の接点であり、資本・取引関係や採用可能性を表さない
- 自動配置ライブラリを使わず、CSS Gridの固定ゾーンで同じ領域が毎回同じ位置に現れるようにする
- 企業名、説明、内部リンクは初期HTMLへ含め、関係線だけへ情報を閉じ込めない
- 企業詳細データを持たない簡易企業は、公式URL、出典、確認日を必須とし、存在しない企業詳細URLを生成しない

## 半導体企業・拠点マップのデータフロー

```text
企業公式情報から確認した物理拠点と出典
  → contentStatus が complete の拠点だけを取得
  → 期限付き採用シグナルを表示時点で判定
  → Server Componentで全国一覧と構造化データを出力
  → Client Componentで検索、絞り込み、都道府県選択を管理
  → 有限分類と管理済みIDだけを匿名イベントとして送信
```

- `CompanyLocation.companyId` で既存企業詳細へ接続し、国内法人は `legalEntities` に保持する
- 拠点の存在・役割と採用シグナルを別ファイル・別更新周期で管理する
- V0データへ座標を入れず、正確な施設ピンはV1の人手確認後に限定する
- 実行時ジオコーディング、求人API、外部データベースを使わない
- 自由入力の検索語をAnalyticsへ送らない
- 都道府県、拠点種別、職種、拠点・企業ID、導線位置だけを拠点マップイベントへ送る
- 閲覧・検索・Career Compass回答を外部データベースへ保存しない

## Career Compass のデータフロー

```text
ブラウザ上の回答
  → 静的な加点・分岐ルール
  → 結果プロファイルと回答由来の補足を合成
  → 同一ページに結果を表示
  → 必要なイベントだけ匿名計測
```

- 回答と生成結果をデータベースへ保存しない
- URL と Cookie に回答内容を含めない。Analytics には全回答や現年収を送らず、完了時の粗い職種領域・転職目的・結果タイプ・相談テーマだけを送る
- 現年収帯はブラウザ内の差分表示だけに使う
- スコアは応募準備の棚卸し指標として表示する
- 企業例は静的企業データとの接点であり、推薦順位や採用可能性ではない
- 参考年収帯は `salary-methodology.ts` の方法と出典を併記する

## コンテンツデータ

- 企業・採用・財務情報には `Source` と更新日を持たせる
- `src/data/companies.ts` の明示的な企業コンテンツ状態が `draft` の企業ページは `noindex, follow` とし、sitemap から外す
- ガイド記事は公開状態、公開日、更新日、著者、確認者、出典、SEO 情報を保持する
- ガイド記事のカテゴリは `src/content/guides/categories.ts` を正本とし、記事URLとは分離する
- `.private/` の取材メモはビルド対象にせず、公開データへ反映する前に匿名化する

詳細なデータ設計は [`database.md`](./database.md) を参照してください。

## SEO

- App Router の metadata API を使う
- canonical は `https://mfg-compass.com` を基準にする
- ガイド記事に Article、BreadcrumbList、必要なページに FAQPage / ItemList 等を使う
- `src/app/sitemap.ts` は公開状態と各データの更新日を使う
- ガイドの Open Graph / X 画像はページ固有データから生成する

## Analytics

- Vercel Analytics を常時利用する
- GA4 は `NEXT_PUBLIC_GA_MEASUREMENT_ID` がある本番環境だけで有効にする
- イベントは `src/lib/analytics.ts` に集約する
- PII、自由記述、現年収、回答一式を送らない。粗いカテゴリを追加する時も個人を推測できない粒度に限定する
- ミニアプリは閲覧、初回操作、山積み表の工程移動、OEE改善条件の確定変更を別イベントで計測する。歩留まり解析はシナリオ、有限の操作種別、CSV読込成否だけを送り、製品名、装置名、日付、個数、生データ、ファイル名は送らない
- 歩留まり解析のイベントは `yield_analysis_first_interaction`（初回だけ）、`yield_analysis_scenario_changed`、`yield_analysis_csv_loaded`、`yield_analysis_filter_changed`、`yield_analysis_mix_comparison_used`。初期表示は利用開始に数えず、フィルター値は `selected` / `all` のみ送る
- 歩留まり原因調査デモは `yield_dashboard_start`（初回だけ）、`yield_dashboard_guide_step`（各段階1回）、`yield_dashboard_complete`（1回）、`yield_dashboard_free_explore`、`yield_dashboard_design_view` を送る。ロットID、日付、実数、選択値は送らず、有限の操作種別・段階・モードだけを送る
- 製造技術者サバイバルは `game_start`、`game_observe`、`game_experiment`、`game_countermeasure`、`game_complete`、`game_retry`、`related_tool_click` を送る。`game_version=factory-investigation-v3` と固定のステージ・ケースIDで旧選択式・修理式と区別する。観察は記録時、実験・対策は受理時、完了は1プレイ1回。固定の操作・対象・称号・遷移先IDと完了区分のみで、自由入力、スコア、製品履歴、仮説内容、個人情報は送らない

## 製造技術者サバイバルの構成

`/games/process-engineer-survival` はSEO本文をServer Component、HUD・開始・一時停止・調査・結果をReact、移動・接触・製品・設備の描画をPhaserで実装する。PhaserはuseEffect内で動的importする。正本は `SurvivalRuntime` のみで、Phaserが更新を駆動しReactはuseSyncExternalStoreで約10Hzのスナップショットを購読する（命令時は即通知）。進行関数は最大50msずつ処理し、長い描画フレームの追従は100msまで。描画が著しく遅い環境では実時間より進行が遅くなる場合がある。

稼働90秒。12秒時点でB/Cの材料がL1からL2へ切り替わり、開始時に固定したケースの異常が発生する。ケースAは共通冷却、ケースBは材料L2。Aは正常材料N・別冷却系統。現場UIは観察関数と公開済み検査結果だけを表示し、原因の答えは終了後にだけ表示する。旧案件待ち行列は使用しない。

ACTION一押しで対象の操作パネルを開く。`SurvivalInvestigationPanel` はnative dialogでフォーカスを閉じ込め、Escapeまたは戻る操作で閉じる。調査中は時計・製品・進行中作業すべてを停止する。停止・再開・観察・仮説変更は調査中に即反映し、作業確定だけが現場へ戻して進行を再開する。設備の同時作業競合と共通冷却のB/C停止前提を純粋関数で検証する。

通常製品は6秒で1個、検査と搬送を含む教材モデル。製品ID、設備、材料、進捗、品質、保留状態を同じ履歴で管理し、描画と集計を分離計算しない。比較試験は正常材料Nだけを使い、生産材料を変更しない。対策後確認は現在の生産材料で試す。どちらも4秒で試験品は納入数から除外。対策変更後は正常な確認結果を得るまで再開不可で、再起動でこの制約を迂回できない。通常良品が置場に到着した時にだけ復旧の音・粒子を出す。

フォーカス喪失・非表示で時計と入力を止め、再開は手動（調査中なら調査に戻る）。リトライは同じケースまたは別ケースを指定して状態を初期化し、Phaserを再生成して位置・入力・演出を破棄する。音は開始操作後にWeb Audioで有効化し、ミュート常設。動きを減らす設定では粒子・歩行フレーム・浮上演出を抑える。画面揺れは使わない。

プレイ状態はURL、Cookie、localStorage、外部APIへ保存しない。マップはGraphicsから生成し、正式素材へ差し替え可能。検証項目は [ゲーム確認チェックリスト](./process-engineer-survival-checklist.md) を参照。

## デプロイと検証

- Vercel の `main` を本番、Pull Request を Preview とする
- `npm run build` は `next build --webpack`
- AI エージェントの検証回数、build 条件、ブラウザ確認条件は `AGENTS.md` を正本とする
- ローカル build が環境由来で止まる場合は、無制限に再試行せず Vercel のビルド結果を優先する

## 半導体職種マップの事前検証（2026-09-16）

現段階はdocs内の[対応表](./role-map-pilot.md)・[運用検証](./role-map-validation.md)と、`/roles` で公開する4職務群のβ版。トップ、Career Compass、sitemapから接続する。

β版は `src/data/role-map-prototype.ts` の4職務群・18業務、`src/lib/role-map.ts` の純粋な候補抽出、Client Componentの選択・結果・コピーに分ける。回答はReactメモリだけで保持し、URL、Cookie、localStorage、外部APIへ送らない。固定操作イベントだけを計測し、回答内容や検索語をイベントへ含めない。

[引継ぎ仕様](./role-map-mvp-spec.md)に従い、8職務群への拡張では職務群・文脈別Profile・使用名称・業務・主張単位の根拠をさらに分離し、レビュー済みのローカル静的データを追加する。`/roles`は構造化データとパンくずをServer Component、業務選択・候補抽出・コピーをClient Componentとする。新しい外部API・DB・認証は追加しない。

## 将来の外部サービス導入条件

Supabase、ユーザーアカウント、メール保存、求人連携は未採用です。AI APIは下記Jev実験ページのみの例外です。導入する場合は、少なくとも次を先に決めます。

- 解くユーザー課題と、静的実装では不足する理由
- 保存するデータ、保存期間、削除方法、同意
- プライバシーポリシーとセキュリティ
- レート制限、費用上限、障害時の挙動
- 既存の静的ページと SEO を損なわない移行方法

## 転職の軸ノート

- `/career-priorities`: Server Componentの用途説明・検索用メタデータと、専用Client Componentの4画面UI。sitemapに掲載し、トップ・比較・関連記事・相談準備から共通の計測付きリンクで接続する。
- `src/data/career-priorities.ts`: 5分野15項目と質問の固定対応、選択肢の型。
- `src/lib/career-priorities.ts`: 選択解除に伴う状態整理と、相談メモを生成する純粋関数。
- 回答はReactのメモリ内だけで保持。再読み込みで消去され、URL・Cookie・localStorage・外部APIには保存／送信しない。クリップボード書込みは本人のボタン操作時だけ行う。
- 開始・画面到達・完成・コピーのみ既存Analytics経路で計測。選択内容、順位、質問、ノート本文を送信しない。

## 英語実務ツール3本の構成

- 英語URLは `/en/tools/oee`、`/en/tools/line-balance`、`/en/tools/process-comparison`。既存英語ルートレイアウトとSiteAnalyticsを共用する。新しいルート移動は行わない。
- 既存コンポーネントの任意localeは省略時ja。計算を共用し、UI・検証・出力文言は `src/data/practical-tool-text.ts` の辞書で切り替える。ユーザー入力は置換引数として保持し、翻訳・再展開しない。
- `src/data/practical-tools-english.ts` は英語解説・出典・翻訳日・本文更新日・翻訳元本文更新日を持つ。翻訳元の日付はルート移動日ではなく本文更新日で管理し、日本語本文変更時に差分と翻訳更新の要否を確認する。
- 同データのstatus、reviewedAt、reviewedBy、publishedAtでページごとに公開判定する。メタデータ、相互言語リンク、関連記事リンク、sitemap、構造化データを同じ判定へ接続する。draftはURLで確認可能だがnoindexであり、秘密情報は置かない。
- `EnglishPracticalToolPage` がプレビュー、言語リンク、解説、出典、日付を共通表示する。工程条件比較のCSSは既存の `(ja)` 配下の実ファイルを再利用する。
- 英語の既存操作イベントはlocale=enを付加する。OEEのシナリオ変更は入力開始時の数値と比較し、有効な数値変更が確定した場合だけ送る。入力値・結果・ユーザー入力名は送信しない。共通言語切り替えはtool_language_switch、関連記事はtool_related_content_clickで固定ID・パスを送る。
- 本番反映日は非公開実験記録で別管理する。計算式・サンプル数値は変えず、OEEの停止時間の説明のみ、生産予定外の時間と生産予定内の停止を区別する内容へ日英で明確化した。

## Cpk学習比較の構成

`src/data/cpk-learning.ts` に操作範囲・プリセット・条件型、`src/lib/cpk-learning.ts` に比較状態の更新・説明・正規確率密度を分離。工程能力は既存calculateCapabilityを再利用する。曲線は横軸92〜108、縦軸は標準偏差0.25の最大密度を基準とする共通固定スケール。CpkToolExperienceは両モードをマウントしたままhiddenとinertで非表示側の操作・読み上げを除外する。再読込で状態は消える。

## 相談準備の固定ひな形と比較データ（2026-09-06）

- `src/data/career-consultation.ts` に固定ひな形、`ConsultationTemplate` にコピー状態と読取専用表示を分離。コピー操作時だけクリップボードへ書き込み、失敗時は手動コピーを案内する。個人情報入力・永続化・APIは追加しない。
- 共通 `CareerAgentsLink` は任意の既存 `AgentFocus` と有限の `ctaLocation` を受け取る。省略時の共通CTAの遷移先と計測位置は従来通り。source_pageはusePathnameによるパスだけを送る。
- `CompanyComparisonProfile.research` は任意の企業別事実・Source・質問・更新日を持つ。既存比較のデータとは確認日を分け、対象2ページだけにServer Componentで表示する。
- 検証は `node tests/unit/career-consultation.cjs` で通信しないハンドラー単体確認を行う。ブラウザ・本番GA受信確認の代替とはしない。

## 働き方チェックの追加モード（2026-09-06）

- `/career-priorities#workstyle` で既存ページの追加モードへ直接接続。hashはモードのみで回答を含まない。既存ノートと追加モードはマウントを維持しhiddenで表示を切り替える。
- `src/data/workstyle-check.ts` は3職種・5条件の編集上の質問、参考資料の適用範囲・確認日・次回確認日を所有する。企業別の勤務条件を推論しない。
- `src/lib/workstyle-check.ts` は質問抽出、選択解除時の確認状態の除去、コピー文面を生成する純粋関数。職種変更で対象外となった確認状態は破棄し、条件の重要度変更では維持する。
- 専用Client Componentで比較、質問選択、本人の確認状況、コピーを実装。回答はReactメモリのみ。コピー失敗時は常設の読取専用テキストから手動コピー。
- 共通trackEventへ有限の操作種別・導線位置だけを送る。回答・質問本文・本人確認状況は送らない。既存ノートのイベントと分け、本番設定は別途確認する。

### 光半導体メーカー記事

`optical-companies` 記事ブロックは `src/data/optical-semiconductor.ts` の公式製品例を使用する。`OpticalCompanies` が出典付き全社対応表をサーバー描画し、`OpticalCompaniesExplorer` が4用途と全件の選択・図解・企業説明を連動する。選択はページ内状態のみで、API・保存・新規ライブラリは追加しない。記事登録からメタデータ・構造化データ・sitemapを既存処理で生成する。

## Jev実験ページ（2026-09-20）

- `/labs/jev`: Server Componentの説明・index可能なメタデータ・OG・構造化データとClient Componentの3ケース×2分岐、初報基準の比較、メモリ内結果。`/tools`とsitemapから接続する。共有クエリはcaseのみでcanonicalは本体URL。JSON保存は提供しない。
- 計測は閲覧、固定ケース選択、固定追加情報選択、評価開始・成功・失敗、共有リンク、学習ツール遷移。固定ID・HTTP状態・選択された確認領域だけを送り、報告本文・確率分布・自由入力を送らない。
- `src/data/jev-demo.ts`: 架空報告、固定の追加情報、変更分類、確認領域と静的リンク、Scoreの5段階基準。
- `src/data/jev-visual.ts` と `JevFactoryExperience`：全3ケース×3状態の入力図と9選択肢の確率バー。APIの分布を合算・再正規化せず固定順で表示し、初報目印と差分を併記。PC左右/スマホ上下。JevDemoは開始後の選択イベントから自動評価し、pendingガード・結果キャッシュ・失敗ID記録で重複/自動再試行を防ぐ。通信中・失敗時は初報表示と明示。native dialogに他指標・説明・学習リンクを残す。計測版はprobability-flow-v3。
- `src/lib/jev-demo.ts`: `{sampleId, evidenceId}`（初報はevidenceId=null）だけを受理。questionsはchange/comparison/completeness/route。型・分布・confidence・Scoreの加重平均を検証して正規化し、4判断を返す。分類から確認先を固定変換しない。
- `/api/jev`: POSTのみ。Origin照合、JSONサイズ・スキーマ・固定ID検証後、Gatewayへ1回送信。自動再試行なし、タイムアウト付き。秘密や外部エラー本文を返さない。
- 費用上限はGatewayのAPIキー予算へ委ねる。アプリは予算・利用枠の拒否と429を固定文言で表示し、自動リトライしない。キー予算の設定は運営者が管理画面で確認する。
- アプリ用DBは使わない。本文・結果をアプリで保存せず、Gatewayの利用履歴・インフラ標準ログは各サービスの設定に従う。
- 設定・評価・停止手順は `docs/jev-demo.md`。利用者保存用DB、認証、AI SDK以外の新規SDK依存は追加しない。

### Vercel AI Gateway対応（2026-09-20）

運営者が取得したGatewayキーを使うため、Jevの接続先をVercel AI Gatewayへ変更する。環境変数は`AI_GATEWAY_API_KEY`、モデルIDは`typesafe-ai/jev`。AI SDK 7のexperimental_evaluateを使い、Node.jsは22以上24未満とする。Gatewayの応答から確信度・使用量を検証して取り出す。費用管理はGatewayのAPIキー予算に一本化する。APIキー設定は.env.localまたはデプロイ環境変数で行い、コーディングエージェント向けCLIセットアップは使用しない。

## 記事の比較表と翻訳差分（2026-09-21）

- GuideBlockのcomparison-tableは見出し列・行見出し・文字列値・任意の行別出典を持ち、GuideBlocksでcaption付きのHTML表として表示する。スマホは列関係を維持した横スクロール。新しいクライアント処理は追加しない。
- Cpk結果解説は通常のGuideArticleとして登録する。draftは既存の公開フィルターにより一覧・sitemap・記事URLから除外され、確認用原稿は非公開文書で読む。公開指示後にstatusと実際の公開日を設定する。
- Cpkツールから新記事へのリンクは記事がpublishedのときだけ表示する。シックスシグマの関連記事も既存の公開フィルターを使う。
- 公開済み英語版の翻訳元に更新がある場合、translation.pendingSourceUpdatedAtに未反映の日本語更新日を記録できる。sourceUpdatedAt・translatedAt・reviewedAtは実際に翻訳・確認した版の日付を維持する。対象テストは未記録の原文更新を検出し、差分を確認して反映後にpendingを外す。pendingは翻訳済みや確認済みを意味せず、英語版の公開状態も変更しない。

## 相関と因果ラボ（2026-09-22）

Serverページが定義・解説・出典・SEOを出力し、`CorrelationTool`とSVG/表が5段階の体験を提供する。`src/data/correlation-causation.ts` に文面・固定条件・公開状態、`src/lib/correlation-causation/` に生成・観測だけの解析・純粋な状態遷移を分離。観察と2実験の乱数列・IDを分け、同期refで連打を抑止する。新規API・依存・永続化なし。reviewでは直接URLのみ、publishedで一覧・関連リンク・sitemapとindexを有効化。[仕様・検証境界](./correlation-causation-spec.md)。

## 改善の差を見極める

`/tools/improvement-confidence` のServerページが説明・出典・SEOを出力し、Clientの操作部がメモリ内で3ケースと自由実験を扱う。`src/data/improvement-confidence.ts` に教材・公開情報、`src/lib/improvement-confidence/` に独立した統計計算・シード付き生成・純粋な状態遷移、専用コンポーネントにSVG・表・操作画面を分離。Welch区間は観測値のみから計算し、真値は振り返りだけで使う。既存DOE・工程比較の計算、新規依存、外部API、永続保存は変更・追加しない。revisionで古い操作とイベント重複を防ぎ、計算エラー時は履歴を残して停止する。[仕様と検証](./improvement-confidence-spec.md)。

## 半導体工程図鑑

`/tools/semiconductor-process` のServerページが説明・静止図・出典・SEOを出力し、ClientのProcessExplorerが6地点・ウエハ準備8工程・薄膜加工8工程・配線7工程・組立7工程・ウエハ検査4工程・最終検査4工程・体験別の振り返りを扱う。ExperienceId（wafer-preparation／thin-film／assembly／interconnect／wafer-test／final-test）で教材・進捗・計測を分離し、操作とレイアウトを共有する。体験定義表で工程・補足・関連記事・戻り先・まとめを選ぶ。ウエハ準備・組立・配線・検査の教材、純粋形状関数、SVGは専用モジュールに置く。検査2体験は図・応答表を共有し、対象への接触方法と記録を分ける。教材データ、純粋な形状関数と状態遷移、SVG・専用CSSを分離。RAFは再生トークンで古いコールバックを破棄し、非表示・画面外・unmountで停止・解除する。低モーションは加工後の静止形を使う。新規依存、API、動画配信、WebGL、永続保存は追加しない。[仕様](./semiconductor-process-spec.md)。

### 工程図鑑のおすすめ見学コース（2026-09-22）

`src/data/semiconductor-tour.ts`に6体験の順序・案内・振り返りを定義。既存の純粋状態遷移にコース開始・全体図・次体験・自由選択を追加し、再生トークンを更新して旧RAFを破棄する。次体験は呼出元IDとsummary状態を検証し連打による飛び越しを防ぐ。体験別履歴は共有し、コース再開始でも消さない。コース地図／振り返りは既存Client内、入口はSSRにも出力。既存の画面高レイアウトには行を追加しない。

### 全6体験の仕事紹介（2026-09-22）

`semiconductor-work.ts`に役割・架空事例・出典・更新日・関連記事を定義。`WorkRolePanel.tsx`は選択された役割を受け取る静的なSVGと文章の表示部。選択状態とページ内の表示計測抑制はProcessExplorerに置き、加工の状態遷移へ混ぜない。`workLessons`は全ExperienceIdを網羅するRecordで、体験ごとの役割・出典・版を選ぶ。残り3体験のデータは`semiconductor-work-remaining.ts`に分離し、型のみを元データから参照する。画面移動で選択を解除し、表示済みキー（体験ID＋役割ID）は保持する。薄膜と組立の図は表示部内で描き分け、配線とCMPの図は`InterconnectWorkGraphic.tsx`に分離。ウエハ準備の図は`PreparationWorkGraphic.tsx`、検査2体験は`TestingWorkGraphic.tsx`で対象の接触形状を描き分ける。Serverページにも全6体験の各3役割の文章と出典を出力。URL、canonical、sitemapの日付（同日更新）、既存6体験の計測版と再生動作を維持し、仕事紹介のイベントは別版で識別する。新規依存・API・保存は追加しない。

## 外資系企業の日本の仕事探索（2026-09-22）

`JapanWorkEvidence` と企業の日本紹介・Sourceは `src/data/japan-work.ts`、分類・公開条件・地域との同一記録照合・比較選択・整合検証は `src/lib/japan-work.ts` に分離する。企業IDとCompanyLocationを参照し、jobCategoriesから国内業務を補完しない。KLA横浜本社・Infineon渋谷本社を既存拠点データへ追加するが、根拠がない職種の配属先にはしない。

Server Componentが出典付き詳細を生成し、JapanWorkExplorerへ表示スロットを渡す。初期HTMLの全社詳細とClient Componentの探索パネルで同一内容を使う。操作状態はReactメモリのみ、外部API・永続化・新規依存はなし。日次再検証で期限表示を更新する。専用URLはcanonical・sitemap・WebPage・ItemListへ追加。既存企業ページの公開状態は変更しない。[データ範囲・計測・更新手順](./global-japan-work-spec.md)。
