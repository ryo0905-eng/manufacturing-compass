# 半導体株式市場ウォッチ

最終更新日: 2026-10-21

## 目的と範囲

半導体業界を株式市場がどう評価しているかを把握し、企業の事業・掲載決算・関連記事を読み直せる入口を作る。投資助言・売買推奨・株価による採用評価は行わない。

`/semiconductor-watch/stocks` に独立ページを追加。共通ナビは業界ウォッチ／株式市場／決算・IR／業績比較。企業詳細・企業別決算から `#company={既存企業ID}` で選択を引き継ぐ。既存の財務グラフ・ニュース編集・日次固定6ファイルは変更しない。

## データと画面

- `src/data/stock-market.ts` は希望10社の既存ID、TradingView識別子、取引所、通貨、上場形態、出典、資料確認日、表示確認日、埋め込み状態を保持。株価・騰落率・履歴は保存しない。TSMCは米国ADR、ASMLは米国上場記名株式。原通貨を表示する。
- 米国上場8社は `candidate`。これは対応市場・識別子に基づく実装候補であり、実表示を検証済みとは意味しない。東京エレクトロン・Advantestは `external`。東証株式は現行公式の埋め込み対応市場一覧で確認できないため外部リンクを使う。
- SOX、NASDAQ総合、S&P500、日経平均は全て `external`。2026-10-21のローカルブラウザ確認で前三指数はアクセス拒否、日経平均は1Mで未対応期間・6Mでエラー表示となった。確認先をコンパクトに表示し、役割は外部出典で確認できる。ETF・CFD・先物への置換はしない。Mini Chartは `embedding: verified` に変更した指数のみ表示する。
- `checkedAt` は資料・識別子の確認日。`displayVerifiedAt` は実際に対象ウィジェットで価格・期間・銘柄を確認した場合だけ記録。現在は全件null。2026-10-21はNVIDIA・AMDのチャートおよび8社の一覧を部分確認したが、全銘柄・全期間の合格とは扱わない。確認者・確認時刻を捏造しない。
- Symbol Overviewを単一銘柄で表示し、自社の企業セレクターと連動。1週・1か月・3か月・1年の期間ボタンは公式ウィジェット内。期間選択は共有・保存せず、企業切替でウィジェットの初期状態へ戻る。
- Market Data Web ComponentのPerformance表示を1つ配置。価格、当日%、1W・1M・6M・1Yとセル着色を利用。独自列・ソート・期間定義・時価総額・面積付きヒートマップは追加しない。配当込み収益率とは表記しない。
- `tv-link-open` のcontext.symbolを既知の8銘柄と照合した場合だけ標準遷移を同期的に止め、同画面で企業切替・見出しへのフォーカスとスクロールを行う。未知銘柄や出典・ブランドリンクは変更しない。
- URLのhashは企業IDだけを許可。不明な指定はNVIDIA。popstate/hashchangeで戻る・進むを復元し、その復元で操作イベントは送らない。
- 関連記事は `WatchItem.companyIds` の一致を使用。決算との重複除去済みニュースから、未来日・出典変更中を除き、公表日降順の最大3件。0件を明示し、古い記事も元の日付で表示する。既存の決算がない4社へ架空の決算リンクを出さない。

PCは1200px超で左に業界ウォッチのナビ、右にダッシュボードを配置。指数4列、企業選択とティッカーボタン、大きなローソク足・出来高チャート、右側の株価一覧・関連記事・企業研究を近接させる。Market Overview公式iframeをチャートなしで追加し、米国8社の価格・当日変化を表示する。この一覧のリンクはTradingViewへ移動する。自社の企業切替はセレクター・ティッカーボタン・下部Performance表を使う。比較表は全幅で遅延読み込みし、指数の説明・掲載企業一覧・詳細な注意は下部にまとめる。

1200px以下は共通ナビを上部へ移し、900px以下は指数2列・本文1列。スマホの企業ボタンは横スクロール、Performance表だけ800pxの最小幅で横スクロールできる。ライトテーマ・既存ロゴを維持し、ページ全体の横はみ出しを防ぐ。

## 外部スクリプト・SEO・計測

- Server Componentで本文・企業一覧・出典・メタデータ・CollectionPage・パンくずを出力する。クライアントには各企業の必要な説明・リンク・記事最大3件だけを渡し、決算JSON全体を送らない。
- Mini Chart／Market Dataは公式日本語ES moduleをnext/scriptのafterInteractiveで種類ごとに読み込む。Market DataはIntersectionObserverで240px以内に近づいてからマウントする。未対応環境では通常読み込み。
- Symbol Overviewは固定URLの公式埋め込みスクリプトにJSON.stringifyした固定設定を渡す。ユーザー入力からスクリプトやHTMLを生成しない。銘柄ごとに独立したDOMを作り、離脱・切替時に削除する。非同期の旧スクリプトが次のチャートを書き換えない構造にする。
- 帰属表示・ロゴ・リンクを維持する。Web Componentは公式の内部表示を維持し、iframe内をCSSやDOM取得で加工しない。iframeの高さを先に確保する。
- スクリプトのerrorを表示するが、loadイベントやiframeの存在から価格データ成功を推定しない。外部チャートへの常設リンクと比較表の外部確認先を残す。iframe内のデータ拒否や提供停止は自動判別できない。
- canonicalは基底URL、hash別URLは生成しない。sitemapの日付は説明・掲載対象の更新日とし、ページ閲覧時刻や外部価格時刻と混ぜない。外部価格を構造化データへ転載しない。
- `stock_market_company_select` は既知の企業ID・UI版、`stock_market_related_click` は企業ID・固定の移動区分・UI版だけを送る。株価、自由入力、外部URL全文は送らない。
- 閲覧時にTradingViewへの外部通信が発生する。自社の株価API、DB、認証、保存、スクレイピング、AI、依存パッケージは追加しない。privacy・disclaimerに外部表示と市場情報の扱いを追記。

## 公開条件と現在の状態

**公開設定は既定で有効。** `STOCK_MARKET_ENABLED`未設定またはtrueでProductionのページ・共通ナビ・企業／決算リンク・index・sitemapを有効にする。falseを設定して再ビルドするとProductionは404・一覧非掲載となる。誤った設定値も公開無効として扱う。developmentでは非公開設定の確認用ページを利用でき、その場合はnoindex/follow。`.env.example`はtrue。本番反映は設定変更だけで完了とせず、Vercelのデプロイ結果と公開URLで別に確認する。

### 公式のビジネス用途案内に基づく公開判断（2026-10-20）

[公式の日本語ウィジェットページ](https://jp.tradingview.com/widget/)はウィジェットをビジネスソリューションとして案内し、企業の利用例と、デフォルトのTradingViewブランド表示付きでの無料提供を明記している。[導入ガイド](https://www.tradingview.com/widget-docs/getting-started/)は金融ブログ・プラットフォーム等の公開サイトへの埋め込みを案内している。[一般FAQ](https://www.tradingview.com/widget-docs/faq/general/)に従って、公式の帰属表示、ロゴ、外部リンク、公開設定範囲を維持する。

初期調査では[一般規約§3](https://www.tradingview.com/policies/)の商用利用制限を理由に公式回答待ちを置いた。公式の商品別のビジネス用途・無料提供の案内と合わせて再評価し、今回の公式ウィジェットの標準的な表示を公開可能な通常利用として扱う。個別の問い合わせ回答を一律の公開条件にはしない。これは本実装の範囲についての運用判断であり、個別の書面許諾を取得したという記録ではない。

公開時の範囲は以下に限定する。

- 無料で閲覧できる業界情報ページへ公式ウィジェットを埋め込み、TradingViewからブラウザへ提供される表示を使う。
- 帰属表示・ロゴ・出典・ブランドリンクを維持する。表示設定と銘柄リンク連携は公式ドキュメントの公開機能を使う。
- 市場データのスクレイピング・抽出・保存・再配布・独自集計、有料の市場データアクセス、自動売買には使用しない。
- 未対応・未確認の指数や日本株は外部リンクを維持し、ETF・CFD等へ名前を変えずに置換しない。
- ブランド除去、データ取得・販売、独自集計などへ用途を変更する場合は、その時点で該当する別条件を確認する。

運営者から「画面確認は一旦OK。公開条件を確認し、問題なければ本番公開」と依頼を受け、追加のブラウザ確認を今回の公開条件にしない。エージェントによる実データ表示・実画面の追加確認は未実施として残す。銘柄・指数のdisplayVerifiedAtは変更せず、検証していない確認者や日時を記録しない。

問い合わせ文はGmailに下書きとして作成済み・未送信。送信や回答待ちは本実装の公開条件にしない。無料コード取得画面にはTradingViewアカウントへの登録案内があるが、サイト利用者のログインは導入しない。

### 検証・反映

- 公開と停止の両方でページ・ナビ・index・sitemapの制御を対象ユニットテストで確認する。
- typecheckは必要時に最大1回。buildは明示依頼時のみとし、今回ローカルのフルビルドは行わない。本番はVercelのビルド結果を確認する。
- 画面確認や銘柄の実表示を後で行った場合は、実際の結果と確認日を記録する。表示不可と判明した銘柄はexternalへ切り替える。
- 今回は本番公開の明示依頼に基づきcommit・通常pushを行う。日次データタスクの固定6ファイル・権限範囲は変更しない。
- `STOCK_MARKET_ENABLED=false`と再ビルドでページ・導線・検索登録対象を停止できる。外部障害時は自動再試行や前回価格の保存をせず、常設リンクを利用する。

## 公式根拠

- [ウィジェット導入とデータ内蔵](https://www.tradingview.com/widget-docs/getting-started/)
- [2026年7月のMarket Data更新・Performance列](https://www.tradingview.com/widget-docs/whats-new/)
- [Market Data](https://www.tradingview.com/widget-docs/widgets/watchlists/market-data/)
- [Symbol Overviewの期間設定例](https://www.tradingview.com/widget-docs/widgets/charts/symbol-overview/demos/compare/)
- [Web Componentとiframeの違い](https://www.tradingview.com/widget-docs/widget-formats/)
- [公式の銘柄リンクイベント](https://www.tradingview.com/widget-docs/tutorials/web-components/custom-links/)
- [米国の対応市場](https://www.tradingview.com/widget-docs/markets/north-america/)／[アジア太平洋の対応市場](https://www.tradingview.com/widget-docs/markets/asia-pacific/)
- [データFAQ](https://www.tradingview.com/widget-docs/faq/data/)／[帰属表示・Cookie・通信項目](https://www.tradingview.com/widget-docs/faq/general/)

公開設定定義・モジュールも読み取り、PerformanceのPrice／Today／1W／1M／6M／1Y、heatmap属性、銘柄グループ指定を確認。実データの収集・保存や非公開API利用はしていない。

## UI修正（2026-10-21）

参考画像との乖離を指摘され、ライトテーマ維持の回答を受けてレイアウトを修正。説明と大きな外部リンクカードがチャートを押し下げていた問題を解消し、サイドナビ・企業ボタン・ローソク足と出来高・右側の簡易株価一覧と関連記事を追加。独自ヒートマップとセクター集計は追加しない。公式の[ローソク足・出来高デモ](https://www.tradingview.com/widget-docs/widgets/charts/symbol-overview/demos/technical-chart/)の設定を使用する。

- ローカルChrome、PC標準幅と390×844で配置を確認。390pxでdocumentの幅も390px、ページ横はみ出しなし。
- NVIDIA・AMDの価格・ローソク足・出来高、Market Overviewの米国8社、Market Dataの期間別のセル着色を実表示で確認。
- スマホでAMDへ切替し、記事・決算未掲載の案内が連動することを確認。期間別比較への移動後もAMDと企業hashを維持。
- 指数4件は上記の制限を確認し、外部リンクに戻した。日本株は外部案内を継続。
- ブラウザのconsoleに拡張機能がhtmlへ追加した解析拒否属性によるhydration警告あり。アプリの属性には追加せず、別原因として扱う。
- `node --test tests/unit/stock-market.cjs`：8件通過。初回はテスト用VMのURLSearchParams未定義で1件失敗し、ブラウザ標準APIをテスト環境へ追加して修正後に通過。
- `npm run typecheck`：1回、成功。`git diff --check`：成功。buildは未実行。開発サーバーは画面確認後に停止する。本番反映は別途確認する。

## 検証記録

### 公開設定変更時（2026-10-20）

- `node --test tests/unit/stock-market.cjs tests/unit/watch-explorer.cjs`：33件通過。既定での公開、falseでの停止、不正値での停止、ページ・ナビ・sitemapの連動を含む。
- `npm run typecheck`：1回実行、成功。ローカルのbuild・devサーバー・追加ブラウザ操作は行っていない。
- `git diff --check`：成功。問い合わせは未送信。公開反映はVercelと本番URLで別途確認する。

### 初期実装時

- `node --test tests/unit/stock-market.cjs tests/unit/watch-explorer.cjs`：初回29件通過（新規4件＋既存25件）。
- 企業切替・履歴、ウィジェットのイベント、独立DOMの破棄、遅延読込、sitemapの公開制御を追加後、`node --test tests/unit/stock-market.cjs`：8件通過。自社の挙動をフック・DOM模擬で確認し、外部ウィジェットは実行していない。
- `npm run typecheck`：1回実行、成功。lint・build・devサーバーは未実行。
- `git diff --check`：成功。変更対象の公開コード・文書の禁止語検索：該当0。
- 埋め込み用の日本語Mini Chart／Market Data ES module、Symbol Overview scriptの3URL：HTTP 200・JavaScript配信を確認。価格データ成功やUI表示の検証とは区別する。
- 10銘柄の公式銘柄ページ：HTTP 200とタイトルの識別子を照合。株価数値は抽出・保存していない。
- 初期実装時はブラウザ・実データ表示・商用条件の確定・本番反映・commit・pushは未実施。現在の公開判断・反映方針は上記「公開条件と現在の状態」を参照する。
