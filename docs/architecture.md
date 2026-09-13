# Architecture

最終更新日: 2026-09-05

## 方針

Manufacturing Compass は、Next.js App Router 上で動く静的データ中心の実務・コンテンツ・キャリア支援サービスです。

Career Compass、インタラクティブ実務学習ツール、業界地図の操作部分だけを Client Component で動かし、企業、ガイド、ランキング、SEO メタデータは Server Components と静的データを基本にします。ログイン、個人情報保存、外部データベース、AI API に依存しません。実務ツールの入力と計算はブラウザ内で完結し、生データを外部へ送信しません。

## 技術構成

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Vercel
- Vercel Analytics
- 任意の GA4
- Playwright

## ルート

### 中心導線

- `/`: サービス概要、Career Compass、記事・企業研究への入口
- `/career-compass`: 12問の現在地チェックと同一画面内の結果
- `/career-agents`: 転職エージェント比較
- `/career-consultation`: 相談論点の整理
- `/tools/cpk`: 生データからPp・Ppk、短期標準偏差からCp・Cpkを計算し、SVGヒストグラムと分析を表示
- `/tools/doe`: 2因子2水準を起点に、効果、実験誤差、ANOVA、残差、確認実験、設計選択を学ぶ
- `/tools/control-chart`: 管理図で偶然原因と異常原因の判断を学ぶ
- `/tools/gage-rr`: 交差型Gage R&Rで部品差、繰返し性、再現性、%GRR、ndcを学ぶ
- `/tools/line-balance`: 工程別の作業時間を山積み表示し、タクト超過と再配分前後を比較する
- `/tools/oee`: OEEの内訳と、停止・性能・良品率の改善による推定良品数を比較する

`/diagnosis` と `/diagnosis/result` は存在しません。Career Compass の結果は URL を分けず、クライアント側の状態として同じページに表示します。

### 情報ページ

- `/industry-map`: 8つの事業領域を固定したゾーンに分け、役割、代表企業、製品分野を同時に俯瞰する。検索・絞り込み・職種表示・企業詳細パネルを提供し、静的な領域一覧も同じページに残す
- `/semiconductor-map`: 国内の半導体関連拠点を勤務地単位で探す。全国URLだけをindexし、絞り込みパラメータ付きURLは `noindex, follow` とする
- `/segments/[slug]`
- `/companies`
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

- Vercel Analytics を常時利用する
- GA4 は `NEXT_PUBLIC_GA_MEASUREMENT_ID` がある本番環境だけで有効にする
- イベントは `src/lib/analytics.ts` に集約する
- PII、自由記述、現年収、回答一式を送らない。粗いカテゴリを追加する時も個人を推測できない粒度に限定する
- ミニアプリは閲覧、初回操作、山積み表の工程移動、OEE改善条件の確定変更を別イベントで計測する。工程名、作業名、時間、生産数などの入力値は送らない

## デプロイと検証

- Vercel の `main` を本番、Pull Request を Preview とする
- `npm run build` は `next build --webpack`
- AI エージェントの検証回数、build 条件、ブラウザ確認条件は `AGENTS.md` を正本とする
- ローカル build が環境由来で止まる場合は、無制限に再試行せず Vercel のビルド結果を優先する

## 将来の外部サービス導入条件

Supabase、ユーザーアカウント、メール保存、AI API、求人連携は未採用です。導入する場合は、少なくとも次を先に決めます。

- 解くユーザー課題と、静的実装では不足する理由
- 保存するデータ、保存期間、削除方法、同意
- プライバシーポリシーとセキュリティ
- レート制限、費用上限、障害時の挙動
- 既存の静的ページと SEO を損なわない移行方法

## 転職の軸ノート

- `/career-priorities`: Server Componentの用途説明・検索用メタデータと、専用Client Componentの4画面UI。sitemapに掲載し、トップ・比較・関連記事・相談準備から共通の計測付きリンクで接続する。
- `src/data/career-priorities.ts`: 5分野15項目と質問の固定対応、選択肢の型。
- `src/lib/career-priorities.ts`: 選択解除に伴う状態整理と、相談メモを生成する純粋関数。
- 回答はReactのメモリ内だけで保持。再読み込みで消去され、URL・Cookie・localStorage・外部APIには保存／送信しない。クリップボード書込みは本人のボタン操作時だけ行う。
- 開始・画面到達・完成・コピーのみ既存Analytics経路で計測。選択内容、順位、質問、ノート本文を送信しない。

## Cpk学習比較の構成

`src/data/cpk-learning.ts` に操作範囲・プリセット・条件型、`src/lib/cpk-learning.ts` に比較状態の更新・説明・正規確率密度を分離。工程能力は既存calculateCapabilityを再利用する。曲線は横軸92〜108、縦軸は標準偏差0.25の最大密度を基準とする共通固定スケール。CpkToolExperienceは両モードをマウントしたままhiddenとinertで非表示側の操作・読み上げを除外する。再読込で状態は消える。

## 相談準備の固定ひな形と比較データ（2026-09-06）

- `src/data/career-consultation.ts` に固定ひな形、`ConsultationTemplate` にコピー状態と読取専用表示を分離。コピー操作時だけクリップボードへ書き込み、失敗時は手動コピーを案内する。個人情報入力・永続化・APIは追加しない。
- 共通 `CareerAgentsLink` は任意の既存 `AgentFocus` と有限の `ctaLocation` を受け取る。省略時の共通CTAの遷移先と計測位置は従来通り。source_pageはusePathnameによるパスだけを送る。
- `CompanyComparisonProfile.research` は任意の企業別事実・Source・質問・更新日を持つ。既存比較のデータとは確認日を分け、対象2ページだけにServer Componentで表示する。
- 検証は `node tests/unit/career-consultation.cjs` で通信しないハンドラー単体確認を行う。ブラウザ・本番GA受信確認の代替とはしない。

## 働き方チェックの追加モード（2026-09-06）

- `/career-priorities#workstyle` で既存ページの追加モードへ直接接続。hashはモードのみで回答を含まない。既存ノートと追加モードはマウントを維持しhiddenで表示を切り替える。
- `src/data/workstyle-check.ts` は3職種・5条件の編集上の質問、参考資料の適用範囲・確認日・次回確認日を所有する。企業別の勤務条件を推論しない。
- `src/lib/workstyle-check.ts` は質問抽出、選択解除時の確認状態の除去、コピー文面を生成する純粋関数。職種変更で対象外となった確認状態は破棄し、条件の重要度変更では維持する。
- 専用Client Componentで比較、質問選択、本人の確認状況、コピーを実装。回答はReactメモリのみ。コピー失敗時は常設の読取専用テキストから手動コピー。
- 共通trackEventへ有限の操作種別・導線位置だけを送る。回答・質問本文・本人確認状況は送らない。既存ノートのイベントと分け、本番設定は別途確認する。
