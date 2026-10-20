# 半導体株式市場ウォッチ

最終更新日: 2026-10-20

## 目的と範囲

半導体業界を株式市場がどう評価しているかを把握し、企業の事業・掲載決算・関連記事を読み直せる入口を作る。投資助言・売買推奨・株価による採用評価は行わない。

`/semiconductor-watch/stocks` に独立ページを追加。共通ナビは業界ウォッチ／株式市場／決算・IR／業績比較。企業詳細・企業別決算から `#company={既存企業ID}` で選択を引き継ぐ。既存の財務グラフ・ニュース編集・日次固定6ファイルは変更しない。

## データと画面

- `src/data/stock-market.ts` は希望10社の既存ID、TradingView識別子、取引所、通貨、上場形態、出典、資料確認日、表示確認日、埋め込み状態を保持。株価・騰落率・履歴は保存しない。TSMCは米国ADR、ASMLは米国上場記名株式。原通貨を表示する。
- 米国上場8社は `candidate`。これは対応市場・識別子に基づく実装候補であり、実表示を検証済みとは意味しない。東京エレクトロン・Advantestは `external`。東証株式は現行公式の埋め込み対応市場一覧で確認できないため外部リンクを使う。
- SOX、NASDAQ総合、S&P500、日経平均は実表示未確認のため全て `external`。名称・役割・確認先を表示する。ETF・CFD・先物への置換はしない。Mini Chartは `embedding: verified` に変更した指数のみ表示する。
- `checkedAt` は資料・識別子の確認日。`displayVerifiedAt` は実際に対象ウィジェットで価格・期間・銘柄を確認した場合だけ記録。現在は全件null。確認者・確認時刻を捏造しない。
- Symbol Overviewを単一銘柄で表示し、自社の企業セレクターと連動。1週・1か月・3か月・1年の期間ボタンは公式ウィジェット内。期間選択は共有・保存せず、企業切替でウィジェットの初期状態へ戻る。
- Market Data Web ComponentのPerformance表示を1つ配置。価格、当日%、1W・1M・6M・1Yとセル着色を利用。独自列・ソート・期間定義・時価総額・面積付きヒートマップは追加しない。配当込み収益率とは表記しない。
- `tv-link-open` のcontext.symbolを既知の8銘柄と照合した場合だけ標準遷移を同期的に止め、同画面で企業切替・見出しへのフォーカスとスクロールを行う。未知銘柄や出典・ブランドリンクは変更しない。
- URLのhashは企業IDだけを許可。不明な指定はNVIDIA。popstate/hashchangeで戻る・進むを復元し、その復元で操作イベントは送らない。
- 関連記事は `WatchItem.companyIds` の一致を使用。決算との重複除去済みニュースから、未来日・出典変更中を除き、公表日降順の最大3件。0件を明示し、古い記事も元の日付で表示する。既存の決算がない4社へ架空の決算リンクを出さない。

PCは指数4列（900px以下2列）、主チャート2/3＋関連情報1/3、比較表は全幅。900px以下では本文1列、スマホは指数2列。比較表だけ800pxの最小幅で横スクロールでき、ページ全体をはみ出させない。既存のライトUI・会社ロゴを再利用。

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

**実装済み・本番公開無効。** `STOCK_MARKET_ENABLED` はサーバー側フラグ。未設定／falseならProductionのページは404、sitemap・株価への共通ナビ／企業リンクも出さない。developmentでは確認用ページと導線を利用でき、noindex/follow。trueに変更して再ビルドすると公開・index・sitemapが揃って有効になる。`.env.example` はfalse。

2026-10-20の調査では、公式の無料ウィジェットと公開埋め込み用途は確認した。一方、[一般規約§3](https://www.tradingview.com/policies/)の商用利用制限と、本サイトの無料公開・アフィリエイトを含む運営形態への適用を確定できていない。正式な適用条件が不明な間は上記フラグを有効にしない。問い合わせは未送信。無料コード取得画面にはTradingViewアカウントへの登録案内がある。サイト利用者のログイン機能は導入しない。

有効化前に以下を完了し、実際の結果・日付・対象を本書とマスタへ記録する。

1. 無料・商用公開サイトでの当該ウィジェット利用条件を公式の根拠で確認する。必要な場合の問い合わせ送信は別途明示依頼を受ける。
2. 米国8銘柄についてSymbol OverviewとMarket Dataの表示、取引所・通貨、遅延表示、4期間のチャートとPerformance列、欠測時の状態を確認する。表示不可の企業はexternalへ変更し、表の対象数・説明も合わせる。
3. 指数は銘柄そのもののMini Chart表示を個別確認したものだけverifiedへ変更。未確認・未対応は外部リンクを維持して公開可能。
4. ユーザーから画面確認依頼を受けた場合だけブラウザでPC・スマホ、銘柄リンク、戻る・進む、素早い企業切替、キーボード操作、表の横スクロール、スクリプトブロック時を確認する。現時点で未実施。
5. typecheck・対象ユニットテスト・差分確認。buildは明示依頼時のみ。commit・pushは別途明示依頼時のみ。

本番公開フラグの無効化と再ビルドでページ・導線・検索登録対象を止められる。外部障害時は自動再試行や前回価格の保存をせず、常設リンクを利用する。

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

## 検証記録

- `node --test tests/unit/stock-market.cjs tests/unit/watch-explorer.cjs`：初回29件通過（新規4件＋既存25件）。
- 企業切替・履歴、ウィジェットのイベント、独立DOMの破棄、遅延読込、sitemapの公開制御を追加後、`node --test tests/unit/stock-market.cjs`：8件通過。自社の挙動をフック・DOM模擬で確認し、外部ウィジェットは実行していない。
- `npm run typecheck`：1回実行、成功。lint・build・devサーバーは未実行。
- `git diff --check`：成功。変更対象の公開コード・文書の禁止語検索：該当0。
- 埋め込み用の日本語Mini Chart／Market Data ES module、Symbol Overview scriptの3URL：HTTP 200・JavaScript配信を確認。価格データ成功やUI表示の検証とは区別する。
- 10銘柄の公式銘柄ページ：HTTP 200とタイトルの識別子を照合。株価数値は抽出・保存していない。
- ブラウザ・実データ表示・商用条件の確定・本番反映・commit・push：未実施。
