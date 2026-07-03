# Architecture

このドキュメントは将来の技術アーキテクチャ方針です。Phase 0 ではコードを作成しません。

## 想定技術

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Vercel
- Google Analytics
- Google Search Console
- PostHog
- OpenAI API

## フロントエンド構成

Next.js App Router を使い、Server Components を基本にします。企業詳細、セグメント、記事、比較ページは SEO を重視し、可能な限りサーバー側でレンダリングします。

Client Components は検索、フィルター、比較選択、診断フォームなど、ユーザー操作が必要な箇所に限定します。

## データ構成

Phase 1 ではローカル静的データを使います。Supabase は、更新頻度、管理画面、ユーザー機能が必要になった段階で導入します。

企業情報、業界セグメント、製品カテゴリ、財務指標、拠点、キャリア情報、アフィリエイトパートナーを分けて管理します。

企業情報や財務情報には、情報ソース URL と最終更新日を必ず持たせます。

Phase 1 の想定:

- `src/data/companies`
- `src/data/segments`
- `src/data/articles`
- `src/data/affiliate-partners`
- `src/types`

## コンテンツ構成

- 企業詳細ページ
- セグメントページ
- 比較ページ
- ランキングページ
- 初心者向け記事
- キャリア準備ページ

コンテンツは SEO の検索意図ごとに設計し、企業ページから関連記事、比較ページ、キャリア準備ページへ内部リンクします。

## SEO 構成

- ページごとの title と description
- OGP
- canonical
- sitemap
- robots.txt
- Article、Organization、BreadcrumbList などの構造化データ
- 内部リンク設計

## デプロイ構成

Vercel にデプロイします。main ブランチを本番、プルリクエストを Preview として扱う想定です。Search Console と Analytics を導入し、公開後の検索流入と CTA クリックを測定します。

## 将来の AI 機能構成

OpenAI API は、キャリア診断、企業比較の補助、ロードマップ生成に利用する可能性があります。AI 出力は助言として扱い、断定的な合否判定や不確かな企業情報の生成には使いません。

## 将来のキャリア現在地診断構成

ユーザーの職種、経験年数、業界経験、英語力、スキル、資格、希望職種を入力として、以下を返す構成を想定します。

- 今狙いやすい会社・職種
- 今すぐはチャレンジングだが将来狙える会社
- 足りない経験・スキル
- 半年後の準備アクション
- 1年後の準備アクション
- ステップになる会社

Phase 1 では診断フォームを作らず、企業詳細ページと比較ページの中で「今狙いやすい背景」「将来チャレンジしやすい背景」「半年後・1年後の準備」を表示します。
