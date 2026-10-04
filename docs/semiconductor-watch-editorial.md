# 業界ウォッチ：テーマ探索と確認付き編集

更新日：2026-10-04。現行UI・手動編集の実装仕様。日次収集、AI公開ゲート、費用台帳は [chip-pulse-media.md](./chip-pulse-media.md)、決算は [earnings-ir-operations.md](./earnings-ir-operations.md) を参照する。

## 画面とデータの境界

- `/semiconductor-watch`：状況と今回の要点 → 5テーマ → 注目1件＋補助最大2件 → テーマ別一覧 → 掲載・確認ログ → 公式リンクと更新方針。
- ニュース5件、決算9社、工場5案件を初期表示。全体では主テーマ1つ、テーマ選択時は明示された副テーマも使用。テーマはAI・メモリ／製造装置・材料／設計・受託製造／先端実装・後工程／工場・設備投資。「決算」は種別であってテーマではない。
- 注目は編集指定。人気、順位、重要度スコア、架空の件数を使わない。記事不足なら指定できる実数だけ表示。
- `/semiconductor-watch/[slug]`：要約と日付 → 事実 → 背景・編集上の見方 → 数値・状態・一般工程図 → 未確認点 → 用語 → 目的別リンク最大3件 → 正式資料・短い根拠抜粋・改訂履歴。独立URL、canonical、NewsArticle、sitemapを維持。
- PCは注目の大小と本文／補足の2列、760px以下は1列。本文16px、テーマボタン44px以上。画像・新ライブラリなし。数値・期間・事業範囲を図自体に表示し、一般工程図は取引関係を示さないと明示。
- `chip-pulse-media.json` は事実の正本。`earnings-snapshot.json` と `factory-projects.ts` の数値を複製せず、`src/lib/watch.ts` で同じデータから表示用項目を組み立てる。
- `watch-editorial.json` は注目ID、記事版、背景、確認日、出典、企業ID、テーマ、用語、探索先だけを管理。記事版・出典URLの不一致や `sourceCheck:changed` があると、その背景・関連先を出さず再確認中と表示する。出典変更の記事は注目から外す。
- 企業IDは企業DB、地図の企業選択は描画対象に存在するIDのみ。ASEは補助企業として地図へ、Broadcomはファブレスのセグメントへ案内する。工場カードは既存の案件解説へ進む。
- 記事の公表日、サイト掲載日、記事改訂日、背景確認日、収集確認日を区別。「日次集計対象の発表数」は掲載作業の件数ではない。0件、部分取得失敗、編集停止は別表示。編集7日／収集2日超を注意表示し、ページを1時間ごとに再生成する。
- フィルターは `#theme=…`、従来の `#signal-{id}` も残す。ブラウザの戻る操作でテーマを復元。初期HTMLには全項目があるのでJavaScriptなしでも詳細・原文を読める。

## 週2〜3回の編集手順

日次の候補収集と確認付きの記事公開は別工程。週2〜3回は編集の目安であり、自動実行の予約や掲載数の約束ではない。AIポリシーの `approved:false` は維持する。

1. `npm run chip-pulse:update` で候補を収集。`.private/chip-pulse-candidates/current.json` と最終試行を確認する。失敗時は成功と記録しない。
2. SEC14社の直近30日と、日本の手動調査対象を確認。既存ニュース・決算と同じ発表は新規ニュースに数えず、既存詳細へ関連づける。
3. 公式原文を開き、主張、金額・単位、期間、時制、計画／実績、企業・工程の分類を照合する。本文全文は公開しない。原文抜粋は必要な短い範囲に限る。公開禁止辞書と個人・機密情報も確認する。
4. 私有候補JSONを作る。記事配列 `articles`、照合に使った文書／抜粋の `documents:[{url,text}]` を含める。各記事は現在の `NewsArticle` 項目に加え `review:{facts:true,numbers:true,redaction:true}` を持つ。新規は `version:1`、改訂は前回＋1。これは編集者／エージェントが実際に完了した確認を記録する値で、内容の正しさを自動で保証するフラグではない。
5. `npm run chip-pulse:editor -- --candidate .private/chip-pulse-editor/YYYY-MM-DD.json`。ID、HTTPS出典、カレンダー日、日時精度・順序、分類、図の形式、根拠抜粋の一致、版、記事間参照、重複URLを検証する。検証失敗時は公開JSONを書かない。成功時は前回版を `.private/chip-pulse-editor-archive` へ保存し、原子的に置換する。掲載日時と改訂履歴はコマンドが生成する。
6. `watch-editorial.json` に企業ID・主／副テーマ・背景・用語・関連先を登録。`version` と `sourceUrls` を記事に一致させ、実際の `checkedAt` を記録する。`highlights` は `article:{id}` / `earnings:{id}` / `factory:{id}` の最大3件。数値や工場実績はここに複製しない。
7. 原文を既存 `fetchDocument` と同じ方法で取得した全文ハッシュを運用台帳へ保存し、以後の差分検知の基準にする。独自の短い抜粋のハッシュで代用しない。初回3件は原文取得・抜粋一致を確認して保存済み。日次処理は確認付き記事の本文を上書きせず、出典変更だけをフラグで通知する。30日候補窓の外の記事は日次の変更検知対象外なので、再度注目に選ぶ時に原文を再確認する。
8. `npm run chip-pulse:editor -- --check` と `npm run chip-pulse:test` で記事・参照整合を確認。必要な型チェックはリポジトリの回数制限内で行う。差分・公開禁止情報を確認し、公開設定を整える。commit・push・本番反映は別の操作。
9. 編集記録へ、候補ID、採用／既存へ接続／見送り、理由、確認日時を残す。候補確認・原文確認・編集・掲載それぞれの開始終了を実測する。資料不足なら本数合わせをしない。

旧 `chip-pulse:publish` は旧メタデータ形式向け。確認付き記事の登録には使わない。初回候補は `.private/chip-pulse-editor/2026-10-04.json` に保存したが、公開運用例に原文全文や環境変数をコピーしない。

## 初回の供給結果（2026-10-04）

候補収集は14/14社成功、30日内7候補。新規3本、既存2本を含めニュースは計5本。公式リンクは収集結果を反映して2件。旧スナップショットの未要約6件も照合対象にした。更新時刻は実際の取得・掲載結果を使用。

| 対象 | 判断 | 根拠・理由 |
| --- | --- | --- |
| AMD / sec-0000002488-26-000182 | 新規掲載 | [Form 8-K](https://www.sec.gov/Archives/edgar/data/2488/000000248826000182/amd-20260926.htm)。World Labs取得契約、株式対価、契約と完了を区別 |
| TSMC / sec-0001046179-26-000658 | 新規掲載 | [8月月次売上](https://www.sec.gov/Archives/edgar/data/1046179/000104617926000658/tsm-revenue20260910.htm)。台湾ドル・月次連結・前年比と前月比を照合 |
| ASE / sec-0000950103-26-013682 | 新規掲載 | [8月売上](https://www.sec.gov/Archives/edgar/data/1122411/000095010326013682/dp253117_6k.htm)。ATM事業の未監査数値。全社や先端パッケージ単独と混同しない。公表前年比53.1%と表の金額による再計算約53.0%の差を注記し、第2版に記録 |
| Micron / sec-0000723125-26-000018 | 既存決算へ接続 | [決算発表の提出](https://www.sec.gov/Archives/edgar/data/723125/000072312526000018/mu-20260930.htm)。同一発表の重複ニュースを作らない |
| TSMC資本配分 / sec-0001046179-26-000660 | 既存記事 | URL対応済み。背景、企業・地図・工程解説の入口を追加 |
| Broadcom / sec-0001730168-26-000080 | 既存記事 | URL対応済み。事業範囲と企業規模を調べる入口を追加 |
| GlobalFoundries / sec-0001709048-26-000234 | 公式リンクのみ | [Form 6-K](https://www.sec.gov/Archives/edgar/data/1709048/000170904826000234/a6-ksiaclean.htm)。政府向け証券発行の内容で、製造能力の変化までは確認できない |
| NVIDIA / sec-0001045810-26-000078 | 今回は見送り | [9月2日の提出](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000078/nvda-20260902.htm)。旧公式リンクを確認。今回の30日窓の外で、新着として再掲載しない |

### 日本の手動調査対象

| 取得元 | 今回の調査・判断 | 利用条件と運用負荷 |
| --- | --- | --- |
| [東京エレクトロン](https://www.tel.co.jp/news/index.html) | 対象期間の掲載から、新規の設備・技術ニュースとして採用するものなし。9月の情報セキュリティ報告は見送り | [著作権](https://www.tel.co.jp/copyright/index.html) に再利用の制限。公式リンクと独自要約の範囲で都度確認。自動本文取得には追加しない |
| [キオクシア](https://www.kioxia-holdings.com/ja-jp/news.html) | RBA監査、決算日程、メディア向け告知等を確認。8月投資発表は対象期間外 | 利用条件ページの確認は未完了。本文取得・転載の自動化は未採用。新記事を登録する前に権利条件を確認 |
| [Rapidus](https://www.rapidus.inc/news_topics/news_cat/news-info/) | 確認した新着は8月の役員関連など。9月の対象記事は採用なし | [サイト利用について](https://www.rapidus.inc/about-the-site/) の転載制限を確認。既存の不採用判断を覆さず手動調査のみ |
| [経済産業省](https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital.html) | 検索結果で政策資料を確認したが対象ページの直接取得は403。新規記事の原文確認が完了せず見送り | 今回は利用条件ページも確認できず。新たな自動収集対象に追加しない |

情報源の追加は候補発見の対象拡大であり、利用条件や掲載品質を確認しない本文収集の拡大ではない。装置・材料の速報量は依然少なく、既存の決算・解説を日付付きで補助する。

### 時間記録の限界

候補取得結果 `2026-10-04T11:52:43.718Z`、新規3本の掲載 `2026-10-04T11:55:47.535Z`、背景編集 `2026-10-04T11:57:35.747200Z` を保存した。この間隔を原文調査の総作業時間とは扱わない。今回は調査とUI実装が交互に進み、工程別の開始時刻を独立記録できていないため、候補確認／原文確認／編集／掲載の所要時間は未計測。継続運用の工数見積もりは次回以降の実測で更新する。

## 効果の確認

新しい個人ID・保存・ログインは導入しない。既存GA4/Vercel Analyticsの取得範囲で確認する。

| 指標 | 集計 |
| --- | --- |
| トップから詳細へ進んだセッションの割合 | `/semiconductor-watch` 閲覧の後に `chip_pulse_read` の `destination_type=article/earnings`、ニュースは `chip_pulse_article_view`、決算は既存詳細イベントを確認。直接詳細へ流入したセッションを分母に混ぜない |
| 理解を深める遷移 | ウォッチ閲覧後の `chip_pulse_read`、`destination_type=company/industry_map/compare/guide/ranking/factory`。同一セッションは1回として集計 |
| 7日以内の別日再訪 | GA4で識別可能なユーザーの範囲。端末変更・計測拒否は追跡できない。独自IDを補わない |

イベントには `ui_version:topics-v1`、`placement:brief/featured/explore/updates/detail/official/navigation`、固定 `article_id` を追加。既存ニュースIDはプレフィックスなしで維持。ニュース以外は `earnings:` 等の種別付きID。テーマ選択は既存 `chip_pulse_filter_change` に `dimension:theme`・選択値・実件数を送る。必要なカスタムディメンションはGA4側で登録する。本番DebugView受信・既存ダッシュボードの設定は未確認。

公開後に受信を確認し、4週間を目安に端末・流入元・掲載本数・編集回数と併記する。イベント回数同士の単純な割り算や、UIだけの効果という断定はしない。

## 実装時の確認記録

- `npm run chip-pulse:test`：24件成功。公開参照先、抜粋・数値確認フラグ・日付・重複・改訂履歴、収集による本文保持、出典変更での背景無効化、0件／1件／古い記事／画像なしのHTML出力を確認。
- `npm run typecheck`：1回実行、成功。その後の変更は冒頭の余白・折返し、日付の説明、事実欄の表示数、テーマボタンのアクセシブル名、noscript説明、E2E仕様の更新、掲載時のID型チェック追加、ASEの会社公表率と再計算の差の注記（掲載コマンドで第2版を検証）。回数制限に従い型チェックを再実行していない。
- `npm run chip-pulse:editor -- --check`：5記事を確認。公開禁止語照合と `git diff --check` も成功。
- ローカルChrome：1280px・390px・320pxで横はみ出しなし。テーマボタンは44px以上。Enterでテーマ選択、記事へ遷移、用語展開、ASEの地図上選択、戻ると選択テーマが復元すること、旧記事アンカーを確認。冒頭の長さを調整後、PC・スマホで再確認。実端末での確認ではない。
- JavaScriptなしのHTMLは単体テストのサーバーレンダリングで確認。無効化した実ブラウザでのE2Eは未実行。既存 `tests/e2e/chip-pulse.spec.ts` を現行仕様へ更新したが、今回はCUAによるブラウザ操作を使用し、Playwrightテストランナー自体は実行していない。
- ブラウザに `html` の `data-google-analytics-opt-out` 属性の差によるhydration警告と、共通のsmooth-scroll設定に関するNext.js警告が出た。新しい業界ウォッチの機能操作は確認できたが、拡張機能なしのブラウザでの警告切り分けは未実施。
- devサーバーは確認時だけ起動し停止済み。lint・build・commit・pushは未実施。本番Actions、Vercel反映、GA4受信は未確認。

### 変更ファイル

- ページ・SEO：`src/app/(ja)/semiconductor-watch/page.tsx`、`src/app/(ja)/semiconductor-watch/[slug]/page.tsx`、`src/app/sitemap.ts`
- UI・計測：`src/components/chip-pulse/NewsFeed.tsx`、`WatchCard.tsx`、`MediaLinks.tsx`、`Media.module.css`、`src/components/earnings/EarningsShell.tsx`（戻り先の表示名）
- データ・表示モデル：`src/data/chip-pulse-media.json`、`watch-editorial.json`、`chip-pulse-operations.json`、`src/lib/chip-pulse-media.ts`、`watch.ts`、`watch-types.ts`
- 掲載・検証：`scripts/chip-pulse-editor-publish.cjs`、`scripts/chip-pulse-media.cjs`、`tests/unit/watch.cjs`、`tests/e2e/chip-pulse.spec.ts`、`package.json`
- 文書：本書、`docs/PRD.md`、`docs/architecture.md`、`docs/chip-pulse-media.md`、`docs/design-system.md`、`docs/documentation-map.md`、`TASKS.md`

推奨コミット：`feat: redesign semiconductor watch for topic exploration`
