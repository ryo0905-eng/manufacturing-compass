# ランキングから気になる2社の違いを調べる

実装日：2026-09-23。既存の公開記事に組み込み済み。本番反映・GA4受信は未確認。

## 目的と入口

日本語 `/guides/semiconductor-market-cap-ranking` の検索流入を、事業・役割の理解と企業研究へつなぐ。世界TOP30の表の前に比較欄を配置し、世界・日本の表から同じ2社選択へ追加する。ランキング表と記事本文はServer Componentsの出力を維持し、Client Providerへchildrenとして渡す。新しい比較ページや企業ペア別SEOページは作らない。

最初は未選択。例はNVIDIA/TSMCと東京エレクトロン/アドバンテスト。「人気」やおすすめ順位とは表現しない。例の選択は2社をセットして比較欄へ移動する。表からは最大2社、同一企業を重複選択せず、3社目では入れ替えを行わず解除を案内する。世界・日本の両表で選択状態を共用する。

画面下の選択バーで現在の企業・解除・「違いを見る」を提供する。比較結果を開いたらバーを隠し、選択変更や3社目の案内時に再表示する。比較欄内にも解除操作を残す。見出しへスクロールとフォーカスを移動する。スマホでは項目ごとにA/Bを縦に並べる。

## データと比較項目

`semiconductor-market-cap.ts` に順位・表示名と独立した固定idを付与した。38社をIDで一意化し、比較欄でも同じデータを参照する。今回の変更では掲載数値・基準日・取得日を変更していない（2026-09-06基準）。今後のデータ更新でもIDを維持する。

比較は企業・国／地域、分類と短い一般説明、主な事業、時価総額・世界順位・該当する日本TOP10の国内順位、企業詳細・地図入口。分類説明は既存 `industryMapZones` を参照し、企業の事業説明とは区別する。分類から競合・取引関係を推定しない。総合企業の値は企業全体であり、順位は企業の優劣・転職先の評価ではないことを表示する。

企業詳細は既存companySlugで対応付ける。地図の公開実装は `IndustryAtlas`。その8領域に実在する企業IDだけ企業指定リンクを出す。詳細ページ未収録のArm/Synopsys/ASEは既存の地図プロフィールへ明示的に対応付ける。CXMTなど地図にも未収録の会社には企業指定リンクを作らない。文字列の類似照合や外部APIは使用しない。

## 共有・地図への移動

比較共有は `#compare=nvidia,tsmc` のように固定ID2個を保持する。未知ID・重複・個数不正・同じパラメータの重複を拒否し、通常の未選択状態と短い案内へ戻す。通常の見出しアンカーはそのまま扱う。選択を編集したら旧比較フラグメントを削除する。canonical・sitemapは既存記事URLのまま。

共有リンクは閲覧時点の掲載データを表示し、過去の数値を固定保存しない。コピー失敗時は手動コピー欄を表示する。コピー処理中の連打と、選択変更後に古いコピー結果が現在の結果へ反映されることを防ぐ。保存・アカウント・localStorageは追加しない。

地図は `#company=nvidia` を受け付け、公開地図内の企業だけ復元する。検索・日本企業・国内拠点の絞り込みを解除し、指定カードを強調して詳細パネルを開く。Escapeで閉じると元カードのボタンへ戻る。通常の領域アンカーと検索・フィルターは維持する。存在しない企業は詳細を開かず案内する。

## 計測・観測

追加イベントは `ranking_company_compare` の1種。

| action | 発火条件 |
| --- | --- |
| entry_view | 比較入口の見出しが実際に露出。マウント中1回 |
| selection_start | 表で未選択から選び始めた時、または例を選んだ時。選択元ごとに1回 |
| result_view | 比較結果見出しが実際に露出。選択元と順序付きペアごとに1回 |
| related_click | 比較欄から企業詳細・業界地図・日本の仕事内容へクリック |
| copy_success | クリップボード書き込み成功時だけ。手動コピー欄表示は含めない |

属性はaction、source=world/japan/example/shared_link、company_a/company_b、destination=company/industry_map/japan_workに限定。entry_viewは選択前なのでsourceなし。表を跨いだ選択のsourceは1社目を選んだ表。共有復元はselection_startを送らず、result_viewのshared_linkで識別する。企業IDは既知のカタログから抽出し、URL全体・自由入力は送らない。コピー成功はSNS投稿成功ではない。

## 日本の仕事への接続（2026-09-26）

主な事業の次に「日本で確認できた仕事」を追加。ランキングと日本の仕事データの共通固定企業IDで結び、公開済み企業の公開済み業務を定義順に最大2件表示する。職種名／事業機能の区別、その業務の勤務地記述、未確認事項、確認日を併記し、会社所在地から勤務地を補完しない。既存の再確認期限判定を使用し、現在の募集状況を示さないことを明記する。未収録時は「日本での仕事内容は、この比較では未掲載です」とする。

「仕事内容と根拠を見る」は `/companies/global-japan#evidence-企業ID` に移動する。遷移先は公開業務を持つ公開企業のみ受け付け、初回・hashchange・同じアンカーの再クリックで該当detailsを開き、スクロールしてsummaryへフォーカスする。無効IDや他のアンカーは変更しない。フィルター状態やランキングの比較共有URLは変更しない。

リンクの計測は既存related_clickにdestination=japan_workを追加する。GA4設定の変更なし。本番反映日を起点に28日間、result_viewとjapan_workへのrelated_clickをセッション内で重複排除して観測する。少数データで収益効果を断定しない。本番反映・イベント受信は未確認。

検証（2026-09-26）：`node tests/unit/ranking-company-compare.cjs` 成功。公開2社・片方のみ公開・両社未掲載、pending企業、draft/withdrawn業務の除外、共通企業ID整合、業務データの保持、期限当日／超過、japan_workのイベント属性を確認。既存の選択・共有URL・SSRの検証も成功。`npm run typecheck` は1回実行して成功、`git diff --check` 成功。公開禁止語の検索で該当なし。アンカーの初回・変更・同一リンク再クリック、無効IDの処理は静的確認のみ。build・devサーバー・ブラウザ検証は今回未実施。commit・pushなし。

地図復元は既存 `industry_map_detail_view` のentry_point=shared_linkを使い、同一マウントの同じ企業は重複送信しない。GA4で新イベントの属性を分析する際は必要なイベントスコープのカスタムディメンションを登録する。企業の組み合わせは高カーディナリティになり得るため、まず操作・選択元・遷移先種別を集計する。

本番反映日から14日、入口露出→選択開始→比較露出→関連ページ移動をセッション単位で見る。共有リンク流入は別に集計する。イベント件数の単純な比を人数の転換率にしない。流入が少なければ需要未検証。比較後の企業詳細・地図利用が確認できた後に、他ランキングへの横展開や企業研究資料の出力を検討する。初版の課金は行わない。

## Threads素材

運営者が投稿する。画像：`public/images/ranking-company-comparison.png`（実装のNVIDIA/TSMC比較画面から生成、基準日付き）。

投稿案：

> NVIDIAとTSMCは、同じ半導体ランキングにいても何が違う？
>
> NVIDIAは製品企画・設計を中心に担うファブレス。TSMCは顧客が設計した半導体を製造するファウンドリ。
>
> ランキングで気になった2社を選ぶと、事業・役割・規模を並べて、業界地図まで調べられるようにしました。次に比べてみたい会社はありますか？

URL：`https://mfg-compass.com/guides/semiconductor-market-cap-ranking?utm_source=threads&utm_medium=social&utm_campaign=ranking_company_compare#compare=nvidia,tsmc`。

## 検証（2026-09-23）

- `npm run typecheck`：1回、成功。build・lintは未実施。
- 関連単体テストは各1回。`industry-atlas-data.cjs` と `ranking-time-machine.cjs` は成功。
- `ranking-company-compare.cjs`：ID・データ整合・選択制限・URL・地図対応・表のSSR・固定イベント属性の検証を通過後、記事全体SSRでusePathnameのテストモック不足により失敗。モックを追加済み、再実行なし。
- `article-improvements.cjs`：テスト側が新Providerをnullに置き換え、記事の子要素も消したためSSRリンク検証に失敗。Providerのchildrenを保持するモックへ修正済み、再実行なし。上記2本を成功とは記録しない。
- `tests/browser/ranking-company-compare.cjs`：実Chromiumで1回実行し成功。PC1280pxとスマホ相当390px、世界・日本間共有、3社目、解除、Enter、共有URL復元、コピー成功／失敗、地図遷移、カード強調、Escape、不正URL、未収録企業を確認。ページのJSエラーなし。
- その後、結果表示中に選択バーを隠す調整を行い、実Chromiumで「結果表示中は非表示、解除後に再表示」を個別確認。紹介画像もこの状態から生成。ブラウザテストの解除対象は画面内比較欄へ更新したが、全体の再実行はしていない。
- BrowserActの実Chromeでも、NVIDIAのカード選択と詳細パネル表示を確認。390px表示の比較欄は文書幅390pxで横はみ出しなし。比較画像・スマホ画面を目視確認。開発サーバーと検証用セッションは停止済み。
- 未確認：本番反映・GA4受信、実機スマホ、Safari/Firefox。ブラウザテストでのClipboard成功はAPI差し替えを使用し、実OSクリップボードへの権限付与は検証していない。

## 変更ファイルとコマンド

新規：`src/components/RankingCompanyCompare.tsx`、同CSS Module、`src/lib/ranking-company-compare.ts`、`src/lib/industry-map-entry.ts`、比較画像、新規単体テスト・ブラウザテスト、本仕様。

既存更新：日本語記事ページ、MarketCapRankingTable、IndustryAtlas、globals.css、半導体時価総額データのID、article-improvementsテストのモック、PRD・architecture・conversion-architecture・documentation-map・TASKS。

```sh
node tests/unit/ranking-company-compare.cjs
node tests/unit/industry-atlas-data.cjs
node tests/unit/ranking-time-machine.cjs
node tests/unit/article-improvements.cjs
npm run typecheck
npm run dev -- --hostname 127.0.0.1 --port 3100
node tests/browser/ranking-company-compare.cjs
git diff --check
```

推奨コミット：`feat: compare semiconductor companies from ranking tables`。commit/pushは未実施。
