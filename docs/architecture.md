# Architecture

## 方針

Manufacturing Compass は、情報サイトではなく「半導体キャリア市場価値診断」を中心にしたキャリア診断プロダクトとして設計する。

Phase 1.5 では、ログイン、個人情報保存、AI、求人連携は使わず、ローカル静的データとルールベースで診断体験を作る。

## 想定技術

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel
- Google Analytics
- Google Search Console
- 将来的に Supabase
- 将来的に PostHog
- 将来的に OpenAI API

## フロントエンド構成

Server Components を基本にする。

Client Components は、診断フォーム、診断結果の状態管理、検索、フィルター、比較選択など、ユーザー操作が必要な箇所に限定する。

重要な体験:

- `/`: 診断開始を主役にしたトップページ
- `/diagnosis` または `/career-value-check`: 半導体キャリア市場価値診断
- `/diagnosis/result`: 将来的な結果ページ
- `/companies`: 企業 DB
- `/companies/[slug]`: 企業詳細
- `/compare`: 企業比較
- `/industry-map`: 業界理解

## Phase 1.5 のデータ構成

ローカル静的データで開始する。

- `src/data/diagnosis`
- `src/data/companies`
- `src/data/segments`
- `src/data/affiliate-partners`
- `src/types`

診断ロジックは、ユーザー入力を以下の出力へ変換する。

- marketValueScore
- salaryRange
- reachableRoles
- reachableCompanies
- stretchCompanies
- growthLevers
- actionsToday
- roadmap30Days
- roadmap90Days
- roadmap6Months
- recommendedCtas

## 将来のデータ構成

Supabase を導入する場合は、以下を保存対象にする。

- 診断結果
- メール登録
- CTA クリックイベント
- 診断入力の匿名集計
- 記事閲覧履歴
- ユーザーアカウント

ただし、個人情報保存は需要検証後に行う。

## 診断ロジック

Phase 1.5 では静的ルールベース。

入力例:

- 現在職種
- 経験年数
- 業界経験
- 英語力
- 実績
- 志向
- 転職時期

出力例:

- 市場価値スコア
- 想定年収レンジ
- 今狙える職種・会社
- 伸ばすべき経験・スキル・英語
- 今日やること
- 相談すべき論点

## SEO 構成

診断ページはコンバージョンの中心。

SEO流入は以下から診断へつなぐ。

- 半導体 転職 市場価値
- 半導体 転職 年収
- 品質保証 半導体 転職
- 生産技術 半導体 転職
- 設備保全 半導体 転職
- 半導体 転職 英語

## CTA 構成

診断結果に応じてCTAを出し分ける。

- 転職エージェント
- 英語学習
- 資格・学習教材
- 将来的な有料ロードマップ

CTA は結果の直後ではなく、ユーザーが「なぜ必要か」を理解した後に出す。

## デプロイ構成

Vercel にデプロイする。

main ブランチを本番、Pull Request を Preview とする。

Vercel 連携後は、Codex ローカルで Next.js build が不安定な場合、Vercel のビルドログを最終確認として扱う。
