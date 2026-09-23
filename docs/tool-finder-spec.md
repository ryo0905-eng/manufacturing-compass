# 困りごとから選ぶ実務ツール案内

更新日: 2026-09-23。既存 `/tools` に通常表示。本番反映・GA4受信は未確認。

## 範囲

5目的→実データ／学習→必要な場合のみデータの最大3問。日本語・選択式・保存なし。既存ツール一覧の前に置き、一覧への直接導線と既存フィルターを維持する。教材への案内も含め、主リンク1件・補助リンク最大1件。新規URL、sitemap項目、検索条件URLを作らず、既存canonicalとCollectionPageを維持しmeta descriptionを更新する。

## 分岐

| 目的 | 実データ利用 | 架空例で学ぶ |
| --- | --- | --- |
| 規格とばらつき | 測定値と規格、または平均・短期標準偏差と規格→Cpk。未準備→準備事項と入力例 | Cpkの「動かして理解」を案内 |
| 変更前後 | 2条件の測定値→工程比較、補助は改善レポート。要約値だけ・未準備→準備事項と入力例 | 改善の差を見極める教材 |
| 平均の測定数 | 想定標準偏差と推定幅を決められる→測定計画。過去の測定値だけ・未準備→準備事項と入力例 | 測定計画の架空例 |
| 測定誤差 | 実データ解析未対応と明記→Gage R&R教材 | Gage R&R教材 |
| 工程の時間変化 | 実データ解析未対応と明記→管理図教材 | 管理図教材 |

規格の実務案内では管理図教材を補助リンクにする。学習選択と実データ解析未対応の目的ではデータを尋ねない。計16経路。未選択時に結果は表示しない。目的・使い方を変更すると後続回答と古い結果を破棄する。

## 正確性と出典

- 入力方式は既存実装を確認。Cpkの要約入力は短期標準偏差、実測入力は全体変動によるP系。工程比較は2条件の実測値。管理図・Gage R&R・改善の差は教材用。
- [NIST 工程能力](https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm)：安定性・分布の前提を確認（2026-09-23）。
- [NIST 測定数](https://www.itl.nist.gov/div898/handbook/prc/section2/prc222.htm)：平均の推定幅・想定標準偏差と、差の検出計画の区別を確認（同日）。
- 手法の自動判定は行わず、案内の理由・準備事項・確認範囲を表示する。ページ内の折りたたみに出典と最終確認日を表示する。

## UI・データ・計測

ネイティブradio・fieldset・legend・labelを使い、結果通知は短いstatus領域に分離。選択状態は色とradioで示す。スマホは1列、44px以上の選択領域、フォーカス表示。回答をURL・Storage・サーバーへ保存しない。静的な見出し・目的質問・出典はSSRにも含む。

ツール名・URL・入力方式を既存台帳から取得し、未掲載ツールを案内しない。計測の不調で選択やリンクを止めない。`tool_finder` のview/start/resultはマウント中1回、open/related/resetは操作ごと。初期表示は開始・結果に含めず、案内見出しが実際に露出した場合のみresult。詳しくは [計測文書](./conversion-architecture.md)。

## 検証

`node tests/unit/tool-finder.cjs` 成功。全16経路、案内先の存在、準備・未対応分岐、回答変更による旧結果と露出監視の破棄、学習時の質問省略、露出とクリックの区別、イベント属性、計測失敗時の継続、SSRを確認。UI操作と露出はモックによる確認。`npm run typecheck` は1回実行し成功。`git diff --check` 成功。公開禁止語と新規ファイルの空白検査を実施。実ブラウザ・実機画面・本番受信は今回の確認対象外。dev・build・commit・pushは実施しない。

## 変更ファイル

新規: `src/data/tool-finder.ts`、`src/lib/tool-finder.ts`、`src/components/ToolFinder.tsx`、同CSS Module、`tests/unit/tool-finder.cjs`、本仕様書。
更新: `ToolsLearningLab.tsx`、`src/app/(ja)/tools/page.tsx`、PRD、architecture、conversion-architecture、documentation-map、企画書、TASKS。

推奨コミット: `feat: guide users to practical tools by task`
