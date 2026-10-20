# Architecture

最終更新日: 2026-10-20

## 方針

株式市場ウォッチ（2026-10-20）：`stock-market.ts`の静的銘柄対応表と`lib/stock-market.ts`の企業・決算・記事投影をServer Componentで合成。`/semiconductor-watch/stocks`はSSRの説明・企業リンク・SEOと、限定したClient Componentの企業選択・hash復元・外部埋め込みを組み合わせる。Mini Chart・Market Dataは公式Web Component、Symbol Overviewは銘柄ごとに破棄する公式iframeスクリプト。価格は閲覧時にブラウザがTradingViewから表示し、自社API・DB・保存・集計は追加しない。共通WatchNavigationと既存企業／決算の導線を再利用。商用条件・実表示未確認のためProductionは`STOCK_MARKET_ENABLED`未設定／falseで404・非掲載、developmentはnoindexプレビュー。trueと再ビルドでページ・導線・sitemapを揃えて有効化する。[仕様と公開条件](./stock-market-spec.md)。

Manufacturing Compass は、Next.js App Router 上で動く静的データ中心の実務・コンテンツ・キャリア支援サービスです。

Career Compass、インタラクティブ実務学習ツール、業界地図の操作部分だけを Client Component で動かし、企業、ガイド、ランキング、SEO メタデータは Server Components と静的データを基本にします。中心機能はログイン、個人情報保存、外部データベース、AI API に依存しません。Jev実験ページのみ、下記の限定した外部APIを使用します。実務ツールの入力と計算はブラウザ内で完結し、生データを外部へ送信しません。

## 技術構成

決算・IRは `src/data/earnings-snapshot.json` の12社を `src/lib/earnings.ts` から読む。設計・受託製造・IDMを分類に追加し、TWDを通貨として保持する。企業一覧を初期HTMLへ出力し、絞り込み・hash履歴だけClient Componentで処理する。比較は装置・メモリの2群。原資料の確認日と内容更新日を分け、数値の出典・計算根拠を保持する。決算候補の検証、非公開アーカイブ、原子的更新は既存publisherを使う。

業界ウォッチ（2026-10-18）：`watch.ts`は企業ID・最新四半期・原資料・確認状態・予定を合成し、ニュースの重複を除く。`watch-explorer.ts`はテーマ・企業・2指標・5／10／20年・売上高側の並び順をhashで復元し、通期値で安定降順に並べる。無指定はrevenue／10年／売上高順、sort=growthは売上前年比順。利益率時は利益率順、売上高へ戻るとsortを復元する。最新四半期・ニュースの順序は変えない。`watch-exchange-rates.json`は為替基準日・公表日・確認日・原値と方向・FRB出典を静的に保持し、`watch-financials.ts`が円へのクロスレートを導出する。全期間を固定レートで円換算し、原通貨から前年比、利益率、欠測理由と比較可能な線分を投影する。縦軸は全12社・選択期間で共通、金額は0始まりで全有効値を含み、テーマで変えない。`WatchExplorer`はロゴ付きカード・SSR数値表・最新四半期details・ニュースを出力し、指標・期間・テーマ・並び順を操作する。`WatchFinancialCard`は企業名／主数値・末尾のMediaLinkを通常文書遷移にして年次へ期間を引き継ぎ、グラフとは分離する。一覧の常設注記はDS部門・算出値・比較に注意・短い掲載期数だけに絞り、通常の連結全体や欠測・算出不可の長い理由は出力しない。詳細リンクの上余白は固定8pxとし、掲載期間・短い注記に続ける。`WatchFinancialChart`は48px高の棒／折れ線・HTML目盛り・単位・比較の境界を表示し、ホバー／左右キー／Home／End・Escape／blurで期の選択とカード内表示を制御する。`watchPlot`は描画サイズを受け取り、一覧と拡大の座標計算を共有。`WatchFinancialHistory`はグラフのクリック／タップ・拡大ボタンから選択期を引き継いで`WatchFinancialDialog`を開く。ネイティブdialogのモーダル動作、背景クリック判定、スクロール制御とフォーカス復帰を担当する。`WatchFinancialComboChart`は同じ選択期間の売上高（左軸・青い棒）と利益率（右軸・オレンジの線）を重ね、既存の投影・線分・軸計算を企業単独に適用する。企業ごとの目盛り・凡例・為替基準日・範囲・欠測・算出値を表示し、期選択はホバー／タップ／左右キー／Home／End、Escapeはdialogへ渡す。dialogの「比較上の注意」は同じ静的履歴と選択期間から対象範囲、比較の境界の対象期と理由、直近期の欠測・前年比算出不可理由、算出値の有無・掲載範囲・確認日を常設表示する。拡大状態はURLへ保存せず、期間・指標変更によるkey更新時に破棄する。metric／yearsをkeyとして数値表示をリセットし、表には原通貨額・円換算額・前年実績・前年比・理由・範囲を残す。専用CSS Moduleは6／4／3／2列・最小180px・折返し・ロゴ48×20pxを担当する。旧operating_income指定は売上高、旧ニュースアンカーはdetails内まで復元。企業詳細・比較の既存グラフ・原通貨データ・日次固定6ファイルは維持し、新API・DB・閲覧時処理・依存は追加しない。詳細は`docs/semiconductor-watch-editorial.md`・`docs/earnings-ir-operations.md`を参照。


年次企業分析（2026-10-18）：`earnings-history.json`は最新四半期と独立した12社・最大20期の通期実績。`earnings-history.ts`が読み、`earnings-history-math.ts`が共通期間型`5 | 10 | 20`・不正値の10年への復元・期間抽出・利益率・最新比較可能区間基準の指数・線分を提供する。期間抽出は最新期末を終点に日付で絞り、上限期数で切るため欠測を古い期で補わない。SVGは実際の期末日の横軸、企業別棒グラフの目盛りは間引く。図・対応数値表・出典は初期HTMLに出力する。`AnnualCompanyExplorer`と`AnnualCompare`が期間操作を持ち、共通`AnnualPeriodControl/useAnnualYears`がクエリのpushState・popstate復元を担当。初期表示と復元は操作イベントを送らない。watchはhashの`years`、企業別・比較は同名クエリで期間を引き継ぐ。既存企業指定・テーマ・指標hash・旧ニュースアンカー・`#annual-history`を維持する。企業別・比較のcanonicalは基底URL、期間付き企業別と条件付き比較はnoindex/follow。比較の`group/company`は既知IDで検証する。背景注記は型付きの対象期・本文・会社説明／編集上の解釈・URLと箇所・確認日を持ち、企業別で最大3件表示。`earnings:history:check`は12社・各1〜20期・期間順序・原資料・算出根拠・欠測理由・背景注記を検証する。新API・依存・DBは追加せず、日次publisherの対象を拡張しない。更新手順は`docs/earnings-ir-operations.md`、範囲と照合記録は`docs/earnings-long-history-audit.md`。

旧構成の記録（2026-10-04、現行は上記）：`src/lib/watch.ts` がニュースJSON・決算JSON・工場データをIDで結び、`watch-editorial.json` の確認日・版・背景・探索先と合成する。トップ・詳細・図はServer Componentを基本に、`NewsFeed` のテーマ選択と `MediaLinks` の計測だけをクライアントで動かす。`#theme=…` の履歴復元と旧 `#signal-{id}` を保持。編集公開は `scripts/chip-pulse-editor-publish.cjs` で照合・前回版保存・原子的更新。日次収集は確認付き本文を保持し、元資料変更時は背景を無効化する。AI公開の承認はfalseのまま。現行UI・編集仕様は `docs/semiconductor-watch-editorial.md`、既存AI台帳と処理境界は `docs/chip-pulse-media.md`。下記の従来ダッシュボード部品は互換用に保持する。

- Chip Pulse：`chip-pulse.ts` が企業ID、原文URL付き編集ニュース、事実要約、編集部の見方、影響工程、確認時刻を公開用の静的スナップショットとして保持し、`lib/chip-pulse.ts` が複合フィルター、最終正常更新時刻を基準とした24時間・30日・今後7日間の表示範囲、テーマ件数、企業別公式更新件数、依存なしの矩形分割を担当する。重要3件のサムネイルは先頭工程からローカル描画し、任意の公式画像は確認済みローカルファイルと出典だけを許可する。`chip-pulse-sources.json` はSECのCIK・対象Form・利用条件・候補上限を持つ収集台帳、`scripts/chip-pulse-update.cjs` はSEC提出候補を `.private` の最終試行、current、時刻別不変JSONへ出力する。`scripts/chip-pulse-review.cjs` は公開済みURL・別URL対応・定型除外規則で候補を自動分類し、`scripts/chip-pulse-publish.cjs` は全取得成功時だけ新しい公式メタデータを更新し、失敗時は前回公開データを保持したまま試行状態を記録する。ダッシュボードは編集ニュース、未編集の公式メタデータ、市場規模データを分けて表示する。`/semiconductor-watch` のServer Componentがmetadata・構造化データ・鮮度表示を出力し、Client Componentが選択状態だけをブラウザ内で管理する。時価総額と工場案件は既存の基準日・出典付き静的データを参照する。外部DB、閲覧時API、閲覧時AI、URL状態は追加しない。次の取得順・スナップショット境界・情報源判断は `docs/chip-pulse-data-plan.md` を参照する。

- 工場プロジェクト比較：`factory-projects.ts` の静的データを記事一覧とClient Componentで共用。`factory-project-comparison.ts` が2件のID検証・出典付きコピー文を担当。GuideBlockにfactory-project-comparisonを追加し、既存記事へ組み込む。独立URL・保存・外部APIなし。[仕様](./factory-project-comparison-spec.md)。

- 2026-09-23：平均の測定計画：`measurement-planner.ts` で文言・計算をdata/libに分離し、`MeasurementPlanner` が入力・明示計算・3案比較・コピーを担当。共通計測対象へ追加。SNS画像は計算を再利用する生成スクリプトで作成。仕様は `docs/measurement-planner-spec.md`。

- Cpk・工程比較の保存再開：`tool-workspace.ts` がv1形式の生成・検証と許可項目の抽出を行い、`ToolWorkspaceFile` が端末ダウンロード・読込・置き換え確認を共通化する。UTF-8で2 MiB上限、日英共通、結果・生のエラー・サンプルIDは保存しない。読込失敗とキャンセルは親の入力を変更せず、確定時だけ入力を置き換えて結果・コピー・エラーを破棄する。再計算は明示操作。読込中と工程比較の出力中はファイル操作を無効にする。

- `PracticalToolNextSteps`：Cpk・工程比較の結果欄で日英の関連ツールを案内する共通部品。英語ページの公開ゲートを参照し、リンクは別タブ・データ転送なし。クリックのみ固定カテゴリで計測する。

- `CareerFeedback`：Career Compassの「今日やること」直後に置く任意の1タップ質問。回答後の理由選択も任意。状態はコンポーネント内だけで保持し、既存Analyticsへ固定カテゴリだけを送る。新規の保存先や外部サービスは追加しない。

- ツール一覧：`learning-tools.ts` の `toolUsage` が全ToolIdの用途・入力方法を保持する。`ToolsLearningLab` は初期SSRで全カードを表示し、同じ用途フィルターをロードマップとカードへ適用。`mc-tools-opened-v1` は一覧から開いたIDのブラウザ内履歴として継続し、`readOpenedTools` で配列型、現行公開ID、重複を検証する。完了・実利用履歴ではない。

- 実務ツール共通計測：`usePracticalToolJourney` をCpk・工程比較の日英UIから利用。固定カテゴリのみで入力部露出、開始、明示サンプル、計算試行、失敗、操作後の結果露出をマウント中各1回計測する。初期サンプルは成果に数えず、結果破棄時は監視も解除。既存イベントは詳細操作用に維持。定義は `docs/conversion-architecture.md` に記載。

### ランキング・タイムマシン

- 2026-10-17（日本18社）：`semiconductor-market-cap.ts`の日本追加データへ8社を追加し、10社のslice制限を撤去。世界TOP30内の日本2社と追加16社から国内順位1〜18を生成する。追加8社の数値出典は同カテゴリの2ページ目、公式事業情報の出典・確認日は記事sourcesへ保持。比較カタログは固定IDで46社に一意化し、材料・フォトマスクと半導体商社の役割説明に対応。既存企業詳細があるソシオネクストだけリンクを追加し、商社を地図の製造領域へ割り当てない。公開型・API・保存先・履歴データは変更しない。

- 2026-10-17（時価総額記事の冒頭）：対象記事の表示用見出し・比較範囲・短い結論を既存記事モジュールの専用設定へ分離。結論の1位企業はランキングデータ、基準日はsemiconductorMarketCapMeta、更新日・執筆者はGuideArticleを参照する。記事ページは対象記事だけで検索用guide.titleと同じ全文をh1にSSRし、記事名・年月・比較範囲を文字サイズと配置で分ける。年月はguide.titleから参照し、意味のまとまりで折り返す。短い結論と情報欄は維持する。検索用guide.title・description・構造化データ・共通型・他記事の表示は維持する。

- 2026-10-17（時価総額ランキングの統合表示）：`semiconductor-market-cap-reference.ts`が順位配列とは独立して参考対象の値・基準日・通貨・確認日・出典・確認状態を保持する。`market-cap-reference.ts`は確認済み、同じ提供元・基準日・通貨、有限の正数を満たす場合だけ参考値を返す。ランキングとトヨタは2026-10-16基準・10-17確認、トヨタはverified・229.21B USD。`MarketCapRankingTable`は対象記事だけで独立グラフを表の金額欄の棒へ統合し、世界30社・日本18社の情報と比較ボタンをSSRする。トヨタは表示時だけ金額の降順にtbodyへ一度挿入し、同額の半導体企業の後ろに置く。元の順位配列・企業の順位は変更しない。参考行は順位欄を空欄にして読み上げでは順位対象外と伝え、企業名横の「参考」と淡い背景で区別し、比較ボタンは付けない。世界31行・日本19行となり、倍率・金額を数値から計算する。棒は0起点で一覧ごとの最大値（確認済み参考企業を含む）に比例。対象記事の表は順位・企業名・時価総額・比較の4列に整理する。企業名セル内でロゴ・企業名、異なる場合の英文社名、国・地域／分類／ティッカー、主な事業をSSRし、折りたたみなしで常時表示する。短い属性は横並びで折り返し、主な事業は省略せず全文を表示する。項目ラベルは読み上げ用に保持し、共有の企業名コンポーネントは変更しない。記事欄を基準とするcontainer queryで600px未満を企業概要→金額／比較の縦配置にし、列見出しと表のアクセシビリティを保持する。日本一覧の過去年末比較リンクは既存article_internal_clickを使う。他記事のMetricBarChart・年収表示は維持し、新API・依存・保存先は追加しない。

- 2026-10-17（ホームのコンパクト化）：4記事へのHomeLinkをセクション見出し横へ移し、ホームプレビューを全幅化。home専用CSSで960px以上は時間操作・追跡とチャートを左右配置し、グラフの順位・企業・棒・金額を1行にする。既存の全行計測で長い代替企業名と画面幅変更に追従する。960px未満は縦配置。比較範囲・出典・確認日を常設し、詳しい注意はnative detailsにSSRする。home以外の構造・計測、データ・状態管理は維持し、新API・依存・保存先は追加しない。

- 2026-10-17：Server Componentのトップに`RankingTimeMachinePreview variant="home"`を配置。入口は`src/data/home.ts`の`homeRankingLinks`へ集約する。プレビューの既定値articleは維持し、homeは固有ID・ホーム用計測・HomeLinkを使用する。RankingRaceChartのhome表示は非操作の上位5社、articleは上位10社、toolは既存の操作行。データ・年次計算・再生・画面外停止・reduced-motion対応を共用し、URLを読み書きせず専用ツールへ表示年を渡す。新API・依存・保存先は追加しない。

- 2026-10-15：`GuideBlock`の`ranking-time-machine-preview`を`GuideBlocks`から専用Client Componentへ接続する。既存の20社静的データ・`prepareRanking`・`reduceTimeline`・再生間隔・アニメーションを再利用し、4比較モードを組み立てるフル画面は読み込まない。記事内はURLを読み書きせず、表示年付きの既存専用URLへリンクする。初期チャート・出典・NVIDIA追跡をSSRし、ロゴはlazy、失敗時は企業名へ戻す。`RankingRaceChart`のarticle表示は非操作行・固有見出し、`TimelineControls`は固有ID・説明を受け取り、専用画面の既定値は維持する。画面外・背景タブで停止し、自動再開しない。登録・DB・外部API・保存機能は追加しない。

- 日本モード（2026-09-23追加）は `ranking-japan.ts` の9社144件と既存東京エレクトロン16件を合成。既存392件と3モードの対象は維持。`RankingMode`にjapanを追加し、共有ハッシュ・計測・停止/リセットは共通実装を使用する。
- `ranking-history.ts` は同じランキングから記事用の端点比較・年末逆転を計算。`RankingHistoryArticle` は日本の年別表と2社の線形SVG/16年表をServer Componentで出力。GuideBlockのranking-historyで既存記事テンプレートに接続する。新規2記事は既存registryからmetadata/canonical/Article/BreadcrumbList/sitemapへ反映する。
- 公開情報記事で未実施の人間確認を表示しないため、GuideArticle.reviewedByは任意、authorは編集部表記にも対応。今回2記事はOrganization著者で、人間の確認済み表記を付けない。既存記事の確認表記は維持。
- 日本企業の詳細リンクは公開済みのものだけ。SCREEN HDには事業会社のcompanySlugを設定しない。各社のbusinessSourceUrlに公式事業情報を保持し、ロゴ原画像と取得記録を保存する。

- `/tools/ranking-time-machine` のServer Componentが説明・出典・metadata・WebApplication/BreadcrumbListを提供。操作は専用Client ComponentsとCSS Moduleに分離し、新しいライブラリは使わない。
- `observeVisibleOnce` は画面内25%以上・前景タブでの露出を監視する。記事入口の `TrackedInternalLink` は指定時だけ露出を計測し、タイムマシンは操作部露出、初回操作、操作で状態が変わった後のチャート露出をそれぞれ計測する。初期表示や共有URLの復元を操作成果と扱わない。状態・重複防止はコンポーネント内のみで、個別ユーザーIDや保存を追加しない。
- チャートのロゴは企業マスターの `logoUrl` と `public/images/company-logos/` の静的PNGを使用。取得先・取得日は同ディレクトリのREADMEに記録する。チャートはロゴのみを表示し、`logoAspectRatio`（透明余白を除く図柄の縦横比）により、原画像を変形せず32px高・最大140px幅の枠へ収める。企業名はボタンの読み上げラベル・title、詳細・表に保持。画像なし・読み込み失敗時は文字の企業名を表示し、歴史名のAvagoにも文字を使う。
- `src/data/ranking-time-machine.ts` は既存20社・2010〜2025年の320件、`src/data/ranking-reference.ts` は比較6社・2014〜2025年の72件と各社出典・確認日を管理。元の320件は維持し、装置5社を重複保存しない。企業ページへのリンクは存在するものだけを使う。
- `src/lib/ranking-comparison.ts` が4モードの企業ID・期間・初期企業、年の補正、状態遷移、共有ハッシュの解析・生成を管理。対象データを抽出してから既存の厳格な検証へ渡す。全26社に2010年のデータを要求しない。モード切替は停止・補間なしとし、キー変更でチャートと時間操作を再生成して古いフレーム・入力確定状態を破棄する。
- CompanyTrackerは独立した企業追跡・共有パネルで選択した1社の年末確定値・圏外状態を表示。表・詳細と選択IDを共有し、自動スクロールを行わない。DOM順は操作→チャート→企業追跡・共有。960px以上はCSS Gridで操作・企業追跡を左、チャートを右に配置する。チャートの表示行数・高さ・圏外判定はmin(10,対象社数)。他業界企業はisReferenceで識別し、既存の青とwarningの茶系、凡例・表の分類を使用する。
- ComparisonShareが`#mode=global&year=2025&company=toyota`形式をコピーする。通常操作ではURLを変更せず、マウント後とhashchangeで比較用ハッシュだけを復元。通常アンカーは無視する。不正modeは半導体、年は期間内へ補正、不正企業はモード初期企業へ戻す。空companyは未選択として保持。コピー失敗時はreadOnly入力欄を表示。クライアント初期化前は半導体20社・2010年をSSRし、canonical・sitemapは既存1URL。
- 純粋な処理で欠損・重複・非正数を拒否し、同値は同順位（1,1,3）とする。スナップショットは年の昇順・連続を要求。丸め済み時価総額は十億米ドル単位。出典を混ぜず、為替換算・欠損補間は行わない。描画用の補間値は元データに保存しない。
- 初期2010年の表はSSR。3秒間隔のタイマーは停止・アンマウント時に破棄し、非表示タブでも停止する。年度変更時、表・詳細は確定値を反映。チャート専用の `useRankingAnimation` がrequestAnimationFrameで3秒間の線形補間を行い、数値・幅・軸を更新する。補間値の降順で順位を再計算し、位置・出入りはCSSで400ms遷移。最終年も補間が完了するまで再生状態を維持する。停止・年選択で確定値へ戻り、フレーム予約を破棄。動きを抑える設定の変更にも追従し、補間を止める。共通行高をResizeObserverで測り、名前の折り返しに対応。動きを抑える設定では遷移なし。
- GA4/Vercelへ既存の `ranking_timemachine_play/pause/year_change/company_click/related_click` と、新規 `ranking_timemachine_mode_change/share` を送る。全イベントにcomparison_mode・year・ranking_type=market_cap・data_kind=real、企業操作にcompany ID、リンクにdestination。モード変更にprevious_mode、共有にresult=copied/url_shownを追加。自動再生・自動停止・描画・URL復元ではイベントを送らない。
- CompaniesMarketCapの利用規約 https://companiesmarketcap.com/terms-of-service/ 第5項の編集目的・出典明記条項を参照（2026-09-22確認）。数値を伴う業界解説として構成し、データ販売・API・CSV配信は行わない。商用利用全般の許諾があるとは記録しない。
- 2026年途中の数値と既存ランキング記事の基準日データは別管理。Samsung等の複合企業、AVGO系列の2016年統合、現存20社を選定した範囲を公開説明に含める。

### AI外観検査の技術検証

`scripts/ai-visual-inspection/` はWebビルドから分離したPythonの生成・学習・評価環境。固定した依存版、学習データ構成、シードを使い、出力はGit管理外の `.cache/ai-visual-inspection/` に保存する。実験出力を公開ディレクトリへ自動コピーしない。

`src/lib/ai-visual-inspection/` はラベルを参照しない画素処理・連結領域と、真値を扱う評価処理を分離する。オフラインゲート通過後、Worker内のONNX Runtime Web 1.22.0推論と要求管理Clientを実装。静的Workerは `sync_web.cjs` で同じTypeScriptソースから生成し、モデルは `export_web.py` が固定ハッシュを確認して出力する。Node上の実WASM数値照合は通過。モデル出力の端点誤差を `2^-23` 以内に限り補正し、超過・非有限値は拒否する。実ブラウザの一周と390px縦配置は確認済み。スライダーのラベル修正後のキーボード・連続操作確認と、実機性能確認は未完了。Server Componentページと5段階の操作UIを `/tools/ai-visual-inspection` に追加し、2026-09-22のユーザー指示でindex可能・sitemap掲載へ切り替えた。教材の固定24枚は `export_lesson.py` で書き出し、真値をWorkerから分離する。[実装記録](./ai-visual-inspection-web-runtime.md)を参照。モデルとランタイムは同一サイトの静的配信、推論は端末内。入力・判定結果・学習状態は送信・永続保存しない。固定カテゴリの既存Analyticsのみ利用する。詳しくは [仕様](./ai-visual-inspection-spec.md)。

### 共通UI

ランキングの書籍導線は `BookAffiliateEntry` がページ内移動とフォーカスを担当し、`MoshimoBookLink` がローカル書籍データの紹介文と既存のもしも埋め込みを表示する。`src/lib/book-affiliates.ts` が生成された購入先URLの判別、表示準備・遅延・露出の監視と解除を担当する。発行済み広告データは維持し、状態・クリックは固定カテゴリの既存Analytics経由で送る。新しい保存先や閲覧時のサーバーAPIは追加しない。イベントと公開後の確認は `docs/conversion-architecture.md`、編集・広告方針は `docs/monetization.md` を参照する。

`src/styles/tokens.css` を日英共通の `globals.css` から読み込み、意味別の `--mc-*` トークンと既存CSS変数の互換エイリアスを一元管理する。`src/components/ui/Controls.tsx` は標準HTML属性を受け取る状態を持たない共通部品。Cpkの日英共通Client Componentsで先行利用し、配置は専用CSS Moduleへ分離する。操作・計算・計測は呼び出し側に残し、UIライブラリや新しいAPIへの依存は追加しない。部品の契約と移行ルールは `docs/design-system.md` を参照。

### 共通スタック

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Vercel
- Vercel Analytics
- 任意の GA4
- Playwright

## ルート

### 日英レイアウト

- 日本語ページは `src/app/(ja)`、英語ページは `src/app/(en)/en` に配置する。ルートグループ名はURLに含まれず、既存の日本語URL・API・robots・sitemapを維持する。
- 日英それぞれのルートレイアウトが `html lang`、メタデータ、ヘッダー・フッターを定義する。共通CSSと `SiteAnalytics` を利用し、各レイアウトで計測を1回だけ設置する。GA4の本番環境条件は従来どおり。
- 複数ルートレイアウト間の遷移はフルページ遷移になる。URLから言語を決め、Cookie・リクエストヘッダー・自動リダイレクトは使わない。
- 未登録URLは `global-not-found.tsx` で日英併記の404を返す。Next.js 16の `experimental.globalNotFound` を有効化する。各言語内の `notFound()` には言語別の404表示を持つ。本番のルーティングはVercelビルドで最終確認する。
- 英語記事は `src/content/guides/en` の独立レジストリに置き、既存 `GuideArticle` を拡張した翻訳情報で原文更新日・翻訳日・翻訳確認日を保持する。確認は実施者に沿って記録し、人間の確認とエージェントの確認を混同しない。原文更新日との差は対象テストで検出する。
- 英語の公開判定は `status: published`、空でない `publishedAt` と `translation.reviewedAt` の全条件。レビュー用draftは静的生成するがnoindex、sitemap・hreflang・日本語からの言語切り替え対象外。これはアクセス制限ではないため、非公開情報は置かない。
- 英語記事の自己参照canonicalと公開時の日英相互hreflangを生成する。日本語の記事一覧・記事数には英語版を混ぜない。英語トップと英語一覧は作らない。
- `/en/tools/cpk` は既存の `CpkToolExperience` と子コンポーネントに `locale="en"` を渡す。未指定は日本語。数式・サンプル・状態を複製せず、翻訳は `src/data/cpk-text.ts`、英語解説・公開管理は `src/data/cpk-english.ts` に分離する。
- Cpkの分析説明は共通の分岐結果を翻訳し、学習の比較説明も既存分岐に言語引数を加える。片側規格は規格中心を定義しない専用説明を日英共通で使う。計算結果は変更しない。
- Cpk英語版は `englishCpkRelease` のstatus・reviewedAt・publishedAtで検索公開を制御する。EFEMの公開状態とは独立し、確認前はnoindex・sitemap/hreflang/日本語からのリンク対象外とする。公開時は相互の自己参照canonical・ja/enを設定する。
- 英語の既存Cpkイベントには `locale=en` のみ追加し、測定値・規格・結果・コピー本文は送信しない。`cpk_language_switch` は固定パス・言語だけを送る。入力は言語切り替えや再読み込みで失われる。

### 中心導線

- `/`: サービス概要、Career Compass、記事・企業研究への入口
- `/career-compass`: 12問の現在地チェックと同一画面内の結果
- `/career-agents`: 転職エージェント比較
- `/career-consultation`: 相談論点の整理
- `/tools/process-comparison`: 実測2条件の記述統計・共通相対度数ヒストグラム、TSVコピーとPNG出力。計算とSVG生成は`src/lib/process-comparison.ts`、PNG化は`src/lib/process-comparison-export.ts`。同じ結果を画面・コピー・画像へ使い、サーバーAPIや永続化は追加しない。計測は`process_comparison_started/completed/copied/png_exported`の固定名のみ（プロパティなし）
- `/tools/cpk`: 生データからPp・Ppk、短期標準偏差からCp・Cpkを計算し、SVGヒストグラムと分析を表示
- `/tools/taguchi`: L9の2列による9制御条件×3誤差状態の望小SN比と確認実験を学ぶ。`src/lib/taguchi`でtypes・simulator・analysis・sessionを分離し、analysisは真値を参照しない。81回の段階進行と実験ID由来の乱数、独立した確認群を保持。操作は専用Client ComponentとSVG、説明はServer Component、文言・日付は`src/data/taguchi.ts`。状態はメモリのみ、失敗時は観測保持・解析停止。詳細は[専用仕様](./taguchi-spec.md)。
- `/tools/doe`: 2因子2水準を起点に、効果、実験誤差、ANOVA、残差、確認実験、設計選択を学ぶ
- `/tools/bayesian-optimization`: 架空成膜工程の12回の実験を、DOE→GP予測→LCBによる追加実験→確認→真値の振り返りとして体験する。`src/lib/bayesian-optimization` のmodelはtypesのみに依存し、simulatorの真値を参照しない。sessionは原子的なDOE追加と12回の予算、確認前予測を保持する。Server Componentの説明とClient Componentの操作、Canvasの面とSVGの点を分離し、状態はメモリのみ。計算失敗時は履歴を保持して予測を消去・停止する。文言と公開日付は`src/data/bayesian-optimization.ts`、詳細は[専用仕様](./bayesian-optimization-spec.md)。
- `/tools/control-chart`: 管理図で偶然原因と異常原因の判断を学ぶ
- `/tools/yield-analysis`: 日別の良品・不良品個数をp管理図で監視し、製品別・装置別・製品構成比で歩留まり低下の調査条件を絞る
- `/tools/yield-dashboard`: 固定の架空半導体工場データで、歩留まり低下から不良・製品・装置・ロット・工程条件・変更履歴・確認実験までを連動して調べる
- `/tools/gage-rr`: 交差型Gage R&Rで部品差、繰返し性、再現性、%GRR、ndcを学ぶ
- `/tools/line-balance`: 工程別の作業時間を山積み表示し、タクト超過と再配分前後を比較する
- `/tools/oee`: OEEの内訳と、停止・性能・良品率の改善による推定良品数を比較する
- `/games/palm-fab`: Server Componentの専用ページと、そのページだけで読み込むClient Componentを初期HTMLにも描画する。専用WebP素材と状態連動SVGの固定配置工場を使い、素材は`public/games/palm-fab`に置く。`src/lib/palm-fab/simulation.ts` に固定時間刻みの生産・搬送・待ち行列・保存検証を分離し、バランス値は `src/data/palm-fab.ts` に置く。index可能にし、sitemapへ掲載する
- `/games/process-engineer-survival`: Phaserの工場フロアとReactのイベントUIを組み合わせ、製造トラブルの判断をコミカルに体験する。ゲーム状態はブラウザメモリだけに保持する

`/diagnosis` と `/diagnosis/result` は存在しません。Career Compass の結果は URL を分けず、クライアント側の状態として同じページに表示します。

### 情報ページ

- `/industry-map`: 8つの事業領域を固定したゾーンに分け、役割、代表企業、製品分野を同時に俯瞰する。検索・絞り込み・職種表示・企業詳細パネルを提供し、静的な領域一覧も同じページに残す
- `/semiconductor-map`: 国内の半導体関連拠点を勤務地単位で探す。全国URLだけをindexし、絞り込みパラメータ付きURLは `noindex, follow` とする
- `/segments/[slug]`
- `/companies`（一覧トップだけを`/industry-map`へ308転送）
- `/companies/[slug]`
- `/compare`
- `/compare/[slug]`
- `/guides`
- `/guides/[slug]`
- `/rankings`
- `/rankings/[slug]`

### 信頼性・法務

- `/about`
- `/contact`
- `/privacy`
- `/disclaimer`
- `/advertising-policy`
- `/sitemap.xml`
- `/robots.txt`

旧 `/companies/[slug]/career-prep` は独立コンテンツを持たず、`/companies/[slug]#career-prep` へ恒久リダイレクトします。キャリア準備情報は企業詳細の初期HTMLへ統合し、旧URLは sitemap に含めません。

## ディレクトリ責務

```text
src/app/                    ルート、メタデータ、構造化データ
src/components/             共通UIとClient Components
src/components/career-compass/
                            Career Compass の結果表示部品
src/data/career-compass.ts  質問選択肢と結果プロファイル
src/data/companies.ts       セグメント、企業、キャリア準備情報
src/data/industry-map.ts    業界地図の工程、役割、代表企業、職種との接点
src/data/company-locations.ts
                            公式確認済みの半導体企業・物理拠点・出典
src/data/hiring-signals.ts  期限付きの拠点別採用確認状態
src/data/affiliateLinks.ts  エージェント、提携状態、CTA
src/data/learning-affiliates.ts 統計学習講座の広告情報とCTA掲載対象
src/data/salary-methodology.ts
                            参考年収帯の算出説明と出典
src/data/editorial.ts       ガイド記事の集約
src/content/guides/         記事データ
src/types/content.ts        企業・セグメント・出典の型
src/types/company-location.ts
                            拠点、施設、状態変更、採用シグナルの型
src/lib/analytics.ts        計測イベント
src/lib/company-locations.ts
                            公開拠点の取得、絞り込み、期限判定、データ検査
src/lib/format.ts           正規URLなどの共通処理
src/lib/doe/                DoEの効果・ANOVAなど、UIから独立した計算
src/lib/gage-rr/            Gage R&Rの疑似測定データ、ANOVA、分散成分計算
src/lib/yield-analysis.ts   CSV検証、個数加重集計、p管理図、層別・構成比比較
src/data/yield-dashboard.ts 架空工場のロット、排他的な不良、工程条件、変更履歴、確認実験
src/lib/yield-dashboard.ts  歩留まりの個数加重集計、絞り込み、層別、条件比較、整合性検査
src/data/process-engineer-survival.ts
                            設備接続、原因ケース、観察項目、作業・実験時間、称号、学習導線
src/lib/process-engineer-survival.ts
                            設備・材料・冷却・製品履歴・観察・作業・試運転の純粋関数と状態ストア
video/                      Web本体と依存関係を分けたショート動画生成パッケージ
video/manifests/            元記事、画面文言、音声設定、確認日、公開状態
video/src/components/       音声ミックス、共通枠、場面などの再利用部品
video/src/compositions/     動画ごとの図解と場面構成
video/docs/                 制作フロー、公開記録、計測ログ
```

表示ロジックとデータ定義を分けます。新しいコンテンツ種別を追加する時は、まず型と所有ファイルを決め、ページ内へ大きなデータを直書きしません。

`video/` は独立した `package.json` と lockfile を持ち、Vercel のWebビルドから実行しません。動画は公開記事の `sourceSlug`、確認日、音声ミックス、公開状態を持つマニフェストからローカル生成し、MP4、確認画像、収録音声、レンダーキャッシュはGit管理へ含めません。記事本文を動画側へ複製せず、動画公開前に内容、匿名化、BGMライセンスを人が確認します。標準手順は `video/docs/short-video-workflow.md`、制作結果は `video/docs/production-log.md` に記録します。

実務学習ツールは、ページをServer Component、操作部分を専用Client Component、統計計算を可能な限り`src/lib`へ分離します。同じ計算結果を複数の表示で独自計算せず、一つの解析結果から数値、グラフ、解釈を派生させます。

## 業界地図のデータフロー

2026-10-17：IndustryAtlasはServer Componentとして、企業詳細37社と出典付き簡易紹介7社をCompanyExplorerItemへ組み立て、CompanyExplorerへ渡す。主領域の追加対応は`src/data/company-explorer.ts`、組み立てと検索は`src/lib/company-explorer.ts`に置く。既存31社の領域内順序の後ろへ追加13社を企業データ順で加え、8領域・44社を検索する。元のCompany・セグメント分類は変更しない。ページがqueryの先頭値を読み、query変更時は探索部品をkeyで再マウントして初期検索を適用する。PCの地図は12列・2段、1023px以下は領域を縦に配置する。概要ボタンだけのカードと、検索に依存しない全44社の通常リンク一覧を同じ初期HTMLへ出力し、絞り込み・リンク一覧はnative detailsで開閉する。ロゴはoverviewサイズを使い、ランキングの履歴データに依存しない。旧一覧はNext設定による完全一致308転送とサーバーページのpermanentRedirectで統合先へ案内し、クエリ値・重複値を保持する。詳細以下のルートは転送しない。[詳細](./company-explorer-spec.md)。

```text
静的な領域・役割・既存企業参照・出典付き簡易企業・職種の接点
  → Server Componentから必要な企業概要だけを渡す
  → Client Componentで選択、検索、絞り込み、職種表示を管理
  → 記事、企業詳細、セグメント、Career Compassへ遷移
```

- ブラウザ操作や検索語を保存しない
- 自由入力の検索語をAnalyticsへ送らない
- 線はゾーン間の一般的な役割上の接点であり、資本・取引関係や採用可能性を表さない
- 自動配置ライブラリを使わず、CSS Gridの固定ゾーンで同じ領域が毎回同じ位置に現れるようにする
- 企業名、説明、内部リンクは初期HTMLへ含め、関係線だけへ情報を閉じ込めない
- 企業詳細データを持たない簡易企業は、公式URL、出典、確認日を必須とし、存在しない企業詳細URLを生成しない

## 半導体企業・拠点マップのデータフロー

```text
企業公式情報から確認した物理拠点と出典
  → contentStatus が complete の拠点だけを取得
  → 期限付き採用シグナルを表示時点で判定
  → Server Componentで全国一覧と構造化データを出力
  → Client Componentで検索、絞り込み、都道府県選択を管理
  → 有限分類と管理済みIDだけを匿名イベントとして送信
```

- `CompanyLocation.companyId` で既存企業詳細へ接続し、国内法人は `legalEntities` に保持する
- 拠点の存在・役割と採用シグナルを別ファイル・別更新周期で管理する
- V0データへ座標を入れず、正確な施設ピンはV1の人手確認後に限定する
- 実行時ジオコーディング、求人API、外部データベースを使わない
- 自由入力の検索語をAnalyticsへ送らない
- 都道府県、拠点種別、職種、拠点・企業ID、導線位置だけを拠点マップイベントへ送る
- 閲覧・検索・Career Compass回答を外部データベースへ保存しない

## Career Compass のデータフロー

```text
ブラウザ上の回答
  → 静的な加点・分岐ルール
  → 結果プロファイルと回答由来の補足を合成
  → 同一ページに結果を表示
  → 必要なイベントだけ匿名計測
```

- 回答と生成結果をデータベースへ保存しない
- URL と Cookie に回答内容を含めない。Analytics には全回答や現年収を送らず、完了時の粗い職種領域・転職目的・結果タイプ・相談テーマだけを送る
- 現年収帯はブラウザ内の差分表示だけに使う
- スコアは応募準備の棚卸し指標として表示する
- 企業例は静的企業データとの接点であり、推薦順位や採用可能性ではない
- 参考年収帯は `salary-methodology.ts` の方法と出典を併記する

## コンテンツデータ

- 企業・採用・財務情報には `Source` と更新日を持たせる
- `src/data/companies.ts` の明示的な企業コンテンツ状態が `draft` の企業ページは `noindex, follow` とし、sitemap から外す
- ガイド記事は公開状態、公開日、更新日、著者、確認者、出典、SEO 情報を保持する
- ガイド記事のカテゴリは `src/content/guides/categories.ts` を正本とし、記事URLとは分離する
- `.private/` の取材メモはビルド対象にせず、公開データへ反映する前に匿名化する

詳細なデータ設計は [`database.md`](./database.md) を参照してください。

## SEO

- App Router の metadata API を使う
- canonical は `https://mfg-compass.com` を基準にする
- ガイド記事に Article、BreadcrumbList、必要なページに FAQPage / ItemList 等を使う
- `src/app/sitemap.ts` は公開状態と各データの更新日を使う
- ガイドの Open Graph / X 画像はページ固有データから生成する

## Analytics

- Clarityの限定導入（2026-09-28）：`(ranking)` の独立root layoutで `/guides/semiconductor-market-cap-ranking` を静的ルートとして扱う。日本語シェル・記事描画・メタデータ生成は既存実装を再利用し、動的ガイドのgenerateStaticParamsからこのslugだけ除く。OG/X画像は同じ生成関数で維持。root layout間のフルページ遷移により録画処理が他ページのDOMを観測することを防ぐ。
- `VERCEL_ENV=production` かつ `NEXT_PUBLIC_CLARITY_PROJECT_ID` 設定時のみ `ClarityConsent` を表示。本番ホスト・対象path・クエリなしを追加確認し、明示同意が保存されている場合だけタグを取得。consentv2はanalytics_Storage=granted/ad_Storage=deniedをタグ取得前にキューへ追加する。共通SiteAnalyticsにはClarityを入れない。
- 本文はdata-clarity-maskでマスク。選択と有効期限のみlocalStorageに180日保存。撤回はdenied通知・stop・当サイトCookie削除に加えて対象URLの `?clarity=off` へフル遷移（このURLではタグを取得しない）。別タブでの撤回・期限切れ・BFCache復元も確認。GA4/Vercelの既存同意管理とは別。手順・未確認事項は `docs/clarity-pilot.md`。

- Vercel Analytics を常時利用する
- GA4 は `NEXT_PUBLIC_GA_MEASUREMENT_ID` がある本番環境だけで有効にする
- イベントは `src/lib/analytics.ts` に集約する
- PII、自由記述、現年収、回答一式を送らない。粗いカテゴリを追加する時も個人を推測できない粒度に限定する
- ミニアプリは閲覧、初回操作、山積み表の工程移動、OEE改善条件の確定変更を別イベントで計測する。歩留まり解析はシナリオ、有限の操作種別、CSV読込成否だけを送り、製品名、装置名、日付、個数、生データ、ファイル名は送らない
- 歩留まり解析のイベントは `yield_analysis_first_interaction`（初回だけ）、`yield_analysis_scenario_changed`、`yield_analysis_csv_loaded`、`yield_analysis_filter_changed`、`yield_analysis_mix_comparison_used`。初期表示は利用開始に数えず、フィルター値は `selected` / `all` のみ送る
- 歩留まり原因調査デモは `yield_dashboard_start`（初回だけ）、`yield_dashboard_guide_step`（各段階1回）、`yield_dashboard_complete`（1回）、`yield_dashboard_free_explore`、`yield_dashboard_design_view` を送る。ロットID、日付、実数、選択値は送らず、有限の操作種別・段階・モードだけを送る
- 製造技術者サバイバルは `game_start`、`game_observe`、`game_experiment`、`game_countermeasure`、`game_complete`、`game_retry`、`related_tool_click` を送る。`game_version=factory-investigation-v3` と固定のステージ・ケースIDで旧選択式・修理式と区別する。観察は記録時、実験・対策は受理時、完了は1プレイ1回。固定の操作・対象・称号・遷移先IDと完了区分のみで、自由入力、スコア、製品履歴、仮説内容、個人情報は送らない

## 製造技術者サバイバルの構成

`/games/process-engineer-survival` はSEO本文をServer Component、HUD・開始・一時停止・調査・結果をReact、移動・接触・製品・設備の描画をPhaserで実装する。PhaserはuseEffect内で動的importする。正本は `SurvivalRuntime` のみで、Phaserが更新を駆動しReactはuseSyncExternalStoreで約10Hzのスナップショットを購読する（命令時は即通知）。進行関数は最大50msずつ処理し、長い描画フレームの追従は100msまで。描画が著しく遅い環境では実時間より進行が遅くなる場合がある。

稼働90秒。12秒時点でB/Cの材料がL1からL2へ切り替わり、開始時に固定したケースの異常が発生する。ケースAは共通冷却、ケースBは材料L2。Aは正常材料N・別冷却系統。現場UIは観察関数と公開済み検査結果だけを表示し、原因の答えは終了後にだけ表示する。旧案件待ち行列は使用しない。

ACTION一押しで対象の操作パネルを開く。`SurvivalInvestigationPanel` はnative dialogでフォーカスを閉じ込め、Escapeまたは戻る操作で閉じる。調査中は時計・製品・進行中作業すべてを停止する。停止・再開・観察・仮説変更は調査中に即反映し、作業確定だけが現場へ戻して進行を再開する。設備の同時作業競合と共通冷却のB/C停止前提を純粋関数で検証する。

通常製品は6秒で1個、検査と搬送を含む教材モデル。製品ID、設備、材料、進捗、品質、保留状態を同じ履歴で管理し、描画と集計を分離計算しない。比較試験は正常材料Nだけを使い、生産材料を変更しない。対策後確認は現在の生産材料で試す。どちらも4秒で試験品は納入数から除外。対策変更後は正常な確認結果を得るまで再開不可で、再起動でこの制約を迂回できない。通常良品が置場に到着した時にだけ復旧の音・粒子を出す。

フォーカス喪失・非表示で時計と入力を止め、再開は手動（調査中なら調査に戻る）。リトライは同じケースまたは別ケースを指定して状態を初期化し、Phaserを再生成して位置・入力・演出を破棄する。音は開始操作後にWeb Audioで有効化し、ミュート常設。動きを減らす設定では粒子・歩行フレーム・浮上演出を抑える。画面揺れは使わない。

プレイ状態はURL、Cookie、localStorage、外部APIへ保存しない。マップはGraphicsから生成し、正式素材へ差し替え可能。検証項目は [ゲーム確認チェックリスト](./process-engineer-survival-checklist.md) を参照。

## デプロイと検証

- Vercel の `main` を本番、Pull Request を Preview とする
- `npm run build` は `next build --webpack`
- AI エージェントの検証回数、build 条件、ブラウザ確認条件は `AGENTS.md` を正本とする
- ローカル build が環境由来で止まる場合は、無制限に再試行せず Vercel のビルド結果を優先する

## 半導体職種マップの事前検証（2026-09-16）

現段階はdocs内の[対応表](./role-map-pilot.md)・[運用検証](./role-map-validation.md)と、`/roles` で公開する4職務群のβ版。トップ、Career Compass、sitemapから接続する。

β版は `src/data/role-map-prototype.ts` の4職務群・18業務、`src/lib/role-map.ts` の純粋な候補抽出、Client Componentの選択・結果・コピーに分ける。回答はReactメモリだけで保持し、URL、Cookie、localStorage、外部APIへ送らない。固定操作イベントだけを計測し、回答内容や検索語をイベントへ含めない。

[引継ぎ仕様](./role-map-mvp-spec.md)に従い、8職務群への拡張では職務群・文脈別Profile・使用名称・業務・主張単位の根拠をさらに分離し、レビュー済みのローカル静的データを追加する。`/roles`は構造化データとパンくずをServer Component、業務選択・候補抽出・コピーをClient Componentとする。新しい外部API・DB・認証は追加しない。

## 将来の外部サービス導入条件

Supabase、ユーザーアカウント、メール保存、求人連携は未採用です。AI APIは下記Jev実験ページのみの例外です。導入する場合は、少なくとも次を先に決めます。

- 解くユーザー課題と、静的実装では不足する理由
- 保存するデータ、保存期間、削除方法、同意
- プライバシーポリシーとセキュリティ
- レート制限、費用上限、障害時の挙動
- 既存の静的ページと SEO を損なわない移行方法

## 転職の軸ノート

- `/career-priorities`: Server Componentの短い用途説明・検索用メタデータと、Client Componentの会話分岐・結果カード。ルートの最初の一問で転職全体の軸と半導体の働き方を分け、`#priorities`・`#workstyle` は各分岐の最初の質問へ直結する。両分岐をマウントしたまま切り替え、ページ内の回答を維持する。sitemapと既存の計測付き入口を維持する。
- `src/data/career-priorities.ts`: 5分野15項目と質問の固定対応、選択肢の型。
- `src/lib/career-priorities.ts`: 選択解除に伴う状態整理、最初の確認質問、相談メモを生成する純粋関数。`src/lib/workstyle-check.ts` も主要条件の質問を既存の職種・条件別データから選ぶ。
- 回答はReactのメモリ内だけで保持。再読み込みで消去され、URL・Cookie・localStorage・外部APIには保存／送信しない。クリップボード書込みは本人のボタン操作時だけ行う。
- 開始・質問段階・結果到達・コピー・次のリンクを既存Analytics経路で計測し、`ui_version=conversation-v2` で旧画面と区別する。選択内容、順位、質問、ノート本文を送信しない。

## 英語実務ツール3本の構成

- 英語URLは `/en/tools/oee`、`/en/tools/line-balance`、`/en/tools/process-comparison`。既存英語ルートレイアウトとSiteAnalyticsを共用する。新しいルート移動は行わない。
- 既存コンポーネントの任意localeは省略時ja。計算を共用し、UI・検証・出力文言は `src/data/practical-tool-text.ts` の辞書で切り替える。ユーザー入力は置換引数として保持し、翻訳・再展開しない。
- `src/data/practical-tools-english.ts` は英語解説・出典・翻訳日・本文更新日・翻訳元本文更新日を持つ。翻訳元の日付はルート移動日ではなく本文更新日で管理し、日本語本文変更時に差分と翻訳更新の要否を確認する。
- 同データのstatus、reviewedAt、reviewedBy、publishedAtでページごとに公開判定する。メタデータ、相互言語リンク、関連記事リンク、sitemap、構造化データを同じ判定へ接続する。draftはURLで確認可能だがnoindexであり、秘密情報は置かない。
- `EnglishPracticalToolPage` がプレビュー、言語リンク、解説、出典、日付を共通表示する。工程条件比較のCSSは既存の `(ja)` 配下の実ファイルを再利用する。
- 英語の既存操作イベントはlocale=enを付加する。OEEのシナリオ変更は入力開始時の数値と比較し、有効な数値変更が確定した場合だけ送る。入力値・結果・ユーザー入力名は送信しない。共通言語切り替えはtool_language_switch、関連記事はtool_related_content_clickで固定ID・パスを送る。
- 本番反映日は非公開実験記録で別管理する。計算式・サンプル数値は変えず、OEEの停止時間の説明のみ、生産予定外の時間と生産予定内の停止を区別する内容へ日英で明確化した。

## Cpk学習比較の構成

`src/data/cpk-learning.ts` に操作範囲・プリセット・条件型、`src/lib/cpk-learning.ts` に比較状態の更新・説明・正規確率密度を分離。工程能力は既存calculateCapabilityを再利用する。曲線は横軸92〜108、縦軸は標準偏差0.25の最大密度を基準とする共通固定スケール。CpkToolExperienceは両モードをマウントしたままhiddenとinertで非表示側の操作・読み上げを除外する。再読込で状態は消える。

## 相談準備の固定ひな形と比較データ（2026-09-06）

- `src/data/career-consultation.ts` に固定ひな形、`ConsultationTemplate` にコピー状態と読取専用表示を分離。コピー操作時だけクリップボードへ書き込み、失敗時は手動コピーを案内する。個人情報入力・永続化・APIは追加しない。
- 共通 `CareerAgentsLink` は任意の既存 `AgentFocus` と有限の `ctaLocation` を受け取る。省略時の共通CTAの遷移先と計測位置は従来通り。source_pageはusePathnameによるパスだけを送る。
- `CompanyComparisonProfile.research` は任意の企業別事実・Source・質問・更新日を持つ。既存比較のデータとは確認日を分け、対象2ページだけにServer Componentで表示する。
- 検証は `node tests/unit/career-consultation.cjs` で通信しないハンドラー単体確認を行う。ブラウザ・本番GA受信確認の代替とはしない。

## 働き方チェックの追加モード（2026-09-06）

- `/career-priorities#workstyle` で働き方の最初の質問へ直接接続。hashはモードのみで回答を含まない。両分岐はマウントを維持しhiddenで表示を切り替える。
- `src/data/workstyle-check.ts` は3職種・5条件の編集上の質問、参考資料の適用範囲・確認日・次回確認日を所有する。企業別の勤務条件を推論しない。
- `src/lib/workstyle-check.ts` は質問抽出、選択解除時の確認状態の除去、コピー文面を生成する純粋関数。職種変更で対象外となった確認状態は破棄し、条件の重要度変更では維持する。
- 専用Client Componentで職種→条件→最初の確認→結果カードを実装。全質問の比較・選択と本人の確認状況は詳細表示に残す。回答はReactメモリのみ。コピー失敗時は詳細内の読取専用テキストから手動コピー。
- 共通trackEventへ有限の操作種別・導線位置だけを送る。回答・質問本文・本人確認状況は送らない。既存ノートのイベントと分け、本番設定は別途確認する。

### 光半導体メーカー記事

`optical-companies` 記事ブロックは `src/data/optical-semiconductor.ts` の公式製品例を使用する。`OpticalCompanies` が出典付き全社対応表をサーバー描画し、`OpticalCompaniesExplorer` が4用途と全件の選択・図解・企業説明を連動する。選択はページ内状態のみで、API・保存・新規ライブラリは追加しない。記事登録からメタデータ・構造化データ・sitemapを既存処理で生成する。

## Jev実験ページ（2026-09-20）

- `/labs/jev`: Server Componentの説明・index可能なメタデータ・OG・構造化データとClient Componentの3ケース×2分岐、初報基準の比較、メモリ内結果。`/tools`とsitemapから接続する。共有クエリはcaseのみでcanonicalは本体URL。JSON保存は提供しない。
- 計測は閲覧、固定ケース選択、固定追加情報選択、評価開始・成功・失敗、共有リンク、学習ツール遷移。固定ID・HTTP状態・選択された確認領域だけを送り、報告本文・確率分布・自由入力を送らない。
- `src/data/jev-demo.ts`: 架空報告、固定の追加情報、変更分類、確認領域と静的リンク、Scoreの5段階基準。
- `src/data/jev-visual.ts` と `JevFactoryExperience`：全3ケース×3状態の入力図と9選択肢の確率バー。APIの分布を合算・再正規化せず固定順で表示し、初報目印と差分を併記。PC左右/スマホ上下。JevDemoは開始後の選択イベントから自動評価し、pendingガード・結果キャッシュ・失敗ID記録で重複/自動再試行を防ぐ。通信中・失敗時は初報表示と明示。native dialogに他指標・説明・学習リンクを残す。計測版はprobability-flow-v3。
- `src/lib/jev-demo.ts`: `{sampleId, evidenceId}`（初報はevidenceId=null）だけを受理。questionsはchange/comparison/completeness/route。型・分布・confidence・Scoreの加重平均を検証して正規化し、4判断を返す。分類から確認先を固定変換しない。
- `/api/jev`: POSTのみ。Origin照合、JSONサイズ・スキーマ・固定ID検証後、Gatewayへ1回送信。自動再試行なし、タイムアウト付き。秘密や外部エラー本文を返さない。
- 費用上限はGatewayのAPIキー予算へ委ねる。アプリは予算・利用枠の拒否と429を固定文言で表示し、自動リトライしない。キー予算の設定は運営者が管理画面で確認する。
- アプリ用DBは使わない。本文・結果をアプリで保存せず、Gatewayの利用履歴・インフラ標準ログは各サービスの設定に従う。
- 設定・評価・停止手順は `docs/jev-demo.md`。利用者保存用DB、認証、AI SDK以外の新規SDK依存は追加しない。

### Vercel AI Gateway対応（2026-09-20）

運営者が取得したGatewayキーを使うため、Jevの接続先をVercel AI Gatewayへ変更する。環境変数は`AI_GATEWAY_API_KEY`、モデルIDは`typesafe-ai/jev`。AI SDK 7のexperimental_evaluateを使い、Node.jsは22以上24未満とする。Gatewayの応答から確信度・使用量を検証して取り出す。費用管理はGatewayのAPIキー予算に一本化する。APIキー設定は.env.localまたはデプロイ環境変数で行い、コーディングエージェント向けCLIセットアップは使用しない。

## 記事の比較表と翻訳差分（2026-09-21）

- GuideBlockのcomparison-tableは見出し列・行見出し・文字列値・任意の行別出典を持ち、GuideBlocksでcaption付きのHTML表として表示する。スマホは列関係を維持した横スクロール。新しいクライアント処理は追加しない。
- Cpk結果解説は通常のGuideArticleとして登録する。draftは既存の公開フィルターにより一覧・sitemap・記事URLから除外され、確認用原稿は非公開文書で読む。公開指示後にstatusと実際の公開日を設定する。
- Cpkツールから新記事へのリンクは記事がpublishedのときだけ表示する。シックスシグマの関連記事も既存の公開フィルターを使う。
- 公開済み英語版の翻訳元に更新がある場合、translation.pendingSourceUpdatedAtに未反映の日本語更新日を記録できる。sourceUpdatedAt・translatedAt・reviewedAtは実際に翻訳・確認した版の日付を維持する。対象テストは未記録の原文更新を検出し、差分を確認して反映後にpendingを外す。pendingは翻訳済みや確認済みを意味せず、英語版の公開状態も変更しない。

## 相関と因果ラボ（2026-09-22）

Serverページが定義・解説・出典・SEOを出力し、`CorrelationTool`とSVG/表が5段階の体験を提供する。`src/data/correlation-causation.ts` に文面・固定条件・公開状態、`src/lib/correlation-causation/` に生成・観測だけの解析・純粋な状態遷移を分離。観察と2実験の乱数列・IDを分け、同期refで連打を抑止する。新規API・依存・永続化なし。reviewでは直接URLのみ、publishedで一覧・関連リンク・sitemapとindexを有効化。[仕様・検証境界](./correlation-causation-spec.md)。

## 改善の差を見極める

`/tools/improvement-confidence` のServerページが説明・出典・SEOを出力し、Clientの操作部がメモリ内で3ケースと自由実験を扱う。`src/data/improvement-confidence.ts` に教材・公開情報、`src/lib/improvement-confidence/` に独立した統計計算・シード付き生成・純粋な状態遷移、専用コンポーネントにSVG・表・操作画面を分離。Welch区間は観測値のみから計算し、真値は振り返りだけで使う。既存DOE・工程比較の計算、新規依存、外部API、永続保存は変更・追加しない。revisionで古い操作とイベント重複を防ぎ、計算エラー時は履歴を残して停止する。[仕様と検証](./improvement-confidence-spec.md)。

## 半導体工程図鑑

`/tools/semiconductor-process` のServerページが説明・静止図・出典・SEOを出力し、ClientのProcessExplorerが6地点・ウエハ準備8工程・薄膜加工8工程・配線7工程・組立7工程・ウエハ検査4工程・最終検査4工程・体験別の振り返りを扱う。ExperienceId（wafer-preparation／thin-film／assembly／interconnect／wafer-test／final-test）で教材・進捗・計測を分離し、操作とレイアウトを共有する。体験定義表で工程・補足・関連記事・戻り先・まとめを選ぶ。ウエハ準備・組立・配線・検査の教材、純粋形状関数、SVGは専用モジュールに置く。検査2体験は図・応答表を共有し、対象への接触方法と記録を分ける。教材データ、純粋な形状関数と状態遷移、SVG・専用CSSを分離。RAFは再生トークンで古いコールバックを破棄し、非表示・画面外・unmountで停止・解除する。低モーションは加工後の静止形を使う。新規依存、API、動画配信、WebGL、永続保存は追加しない。[仕様](./semiconductor-process-spec.md)。

### 工程図鑑のおすすめ見学コース（2026-09-22）

`src/data/semiconductor-tour.ts`に6体験の順序・案内・振り返りを定義。既存の純粋状態遷移にコース開始・全体図・次体験・自由選択を追加し、再生トークンを更新して旧RAFを破棄する。次体験は呼出元IDとsummary状態を検証し連打による飛び越しを防ぐ。体験別履歴は共有し、コース再開始でも消さない。コース地図／振り返りは既存Client内、入口はSSRにも出力。既存の画面高レイアウトには行を追加しない。

### 全6体験の仕事紹介（2026-09-22）

`semiconductor-work.ts`に役割・架空事例・出典・更新日・関連記事を定義。`WorkRolePanel.tsx`は選択された役割を受け取る静的なSVGと文章の表示部。選択状態とページ内の表示計測抑制はProcessExplorerに置き、加工の状態遷移へ混ぜない。`workLessons`は全ExperienceIdを網羅するRecordで、体験ごとの役割・出典・版を選ぶ。残り3体験のデータは`semiconductor-work-remaining.ts`に分離し、型のみを元データから参照する。画面移動で選択を解除し、表示済みキー（体験ID＋役割ID）は保持する。薄膜と組立の図は表示部内で描き分け、配線とCMPの図は`InterconnectWorkGraphic.tsx`に分離。ウエハ準備の図は`PreparationWorkGraphic.tsx`、検査2体験は`TestingWorkGraphic.tsx`で対象の接触形状を描き分ける。Serverページにも全6体験の各3役割の文章と出典を出力。URL、canonical、sitemapの日付（同日更新）、既存6体験の計測版と再生動作を維持し、仕事紹介のイベントは別版で識別する。新規依存・API・保存は追加しない。

## 外資系企業の日本の仕事探索（2026-09-22）

`JapanWorkEvidence` と企業の日本紹介・Sourceは `src/data/japan-work.ts`、分類・公開条件・地域との同一記録照合・比較選択・整合検証は `src/lib/japan-work.ts` に分離する。企業IDとCompanyLocationを参照し、jobCategoriesから国内業務を補完しない。KLA横浜本社・Infineon渋谷本社を既存拠点データへ追加するが、根拠がない職種の配属先にはしない。

Server Componentが出典付き詳細を生成し、JapanWorkExplorerへ表示スロットを渡す。初期HTMLの全社詳細とClient Componentの探索パネルで同一内容を使う。操作状態はReactメモリのみ、外部API・永続化・新規依存はなし。日次再検証で期限表示を更新する。専用URLはcanonical・sitemap・WebPage・ItemListへ追加。既存企業ページの公開状態は変更しない。[データ範囲・計測・更新手順](./global-japan-work-spec.md)。

## 工程改善レポート（2026-09-23）

`/tools/improvement-report` のServerページが完成見本・説明・SEOを表示する。`ProcessComparisonTool(reportMode)` が既存の入力・計算・分布図と報告編集を共用し、日本語の比較結果からもページ遷移なしで開く。`ImprovementReportEditor` は編集と印刷準備、`ImprovementReportPreview` は画面／印刷共通表示、`lib/improvement-report` は能力指標と観察文、`data/improvement-report` は項目定義と架空例を担う。印刷はbody直下のportalと印刷CSSでUIを除外する。workspace v1のimprovement-reportに比較入力＋報告欄を保存し、旧比較ファイルは報告書側だけ受理する。新規依存・API・永続ストレージは追加しない。[詳細](./improvement-report-spec.md)。

## ランキング内の企業比較（2026-09-23）

対象記事だけをRankingCompanyCompareProviderで囲み、Server Componentsの記事本文・ランキング表をchildrenで渡す。表のボタン・共有状態・比較欄はClient。比較はbodyへPortalするnative dialogに表示し、概要と日本の仕事をタブで切り替える。企業名・タブ・閉じる操作を固定し、本文だけ内部スクロールする。showModal、Escape／背景クリック、背景スクロール停止と復帰、元操作へのフォーカス復帰を用意。選択バーは結果表示中にhiddenで隠して保持し、閉じても選択を残す。共有URLはスクロール移動せず直接開き、result_viewは見出しの実露出で記録する。既存ランキングデータの固定idで世界・日本の重複企業をまとめ、数値は複製しない。分類説明はindustryMapZonesを参照する。公開地図IndustryAtlasが許可企業IDの#companyを受け付ける。新API・ページ・永続ストレージは追加しない。[仕様](./ranking-company-comparison-spec.md)。

## 実務ツール案内（2026-09-23）

`ToolsLearningLab` に `ToolFinder` を追加。質問・案内文は `src/data/tool-finder.ts`、純粋な分岐は `src/lib/tool-finder.ts`、操作はClient Componentと専用CSS Module。ツール名・URL・入力方式は既存 `learningTools` / `toolUsage` を参照し、台帳を複製しない。静的な入口・質問・出典は初期HTMLにも出力する。

目的変更で使い方とデータを、使い方変更でデータを消去し、結果は回答から導出する。外部API・保存・追加依存はなし。見出し露出は `observeVisibleOnce`、イベントは `trackEvent` を使用。仕様・対象検証は [tool-finder-spec](./tool-finder-spec.md)。

## 不良の優先順位ボード（2026-09-23）

`src/data/defect-pareto.ts` にメタ情報・架空例・注記、`src/lib/defect-pareto.ts` に2列解析・集計・TSVコピー文・SVG生成を分離。`DefectPareto.tsx` とCSS Moduleが入力・重複合算確認・結果・出力を担当し、App RouterのServer ComponentがSEO・静的解説を提供する。

図は共通のSVG生成を画面と保存に使用。ユーザー由来の文字列をXMLエスケープし、制御文字を拒否。コピー表の数式開始文字には先頭アポストロフィを付ける。保存はBlobと一時URL、出力要求後にURLを解放する。非同期コピーは入力改訂番号で古い通知・フォールバック表示を抑える。外部API・新規依存・保存領域は追加しない。[仕様](./defect-pareto-spec.md)。

## 求人票の確認ノート（2026-09-23）

2026-09-26：`createJobComparison` がA・Bの記載状況行と個別確認ノートを統合し、`JobPostingNote` が単一／比較モードを担当する。回答Aは従来モードと共通、Bは独立したメモリ状態。両方で1項目以上確認した場合だけ結果を返す。モード変更も改訂番号を進めてコピー通知を無効化。機能更新日と出典確認日を分離する。

質問・選択肢は `src/data/job-posting-note.ts`、整理とコピー文は `src/lib/job-posting-note.ts`、操作は `JobPostingNote.tsx` とCSS Module。既存 `priorityItems` から共通の質問文を参照する。相談準備のServer Componentページ内へ追加し、既存canonicalとsitemap URLを継続する。

native selectと明示的な作成・コピーを使用。回答変更・クリアで結果とコピー状態を無効化し、非同期コピーの通知は改訂番号で制御する。入力保存・外部API・新規依存なし。露出監視は既存 `observeVisibleOnce`、計測は固定actionのみ。[仕様](./job-posting-note-spec.md)。

## 2026-10-20：拠点探索アプリ

`/semiconductor-map`はServer Componentで公開拠点・マップ用会社情報・案件・出典・期限判定済み採用情報を準備し、`SemiconductorLocationApp`をSSRする。`location-explorer.ts`は複数条件、URLの許可値、案件／物理拠点の計数、座標公開条件、8地域集計、参照検査を共有する。`location-companies.ts`は企業詳細の有無から独立した表示情報を提供し、Rapidusを既存Company詳細へ追加しない。`company-location-coordinates.ts`に公式案内由来の座標・根拠を分離する。

Leaflet 1.9.4と型定義を追加し、地図だけ遅延読み込みする。地理院淡色タイルを取得し、出典を常設。初期化解除時にmap.remove、ResizeObserverでサイズ再計算。地図取得失敗でもSSR一覧を維持する。URLは複数条件と選択をpushState/popstateで同期し、検索語はメモリ内だけで扱う。FactoryProjectにlocationId・facilityId・operationalStatus・milestonesを追加して既存比較と地図で共用。両既存URLを維持する。[現行仕様](./semiconductor-location-explorer-spec.md)。
