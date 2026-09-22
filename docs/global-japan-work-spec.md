# 外資系半導体企業「日本の仕事」探索ボード

更新日：2026-09-22 / 公開設定：index可能 / 本番反映：未確認

## 目的と入口

`/companies/global-japan` は、知らない海外企業と日本の仕事内容の接点を探す企業研究ツール。企業一覧、業界地図、国内拠点マップ、Career Compass結果、掲載企業の詳細から接続する。業界構造は業界地図、勤務地の全体像は拠点マップ、経験整理は職種マップ・Career Compassが担う。グローバルナビは増やさない。

初版はPCの企業×6仕事分類の対応表と、スマホ・タブレットの一列カード。会社または仕事の交点から同一ページの詳細を開き、最大2社を項目別に比較する。比較対象はフィルター変更後も保持し、比較内容は各社の全掲載情報と明記する。3社目の追加は無効化し、選択済み企業を外して入れ替える。詳細の開閉時にフォーカスを見出し・元のボタンへ移す。フィルター変更で詳細を閉じ、入力ごとの自動スクロールはしない。

## データと掲載範囲

- 調査対象10社。KLA、Lam Research、Infineon、Applied Materials、ASML、Micron、TSMC、Analog Devicesの8社・14業務を掲載。
- AMD、Texas Instrumentsは、日本の具体的業務との対応を十分に裏付けられていないため掲載準備中。会社の不存在・技術職の不存在・募集中求人の不存在を意味しない。
- `src/data/japan-work.ts` が企業の日本紹介、出典、業務記録を所有。企業IDは既存companiesを参照し、一般的なjobCategoriesを国内業務の根拠にしない。
- `JapanWorkEvidence` は仕事分類、公式の職種名または業務表記、業務要約、根拠に紐づく都道府県、物理拠点参照、勤務場所の説明、未確認事項、編集上の分類理由、出典ID、確認日、次回確認日、published/draft/withdrawnを持つ。
- 仕事と都道府県のAND条件は1件の業務記録で成立させる。別職種や企業住所の都道府県を流用しない。地域不明の記録は全国表示に含めるが地域指定の結果には含めない。
- TSMC設計業務は既存の横浜デザインセンターへ参照。Infineon品質解析は今回追加の渋谷本社へ参照。KLA横浜本社は所在地のみ共有し、横浜勤務の職種との同一建屋の関係は未確定として参照しない。
- 追加拠点はKLA横浜本社・Infineon日本本社の2件。座標を推測せず、既存マップの所在地・一覧表示を利用する。稼働状態と正式法人名の裏付けが不足する箇所は推測で補わない。
- 日本での業務を紹介する情報と現在の採用有無を区別し、初版は「募集中」バッジを表示しない。将来表示する場合も既存の期限付きHiringSignalのみを使う。
- 既存企業詳細のdraft/noindexは変更しない。探索ページの完成を企業ページ全体のレビュー完了とは扱わない。

## 公式根拠の適用範囲

| 対象 | 根拠と限定 |
| --- | --- |
| KLA | 日本拠点・職務紹介と公式Workdayの横浜FAE職種情報。個別職種ページ本文の取得は限定的なため、確認できた勤務地と技術支援の要約に限定。日本紹介の職種に本社住所を流用しない。 |
| Lam Research | 日本法人の社員紹介で装置保守・フィールドプロセスの業務を確認。都道府県は紐づけない。 |
| Infineon | 日本の事業紹介で製品開発・営業と、渋谷本社の品質解析機能を確認。正式な技術職名や募集を推定しない。検索で見つかった過去のFAE求人PDFは404のため不使用。 |
| Applied Materials | 日本採用ページとR2628798の業務・勤務地。個別資料は海外大学の新卒・既卒向けであり、中途条件に一般化しない。 |
| ASML | 日本拠点紹介と熊本のJ-00345835。顧客先の保守・修理を確認。個別例のシフト等を全社条件にしない。 |
| Micron | 広島のJR109404でプロセス改善を確認。市内の特定建屋への配属は断定しない。 |
| TSMC | 日本デザインセンターの公式職種紹介・勤務地。過去の説明会案内の日付や募集人数は現在の募集として掲載しない。 |
| Analog Devices | 日本法人のFAE募集要項と公式FAE業務紹介。勤務地は東京・大阪・名古屋。新卒・既卒等向け資料であることを明示。 |

出典URL・確認日は公開データに保持。長文転載・報酬・人数・採用難易度の推測は行わない。企業概要は短い編集要約、仕事分類は編集上の整理と表示する。

## 実装・SEO・計測

Server Componentが出典付き企業詳細を生成し、Client Componentへ表示用スロットと静的業務情報を渡す。詳細一覧の全8社分を初期HTMLに含め、標準details要素でJSなしでも読める。クライアントは絞り込み・開閉・比較のみを担当。API、DB、認証、新規ライブラリは追加しない。選択状態はReactメモリのみで、URL・Cookie・localStorageに保存しない。

専用URLをcanonical、sitemapへ追加し、WebPage・BreadcrumbList・公開8社のItemListを本文に対応させる。JobPosting・条件別URL・比較全組み合わせページは生成しない。次回確認目安の翌日から「再確認時期を過ぎています」と表示する。ページは86400秒の再検証間隔を設定し、静的生成時点の期限表示が固定され続けることを防ぐ。

既存trackEvent経路で以下を送信する。初期描画では発火せず、初回操作はマウント中1回。選択仕事・都道府県・自由入力・回答は送信しない。

| イベント | 発火・公開パラメータ |
| --- | --- |
| japan_work_start | 初回の選択・比較・詳細展開。パラメータなし |
| japan_work_company_open | 詳細または根拠一覧の展開。company_id |
| japan_work_compare | 2社比較の成立。first_company / second_company |
| japan_work_source_click | 出典リンク。company_id |
| japan_work_career_click | 公式採用情報リンク。company_id |
| japan_work_related_click | 企業・拠点・既存ツールへのリンク。company_id（あれば） / destination |

公開後4週間の実績は、利用数、企業詳細閲覧、2社比較、出典・公式採用・関連ツールへの遷移を代理指標として評価する。新しい会社を発見した人数や採用成果とは解釈しない。4週間の起算日は本番反映日とし、低流入時は判断を保留して観測を継続する。

## 更新・公開・検証

1. 公開禁止辞書を確認し、公式の日本紹介・拠点情報・日本勤務の職種情報を読む。
2. 業務と勤務地の対応、職種名と事業機能を区別して記録。ページ消失で根拠を失った業務はwithdrawnとして探索・初期HTMLから外す。企業に公開業務がなくなった場合はpendingに変更し理由を記録する。
3. 確認日を実際の確認日、次回を90日後として更新。未確認の人物を確認者にしない。住所の確認と求人の確認は別に行う。
4. 対象単体テスト、必要な型チェック最大1回、差分・禁止情報確認を行う。重大な未確認事項を除外できれば、確認済み部分で公開設定まで進める。
5. commit・pushは明示依頼がある場合のみ。本番反映、ブラウザ・実端末の操作確認、4週間の評価を実装完了と混同しない。

テストは参照整合、仕事×地域の誤結合防止、未確認地域、pending/draft/withdrawn、期限境界、比較上限・解除・不正ID、JS操作前のHTMLに本文・出典・内部リンクがあること、初期描画で計測しないことを対象とする。初期HTMLの検証はReactのサーバーレンダリングで行い、Nextの本番buildやブラウザ確認を代替したとは扱わない。

### 今回の検証記録

- `node tests/unit/japan-work.cjs`：成功。初回はテスト用モジュール読み込み処理のdirectory index未対応で停止し、テストコード修正後に同じコマンドで成功。
- `npm run typecheck`：1回実行。Career Compass結果のリンク追加にJSX親要素エラーを検出し、条件分岐外への移動で修正。最大1回の制限に従い修正後の型チェックは未実施。
- `git diff --check` と追加ファイルを含む禁止情報の照合：実施。
- lint・build・ブラウザ・実機確認・本番反映：未実施。検証済みとは扱わない。

### 変更ファイル

- 新規ページ：`src/app/(ja)/companies/global-japan/page.tsx`
- 探索UI：`src/components/JapanWorkExplorer.tsx`、`src/components/japan-work.module.css`
- 静的データ・型・処理：`src/data/japan-work.ts`、`src/types/japan-work.ts`、`src/lib/japan-work.ts`
- 国内拠点共有：`src/data/company-locations.ts`
- 入口：`src/app/(ja)/companies/page.tsx`、`src/app/(ja)/companies/[slug]/page.tsx`、`src/app/(ja)/industry-map/page.tsx`、`src/app/(ja)/semiconductor-map/page.tsx`、`src/components/career-compass/CareerCompassResult.tsx`
- 検索設定：`src/app/sitemap.ts`
- 対象テスト：`tests/unit/japan-work.cjs`
- 文書：`docs/PRD.md`、`docs/architecture.md`、`docs/documentation-map.md`、`docs/global-japan-work-spec.md`、`TASKS.md`

推奨コミットメッセージ：`feat: add global semiconductor Japan work explorer`
