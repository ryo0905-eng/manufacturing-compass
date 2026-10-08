# AdSense再審査に向けた公開ページ品質・URL監査

実施日：2026-10-08（JST）
対象：`4c8115fbfc5fc5bf4030910ca5e5ba9e692174fe` を基点とする今回のローカル変更。

## 調査の前提

- 着手時の作業ツリーはclean。GitHub APIで既定ブランチの最新コミットを確認し、ローカルHEADと上記コミットが一致した。既存の未コミット作業はなかった。
- `AGENTS.md`、documentation-map、PRD、architecture、company-content-audit、SEO・コンテンツ方針、非公開の公開禁止辞書を確認した。
- 不承認の具体的な対象URLは不明。この文書は原因の断定や審査通過の記録ではなく、コードで再確認した問題と修正の記録。
- 先行監査の本番185 URL・152 HTML確認はユーザー提供の記録。本作業で同じ本番クロールを再実施したものではない。
- noindexは検索登録の制御。閲覧禁止、非公開化、AdSenseの審査対象除外を保証しない。
- 広告追加、commit、push、デプロイ、AdSense再申請、既存draftの一括公開は行っていない。

## 既存対策の保護

| 対象 | 最新コードの確認・今回の扱い |
| --- | --- |
| 企業DB37社 | `isCompanyIndexable()`を維持。complete 10社・draft 27社の判定を変更していない。企業一覧・業界地図からの閲覧を維持 |
| `/companies/[slug]/career-prep` | 企業本体の`#career-prep`への既存恒久転送を維持 |
| `/semiconductor-map`の条件URL | 既存noindex・canonical制御を維持。重複実装なし |
| 日英の記事・ツール | 既存公開条件を維持。Cpk、業界地図、数値ランキング、技術記事・学習ツールを一括でnoindexにしていない |

## Search Consoleの判断材料

接続済みプロパティ `https://mfg-compass.com/` のlive Search Console APIを利用。
期間：2026-09-08〜2026-10-05、web検索、pageディメンション。
対象URLパターン：compare、materials、経験別リスト、palm-fab、2つの工程ツール、業界ウォッチ記事。500行指定で15行、`hasMore=false`。
日付境界はSearch ConsoleのAmerica/Los_Angeles基準。2026-10-06以降は未確定として対象外。

| URL（ドメイン省略） | クリック | 表示 | 今回の判断 |
| --- | ---: | ---: | --- |
| `/compare/applied-materials-vs-lam-research` | 6 | 102 | 固有解説を追加しindex維持 |
| `/compare` | 3 | 102 | 一覧と自由比較を維持 |
| `/compare/applied-materials-vs-tokyo-electron` | 1 | 43 | 既存の代表URL `/compare/tokyo-electron-vs-applied-materials` へ恒久転送。解説を追加 |
| `/compare/micron-vs-kioxia` | 1 | 75 | 既存固有解説・indexを維持 |
| `/compare/tokyo-electron-vs-screen` | 1 | 8 | 解説を追加しindex維持 |
| `/compare/advantest-vs-teradyne` | 0 | 10 | 解説を追加しindex維持 |
| `/compare/analog-devices-vs-texas-instruments` | 0 | 22 | 解説を追加しindex維持 |
| `/compare/asml-vs-tokyo-electron` | 0 | 56 | 既存固有解説・indexを維持 |
| `/compare/disco-vs-lasertec` | 0 | 10 | 解説を追加しindex維持 |
| `/compare/infineon-vs-onsemi` | 0 | 1 | 解説を追加しindex維持 |
| `/compare/onsemi-vs-renesas` | 0 | 5 | 既存の有効URLを代表URLとして保存し、固有解説を追加。index維持・sitemap追加 |
| `/compare/qualcomm-vs-qorvo` | 0 | 23 | 解説を追加しindex維持 |
| `/compare/tsmc-vs-samsung-electronics` | 0 | 11 | 固有解説を追加。index維持・sitemap追加 |
| `/tools/improvement-report` | 0 | 2 | 報告書作成の役割を明確化。index維持 |
| `/tools/process-comparison` | 0 | 32 | 統計・分布比較の役割を明確化。index維持 |

未掲載URLを「流入なし」とは判断していない。今回の期間・検索種類に対する行の有無だけでは、全期間の検索流入、直接訪問、操作価値を判定できない。GSC Wizardの当該プロパティはGA4連携IDがnull。GA4のURL別訪問・操作実績は未取得。

## P0：比較URL

### 再確認した問題

旧処理は`-vs-`で分割後に不明IDを除去していた。会社が2件以上残ると表示でき、同一社・3社以上を厳密に拒否せず、逆順のcanonicalも自己参照だった。企業詳細の動的リンクとAMD記事の編集リンクも正規化されていなかった。

### 実装

- `normalizeCompanyComparison()`に集約。既知の異なるIDがちょうど2つの場合だけ成立。不明IDを除去して表示する挙動を廃止。
- 元の編集15組の代表順序を維持。GSCで確認できた2組の有効URLも代表順序として固定。他の自由比較は企業カタログの順序を使い、逆順でも同じ代表URLを返す。
- ページ本体は不正URLに`notFound()`、有効な逆順に`permanentRedirect()`を実行。
- metadata、canonical、Open Graph、パンくず、リンク生成、profile参照、sitemapで同じ正規化を利用。
- 自由比較の選択機能を維持。未編集の組は閲覧可能な`noindex, follow`。代表URLへのcanonicalと出典を持ち、sitemapへ入れない。
- `isComparisonIndexable()`は、固有解説、3つ以上の比較ポイント・確認質問、対象2社それぞれの事実とURL・確認日付き出典をチェックする。企業単体のcomplete/draftを条件に使わない。この構造チェックに加えて、今回の17組は公開根拠と内容を個別に編集した。将来はフィールドを埋めるだけで公開可と判断しない。

| URL例 | 実装後の扱い |
| --- | --- |
| `/compare/nvidia-vs-amd` | 固有解説あり・index可能・代表URL |
| `/compare/amd-vs-nvidia` | 上記へ恒久転送（308） |
| `/compare/nvidia-vs-nvidia` | 404 |
| `/compare/nvidia-vs-unknown`、`/compare/unknown-vs-amd` | 404 |
| `/compare/nvidia-vs-amd-vs-tsmc`、`/compare/nvidia-vs-unknown-vs-amd` | 404 |
| `/compare/tsmc-vs-nvidia` | 有効な自由比較。表示継続・noindex、自己の代表URLへcanonical |

全37社の異なる2社は666組。今回の編集済み17組はindex対象、残り649組は固有解説のない自由比較としてnoindexにする。今後の解除条件は、組み合わせ固有の比較意義・相違・質問、両社の根拠、比較表との整合の確認。検索実績が新たに確認できた自由比較は内容改善を優先する。

## P1：比較ページの固有価値

全ページに企業DBの出典・既存確認日・最終更新日を表示。2026-10-08に確認した事業・製品の根拠は別枠で掲載し、既存DBや職種情報まで同日に再確認したと表示しない。

待遇・働き方・採用可能性を推測で補完せず、英語必要度の汎用値を比較表から外し、求人ごとに使う場面を確認する質問へ整理。両社のキャリア情報が欠ける場合は、欠損中心のキャリア行を省略したうえで「両社の情報が未整備」と明示。片社のみ整備済みの場合の欠損表示は維持する。職種欄を「研究キーワード」とし、現在の募集と区別した。汎用careerSummaryの繰り返しカードは企業詳細リンクへ整理した。

| 比較URL（`/compare/`以下） | 比較する意味・確認条件 | 判断・残件 |
| --- | --- | --- |
| `asml-vs-tokyo-electron` | 露光装置と複数工程装置。日本の職種・拠点をそろえる | 既存固有profile維持。既存出典は2026-09-06等の記録で、今回一律再確認していない |
| `micron-vs-kioxia` | DRAM・フラッシュと日本拠点・仕事内容 | 既存固有profile維持。現在募集は応募時に確認 |
| `tsmc-vs-micron` | 受託製造とメモリ製品。工程開発／量産維持の段階をそろえる | 改善・index維持 |
| `tsmc-vs-tokyo-electron` | 半導体を製造する側と装置を供給する側。作業場所・担当範囲をそろえる | 改善・index維持 |
| `tokyo-electron-vs-screen` | 洗浄など接点のある製品。工程・方式・開発／保守の役割をそろえる | 改善・index維持。SCREENは公式検索掲載文で確認した範囲を明示 |
| `tokyo-electron-vs-applied-materials` | 複数工程の装置群。膜・方式・測定指標をそろえる | 改善・index維持。逆順の実績を代表URLへ集約 |
| `applied-materials-vs-lam-research` | 成膜・エッチング等。担当材料・加工方式・顧客対応をそろえる | 重点7組。改善・index維持。企業別キャリア情報は未整備と表示 |
| `advantest-vs-teradyne` | 半導体テスト。対象デバイス・本体／周辺機器／プログラムをそろえる | 改善・index維持。Teradyneの事実は公式検索掲載文の範囲に限定 |
| `renesas-vs-rohm` | 制御・アナログ・パワー。回路・ソフト・品質の役割をそろえる | 改善・index維持。ROHMは公式検索掲載文の範囲に限定 |
| `infineon-vs-onsemi` | 電力・制御・検知。製品機能と評価対象をそろえる | 重点7組。改善・index維持。現在の求人・キャリア準備は未確認 |
| `nvidia-vs-amd` | 計算・AI・組み込み。用途とハード／ソフト／顧客支援をそろえる | 重点7組。改善・index維持。性能順位・採用可能性を推定しない |
| `qualcomm-vs-qorvo` | 通信システムのプラットフォームと無線部品。規格・用途・評価単位をそろえる | 重点7組。改善・index維持。製品情報を求人の裏付けに読み替えない |
| `analog-devices-vs-texas-instruments` | データ変換・アナログ・組み込み。計測／電源／制御の用途をそろえる | 重点7組。改善・index維持。ADIは公式検索掲載文の分類確認に限定 |
| `disco-vs-lasertec` | 切断・薄化・研磨と検査・計測。対象と改善指標をそろえる | 重点7組。改善・index維持。工程上の役割で比較 |
| `nikon-vs-canon` | 光学露光とナノインプリントの技術案内。担当方式・工程を特定する | 重点7組。改善・index維持。装置仕様の数値順位や企業全体の分類を作らない |
| `onsemi-vs-renesas` | 電力・画像検知と機器制御。機能と担当範囲をそろえる | GSCで有効URLを確認し追加編集。index維持・sitemap追加 |
| `tsmc-vs-samsung-electronics` | ファウンドリ事業と会社全体の範囲を分ける | GSCで有効URLを確認し追加編集。index維持・sitemap追加 |

### 一次情報の確認範囲

`src/data/company-research.ts`に各社の事実、公式URL、確認日を保持。2026-10-08はエージェントによる事業・製品範囲の確認日であり、人間レビュー・求人募集の確認日ではない。

- 多くは公式ページの本文・製品カテゴリを取得して確認した。重視したのは担当する工程・製品の役割であり、給与・採用・働き方・具体的な性能数値は新たに主張していない。
- SCREEN、Teradyne、ROHM、Analog Devicesは、本文取得失敗または動的一覧の取得不足があった。企業公式ページの検索掲載文で確認できる限定的な事業・製品分類のみ利用し、その範囲を本文にも明示。本文全体を再確認済みとは記録していない。
- ニコン、日立ハイテク等では、最初に試したURLが取得できず、確認できた公式の製品URLを利用した。確認できなかったURLを新規根拠として採用していない。
- 新しいprofileの事実と、比較意義・条件・質問という編集上の提案を分けて表示。既存企業DBの古い確認日は上書きしていない。
- 次の改善条件：上記4社の本文と現行採用情報を取得し、同じ担当製品・職種・日本の地域で照合できた場合に根拠と質問を具体化する。これは本修正全体の一律公開待ち条件にはしていない。

## P1：材料・経験別リスト・ゲーム

| URL | 修正と判断 | 残件・確認条件 |
| --- | --- | --- |
| `/segments/materials` | 企業全体の一覧を暗示するタイトルを材料の分類・役割へ変更。ウェーハ、ガス、薬液、レジスト、CMPスラリーの5分類で既存公開記事へ接続。各役割・比較条件・記事更新日を表示。SUMCO 1社のDBと未網羅範囲を明示。index・canonical維持 | 各リンク先の全出典を本日再確認していない。入口の説明は既存記事に基づく。未確認企業詳細を増やしていない |
| `/rankings/equipment-career-entry` | 11企業項目に担当装置・対象職種候補・具体的経験・質問・公式根拠と確認日を追加。汎用careerSummaryと末尾の再掲カードを整理。index維持 | 現在の日本の中途募集、勤務地、職位の照合は未実施 |
| `/rankings/quality-career-entry` | 10企業項目に製品別の品質・不良解析の接点、対象職種候補、質問と根拠を追加。製品品質と装置品質の役割を分ける。index維持 | 個別募集・信頼性試験の要求条件は応募時に確認 |
| `/rankings/english-global-career` | 10企業項目に対象製品と技術説明・海外連携の接点を追加。英語の必要水準は会社名から決めず、資料・会議・顧客対応の質問に整理。index維持 | 語学要件・海外連携頻度を求人で確認する必要あり |
| `/games/palm-fab` | ゲーム内のnative details説明パネルを追加。遊び方、出荷目標、3工程と搬送、検査13秒→2.8秒の例、架空設定、保存・再開・確認付きリセット、運営者・privacyリンクを初期HTMLに含める。ゲーム上部の長文常設は避ける。index維持 | 保存は同一ブラウザのlocalStorage。非表示時停止、オフライン進行なし。計算・保存の既存unit testは通過。パネル操作・スマホ表示の実ブラウザ確認は未完了 |

経験別リストは売上・時価総額順位ではない。既存の掲載順を維持し、おすすめ順位や採用難易度を意味しないと表示。事業根拠、過去の職種紹介・求人の確認日、編集上の研究候補を分ける。全31項目の職種を現在の募集として新たに確認したものではない。

## P2

| URL | 対応 | index・残件 |
| --- | --- | --- |
| `/semiconductor-watch/tsmc-capital-appropriation-2026-09` | 承認→発注・納入→稼働の段階と、同社月次売上との時間差を追加 | index維持。新たな稼働・発注実績を主張していない |
| `/semiconductor-watch/broadcom-q3-semiconductor-solutions-2026` | 半導体事業と全社、四半期と月次の比較範囲、設計需要と製造受注の関係を追加 | index維持。既存要約の重要数値は今回再計算・再照合していない |
| `/semiconductor-watch/sec-0000002488-26-000182` | 契約日と公表日と完了を分離。買収と製品・工場の動きの違いを追加。NVIDIA比較リンクを正規URLへ修正 | index維持。買収完了や競争力への効果を推定していない |
| `/semiconductor-watch/sec-0001046179-26-000658` | 前月比／前年同月比、売上と利益、設備投資承認との対象時点の違いを追加 | index維持 |
| `/semiconductor-watch/sec-0000950103-26-013682` | TSMC月次売上との集計範囲の違い、ATMと先端実装の違い、既存計算差の追跡条件を追加 | index維持。既存の会社公表値と再計算差の注記を維持 |
| 上記5記事共通 | summaryの本文内再掲を整理。`editor-verified`の既存記録に対応する表示を維持し、既存checkedAtを変更しない。読み方の編集更新日を別フィールドで表示し、metadata・sitemapの更新日に反映 | 原文再確認を捏造していない。出典変更検出時は再照合未完了を表示 |
| `/tools/process-comparison` | 入力→統計・分布比較→Excelコピー／PNGの入口を明確化。結果から報告書へ進む既存操作を説明。入力ファイルの明示保存に説明を合わせる | index・canonicalを維持。実画面の操作は未確認 |
| `/tools/improvement-report` | 比較→タイトル・変更内容・測定条件・考察・次の確認→印刷／PDFの手順を明示。reportModeの入力見出し・実行ボタンを報告書向けに変更 | index・canonicalを維持。統合していない。計算ロジックは変更なし |
| `/companies?query=...` | queryが指定された検索条件URLは空文字・空結果・重複指定を含めnoindex, follow。canonicalは`/companies`。配列型のqueryを安全に扱い、先頭値を画面初期値として使う | 基本一覧はindex・sitemap維持。検索と内部導線は利用可能。追跡用等のquery以外のパラメータは本修正のnoindex条件にしていない |

## index・canonical・sitemap・内部リンクの整合

- 編集済み17組は同じ代表URLでmetadata、Open Graph、構造化パンくず、profileを参照し、sitemapへ掲載。元の15URLは維持した。
- その他の有効な自由比較はnoindex, follow＋代表URLcanonical。選択UI・企業詳細からのリンクは共通のslug生成を利用し、閲覧できる。無効URLはsitemap・リンク生成の対象にしない。
- 逆順のAMD編集リンクを修正。企業詳細の比較リンクにも共通slug生成を利用。既存の固定比較記事リンクは代表URLと一致する。
- `/companies?query=...`はnoindex、基本一覧canonical、sitemapは`/companies`のみ。材料・職種キーワードからの条件URLリンクは操作入口として維持。
- 材料・経験別リスト・ゲーム・2工程ツール・業界ウォッチ記事はindexを維持。企業draftのnoindexを解除していない。
- コードから生成したsitemapは187 URL、187 unique。元の185から、GSCに表示実績のある比較2URLを追加。比較17 URL。今回、本番sitemapとの一致は確認していない。

## 検証記録

| 検証 | 結果・限界 |
| --- | --- |
| `node tests/unit/company-comparison.cjs` | 通過。実ルート関数と本物のNext navigationを実行し、308のredirect digest・転送先、404 digest、正規ページのSSR、metadata、profile、sitemapを確認。全666組の逆順一致・重複なし、17profileのindex、自由比較のnoindex、条件一覧のmetadata、31項目・5材料リンク・5ウォッチ記事のSSRを確認。実HTTPサーバーの応答確認とは区別 |
| 初回の比較回帰テスト | 経験別リストが参照するキオクシアの事業根拠データ不足を検出。根拠を追加して通過 |
| `node tests/unit/palm-fab.cjs` | 通過。数量保存、待ち行列、出荷、強化、保存・リセットの既存simulation検証。新しい説明パネルのブラウザ操作を検証したものではない |
| `node tests/unit/process-comparison.cjs` | 通過。計算、入力検証、出力、状態・プライバシーの既存検証。入口やreportModeの実画面は未確認 |
| `npm run typecheck`（180秒制限） | 1回実行、失敗。経験別リストのJSX閉じ括弧の構文エラーを検出。修正後は3リストのSSR回帰テストを通したが、最大1回の制限によりtypecheckは再実行していない。最終差分の型チェックは未完了 |
| `node node_modules/eslint/bin/eslint.js <変更した20 TS/TSXファイル>`（180秒制限） | 1回実行、同じJSX構文エラーで失敗。構文修正後のlintは未実施。停止・失敗を別設定で繰り返していない |
| `git diff --check` | 通過 |
| 公開禁止辞書 | src・docsを部分一致で確認し、禁止語一致0。変更した本文・metadataに運営者の応募先・提示金額等を新たに掲載していない |
| browser-act | version確認は成功。`get-skills core --skill-version 2.0.2`はsandbox外ログ領域への書き込み権限エラーで失敗。ブラウザセッションを作成していない |
| `npm run dev -- --webpack --hostname 127.0.0.1 --port 3107` | UI確認のため一度試行。sandboxによる`listen EPERM`で即終了。別設定で再試行していない。サーバーの常駐なし |
| build | 実施していない |

## 残件と確認条件

1. **最終型・lint確認**：今回の各1回は修正前の構文エラーで終了。ユーザー環境で`npm run typecheck`と対象lintを確認する。類似コマンドや一時tsconfigによる再試行は行っていない。
2. **実画面と実HTTP**：ローカルプレビューが権限エラーで起動できなかったため、スマホ360/390pxでゲーム説明の開閉・スクロール・保存復元・リセット、比較選択・表、2つの工程ツールの入口と報告書操作を確認する。正規比較・逆順・同一社・不明ID・3社をHTTPでも確認する。
3. **本番反映**：ユーザーによるcommit・push後、Vercelの結果と本番HTMLのcanonical・robots・redirect、187URLのsitemapを確認する。本文・公開設定のローカル修正と本番反映を混同しない。
4. **職種情報の具体化**：経験別リストは事業・製品と研究候補を改善済み。現行の日本の公式求人で職種・雇用法人・配属地域をそろえて、確認済み一般職種紹介と募集をさらに分けて更新する。未確認の待遇や募集を推測で補完しない。
5. **根拠の取得不足**：SCREEN、Teradyne、ROHM、ADIの公式本文を取得できたら、限定的な検索掲載文根拠を置き換える。現在のページには確認できた範囲と未取得部分を表示済み。
6. **実績の追跡**：反映後のGSCで正規URLへの集約と表示・クリックの変化を確認する。GA4のURL別訪問、各ツール・ゲームの利用は未取得。GSCの未掲載だけでnoindexを追加しない。
7. **業界ウォッチの数値**：今回追加した読み方は既存の確認済み要約を基礎にした編集。原資料の重要数値を新たに全件再照合した記録ではない。通常の更新時に既存確認記録とsourceCheckを照合する。

## 変更ファイルとコミット案

変更ファイルは次の25件。

- `docs/adsense-content-audit.md`
- `docs/seo.md`
- `src/app/(ja)/companies/[slug]/page.tsx`
- `src/app/(ja)/companies/page.tsx`
- `src/app/(ja)/compare/[slug]/page.tsx`
- `src/app/(ja)/rankings/[slug]/page.tsx`
- `src/app/(ja)/segments/[slug]/page.tsx`
- `src/app/(ja)/semiconductor-watch/[slug]/page.tsx`
- `src/app/(ja)/tools/improvement-report/page.tsx`
- `src/app/(ja)/tools/process-comparison/page.tsx`
- `src/app/sitemap.ts`
- `src/components/CompanyComparisonSummary.tsx`
- `src/components/ProcessComparisonTool.tsx`
- `src/components/palm-fab/PalmFabGame.module.css`
- `src/components/palm-fab/PalmFabGame.tsx`
- `src/data/career-research-lists.ts`
- `src/data/company-comparisons.ts`
- `src/data/company-research.ts`
- `src/data/editorial.ts`
- `src/data/materials-navigation.ts`
- `src/data/watch-editorial.json`
- `src/lib/format.ts`
- `src/lib/watch-types.ts`
- `src/lib/watch.ts`
- `tests/unit/company-comparison.cjs`

推奨コミットメッセージ：`fix: canonicalize comparisons and improve public content quality`
