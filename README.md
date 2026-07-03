# Manufacturing Compass

Manufacturing Compass は、半導体業界への転職を考える人が、求人を見る前に業界・企業・仕事内容・キャリアパスを理解できる日本語のキャリアプラットフォームです。

単なる求人サイトではなく、半導体業界地図、企業データベース、企業比較、転職者目線の企業研究、キャリア準備情報を通じて、「今狙える会社」と「将来チャレンジできる会社」への道筋を示します。

## なぜ作るのか

半導体業界は成長領域でありながら、企業の役割、職種、必要経験、英語力、キャリアパスが外から見えにくい領域です。Manufacturing Compass は、転職希望者が自分の現在地を理解し、半年後・1年後・数年後に向けて具体的な準備を進められる状態を目指します。

## 主な機能

- 半導体業界地図
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
- OpenAI API

## 現在のフェーズ

現在は Phase 1 です。Next.js App Router、TypeScript、Tailwind CSS による MVP 実装を開始しています。

Phase 1 の MVP では、まず静的データを使って小さく公開します。Supabase、AI 診断、ログイン、口コミ、求人連携は MVP 後に検討します。

## ローカル開発

```bash
npm install
npm run dev
```

開発サーバーは通常 `http://localhost:3000` で起動します。

検証コマンド:

```bash
npm run typecheck
npm run build
```

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

現時点では Supabase や OpenAI API は使っていないため、Vercel の Environment Variables は未設定で問題ありません。
