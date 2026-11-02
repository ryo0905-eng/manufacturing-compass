# 半導体DB・Equipment Explorer：調査・設計・初期実装

調査日：2026-11-02。対象：`ryo0905-eng/manufacturing-compass` の main `66cc456`。GitHubのmain SHAとローカルHEADの一致を確認。GitHub連携でopen PRは0件。commit・push・デプロイは行っていない。

## 1. 実装と競合のギャップ

READMEの予定ではなく、実コードから以下を確認した。

| 領域 | 現行実装・正本 | 今回再利用するもの／不足 |
| --- | --- | --- |
| 企業DB・地図 | `src/data/companies.ts`、`industry-map.ts`、`company-explorer.ts`、`IndustryAtlas`。企業詳細37社＋簡易紹介7社、8領域 | 企業ID・公式情報・領域別検索を維持。800社への拡張は別途データ品質の増強が必要 |
| 企業詳細・比較 | `/companies/[slug]`、`/compare`、`/compare/[slug]`、`company-comparisons.ts` | 既存URLと2社比較を維持。装置比較は別の項目体系にする |
| ランキング | `/rankings`、ランキング記事、`/tools/ranking-time-machine`、売上・時価総額・メモリ等の静的データ | 指標・年次・比較範囲を維持し、入口を接続。新しい時系列DBは作らない |
| Watch・決算 | `/semiconductor-watch`、`/earnings`以下、`earnings-history.json`、`watch-data.cjs`等 | 発表日・確認日・取得日を分ける既存方針を継承。日次固定6ファイルの更新権限は拡張しない |
| 拠点 | `/semiconductor-map`、`company-locations.ts`、座標データ、28拠点 | 拠点IDと公開座標ゲートを維持。300拠点への拡張時に共通参照へ接続 |
| 工程・Lab | `/tools/semiconductor-process`、`cmp-simulator`、`litho-simulator` | 工程ID `clean`・`expose`を再利用。CMP・ダイシングは探索用分類として追加し、実行順を意味させない |
| 技術解説・品質ツール | 公開ガイド89本、`learning-tools.ts`掲載21ツール、Cpk・管理図・DoE・Gage R&R等 | 既存記事を用語／技術の説明先として使う。記事数を独立した用語レコード件数とみなさない |
| 職種 | `/roles`、`role-map-prototype.ts`は現在4職務群、工程体験にも仕事内容あり | 100職種の検証済みDBとは異なる。既存職務群のIDを維持して接続する |
| 検索・SEO・計測 | `site-search-index.ts`、`site-navigation.ts`、`sitemap.ts`、`StructuredData`、`analytics.ts` | サーバー投影・静的HTML・canonical・条件URLのnoindex・固定カテゴリ計測を継承 |

直近コミットにはCMP Lab、Lithography Lab、工程ガイドとの相互リンク、Lab説明の初期HTML出力がある。これらを重複実装しない。企業一覧は `/industry-map` が現行の統合入口であり、旧文書の「独立一覧を新設」は採用しない。

### 競合の一次調査

リンク先の表示を読んだ調査であり、ブラウザによる操作検証、全ページの出典監査、検索エンジンでのindex確認は行っていない。件数は各サイトの自己表示で、品質保証・独立実測ではない。

| 対象 | 確認できた価値 | Compassの差分と対応 |
| --- | --- | --- |
| [SemiMap 装置DB](https://semimap.ai/semiconductor-manufacturing-process-overview/) | 795機種・160メーカーの表示、工程／メーカー絞り込み、仕様単位の出典、分類別入口 | 機種データが不足。公式原文と項目を結ぶモデル、工程別検索・比較を初期実装 |
| [SemiMap 拠点DBの例](https://semimap.ai/site/semiconductor-site-db/kyoto/) | 都道府県→企業→拠点の階層。所在地・機能・製品での絞り込み、拠点別公式出典と確認日 | 既存の実地図を生かし、収録範囲と企業・装置の接続を増やす余地 |
| [SemiMap 用語集](https://semimap.ai/glossary/) | 用語の一覧と技術・工程への入口 | 既存ガイドへ用語IDを付ける設計が必要。新しい同義記事の量産は避ける |
| [Semirai 企業一覧](https://semirai.com/companies) | 企業を業種別に分類し、企業研究へ接続 | Compassはキャリア準備・拠点・決算を維持して収録範囲を拡大 |
| [Semirai 機種一覧](https://semirai.com/semiconductor-equipment/products) | 装置カテゴリ→製品型番とメーカーへの内部リンク | 共通分類・機種単位レコードが必要。初期は単一Explorerに集約 |
| [Semirai 用語集](https://semirai.com/glossary) | カテゴリ・五十音・製造工程から探索、日本語・英語・略称検索 | 別名・英語名・工程参照を共通型に用意。意味の同じURLを増やさない |
| [Semirai トップ](https://semirai.com/) | 企業・装置・技術・職種を横断する入口と、目的別の道順 | Compassの既存横断検索へ機種を追加。装置→既存Lab→企業研究へつなぐ |
| [SEMI FREAKS](https://www.semijapanwfd.org/know-industry/) | 製造工程・産業規模・企業の俯瞰図、動画と学習順序 | 全体像と工程順の理解を既存工程体験で提供。機種・仕様DBとは役割が異なる |

指定の `https://www.semifreaks.com/` はトラック関連サイトだった。[SEMI公式の案内](https://www.semi.org/jp/node/jp-85571)から半導体のSEMI FREAKSを特定した。SemiMapトップは取得タイムアウトしたが、上記下層ページは取得できた。競合の全文、画像、分類表、デザイン、独自収集データは取り込んでいない。

検索意図を明示したタイトル、分類→詳細の階層、パンくず、関連リンクは各DBの共通価値。競合の更新頻度・バックエンド検証方法・真の収録品質、選択式の2〜3機種比較の実動作は未確認であり、推測で有無を断定しない。

## 2. 新しいデータアーキテクチャ

```text
既存 company / location / role ID         メーカー公式HTML
              ↓                               ↓
   typed EntityRef                    local source snapshots
              ↓                               ↓
  equipment.json ← 下書き候補 ← 外部抽出結果取込・根拠パケット
              ↓                               ↓
       意味・機種の照合                deterministic quality checks
              └───────────────┬───────────────┘
                     release.json + suspensions.json
                              ↓
                  server projection (fingerprint gate)
                              ↓
             /equipment SSR / filter / compare / share
                              ↓
                   企業・工程ガイド・既存Lab・時系列
```

データは引き続きローカル静的ファイル。Supabase・認証・個人情報保存・閲覧時のAI APIは追加しない。

`src/types/semiconductor-database.ts` の共通型は企業・装置・技術・材料・工程・拠点・職種の参照を定義する。既存IDは改名せず、初期装置データは既存企業ID4件を外部キーとして参照する。工程ガイド・Labの関連は `processes.ts` のアダプターで管理する。初期工程分類は4件であり、半導体全工程の完全な分類ではない。

レコードはID・名称・別名・英語名・分類・概要・関連参照・項目別fact・出典・確認日・更新状態・検証状態・公開状態を持つ。factは `verified` と、理由付きの `unconfirmed`／`not-public`／`not-applicable` を区別する。数値・技術属性は原文の文字列、短い引用、見出し等の根拠箇所、出典ID、比較条件を保持する。

関係は `manufacturer`、`process-use`、`technical-context`、`documented-transaction` を区別。初期データに取引関係は収録しない。技術上の関連を商取引と解釈させない。

共通型は将来の関係を表せるが、実行可能な品質検査・収集・公開投影は現在equipmentのみ。企業・用語候補の専用抽出器やレガシー全件の自動移行は未実装。既存データを型変換しただけで再検証済みと記録しない。

## 3. 収集・更新・公開品質ゲート

`scripts/database/run.cjs` と `core.cjs` が依存追加なしで動く。TypeScriptは既存データからIDを読み取るCLI用途にだけ使用する。

1. 公式ホスト許可リストのHTMLだけを収集。HTTPS、リダイレクト先、サイズ上限4MB、12秒タイムアウトを検査。逐次実行、1実行150秒予算で打ち切り、失敗を記録する。PDFや動的表示は専用アダプター実装まで保留。
2. script/style等を除去した本文と取得時刻・最終URL・SHA-256を `.cache/semiconductor-database/sources` に保存。変更前・失敗前の成功スナップショットはhistoryへ退避。公開ディレクトリへ置かない。
3. `extraction-input.json` に原文と出典の抽出用パケットを生成する。外部で作成した候補は `--input` で取り込み、必ずdraft・意味未確認へ戻して別ファイルに保存する。外部AIへの自動送信や有料API呼出しは実装しない。
4. 原文に機種名・短い根拠引用・値が存在するかを検査。数値の部分一致、単位不明、メーカーと出典ホストの不一致、参照切れ、不正日付、型番重複、未確認の意味照合、取得失敗、原文変更を保留にする。
5. 元データの `verification` と `publication` を独立に保持。原文一致は `evidence-matched` であり、意味の完全自動保証ではない。原文中の違う機種・違う行の数字を拾う問題は文字列検査だけでは解決しない。初期8件はCodexが公式本文と表示する主張を個別照合した。人間確認を実施済みとは記録しない。
6. `--release` は適格でpublishedのレコードだけを `release.json` に記録する。本文や属性が変わり指紋が不一致になったレコードは、再検証までサーバー投影から除外する。公開候補の正確性の判定と、Googleへのindex可否は別管理。
7. 各実行で追加・変更・削除、エラー、180日超の確認警告、無作為抽出監査の候補をJSONレポートへ記録。監査はランダムseed付き、10%・最少1件・最大5件。seedとIDから再現可能。初期監査は候補抽出までで、独立監査の結果は未取得。

### 費用とAIの境界

今回の外部AI API利用料は0円。既存実行環境・通信費は各環境に従う。代替は公式HTMLからのルール抽出と、ローカル／既存対話環境での抽出候補作成。専用の自動AI抽出・検証モデルはまだ接続していない。有料APIを導入する前に、対象件数、原文量、月次変更率、モデル別単価、再試行上限、キャッシュ率、月額上限、無料の代替を具体化して提示する。現在の基盤を「数千件を完全無人で検証済み」とは扱わない。

### コマンドと復旧

```bash
npm run database:collect        # 公式原文取得・差分・照合、公開ファイルは変更しない
npm run database:check          # 保存済み原文で再検査、ネット接続なし
node scripts/database/run.cjs --input /absolute/path/candidates.json
npm run database:release        # ローカルの公開マニフェスト生成。indexは変更しない
npm run database:test
```

取得処理は定期タスクに未登録。CI・日次タスクへの接続は次段階。並行実行はせず、cron等に接続する場合は単一実行を保証する。collectは6時間以内の成功スナップショットを再利用するため、途中で時間予算に達した大量バッチも同じコマンドで続きを取得できる。強制再取得は `node scripts/database/run.cjs --fetch --refresh`。失敗後も同じcollectで再試行する。キャッシュ未取得の新規checkoutではcheckが保留で失敗するのが正常。release.jsonにある前回成功の出典ハッシュを消さず、次回実行でも変更判定を維持する。

原文変更は自動承認しない。historyと現行本文を比較し、関連する全レコードの意味・条件を再確認して確認日と検証記録を更新する。その後、該当する出典IDを明示して以下を実行する。

```bash
node scripts/database/run.cjs --accept-source-change SOURCE_ID --release
```

原文に正しい数値が見つからない場合は、そのfactを未確認へ戻す。取込候補のverifiedラベルは信用しない。変更のないレコードまで大量の人間レビュー待ちにする運用は設けない。

重大な誤りがあれば `suspensions.json` へ機種ID、メーカーID、出典ID、工程IDを追加する。サーバー投影とrelease生成の両方で該当群を除外する。停止の実サイト反映には通常のcommit・push・デプロイが必要で、ローカル編集がそのまま本番を停止するわけではない。rollbackは前回の原文・レコード・releaseの組合せを復元して再検査する。収集失敗を「情報なし」や「非公開」に置き換えない。

## 4. 初期機能・件数・品質

- 装置8機種：ASML 3、東京エレクトロン3、Applied Materials 1、DISCO 1。
- メーカー4社への既存ID参照、工程分類4件、技術特徴8件、原文から照合した数値仕様4件。
- 出典8URLのHTML取得・モデル名・引用・値の照合が8/8通過。初期8件に対する保留0件。
- 処理能力は8件とも未確認。仕様欄も4件は未確認。未知の数字で埋めていない。
- 名称・別名・メーカー・分類・技術説明の検索、工程／メーカー／分類フィルター、件数の即時反映。
- 最大3件の比較、共有URLと復元、空結果・比較上限・コピー失敗時の手動コピー。
- native detailsの詳細、出典・確認日・根拠、企業情報・共通Labへの遷移。
- 工程→装置件数→メーカー件数の関係表示。自由配置のNetworkグラフは次段階。
- Timelineは既存ランキング・決算・Watchへのリンク。新規時系列集計は追加しない。

## 5. URL・SEO・既存機能への影響

新規ルートは `/equipment` のみ。メインページはCollectionPageとパンくず、canonical、sitemap、共通ナビを揃える。主要概要・数値仕様・出典は初期HTMLに出力し、JavaScriptなしでも読める。検索・比較操作はJavaScriptで動く。

`?q=`・`?process=`・`?manufacturer=`・`?category=`・`?compare=` の条件付きURLはnoindex・follow、canonicalは `/equipment`。Google向け機種詳細URLは作らず、検索できることと個別index公開を分ける。装置レコードのindexは全件false。サイト内検索からは機種名の条件付きExplorerへ遷移できる。

既存の装置メーカー記事は「メーカー・分類を理解する」、Explorerは「機種を探す・比較する」と検索意図を分ける。既存企業・記事・ツールのURLを削除・移動しない。CMP Lab、Lithography Lab、工程体験にExplorerへの戻り道を追加。既存企業比較の計算・データは変更しない。

イベントは `equipment_filter/search/compare/detail/share/related`。値は操作カテゴリ、既知ID、件数のみ。自由検索語・共有URLは操作イベントへ送らない。共有URLには検索語が含まれることと、ページアクセス時のログ・解析で処理され得ることを画面とプライバシーポリシーへ明記。

## 6. 検証と限界

品質ゲート・不正値・型番重複・出典変更・停止群・URL復元・比較上限・初期HTML・実際の公開投影停止・キャッシュ改変・条件URLのSEO設定の対象テスト16件を通過。追加テスト時のfixtureハッシュとテスト用ローダーの不備2件は修正して同じテストを再実行した。`npm run typecheck` は1回で成功。既存の `site-search.cjs` と `semiconductor-process.cjs` の回帰テストも成功し、ホームSSRを含む178件の検索投影、工程・既存学習導線を確認した。build・dev起動・ブラウザ確認は依頼条件に従い未実施。モバイルの実端末・キーボード実操作・クリップボード実APIは未確認。

今回の収集対象は8URLの固定入力であり、メーカーサイト全体の自動発見・数千件の自動構造化・PDF仕様表の行列対応・単位換算・AI検証器の精度評価は未実装。個別index公開、定期実行、独立監査の完了とも区別する。既存データの全数再検証は行っていない。

## 7. 拡張順序と判断基準

| 段階 | 次の実装 | 継続判断 |
| --- | --- | --- |
| Phase 2拡張 | 企業・用語アダプター、メーカー別HTML/PDF抽出器、仕様キーと条件の正規化、AI候補抽出と別方式の照合 | 監査で機種混同・単位誤りを検出し、保留理由と復旧手順を説明できる |
| Phase 3拡張 | 成膜・エッチング・検査等の収録、同一工程でのメーカー横断比較、企業詳細→該当装置の直接導線 | 検索→詳細→比較／Labの利用と空結果を観察できる |
| Phase 4 | 企業800・装置800・用語1000・職種100・拠点300・材料200を到達目標に段階追加 | 重複排除・出典照合・再実行の運用負担が増加件数に耐える |
| Phase 5 | 関係グラフ、個別Timeline接続、必要に応じサーバー側検索・ページ分割、個別SEOページの品質基準 | 完全性だけでなく検索流入、再利用、次の操作への到達を根拠に拡張・見直し |

大量のデータをClientへ一括送信し続けない。初期8件のローカル絞り込みから、件数と配信量を観察してサーバー投影・ページ分割へ移行する。既存DB全体のリファクタリングとURL統合移行は行わない。代替は既存型のアダプター継続で、影響は小さい一方、移行中は複数のデータ形式が残る。

次に優先する3件は、(1) 原文仕様表の行・列・条件を保持する抽出器と監査、(2) 同じ工程で複数メーカーを比較できるデータ拡充、(3) 検索→比較→Labの利用計測と実機UX確認。まず正確な比較の成立を優先し、その後に個別SEOページを検討する。

## 8. 変更ファイルと実行記録

| 用途 | 変更ファイル |
| --- | --- |
| 型・データ | `src/types/semiconductor-database.ts`、`src/data/database/equipment.json`、`processes.ts`、`release.json`、`suspensions.json` |
| 収集・照合 | `scripts/database/core.cjs`、`scripts/database/run.cjs`、`package.json`、`.gitignore` |
| サーバー投影・検索 | `src/lib/equipment-catalog.ts`、`src/lib/equipment-explorer.ts`、`src/lib/site-search-index.ts` |
| 画面 | `src/app/(ja)/equipment/page.tsx`、`src/components/equipment-explorer/EquipmentExplorer.tsx`、`equipment.module.css` |
| SEO・導線・計測 | `src/app/sitemap.ts`、`src/data/site-navigation.ts`、`src/data/semiconductor-process.ts`、`src/lib/analytics.ts`、`src/app/(ja)/tools/cmp-simulator/page.tsx`、`src/app/(ja)/tools/litho-simulator/page.tsx` |
| プライバシー | `src/app/(ja)/privacy/page.tsx` |
| テスト | `tests/unit/semiconductor-database.cjs`、`tests/unit/site-search.cjs`（JSONデータの読込対応） |
| 文書 | `README.md`、`docs/PRD.md`、`docs/architecture.md`、`docs/database.md`、`docs/documentation-map.md`、この設計書 |

主な実行コマンド：`git status --short`、`git log`、`git ls-remote origin refs/heads/main`、`node scripts/database/run.cjs --fetch --release`、`node scripts/database/run.cjs --release`、`npm run database:check`、`npm run database:test`、`node --test tests/unit/site-search.cjs tests/unit/semiconductor-process.cjs`、`npm run typecheck`、`git diff --check`。GitHub接続でopen PRとmainブランチを確認し、メーカー・競合はWeb読み取りで調査した。公開対象src/docsを非公開辞書の禁止語で走査し、該当なし。

推奨コミットメッセージ：`feat: add evidence-backed semiconductor equipment explorer`。commit・pushは利用者が行う。
