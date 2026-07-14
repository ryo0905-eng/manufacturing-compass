# Manufacturing Compass

Manufacturing Compass は、半導体業界への転職を考える人が、求人を見る前に業界・企業・仕事内容・キャリアパスを理解できる日本語のキャリアプラットフォームです。

単なる求人サイトではなく、半導体業界地図、企業データベース、企業比較、転職者目線の企業研究、キャリア準備情報を通じて、「今狙える会社」と「将来チャレンジできる会社」への道筋を示します。

## なぜ作るのか

半導体業界は成長領域でありながら、企業の役割、職種、必要経験、英語力、キャリアパスが外から見えにくい領域です。Manufacturing Compass は、転職希望者が自分の現在地を理解し、半年後・1年後・数年後に向けて具体的な準備を進められる状態を目指します。

## 主な機能

- 半導体業界地図
- Career Compass
- 企業データベース
- 企業詳細ページ
- 企業比較ページ
- 転職者目線の企業研究
- キャリア準備情報
- 将来的なキャリア現在地チェック
- 将来的な AI キャリア診断
- 転職エージェント相談への自然な CTA

## 想定ユーザー

- 半導体業界への転職を検討している人
- 製造業、電子部品、品質保証、生産技術、設備保全などの経験を半導体業界で活かしたい人
- 今すぐ転職したい人
- 今はまだ届かない会社に、半年後・1年後・数年後に挑戦したい人

## 将来の技術スタック

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Vercel
- Google Analytics
- Google Search Console
- PostHog

## 現在のフェーズ

現在は Phase 1 です。Next.js App Router、TypeScript、Tailwind CSS による MVP 実装を開始しています。

Phase 1 の MVP では、まず静的データを使って小さく公開します。Supabase、AI 診断、ログイン、口コミ、求人連携は MVP 後に検討します。

現在の中心導線は Career Compass です。ユーザーが職種、経験年数、英語、転職の狙いを選ぶと、今近い領域、狙いやすい会社、半年後に向けた準備、転職エージェントに相談すべき論点を返します。

## ローカル開発

```bash
npm install
npm run dev
```

開発サーバーは通常 `http://localhost:3000` で起動します。

検証コマンド:

```bash
npm run typecheck
npm run lint
npm run build
```

Next.js 16 は Turbopack がデフォルトですが、このリポジトリの `npm run build` は Codex 環境でのポート制限を避けるため `next build --webpack` を使います。

Codex 内で作業する場合、日常確認は `npm run typecheck` を優先し、フルビルドは必要な時だけ実行してください。

### ブラウザ回帰テスト

主要導線は Playwright で確認します。初回だけ Chromium をインストールしてください。

```bash
npx playwright install chromium
npm run test:e2e
```

テスト結果の `playwright-report/`、`test-results/`、`blob-report/` は生成物のため Git には含めません。

## Vercel デプロイ手順

Vercel への初回デプロイは、GitHub リポジトリを Vercel に接続する操作が必要です。基本的にはブラウザで自分の Vercel アカウントから行います。

1. Vercel にログインする
2. `Add New...` から `Project` を選ぶ
3. GitHub 連携を有効にする
4. `ryo0905-eng/manufacturing-compass` を選ぶ
5. Framework Preset が `Next.js` になっていることを確認する
6. Build Command は `npm run build`
7. Install Command は `npm install`
8. Output Directory は空欄のままでよい
9. `Deploy` を押す

初回接続後は、`main` ブランチへ push すると Vercel が自動で本番デプロイします。Pull Request を使う場合は Preview Deployment も作成されます。

公開状態を確認する場合は、Vercel の Deployment Protection が有効になっていない本番URLを使ってください。保護された Preview URL では、外部ユーザーは Vercel ログイン画面にリダイレクトされるため、診断開始率や CTA 導線を確認できません。

## 独自ドメイン設定

本番の正規ドメインは `https://mfg-compass.com` です。

Vercel での設定:

1. Vercel の Project Settings を開く
2. `Domains` を開く
3. `mfg-compass.com` を追加する
4. Vercel が表示する DNS レコードを、ドメイン購入先の DNS に設定する
5. `www.mfg-compass.com` も必要なら追加し、`mfg-compass.com` へリダイレクトする
6. Vercel 側で Valid になるまで待つ

DNS 接続後に確認するURL:

- `https://mfg-compass.com`
- `https://mfg-compass.com/career-compass`
- `https://mfg-compass.com/sitemap.xml`
- `https://mfg-compass.com/robots.txt`

コード側の正規URLは `src/lib/format.ts` の `siteUrl` と `src/app/layout.tsx` の `metadataBase` で管理します。ドメインを変更する場合は、この2か所を必ず更新してください。

診断本体は静的ルールベースで動作します。Supabase はまだ使っていません。

## アクセス解析

初期のアクセス解析は Vercel Analytics を使います。

- `@vercel/analytics` を導入済み

## Analytics

Vercel Analytics は常時有効です。GA4 も利用する場合は、Vercel の **Production** 環境に次の環境変数を設定してください。Preview / Development 環境は本番データを混ぜないため、原則として未設定にします。

```sh
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

未設定の場合、GA4 のタグとイベント送信は無効のままです。計測イベントは `src/lib/analytics.ts` に集約し、個人を特定できる情報や自由記述を送信しないでください。
- `src/app/layout.tsx` で `<Analytics />` を読み込み済み
- Vercel の Project Settings または Analytics 画面で有効化すると計測できます

Career Compass の主要イベント:

- `diagnosis_start`: 最初の回答を選択
- `diagnosis_progress`: 4問・8問・12問の到達時に各1回送信
- `diagnosis_complete`: 診断結果の表示準備が完了
- `result_detail_open`: 診断根拠と相談準備を開く
- `today_quest_copy`: Today Quest をコピー
- `agent_cta_click`: 診断結果から相談先へ遷移

`diagnosis_progress` が送るのは完了質問数、総質問数、表示元だけです。選択した回答、職種、年収、自由記述は送信しません。

まず見る指標:

- トップから Career Compass への遷移
- Career Compass の閲覧数
- 結果画面から相談CTAへの遷移
- ガイド、ランキング、企業ページから診断への遷移

GA4 は、広告運用やSearch Consoleとの詳細連携が必要になった段階で追加します。
