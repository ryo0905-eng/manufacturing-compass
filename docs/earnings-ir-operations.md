# Chip Pulse 決算・IR：初期データと更新手順

最終確認日: 2026-10-03

## 対象と資料

装置メーカーの事業領域が比較的近く、既存の企業ID・装置売上記事・業界地図につながる5社を対象とする。各社の最新発表を並べるため、期間・会計基準・通貨は揃っていない。画面では同一期間の比較と呼ばない。

| 企業ID | 掲載期 | 主資料 | 補助資料 |
| --- | --- | --- | --- |
| `asml` | 2026年Q2 | [ASML Q2 release](https://investor.asml.com/news-releases/news-release-details/q2-2026-financial-results) | [ASML US GAAP財務諸表（SEC提出）](https://www.sec.gov/Archives/edgar/data/937966/000162828026048235/financialstatementsusgaa.htm) |
| `applied-materials` | FY2026 Q3 | [Applied Materials Q3 release](https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-announces-third-quarter-2026-results) | — |
| `lam-research` | 2026年6月終了四半期 | [Lam Research release](https://investor.lamresearch.com/2026-07-29-Lam-Research-Corporation-Reports-Financial-Results-for-the-Quarter-Ended-June-28,-2026) | — |
| `kla` | FY2026 Q4 | [KLA Q4 release](https://ir.kla.com/news-events/press-releases/detail/518/kla-corporation-reports-fiscal-2026-fourth-quarter-and-full) | — |
| `tokyo-electron` | 2027年3月期Q1 | [東京エレクトロン決算短信](https://www.tel.com/ir/library/report/i242su0000000goz-att/fy27q1tanshin-e.pdf) | [説明資料](https://www.tel.com/ir/library/report/i242su0000000goz-att/fy27q1presentations-e.pdf) |

数値の単位は元資料に合わせて百万通貨単位で保存する。東京エレクトロンの第1四半期は3か月の累計表示であり、通期累計と区別して単四半期として掲載する。ASMLの前年同期比、Lam ResearchとKLAの売上高前年同期比は、同じ資料中の2期の値から計算し、式をデータへ記録した。KLAの営業利益は今回確認した発表資料から確定できず「未取得」。東京エレクトロンの通期予想は当該資料では「未公表」。

## 決算シーズンの更新

1. `npm run chip-pulse:refresh` が運用されている環境では、既存SEC収集に含まれる米国3社とASMLの提出メタデータを発見用に使う。`npm run earnings:check` は公開版より新しい候補があれば表示する。東京エレクトロンは[公式IR](https://www.tel.com/ir/calendar/)を手動で確認する。SECメタデータは決算本文を読んだ証拠にはならない。
2. 新しい決算について、公式資料の発表日、対象期間、連結実績、会社見通し、事業別情報、訂正履歴を確認する。各数値・文章の `source.documentId` と `locator` を記録し、PDFではページ番号を付ける。前年比は同じ期間・同じ指標で計算する。
3. `src/data/earnings-snapshot.json` を候補ファイルとして丸ごと複製・編集する。変更した企業の `version` を上げ、`checkedAt` と全体の `updatedAt` を実際の確認日に更新する。予想修正は同じ対象期間の前回予想が照合できた場合だけ方向を付ける。業界共通テーマは2社以上の資料が裏付ける場合だけ追加する。
4. `node scripts/earnings-publish.cjs --candidate /path/to/candidate.json` を実行する。検証後に直前の版を `.private/earnings-snapshots/` へ保存し、公開JSONを原子的に入れ替える。候補JSONの形式・出典参照・版・欠落に問題があれば、公開版は変更しない。訂正は旧版をアーカイブに保持して新しい版として公開する。
5. `npm run earnings:check`、変更対象の型・画面・リンクの確認を行う。公開される本文・メタデータは `.private/content-redaction-dictionary.md` と照合する。公開設定と本番反映は別で、commit・pushは明示依頼時のみエージェントが行う。

既存のSEC収集は提出候補の発見まで。決算資料の取得、PDFの数値抽出、主張の要約、ページ照合、訂正判定、東京エレクトロンの更新は手動。閲覧時の外部API・AI処理は行わない。新規契約や環境変数は不要。
