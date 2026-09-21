# AI外観検査教材 v2

更新日: 2026-09-22

4つのモデルはManufacturing Compassの合成画像で独自に学習した重みです。外部画像・外部の学習済み重みは使用していません。教育用であり、実工場の性能を保証しません。学習は事前に実施したもので、端末内での再学習ではありません。

モデルの構成、学習条件、評価記録はリポジトリの `docs/ai-visual-inspection-v2-holdout-validation.md` と `docs/ai-visual-inspection-v2-matched-validation.md` を参照してください。配信対象は事前指定シード17のみ。各モデルのSHA-256は `manifest.json` に記録しています。教材固有の画像・重みの第三者向け再配布ライセンスは未設定です。

ONNX Runtime Web 1.22.0はMITライセンスです。原文は `ort/LICENSE`、依存コンポーネントの通知は `ort/ThirdPartyNotices.txt` に収録しています。取得元:

- https://github.com/microsoft/onnxruntime/blob/v1.22.0/LICENSE
- https://github.com/microsoft/onnxruntime/blob/v1.22.0/ThirdPartyNotices.txt

ランタイム・WASMは同じ1.22.0パッケージから取り出しています。WebGPU・外部CDN・外部AI APIは使用しません。
