# Conversion Architecture

最終更新日: 2026-09-23

## 成長改善の第1実験：ランキング記事から比較体験へ

実装日：2026-09-23。第1差分は同日のユーザーによるpush後、公開HTML・配信JSで反映を確認（342365a）。実画面操作・GA4受信は未確認。企業研究はランキング→タイムマシン→企業研究、実務利用はCpk・工程比較を軸に改善する。配布はThreadsを使用し、投稿は運営者が行う。

今回の仮説は「記事で気になった企業を選択済みにすると、比較操作を始めやすい」。時価総額記事は2010年・NVIDIA、装置売上記事は2010年・装置5社・東京エレクトロンを開く。順位データ・指標・検索URLは変更しない。

| 計測 | 発火条件 | 用途 |
| --- | --- | --- |
| `experience_view`, `surface=entry` | 記事内のタイムマシンリンクが前景タブで25%以上見えた時、各リンクのマウント中1回 | 入口を見た利用機会 |
| `ranking_timemachine_entry_click` | 記事の入口クリック | 入口からの遷移。source_slug・placement・destination・比較モード等を保持 |
| `experience_view`, `surface=tool` | タイムマシン操作部が前景タブで25%以上見えた時、マウント中1回 | 操作可能部分の露出 |
| `tool_step`, `step=start` | 再生、または年・企業・モード等を変更する初回操作 | 操作開始。表示・URL復元・共有だけでは送らない |
| `tool_step`, `step=result` | 初回操作前から年・企業・モードが変わり、チャートが前景タブで25%以上見えた時、マウント中1回 | 操作後の結果露出。理解・全再生完了の証明ではなく、再生中の補間表示も含む |

共通イベントには `tool_id=ranking-time-machine` を付ける。第1差分の `ui_version` は `entry-v1`。スマホ配置改善後のツール側の露出・start・resultは `mobile-v2`、変更していない記事入口は `entry-v1` を維持する。入口とツールでui_version一致を結合条件にしない。IntersectionObserver非対応時は露出を推測して送らない。再読込や再訪では再計測されるため、イベント件数を人数と扱わず、同一セッション・同一tool_id・各段階の有無で集計する。記事入口→開始は同一セッション内の順序で確認する。直接流入・共有URL流入は記事入口を必須としない別の導線として見る。

従来のGuideBlocks経由タイムマシンリンクは `article_tool_click` だったが、本変更から `ranking_timemachine_entry_click` に揃える。他のツールのイベントは変えない。過去との比較では両名称の対象リンクを対応付け、変更後に両方を足さない。再生・年変更・企業選択等の既存イベントは詳細操作用として維持し、`tool_step` に加算しない。共有のcopiedはURLコピーでありSNS投稿完了ではない。

### スマホ配置改善（2026-09-23、公開未確認）

仮説は「企業追跡・共有より先にチャートが見えると、操作後の変化を確認しやすい」。再生・年選択→チャート→企業追跡・共有のDOM順とし、PCでは追跡・共有を左列に配置する。操作部の監視対象も小さくなるため、操作部露出を分母とした前後差には観測条件の変更が含まれる。GA4受信や第1差分の基準期間を確保する前の改善であり、厳密な前後比較には使わない。mobile-v2の受信確認後から、開始→結果のセッション数と離脱箇所を観測する。

Threadsは文章とリンクだけの投稿案を保留し、実データの2時点比較画像または短い動画と、具体的な発見を組み合わせる方針。素材は未作成・未投稿。

### 公開後に確認すること

1. 本番環境のGA設定とRealtime/DebugViewで、入口露出→クリック→操作部露出→開始→結果が受信されるか確認する。ローカル・プレビューは現行仕様でGA4を送らない。未確認の受信を実装テストで代用しない。
2. 閲覧だけ・共有URL復元だけではstart/resultが出ないこと、再生直後で年がまだ変わらない時点ではresultが出ないことを確認する。画面外・背景タブ・繰り返し操作で水増しされないかも確認する。
3. GA4でtool_id・surface・step・ui_version・source_slug・placementなど必要なイベントスコープのカスタムディメンションを登録し、セッション単位の探索を用意する。閲覧は既存page_viewを使い、新規page_viewは送らない。
4. 本番反映日から最初の14日で、入口→開始を主指標、開始→結果を補助指標として分子・分母を記録する。検索とThreads、モバイルとPCを分ける。小標本の前後差を因果効果と断定せず、対象者への到達が少なければ需要未検証として配布を続ける。
5. 今回は入口と計測を同時に追加するため、過去の厳密な開始率との比較はできない。初回を基準に、次回の入口変更やスマホ配置改善と比較する。

### Threads投稿案（未投稿）

> 半導体企業の順位、2010年から見るとどう変わった？
> NVIDIAを選んだ状態で、年ごとの時価総額を動かして見られるようにしました。
> 「再生」を押すか、気になる年へ動かして試せます。
> ※選定した20社内の比較です。各年の世界TOP20を再現したものではありません。

投稿用URL：`https://mfg-compass.com/tools/ranking-time-machine?utm_source=threads&utm_medium=social&utm_campaign=ranking_entry_v1&utm_content=nvidia_2010#mode=semiconductor&year=2010&company=nvidia`

このリンクは改修反映後に使用する。投稿内容と着地状態を合わせ、流入・開始・結果・既存の共有操作を観察する。サーバーやAnalyticsへ実データ・自由入力を送る新機能は追加しない。

## 実務ツールの最小計測（2026-09-23、公開・GA4受信未確認）

Cpk・工程比較の日英共通UIに `usePracticalToolJourney` を適用する。共通属性は `tool_id`（cpk / process-comparison）、`locale`、`ui_version=practical-v1`。入力値、件数、測定名、単位、エラー本文、計算結果は送らない。

| イベント | 条件 | 分かること |
| --- | --- | --- |
| experience_view / surface=tool | 入力見出しが前景タブで25%以上露出 | 入力場所が見えた利用機会 |
| tool_step / step=start | 初回の入力編集、入力方式変更、サンプル選択、計算。Cpkの自分のデータ入力への切替も含む | 操作開始 |
| tool_step / step=sample | 利用者が明示的にサンプルを選択 | サンプルを使った体験 |
| tool_step / step=calculate | 計算・比較ボタンを押す | 入力を経て計算を試みた |
| tool_step / step=error | 計算時に検証エラーまたは計算失敗 | 入力・計算につまずいた |
| tool_step / step=result | 操作後に生成した結果の見出しが前景タブで25%以上露出 | 結果に到達。理解や業務利用を保証しない |

各段階はマウント中1回。Cpkの初期サンプル結果はstart/sample/resultに数えない。Cpkのサンプル選択は即時結果が出るのでcalculateを経由しない。工程比較のクリアだけではstartを送らない。編集・クリアで結果が消えたら未発火の結果監視も破棄する。再計算回数やエラー頻度の計測ではなく、各段階を経験したセッションを比較するための設計。

stepには、その時点の `data_source=sample/custom` を付ける。サンプルへの編集はcustom。途中で切替可能なのでstartとresultのdata_source一致を結合条件にしない。初回結果後の別入力結果は再送しないため、custom比率を実務利用者の確定割合と扱わない。

既存の `cpk_sample_changed`、`cpk_custom_data_started`、`cpk_input_mode_changed`、`cpk_calculation_completed`、`process_comparison_started/completed/copied/png_exported` およびCpkコピーイベントは維持する。工程比較startedはクリア操作を除外する変更あり。新しい共通イベントと加算しない。計算成功の旧イベントと、結果露出の新イベントを区別する。

判断は同一セッション・同一tool_id・localeで行う。露出→開始が弱ければ説明・需要・流入の適合、開始→計算が弱ければ入力負担、errorが多ければ入力支援、計算成功→結果露出が弱ければ結果の配置を調べる。Cpkサンプル経路はsample→resultで見る。page_viewは既存GA4を使用し、露出していない訪問や少数の訪問だけで需要なしと結論しない。

公開後はGA4で `data_source` もイベントスコープに登録し、日英・スマホ/PCを分ける。初期表示のみ、サンプル、独自入力の成功、入力エラー、編集による旧結果破棄を実操作し、Realtime等で受信を確認する。モック監視テストは実画面・本番受信の代替ではない。

## ツール一覧の用途表示（2026-09-23、公開未確認）

一覧のロードマップ・詳細カードを「すべて」「自分のデータ・数値で使う」「教材で学ぶ」で同時に絞り込む。自分の入力に対応するのはCpk・歩留まり解析・ラインバランス・OEE・工程比較の5件。管理図・GRR・DoE・歩留まり原因調査などは教材の入力方式を明記し、一律の「実務利用：可能」を撤去する。ゲーム紹介はツール選択の後へ移動する。

従来の「体験済み」は「この一覧から開いたツール」へ訂正。ブラウザ内のリンク選択履歴であり、遷移完了・操作開始・学習完了を証明しない。既存の `tool_card_click` と `tools_page_view` は維持し、絞り込みイベントを増やさない。Cpk・工程比較の実操作は前節の共通イベントで評価する。初期SSRは全件を表示する。

## 実務ツールの結果から次の行動へ（2026-09-23、公開未確認）

結果欄の末尾に `PracticalToolNextSteps` を表示する。Cpk→工程比較（変更前後の分布）、工程比較→Cpk（規格との関係）を日英で接続。日本語版ではCpk→管理図教材、工程比較→改善の差を見極める教材も案内し、実データ入力とは区別する。英語版は公開判定を通った英語ページのみ表示する。

元の入力・結果を残すため別タブで開き、データを自動転送しないことを表示する。結果がない間は出さない。Cpkの初期サンプル結果には表示するため、この導線の表示・クリックを独自データの計算成功とは扱わない。

追加イベントは `tool_result_related_click` の1種。固定属性 `tool_id`、`destination_tool`、`locale`、`placement=result`、`ui_version=next-steps-v1` のみで、入力・結果・企業名などを含めない。既存ページ下部の関連クリックとは区別し、ツールの初回結果到達と合算しない。クリックは遷移・利用完了の証明ではなく、遷移先のpage_viewと共通tool_stepで続きを確認する。公開後のGA4受信は未確認。

## 入力ファイルによる再利用（2026-09-23、公開・実ブラウザ未確認）

Cpk・工程比較の日英版の入力欄上に保存・読込を配置する。形式は `{format:"mfg-compass-workspace",version:1,tool,input}`。Cpkはmode/rawData/mean/standardDeviation/lsl/usl、工程比較はnameA/nameB/measurement/unit/dataA/dataB/lower/upperを文字列で保持（modeはraw/summary）。許可項目以外は抽出時に捨て、計算結果は保存しない。UTF-8で2 MiBまで、日英間で共通。未知バージョン・別ツール・破損・欠落・不正型は拒否し、入力を維持する。未完成の数値文字列は受け入れ、数値としての妥当性は既存の計算時に検証する。

ファイル名は端末のローカル日付で `mfg-compass-{tool}-YYYY-MM-DD.json`。ファイル内の名称は翻訳せず、画面言語も変えない。読込検証後に置き換えとキャンセルを提示。確定時はcustom入力の操作開始につなぎ、再計算前に結果到達を送らない。既に同一マウントで開始・結果到達していれば既存の一回制限を維持する。

イベント `tool_workspace_file` は `tool_id`・`locale`・`action=save/load`・`outcome=download_started/restored/error` の固定カテゴリのみ。保存はブラウザのダウンロード開始であり、保存先への書き込み完了ではない。読込成功は置き換え確定後。キャンセルはイベントを増やさない。ファイル名・内容・入力値・自由記述のエラーは送らない。

本番受信確認後、保存と復元のセッション数、復元後の計算・結果到達を観察する。別日の復元は再利用の手掛かりだが、ファイルや個人を追跡するIDはなく、同じ人による再利用と断定しない。GA4では既存属性に加えてaction/outcomeを必要に応じてイベントスコープで登録する。公開後は日英で保存→ページ再読込→復元→再計算を確認する。

## 目的

ユーザーが、ページを読んだ後に「何を理解できたか」「次に何を確認するか」を迷わない導線を作ります。転職エージェントのクリックだけをコンバージョンとしません。

## 主な行動

1. 業界・工程・企業を理解する
2. 自分の経験と半導体職種の接点を整理する
3. 求人票や職務経歴書で確認する項目を決める
4. 今日できる小さな準備を行う
5. 必要な場合だけ、相談先と相談論点を選ぶ

## 現行導線

```text
検索 / SNS / 直接流入
  ├─ 技術・業界ガイド → 関連工程・企業・職種
  ├─ 企業・比較 → キャリア準備・関連ガイド
  └─ キャリア記事 → Career Compass / 関連記事

企業一覧 / 業界地図 / 企業比較
  → ページの文脈に合う Career Compass 導線
  → 経験に近い職種と次の準備を整理

Career Compass
  → 経験の翻訳・参考年収・企業例・準備
  → 今日の行動
  → 企業研究 / 相談準備 / エージェント比較

半導体企業・拠点マップ V0
  → 都道府県・職種・拠点種別から勤務地候補を探す
  → 拠点の役割と確認日を読む
  → 企業詳細 / 公式採用情報
  → 必要なら Career Compass で経験との接点を整理
```

## 共通ヘッダーの導線・計測（2026-09-22）

- 日本語ヘッダーは「技術を学ぶ」→ `/tools`、「業界地図」→ `/industry-map`、「企業を探す」→ `/companies`、「記事を読む」→ `/guides` とし、「キャリアを整理する」→ `/career-compass` を主ボタンにする。
- 通常リンクは `header_nav_click` を送信する。`destination_id` は `tools`・`industry_map`・`companies`・`guides`、`display_mode` はクリック時の幅で `desktop`（1,024px以上）または `mobile_menu`。入力値やクエリ文字列は送信しない。
- キャリアボタンは既存の `career_compass_cta_view`・`career_compass_cta_click` を使い、`cta_location=global_header`、`cta_variant=header_navigation_v2` とする。通常リンクイベントは重ねて送信しない。
- PCとスマホで単一のCTA要素を使い、既存の50%以上可視の表示計測を維持する。閉じたメニューでは表示計測せず、同じページでの再開閉・表示幅の切り替えでも表示イベントを重複させない。
- 公開後は通常リンクの利用状況とCareer Compassへの遷移・開始状況を見る。スマホはメニュー開閉によってCTA露出が変わるため、旧版とのクリック率比較だけで評価しない。本番反映と実データによる評価は別途行う。

## ページの役割

- `/`: サービスの価値と主要な入口を示す
- `/career-compass`: 現在地と準備を同一ページ内で整理する
- `/guides/[slug]`: 検索意図へ答え、関連する理解へつなぐ
- `/industry-map`, `/segments/[slug]`: 工程を背骨に企業・職種の位置関係を探索し、選んだ対象の詳細へつなぐ
- `/companies/[slug]`: 公開事実とキャリア視点を示す
- `/compare/[slug]`: 同じ基準で企業を比較する
- `/career-consultation`: 相談前に職種、実績、条件、質問を整理する
- `/career-agents`: 対象ユーザー、相談テーマ、広告区分を比較する
- `/semiconductor-map`: 勤務地候補となる半導体拠点を探し、企業研究と公式採用情報へつなぐ

存在しない `/diagnosis/result`、`/agents`、`/english` を導線設計に使いません。

## CTA の選び方

- 技術理解が目的なら、次の工程・装置・企業を優先する
- 企業研究が目的なら、比較・採用情報・キャリア準備を優先する
- 経験整理が目的なら、Career Compass や職務経歴書記事を優先する
- 第三者確認が必要な時だけ、相談準備とエージェント比較を出す
- 同じページに複数の主CTAを競合させない
- Career Compass へのリンクは「診断する」だけでなく、遷移後に分かる職種・強み・準備を文脈に合わせて示す
- 企業比較から相談先へ進む場合は、必要に応じて Career Compass による経験整理を先に置く
- 拠点カードへ広告リンクを混ぜず、企業・拠点情報を確認した後にCareer Compassを独立して案内する
- 企業一覧と業界地図から全国拠点マップへ、確認済み企業の詳細から該当拠点へつなぐ
- Career Compassで「勤務地を優先」を選んだ場合だけ、結果から全国拠点マップを案内する

## エージェント CTA の前提

クリック前に、少なくとも次のどれかが分かる状態を作ります。

- 相談したい職種
- 伝えたい改善・立ち上げ・顧客対応の実績
- 確認したい年収、勤務地、勤務形態、出張、英語の条件
- 職務経歴書で伝わりにくい点

「今すぐ登録しないと損」などの緊急性を作りません。

## 計測

- `career_compass_cta_view`
- `career_compass_cta_click`
- `career_compass_start`
- `career_compass_step`
- `career_compass_complete`
- `career_compass_result_view`
- `career_compass_related_click`
- `result_detail_open`
- `today_quest_copy`
- `career_compass_agent_click`
- `career_agents_cta_click`
- `affiliate_outbound_click`
- `industry_map_mode_change`
- `industry_map_node_open`
- `industry_map_detail_view`
- `industry_map_content_click`
- `cpk_tool_viewed`
- `cpk_sample_changed`
- `cpk_input_mode_changed`
- `cpk_calculation_completed`
- `cpk_related_content_click`
- `location_map_prefecture_select`
- `location_map_filter_use`
- `location_map_view_change`
- `location_map_location_open`
- `location_map_company_click`
- `location_map_official_career_click`
- `location_map_career_compass_click`

`career_compass_cta_click` には `source_page`、`cta_location`、`cta_variant` の有限値だけを付与します。検索語や入力内容は送信しません。GA4 のページ表示からCTAクリック、1問目回答、4・8・12問到達、完了までを流入元別に確認します。

### Career Compassの入口とキーイベント（2026-09-20）

- GA4管理画面で現行の `career_compass_complete` をキーイベントへ登録済み。旧 `diagnosis_complete` と現行名を区別し、変更前の完了実績は通常のイベント数で確認する。`affiliate_outbound_click` の既存登録は維持する。完了と同時発火する `career_compass_result_view`、入口クリック、内部の相談先クリックを重ねてキーイベントにしない。
- 共通 `CareerCompassLink` と記事のリンク一覧で、リンクの50%以上が画面に入った時に `career_compass_cta_view` を送る。マウント・遷移元・導線位置・バリエーションの組合せで1回とし、アンマウント時は監視を解除する。IntersectionObserver非対応時は表示計測を省略し、リンクとクリック計測を維持する。
- 表示とクリックには同じ `source_page`、`cta_location`、`cta_variant` を使う。表示は読了・理解を示さない。記事の既存クリック名・値は保持し、`article_internal_click` と二重送信しない。表示計測の対象は共通リンクを使う入口のみで、独自リンクを含む全CTAの表示率とは扱わない。
- 時価総額ランキングの企業研究4ステップに、経験と職種・次の準備を整理する入口を追加。既存の勤務地・企業・待遇の導線は維持する。ランキング数値と出典の確認日は変更しない。
- コードの本番反映日は未確認。反映日から28日間、ランキングと業界地図を遷移元別に、表示したセッション→クリック→開始→完了の順序で確認する。イベント件数をそのまま割らずセッション内で重複排除する。新しい表示イベントに過去の基準値はないため、最初の期間を基準とする。

### 業界地図の詳細導線（2026-09-10・ローカル実装）

- 工程パネルの代表企業名から企業詳細へ進める。材料は材料セグメント、組立・テストは後工程・OSATの解説へ接続する。
- 企業パネルは企業詳細を主導線とし、公開対象の確認済み拠点がある場合だけ同社の `#japan-locations`、キャリア準備データがある場合だけ `#career-prep` への補助リンクを表示する。判定はServer Componentで行い、Client Componentには真偽値だけ渡す。未掲載を拠点不存在や求人なしと表現しない。
- 補助リンクも `industry_map_content_click` で計測し、`destination` は国内拠点を `company_locations`、準備情報を `career_preparation` とする。遷移先は企業詳細のセクションで、拠点マップへの直接遷移・採用応募ではない。
- `industry_map_node_open` は地図・リストで新しい対象を開いた時だけ送る。同じ対象の再クリックによる閉じる操作は送らない。
- `industry_map_detail_view` はノード選択と初見向け入口の両方で、詳細を新しく開いた時・別対象へ切り替えた時に送る。同じ詳細を開いたまま入口を再押下した場合や地図／リスト切替では送らない。画面内露出時間を測るイベントではない。
- 詳細閲覧に `node_id`、`node_type`、`mode`、`view`、`entry_point`（`map` / `list` / `guide`）を付ける。
- パネル内の全遷移を `industry_map_content_click` に揃え、既存の `destination`、`company_id`、`process`、`segment`、`career_id` を維持する。選択元の `node_id`、`node_type`、`mode`、`view` と `link_location: detail_panel` を追加する。
- Explorer内のイベントには `source_page: /industry-map`、`ui_version: detail-focus-v10` を付ける。`detail-links-v1` は工程リンク・計測整理、`detail-links-v2` は企業パネルの拠点・準備情報リンク追加、`readability-v3` はスマホの一覧・詳細の可読性改善、`classification-v4` は工程・役割・製品分野の説明整理、`overview-examples-v5` は全体像への企業例追加、`search-help-v6` は検索対象の案内と検索0件の導線改善、`focused-lines-v7` は選択対象に絞った関係線の表示、`list-view-v8` はPCへの一覧表示対応、`pinch-fix-v9` はピンチ操作の座標補正、`detail-focus-v10` は詳細パネルのフォーカス移動を区別する。本文側の `industry_map_category_click` は別イベントとして維持する。検索語・自由入力は送信しない。
- 全体像の役割ノードと一覧に、掲載済みデータから選んだ1〜2社の企業例を表示する。組立・テストは装置供給企業の例と明示する。役割パネル内の企業リンクは既存の `industry_map_content_click`（`destination: company`、選択元の `node_type: group`）へ接続する。企業ノードや工程接点の追加は含めない。
- 操作地図の6項目は設計・製造の流れ、本文の7項目は工程順ではない領域一覧として案内する。本文の企業例には設計企業・装置供給などの役割を添える。IDMは事業モデル、メモリ・アナログ・パワーは製品分野として説明する。地図内ID `idm-memory` と既存の本文アンカー・カテゴリイベント値は保持する。共有セグメントデータの分類変更は含めない。
- スマホの表示切替は「地図で見る／一覧で読む」と案内する。一覧には工程の説明も表示し、説明を省略せず折り返す。初見向け入口でも選択済みの表示方法を保持し、詳細閲覧イベントの `view` に反映する。
- 「表示を戻す」は従来の初期位置・倍率へ戻す操作。スマホで全ノードを画面内に収める機能ではなく、初期の地図表示と倍率は維持する。
- 旧版の `node_open` には閉じる操作が含まれるため、新旧の件数比を改善率として比較しない。`node_open` と `detail_view` も合算しない。本文・パネル両方の遷移を同一セッションで重複排除して評価する。
- 本番反映日・GA4受信・利用するイベントパラメータのレポート設定は公開後に確認する。ローカル実装日は本番反映日ではない。

### 相談先への到達と変更前後の比較

- `career_agents_cta_click`: 記事・企業詳細などの共通CTAから `/career-agents` へ進むクリック。`source_page` はクエリ・ハッシュを含まないページパス、`cta_location` は `shared_affiliate_cta`、`destination_path` は `/career-agents`。広告の外部クリックとは分ける。
- 記事本文の関連リンクは既存の `article_internal_click` を維持し、`source_slug` と `destination_path` で集計する。ランキングの企業研究案内から勤務地・職種記事・待遇記事・相談先への遷移もここに含む。同じクリックで新イベントを重ねて送らない。
- Compass結果から相談先へ進む行動は `career_compass_agent_click`、実際の広告クリエイティブのクリックは `affiliate_outbound_click`。相談先ページの閲覧・広告クリック・ASPの発生／確定成果を別々に観察する。
- 2026-08-16の変更で `diagnosis_start` / `diagnosis_progress` / `diagnosis_complete` / `agent_cta_click` は現行名へ移行。旧progressは4・8・12問目の回答操作、現stepは各質問への初回到達なので件数を単純比較しない。現completeとresult_viewは結果表示へ切り替える同じ処理から送信するため、結果の読了率には使わない。
- 2026-09-05に共通CTAの計測を追加。観察の起点はコード変更日ではなく本番反映日を記録し、4週間の件数とセッション単位の到達率を確認する。母数が少なければ観察を延長する。GAのキーイベント登録、フィルタ、カスタムディメンションは管理画面で別途確認する。
- 検証で本番GA・Vercel Analyticsへの送信やASP広告へのアクセスを発生させない。実送信確認が必要なら別のテスト用GAプロパティと環境を用意する。GAオプトアウト有効のブラウザでは受信確認できず、DebugViewだけでは本番データの除外にならない。`*.vercel.app` は本番へ転送する構成なので、Previewをそのまま計測テスト先にしない。

拠点マップでは、都道府県コード、有限の拠点種別・職種、管理済みの企業・拠点ID、導線位置だけを送ります。自由入力の検索語は送らず、検索利用時は検索を使った事実と結果件数だけを記録します。

評価する時は単一イベントだけでなく、流入ページ、Career Compass 完了、内部遷移、外部クリックを一連で見ます。氏名、連絡先、自由記述、現年収、回答一式は送信せず、完了時の職種領域・転職目的・結果タイプ・相談テーマは集計可能な粗いカテゴリに限定します。

## 転職の軸ノートの計測

トップ、企業比較、関連3記事、相談準備ページに入口を設ける。ノート完成後はコピーを優先し、企業比較・相談先一覧への内部リンクを示す。回答は引き継がず、移動前のコピーを案内する。入口の本番反映日から4週間、入口クリック→開始→完成→コピーを観察し、少数なら期間を延長する。

- `career_priorities_cta_view`: リンクの50%以上が画面内に入った時に、リンクのマウント・遷移元ごとに1回送る。画面に入ったことの指標であり、読了や理解を意味しない。
- `career_priorities_cta_click`: 共通リンクのクリック。viewと同じ `source_page`（クエリ・ハッシュなし）と `cta_location` を付与。既存の相談準備入口もイベント名・位置値を維持する。
- 導線位置は `home_career_route`、`compare_hero`、`comparison_after_companies`、`guide_link_list`、`guide_after_article`、`consultation_after_topics`。記事ごとはsource_pageで分ける。既存記事のリンクから別イベントを重ねて送らない。
- `career_priorities_next_click`: 完成後の内部リンク。`destination_type` は `compare` または `career_agents` のみ。
- `career_priorities_start`: 初めて希望または「まだ具体的に分からない」を選択したとき。
- `career_priorities_step`: 4画面それぞれの初回到達。`step_number`（1〜4）のみ付与。
- `career_priorities_complete`: ノート画面の初回到達。
- `career_priorities_copy`: クリップボード書込み成功時。

開始・画面到達・完成はマウント中に重複送信しない。再読込は新しい利用として扱う。回答、順位、条件区分、選択質問、ノート本文は送信しない。GAオプトアウト中の確認操作でGA受信は検証できないため、実送信検証は別途テスト環境で行う。

2026-09-06の検索公開・導線拡大後は、本番反映日を起点に4週間、入口別のview・clickと開始・完成・コピーを観察する。入口イベントと開始後のイベントはGAのセッション内の順序で確認し、回答や流入情報を保存しない。新しい表示イベントには変更前の基準値がない。

## Cpk学習比較の計測（2026-09-06）

既存のcpk_tool_view_changedは実際のモード変更時だけ送信。cpk_learning_preset_selectedは維持する。cpk_learning_control_usedは値が変わったスライダー項目をページ利用中に各1回、control（mean / standardDeviation / lsl / usl）のみ送る。cpk_learning_baseline_set、cpk_learning_resetは該当ボタン操作を記録する。切替・リセットでも操作済み項目の記録は維持し、再読込でリセットする。学習操作からcpk_calculation_completedを送らず、数値・測定データも送信しない。公開後4週間の学習モード切替・操作・基準設定を観察するが、理解度そのものとは扱わない。

## 相談準備から相談先への出口（2026-09-06）

4つの論点 → 固定ひな形コピー → 相談先比較。コピーやCompass完了を遷移の必須条件にはしない。希望条件をまだ整理したい人には既存の軸ノート入口を維持する。

- `consultation_template_copy`: Clipboard APIの成功後だけ送る。プロパティ・本文・回答を送信しない。失敗・手動コピー・押下直後では送らない。同時実行中の連打を無視する。
- `career_agents_cta_click`: source_page=/career-consultation、cta_location=consultation_after_templateまたはconsultation_theme、destination_path=/career-agents。テーマリンクだけdestination_groupに既存focusの有限値を付ける。
- `career_agents_cta_click` の従来のshared_affiliate_ctaは維持。新しい外部クリックイベントは追加しない。
- 相談先の閲覧セッションと広告クリック、ASP成果は別集計。計測日付・分母・欠測・反映日は非公開運用台帳で記録し、欠測を0で埋めない。
- 比較2ページは公式事実・求人確認質問・企業詳細・既存の軸ノートの順で理解を支える。ランキングと軸ノートの最近の入口は本番反映から28日観察して評価する。

## 働き方チェック（2026-09-06）

ランキング記事・企業研究リストの読後 → `/career-priorities#workstyle` → 職種と条件の比較 → 確認メモのコピー → 必要な記事・企業比較・拠点マップ・相談準備。質問のコピーを主操作とし、直接の広告や相談サービスの自動推薦は行わない。相談準備以降の広告クリックは既存イベントで別に集計する。

イベントは `workstyle_check_entry`（cta_location、ランキングのみsource_page）、`workstyle_check_start`（最初の入力）、`workstyle_check_complete`（最初の結果到達）、`workstyle_check_compare`（結果表示後のrole/condition操作）、`workstyle_check_copy`（成功時）、`workstyle_check_related_click`（destination_type）。開始・結果到達はマウント中に1回。本人の確認状況・回答値は送らない。entryはクリックであり表示回数ではない。検索直入の流入元は既存ページビューと照合し、hashだけでSEO流入を分離できるとは扱わない。

本番で受信確認後、4週間の実数・入口別遷移・開始/完了・コピーを観察する。コピーは活用の代理指標で成果保証ではない。少数アクセスでは率の優劣を断定せず、対象者5人程度で質問の有用性と勤務条件の誤認がないかを確認する。企業別求人条件DBは導入せず、質問・参照資料は四半期ごとに見直す。

### 業界地図の検索補助（2026-09-11・ローカル実装）

- 企業モードでは代表企業の検索範囲・結果件数・全企業一覧へのリンクを、地図と一覧に共通の位置へ表示する。
- 代表企業が0件の場合だけ、渡された全企業概要を同じ検索条件で照合し、最大3社の企業詳細リンクを表示する。地図ノードの追加ではない。
- 検索語を変更・クリアした場合は選択中の詳細を閉じる。企業一覧へは検索語を引き継がず、検索欄のアンカーへ進む。自由入力をURL・保存領域・計測へ送らない。
- 補助リンクは `industry_map_content_click` に `link_location: search_help`、`mode`、`view` を付ける。企業詳細は `destination: company` と `company_id`、全企業一覧は `destination: companies`。本文・詳細パネルの遷移と合わせて集計する。

### 業界地図の関係線表示（2026-09-11・ローカル実装）

- 未選択時は工程の矢印だけを表示する。領域・企業・職種の選択時は、その項目と工程の接点だけを描画する。工程選択時は、その工程につながる現在のモードの項目との線を表示する。
- 選択中も工程の矢印は残し、工程を選んだ場合は隣接する矢印を強調する。選択解除・モード変更で関係線を非表示へ戻す。
- 接点データ、固定座標、ノード選択・詳細閲覧のイベント定義は変更しない。凡例では工程の流れと選択対象の接点を分ける。

### 業界地図の一覧表示（2026-09-11・ローカル実装）

- 地図／一覧の切替と一覧の基本スタイルを全画面幅で共通化する。画面幅変更時も選択した表示方法と項目を維持する。
- PCの一覧は高さ540px内でスクロールでき、選択時は詳細を右側に並べる。スマホではページ内の一覧と画面下部の詳細パネルを維持する。
- 操作案内は表示方法に合わせる。切替・一覧項目にキーボードフォーカスの枠を表示する。既存の `industry_map_view_change`、`industry_map_detail_view`、遷移イベントの定義は維持する。

### 業界地図のピンチ操作（2026-09-11・ローカル実装）

指の位置は画面座標から地図表示領域の左上を差し引いて保持し、地図の移動量と同じ座標系で拡大中心を計算する。ジェスチャーの生座標や操作ごとのイベントは送信しない。

### 業界地図の詳細フォーカス（2026-09-11・ローカル実装）

- 地図・一覧・初見向け入口から詳細を開くとパネルへフォーカスを移す。選択対象の変更時も新しい詳細へ移し、Tabで閉じるボタン・関連リンクへ進める。
- 閉じるボタンとEscは開いたボタンへフォーカスを戻す。元のボタンが非表示・切断済みの場合は現在の表示方法の選択項目を探す。詳細は非モーダルであり、フォーカスを閉じ込めない。

## 統計学習CTA（2026-09-14）

- `StatisticsCourseCta` は掲載対象ページの解説後に学習案内を表示し、クリック部分だけをClient Componentにする。講座情報・掲載対象・文脈は `src/data/learning-affiliates.ts` に集約する。
- 既存の `affiliate_outbound_click` を使用し、`service_id=udemy`、`course_id=udemy-statistics-grade-2`、`source_page`（管理済みページパス）、`cta_location=statistics_learning_after_content` を送る。ツールの入力値・計算結果・検索パラメータは送らない。
- 既存の `trackEvent` 経由でVercel AnalyticsとGA4へ送信する。GA4は `NEXT_PUBLIC_GA_MEASUREMENT_ID` 設定済みの本番 `mfg-compass.com` だけで有効。本番受信と必要なカスタムディメンション設定は公開後に確認する。クリックと購入・合格は区別する。

- リーンシックスシグマ講座追加後は、シックスシグマ記事・歩留まり原因調査ツールで `course_id=udemy-lean-six-sigma-green-belt` を送る。他のパラメータとイベント名は維持し、既存講座と講座IDで区別する。掲載先から講座を静的に選び、表示と計測で同じ講座データを使う。

### 半導体製造装置売上ランキング（2026-09-17公開対象化・本番反映未確認）

- `equipment_ranking_process_select`: 工程選択が変わった時だけ送信。`process_id` は `all / deposition / lithography / etch / cleaning / inspection / test / assembly`、`source_slug` は掲載記事のslug。初期描画と同じ選択の再押下では送信しない。
- 企業詳細は既存の `article_company_click`、工程記事は `article_internal_click` を使用する。
- 操作回数を人数や理解度と扱わない。公開14日後に検索登録、28日・56日後に記事群の検索クリックと関連ページ遷移を確認する。実際の受信は本番反映後に確認する。

### メモリメーカーランキング（2026-09-18実装・本番未確認）

- `memory_ranking_market_select`: DRAM/NANDの選択が変わった時だけ送信。`market` は `dram / nand`、`source_slug` は `memory-manufacturer-ranking`。初期描画と同じ選択の再押下は送信しない。
- グラフ内の企業情報は既存の `article_company_click`、本文の内部リンクは `article_internal_click`。操作回数を人数・理解度・コンバージョン率とは解釈しない。
- 両市場の売上シェアは原表どおり、0〜100%の共通尺度。NANDは上場主要5社で87.6%、DRAMのその他は順位外。出典付き両表はSSRで提供する。
- 本番反映後にイベント受信、公開14日後にインデックス、28/56日後に表示語・検索クリック・企業研究への遷移を確認する。

### 光半導体メーカーの用途選択（2026-09-18）

`/guides/optical-semiconductor-manufacturers` は用途選択の変更時に `optical_company_category_select` を送信する。`category` は `all / led / laser / image-sensor / photodiode` の固定ID、`source_slug` は記事slug。初期表示と同じ選択の再押下は送信しない。企業詳細・関連記事は既存の `article_company_click`・`article_internal_click` を利用する。操作回数を人数や理解度として解釈しない。本番反映日を基準に14日後のインデックス、28/56日後の流入・関連遷移を確認し、既存ランキングを含めて評価する。

## トップの目的別入口（2026-09-20）

トップは技術・業界・キャリアの3入口を並列で案内し、本文を代表ツール、企業・業界研究、キャリア支援、おすすめ記事、新着、運営方針の順に表示する。代表ツールは工程条件の比較・Cp/Cpk・歩留まり原因調査。ゲーム・Jevはツール一覧から案内する。

- 一般リンクは `home_link_click`。`section_id` は hero/tools/research/career/recommended/latest/about、`destination_id` は実装内の固定リンクID・公開記事slug・カテゴリID、`purpose` は technology/industry/career/articles/about、`version` は `purpose-entry-v1`。自由入力や回答は送信しない。
- Career Compassは既存の表示・クリックイベントを使い、位置は `home_hero_purpose` / `home_career_section`、variantは `purpose_entry_v1`。軸ノートは既存イベントで `home_career_support`。いずれも `home_link_click` を重ねない。共通ヘッダーの計測は維持する。
- 新着は公開日降順（同日はslug順）の4件で、おすすめと重複させない。おすすめは公開済み記事だけを参照する。代表ツールID・おすすめslug・研究リンクの順序は `src/data/home.ts`、ツール情報は `src/data/learning-tools.ts` を正本にする。
- 本番反映日から4週間、トップ閲覧セッションに対する目的別の入口クリックと、既存イベントで追える利用開始・完了を確認する。クリック数を人数・完了数と混同しない。新設の一般リンク計測には変更前の同一定義の基準値がないため、導入前後の改善率を算出しない。少数の場合は観察期間を延長する。
- 本番反映日、GA4受信、必要なカスタムディメンション、実画面は未確認。ローカル実装日を公開日として扱わない。
