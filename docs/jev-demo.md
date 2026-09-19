# Jev 不具合報告分類デモ

最終更新日: 2026-09-20

URL: `/labs/jev`。Gatewayの疎通、架空20条件の初回計測、ローカルのNext.js API経由の成功応答は確認済み。期待分類の運営者レビューとブラウザ確認は未完了。現在はnoindexで、sitemap・主要導線には含めない。

## 設定

費用・利用回数はVercel AI Gatewayで管理する。Upstash、Redis、独自の共有カウンターは不要。

1. GatewayのAPI Keysからデモ用キーを開き、Spend BudgetのEnable Budgetをオンにする。
2. 試作の推奨設定はLimit $1、Budget Refresh none（自動リセットなし）。保存後、反映を確認する。反映に数分かかる場合がある。
3. `.env.local`へ次を設定する。既存項目は残し、同じキーを重複させない。

```dotenv
AI_GATEWAY_API_KEY=取得したキー
JEV_DEMO_ENABLED=true
```

キーはGit管理外の`.env.local`かVercelのサーバー環境変数で扱う。チャット・公開コードには貼らず、`NEXT_PUBLIC_`を付けない。`npx vercel ai-gateway setup`はコーディングエージェント設定用なのでこのアプリには不要。

画面確認するときだけNode 22で`npm run dev`を起動し、`/labs/jev`を開く。確認後は停止する。Vercelへ公開する場合はデプロイ先にも2項目を設定し、再デプロイする。本番公開とnoindex解除は教材レビュー後。

## 費用管理の範囲

Gatewayは予算到達後の新規リクエストを拒否する。これは開始時判定のソフト上限であり、上限を超える進行中リクエスト等によって多少超過しうる。リセットなしなら累計予算として扱われる。BYOK利用分は予算の対象外。ホスティング費用もGateway予算とは別。

アプリはGatewayからの予算・利用枠の拒否を固定メッセージで表示する。SDKが500系エラーで包む場合も、cause内の構造化quota情報を確認する。429では時間をおく案内を返す。外部エラー本文・ヘッダー・秘密は返さない。SDKの自動リトライは無効（maxRetries: 0）、通信タイムアウトは12秒。

予算設定の有無をアプリが自動検証する機能はない。運営者がGateway管理画面で予算と利用状況を確認して有効化する。独自の1分・1日・累計回数制限は設けない。一般公開時の大量アクセス対策はVercel Firewall等で判断する。Origin検証は認証やボット対策の代わりではない。

停止する場合は`JEV_DEMO_ENABLED=false`を反映する。キーの失効・予算変更はVercel管理画面から行う。予算の解除や増額を自動で行わない。

## 構成・データ

- AI SDK 7.0.107のexperimental_evaluate、GatewayモデルID `typesafe-ai/jev`を使用する。このIDは固定の提供元バージョン番号ではない。
- 固定の架空報告10件×追加情報の前後、20条件。初回は質問版`report-change-v1`。測定器と製造設備の重なり、同一分野の複数作業を明確にした再評価版は`report-change-v2`。
- 分類は設備・材料・測定・複数・変更記載なし。原因・採否・人を判定しない。
- サーバーは固定IDだけを受け付け、文章や任意質問の持込みを拒否する。
- 確認項目と期待分類はCompassの編集データ。期待分類は未レビューであり、正解率を表さない。
- 固定文章だけをGateway経由でTypeSafeへ送信。zeroDataRetentionを指定する。Gateway利用ログ・メタデータや各社の保持条件は契約・管理画面設定に従う。
- アプリにDBはなく、ユーザーの入力・結果を保存しない。画面内結果を本人の操作でJSONとして端末へ保存できる。

## 初回実測

2026-09-20に疎通1件、その後に20条件を計測した。

- 仮の期待分類との一致: 16/20。
- API往復時間: 中央値364.5ms、範囲291〜896ms。モデル単体の推論時間ではない。
- 入力11,305トークン。100万トークンあたり$0.042を使った入力料金概算は$0.00047481。請求はGatewayで確認する。
- 不一致は測定器交換の前後2条件、校正後の初報、同一設備への二つの保全作業の初報。いずれもmultipleを選んだ。
- 設備と測定器の意味の重なり、同一分野の二作業の扱いが課題という仮説。質問と期待分類の両方をレビューする。

質問版v2では、測定・検査用の機器をmeasurementへ含め、同じ分野の複数作業はmultipleにしないことを明記して再評価した。

- 仮の期待分類との一致: 19/20。
- API往復時間: 中央値484ms、範囲325〜900ms。
- 入力12,765トークン。入力料金概算は$0.00053613。
- 測定器交換と校正の3条件は期待分類と一致するようになった。
- 同じ製造装置に対するポンプ交換と清掃の初報は、明示した基準に反してmultipleを選び、確信度0.87だった。高い確信度でも分類基準どおりとは限らない境界例として保持する。
- 評価途中でGatewayが500を2回返した。評価スクリプトは各回で停止し、`--all-resume`で成功済み条件を飛ばして未完了分だけ再開した。アプリ・SDKによる自動再試行は行っていない。

記録は`.private/jev-evaluation/smoke.json`と`all.json`（Git管理外）。少数の架空例から日本語全般や実業務の精度を一般化しない。公開記事には運営者の確認・観察を反映する。

予算設定後、ローカルのNext.js APIへ固定例を送信し、`200`、分類`equipment`、確信度0.56、入力545トークン、API往復1,371msを確認した。ホスト名を混在させた要求は`403`で拒否され、Origin検証の拒否経路も確認した。devサーバーは確認後に停止済み。

## 運営者用の再評価

- `node scripts/jev-evaluate.cjs --smoke`: 1条件
- `node scripts/jev-evaluate.cjs --pair`: 最初の例の前後2条件
- `node scripts/jev-evaluate.cjs --all`: 20条件
- `node scripts/jev-evaluate.cjs --all-resume`: 同じ質問版で成功済みの条件を飛ばし、未完了分だけ再開

同じモードの私用記録は上書きするので比較前に複製する。固定例のみ、最初の失敗で停止、自動再試行なし、150秒で次の呼び出しを止める。公開ページからこのスクリプトを実行しない。スクリプトの利用分も同じGatewayキー予算へ計上される。

## 検証

`node tests/unit/jev-demo.cjs`で固定入力・応答検証・Gateway予算エラー・429・秘密の非露出・リトライなしを確認。`npm run typecheck`は作業ごとに最大1回。build・ブラウザ確認は依頼時に実行する。

## 主な変更ファイル

`.env.example`、`src/app/api/jev/route.ts`、`src/app/labs/jev/page.tsx`、`src/components/JevDemo.tsx`、`src/lib/jev-demo.ts`、`src/app/privacy/page.tsx`、`scripts/jev-evaluate.cjs`、`tests/unit/jev-demo.cjs`、`docs/PRD.md`、`docs/architecture.md`、`docs/jev-demo.md`、`TASKS.md`。

## 一次資料（2026-09-20確認）

- https://vercel.com/kb/guide/typesafe-jev-and-ai-sdk
- https://vercel.com/docs/ai-gateway/observability-and-spend/budgets
- https://docs.typesafe.ai/models
- https://docs.typesafe.ai/confidence
- https://docs.typesafe.ai/legal
