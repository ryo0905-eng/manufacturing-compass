# ショート動画制作ログ

最終更新日: 2026-08-16

## short-001-semiconductor-inspection

| 項目 | 記録 |
| --- | --- |
| 元記事 | `semiconductor-manufacturing-process` |
| 内容区分 | REF |
| 公開日 | 2026-08-16 |
| 公開先 | YouTube |
| 仕様 | 1080 × 1920、30 fps、46.55秒 |
| ナレーション | 1.0、0.4秒後に開始 |
| BGM | Shining / Leon Albertson feat. Adryon de León |
| BGM入手元 | YouTube Audio Library |
| BGM利用条件 | 帰属表示不要（2026-08-16確認） |
| BGM設定 | 0.28、1秒フェードイン、2.5秒フェードアウト |
| 公開版 | `semiconductor-inspection-short-with-audio-v4.mp4` |
| 技術確認 | H.264 + AAC 48kHz stereo、最大ピーク -0.95 dB |

### 調整で分かったこと

- BGM 0.04は技術上収録されていても、視聴時はほぼ無音に感じた
- 0.14は聴こえ始めるが、まだかなり控えめだった
- 0.20で存在感が出て、0.28を1本目の採用値とした
- 同じ数値でも曲によって聴感が変わるため、今後も試聴を省略しない
- 旧版との取り違えを避けるため、調整中は出力名へ `v2`、`v3` のような版番号を付ける

### 公開後の計測

| 確認時点 | 視聴継続 | 平均視聴 | 高評価・コメント | 記事流入 | メモ |
| --- | --- | --- | --- | --- | --- |
| 24時間 | 未確認 | 未確認 | 未確認 | 未確認 | |
| 7日 | 未確認 | 未確認 | 未確認 | 未確認 | |
| 28日 | 未確認 | 未確認 | 未確認 | 未確認 | |

### 未記録事項

- 公開URL

公開URLを記録する場合は、マニフェストとこのログを更新します。

## 2026-09-23：Short 002 NVIDIAとIntelの時価総額推移

- 出力：`output/nvidia-intel-short-v1.mp4`。42秒、1080×1920、30fps、H.264 CRF18、AAC 48kHz stereo。YouTube投稿は未実施。
- 元記事：`/guides/nvidia-intel-market-cap-history`。出典はCompaniesMarketCap、2010〜2025年末、確認日2026-09-23。サイトと同じ静的データをimportし、独立した転記を作らない。
- 0〜4秒：2010年末。4〜34秒：年末値を線形補間してバー・数値・順位を表示。34〜42秒：2025年末の確定値と検索CTA。2社内順位、補間、動的軸、単位・出典を明記。
- ナレーションなし、字幕とBGM。Shining（既存のライセンス記録参照）。音声がないためBGM係数を0.28から0.7へ変更。フェードイン1秒・アウト2.5秒。
- ロゴはサイト既存のNVIDIA/Intel原画像をvideo/public/logosへコピー。出典・権利記録はpublic/images/company-logos/README.mdと共通。
- `node video/tests/nvidia-intel.cjs`：16年の端点・2020年末逆転・全1260フレームの正数と順位移動を確認。初回書き出し後、4フレームのコンタクトシートで文字切れ・バー・出典・CTAを目視確認。
- `npm --prefix video run typecheck`は1回実行し、サイトデータへの相対import階層の誤りで失敗。パスを修正し、対象テストと実書き出しで参照を確認。規定により型チェックは再実行していない。
- Remotionの初回実行はsandboxのChromium起動権限で失敗。権限昇格後に書き出し成功。各書き出しは175秒上限。サイトbuild/devやブラウザ操作は未実施。
- 実端末の聴感、Shorts操作UIとの重なり、本番リンク、YouTubeへの公開は未確認。タイトル・説明欄案はnvidia-intel-upload.md。投稿後24時間/7日/28日の視聴とサイト流入を観測する。
- 最終版確認：42.048秒（映像42秒＋AAC末尾）、3,722,817 bytes。音声ピーク -5.4 dB、平均 -19.9 dB（volumedetect、LUFSではない）。修正後の4フレームも確認。クリッピングなし、実端末聴感は未確認。`git diff --check`・公開禁止語差分チェック通過。
