# 国・地域の識別用国旗

取得日：2026-10-17

世界時価総額・装置売上・メモリのランキングで、本社所在地の国・地域を補足する識別画像。企業の工場所在地、資本関係、従業員の国籍を示すものではない。日本企業だけの時価総額ランキングと平均年収ランキングには追加しない。

[Flagpediaの配布方法](https://flagpedia.net/download/api)に沿って、FlagCDNのSVGを取得した。配布元はWikimedia Commonsのベクターファイルに基づくと説明している。[利用条件](https://flagpedia.net/terms)の国旗画像に関する記載を2026-10-17に確認した。ダウンロードしたSVGを変更せず保存し、表示時に18×12pxの枠へ縦横比を保って収める。実行時に外部CDNへ接続しない。国・地域名を必ず併記し、画像は装飾扱いとする。

| 国・地域 | 保存ファイル | 取得URL | 取得日 |
| --- | --- | --- | --- |
| 米国 | us.svg | https://flagcdn.com/us.svg | 2026-10-17 |
| 台湾 | tw.svg | https://flagcdn.com/tw.svg | 2026-10-17 |
| 韓国 | kr.svg | https://flagcdn.com/kr.svg | 2026-10-17 |
| オランダ | nl.svg | https://flagcdn.com/nl.svg | 2026-10-17 |
| 中国 | cn.svg | https://flagcdn.com/cn.svg | 2026-10-17 |
| 英国 | gb.svg | https://flagcdn.com/gb.svg | 2026-10-17 |
| 日本 | jp.svg | https://flagcdn.com/jp.svg | 2026-10-17 |
| ドイツ | de.svg | https://flagcdn.com/de.svg | 2026-10-17 |

## 本社情報

装置・メモリの19社は`src/data/company-regions.ts`に、国・地域、公式出典URL、確認日を保持する。既存企業プロフィールの本社国と照合できる12社は一致を確認し、残りも公式の会社概要・拠点・連絡先・開示資料で照合した。グループ集計は親会社が基準で、Solidigmを含むSK hynix GroupはSK hynixの韓国を表示する。表示の追加に伴って、売上・時価総額・市場シェアの基準日を更新しない。

世界時価総額ランキングの国・地域は`src/data/semiconductor-market-cap.ts`の既存値を維持する。未知の国・地域名に対しては国旗を推測せず、文字のみを表示する。
