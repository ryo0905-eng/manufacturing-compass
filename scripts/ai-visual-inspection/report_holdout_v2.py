"""Read-only analysis of stored background/final predictions; never opens inference."""
import json

import numpy as np
from PIL import Image, ImageDraw

from holdout_v2 import OUTPUT, PROTOCOL, RECIPES, SEEDS, record
from lighting_v2 import load, summary
from processing import lighting
from data import ROOT, digest
from followup_v2 import sha


def preview(stage, rows):
    if stage == "final":
        arrays, meta = load("final")
        key = "1.0"
    else:
        key = "1"
        with np.load(OUTPUT / "swap1.npz") as cache:
            arrays = {k: cache[k] for k in cache.files}
        meta = json.loads((OUTPUT / "swap1-metadata.json").read_text())
    if "balanced-17" not in rows or "rules" not in rows:
        return
    selected = [next(i for i, m in enumerate(meta) if m["kind"] == kind and m["texture"] == texture)
                for kind, texture in (("good", "lines"), ("dirt", "flat"), ("scratch", "flat"), ("scratch", "lines"))]
    with np.load(OUTPUT / f"{stage}-balanced-17.npz") as stored:
        ai_masks = stored[key]
    errors = np.flatnonzero(ai_masks.reshape(600, -1).any(axis=1) != arrays["labels"])
    if len(errors) and int(errors[0]) not in selected:
        selected.append(int(errors[0]))
    with np.load(OUTPUT / f"{stage}-rules.npz") as stored:
        basic, corrected = stored[f"{key}-basic"], stored[f"{key}-corrected"]
    sheet = Image.new("RGB", (640, len(selected)*155+20), "white")
    draw = ImageDraw.Draw(sheet)
    for col, header in enumerate(("Input", "True defect", "Basic rule", "Corrected rule", "AI balanced 17")):
        draw.text((col*128+2, 2), header, fill="black")
    for row, i in enumerate(selected):
        draw.text((2, row*155+25), f"{meta[i]['id']} / {meta[i]['kind']}", fill="black")
        for col, region in enumerate((np.zeros((128, 128), dtype=bool), arrays["truth"][i].astype(bool), basic[i], corrected[i], ai_masks[i])):
            pixels = np.repeat(arrays["images"][i, :, :, None], 3, axis=2)
            pixels[region] = (.4*pixels[region]+.6*np.array([230, 60, 30])).astype(np.uint8)
            sheet.paste(Image.fromarray(pixels), (col*128, row*155+45))
    sheet.save(OUTPUT / f"{stage}-preview.png")


def report():
    stages = {}
    for stage in ("background", "final"):
        names = ["rules", *(f"{recipe}-{seed}" for recipe in RECIPES for seed in SEEDS)]
        rows = {name: record(f"{stage}-{name}") for name in names if (OUTPUT / f"{stage}-{name}.json").exists()}
        stages[stage] = rows
        if not rows:
            continue
        if stage == "final" and not (OUTPUT / "final-opened.json").exists():
            raise ValueError("Final results exist without an opening ledger")
        for key in rows["rules"]["conditions"]:
            if stage == "background":
                with np.load(OUTPUT / f"swap{key}.npz") as cache:
                    arrays = {k: cache[k] for k in cache.files}
                meta = json.loads((OUTPUT / f"swap{key}-metadata.json").read_text())
            else:
                arrays, meta = load("final")
                arrays = {**arrays, "images": lighting(arrays["images"], float(key))}
            pixel_hash = digest(arrays["images"])
            with np.load(OUTPUT / f"{stage}-rules.npz") as cached:
                rule_masks = {name: cached[f"{key}-{name}"] for name in ("basic", "corrected")}
            for name, mask in rule_masks.items():
                assert summary(mask, arrays, meta) == rows["rules"]["conditions"][key][name]
            for name, row in rows.items():
                assert row["conditions"][key]["pixelsSha256"] == pixel_hash
                if name == "rules":
                    continue
                with np.load(OUTPUT / f"{stage}-{name}.npz") as cached:
                    mask = cached[key]
                calculated = summary(mask, arrays, meta)
                for field, value in calculated.items():
                    assert row["conditions"][key][field] == value
                for rule_name, rule_mask in rule_masks.items():
                    assert summary(mask | rule_mask, arrays, meta) == row["conditions"][key]["orCombination"][rule_name]
        preview(stage, rows)
    opened = (OUTPUT / "final-opened.json").exists()
    complete = len(stages["final"]) == 13
    final_passed = complete and stages["final"]["rules"]["passed"] and all(
        stages["final"][f"balanced-{seed}"]["passed"] for seed in SEEDS) and all(
        row["conversion"]["passed"] for name, row in stages["final"].items() if name != "rules")
    result = {"protocolSha256": sha(PROTOCOL), "stages": stages, "finalOpened": opened,
              "finalComplete": complete, "finalPrimaryCriteriaPassed": final_passed,
              "cachedMaskChecksPassed": True, "browserValidation": "not-run"}
    if opened:
        result["openingLedger"] = json.loads((OUTPUT / "final-opened.json").read_text())
        if result["openingLedger"]["lockSha256"] != sha(OUTPUT / "freeze.json"):
            raise ValueError("Opening ledger / lock mismatch")
    if (OUTPUT / "freeze.json").exists():
        result["freeze"] = record("freeze")
    (ROOT / "docs/ai-visual-inspection-v2-holdout-experiment.json").write_text(json.dumps(result, indent=2)+"\n")
    lines = ["# AI外観検査 v2：背景交換と最終評価", "", "実測日: 2026-09-22。[固定条件](./ai-visual-inspection-v2-holdout-protocol.md)、[全数値・ハッシュ・固定記録](./ai-visual-inspection-v2-holdout-experiment.json)。", "",
             f"最終群の開封: {opened}。ルール2方式と12モデルの最終記録完了: {complete}。事前の主要条件の通過: {final_passed}。",
             "", "背景交換は開発群内の次の基板・2つ先の基板へ背景だけを循環置換。欠陥・撮影倍率・撮影ノイズを保ち、元背景での再描画600枚は既存画像と完全一致した。背景ノイズは背景とともに移る。2置換は同じ欠陥を使うため、独立した1,200件ではない。", ""]
    for stage, rows in stages.items():
        lines += [f"## {'背景交換' if stage == 'background' else '最終評価'}", "",
                  "| 方式 | シード | 条件 | 見逃し／300 | 過検出／300 | 汚れIoU | 傷IoU |",
                  "| --- | ---: | --- | ---: | ---: | ---: | ---: |"]
        for name, row in rows.items():
            for key, c in row["conditions"].items():
                entries = [(r, c[r]) for r in ("basic", "corrected")] if name == "rules" else [(name, c)]
                for label, values in entries:
                    m = values["all"]
                    lines.append(f"| {label} | {row.get('seed') or '—'} | {key} | {m['missed']} | {m['rejected']} | {values['kind']['dirt']['defectMeanIoU']:.3f} | {values['kind']['scratch']['defectMeanIoU']:.3f} |")
        lines.append("")
    if complete:
        simple = stages["final"]["rules"]["conditions"]["1.0"]["basic"]["simple"]
        lines += [f"最終群の単純な汚れ: 基本ルールは見逃し {simple['missed']}/{simple['bad']}、過検出 {simple['rejected']}/{simple['good']}。", "",
                  "## 最終群での学習構成の差", "", "同じシードの基準との差。全て倍率1.0。", "",
                  "| 構成 | シード | 見逃し差 | 過検出差 | 傷IoU差 |", "| --- | ---: | ---: | ---: | ---: |"]
        for recipe in RECIPES[1:]:
            for seed in SEEDS:
                b = stages["final"][f"balanced-{seed}"]["conditions"]["1.0"]
                v = stages["final"][f"{recipe}-{seed}"]["conditions"]["1.0"]
                lines.append(f"| {recipe} | {seed} | {v['all']['missed']-b['all']['missed']:+d} | {v['all']['rejected']-b['all']['rejected']:+d} | {v['kind']['scratch']['defectMeanIoU']-b['kind']['scratch']['defectMeanIoU']:+.3f} |")
        lines += ["", "## 最終群の併用（基準17）", "", "| 明るさ | ルール | 見逃し／300 | 過検出／300 |", "| ---: | --- | ---: | ---: |"]
        for key, c in stages["final"]["balanced-17"]["conditions"].items():
            for name, combined in c["orCombination"].items():
                lines.append(f"| {key} | {name} | {combined['all']['missed']} | {combined['all']['rejected']} |")
    lines += ["", "## 解釈と今後の扱い", "", "基本112・補正8、AI0.5、面積12、16エポック重みを変更していない。背景点検は任意の背景への保証ではない。明るさ・偏りモデルの悪化、改善、不変は全て残し、都合のよい条件を選ばない。最終600枚も150基板×4画像であり、各シードは同じ画像を使う。", "",
              "開封後の最終群を再び未使用扱いにしない。この結果を根拠にモデル・生成器・検査設定を開発変更する場合は、この群を開発用へ移し、新たな独立評価群を用意する。しきい値探索は行っていない。候補シードは事前指定の17のまま。", "",
              "検証通過は教育用合成画像での限定した技術確認であり、実工場の性能保証・公開承認ではない。Worker/WASM、ブラウザの前処理・推論照合、初回転送量、端末性能、UI、人による試用は未実施。推論時間は2モデルを並行実行したネイティブCPUの参考値。", "",
              "実行: `holdout_v2.py prepare`、`background rules` と12モデル、通過後に `freeze`、`final rules` と12モデル、`report_holdout_v2.py`。各評価コマンド175秒上限。", ""]
    (ROOT / "docs/ai-visual-inspection-v2-holdout-validation.md").write_text("\n".join(lines))
    print(json.dumps({"backgroundRecords": len(stages['background']), "finalOpened": opened, "finalComplete": complete, "finalPrimaryCriteriaPassed": final_passed}))


if __name__ == "__main__":
    report()
