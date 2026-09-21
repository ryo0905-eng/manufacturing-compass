"""Apply the identical baseline continuation to the nine other frozen models."""
import argparse
import os
import signal

from data import ROOT, RECIPES
from data_v2 import CACHE
from stability_v2 import SEEDS, read, persist, fit, development

OUTPUT = CACHE / "matched"
PROTOCOL = ROOT / "docs/ai-visual-inspection-v2-matched-protocol.md"


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", choices=("train", "development"))
    parser.add_argument("recipe", choices=RECIPES[1:])
    parser.add_argument("seed", type=int, choices=SEEDS)
    args = parser.parse_args()
    if not all(read(stage, seed).get("passed", False) for stage in ("train", "development") for seed in SEEDS):
        raise SystemExit("Baseline stability not confirmed")
    folder = OUTPUT / args.recipe
    folder.mkdir(parents=True, exist_ok=True)
    if (folder / f"{args.stage}-{args.seed}.json").exists():
        raise SystemExit("Refusing overwrite")
    def timeout(_sig, _frame):
        persist(args.stage, args.seed, {"passed": False, "incomplete": True, "reason": "175-second timeout"}, folder, PROTOCOL)
        os._exit(124)
    signal.signal(signal.SIGALRM, timeout)
    signal.alarm(175)
    action = fit if args.stage == "train" else development
    action(args.seed, args.recipe, folder, PROTOCOL)
