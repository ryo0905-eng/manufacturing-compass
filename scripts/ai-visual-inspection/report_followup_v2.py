"""Report recorded follow-up stages without rerunning training or evaluation."""
import json

from data import ROOT
from followup_v2 import OUTPUT


def report():
    stages = {}
    for name in ("tiny-extension", "baseline", "development"):
        path = OUTPUT / f"{name}.json"
        stages[name] = json.loads(path.read_text()) if path.exists() else {"status": "not-run"}
    evidence = {"date": "2026-09-21", "experiment": "v2-authorized-followup", "stages": stages,
                "finalEvaluation": "not-run", "browserValidation": "not-run", "humanReview": "pending"}
    (ROOT / "docs/ai-visual-inspection-v2-followup-experiment.json").write_text(json.dumps(evidence, indent=2)+"\n")
    lines = ["# AI外観検査 v2：追加学習の結果", "", "実施日: 2026-09-21", "",
             "ユーザーの追加検証指示に基づき、[固定プロトコル](./ai-visual-inspection-v2-followup-protocol.md)に従って実行。旧v2の320更新での未達と、当時の合格基準は変更していない。", "",
             "## 段階別の結果", "", "| 段階 | 評価画像 | 汚れIoU | 傷IoU | 見逃し／不良品 | 過検出／良品 | 判定 |",
             "| --- | --- | --- | --- | --- | --- | --- |"]
    names = {"tiny-extension": "48枚の学習確認", "baseline": "2,400枚で学習した基準モデル", "development": "設定固定後の開発評価"}
    for name, record in stages.items():
        if "passed" not in record or record.get("incomplete"):
            lines.append(f'| {names[name]} | — | — | — | — | — | {"未完了" if record.get("incomplete") else "未実行"} |')
            continue
        metrics = record["metrics"] if name == "development" else record["history"][-1]["metrics"]
        label = "学習に使用した48枚" if name == "tiny-extension" else "調整用400枚" if name == "baseline" else "開発用600枚"
        total = metrics["all"]
        lines.append(f'| {names[name]} | {label} | {metrics["dirt"]["defectMeanIoU"]:.3f} | {metrics["scratch"]["defectMeanIoU"]:.3f} | {total["missed"]}／{total["bad"]} | {total["rejected"]}／{total["good"]} | {"通過" if record["passed"] else "未達"} |')
    lines += ["", "評価対象が異なるため、段階間の数値を直接の改善率として比較しない。学習確認は未知画像への精度ではない。調整群は学習停止の判断に使用するため独立した最終評価ではない。開発群はこの設定で一度だけ評価し、結果からしきい値・重みを調整していない。", ""]
    for name in ("tiny-extension", "baseline"):
        record = stages[name]
        if not record.get("history"):
            continue
        lines += [f'## {names[name]}の経過', "", "| 更新数 | 汚れIoU | 傷IoU | 見逃し | 過検出 | 条件充足 |",
                  "| --- | --- | --- | --- | --- | --- |"]
        for row in record["history"]:
            m = row["metrics"]
            lines.append(f'| {row["totalUpdates"]} | {m["dirt"]["defectMeanIoU"]:.3f} | {m["scratch"]["defectMeanIoU"]:.3f} | {m["all"]["missed"]} | {m["all"]["rejected"]} | {"○" if row["meetsTarget"] else "未達"} |')
        lines += ["", f'所要時間{record["seconds"]:.1f}秒、ONNXモデル{record["onnxBytes"]:,} bytes。', ""]
    lines += ["## 条件と解釈", "",
              "48枚の追加学習は旧モデルから継続し、Adamを再初期化、学習率を0.001から0.0003へ変更した。回数追加と学習率変更を同時に行っているため、どちらだけが改善原因かは分離できない。基準モデルはtinyの重みを使わず、新しく初期化して2,400枚で学習した。", "",
              "しきい値0.5・最小面積12は全段階で固定。少数確認は各欠陥IoU 0.70以上・見逃し5%以下・良品過検出5%以下を2回連続、調整群は各IoU 0.50以上・各見逃し20%以下・過検出10%以下を2回連続、開発群は後者を1回の固定評価で確認。", ""]
    development = stages["development"]
    if development.get("conversion"):
        ref = development["conversion"]
        lines += [f'PyTorch／ONNX変換照合: {ref["samples"]}枚、最大スコア差{ref["maxAbsoluteDifference"]:.3g}、最終領域一致={ref["masksMatch"]}。', "",
                  f'ONNXネイティブCPU推論: 中央値{development["nativeCpuMedianMs"]:.1f}ms、95パーセンタイル{development["nativeCpuP95Ms"]:.1f}ms。ブラウザやスマホの実測値ではない。', ""]
    lines += ["## 残る確認", "",
              "今回の通過は合成画像・特定シードでの基準モデルの確認。学習データ構成の比較と3シードの再現性、撮影条件変化での評価、最終600枚、ブラウザ／スマホ性能、学習体験の試用は別段階。これらを完了済みとは扱わず、UI・公開アセット・デプロイは追加していない。", "",
              "## 記録とコマンド", "",
              "[全数値・ハッシュ](./ai-visual-inspection-v2-followup-experiment.json)。生出力とモデルは `.cache/ai-visual-inspection/v2/followup/` に保持。旧v1/v2の結果は上書きしていない。", "",
              "`scripts/ai-visual-inspection/followup_v2.py` の `tiny-extension`、通過後に `baseline`、通過後に `development` を各1回実行。キャッシュの画像確認は `inspect_followup_v2.py`、集計は `report_followup_v2.py`。型チェック・lint・build・ブラウザ・デプロイ・commit・pushは実行していない。", "",
              "開発用画像のプレビューは正常縞模様・無地の汚れ・無地の傷・縞上の傷を、結果によらずメタデータ順で抽出した。正常模様の誤検出が残る例もそのまま保存。`development-images.json` に600枚すべての判定・領域一致度、`development-errors.png` に全誤判定例を保持する。", ""]
    (ROOT / "docs/ai-visual-inspection-v2-followup-validation.md").write_text("\n".join(lines))
    print(json.dumps({name: row.get("passed", row.get("status")) for name, row in stages.items()}))


if __name__ == "__main__":
    report()
