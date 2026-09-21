"""Report cached lighting results, curves and actual OR combinations."""
import json

import numpy as np
from PIL import Image, ImageDraw

from lighting_v2 import OUTPUT, PROTOCOL, GAINS, RECIPES, SEEDS, load, lighting, summary
from data import ROOT, digest
from followup_v2 import sha


def read(name):
    row = json.loads((OUTPUT / f"{name}.json").read_text())
    if row.get("incomplete") or row["protocolSha256"] != sha(PROTOCOL):
        raise ValueError(f"Incomplete or changed conditions: {name}")
    return row


def preview(arrays, metadata):
    ids = [next(i for i, m in enumerate(metadata) if m["kind"] == kind and m["texture"] == texture)
           for kind, texture in (("dirt", "flat"), ("good", "lines"), ("scratch", "lines"))]
    sheet = Image.new("RGB", (640, len(ids)*len(GAINS)*155+20), "white")
    draw = ImageDraw.Draw(sheet)
    for col, header in enumerate(("Input", "True defect", "Basic rule", "Corrected rule", "AI balanced 17")):
        draw.text((128*col+2, 2), header, fill="black")
    for index, (i, gain) in enumerate((i, gain) for i in ids for gain in GAINS):
        draw.text((2, index*155+25), f"{metadata[i]['id']} / {metadata[i]['kind']} / brightness {gain}", fill="black")
        regions = [np.zeros((128, 128), dtype=bool), arrays["truth"][i].astype(bool)]
        for name in ("basic", "corrected", "balanced-17"):
            with np.load(OUTPUT / f"{name}-masks.npz") as cache:
                regions.append(cache[str(gain)][i])
        for col, region in enumerate(regions):
            pixels = np.repeat(lighting(arrays["images"][i], gain)[:, :, None], 3, axis=2)
            pixels[region] = (.4*pixels[region]+.6*np.array([230, 60, 30])).astype(np.uint8)
            sheet.paste(Image.fromarray(pixels), (128*col, index*155+45))
    sheet.save(OUTPUT / "preview.png")


def report():
    rules = read("rules")
    models = {f"{recipe}-{seed}": read(f"{recipe}-{seed}") for recipe in RECIPES for seed in SEEDS}
    arrays, metadata = load("development")
    # Recompute each recorded condition from cached masks and verify same input pixels.
    for gain in GAINS:
        key = str(gain)
        pixel_hash = digest(lighting(arrays["images"], gain))
        rule_masks = {}
        for name in ("basic", "corrected"):
            with np.load(OUTPUT / f"{name}-masks.npz") as cache:
                rule_masks[name] = cache[key]
            expected = rules[name]["conditions"][key]
            assert expected["pixelsSha256"] == pixel_hash
            assert summary(rule_masks[name], arrays, metadata)["all"] == expected["all"]
        for name, model in models.items():
            assert model["manifestSha256"] == rules["manifestSha256"]
            with np.load(OUTPUT / f"{name}-masks.npz") as cache:
                masks = cache[key]
            expected = model["conditions"][key]
            assert expected["pixelsSha256"] == pixel_hash
            assert summary(masks, arrays, metadata)["all"] == expected["all"]
            for rule_name in rule_masks:
                combined = summary(masks | rule_masks[rule_name], arrays, metadata)["all"]
                assert combined == model["orCombination"][rule_name][key]["all"]
                assert combined["missed"] <= min(expected["all"]["missed"], rules[rule_name]["conditions"][key]["all"]["missed"])
                assert combined["rejected"] >= max(expected["all"]["rejected"], rules[rule_name]["conditions"][key]["all"]["rejected"])
    result = {"protocolSha256": sha(PROTOCOL), "rules": rules, "models": models,
              "imageIds": [m["id"] for m in metadata], "integrityChecksPassed": True,
              "finalEvaluation": "not-run", "browserValidation": "not-run"}
    (ROOT / "docs/ai-visual-inspection-v2-lighting-experiment.json").write_text(json.dumps(result, indent=2)+"\n")
    simple = rules["basic"]["conditions"]["1.0"]["simple"]
    lines = ["# AI外観検査 v2：ルールと明るさの比較", "", "実測日: 2026-09-22。[固定条件](./ai-visual-inspection-v2-lighting-protocol.md)・[全数値、種類別・模様別結果、しきい値曲線、変化画像ID](./ai-visual-inspection-v2-lighting-experiment.json)。", "",
        f"単純な汚れ（平坦面・傷以外）: 基本ルールは見逃し {simple['missed']}/{simple['bad']}、過検出 {simple['rejected']}/{simple['good']}、領域IoU {simple['defectMeanIoU']:.3f}。事前基準の通過: {rules['simpleRulePassed']}。",
        "", f"調整400枚・倍率1.0で選んだしきい値は基本 {rules['basic']['threshold']}、局所平均との差を使う補正ルール {rules['corrected']['threshold']}。見逃し率＋過検出率を等重みで最小化し、同点なら過検出率、数値の小さいしきい値の順で選択。AIは既存の0.5、全方式の面積は12で固定。開発結果から選び直していない。", "",
        "以下は同じ開発600枚（不良300・良品300）。倍率は画素へ実際に適用し、両方式で画素ハッシュが一致することを確認した。確認済みの150基板×4画像であり、未知データの性能ではない。", "",
        "| 倍率 | 方式 | 見逃し／300 | 過検出／300 | 不良の領域IoU |",
        "| ---: | --- | ---: | ---: | ---: |"]
    for gain in GAINS:
        for label, row in (("基本ルール", rules["basic"]), ("補正ルール", rules["corrected"]), ("AI 基準17", models["balanced-17"])):
            m = row["conditions"][str(gain)]["all"]
            lines.append(f"| {gain} | {label} | {m['missed']} | {m['rejected']} | {m['defectMeanIoU']:.3f} |")
    lines += ["", "## AIの全構成・全シード", "", "| 構成 | シード | 倍率 | 見逃し／300 | 過検出／300 | 傷IoU | 判定変化枚数 |",
              "| --- | ---: | ---: | ---: | ---: | ---: | ---: |"]
    for row in models.values():
        for gain in GAINS:
            c = row["conditions"][str(gain)]
            lines.append(f"| {row['recipe']} | {row['seed']} | {gain} | {c['all']['missed']} | {c['all']['rejected']} | {c['kind']['scratch']['defectMeanIoU']:.3f} | {len(c['changedImageIds'])} |")
    lines += ["", "変化枚数は倍率1.0との比較。モデル再学習は行っていない。倍率1.0のスコアのみハッシュ照合後に再利用し、0.7と1.3は再推論した。全しきい値曲線はJSONに保存し、設定選び直しには使用していない。", "",
              "## 通常の明るさでのしきい値曲線", "", "ルール2方式と表示候補のAI基準17について全候補を示す。方式間でしきい値の数値の意味は異なる。開発群での探索表示であり、ここから選んだ設定を未知データ性能とは呼ばない。", "",
              "| 方式 | しきい値 | 見逃し／300 | 過検出／300 |",
              "| --- | ---: | ---: | ---: |"]
    for label, row in (("基本ルール", rules["basic"]), ("補正ルール", rules["corrected"]), ("AI基準17", models["balanced-17"])):
        for c in row["thresholdCurve"]:
            lines.append(f"| {label} | {c['threshold']} | {c['missed']} | {c['rejected']} |")
    lines += ["",
              "## どちらかが不良なら止める併用（基準17）", "", "| 倍率 | 併用するルール | 見逃し／300 | 過検出／300 |",
              "| ---: | --- | ---: | ---: |"]
    for gain in GAINS:
        for rule_name in ("basic", "corrected"):
            c = models["balanced-17"]["orCombination"][rule_name][str(gain)]["all"]
            lines.append(f"| {gain} | {rule_name} | {c['missed']} | {c['rejected']} |")
    lines += ["", "全12モデル・3倍率の併用は実領域の和集合から集計。各方式単独より見逃しが増えず、過検出が減らない関係も照合した。常に併用が最善という意味ではない。", "",
              "## 解釈と残る確認", "", "比較対象はこの二つの簡易ルールと特定の合成画像AI。局所補正でも正常模様を拾う場合があり、これをルールベース全体の限界とは呼ばない。位置合わせ・形状処理などの余地がある。明るさ倍率だけの検証を、照明むら・反射・ピント・カメラ等を含む全撮像条件への保証に拡張しない。クリップによって欠陥情報が薄れる画像でも、評価の正解は変更していない。", "",
              "背景交換、最終600枚、Worker/WASM、ブラウザでの前処理照合、実端末性能、人による試用、UI・公開は未実施。JSONの推論時間は2モデルを並行実行したネイティブCPUの参考値で、単独実行やブラウザの性能ではない。", "",
              "実行: `lighting_v2.py rules`、`lighting_v2.py <recipe> <seed>` を12条件、`report_lighting_v2.py`。各コマンド175秒上限。", ""]
    (ROOT / "docs/ai-visual-inspection-v2-lighting-validation.md").write_text("\n".join(lines))
    preview(arrays, metadata)
    print(json.dumps({"simpleRulePassed": rules["simpleRulePassed"], "models": len(models), "integrityChecksPassed": True}))


if __name__ == "__main__":
    report()
