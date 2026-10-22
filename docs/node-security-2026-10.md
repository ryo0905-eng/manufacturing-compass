# Node.js 2026年10月セキュリティ更新の調査

確認日: 2026-10-22（JST）。本番への攻撃再現、設定変更、デプロイ、commit、pushは実施しない。

## 結論と実行環境

22系を維持して最低22.23.4へ更新する。バージョン指定の変更と、本番の修正完了は別である。本番は実行中の正確なパッチバージョンを確認するまで「未確認」とする。

| 対象 | 調査開始時 | 今回の対策・確認状況 |
| --- | --- | --- |
| `package.json` / lockのルートengines | `>=22 <24`（未修正版と23系も許容） | `>=22.23.4 <23`へ限定。依存パッケージの更新なし |
| `.node-version` | `22` | `22.23.4` |
| ローカル実行 | 実測 `v24.1.0`。指定と不一致・修正前 | 公式の22.23.4 macOS ARM64配布物を一時ディレクトリへ取得し、公式SHASUMS256との一致後に検証用PATHへ設定。端末全体のNode.jsは変更していない |
| GitHub Actions | `.github/workflows/chip-pulse-refresh.yml` のsetup-nodeで `22` | `.node-version`参照・`check-latest: true`・実バージョン確認を追加。リモート実行は未実施 |
| Vercelビルド | リポジトリは22系指定。正確な実行バージョンは未確認 | `prebuild`で実バージョンを出力し、22.23.4未満または別メジャーなら停止 |
| Vercel本番Functions | `/api/jev` は `runtime = "nodejs"`。稼働中バージョン・有効化状態は未確認 | `src/instrumentation.ts`でNode.js起動時のバージョンだけをサーバーログへ記録。反映後の確認が必要 |
| Vercel設定 | `vercel.json` / `vercel.ts` / `.vercel`なし | Dashboard側の設定、ビルドコマンド上書き、Root Directory、本番デプロイは未確認 |
| 動画制作 | `video/package.json`に独立したengines指定なし | ルートのバージョン管理を使う場合は22.23.4。動画制作自体の実行環境は未確認・今回の本番Webビルド対象外 |

`@types/node`は型定義であり実行バージョンを保証しない。開発端末では今後もバージョン管理ツール等で実行環境を切り替える必要がある。`npm run node:check`を開発・ビルド・起動前に実行する。CIの日次処理も同じ確認を行う。直接Next CLIや各スクリプトを起動した場合のライフサイクル迂回には注意する。

## 脆弱性ごとの条件とアプリの到達可能性

公式告知に詳細な悪用手順の記載はなく、以下は公表された問題の対象API・機能と静的調査からの評価である。フレームワーク・基盤内部の処理や攻撃者の外部応答制御を確認できない箇所を「影響なし」としない。

| CVE / 深刻度 | 対象・条件と今回の調査結果 |
| --- | --- |
| CVE-2026-105482 / High | 22/24/26系。NULを含む名前の `dns.resolve`。アプリに直接のDNS API利用・入力ホスト名のDNS照会なし。SDK・基盤内部は未確認 |
| CVE-2026-105483 / High | 24/26系。全角数字のIP表現に関するTLSホスト名検証。予定する22系は公表対象外。開始時のローカル24.1.0は対象系統。ユーザーから接続ホストを指定する経路は見つからず、内部処理は未確認 |
| CVE-2026-106069 / High | 22/24/26系。IPとして解釈されるホスト名のTLS検証。APIのGateway宛先はSDKの既定値、CIのSEC/RSSは静的設定で、リクエスト本文からURLを指定する機能なし。RSS取得のリダイレクト先と依存・基盤内部を含む到達可能性は未確認 |
| CVE-2026-111497 / High | 22/24/26系。Brotliデコード時の範囲外書込み・RCE。直接の展開API呼出しはないが、Nodeのfetch/SDKによる外部応答の自動展開を除外できない。インストール済みUndiciにも `Content-Encoding: br` を `zlib.createBrotliDecompress` へ渡す処理がある。攻撃者が本番の展開対象データを制御できるかは未確認。ランタイム更新を優先 |
| CVE-2026-105481 / Medium | 22/24/26系。HTTP keep-alive接続の要求前に届く応答。独自の `http.Agent` 利用なし。SDK/Next内部で該当するクライアント経路を通るかは未確認。fetchがあることだけで本CVEへの該当を断定しない |
| CVE-2026-106072 / Medium | 22/24/26系。非正規IPv4表現と証明書DNS SANの検証。任意ホスト接続API・独自TLS検証なし。外部通信は存在するため、リダイレクトや内部処理を含め未確認 |
| CVE-2026-106074 / Medium | 22/24/26系。ユーザー作成startup snapshot / SEAへの乱数キャッシュ保存。日次・決算スクリプトで `randomUUID()` を使うが、snapshot/SEA生成設定はリポジトリにない。通常のスクリプト実行での該当条件は見つからない。Vercel基盤内部のsnapshot方式は未確認 |
| CVE-2026-106070 / Low | 26系のZipFile。22系運用とローカル24.1.0は公表対象外。アプリにNode ZipFile利用なし |
| CVE-2026-106071 / Low | 26系のPermission Model wildcard。22系運用とローカル24.1.0は公表対象外。アプリのPermission Model起動設定なし |
| CVE-2026-106073 / Low | 22/24/26系。Permission Modelと `fs.realpathSync`。アプリのPermission Model起動設定・直接のrealpathSync利用なし。依存内部・本番起動オプションは未確認 |

同時更新のc-ares、CA証明書（eMudhra関連）、OpenSSL、SQLite、UndiciもNode.js更新で取り込む。外向きHTTPSはAPIと日次収集にある。SQLiteの直接利用は見つからない。告知に列挙された依存更新の全CVE・悪用条件までは確認できないため、間接利用を含む個別適用性は未確認。npm依存を一括更新してNode組込みライブラリの修正に代えることはしない。

### 公開APIの確認

`src/app/api/jev/route.ts`は同一Origin・JSON形式・256バイト上限・固定サンプルIDを検査し、有効化されている場合にGatewayへ接続する。任意URL、ZIPファイル、任意プロンプトの送信機能ではない。Origin検査はサーバー外からの呼出しに対する認証を保証しない。`JEV_DEMO_ENABLED`やキーの本番設定値は取得・出力していない。公開ページは静的生成が中心だが、ISR、動的なJevページ、APIがあるため「全体が静的なので非該当」とは判断しない。

## Vercel側とアプリ側の分担

Vercel公式文書はメジャー指定のみを提供し、必要時にminor/patchを自動配布するとしている。一方、2026-10-22の公式文書・Changelog・今回のCVE/バージョンでの検索では、今回の配布完了を裏付ける発表は確認できなかった。一般的な自動更新方針から、既存デプロイや全リージョンの修正完了を推測しない。

- **Vercel側:** ビルドイメージ、Functions、ネットワーク・TLS終端など管理基盤の更新。顧客側のengines下限は、プラットフォームの実行バイナリをインストールする指定ではない。
- **こちら側:** 22系の修正版下限、CI/ローカル指定、ビルド前検査、起動ログの追加。今回ここまでをローカル変更した。
- **本番反映前:** Dashboardの対象プロジェクト・Root Directory・Node 22系・実際のBuild Commandを確認。上書きされている場合も `npm run build` のprebuildを通す。Vercelの配布状況を確認し、必要ならSupportへ22.23.4以上の提供状況と既存Functionsの更新条件を問い合わせる。
- **承認後に行う反映案:** この変更を反映した新規ビルド・再デプロイを行う。再デプロイ自体が修正を保証するわけではない。ビルドログの `[node:check]` が22.23.4以上の22系で成功し、Readyとなることを確認する。
- **本番完了条件:** Functions起動ログの `[runtime] Node.js v22.…` でも22.23.4以上を確認する。ビルドとFunctionsは別々に確認する。起動ログが取得できなければ未確認のままとする。確認できるまで古いデプロイへのrollbackを安全と見なさない。新しいログは環境変数・キー・リクエスト本文を出力しない。

今回、本番変更・再デプロイ・GitHub Actionsの手動実行は行っていない。ユーザーへ上記内容を提示し、実行許可後に進める。

## GA4急増の調査範囲

このセッションにはGA4/Vercelの接続ツールがなく、ローカルVercel CLI・プロジェクトリンク・対象のアクセスログも確認できなかった。既存の秘密情報を探索・表示して接続を試すことはしていない。従って、10月21日以降の不審リクエスト、5xx、プロセス異常終了、Firewall検知はすべて未確認。GA4の増加はユーザー報告であり、こちらで数値を検証した結果ではない。攻撃・侵入成功も、攻撃がなかったことも判断できない。

接続できる環境で次を読み取り確認する。保存期間を過ぎたログは「検知なし」ではなく「取得不可」と記録する。

1. JSTで10/20〜10/22（UTCでは10/19 15:00〜10/22 15:00）を基本窓とし、現時刻以降を除き前週の同曜日・時間帯と比較する。GA4プロパティのタイムゾーンも揃える。
2. Firewallで総リクエスト、Allow/Block/Challenge、Managed Rule、Bot/DDoSアラート、パス・メソッド・UA・国/ASNの偏りを確認する。認証情報、本文、生IP、クエリ値は報告へ転載しない。
3. Runtime/アクセスログで `/api/jev` の呼出しと403/413/415/429/502/503、5xx急増、クラッシュ、異常再起動、未知パスへの探索、エンコードされた不審パスを集計する。上流接続エラーとも時刻で照合する。NodeのCVEはクライアント側外部応答にも関わり、受信アクセスログだけで悪用を否定できない。
4. GA4でhostname・ランディングページ・参照元・国・エンゲージメントの構成を調べ、Vercelの実リクエスト増加と照合する。bot、参照スパム、計測変更、正規流入も候補に残す。
5. 不審なリクエストやFirewall遮断は侵入成功の証拠ではない。障害・未承認デプロイ・設定/ソース変更などの別の証拠と突き合わせる。本番へ攻撃用リクエストは送信しない。

## 検証

検証用Node.jsは公式22.23.4、公式SHA256一致。`/private/tmp`内だけで展開し、PATHを検証コマンドへ限定した。

- バージョン検査の境界8件: 22.23.3以前、別メジャー、prereleaseを拒否、22.23.4以降の22系を許可することを確認。
- `npm run typecheck`: 成功（1回）。
- `node --test tests/unit/jev-demo.cjs`: 成功。APIの入力検査・応答・エラー・キー分離をモック上流で確認。外部サービスへの実通信なし。
- `npm run build`: 成功（1回）。prebuildに `v22.23.4`、Webpackビルド・259ページ生成・トレース収集・終了コード0を確認。Google FontsのDNS解決失敗（`ENOTFOUND fonts.googleapis.com`）と画像生成時の `z-index` 未対応警告あり。OG画像の外観は未確認。ビルドが変更した生成ファイル `next-env.d.ts` は元に戻し、無関係な差分を残していない。各検証コマンドは180秒上限。
- `npm run start -- --hostname 127.0.0.1 --port 3127`: prestartのバージョン検査は成功したが、sandboxの `listen EPERM` により起動できず。HTTPでのページ/API確認と実サーバーでの起動ログ確認は未完了。プロセスグループを停止済み。別設定・権限による再試行なし。
- ブラウザ・本番API・攻撃ペイロードによる検証は行わない。

## 公式出典

- Node.js告知・修正対象: https://nodejs.org/en/blog/vulnerability/october-2026-security-releases
- Node.js 22.23.4リリース・同梱更新・SHASUMS: https://nodejs.org/en/blog/release/v22.23.4/
- Vercelのバージョン選択・自動パッチ方針・実バージョン確認: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- Vercel Changelog（今回の個別完了告知は確認できず）: https://vercel.com/changelog
- Runtime Logs・保存期間: https://vercel.com/docs/logs/runtime
- Firewallの確認観点: https://vercel.com/docs/vercel-firewall/firewall-observability

推奨コミットメッセージ: `fix: require patched Node.js 22 runtime and document security assessment`
