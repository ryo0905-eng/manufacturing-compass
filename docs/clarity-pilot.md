# ランキング記事限定のClarity

実装日：2026-09-28。本番設定・配信・Clarity管理画面の受信は未確認。

## 目的と対象

時価総額ランキングの書籍紹介へのスクロール到達、リンク周辺の操作、スマホでの迷いを2〜4週間観察する。GA4の件数と併用し、録画の少数例から購入しない理由や全訪問者の傾向を断定しない。

対象は `https://mfg-compass.com/guides/semiconductor-market-cap-ranking` のみ。クエリ付きURLは取得対象外。同意済み訪問だけの標本であり、GA4の母数と一致する前提にしない。本文はマスクするため、配置・クリック・スクロールを中心に読む。

## 配信前の設定

1. Clarityプロジェクト `ypdavv5xq6` の Settings → Setup でCookieを標準で設定するスイッチをOFFにし、Consent Modeを有効にする。コードから明示同意を通知する。
2. Settings → Masking はStrictを推奨。本文はコードの `data-clarity-mask` でも保護する。管理画面を操作・確認したとはまだ記録しない。
3. VercelのこのプロジェクトのProduction環境に `NEXT_PUBLIC_CLARITY_PROJECT_ID=ypdavv5xq6` を登録し、ユーザーがcommit/push・デプロイする。Preview/Developmentには設定不要。本番以外はサーバー側でも無効。
4. 無効化は環境変数を空にして再デプロイ。環境変数を変更するだけでは配信済みJSは更新されない。

## 同意とページ分離

- 同意前・拒否時はタグ取得も収集通信も開始しない。Cookieを使わない計測へ自動移行しない。
- 選択と期限だけを `mfg-clarity-consent-v1` としてlocalStorageに180日保存。保存できない時は同意を成立させず記録しない。記事は利用可能。
- 許可時、タグ取得前にconsentv2のanalytics_Storage=granted、ad_Storage=deniedをキューへ入れる。identify、独自ユーザーID、GA4連携、カスタムイベントは追加しない。
- 記事上部の設定から撤回可能。拒否を保存し、Clarityへdenied/stop、当サイトの_clck/_clsk削除、`?clarity=off` へのフル遷移を実行する。保存失敗時もこのURLでは再取得しない。MicrosoftドメインのCookieや過去の送信データを消去したとは扱わない。
- 保存済み同意の期限切れを毎分、別タブの保存変更をstorageイベント、BFCache復帰をpageshowで確認する。読み込み中の撤回もドキュメントごと破棄する。
- ランキングを独立root layoutへ分離し、他ページへのNext Link・履歴遷移でドキュメント境界を越える。cleanupでタグを削除するだけの実装にはしない。動的ガイドの静的生成対象から同じslugを除き、URL・canonical・記事データ・画像生成・sitemapは維持。
- 共通の日本語layoutを再利用するため、GA4/Vercelは各ドキュメントに一度だけ設置される。

## 検証

ローカルのモックテストでは、未同意/拒否/期限切れ/ストレージ例外、対象外path・host・query、同意キューの順序、重複ロード、撤回時のCookie・フル遷移を確認する。実際のClarity、GA4、ASPへは送信しない。

実行済み：`node tests/unit/clarity.cjs`、`npm run typecheck`（1回）、`git diff --check` は成功。公開追加文言の禁止語照合は該当なし。`.env.local`に運営者提供のIDを追加済み（ローカルではproduction条件を満たさないため収集しない）。dev・build・実ブラウザ確認・本番受信・commit・pushは未実施。別root layout間の実遷移は公式仕様に基づく実装で、モックテストによる実ブラウザ検証の代替とは扱わない。

本番受信前に、テスト用プロジェクト・GA無効の隔離環境で、同意前/拒否時のClarity通信ゼロ、同意後のみ取得、ランキング→入力ツール→戻る、別タブ撤回、取得途中の撤回、スマホ幅、OG画像とcanonicalを確認する。通常のPreview URLは本番へリダイレクトされるため、そのまま試験先にしない。buildとブラウザ確認はAGENTS.mdの明示依頼条件に従い、未実施の検証を完了扱いにしない。

本番での受信確認は運営者が公開後に実施する。受信開始日から観察期間を数える。現在の実装日は観察開始日ではない。

## 公式資料（2026-09-28確認）

- [設置](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup)
- [Consent Mode](https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode)
- [ConsentV2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2)：拒否だけではcookieless計測が残るためフル遷移を併用。
- [マスキング](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking)
- [情報開示](https://learn.microsoft.com/en-us/clarity/setup-and-installation/privacy-disclosure)
- [Next.js Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)：異なるroot layout間はフルページ読み込み。
