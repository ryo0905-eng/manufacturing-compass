"""Summarize stored stability runs without fitting or re-evaluating."""
import json

import numpy as np
from PIL import Image, ImageDraw

from data import ROOT
from stability_v2 import OUTPUT, PROTOCOL, SEEDS, read
from followup_v2 import sha
from data_v2 import load


def preview():
    arrays, meta = load("development")
    masks = []
    for seed in SEEDS:
        with np.load(OUTPUT / f"development-{seed}.npz") as cached:
            masks.append(cached["masks"])
    ids = [next(i for i, m in enumerate(meta) if m["kind"] == kind and m["texture"] == texture)
           for kind, texture in (("good", "lines"), ("dirt", "flat"), ("scratch", "flat"), ("scratch", "lines"))]
    # Include the first incorrect decision for each seed, not only successful examples.
    for mask in masks:
        wrong = np.flatnonzero(mask.reshape(len(mask), -1).any(axis=1) != arrays["labels"])
        if len(wrong) and int(wrong[0]) not in ids:
            ids.append(int(wrong[0]))
    sheet = Image.new("RGB", (640, len(ids)*155+20), "white")
    draw = ImageDraw.Draw(sheet)
    for column, name in enumerate(("Input", "True defect", "Seed 17", "Seed 29", "Seed 43")):
        draw.text((128*column+2, 2), name, fill="black")
    for row, i in enumerate(ids):
        draw.text((2, row*155+25), f"{meta[i]['id']} / {meta[i]['kind']}", fill="black")
        regions = [np.zeros((128, 128), dtype=bool), arrays["truth"][i].astype(bool), *(mask[i] for mask in masks)]
        for column, region in enumerate(regions):
            pixels = np.repeat(arrays["images"][i, :, :, None], 3, axis=2)
            pixels[region] = (.4*pixels[region]+.6*np.array([230, 60, 30])).astype(np.uint8)
            sheet.paste(Image.fromarray(pixels), (column*128, row*155+45))
    sheet.save(OUTPUT / "preview.png")
    (OUTPUT / "preview-ids.json").write_text(json.dumps([meta[i]["id"] for i in ids], indent=2)+"\n")


def report():
    runs = {stage: {str(seed): read(stage, seed) for seed in SEEDS
                    if (OUTPUT / f"{stage}-{seed}.json").exists()}
            for stage in ("train", "development")}
    passed = {stage: [seed for seed, row in rows.items() if row.get("passed")]
              for stage, rows in runs.items()}
    record = {"protocolSha256": sha(PROTOCOL), "runs": runs, "passingSeeds": passed,
              "finalEvaluation": "not-run", "browserValidation": "not-run"}
    (ROOT / "docs/ai-visual-inspection-v2-stability-experiment.json").write_text(json.dumps(record, indent=2)+"\n")
    lines = ["# AI外観検査 v2：基準モデルの安定化結果", "", "実測日: 2026-09-22。[固定条件](./ai-visual-inspection-v2-stability-protocol.md)・[全数値とハッシュ](./ai-visual-inspection-v2-stability-experiment.json)。旧比較結果は上書きしていない。", "",
             f"調整群の通過シード: {passed['train']}。開発群の通過シード: {passed['development']}。",
             "", "既存の10エポックから全3シードへ6エポック追加。学習率0.0003、Adamと乱数を再初期化。全16エポック・1,200更新。しきい値0.5、最小面積12、合格基準は変更していない。追加学習量と学習率等が同時に変わるため、改善を単一要因の効果とは断定しない。", "",
             "| シード | 評価群 | 見逃し／不良 | 過検出／良品 | 汚れIoU | 傷IoU | 基準 |",
             "| ---: | --- | ---: | ---: | ---: | ---: | --- |"]
    for seed in SEEDS:
        train = runs["train"].get(str(seed), {})
        dev = runs["development"].get(str(seed), {})
        for label, metrics, accepted in (
            ("調整・追加前", train.get("before"), None),
            ("調整・追加後", train.get("after"), train.get("passed")),
            ("開発・追加後", dev.get("metrics"), dev.get("passed"))):
            if not metrics:
                continue
            m = metrics["all"]
            status = "参考" if accepted is None else "通過" if accepted else "未達"
            lines.append(f"| {seed} | {label} | {m['missed']}/{m['bad']} | {m['rejected']}/{m['good']} | {metrics['dirt']['defectMeanIoU']:.3f} | {metrics['scratch']['defectMeanIoU']:.3f} | {status} |")
    lines += ["", "調整400枚と開発600枚は別群。開発600枚は150基板×4画像で、過去に確認済みの開発データ。3シードは同じ画像群を使い、独立した1,800枚の評価とは扱わない。最終600枚は未評価。", "", "## 変換確認", ""]
    for seed, row in runs["development"].items():
        if "conversion" in row:
            conversion = row["conversion"]
            lines.append(f"- シード{seed}: 先頭24枚、最大スコア差 {conversion['maxAbsoluteDifference']:.8f}、領域一致 {conversion['masksMatch']}、照合通過 {conversion['passed']}。")
    for stage, rows in runs.items():
        for seed, row in rows.items():
            if row.get("incomplete"):
                lines.append(f"- 未完了: {stage}/{seed}（{row['reason']}）。")
    lines += ["", "## 次の段階", "", "基準の3シードが通過した場合も、旧10エポックの偏りモデルとの比較へ混在させない。残り9モデルに同じ追加学習を適用し、学習構成の効果を再確認してから、照明・ルール比較・背景交換・しきい値曲線・最終評価へ進む。UI、Worker/WASM、実端末性能、人による試用、公開は未実施。", "",
              "実行スクリプトは `stability_v2.py train <seed>`、全調整通過後の `stability_v2.py development <seed>`、保存済み記録だけを読む `report_stability_v2.py`。各学習・評価コマンドは175秒上限。", ""]
    (ROOT / "docs/ai-visual-inspection-v2-stability-validation.md").write_text("\n".join(lines))
    if all("metrics" in runs["development"].get(str(seed), {}) for seed in SEEDS):
        preview()
    print(json.dumps(passed))


if __name__ == "__main__":
    report()
