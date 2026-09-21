"""Compare all twelve matched continuations using stored predictions only."""
import json

import numpy as np
from PIL import Image, ImageDraw

from data import ROOT, RECIPES
from data_v2 import load
from followup_v2 import sha
from matched_v2 import OUTPUT, PROTOCOL
from stability_v2 import OUTPUT as BASELINE, PROTOCOL as BASELINE_PROTOCOL, SEEDS, read
from report_comparison_v2 import paired
from processing import metrics


def source(recipe):
    return (BASELINE, BASELINE_PROTOCOL) if recipe == "balanced" else (OUTPUT / recipe, PROTOCOL)


def preview(arrays, metadata, masks):
    selected = [next(i for i, m in enumerate(metadata) if m["kind"] == kind and m["texture"] == texture)
                for kind, texture in (("good", "lines"), ("dirt", "flat"), ("scratch", "flat"), ("scratch", "lines"))]
    decisions = {r: masks[f"{r}-17"].reshape(len(metadata), -1).any(axis=1) for r in RECIPES}
    reasons = {i: "metadata-first" for i in selected}
    for recipe in RECIPES[1:]:
        for kind in ("good", "scratch"):
            candidates = [i for i, m in enumerate(metadata) if m["kind"] == kind and
                          decisions[recipe][i] != decisions["balanced"][i]]
            if candidates and candidates[0] not in reasons:
                i = candidates[0]
                selected.append(i)
                reasons[i] = f"first-change-{recipe}"
    sheet = Image.new("RGB", (768, len(selected)*155+20), "white")
    draw = ImageDraw.Draw(sheet)
    for col, header in enumerate(("Input", "True defect", *RECIPES)):
        draw.text((col*128+2, 2), header, fill="black")
    for row, i in enumerate(selected):
        draw.text((2, row*155+25), f"{metadata[i]['id']} / {metadata[i]['kind']} / {reasons[i]}", fill="black")
        regions = [np.zeros((128, 128), dtype=bool), arrays["truth"][i].astype(bool),
                   *(masks[f"{r}-17"][i] for r in RECIPES)]
        for col, region in enumerate(regions):
            pixels = np.repeat(arrays["images"][i, :, :, None], 3, axis=2)
            pixels[region] = (.4*pixels[region]+.6*np.array([230, 60, 30])).astype(np.uint8)
            sheet.paste(Image.fromarray(pixels), (col*128, row*155+45))
    sheet.save(OUTPUT / "preview.png")
    (OUTPUT / "preview-ids.json").write_text(json.dumps([
        {"id": metadata[i]["id"], "reason": reasons[i]} for i in selected], indent=2)+"\n")


def report():
    arrays, metadata = load("development")
    ids = [m["id"] for m in metadata]
    rows, masks = {}, {}
    for recipe in RECIPES:
        folder, protocol = source(recipe)
        for seed in SEEDS:
            name = f"{recipe}-{seed}"
            train = read("train", seed, folder, protocol)
            result = read("development", seed, folder, protocol)
            if train.get("incomplete") or result.get("incomplete"):
                raise ValueError(f"Incomplete run: {name}; cannot publish complete comparison")
            if (train["totalUpdates"] != 1200 or train["additionalUpdates"] != 450 or
                    train["learningRate"] != .0003 or not train["optimizerReinitialized"] or
                    train["trainingImages"] != 2400):
                raise ValueError("Unmatched training conditions")
            path = folder / name
            if (sha(path.with_suffix(".onnx")) != train["modelSha256"] or
                    sha(path.with_suffix(".pt")) != train["weightsSha256"] or
                    result["modelSha256"] != train["modelSha256"]):
                raise ValueError("Model artifact mismatch")
            if result["evaluationSplit"] != "development" or result["threshold"] != .5 or result["minimumArea"] != 12:
                raise ValueError("Unmatched evaluation conditions")
            with np.load(folder / f"development-{seed}.npz") as cache:
                mask = cache["masks"]
            if metrics(mask, arrays["truth"], arrays["labels"]) != result["metrics"]["all"]:
                raise ValueError("Stored masks / counts disagree")
            masks[name] = mask
            rows[name] = {"recipe": recipe, "seed": seed, "training": train, "evaluation": result,
                          "decisions": mask.reshape(len(mask), -1).any(axis=1).astype(int).tolist(), "imageIds": ids}
    comparisons = []
    for recipe in RECIPES[1:]:
        for seed in SEEDS:
            base, variant = rows[f"balanced-{seed}"], rows[f"{recipe}-{seed}"]
            b, v = base["evaluation"]["metrics"], variant["evaluation"]["metrics"]
            comparisons.append({"recipe": recipe, "seed": seed, **paired(base, variant),
                "missedDelta": v["all"]["missed"]-b["all"]["missed"],
                "rejectedDelta": v["all"]["rejected"]-b["all"]["rejected"],
                "scratchMissedDelta": v["scratch"]["missed"]-b["scratch"]["missed"],
                "scratchIoUDelta": v["scratch"]["defectMeanIoU"]-b["scratch"]["defectMeanIoU"]})
    record = {"protocolSha256": sha(PROTOCOL), "runs": rows, "comparisons": comparisons,
              "finalEvaluation": "not-run", "browserValidation": "not-run"}
    (ROOT / "docs/ai-visual-inspection-v2-matched-experiment.json").write_text(json.dumps(record, indent=2)+"\n")
    lines = ["# AI外観検査 v2：同じ追加学習量での4構成比較", "", "実測日: 2026-09-22。[固定条件](./ai-visual-inspection-v2-matched-protocol.md)、[全数値・ハッシュ・判定変化ID](./ai-visual-inspection-v2-matched-experiment.json)。旧10エポック比較は保持する。", "",
        "全12モデルの条件を2,400枚・16エポック・1,200更新へ統一。最後の6エポックはAdamと乱数を再初期化して学習率0.0003。基準3本は安定化実験の成果物をハッシュ照合して再利用し、残る9本を追加学習した。しきい値0.5・面積12を共通に固定した。", "",
        "開発600枚は不良300・良品300（150基板×4画像）。各シードで同じ画像を使うため、独立した1,800枚の評価ではない。確認済みの開発画像であり、最終600枚は未評価。", "",
        "| 学習構成 | シード | 見逃し／300 | 過検出／300 | 汚れIoU | 傷IoU | ONNX照合 |",
        "| --- | ---: | ---: | ---: | ---: | ---: | --- |"]
    for row in rows.values():
        evaluation = row["evaluation"]
        m = evaluation["metrics"]
        lines.append(f"| {row['recipe']} | {row['seed']} | {m['all']['missed']} | {m['all']['rejected']} | {m['dirt']['defectMeanIoU']:.3f} | {m['scratch']['defectMeanIoU']:.3f} | {'通過' if evaluation['conversion']['passed'] else '未達'} |")
    lines += ["", "IoUは正解欠陥との領域一致。各モデル先頭24枚でPyTorch/ONNXスコア最大差1e-4未満と検出領域完全一致を確認。ブラウザ照合ではない。", "",
        "学習構成: balancedは良品1,200・汚れ600・傷600。dirt-biasedは良品1,200・汚れ1,200・傷0。normal-poorは基準の良品だけ平坦面へ変更し、不良画像は同じ。label-errorsは基準と同じ画像を使い、傷600枚のうち300枚の学習マスクを欠陥なしへ変更。評価の正解ラベルは変えない。", "",
        "## 同一シードの基準との差", "", "正は増加、負は減少。見逃し・過検出は少ない方、IoUは大きい方がよい。", "",
        "| 構成 | シード | 見逃し差 | 過検出差 | 傷IoU差 | 判定変化枚数 |",
        "| --- | ---: | ---: | ---: | ---: | ---: |"]
    for c in comparisons:
        lines.append(f"| {c['recipe']} | {c['seed']} | {c['missedDelta']:+d} | {c['rejectedDelta']:+d} | {c['scratchIoUDelta']:+.3f} | {c['changed']} |")
    lines += ["", "## 繰り返し確認できた範囲", ""]
    for recipe in RECIPES[1:]:
        subset = [c for c in comparisons if c["recipe"] == recipe]
        lines.append(f"- {recipe}: 傷の見逃し増加 {sum(c['scratchMissedDelta'] > 0 for c in subset)}/3、傷IoU低下 {sum(c['scratchIoUDelta'] < 0 for c in subset)}/3、良品の過検出増加 {sum(c['rejectedDelta'] > 0 for c in subset)}/3 シード。")
    lines += ["", "不変・改善も上表に残す。偏りモデルが全ての指標で劣ることは要求しない。3シードで方向が一致しても、この固定設定における限定的な確認であり、統計的有意性やAI全体の優劣、実工場の性能保証を主張しない。", "",
        "## 次の確認", "", "照明変化、ルール比較、背景交換、しきい値曲線、最終600枚、Worker/WASM、実端末性能、人による試用は未実施。表示候補は事前指定のシード17。全モデルの比較画像は保存済みマスクから生成し、メタデータ順の例と最初に判定が変わる画像を選ぶ。UI・公開ルート・デプロイは追加していない。", "",
        "実行: `matched_v2.py train <recipe> <seed>` と `matched_v2.py development <recipe> <seed>` を各9回、`report_matched_v2.py` で記録と画像を生成。各コマンド175秒上限。", ""]
    (ROOT / "docs/ai-visual-inspection-v2-matched-validation.md").write_text("\n".join(lines))
    preview(arrays, metadata, masks)
    print(json.dumps({"runs": len(rows), "conversionPassed": sum(r['evaluation']['conversion']['passed'] for r in rows.values()),
                      "comparisons": [{k: v for k, v in c.items() if k != "changedImageIds"} for c in comparisons]}))


if __name__ == "__main__":
    report()
