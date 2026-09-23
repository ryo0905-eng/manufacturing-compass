# 求人票の確認ノート

更新日：2026-09-23。既存相談準備ページ内に通常表示。本番反映・GA4受信は未確認。

## 提供範囲

`/career-consultation#job-posting-note` に8項目の選択式ノートを追加。企業比較とCareer Compass結果から接続する。既存の相談メモひな形と広告導線は維持し、結果から相談ひな形へ進める。独立URLや求人データ連携、会社名・経歴・金額・本文の自由入力は追加しない。

仕事内容、必須／歓迎要件、初期配属、契約／試用期間、時間／休日、出張／交替勤務、給与内訳、選考準備を確認する。勤務地・業務・時間・出張・給与の質問文は既存の転職の軸データを再利用。項目・質問は編集上の相談例であり、公式の網羅的チェックリストや法律適合性の判定ではない。

## 状態と出力

初期値は「まだ読んでいない」。記載あり・記載が見つからない・意味が曖昧を区別する。1項目以上読んだ状態なら途中でも明示作成できる。未読は欠落と見なさず、コピー文でも別欄に残す。記載ありは質問候補から除き、全項目記載ありでも応募可・条件確定などの判定を出さない。

回答変更で結果・コピー通知を消し、再作成を促す。明示クリアで初期化。コピー用テキストは読取専用で表示し、API失敗時も手動コピーできる。コピー完了待ち中の編集・クリア後に旧通知を再表示しない。会社名を含まないため、複数求人を扱う場合の識別は本人の持ち帰り先で行う。

## 正確性・公開・プライバシー

[ハローワーク「求人情報の見方」](https://www.hellowork.mhlw.go.jp/member/job_offer_search06.html) を2026-09-23に確認。仕事内容・就業場所・試用期間・賃金・時間などの観点と、求人票と雇用契約書の区別を参照。質問文はサイト独自の編集例と明示する。記載なしを求人の悪さや応募不可に結び付けない。

回答はメモリだけで保持し、Storage・URL・サーバーへ保存しない。計測は固定actionとUI版のみで回答・項目・本文を送らない。既存canonical維持、WebApplication構造化データとメタ説明を追加、sitemapの既存URLの更新日を更新。人間の確認者情報は追加しない。

## 検証

`node tests/unit/job-posting-note.cjs` 成功。全8項目×4状態、未読と未記載の区別、途中／全記載ノート、旧結果とコピー待ちの破棄、初期露出と操作後の結果露出、計測属性、計測障害時の継続、SSR、既存sitemap、Next同梱CSS Modulesプラグインによるpureモードのコンパイルを確認。UIと露出はモック。`npm run typecheck` は1回成功。`git diff --check` と変更ファイルの禁止語・新規ファイル空白確認も実施。ブラウザ確認は依頼がないため未実施。dev・build・lint・commit・pushは実施しない。本番反映・実機・GA4受信は未確認。

## 変更ファイル

新規：`src/data/job-posting-note.ts`、`src/lib/job-posting-note.ts`、`src/components/JobPostingNote.tsx`・CSS Module、`tests/unit/job-posting-note.cjs`、本仕様書。
更新：相談準備ページ、企業比較ページ、CareerCompassResult、sitemap、PRD、architecture、conversion-architecture、documentation-map、企画書、TASKS。

推奨コミット：`feat: add job posting review notes`
