# Documentation Map

このファイルは、Manufacturing Compass の文書をどこから読むか、同じ内容が食い違った場合に何を正とするかを示す索引です。

最終更新日: 2026-07-20

## 優先順位

1. [`AGENTS.md`](../AGENTS.md): AI エージェント向けの必須ルール、公開禁止事項、実行ポリシー
2. [`docs/PRD.md`](./PRD.md): 現在のプロダクト目的、対象ユーザー、提供価値、スコープ
3. [`docs/architecture.md`](./architecture.md): 現在の実装構成と技術上の制約
4. 分野別ガイド: SEO、コンテンツ、デザイン、収益化などの実務ルール
5. [`TASKS.md`](../TASKS.md): 実行状況と次の作業。プロダクト方針の正本にはしない
6. `.private/`: 公開不可の取材メモ、編集資料、運営者情報。公開文書より機密保持ルールを優先する

同じ優先度で記述が食い違う場合は、日付だけで判断せず、実装と一次情報を確認して正本側を更新します。

## 文書ごとの役割

| 文書 | 役割 | 更新するタイミング |
| --- | --- | --- |
| [`README.md`](../README.md) | 初めて参加する人向けの概要と開発手順 | セットアップ、主要機能、入口が変わった時 |
| [`AGENTS.md`](../AGENTS.md) | AI 作業の境界と必須ルール | 開発・編集・検証ルールを変えた時 |
| [`docs/PRD.md`](./PRD.md) | 現行プロダクトの要件 | 中心価値、対象、提供範囲を変えた時 |
| [`docs/architecture.md`](./architecture.md) | 実装構造とデータフロー | ルート、データ配置、外部サービスを変えた時 |
| [`docs/database.md`](./database.md) | 静的データ設計と将来の永続化条件 | 型や保存方針を変えた時 |
| [`docs/seo.md`](./seo.md) | 検索意図、URL、内部リンク、更新方針 | コンテンツ構造や検索戦略を変えた時 |
| [`docs/content-guideline.md`](./content-guideline.md) | 公開コンテンツ共通の編集原則 | 出典・表現・CTA 基準を変えた時 |
| [`docs/article-workflow.md`](./article-workflow.md) | 記事種別ごとの公開制作フロー | 記事制作工程を変えた時 |
| [`docs/design-system.md`](./design-system.md) | UI の共通原則 | UI 言語、色、コンポーネント方針を変えた時 |
| [`docs/control-chart-learning-spec.md`](./control-chart-learning-spec.md) | 管理図学習ツールの目的、計算、初期スコープ | 管理図の学習体験や対象図を変えた時 |
| [`docs/gage-rr-learning-spec.md`](./gage-rr-learning-spec.md) | Gage R&R学習ツールの目的、計算、初期スコープ | Gage R&Rの学習体験や対象調査を変えた時 |
| [`docs/conversion-architecture.md`](./conversion-architecture.md) | 現行導線と CTA の役割 | 主要導線や計測イベントを変えた時 |
| [`docs/monetization.md`](./monetization.md) | 広告・アフィリエイト運用原則 | 提携状態や広告運用方針を変えた時 |
| [`docs/roadmap.md`](./roadmap.md) | フェーズ単位の方向性 | 優先順位やフェーズを見直した時 |
| [`TASKS.md`](../TASKS.md) | 完了履歴と具体的な未完了作業 | 作業を開始・完了・保留した時 |

## 非公開文書

- `.private/article-workflow.md`: 実体験記事の取材、匿名化、公開承認の必須手順
- `.private/content-redaction-dictionary.md`: 公開禁止語・禁止情報の正本
- `.private/ryo-editorial-voice.md`: RYO の文体と確信の強さを守る基準
- `.private/article-index.md`: 記事 ID、状態、次回確認日の管理表
- `.private/affiliate-operations.md`: ASP の提携状態、成果条件、禁止事項の非公開運用台帳
- `.private/article-notes/`: 記事ごとの取材・調査メモ
- `.private/article-drafts/`: 公開前の下書き
- `.private/career-history.md`: 個人情報を含む一次資料。公開コンテンツへ直接コピーしない

`.private/` は Git 管理外です。変更内容は通常の `git diff` に出ないため、編集時は対象ファイルを別途確認します。

## 廃止・履歴扱い

- [`docs/phase-1-brief.md`](./phase-1-brief.md) は過去の Phase 1.5 検討記録です。現行要件には使用しません。
- `Phase 1` や `Phase 1.5` と書かれた古い構想より、現行の PRD、実装、TASKS の現在欄を優先します。
