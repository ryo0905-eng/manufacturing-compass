# Phase 1 Implementation Brief

Phase 1 で Next.js MVP を作り始める前の実装ブリーフです。

## 作るもの

- Next.js App Router アプリ
- TypeScript
- Tailwind CSS
- トップページ
- 半導体業界地図
- 企業一覧
- 企業詳細ページ
- 企業比較ページ
- 基本的な検索・フィルター
- 企業ページ内のキャリア準備情報
- アフィリエイト CTA
- SEO メタデータ
- sitemap

## 作らないもの

- ログイン
- ユーザーアカウント
- 口コミ
- AI チャット
- AI キャリア診断
- キャリア現在地診断フォーム
- 求人応募機能
- 求人データ連携
- Supabase 接続
- 管理画面
- 半導体以外の業界カテゴリ

## 初期データ方針

Phase 1 はローカル静的データで開始します。

- 初期企業は 3〜5 社
- Phase 2 で 10 社以上へ拡張
- 企業情報、財務情報、採用情報には情報ソース URL と最終更新日を持たせる
- 型定義は Supabase 移行を見据えて整理する

## 初期ページ範囲

- `/`
- `/industry-map`
- `/companies`
- `/companies/[slug]`
- `/compare`
- `/compare/[slug]`

`/articles`、`/rankings`、`/segments`、`/career-readiness`、`/career-path` は Phase 2 以降で追加します。

## UX 方針

- 求人応募ではなく、業界理解と企業研究を主役にする
- アフィリエイト CTA はページ後半に自然に置く
- 今狙える会社と将来チャレンジできる会社を分けて表現する
- 「無理」「難しい」ではなく「今すぐはチャレンジング」「準備すると可能性が上がる」と表現する

## 技術方針

- Server Components を基本にする
- Client Components は検索、フィルター、比較選択に限定する
- 静的データと表示コンポーネントを分離する
- SEO メタデータを各ページで定義する
- sitemap を生成する
