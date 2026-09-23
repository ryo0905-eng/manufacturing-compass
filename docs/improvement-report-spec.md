# 工程改善レポート

更新日：2026-09-23。実装上の公開設定済み。本番反映・GA4受信は未確認。

## 提供範囲

品質・生産技術担当者が、変更前後の測定値から社内検討用の報告書を作る。日本語 `/tools/improvement-report`、無料・登録不要。工程比較の日本語結果からも同じ画面内で編集を開く。英語版の操作は維持する。ページ間の入力転送、アカウント、外部AI、顧客向け正式帳票、課金、PowerPointは初版に含めない。

完成見本は教材用の架空例。「自分のデータで作る」は測定値・規格・報告欄を空にし、条件名だけ既定値を使う。「架空例で試す」は既存比較サンプルと例文を表示する。入力→比較→報告編集→印刷が同じページで完結する。

## 計算・表示

`ProcessComparisonTool` と `compareProcesses` を共用。各条件2〜10,000件。件数・平均・標本標準偏差（n−1）・最小・最大・平均差B−A、共通軸／区間／割合のヒストグラムをそのまま利用する。

全体の標本標準偏差を `calculateCapability(method="overall")` に渡す。両側規格はPp/Ppk、上限だけはPpu、下限だけはPpl、規格なしは能力行を省く。標準偏差ゼロ・数値範囲外では該当指標だけ理由付き「算出不可」。極大値での中間演算のオーバーフローを避けるため、平均・規格・標準偏差を同じ尺度で正規化する。比較自体の数値範囲は既存計算の制約に従う。

規格内率は観測データ内の割合。自動の観察文は平均・標準偏差・規格内率のA→Bの変化のみを記述する。本人の考察と分離し、有意性・同等性・因果関係・工程安定性・将来品質を判定しない。

出典（2026-09-23確認）：[NIST 工程能力](https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm)、[Minitab 全体変動の能力指標](https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/capability-analysis/how-to/capability-analysis/normal-capability-analysis/interpret-the-results/all-statistics-and-graphs/overall-capability/)。全データの標本標準偏差にP系の名前を用いる。安定性・正規性は本ツールでは検証しない。

## 編集・保存

タイトル60文字、変更内容・測定条件各120文字、考察・未確認事項・次の行動各180文字。Unicodeコードポイントで数え、残り文字数を表示。超過を切り捨てず、印刷・保存時に拒否する。報告日は空欄または実在するYYYY-MM-DD。未記入欄はプレビューで「未記入」と表示する。

測定値・規格・条件名の編集で旧結果・印刷可能なレポートを消し、報告文は保持して再計算後の見直しを促す。報告文だけの変更は再計算せずプレビューへ反映する。復元は結果を消去し、報告日を現在日へ変更せず、明示的な再計算を待つ。

形式は既存の `mfg-compass-workspace` / version 1、tool=`improvement-report`。inputは比較8項目（nameA/nameB/measurement/unit/dataA/dataB/lower/upper）と報告7項目（reportTitle/reportDate/changeDescription/measurementConditions/interpretation/uncertainties/nextAction）の文字列。許可項目だけを抽出し、計算結果を含めない。UTF-8で2 MiBまで。ファイル名は `mfg-compass-improvement-report-YYYY-MM-DD.json`。

報告書画面だけ旧process-comparisonファイルも許可し、報告7項目を空にする。置き換え確認にその旨を表示する。工程比較・Cpk側の許可形式は広げない。検証失敗・キャンセルは現在の入力・結果を変更しない。読み込み、印刷、図の生成は端末内。自由入力はReactのテキストとして描画し、サーバー・解析・URLへ送らない。

## 印刷と紹介画像

専用プレビューをbody直下のportalへ出力し、印刷中はそれ以外のDOMを非表示にする。A4縦・余白12mm・本文10pt以上。通常例は1ページ、長文では改ページを許可する。切り取りや全体の縮小でページ数を強制しない。分布図は既存SVGを使用する。

印刷ボタンは画像decodeとフォント読み込みを待ち、10秒で準備失敗を案内する。準備中に内容が変わった場合も印刷せず再試行を促す。ブラウザのヘッダー・フッターは利用者がオフにする。印刷要求後は既存問い合わせへのリンクを出すが、報告内容は添付しない。

`public/images/improvement-report-example.png` は実装の架空プレビューから生成した完成見本。ページ・OG・Threadsで共用。投稿は運営者が行う。投稿案：

> 変更前後の数値を比べた後、社内報告にまとめる作業を減らしたくて作りました。測定値・分布図・考察を、同じ画面から印刷／PDF保存できます。画像は架空例です。どんな項目があると実際の報告で使いやすいですか？

配布URL：`https://mfg-compass.com/tools/improvement-report?utm_source=threads&utm_medium=social&utm_campaign=improvement_report_launch`。入力データをURLへ含めない。

## 計測・事業検証

新ページは既存 `experience_view` / `tool_step` をtool_id=`improvement-report`で利用する。初回操作、サンプル選択、計算試行、エラー、操作後のプレビュー直前の見出し露出を計測。静的な見本画像は結果到達に数えない。結果露出は同一マウント1回。初期表示だけでは開始にならない。

追加イベント `improvement_report_action` の属性は固定tool_id・locale=ja・actionのみ。actionはopen_editor / print_requested / feedback_click。保存・復元は既存 `tool_workspace_file` を再利用。印刷要求はPDF保存完了ではない。タイトル・日付・自由記述・測定値・ファイル名・計算値は送らない。

既存工程比較からの利用は、process-comparisonの共通結果露出→open_editor→print_requestedで追う。新ページではopen_editor→improvement-reportの結果露出→print_requestedを確認する。入口別の順序を混ぜて一つのファネルにしない。操作開始イベントはページ内1回のため、後日の再利用を同一人物と断定しない。

本番反映日から14日を初回観測期間とし、流入が少なければ需要未検証と扱う。運営者が実務者3〜5人へ試用を依頼し、「実際の報告に使えたか」「どこを直したか」「次の案件でも使いたいか」を確認する。人数達成は公開条件にしない。実務利用確認後、PowerPoint・社内書式対応などの候補を価格を伴う利用意向で絞る。

## 検証記録（2026-09-23）

- 関連単体テスト6本を各1回実行、すべて成功：improvement-report / tool-workspace / process-comparison / practical-tool-journey / practical-tools-english / cpk-english。
- `npm run typecheck` を1回実行し成功。build・lintは未実施。
- 単体・モックUI：既存結果一致、片側／両側／規格なし、SDゼロ、数値限界、保存往復、旧ファイル互換性、キャンセル、旧結果破棄、長文・特殊文字、固定イベント属性、初期見本の成果除外、既存英語UIの回帰を確認。
- 実Chromeで新ページと架空例の入口を確認。Playwrightの実Chromiumで架空例と全自由記述上限のPDFを生成。PDFKitでラスタライズし、全3ページを目視確認：通常例1ページ、上限例2ページ、A4、文字切れ・図欠落なし。代表値はA平均100/B平均100.16667、SD2.9277002/1.1690452、規格内率50%/100%。
- Chromiumの390×844px表示で入力・プレビュー・印刷ボタンを操作。横幅390pxに対し文書幅390px。文字数超過で印刷無効化を確認。印刷ボタンの呼び出しはwindow.printの差し替えで確認し、PDF出力自体はChromiumの印刷エンジンで別途確認した。OSの保存先ダイアログ操作や実機スマホの確認とは区別する。
- PDFはローカルの `/private/tmp/improvement-report-sample.pdf` と `/private/tmp/improvement-report-max.pdf` に生成。開発サーバーは確認後停止。
- 未確認：本番デプロイ、GA4イベント受信、実機スマホ、Safari/Firefox印刷、実務者試用。公開設定と本番公開を区別する。

## 変更ファイルと実行コマンド

- 新規：`src/app/(ja)/tools/improvement-report/page.tsx`、`src/components/ImprovementReportEditor.tsx`、`src/components/ImprovementReportPreview.tsx`、`src/components/ImprovementReport.module.css`、`src/data/improvement-report.ts`、`src/lib/improvement-report.ts`、`public/images/improvement-report-example.png`、`tests/unit/improvement-report.cjs`、本仕様書。
- 既存更新：`src/components/ProcessComparisonTool.tsx`、`src/components/ToolWorkspaceFile.tsx`、`src/lib/tool-workspace.ts`、`src/lib/use-practical-tool-journey.ts`、`src/data/learning-tools.ts`、`src/app/sitemap.ts`、`src/app/(ja)/privacy/page.tsx`。
- テスト更新：`tests/unit/process-comparison.cjs`、`tests/unit/tool-workspace.cjs`、`tests/unit/practical-tool-journey.cjs`。
- 文書更新：`docs/PRD.md`、`docs/architecture.md`、`docs/conversion-architecture.md`、`docs/documentation-map.md`、`docs/monetization.md`、`TASKS.md`。

実行した主要コマンド（各テスト・型チェックは1回）：

```sh
node tests/unit/improvement-report.cjs
node tests/unit/tool-workspace.cjs
node tests/unit/process-comparison.cjs
node tests/unit/practical-tool-journey.cjs
node tests/unit/practical-tools-english.cjs
node tests/unit/cpk-english.cjs
npm run typecheck
npm run dev -- --hostname 127.0.0.1 --port 3100
node /private/tmp/report-qa.cjs
swift -module-cache-path /private/tmp/report-swift-cache /private/tmp/report-pdf.swift
git diff --check
```

最終の差分確認で結果露出の参照先を編集見出しからプレビュー直前へ移動した。また保存部品にツール別keyを付け、読込確認中に報告編集へ切り替えた場合に旧形式の読込待ち状態が残らないようにした。これは再度の型チェック・単体テストの対象にはしていない（各1回の制限を維持）。PDF内容・計算・保存形式には変更なし。

推奨コミット：`feat: add printable process improvement reports`。commit/pushは未実施。

## デプロイ時のCSSコンパイル修正（2026-09-23）

VercelのWebpack buildで、`ImprovementReport.module.css` のグローバル専用セレクターがCSS Modulesのpure制約に違反して停止。body直下のレポート以外を非表示にするルールとbodyの印刷時リセットを `src/app/globals.css` の `@media print` へ移動した。印刷属性による条件と宣言は維持し、ローカル `.printRoot` の表示と帳票スタイルはCSS Moduleに残した。

`node tests/unit/improvement-report-css.cjs` でNext同梱の `postcss-modules-local-by-default`（pureモード）による対象CSSのコンパイルと、グローバルルールの印刷限定・属性条件を検証し成功。`node tests/unit/improvement-report.cjs`、`git diff --check`も成功。TypeScript変更なしのため型チェックは実施せず、フルbuild・ブラウザ・commit・push・本番再デプロイも未実施。対象CSSの検証と本番ビルド全体の成否は区別する。

変更ファイル：`src/components/ImprovementReport.module.css`、`src/app/globals.css`、`tests/unit/improvement-report-css.cjs`、本仕様書、`TASKS.md`。
推奨コミット：`fix: move report print globals out of CSS module`
