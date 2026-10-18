# Chip Pulse 決算・IR：初期データと更新手順

最終更新日: 2026-10-18

## 現行の掲載と確認

主要12社を掲載。NVIDIA（設計）、TSMC（受託製造）、Intel（IDM）を追加し、ASMLは10月14日のQ3へ更新。既存9社の主要数値を公式資料で再照合。キオクシアの日本語PDFは取得できず、SGXに会社が提出した英訳で照合し、資料優先順位を明記した。Samsungの10月8日全社速報はDS部門の確定実績へ混ぜず、補足発表として接続する。KLAの営業利益とSamsung DS部門の前年比は未取得を維持。

現行の数値・原資料はearnings-snapshot.json、最新発表有無の確認・予定・処理記録はwatch-calendar.jsonを参照する。TWDの実績前年比とUSDの実績前年比は混ぜない。年次5期の履歴は下記の専用データ・更新手順で別管理する。

日次実行・限定commit/push・未稼働の設定状態は [日次更新手順](./watch-daily-operations.md) を参照。下記の9社表は10月3日時点の初期掲載記録で、現行掲載期の正本ではない。

## 対象と資料

装置メーカー5社に加え、既存の企業ID・メモリメーカー記事・業界地図につながるキオクシア、Micron、SK hynix、サムスン電子の4社を対象とする。製造装置とメモリ関連を分けて比較する。各社の最新発表を並べるため、期間・会計基準・通貨は揃っていない。画面では同一期間の比較と呼ばない。

| 企業ID | 掲載期 | 主資料 | 補助資料 |
| --- | --- | --- | --- |
| `asml` | 2026年Q2 | [ASML Q2 release](https://investor.asml.com/news-releases/news-release-details/q2-2026-financial-results) | [ASML US GAAP財務諸表（SEC提出）](https://www.sec.gov/Archives/edgar/data/937966/000162828026048235/financialstatementsusgaa.htm) |
| `applied-materials` | FY2026 Q3 | [Applied Materials Q3 release](https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-announces-third-quarter-2026-results) | — |
| `lam-research` | 2026年6月終了四半期 | [Lam Research release](https://investor.lamresearch.com/2026-07-29-Lam-Research-Corporation-Reports-Financial-Results-for-the-Quarter-Ended-June-28,-2026) | — |
| `kla` | FY2026 Q4 | [KLA Q4 release](https://ir.kla.com/news-events/press-releases/detail/518/kla-corporation-reports-fiscal-2026-fourth-quarter-and-full) | — |
| `tokyo-electron` | 2027年3月期Q1 | [東京エレクトロン決算短信](https://www.tel.com/ir/library/report/i242su0000000goz-att/fy27q1tanshin-e.pdf) | [説明資料](https://www.tel.com/ir/library/report/i242su0000000goz-att/fy27q1presentations-e.pdf) |
| `micron` | FY2026 Q4 | [Micron決算発表](https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx) | — |
| `kioxia` | 2027年3月期Q1 | [キオクシア決算短信](https://ssl4.eir-parts.net/doc/285A/tdnet/2859905/00.pdf)（[公式IRの掲載元](https://www.kioxia-holdings.com/ja-jp/ir/news.html?sumtag=financial-results)） | — |
| `sk-hynix` | 2026年Q2 | [SK hynix決算発表](https://news.skhynix.com/en/q2-2026-business-results/) | — |
| `samsung-electronics` | 2026年Q2 | [Samsung決算発表](https://news.samsung.com/global/samsung-electronics-announces-second-quarter-2026-results) | — |

数値の単位は原則として百万通貨単位で保存し、韓国2社は元資料の十億ウォン単位で保持する。TSMCは百万台湾ドル単位で保持し、原資料記載の米ドル見通しとは分ける。東京エレクトロンとキオクシアの第1四半期は3か月の累計表示であり、通期累計と区別して単四半期として掲載する。ASML、Lam Research、KLA、Micronの売上高前年同期比は、同じ資料中の2期の値から計算し、式をデータへ記録した。Samsungの主要数値は半導体のDS部門であり、メモリ単独でも全社連結でもない。DS部門の売上高前年同期比は「未取得」。SK hynixの四半期数値は発表時点の暫定値。KLAの営業利益は「未取得」、東京エレクトロンの通期予想は「未公表」。

## 決算シーズンの更新

1. `npm run chip-pulse:refresh` が運用されている環境では、既存SEC収集に含まれる米国4社とASMLの提出メタデータを発見用に使う。`npm run earnings:check` は現行chip-pulse-mediaのsourceId付き候補を読み、処理済み判断を除いた候補を表示する。`npm run watch:queue` は未処理全件とIR・予定の確認台帳も表示する。東京エレクトロン、キオクシア、SK hynix、Samsungは各社の公式IRを手動で確認する。SECメタデータは決算本文を読んだ証拠にはならない。
2. 新しい決算について、公式資料の発表日、対象期間、連結実績、会社見通し、事業別情報、訂正履歴を確認する。各数値・文章の `source.documentId` と `locator` を記録し、PDFではページ番号を付ける。前年比は同じ期間・同じ指標で計算する。
3. `src/data/earnings-snapshot.json` を候補ファイルとして丸ごと複製・編集する。変更した企業の `version` を上げ、`checkedAt` と`contentUpdatedAt` は本文・数値・出典を変えた場合だけ進める。最新発表の有無だけの確認はwatch-calendar側へ記録し、古い公表日を変えない。全体の `updatedAt` は決算内容の変更日に更新する。予想修正は同じ対象期間の前回予想が照合できた場合だけ方向を付ける。業界共通テーマは2社以上の資料が裏付ける場合だけ追加する。
4. `node scripts/earnings-publish.cjs --candidate /path/to/candidate.json` を実行する。検証後に直前の版を `.private/earnings-snapshots/` へ保存し、公開JSONを原子的に入れ替える。候補JSONの形式・出典参照・版・欠落に問題があれば、公開版は変更しない。訂正は旧版をアーカイブに保持して新しい版として公開する。
5. `npm run earnings:check`、変更対象の型・画面・リンクの確認を行う。公開される本文・メタデータは `.private/content-redaction-dictionary.md` と照合する。公開設定と本番反映は別で、commit・pushは明示依頼時のみエージェントが行う。

既存のSEC収集は提出候補の発見まで。決算資料の取得、PDFの数値抽出、主張の要約、ページ照合、訂正判定、日本・韓国企業の更新は手動。閲覧時の外部API・AI処理は行わない。新規契約や環境変数は不要。

## 年次5期の履歴（2026-10-18追加）

`src/data/earnings-history.json`を年次履歴の正本とする。12社各5期、60期間を2026-10-18に照合。日付は各社の会計期間で、米国企業の52/53週決算を暦年に置き換えない。元の金額・表示精度を保持し、千→百万・兆→十億の単位換算のみ行う。年度名は各社間で意味が違うため、画面のラベルは期末の年月とする。

| 企業 | 掲載期末 | 採用資料・確認結果 |
| --- | --- | --- |
| ASML | 2021.12〜2025.12 | SECの2022・2024・2025年20-F、全期US GAAP。IFRS数値を除外 |
| Applied Materials | 2021.10〜2025.10 | 2023年10-Kと2025年通期発表、連結GAAP |
| Lam Research | 2022.06〜2026.06 | 2024・2026年10-K、連結GAAP。千米ドル→百万米ドル |
| KLA | 2022.06〜2026.06 | 2024・2026年10-K。営業利益の独立行がないため営業費用を控除して算出、式と入力値を保存 |
| 東京エレクトロン | 2022.03〜2026.03 | 公式Financial Highlights、日本基準、十億円の丸め値 |
| Micron | 2022.09〜2026.09 | 2024年10-Kと2026年通期発表、連結GAAP。2026期末は9月3日 |
| キオクシア | 2022.03〜2026.03 | FY2022説明資料p.3と2025・2026年英訳有報のOperating Results。IFRS、Non-GAAPを除外 |
| SK hynix | 2021.12〜2025.12 | 2021・2022・2024・2025年公式決算発表、K-IFRS。発表時点の暫定値を含む |
| Samsung | 2021.12〜2025.12 | 2022年4Q資料p.4、2024・2025年4Q資料p.7。DS部門、事業間売上あり、監査前の丸め値 |
| NVIDIA | 2022.01〜2026.01 | 2024・2026年度10-K、連結GAAP |
| Intel | 2021.12〜2025.12 | 2023・2025年10-K、連結GAAP。事業構成変更に注意 |

全60期の売上高・営業利益について原資料の該当行または算出入力を記録。KLAの営業利益は売上高−売上原価−研究開発費−販売管理費−減損費用で、支払利息・その他損益を含めない。会社が直接開示した営業利益と誤認させず「算出」と式を表示する。PDFはURLのpage指定と該当箇所を保持する。今回、Samsungの大容量有報は取得できず、取得できた公式の決算説明PDFを使用した。各資料の監査前・暫定・丸めの条件も画面に残す。独立した第三者レビュー・実ブラウザ確認は未実施。

### 通期公表・訂正時の更新

1. 対象企業の公式IR、監査済み年報・有報・10-K/20-Fを確認し、最新公表済み通期と掲載最終期を照合する。決算速報しか取得できない場合はその条件を記す。
2. 数値の対象期間、範囲、基準、単位と数値ごとのURL・箇所を確認。公式の比較可能な修正値があれば、修正された過年度も出典付きで更新する。異なる基準の値やNon-GAAPへ置換しない。
3. 新しい通期を加え最古期を外し各5期を維持する。未取得・未公表は理由付き状態で保持し、推測値・ゼロで埋めない。範囲変更に比較可能な修正値がなければ`breakBefore`に理由を書き、指数と線の接続を止める。
4. 訂正前JSONと変更理由・原資料を`.private/earnings-history-revisions/`へ保存してから対象企業を更新する。実際の確認日を企業の`checkedAt`へ、データ・内容を変更した日を全体`updatedAt`へ記録する。確認日だけの更新を内容更新と混同しない。
5. `npm run earnings:history:check`で期間・出典・算出根拠・欠測状態を検証。型変更時は`npm run typecheck`を最大1回、必要な対象テストと差分・公開禁止情報を確認する。検証失敗時は公開データを訂正前へ戻して原因を報告する。

この年次データは日次タスクの固定6ファイルに含まれず、日次のcommit/push対象を拡張しない。新しいAPI契約・自動スケジュール・DB・閲覧時取得は追加しない。今回の変更のcommit/pushはユーザーが行う。
