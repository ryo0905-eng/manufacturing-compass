"""Report every frozen run, including adverse outcomes; no inference or fitting."""
import json
from collections import Counter

import numpy as np

from compare_v2 import OUTPUT, PROTOCOL
from data import ROOT, RECIPES
from data_v2 import load
from followup_v2 import sha

SEEDS = (17, 29, 43)


def paired(base, variant):
    if base["imageIds"] != variant["imageIds"]:
        raise ValueError("Evaluation images differ")
    before = np.asarray(base["decisions"], dtype=bool)
    after = np.asarray(variant["decisions"], dtype=bool)
    return {"changed": int((before != after).sum()),
            "newlyStopped": int((~before & after).sum()), "newlyPassed": int((before & ~after).sum()),
            "changedImageIds": [image_id for image_id, changed in zip(base["imageIds"], before != after) if changed]}


def report():
    rows, missing = {}, []
    training_data = {}
    for recipe in RECIPES:
        arrays, metadata = load("train", recipe)
        training_data[recipe] = {
            "images": len(metadata), "kinds": dict(Counter(m["kind"] for m in metadata)),
            "cleanTextures": dict(Counter(m["texture"] for m in metadata if m["kind"] == "good")),
            "alteredLabels": sum(m["labelAltered"] for m in metadata),
            "positiveTrainingMasks": int(arrays["masks"].reshape(len(metadata), -1).any(axis=1).sum())}
    for recipe in RECIPES:
        for seed in SEEDS:
            name = f"{recipe}-{seed}"
            path = OUTPUT / f"{name}-evaluation.json"
            if not path.exists():
                missing.append(name)
                continue
            row = json.loads(path.read_text())
            if row.get("incomplete"):
                missing.append(name)
                continue
            if row["protocolSha256"] != sha(PROTOCOL):
                raise ValueError("Protocol changed")
            rows[name] = row
    comparisons = []
    for recipe in RECIPES:
        if recipe == "balanced":
            continue
        for seed in SEEDS:
            base, variant = rows.get(f"balanced-{seed}"), rows.get(f"{recipe}-{seed}")
            if base is None or variant is None:
                continue
            comparisons.append({"recipe": recipe, "seed": seed, **paired(base, variant),
                "missedDelta": variant["metrics"]["all"]["missed"]-base["metrics"]["all"]["missed"],
                "rejectedDelta": variant["metrics"]["all"]["rejected"]-base["metrics"]["all"]["rejected"],
                "scratchMissedDelta": variant["metrics"]["scratch"]["missed"]-base["metrics"]["scratch"]["missed"],
                "scratchIoUDelta": variant["metrics"]["scratch"]["defectMeanIoU"]-base["metrics"]["scratch"]["defectMeanIoU"]})
    development, metadata = load("development")
    scratch_ids = [i for i, m in enumerate(metadata) if m["kind"] == "scratch"]
    truth = development["truth"][scratch_ids].astype(bool)
    coverage = {}
    for seed in SEEDS:
        if f"balanced-{seed}" not in rows:
            continue
        with np.load(OUTPUT / f"balanced-{seed}-output.npz") as cached:
            prediction = cached["masks"][scratch_ids]
        hit = (truth & prediction).sum(axis=(1, 2))
        coverage[str(seed)] = {
            "meanTrueScratchCoverage": float(np.mean(hit/truth.sum(axis=(1, 2)))),
            "predictedToTrueTotalArea": float(prediction.sum()/truth.sum()),
            "missedPixels": int((truth & ~prediction).sum()),
            "excessPixels": int((prediction & ~truth).sum())}
    record = {"protocolSha256": sha(PROTOCOL), "missing": missing, "runs": rows, "comparisons": comparisons,
              "trainingData": training_data,
              "exploratoryBaselineCoverage": coverage,
              "baselineSeedsPassing": [s for s in SEEDS if rows.get(f"balanced-{s}", {}).get("meetsBaselineTarget")],
              "finalEvaluation": "not-run", "browserValidation": "not-run"}
    (ROOT / "docs/ai-visual-inspection-v2-comparison-experiment.json").write_text(json.dumps(record, indent=2)+"\n")
    lines = ["# AI外観検査 v2：学習構成・3シードの比較", "", "実測日: 2026-09-21。固定条件は[比較プロトコル](./ai-visual-inspection-v2-comparison-protocol.md)、全数値・ハッシュ・判定変化IDは[実験記録](./ai-visual-inspection-v2-comparison-experiment.json)を参照。", "",
        f"完了 {len(rows)}／12モデル。基準モデルの開発評価通過シード: {record['baselineSeedsPassing']}。未完了: {missing or 'なし'}。",
        "", "学習構成の影響の確認と、基準モデルの領域精度の再現性は別に判定する。基準が全3シードで通過しない限り、基準の再現性確認を完了扱いにはしない。",
        "", "全モデル2,400枚・10エポック・750更新。基準17は前回の重みを再利用。スコア0.5・最小面積12を共通に固定。同じ開発600枚（不良300・良品300）を評価し、調整し直していない。開発画像は確認済みであり、最終未知データではない。600枚は150基板×4画像で、同じ評価群を各シードに使用する。1,800枚の独立した評価ではない。", "",
        "| 学習構成 | シード | 見逃し / 300 | 過検出 / 300 | 汚れIoU | 傷IoU | ONNX照合 |",
        "| --- | ---: | ---: | ---: | ---: | ---: | --- |"]
    for name, row in rows.items():
        m = row["metrics"]
        lines.append(f"| {row['recipe']} | {row['seed']} | {m['all']['missed']} | {m['all']['rejected']} | {m['dirt']['defectMeanIoU']:.3f} | {m['scratch']['defectMeanIoU']:.3f} | {'通過' if row['conversion']['passed'] else '未達'} |")
    lines += ["", "IoUは正解欠陥との領域一致。良否だけが合っていても位置の違いを隠さない。ONNX照合は各モデルの先頭24枚で、最大スコア差1e-4未満と後処理領域の完全一致を確認する。ブラウザ検証ではない。", "", "## 実際の学習データ", "",
              "| 構成 | 良品 | 汚れ | 傷 | 誤ラベル | 欠陥あり学習マスク |",
              "| --- | ---: | ---: | ---: | ---: | ---: |"]
    for recipe, data in training_data.items():
        kinds = data["kinds"]
        lines.append(f"| {recipe} | {kinds.get('good', 0)} | {kinds.get('dirt', 0)} | {kinds.get('scratch', 0)} | {data['alteredLabels']} | {data['positiveTrainingMasks']} |")
    lines += ["", "normal-poorは良品の背景だけを平坦面へ変更。不良画像と欠陥マスクは基準と同一。label-errorsは画像を変更せず、傷の半数の学習マスクを空にする。評価用の正解は変更しない。dirt-biasedは傷を汚れへ置換するため、傷の例は0枚。この違いを『少し不足』と曖昧に説明しない。", "", "## 同一シードの基準との差", "",
              "正は増加、負は減少。見逃し・過検出は少ない方がよく、IoUは大きい方がよい。", "",
              "| 学習構成 | シード | 見逃し差 | 過検出差 | 傷IoU差 | 判定変化枚数 |",
              "| --- | ---: | ---: | ---: | ---: | ---: |"]
    for row in comparisons:
        lines.append(f"| {row['recipe']} | {row['seed']} | {row['missedDelta']:+d} | {row['rejectedDelta']:+d} | {row['scratchIoUDelta']:+.3f} | {row['changed']} |")
    lines += ["", "## 傾向の扱い", ""]
    for recipe in RECIPES:
        if recipe == "balanced":
            continue
        matched = [r for r in comparisons if r["recipe"] == recipe]
        worse_iou = sum(r["scratchIoUDelta"] < 0 for r in matched)
        more_misses = sum(r["scratchMissedDelta"] > 0 for r in matched)
        more_rejects = sum(r["rejectedDelta"] > 0 for r in matched)
        lines.append(f"- {recipe}: 傷IoU低下 {worse_iou}/{len(matched)}、傷の見逃し増加 {more_misses}/{len(matched)}、良品の過検出増加 {more_rejects}/{len(matched)} シード。")
    lines += ["", "一致しない指標を『必ず悪くなる』と説明しない。3シードは限定した再現性の確認であり、統計的有意性や実工場の性能保証ではない。背景・模様の近似、構成変更と最適化の相互作用もあるため、一般的なAIの優劣へ拡張しない。", "",
              "## 基準モデルの位置精度の補足", "", "以下は結果を見た後の探索的な集計。判定基準を置き換えたり、しきい値を調整したりするためには使っていない。正解の傷のうち検出領域が覆った割合を画像ごとに計算し、150枚で平均した。過大な領域を出す影響もあるため、この割合だけを性能指標にしない。", ""]
    for seed, value in coverage.items():
        lines.append(f"- シード{seed}: 正解の傷を覆った割合 {value['meanTrueScratchCoverage']:.1%}、予測面積／正解面積の合計比 {value['predictedToTrueTotalArea']:.3f}。")
    lines += ["", "傷の一部を拾えば画像は不良判定になるため、見逃しの少なさと領域全体の再現は別問題。基準モデルの位置精度のシード差を、良否判定だけで合格扱いにはしない。", "",
              "## 残る確認", "", "照明変化、ルール比較のv2再評価、背景交換、しきい値曲線、最終600枚、Worker/WASMと端末性能、人による試用は未完了。教材候補のシードは事前指定した17とし、今回の結果から一番よいシードを選ばない。UI・公開ルート・デプロイは今回追加していない。", ""]
    (ROOT / "docs/ai-visual-inspection-v2-comparison-validation.md").write_text("\n".join(lines))
    print(json.dumps({"complete": len(rows), "missing": missing, "baselineSeedsPassing": record["baselineSeedsPassing"]}))


if __name__ == "__main__":
    report()
