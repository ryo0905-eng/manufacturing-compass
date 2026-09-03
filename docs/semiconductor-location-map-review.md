# 日本の半導体企業・拠点マップ 座標レビュー

最終更新日: 2026-09-03

## 役割

[`semiconductor-location-map-pilot.md`](./semiconductor-location-map-pilot.md) に記録した代表10拠点の暫定座標を、人が地図上で確認するためのレビュー表です。

この文書は公開用データの正本ではありません。正式住所、座標、出典の正本はパイロット台帳とし、レビュー結果を反映した後に `human-reviewed` へ変更します。

## 確認手順

各拠点について次の順で確認します。

1. 公式住所を開き、企業名、拠点名、都道府県、市区町村が一致するか確認する
2. 座標確認リンクを開き、ピンまたは施設区域が同じ住所の敷地を示すか確認する
3. ピンの対象を「施設中心」「本社建屋」「正門」「その他」「不明」から選ぶ
4. 明らかな別地点、市区町村代表点、同名他社の場合は `要修正` とする
5. 確認開始・終了時刻を記録し、1拠点ごとのレビュー分数を算出する
6. 修正した場合は、新しい座標だけでなく確認根拠URLも記録する

航空写真や地図だけから、非公開の敷地用途、建屋名、入構経路を推測しません。レビュー担当者の氏名などの個人情報も記録しません。

## 判定値

| 項目 | 入力値 |
| --- | --- |
| 位置判定 | `未確認`、`OK`、`要修正`、`判断不能` |
| ピン対象 | `施設中心`、`本社建屋`、`正門`、`その他`、`不明` |
| 公式住所判定 | `一致`、`表記差のみ`、`不一致` |
| 利用可否 | `本番候補`、`照合専用`、`利用不可` |

## 代表10拠点レビュー表

時刻は `YYYY-MM-DD HH:MM`、レビュー時間は分単位で記録します。修正がない場合、修正座標と修正根拠は空欄にします。

| 拠点ID | 公式住所・拠点情報 | 座標確認 | 精度 | 位置判定 | ピン対象 | 公式住所判定 | 利用可否 | 開始 | 終了 | 分 | 修正座標 | 修正根拠・メモ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| `tsmc-jasm-kumamoto` | [JASM採用情報](https://www.tsmc.com/static/japanese/careers/jasm/index.html) | [32.886088, 130.843565](https://qchizu.jp/maps/#17/32.886088/130.843565/) | `parcel` | `未確認` | `不明` |  | `照合専用` |  |  |  |  |  |
| `micron-hiroshima` | [Micron拠点一覧](https://jp.micron.com/about/locations) | [34.384981, 132.678461](https://qchizu.jp/maps/#17/34.384981/132.678461/) | `residential-detail` | `未確認` | `不明` |  | `照合専用` |  |  |  |  |  |
| `tel-miyagi-taiwa` | [東京エレクトロン宮城](https://www.tel.co.jp/about/locations/tml.html) | [38.366095, 140.855871](https://qchizu.jp/maps/#17/38.366095/140.855871/) | `parcel` | `未確認` | `不明` |  | `照合専用` |  |  |  |  |  |
| `kioxia-yokkaichi` | [キオクシア四日市工場](https://www.kioxia.com/ja-jp/about/yokkaichi.html) | [35.019584, 136.612247](https://www.openstreetmap.org/relation/8866755) | `facility` | `未確認` | `施設中心` |  | `照合専用` |  |  |  |  |  |
| `screen-hikone` | [SCREEN国内事業所](https://www.screen.co.jp/about/base) | [35.232462, 136.265452](https://www.openstreetmap.org/way/641965677) | `facility` | `未確認` | `施設中心` |  | `照合専用` |  |  |  |  |  |
| `advantest-gunma-rd` | [群馬R&Dセンタ](https://www.advantest.com/ja/about/offices/gunma-rd-center/) | [36.208072, 139.491423](https://qchizu.jp/maps/#17/36.208072/139.491423/) | `parcel` | `未確認` | `不明` |  | `照合専用` |  |  |  |  |  |
| `renesas-takasaki` | [ルネサス国内拠点](https://www.renesas.com/ja/about/profile/global) | [36.331604, 139.070079](https://goo.gl/maps/98pi4oEyaX5KGuaEA) | `facility` | `未確認` | `不明` |  | `本番候補` |  |  |  |  |  |
| `rohm-kyoto-hq-factory` | [ロームグループ拠点](https://www.rohm.co.jp/company/about/branch) | [34.994812, 135.728840](https://www.openstreetmap.org/node/12162125058) | `facility` | `未確認` | `本社建屋` |  | `照合専用` |  |  |  |  |  |
| `socionext-shin-yokohama` | [ソシオネクスト国内拠点](https://www.socionext.com/jp/recruit/corporate/m-global-network.html) | [35.507306, 139.611503](https://maps.app.goo.gl/cZf492Mjk6K2feaz9) | `facility` | `未確認` | `本社建屋` |  | `本番候補` |  |  |  |  |  |
| `sumco-imari-nagahama` | [SUMCO会社概要・製造拠点](https://www.sumcosi.com/corporate/profile.html) | [33.282370, 129.850366](https://qchizu.jp/maps/#17/33.282370/129.850366/) | `parcel` | `未確認` | `不明` |  | `照合専用` |  |  |  |  |  |

`本番候補` は座標ソースの利用許諾確認が不要という意味ではありません。企業公式ページから到達できる座標を優先候補にしているだけで、本番の地図基盤と利用条件を決めてから最終判断します。

## 集計

レビュー後に次を記録します。

| 指標 | 結果 |
| --- | --- |
| レビュー完了数 | 0 / 10 |
| `OK` | 0 |
| `要修正` | 0 |
| `判断不能` | 0 |
| `本番候補` | 2 |
| レビュー時間中央値 | 未計測 |
| 最長レビュー時間 | 未計測 |
| 10拠点の合計時間 | 未計測 |

## Go / No-Go基準

座標レビュー単体は、次をすべて満たした場合にGoとします。

- 10拠点すべてをレビュー済みにする
- `OK` または根拠付きで修正済みが10件中9件以上
- 市区町村代表点や明らかな別施設が0件
- レビュー時間中央値が1拠点5分以内
- 本番で使用する座標生成方法と地図表示条件を決定できる

マップ公開MVPは、座標レビューに加えて次を満たした場合にGoとします。

- 24拠点中20拠点以上を `human-reviewed` にできる見通しがある
- 拠点の存在、稼働状態、求人状態を別の更新周期で管理できる
- 全国ページの初期HTMLに、地図なしでも価値のある拠点一覧と説明を出せる
- `/companies` と `/industry-map` から自然に接続できる
- 求人連携やリアルタイム求人数をMVPへ含めない

現時点の判定は `条件付きGo` です。検索需要と24拠点のデータ構造は確認できていますが、座標レビュー、座標利用条件、20拠点以上の公開品質が未完了です。

地図表示と座標生成方法は、2026-09-04時点で「Leaflet 1.9系、地理院淡色タイル、編集時に自前実行するABR Geocoder」を暫定採用案としました。根拠と実装前の確認事項は [`semiconductor-location-map-technical-decision.md`](./semiconductor-location-map-technical-decision.md) に記録しています。

## レビュー後の反映

1. 修正座標と根拠をパイロット台帳へ反映する
2. レビュー済み座標を `human-reviewed` に変更する
3. 実測した中央値から50〜70拠点の初回確認工数を見積もる
4. 20〜25社・50〜70拠点の公開MVPへ進むか最終判断する
5. Goの場合だけPRD、architecture、database、SEO、導線設計を更新して実装へ進む
