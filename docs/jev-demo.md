# Jev 判断・調査ルートデモ

最終更新日: 2026-09-20

URL: `/labs/jev`。案Bとして架空3ケース×初報・追加情報2分岐（9条件）へ更新し、4判断の実API応答を確認済み。2026年9月20日から検索公開対象とし、`/tools`、sitemap、固定イベント計測を接続。本番で表示と利用状況を確認しながら改善する。

## 図解UI：pixel-investigation-v1

最初の「不合格が増えた」だけを、ドット絵SVGの観察図 → タップで予想 → Jevの提案、という流れに変更した。他の2ケースは既存UIを維持する。

- 初報は材料切替 → 製造 → 不合格増加。追加情報は装置間/検査器間の比較表を、設備アイコンと記号で表示。記号は個数・不良率ではなく傾向の図解。
- A/Bは別々の状況。固定教材の比較結果と実APIの提案を明確に分ける。主画面は短い説明に絞り、報告全文・確率・Score・技術情報・ページ末尾の補足は折りたたむ。
- 材料・装置・検査器・記録の4エリアを選んで予想できる。予想は採点・保存・API送信・計測しない。
- Jevが返した9種類の確認先を4エリアに表示上だけ対応付ける。調査員アイコンの移動と正確な確認先名で伝える。原因箇所の断定、確率の捏造、変わらない応答を変化として演出する処理はない。
- 追加情報の未評価・通信中・失敗時は「初報の提案」と明示。初報と分岐ごとの成功結果は既存のメモリキャッシュを使い、切替で再送しない。
- API、質問版、固定報告、予算管理、共有URL、canonicalは変更しない。閲覧計測に固定の `ui_version` を追加。
- Phaser・画像素材・新しい依存は追加せずReact/SVG/CSSで実装。OSの動きを減らす設定では矢印と調査員の移動演出を止める。

### 今回の検証

以下は成功。typecheckと対象lintは各1回のみ。既存APIのテストも通信モックであり、実APIは呼び出していない。

```bash
node tests/unit/jev-demo.cjs
node tests/unit/jev-visual.cjs
npm run typecheck
npx eslint src/components/JevDemo.tsx src/components/JevFactoryExperience.tsx src/data/jev-visual.ts src/app/labs/jev/page.tsx tests/unit/jev-visual.cjs tests/e2e/jev-demo.spec.ts
git diff --check
```

図解の分岐分離・全確認先の表示対応・サーバー描画・未評価/エラー時の初報表示・提案不変時の表示を検証。E2Eは新しい操作ラベル・キャッシュ・失敗時表示に合わせて更新したが、未実行。build・ブラウザ実機確認・ユーザーテストは未実施。

手動確認は320/375px・PC、キーボード選択、動きを減らす設定、AIアイコンの移動、初報/追加後の区別、分岐再選択での通信なし、詳細の開閉を対象にする。体験者が「どの比較で次の確認先を変えたか」を説明できるかは別途確認する。

変更ファイル：

- `src/components/JevFactoryExperience.tsx`（新規）、`src/data/jev-visual.ts`（新規）
- `src/components/JevDemo.tsx`、`src/app/labs/jev/page.tsx`、`src/app/labs/jev/jev.module.css`
- `tests/unit/jev-visual.cjs`（新規）、`tests/e2e/jev-demo.spec.ts`
- `docs/PRD.md`、`docs/architecture.md`、`TASKS.md`、本文書

推奨コミット：`feat: simplify Jev lab with pixel investigation visuals`

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

画面確認するときだけNode 22で`npm run dev`を起動し、`/labs/jev`を開く。確認後は停止する。Vercelの本番環境にも2項目を設定する。公開後はページ、API、`/tools`導線、sitemap、イベント受信を確認し、問題があれば小さく修正する。

## 費用管理の範囲

Gatewayは予算到達後の新規リクエストを拒否する。これは開始時判定のソフト上限であり、上限を超える進行中リクエスト等によって多少超過しうる。リセットなしなら累計予算として扱われる。BYOK利用分は予算の対象外。ホスティング費用もGateway予算とは別。

アプリはGatewayからの予算・利用枠の拒否を固定メッセージで表示する。SDKが500系エラーで包む場合も、cause内の構造化quota情報を確認する。429では時間をおく案内を返す。外部エラー本文・ヘッダー・秘密は返さない。SDKの自動リトライは無効（maxRetries: 0）、通信タイムアウトは12秒。

予算設定の有無をアプリが自動検証する機能はない。運営者がGateway管理画面で予算と利用状況を確認して有効化する。独自の1分・1日・累計回数制限は設けない。一般公開時の大量アクセス対策はVercel Firewall等で判断する。Origin検証は認証やボット対策の代わりではない。

停止する場合は`JEV_DEMO_ENABLED=false`を反映する。キーの失効・予算変更はVercel管理画面から行う。予算の解除や増額を自動で行わない。

## 構成・データ

- AI SDK 7.0.107のexperimental_evaluate、GatewayモデルID `typesafe-ai/jev`を使用する。このIDは固定の提供元バージョン番号ではない。
- 現在の質問版は`investigation-routing-v1`。固定の架空報告3件と各2分岐。追加情報は初報に1枚だけ付加し、分岐同士を混ぜない。
- 1回の要求でchange（変更分類Choice）、comparison（比較記録がある確率Boolean）、completeness（情報充実度Score）、route（次の確認領域Choice）を独立評価する。変更分類から確認先を固定変換しない。原因・採否・設備操作を判定しない。
- Booleanはtrueの確率でありconfidenceではない。Scoreは内部0〜4の加重平均を表示時に1〜5へ変換。分布・Scoreの検証はGatewayのrounding宣言に基づく丸め誤差を許容し、確率を再正規化しない。
- サーバーは固定IDだけを受け付け、文章や任意質問の持込みを拒否する。
- 確認領域はJevが選択し、説明文と学習リンクはCompassの固定データ。FDC・保全履歴は確認記録の案内のみ。専用解析の接続や実行はしない。
- 固定文章だけをGateway経由でTypeSafeへ送信。zeroDataRetentionを指定する。Gateway利用ログ・メタデータや各社の保持条件は契約・管理画面設定に従う。
- アプリにDBはなく、結果はメモリ内だけで保持。JSON保存は提供しない。初報と分岐ごとの成功結果を保持し、切替では再送しない。再読み込みで消える。
- 共有URLは`?case=batch|shift|unclear`のみ。未知IDは最初の例へ戻す。canonicalはパラメータなし。共有リンクを開いただけではAPIを実行しない。
- 計測へ送るのは固定ケース・追加情報ID、初報/追加後、HTTP状態、Jevが選んだ有限の確認領域、固定の遷移先のみ。報告本文、確率分布、結果一式は送らない。

## 案Bの実測（2026-09-20）

9条件で4判断を検証した。これは少数の教材に対する観察であり、精度評価ではない。

- 材料変更の初報は次の確認先が測定系、confidence 0.24。別装置でも同じ傾向の追加情報では材料（0.95）、同一試料の検査器間差では測定系（0.96）。3条件とも変更分類はmaterial。
- 清掃・校正が重なる初報は測定系（0.38）。基準試料の差では測定系（1.00）、装置Aだけの差が再測定でも確認される分岐では保全履歴（0.88）。3条件とも変更分類はmultiple。
- 曖昧な初報は基本情報の収集。変更が重なる場合と記録が矛盾する場合は工程履歴。矛盾例の比較記録確率は0.04、情報充実度は表示1.54/5。
- 入力合計12,244トークン。途中の確率丸め検証失敗はrounding対応で修正。Gatewayの500は未完了1条件のみ手動再開。SDKによる自動再試行なし。
- 記録は`.private/jev-evaluation/investigation-routing-v1-all.json`。旧版の評価記録とは別ファイルに保持する。

## 旧分類デモの実測（過去記録）

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
- `node scripts/jev-evaluate.cjs --pair`: 最初の例の初報＋2分岐（3条件）
- `node scripts/jev-evaluate.cjs --all`: 全9条件
- `node scripts/jev-evaluate.cjs --all-resume`: 同じ質問版で成功済みの条件を飛ばし、未完了分だけ再開

同じ質問版・同じモードの私用記録は上書きするので比較前に複製する。固定例のみ、最初の失敗で停止、自動再試行なし、150秒で次の呼び出しを止める。公開ページからこのスクリプトを実行しない。スクリプトの利用分も同じGatewayキー予算へ計上される。

## 検証

`node tests/unit/jev-demo.cjs`で分岐の分離、4型回答の検証、丸め精度、Gateway予算エラー・429・秘密の非露出・リトライなしを確認。`tests/e2e/jev-demo.spec.ts`はモック通信による前後比較・失敗時の初報保持・分岐切替・結果の再利用・共有URL・画面幅を確認する。`npm run typecheck`は作業ごとに最大1回。buildは依頼時だけ実行する。

## 主な変更ファイル

`.env.example`、`src/app/api/jev/route.ts`、`src/app/labs/jev/page.tsx`、`src/components/JevDemo.tsx`、`src/lib/jev-demo.ts`、`src/app/privacy/page.tsx`、`scripts/jev-evaluate.cjs`、`tests/unit/jev-demo.cjs`、`docs/PRD.md`、`docs/architecture.md`、`docs/jev-demo.md`、`TASKS.md`。

## 一次資料（2026-09-20確認）

- https://vercel.com/kb/guide/typesafe-jev-and-ai-sdk
- https://vercel.com/docs/ai-gateway/observability-and-spend/budgets
- https://docs.typesafe.ai/models
- https://docs.typesafe.ai/confidence
- https://docs.typesafe.ai/legal
