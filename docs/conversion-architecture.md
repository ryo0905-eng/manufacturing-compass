# Conversion Architecture

最終更新日: 2026-09-05

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

### 業界地図の詳細導線（2026-09-10・ローカル実装）

- 工程パネルの代表企業名から企業詳細へ進める。材料は材料セグメント、組立・テストは後工程・OSATの解説へ接続する。
- 企業パネルは企業詳細を主導線とし、公開対象の確認済み拠点がある場合だけ同社の `#japan-locations`、キャリア準備データがある場合だけ `#career-prep` への補助リンクを表示する。判定はServer Componentで行い、Client Componentには真偽値だけ渡す。未掲載を拠点不存在や求人なしと表現しない。
- 補助リンクも `industry_map_content_click` で計測し、`destination` は国内拠点を `company_locations`、準備情報を `career_preparation` とする。遷移先は企業詳細のセクションで、拠点マップへの直接遷移・採用応募ではない。
- `industry_map_node_open` は地図・リストで新しい対象を開いた時だけ送る。同じ対象の再クリックによる閉じる操作は送らない。
- `industry_map_detail_view` はノード選択と初見向け入口の両方で、詳細を新しく開いた時・別対象へ切り替えた時に送る。同じ詳細を開いたまま入口を再押下した場合や地図／リスト切替では送らない。画面内露出時間を測るイベントではない。
- 詳細閲覧に `node_id`、`node_type`、`mode`、`view`、`entry_point`（`map` / `list` / `guide`）を付ける。
- パネル内の全遷移を `industry_map_content_click` に揃え、既存の `destination`、`company_id`、`process`、`segment`、`career_id` を維持する。選択元の `node_id`、`node_type`、`mode`、`view` と `link_location: detail_panel` を追加する。
- Explorer内のイベントには `source_page: /industry-map`、`ui_version: pinch-fix-v9` を付ける。`detail-links-v1` は工程リンク・計測整理、`detail-links-v2` は企業パネルの拠点・準備情報リンク追加、`readability-v3` はスマホの一覧・詳細の可読性改善、`classification-v4` は工程・役割・製品分野の説明整理、`overview-examples-v5` は全体像への企業例追加、`search-help-v6` は検索対象の案内と検索0件の導線改善、`focused-lines-v7` は選択対象に絞った関係線の表示、`list-view-v8` はPCへの一覧表示対応、`pinch-fix-v9` はピンチ操作の座標補正を区別する。本文側の `industry_map_category_click` は別イベントとして維持する。検索語・自由入力は送信しない。
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
