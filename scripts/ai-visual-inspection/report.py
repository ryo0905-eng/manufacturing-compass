"""Persist experiment evidence outside the ignored cache, without model assets."""
import json
from pathlib import Path

from data import CACHE, ROOT, RECIPES


def report():
    evaluations = []
    runs = []
    for seed in (17, 29, 43):
        for recipe in RECIPES:
            evaluations.append(json.loads((CACHE / "evaluation" / f"development-{recipe}-{seed}.json").read_text()))
            runs.append(json.loads((CACHE / "models" / f"{recipe}-{seed}.json").read_text()))
    record = {"recordedAt": "2026-09-21", "status": "development-only",
              "environment": (CACHE / "environment.txt").read_text().splitlines(),
              "gate": json.loads((CACHE / "gate.json").read_text()),
              "manifest": json.loads((CACHE / "manifest.json").read_text()),
              "audit": json.loads((CACHE / "audit.json").read_text()),
              "reference": json.loads((CACHE / "reference.json").read_text()),
              "rules": json.loads((CACHE / "evaluation/development-rules.json").read_text()),
              "training": runs, "evaluations": evaluations,
              "limitations": ["No browser/WASM timing measured", "No human learning trial or label review",
                              "MPS training; native ONNX CPU evaluation; timings include concurrent experiments",
                              "Only 4 training epochs; optimization stability not established",
                              "v1 applies gain 0.97 only to second clean captures; label-correlated nuisance blocks release",
                              "Simple flat surfaces can be perceptually similar across independent boards",
                              "Final set generated and audited but not used for inference or selection"]}
    target = ROOT / "docs/ai-visual-inspection-experiment.json"
    target.write_text(json.dumps(record, indent=2) + "\n")
    lines = ["# AI外観検査：初回技術検証", "", "実施日: 2026-09-21", "",
             "この結果は開発評価600枚（良品300・不良品300、汚れ150・傷150）に対する実測。最終評価600枚は推論に使用していない。", "",
             "## 結果", "", "| 学習構成 | シード | AIしきい値 | 見逃し / 300 | 過検出 / 300 | 欠陥IoU | 傷IoU |", "| --- | --- | --- | --- | --- | --- | --- |"]
    names = {"balanced": "全種類", "dirt-biased": "汚れ偏重", "normal-poor": "模様不足", "label-errors": "誤ラベル"}
    for row in evaluations:
        normal = row["conditions"]["1.0"]
        scratch = normal["breakdown"]["kind"]["scratch"]
        lines.append(f'| {names[row["recipe"]]} | {row["seed"]} | {row["threshold"]} | {normal["missed"]} | {normal["rejected"]} | {normal["defectMeanIoU"]:.3f} | {scratch["defectMeanIoU"]:.3f} |')
    lines += ["", "同じシード内では基準モデルの調整用しきい値を共用。学習構成ごとの最適しきい値と各しきい値での評価もJSONに記録し、切替時の自動調整で差を作っていない。", "",
              "ルール処理は基本方式が見逃し120／300・過検出13／300、局所照明補正を使う方式が見逃し0／300・過検出100／300。無地面の良品100枚・汚れ50枚に限定した最初の場面は、基本方式で見逃し・過検出とも0件だった。いずれも調整用データだけで決めたしきい値を使用。", "",
              "## 継続判定", "", f'機械的な技術ゲート: **{"通過" if record["gate"]["passed"] else "未達"}**。', ""]
    for check in record["gate"]["checks"]:
        if not check["passed"]:
            lines.append(f'- `{check["name"]}`: {json.dumps({k: v for k, v in check.items() if k not in ("name", "passed")}, ensure_ascii=False)}')
    lines += ["", "UI・Worker・Web側のモデル配布・公開導線は未実装。計画にある「傾向が単一シードに依存しない」を満たしていないため保留した。しきい値変更による演出や、成功するシードの選別は行わない。", "",
              "全種類モデルでも傷IoUが低く、良否判定が合っていても傷の位置を捉えたとは言えない。学習データの効果と、4エポックでの学習不足・最適化の不安定さを区別できていない。学習不足は原因候補であって、今回の結果だけから断定はできない。"]
    lines += ["", "## 比較条件と制限", "",
              "128×128画素、16/32/64チャネルのU-Net、117,985パラメータ、Adam・学習率0.002・バッチ32・4エポック。各構成2,400枚、シード17/29/43。ONNXは各477,448 bytes。汚れと傷の生成規則は教材独自で、実撮像を再現しない。", "",
              "学習・調整・開発・最終の間に元基板・画像・背景・欠陥テンプレートの完全一致はない。16×16縮小画像の平均絶対差1未満は無地面だけに存在し、独立生成でも似た画像になる制限がある。人による全画像・ラベルの確認は未実施。", "",
              "生成器v1には、良品の2枚目だけ明るさを0.97倍にする交絡が残っている。良否と撮影条件を独立にする要件を満たさないため、これも公開を止める理由とした。実測の再現性を守るためv1を後から書き換えず、次のデータ版で全クラス共通の撮影条件生成に直す。背景差し替え試験だけではこの交絡がないことの証明にならない。", "",
              "明るさ倍率0.7 / 1.0 / 1.3、背景差し替え、欠陥種類別、正常模様別、しきい値別の実測をJSONに保持。条件ごとに都合のよい結果だけを抽出しない。", "",
              "PyTorchとONNXのスコア・領域照合、Python/SciPyとTypeScriptの画素変換・連結成分照合を実施。ブラウザ推論、モバイル性能、操作品質、3人の学習試用は未検証。端末内CPU時間をスマホの実績と呼ばない。", "",
              "## 再現と次の判断", "", "実行手順は [実験README](../scripts/ai-visual-inspection/README.md)、全数値は [機械可読記録](./ai-visual-inspection-experiment.json)。生成画像・モデル・生出力は `.cache/ai-visual-inspection/` に保持し、公開配信・Gitには含めない。", "",
              "次の推奨は、撮影条件を全クラス共通に独立生成するデータv2を設計し、欠陥種類別の調整用損失・IoUで学習の収束を確認すること。データ枚数・モデル構造の拡大より先に、傷を学べる基準モデルを確立する。失敗した検証を設定変更して繰り返さない開発ルールに従い、今回はv2生成・再学習を実行していない。", ""]
    lines += ["## 今回の実行コマンド", "",
              "Pythonは一時仮想環境 `/private/tmp/mc-visual-inspection-venv` を使用。以下のスクリプトはすべて `scripts/ai-visual-inspection/` 配下。", "",
              "- `data.py`、`audit.py`（生成と漏洩・撮影条件監査）",
              "- `train.py <recipe> <seed>`（4構成×3シードの12独立学習、各175秒上限）",
              "- `evaluate.py <recipe> <seed>`（12開発評価）、`evaluate.py rules 17`",
              "- `reference.py`、`test_processing.py`、`contact_sheet.py`、`gate.py`、`report.py`",
              "- `node tests/unit/ai-visual-inspection.cjs`（独立参照を含む対象テスト）",
              "- `npm run typecheck`（1回、成功）、`git diff --check`",
              "", "データ生成・監査とルール評価は監査項目・評価曲線の追加に伴う再確認を含む。学習失敗の設定変更・再試行はない。lint、dev、ブラウザ、build、デプロイ、commit、pushは実行していない。", ""]
    (ROOT / "docs/ai-visual-inspection-validation.md").write_text("\n".join(lines))
    print(str(target))


if __name__ == "__main__":
    report()
