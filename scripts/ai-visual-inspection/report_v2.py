"""Inspect the fixed tiny-fit artifact; no further fitting or threshold tuning."""
import hashlib
import json
import signal

import numpy as np
import onnxruntime as ort
import torch
from PIL import Image, ImageDraw

from data import ROOT
from data_v2 import CACHE, load
from model import TinyUNet, InferenceModel
from processing import ai, metrics


def report():
    record = json.loads((CACHE / "tiny.json").read_text())
    arrays, metadata = load("train")
    arrays, metadata = {k: v[:48] for k, v in arrays.items()}, metadata[:48]
    path = CACHE / "models/tiny-17.onnx"
    options = ort.SessionOptions()
    options.intra_op_num_threads = 1
    options.inter_op_num_threads = 1
    session = ort.InferenceSession(str(path), options, providers=["CPUExecutionProvider"])
    scores = np.stack([session.run(["scores"], {"pixels": image.astype(np.float32)[None, None]/255})[0][0, 0]
                       for image in arrays["images"]])
    torch.set_num_threads(2)
    network = TinyUNet()
    network.load_state_dict(torch.load(CACHE / "models/tiny-17.pt", weights_only=True))
    model = InferenceModel(network.eval())
    with torch.no_grad():
        reference = model(torch.from_numpy(arrays["images"][:, None].copy()).float()/255).numpy()[:, 0]
    maximum_error = float(np.max(np.abs(reference-scores)))
    assert maximum_error < 1e-5, maximum_error
    masks = np.stack([ai(s, .5, 12) for s in scores])
    assert all(np.array_equal(ai(a, .5, 12), b) for a, b in zip(reference, masks))
    counts = metrics(masks, arrays["truth"], arrays["labels"])
    error_ids, image_records = [], []
    for i, (prediction, truth, meta) in enumerate(zip(masks, arrays["truth"], metadata)):
        union = np.logical_or(prediction, truth).sum()
        intersection = np.logical_and(prediction, truth).sum()
        wrong = bool(prediction.any()) != bool(truth.any())
        if wrong:
            error_ids.append(i)
        image_records.append({"id": meta["id"], "kind": meta["kind"], "texture": meta["texture"],
                              "incorrectImageDecision": wrong, "predictedPixels": int(prediction.sum()),
                              "truthPixels": int(truth.sum()), "iou": float(intersection/union) if union else None})
    # Show every image in a contact sheet. Preview: all decision errors, then
    # first dirt and scratch images. Selection is labelled as error inspection.
    preview = list(dict.fromkeys(error_ids + [2, 3]))
    for filename, indices in (("tiny-all.png", list(range(48))), ("tiny-errors.png", preview)):
        sheet = Image.new("RGB", (128*3, 150*len(indices)), "white")
        draw = ImageDraw.Draw(sheet)
        for row, index in enumerate(indices):
            for col, mask in enumerate((np.zeros((128, 128), dtype=bool), arrays["truth"][index].astype(bool), masks[index])):
                rgb = np.repeat(arrays["images"][index, :, :, None], 3, axis=2)
                rgb[mask] = (.4*rgb[mask]+.6*np.array([230, 60, 30])).astype(np.uint8)
                sheet.paste(Image.fromarray(rgb), (col*128, row*150+22))
                draw.text((col*128+2, row*150+3), (metadata[index]["id"].replace("v2-train-", ""), "Truth", "AI")[col], fill="black")
        sheet.save(CACHE / filename)
    protocol = ROOT / "docs/ai-visual-inspection-v2-protocol.md"
    evidence = {"version": "synthetic-board-v2", "date": "2026-09-21",
                "audit": json.loads((CACHE / "audit.json").read_text()),
                "manifest": json.loads((CACHE / "manifest.json").read_text()),
                "tiny": record, "onnxReference": {"samples": 48, "maxAbsoluteDifference": maximum_error, "masksMatch": True},
                "imageRecords": image_records, "baseline": "not-run: tiny gate not passed",
                "developmentInference": "not-run", "finalInference": "not-run",
                "modelSha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                "protocolSha256": hashlib.sha256(protocol.read_bytes()).hexdigest()}
    (ROOT / "docs/ai-visual-inspection-v2-experiment.json").write_text(json.dumps(evidence, indent=2)+"\n")
    lines = ["# AI外観検査 v2：少数画像での学習確認", "", "実施日: 2026-09-21", "",
             "**データ監査は通過。48枚での学習は改善したが、事前に定めた通過条件には未達。** 本学習、開発・最終評価、比較モデルの追加、UI実装は行っていない。", "",
             "## 修正内容", "", "- 良品・不良品に同一基板の明るさ倍率を共通適用し、撮影ノイズも同じ分布にした。",
             "- 模様不足は良品だけを変更し、不良画像・正解マスクを固定。誤ラベルは画像を変更せず学習マスクだけ変更した。",
             "- 損失を画像ごとのDice平均に変更し、汚れ・傷を領域合計だけでまとめない。モデル構造はv1と同じ。",
             "- 合格基準・最大更新回数・次段階へ進む条件を[プロトコル](./ai-visual-inspection-v2-protocol.md)で事前に固定した。", "",
             "## 学習経過", "", "評価対象は学習に使った48枚（良品24、汚れ12、傷12）。未知画像への精度ではない。", "",
             "| 更新回数 | 汚れIoU | 傷IoU | 見逃し／24 | 過検出／24 |", "| --- | --- | --- | --- | --- |"]
    for row in record["history"]:
        m = row["metrics"]
        lines.append(f'| {row["updates"]} | {m["dirt"]["defectMeanIoU"]:.3f} | {m["scratch"]["defectMeanIoU"]:.3f} | {m["all"]["missed"]} | {m["all"]["rejected"]} |')
    lines += ["", "通過には、汚れ・傷のIoU各0.70以上、各欠陥の見逃し率5%以下、良品過検出率5%以下を2回連続で満たす必要がある。最後の傷IoUは0.690で、良品過検出率は8.3%。320更新の上限で終了し、結果を見て回数追加・基準緩和はしていない。", "",
              "320更新は今回固定した実験予算であり、学習の収束を示すものではない。傷のIoUは最終区間でも上がっており、追加学習の余地はあるが、改善や未知画像への性能は未確認。v1の600枚での評価と、この48枚の学習内評価は直接比較できない。", "",
              "## 誤判定と正しさ", "", f'良否の誤判定画像: {", ".join(metadata[i]["id"] for i in error_ids)}。画素単位の一致と画像単位の合否を区別して記録。', "",
              "誤検出2枚は同じ基板0002の別撮影で、正常な縞模様を欠陥と判定している。独立した2種類の模様で失敗したという意味ではない。比較画像でも、傷を捉えた例と正常模様の誤検出の両方を確認した。全48枚の集計を維持し、この例だけから性能を一般化しない。", "",
              f'PyTorchとONNXを48枚で照合し、最大スコア差は{maximum_error:.3g}、後処理したマスクは全件一致。Pythonの生成・損失・判定境界の4テストは通過。', "",
              "学習・調整・開発・最終の完全一致・元基板／背景／形状テンプレート重複は検出されなかった。縮小画像で似た無地面は残るため、実画像への一般化を主張しない。人による画像・ラベル確認、ブラウザ推論・実端末性能は未実施。", "",
              "## 保存先・実行", "", "全数値は[実験記録](./ai-visual-inspection-v2-experiment.json)。モデルと全48枚の比較画像は `.cache/ai-visual-inspection/v2/` に保存。v1の結果は変更していない。", "",
              "実行: `data_v2.py`、`test_v2.py`、`audit_v2.py`、`train_v2.py tiny`、`report_v2.py`（すべて `scripts/ai-visual-inspection/` 配下、一時Python環境を利用）。学習はMPSで約21秒、ONNXは477,448 bytes。TypeScriptは変更しておらず、typecheck・lint・build・ブラウザ・デプロイ・commit・pushは未実施。", ""]
    (ROOT / "docs/ai-visual-inspection-v2-validation.md").write_text("\n".join(lines))
    print(json.dumps({"counts": counts, "errors": [image_records[i] for i in error_ids], "maxScoreDifference": maximum_error}), flush=True)


if __name__ == "__main__":
    signal.alarm(175)
    report()
