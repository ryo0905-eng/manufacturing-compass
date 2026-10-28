# 時価総額ランキングの概要・探索UI

更新日：2026-10-28

対象は `/guides/semiconductor-market-cap-ranking`。URL、metadata、既存見出し、構造化データ、データ基準日、世界30社・日本18社、参考のトヨタ、企業説明・内部リンク・広告導線を維持する。

- `MarketCapRankingOverview` は既存の世界・日本データを時価総額順に読み、首位2社と首位同士の倍率を算出する。業界全体の総額や前年比とは扱わない。基準日・米ドル・出典への導線を併記する。
- 世界一覧の `MetricBarChart` に同じデータのTOP10を表示。0始まり・首位を最大とする共通尺度で、対数・最低幅による誇張は行わない。企業名は世界一覧の `#world-company-{id}` へ移動する。日本・世界のサマリーも各一覧の企業へ移動する。
- サマリー・棒・数値・企業情報はServer Componentから出力する。新規データ取得・依存は追加しない。グラフのリンクのみ既存の `TrackedInternalLink` で `article_internal_click` を記録する。
- 詳細一覧は企業説明を展開表示したまま、順位・金額の文字階層、余白、比較ボタンの選択表示を改善する。国・分類・ティッカー・英文社名を削除しない。
- 比較は既存Provider・2社上限・固定バー・dialog・共有hash・イベントを継続。新しい比較状態や保存は作らない。固定バーに既存ロゴを使い、safe-area・高さ上限・閉じた後の選択保持を継続する。
- 規模と役割の違いは業界地図、業績は掲載決算、現在の株価は株式市場ウォッチへ案内する。株式市場の公開フラグに従う。既存の目的別・キャリア・書籍導線も維持する。

実装判断：サマリーとTOP10は効果が大きく低〜中難度。カード整理はモバイルと情報保持の両立に注意。比較と回遊は既存機能の見せ方を変更する範囲に絞る。各変更のSEOリスクは低いが、順位・本文・canonical・構造化データの出力を確認する。CTRや比較利用率の改善は公開後の計測で評価し、未計測の効果を実績とは扱わない。

## 検証（2026-10-28）

- `npm run typecheck`：1回・成功。
- `npx --no-install eslint src/components/MarketCapRankingOverview.tsx src/components/MarketCapRankingTable.tsx src/components/MetricBarChart.tsx src/components/RankingCompanyCompare.tsx 'src/app/(ja)/guides/[slug]/page.tsx'`：1回・成功。
- `npm run build`：1回・Webpackで258ページ生成に成功。上記3チェック後に比較バーのロゴ幅とdialogのフォーカス循環を補正し、最終状態はブラウザで検証した。チェック回数制限に従い再実行していない。
- `node --test tests/unit/ranking-company-compare.cjs`：旧仕様のグラフ非表示・棒数・日時・リンク検査を更新後、成功。順位、参考行、全企業情報、アンカー、FAQ、metadata、他記事への影響を検査。
- `node tests/browser/ranking-company-compare.cjs`：成功。360／390／768／1280px、表の情報保持と横はみ出し、TOP10の順序・棒幅・移動先、サマリーの移動先、JavaScript無効時のランキングとcanonical・構造化データを検査。選択／解除／上限／タブ／Escape／背景クリック／フォーカス循環と復帰／共有／コピー失敗時の代替／地図への遷移を確認。実行中のpageerrorなし。
- ブラウザ起動とlocalhostのbindはsandboxで拒否されたため、同じ検証を権限昇格して実施。同一共有URLの再訪では画面遷移が発生しないため、各ケースを通常URLから開始するようテストを修正。
- 360pxで長い日本語2社の固定バーを追加確認。モバイルではA／Bの補助ラベルを省き、ロゴ幅と間隔を小さくして選択社名の折り返しを抑える。解除ボタンの44px操作領域は維持。
- `git diff --check`：成功。変更した公開文面の禁止語確認で該当なし。

実機iPhone／Safari、公開後のCore Web Vitals・検索流入・比較率・CTAクリック率は未計測。ローカルブラウザの画面幅検証と区別する。commit・push・本番反映は行っていない。
