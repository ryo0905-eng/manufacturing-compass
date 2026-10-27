# TASKS

## 2026-10-27：ランキングの目的別案内と承認広告

- 世界ランキング直後に4目的の任意選択を追加。初期未選択、等しい強さ、2列／スマホ1列、選び直し、読み上げの選択状態・領域、JavaScript無効時の主要リンク一覧を用意。世界表後の書籍入口と比較後の独立枠を統合し、research-nextアンカー、後半の企業研究・書籍本体、順位・数値・出典・URL・SEO情報は維持（編集更新日だけ更新）。
- 転職選択時にメーカーズジョブ、JAC Recruitment、半導体Jobを公開情報ベースで紹介。新規2社は対象サイトの管理画面で提携中・発行済みコードを確認、JACは提携中の既存アクセストレード広告を再利用。指定広告文言・URLを維持し、半導体Jobは明示的に編集可能な自由テキストのみ設定。既存の利用経験5社は変更しない。半導体Jobの運営者申告と管理画面確認は非公開台帳に分けて記録。提携申請・本人申込・広告クリックなし。
- ranking_purposeのview/select/related_clickを固定のsource_page・位置・目的・遷移先ID・UI版で計測。前景25%表示を1回、同じ選択の重複防止、背景復帰・解除・非対応・計測失敗を扱う。内部リンクに旧記事イベントを重ねず、広告は既存affiliate_outbound_clickだけ。共通広告の任意contextを追加し、従来の既定値を維持。API・DB・回答保存なし。
- GA4既存19定義を確認し、reader_purposeとdestination_idをイベントスコープで追加保存。目的別の選択状況（通常／同一セッション未選択）と目的から次の行動（内部先／3社別広告クリック）の2探索・各2タブを保存。チャネル・端末別、イベント数とセッションを分け、データ未受信・順序未確認のため遷移率は算出しない。実データが属性付きで集計できることは未確認。
- 対象テスト5ファイル成功、npm run typecheck最大1回成功、差分と公開禁止語の照合成功。監視・広告・送信を模擬した単体検証であり実画面確認ではない。dev・build・lint・commit・pushなし。ASP・GA4管理画面操作は実施。
- 本番反映・新イベント受信・観測開始は未実施。計測導入の完了は本番で表示→選択→内部遷移／広告クリックと探索の属性利用を確認した時。受信後14日で異常、28日で初回評価。表示100セッション未満は延長（統計的有意性の基準ではない）。旧書籍入口との分母・計測条件の差を仕様へ記録。
- 変更ファイル：TASKS.md、docs/architecture.md、docs/conversion-architecture.md、docs/monetization.md、src/components/TrackedAffiliateCreative.tsx、src/components/guide/GuideBlocks.tsx、src/components/guide/RankingPurposeChooser.tsx、src/components/guide/RankingPurposeEntry.module.css、src/components/guide/RankingPurposeEntry.tsx、src/content/guides/semiconductor-market-cap-ranking.ts、src/content/guides/types.ts、src/data/ranking-career-affiliates.ts、src/data/ranking-purpose.ts、src/lib/ranking-purpose-analytics.ts、tests/unit/book-affiliates.cjs、tests/unit/career-compass-entry.cjs、tests/unit/ranking-company-compare.cjs、tests/unit/ranking-purpose.cjs。
- 非公開・Git管理外：.private/affiliate-operations.md、.private/affiliate-cross-asp-research-2026-10-27.md、.private/ranking-purpose-operations.md（設定URL・反映後手順・段階別状態）。
- 実行：node --test tests/unit/ranking-purpose.cjs tests/unit/book-affiliates.cjs tests/unit/career-compass-entry.cjs tests/unit/ranking-company-compare.cjs tests/unit/observe-visible.cjs、npm run typecheck（各Python subprocess timeout=175）、git diff --check、git diff、git status --short、禁止語静的検索。
- 推奨コミット：feat: add ranking purpose guidance and affiliate tracking

## 2026-10-25：トップ横断検索と4目的の共通ナビ

- Semiraiの検索・目的別導線を参考に、日本語トップで記事・企業・ツール・案内ページを横断検索できるようにした。既存の公開データから165件を重複なく投影。企業詳細の充実度は既存公開条件で判定し、その他は業界地図の該当概要へ案内する。
- 全半角・英字大小・複数語、名称優先、種類別、12件ずつの追加表示、日本語変換の確定待ち、未入力／0件を実装。検索語は画面内だけで扱い、URL・保存領域・計測へ渡さない。検索開始・種別変更・結果クリックは固定ID・種類・件数のみで観測する。
- 共通の静的定義で4目的の道順と共通メニューを揃え、ランキングを直後に配置。PCは単一ドロップダウン、1160px未満はグループ別リンク一覧。Escape・外側クリック・フォーカス離脱・遷移・幅変更で閉じ、検索入力や開閉ボタンへのフォーカスを扱う。
- 検証：新規site-search単体テストと既存company-explorer単体テストが成功。公開範囲・企業の案内先・重複URL・表記正規化・一致優先順位・種類・件数・IME・検索計測・トップSSRを確認。追加したメニュー操作検証はテスト用DOM参照の不一致を修正後に再実行して成功し、単一展開、Escapeの復帰、外側クリック、フォーカス離脱、hash移動、検索フォーカス、幅変更とCSS Moduleを確認した。npm run typecheckは175秒上限で1回成功。公開禁止辞書に基づくsrc・docsの部分一致検索は0件、git diff --check成功。
- 実画面のキーボード操作・スマホ表示、本番反映・GA4受信・公開後効果は未確認。観察期間は実際の本番反映から28日。dev・build・lint・commit・pushは未実施。
- 変更ファイル：src/app/(ja)/page.tsx、src/app/globals.css、src/components/SiteSearch.tsx、src/components/HomeDiscovery.module.css、src/components/HeaderNavigation.tsx、src/components/Header.module.css、src/data/site-navigation.ts、src/data/header.ts、src/lib/site-search.ts、src/lib/site-search-index.ts、src/lib/analytics.ts、tests/unit/site-search.cjs、docs/site-navigation-search-spec.md、docs/PRD.md、docs/architecture.md、docs/design-system.md、docs/conversion-architecture.md、docs/documentation-map.md、TASKS.md。
- 実行コマンド：node --test tests/unit/site-search.cjs tests/unit/company-explorer.cjs、node --test tests/unit/site-search.cjs（追加したメニュー検証・テスト用DOM修正後に再実行）、npm run typecheck（最大1回）。テスト・型確認はPython subprocessのtimeout=175で制限。git diff --check、git status --short、git diff、公開禁止辞書に基づく静的検索も実行。
- 推奨コミット：feat: add site search and purpose-based navigation

## 2026-10-25：ランキング書籍広告の到達導線・読み込み・計測

- 本番Chromeで既存2冊の購入リンク生成とready状態を確認し、発行済み広告データとリンク先を照合。広告クリック・購入・ASP設定変更は行わず、生成が成功することと過去の全環境で正常だったことは区別した。GA4ともしもASPの同一期間を、メディア別・販売先別で読み取り照合済み。サイト単位のASPクリックを記事単位の成果と断定せず、実数と差異は非公開のgrowth-operationsへ記録した。
- 世界TOP30表直後に、工程・装置・材料のつながりを調べるという読む目的と広告表記を添えた書籍紹介への短い入口を復帰。購入カード本体は後半1か所に維持し、書籍の読書体験・紹介文・発行データ・広告URL・ランキング数値・出典確認日は維持。記事編集日は同日10-25を保持。
- books-v2では紹介カードの前景25%到達をsection_viewとして計測してから外部広告と10秒待機を開始。画面外のまま未生成件数が増えないようにし、入口表示・紹介到達・リンク生成・購入先領域露出・外部クリックを分離。購入先の監視非対応時も即時読込を維持し、露出は推定しない。Strict Modeの解除再設定は監視だけ復元して広告コードを重複挿入せず、解除後の遅延MutationObserverやタイマーで状態・待機を復活させない。旧版と新版の未生成件数を同じ条件として比較しない。
- 対象単体テスト3ファイル成功（2冊の遅延読込・画面外無発火・復旧・Strict Mode／再訪・解除後通知・監視非対応・外部リンク判定・計測失敗分離・SSR、共通表示監視、ランキング配置／アンカー／メタデータ）。型チェックは175秒制限で1回成功。テストは広告生成・タイマー・監視を模擬し、ASPクリック・本人購入を発生させていない。
- 変更後のローカル画面確認をnpm run dev -- --hostname 127.0.0.1 --port 3000で試みたが、listen EPERMにより起動せず終了。別ポート・別設定・権限変更で再試行していない。devプロセスは終了済み。変更後の実画面・本番反映・GA4の新版受信・効果は未確認。build・lint・commit・pushは未実施。
- 変更ファイル：src/components/guide/BookAffiliateEntry.tsx、src/components/guide/MoshimoBookLink.tsx、src/components/guide/MoshimoBookLink.module.css、src/lib/book-affiliates.ts、src/content/guides/semiconductor-market-cap-ranking.ts、tests/unit/book-affiliates.cjs、tests/unit/ranking-company-compare.cjs、docs/architecture.md、docs/conversion-architecture.md、docs/monetization.md、TASKS.md。非公開記録：.private/growth-operations.md（Git管理外）。
- 実行：node --test tests/unit/book-affiliates.cjs tests/unit/observe-visible.cjs tests/unit/ranking-company-compare.cjs、npm run typecheck（各175秒制限）、git diff --check、npm run dev -- --hostname 127.0.0.1 --port 3000（失敗）。反映・受信後14日に商品・販売先・端末・検索流入別の到達とクリックを観察し、ASPを同期間で照合する。少数クリックから成約率の良否を断定しない。

## 2026-10-25：Career Compassの見本付き入口と開始体験

- 製造業の経験者向けに、静的な説明・短い結果見本・注意・利用条件を共通データへ分離。ランキングのresearch-nextは企業研究・国内拠点の2リンク＋見本付き入口にし、同じ場所の通常Career Compassリンクは置き換えた。着地ページは説明→見本→フォームの順にして下部の重複見本を削除。スマホは短い縦並び、見本全体はリンクにしない。
- 公開表示は経験と次の準備の整理を中心にし、フォームの自動遷移と戻る操作を説明。12問の構成・順序・自動遷移・結果ロジック・検索用タイトル・canonical・出典確認日は維持。記事編集更新日は同日の先行変更を引き継ぐ。
- 見本はServer Component、小さな表示監視だけClient Component。既存の前景25%監視を使いcareer_compass_preview_viewを1回送る。属性はsource_page・cta_location・cta_variantの固定値のみ。記事CTAはranking_after_comparison / preview_entry_v1、着地見本はcareer_compass_intro / preview_entry_v1。着地CTAは既存フォームへの通常アンカーで、開始やCTAクリックを送らない。1問目回答が利用開始という既存定義を維持。
- 対象単体テスト4ファイル成功（新しい入口のSSR・順序・CTA重複防止・他記事隔離、既存CTA、共通表示監視、ランキング・アンカー・メタデータ）。新しい見本監視は25%閾値・背景／前景復帰・再描画・Strict Modeの解除再設定・解除後通知・非対応・送信属性を確認。型チェックは175秒制限で1回成功。差分確認と変更・新規公開ファイルの禁止語照合も成功。
- 実画面・本番反映・GA4設定／受信・効果は未確認。dev・build・lint・commit・pushは未実施。反映・受信後14日／28日に検索流入と端末別の見本→クリック→着地→最初の回答を観察し、100セッション未満は延長する。これは有意性の基準ではない。
- 今回の変更ファイル：src/data/career-compass-entry.ts、src/components/career-compass/CareerCompassPreview.tsx、src/components/career-compass/CareerCompassPreview.module.css、src/components/career-compass/CareerCompassPreviewView.tsx、src/components/CareerCompassTool.tsx、src/app/(ja)/career-compass/page.tsx、src/components/guide/GuideBlocks.tsx、src/content/guides/types.ts、src/content/guides/semiconductor-market-cap-ranking.ts、src/lib/analytics.ts、tests/unit/career-compass-entry.cjs、tests/unit/ranking-company-compare.cjs、docs/architecture.md、docs/conversion-architecture.md、TASKS.md。先行作業のCareerCompassLink.tsx・CompanyExplorer.tsx・career-compass-link.cjsの変更も保持。先行のガイドページへのsectionId追加は専用GuideBlockに置き換えたため不要となり、元の呼び出しへ戻した。
- 実行：node --test tests/unit/career-compass-entry.cjs tests/unit/career-compass-link.cjs tests/unit/observe-visible.cjs tests/unit/ranking-company-compare.cjs、npm run typecheck（各175秒制限）、git diff --check、変更・新規公開ファイルの禁止語照合。

## 2026-10-25：検索流入から企業研究・Career Compassへの導線改善

- Direct急増の調査を保留し、時価総額ランキングの一覧・2社比較直後に企業の役割、国内拠点、経験と職種の接点への3リンクを追加。後半の企業研究4ステップは保持。ランキング値・基準日・出典確認日は変えず、編集更新日のみ更新。
- 新しいCareer Compass入口はranking_after_comparison / research_to_experience_v1で既存の後半リンクと区別。CompanyExplorerの職種との接点からのリンクも共通CTA表示・クリック計測へ接続し、領域ごとの固定IDで区別する。共通リンクは50%可視の条件を保持し、背景タブや表示後・解除後の遅延通知を表示数に含めない。
- 対象単体テスト3ファイル成功（CTA表示の背景／前景復帰・遅延通知・解除・クリック、企業探索、ランキングのSSR／アンカー／メタデータ／他記事への影響）。型チェックは175秒制限で1回実行し成功。差分・変更した公開ファイルの禁止語照合も成功。実画面・本番反映・GA4受信・効果は未確認。dev・build・lint・commit・pushは未実施。
- 変更ファイル：src/content/guides/semiconductor-market-cap-ranking.ts、src/app/(ja)/guides/[slug]/page.tsx、src/components/guide/GuideBlocks.tsx、src/components/CompanyExplorer.tsx、src/components/CareerCompassLink.tsx、tests/unit/career-compass-link.cjs、docs/conversion-architecture.md、TASKS.md。
- 実行：node --test tests/unit/career-compass-link.cjs tests/unit/company-explorer.cjs tests/unit/ranking-company-compare.cjs、npm run typecheck（175秒制限）、git diff --check、変更した公開ファイルの禁止語照合。反映・受信確認後14日・28日に検索流入を中心に、位置別の表示→クリック→開始→完了をセッション単位で観察する。

## 2026-10-20：日本地図で探す半導体拠点アプリ

- 既存の全国マップを、複数条件・地図・一覧／表・地域別掲載件数・詳細と実績／予定の時系列が連動する探索アプリへ変更。PCは3列、スマホは地図を先に出し、詳細をネイティブdialogで開く。検索条件・選択を共有URLと履歴へ反映し、自由入力検索語はURL・計測に送らない。
- 既存26拠点にRapidus IIM・キオクシア北上を追加して13社28物理拠点。主要5案件を4物理拠点へ対応付け、同じ敷地の既存工場・新棟を分ける。新設記事の比較表・2件比較・URLを維持し、案件別の地図リンクを追加。記事編集日は10月20日、案件資料の確認日は既存スナップショットと区別する。
- Leaflet 1.9.4と型定義を導入し、地理院淡色地図を遅延取得。地図内に出典を表示。地図ライブラリ・タイル失敗時も一覧を維持する。公式ページの地図案内から9拠点の施設座標を照合し、agent-verifiedと根拠・確認日を保持。旧パイロットの第三者地図由来座標は転用していない。残る19拠点（JASM熊本を含む）は一覧のみで、仮位置のピンを置かない。
- マップ用の会社表示情報を既存Company詳細から分離。Rapidusの会社詳細・会員機能・保存・実行時住所検索・求人API・写真・投資額は追加していない。現行仕様、PRD、構成、SEO、計測、プライバシー説明を更新し、旧V1の人による確認限定条件を承認された照合方法へ改めた。
- 対象単体テストは最終10件すべて成功。初回のSSRテストはHTMLの&エスケープを考慮していないテスト側の誤りで1件失敗し、修正後に成功。既存2案件比較・外資系日本拠点のテストも成功。型チェックは175秒上限付きで1回成功。型チェック後、未確認座標候補を一覧に残せるよう検証条件を修正し、同じ対象単体テスト10件を再実行して成功。型の再実行は回数制限に従い行っていない。
- 実行：npm install（Leafletと型定義、ignore-scripts・no-audit・no-fund）、node --test tests/unit/location-explorer.cjs tests/unit/factory-project-comparison.cjs tests/unit/japan-work.cjs、npm run typecheck、git diff --check、公開禁止語照合。各検証を175秒以内で制限。依存取得はsandboxのDNSエラー後に権限昇格して取得。ホストNodeは24.1.0で、package.jsonの指定（22系）とは異なる。
- ブラウザ・E2E実行・実端末・dev・build・lint・commit・pushは未実施。E2E仕様はPC／スマホの28拠点・選択・条件・戻る・再読込・表・地図失敗・JavaScript無効へ更新。実レイアウト・ネイティブフォーカストラップ・本番反映・イベント受信・検索効果は未確認。反映日を別途記録し、28日・56日後の両URL合算と用途別利用を観察する。

変更ファイル：

- `TASKS.md`
- `docs/PRD.md`
- `docs/architecture.md`
- `docs/conversion-architecture.md`
- `docs/documentation-map.md`
- `docs/factory-project-comparison-spec.md`
- `docs/semiconductor-location-explorer-spec.md`
- `docs/semiconductor-location-map-implementation-plan.md`
- `docs/semiconductor-location-map-review.md`
- `docs/semiconductor-location-map-spec.md`
- `docs/semiconductor-location-map-technical-decision.md`
- `docs/semiconductor-location-map-ui-spec.md`
- `docs/seo.md`
- `package-lock.json`
- `package.json`
- `src/app/(ja)/privacy/page.tsx`
- `src/app/(ja)/semiconductor-map/page.tsx`
- `src/components/FactoryProjectComparison.tsx`
- `src/components/SemiconductorLocationApp.tsx`
- `src/components/SemiconductorLocationCard.tsx`
- `src/components/SemiconductorLocationExplorer.module.css`
- `src/components/SemiconductorLocationExplorer.tsx`
- `src/components/SemiconductorLocationMap.tsx`
- `src/components/SemiconductorPrefectureSelector.tsx`
- `src/content/guides/japan-semiconductor-factory-projects.ts`
- `src/data/company-location-coordinates.ts`
- `src/data/company-locations.ts`
- `src/data/factory-projects.ts`
- `src/data/location-companies.ts`
- `src/lib/analytics.ts`
- `src/lib/company-locations.ts`
- `src/lib/location-explorer.ts`
- `src/types/company-location.ts`
- `tests/e2e/semiconductor-location-map.spec.ts`
- `tests/unit/location-explorer.cjs`

推奨コミット：`feat: add interactive semiconductor location explorer`

## 2026-10-18：業界ウォッチの一覧カード説明を拡大へ集約

- グラフ下の通常の「連結全体」・長い範囲変更・欠測・前年比算出不可の理由を常設表示から外し、該当時だけ「DS部門」「算出値」（営業利益率時）「比較に注意」「○期掲載」を短く表示。主数値の未取得・前年比算出不可、一覧のホバー／キー操作、読み上げ用の欠測理由、初期HTMLの数値表を維持した。
- 拡大ポップアップに「比較上の注意」を常設。同じ選択期間の静的履歴から対象範囲、比較の区切りの前後の期と理由、直近通期の欠測・前年比算出不可理由、算出値の有無・掲載範囲・数値確認日を表示する。開いた期が直近期以外でも説明を読める。データ形式・公開URL・日次タスク対象は変更していない。
- 詳細リンクのmargin-topをautoから8pxへ変更し、掲載期間・短い注記に続けて配置。既存の列数・グラフサイズ・内容に応じたカードの高さ・拡大操作・期間引継ぎを維持。PRD・構成文書・画面仕様と、算出値を確認する既存E2Eの文言期待値を更新した。
- 検証：`node --test tests/unit/watch-explorer.cjs tests/unit/earnings-history.cjs`を175秒上限付きで実行。初回は既存33件が成功し、新規2件が読み上げ用属性を画面の文章として扱うテストの誤りで失敗。表示文章と属性を区別し、属性に理由が残ることも検証するよう修正後、同じコマンドを再実行して35件すべて成功。通常・Samsung・KLA・短い掲載期間・範囲変更・欠測・Intelの説明移動・直近期以外から開いた場合の注意表示を確認した。
- `npm run typecheck`は175秒上限付きで1回実行して成功。`git diff --check`成功。公開禁止語はsrcと対象仕様書で該当なし。実ブラウザ・実端末・E2E実行・dev・build・lint・commit・pushは未実施。実画面・本番反映は未確認。

変更ファイル：

- `src/components/chip-pulse/WatchFinancialCard.tsx`
- `src/components/chip-pulse/WatchFinancialHistory.tsx`
- `src/components/chip-pulse/WatchExplorer.module.css`
- `tests/unit/watch-explorer.cjs`
- `tests/e2e/chip-pulse.spec.ts`
- `docs/PRD.md`
- `docs/architecture.md`
- `docs/semiconductor-watch-editorial.md`
- `TASKS.md`

推奨コミット：`fix: compact watch cards and move details into dialog`

## 2026-10-18：業界ウォッチのグラフ拡大と複合表示

- 一覧の共通縦軸・指標切替・並べ替えを維持し、各グラフのクリック／タップと44px以上の「拡大」ボタンからネイティブdialogを開く。ホバー・左右キー／Home／Endによる一覧の数値確認を残し、選択期はボタンへのフォーカス移動後も引き継ぐ。未選択時は直近期。選択期間5／10／20年を保持し、拡大内の期間切替やURL変更は追加していない。
- 拡大表示は売上高の青い棒・左軸、営業利益率のオレンジの線・右軸。既存の投影・軸・線分処理とサイズ可変の座標計算を使い、企業・期間ごとの全有効値から独立した軸を求める。売上高は0始まり、利益率は赤字・0%を含める。軸名・単位・凡例・「企業ごとの目盛り」を常設し、ホバー／タップ／左右キー／Home／Endで同一期の両指標を確認。欠測や比較不能な境界は補完・接続しない。
- PCは最大960pxの中央表示、767px以下は全画面。閉じるボタン・Escape・背景クリックで終了し、背景へのドラッグでは閉じない。表示中は背景スクロールを止め、終了時にスクロール制御と起点のフォーカスを復帰する。原通貨・前年比・範囲・基準・算出値・欠測理由・掲載期数・数値確認日・為替基準日・FRB出典と期間付き企業別リンクを表示。初期HTMLの数値表、データ形式、日次タスク対象を維持。
- 検証：`node --test tests/unit/watch-explorer.cjs tests/unit/earnings-history.cjs`を175秒上限付きで1回実行、33件すべて成功。`npm run typecheck`も175秒上限付きで1回実行して成功。`git diff --check`成功。公開禁止語はsrcと対象仕様書で該当なし。新しいコンポーネントテストはモックによる操作・開閉・スクロール復帰・フォーカス復帰の処理を確認しており、ブラウザのネイティブフォーカストラップや実レイアウトを確認したものではない。
- E2E仕様を5画面幅での複合表示・選択期・Escape・フォーカス復帰とスマホのタップ・全画面表示へ更新。E2E実行、実ブラウザ・実端末確認、dev・build・lint・commit・pushは未実施。本番反映は未確認。

変更ファイル：

- `src/components/chip-pulse/WatchFinancialHistory.tsx`（新規）
- `src/components/chip-pulse/WatchFinancialChart.tsx`
- `src/components/chip-pulse/WatchFinancialCard.tsx`
- `src/components/chip-pulse/WatchExplorer.tsx`
- `src/components/chip-pulse/WatchExplorer.module.css`
- `tests/unit/watch-explorer.cjs`
- `tests/e2e/chip-pulse.spec.ts`
- `docs/PRD.md`
- `docs/architecture.md`
- `docs/semiconductor-watch-editorial.md`
- `TASKS.md`

推奨コミット：`feat: add expanded watch financial combo charts`

## 2026-10-18：企業研究3ページの役割・主要操作・相互案内を明確化

- 業界地図は企業の役割、国内拠点マップは所在地と拠点の役割、新設・増設記事は建設・試作・量産の段階と予定を冒頭で説明。共通の静的データとServer Componentを追加し、「別の調べ方」では現在のページを除く2リンクを表示。記事への追加は工場新設記事だけに限定した。
- 企業検索、地域・拠点の絞り込み、主要案件一覧、2案件比較への近道を追加。既存アンカーを使い、追加で必要な見出しに88pxのスクロール余白を設定。スマホでは近道を1列にし、案内は折り返しと44px以上のタップ領域を確保。拠点マップ末尾の同じ業界地図URLへの2リンクは1つに整理し、両マップ末尾の相互リンクも共通文言へ揃えた。
- 新しい案内は `research_navigation_click` の source_page・destination・action・ui_version=research-roles-v1で計測。actionはintro_link / related_link / quick_link。既存の地域選択・企業概要・比較・記事本文リンクの計測を維持。タイトル・URL・canonical、データと確認日、拠点検索の初期表示・配置は変更していない。アクセス実数を公開コード・公開文書に転記していない。
- 検証：`npm run typecheck` を175秒上限付きで1回実行し成功。`git diff --check` 成功。対象差分・リンク先・対象slug限定・アンカーID・計測の共通経路・スマホ向けCSSを静的確認。公開禁止語は `src` と導線仕様書で該当なし。ブラウザ・dev・build・commit・pushは未実施。本番反映・新イベント受信・観測開始日は未確認。確認後14日・28日の評価手順を導線仕様書へ記録。
- 推奨コミット：`feat: clarify research page roles and navigation`

## 2026-10-18：TOP冒頭・共通メニューから工場と拠点へ案内

- TOPの目的別入口と共通メニューへ「工場・拠点を探す」を追加し、既存の `/#home-factories` の2カードへ接続。TOPは5入口を指定順に配置し、PCでは最後のキャリアを横幅いっぱい、720px以下は1列にする。移動先に88pxのスクロール余白を設定。
- ヘッダーの横並び開始幅をCSS・JavaScriptとも1160pxへ変更。既存の開閉・フォーカス処理と表示形式の計測にも同じ判定を使用。TOPは `home_link_click` の `section_id=hero`・`destination_id=factories`・`purpose=industry`、共通メニューは `header_nav_click` の `destination_id=factories` で記録する。
- 検証：`npm run typecheck` を1回実行して成功。`git diff --check` と対象差分・リンク先・幅判定・メニューを閉じる処理を静的確認。公開禁止語は `src` と導線仕様書で該当なし。ブラウザ確認・build・commit・pushは未実施。本番反映・GA4受信は未確認。
- 推奨コミット：`feat: add factory navigation to hero and header`

## 2026-10-18：円換算売上高の棒グラフ・ロゴ・数値確認・並べ替え

- 初期を売上高・10年・円換算売上高の降順へ変更。主数値は直近通期の「約○兆円／○億円」、前年比と期末年月を補足し、売上高を棒、営業利益率を折れ線で表示。既存ロゴをPC・スマホへ復帰し、6／4／3／2列・最小180pxで内容に応じて伸ばす。48px高のグラフに共通軸・単位・目盛り・ゼロ線・比較不能な境界を表示する。
- FRB H.10の2026-10-13公表、2026-10-09列を2026-10-18に原資料で再確認。円／ドル・ドル／ユーロ・ウォン／ドル・台湾ドル／ドルの原値、出典と箇所・基準日・公表日・確認日を新しい静的JSONへ保持。全社・全期間へ同一為替を適用し、規模比較用の概算と表示。原通貨・前年比を保ち、過去当時の円建て実績と区別。企業詳細・比較のグラフ、年次の原通貨データ、日次固定6ファイルと権限は変更していない。
- グラフを詳細リンクから分離。ホバー・タップ・左右キー／Home／Endで各期の金額・原通貨・範囲・率・欠測理由をカード内へ表示し、Escape・blurで閉じる。指標・期間をkeyにして表示をリセット。企業名／主数値と末尾の「業績・出典を見る」から通常文書遷移で期間を引き継ぐ。SSR数値表には円換算額・原数値・前年実績・前年比・理由を保持。
- 売上高側は売上高順／売上前年比順、利益率側は利益率順。丸め前で降順、同値は元の企業順、算出不可は末尾。sort=growthだけhashへ保存し、利益率から戻っても保持。無指定・不正値は売上高順、旧operating_income指定は売上高に復元する。下段の最新四半期とニュースの順序は維持。既存filterイベントへdimension=sortを追加し、初期表示・復元・同じ選択では送らず、グラフ値の確認は計測・保存しない。
- PRD・構成・画面仕様・metadata・計測と固定為替の更新手順を整合。新規依存・閲覧時取得・日次更新の追加は行っていない。

検証と実行コマンド：

- `node --test tests/unit/watch-explorer.cjs tests/unit/earnings-history.cjs`：Python subprocessの175秒上限付きで1回実行、28件すべて成功。5通貨と百万／十億単位・ユーロ方向・円等倍・固定為替での前年比不変、通期による順序／同値／欠測／丸め前比較、全テーマ×指標×期間×sort、履歴・イベント重複防止、SSRロゴ／数値表／原資料、ホバー／タップ／キー操作／欠測理由／境界／リンク分離と既存企業別・比較を確認。
- `npm run typecheck`：175秒上限付きで最大1回実行し成功。
- `git diff --check`と公開禁止語・差分の点検：成功。公開差分に非公開の取材・個人情報を含めていない。
- E2E仕様は5画面幅・棒／ロゴ・数値操作・並べ替え・タッチ操作へ更新したが、Playwrightランナー・実ブラウザ・実端末は未実行。実画面・本番反映・GA4受信は未確認。dev・build・lint・ブラウザ操作・commit・pushは未実施。

変更ファイル：

- `src/data/watch-exchange-rates.json`（新規）
- `src/lib/watch-financials.ts`・`src/lib/watch-explorer.ts`
- `src/components/chip-pulse/WatchFinancialChart.tsx`（新規）・`WatchFinancialCard.tsx`・`WatchExplorer.tsx`・`WatchExplorer.module.css`
- `src/app/(ja)/semiconductor-watch/page.tsx`
- `tests/unit/watch-explorer.cjs`・`tests/e2e/chip-pulse.spec.ts`
- `docs/PRD.md`・`docs/architecture.md`・`docs/semiconductor-watch-editorial.md`・`docs/earnings-ir-operations.md`・`docs/conversion-architecture.md`
- `TASKS.md`

推奨コミット：`feat: compare watch revenues with fixed yen bars`

## 2026-10-18：業界ウォッチを小型の成長率・利益率カードへ変更

- 一覧の指標を「売上の伸び」（通期売上前年比）と「営業利益率」に整理。初期は売上の伸び・10年、5／10／20年を維持。金額の長期推移と出典は既存の企業詳細に保持し、企業別分析・比較ページ・年次データ・日次固定6ファイルは変更していない。
- カードは最小180px高・小グラフ36px高・ロゴなし。1280px以上6列、1024〜1279px4列、768〜1023px3列、767px以下2列。企業名・範囲・欠測理由を省略せず、長い場合は高さを伸ばす。共通縦軸・0%破線・各社の決算期／範囲の違いを説明する。
- 前年比は期間切出し前の実績から算出し、最初の表示年も期間外の前年を利用。前年欠測・前年売上ゼロ以下・比較不能な境界では算出せず、直近期の欠測を過去値で代用しない。共通軸は指標・期間ごとに全12社から求め、テーマ変更で変えず極端な値を切らない。初期HTMLの数値表に元売上・前年期末日／前年売上・算出不可理由を保持。
- テーマ・期間・企業強調・履歴復元・企業別年次への期間引継ぎ・通常文書遷移と既存イベントを維持。指標IDはrevenue／operating_margin、旧operating_incomeはrevenueへ復元。Samsung DS部門・KLA営業利益率の元になる営業利益の算出注記を維持。metadata・PRD・構成・画面仕様・計測文書を更新。

検証と実行コマンド：

- `node --test tests/unit/watch-explorer.cjs tests/unit/earnings-history.cjs`：Python subprocessの175秒上限付きで1回実行、24件すべて成功。前年比・減収・ゼロ売上・前年欠測・比較不能な変更・期間外の前年参照・共通軸・極端値・履歴復元・イベント重複防止・SSR数値表・企業詳細／比較の維持を確認。
- `npm run typecheck`：同じく175秒上限付きで最大1回実行し成功。
- `git diff --check`・公開禁止語と差分の点検：成功。公開差分に非公開の取材・個人情報を含めていない。
- E2E仕様を6／4／3／2列と2指標へ更新したが、テストランナー・実ブラウザ・実端末では未確認。dev・build・lint・ブラウザ操作・commit・pushは未実施。本番反映・GA4受信も未確認。

変更ファイル：

- `src/app/(ja)/semiconductor-watch/page.tsx`
- `src/components/chip-pulse/WatchExplorer.tsx`・`WatchExplorer.module.css`・`WatchFinancialCard.tsx`
- `src/lib/watch-financials.ts`
- `tests/unit/watch-explorer.cjs`・`tests/e2e/chip-pulse.spec.ts`
- `docs/PRD.md`・`docs/architecture.md`・`docs/semiconductor-watch-editorial.md`・`docs/conversion-architecture.md`
- `TASKS.md`

推奨コミット：`feat: show watch growth and margins in compact cards`

## 2026-10-18：財務グラフを最大20期へ拡張

- 既存12社の公式年報・有報・SEC提出資料・公式通期発表から218期を掲載。9社は20期、キオクシア7期、SK hynix17期、Samsung DS14期。古い期を未掲載とする理由、掲載期間、原通貨・単位・基準・範囲を明記。前身企業の別範囲やダミー値で補完していない。既存直近5期の数値も再照合し、丸め・修正表示との整合を確認。数値ごとの出典・箇所を保持し、KLAの算出式と費用の二重控除防止も照合した。各社の範囲・採用資料・不足と境界は[収集記録](docs/earnings-long-history-audit.md)を参照。
- watch・企業別・比較に5／10／20年、既定10年を追加。最新期末から期間を抽出し、欠測を古い期で穴埋めしない。指標・テーマを変えても期間を維持し、カードのグラフ・掲載年月・読み上げ説明を同時更新。実際の期末日と独立したカード縦軸を維持し、企業別の棒グラフの目盛りを間引いた。欠測・赤字・ゼロ基準線・部門・算出値の扱いを維持。
- 共通期間型と不正値の10年への復元を実装。watchはhashのyears、企業別・比較はクエリyearsで引き継ぐ。企業指定・テーマ・指標・旧ニュースアンカー・#annual-history・戻る／進むを保持。canonicalは基底URL、期間指定付き企業別と条件付き比較はnoindex/follow。比較指数は選択期間内で直近期につながる比較可能区間の最古期=100とし、起点を明記。会計基準・範囲・未照合の修正表示・確認した買収／売却の境界は接続しない。
- 「長期推移を読む」へ各社最大3件の背景注記を追加。対象期・会社説明／編集上の解釈・原資料と箇所・確認日を保持。AI・HBM・データセンターに加え、在庫・価格・費用管理・買収・再編を扱い、全社増収をAI需要の寄与額とはみなさない。既存四半期の補足にはその対象期と元の確認日を保持。
- 期間操作はwatchでchip_pulse_filter_changeのdimension=period、企業別・比較でearnings_history_actionのaction=period_select。選択yearsを付け、cards-v2／annual-v2へ更新。初期表示・履歴復元・同じ指標／期間の再押下は操作イベントを送らない。既存リンク・原資料の計測、年次と最新四半期の分離、日次固定6ファイル・commit/push権限は維持。新規依存・閲覧時API・DBは追加していない。

検証と実行コマンド（対象検証はPython subprocessのtimeout=175付き）：

- `node --test tests/unit/earnings-history.cjs tests/unit/watch-explorer.cjs`：21件中20件成功、1件失敗。期間抽出、短い履歴、欠測・赤字・ゼロ除算、指数、異通貨、テーマ×指標×期間、hashと期間引継ぎ、実コンポーネントの操作／履歴復元とイベント重複防止、12社のSSR・出典・リンク、社数制限、既存四半期・metadataを確認。失敗は範囲変更／期間欠落のテスト用日付を別の期末と重複させたことで、起点の検索が別行を拾ったもの。fixtureを重複しない日付と同じperiod参照の検索へ修正。再実行禁止に従い修正後の完走は未確認。後半で追加した買収境界・注記も単体テストの再実行対象にしていない。
- `npm run earnings:history:check`：成功（12社218期）。買収境界・背景注記を追記したため、その実データ変更後に同コマンドをもう1回実行し成功。失敗した検証の再試行ではない。
- `npm run dev -- --webpack --hostname 127.0.0.1 --port 3100`：画面確認時のみ権限昇格で起動、175秒のプロセス監視付き。主検証後にプロセス群を停止し、その後型チェックを実施。
- browser-actスキルの専用ChromeセッションとCDPを使用。`node /tmp/watch-long-history-qa.cjs`：成功。1280・1024pxは4列、768pxは3列、390・320pxは2列。12カードは全幅で220px、図50px、文字・単位のはみ出しとページ横スクロールなし。5幅で10年初期・20／5年・指標・テーマ保持・戻る／進むを確認。企業hashの強調、キーボードEnter、カード→企業別→比較への20年引継ぎ、数値表20／40／10行、比較から戻る操作、最新四半期切替、キオクシア7期、旧ニュースアンカーを確認。pageerrorは0。結果は`/tmp/watch-long-history-qa.json`。`tests/e2e/*.spec.ts`を更新したが、Playwrightテストランナーは未実行。
- `npm run typecheck`：dev停止後、175秒上限・最大1回で成功。型チェック後の編集はデータの境界・注記と公開文書・作業記録のみ。追加の型チェックは行っていない。
- PC・スマホの冒頭画像を`/tmp/watch-long-history-desktop.png`・`/tmp/watch-long-history-mobile.png`へ保存して目視確認。画像と5幅の主検証は買収境界・背景注記の最終追記前。最終データの追加撮影用にdevと別の専用セッションを起動し、`node /tmp/watch-long-final-screens.cjs`を175秒上限で実行したが、SVGのpolylineをpathと誤指定した追加assertでタイムアウトし、画像保存前に停止。期間20年・20点の表示までは通過。再撮影は繰り返しておらず、最終境界追記後の画像は未取得。devプロセス群と専用セッションは停止・閉鎖済み。BrowserAct手順の再読込はsandboxのログ書込権限エラー後、権限昇格で取得した（画面検証の再実行ではない）。
- 公式資料の取得・表抽出に一時PythonスクリプトとPDFスキルを使用。調査資料は非公開作業領域、PDF抽出用ライブラリは/tmpのみへ置き、package.json・ロックファイルを変更していない。
- `git diff --check`成功。src全体・変更公開文書・本記録を公開禁止辞書と部分一致照合し該当なし。差分を点検し、非公開の取材・オファー・分析数値を転載していない。変更28ファイルを下記へ列挙。既存四半期・予定データ、日次運用、package.json・ロックファイルは変更なし。一時CDP接続情報は削除済み。
- build・lint・commit・pushは未実施。本番反映・GA4属性登録／イベント受信・28日観測開始は未確認。

変更ファイル：

- `TASKS.md`
- `docs/PRD.md`
- `docs/architecture.md`
- `docs/conversion-architecture.md`
- `docs/documentation-map.md`
- `docs/earnings-ir-operations.md`
- `docs/earnings-long-history-audit.md`
- `docs/semiconductor-watch-editorial.md`
- `scripts/earnings-history-check.cjs`
- `src/app/(ja)/semiconductor-watch/earnings/[companyId]/page.tsx`
- `src/app/(ja)/semiconductor-watch/earnings/compare/page.tsx`
- `src/app/(ja)/semiconductor-watch/page.tsx`
- `src/components/chip-pulse/WatchExplorer.module.css`
- `src/components/chip-pulse/WatchExplorer.tsx`
- `src/components/chip-pulse/WatchFinancialCard.tsx`
- `src/components/earnings/AnnualCharts.tsx`
- `src/components/earnings/AnnualCompanyExplorer.tsx`
- `src/components/earnings/AnnualCompare.tsx`
- `src/components/earnings/AnnualHistory.tsx`
- `src/components/earnings/AnnualPeriodControl.tsx`
- `src/components/earnings/EarningsAnalysisCompare.tsx`
- `src/data/earnings-history.json`
- `src/lib/earnings-history-math.ts`
- `src/lib/watch-explorer.ts`
- `tests/e2e/chip-pulse.spec.ts`
- `tests/e2e/earnings.spec.ts`
- `tests/unit/earnings-history.cjs`
- `tests/unit/watch-explorer.cjs`

推奨コミット：`feat: extend financial histories to twenty years`

## 2026-10-18：業界ウォッチを12社の財務カードへ再設計

- 冒頭を年次5年の12社カードへ置換。初期は売上高、営業利益・営業利益率を一括切替し、原通貨の十億単位・約50px高の青いSVG・実際の期末年月・連結／部門範囲を表示。企業間の規模比較ではないと明記。欠測を補完せず、比較不能な境界を接続しない。赤字のゼロ線、Samsung DS部門、KLA営業利益の算出値を維持。初期HTMLへ対応数値表を出力し、詳細の出典・確認日・計算式へ接続する。
- 最大1180px、1024px以上4列・768〜1023px3列・767px以下2列。カード220px・12px角丸・薄い罫線、企業名は省略せず折返し。PCのみ既存ロゴを48px幅で添え、強い影・初期アニメーションは追加していない。読み上げ用の表はクリップ用ラッパーに収め、表の最小内容幅による横はみ出しを修正。
- カード全体から企業別`#annual-history`へ直接遷移。既存MediaLinkの計測を再利用し、カードのみ通常の文書遷移にして、Nextのhash履歴と詳細へのクライアント遷移の組合せで戻り先が古い指標になる問題を回避。大きな要点パネルと前年比棒グラフは削除。最新四半期の金額・前年比・対象期間・範囲・要点・原資料・確認状態・次回決算は下段の「最新四半期の決算一覧」へ保持し、その後にテーマニュース・発表予定を続ける。
- WatchMetricとhashへ`revenue/operating_income/operating_margin`を追加。テーマ変更でも指標を保持。企業は明示された有効IDだけ強調し、未指定・テーマ対象外は強調なし。テーマ・指標・企業指定・旧ニュースアンカー・戻る／進むの復元を維持。指標変更は`chip_pulse_metric_select`、カード遷移は既存`chip_pulse_read`、トップの画面版は`cards-v1`。初期描画・履歴復元・同じ指標の再押下は操作イベントを送らない。
- 年次データ・企業別分析・比較・日次固定6ファイルと更新権限は変更していない。PRD・architecture・編集仕様・計測文書とmetadataを更新。本番反映・イベント受信・28日観測開始は未確認。

検証と実行コマンド：

- `node --test tests/unit/watch-explorer.cjs tests/unit/earnings-history.cjs`：初回17件成功。四半期の金額表示・通常文書遷移の追加後に更新したテストを実行し18件成功。いずれも175秒上限。3指標、欠測・赤字・ゼロ除算・範囲変更、全テーマと指標の組合せ、hash・イベント重複防止、12社の初期HTMLとリンク先、既存企業別分析・比較・四半期・出典を確認。後続の数値表のクリップ用ラッパー変更はブラウザと型チェックで確認。
- `npm run dev -- --webpack --hostname 127.0.0.1 --port 3100`：画面確認時のみ起動。初回sandboxのbind拒否後、権限昇格で起動。修正時に一度停止・再起動し、最後のサーバーは175秒の監視上限で停止済み。その後に型チェックを実施。ブラウザ専用セッションも閉じた。
- browser-actスキルの`--version`・`get-skills core --skill-version 2.0.2`・専用`browser open`・`state/eval/get cdp-url`・`session close`を使用。CDPで同セッションの実Chromeを指定幅にして計測。1280px・1024pxは4列、768pxは3列、390px・320pxは2列を確認。12カードの高さ220px・図50px、文字・単位のはみ出しなし、ページ横スクロールなしを確認。PCとスマホの冒頭を`/tmp/watch-cards-desktop.png`・`/tmp/watch-cards-mobile.png`へ保存し目視確認。
- 一時CDPスクリプト`node /tmp/watch-cards-qa.cjs`でPCの指標切替・テーマ保持・キーボードEnter・企業年次への遷移・戻る／進むを確認。企業詳細から戻る時のロード待ちがタイムアウトしたが、その時点のURLと表示テーマ・指標の一致は別途読み取り確認できた。一括の自動ブラウザ検証は成功扱いにしていない。
- `node /tmp/watch-cards-layout.cjs`は1024pxのレイアウト確認後、切替直後の即時属性判定で停止。`node /tmp/watch-cards-remaining.cjs`は未確認だった768・390・320pxのレイアウト確認に成功。`node /tmp/watch-cards-anchors.cjs`はdev停止後の接続拒否で未実施。モバイル各幅の全操作、および企業指定・旧アンカー・四半期展開の実ブラウザ確認は未完了（対応する単体・SSR検証は成功）。失敗した検証は別設定で繰り返していない。`tests/e2e/chip-pulse.spec.ts`を新UIへ更新したがテストランナーは未実行。
- `npm run typecheck`：175秒上限・最大1回で成功。`git diff --check`と公開禁止語・差分の点検で問題なし。公開差分へ非公開の取材・分析数値を転載していない。build・lint・commit・pushは未実施。

変更ファイル：`src/app/(ja)/semiconductor-watch/page.tsx`、`src/components/chip-pulse/WatchExplorer.tsx`・`WatchExplorer.module.css`・`WatchFinancialCard.tsx`・`MediaLinks.tsx`、`src/lib/watch-explorer.ts`・`watch-financials.ts`・`watch.ts`、`tests/unit/watch-explorer.cjs`・`tests/e2e/chip-pulse.spec.ts`、`docs/PRD.md`・`architecture.md`・`semiconductor-watch-editorial.md`・`conversion-architecture.md`、本記録。

推奨コミット：`feat: redesign semiconductor watch with compact financial cards`

## 2026-10-18：業界ウォッチへ年次5年の企業分析を追加

- 既存12社×5期（60期間）の売上高・営業利益を公式IR・SECの原資料で照合し、`earnings-history.json`へ数値・期間・通貨・単位・範囲・会計基準・確認日・出典と該当箇所を記録。ASMLはUS GAAP、キオクシアはIFRS、SamsungはDS部門を維持。KLA営業利益は独立行がないため営業費用控除の式・入力値と「算出」を併記。資料の暫定・監査前・丸め条件を画面と更新手順に残した。
- watchの既存前年比・テーマ・企業選択に、選択企業の通期売上高ミニグラフ・出典付き表・年次詳細リンクを追加。企業別決算に金額棒グラフ・利益率線グラフ・初期HTMLの数値表を追加し、既存決算要点と四半期データは維持。SVGの読み上げタイトル、スマホ縦配置・表内スクロールを用意した。
- 比較は年次5年を初期表示に最新四半期へ切替。装置・メモリの2〜3社で利益率または最古期=100の売上高指数を比較し、横軸は実際の期末日、表は原通貨。欠測・ゼロ以下の売上高・基準／範囲／通貨変更・期間欠落は補完・接続しない。企業別から群・企業を引継ぎ、不正IDは初期2社へ戻す。条件付き比較URLのcanonical/noindexを設定し、既存URLとsitemap・構造化データ更新日を整合させた。
- 指標切替・年次比較を`earnings_history_action`の`annual-v1`で識別。既存リンク・出典・四半期比較のイベントは維持。初期描画では操作イベントを送らない。年次専用検証と通期公表・訂正時の更新手順を追加し、日次の固定6ファイル・commit/push権限は拡張していない。
- `node --test tests/unit/earnings-history.cjs tests/unit/earnings.cjs tests/unit/watch-explorer.cjs`を175秒上限で1回実行し20件成功。計算・欠測・赤字・ゼロ除算・出典検証・範囲変更・指数起点・異通貨・社数制限・計測・SSR・metadata・最新四半期の維持、既存hash／旧アンカー／モバイルのフォーカス処理を確認した。テスト時のSVG titleのReact警告は単一文字列へ修正し、変更後のSSRだけを`node --test --test-name-pattern='SSR exposes' tests/unit/earnings-history.cjs`で再確認、1件成功・標準エラー出力なし。
- `npm run typecheck`と`npm run earnings:history:check`をそれぞれ175秒上限で1回実行し成功。型チェック後の変更はwatchの構造化データ更新日の式とCSSのmin-width指定。追加の型チェックは実行していない。E2E仕様を年次初期表示と期間切替へ更新したが、実ブラウザは未実行。dev・build・lint・commit・pushは未実施。本番反映・GA4受信・観測開始・実画面は未確認。
- `git diff --check`成功。src全体・対象公開文書・作業記録の公開禁止語照合で該当なし。公開差分に非公開の取材・分析情報は含めていない。
- 変更ファイル：`src/data/earnings-history.json`、`src/lib/earnings-history.ts`・`earnings-history-math.ts`、`src/components/earnings/AnnualCharts.tsx`・`AnnualHistory.tsx`・`AnnualHistory.module.css`・`AnnualCompare.tsx`・`EarningsAnalysisCompare.tsx`、`src/components/chip-pulse/WatchExplorer.tsx`・`WatchExplorer.module.css`、`src/app/(ja)/semiconductor-watch/page.tsx`・`earnings/[companyId]/page.tsx`・`earnings/compare/page.tsx`、`src/app/sitemap.ts`、`scripts/earnings-history-check.cjs`、`package.json`、`tests/unit/earnings-history.cjs`・`tests/e2e/earnings.spec.ts`、`docs/PRD.md`・`architecture.md`・`earnings-ir-operations.md`・`semiconductor-watch-editorial.md`・`conversion-architecture.md`、本記録。
- 推奨コミット：`feat: add five-year financial analysis to semiconductor watch`

## 2026-10-18：工場マップ・新設一覧をトップの主要入口へ追加

- ランキング直後、技術ツールの前に「半導体工場を場所・計画から探す」を追加。工場・研究拠点マップ、新設・増設一覧の順にカード全体から直接アクセスできる。既存カードのデザインでPCは2列、720px以下は1列とし、画像・操作プレビューは追加していない。
- リンク定義を `homeFactoryLinks` に集約し、`HomeSection` に `factories` を追加。既存の `home_link_click` へ `section_id=factories`・`destination_id=semiconductor_map/factory_projects`・`purpose=industry` を送る。共通ヘッダー・リンク先本文・URL・SEO設定は変更していない。
- 導線と本番反映・受信確認後28日間の観測方法を計測文書へ反映。本番反映・GA4受信・実画面・観測開始日は未確認。
- `npm run typecheck` を175秒上限で1回実行し成功。配置順・文言・リンク先・既存の720px以下1列指定・計測属性を静的確認し、`git diff --check` とsrc全体・対象公開文書の公開禁止語照合も成功。dev・build・lint・ブラウザ操作・commit・pushは未実施。
- 変更ファイル：`src/app/(ja)/page.tsx`、`src/data/home.ts`、`docs/conversion-architecture.md`、本記録。
- 推奨コミット：`feat: promote factory map and projects on homepage`

## 2026-10-17：日本の時価総額ランキングを18社へ拡充

- 現在のCompaniesMarketCap Semiconductorsカテゴリ全2ページから日本企業18社を全件掲載。従来10社にMARUWA、日本マイクロニクス、テクセンドフォトマスク、ソシオネクスト、トーメンデバイス、TOWA、RS Technologies、サンケン電気を追加し、10社制限を撤去した。追加8社の順位・数値・ティッカーは同カテゴリ2ページ目で照合し、個社ページの異なる取得時点の値を混ぜていない。2026-10-16基準・10-17確認、世界30社と参考トヨタの既存値を維持。
- 公式情報で主な事業と分類を確認し、記事sourcesへ出典9件（ランキング2ページ目＋公式8社）を追加。商社とフォトマスク材料の役割説明に対応。ソシオネクストは既存企業詳細へリンク。日本の関連企業を網羅する一覧とは表現しない。
- タイトル・冒頭・目次・表・metadata・本文を「日本18社」へ揃え、関連記事2本の現在ランキングへの案内と編集更新日も更新。表は18社＋順位外トヨタの19行、比較ボタンは世界30＋日本18の計48個、比較カタログは重複除外46社。タイムマシンの固定10社・年末履歴は変更していない。
- `node tests/unit/ranking-company-compare.cjs`と`npm run typecheck`を175秒上限のプロセス監視付きで各1回実行し、両方成功。18社の連番・金額順・ID/ティッカーの一意性・基準日・出典、追加8社の比較選択と共有URL、追加企業ペアの状態・計測、全社の情報開閉SSRと参考行19行、世界表、旧比較URL、記事全体SSR・metadata・構造化データを確認。
- `git diff --check`と、src全体・対象公開文書の公開禁止語照合を実施。dev・build・lint・ブラウザ操作・commit・pushは未実施。実画面・本番反映は未確認。
- 変更ファイル：`src/data/semiconductor-market-cap.ts`、`src/components/MarketCapRankingTable.tsx`、`src/lib/ranking-company-compare.ts`、`src/content/guides/semiconductor-market-cap-ranking.ts`・`japan-semiconductor-market-cap-history.ts`・`semiconductor-equipment-sales-ranking.ts`、`tests/unit/ranking-company-compare.cjs`、`docs/PRD.md`・`architecture.md`・`ranking-company-comparison-spec.md`、本記録。
- 推奨コミット：`feat: expand Japan market cap ranking to 18 companies`

## 2026-10-17：ランキングの横スクロール解消と2社比較パネル

- 時価総額ランキング記事だけを順位・企業名・時価総額・比較の4列へ整理。国・地域／ティッカー／分類／主な事業をnative detailsへ移し、全情報のSSR、世界・国内順位、金額棒・対トヨタ倍率、参考行の順序と対象外の扱いを保持。記事欄の幅で600px未満を縦配置にする。
- 比較ボタンは「＋ 比較」「✓ 選択中」。画面下のA/B選択枠と有効化される主CTAからnative dialogを開く。PC中央／スマホ全画面、固定ヘッダー・概要／日本の仕事タブ、2社共通尺度の棒、関連導線・コピーと手動コピーを用意。Escape・背景クリック・閉じる、フォーカス復帰、背景スクロール制御に対応。世界・日本の選択共有、固定IDの共有URL、既存計測を維持。データ値・検索設定・他記事・依存・保存先は変更なし。
- `npm run typecheck`は175秒上限で1回、成功。`node tests/unit/ranking-company-compare.cjs`は175秒上限で1回実行し、データ・表SSR・全社情報・参考値条件／順序／棒・URL等を通過後、状態テストのPortal用仮DOM不足で停止。createPortalのモックを修正済みだが再実行なし。後続の記事全体SSR・metadataと修正後の完走は未確認。
- ブラウザテストを360／390／768／1280pxの表・詳細展開・比較パネル、選択・タブ・フォーカス／スクロール復帰、共有・コピー・地図導線に更新し、`node --check tests/browser/ranking-company-compare.cjs`は成功。実ブラウザ・各幅の表示・本番反映・GA4は未確認。dev・build・lint・commit・pushは未実施。
- `git diff --check`成功。src全体と対象公開文書の禁止語検索で該当なし。
- 変更ファイル：`src/components/MarketCapRankingTable.tsx`・同CSS Module、`src/components/RankingCompanyCompare.tsx`・同CSS Module、`tests/unit/ranking-company-compare.cjs`、`tests/browser/ranking-company-compare.cjs`、`docs/architecture.md`・`ranking-company-comparison-spec.md`、本記録。
- 推奨コミット：`feat: improve ranking layout and company comparison dialog`

## 2026-10-17：元のタイトル全文を保ち、表示の大きさと配置を整理

- ユーザーの指定により、画面のh1を検索用guide.titleと同じ「半導体メーカー世界ランキング【2026年10月】時価総額TOP30・日本TOP10」の全文へ戻した。記事名は28〜36px、年月と比較範囲は小さく配置し、記事名の2語・年月・比較範囲のまとまりを保って折り返す。
- 年月は既存guide.titleから参照し、別の日付定義や「最新」は追加していない。比較範囲の独立した補足段落をh1内へまとめ、短い結論・基準日／更新日／執筆者・移動リンクは維持した。検索用タイトル・description・構造化データ・canonical・本文・ランキング本体・他記事・共通型は変更していない。
- `node tests/unit/ranking-company-compare.cjs`と`npm run typecheck`を175秒上限で各1回実行し、どちらも成功。h1全文とguide.titleの一致、年月の一度だけの表示と参照元、各語のまとまり、重複する補足段落の除去、既存結論・日付・metadata・構造化データ・他記事表示、既存ランキング／参考トヨタ／比較の回帰確認を通過した。
- 差分と対象公開ファイルの禁止語を確認。dev・build・lint・ブラウザ操作・commit・pushは未実施。実画面・本番反映は未確認。
- 変更ファイル：`src/app/(ja)/guides/[slug]/page.tsx`、`src/app/globals.css`、`src/content/guides/semiconductor-market-cap-ranking.ts`、`tests/unit/ranking-company-compare.cjs`、`docs/architecture.md`・`seo.md`、本記録。
- 推奨コミット：`style: restore full ranking title with readable typography`

## 2026-10-17：トヨタの参考行を金額順に挿入

- 時価総額記事の世界・日本両一覧で、トヨタを表示時だけ金額の降順に挿入。2026-10-16基準の掲載値では世界のArm（14位）とKLA（15位）の間、日本の東京エレクトロン（国内1位）の前に表示する。同額の場合は同額の半導体企業の後ろに置く。
- tfootの固定末尾行を廃止し、同じtbodyへ参考行を一度だけ挿入。世界31行・日本11行。元のランキング配列と半導体企業の世界・国内順位は変更せず、トヨタの順位欄は空欄、読み上げでは順位対象外とした。企業名横の「参考」と淡い背景で区別し、比較ボタンは付けない。
- スマホの縦配置、金額・棒・倍率、出典・基準日・確認日・過去年末比較リンク、参考値が無効な場合の非表示を維持。公開API・データ型・検索設定・他記事・データ値は変更していない。
- `node tests/unit/ranking-company-compare.cjs`と`npm run typecheck`を175秒上限で各1回実行し、どちらも成功。掲載値の挿入位置、最大・最小・同額（同額企業が複数の場合も含む）、参考値が無効な場合、全社情報・順位・比較ボタン40件、参考行の空の順位欄と読み上げ、元配列の非変更、棒の比率と倍率を確認した。前回まで未完了だった記事全体SSR・metadata・構造化データ・他記事表示のテストも完走した。
- 差分と対象公開ファイルの禁止語を確認。dev・build・lint・ブラウザ操作・commit・pushは未実施。実画面・本番反映は未確認。
- 変更ファイル：`src/components/MarketCapRankingTable.tsx`・同CSS Module、`tests/unit/ranking-company-compare.cjs`、`docs/architecture.md`・`ranking-company-comparison-spec.md`、本記録。
- 推奨コミット：`refactor: position Toyota benchmark by market cap`

## 2026-10-17：時価総額記事の冒頭を短縮し、折り返しを整理

- 対象記事だけで画面のh1を「半導体メーカー世界ランキング」へ短縮し、「時価総額｜世界TOP30・日本TOP10」と1位の結論を別表示。カテゴリ・読了時間・著者の経験年数・冒頭のトヨタ比較説明を外し、基準日・更新日・執筆／確認者を小さな情報欄へ集約した。ランキング部分のトヨタ説明は維持。
- 表示文言は既存記事モジュールの専用設定に置き、結論の企業名は既存ランキングから参照。基準日・更新日を重複定義せず、h1の2語・比較範囲・日付を途中で分断しないSSRと専用CSSにした。見出しは28〜36px、既存の移動リンクとの間隔を縮めた。
- 検索用guide.title・description・構造化データ・canonical・sitemap・本文・ランキング本体・他記事・共通型は変更していない。
- `npm run typecheck`は1回実行し成功。`node tests/unit/ranking-company-compare.cjs`も1回実行。前回の統合表示の全社情報・参考値表示条件・倍率・棒の比率・既存選択処理と、今回の短いh1・比較範囲・結論・基準日／更新日・冒頭の削除項目のSSR確認を通過した。その後、前回追加した記事全体の棒数assertがタイムマシンの20本まで数えて62本となり停止した。集計範囲を時価総額ランキング部分に限定して修正済み。再試行制限に従い再実行していないため、修正後の完走と後続のmetadata・構造化データ・他記事表示等のassertは未確認。
- 差分と対象公開ファイルの禁止語を確認。dev・build・lint・ブラウザ操作・commit・pushは未実施。実画面・本番反映・検索への影響は未確認。
- 変更ファイル：`src/app/(ja)/guides/[slug]/page.tsx`、`src/app/globals.css`、`src/content/guides/semiconductor-market-cap-ranking.ts`、`tests/unit/ranking-company-compare.cjs`、`docs/architecture.md`・`seo.md`、本記録。
- 推奨コミット：`style: simplify market cap ranking article introduction`

## 2026-10-17：時価総額ランキングのグラフと表を統合

- 対象記事だけで独立した上位10社グラフを外し、世界30社・日本10社の既存表の金額欄へ棒と対トヨタ倍率を統合。企業情報・企業リンク・比較ボタンを残し、参考のトヨタは順位・比較ボタンのないtfoot行へ移した。出典・基準日・確認日・過去年末比較リンクを維持した。
- 専用CSS Moduleで960px未満を縦配置にし、順位・企業名・金額・棒を先に表示。同じ初期HTMLに全情報を保持し、折りたたみや表示切替は追加していない。他記事の共通グラフ、記事URL・タイトル・見出し・解説文・検索設定・データ値は変更していない。
- `npm run typecheck`は1回実行して成功。`node tests/unit/ranking-company-compare.cjs`は1回実行し、倍率内の「トヨタ」を参考企業の混入と誤認する旧assertで停止。企業名「トヨタ自動車」に判定を限定して修正したが、再試行制限に従い再実行していない。停止後の全社情報・参考値非表示・棒の比率・記事全体SSR等のassertは未実行。型チェックはテスト判定修正前に成功しており、公開コードはその後変更していない。
- 差分と対象公開ファイルの禁止語を確認。dev・build・lint・ブラウザ操作・commit・pushは未実施。実画面・本番反映・Search Console確認は未実施。実際の本番反映日を記録して前後28日を比較する手順をdocs/seo.mdに記載した。
- 変更ファイル：`src/components/MarketCapRankingTable.tsx`・同CSS Module、`tests/unit/ranking-company-compare.cjs`、`docs/architecture.md`・`seo.md`、本記録。
- 推奨コミット：`refactor: unify market cap ranking charts and tables`

## 2026-10-17：ランキングを10月16日基準へ更新し、トヨタ比較の保留を解消

- ユーザー指定により、世界TOP30・日本TOP10と参考のトヨタを2026-10-16基準・10-17確認へ一括更新。CompaniesMarketCapの世界30社＋日本の圏外8社を同じ一覧で確認し、全38社の順位・数値を出典と照合した。NVIDIA・TSMC・トヨタの個社ページの日次記載で10-16を確認し、NVIDIAはStock Analysisでも同日5.17T USDを照合した。各市場の更新時刻・為替反映差は本文で説明する。
- トヨタをverified・229.21B USDへ変更し、世界・日本両グラフの参考バー・倍率・出典説明と過去年末比較リンクを表示。NVIDIAはトヨタの約22.6倍、東京エレクトロンは約0.7倍。参考バーは順位リスト外、半導体表30＋10行と比較ボタン40件は維持。企業全体の値であり売上・従業員数ではないと明示する。
- NXPが28位でTOP30に入り、Astera Labsは31位で対象外。CXMT9位・Intel10位、日本ではディスコ3位・ルネサス4位の順へ同期。記事冒頭・description・上位10社解説・地域集計（米国14社）・FAQ・出典・方法を更新した。NXP公式Aboutを確認。URL・タイトル・公開設定・canonicalと、2010〜2025年の履歴は維持。
- `node tests/unit/ranking-company-compare.cjs`、`node tests/unit/article-improvements.cjs`、`npm run typecheck`を175秒の上限付きで各1回実行し、すべて成功。実データによる参考バー2件・倍率22件のSSR、基準日・確認日一致、順位・対象入替・国別社数、参考対象の表示条件、既存の選択・共有・年収表示、FAQ／metadata／canonicalを確認した。
- 変更ファイル：`src/data/semiconductor-market-cap.ts`・`semiconductor-market-cap-reference.ts`、`src/content/guides/semiconductor-market-cap-ranking.ts`、`tests/unit/ranking-company-compare.cjs`・`article-improvements.cjs`、`docs/PRD.md`・`architecture.md`・`ranking-company-comparison-spec.md`、本記録。非公開のREF-001調査ノートにも出典と更新内容を追記した。
- 本番反映・計測受信・実画面は未確認。dev・build・lint・ブラウザ操作・commit・pushは実施していない。
- 推奨コミット：`feat: enable Toyota benchmark with October 16 market caps`

## 2026-10-17：トヨタを物差しにする時価総額比較（初回実装・保留は後続更新で解消）

- 時価総額記事の世界・日本上位10社グラフへ、順位リスト外の参考バー、茶系の識別表示、対トヨタ倍率、企業全体の時価総額という説明、基準日・金額・確認日・出典をSSRする機能を追加。参考企業を含む最大値で棒を描き、世界と日本では尺度が異なることを明示する。倍率は数値から小数第1位で計算し、0.0倍になる場合は0.1倍未満と表示する。
- 日本グラフ直後から、既存の他業界比較・2025年・トヨタ選択済みタイムマシンへ接続。年末データの説明と既存article_internal_clickを使う。全順位表・比較40ボタン・選択対象38社・共有IDは維持。新API・依存・保存先・企業ページは追加していない。年収グラフは参考対象を省略した従来表示を維持する。
- **公開保留**：CompaniesMarketCapのトヨタ時価総額ページを2026-10-17に確認したが、本文で確認できる直近日次値は2026-10-16分。記事と同じ2026-10-01の値を確認できず、直接取得もHTTP 403。静的参考データはpending・金額nullで管理し、追加見出し・参考バー・倍率・出典説明・リンクはすべて非表示。記事の公開設定・基準日・数値・編集更新日は維持。現在値・年末値・推定値は流用していない。同日の根拠を確認できたら参考データ・確認日・記事編集日・保留記録を更新する。
- `node tests/unit/ranking-company-compare.cjs`と`node tests/unit/article-improvements.cjs`、`npm run typecheck`を175秒の上限付きで各1回実行し、すべて成功。テスト用の架空の参考値で両グラフの10社＋参考1社、順位外表示、倍率の丸め、参考企業が最大値の場合の尺度、同日・同通貨・同提供元・正数の公開条件、SSR出典・過去年末リンク・イベント属性、既存表・選択・共有・年収表示を検証した。架空値はテスト内だけで使い、公開データに保存していない。
- 変更ファイル：`src/components/MetricBarChart.tsx`・`MarketCapRankingTable.tsx`、`src/app/globals.css`、`src/data/semiconductor-market-cap-reference.ts`・`company-logos.ts`、`src/lib/market-cap-reference.ts`、`tests/unit/ranking-company-compare.cjs`、`docs/PRD.md`・`architecture.md`・`ranking-company-comparison-spec.md`、本記録。
- 実ブラウザ・実端末・本番反映・計測受信は未確認。dev・build・lint・ブラウザ操作・commit・pushは実施していない。
- 推奨コミット：`feat: prepare Toyota benchmark for market cap rankings`

## 2026-10-17：トップのランキング枠をコンパクト化

- 4記事への説明付きカードを見出し横の小型リンクへ変更。高さ44px以上・淡い背景・細い罫線・青い矢印とし、リンク先・クリック計測を維持した。全幅のホームプレビューは960px以上で左260pxに時間操作・NVIDIA追跡、右に上位5社の1行形式のグラフを配置。960px未満はリンクを折り返し、操作→追跡→グラフの順に縦配置する。
- 比較対象・現在のランキングとの違い・出典・既存データ確認日は常時表示。補間中の注記はグラフに残し、補間・可変軸・対象範囲・解釈上の詳しい注意を閉じたnative detailsへ集約した。記事・専用ツールの説明、全行の高さ計測、データ、状態管理、画面外・背景タブ停止、表示年引き継ぎを維持。新API・依存・保存先は追加していない。
- `node tests/unit/ranking-time-machine-preview.cjs`と`npm run typecheck`を175秒の上限付きで各1回実行し成功。初期HTMLの4リンク・掲載順・出典の常時表示・閉じた詳細説明、補間中の注記と記事／専用ツールの説明維持、16年分のデータ・再生・停止・リセット・表示年引き継ぎ、ホーム計測を確認。既存のnext/image模擬によるfill属性警告は出るがexit 0。型確認後の実装変更はホーム専用CSSの間隔・文字サイズ調整のみ。
- CSSの構文と差分・変更した公開テキストの禁止語照合を確認。1366×768での一画面表示は設計目標であり、実ブラウザ・実端末の表示、本番反映・計測受信は未確認。dev・build・lint・commit・pushは未実行。
- 変更ファイル：`src/app/(ja)/page.tsx`、`src/app/globals.css`、`src/components/ranking-time-machine/RankingTimeMachinePreview.tsx`・`RankingRaceChart.tsx`・`ranking-time-machine.module.css`、`tests/unit/ranking-time-machine-preview.cjs`、`docs/PRD.md`・`architecture.md`・`design-system.md`、本記録。
- 推奨コミット：`refactor: compact homepage ranking section`

## 2026-10-17：主力ランキング記事の重複説明と読む順番を整理

- 時価総額ランキング1記事の冒頭を短い結論と世界・日本・詳しい解説への3リンクに集約し、長い目次は閉じたnative detailsへ移設。世界TOP30→日本TOP10→2社比較→タイムマシンの順に変更。グラフ・全順位表・出典条件・比較ボタンは常時表示し、他記事の導入・目次は維持した。
- 指標の説明と使い分け、職種の接点と企業研究4ステップ、調査方法をそれぞれ統合。上位10社の紹介は特徴中心に短縮し、書籍紹介は後半1か所、分野別記事への案内も専用箇所へ集約。末尾のまとめカードを除き、関連記事は追加で読む4本へ整理した。既存の4つの統合元アンカーを統合先に残す。
- タイトル・description・URL・canonical・published・数値・データ確認日・各出典確認日を維持し、記事編集更新日を10-17、読了目安を約12分へ変更。FAQの短い回答と構造化データを一致させ、既存の比較・タイムマシン・内部リンクの計測属性を維持。撤去した書籍への記事内入口は計測対象から外れる。
- `node tests/unit/ranking-company-compare.cjs`、`node tests/unit/ranking-time-machine-preview.cjs`、`node tests/unit/article-improvements.cjs`を各1回実行し成功。データ・選択・共有URL・計測、SSRの掲載順・グラフ2件・比較ボタン40件・旧アンカー一意性／内部リンク・FAQ／metadata／sitemap・他記事の表示維持、記事／ホームのプレビュー再生・停止・年引継ぎを確認した。プレビューテストでは既存のnext/image模擬によるfill属性警告が出るが、exit 0。
- `npm run typecheck`も最大1回で成功。各検証は175秒の上限付きで3分以内。`git diff --check`とsrc・変更した公開文書の禁止語照合を実施。ブラウザ・実端末・本番反映・GA4受信・検索効果は未確認。dev・build・lint・commit・pushは未実行。本番反映日と受信の確認後、14日で異常、28日で検索語・端末別の検索指標と記事内利用を別に評価する。観測開始日は未確定。
- 変更ファイル：記事データ、共通ガイドページのランキング専用表示、共通CSSのランキング専用指定、上記3テスト、`docs/conversion-architecture.md`・`docs/ranking-company-comparison-spec.md`、本記録。
- 推奨コミット：`refactor: simplify semiconductor ranking article structure`

## 2026-10-17：ランキングをトップの主要入口へ追加

- ヒーローの目的別入口をランキング・技術・企業研究・キャリアの4つへ変更。PCは2列、720px以下は1列。ヒーロー直後、技術ツールより前の`#home-rankings`へ、操作プレビューと時価総額・装置売上・メモリ・平均年収の既存記事リンクを配置した。共通ヘッダーの技術の次にもランキング入口を追加し、同じアンカーへ接続。追従ヘッダーの余白と狭いPC幅のナビ間隔を調整。
- 既存RankingTimeMachinePreviewへhome表示を追加。2010年末・停止から再生／一時停止・年選択・リセットを使い、上位5社とNVIDIAの確定値・圏外表示を確認できる。専用ツールへ表示年・NVIDIA選択を引き継ぐ。20社の選定範囲・単位・出典・既存確認日を表示し、画面外／背景タブで停止する。データ・計算・再生・reduced-motion対応は共用し、記事の上位10社・初期表示・計測、既存のランキング記事本文・数値・URLと経験別企業リスト`/rankings`は維持。
- 入口データをhomeRankingLinksへ集約。トップ・ヘッダーは既存クリックイベント、プレビューはexperience_view／tool_stepをhome_preview・home-v1で識別する。記事用イベントと重複送信しない。新しいAPI・依存・保存先は追加していない。
- `node tests/unit/ranking-time-machine-preview.cjs`を1回実行し成功。ホームと記事のSSR、4記事への通常リンク、専用枠の順序、ヘッダー入口、固有ID、16年分のデータ、再生・停止・リセット、画面外／背景タブ停止、自動再開なし、表示年引き継ぎ、計測の区別・重複抑止を確認。ホームSSRのnext/image模擬によりfill属性の警告が出るが、検証はexit 0。
- `node tests/unit/ranking-time-machine.cjs`を1回実行し成功。既存の全比較モード・再生・共有・計測・reduced-motion・SSRと、履歴記事のregistry／metadata／canonical／sitemap／構造化データを確認。`npm run typecheck`も1回成功。いずれも175秒の上限付きで3分以内に終了。`git diff --check`とsrc・変更した公開文書の禁止語照合を実施。
- 実ブラウザのレイアウト・実端末・本番反映・GA4受信・流入効果は未確認。dev・build・lint・commit・pushは実行していない。本番反映・受信確認後14日／28日を観測期間とする。
- 変更ファイル：`src/app/(ja)/page.tsx`、`src/app/globals.css`、`src/components/Header.module.css`、`src/components/ranking-time-machine/RankingTimeMachinePreview.tsx`・`RankingRaceChart.tsx`、`src/data/home.ts`・`header.ts`、`tests/unit/ranking-time-machine-preview.cjs`、`README.md`、`docs/PRD.md`・`architecture.md`・`design-system.md`・`conversion-architecture.md`、本記録。
- 推奨コミット：`feat: add interactive ranking entry to homepage and navigation`

## 2026-10-17：ロゴと色面で俯瞰できる業界地図へ整理

- PCの8領域・44社を12列・2段の固定配置へ変更。上段はEDA・IP／ファブレス／ファウンドリ／OSAT／検査・計測を2／4／2／2／2列、下段は材料／IDM／製造装置を2／6／4列に配置。領域内は1／3／1／1／1列、1／4／3列。DOM順を領域の視覚順に合わせ、領域内の企業順と8色を維持。1023px以下は領域を縦に並べ、カードを2列にする。
- 冒頭を短い導入と検索へ整理し、繰り返す見出し・説明・領域リンク集・大きなボタンを除く。地域・国内拠点・既存6セグメント・職種表示は閉じたnative detailsへ集約し、結果件数・適用数・条件クリアは閉じた後も確認できる。分業は短い1行と一般的な役割の注記にする。
- 白いカードはロゴ・社名を中心にし、72×24px以内のoverviewロゴサイズを追加。社名13px以上の全文折り返しと44px以上の操作領域を指定し、狭いPCではロゴ幅を縮めて社名の幅を確保。簡易紹介7社のラベルは別のグリッド行へ置き、概要ボタンの読み上げにも含める。他ページのdefault／compactサイズは維持。
- 地図内の説明と詳細リンク行を外し、既存概要と、地図直下の閉じた「全44社の企業詳細・公式情報」へ集約。37詳細・7公式リンクは検索条件に依存せず全件をSSRし、JavaScriptなしでもnative detailsを開いて進める。長い領域説明も地図下の開閉欄へ移設。日本企業一覧、旧アンカー、共有指定、初期クエリ、転送、canonical・noindex・ItemList・sitemap方針は維持。
- 計測版をoverview-atlas-v3へ変更。全社リンク一覧は既存industry_map_content_clickのlink_location=company_link_index、概要内はdetail_panelで区別。検索語や自由入力は送信しない。財務情報・資本関係・個社間の取引線、新しいデータ取得や保存は追加していない。
- `node tests/unit/company-explorer.cjs`を1回実行。44社のデータ・検索・複合条件・0件・解除、全44社の企業指定、概要・フォーカス・ロゴ失敗の模擬操作、初期状態の開閉欄、全37+7リンク、計測、SSR・旧アンカー・ItemList・初期クエリ・canonical／noindex・完全一致の転送設定とサーバー転送まで通過。sitemapで検索非公開のNVIDIAにも掲載を要求していた既存テストが停止（exit 1）。判定をisCompanyIndexableとの一致へ修正したが再試行せず、以降のsitemap／ナビゲーション・画像資産・CSSのテストは未完了。前回不足していたusePathname模擬は今回引き継いでSSRが通過した。
- `npm run typecheck`を最大1回実行して成功。対象テスト・型チェックは各175秒の監視付きで3分以内。テスト後のコード変更は狭いPCで社名の幅を確保するCSS調整のみで、型チェックはその後に実行。`git diff --check`・変更した公開ファイルの禁止語照合を確認する。
- 1440×900pxの初期画面へヘッダーから地図全体を収める目標は実ブラウザ未確認。1280×800pxは縦スクロールを許容し、縮小変形・社名の切り捨て・固定高さでの隠蔽を行わない。ブラウザ仕様を1440×900・1280×800・768／390／320px、44px操作・長い社名・8色・画像失敗・開閉・概要・JavaScriptなしリンクへ更新したが未実行。実端末・実HTTP・本番反映・GA4受信も未確認。dev・build・lint・commit・pushは未実行。
- 変更ファイル：`src/components/CompanyExplorer.tsx`・CSS Module、`CompanyCardLogo.tsx`・CSS Module、`src/app/(ja)/industry-map/page.tsx`、`src/app/globals.css`、`tests/unit/company-explorer.cjs`・`tests/browser/company-explorer.cjs`、`docs/PRD.md`・`architecture.md`・`design-system.md`・`company-explorer-spec.md`・`conversion-architecture.md`・`seo.md`、本記録。不要になった`CompanySearchJump.tsx`を削除。
- 推奨コミット：`feat: make industry map a compact company overview`

## 2026-10-17：企業一覧を業界地図へ統合

- 企業探索を`/industry-map`へ一本化。全44社（詳細37社・簡易紹介7社）を8領域へ表示し、従来31社の領域内順序の後ろへ追加13社を元データ順に加える。背景色・白いロゴカードを維持し、簡易紹介にラベルと公式リンクを表示。検索・地域・拠点・既存6セグメント・職種表示・概要を1画面へ集約し、日本企業一覧・主力製品も移設。
- `next.config.ts`の完全一致308と旧ページのpermanentRedirectで`/companies`だけを転送。空値・複数値を含むqueryを保持。企業詳細・外資系企業の日本の仕事・比較URLは維持。旧検索・日本企業・分類見出し・領域アンカーを移設／別名で残し、全44社の企業指定で絞り込みを解除して概要を開く。同ページのquery変更は部品のkeyで初期検索へ反映する。
- タイトル・説明・canonical・query指定時のnoindexを統合先へ合わせ、44社のItemListを追加。sitemapは旧一覧トップだけを削除し、メニュー／トップを「業界地図・企業一覧」1入口へ整理。記事・関連ページ・構造化データの旧一覧リンクを直接更新した。工場新設・国内拠点マップの機能変更はなく、拠点マップ内は関連リンクの変更だけ。
- 計測は既存industry_map系を`source_page=/industry-map`・`ui_version=unified-atlas-v2`で識別し、旧companies系を重ねて送らない。自由入力の検索語をイベントへ送らない。移行前の期間・検索語実績と未確認項目を非公開記録へ追記。本番反映・通常利用の受信確認後14日・28日で旧新URL合計を観測する。観測開始日は未確定。
- `node tests/unit/company-explorer.cjs`を1回実行。44社の件数・分類・順序、37詳細／7簡易紹介の出典とURL、NFKC／全語検索・複合条件・0件・解除・初期検索、全44社の企業指定、概要・フォーカス・画像失敗の模擬操作、計測は通過。その後SSRでテストのnext/navigation模擬にusePathnameがなく停止（exit 1）。模擬を補完したが再試行ルールに従い再実行していない。SSR以降のアンカー・metadata・ItemList・転送・sitemap・ロゴ／CSSのテストは未完了とする。
- `node tests/unit/industry-atlas-data.cjs`は1回成功。8領域の基礎定義・元31社の固定順に重複がなく、簡易紹介7社の出典・職種・関係を確認。`npm run typecheck`は1回成功。各コマンド175秒の監視付きで3分以内。`git diff --check`と変更した公開ファイルの禁止語照合を実施。SSR・検索設定・転送・詳細ルートの維持はソース差分を確認し、実行確認済みとは扱わない。
- ブラウザ仕様を44社・旧URLの転送・query／fragment継承・追加企業の概要・320／390／768／1280px・JavaScriptなしへ更新したが未実行。実ブラウザ・HTTP転送・実端末・本番画像配信・GA4受信・検索効果は未確認。dev・build・lint・commit・pushは未実行。
- 主な変更：`next.config.ts`、`src/app/(ja)/industry-map/page.tsx`・`companies/page.tsx`・`sitemap.ts`、`CompanyExplorer.tsx`・CSS Module・`IndustryAtlas.tsx`・`CompanySearchJump.tsx`、探索型・組み立てロジック・共通CSS。`FilterableCompanies.tsx`を削除。ヘッダー／トップ・記事7本・関連ページ／部品の一覧トップへのリンクを更新。対象単体／ブラウザ仕様、PRD・architecture・design-system・SEO・計測・文書索引・企業探索仕様と本記録を更新。全変更ファイルはGit差分を参照。
- 推奨コミット：`feat: consolidate company directory into industry map`

## 2026-10-17：業界地図の領域別の背景色を復元

- ロゴカードへの共通化で見出し線だけになっていた色分けを見直し、業界地図8領域の淡い背景色と枠色を旧配色へ復元。白い企業カード・ロゴ枠、領域名、検索中・スマホの配置を維持。企業一覧の背景は従来どおり淡いグレーとする。
- 変更ファイル：`src/components/CompanyExplorer.module.css`、`docs/design-system.md`、`docs/company-explorer-spec.md`、本記録。
- Nodeによる対象CSSの確認でCSS Moduleの構文・pure制約、旧8色との一致、地図だけの背景適用を確認し成功。`git diff --check`と変更した公開ファイルの禁止語照合も成功。CSS・文書のみの変更のためtypecheck・lint・buildは未実行。実ブラウザ表示・本番反映は未確認。commit・pushは未実施。
- 推奨コミット：`fix: restore industry map zone background colors`

## 2026-10-17：業界地図・企業一覧をロゴで探せる共通UIへ改善

- `/industry-map`の代表31社と`/companies`の掲載37社を維持し、領域別のコンパクトなロゴカード、検索・地域・国内拠点条件、企業概要ダイアログを共通化。地図の職種表示、一覧の既存6セグメント、初期クエリ、企業指定hash、領域・日本企業一覧の既存アンカーを維持。地図未収録13社の主領域のみ追加し、既存セグメントは変更していない。
- 詳細のある会社には通常リンクを常設し、初期HTMLにも会社名・実在する詳細URLを出力。地図専用7社は公式情報へ案内する。地図0件時には同条件に合う一覧の企業を最大3社表示。概要に製品・職種、国内拠点・キャリア準備への導線、出典・更新日を集約し、閉じる・Escape・背景クリックと起点へのフォーカス復帰に対応。
- 保存済み2社をロゴ台帳へ登録し、社名・銘柄コードと画像を照合した15社のローカルPNGを追加。取得元・画像URL・取得日・利用条件を既存READMEへ記録。地図31社・一覧36社が画像対応し、日立ハイテクは対応画像を取得できず文字表示を維持。画像失敗時も文字へ戻し、共通ロゴ部品の既定サイズは維持。
- 両URL・タイトル・説明・canonical・検索公開設定・構造化データ・sitemapを維持。工場新設記事・国内拠点マップは変更なし。既存イベントの用途を維持し、ページパス・UI版を付与。一覧の概要表示のみ`companies_summary_open`を追加し、検索語は送信しない。
- `node tests/unit/company-explorer.cjs`、`node tests/unit/industry-atlas-data.cjs`、`npm run typecheck`を各1回実行して成功。企業数・重複・簡易紹介のURL、検索と複合条件・解除・初期クエリ・0件、共有リンク、概要・フォーカス・画像失敗の模擬操作、イベント、SSR・既存アンカー・SEO設定・画像ファイル・CSS Moduleを確認。コマンドは各175秒の監視付きで3分以内。型確認後はCSS末尾の空行と本記録のみ修正。
- ブラウザ確認仕様を320／390／768／1280px・概要操作・検索・共有リンク・JavaScriptなしの導線へ追加し、既存比較テストの地図概要セレクターを更新。仕様は未実行で、実ブラウザ・実端末の表示／タップ／フォーカス・本番画像配信・GA4受信は未確認。dev・build・lint・commit・pushは実行していない。
- `git diff --check`と変更した公開テキスト25ファイルの禁止語照合は成功。アクセス数値や非公開記録を公開ファイルへ転記していない。
- 要件・構成・デザイン・SEO・計測・文書一覧を更新し、詳細を`docs/company-explorer-spec.md`へ集約。本番反映と通常利用の受信確認後14日・28日で検索語別流入・概要表示・企業詳細への遷移を観測する。観測開始日は未確定で、自動取得・通知・URL統合は今回実施していない。アクセス数値は非公開記録に保持する。
- 変更ファイル：両ページ、`CompanyExplorer.tsx`・CSS Module、`IndustryAtlas.tsx`・`FilterableCompanies.tsx`、`CompanyCardLogo.tsx`・CSS Module、`src/app/globals.css`、企業探索の型・データ・変換／検索ロジック、ロゴ台帳・README・15画像、対象単体／ブラウザ仕様、`docs/PRD.md`・`architecture.md`・`design-system.md`・`seo.md`・`conversion-architecture.md`・`documentation-map.md`・`company-explorer-spec.md`、本記録。
- 推奨コミット：`feat: unify company exploration with compact logo cards`

## 2026-10-17：業界ウォッチを企業の動きを触って調べる画面へ刷新

- トップを白地の売上前年比グラフ＋選択企業の要点へ全面再設計。主要12社を事業区分順・全社共通の線形軸で表示し、5テーマと企業選択に連動。対象期・事業範囲・未取得・確認状態を残し、独自スコアや過去推移は追加していない。
- 企業パネルは要点1件、IDで関連付けた直近ニュース最大2件、次回決算と詳細導線。テーマ全体のニュースは企業選択から独立し、5件＋展開に整理。予定・過去掲載・背景・収集情報は折りたたみへ移動。全社の数値・決算・原資料リンクをSSRし、旧アンカーとhash履歴を維持。
- スマホでは企業選択から要点へフォーカス・移動し、選び直す操作で選択行へ戻る。選択済み企業を再度押す場合も移動する。選択状態の読み上げ、キーボード操作、180msの遷移、reduced-motionに対応。新規依存・閲覧時取得・AI・保存を追加せず、日次データ形式と反映権限は維持。
- `npm run watch:test`：26件成功。初回成功後に上記フォーカス処理の小修正とテストを加え、同じコマンドで最終26件も成功。実データの数値・出典・対象範囲、ゼロ／負値／大きな値／欠損、企業ID関連付け、決算との重複、確認失敗・古い確認、0件、初期HTML、旧アンカー一意性、選択・履歴・イベント・スマホのフォーカス処理を検証。操作はフック／DOM模擬であり実ブラウザ検証ではない。
- `npm run typecheck`は175秒監視付きで最大1回、成功。その後のコード変更は既存フォーカス処理の実行順と戻り先の小修正のみで、型チェックは再実行していない。`git diff --check`と変更ファイルの公開禁止語照合も確認。各検証は3分以内。
- E2E仕様を新しい図・企業選択・テーマ・戻る・旧記事・JavaScriptなしの導線へ更新したが、ランナー・実ブラウザ・実端末・本番計測は未確認。dev・build・lint・commit・pushは実行していない。
- 変更ファイル：`src/app/(ja)/semiconductor-watch/page.tsx`、`src/components/chip-pulse/WatchExplorer.tsx`・`WatchExplorer.module.css`・`MediaLinks.tsx`、`src/lib/watch.ts`・`watch-types.ts`・`watch-explorer.ts`、`tests/unit/watch-explorer.cjs`、`tests/e2e/chip-pulse.spec.ts`、`package.json`、`docs/PRD.md`・`architecture.md`・`design-system.md`・`semiconductor-watch-editorial.md`・`conversion-architecture.md`・`seo.md`、本記録。
- 推奨コミット：`feat: redesign semiconductor watch around interactive company exploration`

## 2026-10-16：watch／earningsの一覧・発表予定・日次更新を改善

- watchを「直近7日の主な動き→今後14日の公式予定→重複を除いた直近30日→背景解説・過去掲載」に再構成。元の公表日で範囲を選び、確認日の変更だけで新着にしない。新着なし、取得失敗、原文確認待ち、処理済みへの接続を区別し、旧アンカーとテーマhashを維持。
- 決算は主要12社を先頭の表／スマホ向け企業カードで表示。NVIDIA・TSMC・Intelを追加し、ASMLはQ3へ更新。既存9社の主要数値を再照合し、Samsung全社速報とDS部門実績を区別。TWD、最新発表有無の確認台帳、公式予定、暫定・未公表・未確認、予定日経過表示を追加。比較は装置・メモリの2群を維持。
- ランキング3記事・工場記事から掲載範囲とテーマに合う入口へ接続。canonical・構造化データ・sitemapを維持し、内容更新と数値確認を分離。初期HTMLで12社・根拠リンクを出力し、絞り込みhashと戻る履歴に対応。明るい配色をwatch／決算で統一。
- 候補の正本を現行mediaへ接続。決算と予定の検証・前回版保存・原子的更新・禁止語照合、日次のworktree・ロック・固定6ファイル限定commit/push・ニュース上限・競合時停止を実装。AGENTSとPRD・architecture・編集／SEO／計測・日次運用文書を更新。コードのcommit/pushは未実施。
- `npm run watch:test`：18件成功。原資料参照・前年比計算、通貨と範囲、予定変更時の旧版保持、期限切れ／現地日付／14日境界、取得失敗・古い確認、候補処理、許可ファイル、JSなしの初期HTML・旧アンカーを確認。公開処理の禁止語照合を共通化・強化した後、同じコマンドで再確認。`npm run typecheck`は175秒監視付きで1回、成功。以後はCSSの文字色、CJSの更新遷移検証・テスト、E2E仕様、文書を修正。CJS・単体テストの最終18件を再確認し、型チェックは再実行していない。
- `npm run watch:check`、`npm run earnings:check`、`git diff --check`成功。候補作成時に実行した`node scripts/earnings-publish.cjs --candidate ...`と`npm run watch:calendar -- --candidate ...`で12社／予定の照合・アーカイブ・更新を実施。取材・原資料・候補・旧版は.privateに保持しGit管理外を確認。最終の変更ファイル全体で禁止辞書の語を照合し該当なし。
- 定期タスク登録は専用ツール未提供、アプリ操作もComputer Useの安全制限で拒否。毎日08:00 JSTの登録本文・復旧・権限を`docs/watch-daily-operations.md`へ用意したが、登録・初回試行・Vercel成功・本番反映・翌朝実行は未確認。実行補助コマンドの実worktree作成／pushも未実行。稼働中とは記録しない。
- dev・build・lint・ブラウザ検証・E2E実行・commit・pushは未実施。E2E仕様は現在の一覧と履歴操作へ更新。GSC最新流入とGA4本番受信・再訪は未取得で、ゼロと断定しない。
- 推奨コミット：`feat: make semiconductor watch useful for daily earnings checks`

変更ファイル：

- 画面・共通表示：`src/app/(ja)/semiconductor-watch/earnings/[companyId]/page.tsx`、`src/app/(ja)/semiconductor-watch/earnings/page.tsx`、`src/app/(ja)/semiconductor-watch/page.tsx`、`src/app/sitemap.ts`、`src/components/chip-pulse/Media.module.css`、`src/components/chip-pulse/MediaLinks.tsx`、`src/components/chip-pulse/NewsFeed.tsx`、`src/components/chip-pulse/WatchSchedule.tsx`、`src/components/earnings/Earnings.module.css`、`src/components/earnings/EarningsExplorer.tsx`、`src/components/earnings/EarningsLinks.tsx`、`src/components/earnings/EarningsShell.tsx`
- データ・表示モデル・記事：`src/content/guides/japan-semiconductor-factory-projects.ts`、`src/content/guides/memory-manufacturer-ranking.ts`、`src/content/guides/semiconductor-equipment-sales-ranking.ts`、`src/content/guides/semiconductor-market-cap-ranking.ts`、`src/data/earnings-snapshot.json`、`src/data/watch-calendar.json`、`src/lib/earnings.ts`、`src/lib/watch-calendar.ts`、`src/lib/watch.ts`
- 更新・検証コマンド：`package.json`、`scripts/earnings-publish.cjs`、`scripts/public-content-check.cjs`、`scripts/watch-daily.cjs`、`scripts/watch-data.cjs`
- テスト：`tests/e2e/chip-pulse.spec.ts`、`tests/e2e/earnings.spec.ts`、`tests/unit/earnings.cjs`、`tests/unit/watch-daily.cjs`、`tests/unit/watch.cjs`
- 仕様・作業記録：`AGENTS.md`、`TASKS.md`、`docs/PRD.md`、`docs/architecture.md`、`docs/conversion-architecture.md`、`docs/design-system.md`、`docs/documentation-map.md`、`docs/earnings-ir-operations.md`、`docs/semiconductor-watch-editorial.md`、`docs/seo.md`、`docs/watch-daily-operations.md`

## 2026-10-15：時価総額ランキング記事内にタイムマシン簡易版を追加

- 世界TOP30表直後・書籍入口より前に配置し、冒頭リンクをページ内へ接続。2010年末・停止状態から再生／一時停止・年選択・リセットを提供。既存20社データ・順位計算・再生・チャートを再利用し、上位10社と圏外でも読めるNVIDIAの年末確定値を表示する。現在のTOP30との対象・時点の違い、補間表示、出典・元データ確認日を明記。
- 企業行は非操作表示、記事内ロゴはlazy・失敗時は企業名へ戻す。初期チャート・リンク・説明をSSRし、URLの読み書きなし。専用ページへ表示年・NVIDIA選択を引き継ぎ、画面外・背景タブでは停止し自動再開しない。既存2社比較・他記事の専用ページ入口・canonical・検索公開設定・市場データは維持。
- 記事内の露出・開始・結果を既存イベントの`surface=article_inline`・`ui_version=inline-v1`で区別し、詳細画面へのクリックは`placement=inline_open_full`で識別。初期表示・無変更・一時停止だけでは利用扱いにせず、マウント中の重複を抑える。PRD・architecture・conversion-architectureを更新。
- `node tests/unit/ranking-time-machine-preview.cjs`を1回実行し成功。初期SSR、全16年の順位・数値一致、停止・年変更・最終年・リセット、画面外／背景タブ停止、復帰時の非再生、URL非干渉・引き継ぎ、画像失敗、露出と初回操作・結果の重複抑制を確認。ブラウザ・本番受信の代用とはしない。
- `node tests/unit/ranking-company-compare.cjs`を1回実行し成功。記事SSR・既存比較・canonicalを確認。過去の編集日固定assertを記事データとの整合確認へ変更した。`npm run typecheck`を1回実行し成功。
- `node tests/unit/ranking-time-machine.cjs`は1回実行し失敗。主要な再生・比較・共有・計測・reduced-motionとSSRの検証は通過後、記事／sitemap連携でテストローダーがJSONをTSとして処理し`media.articles is not iterable`となった。ローダーにJSON読込を追加済み。再実行制限に従い再検証せず、全体成功とは扱わない。
- 各検証は180秒の上限付きで実施。build・lint・dev・ブラウザ・commit・pushなし。本番反映・GA4受信は未確認。受信確認後14日・28日に同一セッションの露出→開始→結果と専用ページ移動を観測する。
- 変更：新規`RankingTimeMachinePreview.tsx`と`tests/unit/ranking-time-machine-preview.cjs`、既存`RankingRaceChart.tsx`・`TimelineControls.tsx`・`CompanyLogo.tsx`・共通CSS Module、記事データ・GuideBlock型・GuideBlocks、既存対象テスト2件、上記3仕様書と本記録。
- 推奨コミット：`feat: embed ranking time machine preview in ranking article`

## 2026-10-15：ランキング記事の書籍導線・表示状態・計測を改善

- 世界TOP30直後に既存書籍紹介への短い入口を追加。移動先へのキーボードフォーカスを接続し、日本TOP10後の2冊それぞれの紹介文と読む目的を購入先より先に表示。既存の読書体験と広告コード・購入先を維持し、Amazonが書名検索であることを明示。編集日は10-15、実際に再確認した書籍出典は10-14。ランキング数値・タイトル・canonical・公開状態は維持。
- 外部カードの準備完了・実露出・10秒未生成を区別し、遅延時の再読み込み案内、遅れて生成された際の復帰、JavaScript無効時の案内を追加。購入先だけを生成URLと発行データで判別し、固定属性で計測。GA4のproduct_id・retailerをイベントスコープで登録し、再読込後の保存を確認。属性値の本番受信は未確認。
- `node tests/unit/book-affiliates.cjs`、`node tests/unit/observe-visible.cjs`、`npm run typecheck`を各1回実行し成功。書籍テストは埋め込み・タイマー・露出を模擬。最終の軽微な表示・フォーカス調整後は再単体テストせず、最終型チェックとPC操作を確認。390pxのDOM幅確認は調整前に成功し、最終フォーカスの390px確認は未完了。
- `git diff --check`と変更対象の公開禁止情報照合は成功。発行済みカードデータ・購入先URL、記事の識別情報・公開状態・ランキング出典は変更前と機械照合し、一致を確認。
- ローカルPCで紹介先への移動とフォーカス・Tab順、実画面の遅延案内を確認。確認用Chromeは購入カード配信元をERR_BLOCKED_BY_CLIENTで遮断しており、実カードの正常表示は未確認。本番カードも壊れているとは断定しない。GA4タグ非設置をローカルDOMで確認し、本番イベント送信・広告クリック・本人購入なし。dev起動はsandboxのbind制限で初回失敗し、昇格起動後は各確認を3分以内で終了・停止済み。ブラウザ接続の待機が長引いた後、差分と型を再確認して完了。build・lint・commit・pushなし。
- 変更：`src/content/guides/semiconductor-market-cap-ranking.ts`・`types.ts`、`src/components/guide/GuideBlocks.tsx`・`MoshimoBookLink.tsx`・`BookAffiliateEntry.tsx`・`MoshimoBookLink.module.css`、`src/data/book-affiliates.ts`、`src/lib/book-affiliates.ts`、`tests/unit/book-affiliates.cjs`、`docs/architecture.md`・`monetization.md`・`conversion-architecture.md`、本記録。非公開記録・設定確認画像は`.private/`に保存。
- 本番反映・属性値の受信・ASP照合は未確認。もしもは未ログイン。確認後の14日観測を仕様に記載し、観測開始日は未確定。commit・pushは運営者が行う。
- 推奨コミット：`feat: improve ranking book affiliate journey`

## 2026-10-13：時価総額ランキングの冒頭を改善

- 冒頭の結論へ既存基準日時点の上位3社と企業全体の時価総額という比較基準をまとめ、入口リンクを世界TOP30→日本TOP10→過去の推移→分野別比較の順へ変更。編集日のみ更新。
- GA4・Search Consoleの分析結果、取得条件、登録状態、前回改善の本番掲載確認を非公開記録へ保存。実際の反映日時は未確認として保持。検索順位や流入への効果は未確認。
- 2026-10-20に確定済み直近7日・前7日と28日を再比較する手順を非公開記録へ追加。同一検索語・端末別を確認する。次回比較・自動取得・通知は未実施。
- `npm run typecheck`（1回）と `git diff --check` は成功。変更対象の公開禁止語は該当なし。リンク先・既存canonical・構造化データ・sitemapの編集日連携を静的確認。本番反映・dev・build・lint・ブラウザ操作・commit・pushは未実施。
- 推奨コミット：`content: clarify market cap ranking search entry`

## 2026-10-07：企業一覧・光半導体の検索入口を改善

- 企業一覧のタイトル・説明文を日本企業の検索意図に合わせ、日本本社と全掲載企業の件数を既存データから表示。日本企業の分野別一覧を冒頭直後へ移し、各社の主力製品を最大2件追加。分類と企業詳細リンクを維持し、掲載範囲を明示。
- 光半導体記事を用途別のメーカー一覧・比較として案内し、総合順位を示していない理由を冒頭へ追加。時価総額記事の冒頭リンク群へ専用記事を追加し、既存の後段リンク・数値基準日・出典確認日を維持。記事編集日のみ更新。
- SEO文書に週次観察と本番反映28日後の比較手順を追加。計測数値・GA4設定確認・本番反映台帳は非公開記録へ保存。工場新設・メモリ記事の構成は変更していない。
- `npm run typecheck`（最大1回）、`git diff --check`、変更対象の公開禁止情報照合は成功。URL・公開状態・canonical・構造化データとsitemapの既存連携を静的確認。本番反映・本番実画面・28日後の効果測定は未実施。dev・build・lint・commit・pushは未実施。
- 推奨コミット：`feat: improve company directory and optical semiconductor search entries`
- 追加の件数確認スクリプトは企業分類も企業として抽出して失敗。確認スクリプト側の抽出対象の誤りであり、ルールに従い再実行していない。このスクリプト内の後続assertは未実施。

## 2026-10-04：業界ウォッチをテーマ探索の入口へ再構成

- トップを「今回の動き・注目1＋2件・5テーマ・更新一覧」へ変更し、ニュース5件／既存決算9社／工場5案件を接続。詳細に背景、数値・状態・工程図、企業、用語、目的別リンクを追加。公表・掲載・確認日を分離し、0件・取得失敗・古い情報の表示を用意。
- SEC14社の収集成功、直近30日の7候補を確認。AMD、TSMC月次、ASE月次の3記事を原文照合付きで追加。Micronは既存決算へ接続。日本の手動調査対象、採用・見送り理由、確認付き掲載コマンドと週2〜3回の更新手順を `docs/semiconductor-watch-editorial.md` に記録。AI自動公開は停止を維持。工程別の編集所要時間は未計測。ASEの原資料に公表前年比と表の金額からの再計算の差があるため、第2版に注記。
- 24件の単体テスト、typecheck1回、記事検証、公開禁止語照合、差分確認は成功。CUAでPC1280px・390px・320px、テーマ・詳細・用語・ASE地図選択・戻る・旧アンカーを確認し、冒頭の長さを調整。devは停止済み。型確認後の軽微な表示／ID検証／E2E更新は再typecheckしていない。E2Eランナー・実機・本番計測は未確認。共通html属性のhydration警告とsmooth-scroll警告は文書に記録。lint・build・commit・pushは未実施。
- 推奨コミット：`feat: redesign semiconductor watch for topic exploration`

## 2026-10-04：転職の軸ノートを会話ガイドへ刷新

- `/career-priorities` の冒頭を短くし、最初の一問から「転職全体の軸」と「半導体の仕事・働き方」に分岐。既存の `#priorities`・`#workstyle` を維持し、両分岐の回答は切替中だけ端末内で保持する。
- 固定ルールの短い返答と段階的な選択肢、編集できる回答履歴、次に確認する一問を先頭に置いた結果カードを実装。既存の質問・本人の確認状況・コピー用メモは詳細表示へ移した。AI、自由入力、回答保存・送信は追加していない。
- 既存イベントを`conversation-v2`で区別し、canonical・sitemap掲載を維持して更新日を変更。PRD・architecture・seo・conversion文書を更新。
- 対象単体テスト2件、`npm run typecheck`（1回）、変更対象lint（1回）、`git diff --check`、公開禁止語照合は成功。後続の軽微なイベント重複防止と冒頭文言の修正は型・lint未再実行。`npm run dev` はsandboxのポートbind権限エラー（`0.0.0.0:3000`、EPERM）で起動できず、再試行していない。新UIの実ブラウザ・スマホ・本番GA4受信・本番反映は未確認。build・commit・pushは未実施。
- 推奨コミット：`feat: redesign career priorities as guided conversation`

## 2026-10-03：決算・IRにメモリ関連4社を追加

- 既存企業IDと公式決算資料を照合し、キオクシア、Micron、SK hynix、サムスン電子の各社最新発表を静的スナップショットへ追加。製造装置／メモリ関連の絞り込み・2〜3社比較を分け、SamsungのDS部門数値と韓国企業の十億ウォン単位を明示。メモリメーカー記事から決算への導線を追加。
- `npm run earnings:check`、`node --test tests/unit/earnings.cjs`（4件）、`npm run typecheck`、変更ファイル限定lint、`git diff --check` を確認。ブラウザ実画面と本番計測は未確認。build・commit・pushは未実施。推奨コミット：`feat: add memory makers to earnings watch`。

最終整理日: 2026-10-04

## 2026-10-03：業界ウォッチに装置メーカー5社の決算・IRを追加

- ASML、Applied Materials、Lam Research、KLA、東京エレクトロンの公式資料を照合し、各社最新発表の要点・実績・見通し・出典を静的スナップショットへ登録。一覧、企業詳細、2〜3社比較と共通テーマを追加。対象期間・通貨・会計基準を表示し、同一期間比較と混同させない。
- ニュース、企業詳細、既存比較、ランキング、業界地図から接続。canonical、構造化データ、sitemap、既存Analytics計測を追加。SECは提出候補の発見のみ、数値と要約は手動確認。候補の検証後に前回版を保存して公開JSONを原子的に置き換える更新コマンドを追加。手順は `docs/earnings-ir-operations.md`。
- `node --test tests/unit/earnings.cjs` 4件、`npm run earnings:check`、`git diff --check` は成功。対象ファイルのlintは1回成功したが、その後の軽微な変更は再実行していない。`npm run typecheck` は型判別の2件で失敗し修正したが、回数制限により再実行していない。Playwrightはsandboxの `127.0.0.1:3100` bind権限エラーでdevサーバーを起動できず、PC・スマートフォンの実画面確認は未完了。build・commit・pushは未実施。
- KLAの営業利益は初期資料で未取得と表示。本番反映・イベント受信は未確認。推奨コミット：`feat: add source-backed earnings to Chip Pulse`

## 2026-10-01：Career Compassの1タップフィードバック

- 「今日やること」直後に3択の任意回答を追加。最初の1タップで完了し、否定的な回答の場合だけ追加理由を任意で選べる。詳しい連絡は既存のお問い合わせへ案内。
- 固定カテゴリだけを既存Analyticsへ送信し、診断回答・結果タイプ・自由記述は付けない。新規サービス・保存先なし。本番反映・GA4受信は未確認。
- `npm run typecheck`（1回）と`git diff --check`は成功。実画面・本番受信は未確認。build・devサーバー・commit・pushは未実施。
- 推奨コミット：`feat: add one-tap Career Compass feedback`

## 2026-09-27：Chip Pulse朝刊UI・更新基盤（自動要約と供給目標は未達）

- 朝刊／全体要点／一覧限定5分野／背景解説のダークUI、記事詳細2件、出典・内容日時、canonical・構造化データ・sitemap、記事・出典・解説の計測を追加。旧KPI・複合地域フィルター・ヒートマップはトップから除外。
- SEC14社を実取得。30日候補8件・本文7件・掲載可確認済み2件、平日中央値0件で供給目標は未達。Micron・ASML・SEMIの直接取得は利用条件上採用せず。日別結果を `docs/data/chip-pulse-supply-audit.json`、現行仕様を `docs/chip-pulse-media.md` に記録。
- JST版、部分失敗の更新継続、本文ハッシュ、過去版・改訂履歴、課金前のGit予算予約、月1,000円停止、キーなし公式リンク更新を実装。ローカルの新更新処理は14/14社成功、AI無効で記事2件・公式リンク5件を保存。
- Gemini Flash-Lite／Flashを2資料で比較し、全4試行が数値・分類の公開ゲートを通過せず。自動要約の承認ポリシーは無効、未検証の生成文は非公開。20円の保守的予算予約を記録（実請求額ではない）。精度改善と追加供給元の確保が残る。
- 単体19件成功。PCの分野操作・キーボード・旧アンカー・記事遷移を確認。E2EはJSなし閲覧が成功、もう1件はJSON-LDを読むテストの `hasText` セレクターで失敗し修正、再実行なし。未到達だった390pxは別途撮影し、横幅390px・本文16px・後工程1件・詳細遷移を確認。画像失敗は実コンポーネントのハンドラーと16:9枠を単体確認。
- ブラウザセッションとdevサーバーは停止済み。build・commit・pushなし。本番定期実行、Vercel反映、7日間観測、GA受信は未確認。
- `npm run typecheck` は1回成功。`git diff --check` と変更対象の公開禁止語確認は問題なし。E2E修正とモバイルの小画像キャプション調整は再ブラウザ検証していない。
- 推奨コミット：`feat: redesign Chip Pulse as a source-backed morning edition`

## 2026-09-27：Chip Pulseを確認済みニュース中心へ改善

- `/semiconductor-watch` を「今日の3行→2つのニュース入口→フィルター→重要ニュース／未編集の公式更新→市場規模データ」の順に変更。3行から根拠ニュースへ移動でき、事実要約と編集部の見方を分離。
- KPIは過去24時間の新着件数と直近30日の最多テーマだけに整理。全体集計固定、同数時は定義順、0件表示を明記。市場マップは株価方向ではなく公式更新件数で着色し、時価総額の基準日・単位・出典を表示。
- 自動取得は利用条件を確認したSEC EDGARの10社に限定。Samsung Newsroom RSSは非商用利用制限のため除外。候補上限120件、重複URL、前回正常データ保護、成功／一部失敗／全失敗の状態分離を実装。
- `npm run chip-pulse:refresh` で10/10ソース成功・6候補を確認。`npm run chip-pulse:test` は6件成功、`npm run typecheck` は1回成功、`git diff --check` 成功。PC実Chromiumと390px Chromiumで表示、テーマカード→AI絞り込み、根拠ニュース、モバイルの読み順を確認。
- コード実装とローカル取得は完了。本番のGitHub Actions定期実行・bot commit・Vercel反映は未確認。commit・push未実施。
- 推奨コミット：`feat: make Chip Pulse a source-backed daily news brief`

## 2026-09-27：Chip Pulse重要ニュースへ工程サムネイルを追加

- 重要ニュース上位3件を16:9サムネイル付きカードへ変更。設計・露光・成膜・エッチング・検査計測・後工程・テスト・材料を自前のSVG表現で区別し、スマートフォンでは画像を見出しの上へ配置。
- 確認済みローカル画像だけを任意指定できる型・検証を追加。外部ホットリンクと自動OG画像取得は行わず、画像失敗時は工程表示へ戻す。未編集の公式更新はテキスト一覧を維持。
- `npm run chip-pulse:test` は9件成功。PCの実Chromiumでカード表示・開閉・AI絞り込み、390px Chromiumで3画像の334×188px表示、横はみ出しなし、開閉・絞り込みを確認。`git diff --check`と公開禁止語確認も成功。
- `npm run typecheck` は1回実行し、空配列時の`General`フォールバックに対する型推論1件で失敗。配列長の明示分岐へ修正し、回数制限により再実行していない。build・commit・pushは未実施。
- 推奨コミット：`feat: add process thumbnails to Chip Pulse news`

## 2026-09-26：工場プロジェクトの2件比較

- 既存の工場新設記事に5案件から2件の比較を追加。所在地・段階・確認できた節目・予定を区別し、確認日・出典付きメモをコピー可能。全案件のSSR一覧を維持。
- 既存記事データを共通定義へ移動。マイクロンは公式本文の再取得ができず、前回確認日を維持して再確認待ちを明示。更新範囲・出典確認・未確認事項は専用仕様に記録。
- 型チェック1回と差分確認は成功。新規単体テストはSSRのselect計数パターンの不備で失敗し、テストを修正したが再実行なし。後続のUI・コピー・CSSテストは未実行。ブラウザ・dev・build・commit・pushなし。
- 推奨コミット：`feat: compare semiconductor factory projects`

## 2026-09-26：求人票の確認ノートに2件比較を追加

- 既存ページで1件／2件を切替。各項目のA・Bの記載状況と不明点の質問を並べてコピー可能。各求人で1項目から作成。回答はメモリのみ、具体的な待遇の比較・採点・自由入力なし。
- Aは従来回答と共通。モード切替で回答保持、結果・コピー通知は無効化。比較イベントを固定actionだけで分離。機能更新日と出典確認日を分離。
- 変更：JobPostingNoteとCSS、データ・ロジック、相談準備ページ、単体テスト、PRD・architecture・導線・確認ノート仕様、本記録。
- `node tests/unit/job-posting-note.cjs`、`npm run typecheck`（1回）、`git diff --check` 成功。変更対象の禁止語検索は該当なし。UIテストはモック。ブラウザ・build・devサーバー・commit・pushは未実施。
- 本番反映・GA4受信は未確認。反映後28日間、比較結果露出・コピーを観測する。
- 推奨コミット：`feat: compare two job posting review notes`

## 2026-09-26：年収関連記事から求人票の確認ノートへ接続

- 変更：年収ランキング・求人票の年収レンジ記事の2件、導線文書、本記録。既存ノートの共通URLを利用し、給与・待遇の1項目から始められる入口を追加。
- タイトル・年収データ・体験談・出典確認日は維持。記事更新日は導線変更日へ更新し、ランキングでは給与データの再調査ではないことを明記。
- 計測は既存article_internal_clickを使用。本番反映後28日間、記事別の入口クリックとノート利用を確認。本番反映・受信は未確認。
- `npm run typecheck` を1回実行し、追加blocks配列の閉じ括弧漏れで失敗。括弧を修正し静的確認したが、実行回数制限により再実行していない。型チェック成功とは扱わない。`git diff --check` 成功、公開禁止語は変更対象に該当なし。
- ブラウザ確認・build・devサーバー起動・commit・pushは未実施。
- 推奨コミット：`feat: link salary guides to job posting notes`

## 2026-09-26：Cpk結果から学習・講座案内への導線改善

- 変更：CpkCalculator、CpkToolExperience、CpkLearningSimulator、日本語Cpkページ、StatisticsCourseCta、導線仕様、本記録。
- 結果から教材へ入力保持のまま切替・フォーカス。指標解説へのアンカー、教材から既存の広告案内へのアンカーを追加。広告CTAは1か所。未確認の講座内容は追加しない。
- 検証：`npm run typecheck` を1回実行して成功。`git diff --check` 成功。変更した公開コードの禁止語検索は該当なし。入力保持・日本語限定・固定イベント属性・アンカー対応を静的確認。
- ブラウザ確認・build・devサーバー起動・commit・pushは未実施。本番反映・GA4受信は未確認。反映後28日間の学習入口と広告クリックを別々に観測する。
- 推奨コミット：`feat: connect Cpk results to learning and course guidance`

## 2026-09-26：ランキング比較から日本の仕事へ接続

- 主な事業の次に公開済みの業務を最大2件表示。共通企業IDで対応し、職種／事業機能、業務固有の勤務地、未確認事項、確認日、期限超過を併記。
- 根拠ページの企業アンカーで折りたたみを開く。既存related_clickにdestination=japan_workを追加。比較仕様・導線文書を更新。
- 実行：`node tests/unit/ranking-company-compare.cjs`、`npm run typecheck`（1回）、`git diff --check` は成功。`rg`で公開禁止語を検索し該当なし。
- build・devサーバー・ブラウザ検証は未実施。本番反映・GA4受信は未確認。反映日から28日間の結果閲覧→日本の仕事への遷移を観測。commit・pushなし。
- 推奨コミット：`feat: connect ranking comparisons to Japan work evidence`

このファイルは、現在の作業と主要な完了履歴を管理します。プロダクト要件は `docs/PRD.md`、文書の役割は `docs/documentation-map.md` を正本とします。

運用ルール:

- 未完了作業は「現在の優先タスク」へ置く
- 外部審査やデータ待ちは「保留・定期確認」へ置き、前提を書く
- 記事ごとの状態と次回確認日は `.private/article-index.md` を正本とする
- ASP の成果条件・禁止事項は `.private/affiliate-operations.md` を正本とする
- 公開済み記事をこのファイルへ1本ずつ重複列挙しない
- 完了時は、判断に必要な日付と結果だけを「完了した主要マイルストーン」へ残す
- 将来候補は現在の実装要件と混ぜない

## 現在の優先タスク

### 実務ツールの入力消失防止（2026-09-24）

- Cpk・工程比較の日英版、工程改善レポートのクリア／サンプル切替へ標準確認ダイアログを追加。編集・復元した非空の独自入力が実際に置き換わる場合だけ確認し、未編集の初期値・架空例、空入力、同じ値への置き換えは確認しない。
- 測定入力と報告文を別々に保護。測定入力のみのクリアでは報告文とその保護を維持し、報告文も置き換える場合は確認文に明記。保存操作で保護を解除せず、ファイル復元の既存確認には二重確認を追加しない。
- キャンセル時は状態と操作イベントを変更しない。画面内の保護状態のみ追加し、保存形式・計算式・外部送信項目は変更なし。
- `node tests/unit/input-replacement.cjs`、`node tests/unit/cpk-result-copy.cjs`、`node tests/unit/cpk-english.cjs`、`node tests/unit/process-comparison.cjs`、`node tests/unit/improvement-report.cjs`、`node tests/unit/practical-tools-english.cjs`を各1回実行し成功。確認ダイアログは模擬環境で了承／キャンセルを検証。
- `npm run typecheck`（1回）成功。ブラウザ・dev・build・commit・push未実施。本番反映は未確認。
- 推奨コミット：`fix: confirm before replacing edited tool inputs`。

### Cpk入力の不正値を除外せず修正を促す（2026-09-24）

- 日英の生データ計算は、読み取れない値が1件でもあれば停止。入力欄へフォーカスし、行番号・不正値を先頭5件まで表示（40文字超は省略、残件数を案内）。入力案内に桁区切りを含めないことを明記。
- 解析結果へ不正値の行番号・文字列を追加。既存の区切り・数値変換・空行・計算式・保存形式は維持。編集／復元で古い結果を消し、不正値を含む復元データも再計算時に検証。入力内容をイベントへ送信しない。
- `node tests/unit/cpk-result-copy.cjs`、`node tests/unit/cpk-english.cjs`を各1回実行し成功。正常形式、改行種別・空行の位置、不正値1件、5件／40文字の表示上限、修正後の再計算、復元、平均・短期標準偏差モード、日英表示、計測属性を確認。
- `npm run typecheck`（1回）成功。既存E2Eの解析結果期待値も更新したが、E2E・ブラウザは未実施。dev・build・commit・push未実施。本番反映は未確認。
- 推奨コミット：`fix: reject unreadable Cpk measurements before calculation`。

### ランキング2社比較の本番計測確認（2026-09-24）

- 本番反映と、世界表からの2社選択・比較例・コピー成功表示・企業詳細／指定企業の業界地図への遷移・共有URL復元を確認。実際のデプロイ日時は未確認。
- GA4の必要な3属性をイベントスコープで登録し、保存を確認。既存イベント・キーイベント・除外設定は維持。設定詳細・操作記録は非公開の運用記録へ保存。
- GA4受信は未確認。内部トラフィックの除外が有効だが、今回の接続との一致は未確認。ブラウザ接続が外れ、追加確認は未完了。分析で属性を利用できる状態も未確認のため、14日観測の開始日は未確定。
- 次：ブラウザ接続復帰後、除外条件・本番送信・GA4受信を照合。必要なら除外対象外の回線で検証し、通常表示の非発火・共有復元・再露出時の重複抑止を確認して観測開始日を確定する。
- `node tests/unit/ranking-company-compare.cjs`を1回実行し成功。前回のテストモック修正後の完走を確認。公開コード変更なし、dev・build・commit・push未実施。

### ランキングからの2社比較（2026-09-23）

- 実装済み：世界・日本の表で2社選択を共有、事業・役割比較、共有URL、公開地図の指定企業復元、最小計測、Threads用画像・投稿案。
- 検証：型チェック成功、実ChromiumのPC/390px操作成功、関連単体2本成功。残る2本はテストモック不足で失敗しモック修正済み・再実行なし。詳細は `docs/ranking-company-comparison-spec.md`。
- 次：運営者のcommit/push後、本番反映とGA4受信を確認して14日観測。単体2本の修正後確認は次の検証機会に行う。投稿は運営者が行う。


### 工程改善レポート（2026-09-23）

- 実装・公開設定済み：新ページ、既存比較から同画面編集、A4印刷/PDF、入力保存・旧比較ファイル読込、架空見本画像、一覧・SEO・sitemap、プライバシー・計測・直接課金検証方針。
- 検証：関連テスト6本各1回・型チェック1回成功。実ChromiumのPDFは通常例1ページ／上限例2ページ、390px表示の横はみ出しを修正。詳細と変更部品は `docs/improvement-report-spec.md`。
- 次：運営者のcommit/push後に本番反映・GA4受信を確認し、14日観測と実務者3〜5人の試用。Threads投稿は運営者が行う。実機スマホと他ブラウザ印刷は未確認。


### 平均の測定計画ツール（2026-09-23）

- [x] `/tools/measurement-planner` を日本語・index可能で追加。95%正規近似、想定σ固定の概算、整数切上げ・100万件上限。入力、架空例、3案比較、時間、計画コピー・手動フォールバックを実装。
- [x] 編集時に旧結果・コピーを破棄。上限超過は丸めず、比較案だけの失敗は行単位で表示。単一平均の推定と検出力・不良判定を区別し、出典・更新日を表示。
- [x] Cpk・工程比較の日本語結果、ツール一覧、関連教材、canonical・構造化データ・sitemap・OG画像を接続。共通計測とコピー成功イベントを追加し、初期サンプルを成果から除外。
- [x] `node tests/unit/measurement-planner.cjs`、`node tests/unit/practical-tool-journey.cjs`、`node tests/unit/cpk-english.cjs`、`node tests/unit/practical-tools-english.cjs`を各1回実行し成功。`npm run typecheck`（1回）、`git diff --check`成功。
- [x] `node scripts/generate-measurement-planner-card.cjs` で同じ計算からThreads/OG用1200×630 PNGを生成し目視確認。数値は246/62/16件、123/31/8分。投稿案・UTM URLを仕様書に記録。
- [ ] 実ブラウザ操作・本番反映・GA4受信・Threads投稿は未確認/未実施。dev・build・commit・push未実施。

変更ファイル：新規 `src/app/(ja)/tools/measurement-planner/page.tsx`、`src/components/MeasurementPlanner.tsx`・同CSS、`src/data/measurement-planner.ts`、`src/lib/measurement-planner.ts`、`tests/unit/measurement-planner.cjs`、`docs/measurement-planner-spec.md`、`scripts/generate-measurement-planner-card.cjs`、`public/images/measurement-planner-comparison.png`。更新 `src/app/sitemap.ts`、`src/components/PracticalToolNextSteps.tsx`、`src/components/ToolsLearningLab.tsx`、`src/data/learning-tools.ts`、`src/lib/use-practical-tool-journey.ts`、`tests/unit/practical-tool-journey.cjs`、`docs/PRD.md`、`docs/architecture.md`、`docs/conversion-architecture.md`、`docs/documentation-map.md`、`TASKS.md`。

推奨コミット：`feat: add mean measurement planning tool`

### 成長改善・入力保存と再開（2026-09-23）

- [x] Cpk・工程比較の日英版へ共通の入力保存・読込を追加。UTF-8 2 MiBのJSON v1、入力のみ・未完成値も保存。日英間で共通、画面言語と入力名称は変更しない。
- [x] 読込検証と置き換え確認を分離。不正ファイル・キャンセルでは現状を維持。確定時に旧結果・コピー・エラーを破棄し、明示再計算を案内。端末へのダウンロード以外の永続保存や外部送信は追加しない。
- [x] `tool_workspace_file` は固定カテゴリのみで保存開始・復元完了・失敗を区別。保存仕様・プライバシー・計測文書を更新。
- [x] `node tests/unit/tool-workspace.cjs`、`node tests/unit/cpk-result-copy.cjs`、`node tests/unit/cpk-english.cjs`、`node tests/unit/process-comparison.cjs`、`node tests/unit/practical-tools-english.cjs`、`node tests/unit/practical-tool-journey.cjs`を各1回実行し成功。`npm run typecheck`（1回）、`git diff --check`成功。
- [ ] 実ブラウザでの保存→ページ再読込→復元→再計算と本番GA4受信は未確認。dev・build・commit・push未実施。

変更ファイル：`src/lib/tool-workspace.ts`、`src/components/ToolWorkspaceFile.tsx`、`src/components/ToolWorkspaceFile.module.css`、`tests/unit/tool-workspace.cjs`（以上新規）、`src/components/CpkCalculator.tsx`、`src/components/ProcessComparisonTool.tsx`、`tests/unit/cpk-result-copy.cjs`、`tests/unit/process-comparison.cjs`、`src/app/(ja)/privacy/page.tsx`、`docs/PRD.md`、`docs/architecture.md`、`docs/conversion-architecture.md`、`TASKS.md`。

推奨コミット：`feat: save and restore practical tool inputs locally`

### 成長改善・結果からの回遊（2026-09-23）

- [x] Cpkと工程比較の結果欄に、相互の実務導線と日本語の学習導線を追加。英語は公開済み英語ページのみ。別タブ・自動データ転送なしと明記。
- [x] `tool_result_related_click` を固定カテゴリのみで追加。初期サンプルにも表示するため、クリックを計算成功とは扱わない。
- [x] `node tests/unit/cpk-result-copy.cjs`、`node tests/unit/cpk-english.cjs`、`node tests/unit/process-comparison.cjs`、`node tests/unit/practical-tools-english.cjs`、`npm run typecheck`（1回）、`git diff --check`成功。追加のNode SSR確認で遷移先・英語表示・別タブ属性・英語公開ゲートを確認。
- [ ] 実ブラウザ・本番反映・GA4受信未確認。dev・build・commit・push未実施。

変更ファイル：`src/components/PracticalToolNextSteps.tsx`・同CSS（新規）、`src/components/CpkCalculator.tsx`、`src/components/ProcessComparisonTool.tsx`、`tests/unit/cpk-result-copy.cjs`、`tests/unit/process-comparison.cjs`、`docs/PRD.md`、`docs/architecture.md`、`docs/conversion-architecture.md`、`TASKS.md`。

推奨コミット：`feat: connect practical tool results to next steps`

### 成長改善・ツール一覧（2026-09-23）

- [x] 自分のデータ・数値を使う5ツールと教材で学ぶツールを実装に基づいて分類し、ロードマップとカードの共通フィルターを追加。入力方式を明記し、一律の「実務利用：可能」と管理図の「実務向け」を修正。
- [x] クリック記録を「体験済み」から「この一覧から開いたツール」へ訂正。ブラウザ内の履歴であり完了記録でないことを表示。不正な型・未知ID・重複を除外。ゲーム案内を選択導線の後へ移動。
- [x] `npm run typecheck`（1回）、Nodeによる分類・不正履歴・重複・SSR全カードと表示文言の確認、`git diff --check`成功。
- [ ] 実ブラウザ操作・本番反映は未確認。dev・build・commit・push未実施。

変更ファイル：`src/data/learning-tools.ts`、`src/components/ToolsLearningLab.tsx`、`src/app/globals.css`、`docs/PRD.md`、`docs/architecture.md`、`docs/conversion-architecture.md`、`TASKS.md`。

推奨コミット：`fix: clarify tool purposes and browsing history`

### 成長改善・実務ツール計測（2026-09-23）

- [x] Cpk・工程比較の日英UIへ入力部露出、開始、サンプル選択、計算試行、エラー、操作後の結果露出を追加。共通イベントは各段階をマウント中1回、固定カテゴリのみ送る。初期Cpkサンプルを成果から除外し、工程比較のクリアだけでは開始を数えない。
- [x] 共通フックのモック監視テスト、Cpk結果コピー・英語UI、工程比較、実務ツール英語UIの5テスト成功。工程比較の旧イベント限定の期待値を、新しい固定カテゴリを許可するプライバシー検証へ更新して再実行。`npm run typecheck`（1回）、`git diff --check`成功。
- [ ] 本番反映・GA4受信・カスタムディメンションdata_sourceの登録は未確認。ブラウザ・dev・build・commit・push未実施。

変更ファイル：`src/lib/use-practical-tool-journey.ts`（新規）、`src/components/CpkCalculator.tsx`、`src/components/ProcessComparisonTool.tsx`、`tests/unit/practical-tool-journey.cjs`（新規）、`tests/unit/cpk-result-copy.cjs`、`tests/unit/cpk-english.cjs`、`tests/unit/process-comparison.cjs`、`tests/unit/practical-tools-english.cjs`、`docs/PRD.md`、`docs/architecture.md`、`docs/conversion-architecture.md`、`TASKS.md`。

推奨コミット：`feat: measure Cpk and process comparison usage funnels`


### 成長改善・スマホ配置（2026-09-23）

- [x] タイムマシンのDOM順を再生・年選択→チャート→企業追跡・共有へ変更。960px以上では左列に操作・追跡、右列にチャートを配置。冒頭に再生と企業タップの案内を追加。
- [x] ツール側の共通計測を `mobile-v2` とし、記事入口の `entry-v1` と区別。基準期間未確保・露出監視対象の大きさ変更による比較の限界を記録。
- [x] `node tests/unit/ranking-time-machine.cjs`、`npm run typecheck`（1回）、`git diff --check`成功。既存の再生・選択・共有・計測・SSRを確認。
- [ ] 実画面・本番反映・GA4受信は未確認。dev・build・ブラウザ・commit・push未実施。

変更ファイル：`RankingTimeMachine.tsx`、`TimelineControls.tsx`、`ranking-time-machine.module.css`、`src/app/(ja)/tools/ranking-time-machine/page.tsx`、`docs/PRD.md`、`docs/architecture.md`、`docs/conversion-architecture.md`、`TASKS.md`。

推奨コミット：`fix: bring ranking charts closer to mobile playback controls`

### 成長改善・第1差分（2026-09-23）

- [x] Cpkの日英共通UIで入力編集直後に旧結果・分布図・コピーを破棄し、再計算を案内。サンプル切替は即時結果表示を維持。
- [x] 時価総額記事は2010年のNVIDIA追跡、装置売上記事は2010年の装置5社・東京エレクトロンへ接続。
- [x] タイムマシンの入口露出・操作部露出・初回操作・操作後の結果露出を計測。画面外・背景タブ・単なるマウント・初期URL復元を成果と扱わず、マウント中の初回イベントを重複防止。既存の詳細操作・共有イベントは維持。
- [x] `node tests/unit/cpk-result-copy.cjs`、`node tests/unit/cpk-english.cjs`、`node tests/unit/observe-visible.cjs`、`node tests/unit/ranking-time-machine.cjs`、`npm run typecheck`（1回）成功。計測テストはDOM監視・Reactハンドラの模擬環境であり、本番受信や実画面の検証ではない。
- [x] 実験の定義、旧イベントとの対応、14日間の観測手順、Threads投稿案を `docs/conversion-architecture.md` に記録。
- [x] ユーザーによるpush後、342365aの変更を公開HTML・配信JSで確認（2026-09-23）。
- [ ] GA4受信とカスタムディメンション設定、Threads用画像または動画の作成・投稿、実画面確認。
- [x] Cpk・工程比較の日英UIに共通の利用計測を追加（本番受信は未確認）。

変更ファイル：

- Cpk：`src/components/CpkCalculator.tsx`、`src/data/cpk-text.ts`
- 計測：`src/lib/observe-visible.ts`（新規）、`src/components/TrackedInternalLink.tsx`、`src/components/guide/GuideBlocks.tsx`
- ランキング：`src/components/ranking-time-machine/RankingTimeMachine.tsx`、`src/components/ranking-time-machine/RankingHistoryArticle.tsx`、`src/components/ranking-time-machine/ranking-time-machine.module.css`、`src/content/guides/semiconductor-market-cap-ranking.ts`、`src/content/guides/semiconductor-equipment-sales-ranking.ts`
- テスト：`tests/unit/cpk-result-copy.cjs`、`tests/unit/cpk-english.cjs`、`tests/unit/ranking-time-machine.cjs`、`tests/unit/observe-visible.cjs`（新規）
- 文書：`docs/PRD.md`、`docs/architecture.md`、`docs/conversion-architecture.md`、`TASKS.md`

推奨コミット：`fix: invalidate stale Cpk results and measure ranking journeys`

### ランキング・タイムマシン（2026-09-22）

- [x] 2026-09-23：日本企業10社モードと比較記事2本を実装。追加144件をCompaniesMarketCapの取得HTMLの表セルと照合。東京エレクトロン16件を再利用。日本モード・共有・追跡・記事入口イベント・9社ロゴ・出典・内部リンクを追加。
- [x] 検証：`RANKING_JAPAN_SOURCE_DIR=/private/tmp node tests/unit/ranking-time-machine.cjs`、`npm run typecheck`（1回）、`git diff --check`成功。既存392件はHEADと一致。公開禁止語の追加差分チェック通過。関連リンク件数の期待値とSSRテスト用formatモックを更新して対象テストを完了。build/dev/ブラウザ/commit/push未実施。
- [x] 日本記事は全16年の表と端点比較・3つの年末逆転、NVIDIA対Intel記事は線形SVGと16年表を同じデータからSSR出力。公開情報記事として公開設定。人間による確認表記は付けない。
- [ ] 本番反映後28/56日：記事別Search Console表示/クリック/検索語、記事→ツール入口、日本モード再生/選択/共有を観測。実画面・本番GA4受信・検索登録は未確認。


- [x] 2026-09-23：比較モードを追加。半導体20社／GAFAM・トヨタを含む26社（2014〜2025年）／装置5社。新規72件を出典表記と照合し、既存320件の不変を確認。6社のロゴを取得・確認。
- [x] モード切替時の停止・年補正、確定値の1社追跡、5行表示、共有ハッシュ復元・コピー代替、モード付き既存イベントとmode_change/shareを実装。説明・SEO・関連導線・PRD・architectureを更新。
- [x] `RANKING_REFERENCE_SOURCE=/private/tmp/ranking-reference-source.json node tests/unit/ranking-time-machine.cjs`、`npm run typecheck`（1回）、`git diff --check`成功。3モードの対象・期間、圏外追跡、再生/リセット/切替、URL復元・不正値・通常アンカー、コピー成否・計測、SSRを確認。公開禁止情報の差分確認済み。
- [ ] 比較モードの本番反映後4週間で、モード利用・再生・企業選択・共有操作を観察。ブラウザ実画面と本番GA4受信は未確認。build・devサーバー・commit・pushは未実施。

- [x] 2026-09-23：チャートの企業識別をロゴのみへ変更。透明余白を除いた図柄の縦横比で拡大し、表示枠は32px高・最大140px幅。Avago・画像なし・読込失敗時は企業名を表示。読み上げラベル・title・詳細・表の企業名は維持。20画像の寸法・透明領域を確認。`node tests/unit/ranking-time-machine.cjs`、`npm run typecheck`（1回）、`git diff --check`成功。ブラウザ・実機確認は未実施。

- [x] 2026-09-23：開始年を2010年へ拡張。2010〜2014年の実データ100件を追加し、全16年・320件を出典と照合。2010〜2015年はAvago表記。初期表・比較基準・metadata・関連導線・仕様を更新。`RANKING_SOURCE_CHECK=/private/tmp/ranking-time-machine-source-check-2010.json node tests/unit/ranking-time-machine.cjs`、`npm run typecheck`（1回）、`git diff --check`成功。公開禁止情報の差分確認済み。ブラウザ・build・commit・pushは未実施。

- [x] 2026-09-23：チャートの企業名に32pxのロゴを追加。20社分のPNG（計144,915バイト）をローカル保存し、取得先・取得日・権利者の説明を記録。Avago表記時はBroadcomロゴを非表示。画像確認・既存対象テスト・`npm run typecheck`（1回）・`git diff --check`成功。ブラウザ・実機確認は未実施。

- [x] 2026-09-23：チャートの数値・幅・横軸を年末値間で3秒かけて補間し、値の交差で順位を更新。補間値であることを明記し、停止時と表・詳細は確定値を表示。最終年の補間完了まで再生状態を維持。補間端点・順位逆転・中断・reduced-motion切替・フレーム破棄の対象テスト、`node tests/unit/ranking-time-machine.cjs`、`npm run typecheck`（1回）、`git diff --check`成功。ブラウザでの滑らかさと実機性能は未確認。

- [x] 2026-09-23：PCの時間操作をチャート左へ配置し、冒頭説明・余白・行高を縮小。企業名の折り返しと44px以上の操作領域を維持。`node tests/unit/ranking-time-machine.cjs`、`npm run typecheck`（1回）、`git diff --check`成功。ブラウザでの画面内収まり・実機確認は未実施。

- [x] 主要20社の2015〜2025年末時価総額220件をCompaniesMarketCapから取得。対象20社内比較、装置5社、企業全体の評価額、Avago系列、対象外企業を明記。
- [x] 再生・停止・リセット・年選択、上位10社の移動、企業詳細・20社表、出典、metadata・構造化データ・sitemap・記事と一覧の導線・5イベントを実装。
- [x] 対象テスト（順位・同値・欠損拒否・再生/停止/年/企業操作・非表示時停止・計測・SSR）と既存装置売上の回帰テスト通過。取得結果と220件を照合。型チェック1回成功、差分・公開禁止語確認済み。
- 実行：`RANKING_SOURCE_CHECK=/private/tmp/ranking-time-machine-source-check.json node tests/unit/ranking-time-machine.cjs`、`node tests/unit/equipment-sales.cjs`、`npm run typecheck`、`git diff --check`。ソース照合用の取得記録は一時ファイルで、通常の単体テストは環境変数なしでも実行できる。
- [ ] 本番反映・モバイル実画面・本番GA4受信。build・devサーバー・ブラウザ・commit・pushは今回の実施対象外。

### 外資系企業「日本の仕事」探索ボード（2026-09-22）

- [x] 10社を調査し、公式根拠がある8社・14業務を実装。AMD・TIは掲載準備中として別記。KLA・Infineonの2拠点を共有。
- [x] PC対応表・スマホカード、同じ業務記録での仕事×地域絞り込み、詳細・根拠、最大2社比較、既存導線、初期HTML、検索設定・計測を追加。
- [x] 対象単体テスト・React初期HTML検証が通過。テスト読み込み処理のdirectory index未対応を修正後に同一コマンドを再実行。
- [x] 差分・公開禁止情報を確認。
- [ ] 型チェックは1回実行し、Career Compass結果へのリンク追加でJSXの親要素エラーを検出。条件分岐外へ移して修正済み。実行上限に従い修正後の型チェックは未実施。
- [ ] 本番反映日を記録し、4週間後に操作・公式情報遷移を評価。ブラウザ・実端末確認は未実施。
- 詳細：[仕様・根拠範囲・更新手順](docs/global-japan-work-spec.md)。


### 工程図鑑：ウエハの準備（2026-09-22）

- [x] 精製済みシリコンからCZ単結晶・円板・鏡面仕上げまでの8工程を追加。加工ダメージ除去と洗浄、材料の検査と回路の試験を区別し、薄膜加工へ接続。
- [x] 独自SVG・純粋モデル、体験別履歴・v5計測、静止解説・メタ説明・一覧・記事入口・正本文書を更新。
- [x] 対象テスト・型チェック1回・差分確認・禁止情報確認が通過。8工程の形状変化、6体験の履歴／計測、再生・再開始・次体験への遷移を確認。
- [ ] ブラウザ・実機・学習試用・本番反映。設計や全製造方式の操作は未実装。

### 工程図鑑：ウエハ検査・最終検査（2026-09-22）

- [x] 接触・測定・比較・記録を分ける各4工程、プローブ／ソケットの違い、遅延表示する固定応答と代替表を追加。全体図・配線／組立まとめ・検査間を接続。
- [x] 体験別進捗・v4計測、静止解説・一覧・メタ説明・出典・記事入口、仕様と正本文書を更新。
- [x] 対象テスト・型チェック1回が通過。両検査の描画状態・応答／結果の開示時期・代替表・5体験の履歴と計測・公開導線を確認。差分・禁止情報を照合。
- [ ] ブラウザの画面サイズ別確認、公開後の試用・検索需要・本番反映。ウエハ準備は将来候補。

### 工程図鑑：配線づくり＋CMP（2026-09-22）

- [x] 正常な埋め込み配線7工程、CMPの表面導電膜除去・内壁保持・洗浄の区別、静的な接続経路強調を追加。3体験の定義参照で操作とレイアウトを共有。
- [x] 全体図・薄膜加工まとめ・配線／CMP記事から接続。静止図・SEO・3体験の一覧説明・出典・仕様文書を更新。
- [x] 対象テスト・型チェック1回・差分・禁止情報確認が通過。3体験の切替・再生・履歴／計測と、配線形状・SSR・公開導線を確認。
- [ ] 公開後の試用・検索需要・本番反映。ブラウザの画面サイズ別確認は未実施。検査とウエハ準備は将来候補。

### 工程図鑑：切り分け・組み立て（2026-09-22）

- [x] 独立して入れる組立7工程、対象チップの目印、外観／内部表示、最終検査・記事への接続を追加。操作は薄膜加工と共有し、進捗・計測を体験別に分離。
- [x] TI・DISCOの一次情報と簡略化範囲を照合。静止解説・出典・SEO・一覧説明・記事入口、PRD・architecture・専用仕様・索引を更新。
- [x] 対象テスト・型チェック1回・差分確認を通過。SSRのtitle警告を修正し、組立形状・7工程操作・体験切替・計測・公開入口を確認。
- [ ] 公開後の利用状況・学習試用。ブラウザのサイズ別確認、本番反映は未実施。配線＋CMP以降は将来候補。

### 工程図鑑の次工程操作（2026-09-22）

- [x] 「次の工程 →」で移動と再生を同時実行。戻る・一覧選択は加工前で停止し、低モーションでは完了図を表示。
- [x] 対象テスト（1操作再生・連続移動・旧フレーム破棄・戻る・一覧・低モーション・計測）、型チェック1回、差分確認が通過。ブラウザ・build・commit・pushは未実施。

### 工程図鑑のPC操作領域（2026-09-22）

- [x] 加工体験の図を画面高に合わせ、主要操作を同じ領域へ集約。開始時にヘッダー直下へ位置合わせし、工程移動・再生中は位置を維持。小画面では自然スクロールを維持。
- [x] 対象テスト、型チェック1回が通過。ブラウザでのサイズ別実測・build・commit・pushは未実施。

### 公開時の承認待ちを減らす標準運用（2026-09-22）

- [x] 運営者の方針を受け、技術ツール・REFは出典・数値・匿名化・必要な検証後に初回からpublished・index可能とする標準へ変更。追加の人間承認・定型noindex・3人試用待ちは一律の公開条件にしない。
- [x] AGENTS・PRD・SEO・記事制作と編集ガイドを整合。EXPの本人確認、重要な未確認情報・重大な不具合・機密・明示的な下書き指定は保留条件として維持。既存draftの一括公開や公開コード変更は行っていない。
- [x] 過去の個別仕様のレビュー・試用待ちを新規の定型ゲートとして引き継がず、実施状況は事実どおりに記録する。commit・pushの明示依頼ルールは維持。


### 相関と因果ラボ（2026-09-22）

- [x] 架空の半導体加工1ケース、仮説→層別→2方法の実験→振り返り、SVG・表・固定分類計測を実装。回答・観測の保存なし。
- [x] 静的解説・出典・SEO、review/publishedによるnoindex・一覧・関連リンク・sitemapの連動を実装。初版は内容レビュー待ちとして実装。仕様・PRD・architectureを更新。
- [x] 変更20ファイルの禁止情報照合、CSS参照、差分確認が通過。
- [x] 数値テストと型チェック1回が通過。UIテストは両順の操作・連打・戻る・フィルター不変・再挑戦・振り返り・失敗停止・計測制限、review状態のSSR・メタデータ・入口非掲載まで通過。
- [x] ユーザーの継続指示後、修正済みローダーでUIテストを1回実行し全体完走。review/published両状態のメタデータ・一覧・関連リンク・sitemap掲載と更新日、図表SSRまで通過。初回停止の履歴は専用仕様に保持。実画面・本番確認とは区別する。
- [x] 2026-09-22に運営者が内容を承認し、公開を指示。publishedへ切替し、noindex解除・sitemap・一覧・関連入口を有効化。 実データのpublished確認を追加したUIテスト、差分・禁止情報照合が通過。
- [ ] 初学者を含む3人の約5分試用、依頼時の実機スマホ・キーボード・表示拡大確認。[専用仕様](docs/correlation-causation-spec.md)。
- [x] 運営者からpush済みの報告を受領（2026-09-22）。
- [ ] 本番反映日と14/28/56日の登録・検索・開始→比較完了→DOE遷移を確認。本番ページ・一覧・DOE・工程比較・sitemap・robotsのHTTP確認は実行環境の名前解決エラーで未完了。Vercelデプロイ完了・本番表示は未確認。


### AI外観検査ラボ：初版機能・導線・検索公開設定完了（追加検証あり）（2026-09-22）

- [x] 合成画像生成、4構成×3シードのU-Net学習、ONNX変換、調整・開発評価、明るさ・背景差し替え・領域評価、実験記録を実装・実行。各モデル477,448 bytes。最終評価群は推論未使用。
- [x] TypeScriptの照明変換・ルール・連結成分・AI後処理・見逃し／過検出集計を独立実装。Python参照との対象テスト、Python 5テスト、PyTorch/ONNX照合、型チェック1回、差分確認が通過。
- [x] PRD・構成・文書索引・[仕様](docs/ai-visual-inspection-spec.md)を更新。[実測報告](docs/ai-visual-inspection-validation.md)と機械可読結果に成功・未達を分けて記録。
- [x] 追加指示に基づき生成器v2で撮影条件を良否から独立化。模様不足は良品だけ変更し、不良画像を固定。配列・メタデータ監査と生成・損失の4テストが通過。
- [x] v2の48枚・最大320更新の段階検証を実行。見逃し0／24、過検出2／24、汚れIoU 0.856・傷IoU 0.690。PyTorch/ONNXの48枚の最終領域一致を確認。[v2報告](docs/ai-visual-inspection-v2-validation.md)を保存。これは学習画像での結果であり、未知画像への性能ではない。
- [x] v2初回の少数画像ゲート未達の記録は保持。ユーザーの追加指示後、別実験で同じ基準のまま240更新を追加し、汚れIoU 0.966・傷IoU 0.868、見逃し・過検出0で2回連続通過。
- [x] tinyの重みを使わず2,400枚で基準モデルを新規学習。調整400枚で9・10エポック目に条件を連続充足。設定固定後の開発600枚も見逃し4／300・過検出17／300、傷IoU 0.626で通過。PyTorch/ONNX照合24枚の最終領域は一致。[追加学習報告](docs/ai-visual-inspection-v2-followup-validation.md)へ記録。
- [x] v2の4構成×3シードを同じ2,400枚・10エポック・750更新・しきい値0.5・面積12で比較。基準17の重みを再利用し、11本を新規学習、12条件を同じ開発600枚で評価。汚れ偏重・誤ラベルによる傷見逃し増加、良品模様不足による過検出増加は各3シードで確認。良品模様不足の1シードで傷指標が改善する結果も保持。[比較報告](docs/ai-visual-inspection-v2-comparison-validation.md)へ記録。
- [x] 全12条件のPyTorch/ONNX照合24枚で検出領域が一致。比較画像を生成・目視確認。対象Pythonテスト11件が通過。各学習約100秒、タイムアウト・条件変更での再試行なし。
- [x] 基準モデルの領域精度を安定化。旧29・43の傷IoU 0.489・0.475の未達記録を保持し、全3本に固定条件で6エポック追加。調整群通過後の開発群でも傷IoU 0.789・0.643・0.638で全3シード通過。しきい値と合格基準は変更なし。[安定化報告](docs/ai-visual-inspection-v2-stability-validation.md)を保存。対象Pythonテスト11件と全3モデルのONNX照合24枚が通過。
- [x] 残る偏り・誤ラベル9モデルへ同じ6エポック・学習率・Adam再初期化を適用し、全12本を16エポック・1,200更新へ統一。[比較更新報告](docs/ai-visual-inspection-v2-matched-validation.md)を保存。汚れ偏重・誤ラベルの傷見逃し増加、良品模様不足の過検出増加を各3シードで確認。良品模様不足の過検出差は1〜14枚で、傷指標の改善も残す。全12本のONNX領域照合24枚と保存領域からの再集計が一致。対象Pythonテスト11件、比較画像確認が完了。旧基準・旧比較は保持。
- [x] v2のルール2方式と全12モデルを倍率0.7・1.0・1.3で評価。ルールは調整400枚から設定、AIは0.5固定。単純な汚れは基本ルールで見逃し0／50・過検出0／100。全条件で入力画素ハッシュを照合し、保存領域・集計・OR併用を検証。[明るさ比較報告](docs/ai-visual-inspection-v2-lighting-validation.md)へ全曲線と変化画像IDを記録。Python既存11件＋追加2件、TypeScript対象テストが通過。比較画像を確認。ブラウザ性能としては未検証。
- [x] 背景を2通りに交換した600枚ずつを全12モデルで評価。元背景の再描画600枚は完全一致。基準3シードは両置換で通過。モデル・処理・データ・条件を固定して最終群を開封し、ルール2方式＋全12モデルを3倍率で評価。基準通常条件は見逃し0／300、過検出8・10・2／300、傷IoU 0.812・0.643・0.641で全3シード通過。単純汚れルールは0／50・0／100。[最終報告](docs/ai-visual-inspection-v2-holdout-validation.md)へ開封履歴とハッシュを保存。全12モデルのONNX照合24枚、保存領域・母数・OR集計の一致、Python既存13件＋固定解除防止2件、画像確認を完了。
- [x] Worker・WASM推論基盤、古い要求の破棄、画素単位のスコアキャッシュ、失敗時の未評価契約、固定4モデル・ランタイム・ライセンスの静的配信を実装。対象Client/Runtime/既存画素テストと型チェック1回が通過。gzip試算約3.33MB（UI除外）。[実装記録](docs/ai-visual-inspection-web-runtime.md)。
- [x] 継続指示後、WASMの微小な負値（最小約-1.19e-7）を特定。float32 epsilon以内だけ出力境界で補正し、それ以外は拒否。実WASMの4モデル×3倍率×開発24枚でPythonの画素・ルール・AI領域が完全一致、最大スコア誤差約4.65e-6。対象4テスト・型チェック1回・固定ロック照合が通過。[数値記録](docs/ai-visual-inspection-wasm-validation.json)。モデル・合格条件は変更なし。ブラウザ・実端末性能は未検証。
- [x] 比較UIと5段階フローを `/tools/ai-visual-inspection` に追加。固定24枚の練習・確認、学習代表例、領域表示、拡大、見逃し・過検出、設定固定と確認済み保持、採用理由の振り返り、固定カテゴリ計測、プライバシー表記を実装。[UI記録](docs/ai-visual-inspection-ui.md)。教材・UI対象テストと型チェック1回が通過。
- [x] 初回ブラウザで実Worker/WASM起動、練習24枚、汚れ偏重モデル、明るさ0.7倍、別24枚、dialogのEscとフォーカス復帰を確認。採用候補のラベル検索で自動確認が停止。選択欄のlabel/idとチェックボックスの配置を修正し、対象UIテスト・型チェック1回が通過。[ブラウザ記録](docs/ai-visual-inspection-browser-validation.md)。再実行なし、dev停止。
- [x] 選択欄修正後のブラウザ一周、390px縦配置・横はみ出しなし、実際のONNX取得失敗→未評価を確認。残る2モデル・学習画像も確認。24枚更新1,421ms、Worker初回5リソース約3.38MBを実測（開発PC環境、UI転送・実機性能は除外）。
- [x] 追加確認でスライダー名の検索が停止。rangeと数値入力のラベルを分離し、ID一意性を含むUI/SSRテスト・型チェック1回が通過。停止後のブラウザ再実行なし。
- [x] ユーザー指示でトップの技術ツール枠・学習ツール一覧・Gage R&Rから試用版への入口を追加。一覧は「教育用・試用版」、実務利用欄は「教育用」と明示。SSRのカード・リンク先・ID重複なし・型チェック1回を確認。今回のブラウザ・build・デプロイは未実施。
- [x] ユーザーの検索公開指示でnoindex解除・更新日付きsitemap掲載を実装。canonical・構造化データ・既存入口を維持。UI/SSRテスト・型チェック1回・sitemap掲載/日付・robots許可・差分を確認。本番反映・検索登録は未確認。
- [ ] 修正後のキーボード、フィルター、連続操作、取得失敗後の再試行、スマホdialog・実機性能・全初回転送量を確認する。検査記事の追加導線は今後の候補。最終群は開封済みであり、結果を根拠にモデル等を変更した場合は同群を開発用へ移し、新たな独立評価群を用意する。
- [ ] 人間による画像・ラベル・文面確認、製造経験者3人の試用、依頼時のブラウザ・スマホ・キーボード・実端末性能確認。build・デプロイ・commit・pushは未実施。

### タグチメソッド体験（2026-09-21）

- [x] `/tools/taguchi` に通常9観測→基準の誤差6観測→残り48観測→確認18観測の計81回体験を実装。L9の2列と3誤差状態、望小SN比・因子応答図・独立した確認群を扱う。
- [x] 実験IDによる測定再現、通常環境データのSN比除外、基準固定、本人による候補選択、同条件の確認、連打・リセット・解析失敗時停止を実装。
- [x] SVGの基準・候補比較、原料状態スライダー、履歴表、スマホ向け配置・キーボード・reduced-motion対応、静的本文、SEO、教育用一覧表示、DOE・BOからの導線、固定分類イベントを接続。
- [x] `node tests/unit/taguchi.cjs` と `node tests/unit/taguchi-ui.cjs` が成功。独立SN式・81回・確認データ・バッチ不変性・情報分離・操作フロー・SSR・計測制限を確認。`npm run typecheck`は1回で成功。差分・CSS参照・変更公開文書の禁止語確認も通過。
- [ ] 公開文面の人間レビューと製造経験者3人で約5分の試用を行い、誤差因子を振る理由、通常品質と変化への強さ、SN比の限界が伝わるか確認する。
- [ ] 依頼時にスマホ・キーボード・reduced-motionの実画面を確認。今回はdev・ブラウザ・build・デプロイ・commit・pushを未実施。詳細は `docs/taguchi-spec.md`。


### ベイズ最適化の体験学習（2026-09-21）

- [x] `/tools/bayesian-optimization` に自由実験→DOE→GP/LCBによる追加実験→確認→真値の振り返りの12回体験を実装。ブラウザ内計算・状態はメモリのみ。
- [x] 予測と真値の情報分離、乱数再現、観測最小と真の改善の区別、失敗時の停止、キーボード入力・数値入力・reduced-motion対応を実装。
- [x] 初期案の関数ではDOE中央がほぼ最良だったため谷を移動。30シードの共通予算・ノイズ条件でBOとランダムを評価し、限定された教材評価として専用仕様へ記録。
- [x] ツール一覧の教育用表示、DOE・成膜記事からの導線、sitemap・構造化データ・静的説明・固定分類イベント、PRD・architecture・専用仕様を更新。
- [x] `node tests/unit/bayesian-optimization.cjs`、`node tests/unit/bayesian-optimization-ui.cjs` と `npm run typecheck`（1回）が通過。独立数値参照、状態遷移、再挑戦、入力エラー、失敗、計測制限、SSRを確認。差分・CSS参照・変更公開ファイルの禁止語照合も通過。
- [ ] 運営者を含む製造経験者3人で、5分程度の完了と予測・真値・探索・ノイズの理解を確認。人間による公開文面レビューは未実施。
- [ ] 依頼時にスマホ・キーボード・reduced-motionの実画面と更新時間を確認。dev・ブラウザ・build・デプロイ・commit・pushは今回未実施。

### 日本語記事の改善2件＋新規Cpk記事（2026-09-21）

- [x] EFEMの位置関係図と公式出典付き4社比較表、時価総額ランキングの目的別入口・日本TOP10配置・指標説明整理を実装。ランキング数値とデータ基準日は維持。
- [x] 「Cpkが低い原因は？」を架空3例と既存ツールへの導線で作成。2026-09-21の運営者承認により公開状態へ切替。Cpkツールからのリンクも有効。
- [x] 英語EFEMは公開・確認済み本文を維持し、日本語の未反映更新日を記録。原文更新と翻訳確認日を混同しない。
- [x] 型確認1回、記事と英語版の対象テスト各1回、差分・禁止語確認が成功。dev・build・ブラウザは未実行。
- [ ] 運営者の公開承認済み。本番反映日を記録し、既存2件は前後28日、新規は14/28/56日で登録・検索流入・内部遷移を確認する。

### 英語実務ツール3本の追加実験（2026-09-21）

- [x] OEE・ラインバランス・工程条件比較を `/en/tools/` へ追加。共通計算を維持し、UI・エラー・図表・サンプル名・コピー・PNGを英語化。2026-09-21の公開指示により承認済み。
- [x] 個別の公開ゲート、canonical/hreflang、言語リンク、公開後の関連リンク・sitemap、英語操作計測を追加。公式出典で照合し、OEEの予定外時間と予定内停止の説明を日英で明確化。
- [x] npm run typecheckを1回、英語実務ツール・既存製造ミニアプリ・工程条件比較・Cpk英語版の対象テストを各1回実行し通過。CSS参照の実在・差分・公開禁止情報を確認。dev/build/ブラウザ未実施。
- [x] 2026-09-21の運営者の公開指示を受け、3ページそれぞれの公開状態・確認者RYO・確認日・公開日を設定。noindex解除・sitemap・相互言語リンク・関連リンクが有効になる公開実装状態へ切り替え。
- [x] 運営者から英語版の本番反映済みとの報告を受領（2026-09-21）。実際の反映日は未指定。
- [ ] 実画面・GA4受信を確認し、実際の本番反映日を記録して14/28/56/84日でURL別に観察する。

### Cpk英語版の追加実験（2026-09-21）

- [x] `/en/tools/cpk` を追加。既存コンポーネントへ言語指定を加え、計算/学習、サンプル、エラー、図表、コピー本文・失敗時案内を英語化。数式・サンプル値・データ非送信を維持。
- [x] 片側規格で規格中心に言及していた分析説明を、日英共通の片側規格専用説明へ修正。
- [x] 英語公開状態とnoindex・相互言語リンク・hreflang・sitemapを接続。NISTとMinitabの公式情報を確認し、英語解説・出典・日付を別データで管理。
- [x] 型チェック1回、Cpk英語版・既存コピー・学習の対象テスト各1回が通過。ヒストグラムのtitle警告を文字列結合で解消し、日英の対象SSRで警告なしを確認。計算関数・サンプル不変、公開禁止辞書を照合。dev/build/ブラウザ未実施。
- [x] 2026-09-21の公開指示を受け、`src/data/cpk-english.ts` の公開状態・確認日・公開日を設定。noindex解除・sitemap・hreflang・日英言語リンクが有効になる公開実装状態へ切り替え。本番反映は別途確認する。
- [x] 運営者からCpkを含む英語版の本番反映済みとの報告を受領（2026-09-21）。
- [ ] GA4のlocale受信と実際の本番反映日を確認し、Cpk英語URLをEFEMと分けて14/28/56/84日で観察する。

### EFEM英語版1本の検索需要実験（2026-09-21）

- [x] Vercelで判明したルート移動後のCSS参照漏れを修正（JevDemo・JevFactoryExperience・ProcessComparisonToolと対象テスト）。src内のCSS参照28件の実在確認とJEV・工程比較の対象テスト各1回が通過。ローカルbuild未実施、Vercel再ビルドは未確認。

- [x] 英語原稿・公式出典・原文更新日・翻訳日を別データとして追加。2026-09-21に運営者が原稿を承認。
- [x] 日本語URLを維持して言語別レイアウトを分離。英語の図表・目次・出典・言語切り替え、公開状態に連動するcanonical/hreflang/sitemap、共通計測、404を実装。
- [x] `npm run typecheck`（1回）、`node tests/unit/english-guide.cjs`（1回）、`git diff --check`が通過。既存app全47ファイルの移動先を照合し、意図した3ファイル以外の内容維持を確認。古いNext生成型キャッシュのみ削除。dev・build・ブラウザは未実施。
- [x] 2026-09-21の公開指示を受け、`status: published`、`publishedAt`、`translation.reviewedAt` を設定。noindex解除・日英言語リンク・hreflang・sitemap登録が有効になる公開実装状態へ切り替え。本番反映は別途確認する。
- [x] 運営者からEFEMを含む英語版の本番反映済みとの報告を受領（2026-09-21）。
- [ ] 本番ルーティング・メタデータ・GA4受信を確認し、実際の本番反映日を非公開台帳へ記録する。
- [ ] 本番反映から14日後に登録状態、28・56・84日後に英語クエリ・流入を確認する。追加翻訳は評価後に判断。

### トップの目的別入口への再構成（2026-09-20）

- [x] 技術・業界・キャリアの並列入口、代表ツール3件、研究リンク、集約したキャリア支援、おすすめ3件と重複しない新着4件を実装。
- [x] ツール情報を一覧・構造化データ・トップで共通化。一般リンク計測を追加し、キャリアの既存計測と分離。トップのメタデータ・専用CSS・導線文書を更新。
- [x] `npm run typecheck`（1回）・`git diff --check`が通過。公開記事レジストリを読み込み、おすすめ3件と新着4件の公開状態・重複除外・並び順、代表ツールIDを確認。静的リンクと変更公開ファイルの禁止語確認も通過。dev・build・ブラウザは未実施。
- [ ] 運営者が本番へ反映後、実画面・GA4受信を確認し、本番反映日から4週間の目的別遷移・利用を観察する。少数の場合は延長する。


### 分野別比較記事の主力化（2026-09-20）

- [x] 装置売上ランキング・メモリ売上シェア・光半導体用途比較の3記事を主力候補として、検索意図の境界と観察手順を `docs/seo.md` に記録。
- [x] 企業・業界記事一覧への掲載漏れを修正。時価総額ランキングの世界表直後に3記事の本文リンクを追加し、装置メーカー基礎記事から装置売上ランキングへ接続。
- [x] 3記事の比較条件・対象外をQ&Aで整理。市場データ・出典確認日を維持し、本文の更新日だけ更新。
- [x] `npm run typecheck`（1回）、`git diff --check`、追加リンク先の公開状態・一覧と見出しIDの重複・公開禁止語の確認が通過。コンテンツデータ変更のためdev・build・ブラウザ操作は未実施。
- [ ] 運営者が追加説明を確認して本番反映日を記録。14/28/56日後の登録・検索流入・内部遷移から、既存記事の強化と次の横展開を判断する。本番反映・GA4受信は未確認。

### 検索流入からCareer Compassへの改善（2026-09-20）

- [x] GA4で旧完了名だけがキーイベントに登録されていたことを確認し、現行 `career_compass_complete` を登録。広告外部クリックの既存設定を維持。
- [x] ランキングの企業研究欄へCareer Compassの入口を追加。共通リンクと記事リンク一覧に表示計測を追加し、既存クリックイベントを維持。
- [x] Search Consoleのクロール済み未登録21件を分類。CSS16・OG画像1・検索条件付きURL3・通常記事1であり、一律の本文修正は行わない。
- [x] `npm run typecheck`（1回）・差分・変更公開ファイルの禁止語確認が通過。dev・buildは未実施。
- [ ] `node tests/unit/career-compass-link.cjs` の全体完走を確認。表示閾値・監視解除・effect再実行・クリック送信までは通過後、テストのプロパティ順序比較で停止。順序に依存しない比較へ修正済みだが、再実行禁止ルールに従い未再検証。
- [ ] コードを本番へ反映後、入口の表示イベントを観察し、28日間のセッション単位で表示→クリック→開始→完了を評価する。
- [ ] イオン注入装置メーカー記事（クロール済み未登録）の最新URL検査と、検出済み未登録の転職の軸ノート・主要比較・主要工程ガイドを優先確認する。未登録という理由だけで出典未確認の本文を増やさない。
- [ ] SCREEN・TSMCの旧career-prep URLは本番HEADで308と正しいLocationを確認済み。転送先までのGET検証は環境の名前解決エラーで未完了。再クロール・Search Consoleの検証完了は未確認。

### 製造技術者サバイバル：原因調査プロトタイプ v3

- [x] 稼働90秒＋調査停止の2原因ケースへ改修。観察・封じ込め・比較試験・対策・対策後確認・製品履歴・結果振り返りを同じ状態ストアへ集約。SEO本文と計測の版IDを更新。
- [ ] [PC・スマホ実機チェック](docs/process-engineer-survival-checklist.md)で移動・複数タッチ・調査停止・工場の流れ・音・リトライを確認する（今回未実施）。
- [ ] 製造経験者・未経験者を含む3人のプレイテストで「何を変えたか」「選択の根拠」「仮説変更」「改善実感」を確認する。合格前は3分版・追加ステージへ拡張しない。

### Jev 不具合報告分類デモ

- [x] Jev全3ケースを「情報切替→9選択肢の確率変化」へ更新。初報目印・差分・開始後の自動評価・キャッシュ・手動再試行を実装。単体/型/対象lint成功。実API・ブラウザは未実施。
- [ ] Jev図解版のPC/スマホ・キーボード・動きを減らす設定・初報/追加後の理解を実機確認する（今回未実施、実APIも未呼出し）。
- [x] 2026-09-20：案Bを実装。架空3ケース×追加情報2分岐、Choice×2・Boolean・Scoreの同時評価、初報基準の確率比較、Jev選択の調査先と学習リンクを追加。
- [x] 2026-09-20：新質問版の全9条件を実APIで確認。材料分類のまま材料／測定系に分岐し、清掃・校正ケースは測定系／保全履歴に分岐。旧19/20一致とは別の教材観察として記録。

- [x] 2026-09-20：`/labs/jev` に架空10例×前後比較とAPI接続を実装。入力→分類→確信度→次の確認に絞ったUIへ整理し、noindexで運用。
- [x] 2026-09-20：Gatewayキーをローカル設定し、疎通1件と架空20条件を実測。仮の期待分類と16/20一致。記録は `.private/jev-evaluation`。
- [x] 2026-09-20：分類結果までブラウザ確認。固定サンプルから分類、確率、次の確認が表示されることを確認。
- [x] 2026-09-20：費用管理をVercel AI GatewayのAPIキー予算へ統一し、Upstash要件を削除。
- [x] 2026-09-20：Gatewayキーに累計予算を設定し、ローカルAPIを有効化。Next.js経由のOrigin拒否と成功応答を確認。
- [x] 2026-09-20：初回不一致4条件を踏まえ、測定器と製造設備、同一分野内の複数作業を明確化した質問版v2を再評価。仮の期待分類と19/20一致。
- [x] 2026-09-20：公開後に改善する方針へ変更。`noindex`を解除し、sitemap、`/tools`の正式入口、固定イベント計測を追加。Gatewayの累計予算と失敗時停止は維持。
- [ ] 本番反映後にページ・API・`/tools`導線・sitemap・イベント受信を確認する。教材の判断基準は本番利用と実測を見ながら更新し、実測記事は別途取材後に作成。


### 光半導体メーカーの用途別比較

- [x] 2026-09-18：公式製品情報をもとに6社・4用途の図解、用途選択、連動企業説明、出典付きSSR比較表と記事をローカル実装
- [ ] push前に運営者が本文・製品対応・公開可否を確認。本番反映後に用途選択イベント受信、14日後のインデックス、28/56日後の検索流入と関連遷移を確認する

### メモリメーカーランキング

- [x] 2026-09-18：初稿提示後の実装依頼を受け、DRAM/NAND切替・固定100%尺度グラフ・出典付きSSR両表・記事・関連記事・計測を公開対象として実装。対象単体テスト・typecheck各1回・差分・禁止語確認は通過
- [ ] 本番反映・市場切替イベント受信を確認し、公開14/28/56日後に検索表示と関連遷移を評価する

### 工程から探せる半導体製造装置売上ランキング

- [x] 2026-09-17：2025暦年の上位10社を公式IR資料で確認し、固定尺度グラフ・工程選択・製品説明・出典付きSSR一覧表・操作イベントを実装
- [x] 2026-09-17：運営者の了承を受け、記事を `published` に変更。公開日を同日として公開対象・sitemap・関連記事に登録（本番反映は未確認）
- [ ] 本番反映後、操作イベント受信を確認。公開14日後にインデックス、28日・56日後に検索流入と企業・技術記事への遷移を確認する

### 半導体職種マップの事前検証（2026-09-16）

- [x] 4職務群の公式資料台帳、18業務の選択票、理由付き結果カード、手計算ケースを作成
- [x] 初期の5人試用案と、検証後の8職務群MVP引継ぎ仕様を作成
- [x] 公式資料6件を追加して対応表を版0.2へ更新。P2・P3の根拠候補を補強し、P1のばらつき監視・P4の原因解析は追加確認事項として保持。人のレビュー・試用完了とは扱わない
- [x] 2026-09-17の運営者判断で、4職務群・18業務・理由付き最大3候補・検索語コピーを `/roles` の公開β版へ昇格。トップ・Career Compass・sitemap・固定イベントを接続
- [x] 2026-09-17にmainへ反映し、Vercelデプロイ成功、公開URLの200応答・canonical・sitemap掲載・旧試作URLの404を確認
- [x] 2026-09-17の運営者判断で5人の個別試用をスキップし、固定イベント・任意の問い合わせ・Search Console・根拠レビューによる運用検証へ変更
- [ ] 運営者が対応付けをレビューし、中心業務の追加根拠と利用条件を確認する
- [ ] 本番で4つの固定イベントが受信でき、回答内容・検索語を送っていないことを確認する
- [ ] 運用検証と追加Profileの根拠条件を満たした後、残る4職務群を整えて拡張する

詳細は `docs/role-map-pilot.md`、`docs/role-map-validation.md`、`docs/role-map-mvp-spec.md`。公開β版は `/roles`。個別試用の参加者募集は行わない。本番イベント受信と運営者レビューは未実施。

### 工程条件の比較ツール（2026-09-16）

- [x] 2条件の測定値、共通規格、記述統計、相対度数ヒストグラム、表コピーとPNG生成を実装
- [x] 一覧・Cpk・DoE・sitemapの導線、公開出典、PRD・architectureを更新
- [x] `npm run typecheck`（1回）、`git diff --check`、公開禁止語チェックが通過
- [ ] `node tests/unit/process-comparison.cjs`の全体完走を確認。計算・入力検証・TSV/SVG生成のassertは通過後、UI用CSSモック不備で停止。モック修正済みだが再実行禁止ルールにより未再検証
- [ ] 依頼時にブラウザで表示・PNG・コピー・失敗時の手動コピーを確認（今回build・dev・ブラウザ操作は未実施）
- [ ] 技術者3人による試用と、2人以上の再利用意向を確認する

入力・結果はメモリ内のみ。計測は固定イベント名のみで、生データ・条件名を送信しない。commit・push・公開は未実施。

### 山積み表・ラインバランス／OEE改善ミニアプリ（2026-09-13）

- [x] 山積み表で工程・作業の追加削除、所属変更、タクト超過、最長工程、比較基準、リセットを実装
- [x] OEEの現状計算と停止・性能・良品率の改善シナリオ、推定総生産数・良品数・増分を実装
- [x] 入力矛盾を理由付きで表示し、入力データを送らない閲覧・初回操作・作業移動・改善条件変更イベントを追加
- [x] 固有URL、メタデータ、構造化データ、sitemap、ツール一覧・トップ・管理図からの導線を追加
- [x] 指定計算例、異常入力、PC／Pixel 7相当の操作と横幅、本番Webpackビルドを確認
- [ ] 本番反映後に新規イベントのGA4受信を確認し、検索流入と利用を観察する

ローカル実装完了。`node tests/unit/manufacturing-mini-apps.cjs`、対象Lint、`npm run build`、専用Playwright 6件は通過。ブラウザ目視で見つけたSVG titleのhydration警告も修正し、再読込後に警告が出ないことを確認。commit・push・デプロイは未実施。

### 業界地図の編集型企業俯瞰図（2026-09-12）

- [x] 8領域をCSS Gridでゾーニングし、役割・31社の企業カード・製品タグを初期表示へ統合
- [x] 既存24社を企業データから参照し、EDA・IP、OSAT、材料の補完7社を出典・確認日付きの地図内簡易紹介として追加
- [x] 企業名・製品・職種検索、日本企業・国内拠点情報の絞り込み、職種との接点表示を追加
- [x] 企業詳細・国内拠点・キャリア準備・関連ガイドへの導線と詳細パネルのフォーカス復帰を維持
- [x] `editorial-map-v1` としてカテゴリ・絞り込み・検索結果・職種表示・詳細閲覧を計測
- [x] PC／390pxの描画、検索・絞り込み・詳細・職種表示、初期HTMLへの31社出力を確認する
- [ ] 本番反映後にGA4の受信を確認する
- [ ] 公開後4週間、関連コンテンツ遷移を主指標として端末別に観察する

計画表の企業名は30社だったため、既存データのLam Researchを製造装置へ追加して31社とした。`npm run typecheck`（1回）と `node --test tests/unit/industry-atlas-data.cjs` は通過。ローカルのブラウザ確認を実施し、build・デプロイは未実施。

### 業界地図の本番確認とスマホ横幅修正（2026-09-11）

- [x] 本番でPC／390px表示、3モード、地図／一覧、企業詳細、検索0件・掲載企業候補、主要内部リンク、フォーカス復帰を確認
- [x] `industry_map_view_change`、`industry_map_mode_change`、`industry_map_node_open`、`industry_map_detail_view` が `detail-focus-v10` 付きでGA4へ渡ることを確認
- [x] スマホで業界地図ページ全体が765pxへ広がる原因をGrid列の最小幅と特定し、`minmax(0, 1fr)` で390px内へ収める修正を追加
- [ ] スマホ横幅修正を本番へ反映する
- [ ] 反映後4週間、一覧利用・詳細閲覧・検索補助・関連コンテンツ遷移を端末別に観察する

本番DOMへの一時適用でドキュメント幅が765pxから390pxへ収まることを確認。主要内部リンクは200、canonical・description・H1・BreadcrumbListを確認。`node --test tests/unit/industry-map-gestures.cjs tests/unit/industry-map-focus.cjs` と `git diff --check` は通過。build・デプロイは未実施。

### 業界地図の詳細フォーカス（2026-09-11）

- [x] 詳細を開いた時のフォーカス移動と、閉じる・Escでの操作元への復帰を追加（`detail-focus-v10`）
- [x] パネルへのフォーカス・閉じる処理・元ボタンが非表示／切断済みの場合の復帰を回帰テストで確認

`node tests/unit/industry-map-focus.cjs`、`npm run typecheck`（1回）、`git diff --check`、禁止語確認は通過。本番ブラウザで詳細への移動と閉じた後の操作元復帰を確認。build・デプロイは未実施。

### 業界地図のピンチ操作修正（2026-09-11）

- [x] 指の座標を地図表示領域内へ変換し、表示位置による拡大中心のずれを修正（`pinch-fix-v9`）
- [x] 表示領域の位置に依存しない拡大中心・倍率上限・1本指移動・指を離した後の移動・キャンセル後の停止を回帰テストで確認

`node tests/unit/industry-map-gestures.cjs`、`npm run typecheck`（1回）、`git diff --check`、禁止語確認は通過。ブラウザ・build・デプロイは未実施。

### 業界地図のPC一覧対応（2026-09-11）

- [x] 地図／一覧切替と一覧スタイルを全画面幅で共通化し、PC一覧は詳細を右側へ配置。画面幅変更時の表示方法の不一致を解消（`list-view-v8`）
- [ ] 公開後に端末別の一覧利用・詳細閲覧・回遊を観察する

本番反映済み。`npm run typecheck`（1回）、`git diff --check`、変更ファイルの禁止語確認は通過。本番ブラウザでPC／スマホの一覧切替と一覧からの詳細表示を確認。端末別イベントの継続観察が残る。

### 業界地図の関係線整理（2026-09-11）

- [x] 初期表示は工程の矢印に絞り、選択対象に関係する線だけを表示。工程の流れは選択中も維持し、操作説明と凡例を整理（`focused-lines-v7`）
- [ ] 本番反映後、詳細閲覧・関連コンテンツ遷移を観察する

本番反映済み。`npm run typecheck`（1回）、`git diff --check`、変更ファイルの禁止語確認は通過。本番ブラウザで初期表示を確認。詳細閲覧・関連コンテンツ遷移の継続観察が残る。

### 業界地図の検索補助（2026-09-11）

- [x] 検索対象と結果件数を地図・一覧の共通位置へ表示し、代表企業0件の場合は全企業データから最大3社の詳細リンクを案内
- [x] 全企業一覧への導線・検索クリア・入力変更時の詳細解除を追加。検索語はブラウザ内だけで扱い、URLや計測へ送らない
- [ ] 公開後に `search-help-v6` の検索補助リンク利用を確認する

本番反映済み。`npm run typecheck`（1回）、`git diff --check`、変更ファイルの禁止語確認は通過。本番ブラウザで検索0件、掲載済み・地図非掲載企業の候補リンク、検索クリアを確認。検索補助リンク利用の継続観察が残る。

### 業界地図の詳細導線MVP（2026-09-10）

- [x] 工程パネルの代表企業名を企業詳細へのリンクに変更し、材料・組立テストの深掘り先を既存の専門ページへ接続
- [x] ノードを閉じる操作を `industry_map_node_open` から除外し、初見向け入口を含む `industry_map_detail_view` と詳細内リンクの計測を整理
- [x] 企業パネルに、公開対象の確認済み国内拠点・キャリア準備データの有無に応じた企業詳細内の補助リンクを追加。`detail-links-v2` と遷移先区分で計測を識別
- [x] スマホの地図／一覧切替を明確化し、一覧の説明を折り返し表示、工程説明を追加。詳細の文字・タップ領域を拡大し、初見向け入口でも表示方法を保持。「全体」は実際の動作に合わせ「表示を戻す」へ変更（`readability-v3`）
- [x] 本文の「7段階」を番号なしの領域一覧へ変更し、企業例の役割と事業モデル／製品分野の違いを明示。領域データは `src/data/industry-map.ts` へ移し、既存アンカー・企業リンク・計測IDを維持（`classification-v4`）
- [x] 全体像の役割ノード・一覧に企業例を1〜2社表示し、役割パネルから企業詳細へ接続。ノードの高さと全体位置調整の計算を揃える（`overview-examples-v5`）
- [x] 本番反映と `detail-focus-v10` のイベント送信を確認
- [ ] 本文・詳細パネルからの関連コンテンツ遷移を同一セッションで重複排除して4週間観察する。旧版とのイベント件数比は改善率にしない

本番反映済み。初回MVP・補助リンク追加・スマホ可読性改善・分類説明整理の各作業で `npm run typecheck`（各1回）は通過。スマホ可読性改善・分類説明整理は `git diff --check` と変更ファイルの禁止語確認も通過。本番ブラウザで表示・主要導線・GA4送信内容を確認。4週間の効果観察が残る。共有分類・ノード配置の全面変更や拠点マップへの企業指定パラメータ追加は対象外。

企業例追加も `npm run typecheck`（1回）、`git diff --check`、禁止語確認が通過。6領域の企業IDの存在と、固定座標・寸法上で役割ノード同士および工程ノードに重ならないことを静的確認。本番ブラウザでPC／スマホ相当の描画と文字折り返しを確認。

### Cpkの結果コピー改善（2026-09-10）

- [x] 結果コピーを折りたたみの外へ移し、コピー失敗・非対応時の手動コピー、処理中の連打防止、成功時のみの既存イベント送信を実装
- [ ] 本番反映日を記録し、28日間の計算完了・コピー成功の件数と利用者数を観察する。少数では率の優劣を断定しない

ローカル変更。本番の表示・計測と反映状況は未確認。検索・利用の実数と判断記録は非公開フォルダで管理する。

検証: `node tests/unit/cpk-result-copy.cjs`、`npm run typecheck`（1回）、`git diff --check`、変更対象の禁止語確認が通過。コピー成功・拒否・非対応・連打・手動選択、折りたたみ外の配置、サンプル・生データ・要約値のコピー内容を確認。ブラウザ・build・デプロイは未実施。

### P0: 初成果までの12週間

週3〜5時間、既存改善を中心に新規記事は最大2本。実数・期間・反映日・取材状態は非公開の `.private/growth-operations.md` と記事台帳で管理する。

- [x] 相談準備ページへ固定ひな形のコピー・手動コピーと相談先比較への出口を実装
- [x] 経験整理・外資系／英語・専門性の既存focusを引き継ぐリンクと匿名計測を実装
- [x] 年収記事の対象・データ確認時点を明確化（数値の再調査は未実施）
- [x] ASML／東京エレクトロン、マイクロン／キオクシア比較へ公式出典付きの事実と求人確認リストを追加
- [x] 承認メールを照合し、2社の審査待ち記録を訂正。既存広告コードを維持
- [x] 非公開の週次計測・ASP月次照合・本番反映台帳と記事2本の取材枠を作成
- [ ] 変更した公開文章を運営者が編集確認し、本番反映日を台帳へ記録する
- [ ] GA・GSCの直近28日を取得し、キーイベント・カスタムディメンション・除外設定を確認する
- [ ] ASPの現行成果条件・有効状態・発生／確定／否認を管理画面で照合する
- [x] 既存3記事と新規候補2本を取材し、回答・確認用原稿を非公開で保存。新規候補は既存記事への統合を推奨
- [x] 2026-09-06に確認用原稿3案の本人承認を得て、既存の職務経歴書記事と5社比較記事へ追記。新規URLは追加せず、本番反映日は別途記録する
- [ ] 本番反映から28日後に評価し、対象ページ100セッション未満なら観察を延長する

### P0: 定期計測と収益確認

- [x] 2026-09-06：転職の軸ノートに3職種・5条件の働き方チェック、比較・質問選択・本人確認状況・コピー、ランキング導線、匿名イベントを追加（ローカル実装。新規・既存ノートの単体テスト、typecheck各1回、差分確認は通過。ブラウザ・build・本番受信は未確認）
- [ ] 働き方チェックの質問文を運営者が編集確認し、公開後にイベント受信・対象者の誤認の有無と4週間の開始・完了・コピー実数を確認する


- [ ] Cpk学習比較の本番反映後4週間、学習モード切替・スライダー利用・比較基準設定を観察する

- [ ] 転職の軸ノートの検索公開・導線拡大を本番反映後、4週間の入口別表示・クリック、開始・完成・コピー・次の行動を確認する

- [ ] 共通相談CTA計測・ランキング導線改善の本番反映日を記録し、4週間後に内部遷移、相談先ページ到達、広告クリック、ASP成果を確認する。GA管理画面の現イベント名・キーイベント設定も照合する
- [ ] Search Console のインデックス、クロールエラー、検索クエリを週1回確認する
- [ ] エージェント別の外部クリックと ASP 成果を月1回照合する
- [ ] 十分な計測数が集まった後、Career Compass と CTA の改善対象を決める
- [ ] JAC / バリューコマースは、公開品質とインデックス状況を確認してから再申請するか判断する

### P1: 高意図コンテンツ

次の候補は、本文作成より先にRYOへ取材し、`.private/article-workflow.md` に従います。

- [x] 求人票の年収レンジとオファーで確認する条件（製造業エンジニア向け）

技術・装置・材料の REF 記事は、計画本数を先に増やさず、Search Console の表示と既存クラスターの不足を確認してから追加します。

### P2: 企業情報

- [ ] 個別キャリア情報がない企業を、検索需要と採用情報の更新性で優先順位付けする
- [ ] 優先企業へ職種、近い経験、準備提案、出典、最終更新日を追加する
- [ ] 個別情報を追加した企業だけ、noindex と sitemap 除外を解除する
- [ ] `docs/company-content-audit.md` の件数と確認日を更新する

### P1: 日本の半導体企業・拠点マップ パイロット

- [x] 2026-09-03 に対象ユーザー、既存ページとの境界、MVP、データ、公開基準を `docs/semiconductor-location-map-spec.md` へ定義
- [x] 2026-09-03 にSearch Console CSVを確認。全国の半導体工場マップ・一覧は33表示・2クリック、熊本・JASM関連は3表示。初期地域ページを1〜2件へ絞り、全国ハブを優先
- [x] 2026-09-03 に既存の個別キャリア情報がある企業を優先し、10社・最大24拠点の調査候補を `docs/semiconductor-location-map-pilot.md` へ定義
- [x] 2026-09-03 にBatch Aの5社・13物理拠点について、公式拠点情報、関係法人、拠点種別、半導体との関係、職種根拠、確認日を記録
- [x] Batch Aで所在地と仕事を示す有効な個別求人まで確認できた割合を13拠点中4拠点、約31%と記録
- [x] Batch Bの5社・11拠点を確認し、パイロットを10社・24拠点にする
- [x] Batch Bのエージェント実行時間を記録し、人手レビュー工数へ流用できないことを明記する
- [x] 10社の代表10拠点へ暫定座標、座標精度、取得方法、確認リンクを付ける
- [x] 代表10拠点の座標レビュー表とGo / No-Go基準を `docs/semiconductor-location-map-review.md` へ定義する
- [x] 2026-09-04 に本番候補をLeaflet 1.9系、地理院淡色タイル、編集時に自前実行するABR Geocoderとし、利用条件と再評価条件を記録する
- [x] 2026-09-04 に地理院タイルとABRの公開時表記、ABRの初期 `rsdtdsp` 利用、地番データと第三者地図座標を照合専用にする方針を確定する
- [x] 2026-09-04 に既存の企業一覧・業界地図・デザインルールを基に、モバイル一覧優先のUI、主要3フィルター、状態表示、アクセシビリティを定義する
- [x] 2026-09-04 に型・静的一覧・絞り込み・都道府県選択図・全国SEO・既存導線・計測の順で進めるV0実装計画を定義する
- [x] 2026-09-04 にhuman reviewをV0の公開条件から外し、公式確認済み10社・24拠点と都道府県選択図で需要検証する方針へ変更する
- [x] 2026-09-04 に拠点・施設・状態変更・採用シグナルの型、10社・24拠点の静的データ、期限判定・絞り込み・整合性検査関数を追加する
- [x] 2026-09-04 に `/semiconductor-map` の全国ページと、JavaScriptなしでも読める都道府県別の24拠点一覧を実装し、SEO設定完了までは `noindex, follow` とする
- [x] 2026-09-04 に全国ページへ企業・拠点・技術検索、都道府県・拠点種別・職種フィルター、URL復元、条件解除、0件表示を追加する
- [x] 2026-09-04 に47都道府県を8地域に分けた選択図を追加し、掲載県の件数、他条件との同期、スマホの一覧切り替えを実装する
- [x] 2026-09-05 に全国ページだけをindex対象としてsitemapへ追加し、パラメータURLのnoindex、canonical、BreadcrumbList、ItemListを確認する
- [x] 2026-09-05 に企業一覧、業界地図、確認済み10社の企業詳細、勤務地優先のCareer Compass結果から全国拠点マップへの導線を追加する
- [x] 2026-09-05 に拠点マップの有限イベント計測とDesktop Chrome・Pixel 7向けE2Eを追加し、型・静的公開基準を確認する
- [x] 2026-09-05 に公開URLでDesktop Chrome・Pixel 7のE2Eを合計14件完走し、実ブラウザの公開基準を最終確認する
- [x] 2026-09-05 に座標を使わない全国V0を完成させ、各実装単位でPRD、architecture、database、seo、conversion-architectureを同期する
- [ ] V0公開後、利用された都道府県と拠点から代表10拠点の座標を人が確認し、V1の詳細ピンへ進むか判断する

### P2: UI一貫性

- [x] 学習ツールを基準に、文字密度、色、余白、例外条件を `docs/design-system.md` へ明文化する
- [x] 25ルートテンプレートのUI適用状況を監査し、`docs/ui-consistency-audit.md` に記録する
- [x] 企業詳細を中立色と読み物ページの文字階層へ移行する
- [x] ツール一覧を子ツールと同じ学習UIへ移行する
- [x] キャリア相談ページの巨大見出しと金色グラデーションを共通UIへ移行する
- [x] キャリアエージェント比較の装飾グリッドと状態色を整理する
- [ ] 移行後、代表ページをPC・スマホで確認し、不要になった旧CSSと重複 `:root` を対象範囲内で整理する

### P3: 小さな集客実験

SEO記事の更新を優先し、独立した大量制作にしません。

- [x] 2026-08-16 にWeb本体と依存関係を分けた `video/` パッケージを追加し、製造工程記事から39秒の縦動画をローカル生成
- [x] 2026-08-16 に1本目をナレーションとBGM付き46.55秒へ調整してYouTube公開し、BGM 0.28を初期値とする制作テンプレートとログを整備
- [ ] 公開記事1本から30〜45秒のショート動画を2本作る運用を試す
- [ ] 最初の4週間は投稿先を1媒体に絞る
- [ ] 10本投稿後、再生数ではなくサイトクリック、Career Compass 開始、エージェントクリックで継続判断する
- [ ] 動画から記事または Career Compass へ誘導する

### P1: 判断を学ぶインタラクティブ実務ツール

Cp・Cpk、DoE、管理図、Gage R&Rを基礎資産として改善し、ツール間の再利用と次の理解への遷移を検証します。

- [x] 2026-09-13 固定の架空半導体工場データで、歩留まり低下→不良項目→製品・装置→ロット条件→変更履歴→確認実験を連動して調べる `/tools/yield-dashboard` を追加。既存CSV解析とは検索意図を分離し、ガイド／自由探索、SEO本文、FAQ、匿名計測、内部リンク、集計単体テストとE2Eを実装

- [ ] Search Consoleで「Cp Cpk 計算」「Cp Cpk 違い」「Cpk 1.33」「Cpk 平均 ずれ」などの表示と流入を確認する
- [ ] Cp・Cpkツールの計算開始・完了・再操作を計測し、計算需要と学習需要の仮説を分ける
- [x] Cp・Cpkの計算・学習モードを実装する
- [x] DoEの効果、反復、ANOVA、残差、確認実験、設計比較を実装する
- [x] 管理図の正常工程、平均シフト、単発外れ、傾向、周期変動を切り替える仕様を定義する
- [x] 管理限界外の点だけでなく、連・傾向などの非ランダムパターンを学べるようにする
- [x] 管理限界と規格限界を混同しない説明を操作体験へ組み込む
- [x] 交差型Gage R&Rで、部品差、繰返し性、再現性、交互作用を動かす学習体験を実装する
- [x] %Study Variation、%Contribution、%GRR、ndcと改善操作を同じ画面で確認できるようにする
- [x] 歩留まり・FPY・RTY学習ツールの目的、計算、学習フロー、初期スコープを定義する
- [ ] 一発合格、手直し、廃棄、多工程RTY、改善比較を操作できる最小学習体験を実装する
- [ ] 管理図の開始、異常シナリオ、ルール検出、次の確認への遷移を計測する
- [ ] Gage R&Rの開始・関連ツール遷移イベントを追加し、実装済みのシナリオ・指標切替・改善操作と合わせて本番受信を確認する
- [ ] Gage R&R公開後、歩留まり、OEE、パレート図の優先順位を利用データで決める

## 保留・定期確認

### アフィリエイト審査

- [x] もしもアフィリエイトのサイト承認後、Amazon.co.jp提携再申請前の公開開示を整備。プライバシー・広告掲載ポリシーにもしもアフィリエイト、Cookie等による成果計測、Amazon所定の開示文言を追加（2026-09-30）
- [x] 2026-10-03に運営者から、もしもアフィリエイト経由のAmazon.co.jp・楽天市場の提携承認と、『「会社四季報」業界地図 2027年版』のかんたんリンク発行コードの提供を受けた。該当書籍の通常リンクを広告リンクへ変更
- [x] 2026-10-03に運営者から『日経業界地図 2027年版』のかんたんリンク発行コードの提供を受け、同書の通常リンクも広告リンクへ変更
- [ ] Amazon.co.jp・楽天市場の申請日、承認通知日、現行の成果・否認条件をASP管理画面で確認し、非公開運用台帳へ記録する
- [ ] タイズ: 審査結果後に ASP、申請日、通知内容、再申請条件を記録する
- [x] エンワールド: 2026-07-17のアクセストレード提携承認通知を2026-09-06に確認し、非公開台帳を訂正
- [x] ロバート・ウォルターズ: 2026-07-17のアクセストレード提携承認通知を2026-09-06に確認し、非公開台帳を訂正

2026-07-13時点では3社とも通知を確認できませんでしたが、2026-09-06の再確認でエンワールドとロバート・ウォルターズの承認を確認しました。両社の既存広告リンクを維持し、現行条件は別途管理画面で確認します。タイズは引き続き公式リンクとし、申請日や審査結果を推測しません。

確認済みの成果条件、報酬、否認条件、リスティング上の禁止事項は `.private/affiliate-operations.md` に記録します。

### 計測・登録

- [ ] 実装済みGA4経路の本番設定・現行イベント名・カスタムディメンションを確認する（新規導入ではない）
- [ ] メール登録は、初回収益と現在の需要検証に不要なため保留する

## 完了した主要マイルストーン

### 求人票の確認ノート（2026-09-23）

- [x] 相談準備ページに8項目の記載状況確認を追加。未読・記載あり・見つからない・曖昧を区別し、途中でも質問付きノートをコピー可能。
- [x] 既存の質問文を再利用。求人本文や個人情報の入力・保存・回答送信なし。回答変更で旧結果とコピー通知を破棄。企業比較・Career Compassから接続。
- [x] 公式資料・出典・更新日・既存canonical・構造化データ・sitemapを確認。対象テスト（状態・モックUI・露出・CSSコンパイル・SSR）、型チェック1回、差分・禁止語確認成功。
- [ ] 実ブラウザ・実機・本番反映・GA4受信は未確認。dev・build・lint・commit・push未実施。

変更ファイル：[仕様内の一覧](docs/job-posting-note-spec.md)。実行：`node tests/unit/job-posting-note.cjs`、`npm run typecheck`、`git diff --check`。
推奨コミット：`feat: add job posting review notes`


### 工程改善レポートのCSSビルドエラー修正（2026-09-23）

- [x] CSS Modulesのpure制約に違反するbodyの印刷用グローバルルール2件を `src/app/globals.css` へ移動。印刷属性による条件とローカル帳票CSSを維持。
- [x] Next同梱のCSS Modulesプラグインを使う回帰テストを追加。`node tests/unit/improvement-report-css.cjs`、`node tests/unit/improvement-report.cjs`、`git diff --check`成功。
- [ ] 本番再デプロイの確認。build・型チェック・ブラウザ・commit・push未実施。

変更ファイル：`src/components/ImprovementReport.module.css`、`src/app/globals.css`、`tests/unit/improvement-report-css.cjs`、`docs/improvement-report-spec.md`、本ファイル。
推奨コミット：`fix: move report print globals out of CSS module`


### 不良の優先順位ボード（2026-09-23）

- [x] `/tools/defect-pareto` に2列貼付け、パレート図、構成比・累積比率、同名合算確認、表コピー・SVG保存を追加。入力編集時に旧結果を破棄。合計0件は比率算出不可。
- [x] 入力は端末内のみ。文字エスケープ・コピー先の数式対策・固定属性計測・架空例を実装。通常公開設定、canonical・構造化データ・sitemap、一覧・ツール案内・調査教材の導線を追加。
- [x] ASQの手順と数値を確認。対象テストはSSRの説明不足を修正後に同一コマンドで成功。案内18経路と共通計測テストも成功。型チェック1回と差分・公開禁止情報チェック済み。
- [ ] 本番反映・GA4受信・実ブラウザ／実機・実ダウンロードは未確認。dev・build・lint・commit・push未実施。

変更ファイル：[実装仕様の一覧](docs/defect-pareto-spec.md)。実行：`node tests/unit/defect-pareto.cjs`（修正前後2回）、`node tests/unit/tool-finder.cjs`、`node tests/unit/practical-tool-journey.cjs`、`npm run typecheck`、`git diff --check`。

推奨コミット：`feat: add defect Pareto analysis board`



### 困りごとから選ぶ実務ツール案内（2026-09-23）

- [x] `/tools` に最大3問・5目的の案内を追加。実データ／学習、準備不足、解析未対応を区別し、既存一覧とフィルターを維持。
- [x] 既存ツール台帳を再利用。回答の保存・外部送信なし。回答変更で後続選択と旧結果を破棄。固定属性の露出・開始・結果・リンク計測を追加。
- [x] NIST公式資料と入力仕様を確認。出典・更新日・メタ説明・PRD・構成・計測文書を更新。
- [x] `node tests/unit/tool-finder.cjs`（16経路、モックUI、露出・プライバシー・SSR）、`npm run typecheck`（1回）、`git diff --check`成功。
- [ ] 本番反映、GA4受信、実ブラウザ・実機確認。dev・build・lint・commit・push未実施。

変更ファイル：`src/data/tool-finder.ts`、`src/lib/tool-finder.ts`、`src/components/ToolFinder.tsx`・同CSS、`src/components/ToolsLearningLab.tsx`、`src/app/(ja)/tools/page.tsx`、`tests/unit/tool-finder.cjs`、`docs/tool-finder-spec.md`、PRD、architecture、conversion-architecture、documentation-map、企画書、本ファイル。

推奨コミット：`feat: guide users to practical tools by task`。詳細：[仕様](docs/tool-finder-spec.md)。



### 2026-09-22：工程図鑑の初版機能実装完了

- ウエハ準備・ウエハ検査・最終検査に各3役割の仕事紹介を追加。これで6工程体験・おすすめ見学コース・全6体験の仕事紹介がそろった。合計18の役割紹介であり、18種類の職種分類ではない。
- SUMCOとAmkorの職務説明を照合し、架空の事例・回路のない板と電気検査の違い・検査系の確認・一項目で全体を判定しない説明を追加。工程別の独自SVG、Server説明・出典日付・記事導線、一覧・メタ説明、要件・構成・仕様・索引を更新。
- `node tests/unit/semiconductor-process.cjs`通過。全18項目の表示・出典・公開記事・SSR、全6体験のコース通し操作、選択と再選択、再開始・選択解除、体験別の計測18件と完了条件不変、既存機能の回帰を確認。
- `npm run typecheck`は1回で通過。`git diff --check`と公開禁止語照合を実施。
- 初版の追加制作はここで区切る。次は画面の収まり・説明の重複・コースの長さを確認し、試用で改善する。ブラウザ・実端末・試用・検索需要・導線効果は未検証。build・commit・push・本番反映は未実施。


### 2026-09-22：配線・CMP体験の仕事紹介

- 配線のまとめに条件・研磨装置・測定の3役割を追加。独自SVGでCMP前後の表面膜と溝・穴の金属、研磨の概念、測定の視点を示し、既存職種記事へ接続。
- 荏原のCMPプロセス・サービス職務説明と既存Micronの計測職務を根拠にし、架空例・簡略化・出典日付を明記。体験別の表示・計測を既存定義に追加。Server説明、専用仕様・PRD・architecture・索引を更新。
- `node tests/unit/semiconductor-process.cjs` と `npm run typecheck`（1回）通過。3役割の図・SSR・出典・公開記事、配線の金属保持、切替・再開始・計測分離、既存機能の回帰を確認。`git diff --check`と公開禁止語照合を実施。
- ブラウザ・実端末・試用・導線効果は未検証。build・commit・push・本番反映は未実施。


### 2026-09-22：組立体験の仕事紹介

- 組立のまとめに組立条件・装置・品質の3役割を追加。固定・ワイヤ接続・樹脂保護を独自の静止図で示し、困りごと・確認・連携と関連記事へ接続。
- Amkorの職務説明と照合。体験別定義で薄膜との文章・図・出典を分離し、計測抑制キーを体験ID＋役割IDに変更。SSR説明、専用仕様・PRD・architecture・索引を更新。
- `node tests/unit/semiconductor-process.cjs` と `npm run typecheck`（1回）通過。組立3図・SSR・出典・公開記事、薄膜との切替、再開始と計測重複防止、既存体験の回帰を確認。`git diff --check` と公開禁止語照合を実施。
- ブラウザ確認・試用・導線効果は未検証。build・commit・push・本番反映は未実施。


### 2026-09-22：薄膜加工から仕事理解への入口

- 薄膜加工のまとめに加工条件・装置・測定の3役割を追加。架空の困りごと→調べること→関わる人を独自SVGと文章で表示し、公開済み関連記事へ接続。
- 東京エレクトロン・Micronの職務説明と照合し、出典・確認日・職種の担当範囲の違いを明記。教材データと表示を分離し、SSRにも文章・出典を追加。
- `node tests/unit/semiconductor-process.cjs`、`npm run typecheck`（1回）、`git diff --check` 通過。役割切替、計測重複防止、加工状態との分離、既存6体験・見学コースの回帰、公開済みリンクと出典を確認。公開禁止語照合も実施。
- ブラウザ・実端末・試用・導線効果は未検証。build・commit・push・本番反映は未実施。


### 2026-09-22：工程図鑑のおすすめ見学コース

- 6体験の順路、自由選択、現在地と確認済み工程数、最後の4観点の振り返りを追加。未確認工程を完了と扱わず、ページ内の履歴と計測重複防止を維持。
- コース定義、共通状態遷移、UI/CSS、一覧・メタ説明、専用仕様・PRD・architecture・索引を更新。
- `node tests/unit/semiconductor-process.cjs` 通過。6体験の順序、連打防止、途中省略、履歴、イベント、停止とSSR入口、既存体験の回帰を確認。
- `npm run typecheck` 1回で通過。`git diff --check` と公開禁止語照合を実施。
- ブラウザ確認・build・commit・push・本番反映は未実施。公開後の試用・検索需要は未検証。


### 半導体ができるまで：触って分かる工程図鑑（2026-09-22）

- [x] `/tools/semiconductor-process` に6地点の全体像、立体感のあるウエハと8工程の断面、2秒再生・停止・巻き戻し・自由な工程移動・低モーション対応を実装。露光と現像とエッチングを分け、完成構造は別の概念図として説明。
- [x] 教育用の一覧・プレビュー、業界地図・ランキング一覧／個別・製造工程記事からの入口、固定分類計測、SEO・構造化データ・sitemapを整備。一次情報を確認しpublished・index可能に設定。
- [x] `node tests/unit/semiconductor-process.cjs` で形状連続性・途中状態・再生制御・非表示停止・低モーション・後始末・SSR・導線を確認。型チェック1回・差分・公開禁止情報照合を通過。実ブラウザ・利用者試用・本番反映・検索需要は未確認。build・commit・pushは未実施。

### 改善の差を見極める（2026-09-22）

- [x] `/tools/improvement-confidence` に3ケース→自由実験、平均差と95%信頼区間、行動選択と真値の振り返り、全20回の履歴を実装。独立正規の教材モデルと観測だけを解析するWelch計算を分離。
- [x] 教育用の一覧・専用プレビュー、工程比較・相関と因果・DOEからの入口、固定分類イベント、canonical・構造化データ・sitemapを揃えてpublished・index可能に設定。仕様・PRD・architecture・文書索引を更新。
- [x] 独立したSciPy参照値、数値・状態・UIハンドラー・SSR・公開導線の対象テストと型チェック1回が通過。SVG title警告を修正後、表示変更の対象テストが警告なしで通過。ブラウザ実表示・利用者試用・本番反映・検索需要は未確認。

### 日本語共通ヘッダー改善（2026-09-22）

- [x] 主要導線の並び替え・文言短縮、PC64px／スマホ56pxを基準とする追従ヘッダー、1,024px未満の開閉メニュー、現在地表示・キーボード対応を実装。専用CSSで英語版との影響を分離。
- [x] 通常リンクの `header_nav_click` と既存Career Compassの `header_navigation_v2` 計測を接続。デザイン・導線・UI監査文書を更新。
- [x] `npm run typecheck` を1回実行して成功。既存CTA単体テストと差分確認も成功。ブラウザ実表示・本番計測は未確認。build・commit・pushは未実行。

### Cpk先行の共通UI整備（2026-09-22）

- 共通トークンを1ファイルへ集約し、旧19変数の最終値を維持。標準HTMLによるボタン・リンク・入力・選択・注意表示を追加し、Cpkの日英共通画面へ適用。移行済み部品の旧CSSと上書きを整理。
- 計算・入力保持・翻訳・イベントの処理は維持。型チェック1回、日英計算・コピー・エラー関連付け・学習ロジックの対象ユニットテスト3本が通過。build・ブラウザ確認は未実施。他ページへの適用は今回の対象外。

### 学習講座CTAの出し分け（2026-09-14）

- [x] 運営者提供のリーンシックスシグマ講座を追加し、シックスシグマ記事と歩留まり原因調査ツールで案内。他の掲載先は統計検定2級講座を維持
- [x] 広告表記と講座別GA4クリック計測を共通化。統計検定取得の実体験は統計講座だけに表示
- [x] `npm run typecheck` と `git diff --check` が成功。本番反映・GA4受信確認は未実施


### 統計学習講座のアフィリエイトCTA（2026-09-14）

- [x] Cpk・DOE・管理図・Gage R&R・歩留まり解析・歩留まり原因調査と、シックスシグマ・品質保証の記事に、運営者の実体験と広告表記を添えたUdemy講座CTAを実装
- [x] 既存の `affiliate_outbound_click` に講座ID・サービスID・遷移元・CTA位置を付与。`npm run typecheck` と `git diff --check` が成功
- 本番反映・GA4受信確認は未実施


- [x] 2026-09-06 初成果施策の相談メモ・テーマ別リンク、比較2ページ・年収記事の明確化、提携記録訂正、非公開運用台帳を整備。コピー／遷移の単体確認・typecheck1回・差分・禁止語確認を通過。取材追記は本人確認待ち。本番反映・管理画面照合・28日観察は未実施


- [x] 2026-09-06 Cpk学習モードに比較基準・固定スケールの確率密度・差分説明・条件表・操作計測を追加。モード切替で入力を保持。純粋関数テスト・typecheck1回を通過。画面確認・build・デプロイは未実施

- [x] 2026-09-06 転職の軸ノートの検索公開設定・sitemap追加、トップ・比較・関連記事の入口整理、入口表示計測、完成後の内部リンクを実装

- [x] 転職の軸ノート初版への運営者の評価を受け、相談準備ページに計測付き入口を1つ追加。検索除外は維持

- [x] 2026-09-05 転職の軸ノートの確認用初版を実装。4画面、最大3項目の仮順位、質問選択、ノートコピー、匿名操作計測に対応。純粋関数テスト・typecheck1回・差分・禁止語確認を通過。ブラウザ確認・デプロイは未実施

### プロダクト基盤

- [x] 2026-09-05 に共通相談CTAの遷移元付きクリック計測と、ランキングの勤務地・職種・待遇確認への既存リンク整理を実装。型チェック1回・差分・禁止語確認を通過。本番反映・GA実送信確認は未実施
- [x] 2026-07-21 に半導体業界地図を、工程・事業の役割・代表企業・職種を切り替えて探索できるインタラクティブマップへ更新
- [x] 2026-07-20 にヘッダーとトップページを、技術学習・キャリア整理・業界企業研究の3入口が分かる構成へ再編
- [x] 2026-07-19 にCp・Cpk計算ツールを実装し、Pp・Ppkの統計定義、固定サンプル、ヒストグラム、分析、結果コピーまで改善
- [x] Next.js App Router、TypeScript、Tailwind CSS で公開サイトを構築
- [x] 静的データ構造、企業一覧・詳細・比較、業界地図、セグメントを実装
- [x] Career Compass を12問の静的ルールベースとして実装
- [x] Career Compass に職種、強み、参考年収帯、企業例、準備ロードマップ、相談論点を実装
- [x] ログイン、個人情報保存、Supabase、AI API に依存しない構成で公開
- [x] SEO メタデータ、構造化データ、sitemap、robots を実装
- [x] Vercel へデプロイし、正規ドメインを `https://mfg-compass.com` に設定

### 信頼性・法務

- [x] 運営者情報、問い合わせ、プライバシー、免責、広告掲載ポリシーを公開
- [x] 公開ページの共通フッターから法務・運営ページへ移動できることを確認
- [x] 参考年収帯の算出方法、情報源、最終更新日を表示
- [x] 参考結果と公開情報、企業例と採用可能性を区別する注記を表示
- [x] 企業ページ37社を監査し、個別キャリア情報あり10社、汎用情報27社、公開保留0社に分類（2026-07-13）
- [x] 個別情報がない27社を `noindex, follow` とし、sitemap から除外
- [x] 優先10社の職種情報を公式採用情報で確認し、準備内容を編集上の提案として区別

### Analytics・SEO

- [x] 2026-08-17 に企業別career-prep 10ページの固有情報を親企業詳細へ統合し、旧URLを恒久リダイレクト化してsitemapから除外
- [x] Vercel Analytics を導入
- [x] `diagnosis_start`、`diagnosis_progress`、`diagnosis_complete` を実装
- [x] `result_detail_open`、`today_quest_copy`、`agent_cta_click`、`affiliate_outbound_click` を実装
- [x] 2026-07-13 に本番で主要4イベントの受信を確認
- [x] Search Console の所有権を確認し、sitemap を送信
- [x] トップ、ガイド、Career Compass、エージェントページのURL検査を実施
- [x] ガイドの Open Graph / X 画像、パンくず、Article 構造化データを実装

### コンテンツ

- [x] 実体験記事の取材・匿名化・公開承認フローを整備
- [x] 公開禁止辞書と RYO 文体ガイドを整備
- [x] 電子部品経験、英語、プロセスエンジニア、ChatGPT、エージェント、職務経歴書の実体験記事を実装
- [x] 「30代・半導体未経験」は実体験の前提と合わないため見送り、記事IDと判断経緯を保持
- [x] 半導体製造工程の全体像と14の個別工程記事を公開
- [x] 製造装置、材料、検査・計測、部品・サブファブの記事クラスターを公開
- [x] Search Console のクエリを起点に、ファウンドリ、アナログ半導体、装置メーカー、ICチップ製造会社などの基礎記事を公開
- [x] 2026-07-19 に実体験記事の過剰なカード・定型まとめを減らし、RYO の判断と言葉を戻した

### アフィリエイト

- [x] JAC / アクセストレードの提携承認と広告掲載を完了
- [x] 成果対象、成果地点、却下条件、報酬、本人利用禁止、リスティング条件を確認
- [x] 2026-07-13 に本番クリックを ASP と Analytics で確認し、本人申込みは行っていない
- [x] JAC / バリューコマースの提携見送りを確認。理由非開示のため「理由不明」と記録
- [x] ギブクリエーションにアフィリエイト制度がないことを確認し、公式リンクとして掲載
- [x] 未提携サービスへの記事末尾CTAを、エージェント比較ページへの内部導線に変更

## 将来候補

次はバックログ候補であり、現在のスコープではありません。着手前に `docs/PRD.md`、`docs/architecture.md`、プライバシー・運用方針を更新します。

- [ ] AI キャリア診断・AI Career Insight
- [ ] ユーザーアカウント、診断履歴、メール送付
- [ ] 口コミ、コミュニティ
- [ ] 求人データ連携、求人応募
- [ ] 英語学習、資格、教材の追加アフィリエイト
- [ ] 有料ロードマップ、個別レポート
- [ ] 電子部品、FA、ロボット、自動車、医療機器への拡張

現在は OpenAI API を使用せず、`OPENAI_API_KEY` を前提にしません。AI 機能を検討する場合は、需要、保存・外部送信、レート制限、日次費用上限、異常利用監視、失敗時の挙動を先に定義します。
