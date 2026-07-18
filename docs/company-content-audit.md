# 企業ページ公開品質監査

最終確認日: 2026-07-13

この文書は監査時点のスナップショットです。現在の公開判定は `src/data/companies.ts` の `careerInfo` と、企業詳細・sitemap の実装を正本とします。企業データを追加した時は、件数、分類、最終確認日を同じ変更で更新します。

## 分類基準

- 個別キャリア情報あり: `careerInfo` に企業別の職種、近い経験、伸ばすスキル、半年・1年の準備、出典、最終更新日がある
- 汎用文のみ: 企業概要と短い `careerSummary` はあるが、キャリア準備ページでは共通のフォールバック文を表示する
- 公開保留: データ欠損などにより企業詳細ページ自体を公開できない

この分類は、企業の採用状況や転職難易度を評価するものではなく、Manufacturing Compass 内のコンテンツ完成度を示す。

## 監査結果

| 分類 | 企業数 | 公開上の扱い |
| --- | ---: | --- |
| 個別キャリア情報あり | 10 | 公開継続 |
| 汎用文のみ | 27 | 個別情報を追加するまで `noindex` とし、sitemapから除外 |
| 公開保留 | 0 | 現時点では該当なし |

### 個別キャリア情報あり

- 台湾積体電路製造（TSMC）
- マイクロン・テクノロジー
- 東京エレクトロン
- スカイワークス・ソリューションズ
- ルネサス エレクトロニクス
- キオクシア
- SCREENセミコンダクターソリューションズ
- アドバンテスト
- ソシオネクスト
- ローム

### 汎用文のみ

- NVIDIA
- AMD
- ブロードコム
- サムスン電子
- SK hynix
- インテル
- GlobalFoundries
- アプライド マテリアルズ
- ラムリサーチ
- ASML
- KLA
- テラダイン
- インフィニオン テクノロジーズ
- STマイクロエレクトロニクス
- NXPセミコンダクターズ
- オンセミ
- クアルコム
- マーベル・テクノロジー
- Qorvo
- アナログ・デバイセズ
- テキサス・インスツルメンツ
- ディスコ
- レーザーテック
- 日立ハイテク
- ニコン
- キヤノン
- SUMCO

### 公開保留

該当なし。

## 優先10社の個別確認

確認日: 2026-07-13

| 企業 | 確認した公式採用情報 | 確認した主な内容 |
| --- | --- | --- |
| TSMC / JASM | [JASM open positions](https://ro.careers.tsmc.com/job/Kumamoto-JASM-Open-Position-for-Semi-recent-Graduates-43/1358851666/) | プロセス、設備、インテグレーション、歩留まり、製造、ファシリティなど |
| Micron Technology | [Hiroshima Process & Equipment Engineer](https://careers.micron.com/careers/job/38677515) | プロセス・設備、トラブル対応、歩留まり・品質・生産性改善 |
| 東京エレクトロン | [職種一覧](https://tel-special.com/job/) | メカ、エレキ、ソフト、プロセス、フィールドエンジニアなど |
| Skyworks Solutions | [Career categories](https://careers.skyworksinc.com/viewalljobs/?locale=ja_JP) | エンジニアリング、品質、製造、技術営業・マーケティングなど |
| ルネサス エレクトロニクス | [Engineering roles](https://jobs.renesas.com/engineering-roles) | システム、アプリケーション、FAE、品質、組み込み・アナログなど |
| キオクシア | [技術系新卒採用情報](https://graduates-jp.kioxia.com/recruit/index.html) | デバイス、プロセス・パッケージ、回路・ソフト、評価解析・品質など |
| SCREEN | [採用FAQ](https://www.screen.co.jp/recruit/fresh/recruit/faq.html)・[フィールドサービス職](https://www.screen.co.jp/sesv/recruitment/career) | 機械・電気・情報・化学等の装置開発、保守・立ち上げ、顧客対応 |
| アドバンテスト | [職種一覧](https://www2.advantest.com/external/careers/work/work.html) | 電気・電子、機械、ソフト、SE、FSE、品質保証など |
| ソシオネクスト | [キャリア採用](https://www.socionext.com/jp/recruit/career/) | SoC・IP開発、テスト、デバイス評価、プロジェクト推進など |
| ローム | [採用職種](https://micro.rohm.com/jp/employment/recruit_newg.html) | 商品・技術開発、生産技術、品質保証・品質管理など |

「近い経験」「半年の準備」「1年の準備」は、上記の職種・業務・必要経験をもとにManufacturing Compassが整理した編集上の提案であり、各社が公式に推奨する準備内容ではない。

## 確認した実装

- 企業詳細ページは `getCareerInfo(company.id)` の有無で個別情報と「公開情報を確認しながら準備ポイントを整理中です。」を切り替える
- キャリア準備ページは `careerInfo` がない場合に全社共通の `fallbackActions` を表示する
- 全37社に企業概要、情報ソースURL、最終更新日がある
- 優先10社は職種を確認できる公式採用情報を追加し、最終更新日を2026-07-13に更新した

## 次の対応

汎用文のみの27社は、優先企業から個別キャリア情報を追加する。それまでの間、企業詳細ページとキャリア準備ページに `noindex, follow` を設定し、sitemapには個別キャリア情報がある10社だけを含める。企業一覧や業界地図からの閲覧は維持する。
