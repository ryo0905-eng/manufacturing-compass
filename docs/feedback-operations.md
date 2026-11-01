# 意見募集の設定・運用

実装状態: ローカル実装。外部サービスの作成、設定、デプロイ、受信・削除・計測の本番確認は未完了。準備が完了するまで `FEEDBACK_ENABLED` を `false` または未設定にする。

## 構成と収集範囲

設置先はCpk、管理図、時価総額ランキング、工場新設記事。フォームは表示設定が有効なときだけServer Componentから出力され、Cloudflareのスクリプトはフォームを開いたときだけ読み込む。計算の入力データ・結果・URLの検索条件を受け渡さない。回答は匿名で送信可能、メールは明示同意をした希望者だけ。

同一オリジンAPI → Turnstile検証・Upstashのレート制限 → 専用Apps Script → 非公開Google Sheets。Apps Scriptは同一IDで同一内容の再送を重複保存しない。内容を変えた同一IDの再送は拒否する。送信失敗後に内容を変えたい場合は、送信済みの可能性があるため、重複に注意してページを再読み込みする。

`responses` の固定項目は匿名集計に利用する。自由記述は180日、`contacts` のメールは90日を目安に削除する。2タブは同一ファイル内であり権限分離ではない。ファイル共有は必要な運営者だけに限定し、回答を公開・AI処理しない。フォーム内とプライバシーポリシーに削除依頼の窓口を記載している。

## 公開前の設定

1. 独立した非公開GoogleスプレッドシートとApps Scriptプロジェクトを作成し、`scripts/feedback/Code.gs` と `appsscript.json` を設定する。既存の問い合わせ回答シート・分析シートを受信先に使わない。公開Webアプリの実行者は所有者、アクセスは匿名を含む全員とする。URLが分かる人は到達できるので、長いランダムな秘密値を必ず設定し、コード・ログ・公開画面へ載せない。
2. Script Propertiesに `FEEDBACK_SPREADSHEET_ID` と `FEEDBACK_SINK_SECRET`（32文字以上のランダム値）を設定。`setupFeedback` を所有者として実行し、必要な権限、3タブと日次 `maintainFeedback` トリガーを確認。異なる実行者のトリガーは管理できないので運営者を固定する。トリガー失敗通知を監視し、削除の実行状態を定期確認する。
3. Apps ScriptをWebアプリとしてデプロイし、`https://script.google.com/macros/s/.../exec` のURLを取得。`/dev` は使用しない。Google側に認証済みのサーバー間受信しか保存されないこと、直接アクセスで秘密値なしの書き込みが失敗することを確認する。
4. Cloudflare Turnstileで `mfg-compass.com` 用のサイトキー・秘密鍵を作る。送信APIは `hostname=mfg-compass.com` と `action=feedback` を検証する。Vercel上の同一本番ホストでのみ送信する。Turnstileに関する[サーバー検証](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)を参照。
5. Upstash RedisのREST URL・書き込みトークンを用意する。送信者のIPからサーバー上の秘密値を使ってHMACを計算し、1時間10回までの回数制限に使う。Redisキーは1時間で自動失効する。本文・メールはRedisへ送らない。[REST API](https://upstash.com/docs/redis/features/restapi)。
6. VercelのProduction環境変数へ `.env.example` の `FEEDBACK_` 値を設定。`FEEDBACK_SINK_SECRET` はScript Propertiesと一致させ、`FEEDBACK_RATE_SECRET` は別の32文字以上のランダム値にする。公開環境では `FEEDBACK_ENABLED=true` のみ表示。表示はビルド時に静的生成されるため、設定変更後は再デプロイする。
7. 公開前に管理者限定のテスト環境で匿名／任意メール／同意不備／多重送信／保存失敗／認証失敗／回数制限／期限削除を確認。テスト回答を削除し、トリガー・外部サービス・データ保管場所・権限・削除依頼の受付体制を確認する。実サイトの送信・GA4受信を確認して初めて稼働中と記録する。自動計測を自然流入と混同しない。

## GA4と集計

`feedback_view` は実露出、`feedback_open` はフォーム展開、`feedback_interest_click` は候補選択、`feedback_submit` は保存成功後。`source_page`、`survey_id`、`need_id`、`feature_id`、`interest_level`、`placement`、`ui_version` は固定値のみ。自由記述、連絡先、識別ID、ツールの入力・結果をイベントへ送らない。GA4やVercelのイベント件数はユニーク回答者数ではない。

GA4にイベントスコープの `source_page`、`survey_id`、`need_id`、`feature_id`、`interest_level` を登録し、Data APIで取得可能になってから、既存分析Apps Scriptに更新版を反映し、`exportFeedbackEvents` を手動実行する。別の `GA4_Feedback` タブに前日まで7日分を日次×イベント×固定属性で更新する。既存の日次自動更新や `GA4_Events` の列は変えない。登録反映前の実行は失敗し得るため、通常の日次処理と切り離している。登録前のデータは遡及保証されない。期間全体の人数を日別ユーザー数の和で求めない。

実受付数はGoogle Sheetsの `responses` を正とする。`ranking` は日次メンテナンスで設置ページ×希望機能の回答件数を並べる。`responses` のsurvey・need・feature・interestを使えばページ別課題や先行体験関心をピボットできる。除外や重複排除を含む手動の分析前に、非公開のまま取り扱う。GA4の送信イベントはブロック等で欠測し得る。GSCクリックをGA4送信率の分母にせず、回答数を人数・購入意思と呼ばない。4週間後に件数と内容を確認し、少数なら観測を継続する。

## 障害と停止

Turnstile・Redis・Sheetsのいずれかが使えなければ受付は失敗し、入力内容は画面に残る。エラー時は資格情報、Apps Scriptのデプロイとトリガー、サービス状態を確認する。ログに回答本文・メール・秘密値を出力しない。停止は `FEEDBACK_ENABLED=false` と再デプロイ。停止後も保存済み回答・連絡先の削除期限と問い合わせ対応を維持する。
