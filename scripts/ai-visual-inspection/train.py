"""One independent experiment per command, hard timeout without partial export."""
import argparse
import json
import os
import signal
import time

import numpy as np
import torch
from torch.nn import functional as F

from data import CACHE, RECIPES, VERSION, load_data
from model import TinyUNet, InferenceModel

SEEDS = (17, 29, 43)
EPOCHS, BATCH = 4, 32


def train(recipe, seed):
    started = time.monotonic()
    gate_path = CACHE / "gate.json"
    if gate_path.exists() and json.loads(gate_path.read_text()).get("finalEvaluationOpened"):
        raise SystemExit("Final evaluation was opened. Retire/version the dataset before changing models.")
    torch.set_num_threads(4)
    torch.manual_seed(seed)
    np.random.seed(seed)
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    arrays, _ = load_data("train", recipe)
    x = torch.from_numpy(arrays["images"].copy()).unsqueeze(1).float().div(255)
    y = torch.from_numpy(arrays["masks"].copy()).unsqueeze(1).float()
    model = TinyUNet().to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=.002)
    history = []
    print(json.dumps({"recipe": recipe, "seed": seed, "device": device, "epochs": EPOCHS,
                      "parameters": sum(p.numel() for p in model.parameters())}), flush=True)
    for epoch in range(EPOCHS):
        permutation = torch.randperm(len(x))
        total = 0.0
        for indices in permutation.split(BATCH):
            inputs, target = x[indices].to(device), y[indices].to(device)
            optimizer.zero_grad(set_to_none=True)
            logits = model(inputs)
            probability = logits.sigmoid()
            bce = F.binary_cross_entropy_with_logits(logits, target, pos_weight=torch.tensor(12., device=device))
            dice = 1 - (2*(probability*target).sum() + 1) / (probability.sum()+target.sum()+1)
            loss = bce + dice
            if not torch.isfinite(loss):
                raise ValueError("Non-finite training loss; no model exported")
            loss.backward()
            optimizer.step()
            total += loss.item() * len(indices)
        history.append(total / len(x))
        print(json.dumps({"epoch": epoch+1, "loss": history[-1], "seconds": time.monotonic()-started}), flush=True)
    model = model.to("cpu").eval()
    name = f"{recipe}-{seed}"
    folder = CACHE / "models"
    folder.mkdir(exist_ok=True)
    target = folder / f"{name}.onnx"
    temporary = folder / f"{name}.partial.onnx"
    torch.onnx.export(InferenceModel(model), torch.zeros(1, 1, 128, 128), str(temporary),
                      input_names=["pixels"], output_names=["scores"], opset_version=17, dynamo=False)
    temporary.replace(target)
    torch.save(model.state_dict(), folder / f"{name}.pt")
    record = {"version": VERSION, "recipe": recipe, "seed": seed, "device": device,
              "epochs": EPOCHS, "batch": BATCH, "images": len(x), "loss": history,
              "seconds": time.monotonic()-started, "bytes": target.stat().st_size,
              "torch": torch.__version__, "learningRate": .002}
    (folder / f"{name}.json").write_text(json.dumps(record, indent=2) + "\n")
    print(json.dumps(record), flush=True)


def timeout(_signum, _frame):
    print("Training exceeded 175 seconds. Incomplete; do not retry with altered settings.", flush=True)
    os._exit(124)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("recipe", choices=RECIPES)
    parser.add_argument("seed", type=int, choices=SEEDS)
    args = parser.parse_args()
    signal.signal(signal.SIGALRM, timeout)
    signal.alarm(175)
    train(args.recipe, args.seed)
