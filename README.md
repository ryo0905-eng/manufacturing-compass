# Manufacturing Compass

Manufacturing Compass は、製造技術者の仕事と半導体キャリアの次の一歩を支える、日本語の実務プラットフォームです。

求人の転載や合否判定を目的にせず、実務ツール、Career Compass、半導体業界地図、企業データベース、技術・キャリア記事を通じて、日々の課題解決とキャリア理解をつなぎます。

本番URL: [https://mfg-compass.com](https://mfg-compass.com)

## 現在の中心機能

### 実務ツール

- 生データの全体標準偏差からPp・Ppk、別途求めた短期標準偏差からCp・Cpkを計算
- ヒストグラム、規格中心からのずれ、ルールベースの確認候補を表示
- 登録不要で、入力した測定データを保存・外部送信しない
- 工程能力の読み方と、評価時の注意点を併記

### Career Compass

- 12問、登録不要、個人情報を保存しない静的ルールベース
- 製造業経験を半導体職種へ翻訳する
- 転職材料の整理度、参考年収帯、経験と接点のある企業例を示す
- 今日、30日、3か月、半年、1年の準備を提案する
- 合否、企業評価、採用可能性、実際の提示年収は判定しない

### 情報コンテンツ

- 半導体業界地図とセグメント
- 企業一覧、企業詳細、キャリア準備、企業比較
- 半導体製造工程、装置、材料、部品の技術解説
- 運営者の実体験を核にした転職・キャリア記事
- 公開情報に基づくランキング
- 転職エージェント比較と相談準備

## 現在の方針

- 半導体業界に限定する
- ローカル静的データで小さく運用する
- ログイン、ユーザー保存、口コミ、求人連携、AI キャリア診断は実装しない
- SEO と情報構造を重視する
- 出典、更新日、匿名化、人間による確認を優先する
- アフィリエイトより信頼性を優先する

詳細は [Product Requirements Document](./docs/PRD.md) を参照してください。文書の役割と優先順位は [Documentation Map](./docs/documentation-map.md) にまとめています。

## 技術スタック

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Vercel
- Vercel Analytics
- 任意で GA4（本番環境変数がある時だけ有効）
- Playwright

Supabase と OpenAI API は現在使用していません。

## ローカル開発

Node.js `>=20.9 <24` が必要です。

```bash
npm install
npm run dev
```

通常は `http://localhost:3000` で起動します。

主な検証コマンド:

```bash
npm run typecheck
npm run lint
npm run test:e2e
npm run build
```

`npm run build` は `next build --webpack` を実行します。AI エージェントが作業する場合の回数制限と実行条件は `AGENTS.md` に従ってください。build は明示的に求められた時だけ実行します。

Playwright を初めて使う環境では、事前に Chromium をインストールします。

```bash
npx playwright install chromium
```

`playwright-report/`、`test-results/`、`blob-report/` は生成物であり Git 管理外です。

## 主要なディレクトリ

```text
src/app/                 App Router のページとメタデータ
src/components/          UI とインタラクション
src/data/                Career Compass、企業、広告などの静的データ
src/content/guides/      公開ガイド記事
src/types/               共通の公開データ型
docs/                    公開してよい設計・編集文書
.private/                Git 管理外の取材メモ・公開禁止情報
tests/                   Playwright テスト
```

`.private/` には個人情報と公開不可情報が含まれます。公開コードや公開文書へ直接コピーしないでください。

## デプロイ

Vercel で `main` を本番、Pull Request を Preview として運用します。

- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: 未指定
- 正規ドメイン: `https://mfg-compass.com`

正規URLは `src/lib/format.ts` の `siteUrl` と `src/app/layout.tsx` の `metadataBase` で管理します。ドメイン変更時は両方を更新します。

確認対象:

- `/`
- `/career-compass`
- `/tools/cpk`
- `/guides`
- `/companies`
- `/career-agents`
- `/sitemap.xml`
- `/robots.txt`

保護された Preview URL は外部ユーザーを Vercel ログインへ送るため、公開導線や計測の確認には本番URLを使います。

## アクセス解析

Vercel Analytics は常時有効です。GA4 は Vercel の Production 環境に次を設定した時だけ有効になります。Preview / Development には原則設定しません。

```sh
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

イベント定義は `src/lib/analytics.ts` に集約します。氏名、連絡先、自由記述、現年収、12問の回答一式は送信しません。`diagnosis_complete` では集計用に、職種領域、転職目的、結果タイプ、相談テーマの粗いカテゴリを送信します。選択肢を追加する時は、個人を推測できる粒度にならないか確認します。

主要イベント:

- `diagnosis_start`
- `diagnosis_progress`
- `diagnosis_complete`
- `result_detail_open`
- `today_quest_copy`
- `agent_cta_click`
- `affiliate_outbound_click`

## ドキュメント

- [文書の索引と優先順位](./docs/documentation-map.md)
- [プロダクト要件](./docs/PRD.md)
- [アーキテクチャ](./docs/architecture.md)
- [SEO 方針](./docs/seo.md)
- [コンテンツ方針](./docs/content-guideline.md)
- [記事制作フロー](./docs/article-workflow.md)
- [ロードマップ](./docs/roadmap.md)
- [作業状況](./TASKS.md)
