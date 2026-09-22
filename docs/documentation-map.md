# Documentation Map

このファイルは、Manufacturing Compass の文書をどこから読むか、同じ内容が食い違った場合に何を正とするかを示す索引です。

最終更新日: 2026-09-04

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
| [`video/docs/short-video-workflow.md`](../video/docs/short-video-workflow.md) | 公開記事からショート動画を作る標準手順 | 動画の構成、音声基準、公開手順を変えた時 |
| [`docs/design-system.md`](./design-system.md) | UI の共通原則 | UI 言語、色、コンポーネント方針を変えた時 |
| [`docs/ui-consistency-audit.md`](./ui-consistency-audit.md) | 公開ページへのUIルール適用状況と移行順 | 共通UIまたは監査対象ページを変更した時 |
| [`docs/control-chart-learning-spec.md`](./control-chart-learning-spec.md) | 管理図学習ツールの目的、計算、初期スコープ | 管理図の学習体験や対象図を変えた時 |
| [`docs/gage-rr-learning-spec.md`](./gage-rr-learning-spec.md) | Gage R&R学習ツールの目的、計算、初期スコープ | Gage R&Rの学習体験や対象調査を変えた時 |
| [`docs/yield-learning-spec.md`](./yield-learning-spec.md) | 歩留まり・FPY・RTY学習ツールの目的、計算、初期スコープ | 歩留まりの学習体験や対象工程を変えた時 |
| [`docs/semiconductor-location-map-spec.md`](./semiconductor-location-map-spec.md) | 日本の半導体企業・拠点マップの対象、MVP、データ、公開基準 | 地理マップの対象、データ構造、公開条件を変えた時 |
| [`docs/semiconductor-location-map-pilot.md`](./semiconductor-location-map-pilot.md) | 拠点データパイロットの調査対象、記録項目、完了条件 | パイロット対象、調査結果、工数、公開判断を更新する時 |
| [`docs/semiconductor-location-map-review.md`](./semiconductor-location-map-review.md) | 代表拠点の座標レビュー手順、確認表、Go / No-Go基準 | 座標確認、工数計測、公開可否判断を行う時 |
| [`docs/semiconductor-location-map-technical-decision.md`](./semiconductor-location-map-technical-decision.md) | 拠点マップの地図表示、背景タイル、座標生成方法の暫定技術選定 | 公開MVPの技術構成と利用条件を判断する時 |
| [`docs/semiconductor-location-map-ui-spec.md`](./semiconductor-location-map-ui-spec.md) | 拠点マップのモバイル・PC画面構成、検索、フィルター、状態表示、操作要件 | 公開MVPの画面とインタラクションを設計・確認する時 |
| [`docs/semiconductor-location-map-implementation-plan.md`](./semiconductor-location-map-implementation-plan.md) | 拠点マップの実装順序、変更ファイル、検証、公開ゲート | 公開判断後の実装作業を分割・確認する時 |
| [`docs/conversion-architecture.md`](./conversion-architecture.md) | 現行導線と CTA の役割 | 主要導線や計測イベントを変えた時 |
| [`docs/role-map-pilot.md`](./role-map-pilot.md) | 半導体職種マップの4職務群・根拠台帳・業務選択票・結果カード | 出典、対応付け、試用モデルを更新する時 |
| [`docs/role-map-validation.md`](./role-map-validation.md) | 公開β版のイベント・問い合わせ・根拠レビューによる運用検証 | 継続・修正・停止、職務群の拡張を判断する時 |
| [`docs/role-map-mvp-spec.md`](./role-map-mvp-spec.md) | 4職務群β版と、検証通過後の8職務群への拡張仕様 | 着手条件・データ・UI・検証仕様を更新する時 |
| [`docs/monetization.md`](./monetization.md) | 広告・アフィリエイト運用原則 | 提携状態や広告運用方針を変えた時 |
| [`docs/roadmap.md`](./roadmap.md) | フェーズ単位の方向性 | 優先順位やフェーズを見直した時 |
| [`TASKS.md`](../TASKS.md) | 完了履歴と具体的な未完了作業 | 作業を開始・完了・保留した時 |

- [`docs/jev-demo.md`](./jev-demo.md): Jev実験デモの設定、回数制限、実測、公開前レビューの手順。

ベイズ最適化学習ツールの体験・仮想装置・GP/LCB・検証仕様は [`docs/bayesian-optimization-spec.md`](./bayesian-optimization-spec.md) を参照する。計算方式・実験予算・教材モデルの変更時に更新する。

タグチメソッド体験の実験計画・SN比・仮想装置・確認実験・検証は [`docs/taguchi-spec.md`](./taguchi-spec.md) を参照する。
AI外観検査ラボの段階的実装・技術検証・公開条件は [`docs/ai-visual-inspection-spec.md`](./ai-visual-inspection-spec.md) を参照する。合成画像・学習モデル・比較条件・実装ゲートの変更時に更新する。

AI外観検査の実測と未達理由は [`docs/ai-visual-inspection-validation.md`](./ai-visual-inspection-validation.md)、全数値・モデルハッシュは [`docs/ai-visual-inspection-experiment.json`](./ai-visual-inspection-experiment.json) に記録する。これらは実験証跡であり、要件の正本ではない。

AI外観検査v2の段階的な再検証条件は [`docs/ai-visual-inspection-v2-protocol.md`](./ai-visual-inspection-v2-protocol.md)、実測は [`docs/ai-visual-inspection-v2-validation.md`](./ai-visual-inspection-v2-validation.md) と [`docs/ai-visual-inspection-v2-experiment.json`](./ai-visual-inspection-v2-experiment.json) に分離する。旧版の結果は上書きしない。

AI外観検査v2の追加学習は [`docs/ai-visual-inspection-v2-followup-protocol.md`](./ai-visual-inspection-v2-followup-protocol.md) で条件を固定し、[`docs/ai-visual-inspection-v2-followup-validation.md`](./ai-visual-inspection-v2-followup-validation.md) と [`docs/ai-visual-inspection-v2-followup-experiment.json`](./ai-visual-inspection-v2-followup-experiment.json) に記録する。48枚の学習確認・400枚の調整・600枚の開発評価を区別し、教材全体の完成と混同しない。

AI外観検査v2の4構成・3シード比較は [固定条件](./ai-visual-inspection-v2-comparison-protocol.md)、[比較報告](./ai-visual-inspection-v2-comparison-validation.md)、[機械可読結果](./ai-visual-inspection-v2-comparison-experiment.json) に記録する。開発評価と最終評価を区別し、全シードの未達・改善・不変も保持する。

AI外観検査v2の基準3シードの安定化は [固定条件](./ai-visual-inspection-v2-stability-protocol.md)、[結果](./ai-visual-inspection-v2-stability-validation.md)、[数値記録](./ai-visual-inspection-v2-stability-experiment.json) に記録する。旧10エポックの比較へ新モデルを混在させない。

AI外観検査v2の全モデルへの同量追加学習と4構成比較の更新は [固定条件](./ai-visual-inspection-v2-matched-protocol.md)、[比較結果](./ai-visual-inspection-v2-matched-validation.md)、[数値記録](./ai-visual-inspection-v2-matched-experiment.json) に記録する。基準の安定化記録を再利用し、旧比較は保持する。

AI外観検査v2のルールしきい値・明るさ変化・併用の検証は [固定条件](./ai-visual-inspection-v2-lighting-protocol.md)、[比較報告](./ai-visual-inspection-v2-lighting-validation.md)、[数値・曲線・変化画像](./ai-visual-inspection-v2-lighting-experiment.json) に記録する。調整用と開発用、ネイティブCPUとブラウザの確認を区別する。

AI外観検査v2の背景交換と最終600枚の固定評価は [事前条件](./ai-visual-inspection-v2-holdout-protocol.md)、[結果](./ai-visual-inspection-v2-holdout-validation.md)、[数値・固定ハッシュ](./ai-visual-inspection-v2-holdout-experiment.json) に記録する。開封履歴を保持し、評価後の開発変更時は同じ群を未使用扱いに戻さない。

AI外観検査のWorker・WASM・配信アセットと実行確認の状態は [端末内推論の実装記録](./ai-visual-inspection-web-runtime.md) に記録する。オフライン精度の合否とは分ける。

比較UIの範囲、固定教材の選択、確認済みの保持、公開前の残項目は [UI実装記録](./ai-visual-inspection-ui.md) に記録する。

## 非公開文書

- `.private/article-workflow.md`: 実体験記事の取材、匿名化、公開承認の必須手順
- `.private/content-redaction-dictionary.md`: 公開禁止語・禁止情報の正本
- `.private/ryo-editorial-voice.md`: RYO の文体と確信の強さを守る基準
- `.private/article-index.md`: 記事 ID、状態、次回確認日の管理表
- `.private/growth-operations.md`: 初成果までの12週間の週次計測・ASP照合・本番反映・取材計画
- `.private/affiliate-operations.md`: ASP の提携状態、成果条件、禁止事項の非公開運用台帳
- `.private/article-notes/`: 記事ごとの取材・調査メモ
- `.private/article-drafts/`: 公開前の下書き
- `.private/career-history.md`: 個人情報を含む一次資料。公開コンテンツへ直接コピーしない

`.private/` は Git 管理外です。変更内容は通常の `git diff` に出ないため、編集時は対象ファイルを別途確認します。

## 廃止・履歴扱い

- [`docs/phase-1-brief.md`](./phase-1-brief.md) は過去の Phase 1.5 検討記録です。現行要件には使用しません。
- `Phase 1` や `Phase 1.5` と書かれた古い構想より、現行の PRD、実装、TASKS の現在欄を優先します。

- [`docs/correlation-causation-spec.md`](./correlation-causation-spec.md): 相関と因果ラボの学習手順、架空数値、無作為割付、公開状態、検証と観測方針。

- [`docs/improvement-confidence-spec.md`](./improvement-confidence-spec.md): 改善の差を見極める教材の3ケース、Welch信頼区間、乱数、自由実験履歴、公開・検証仕様。

- [`docs/semiconductor-process-spec.md`](./semiconductor-process-spec.md): 工程図鑑の薄膜・配線とCMP・組立の仕事紹介・おすすめ見学コース・全体像・ウエハ準備／薄膜加工／配線＋CMP／組立／ウエハ・最終検査の図・技術簡略化・共通操作・体験別計測・公開導線・検証。
